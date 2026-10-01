'use client';

import { useState } from 'react';
import { ArrowRight, Bot, Loader2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { OfferCard } from '@/components/offer-card';

type Message = { role: 'user' | 'assistant'; content: string };
type Recommendation = { id: string; name: string; category: string; tags: string[]; url: string; payout: number; minIntentScore: number; score: number };

export function ChatPanel({ leadId, sourceTool }: { leadId?: string; sourceTool?: string }) {
  const [messages, setMessages] = useState<Message[]>([{ role: 'assistant', content: sourceTool ? `You used ${sourceTool}. What are you building next?` : 'What are you building, and what would a useful first result look like?' }]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState<string>();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [status, setStatus] = useState('');
  async function send(event: React.FormEvent) {
    event.preventDefault();
    if (!input.trim()) return;
    const nextMessages = [...messages, { role: 'user' as const, content: input.trim() }];
    setMessages(nextMessages); setInput(''); setStatus('Thinking…');
    const response = await fetch('/api/chat', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ leadId, sessionId, message: input.trim(), messages }) });
    const json = await response.json();
    if (!response.ok || !json.ok) { setStatus(json.error || 'Try that again.'); return; }
    setSessionId(json.sessionId); setMessages([...nextMessages, { role: 'assistant', content: json.reply }]); setRecommendations(json.recommendations || []); setStatus(json.ready ? 'Stack ready.' : '');
  }
  const ready = recommendations.length > 0;
  return <div className="space-y-5"><Card className="overflow-hidden"><div className="flex items-center gap-3 border-b border-line bg-ink/60 px-6 py-4 sm:px-8"><span className="grid size-8 place-items-center rounded-xl bg-signal/10 text-signal"><Bot className="size-4" /></span><div><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mist">Advisor online</p><p className="text-sm font-semibold text-paper">Three questions max. Categories only.</p></div></div><div className="space-y-4 p-6 sm:p-8">{messages.map((message, index) => <div key={`${message.role}-${index}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${message.role === 'user' ? 'bg-signal text-ink' : 'border border-line bg-ink text-mist'}`}>{message.content}</div></div>)}<form onSubmit={send} className="flex gap-2 border-t border-line pt-5"><Input value={input} disabled={ready} onChange={(event) => setInput(event.target.value)} placeholder={ready ? 'Stack ready — choose a category below.' : 'Tell me what you’re trying to ship…'} aria-label="Message the tool advisor" /><Button type="submit" disabled={ready || status === 'Thinking…'}>{status === 'Thinking…' ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}<span className="sr-only">Send</span></Button></form>{status && <p className="text-xs text-mist">{status}</p>}</div></Card>{recommendations.length > 0 && <section><div className="mb-5 flex items-end justify-between"><div><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-signal">Stack Builder</p><h2 className="mt-2 text-2xl font-semibold text-paper">Your recommended stack</h2></div><span className="text-xs text-mist">Matched from approved offers</span></div><div className="grid gap-4 md:grid-cols-2">{recommendations.map((offer) => <OfferCard key={offer.id} offer={offer} leadId={leadId} sessionId={sessionId} />)}</div><p className="mt-5 text-xs leading-5 text-mist">Recommendations are selected from our approved partner catalog. We may earn a commission if you choose one.</p></section>}</div>;
}
