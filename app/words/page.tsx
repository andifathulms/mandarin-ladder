import { getAllSummaries, getCurriculum } from '@/lib/content/load';
import { WordsView } from '@/components/WordsView';

export const metadata = { title: 'Kata-kataku' };

export default function WordsPage() {
  return <WordsView lessons={getAllSummaries()} rungs={getCurriculum()} />;
}
