'use client';

import Link from 'next/link';
import type { LessonSummary } from '@/lib/types';
import { completedCount } from '@/lib/progress/derive';
import { useProgress, useT } from './ProgressProvider';
import { PageShell } from './ui/PageShell';
import { IconChevron, IconInfo, IconSettings } from './ui/Icon';
import { WeekStrip } from './ladder/WeekStrip';

/** Saya: a quiet look at your own progress, plus settings and About. */
export function MeView({ lessons }: { lessons: LessonSummary[] }) {
  const { t } = useT();
  const progress = useProgress();
  const done = completedCount(lessons, progress);
  const words = lessons.filter((l) => progress.opened.includes(l.id)).reduce((n, l) => n + l.glossary.length, 0);
  const climbed = Object.values(progress.rungs).filter((r) => r.climbed).length;
  const stats = [
    { n: done, label: t('me.lessonsDone') },
    { n: words, label: t('me.wordsMet') },
    { n: climbed, label: t('me.rungsClimbed') },
  ];
  const links = [
    { href: '/settings/', title: t('nav.settings'), hint: t('me.settingsHint'), Icon: IconSettings },
    { href: '/about/', title: t('nav.about'), hint: t('me.aboutHint'), Icon: IconInfo },
  ];

  return (
    <PageShell title={t('me.title')}>
      <ul className="card grid grid-cols-3 divide-x divide-rule overflow-hidden">
        {stats.map((s) => (
          <li key={s.label} className="flex flex-col gap-2 px-4 py-5 min-[640px]:px-6">
            <span className="font-display text-hero font-normal leading-none tnum">{s.n}</span>
            <span className="text-small leading-tight text-muted">{s.label}</span>
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-2 min-[900px]:hidden">
        <WeekStrip />
        <p className="text-small text-muted">{t('me.weekHint')}</p>
      </div>

      <section aria-labelledby="me-more" className="flex flex-col gap-2">
        <h2 id="me-more" className="eyebrow">
          {t('me.more')}
        </h2>
        <ul className="card flex flex-col divide-y divide-rule overflow-hidden">
          {links.map(({ href, title, hint, Icon }) => (
            <li key={href}>
              <Link
                href={href}
                className="flex min-h-[64px] items-center gap-4 px-4 py-3 text-ink no-underline transition-colors duration-quick hover:bg-paper-2"
              >
                <span className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-md bg-accent-soft text-accent">
                  <Icon size={20} />
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="font-body font-bold">{title}</span>
                  <span className="text-small text-muted">{hint}</span>
                </span>
                <IconChevron className="shrink-0 text-muted" />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </PageShell>
  );
}
