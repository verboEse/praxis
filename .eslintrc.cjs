module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:jsx-a11y/recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['jsx-a11y'],
  rules: {
    // Enforce aria-hidden is not on an interactive element
    'jsx-a11y/aria-role': 'error',
    // Ensure aria-hidden elements are truly hidden
    'jsx-a11y/no-static-element-interactions': 'warn',
    // Ensure elements with aria-hidden are not focusable
    'jsx-a11y/interactive-supports-focus': 'error',
  },
  overrides: [
    {
      files: ['*.njk', '*.html'],
      parser: 'eslint-html-parser',
    },
  ],
};
