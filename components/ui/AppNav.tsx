'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useT } from '../ProgressProvider';
import type { StringKey } from '@/lib/i18n';
import { IconBook, IconLadder, IconReview, IconUser } from './Icon';
import { Wordmark } from './Mark';
import { WeekStrip } from '../ladder/WeekStrip';

type Tab = {
  href: string;
  short: StringKey;
  long: StringKey;
  Icon: (p: { size?: number }) => JSX.Element;
  match: (path: string) => boolean;
};

const TABS: Tab[] = [
  { href: '/', short: 'nav.home', long: 'nav.home', Icon: IconLadder, match: (p) => p === '/' || p.startsWith('/rung/') },
  { href: '/review/', short: 'nav.review', long: 'nav.reviewLong', Icon: IconReview, match: (p) => p.startsWith('/review') },
  { href: '/words/', short: 'nav.wordsShort', long: 'nav.words', Icon: IconBook, match: (p) => p.startsWith('/words') },
  {
    href: '/me/',
    short: 'nav.me',
    long: 'nav.me',
    Icon: IconUser,
    match: (p) => p.startsWith('/me') || p.startsWith('/settings') || p.startsWith('/about'),
  },
];

/**
 * The app's four places. One landmark, two layouts: a bottom tab bar on phones,
 * a labelled sidebar from 900px. Hidden inside the lesson player and the test.
 */
export function AppNav() {
  const { t } = useT();
  const path = usePathname() || '/';
  return (
    <nav
      aria-label={t('nav.main')}
      className="fixed inset-x-0 bottom-0 z-20 border-t border-rule bg-surface pb-[max(var(--s-2),env(safe-area-inset-bottom))] min-[900px]:inset-y-0 min-[900px]:right-auto min-[900px]:flex min-[900px]:w-[var(--sidebar-w)] min-[900px]:flex-col min-[900px]:gap-6 min-[900px]:border-t-0 min-[900px]:bg-board min-[900px]:px-3 min-[900px]:py-5"
    >
      <Link
        href="/"
        className="hidden border-b border-board-2 px-2 pb-5 no-underline min-[900px]:flex"
        aria-label="Arabic Ladder"
      >
        <Wordmark onBoard />
      </Link>
      <ul className="grid grid-cols-4 px-1 pt-1 min-[900px]:flex min-[900px]:flex-col min-[900px]:gap-1 min-[900px]:p-0">
        {TABS.map(({ href, short, long, Icon, match }) => {
          const on = match(path);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={on ? 'page' : undefined}
                className={`flex min-h-[56px] flex-col items-center justify-center gap-1 rounded-full text-tab font-bold no-underline transition-colors duration-quick min-[900px]:min-h-[46px] min-[900px]:flex-row min-[900px]:justify-start min-[900px]:gap-3 min-[900px]:px-4 min-[900px]:text-body min-[900px]:font-medium ${
                  on
                    ? 'text-accent min-[900px]:bg-board-2 min-[900px]:text-board-ink min-[900px]:shadow-[inset_3px_0_0_var(--brass)]'
                    : 'text-muted hover:text-ink min-[900px]:text-board-muted min-[900px]:hover:bg-board-2 min-[900px]:hover:text-board-ink'
                }`}
              >
                <span
                  aria-hidden
                  className={`flex h-[30px] w-[52px] items-center justify-center rounded-full transition-colors duration-quick min-[900px]:h-auto min-[900px]:w-auto min-[900px]:bg-transparent ${
                    on ? 'bg-accent-soft' : ''
                  }`}
                >
                  <Icon size={22} />
                </span>
                <span className="min-[900px]:hidden">{t(short)}</span>
                <span className="hidden min-[900px]:inline">{t(long)}</span>
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="mt-auto hidden px-3 min-[900px]:block">
        <WeekStrip compact onBoard />
      </div>
    </nav>
  );
}
