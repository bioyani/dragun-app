# TODAY_PLAN — Production Pilot Build (Venice Gym Charlesbourg)

## Mission
Ship a live production pilot that can replace Debtor Raptor in day-to-day unpaid charge recovery operations.

## Success Criteria (Today)
- [ ] Unpaid accounts ingest works on real client export
- [ ] Prioritized recovery queue is visible and actionable
- [ ] Operator can log outcomes (reached/promise/paid/no answer/escalated)
- [ ] KPI strip updates from real actions
- [ ] Audit trail exists for every operator action

## Timeboxed Execution

### Sprint 1 (Now → +90 min): Foundation + Gap Scan
- [ ] Verify current app runs locally
- [ ] Identify existing unpaid-charges flow coverage in code
- [ ] Write implementation gaps in `PILOT_GAPS.md`
- [ ] Lock minimal schema changes (if any)

### Sprint 2 (+90 → +210 min): Core Recovery Queue
- [ ] Build/adjust query for prioritized unpaid accounts
- [ ] Add queue screen with score + next action
- [ ] Add action controls + status updates

### Sprint 3 (+210 → +330 min): KPI + Auditability
- [ ] Add pilot KPI summary
- [ ] Add immutable action log entries
- [ ] Add filters (age bucket / amount bucket / status)

### Sprint 4 (+330 → +420 min): Hardening
- [ ] Validate error paths and empty states
- [ ] Add CSV export snapshot for operations fallback
- [ ] Smoke test end-to-end on pilot dataset

## Constraints
- Keep scope to collections operations only
- No broad redesigns
- Use term: production pilot
