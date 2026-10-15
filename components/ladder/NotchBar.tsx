'use client';

import { useT } from '../ProgressProvider';

type Props = {
  total: number;
  done: number;
  climbed?: boolean;
  /** Index (0-based) of a notch that just filled: it shows gold first, then settles to accent. */
  fresh?: number;
  /** sm: inline on the ladder. lg: full-width bar on the lesson-done screen. */
  size?: 'sm' | 'lg';
};

export function NotchBar({ total, done, climbed, fresh, size = 'sm' }: Props) {
  const { t } = useT();
  const lg = size === 'lg';
  const label = climbed ? t('rung.climbed') : t('rung.inProgress', { n: done, total });
  // Long rungs (18–20 lessons) on narrow screens: a thin progress line with the count (DESIGN §6.3).
  if (!lg && total >= 18) {
    const shown = climbed ? total : done;
    return (
      <span role="img" aria-label={label} className="inline-flex items-center gap-2">
        <span aria-hidden className="hidden gap-[3px] min-[480px]:inline-flex">
          {Array.from({ length: total }, (_, i) => (
            <span
              key={i}
              className={`h-[10px] w-[6px] rounded-[2px] ${i === fresh && !climbed ? 'notch-settle' : ''}`}
              style={{
                background: climbed ? 'var(--rung)' : i < done ? 'var(--accent)' : 'var(--paper-2)',
                boxShadow: climbed || i < done ? undefined : 'inset 0 0 0 1px var(--rule)',
              }}
            />
          ))}
        </span>
        <span aria-hidden className="inline-flex items-center gap-2 min-[480px]:hidden">
          <span className="h-[4px] w-[56px] overflow-hidden rounded-full bg-paper-2" style={{ boxShadow: 'inset 0 0 0 1px var(--rule)' }}>
            <span className="block h-full rounded-full" style={{ width: `${(shown / total) * 100}%`, background: climbed ? 'var(--rung)' : 'var(--accent)' }} />
          </span>
          <span className="label tnum text-muted">
            {shown} / {total}
          </span>
        </span>
      </span>
    );
  }
  return (
    <span
      className={`items-center ${lg ? 'flex w-full gap-[6px]' : 'inline-flex gap-[3px]'}`}
      role="img"
      aria-label={label}
    >
      {Array.from({ length: total }, (_, i) => {
        const filled = climbed || i < done;
        return (
          <span
            key={i}
            aria-hidden
            className={`${lg ? 'h-[12px] flex-1 rounded-[4px]' : 'h-[10px] w-[8px] rounded-[2px]'} ${
              i === fresh && !climbed ? 'notch-settle' : ''
            }`}
            style={{
              background: climbed ? 'var(--rung)' : filled ? 'var(--accent)' : 'var(--paper-2)',
              boxShadow: filled ? undefined : 'inset 0 0 0 1px var(--rule)',
            }}
          />
        );
      })}
    </span>
  );
}
