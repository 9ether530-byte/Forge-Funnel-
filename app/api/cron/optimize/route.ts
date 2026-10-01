import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { env } from '@/lib/env';
import { getOpenAI } from '@/lib/providers/openai';
import { withAiGuard } from '@/lib/guard/with-guard';

export const maxDuration = 300;

export async function GET(req: Request) {
  if (!env.cronSecret || req.headers.get('authorization') !== `Bearer ${env.cronSecret}`) return NextResponse.json({ ok: false, error: 'UNAUTHORIZED' }, { status: 401 });
  const db = getSupabaseAdmin();
  if (!db) return NextResponse.json({ ok: true, plan: { note: 'Supabase is not configured; no optimization persisted.' } });
  const since = new Date(Date.now() - 7 * 86_400_000).toISOString();
  const [{ data: runs }, { data: clicks }] = await Promise.all([db.from('tool_runs').select('slug').gte('created_at', since), db.from('clicks').select('offer_id').gte('created_at', since)]);
  const runCounts: Record<string, number> = {}; for (const row of runs ?? []) runCounts[row.slug] = (runCounts[row.slug] || 0) + 1;
  const clickCounts: Record<string, number> = {}; for (const row of clicks ?? []) clickCounts[row.offer_id] = (clickCounts[row.offer_id] || 0) + 1;
  const openai = getOpenAI();
  let plan: Record<string, unknown> = { runCounts, clickCounts, note: 'Deterministic weekly snapshot.' };
  if (openai) { const response = await withAiGuard(`optimization:${new Date().toISOString().slice(0, 10)}`, 0.004, () => openai.chat.completions.create({ model: 'gpt-4o-mini', response_format: { type: 'json_object' }, messages: [{ role: 'system', content: 'Return JSON with kill, scale, offerReorder, and note. Never invent IDs.' }, { role: 'user', content: JSON.stringify({ runCounts, clickCounts }) }] })); try { plan = JSON.parse(response.choices[0]?.message.content || '{}'); } catch { /* keep snapshot */ } }
  const week = new Date().toISOString().slice(0, 10);
  await db.from('events').upsert({ id: `optimization:${week}`, name: 'optimization_plan', props: plan, created_at: new Date().toISOString() }, { onConflict: 'id' });
  return NextResponse.json({ ok: true, plan });
}
