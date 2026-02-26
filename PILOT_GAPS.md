# PILOT_GAPS — Production Pilot Readiness

## Current State Snapshot
- Core dashboard, debtor records, chat flow, and payment flow already exist.
- Existing statuses are too coarse for collections ops (`pending`, `paid`).
- No explicit prioritized recovery queue for operator-first workflows.
- No dedicated collections action log for auditability.

## Blocking Infrastructure Gaps
1. Missing runtime env vars in this workspace (`.env.local` absent)
   - Build currently fails at `supabaseUrl is required`.
2. No confirmed pilot dataset mounted in this local workspace.

## Product/Workflow Gaps (Buildable Now)
1. Expand debtor lifecycle statuses:
   - `pending`, `contacted`, `promise_to_pay`, `paid`, `no_answer`, `escalated`
2. Add recovery score and ordering strategy:
   - amount, age, recency of contact, status weighting
3. Add operator actions:
   - call/message/schedule follow-up + notes
4. Add immutable action log table and UI timeline per debtor
5. Add KPI strip tailored to operations:
   - outstanding, contacted today, promises, paid today

## Immediate Build Order
1. Schema extension + migration for statuses and action log
2. Prioritized queue query + dashboard section
3. Action update server actions
4. KPI cards wired to operational metrics
5. CSV export fallback for daily operations
