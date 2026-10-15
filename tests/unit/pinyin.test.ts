import { describe, expect, it } from 'vitest';
import { SYLLABLE_BASES, isValidSyllable, syllableParts } from '@/lib/zh/syllables';
import { markIndex, markSyllable, marksToNum, normPinyin, numToMarks, samePinyin, stripTone, syllables, toneOf, type Tone } from '@/lib/zh/pinyin';

const TONES: Tone[] = [1, 2, 3, 4];

describe('syllable table', () => {
  it('has the standard ~400 bases and no duplicates', () => {
    expect(SYLLABLE_BASES.length).toBeGreaterThan(395);
    expect(SYLLABLE_BASES.length).toBeLessThan(420);
    expect(new Set(SYLLABLE_BASES).size).toBe(SYLLABLE_BASES.length);
  });
  it.each(['ma', 'zhuang', 'nü', 'lüe', 'jiong', 'er', 'a', 'yo', 'shei', 'diu', 'lia'])('knows %s', (s) => {
    expect(isValidSyllable(s)).toBe(true);
  });
  it.each(['jü', 'jv', 'lv', 'nu:'])('accepts the ü spellings %s', (s) => expect(isValidSyllable(s)).toBe(true));
  it.each(['bü', 'fi', 'gi', 'zhia', 'xa', 'cuang', 'ngo', 'ê'])('rejects %s', (s) => {
    expect(isValidSyllable(s)).toBe(false);
  });
  it('splits initials from finals, with y/w as spelling', () => {
    expect(syllableParts('zhuang')).toEqual({ initial: 'zh', final: 'uang' });
    expect(syllableParts('you')).toEqual({ initial: '', final: 'you' });
    expect(syllableParts('qu')).toEqual({ initial: 'q', final: 'u' });
  });
});

describe('tone marks', () => {
  it('places the mark on a/e first, the o of ou, else the last vowel', () => {
    expect(markSyllable('hao', 3)).toBe('hǎo');
    expect(markSyllable('xie', 4)).toBe('xiè');
    expect(markSyllable('gou', 3)).toBe('gǒu');
    expect(markSyllable('liu', 2)).toBe('liú');
    expect(markSyllable('gui', 4)).toBe('guì');
    expect(markSyllable('lüe', 4)).toBe('lüè');
    expect(markSyllable('nü', 3)).toBe('nǚ');
    expect(markSyllable('lv', 4)).toBe('lǜ');
    expect(markSyllable('er', 2)).toBe('ér');
    expect(markSyllable('ma', 0)).toBe('ma');
    expect(markIndex('zhuang')).toBe(3);
  });
  it('reads tones from marks and digits; neutral is 0', () => {
    expect(toneOf('mā')).toBe(1);
    expect(toneOf('má')).toBe(2);
    expect(toneOf('mǎ')).toBe(3);
    expect(toneOf('mà')).toBe(4);
    expect(toneOf('ma')).toBe(0);
    expect(toneOf('ma3')).toBe(3);
    expect(toneOf('ma5')).toBe(0);
    expect(stripTone('lǜshī')).toBe('lüshi');
  });
});

describe('round trip over the whole syllable table', () => {
  for (const base of SYLLABLE_BASES) {
    it(base, () => {
      for (const t of TONES) {
        const marked = markSyllable(base, t);
        const num = `${base.replace(/ü/g, 'v')}${t}`;
        expect(numToMarks(num)).toBe(marked);
        expect(marksToNum(marked)).toBe(num);
        expect(toneOf(marked)).toBe(t);
        expect(stripTone(marked)).toBe(base);
      }
    });
  }
});

describe('splitting words into syllables', () => {
  const split = (w: string) => syllables(w)?.map((s) => s.text);
  it('splits ordinary words', () => {
    expect(split('nǐhǎo')).toEqual(['nǐ', 'hǎo']);
    expect(split('zhōngguó')).toEqual(['zhōng', 'guó']);
    expect(split('Běijīng')).toEqual(['Běi', 'jīng']);
  });
  it('respects apostrophes and the a/o/e rule', () => {
    expect(split("xī'ān")).toEqual(['xī', 'ān']);
    expect(split('xiān')).toEqual(['xiān']);
    expect(split("fāng'àn")).toEqual(['fāng', 'àn']);
    expect(split('jiàngé')).toEqual(['jiàn', 'gé']);
    expect(split("tiān'ānmén")).toEqual(['tiān', 'ān', 'mén']);
  });
  it('treats tone digits as separators', () => {
    expect(split('xi1an1')).toEqual(['xi1', 'an1']);
    expect(split('ni3hao3')).toEqual(['ni3', 'hao3']);
  });
  it('splits a final erhua r as its own unit', () => {
    const s = syllables('yìdiǎnr')!;
    expect(s.map((x) => x.text)).toEqual(['yì', 'diǎn', 'r']);
    expect(s[2].erhua).toBe(true);
    expect(split('érzi')).toEqual(['ér', 'zi']);
  });
  it('returns null for non-pinyin', () => {
    expect(syllables('hello')).toBeNull();
    expect(syllables('xyz')).toBeNull();
  });
});

describe('numeric ↔ marks', () => {
  it('converts phrases', () => {
    expect(numToMarks('ni3 hao3')).toBe('nǐ hǎo');
    expect(numToMarks('xie4xie5')).toBe('xièxie');
    expect(numToMarks('xi1an1')).toBe("xī'ān");
    expect(numToMarks('lv4 nu:3')).toBe('lǜ nǚ');
    expect(marksToNum('nǐ hǎo')).toBe('ni3 hao3');
    expect(marksToNum('xièxie')).toBe('xie4xie5');
  });
  it('leaves partial input alone', () => {
    expect(numToMarks('zh')).toBe('zh');
    expect(numToMarks('ni3 h')).toBe('nǐ h');
  });
});

describe('normPinyin (grading)', () => {
  it('treats marks and numbers as equal, ignoring case, spaces and apostrophes', () => {
    expect(normPinyin('Xièxie')).toBe('xie4xie5');
    expect(normPinyin('xie4 xie5')).toBe('xie4xie5');
    expect(normPinyin('xie4xie')).toBe('xie4xie5');
    expect(normPinyin("xī'ān")).toBe(normPinyin('xi1an1'));
    expect(samePinyin('nǐ hǎo', 'NI3HAO3')).toBe(true);
  });
  it('unifies ü typed as ü, v or u:', () => {
    const want = normPinyin('lǜ');
    expect(normPinyin('lv4')).toBe(want);
    expect(normPinyin('lu:4')).toBe(want);
    expect(normPinyin('lü4')).toBe(want);
    expect(normPinyin('lu4')).not.toBe(want);
  });
  it('spells ü as u after j q x y', () => {
    expect(normPinyin('jv2')).toBe(normPinyin('jú'));
    expect(normPinyin('qü4')).toBe(normPinyin('qù'));
    expect(normPinyin('yü2')).toBe(normPinyin('yú'));
  });
  it('distinguishes tones', () => {
    expect(samePinyin('mā', 'mǎ')).toBe(false);
    expect(samePinyin('ma', 'mā')).toBe(false);
  });
  it('returns null for text that is not pinyin', () => {
    expect(normPinyin('hello')).toBeNull();
    expect(samePinyin('hello', 'hello')).toBe(false);
  });
});

import { spell } from '@/lib/zh/syllables';

describe('spell (SyllableBuilder)', () => {
  it.each([
    ['m', 'a', 'ma'],
    ['', 'i', 'yi'],
    ['', 'ian', 'yan'],
    ['', 'u', 'wu'],
    ['', 'uo', 'wo'],
    ['', 'ü', 'yu'],
    ['', 'üan', 'yuan'],
    ['', 'iu', 'you'],
    ['', 'ui', 'wei'],
    ['', 'un', 'wen'],
    ['j', 'ü', 'ju'],
    ['x', 'üe', 'xue'],
    ['n', 'ü', 'nü'],
    ['l', 'üe', 'lüe'],
    ['zh', 'uang', 'zhuang'],
    ['', 'er', 'er'],
  ])('%s + %s → %s', (i, f, want) => {
    expect(spell(i, f)).toBe(want);
    expect(isValidSyllable(want)).toBe(true);
  });
  it('can spell syllables that do not exist', () => {
    expect(isValidSyllable(spell('b', 'ü'))).toBe(false);
    expect(isValidSyllable(spell('f', 'i'))).toBe(false);
  });
});
