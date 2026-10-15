import { describe, expect, it } from 'vitest';
import { tierName, tierRange } from '@/components/ui/tier';
import type { Rung } from '@/lib/types';

const r = (id: string, tier: Rung['tier'], cefr: string) => ({ id, tier, cefr }) as Rung;
const rungs = [r('easy-1', 'easy', 'A1'), r('easy-2', 'easy', 'A1'), r('easy-3', 'easy', 'A2−'), r('hard-1', 'hard', 'B2')];

describe('tier helpers', () => {
  it('spans the first to last CEFR in a tier', () => {
    expect(tierRange(rungs, 'easy')).toBe('A1–A2−');
  });
  it('collapses a single level', () => {
    expect(tierRange(rungs, 'hard')).toBe('B2');
  });
  it('is empty for a tier with no rungs', () => {
    expect(tierRange(rungs, 'medium')).toBe('');
  });
  it('capitalises the tier name', () => {
    expect(tierName('medium')).toBe('Medium');
  });
});

describe('Huruf tier', () => {
  it('names the tier and says Pra-A1 in Indonesian', () => {
    const h = [r('huruf-1', 'huruf', 'Pre-A1'), r('huruf-2', 'huruf', 'Pre-A1')];
    expect(tierName('huruf')).toBe('Huruf');
    expect(tierRange(h, 'huruf', 'id')).toBe('Pra-A1');
    expect(tierRange(h, 'huruf', 'en')).toBe('Pre-A1');
  });
});
