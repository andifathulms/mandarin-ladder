'use client';

import type { CheckItem } from '@/lib/types';
import * as store from '@/lib/progress/store';
import { CheckItemView } from './CheckItemView';
import { useT } from '../ProgressProvider';

type Props = {
  items: CheckItem[];
  index: number;
  solved: boolean[];
  onSolved: (index: number) => void;
};

/** One check item at a time with a small counter. */
export function CheckStep({ items, index, solved, onSolved }: Props) {
  const { t } = useT();
  const item = items[index];
  return (
    <div className="flex flex-col gap-4">
      <p className="text-small font-bold tnum text-muted">{t('check.counter', { n: index + 1, total: items.length })}</p>
      <CheckItemView
        key={item.id}
        mode="practice"
        item={item}
        solved={solved[index]}
        whyInSheet
        onSolved={(firstTry) => {
          store.recordAnswer(item.id, firstTry);
          onSolved(index);
        }}
      />
    </div>
  );
}
