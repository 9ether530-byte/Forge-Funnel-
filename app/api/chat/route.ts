import { nanoid } from 'nanoid';
import { getOpenAI } from '@/lib/providers/openai';
import { withAiGuard } from '@/lib/guard/with-guard';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { getClientIp, jsonError, logEvent } from '@/lib/core';
import { matchOffers } from '@/lib/affiliate/match';
import { chatBody } from '@/lib/validation/schemas';
import type { Intent } from '@/lib/types';

const TOOL = { type: 'function' as const, function: { name: 'recommend_stack', description: 'Extract structured intent for the stack builder. Never name a product.', parameters: { type: 'object', properties: { goal: { type: 'string' }, budget: { type: 'string', enum: ['free', 'cheap', 'pro', 'enterprise'] }, stage: { type: 'string', enum: ['idea', 'building', 'launched', 'scaling'] }, skills: { type: 'array', items: { type: 'string' } }, keywords: { type: 'array', items: { type: 'string' } } }, required: ['goal'] } } };

function fallbackIntent(message: string): Intent {
  const text = message.toLowerCase();
  const budget = text.includes('free') ? 'free' : text.includes('enterprise') ? 'enterprise' : text.includes('pro') || text.includes('paid') ? 'pro' : 'cheap';
  const stage = text.includes('scale') ? 'scaling' : text.includes('launched') ? 'launched' : text.includes('build') ? 'building' : 'idea';
  const keywords = ['seo', 'email', 'design', 'ai', 'hosting', 'headshot', 'upscale'].filter((word) => text.includes(word));
  return { goal: message.trim(), budget, stage, skills: [], keywords };
}

export async function POST(req: Request) {
  const requestId = nanoid();
  const ip = getClientIp(req);
  try {
    const parsed = chatBody.safeParse(await req.json());
    if (!parsed.success) return jsonError('BAD_INPUT', 400, requestId);
    const sessionId = parsed.data.sessionId || nanoid(16);
    let intent: Intent | null = null;
    let reply = '';
    let modelRecommended = false;
    const userTurns = parsed.data.messages.filter((message) => message.role === 'user').length;
    const capReached = userTurns >= 3;
    const openai = getOpenAI();
    if (openai && !capReached) {
      try {
        const response = await withAiGuard(`chat:${ip}`, 0.004, () => openai.chat.completions.create({ model: 'gpt-4o', temperature: 0.2, messages: [{ role: 'system', content: 'You are the Forge Funnel tool advisor. Ask at most three concise questions. Extract goal, budget, stage, skills, and keywords. Never name a brand or invent a product. When enough information is available, call recommend_stack.' }, ...parsed.data.messages, { role: 'user', content: parsed.data.message }], tools: [TOOL], tool_choice: 'auto' }));
        const call = response.choices[0]?.message.tool_calls?.[0];
        if (call?.function.name === 'recommend_stack') { intent = JSON.parse(call.function.arguments) as Intent; modelRecommended = true; }
        reply = response.choices[0]?.message.content?.trim() || '';
      } catch (error) {
        console.error('chat provider fallback', error);
      }
    }
    if (!intent) {
      intent = fallbackIntent(parsed.data.message);
      reply = parsed.data.messages.length >= 2 ? 'I have enough context to assemble a focused stack.' : 'What are you building, and what would a useful first result look like?';
    }
    const ready = Boolean(intent.goal) && (modelRecommended || parsed.data.messages.length >= 2 || capReached);
    const recommendations = ready ? matchOffers(intent) : [];
    const db = getSupabaseAdmin();
    if (db) await db.from('chat_sessions').upsert({ id: sessionId, ip, lead_id: parsed.data.leadId ?? null, messages: [...parsed.data.messages, { role: 'user', content: parsed.data.message }, { role: 'assistant', content: reply }], extracted_intent: intent }, { onConflict: 'id' });
    await logEvent('chat_message', { sessionId, ready, recommendationCount: recommendations.length }, ip);
    return Response.json({ ok: true, sessionId, reply, intent, ready, recommendations: ready ? recommendations : undefined });
  } catch (error) {
    console.error('chat route', error);
    return jsonError(error instanceof Error && error.message === 'RATE_LIMIT' ? 'RATE_LIMIT' : 'CHAT_FAILED', 500, requestId);
  }
}
