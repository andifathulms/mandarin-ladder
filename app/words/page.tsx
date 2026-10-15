import { getAllSummaries, getCurriculum } from '@/lib/content/load';
import { getWords } from '@/lib/content/hsk';
import { WordsView, type WordFacts } from '@/components/WordsView';

export const metadata = { title: 'Kata-kataku' };

export default function WordsPage() {
  const lessons = getAllSummaries();
  // HSK facts for the glossary words learners can meet: traditional form, level, measure word.
  const wanted = new Set(lessons.flatMap((l) => l.glossary.map((g) => g.zh)));
  const facts: WordFacts = {};
  for (const w of getWords()) {
    if (!wanted.has(w.zh) || facts[w.zh]) continue;
    facts[w.zh] = { ...(w.trad ? { trad: w.trad } : {}), hsk: w.hsk, ...(w.mw?.[0] ? { mw: w.mw[0] } : {}) };
  }
  return <WordsView lessons={lessons} rungs={getCurriculum()} facts={facts} />;
}
