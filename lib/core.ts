import { nanoid } from 'nanoid';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import type { ToolSlug } from '@/lib/types';

export const FREE_LIMIT_PER_DAY = 3;

export type RunCtx = { ip: string; userId?: string; runId: string };

const memoryRuns = new Map<string, number[]>();

export function getClientIp(req: Request) {
  const forwarded = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return forwarded || req.headers.get('x-real-ip') || 'unknown';
}

export async function checkQuota(ip: string) {
  const db = getSupabaseAdmin();
  if (db) {
    const { data, error } = await db.rpc('claim_rate_limit', { bucket_key: `tool:${ip}`, max_hits: FREE_LIMIT_PER_DAY, window_seconds: 86_400 });
    if (error) throw new Error('QUOTA_BACKEND');
    const { count } = await db.from('tool_runs').select('*', { count: 'exact', head: true }).eq('ip', ip).gte('created_at', new Date(Date.now() - 86_400_000).toISOString());
    return { ok: Boolean(data), used: count ?? (data ? 1 : FREE_LIMIT_PER_DAY), limit: FREE_LIMIT_PER_DAY };
  }
  return claimMemoryQuota(ip);
}

export function claimMemoryQuota(ip: string) {
  const now = Date.now();
  const values = (memoryRuns.get(ip) ?? []).filter((stamp) => now - stamp < 86_400_000);
  if (values.length >= FREE_LIMIT_PER_DAY) return { used: values.length, limit: FREE_LIMIT_PER_DAY, ok: false };
  values.push(now);
  memoryRuns.set(ip, values);
  return { used: values.length, limit: FREE_LIMIT_PER_DAY, ok: true };
}

export async function logRun(row: { slug: ToolSlug; ip: string; userId?: string; input: unknown; output: unknown; cost: number; ms: number }) {
  const db = getSupabaseAdmin();
  if (!db) return;
  await db.from('tool_runs').insert({ id: nanoid(), ...row, created_at: new Date().toISOString() });
}

export async function logEvent(name: string, props: Record<string, unknown>, ip?: string, userId?: string) {
  const db = getSupabaseAdmin();
  if (!db) return;
  await db.from('events').insert({ id: nanoid(), name, props, ip, user_id: userId ?? null, created_at: new Date().toISOString() });
}

export function jsonError(error: string, status = 400, requestId = nanoid()) {
  return Response.json({ ok: false, error, requestId }, { status, headers: { 'cache-control': 'private, no-store' } });
}
