'use client';

import Link from 'next/link';
import { IconBook, IconCheck, IconChevron } from '../ui/Icon';
import { EgChip } from '../ar/EgChip';
import { useT } from '../ProgressProvider';

type Props = {
  href: string;
  kind: 'reading' | 'dialogue';
  title: string;
  meta: string;
  /** ISO date when done; shows a ✓ and the date (fixes English Ladder issue 4). */
  done?: string;
};

/** A rung capstone: Baca dan dengar (Fusha reading) or Ngobrol · Mesir (Egyptian dialogue). */
export function CapstoneCard({ href, kind, title, meta, done }: Props) {
  const { t, lang } = useT();
  const date = done ? new Date(done).toLocaleDateString(lang === 'en' ? 'en-GB' : 'id-ID', { day: 'numeric', month: 'short' }) : null;
  return (
    <Link
      href={href}
      className={`card flex min-h-[72px] items-center gap-4 p-4 text-ink no-underline transition-colors duration-quick hover:bg-paper-2 ${
        kind === 'dialogue' ? 'border-s-[3px] border-eg' : ''
      }`}
    >
      <span
        className={`flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-md ${
          kind === 'dialogue' ? 'bg-eg-soft text-eg' : 'bg-accent-soft text-accent'
        }`}
      >
        {kind === 'dialogue' ? <EgChip /> : <IconBook />}
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="font-display text-card font-medium">{title}</span>
        <span className="text-small text-muted tnum">{meta}</span>
      </span>
      {date && (
        <span className="label flex shrink-0 items-center gap-1 text-good">
          <IconCheck size={16} /> {t('rung.capstoneDone', { date })}
        </span>
      )}
      <IconChevron className="shrink-0 text-muted" />
    </Link>
  );
}
