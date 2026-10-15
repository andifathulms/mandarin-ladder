// Authored Chinese text (CLAUDE.md §5.2): words separated by single spaces, punctuation as its own
// token, [[focus]] around one or more tokens. The renderer joins words without spaces.

const HAN = /\p{Script=Han}/u;
const HAN_G = /\p{Script=Han}/gu;

/** Chinese and Latin punctuation a token may consist of. */
export const PUNCT = /^[，。！？、：；「」『』（）《》〈〉…—·,.!?:;"'()\-~～]+$/;

export const isHan = (ch: string) => HAN.test(ch);
export const hasHan = (s: string) => HAN.test(s);
export const hanCount = (s: string) => (s.match(HAN_G) ?? []).length;
export const hanChars = (s: string) => s.match(HAN_G) ?? [];

export type ZhToken = {
  text: string;
  /** Inside [[…]]: the word being taught. Consecutive focus tokens share a group. */
  focus: boolean;
  group: number;
  kind: 'han' | 'punct' | 'latin';
};

/** Splits authored text into word and punctuation tokens, keeping [[focus]] marks. */
export function tokens(src: string): ZhToken[] {
  const out: ZhToken[] = [];
  let group = 0;
  const re = /\[\[(.+?)\]\]|([^[\]]+)/g;
  for (const m of src.normalize('NFC').matchAll(re)) {
    const focus = m[1] !== undefined;
    const body = (m[1] ?? m[2]).trim();
    group += 1;
    for (const t of body.split(/\s+/).filter(Boolean)) {
      out.push({ text: t, focus, group, kind: PUNCT.test(t) ? 'punct' : hasHan(t) ? 'han' : 'latin' });
    }
  }
  return out;
}

/** Joins tokens for display: no spaces between Chinese words; one space between Latin words. */
export function joinZh(toks: { text: string; kind?: ZhToken['kind'] }[]): string {
  let out = '';
  toks.forEach((t, i) => {
    const prev = toks[i - 1];
    const latinPair = prev && (prev.kind ?? kindOf(prev.text)) === 'latin' && (t.kind ?? kindOf(t.text)) === 'latin';
    out += (latinPair ? ' ' : '') + t.text;
  });
  return out;
}

const kindOf = (t: string): ZhToken['kind'] => (PUNCT.test(t) ? 'punct' : hasHan(t) ? 'han' : 'latin');

/** Plain display text of authored Chinese: markup removed, words joined. */
export function plainZh(src: string): string {
  return joinZh(tokens(src));
}

const FULL: Record<string, string> = { ',': '，', '.': '。', '!': '！', '?': '？', ':': '：', ';': '；', '(': '（', ')': '）', '～': '~' };

/**
 * Chinese for grading and audio keys (CLAUDE.md §7.1): NFC, markup removed, full-width punctuation
 * unified (ASCII , . ! ? : ; count as their full-width forms), all whitespace removed.
 */
export function normZh(s: string): string {
  return s
    .normalize('NFC')
    .replace(/\[\[|\]\]/g, '')
    .replace(/[,.!?:;()～]/g, (c) => FULL[c] ?? c)
    .replace(/\s+/g, '');
}

/** Runs of hanzi (with CJK punctuation inside them) in mixed prose, for wrapping in lang="zh-Hans". */
export function hanRuns(text: string): { start: number; end: number; text: string }[] {
  const out: { start: number; end: number; text: string }[] = [];
  const re = /[\p{Script=Han}][\p{Script=Han}，。！？、：；「」…·]*/gu;
  for (const m of text.matchAll(re)) {
    const start = m.index ?? 0;
    let t = m[0];
    // Trailing CJK punctuation belongs to the run only when the next char isn't Latin text.
    t = t.replace(/[，、：；]+$/u, '');
    out.push({ start, end: start + t.length, text: t });
  }
  return out;
}
