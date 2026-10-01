'use client';

import { useState } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { OfferCard } from '@/components/offer-card';
import type { Intent } from '@/lib/types';

type Recommendation = { id: string; name: string; category: string; tags: string[]; url: string; payout: number; minIntentScore: number; score: number };

export function StackBuilder() {
  const [goal, setGoal] = useState('');
  const [stage, setStage] = useState<Intent['stage']>('building');
  const [budget, setBudget] = useState<Intent['budget']>('cheap');
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  async function build(event: React.FormEvent) {
    event.preventDefault(); setLoading(true);
    const response = await fetch('/api/stack', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ intent: { goal, stage, budget } }) });
    const json = await response.json();
    if (response.ok) setRecommendations(json.recommendations);
    setLoading(false);
  }
  return <div className="space-y-6"><Card className="p-6 sm:p-8"><form onSubmit={build} className="space-y-5"><div><label className="mb-2 block text-xs font-mono uppercase tracking-[0.18em] text-mist">What are you building?</label><Input value={goal} onChange={(event) => setGoal(event.target.value)} required placeholder="A lean content funnel for my consulting practice" /></div><div className="grid gap-5 sm:grid-cols-2"><div><label className="mb-2 block text-xs font-mono uppercase tracking-[0.18em] text-mist">Stage</label><select value={stage} onChange={(event) => setStage(event.target.value as Intent['stage'])} className="min-h-12 w-full rounded-2xl border border-line bg-ink px-4 text-sm text-paper outline-none focus:border-signal"><option value="idea">Idea</option><option value="building">Building</option><option value="launched">Launched</option><option value="scaling">Scaling</option></select></div><div><label className="mb-2 block text-xs font-mono uppercase tracking-[0.18em] text-mist">Budget</label><select value={budget} onChange={(event) => setBudget(event.target.value as Intent['budget'])} className="min-h-12 w-full rounded-2xl border border-line bg-ink px-4 text-sm text-paper outline-none focus:border-signal"><option value="free">Free first</option><option value="cheap">Lean paid</option><option value="pro">Pro stack</option><option value="enterprise">Enterprise</option></select></div></div><Button type="submit" disabled={loading}>{loading ? <Loader2 className="mr-2 size-4 animate-spin" /> : <ArrowRight className="mr-2 size-4" />}Build my stack</Button></form></Card>{recommendations.length > 0 && <div className="grid gap-4 md:grid-cols-2">{recommendations.map((offer) => <OfferCard key={offer.id} offer={offer} />)}</div>}</div>;
}
