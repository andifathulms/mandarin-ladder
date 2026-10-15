'use client';

import Link from 'next/link';
import { Wordmark } from './Mark';
import { IconArrowLeft } from './Icon';

/** Wordmark bar for phones. On wide screens the sidebar carries the wordmark instead. */
export function AppHeader({ aside }: { aside?: React.ReactNode }) {
  return (
    <header className="page flex max-w-home items-center justify-between gap-3 pt-4 min-[900px]:hidden">
      <Link href="/" className="flex items-center text-ink no-underline">
        <Wordmark />
      </Link>
      {aside}
    </header>
  );
}

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-touch items-center gap-1 self-start text-small font-bold text-muted no-underline hover:text-accent"
    >
      <IconArrowLeft size={18} /> {label}
    </Link>
  );
}
