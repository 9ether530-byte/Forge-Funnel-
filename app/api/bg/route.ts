import { nanoid } from 'nanoid';
import { getClientIp, checkQuota, jsonError, logEvent, logRun } from '@/lib/core';
import { runBackgroundRemoval } from '@/lib/tools/bg-remover';
import { imageBody } from '@/lib/validation/schemas';

export const maxDuration = 60;

export async function POST(req: Request) {
  const runId = nanoid();
  const ip = getClientIp(req);
  try {
    const parsed = imageBody.safeParse(await req.json());
    if (!parsed.success) return jsonError('BAD_INPUT', 400, runId);
    const quota = await checkQuota(ip);
    if (!quota.ok) return jsonError('QUOTA_SOFT_WALL', 429, runId);
    const started = Date.now();
    const result = await runBackgroundRemoval(parsed.data.image, ip);
    await logRun({ slug: 'bg-remover', ip, input: { source: parsed.data.image.startsWith('data:') ? 'upload' : 'url' }, output: { mode: result.mode }, cost: result.mode === 'replicate' ? 0.012 : 0, ms: Date.now() - started });
    await logEvent('tool_run', { slug: 'bg-remover', mode: result.mode }, ip);
    return Response.json({ ok: true, result, runId, quota });
  } catch (error) {
    console.error('bg route', error);
    return jsonError(error instanceof Error && error.message.startsWith('IMAGE') ? error.message : 'TOOL_FAILED', 500, runId);
  }
}
