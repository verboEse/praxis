# Praxis Website

## Monthly Publication Automation

This repository contains an automated monthly publication transition for the monthly post series.

- Canonical timezone: `Europe/Berlin`
- Mapping file: `monthly-publication.config.json`
- Transition script: `scripts/monthly-publication-transition.js`
- Scheduler workflow: `.github/workflows/monthly-publication-transition.yml`

### How it works

On day 1 of each month, the transition script resolves the configured target post from the explicit month-to-page mapping and enforces exactly one active monthly post by:

1. Activating the target post (`published: true`)
2. Deactivating all other mapped monthly posts (`published: false`)

The script emits structured JSON logs for success and failure outcomes and exits with a non-zero status on failure.

### Commands

- Run transition: `npm run monthly:transition`
- Dry run (no file writes): `npm run monthly:transition:dry-run`
- Date override for validation: `node scripts/monthly-publication-transition.js --date 2026-05-01T00:05:00.000Z --force --dry-run`

### Scheduler

GitHub Actions runs the scheduler in `.github/workflows/monthly-publication-transition.yml` on day 1 monthly (`5 0 1 * *`, UTC). The script still enforces the local date gate in `Europe/Berlin`.
