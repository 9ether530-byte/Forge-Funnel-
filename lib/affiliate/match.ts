import { OFFERS, type Offer } from './offers';
import type { Intent } from '@/lib/types';

export function scoreOffer(offer: Offer, intent: Intent) {
  let score = 0;
  const haystack = [intent.goal ?? '', ...(intent.skills ?? []), ...(intent.keywords ?? [])].join(' ').toLowerCase();
  for (const tag of offer.tags) if (haystack.includes(tag)) score += 18;
  if (intent.stage === 'scaling' && offer.payout > 70) score += 15;
  if (intent.stage === 'idea' && offer.payout < 50) score += 10;
  if (intent.budget === 'free' && offer.payout > 80) score -= 10;
  score += Math.min(offer.payout / 10, 12);
  return Math.max(0, Math.round(score));
}

export function matchOffers(intent: Intent, limit = 4) {
  const scored = OFFERS.map((offer) => ({ ...offer, score: scoreOffer(offer, intent) })).sort((a, b) => b.score - a.score);
  const matched = scored.filter((offer) => offer.score >= offer.minIntentScore).slice(0, limit);
  return matched.length > 0 ? matched : scored.slice(0, Math.min(2, limit));
}
