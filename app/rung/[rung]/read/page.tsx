import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getCurriculum, getReading, getRung } from '@/lib/content/load';
import { ReadingView } from '@/components/lesson/ReadingView';

type Params = { params: { rung: string } };

export function generateStaticParams() {
  const withReading = getCurriculum().filter((r) => getReading(r.id));
  // A static export needs at least one path; it renders the not-found page.
  return withReading.length ? withReading.map((r) => ({ rung: r.id })) : [{ rung: 'easy-1' }];
}

export function generateMetadata({ params }: Params): Metadata {
  const reading = getReading(params.rung);
  return { title: reading ? reading.title.id : undefined };
}

export default function ReadPage({ params }: Params) {
  const rung = getRung(params.rung);
  const reading = rung && getReading(rung.id);
  if (!rung || !reading) notFound();
  return <ReadingView rung={rung} reading={reading} />;
}
