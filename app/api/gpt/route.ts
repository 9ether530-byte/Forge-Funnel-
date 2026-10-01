import { nanoid } from 'nanoid';
import { getClientIp, checkQuota, jsonError, logEvent, logRun } from '@/lib/core';
import { runGptWrapper } from '@/lib/tools/gpt-wrapper';
import { gptBody } from '@/lib/validation/schemas';

export async function POST(req: Request) {
  const runId = nanoid();
  const ip = getClientIp(req);
  try {
    const parsed = gptBody.safeParse(await req.json());
    if (!parsed.success) return jsonError('BAD_INPUT', 400, runId);
    const quota = await checkQuota(ip);
    if (!quota.ok) return jsonError('QUOTA_SOFT_WALL', 429, runId);
    const started = Date.now();
    const result = await runGptWrapper(parsed.data.text, ip);
    await logRun({ slug: 'gpt-wrapper', ip, input: { chars: parsed.data.text.length }, output: { mode: result.mode }, cost: result.mode === 'openai' ? 0.001 : 0, ms: Date.now() - started });
    await logEvent('tool_run', { slug: 'gpt-wrapper', mode: result.mode }, ip);
    return Response.json({ ok: true, result, runId, quota });
  } catch (error) {
    console.error('gpt route', error);
    return jsonError(error instanceof Error && error.message === 'RATE_LIMIT' ? 'RATE_LIMIT' : 'TOOL_FAILED', 500, runId);
  }
}
