'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Rung } from '@/lib/types';
import { sfx } from '@/lib/speech/sfx';
import { rungHref } from '@/lib/routes';
import { useReducedMotion, useT } from '../ProgressProvider';
import { NotchBar } from '../ladder/NotchBar';
import { Grid } from '../ui/Grid';
import { ZhText } from '../zh/ZhText';
import { Accented } from '../ladder/ContinueCard';

type Props = { rung: Rung; next: Rung | null; onReview: () => void };

/** The one celebratory moment in the app (DESIGN §6.7). */
export function ClimbMoment({ rung, next, onReview }: Props) {
  const { t, lang } = useT();
  const reduced = useReducedMotion();
  const [climbed, setClimbed] = useState(false);

  useEffect(() => {
    sfx('climbed');
    const id = requestAnimationFrame(() => setClimbed(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const ROW = 76;
  return (
    <div
      className="fixed inset-0 z-30 overflow-y-auto bg-board text-board-ink"
      role="dialog"
      aria-modal="true"
      aria-labelledby="climb-title"
    >
      <Grid />
      <div className="page relative flex min-h-full max-w-lesson flex-col justify-center gap-7 py-8">
        {/* Ladder fragment: this rung and the next */}
        <div className="relative mx-auto w-full max-w-[340px] px-[18px]" style={{ height: ROW * 2 + 16 }} aria-hidden>
          <span className="absolute bottom-0 start-[4px] top-0 w-[6px] rounded-full" style={{ background: 'var(--wood)' }} />
          <span className="absolute bottom-0 end-[4px] top-0 w-[6px] rounded-full" style={{ background: 'var(--wood)' }} />
          {[next, rung].map((r, i) => (
            <div
              key={r?.id ?? 'next'}
              className="absolute start-[18px] end-[18px] flex items-center justify-between gap-3 rounded-sm px-3"
              style={{
                top: 8 + i * ROW,
                height: ROW - 16,
                background: i === 1 ? 'var(--board-2)' : 'transparent',
                boxShadow: i === 1 && climbed ? '0 0 0 3px var(--rung)' : 'none',
                transition: reduced ? 'box-shadow var(--m-quick-d) linear' : 'box-shadow var(--m-moment-d) var(--ease-moment)',
              }}
            >
              <span className="font-display text-card font-medium text-board-ink">{r?.name ?? ''}</span>
              {i === 1 && (
                <span style={{ opacity: climbed ? 1 : 0, transition: `opacity var(--m-moment-d) var(--ease-moment)` }}>
                  <NotchBar total={rung.lessons} done={rung.lessons} climbed />
                </span>
              )}
              <span
                className="absolute -bottom-[10px] -start-[14px] -end-[14px] h-[4px] rounded-full"
                style={{ background: i === 1 && climbed ? 'var(--rung)' : 'var(--wood-dark)', transition: 'background var(--m-moment-d) var(--ease-moment)' }}
              />
            </div>
          ))}
          <span
            className="absolute -start-[15px] h-0 w-0 border-y-[8px] border-s-[12px] border-y-transparent"
            style={{
              borderInlineStartColor: 'var(--brass)',
              top: 8 + (ROW - 16) / 2 - 8 + (climbed ? 0 : ROW),
              transition: reduced ? 'none' : 'top var(--m-moment-d) var(--ease-moment)',
            }}
          />
        </div>

        <div className="flex flex-col items-center gap-3 text-center">
          <ZhText as="p" className="text-center text-zh-body text-brass">
            {rung.name_zh.zh.replace(/\s+/g, '')}
          </ZhText>
          {/* Translated, not English (fixes English Ladder issue 13). */}
          <h1 id="climb-title" className="text-hero text-board-ink" lang={lang}>
            {t('climb.title', { rung: rung.name })}
          </h1>
          <p className="font-display text-h2 text-board-ink">
            <Accented text={t('climb.line')} />
          </p>
          {/* 一步一步 yí bù yí bù: step by step (DESIGN §6.9). */}
          <p className="flex flex-col items-center gap-1 text-board-muted">
            <ZhText className="text-zh-body">一步一步</ZhText>
            <span lang="zh-Latn-pinyin" className="text-small">
              yí bù yí bù
            </span>
          </p>
        </div>

        <div className="flex flex-col items-center gap-3">
          {next && next.status === 'live' ? (
            <Link href={rungHref(next.id)} className="btn btn-board no-underline">
              {t('climb.next', { rung: next.name })}
            </Link>
          ) : next ? (
            <p className="label text-board-muted">{t('climb.nextSoon', { rung: next.name })}</p>
          ) : null}
          <Link href="/" className="btn btn-board no-underline">
            {t('climb.viewLadder')}
          </Link>
          <button type="button" className="btn text-board-ink hover:bg-board-2" onClick={onReview}>
            {t('test.reviewTitle')}
          </button>
        </div>
      </div>
    </div>
  );
}
