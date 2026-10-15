'use client';

import type { Bilingual } from '@/lib/types';
import { useT } from '../ProgressProvider';

export function WhyLine({ why, hint }: { why: Bilingual; hint?: boolean }) {
  const { t, lang } = useT();
  return (
    <p className="fade-in max-w-measure text-body">
      {hint && <span className="label me-2 text-muted">{t('check.hint')}</span>}
      {lang === 'en' ? why.en : why.id}
    </p>
  );
}
