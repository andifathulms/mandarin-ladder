'use client';

import Link from 'next/link';
import type { LessonSummary } from '@/lib/types';
import type { ProgressState } from '@/lib/progress/types';
import { lessonState, type LessonState } from '@/lib/progress/derive';
import { lessonHref } from '@/lib/routes';
import { useT, type T } from '../ProgressProvider';
import { ZhText } from '../zh/ZhText';

export function stateWord(s: LessonState, t: T, minutes: number): string {
  switch (s.kind) {
    case 'new':
      return t('lesson.minutes', { n: minutes });
    case 'progress':
      return t('lesson.state.progress', { n: s.step + 1 });
    case 'done':
      return t('lesson.state.done');
    case 'review':
      return t('lesson.state.review', { n: s.n });
  }
}

/** A small pill with a status dot, like a catalogue tag. */
export function StatusPill({ tone, children }: { tone: 'good' | 'accent' | 'off'; children: React.ReactNode }) {
  return (
    <span className="label inline-flex shrink-0 items-center gap-[6px] whitespace-nowrap rounded-full bg-surface px-2 py-1 text-ink shadow-e1">
      <span aria-hidden className="h-[6px] w-[6px] rounded-full" style={{ background: `var(--${tone})` }} />
      {children}
    </span>
  );
}

/** The lessons of your rung as workbook pages: one swipe away on phones, a grid on wide screens. */
export function LessonStrip({ lessons, progress, currentId }: { lessons: LessonSummary[]; progress: ProgressState; currentId?: string }) {
  const { t, lang } = useT();
  return (
    <ol className="relative -mx-gutter flex snap-x snap-mandatory scroll-px-gutter gap-4 overflow-x-auto px-gutter pb-2 min-[900px]:mx-0 min-[900px]:grid min-[900px]:grid-cols-3 min-[900px]:overflow-visible min-[900px]:px-0">
      {lessons.map((l) => {
        const s = lessonState(l, progress);
        const done = s.kind === 'done' || s.kind === 'review';
        const now = l.id === currentId;
        return (
          <li key={l.id} className="w-[220px] shrink-0 snap-start min-[900px]:w-auto">
            <Link
              href={lessonHref(l)}
              aria-current={now ? 'step' : undefined}
              className={`card group flex h-full flex-col overflow-hidden text-ink no-underline transition-shadow duration-quick hover:shadow-e2 ${
                now ? 'outline outline-2 outline-offset-2 outline-accent' : ''
              }`}
            >
              <span className="doc-grid relative flex min-h-[132px] flex-col gap-2 py-4 pe-4 ps-6">
                <span aria-hidden className="absolute inset-y-0 start-0 w-[6px]" style={{ background: done ? 'var(--accent)' : now ? 'var(--brass)' : 'var(--rule)' }} />
                <span className="flex items-start justify-between gap-2">
                  <span className="label min-w-0 truncate pt-1 tnum text-muted">
                    <span aria-hidden>№ {String(l.order).padStart(2, '0')}</span>
                    <span className="sr-only">{t('home.lessonN', { n: l.order })}</span>
                  </span>
                  {done ? (
                    <StatusPill tone={s.kind === 'review' ? 'off' : 'good'}>
                      {s.kind === 'review' ? t('lesson.state.review', { n: s.n }) : t('lesson.state.done')}
                    </StatusPill>
                  ) : now && s.kind === 'progress' ? (
                    <StatusPill tone="accent">
                      <span aria-hidden>{s.step + 1} / 6</span>
                      <span className="sr-only">{stateWord(s, t, l.minutes)}</span>
                    </StatusPill>
                  ) : null}
                </span>
                <span className="font-display text-card font-medium" lang={lang}>
                  {lang === 'en' ? l.title.en : l.title.id}
                </span>
                <ZhText as="span" className="text-zh-small text-muted">
                  {l.title.zh.replace(/\s+|\[\[|\]\]/g, '')}
                </ZhText>
              </span>
              <span className="flex items-center justify-between gap-2 border-t border-rule px-4 py-3">
                <span className="min-w-0 truncate text-small text-muted" lang={lang}>
                  {s.kind === 'new' ? t('lesson.state.new') : stateWord(s, t, l.minutes)}
                </span>
                <span className="label shrink-0 tnum text-muted">{t('lesson.minutes', { n: l.minutes })}</span>
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
