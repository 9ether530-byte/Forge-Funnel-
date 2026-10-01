import type { Metadata } from 'next';
import { Badge } from '@/components/ui/badge';
import { ChatPanel } from '@/components/chat-panel';

export const metadata: Metadata = { title: 'Tool advisor', description: 'Answer a few focused questions and get a stack recommendation from approved categories.' };

export default function ChatPage({ searchParams }: { searchParams: { lead?: string; from?: string } }) { return <main className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24"><div className="mx-auto max-w-3xl text-center"><Badge tone="signal">Intent capture / Stack Builder</Badge><h1 className="mt-6 text-5xl font-semibold tracking-[-.06em] text-paper sm:text-7xl">Tell us what you’re trying to ship.</h1><p className="mt-6 text-lg leading-8 text-mist">Three questions max. No invented products. Just a focused set of categories matched to your stage, budget, and goal.</p></div><div className="mx-auto mt-14 max-w-3xl"><ChatPanel leadId={searchParams.lead} sourceTool={searchParams.from} /></div></main>; }
