'use client';

import { useT } from '../ProgressProvider';

/** Six segments: done steps filled, the current one half-strength, later ones empty. */
export function StepBar({ step, total = 6 }: { step: number; total?: number }) {
  const { t } = useT();
  return (
    <div
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={step + 1}
      aria-label={t('lesson.progress', { n: step + 1 })}
      className="flex flex-1 items-center gap-[4px]"
    >
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          aria-hidden
          className="h-[6px] flex-1 rounded-full transition-colors duration-base"
          style={{ background: i <= step ? 'var(--accent)' : 'var(--paper-2)', opacity: i === step ? 0.5 : 1 }}
        />
      ))}
    </div>
  );
}
