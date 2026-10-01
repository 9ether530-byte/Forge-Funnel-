import { NextResponse } from 'next/server';
import { generateCluster } from '@/agents/AG-05-seo-engine';
import { env } from '@/lib/env';

export const maxDuration = 300;

export async function GET(req: Request) {
  if (!env.cronSecret || req.headers.get('authorization') !== `Bearer ${env.cronSecret}`) return NextResponse.json({ ok: false, error: 'UNAUTHORIZED' }, { status: 401 });
  try { return NextResponse.json({ ok: true, ...(await generateCluster()) }); }
  catch (error) { console.error('seo cron', error); return NextResponse.json({ ok: false, error: 'SEO_CRON_FAILED' }, { status: 500 }); }
}
