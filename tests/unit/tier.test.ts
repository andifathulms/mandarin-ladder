import { describe, expect, it } from 'vitest';
import { hskLabel, tierName, tierRange } from '@/components/ui/tier';
import type { Rung } from '@/lib/types';

const r = (id: string, tier: Rung['tier'], hsk: string) => ({ id, tier, hsk }) as Rung;
const rungs = [
  r('dasar-1', 'dasar', '—'),
  r('dasar-2', 'dasar', '—'),
  r('easy-1', 'easy', '1'),
  r('easy-2', 'easy', '2'),
  r('easy-3', 'easy', '3'),
  r('hard-1', 'hard', '7-9'),
  r('hard-2', 'hard', '7-9'),
];

describe('tier helpers', () => {
  it('spans the first to last HSK level in a tier', () => {
    expect(tierRange(rungs, 'easy')).toBe('HSK 1–3');
  });
  it('collapses a single level and uses an en dash', () => {
    expect(tierRange(rungs, 'hard')).toBe('HSK 7–9');
  });
  it('is empty for a tier with no rungs, and for Dasar', () => {
    expect(tierRange(rungs, 'medium')).toBe('');
    expect(tierRange(rungs, 'dasar')).toBe('');
  });
  it('labels HSK levels, and nothing for Dasar', () => {
    expect(hskLabel('1')).toBe('HSK 1');
    expect(hskLabel('7-9')).toBe('HSK 7–9');
    expect(hskLabel('—')).toBe('');
  });
  it('capitalises the tier name', () => {
    expect(tierName('medium')).toBe('Medium');
    expect(tierName('dasar')).toBe('Dasar');
  });
});
