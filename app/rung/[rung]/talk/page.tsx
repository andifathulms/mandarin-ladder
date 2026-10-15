import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getCurriculum, getDialogue, getRung } from '@/lib/content/load';
import { DialogueView } from '@/components/lesson/DialogueView';

type Params = { params: { rung: string } };

export function generateStaticParams() {
  const withDialogue = getCurriculum().filter((r) => getDialogue(r.id));
  // A static export needs at least one path; it renders the not-found page.
  return withDialogue.length ? withDialogue.map((r) => ({ rung: r.id })) : [{ rung: 'easy-1' }];
}

export function generateMetadata({ params }: Params): Metadata {
  const d = getDialogue(params.rung);
  return { title: d ? d.title.id : undefined };
}

export default function TalkPage({ params }: Params) {
  const rung = getRung(params.rung);
  const dialogue = rung && getDialogue(rung.id);
  if (!rung || !dialogue) notFound();
  return <DialogueView rung={rung} dialogue={dialogue} />;
}
