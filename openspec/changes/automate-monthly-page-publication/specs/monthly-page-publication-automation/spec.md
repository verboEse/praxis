## ADDED Requirements

### Requirement: Monthly publication trigger
The system SHALL execute a monthly publication transition run on the first calendar day of each month using a configured timezone.

#### Scenario: Scheduled run starts on month boundary
- **WHEN** the scheduler reaches day 1 at the configured execution time in the configured timezone
- **THEN** the system starts exactly one publication transition run for the target month

#### Scenario: Manual retry remains valid on the same day
- **WHEN** an operator reruns the transition on the same first calendar day
- **THEN** the system MUST keep the same final publication state and MUST NOT produce additional active monthly pages

### Requirement: Deterministic month-to-page resolution
The system MUST resolve the target monthly page from an explicit month-to-page mapping and SHALL fail the run if no mapped target page exists.

#### Scenario: Mapping resolves target page
- **WHEN** the run is executed for a month that has a configured page mapping
- **THEN** the system resolves exactly one target page for activation

#### Scenario: Mapping is missing for current month
- **WHEN** the run is executed and no mapping exists for the current month
- **THEN** the system fails with an explicit error status and logs the missing mapping condition

### Requirement: Single active monthly page after transition
The system SHALL activate the resolved target monthly page and SHALL deactivate the previously active monthly page within the same run so that only one monthly page remains active.

#### Scenario: Normal transition from previous month
- **WHEN** a previously active monthly page exists and a valid target monthly page is resolved
- **THEN** the target page is active and the previously active page is inactive after the run

#### Scenario: No previously active page
- **WHEN** no previously active monthly page exists and a valid target monthly page is resolved
- **THEN** the target page becomes active and no additional page is marked active

### Requirement: Observable outcomes and failures
The system MUST emit structured logs and an explicit success or failure exit status for every transition run.

#### Scenario: Successful transition is recorded
- **WHEN** activation and deactivation complete without errors
- **THEN** the logs include run date, resolved target page, deactivated page (if any), and success status

#### Scenario: Transition failure is recorded
- **WHEN** activation, deactivation, or validation fails during the run
- **THEN** the logs include failure reason and failed step, and the process returns a failure exit status