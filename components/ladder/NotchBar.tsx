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
  return (
    <span
      className={`items-center ${lg ? 'flex w-full gap-[6px]' : 'inline-flex gap-[3px]'}`}
      role="img"
      aria-label={climbed ? t('rung.climbed') : t('rung.inProgress', { n: done, total })}
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
