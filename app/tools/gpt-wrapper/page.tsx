import type { Metadata } from 'next';
import { ToolShell } from '@/components/tool-shell';
import { ToolWorkbench } from '@/components/tool-workbench';

export const metadata: Metadata = { title: 'AI text rewriter', description: 'Rewrite rough copy into clear, persuasive text with a free AI text rewriter.' };

export default function GptWrapperPage() { return <ToolShell eyebrow="Tool 01 / Text" title="Make rough copy easier to use." description="Paste the sentence, note, or messy draft that is holding you up. Get a cleaner version you can actually put to work." slug="/tools/gpt-wrapper" note="A narrow prompt beats a sprawling one. This wrapper is built for useful text, not a conversation about text."><ToolWorkbench mode="text" slug="gpt-wrapper" label="Text to rewrite" prompt="Paste a rough email, landing page line, or idea here…" action="Rewrite my text" /></ToolShell>; }
