import { describe, expect, it } from 'vitest';
import { candidates, hurufOneProblems, missingHarakat } from '@/lib/content/lint';
import { looseKey } from '@/lib/arabic';
import { translitMatches } from '@/scripts/translit-check';

describe('lexicon clitic stripping', () => {
  const has = (w: string, base: string) => candidates(w).includes(looseKey(base));
  it('strips the article and prefixes', () => {
    expect(has('الكِتَابُ', 'كِتَابٌ')).toBe(true);
    expect(has('بِالْقَلَمِ', 'قَلَمٌ')).toBe(true);
    expect(has('وَالبَيْتُ', 'بَيْتٌ')).toBe(true);
    expect(has('لِلْبَيْتِ', 'بَيْتٌ')).toBe(true);
  });
  it('strips possessive endings and restores ta marbuta', () => {
    expect(has('كِتَابِي', 'كِتَابٌ')).toBe(true);
    expect(has('كِتَابُهَا', 'كِتَابٌ')).toBe(true);
    expect(has('مَدْرَسَتِي', 'مَدْرَسَةٌ')).toBe(true);
    expect(has('بَيْتُنَا', 'بَيْتٌ')).toBe(true);
  });
});

describe('harakat completeness', () => {
  it('accepts fully vowelled text, long vowels, al- and pausal endings', () => {
    expect(missingHarakat('الكِتَابُ عَلَى الطَّاوِلَةِ.')).toEqual([]);
    expect(missingHarakat('هٰذَا بَيْتٌ كَبِيرٌ.')).toEqual([]);
    expect(missingHarakat('السَّلَامُ عَلَيْكُمْ')).toEqual([]);
    expect(missingHarakat('أَنَا مِنْ إِنْدُونِيسِيَا.')).toEqual([]);
    expect(missingHarakat('شُكْرًا')).toEqual([]);
    expect(missingHarakat('مَدْرَسَة')).toEqual([]); // pausal ta marbuta
  });
  it('flags consonants with no vowel mid-word', () => {
    expect(missingHarakat('كتَابٌ جَدِيدٌ')).toEqual(['كتَابٌ (ك)']);
    expect(missingHarakat('مَدرَسَةٌ')).toEqual(['مَدرَسَةٌ (د)']);
  });
});

describe('Huruf 1 script inventory', () => {
  const allowed = new Set(['ب', 'ت', 'ث']);
  it('allows taught letters with short vowels', () => {
    expect(hurufOneProblems('بَتَ ثَبَ بُتِ', allowed)).toEqual([]);
  });
  it('flags letters not taught yet', () => {
    expect(hurufOneProblems('بَنَ', allowed)).toEqual(['بَنَ: letter ن not taught yet']);
  });
  it('flags mad, sukun, syaddah and tanwin', () => {
    const p = hurufOneProblems('بَتْ ثَبٌّ', allowed);
    expect(p.length).toBe(2);
  });
});

describe('translit:check variants', () => {
  it('accepts pausal endings and wasl spellings', () => {
    expect(translitMatches('kitāb', 'كِتَابٌ')).toBe(true);
    expect(translitMatches('al-kitābu ʿalā ṭ-ṭāwilah', 'الكِتَابُ عَلَى الطَّاوِلَةِ')).toBe(true);
    expect(translitMatches('madrasa', 'مَدْرَسَةٌ')).toBe(true);
  });
  it('flags real differences', () => {
    expect(translitMatches('kutub', 'كِتَابٌ')).toBe(false);
  });
});
