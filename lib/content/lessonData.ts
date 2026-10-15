// Build-time only: what a lesson page hands its client components besides the lesson itself.
import { getCedict, getHanzi, getWords } from './hsk';
import { getCurriculum, getDeck, getLessons, getNames, getRadicals } from './load';
import { tokens } from '../zh/text';
import type { HanziCard, HanziPart, Lesson, Radical, WordInfo } from '../types';

const IDS = /[⿰-⿻]/;

/** Top-level components of a Make Me a Hanzi decomposition (⿰女马 → 女, 马). */
export function topParts(decomposition: string): { layout: string | null; parts: string[] } {
  const chars = [...decomposition];
  if (!chars.length || !IDS.test(chars[0])) return { layout: null, parts: [] };
  const arity = (op: string) => (op === '⿲' || op === '⿳' ? 3 : 2);
  let i = 1;
  const take = (): string => {
    const c = chars[i++];
    if (c && IDS.test(c)) {
      let s = c;
      for (let k = 0; k < arity(c); k++) s += take();
      return s;
    }
    return c ?? '';
  };
  const parts: string[] = [];
  for (let k = 0; k < arity(chars[0]); k++) parts.push(take());
  return { layout: chars[0], parts: parts.filter((p) => p && p !== '？' && !IDS.test(p[0])) };
}

function radicalOf(part: string, radicals: Radical[]): Radical | undefined {
  return radicals.find((r) => r.part === part || r.forms?.includes(part));
}

/** A character's reading: its HSK 1–3 word reading if it is one, else the first CC-CEDICT reading. */
export function charReading(ch: string): string {
  const w = getWords().find((x) => x.zh === ch);
  if (w) return w.py;
  const c = getCedict()[ch]?.find(([, py]) => !/^[A-Z]/.test(py));
  return c?.[1] ?? '';
}

export function hanziCard(ch: string): HanziCard | null {
  const info = getHanzi()[ch];
  if (!info) return null;
  const radicals = getRadicals();
  const { layout, parts: raw } = topParts(info.decomposition);
  const ety = info.etymology;
  const parts: HanziPart[] = raw.map((p) => {
    const r = radicalOf(p, radicals);
    const role: HanziPart['role'] = ety?.semantic === p ? 'meaning' : ety?.phonetic === p ? 'sound' : 'part';
    const py = role === 'sound' ? charReading(p) : r?.py;
    return { part: p, role, ...(r ? { label: { id: r.id, en: r.en } } : {}), ...(py ? { py } : {}) };
  });
  const py = charReading(ch);
  let note: HanziCard['note'] = null;
  if (ety?.type === 'pictophonetic' && ety.semantic && ety.phonetic) {
    const sem = radicalOf(ety.semantic, radicals);
    const pho = charReading(ety.phonetic);
    if (sem && pho) {
      note = {
        id: `${ch} = ${ety.semantic} (arti: ${sem.id}) + ${ety.phonetic} (bunyi: ${pho})`,
        en: `${ch} = ${ety.semantic} (meaning: ${sem.en}) + ${ety.phonetic} (sound: ${pho})`,
      };
    }
  } else if (parts.length >= 2 && parts.every((p) => p.label)) {
    note = {
      id: `${ch} = ${parts.map((p) => `${p.part} (${p.label!.id})`).join(' + ')}`,
      en: `${ch} = ${parts.map((p) => `${p.part} (${p.label!.en})`).join(' + ')}`,
    };
  } else {
    const self = radicalOf(ch, radicals);
    if (self && (ety?.type === 'pictographic' || !parts.length)) note = { id: `${ch}: ${self.id}`, en: `${ch}: ${self.en}` };
  }
  return { ch, py, strokes: info.matches.length, radical: info.radical, layout, parts, note };
}

/** Lessons of the rung up to `order`, and of earlier rungs. */
function lessonsUpTo(rungId: string, order: number): Lesson[] {
  const rungs = getCurriculum();
  const upTo = rungs.findIndex((r) => r.id === rungId);
  return rungs.slice(0, upTo + 1).flatMap((r) => getLessons(r.id, { includeDrafts: true }).filter((l) => r.id !== rungId || l.order <= order));
}

/**
 * Word information for the tap-a-word sheet: every Chinese word in the lesson that a glossary (this
 * lesson's or an earlier one's), a deck meaning or the names list explains in Indonesian.
 */
export function lessonWords(l: Lesson): WordInfo[] {
  const glossary = lessonsUpTo(l.rung, l.order).flatMap((x) => x.glossary);
  const deck: { zh: string; py: string; id: string; mw?: string }[] = getCurriculum()
    .map((r) => getDeck(r.id))
    .filter(Boolean)
    .flatMap((d) => Object.entries(d!.words).map(([key, v]) => ({ zh: key.split(' ')[0], py: key.split(' ').slice(1).join(' '), ...(v as { id: string; mw?: string }) })));
  const hsk = new Map(getWords().map((w) => [w.zh, w]));
  const names = getNames();
  const texts = [l.title, ...l.examples, ...(l.worked ?? []), l.pair.natural, l.tirukan, ...(l.talk?.lines ?? []), ...(l.tone ? [l.tone] : [])];
  const out = new Map<string, WordInfo>();
  for (const t of texts) {
    for (const tok of tokens(t.zh)) {
      if (tok.kind !== 'han' || out.has(tok.text)) continue;
      const g = [...glossary].reverse().find((x) => x.zh === tok.text);
      const d = deck.find((x) => x.zh === tok.text);
      const n = names.find((x) => x.zh === tok.text);
      const h = hsk.get(tok.text);
      const id = g?.id ?? d?.id ?? n?.id;
      if (!id) continue;
      out.set(tok.text, {
        zh: tok.text,
        py: g?.py ?? d?.py ?? n?.py ?? h?.py ?? '',
        id,
        ...(g?.en ? { en: g.en } : {}),
        ...((g?.mw ?? d?.mw ?? h?.mw?.[0]) ? { mw: g?.mw ?? d?.mw ?? h?.mw?.[0] } : {}),
        ...(h ? { hsk: h.hsk } : {}),
        ...(h?.trad ? { trad: h.trad } : {}),
      });
    }
  }
  return [...out.values()];
}

/** Words introduced in this lesson or the previous two of its rung (CLAUDE.md §7.2, the "new" fade). */
export function recentWords(l: Lesson): string[] {
  return getLessons(l.rung, { includeDrafts: true })
    .filter((x) => x.order <= l.order && x.order >= l.order - 2)
    .flatMap((x) => x.glossary.map((g) => g.zh));
}

/** Hanzi card data for the lesson's new characters. */
export function lessonHanzi(l: Lesson): HanziCard[] {
  return (l.hanzi ?? []).map(hanziCard).filter((x): x is HanziCard => !!x);
}

