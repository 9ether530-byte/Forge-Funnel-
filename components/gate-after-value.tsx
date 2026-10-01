'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export function GateAfterValue({ sourceTool, intent }: { sourceTool: string; intent?: Record<string, unknown> }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const router = useRouter();
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setStatus('Saving your result…');
    const response = await fetch('/api/lead', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email, sourceTool, intent }) });
    const json = await response.json();
    if (!response.ok || !json.next) { setStatus(json.error || 'Could not save that email. Try again.'); return; }
    router.push(json.next);
  }
  return <Card className="mt-6 border-dashed border-signal/40 bg-signal/[0.04] p-6 sm:p-8"><div className="flex items-start gap-4"><span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-signal text-ink"><Mail className="size-5" /></span><div className="flex-1"><p className="font-semibold text-paper">Want the full result and a smarter next step?</p><p className="mt-1 text-sm leading-6 text-mist">We’ll send the useful version, then help you shape the tool stack around what you’re actually building.</p><form onSubmit={submit} className="mt-5 flex flex-col gap-3 sm:flex-row"><Input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" aria-label="Email address" /><Button type="submit">{status || 'Continue'} <ArrowRight className="ml-2 size-4" /></Button></form>{status && status !== 'Saving your result…' && <p className="mt-3 text-xs text-ember">{status}</p>}<p className="mt-3 text-[11px] leading-5 text-mist">No spam. One useful follow-up. Unsubscribe anytime.</p></div></div></Card>;
}
