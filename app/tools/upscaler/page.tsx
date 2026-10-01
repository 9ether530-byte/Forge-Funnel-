import type { Metadata } from 'next';
import { ToolShell } from '@/components/tool-shell';
import { ToolWorkbench } from '@/components/tool-workbench';

export const metadata: Metadata = { title: 'Free image upscaler', description: 'Upscale a small image with a real downloadable result using the free image upscaler.' };

export default function UpscalerPage() { return <ToolShell eyebrow="Tool 03 / Image" title="Make a small asset usable." description="Upload a small image and turn it into a larger, sharper asset for a page, post, pitch, or internal deck." slug="/tools/upscaler" note="Good enough to keep moving is a real standard. Start with the source you have."><ToolWorkbench mode="image" slug="upscaler" label="Image to upscale" prompt="Upload an image" action="Upscale image" /></ToolShell>; }
