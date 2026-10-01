# Forge Funnel

Forge Funnel is a managed Next.js micro-SaaS funnel: free tools deliver value first, then an email gate continues into intent capture, a Stack Builder, and allowlisted affiliate redirects.

## Local setup

```bash
cp .env.example .env.local
pnpm install
pnpm dev
```

The app serves on `http://localhost:3000`. Without provider credentials, the text tool uses a deterministic rewrite and the image tools use real local transforms from the uploaded image. This keeps Preview honest: there is no fake successful output.

## Production environment

Configure `NEXT_PUBLIC_SITE_URL`, Supabase server credentials, `OPENAI_API_KEY`, `REPLICATE_API_TOKEN`, `RESEND_API_KEY`, `FROM_EMAIL`, `CRON_SECRET`, `DAILY_AI_BUDGET_USD`, PostHog keys, and the eight affiliate name/URL pairs. Keep the service-role key server-only. Never put secrets in client components or committed files.

## Supabase

Run `supabase/migrations/0001_init.sql` in the Supabase SQL editor or through the Supabase CLI. The migration creates tool runs, leads, chat sessions, clicks, events, rate-limit buckets, and AI spend tables, enables RLS, and adds security-definer claim functions. The Next.js server uses the service-role key only for server writes.

## Funnel rules

Every free tool is quota checked before work and logged after work. The value-first gate is rendered only after a result is present. Chat recommendations are resolved against `lib/affiliate/offers.ts`; paid categories only appear in the Stack Builder. Every outbound partner click passes through `/go/[offerId]`, which logs the click before redirecting.

## Automation

- Import `n8n/workflow-funnel.json` into n8n and connect Postgres, OpenAI, and Resend credentials.
- Use `automation/make-reengagement.json` as the Make.com mirror.
- Vercel-compatible cron declarations live in `vercel.json`; managed hosting can call the same bearer-protected endpoints.
- `agents/` contains the prompt library and `AG-05-seo-engine.ts` content generator.

## Checks

```bash
pnpm lint
pnpm typecheck
pnpm build
```

## Operator-owned launch work

Review privacy/terms, connect a production Supabase project, verify all affiliate programs and tracking URLs, configure Resend domain authentication, set `NEXT_PUBLIC_SITE_URL`, and publish only after a managed checkpoint is saved.
