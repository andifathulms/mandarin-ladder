'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import type { CheckItem, LessonSummary, Placement, Rung } from '@/lib/types';
import type { Response } from '@/lib/check/grade';
import { grade } from '@/lib/check/grade';
import { answerText } from '@/lib/check/text';
import { SECTIONS, scorePlacement, type PlacementScore } from '@/lib/check/placement';
import * as store from '@/lib/progress/store';
import { lessonHref, rungHref } from '@/lib/routes';
import { useT } from '../ProgressProvider';
import { IconArrowLeft, IconArrowRight, IconCheck, IconClose } from '../ui/Icon';
import { BottomActionBar } from '../lesson/BottomActionBar';
import { QuestionBar } from '../lesson/QuestionBar';
import { CheckItemView } from './CheckItemView';
import { WhyLine } from './WhyLine';
import { ArIsland } from '../ar/ArIsland';
import { ZhText } from '../zh/ZhText';
import { LessonTextProvider } from '../ar/LessonText';

type Props = { placement: Placement; rungs: Rung[]; lessons: LessonSummary[] };
type Phase = { kind: 'intro' } | { kind: 'run'; i: number } | { kind: 'result'; score: PlacementScore; review: boolean };

const show = (r: Response | undefined) => (r === undefined ? '—' : Array.isArray(r) ? r.join(' ') : r);

/**
 * Cek dasar (PRD §5.2, DESIGN §6.10): 20 items, no feedback until the end, then a placement.
 * Built on the rung test's frame. Placement never plays the climb moment and never un-climbs.
 */
export function PlacementRunner({ placement, rungs, lessons }: Props) {
  const { t } = useT();
  const [phase, setPhase] = useState<Phase>({ kind: 'intro' });
  const [answers, setAnswers] = useState<Record<string, Response>>({});
  const resultRef = useRef<HTMLHeadingElement>(null);
  const items = placement.items as CheckItem[];

  const start = () => {
    setAnswers({});
    setPhase({ kind: 'run', i: 0 });
    window.scrollTo({ top: 0 });
  };
  const finish = () => {
    const score = scorePlacement(placement, answers);
    store.applyPlacement({ score: score.score, total: score.total, result: score.result, missed: score.missed });
    setPhase({ kind: 'result', score, review: false });
    window.scrollTo({ top: 0 });
    requestAnimationFrame(() => resultRef.current?.focus());
  };

  const header = (n: number | null) => (
    <header className="sticky top-0 z-10 border-b border-rule bg-surface">
      <div className="page flex max-w-lesson items-center gap-3 py-2">
        <Link href="/" aria-label={t('nav.back')} className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full text-ink hover:bg-paper-2">
          <IconArrowLeft />
        </Link>
        <span className="label shrink-0 text-muted">{t('placement.title')}</span>
        <span className="flex-1" />
        {n !== null && (
          <span className="label tnum text-muted">
            {n + 1} / {items.length}
          </span>
        )}
        <Link href="/" aria-label={t('lesson.close')} className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full text-ink hover:bg-paper-2">
          <IconClose />
        </Link>
      </div>
    </header>
  );

  if (phase.kind === 'intro') {
    const prev = store.getState().placement;
    return (
      <div className="flex min-h-[100dvh] flex-col">
        {header(null)}
        <main className="page flex max-w-lesson flex-1 flex-col gap-5 py-7">
          <p className="eyebrow">{t('placement.eyebrow')}</p>
          <h1 className="text-h1">{t('placement.title')}</h1>
          <p className="max-w-measure">{t('placement.intro')}</p>
          <ul className="flex flex-col gap-1 text-small text-muted">
            {SECTIONS.map((s) => (
              <li key={s}>· {t(`placement.section.${s}`)}</li>
            ))}
          </ul>
          {prev && <p className="label tnum text-muted">{t('placement.last', { n: prev.score, total: prev.total })}</p>}
        </main>
        <BottomActionBar>
          <button type="button" className="btn btn-primary w-full max-w-[360px]" onClick={start}>
            {t('placement.start')} <IconArrowRight />
          </button>
        </BottomActionBar>
      </div>
    );
  }

  if (phase.kind === 'run') {
    const i = phase.i;
    const item = items[i];
    const last = i === items.length - 1;
    const a = answers[item.id];
    const need = item.type === 'order' ? item.tiles.length : item.type === 'spell' ? item.letters.length : 0;
    const answered = a !== undefined && (!Array.isArray(a) || a.length === need);
    return (
      <div className="flex min-h-[100dvh] flex-col">
        {header(i)}
        <main className="flex-1 py-5 sm:py-7">
          <div className="page max-w-lesson sm:rounded-lg sm:bg-surface sm:px-7 sm:py-7 sm:shadow-e2">
            <div className="mb-5">
              <QuestionBar n={i + 1} total={items.length} />
            </div>
            <p className="sr-only" aria-live="polite">
              {t('test.progress', { n: i + 1, total: items.length })}
            </p>
            {/* Reading is what's being checked: no transliteration anywhere. */}
            <LessonTextProvider harakat="full" showTranslit={false}>
              <CheckItemView key={item.id} mode="test" item={item} value={a} onChange={(r) => setAnswers((x) => ({ ...x, [item.id]: r }))} />
            </LessonTextProvider>
          </div>
        </main>
        <BottomActionBar>
          {i > 0 && (
            <button type="button" className="btn btn-quiet" onClick={() => setPhase({ kind: 'run', i: i - 1 })}>
              <IconArrowLeft />
              <span className="sr-only">{t('lesson.prev')}</span>
            </button>
          )}
          <button
            type="button"
            className="btn btn-primary w-full max-w-[360px]"
            disabled={!answered}
            onClick={() => (last ? finish() : setPhase({ kind: 'run', i: i + 1 }))}
          >
            {last ? t('test.finish') : t('lesson.next')} <IconArrowRight />
          </button>
        </BottomActionBar>
      </div>
    );
  }

  // Results
  const { score } = phase;
  const placed = rungs.find((r) => r.id === score.result)!;
  const first = lessons.filter((l) => l.rung === placed.id).sort((a, b) => a.order - b.order)[0];
  const fragment = ['easy-1', 'dasar-2', 'dasar-1'].map((id) => rungs.find((r) => r.id === id)).filter(Boolean) as Rung[];

  return (
    <div className="flex min-h-[100dvh] flex-col">
      {header(null)}
      <main className="page flex max-w-lesson flex-1 flex-col gap-6 py-7">
        <h1 ref={resultRef} tabIndex={-1} className="tnum text-hero outline-none">
          {score.score} / {score.total}
        </h1>
        <p className="font-display text-h2 font-medium">{t(`placement.result.${score.result}`)}</p>

        <ol className="card flex flex-col p-3" aria-label={t('home.ladder')}>
          {fragment.map((r) => {
            const here = r.id === placed.id;
            return (
              <li
                key={r.id}
                aria-current={here ? 'step' : undefined}
                className={`flex min-h-[48px] items-center justify-between gap-3 rounded-md px-3 ${here ? 'bg-accent-soft' : ''}`}
              >
                <span className="flex items-baseline gap-2">
                  <span className="font-display font-semibold">{r.name}</span>
                  <ZhText face="ui" className="text-zh-small leading-none text-muted">
                    {r.name_zh.zh.replace(/\s+/g, '')}
                  </ZhText>
                </span>
                {here ? (
                  <span className="label text-accent">● {t('home.youAreHere')}</span>
                ) : store.getState().rungs[r.id]?.climbed ? (
                  <span className="label text-muted">{t('rung.viaPlacement')}</span>
                ) : null}
              </li>
            );
          })}
        </ol>

        <ul className="grid grid-cols-2 gap-2 min-[640px]:grid-cols-4">
          {SECTIONS.map((s) => (
            <li key={s} className="card flex flex-col gap-1 px-3 py-2">
              <span className="label text-muted">{t(`placement.sectionShort.${s}`)}</span>
              <span className="font-display text-h2 tnum">
                {score.bySection[s].score}/{score.bySection[s].total}
              </span>
            </li>
          ))}
        </ul>

        {phase.review && (
          <section className="flex flex-col gap-3">
            <h2 className="text-h2">{t('test.reviewTitle')}</h2>
            <ul className="flex flex-col gap-3">
              {items.map((item) => {
                const ok = answers[item.id] !== undefined && grade(item, answers[item.id]).correct;
                return (
                  <li key={item.id} className="card flex flex-col gap-2 p-4">
                    <p className="flex items-start gap-2">
                      {ok ? <IconCheck className="mt-1 shrink-0 text-good" /> : <IconClose className="mt-1 shrink-0 text-off" />}
                      <span className="sr-only">{ok ? t('check.correct') : t('check.wrong')}</span>
                      <ArIsland className="text-ar-body">{answerText(item)}</ArIsland>
                    </p>
                    {!ok && (
                      <p className="text-small">
                        <span className="text-muted">{t('test.yourAnswer')}: </span>
                        <span className="off-text">{show(answers[item.id])}</span>
                      </p>
                    )}
                    <WhyLine why={item.why} />
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </main>
      <BottomActionBar>
        {first && (
          <Link href={lessonHref(first)} className="btn btn-primary no-underline">
            {t('placement.startRung', { rung: placed.name })} <IconArrowRight />
          </Link>
        )}
        {!first && (
          <Link href={rungHref(placed.id)} className="btn btn-primary no-underline">
            {placed.name} <IconArrowRight />
          </Link>
        )}
        <button type="button" className="btn btn-quiet" onClick={() => setPhase({ ...phase, review: !phase.review })}>
          {t('placement.seeAnswers')}
        </button>
      </BottomActionBar>
    </div>
  );
}
