import {
  DAGGER_ALIF,
  DAMMA,
  DAMMATAN,
  FATHA,
  FATHATAN,
  KASRA,
  KASRATAN,
  SHADDA,
  SUKUN,
  SUN_LETTERS,
  isArabicLetter,
  isMark,
} from './chars';

// Transliteration scheme (CLAUDE.md §10), SKB 1987 based.
const CONS: Record<string, string> = {
  ب: 'b', ت: 't', ث: 'ts', ج: 'j', ح: 'ḥ', خ: 'kh', د: 'd', ذ: 'dz', ر: 'r', ز: 'z', س: 's', ش: 'sy',
  ص: 'ṣ', ض: 'ḍ', ط: 'ṭ', ظ: 'ẓ', ع: 'ʿ', غ: 'gh', ف: 'f', ق: 'q', ك: 'k', ل: 'l', م: 'm', ن: 'n',
  ه: 'h', و: 'w', ي: 'y', ء: 'ʾ', أ: 'ʾ', إ: 'ʾ', ؤ: 'ʾ', ئ: 'ʾ', ة: 't', ى: 'y',
};
const HAMZA = new Set([...'ءأإؤئ']);
const VOWELS = /[aiuāīū]$/;
const PUNCT: Record<string, string> = { '،': ',', '؛': ';', '؟': '?' };

type Unit = { ch: string; marks: string };

function units(word: string): Unit[] {
  const out: Unit[] = [];
  for (const ch of word.normalize('NFC')) {
    if (ch === '‍' || ch === '‌' || ch === 'ـ') continue;
    if (isMark(ch) && out.length) out[out.length - 1].marks += ch;
    else out.push({ ch, marks: '' });
  }
  return out;
}

const vowelOf = (m: string): string => {
  if (m.includes(FATHATAN)) return 'an';
  if (m.includes(KASRATAN)) return 'in';
  if (m.includes(DAMMATAN)) return 'un';
  if (m.includes(FATHA)) return m.includes(DAGGER_ALIF) ? 'ā' : 'a';
  if (m.includes(KASRA)) return 'i';
  if (m.includes(DAMMA)) return 'u';
  if (m.includes(DAGGER_ALIF)) return 'ā';
  return '';
};
const hasVowel = (m: string) => vowelOf(m) !== '';
const lengthen = (s: string, v: 'a' | 'i' | 'u') =>
  s.endsWith(v) ? s.slice(0, -1) + { a: 'ā', i: 'ī', u: 'ū' }[v] : s + { a: 'ā', i: 'ī', u: 'ū' }[v];

/** Prefix clitics that can sit before the article: wa-, fa-, bi-, ka-, li-. */
const CLITICS: Record<string, string> = { و: 'wa', ف: 'fa', ب: 'bi', ك: 'ka', ل: 'li' };

/**
 * Transliterates one word. `afterVowel` is true when the previous word ended in a vowel with no
 * pause between, so hamzat wasl drops its vowel (fī l-bayti).
 */
function word(w: string, afterVowel: boolean): string {
  const u = units(w);
  if (!u.length) return '';
  // Allah (with or without a clitic): allāh, after a vowel llāh.
  const bare = u.map((x) => x.ch).join('');
  const allah = /^([وفب]?)(?:ا|ٱ)?لله$/.exec(bare);
  if (allah && bare.length >= 4) {
    const pre = allah[1] ? CLITICS[allah[1]] : '';
    return pre + (pre || afterVowel ? 'llāh' : 'allāh') + vowelOf(u[u.length - 1].marks);
  }
  if (bare === 'لله' && u[0].marks.includes(KASRA)) return 'lillāh' + vowelOf(u[u.length - 1].marks);
  let out = '';
  let i = 0;
  let noDouble = -1; // index of a sun letter whose shaddah the article already spelled

  // Clitic + article (bil-, wal-, lil-), or the bare article.
  const isAlif = (k: number) => u[k] && (u[k].ch === 'ا' || u[k].ch === 'ٱ');
  const articleAt = (k: number) => isAlif(k) && u[k + 1]?.ch === 'ل' && u.length > k + 2 && !hasVowel(u[k].marks);
  let art = -1;
  if (articleAt(0)) art = 0;
  else if (CLITICS[u[0].ch] && articleAt(1)) art = 1;
  else if (u[0].ch === 'ل' && u[1]?.ch === 'ل' && u.length > 2 && hasVowel(u[0].marks) && u[0].marks.includes(KASRA)) {
    // li + al- written as لِلْ
    out = 'li';
    i = 1;
    const next = u[2];
    if (SUN_LETTERS.has(next.ch) && next.ch !== 'ل' && !u[1].marks.includes(SUKUN)) {
      out += `${CONS[next.ch]}-`;
      noDouble = 2;
      i = 2;
    } else {
      out += 'l-';
      i = 2;
    }
  }
  if (art >= 0) {
    if (art === 1) out += CLITICS[u[0].ch];
    const lead = art === 1 || afterVowel ? '' : 'a';
    const sun = u[art + 2];
    if (sun && SUN_LETTERS.has(sun.ch) && !u[art + 1].marks.includes(SUKUN)) {
      out += `${lead}${CONS[sun.ch]}-`;
      noDouble = art + 2;
    } else {
      out += `${lead}l-`;
    }
    i = art + 2;
  }
  // A hamza straight after the article is spelled like a word-initial one: al-ummu.
  const afterArticle = art >= 0 ? art + 2 : -1;
  let lastV: '' | 'a' | 'i' | 'u' = '';
  for (; i < u.length; i++) {
    const { ch, marks } = u[i];
    const v = vowelOf(marks);
    const first = (out === '' && i === 0) || (i === afterArticle && HAMZA.has(ch));

    if (!isArabicLetter(ch)) {
      out += ch;
      lastV = '';
      continue;
    }

    // Alif: long ā, silent after -an tanwin or after ū (wāw al-jamāʿa), or hamzat wasl at the start.
    if (ch === 'ا' || ch === 'ٱ') {
      if (first) {
        if (!afterVowel) out += v || 'i';
        lastV = (v.slice(-1) as 'a' | 'i' | 'u') || 'i';
        continue;
      }
      if (marks.includes(FATHATAN)) {
        out += 'an';
      } else if (out.endsWith('an') && u[i - 1]?.marks.includes(FATHATAN)) {
        // silent seat of tanwin fath
      } else if (out.endsWith('ū') && i === u.length - 1) {
        // silent alif after wāw al-jamāʿa
      } else {
        out = lengthen(out, 'a');
      }
      lastV = '';
      continue;
    }
    if (ch === 'آ') {
      out += first ? 'ā' : 'ʾā';
      lastV = '';
      continue;
    }
    if (ch === 'ى') {
      if (out.endsWith('an') && u[i - 1]?.marks.includes(FATHATAN)) {
        // هُدًى: hudan
      } else out = lengthen(out, 'a');
      lastV = '';
      continue;
    }
    if (ch === 'ة') {
      if (hasVowel(marks)) out += 't' + v;
      else if (!out.endsWith('a') && !out.endsWith('ā')) out += 'a';
      lastV = (v.slice(-1) as 'a' | 'i' | 'u') || '';
      continue;
    }
    // و and ي as long vowels or diphthongs when they carry no vowel of their own.
    if ((ch === 'و' || ch === 'ي') && !hasVowel(marks) && !marks.includes(SHADDA) && !first) {
      const long = ch === 'و' ? 'u' : 'i';
      if (lastV === long) {
        out = lengthen(out, long);
        lastV = '';
        continue;
      }
      if (lastV === 'a') {
        out += CONS[ch];
        lastV = '';
        continue;
      }
    }
    // Hamza: not written at the very start of a word.
    if (HAMZA.has(ch)) {
      const dflt = ch === 'إ' ? 'i' : ch === 'أ' ? 'a' : '';
      out += (first ? '' : 'ʾ') + (v || (first ? dflt : ''));
      lastV = ((v || dflt).slice(-1) as 'a' | 'i' | 'u') || '';
      continue;
    }
    const c = CONS[ch] ?? '';
    out += c;
    if (marks.includes(SHADDA) && i !== noDouble) out += c;
    out += v;
    lastV = (v.slice(-1) as 'a' | 'i' | 'u') || '';
    if (v === 'ā') lastV = '';
  }
  return out;
}

/**
 * Generates a transliteration from fully vowelled Fusha: sun-letter assimilation, hamzat wasl,
 * ta marbuta (pausal vs vowelled), long vowels, diphthongs, shaddah and tanwin.
 * Authored `tr` fields stay the truth; this is for drafting and for translit:check.
 */
export function transliterate(vowelled: string): string {
  const text = vowelled.normalize('NFC').replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660));
  const parts = text.split(/(\s+|[،؛؟.,!?:;«»"()]+)/);
  let out = '';
  let afterVowel = false;
  for (const p of parts) {
    if (!p) continue;
    if (/^\s+$/.test(p)) {
      out += ' ';
      continue;
    }
    if (/^[،؛؟.,!?:;«»"()]+$/.test(p)) {
      out = out.replace(/ $/, '') + p.replace(/[،؛؟]/g, (c) => PUNCT[c]);
      afterVowel = false;
      continue;
    }
    const tr = word(p, afterVowel);
    out += tr;
    afterVowel = VOWELS.test(tr);
  }
  return out.replace(/\s+/g, ' ').trim();
}

/** Latin comparison for transliteration options: case-insensitive, ʿ ʾ ' ` ’ treated as equal. */
export function translitKey(s: string): string {
  return s
    .normalize('NFC')
    .toLowerCase()
    .replace(/[ʿʾ'`’‘]/g, "'")
    .replace(/[.,;:!?]+$/u, '')
    .replace(/\s+/g, ' ')
    .trim();
}
