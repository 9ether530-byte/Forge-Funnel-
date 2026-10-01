import { nanoid } from 'nanoid';
import { Resend } from 'resend';
import { getClientIp, jsonError, logEvent } from '@/lib/core';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { env } from '@/lib/env';
import { leadBody } from '@/lib/validation/schemas';

export async function POST(req: Request) {
  const requestId = nanoid();
  const ip = getClientIp(req);
  try {
    const parsed = leadBody.safeParse(await req.json());
    if (!parsed.success) return jsonError('BAD_INPUT', 400, requestId);
    const db = getSupabaseAdmin();
    let leadId = crypto.randomUUID();
    if (db) {
      const { data, error } = await db.from('leads').upsert({ email: parsed.data.email.toLowerCase(), source_tool: parsed.data.sourceTool, intent: parsed.data.intent ?? {} }, { onConflict: 'email' }).select('id').single();
      if (error) return jsonError('DB', 500, requestId);
      leadId = data.id;
    }
    if (env.resendKey) {
      try {
        const resend = new Resend(env.resendKey);
        await resend.emails.send({ from: env.fromEmail, to: parsed.data.email, subject: 'Your Forge Funnel result + next steps', html: `<p>Your result is ready.</p><p>Continue to the tool advisor to shape your next step.</p>` });
      } catch (emailError) { console.error('resend delivery', emailError); }
    }
    await logEvent('lead_captured', { sourceTool: parsed.data.sourceTool, emailDomain: parsed.data.email.split('@')[1] }, ip);
    return Response.json({ ok: true, leadId, next: `/chat?lead=${leadId}&from=${encodeURIComponent(parsed.data.sourceTool)}` });
  } catch (error) {
    console.error('lead route', error);
    return jsonError('LEAD_FAILED', 500, requestId);
  }
}
