'use client';

import Link from 'next/link';
import { useT } from '@/components/ProgressProvider';
import { PageShell } from '@/components/ui/PageShell';

export default function NotFound() {
  const { t } = useT();
  return (
    <PageShell title={t('notFound.title')}>
      <p className="max-w-measure">{t('notFound.body')}</p>
      <Link href="/" className="btn btn-primary self-start no-underline">
        {t('nav.home')}
      </Link>
    </PageShell>
  );
}
