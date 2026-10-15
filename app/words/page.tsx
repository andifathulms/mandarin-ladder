import { getAllSummaries, getCurriculum, getDeck, getLessons } from '@/lib/content/load';
import { getWords, levelIndex, rungLevel } from '@/lib/content/hsk';
import { WordsView, type WordFacts } from '@/components/WordsView';
import type { Deck } from '@/components/zh/DeckHome';
import type { DeckWord } from '@/components/zh/DeckCard';
import { tokens } from '@/lib/zh/text';
import { normPinyin } from '@/lib/zh/pinyin';

export const metadata = { title: 'Kata' };

/** One deck per live HSK rung: its level's full word list, with Indonesian meanings and examples. */
function decks(): Deck[] {
  const words = getWords();
  return getCurriculum()
    .filter((r) => r.status === 'live' && r.hsk !== '—')
    .map((r) => {
      const level = rungLevel(r);
      const deck = getDeck(r.id);
      const lessons = getLessons(r.id);
      const meaning = (zh: string, py: string) => {
        const key = Object.keys(deck?.words ?? {}).find((k) => {
          const [kz, ...kp] = k.split(' ');
          return kz === zh && normPinyin(kp.join('')) === normPinyin(py.replace(/\s+/g, ''));
        });
        return key ? deck!.words[key] : undefined;
      };
      const out: DeckWord[] = words
        .filter((w) => levelIndex(w.hsk) === levelIndex(level))
        .map((w) => {
          const m = meaning(w.zh, w.py);
          const lesson = lessons.find((l) => l.glossary.some((g) => g.zh === w.zh));
          const authored = deck?.examples.find((e) => e.word === w.zh);
          const fromLesson = lessons.flatMap((l) => l.examples).find((e) => tokens(e.zh).some((tk) => tk.text === w.zh));
          const ex = authored ?? fromLesson;
          const g = lesson?.glossary.find((x) => x.zh === w.zh);
          return {
            id: w.id,
            zh: w.zh,
            py: w.py,
            mean: m?.id ?? g?.id ?? w.en,
            meanLang: m || g ? 'id' : 'en',
            ...(m?.mw ?? w.mw?.[0] ? { mw: m?.mw ?? w.mw?.[0] } : {}),
            ...(w.trad ? { trad: w.trad } : {}),
            hsk: w.hsk,
            ...(ex ? { ex: { zh: ex.zh, py: ex.py, id: ex.id } } : {}),
            ...(lesson ? { lesson: lesson.id } : {}),
          } as DeckWord;
        });
      return { rung: r.id, name: r.name, hsk: r.hsk, words: out };
    });
}

export default function WordsPage() {
  const lessons = getAllSummaries();
  // HSK facts for the glossary words learners can meet: traditional form, level, measure word.
  const wanted = new Set(lessons.flatMap((l) => l.glossary.map((g) => g.zh)));
  const facts: WordFacts = {};
  for (const w of getWords()) {
    if (!wanted.has(w.zh) || facts[w.zh]) continue;
    facts[w.zh] = { ...(w.trad ? { trad: w.trad } : {}), hsk: w.hsk, ...(w.mw?.[0] ? { mw: w.mw[0] } : {}) };
  }
  return <WordsView lessons={lessons} rungs={getCurriculum()} facts={facts} decks={decks()} />;
}
