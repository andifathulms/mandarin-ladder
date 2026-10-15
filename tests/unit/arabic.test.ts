import { describe, expect, it } from 'vitest';
import {
  ZWJ,
  findArabicRuns,
  joinSafeSegments,
  joinSafeSplit,
  letterForm,
  looseKey,
  normalise,
  partialHarakat,
  stripHarakat,
  tokenise,
  translitKey,
  transliterate,
} from '@/lib/arabic';
import { PAIRS } from './translit-pairs';

describe('normalise', () => {
  it('applies NFC, strips tatweel and collapses whitespace', () => {
    expect(normalise('  كـــتاب   جديد ')).toBe('كتاب جديد');
    expect(normalise('آ')).toBe('آ');
  });
  it('maps Arabic punctuation to a canonical set', () => {
    expect(normalise('نعم، شكرا؛ ما هذا؟')).toBe('نعم, شكرا; ما هذا?');
  });
  it('drops joiners', () => {
    expect(normalise(`ال${ZWJ}${ZWJ}كتاب`)).toBe('الكتاب');
  });
});

describe('stripHarakat', () => {
  it('removes vowel marks, sukun, shaddah, tanwin and dagger alif', () => {
    expect(stripHarakat('مُعَلِّمٌ')).toBe('معلم');
    expect(stripHarakat('هٰذَا')).toBe('هذا');
  });
  it('keeps hamza letters', () => {
    expect(stripHarakat('سَأَلَ')).toBe('سأل');
  });
  it('can keep shaddah and tanwin', () => {
    expect(stripHarakat('مُعَلِّمٌ', { shadda: true, tanwin: true })).toBe('معلّمٌ');
  });
  it('keeps marks inside ranges', () => {
    const s = 'بَيْتٌ كَبِيرٌ';
    expect(stripHarakat(s, { ranges: [[0, 6]] })).toBe('بَيْتٌ كبير');
  });
});

describe('partialHarakat', () => {
  it('keeps shaddah, tanwin and the focus words only', () => {
    const s = 'الْمُدَرِّسُ فِي الْفَصْلِ';
    const focus = s.indexOf('فِي');
    expect(partialHarakat(s, [[focus, focus + 3]])).toBe('المدرّس فِي الفصل');
  });
});

describe('looseKey', () => {
  it('ignores harakat and unifies alef/hamza seats, ى and ة', () => {
    expect(looseKey('إِلَى')).toBe(looseKey('الي'));
    expect(looseKey('مَدْرَسَةٌ')).toBe(looseKey('مدرسه'));
    expect(looseKey('أَنَا')).toBe('انا');
    expect(looseKey('آمِن')).toBe('امن');
  });
  it('drops punctuation', () => {
    expect(looseKey('ما هٰذَا؟')).toBe('ما هذا');
  });
});

describe('tokenise', () => {
  it('splits on spaces and punctuation and keeps offsets', () => {
    const s = 'نَعَمْ، أَنَا طَالِبٌ.';
    const t = tokenise(s);
    expect(t.map((x) => x.text)).toEqual(['نَعَمْ', 'أَنَا', 'طَالِبٌ']);
    for (const x of t) expect(s.slice(x.start, x.end)).toBe(x.text);
  });
});

describe('findArabicRuns', () => {
  it('finds runs in mixed prose, bridging spaces between Arabic words', () => {
    const s = 'Kata كِتَابٌ جَدِيدٌ artinya buku baru, dan بَيْتٌ rumah.';
    expect(findArabicRuns(s).map((r) => r.text)).toEqual(['كِتَابٌ جَدِيدٌ', 'بَيْتٌ']);
  });
  it('does not take trailing spaces or Latin punctuation', () => {
    const r = findArabicRuns('(بَ), lalu');
    expect(r).toHaveLength(1);
    expect(r[0].text).toBe('بَ');
  });
});

describe('joinSafeSplit', () => {
  it('puts ZWJ on both sides of a joined boundary', () => {
    const segs = joinSafeSplit('الكِتَابُ', [[0, 2]]);
    expect(segs.map((s) => s.text)).toEqual([`ال${ZWJ}`, `${ZWJ}كِتَابُ`]);
    expect(segs.map((s) => s.focus)).toEqual([true, false]);
  });
  it('leaves boundaries after non-joining letters alone', () => {
    // دَار: dal never joins forward, so no ZWJ between دَ and ار.
    const segs = joinSafeSplit('دَارٌ', [[0, 2]]);
    expect(segs.map((s) => s.text)).toEqual(['دَ', 'ارٌ']);
  });
  it('never cuts between a letter and its marks', () => {
    const segs = joinSafeSplit('بَيْتٌ', [[0, 1]]);
    expect(segs[0].text).toBe(`بَ${ZWJ}`);
    expect(segs[1].text).toBe(`${ZWJ}يْتٌ`);
  });
  it('handles a focus in the middle of a word', () => {
    const segs = joinSafeSplit('كتابي', [[4, 5]]);
    expect(segs.map((s) => s.text)).toEqual(['كتاب' + ZWJ, ZWJ + 'ي']);
  });
});

describe('joinSafeSegments', () => {
  it('ignores pieces separated by a space', () => {
    expect(joinSafeSegments(['بَيْتٌ ', 'كَبِيرٌ'])).toEqual(['بَيْتٌ ', 'كَبِيرٌ']);
  });
});

describe('letterForm', () => {
  it('builds positional forms with ZWJ, never presentation forms', () => {
    expect(letterForm('ب', 'initial')).toBe(`ب${ZWJ}`);
    expect(letterForm('ب', 'medial')).toBe(`${ZWJ}ب${ZWJ}`);
    expect(letterForm('ب', 'final')).toBe(`${ZWJ}ب`);
    expect(letterForm('د', 'initial')).toBe('د');
    expect(letterForm('د', 'medial')).toBe(`${ZWJ}د`);
    for (const p of ['isolated', 'initial', 'medial', 'final'] as const) {
      expect(/[ﭐ-﻿]/.test(letterForm('ه', p))).toBe(false);
    }
  });
});

describe('transliterate', () => {
  it('has at least 150 known pairs', () => {
    expect(PAIRS.length).toBeGreaterThanOrEqual(150);
  });
  it.each(PAIRS)('%s → %s', (ar, tr) => {
    expect(transliterate(ar)).toBe(tr);
  });
});

describe('translitKey', () => {
  it('compares case-insensitively and treats ʿ ʾ and apostrophes alike', () => {
    expect(translitKey("Sa'ala")).toBe(translitKey('saʾala'));
    expect(translitKey("'ala")).toBe(translitKey('ʿala'));
    expect(translitKey('kitābun.')).toBe('kitābun');
  });
});
