import test from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import os from "os";
import path from "path";

import {
  buildTransitionPlan,
  getMonthInTimezone,
  parseFrontmatter,
  readPublishedValue,
  resolveTargetPath,
  runTransition,
  shouldRunTransition,
  updatePublishedValue
} from "../scripts/monthly-publication-transition.js";

function createTempProject(files) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "monthly-transition-"));
  for (const [relativePath, content] of Object.entries(files)) {
    const absolute = path.join(tempDir, relativePath);
    fs.mkdirSync(path.dirname(absolute), { recursive: true });
    fs.writeFileSync(absolute, content, "utf8");
  }
  return tempDir;
}

test("shouldRunTransition returns true on day 1 in Europe/Berlin", () => {
  const date = new Date("2026-04-01T10:00:00.000Z");
  assert.equal(shouldRunTransition(date, "Europe/Berlin"), true);
});

test("shouldRunTransition returns false outside day 1", () => {
  const date = new Date("2026-04-02T10:00:00.000Z");
  assert.equal(shouldRunTransition(date, "Europe/Berlin"), false);
});

test("getMonthInTimezone resolves month deterministically", () => {
  const date = new Date("2026-05-01T00:00:00.000Z");
  assert.equal(getMonthInTimezone(date, "Europe/Berlin"), 5);
});

test("resolveTargetPath fails when mapping is missing", () => {
  assert.throws(() => resolveTargetPath({ "1": "posts/01.md" }, 2), /No month-to-page mapping/);
});

test("updatePublishedValue changes existing published field", () => {
  const content = `---\ntitle: "X"\npublished: false\n---\n\nBody`;
  const next = updatePublishedValue(content, true);
  assert.equal(readPublishedValue(next), true);
});

test("buildTransitionPlan enforces a single active page", () => {
  const states = [
    { path: "posts/04-april.md", published: true },
    { path: "posts/05-mai.md", published: false }
  ];
  const plan = buildTransitionPlan(states, "posts/05-mai.md");
  assert.equal(plan.updates.length, 2);
  assert.equal(plan.activated, "posts/05-mai.md");
  assert.deepEqual(plan.deactivated, ["posts/04-april.md"]);
});

test("runTransition performs idempotent dry-run on same day", () => {
  const projectDir = createTempProject({
    "monthly-publication.config.json": JSON.stringify({
      timezone: "Europe/Berlin",
      months: {
        "4": "posts/04-april.md"
      }
    }, null, 2),
    "posts/04-april.md": `---\ntitle: "April"\npublished: true\n---\n\nApril content`
  });

  try {
    const now = new Date("2026-04-01T08:00:00.000Z");
    const first = runTransition({
      now,
      dryRun: true,
      force: false,
      configPath: "monthly-publication.config.json",
      baseDir: projectDir
    });
    const second = runTransition({
      now,
      dryRun: true,
      force: false,
      configPath: "monthly-publication.config.json",
      baseDir: projectDir
    });
    assert.equal(first.status, "success");
    assert.equal(second.status, "success");
    assert.equal(first.updates.length, 0);
    assert.equal(second.updates.length, 0);
  } finally {
    fs.rmSync(projectDir, { recursive: true, force: true });
  }
});

test("parseFrontmatter throws on missing frontmatter", () => {
  assert.throws(() => parseFrontmatter("plain text"), /Missing YAML frontmatter/);
});
