import { nanoid } from 'nanoid';
import { matchOffers } from '@/lib/affiliate/match';
import { getClientIp, jsonError, logEvent } from '@/lib/core';
import { stackBody } from '@/lib/validation/schemas';

export async function POST(req: Request) {
  const requestId = nanoid();
  const ip = getClientIp(req);
  try {
    const parsed = stackBody.safeParse(await req.json());
    if (!parsed.success) return jsonError('BAD_INPUT', 400, requestId);
    const recommendations = matchOffers(parsed.data.intent);
    await logEvent('stack_built', { offerIds: recommendations.map((offer) => offer.id) }, ip);
    return Response.json({ ok: true, recommendations, requestId });
  } catch (error) {
    console.error('stack route', error);
    return jsonError('STACK_FAILED', 500, requestId);
  }
}
