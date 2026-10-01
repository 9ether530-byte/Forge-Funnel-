import { runImageModel } from '@/lib/providers/replicate';
import { withAiGuard } from '@/lib/guard/with-guard';
import { stylePortraitFallback } from './image-utils';

export const HEADSHOT_STYLES = ['corporate', 'creative', 'linkedin', 'cinematic'] as const;
export type HeadshotStyle = typeof HEADSHOT_STYLES[number];

export async function runHeadshot(image: string, style: HeadshotStyle, ip: string) {
  const result = await withAiGuard(`headshot:${ip}`, 0.02, async () => runImageModel((process.env.REPLICATE_HEADSHOT_MODEL || 'stability-ai/sdxl').replace(/^$/, 'stability-ai/sdxl') as `${string}/${string}`, { image, prompt: `professional ${style} headshot, clean lighting, natural expression`, num_outputs: 1 }));
  if (result) return { imageUrl: result, mode: 'replicate' as const };
  return { imageUrl: await stylePortraitFallback(image, style), mode: 'local' as const };
}
