import type { Rung } from '@/lib/types';

type Tier = Rung['tier'];

export const tierName = (tier: Tier) => tier.charAt(0).toUpperCase() + tier.slice(1);

/** CEFR labels as shown: Indonesian says "Pra-A1" for Pre-A1. */
export const cefrLabel = (cefr: string, lang: 'id' | 'en' = 'id') => (lang === 'id' ? cefr.replace(/^Pre-/, 'Pra-') : cefr);

/** "A1–A2−" for the rungs of one tier, in curriculum order. */
export function tierRange(rungs: Rung[], tier: Tier, lang: 'id' | 'en' = 'en'): string {
  const inTier = rungs.filter((r) => r.tier === tier);
  if (!inTier.length) return '';
  const first = cefrLabel(inTier[0].cefr, lang);
  const last = cefrLabel(inTier[inTier.length - 1].cefr, lang);
  return first === last ? first : `${first}–${last}`;
}
