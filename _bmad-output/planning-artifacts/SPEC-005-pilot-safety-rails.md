# SPEC-005 — Pilot Safety Rails

## Goal
Improve operational safety and traceability for production pilot usage.

## Scope
1. Escalation requires explicit operator confirmation.
2. Immutable audit log export endpoint for `recovery_actions`.
3. Error telemetry for recovery status updates and export endpoints.

## Acceptance Criteria
- Escalated status updates fail without `confirm_escalated=yes`.
- `/api/recovery/audit-export` returns CSV of action log records.
- Exceptions in action update/export paths are captured via Sentry.

## Verification
- Lint passes.
- Manual update path confirms escalation safeguard.
- Audit CSV endpoint returns rows for existing actions.
