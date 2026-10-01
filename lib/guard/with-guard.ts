import { env } from '@/lib/env';

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 10;
const buckets = new Map<string, number[]>();
let spentToday = 0;
let dayStamp = new Date().toDateString();

export function rateLimit(key: string) {
  const now = Date.now();
  const hits = (buckets.get(key) ?? []).filter((time) => now - time < WINDOW_MS);
  if (hits.length >= MAX_PER_WINDOW) throw new Error('RATE_LIMIT');
  hits.push(now);
  buckets.set(key, hits);
}

export function costGuard(estimatedUsd: number) {
  const today = new Date().toDateString();
  if (today !== dayStamp) { spentToday = 0; dayStamp = today; }
  if (spentToday + estimatedUsd > env.dailyAiBudgetUsd) throw new Error('COST_CAP');
  spentToday += estimatedUsd;
}

export async function withAiGuard<T>(key: string, estimatedUsd: number, fn: () => Promise<T>) {
  rateLimit(key);
  costGuard(estimatedUsd);
  return fn();
}
