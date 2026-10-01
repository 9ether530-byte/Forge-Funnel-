import sharp from 'sharp';
import { fetchPublicResource } from '@/lib/net-safe';

const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

export function parseImageInput(input: string) {
  if (input.startsWith('data:')) {
    const match = input.match(/^data:([^;]+);base64,(.+)$/);
    if (!match) throw new Error('BAD_IMAGE');
    const buffer = Buffer.from(match[2], 'base64');
    if (buffer.byteLength > MAX_IMAGE_BYTES) throw new Error('IMAGE_TOO_LARGE');
    return { buffer, mime: match[1] };
  }
  if (!/^https?:\/\//i.test(input)) throw new Error('BAD_IMAGE');
  return { url: input, mime: 'image/png' };
}

export async function getImageBuffer(input: string) {
  const parsed = parseImageInput(input);
  if ('buffer' in parsed) return parsed.buffer;
  try {
    return (await fetchPublicResource(parsed.url, MAX_IMAGE_BYTES, 15_000)).body;
  } catch (error) {
    if (error instanceof Error && error.message === 'URL_TOO_LARGE') throw new Error('IMAGE_TOO_LARGE');
    throw new Error('IMAGE_FETCH_FAILED');
  }
}

export function dataUrl(buffer: Buffer, mime = 'image/png') {
  return `data:${mime};base64,${buffer.toString('base64')}`;
}

export async function removeBackgroundFallback(input: string) {
  const source = await getImageBuffer(input);
  const { data, info } = await sharp(source).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const corner = [0, 1, 2].map((offset) => data[offset]);
  for (let i = 0; i < data.length; i += info.channels) {
    const distance = Math.abs(data[i] - corner[0]) + Math.abs(data[i + 1] - corner[1]) + Math.abs(data[i + 2] - corner[2]);
    if (distance < 70) data[i + 3] = 0;
  }
  const output = await sharp(data, { raw: info }).png().toBuffer();
  return dataUrl(output);
}

export async function upscaleFallback(input: string) {
  const output = await sharp(await getImageBuffer(input)).resize({ width: 1600, withoutEnlargement: false, fit: 'inside', kernel: sharp.kernel.lanczos3 }).png().toBuffer();
  return dataUrl(output);
}

export async function stylePortraitFallback(input: string, style: string) {
  const tint = style === 'cinematic' ? '#2b3547' : style === 'creative' ? '#4a2b46' : '#24352d';
  const output = await sharp(await getImageBuffer(input)).resize({ width: 1200, height: 1200, fit: 'cover' }).modulate({ saturation: style === 'corporate' ? 0.85 : 1.1, brightness: 1.02 }).tint(tint).png().toBuffer();
  return dataUrl(output);
}
