import type { MetadataRoute } from 'next';
import { publicOrigin } from '@/lib/env';

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = publicOrigin();
  if (!origin) return [];
  const paths = ['', '/tools', '/tools/gpt-wrapper', '/tools/bg-remover', '/tools/upscaler', '/tools/headshot', '/tools/seo-audit', '/chat', '/privacy', '/terms'];
  return paths.map((path) => ({ url: `${origin}${path}`, lastModified: new Date(), changeFrequency: path === '' ? 'weekly' : 'monthly', priority: path === '' ? 1 : 0.7 }));
}
