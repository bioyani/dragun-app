# SPEC-001 — Recovery Operations Core (Production Pilot)

## Problem
Operators need to move quickly on unpaid charges with deterministic prioritization and traceable actions.

## Scope
- Prioritized debtor queue
- Status transition controls
- Action logging per debtor
- Ops KPI strip

## Out of Scope
- Advanced ML prediction
- Full omnichannel outbound automation
- Multi-tenant role hierarchy

## Data Contract
- `debtors.days_overdue` (int)
- `recovery_actions` table (`debtor_id`, `merchant_id`, `action_type`, `status_after`, `note`, `created_at`)

## Acceptance Criteria
1. Queue excludes paid records and sorts by score descending.
2. Status updates persist and are visible after reload.
3. Every update writes a `recovery_actions` row.
4. KPI strip shows outstanding, recovered, contacted today, promises.

## Verification
- Lint passes
- Supabase schema confirms required columns/table
- Manual status transitions verified in UI

## Evidence
- Commit: `38fff9f`
- Supabase migration applied successfully via MCP
