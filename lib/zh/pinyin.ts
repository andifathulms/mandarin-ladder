// Pinyin: tone marks, tone numbers, syllable splitting and grading normalisation (CLAUDE.md §7.1).
// Pure and dependency-free so the client, the build scripts and the tests share it.
import { isValidSyllable } from './syllables';

export type Tone = 0 | 1 | 2 | 3 | 4;

const MARKED: Record<string, [string, Tone]> = {};
const MARKS: Record<string, string[]> = {
  a: ['ā', 'á', 'ǎ', 'à'],
  e: ['ē', 'é', 'ě', 'è'],
  i: ['ī', 'í', 'ǐ', 'ì'],
  o: ['ō', 'ó', 'ǒ', 'ò'],
  u: ['ū', 'ú', 'ǔ', 'ù'],
  ü: ['ǖ', 'ǘ', 'ǚ', 'ǜ'],
  n: ['', 'ń', 'ň', 'ǹ'],
  m: ['', 'ḿ', '', 'm̀'],
};
for (const [base, list] of Object.entries(MARKS)) {
  list.forEach((m, k) => {
    if (!m) return;
    MARKED[m] = [base, (k + 1) as Tone];
    MARKED[m.toUpperCase()] = [base.toUpperCase(), (k + 1) as Tone];
  });
}

const nfc = (s: string) => s.normalize('NFC');

/** The tone of one syllable: from its mark, or a trailing 1–5 digit (5 and 0 are neutral). */
export function toneOf(syllable: string): Tone {
  const s = nfc(syllable);
  const d = /([0-5])$/.exec(s);
  if (d) return (Number(d[1]) % 5) as Tone;
  for (const ch of s) if (MARKED[ch]) return MARKED[ch][1];
  return 0;
}

/** A syllable (or word) with marks and tone digits removed; ü is kept. */
export function stripTone(s: string): string {
  let out = '';
  for (const ch of nfc(s)) out += MARKED[ch] ? MARKED[ch][0] : ch;
  return out.replace(/[0-5]/g, '');
}

/**
 * Where the tone mark goes (CLAUDE.md §6.4): on a or e if present; on the o of ou; otherwise on the
 * last vowel, so iu → iú and ui → uí.
 */
export function markIndex(base: string): number {
  const s = base.toLowerCase();
  const a = s.indexOf('a');
  if (a >= 0) return a;
  const e = s.indexOf('e');
  if (e >= 0) return e;
  const ou = s.indexOf('ou');
  if (ou >= 0) return ou;
  for (let i = s.length - 1; i >= 0; i--) if ('iouü'.includes(s[i])) return i;
  // Syllabic nasals (ńg, m̀)
  const n = s.search(/[nm]/);
  return n;
}

/** Puts the tone mark on a toneless syllable base. Tone 0 returns the base unchanged. */
export function markSyllable(base: string, tone: Tone): string {
  const b = base.replace(/v|u:/gi, (m) => (m === m.toUpperCase() && m !== 'u:' ? 'Ü' : 'ü'));
  if (!tone) return b;
  const i = markIndex(b);
  if (i < 0) return b;
  const ch = b[i];
  const lower = ch.toLowerCase();
  const m = MARKS[lower]?.[tone - 1];
  if (!m) return b;
  return b.slice(0, i) + (ch === lower ? m : m.toUpperCase()) + b.slice(i + 1);
}

export type Syllable = {
  /** The syllable as written in the source (marks or digit kept). */
  text: string;
  /** Lowercase toneless base, ü as ü ("r" for an erhua 儿). */
  base: string;
  tone: Tone;
  /** An erhua r (哪儿 nǎr): it stands for 儿 but adds no syllable of its own. */
  erhua?: boolean;
};

const VOWEL_START = /^[aoeāáǎàōóǒòēéěè]/i;

/**
 * Splits one pinyin word into syllables. Accepts tone marks or tone numbers, apostrophes (xī'ān),
 * v or u: for ü, and a final erhua r. Within a word, a syllable after the first never starts with
 * a, o or e unless an apostrophe precedes it (pinyin orthography), which resolves fangan → fang an.
 * Returns null when the word does not split into valid syllables.
 */
export function syllables(word: string): Syllable[] | null {
  const src = nfc(word).replace(/u:/gi, (m) => (m[0] === 'U' ? 'Ü' : 'ü')).replace(/[vV]/g, (m) => (m === 'V' ? 'Ü' : 'ü'));
  // Each source character with its toneless lowercase form (marks are single NFC code points).
  const chars = [...src];
  const plain = chars.map((c) => (MARKED[c] ? MARKED[c][0] : c).toLowerCase());
  const n = chars.length;
  const memo = new Map<number, Syllable[] | null>();

  const at = (i: number, afterApostrophe: boolean, first: boolean): Syllable[] | null => {
    if (i === n) return [];
    const key = i * 4 + (afterApostrophe ? 2 : 0) + (first ? 1 : 0);
    if (memo.has(key)) return memo.get(key)!;
    let res: Syllable[] | null = null;
    if (plain[i] === "'" || plain[i] === '’' || plain[i] === '-') {
      res = i > 0 ? at(i + 1, true, false) : null;
    } else {
      for (let len = Math.min(6, n - i); len >= 1 && !res; len--) {
        const piece = plain.slice(i, i + len).join('');
        if (!/^[a-zü]+$/.test(piece)) continue;
        const isErhua = piece === 'r' && i > 0 && plain[i - 1] !== "'";
        if (!isErhua && !isValidSyllable(piece)) continue;
        if (!first && !afterApostrophe && !isErhua && VOWEL_START.test(chars.slice(i, i + len).join(''))) continue;
        let end = i + len;
        let tone: Tone = toneOf(chars.slice(i, end).join(''));
        // A tone digit also separates syllables, as an apostrophe does: xi1an1.
        const digit = end < n && /[0-5]/.test(plain[end]);
        if (digit) {
          tone = (Number(plain[end]) % 5) as Tone;
          end += 1;
        }
        if (isErhua && end !== n && plain[end] !== "'" && plain[end] !== '-') continue;
        const rest = at(end, digit, false);
        if (rest) {
          const text = chars.slice(i, end).join('');
          res = [{ text, base: piece, tone: isErhua ? 0 : tone, ...(isErhua ? { erhua: true } : {}) }, ...rest];
        }
      }
    }
    memo.set(key, res);
    return res;
  };
  if (!n) return [];
  return at(0, false, true);
}

/** Converts tone numbers to marks: "ni3 hao3" → "nǐ hǎo", "lv4" → "lǜ", "xi1an1" → "xī'ān". Unparseable words pass through. */
export function numToMarks(s: string): string {
  return s
    .split(/(\s+)/)
    .map((word) => {
      if (!word.trim()) return word;
      const syl = syllables(word);
      if (!syl) return word;
      let out = '';
      syl.forEach((x, k) => {
        const raw = x.text.replace(/[0-5]$/, '');
        const marked = x.erhua || !/[0-5]$/.test(x.text) ? raw : markSyllable(stripTone(raw), x.tone);
        // Orthography: an apostrophe before a/o/e syllables inside a word.
        const sep = k > 0 && !out.endsWith("'") && /^[aoeāáǎàōóǒòēéěè]/i.test(marked) ? "'" : '';
        out += sep + marked;
      });
      return out;
    })
    .join('');
}

/** Converts marks to numbers: "nǐ hǎo" → "ni3 hao3"; neutral syllables get 5. Unparseable words pass through. */
export function marksToNum(s: string): string {
  return s
    .split(/(\s+)/)
    .map((word) => {
      if (!word.trim()) return word;
      const syl = syllables(word);
      if (!syl) return word;
      return syl.map((x) => (x.erhua ? 'r' : `${stripTone(x.text.replace(/[0-5]$/, '')).replace(/ü/g, 'v').replace(/Ü/g, 'V')}${x.tone || 5}`)).join('');
    })
    .join('');
}

/**
 * Pinyin for grading (PRD §5.4): lowercase, numeric tones (neutral = 5), no spaces, apostrophes or
 * hyphens, ü unified (typed as ü, v or u:; written u after j q x y). Tone marks and numbers compare
 * equal. Returns null when the text does not split into syllables.
 */
export function normPinyin(s: string): string | null {
  const words = nfc(s.trim()).toLowerCase().replace(/u:/g, 'ü').split(/[\s,.!?;:，。！？；：]+/).filter(Boolean);
  const out: string[] = [];
  for (const w of words) {
    const syl = syllables(w);
    if (!syl) return null;
    for (const x of syl) {
      if (x.erhua) {
        out.push('r');
        continue;
      }
      const base = /^[jqxy]ü/.test(x.base) ? x.base.replace('ü', 'u') : x.base;
      out.push(`${base.replace(/ü/g, 'v')}${x.tone || 5}`);
    }
  }
  return out.join('');
}

/** True when two pinyin strings are the same answer. */
export function samePinyin(a: string, b: string): boolean {
  const x = normPinyin(a);
  const y = normPinyin(b);
  return x !== null && x === y;
}

/** The number of syllables a pinyin word stands for (erhua r counts, since it pairs with 儿). */
export function syllableCount(word: string): number | null {
  return syllables(word)?.length ?? null;
}
