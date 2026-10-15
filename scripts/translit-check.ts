/*
 * Compares authored `tr` fields with transliterate(ar) and warns on differences beyond the allowed
 * variants (pausal endings, ta marbuta in pause, hyphenation and wasl spelling). Authored tr stays
 * the truth; this only flags likely typos.
 */
import path from 'node:path';
import { getCurriculum, getDialogue, getLessons, getReading } from '../lib/content/load';
import { dialogueArabic, lessonArabic, readingArabic, type ArText } from '../lib/content/arabicTexts';
import { translitKey, transliterate } from '../lib/arabic/translit';

const flat = (s: string) =>
  translitKey(s)
    .replace(/[.,;:!?"«»()]/g, '')
    .replace(/-/g, '')
    .replace(/\s+/g, ' ')
    .trim();

/** Strips a pausal ending from one transliterated word. */
const pausal = (w: string) =>
  w
    .replace(/ah$/, 'a')
    .replace(/(at)(un|an|in|u|a|i)$/, 'a')
    .replace(/(un|an|in)$/, '')
    .replace(/([^aiuāīū])(u|i|a)$/, '$1');

export function translitMatches(authored: string, ar: string): boolean {
  const a = flat(authored);
  const g = flat(transliterate(ar));
  if (a === g || a.replace(/ /g, '') === g.replace(/ /g, '')) return true;
  const aw = a.split(' ');
  const gw = g.split(' ');
  if (aw.length !== gw.length) return false;
  return aw.every((w, i) => w === gw[i] || pausal(w) === pausal(gw[i]) || w === pausal(gw[i]));
}

export function translitFindings(texts: ArText[], where: string): string[] {
  return texts
    // Lone marks on a dotted circle (◌َ) name a vowel, not a word: nothing to compare.
    .filter((t) => t.tr && !t.eg && !t.displayOnly && !t.ar.includes('\u25CC'))
    .filter((t) => !translitMatches(t.tr!, t.ar))
    .map((t) => `${where}: ${t.where}: tr "${t.tr}" vs generated "${transliterate(t.ar)}"`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename)) {
  const out: string[] = [];
  for (const r of getCurriculum()) {
    for (const l of getLessons(r.id, { includeDrafts: true })) out.push(...translitFindings(lessonArabic(l), `${r.id}/${l.slug}`));
    const reading = getReading(r.id);
    if (reading) out.push(...translitFindings(readingArabic(reading), `${r.id}/reading.yaml`));
    const dialogue = getDialogue(r.id);
    if (dialogue) out.push(...translitFindings(dialogueArabic(dialogue), `${r.id}/dialogue.yaml`));
  }
  for (const w of out) console.warn(`warn  ${w}`);
  console.log(`translit:check — ${out.length} differences`);
}
