import { nanoid } from 'nanoid';
import { getClientIp, checkQuota, jsonError, logEvent, logRun } from '@/lib/core';
import { runHeadshot } from '@/lib/tools/headshot';
import { headshotBody } from '@/lib/validation/schemas';

export const maxDuration = 90;

export async function POST(req: Request) {
  const runId = nanoid();
  const ip = getClientIp(req);
  try {
    const parsed = headshotBody.safeParse(await req.json());
    if (!parsed.success) return jsonError('BAD_INPUT', 400, runId);
    const quota = await checkQuota(ip);
    if (!quota.ok) return jsonError('QUOTA_SOFT_WALL', 429, runId);
    const started = Date.now();
    const result = await runHeadshot(parsed.data.image, parsed.data.style, ip);
    await logRun({ slug: 'headshot', ip, input: { style: parsed.data.style }, output: { mode: result.mode }, cost: result.mode === 'replicate' ? 0.02 : 0, ms: Date.now() - started });
    await logEvent('tool_run', { slug: 'headshot', style: parsed.data.style, mode: result.mode }, ip);
    return Response.json({ ok: true, result, runId, quota });
  } catch (error) {
    console.error('headshot route', error);
    return jsonError(error instanceof Error && error.message.startsWith('IMAGE') ? error.message : 'TOOL_FAILED', 500, runId);
  }
}
