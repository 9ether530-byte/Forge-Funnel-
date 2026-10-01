import Link from 'next/link';
import { ArrowUpRight, Check } from 'lucide-react';
import type { Offer } from '@/lib/affiliate/offers';

export function OfferCard({ offer, leadId, sessionId }: { offer: Offer & { score: number }; leadId?: string; sessionId?: string }) {
  const params = new URLSearchParams();
  if (leadId) params.set('lead', leadId);
  if (sessionId) params.set('session', sessionId);
  return <div className="rounded-3xl border border-line bg-ink p-5 transition hover:border-signal/60"><div className="flex items-start justify-between gap-4"><div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-signal">{offer.category} layer</p><h3 className="mt-3 text-lg font-semibold text-paper">{offer.name}</h3></div><span className="rounded-full bg-signal/10 px-3 py-1 font-mono text-xs text-signal">{offer.score} match</span></div><div className="mt-5 space-y-3 text-sm text-mist"><p className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-signal" />Fits the intent you shared.</p><p className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-signal" />Use it as the {offer.category} layer of your stack.</p></div><Link href={`/go/${offer.id}${params.size ? `?${params.toString()}` : ''}`} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-signal hover:text-white">See the {offer.category} option <ArrowUpRight className="size-4" /></Link></div>;
}
