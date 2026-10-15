'use client';

import type { Bilingual } from '@/lib/types';
import { IconCheck } from '../ui/Icon';
import { useT } from '../ProgressProvider';

type Props = {
  children: React.ReactNode;
  /** After a correct answer: the bar becomes a green sheet with the why line, in the thumb zone. */
  feedback?: Bilingual | null;
};

export function BottomActionBar({ children, feedback }: Props) {
  const { t, lang } = useT();
  return (
    <div
      className={`sticky bottom-0 z-10 transition-colors duration-base ${
        feedback ? 'rounded-t-xl bg-good-bg' : 'border-t border-rule bg-surface'
      }`}
      style={{ paddingBottom: 'max(var(--s-3), env(safe-area-inset-bottom))' }}
    >
      <div aria-live="polite" className="page max-w-lesson">
        {feedback && (
          <div key={feedback.id} className="sheet-up flex flex-col gap-2 pt-4">
            <p className="flex items-center gap-2 font-display text-h2 font-semibold text-good">
              <span className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-good text-good-bg">
                <IconCheck size={18} draw />
              </span>
              {t('check.correctShort')}
            </p>
            <p className="max-w-measure text-ink">{lang === 'en' ? feedback.en : feedback.id}</p>
          </div>
        )}
      </div>
      <div className="page flex max-w-lesson items-center justify-center gap-3 pt-3">{children}</div>
    </div>
  );
}
