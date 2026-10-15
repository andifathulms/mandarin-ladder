import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAllSummaries, getCurriculum, getDialogue, getPlacement, getReading, getRung, getTestPool } from '@/lib/content/load';
import { RungView } from '@/components/ladder/RungView';
import { hskLabel } from '@/components/ui/tier';

type Params = { params: { rung: string } };

export function generateStaticParams() {
  return getCurriculum().map((r) => ({ rung: r.id }));
}

export function generateMetadata({ params }: Params): Metadata {
  const r = getRung(params.rung);
  return { title: r ? [r.name, hskLabel(r.hsk)].filter(Boolean).join(' · ') : undefined };
}

export default function RungPage({ params }: Params) {
  const rung = getRung(params.rung);
  if (!rung) notFound();
  const pool = getTestPool(rung.id);
  const reading = getReading(rung.id);
  const dialogue = getDialogue(rung.id);
  return (
    <RungView
      rung={rung}
      rungs={getCurriculum()}
      lessons={getAllSummaries().filter((l) => l.rung === rung.id)}
      test={pool ? { draw: pool.draw, pass: pool.pass } : null}
      reading={reading ? { title: reading.title, items: reading.items.length } : null}
      dialogue={dialogue ? { title: dialogue.title, lines: dialogue.lines.length, items: dialogue.items.length } : null}
      placement={rung.id === 'dasar-1' && !!getPlacement()}
    />
  );
}
