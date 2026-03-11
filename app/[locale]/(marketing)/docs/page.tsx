import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';

export const metadata: Metadata = {
  title: 'Docs | Dragun.app',
  description: 'Public documentation for Dragun.app — overview, integration, and API reference.',
};

const sections = [
  {
    id: 'overview',
    title: 'Overview',
    description:
      'Understand what Dragun.app does, who it is for, and how it fits into your existing collections operations.',
  },
  {
    id: 'getting-started',
    title: 'Getting started',
    description:
      'Spin up a pilot in under an hour: environment variables, Supabase, Stripe, and AI configuration.',
  },
  {
    id: 'api',
    title: 'API reference',
    description:
      'Key routes under /api, how authentication works for merchants, debtors, webhooks, and cron jobs.',
  },
  {
    id: 'security',
    title: 'Security & compliance',
    description:
      'How we think about encryption, retention, audit logs, and how Dragun fits into your compliance posture.',
  },
];

export default function DocsLandingPage() {
  return (
    <main className="py-16 sm:py-20 lg:py-24">
      <div className="app-shell max-w-5xl">
        <header className="max-w-3xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            Docs
          </p>
          <h1 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            Dragun.app documentation
          </h1>
          <p className="mt-4 text-base sm:text-lg text-base-content/60 leading-relaxed">
            Public reference for teams evaluating or running Dragun in production. Built to match the main app&rsquo;s
            UX so your operators and legal teams can navigate without friction.
          </p>
        </header>

        <section className="mt-10 grid gap-4 sm:gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <nav className="rounded-2xl border border-base-300/60 bg-base-200/40 p-4 sm:p-5 text-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-base-content/40 mb-3">
              Sections
            </p>
            <ul className="space-y-1.5">
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="flex items-center justify-between rounded-lg px-2 py-1.5 text-sm text-base-content/70 hover:text-base-content hover:bg-base-100/60 transition-colors"
                  >
                    <span>{section.title}</span>
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-4 border-t border-base-300/60 pt-4 text-xs text-base-content/40">
              Looking for pricing or demo?
              <div className="mt-1 flex flex-wrap gap-2">
                <Link href="/pricing" className="link-hover text-xs">
                  Pricing
                </Link>
                <span className="text-base-content/30">·</span>
                <Link href="/demo" className="link-hover text-xs">
                  Live demo
                </Link>
              </div>
            </div>
          </nav>

          <div className="space-y-10 sm:space-y-12">
            <section id="overview" aria-labelledby="overview-heading" className="scroll-mt-28">
              <h2 id="overview-heading" className="text-xl sm:text-2xl font-semibold tracking-tight">
                Overview
              </h2>
              <p className="mt-3 text-sm sm:text-base text-base-content/70 leading-relaxed">
                Dragun is an intelligent debt recovery platform that pairs an AI negotiation engine with your contracts,
                Supabase-backed data, and Stripe Connect. It is designed for professional services, fitness, and
                subscription businesses that want to recover more revenue without burning relationships.
              </p>
              <p className="mt-3 text-sm sm:text-base text-base-content/70 leading-relaxed">
                The platform ships with two main surfaces: a merchant dashboard for your team, and a debtor portal that
                feels like a respectful, secure chat interface. This documentation focuses on how to configure, operate,
                and integrate Dragun safely in production.
              </p>
            </section>

            <section id="getting-started" aria-labelledby="getting-started-heading" className="scroll-mt-28">
              <h2 id="getting-started-heading" className="text-xl sm:text-2xl font-semibold tracking-tight">
                Getting started
              </h2>
              <p className="mt-3 text-sm sm:text-base text-base-content/70 leading-relaxed">
                For a production pilot, you will need a Vercel project, Supabase project, Stripe account, and a Groq API
                key. Environment variables are documented in the repository&apos;s <code>.env.example</code> and{' '}
                <code>ENVIRONMENT.md</code>.
              </p>
              <ol className="mt-4 space-y-3 text-sm sm:text-base text-base-content/70 list-decimal list-inside">
                <li>Deploy the app to Vercel (GitHub import or CLI) and configure environment variables.</li>
                <li>Run the provided SQL (`schema.sql`, `seed.sql`, or `pilot-seed.sql`) in your Supabase project.</li>
                <li>Connect Stripe and configure your Connect account for payouts.</li>
                <li>Upload your base agreement in the onboarding flow to seed the contract-aware knowledge base.</li>
              </ol>
              <p className="mt-3 text-xs text-base-content/50">
                For detailed operator and migration docs, see the in-repo <code>MAINTENANCE.md</code>,{' '}
                <code>docs/RUN_MIGRATIONS.md</code>, and <code>PROD_READINESS_REPORT.md</code>.
              </p>
            </section>

            <section id="api" aria-labelledby="api-heading" className="scroll-mt-28">
              <h2 id="api-heading" className="text-xl sm:text-2xl font-semibold tracking-tight">
                API reference
              </h2>
              <p className="mt-3 text-sm sm:text-base text-base-content/70 leading-relaxed">
                Dragun exposes a small set of HTTP routes under <code>/api/</code> for health checks, debtor chat,
                Stripe integrations, webhooks, and cron-style maintenance tasks. Merchant and debtor traffic is
                separated; sensitive operations are authenticated and rate limited with Arcjet.
              </p>
              <div className="mt-4 rounded-2xl border border-base-300/70 bg-base-200/60 p-4 sm:p-5 text-xs sm:text-sm">
                <div className="font-mono text-[11px] sm:text-xs text-base-content/60">
                  <div className="mb-2 font-semibold text-base-content">Core routes (see docs/API.md for full table)</div>
                  <pre className="whitespace-pre-wrap break-words">
GET /api/health           # Health check, returns status and ai_configured
POST /api/chat            # Debtor chat, token-based, streams negotiation
POST /api/stripe/checkout # Creates Stripe Checkout session
POST /api/stripe/webhook  # Stripe events, signed with STRIPE_WEBHOOK_SECRET
GET  /api/recovery/export # CSV export for debtors (merchant session)
GET  /api/recovery/audit-export # Audit log export (merchant session)
                  </pre>
                </div>
              </div>
              <p className="mt-3 text-xs text-base-content/55">
                For provider-specific setup (Twilio, Resend, Stripe webhooks, cron secrets), refer to the technical docs
                under <code>/docs</code> in the repository, in particular <code>COMMS.md</code> and <code>API.md</code>.
              </p>
            </section>

            <section id="security" aria-labelledby="security-heading" className="scroll-mt-28">
              <h2 id="security-heading" className="text-xl sm:text-2xl font-semibold tracking-tight">
                Security &amp; compliance posture
              </h2>
              <p className="mt-3 text-sm sm:text-base text-base-content/70 leading-relaxed">
                Dragun runs on Vercel (edge + functions) and Supabase (Postgres + Auth). Data is encrypted in transit
                and at rest by these providers, and the application adds strict security headers, role-based access, and
                auditing for recovery actions.
              </p>
              <ul className="mt-4 space-y-2 text-sm sm:text-base text-base-content/70 list-disc list-inside">
                <li>Strict-Transport-Security, CSP, and related headers are enforced at the Next.js layer.</li>
                <li>
                  Supabase Row-Level Security (RLS) is used to keep debtor and merchant records partitioned by account.
                </li>
                <li>Sentry captures application errors; Stripe handles PCI responsibilities for payments.</li>
                <li>
                  Merchants remain responsible for jurisdiction-specific collection rules; Dragun is software, not a law
                  firm.
                </li>
              </ul>
              <p className="mt-3 text-xs text-base-content/55">
                For deeper legal wording, see the Legal Center page on the marketing site and the in-app disclosures in
                the debtor portal and pay surfaces.
              </p>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}

