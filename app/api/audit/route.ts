import { nanoid } from 'nanoid';
import { getClientIp, checkQuota, jsonError, logEvent, logRun } from '@/lib/core';
import { runSeoAudit } from '@/lib/tools/seo-audit';
import { auditBody } from '@/lib/validation/schemas';

export const maxDuration = 60;

export async function POST(req: Request) {
  const runId = nanoid();
  const ip = getClientIp(req);
  try {
    const parsed = auditBody.safeParse(await req.json());
    if (!parsed.success) return jsonError('BAD_INPUT', 400, runId);
    const quota = await checkQuota(ip);
    if (!quota.ok) return jsonError('QUOTA_SOFT_WALL', 429, runId);
    const started = Date.now();
    const result = await runSeoAudit(parsed.data.url, ip);
    await logRun({ slug: 'seo-audit', ip, input: { url: parsed.data.url }, output: { score: result.score }, cost: 0.006, ms: Date.now() - started });
    await logEvent('tool_run', { slug: 'seo-audit', score: result.score }, ip);
    return Response.json({ ok: true, result, runId, quota });
  } catch (error) {
    console.error('audit route', error);
    return jsonError(error instanceof Error && error.message.startsWith('URL_') ? error.message : 'AUDIT_FAILED', 422, runId);
  }
}
