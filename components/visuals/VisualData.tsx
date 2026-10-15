'use client';

import { createContext, useContext } from 'react';
import type { Letter, MakhrajPoint } from '@/lib/types';

export type VisualDataValue = { letters: Letter[]; makhraj: MakhrajPoint[] };

const Ctx = createContext<VisualDataValue>({ letters: [], makhraj: [] });

/** Letter and makhraj data for visuals, read at build time and handed down by the page. */
export function VisualDataProvider({ value, children }: { value: VisualDataValue; children: React.ReactNode }) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useVisualData(): VisualDataValue {
  return useContext(Ctx);
}
