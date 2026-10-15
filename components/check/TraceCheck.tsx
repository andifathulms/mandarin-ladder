'use client';

import type { CheckItem } from '@/lib/types';
import { ZhText } from '../zh/ZhText';

type Props = { item: Extract<CheckItem, { type: 'trace' }>; solved?: boolean; onDone: (misses: number) => void };

/**
 * trace items. The drawing pad and stroke matcher arrive with the stroke data (CLAUDE.md §7.5, M6);
 * until then the item shows its character and cannot be answered.
 */
export function TraceCheck({ item }: Props) {
  return (
    <ZhText className="tianzige flex h-[160px] w-[160px] items-center justify-center rounded-md bg-surface text-[6rem] leading-none text-rule">
      {item.char}
    </ZhText>
  );
}
