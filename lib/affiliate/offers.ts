import { env } from '@/lib/env';

export type Offer = {
  id: string;
  name: string;
  category: string;
  tags: string[];
  url: string;
  payout: number;
  minIntentScore: number;
};

const value = (name: string, fallback: string) => process.env[name] || fallback;

export const OFFERS: Offer[] = [
  { id: 'seo-suite', name: value('AFFILIATE_SEO_SUITE', 'SEO Suite'), category: 'seo', tags: ['seo', 'backlinks', 'rank', 'audit', 'keywords', 'traffic'], url: value('AFF_LINK_SEO_SUITE', 'https://example.com/seo'), payout: 120, minIntentScore: 40 },
  { id: 'design-suite', name: value('AFFILIATE_DESIGN_SUITE', 'Design Suite'), category: 'design', tags: ['design', 'graphics', 'social', 'template', 'brand', 'thumbnail'], url: value('AFF_LINK_DESIGN_SUITE', 'https://example.com/design'), payout: 45, minIntentScore: 25 },
  { id: 'hosting', name: value('AFFILIATE_HOSTING', 'Hosting Platform'), category: 'infra', tags: ['hosting', 'website', 'speed', 'deploy', 'server', 'wordpress'], url: value('AFF_LINK_HOSTING', 'https://example.com/hosting'), payout: 90, minIntentScore: 35 },
  { id: 'ai-api-credits', name: value('AFFILIATE_AI_PLATFORM', 'AI Platform'), category: 'ai', tags: ['ai', 'api', 'gpt', 'llm', 'automation', 'model'], url: value('AFF_LINK_AI_PLATFORM', 'https://example.com/ai'), payout: 60, minIntentScore: 30 },
  { id: 'stock-media', name: value('AFFILIATE_STOCK_MEDIA', 'Stock Media'), category: 'media', tags: ['photos', 'stock', 'images', 'video', 'assets', 'upscale'], url: value('AFF_LINK_STOCK_MEDIA', 'https://example.com/media'), payout: 35, minIntentScore: 20 },
  { id: 'pro-headshots', name: value('AFFILIATE_HEADSHOT_SVC', 'Headshot Service'), category: 'photo', tags: ['headshot', 'portrait', 'linkedin', 'photo', 'professional'], url: value('AFF_LINK_HEADSHOT_SVC', 'https://example.com/headshots'), payout: 55, minIntentScore: 30 },
  { id: 'email-platform', name: value('AFFILIATE_EMAIL_PLATFORM', 'Email Platform'), category: 'email', tags: ['email', 'newsletter', 'automation', 'funnel', 'crm', 'marketing'], url: value('AFF_LINK_EMAIL_PLATFORM', 'https://example.com/email'), payout: 70, minIntentScore: 30 },
  { id: 'course-platform', name: value('AFFILIATE_COURSE_PLATFORM', 'Course Platform'), category: 'education', tags: ['course', 'teach', 'sell', 'students', 'membership', 'content'], url: value('AFF_LINK_COURSE_PLATFORM', 'https://example.com/courses'), payout: 80, minIntentScore: 35 },
];

export function findOffer(id: string) { return OFFERS.find((offer) => offer.id === id); }
