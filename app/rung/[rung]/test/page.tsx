import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getCurriculum, getLessons, getRung, getTestPool, summarize } from '@/lib/content/load';
import { TestRunner } from '@/components/check/TestRunner';
import { VisualDataProvider } from '@/components/visuals/VisualData';
import { visualData } from '@/lib/content/visualData';

type Params = { params: { rung: string } };

export function generateStaticParams() {
  const live = getCurriculum().filter((r) => getTestPool(r.id));
  return live.length ? live.map((r) => ({ rung: r.id })) : [{ rung: 'easy-1' }];
}

export function generateMetadata({ params }: Params): Metadata {
  const r = getRung(params.rung);
  return { title: r ? `${r.name} test` : undefined };
}

export default function TestPage({ params }: Params) {
  const rung = getRung(params.rung);
  const pool = rung && getTestPool(rung.id);
  if (!rung || !pool) notFound();
  const rungs = getCurriculum();
  const next = rungs[rungs.findIndex((r) => r.id === rung.id) + 1] ?? null;
  return (
    <VisualDataProvider value={visualData()}>
      <TestRunner
        rung={rung}
        next={next}
        pool={pool}
        lessons={getLessons(rung.id).map(summarize)}
      />
    </VisualDataProvider>
  );
}
