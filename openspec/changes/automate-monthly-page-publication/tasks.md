## 1. Scheduling and Configuration

- [x] 1.1 Define and document the canonical timezone for the monthly run.
- [x] 1.2 Add scheduler configuration to execute the monthly transition on day 1.
- [x] 1.3 Add configuration for explicit month-to-page mapping.

## 2. Transition Engine

- [x] 2.1 Implement month-to-page resolution from explicit mapping with validation.
- [x] 2.2 Implement two-phase transition: activate target page, then deactivate previously active page.
- [x] 2.3 Ensure transition logic is idempotent for repeated runs on the same day.

## 3. Error Handling and Observability

- [x] 3.1 Add structured success logs including run date, target page, and deactivated page.
- [x] 3.2 Add structured failure logs with failed step and failure reason.
- [x] 3.3 Return explicit process exit status for success and failure outcomes.

## 4. Verification and Rollout

- [x] 4.1 Add automated tests for scheduler trigger behavior and month boundary handling.
- [x] 4.2 Add tests for missing mapping and missing target page failure paths.
- [x] 4.3 Add tests to verify exactly one active monthly page after normal and retry runs.
- [x] 4.4 Perform a dry run with representative data and validate expected final state.
- [ ] 4.5 Roll out scheduler in production and verify first live run with logs. (Pending first scheduled production run)