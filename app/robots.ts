import type { MetadataRoute } from 'next';
import { publicOrigin } from '@/lib/env';

export default function robots(): MetadataRoute.Robots {
  const origin = publicOrigin();
  return { rules: { userAgent: '*', allow: '/', disallow: ['/api/'] }, ...(origin ? { sitemap: `${origin}/sitemap.xml` } : {}) };
}
