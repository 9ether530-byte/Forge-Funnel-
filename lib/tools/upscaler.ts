import { runImageModel } from '@/lib/providers/replicate';
import { withAiGuard } from '@/lib/guard/with-guard';
import { upscaleFallback } from './image-utils';

export async function runUpscaler(image: string, ip: string) {
  const result = await withAiGuard(`upscale:${ip}`, 0.012, async () => runImageModel((process.env.REPLICATE_UPSCALE_MODEL || 'nightmareai/real-esrgan').replace(/^$/, 'nightmareai/real-esrgan') as `${string}/${string}`, { image, scale: 2 }));
  if (result) return { imageUrl: result, mode: 'replicate' as const };
  return { imageUrl: await upscaleFallback(image), mode: 'local' as const };
}
