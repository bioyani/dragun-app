# Dragun.app

**Intelligent debt recovery powered by AI negotiation.**

Dragun automates debt recovery with AI that negotiates professionally -- citing contract terms, offering flexible settlement paths, and maintaining full compliance. Built for businesses that want to recover revenue without destroying relationships.

## Stack

- **Framework**: Next.js 16 (App Router, Server Actions)
- **UI**: Tailwind CSS v4, DaisyUI v5, Framer Motion
- **Auth & DB**: Supabase (PostgreSQL, pgvector, Row-Level Security)
- **AI**: Google Gemini 2.5 Flash / DeepSeek v3 via OpenRouter
- **Payments**: Stripe Connect (destination charges, 5% platform fee)
- **Monitoring**: Sentry, Vercel Analytics
- **Security**: Arcjet (rate limiting, bot protection), CSP, HSTS
- **i18n**: next-intl (EN/FR)

## Architecture

Two distinct experiences on one platform:

- **Merchant Dashboard** — Data-dense operational control. Recovery queue, analytics, CSV import/export, configurable AI tone, Stripe Connect onboarding.
- **Debtor Portal** — Calm, respectful resolution interface. Warm conversational AI, flexible payment options, secure Stripe checkout. Mobile-first.

## Getting Started

```bash
cp .env.example .env.local
# Fill in your Supabase, Stripe, and AI provider keys
npm install
npm run dev
```

## Environment Variables

See [`.env.example`](.env.example) for all required and optional variables.

At minimum you need:
- Supabase project URL + keys
- At least one AI provider key (Google AI or OpenRouter)
- Stripe secret key + webhook secret

## Deployment

Deployed on Vercel. Push to `main` triggers production deployment.

## License

Proprietary. All rights reserved. Meziani AI Inc.
