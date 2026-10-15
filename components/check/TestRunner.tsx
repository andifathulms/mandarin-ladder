'use client';

import Link from 'next/link';
import { useMemo, useRef, useState } from 'react';
import type { CheckItem, LessonSummary, Rung, TestPool } from '@/lib/types';
import { drawTest } from '@/lib/check/draw';
import { grade, type Response } from '@/lib/check/grade';
import { newSeed } from '@/lib/check/random';
import { answerText } from '@/lib/check/text';
import * as store from '@/lib/progress/store';
import { lessonHref, rungHref } from '@/lib/routes';
import { useProgress, useT } from '../ProgressProvider';
import { IconArrowLeft, IconArrowRight, IconCheck, IconClose } from '../ui/Icon';
import { BottomActionBar } from '../lesson/BottomActionBar';
import { QuestionBar } from '../lesson/QuestionBar';
import { CheckItemView } from './CheckItemView';
import { ClimbMoment } from './ClimbMoment';
import { WhyLine } from './WhyLine';

type Props = { rung: Rung; next: Rung | null; pool: TestPool; lessons: LessonSummary[] };

type Phase = { kind: 'intro' } | { kind: 'run'; i: number } | { kind: 'result'; climb: boolean };

const show = (r: Response | undefined) => (r === undefined ? '—' : Array.isArray(r) ? r.join(' ') : r);

export function TestRunner({ rung, next, pool, lessons }: Props) {
  const { t, lang } = useT();
  const progress = useProgress();
  const [phase, setPhase] = useState<Phase>({ kind: 'intro' });
  const [seed, setSeed] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Response>>({});
  const items = useMemo(() => (seed ? drawTest(pool.items, seed, pool.draw) : []), [pool, seed]);
  const resultRef = useRef<HTMLHeadingElement>(null);

  const start = () => {
    setSeed(newSeed());
    setAnswers({});
    setPhase({ kind: 'run', i: 0 });
    window.scrollTo({ top: 0 });
  };

  const results = items.map((item) => ({ item, given: answers[item.id], ok: answers[item.id] !== undefined && grade(item, answers[item.id]).correct }));
  const score = results.filter((r) => r.ok).length;
  const passed = score >= pool.pass;

  const finish = () => {
    const already = !!store.getState().rungs[rung.id]?.climbed;
    const now = new Date();
    store.recordTest(rung.id, { score, total: items.length, seed, date: now.toISOString() }, passed);
    setPhase({ kind: 'result', climb: passed && !already });
    window.scrollTo({ top: 0 });
    requestAnimationFrame(() => resultRef.current?.focus());
  };

  const header = (n: number | null) => (
    <header className="sticky top-0 z-10 border-b border-rule bg-surface">
      <div className="page flex max-w-lesson items-center gap-3 py-2">
        <Link href={rungHref(rung.id)} aria-label={t('nav.back')} className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full text-ink hover:bg-paper-2">
          <IconArrowLeft />
        </Link>
        <span className="label shrink-0 text-muted">{t('test.title', { rung: rung.name })}</span>
        <span className="flex-1" />
        {n !== null && (
          <span className="label tnum text-muted">
            {n + 1} / {items.length}
          </span>
        )}
        <Link href={rungHref(rung.id)} aria-label={t('lesson.close')} className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full text-ink hover:bg-paper-2">
          <IconClose />
        </Link>
      </div>
    </header>
  );

  if (phase.kind === 'intro') {
    const tests = progress.rungs[rung.id]?.tests ?? [];
    return (
      <div className="flex min-h-[100dvh] flex-col">
        {header(null)}
        <main className="page flex max-w-lesson flex-1 flex-col gap-5 py-7">
          <h1 className="text-h1">{t('test.title', { rung: rung.name })}</h1>
          <p className="max-w-measure">{t('test.intro', { n: pool.draw, pass: pool.pass })}</p>
          {tests.length > 0 && (
            <p className="label tnum text-muted">{t('rung.testBest', { n: Math.max(...tests.map((x) => x.score)), total: pool.draw })}</p>
          )}
        </main>
        <BottomActionBar>
          <button type="button" className="btn btn-primary w-full max-w-[360px]" onClick={start}>
            {t('test.start')} <IconArrowRight />
          </button>
        </BottomActionBar>
      </div>
    );
  }

  if (phase.kind === 'run') {
    const i = phase.i;
    const item = items[i];
    const last = i === items.length - 1;
    const answered = answers[item.id] !== undefined && (!Array.isArray(answers[item.id]) || (answers[item.id] as string[]).length === (item.type === 'order' ? item.tiles.length : 0));
    return (
      <div className="flex min-h-[100dvh] flex-col">
        {header(i)}
        <main className="flex-1 py-5 sm:py-7">
          <div className="page max-w-lesson sm:rounded-lg sm:bg-surface sm:px-7 sm:py-7 sm:shadow-e2">
            {/* Labelled by question, not lesson step (fixes English Ladder issue 6). */}
            <div className="mb-5">
              <QuestionBar n={i + 1} total={items.length} />
            </div>
            <p className="sr-only" aria-live="polite">
              {t('check.counter', { n: i + 1, total: items.length })}
            </p>
            <CheckItemView
              key={`${seed}-${item.id}`}
              mode="test"
              item={item}
              value={answers[item.id]}
              onChange={(r) => setAnswers((a) => ({ ...a, [item.id]: r }))}
            />
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
  const byLesson = new Map<string, typeof results>();
  for (const r of results) byLesson.set(r.item.from ?? '', [...(byLesson.get(r.item.from ?? '') ?? []), r]);
  const lessonOf = (id: string) => lessons.find((l) => l.id === id);
  const missedLessons = [...byLesson.entries()].filter(([, rs]) => rs.some((r) => !r.ok)).map(([id]) => lessonOf(id)).filter(Boolean) as LessonSummary[];

  return (
    <div className="flex min-h-[100dvh] flex-col">
      {header(null)}
      {phase.climb && <ClimbMoment rung={rung} next={next} onReview={() => setPhase({ kind: 'result', climb: false })} />}
      <main className="page flex max-w-lesson flex-1 flex-col gap-6 py-7">
        <h1 ref={resultRef} tabIndex={-1} className="tnum text-hero outline-none">
          {score} / {items.length}
        </h1>
        <p className="font-display text-h2 font-medium">{passed ? t('test.pass', { rung: rung.name }) : t('test.notYet')}</p>

        {!passed && missedLessons.length > 0 && (
          <section className="flex flex-col gap-2">
            <h2 className="eyebrow">{t('test.missedFrom')}</h2>
            <ul className="flex flex-col gap-1">
              {missedLessons.sort((a, b) => a.order - b.order).map((l) => (
                <li key={l.id}>
                  <Link href={lessonHref(l)} className="inline-flex min-h-touch items-center gap-2">
                    <span className="label tnum text-muted">{l.order}</span>
                    <span lang={lang}>{lang === 'en' ? l.title.en : l.title.id}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="flex flex-col gap-4">
          <h2 className="text-h2">{t('test.reviewTitle')}</h2>
          {[...byLesson.entries()]
            .sort(([a], [b]) => (lessonOf(a)?.order ?? 0) - (lessonOf(b)?.order ?? 0))
            .map(([lid, rs]) => (
              <div key={lid} className="flex flex-col gap-3">
                <h3 className="eyebrow">
                  {lessonOf(lid)?.order} · <span lang={lang}>{lang === 'en' ? lessonOf(lid)?.title.en : lessonOf(lid)?.title.id}</span>
                </h3>
                <ul className="flex flex-col gap-3">
                  {rs.map(({ item, given, ok }) => (
                    <ReviewRow key={item.id} item={item} given={show(given)} ok={ok} lang={lang} t={t} />
                  ))}
                </ul>
              </div>
            ))}
        </section>
      </main>
      <BottomActionBar>
        {passed ? (
          <Link href="/" className="btn btn-primary no-underline">
            {t('climb.viewLadder')}
          </Link>
        ) : (
          <button type="button" className="btn btn-primary" onClick={start}>
            {t('test.retry')}
          </button>
        )}
        <Link href={rungHref(rung.id)} className="btn btn-quiet no-underline">
          {t('lesson.backToRung', { rung: rung.name })}
        </Link>
      </BottomActionBar>
    </div>
  );
}

function ReviewRow({ item, given, ok, t }: { item: CheckItem; given: string; ok: boolean; lang: string; t: ReturnType<typeof useT>['t'] }) {
  return (
    <li className="card flex flex-col gap-2 p-4">
      <p className="flex items-start gap-2">
        {ok ? <IconCheck className="mt-1 shrink-0 text-good" /> : <IconClose className="mt-1 shrink-0 text-off" />}
        <span className="sr-only">{ok ? t('check.correct') : t('check.wrong')}</span>
        <span lang="en" className="font-display font-medium">
          {answerText(item)}
        </span>
      </p>
      {!ok && (
        <p className="text-small">
          <span className="text-muted">{t('test.yourAnswer')}: </span>
          <span lang="en" className="off-text">
            {given}
          </span>
        </p>
      )}
      <WhyLine why={item.why} />
    </li>
  );
}
