'use client';

import { ArSentence } from '../ar/ArSentence';
import { IconCheck, IconClose } from '../ui/Icon';
import { useT } from '../ProgressProvider';

type ArPair = { ar: string; tr: string };

/** The off → natural pair for the Contrast step. Icon + word + colour, never colour alone. */
export function PairCard({ off, natural }: { off: ArPair; natural: ArPair }) {
  const { t } = useT();
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="flex flex-col gap-2 rounded-md bg-off-bg p-4">
        <span className="label flex items-center gap-1 text-off">
          <IconClose size={14} /> {t('lesson.off')}
        </span>
        <ArSentence ar={off.ar} tr={off.tr} off play={false} size="body" />
      </div>
      <div className="flex flex-col gap-2 rounded-md bg-good-bg p-4">
        <span className="label flex items-center gap-1 text-good">
          <IconCheck size={14} /> {t('lesson.natural')}
        </span>
        <ArSentence ar={natural.ar} tr={natural.tr} size="body" />
      </div>
    </div>
  );
}
