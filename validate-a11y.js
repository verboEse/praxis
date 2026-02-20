/**
 * Accessibility Validator for Eleventy builds
 * Ensures aria-hidden elements are not focusable and don't contain focusable elements
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE_DIR = path.join(__dirname, '_site');

const FOCUSABLE_ELEMENTS = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'textarea:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
];

const FOCUSABLE_SELECTOR = FOCUSABLE_ELEMENTS.join(',');

/**
 * Simple HTML parser to find aria-hidden elements and check for focusable descendants
 */
function parseHtml(html, filePath) {
  const errors = [];

  // Regex to find aria-hidden elements
  const ariaHiddenRegex = /(.*?)<(\w+)[^>]*\baria-hidden\s*=\s*["']true["'][^>]*>([\s\S]*?)<\/\2>(.*?)/gi;

  let match;
  let lineNum = 1;

  // Count lines to track position
  const countLines = (str) => str.split('\n').length;

  let searchStr = html;
  let offset = 0;

  while ((match = ariaHiddenRegex.exec(html)) !== null) {
    const fullMatch = match[0];
    const element = match[2];
    const content = match[3];
    const startPos = match.index;

    // Count lines up to this point
    const linesBefore = html.substring(0, startPos).split('\n').length;

    // Check if element itself is focusable
    const isSelfFocusable = /\b(a|button|input|textarea|select)\b/.test(element) ||
      /\btabindex\s*=/.test(match[0]);

    if (isSelfFocusable) {
      errors.push({
        type: 'FOCUSABLE_ARIA_HIDDEN_ELEMENT',
        message: `aria-hidden="${element.toUpperCase()}" element is focusable (line ${linesBefore})`,
        file: filePath,
        line: linesBefore,
        severity: 'error',
      });
    }

    // Check for focusable descendants
    const focusableDescendants = [
      { pattern: /<a[^>]+href/gi, name: 'anchor' },
      { pattern: /<button(?!\s+disabled)/gi, name: 'button' },
      { pattern: /<input(?!\s+disabled)/gi, name: 'input' },
      { pattern: /<textarea(?!\s+disabled)/gi, name: 'textarea' },
      { pattern: /<select(?!\s+disabled)/gi, name: 'select' },
      { pattern: /\btabindex\s*=\s*["']?\d+["']?/gi, name: 'tabindex' },
    ];

    for (const { pattern, name } of focusableDescendants) {
      if (pattern.test(content)) {
        errors.push({
          type: 'FOCUSABLE_DESCENDANT_IN_ARIA_HIDDEN',
          message: `aria-hidden element contains focusable ${name} descendant (line ${linesBefore})`,
          file: filePath,
          line: linesBefore,
          severity: 'error',
        });
      }
    }
  }

  return errors;
}

/**
 * Recursively validate all HTML files in the site directory
 */
function validateDirectory(dir) {
  const allErrors = [];

  const files = fs.readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(dir, file.name);

    if (file.isDirectory()) {
      allErrors.push(...validateDirectory(fullPath));
    } else if (file.name.endsWith('.html')) {
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        const relativePath = path.relative(SITE_DIR, fullPath);
        const errors = parseHtml(content, relativePath);
        allErrors.push(...errors);
      } catch (err) {
        console.error(`Error reading file ${fullPath}:`, err.message);
      }
    }
  }

  return allErrors;
}

/**
 * Main validation function
 */
function main() {
  if (!fs.existsSync(SITE_DIR)) {
    console.error(`Error: Build directory not found at ${SITE_DIR}`);
    console.error('Please run: npm run build');
    process.exit(1);
  }

  console.log('🔍 Validating accessibility (aria-hidden elements)...\n');

  const errors = validateDirectory(SITE_DIR);

  if (errors.length === 0) {
    console.log('✅ All aria-hidden elements are properly configured!\n');
    process.exit(0);
  }

  console.log(`❌ Found ${errors.length} accessibility issue(s):\n`);

  for (const error of errors) {
    console.log(`  ${error.file}:${error.line}`);
    console.log(`  └─ [${error.type}] ${error.message}\n`);
  }

  process.exit(1);
}

main();
