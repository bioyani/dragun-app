# Dragun Production Pilot — BMAD v6 Bootstrap

## Installation Baseline
- BMAD Core: 6.0.3
- BMM module: 6.0.3
- BMB module: 0.1.6
- Installed in: `_bmad/`

## Pilot Objective
Replace Debtor Raptor in real operations at Venice Gym Charlesbourg through a production pilot focused on unpaid charge resolution speed and operator clarity.

## BMAD v6 Operating Loop (for this project)
1. **Analysis**: codify operator pain + incumbent gap
2. **Plan**: formalize feature slice spec + acceptance checks
3. **Solutioning**: architecture/data path for smallest shippable outcome
4. **Implementation**: ship one thin vertical slice with validation

## Current Slice in Progress
- Recovery queue prioritization
- Rich collections statuses
- Action logging and audit trail
- DB migration applied to production Supabase project

## Next BMAD Slices
1. Recovery action timeline per debtor
2. Top-20 Today board with clear suggested actions
3. CSV export fallback and operational handoff package

## Production Pilot Acceptance Metrics
- Median time to first action < 60 seconds from opening queue
- 100% state transitions logged in `recovery_actions`
- Top-20 list stable and deterministic across refreshes
- Export generated under 5 seconds for current debtor set
