import { NextResponse } from 'next/server';
import { getClientIp, logEvent } from '@/lib/core';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { findOffer } from '@/lib/affiliate/offers';

export async function GET(req: Request, { params }: { params: { offerId: string } }) {
  const offer = findOffer(params.offerId);
  if (!offer) return new Response('Offer not found', { status: 404, headers: { 'cache-control': 'private, no-store' } });
  try {
    const url = new URL(offer.url);
    if (!['http:', 'https:'].includes(url.protocol)) return new Response('Offer unavailable', { status: 410 });
    const incoming = new URL(req.url);
    const leadId = incoming.searchParams.get('lead');
    const sessionId = incoming.searchParams.get('session');
    const db = getSupabaseAdmin();
    if (db) await db.from('clicks').insert({ offer_id: offer.id, lead_id: leadId || null, session_id: sessionId || null, referrer: req.headers.get('referer') || null });
    await logEvent('affiliate_click', { offerId: offer.id, leadId, sessionId }, getClientIp(req));
    return NextResponse.redirect(url, { status: 302, headers: { 'cache-control': 'private, no-store' } });
  } catch (error) {
    console.error('redirect route', error);
    return new Response('Offer unavailable', { status: 410 });
  }
}
