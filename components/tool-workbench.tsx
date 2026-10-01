'use client';

import { useState } from 'react';
import { Check, Download, Loader2, Sparkles, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { GateAfterValue } from '@/components/gate-after-value';
import type { AuditResult } from '@/lib/types';

type Mode = 'text' | 'image' | 'audit';

export function ToolWorkbench({ mode, slug, label, prompt, action, styles }: { mode: Mode; slug: string; label: string; prompt: string; action: string; styles?: readonly string[] }) {
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');
  const [image, setImage] = useState('');
  const [style, setStyle] = useState(styles?.[0] || 'corporate');
  const [result, setResult] = useState<{ text?: string; imageUrl?: string; mode?: string; audit?: AuditResult } | null>(null);
  const [status, setStatus] = useState('');

  async function onFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { setStatus('Keep uploads under 2MB.'); return; }
    const reader = new FileReader();
    reader.onload = () => setImage(String(reader.result));
    reader.readAsDataURL(file);
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setStatus('Working the input…');
    setResult(null);
    let endpoint = '';
    let body: Record<string, string> = {};
    if (mode === 'text') { endpoint = '/api/gpt'; body = { text }; }
    if (mode === 'audit') { endpoint = '/api/audit'; body = { url }; }
    if (mode === 'image') {
      if (!image) { setStatus('Add an image first.'); return; }
      endpoint = slug === 'headshot' ? '/api/headshot' : slug === 'bg-remover' ? '/api/bg' : '/api/upscale';
      body = slug === 'headshot' ? { image, style } : { image };
    }
    try {
      const response = await fetch(endpoint, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
      const json = await response.json();
      if (!response.ok || !json.ok) { setStatus(json.error || 'That run did not complete.'); return; }
      setResult({ ...json.result, audit: mode === 'audit' ? json.result : undefined });
      setStatus('Result ready.');
    } catch { setStatus('Network error. Try again.'); }
  }

  return <div className="space-y-5"><Card className="overflow-hidden"><div className="border-b border-line bg-ink/60 px-6 py-4 sm:px-8"><div className="flex items-center justify-between"><div className="flex items-center gap-3"><span className="grid size-8 place-items-center rounded-xl bg-signal/10 text-signal"><Sparkles className="size-4" /></span><span className="font-mono text-[10px] uppercase tracking-[0.18em] text-mist">Input desk</span></div><Badge>{mode === 'image' ? '2MB max' : 'No signup'}</Badge></div></div><form onSubmit={submit} className="space-y-5 p-6 sm:p-8">{mode === 'text' && <Textarea value={text} onChange={(event) => setText(event.target.value)} required placeholder={prompt} aria-label={label} />}{mode === 'audit' && <Input type="url" value={url} onChange={(event) => setUrl(event.target.value)} required placeholder="https://your-site.com" aria-label="Website URL" />}{mode === 'image' && <><label className="flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-ink px-6 text-center transition hover:border-signal"><Upload className="mb-3 size-6 text-signal" /><span className="text-sm font-semibold text-paper">Upload an image</span><span className="mt-1 text-xs text-mist">PNG, JPG, or WEBP · under 2MB</span><input type="file" accept="image/*" className="sr-only" onChange={onFile} /></label>{image && <img src={image} alt="Selected source" className="max-h-48 rounded-2xl object-contain" />}{styles && <div><label className="mb-2 block text-xs font-mono uppercase tracking-[0.18em] text-mist">Style</label><div className="flex flex-wrap gap-2">{styles.map((item) => <button type="button" key={item} onClick={() => setStyle(item)} className={`rounded-full border px-3 py-2 text-xs capitalize transition ${style === item ? 'border-signal bg-signal/10 text-signal' : 'border-line text-mist hover:text-paper'}`}>{item}</button>)}</div></div>}</>}<div className="flex items-center justify-between gap-4"><span className="text-xs text-mist">{status || 'Your first run is free.'}</span><Button type="submit" disabled={status === 'Working the input…'}>{status === 'Working the input…' && <Loader2 className="mr-2 size-4 animate-spin" />}{action}</Button></div></form></Card>{result && <Card className="border-signal/30 bg-signal/[0.04] p-6 sm:p-8"><div className="flex items-center justify-between gap-4"><div><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-signal">Output delivered</p><h2 className="mt-2 text-xl font-semibold text-paper">Use this as your next move.</h2></div><Badge tone="signal">real result</Badge></div>{result.text && <p className="mt-6 whitespace-pre-wrap rounded-2xl border border-line bg-ink p-5 text-sm leading-7 text-paper">{result.text}</p>}{result.imageUrl && <div className="mt-6 space-y-3"><img src={result.imageUrl} alt="Processed result" className="max-h-[520px] w-full rounded-2xl bg-ink object-contain" /><a href={result.imageUrl} download={`${slug}-result.png`} className="inline-flex items-center gap-2 text-sm font-semibold text-signal hover:text-white"><Download className="size-4" />Download result</a></div>}{result.audit && <div className="mt-6 space-y-5"><div className="flex items-end gap-3"><span className="text-6xl font-semibold tracking-[-0.06em] text-signal">{result.audit.score}</span><span className="pb-2 font-mono text-xs uppercase tracking-[0.18em] text-mist">/ 100 audit score</span></div><div className="grid gap-2 sm:grid-cols-2">{result.audit.checks.map((check) => <div key={check.id} className="flex items-start gap-3 rounded-2xl border border-line bg-ink p-4"><Check className={`mt-0.5 size-4 shrink-0 ${check.pass ? 'text-signal' : 'text-ember'}`} /><div><p className="text-sm font-semibold text-paper">{check.label}</p><p className="mt-1 text-xs leading-5 text-mist">{check.detail}</p></div></div>)}</div>{result.audit.recommendations.length > 0 && <div><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mist">Recommended fixes</p><div className="mt-3 space-y-2">{result.audit.recommendations.map((item) => <div key={item.issue} className="rounded-2xl border border-line bg-ink p-4"><p className="text-sm font-semibold text-paper">{item.issue}</p><p className="mt-1 text-sm leading-6 text-mist">{item.fix}</p></div>)}</div></div>}</div>}<GateAfterValue sourceTool={slug} intent={result.audit ? { goal: 'Improve website SEO', keywords: result.audit.recommendations.map((item) => item.tool) } : undefined} /></Card>}</div>;
}
