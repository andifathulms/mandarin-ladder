'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { CheckItem } from '@/lib/types';
import { drawReview } from '@/lib/check/draw';
import * as store from '@/lib/progress/store';
import { useProgress, useT } from '../ProgressProvider';
import { PageShell } from '../ui/PageShell';
import { BottomActionBar } from '../lesson/BottomActionBar';
import { IconArrowRight, IconClose, IconReview } from '../ui/Icon';
import { CheckItemView } from './CheckItemView';

type Props = { items: { item: CheckItem; lessonId: string }[] };

export function ReviewRunner({ items }: Props) {
  const { t } = useT();
  const progress = useProgress();
  const [run, setRun] = useState<{ items: CheckItem[]; i: number; solved: boolean; first: boolean[] } | null>(null);
  const [done, setDone] = useState<boolean[] | null>(null);

  const completed = Object.values(progress.lessons).filter((l) => l.completed).length;

  const start = () => {
    setDone(null);
    setRun({ items: drawReview(store.getState(), items), i: 0, solved: false, first: [] });
    window.scrollTo({ top: 0 });
  };

  if (!run) {
    return (
      <PageShell title={t('review.title')}>
        {done ? (
          <>
            <p className="font-display text-h2 font-medium tnum">
              {done.every(Boolean) ? t('review.summaryAll') : t('review.summary', { c: done.filter(Boolean).length, n: done.length })}
            </p>
            <div className="flex flex-wrap gap-2">
              <Link href="/" className="btn btn-primary no-underline">
                {t('review.done')}
              </Link>
              <button type="button" className="btn btn-quiet" onClick={start}>
                {t('review.again')}
              </button>
            </div>
          </>
        ) : completed < 2 ? (
          <div className="card flex flex-col items-start gap-3 p-5">
            <span className="flex h-[48px] w-[48px] items-center justify-center rounded-md bg-paper-2 text-muted">
              <IconReview size={24} />
            </span>
            <h2 className="text-h2">{t('review.emptyTitle')}</h2>
            <p className="max-w-measure text-muted">{t('review.empty')}</p>
            <Link href="/" className="btn btn-ghost no-underline">
              {t('review.done')}
            </Link>
          </div>
        ) : (
          <div className="card flex flex-col items-start gap-3 p-5">
            <span className="flex h-[48px] w-[48px] items-center justify-center rounded-md bg-accent-soft text-accent">
              <IconReview size={24} />
            </span>
            <h2 className="text-h2">{t('review.readyTitle')}</h2>
            <p className="max-w-measure text-muted">{t('review.intro')}</p>
            <button type="button" className="btn btn-primary" onClick={start}>
              {t('review.start')} <IconArrowRight />
            </button>
          </div>
        )}
      </PageShell>
    );
  }

  const item = run.items[run.i];
  const last = run.i === run.items.length - 1;
  return (
    <div className="flex min-h-[100dvh] flex-col">
      <header className="sticky top-0 z-10 border-b border-rule bg-surface">
        <div className="page flex max-w-lesson items-center justify-between gap-3 py-2">
          <span className="label text-muted">{t('review.title')}</span>
          <span className="flex items-center gap-2">
            <span className="label tnum text-muted">
              {run.i + 1} / {run.items.length}
            </span>
            {/* An exit while running (fixes English Ladder issue 3); answers given stay recorded. */}
            <button
              type="button"
              aria-label={t('review.close')}
              title={t('review.closeConfirm')}
              onClick={() => {
                setDone(run.first.length ? run.first : null);
                setRun(null);
              }}
              className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full text-ink hover:bg-paper-2"
            >
              <IconClose />
            </button>
          </span>
        </div>
      </header>
      <main className="flex-1 py-5 sm:py-7">
        <div className="page max-w-lesson sm:rounded-lg sm:bg-surface sm:px-7 sm:py-7 sm:shadow-e2">
          <CheckItemView
            key={item.id}
            mode="practice"
            item={item}
            whyInSheet
            onSolved={(firstTry) => {
              store.recordAnswer(item.id, firstTry);
              setRun({ ...run, solved: true, first: [...run.first, firstTry] });
            }}
          />
        </div>
      </main>
      <BottomActionBar feedback={run.solved ? item.why : null}>
        <button
          type="button"
          className={`btn w-full max-w-[360px] ${run.solved ? 'btn-good' : 'btn-primary'}`}
          disabled={!run.solved}
          onClick={() => {
            if (last) {
              setDone(run.first);
              setRun(null);
            } else setRun({ ...run, i: run.i + 1, solved: false });
          }}
        >
          {last ? t('test.finish') : t('lesson.next')} <IconArrowRight />
        </button>
      </BottomActionBar>
    </div>
  );
}
