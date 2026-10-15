'use client';

import { useT } from '../ProgressProvider';

/** Test and placement progress: "Soal i dari N", as a bar. */
export function QuestionBar({ n, total }: { n: number; total: number }) {
  const { t } = useT();
  const label = t('test.progress', { n, total });
  return (
    <div className="flex items-center gap-3">
      <div
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={n}
        aria-label={label}
        className="h-[6px] flex-1 overflow-hidden rounded-full bg-paper-2"
      >
        <span className="block h-full rounded-full bg-accent transition-[width] duration-base" style={{ width: `${(n / total) * 100}%` }} />
      </div>
      <span className="label shrink-0 tnum text-muted" aria-hidden>
        {label}
      </span>
    </div>
  );
}
