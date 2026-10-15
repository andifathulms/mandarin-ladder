import { getCurriculum, getLessons } from '@/lib/content/load';
import { ReviewRunner } from '@/components/check/ReviewRunner';
import { VisualDataProvider } from '@/components/visuals/VisualData';
import { visualData } from '@/lib/content/visualData';

export const metadata = { title: 'Ulang cepat' };

export default function ReviewPage() {
  const lessons = getCurriculum().flatMap((r) => getLessons(r.id));
  const items = lessons.flatMap((l) => l.check.map((item) => ({ item, lessonId: l.id })));
  return (
    <VisualDataProvider value={visualData()}>
      <ReviewRunner items={items} />
    </VisualDataProvider>
  );
}
