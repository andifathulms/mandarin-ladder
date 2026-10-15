'use client';

import Link from 'next/link';
import type { LessonSummary } from '@/lib/types';
import type { LessonState } from '@/lib/progress/derive';
import { lessonHref } from '@/lib/routes';
import { IconArrowRight } from '../ui/Icon';
import { useT } from '../ProgressProvider';
import { StatusPill } from './LessonStrip';
import { ArIsland } from '../ar/ArIsland';

/** One lesson in the rung's list: a big serif numeral, the title, state as dot + word. */
type RowProps = { lesson: LessonSummary; state: LessonState; current?: boolean; flagged?: boolean };

export function LessonRow({ lesson, state, current, flagged }: RowProps) {
  const { t, lang } = useT();
  const done = state.kind === 'done' || state.kind === 'review';
  const sub = lang === 'en' ? lesson.title.id : null;

  let pill: React.ReactNode;
  switch (state.kind) {
    case 'new':
      pill = <span className="label text-muted">{t('lesson.state.new')}</span>;
      break;
    case 'progress':
      pill = <StatusPill tone="accent">{t('lesson.state.progress', { n: state.step + 1 })}</StatusPill>;
      break;
    case 'done':
      pill = <StatusPill tone="good">{t('lesson.state.done')}</StatusPill>;
      break;
    case 'review':
      pill = <StatusPill tone="off">{t('lesson.state.review', { n: state.n })}</StatusPill>;
      break;
  }

  return (
    <li>
      <Link
        href={lessonHref(lesson)}
        aria-current={current ? 'step' : undefined}
        className={`grid grid-cols-[44px_1fr_auto] items-start gap-x-4 px-4 py-4 text-ink no-underline transition-colors duration-quick min-[640px]:px-6 ${
          current ? 'bg-accent-soft' : 'hover:bg-paper'
        }`}
      >
        <span
          aria-hidden
          className={`font-display text-h1 font-normal leading-none tnum ${done ? 'text-good' : current ? 'text-accent' : 'text-muted'}`}
        >
          {lesson.order}
        </span>
        <span className="flex min-w-0 flex-col gap-1">
          <span className="sr-only">{t('home.lessonN', { n: lesson.order })}: </span>
          <span className="font-display text-card font-medium" lang={lang}>
            {lang === 'en' ? lesson.title.en : lesson.title.id}
          </span>
          {sub && (
            <span className="id-text text-small" lang="id">
              {sub}
            </span>
          )}
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1">
            {pill}
            <span className="label tnum text-muted">{t('lesson.minutes', { n: lesson.minutes })}</span>
            {flagged && <StatusPill tone="off">{t('rung.missedBadge')}</StatusPill>}
          </span>
          {current && (
            <span aria-hidden className="mt-1 inline-flex items-center gap-1 text-small font-bold text-accent">
              {state.kind === 'progress' ? t('rung.resume', { n: state.step + 1 }) : t('rung.startLesson')} <IconArrowRight size={16} />
            </span>
          )}
        </span>
        {lesson.keyword && (
          <ArIsland aria-hidden className="mt-1 rounded-sm bg-paper-2 px-2 text-ar-small leading-[1.6] text-ink">
            «{lesson.keyword}»
          </ArIsland>
        )}
      </Link>
    </li>
  );
}
