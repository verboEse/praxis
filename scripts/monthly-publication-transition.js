import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

export const DEFAULT_CONFIG_PATH = "monthly-publication.config.json";

function getFlagValue(argv, name, fallback = null) {
  const exact = `--${name}`;
  const withEq = argv.find((arg) => arg.startsWith(`${exact}=`));
  if (withEq) return withEq.slice(exact.length + 1);

  const index = argv.indexOf(exact);
  if (index >= 0 && index < argv.length - 1) {
    return argv[index + 1];
  }

  return fallback;
}

function hasFlag(argv, name) {
  return argv.includes(`--${name}`);
}

export function shouldRunTransition(date, timezone) {
  const day = Number(new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    day: "numeric"
  }).format(date));
  return day === 1;
}

export function getMonthInTimezone(date, timezone) {
  return Number(new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    month: "numeric"
  }).format(date));
}

export function parseFrontmatter(content) {
  const match = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n?/);
  if (!match) {
    throw new Error("Missing YAML frontmatter");
  }

  return {
    frontmatter: match[1],
    body: content.slice(match[0].length),
    matchedBlock: match[0]
  };
}

export function readPublishedValue(content) {
  const { frontmatter } = parseFrontmatter(content);
  const publishedMatch = frontmatter.match(/^published:\s*(true|false)\s*$/m);
  if (!publishedMatch) {
    return null;
  }

  return publishedMatch[1] === "true";
}

export function updatePublishedValue(content, nextPublished) {
  const { frontmatter, body } = parseFrontmatter(content);
  const value = nextPublished ? "true" : "false";
  let nextFrontmatter;

  if (/^published:\s*(true|false)\s*$/m.test(frontmatter)) {
    nextFrontmatter = frontmatter.replace(/^published:\s*(true|false)\s*$/m, `published: ${value}`);
  } else {
    nextFrontmatter = `${frontmatter}\npublished: ${value}`;
  }

  return `---\n${nextFrontmatter}\n---\n\n${body}`;
}

export function resolveTargetPath(mapping, month) {
  const key = String(month);
  const target = mapping[key];
  if (!target) {
    throw new Error(`No month-to-page mapping configured for month ${month}`);
  }
  return target;
}

function unique(values) {
  return [...new Set(values)];
}

export function buildTransitionPlan(fileStates, targetPath) {
  const updates = [];
  const deactivated = [];
  let activated = null;

  for (const state of fileStates) {
    const desired = state.path === targetPath;
    if (state.published !== desired) {
      updates.push({ path: state.path, from: state.published, to: desired });
      if (desired) {
        activated = state.path;
      } else if (state.published === true) {
        deactivated.push(state.path);
      }
    }
  }

  const activeAfter = fileStates
    .map((state) => (state.path === targetPath ? true : false))
    .filter(Boolean).length;

  if (activeAfter !== 1) {
    throw new Error("Transition plan must result in exactly one active monthly page");
  }

  return {
    updates,
    activated,
    deactivated: unique(deactivated)
  };
}

function loadConfig(configPath, baseDir) {
  const absolutePath = path.resolve(baseDir, configPath);
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Config file not found: ${absolutePath}`);
  }

  const config = JSON.parse(fs.readFileSync(absolutePath, "utf8"));
  if (!config.timezone) {
    throw new Error("Config requires a timezone field");
  }
  if (!config.months || typeof config.months !== "object") {
    throw new Error("Config requires a months mapping object");
  }

  return { config, absolutePath };
}

function collectStates(mapping, baseDir) {
  const mappedPaths = unique(Object.values(mapping));
  return mappedPaths.map((relativePath) => {
    const absolutePath = path.resolve(baseDir, relativePath);
    if (!fs.existsSync(absolutePath)) {
      throw new Error(`Mapped page file does not exist: ${relativePath}`);
    }

    const content = fs.readFileSync(absolutePath, "utf8");
    const published = readPublishedValue(content);

    return {
      path: relativePath,
      absolutePath,
      content,
      published
    };
  });
}

function writeUpdates(statesByPath, updates, dryRun) {
  for (const update of updates) {
    const state = statesByPath.get(update.path);
    const nextContent = updatePublishedValue(state.content, update.to);
    if (!dryRun) {
      fs.writeFileSync(state.absolutePath, nextContent, "utf8");
    }
  }
}

function log(event) {
  console.log(JSON.stringify(event));
}

export function runTransition({
  configPath = DEFAULT_CONFIG_PATH,
  dryRun = false,
  now = new Date(),
  force = false,
  baseDir = projectRoot
} = {}) {
  let stage = "load-config";
  try {
    const { config } = loadConfig(configPath, baseDir);
    const timezone = config.timezone;
    const targetMonth = getMonthInTimezone(now, timezone);

    stage = "date-gate";
    if (!force && !shouldRunTransition(now, timezone)) {
      throw new Error(`Transition is allowed only on day 1 in timezone ${timezone}. Use --force to override.`);
    }

    stage = "resolve-target";
    const targetPath = resolveTargetPath(config.months, targetMonth);

    stage = "collect-states";
    const states = collectStates(config.months, baseDir);
    const statesByPath = new Map(states.map((s) => [s.path, s]));

    stage = "plan-transition";
    const plan = buildTransitionPlan(states, targetPath);

    stage = "apply-transition";
    writeUpdates(statesByPath, plan.updates, dryRun);

    log({
      level: "info",
      event: "monthly-publication-transition",
      status: "success",
      runDate: now.toISOString(),
      timezone,
      targetMonth,
      targetPage: targetPath,
      activatedPage: plan.activated,
      deactivatedPages: plan.deactivated,
      updatedFiles: plan.updates.length,
      dryRun
    });

    return {
      status: "success",
      targetMonth,
      targetPage: targetPath,
      updates: plan.updates,
      dryRun
    };
  } catch (error) {
    log({
      level: "error",
      event: "monthly-publication-transition",
      status: "failure",
      step: stage,
      reason: error.message
    });
    throw error;
  }
}

function parseCliArgs(argv) {
  const configPath = getFlagValue(argv, "config", DEFAULT_CONFIG_PATH);
  const dryRun = hasFlag(argv, "dry-run");
  const force = hasFlag(argv, "force");
  const dateOverride = getFlagValue(argv, "date");

  let now = new Date();
  if (dateOverride) {
    now = new Date(dateOverride);
    if (Number.isNaN(now.getTime())) {
      throw new Error(`Invalid --date value: ${dateOverride}`);
    }
  }

  return { configPath, dryRun, force, now };
}

function isCliRun() {
  return process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
}

if (isCliRun()) {
  try {
    const options = parseCliArgs(process.argv.slice(2));
    runTransition(options);
    process.exitCode = 0;
  } catch {
    process.exitCode = 1;
  }
}
