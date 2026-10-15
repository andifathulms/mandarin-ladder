'use client';

import { useState } from 'react';
import * as store from '@/lib/progress/store';
import { DeckCard, type DeckWord } from './DeckCard';
import { IconClose } from '../ui/Icon';
import { useSettings, useT } from '../ProgressProvider';

type Props = { name: string; queue: DeckWord[]; onClose: () => void };

/** A deck session: the day's due cards then new ones, one at a time; ends with a one-line summary. */
export function DeckRunner({ name, queue, onClose }: Props) {
  const { t } = useT();
  const { deckFace } = useSettings();
  const [i, setI] = useState(0);
  const [known, setKnown] = useState(0);
  const done = i >= queue.length;

  const grade = (remembered: boolean) => {
    store.reviewCard(queue[i].id, remembered);
    if (remembered) setKnown((k) => k + 1);
    setI(i + 1);
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="flex flex-col gap-4" data-deck-runner>
      <div className="flex items-center justify-between gap-3">
        <span className="label text-muted">
          {name} · <span className="tnum">{Math.min(i + 1, queue.length)} / {queue.length}</span>
        </span>
        <button type="button" onClick={onClose} aria-label={t('deck.close')} className="flex h-[44px] w-[44px] items-center justify-center rounded-full text-ink hover:bg-paper-2">
          <IconClose />
        </button>
      </div>
      {done ? (
        <div className="card flex flex-col items-start gap-3 p-5" aria-live="polite">
          <p className="font-display text-h2 font-medium tnum">{t('deck.summary', { k: known, n: queue.length })}</p>
          <p className="text-muted">{t('deck.done')}</p>
          <button type="button" className="btn btn-primary" onClick={onClose}>
            {t('deck.back')}
          </button>
        </div>
      ) : (
        <DeckCard key={queue[i].id} word={queue[i]} face={deckFace} onGrade={grade} />
      )}
    </div>
  );
}
