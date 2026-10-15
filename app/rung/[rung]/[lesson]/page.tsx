import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getCurriculum, getHokkien, getLesson, getLessons, getRung, getTestPool, glossaryWordIds, showDrafts, summarize } from '@/lib/content/load';
import { lessonHanzi, lessonWords, recentWords } from '@/lib/content/lessonData';
import { LessonPlayer } from '@/components/lesson/LessonPlayer';
import { VisualDataProvider } from '@/components/visuals/VisualData';
import { visualData } from '@/lib/content/visualData';
import { hanChars } from '@/lib/zh/text';

type Params = { params: { rung: string; lesson: string } };

export function generateStaticParams() {
  const params = getCurriculum().flatMap((r) => getLessons(r.id).map((l) => ({ rung: r.id, lesson: l.slug })));
  // A static export needs at least one path; it renders the not-found page.
  return params.length ? params : [{ rung: 'easy-1', lesson: 'none' }];
}

export function generateMetadata({ params }: Params): Metadata {
  const l = getLesson(params.rung, params.lesson);
  return { title: l ? l.title.id : undefined };
}

export default function LessonPage({ params }: Params) {
  const rung = getRung(params.rung);
  const lesson = getLesson(params.rung, params.lesson);
  if (!rung || !lesson) notFound();

  const lessons = getLessons(rung.id);
  const nextLesson =
    (lesson.next && lessons.find((l) => l.id === lesson.next)) || lessons.find((l) => l.order === lesson.order + 1) || null;
  const rungs = getCurriculum();
  const spiral = rungs.slice(rungs.findIndex((r) => r.id === rung.id) + 1).find((r) => r.threads.includes(lesson.spiral));
  // Characters the lesson's visuals and build items may explode into parts.
  const visualChars = [
    ...(lesson.hanzi ?? []),
    ...hanChars(JSON.stringify(lesson.visual?.props ?? {})),
    ...lesson.check.flatMap((c) => (c.type === 'build' || c.type === 'trace' ? [c.char] : [])),
  ];
  // Hokkien bridges show only once someone who knows the Hokkien form has checked them (CLAUDE.md §6.7).
  const hokkien = getHokkien().filter((h) => lesson.hokkien?.includes(h.id_word) && (h.reviewed_by || showDrafts()));

  return (
    <VisualDataProvider value={visualData(visualChars, { examples: lesson.visual?.id === 'syllable-builder' })}>
      <LessonPlayer
        lesson={lesson}
        rung={rung}
        rungLessons={lessons.map(summarize)}
        next={nextLesson ? summarize(nextLesson) : null}
        hasTest={!!getTestPool(rung.id)}
        spiralRung={spiral?.name ?? null}
        words={lessonWords(lesson)}
        recent={recentWords(lesson)}
        hanzi={lessonHanzi(lesson)}
        hokkien={hokkien}
        wordIds={glossaryWordIds(lesson.glossary)}
      />
    </VisualDataProvider>
  );
}
