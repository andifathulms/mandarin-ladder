'use client';

import Link from 'next/link';
import type { LessonSummary, Rung } from '@/lib/types';
import type { ProgressState } from '@/lib/progress/types';
import { lessonState } from '@/lib/progress/derive';
import { placementHref, readHref, talkHref, testHref, rungHref } from '@/lib/routes';
import { LessonRow } from './LessonRow';
import { IconArrowLeft, IconCards, IconChevron, IconFlag, IconReview } from '../ui/Icon';
import { CapstoneCard } from './CapstoneCard';
import { ZhText } from '../zh/ZhText';
import { Grid } from '../ui/Grid';
import { ProgressRing } from '../ui/ProgressRing';
import { tierName } from '../ui/tier';
import { HskChip } from '../ui/HskChip';
import { useT } from '../ProgressProvider';

type Props = {
  rung: Rung;
  rungs: Rung[];
  lessons: LessonSummary[];
  progress: ProgressState;
  test: TestInfo | null;
  reading?: ReadingInfo | null;
  dialogue?: DialogueInfo | null;
  /** The word deck for this rung's HSK level. */
  deck?: { count: number } | null;
  /** The rung page that offers the placement retake (Dasar 1). */
  placement?: boolean;
};

export type TestInfo = { draw: number; pass: number };
export type ReadingInfo = { title: { en: string; id: string }; items: number };
export type DialogueInfo = { title: { en: string; id: string }; lines: number; items: number };

export function RungDetail({ rung, rungs, lessons, progress, test, reading, dialogue, deck, placement }: Props) {
  const { t, lang } = useT();
  const mine = lessons.filter((l) => l.rung === rung.id).sort((a, b) => a.order - b.order);
  const tests = progress.rungs[rung.id]?.tests ?? [];
  const best = tests.length ? Math.max(...tests.map((x) => x.score)) : null;
  const climbed = !!progress.rungs[rung.id]?.climbed;
  const states = mine.map((l) => lessonState(l, progress));
  // After placement into this rung, the lessons behind missed check items are marked.
  const missed = new Set(progress.placement?.result === rung.id ? progress.placement.missed : []);
  const caps = progress.capstones[rung.id] ?? {};
  const done = states.filter((s) => s.kind === 'done' || s.kind === 'review').length;
  // The lesson to open next: the one in progress, else the first not finished.
  const currentIdx = (() => {
    const p = states.findIndex((s) => s.kind === 'progress');
    return p >= 0 ? p : states.findIndex((s) => s.kind === 'new');
  })();
  const later = rungs
    .slice(rungs.findIndex((r) => r.id === rung.id) + 1)
    .map((r) => ({ r, shared: r.threads.filter((th) => rung.threads.includes(th)) }))
    .filter((x) => x.shared.length)
    .slice(0, 3);

  return (
    <div className="flex flex-col gap-6">
      <header className="board -mx-gutter flex flex-col gap-4 rounded-none px-gutter pb-8 pt-3 min-[640px]:mx-0 min-[640px]:rounded-xl min-[640px]:px-8 min-[640px]:pt-5">
        <Grid />
        <Link
          href="/"
          className="inline-flex min-h-touch items-center gap-1 self-start text-small font-bold text-board-muted no-underline hover:text-board-ink"
        >
          <IconArrowLeft size={18} /> {t('nav.home')}
        </Link>
        <div className="flex items-end justify-between gap-4">
          <div className="flex min-w-0 flex-col gap-3">
            <p className="label flex items-center gap-2 text-brass">
              <span aria-hidden className="h-[7px] w-[7px] rounded-full" style={{ background: `var(--${rung.tier})` }} />
              {tierName(rung.tier)}
              <HskChip hsk={rung.hsk} onBoard />
            </p>
            <h1 className="text-hero leading-none tracking-[-0.02em] text-board-ink">{rung.name}</h1>
            <p className="flex flex-wrap items-baseline gap-x-3 text-board-muted">
              <ZhText className="text-zh-body leading-none">{rung.name_zh.zh.replace(/\s+/g, '')}</ZhText>
              <span lang="zh-Latn-pinyin" className="text-small">
                {rung.name_zh.py}
              </span>
            </p>
          </div>
          {rung.status === 'live' && (
            <ProgressRing
              done={climbed ? rung.lessons : done}
              total={rung.lessons}
              color={climbed ? 'var(--rung)' : 'var(--brass)'}
              track="var(--board-2)"
              onBoard
              label={climbed ? t('rung.climbed') : t('rung.progressRing', { n: done, total: rung.lessons })}
            />
          )}
        </div>
        <p className="max-w-measure text-body text-board-ink">{lang === 'en' ? rung.description.en : rung.description.id}</p>
        <p className="text-small text-board-muted">
          {t(`rung.pinyin.${rung.pinyin}`)} · {t(rung.tone_colours_default ? 'rung.toneColours.on' : 'rung.toneColours.off')}
        </p>
      </header>

      {rung.status === 'soon' ? (
        <section className="flex flex-col gap-3">
          <h2 className="text-h2">{t('rung.soonTitle', { rung: rung.name })}</h2>
          <p className="text-muted">{t('rung.soonBody')}</p>
          <ul className="flex flex-wrap gap-2" lang="id">
            {rung.topics.map((topic) => (
              <li key={topic} className="card px-3 py-1 text-small">
                {topic}
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <section aria-labelledby={`lessons-${rung.id}`} className="flex flex-col gap-3">
          <h2 id={`lessons-${rung.id}`} className="eyebrow">
            {t('rung.lessons')}
          </h2>
          {mine.length === 0 ? (
            <p className="text-muted">{t('rung.noLessons')}</p>
          ) : (
            <ol className="card flex flex-col divide-y divide-rule overflow-hidden">
              {mine.map((l, i) => (
                <LessonRow key={l.id} lesson={l} state={states[i]} current={i === currentIdx} flagged={missed.has(l.id)} />
              ))}
            </ol>
          )}
          {missed.size > 0 && <p className="text-small text-muted">{t('rung.missedHint')}</p>}
          {(reading || dialogue) && (
            <div className="mt-3 flex flex-col gap-2">
              <h3 className="eyebrow">{t('rung.capstones')}</h3>
              {reading && (
                <CapstoneCard
                  href={readHref(rung.id)}
                  kind="reading"
                  title={`${t('read.title')}: ${lang === 'en' ? reading.title.en : reading.title.id}`}
                  meta={t('read.meta', { n: reading.items })}
                  done={caps.reading}
                />
              )}
              {dialogue && (
                <CapstoneCard
                  href={talkHref(rung.id)}
                  kind="dialogue"
                  title={`${t('talk.title')}: ${lang === 'en' ? dialogue.title.en : dialogue.title.id}`}
                  meta={t('talk.meta', { n: dialogue.lines, k: dialogue.items })}
                  done={caps.dialogue}
                />
              )}
            </div>
          )}
          {deck && (
            <Link
              href="/words/#deck"
              className="card mt-2 flex min-h-[64px] items-center gap-4 p-4 text-ink no-underline transition-colors duration-quick hover:bg-paper-2"
            >
              <span className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-md bg-rung-soft" style={{ color: 'var(--rung)' }}>
                <IconCards />
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="font-display text-card font-medium">{t('rung.deck', { hsk: rung.hsk })}</span>
                <span className="text-small text-muted tnum">{t('rung.deckMeta', { n: deck.count, hsk: rung.hsk })}</span>
              </span>
              <IconChevron className="shrink-0 text-muted" />
            </Link>
          )}
          {test && (
            <Link
              href={testHref(rung.id)}
              className={`mt-3 flex min-h-[72px] items-center gap-4 rounded-lg p-4 text-ink no-underline transition-colors duration-quick ${
                climbed ? 'bg-rung-soft' : 'border-2 border-dashed border-rule bg-surface hover:border-accent'
              }`}
            >
              <span
                className={`flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-md ${climbed ? 'bg-surface' : 'bg-paper-2'}`}
                style={climbed ? { color: 'var(--rung)' } : undefined}
              >
                <IconFlag />
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="font-display text-card font-medium">{t('rung.test')}</span>
                <span className="text-small text-muted tnum">
                  {t('rung.testMeta', { n: test.draw, pass: test.pass })} ·{' '}
                  {best !== null ? t('rung.testBest', { n: best, total: test.draw }) : t('rung.testAlways')}
                </span>
              </span>
              <IconChevron className="shrink-0 text-muted" />
            </Link>
          )}
          {placement && (
            <Link
              href={placementHref}
              className="mt-3 flex min-h-[64px] items-center gap-4 rounded-lg bg-paper-2 p-4 text-ink no-underline transition-colors duration-quick hover:bg-accent-soft"
            >
              <span className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-md bg-surface text-accent">
                <IconReview />
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="font-body font-bold">{t('rung.placementRetake')}</span>
                <span className="text-small text-muted">{t('rung.placementRetakeMeta')}</span>
              </span>
              <IconChevron className="shrink-0 text-muted" />
            </Link>
          )}
        </section>
      )}

      {later.length > 0 && (
        <section aria-labelledby={`spiral-${rung.id}`} className="flex flex-col gap-2">
          <h2 id={`spiral-${rung.id}`} className="eyebrow">
            {t('rung.spiralTitle')}
          </h2>
          <ul className="flex flex-wrap gap-2">
            {later.map(({ r, shared }) => (
              <li key={r.id}>
                <Link href={rungHref(r.id)} className="card flex flex-col px-3 py-2 text-small text-ink no-underline hover:bg-paper-2">
                  <span className="font-display font-semibold">{r.name}</span>
                  <span className="text-muted" lang="en">
                    {shared.join(', ')}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
