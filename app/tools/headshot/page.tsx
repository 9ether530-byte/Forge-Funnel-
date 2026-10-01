import type { Metadata } from 'next';
import { ToolShell } from '@/components/tool-shell';
import { ToolWorkbench } from '@/components/tool-workbench';

export const metadata: Metadata = { title: 'AI headshot generator', description: 'Create a polished professional headshot variation from your own source image.' };

export default function HeadshotPage() { return <ToolShell eyebrow="Tool 04 / Portrait" title="Show up like you mean it." description="Start with a source photo and choose a direction. Get a real portrait result you can use for a profile, team page, or first introduction." slug="/tools/headshot" note="A good headshot is a small signal that the rest of the system is cared for."><ToolWorkbench mode="image" slug="headshot" label="Source photo" prompt="Upload a source photo" action="Create headshot" styles={['corporate', 'creative', 'linkedin', 'cinematic']} /></ToolShell>; }
