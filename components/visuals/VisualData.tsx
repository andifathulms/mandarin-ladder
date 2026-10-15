'use client';

import { createContext, useContext } from 'react';
import type { HanziCard, MeasureWord, Radical } from '@/lib/types';

/** One syllable of the pinyin table with the tones that exist (and so may be recorded). */
export type SyllableRow = { b: string; i: string; f: string; t: number[] };

export type VisualDataValue = {
  syllables: SyllableRow[];
  measureWords: MeasureWord[];
  radicals: Radical[];
  /** Parts and notes for characters the page's visuals show. */
  hanzi: Record<string, HanziCard>;
};

const EMPTY: VisualDataValue = { syllables: [], measureWords: [], radicals: [], hanzi: {} };
const Ctx = createContext<VisualDataValue>(EMPTY);

/** Data for visuals, read at build time and handed down by the page. */
export function VisualDataProvider({ value, children }: { value: VisualDataValue; children: React.ReactNode }) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useVisualData(): VisualDataValue {
  return useContext(Ctx);
}
