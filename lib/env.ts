import { z } from 'zod';

const optionalUrl = z.string().url().optional().or(z.literal(''));

export const env = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || '',
  niche: process.env.NEXT_PUBLIC_NICHE || 'AI Email Rewriter',
  nicheSystemPrompt: process.env.NICHE_SYSTEM_PROMPT || '',
  openAiKey: process.env.OPENAI_API_KEY || '',
  replicateToken: process.env.REPLICATE_API_TOKEN || '',
  resendKey: process.env.RESEND_API_KEY || '',
  fromEmail: process.env.FROM_EMAIL || 'Forge Funnel <hello@example.com>',
  cronSecret: process.env.CRON_SECRET || '',
  supabaseUrl: process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  posthogKey: process.env.NEXT_PUBLIC_POSTHOG_KEY || '',
  posthogHost: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
  dailyAiBudgetUsd: Number(process.env.DAILY_AI_BUDGET_USD || 25),
};

export function publicOrigin() {
  const parsed = optionalUrl.safeParse(env.siteUrl);
  return parsed.success && parsed.data ? parsed.data.replace(/\/$/, '') : '';
}

export function requireServerEnv(name: string, value: string) {
  if (!value) throw new Error(`MISSING_ENV:${name}`);
  return value;
}
