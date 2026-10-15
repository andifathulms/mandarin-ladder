'use client';

import Link from 'next/link';
import type { LessonSummary, Rung } from '@/lib/types';
import { completedCount, continueTarget, currentRung, doneCount } from '@/lib/progress/derive';
import { lessonHref, placementHref, rungHref } from '@/lib/routes';
import { useHydrated, useProgress, useT, type T } from '../ProgressProvider';
import { AppShell } from '../ui/AppShell';
import { IconChevron, IconReview } from '../ui/Icon';
import { Accented, ContinueCard } from './ContinueCard';
import { LadderRail } from './LadderRail';
import { LessonStrip } from './LessonStrip';
import { hskLabel } from '../ui/tier';

type Props = { rungs: Rung[]; lessons: LessonSummary[]; testRungs: string[]; hasPlacement: boolean };

function greeting(t: T, now: Date): string {
  const h = now.getHours();
  if (h < 11) return t('home.greet.morning');
  if (h < 15) return t('home.greet.day');
  if (h < 18) return t('home.greet.afternoon');
  return t('home.greet.night');
}

export function HomeView({ rungs, lessons, hasPlacement }: Props) {
  const progress = useProgress();
  const hydrated = useHydrated();
  const { t, lang } = useT();
  const target = continueTarget(rungs, lessons, progress);
  // While a learner works in an optional rung (Starter), the board and strip follow that rung.
  const here = (target.kind === 'lesson' && rungs.find((r) => r.id === target.lesson.rung)) || currentRung(rungs, progress);
  // Door 1 opens Dasar 1, lesson 1; door 2 opens the placement check.
  const dasar = rungs.find((r) => r.tier === 'dasar' && r.status === 'live');
  const first = dasar && lessons.filter((l) => l.rung === dasar.id).sort((a, b) => a.order - b.order)[0];
  const showReview = completedCount(lessons, progress) >= 2;
  const mine = lessons.filter((l) => l.rung === here.id).sort((a, b) => a.order - b.order);
  const done = doneCount(here.id, lessons, progress);
  const live = rungs.filter((r) => r.status === 'live').length;

  // The clock is the visitor's, so static HTML shows a neutral title until hydration.
  const now = hydrated ? new Date() : null;
  const date = now?.toLocaleDateString(lang === 'en' ? 'en-GB' : 'id-ID', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <AppShell
      headerAside={
        <Link href={rungHref(here.id)} className="label flex min-h-touch items-center gap-2 rounded-full px-3 text-ink no-underline">
          <span aria-hidden className="h-[8px] w-[8px] rounded-full" style={{ background: `var(--${here.tier})` }} />
          {hskLabel(here.hsk) || here.name}
          {here.hsk !== '—' && <span className="sr-only">· {here.name}</span>}
        </Link>
      }
    >
      <main className="page grid max-w-home grid-cols-1 gap-7 py-5 min-[900px]:grid-cols-[minmax(0,1fr)_320px] min-[900px]:py-8">
        <div className="flex min-w-0 flex-col gap-6">
          <header className="flex flex-col gap-1">
            <p className="eyebrow" aria-hidden={!date}>
              {date ?? ' '}
            </p>
            <h1 className="text-hero tracking-[-0.02em]">
              {now ? <Accented text={greeting(t, now)} tone="text-accent" /> : 'Mandarin Ladder'}
            </h1>
          </header>

          <ContinueCard
            target={target}
            firstLessonHref={first ? lessonHref(first) : null}
            placementHref={hasPlacement ? placementHref : null}
            rungs={rungs}
          />

          {mine.length > 0 && (
            <section aria-labelledby="rung-lessons" className="flex flex-col gap-3">
              <div className="flex items-baseline justify-between gap-3">
                <h2 id="rung-lessons" className="text-h2 tnum">
                  {t('home.rungProgress', { rung: here.name, n: done, total: here.lessons })}
                </h2>
                <Link href={rungHref(here.id)} className="text-small font-bold underline-offset-4 hover:underline">
                  {t('home.allLessons')}
                </Link>
              </div>
              <LessonStrip
                lessons={mine}
                progress={progress}
                currentId={target.kind === 'lesson' ? target.lesson.id : undefined}
              />
            </section>
          )}

          {showReview && (
            <Link
              href="/review/"
              className="flex min-h-[64px] items-center gap-4 rounded-lg bg-accent-soft px-4 py-3 text-ink no-underline transition-transform duration-quick active:scale-[0.99]"
            >
              <span className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-md bg-surface text-accent">
                <IconReview />
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="font-body font-bold">{t('home.quickReview')}</span>
                <span className="text-small text-muted">{t('home.quickReviewMeta')}</span>
              </span>
              <IconChevron className="shrink-0 text-muted" />
            </Link>
          )}
        </div>

        <aside aria-labelledby="ladder-title" className="flex flex-col gap-3 min-[900px]:self-start">
          <div className="flex items-baseline justify-between gap-3">
            <h2 id="ladder-title" className="text-h2">
              {t('home.ladder')}
            </h2>
            <span className="label tnum text-muted">{t('home.ladderMeta', { n: live, total: rungs.length })}</span>
          </div>
          <div className="card p-3">
            <LadderRail rungs={rungs} lessons={lessons} progress={progress} hereId={here.id} label={t('home.ladder')} />
          </div>
        </aside>
      </main>
    </AppShell>
  );
}
