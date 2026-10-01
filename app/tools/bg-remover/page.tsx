import type { Metadata } from 'next';
import { ToolShell } from '@/components/tool-shell';
import { ToolWorkbench } from '@/components/tool-workbench';

export const metadata: Metadata = { title: 'Free background remover', description: 'Remove an image background with a free online background remover. Get a real cutout before the email gate.' };

export default function BgRemoverPage() { return <ToolShell eyebrow="Tool 02 / Image" title="Give the subject some room." description="Upload a real image and get a clean cutout you can download. Useful for product shots, profile images, and the assets that need to travel." slug="/tools/bg-remover" note="The value is the cutout. You do not need to explain your project before you see it."><ToolWorkbench mode="image" slug="bg-remover" label="Image to cut out" prompt="Upload an image" action="Remove background" /></ToolShell>; }
