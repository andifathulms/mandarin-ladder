import type { Rung } from '@/lib/types';

type Tier = Rung['tier'];

export const tierName = (tier: Tier) => tier.charAt(0).toUpperCase() + tier.slice(1);

/** "HSK 1", "HSK 7–9"; the Dasar rungs have no HSK level and no label. */
export const hskLabel = (hsk: string): string => (hsk === '—' ? '' : `HSK ${hsk.replace('-', '–')}`);

/** "HSK 1–3" for the rungs of one tier, in curriculum order; empty for Dasar. */
export function tierRange(rungs: Rung[], tier: Tier): string {
  const inTier = rungs.filter((r) => r.tier === tier && r.hsk !== '—');
  if (!inTier.length) return '';
  const first = inTier[0].hsk;
  const last = inTier[inTier.length - 1].hsk;
  return first === last ? hskLabel(first) : `HSK ${first}–${last.replace('-', '–')}`;
}
