'use client';

import type { LessonSummary, Rung } from '@/lib/types';
import { useProgress } from '../ProgressProvider';
import { AppShell } from '../ui/AppShell';
import { RungDetail, type DialogueInfo, type ReadingInfo, type TestInfo } from './RungDetail';

type Props = {
  rung: Rung;
  rungs: Rung[];
  lessons: LessonSummary[];
  test: TestInfo | null;
  reading: ReadingInfo | null;
  dialogue: DialogueInfo | null;
  placement: boolean;
  deck: { count: number } | null;
};

export function RungView({ rung, rungs, lessons, test, reading, dialogue, placement, deck }: Props) {
  const progress = useProgress();
  return (
    <AppShell>
      <main className="page flex max-w-lesson flex-col py-4 min-[900px]:py-8">
        <RungDetail
          rung={rung}
          rungs={rungs}
          lessons={lessons}
          progress={progress}
          test={test}
          reading={reading}
          dialogue={dialogue}
          placement={placement}
          deck={deck}
        />
      </main>
    </AppShell>
  );
}
