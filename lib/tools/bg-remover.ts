import { runImageModel } from '@/lib/providers/replicate';
import { withAiGuard } from '@/lib/guard/with-guard';
import { removeBackgroundFallback } from './image-utils';

export async function runBackgroundRemoval(image: string, ip: string) {
  const result = await withAiGuard(`bg:${ip}`, 0.012, async () => runImageModel((process.env.REPLICATE_BG_MODEL || 'cjwbw/rembg').replace(/^$/, 'cjwbw/rembg') as `${string}/${string}`, { image }));
  if (result) return { imageUrl: result, mode: 'replicate' as const };
  return { imageUrl: await removeBackgroundFallback(image), mode: 'local' as const };
}
