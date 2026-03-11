## Dragun.app — Production Readiness Report

### Security Audit — 2026-03-11

**Status: HARDENED FOR LAUNCH** | Build: ✅ Green

#### Fixed (pre-launch)
- ✅ **Open redirect** in `/api/auth/callback` — `next` param now requires strict relative path (`/^\/(?!\/)`)
- ✅ **Hardcoded owner email** removed from `lib/auth.ts` — now reads `OWNER_EMAIL` env var
- ✅ **`unsafe-eval`** removed from CSP `script-src` in `next.config.ts`
- ✅ **Stripe checkout rate limiting** — Arcjet `fixedWindow` (10 req / 10 min per token) added to `/api/stripe/checkout`
- ✅ **`OWNER_EMAIL` + `DEBTOR_PORTAL_SECRET`** documented in `ENVIRONMENT.md`

#### Accepted risks / post-launch backlog
- ⚠️ **Chat rate limiting** is in-memory (per-instance) — acceptable for pilot; migrate to Arcjet persistent after launch
- ⚠️ **CSP `unsafe-inline`** for scripts remains — required by Next.js hydration; nonce-based CSP is a post-launch hardening item
- ⚠️ **CSV import** lacks uniqueness/injection guard — low risk in pilot (merchants control input); add `ON CONFLICT DO NOTHING` post-launch
- ⚠️ **Webhook callback URL** doesn't enforce HTTPS protocol — verify `NEXT_PUBLIC_URL` is `https://` in Vercel env

#### Pre-launch env vars checklist
- [ ] `OWNER_EMAIL` set in Vercel
- [ ] `DEBTOR_PORTAL_SECRET` set (32+ chars, random) in Vercel
- [ ] All existing vars from ENVIRONMENT.md confirmed set

---

### Mission
- **Goal**: Ship Dragun.app to a stable, monitored Vercel production environment, safe for real debtor traffic and merchant operations.

### Current State Snapshot
- **Stack**: Next.js 16 (App Router, Server Actions), Supabase (DB + Auth + pgvector), Stripe, Groq AI, Arcjet, Sentry, next-intl.
- **Deployment target**: Vercel with GitHub → Vercel CI/CD (`ci.yml`, `deploy-vercel.yml`).
- **Operational docs**: `MAINTENANCE.md`, `DEPLOYMENT.md`, `ENVIRONMENT.md`, `PILOT_GAPS.md`, `NEXT_STEPS.md`.
- **Pre-release checklist**: Defined in `MAINTENANCE.md` but not yet executed/recorded for this report.

### Environment & Secrets
- **Vercel project**:
  - [ ] `NEXT_PUBLIC_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY`
  - [ ] `GROQ_API_KEY`
  - [ ] `STRIPE_SECRET_KEY`
  - [ ] `STRIPE_WEBHOOK_SECRET`
  - [ ] `SENTRY_DSN`
  - [ ] `ARCJET_KEY`
- **GitHub Actions (CI/CD)**:
  - [ ] `VERCEL_TOKEN`
  - [ ] `VERCEL_ORG_ID`
  - [ ] `VERCEL_PROJECT_ID`
- **Validation**:
  - [ ] `lib/env.ts` passes without errors under production env config.

### Pre-Release Checklist (from `MAINTENANCE.md`)
- [ ] `npm run lint` — no errors.
- [ ] `npm run test:unit` — all unit tests pass.
- [ ] `npm run test:e2e` — E2E suite green or scoped to a stable smoke subset.
- [ ] `npm run audit` — high/critical issues fixed or explicitly accepted.
- [ ] `npm run i18n:check` — EN/FR keys in sync.
- [ ] `npm run db:check` — migrations applied and schema consistent with `schema.sql` / `pilot-seed.sql`.
- [ ] No secrets in client components; server actions use merchant context helpers.
- [ ] CSP and security headers in `next.config.ts` reviewed after any new scripts/domains.

### Application Hardening
- **API & Webhooks**
  - [ ] `/api` routes (chat, Stripe, webhooks) enforce auth, input validation, and Arcjet-based rate limiting on public surfaces.
  - [ ] Stripe webhook endpoint configured in Stripe dashboard and verified against `STRIPE_WEBHOOK_SECRET`.
- **Security**
  - [ ] Arcjet key active and rules aligned with expected traffic patterns.
  - [ ] Sentry DSN configured and error sampling/PII settings reviewed.
  - [ ] Supabase RLS policies enabled and tested for debtor/merchant separation.
- **Monitoring & Analytics**
  - [ ] Sentry capturing frontend and backend errors.
  - [ ] Vercel Analytics enabled for core routes.
  - [ ] Alerts configured on elevated error rate and webhook failures.

### Operational Readiness
- **Merchant dashboard**
  - [ ] Recovery queue usable on desktop and mobile (critical KPIs visible).
  - [ ] Operator can update statuses and audit log records every action.
- **Debtor portal**
  - [ ] Mobile-responsiveness verified on at least one iOS and one Android viewport.
  - [ ] AI chat responds reliably with contract-aware summaries (GROQ API key configured).
  - [ ] Payment and settlement flows tested end-to-end (or via test mode) with Stripe.
- **Fallbacks**
  - [ ] CSV export endpoints for debtors and audit log verified for operational backup.
  - [ ] Error boundaries present on critical routes (dashboard, debtor portal) to avoid white screens.

### Branch & Deployment Policy
- **Branch protection**
  - [ ] `main` requires PRs and passing `Lint + Build` checks.
  - [ ] Force pushes to `main` disabled; direct pushes restricted.
- **Deploy flow**
  - [ ] PRs to `main` → preview deploy verified before merge.
  - [ ] Push to `main` → production deploy via Vercel; on-call knows rollback strategy (revert + redeploy).

### Go / No-Go Gate
- **Go when**:
  - [ ] All items above are checked or explicitly accepted as risk.
  - [ ] A named owner is on call for the first 24–48 hours post-deploy.
  - [ ] Merchant pilot dataset and Stripe test/live modes are correctly configured.
- **If any critical line remains unchecked**, treat deployment as **pilot / soft launch** only, with constrained traffic and tight supervision.

