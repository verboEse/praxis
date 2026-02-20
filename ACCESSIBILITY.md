# Accessibility Guidelines - aria-hidden Elements

## Rules

This project enforces the following accessibility rules:

### 1. Every Page Must Have a Main Landmark

Each page must contain exactly one `<main>` element (or element with `role="main"`) to identify the primary content area. This helps screen reader users quickly navigate to the main content.

**✅ Good:**
```html
<body>
  <header><!-- Navigation --></header>
  <main class="main-content">
    <!-- Primary page content goes here -->
  </main>
  <aside><!-- Sidebar --></aside>
  <footer><!-- Footer --></footer>
</body>
```

**❌ Bad:**
```html
<body>
  <header><!-- Navigation --></header>
  <div class="content">
    <!-- Page content without main landmark -->
  </div>
  <footer><!-- Footer --></footer>
</body>
```

**Note:** All templates in this project (`base.njk`, `page.njk`, `post.njk`, `index.njk`) already include the `<main>` landmark.

### 2. aria-hidden Elements Must NOT Be Focusable

Elements with `aria-hidden="true"` should never receive keyboard focus. This includes:
- `<a>` tags with `href` attributes
- `<button>` elements
- `<input>`, `<textarea>`, `<select>` elements (unless disabled)
- Elements with `tabindex` (unless `tabindex="-1"`)

**❌ Bad:**
```html
<div aria-hidden="true">
  <button onclick="doSomething()">Click me</button>
</div>
```

**✅ Good:**
```html
<div aria-hidden="true">
  <span>This is hidden from all users</span>
</div>
```

### 2. aria-hidden Elements Must NOT Contain Focusable Elements

Even if the container itself is not focusable, hidden elements should not contain focusable descendants.

**❌ Bad:**
```html
<div aria-hidden="true">
  <nav>
    <a href="/page">Link</a>
  </nav>
</div>
```

**✅ Good:**
```html
<!-- Use display: none or visibility: hidden instead -->
<nav style="display: none;">
  <a href="/page">Link</a>
</nav>

<!-- Or separate the interactive elements -->
<div aria-hidden="true">
  <div>Static content</div>
</div>
<button>Separate interactive element</button>
```

## Usage

### Check for Accessibility Issues
```bash
npm run validate:a11y
```

This will:
1. Build the site with Eleventy
2. Scan all generated HTML files
3. Report any aria-hidden violations

### Lint Source Files
```bash
npm run lint
```

This checks template files and JavaScript for accessibility violations during development.

### Full Validation
```bash
npm run validate
```

This runs both the build and accessibility validation.

## When to Use aria-hidden

Use `aria-hidden="true"` for decorative elements that don't add meaning:
- Decorative icons (if they have no semantic purpose)
- Visual separators
- Repeated content for different screen sizes

**Example:**
```html
<span aria-hidden="true">→</span> <!-- Decorative arrow -->
<p>Meaningful text</p>
```

## Landmark Regions

A proper page structure should include these landmark regions:

- **`<main>`** — Primary content area (required, only one per page)
- **`<header>`** — Introductory content (usually contains navigation)
- **`<footer>`** — Footer content with metadata
- **`<aside>`** — Sidebar or complementary content
- **`<nav>`** — Navigation links

Screen readers allow users to jump between these landmarks, making navigation much faster.

## Resources

- [WAI-ARIA: aria-hidden](https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA12)
- [Using aria-hidden="true"](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-hidden)
- [WebAIM: Keyboard Accessibility](https://webaim.org/articles/keyboard/)
- [Using HTML main](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/main)
- [W3C: Document Outline Algorithm](https://www.w3.org/WAI/test-evaluate/)
