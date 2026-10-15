'use client';

import { ZhSentence } from '../zh/ZhSentence';
import { IconCheck, IconClose } from '../ui/Icon';
import { useT } from '../ProgressProvider';

type ZhPy = { zh: string; py: string };

/** The off → natural pair for the Contrast step. Icon + word + colour, never colour alone. */
export function PairCard({ off, natural }: { off: ZhPy; natural: ZhPy }) {
  const { t } = useT();
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="flex flex-col gap-2 rounded-md bg-off-bg p-4">
        <span className="label flex items-center gap-1 text-off">
          <IconClose size={14} /> {t('lesson.off')}
        </span>
        <ZhSentence zh={off.zh} py={off.py} off play={false} size="body" />
      </div>
      <div className="flex flex-col gap-2 rounded-md bg-good-bg p-4">
        <span className="label flex items-center gap-1 text-good">
          <IconCheck size={14} /> {t('lesson.natural')}
        </span>
        <ZhSentence zh={natural.zh} py={natural.py} size="body" />
      </div>
    </div>
  );
}
