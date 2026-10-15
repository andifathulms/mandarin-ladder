import { describe, expect, it } from 'vitest';
import { parseSections } from '@/lib/content/sections';
import { getCurriculum } from '@/lib/content/load';
import { CheckItemSchema } from '@/lib/content/schema';

const body = (extra = '') => `
## concept.id
Konsep.

## concept.en
Concept.

## contrast.id
Beda.

## contrast.en
Contrast.
${extra}`;

describe('section parser', () => {
  it('maps fixed headings', () => {
    expect(parseSections(body())).toEqual({
      concept: { id: 'Konsep.', en: 'Concept.' },
      contrast: { id: 'Beda.', en: 'Contrast.' },
    });
  });
  it('rejects unknown headings', () => {
    expect(() => parseSections(body('\n## notes\nx'))).toThrow(/unknown section/);
  });
  it('rejects missing sections', () => {
    expect(() => parseSections('## concept.id\nx')).toThrow(/missing section/);
  });
});

describe('check item schema', () => {
  const why = { id: 'x', en: 'y' };
  it('requires the answer among options', () => {
    const r = CheckItemSchema.safeParse({ id: 'a', type: 'choice', prompt: 'p', options: ['a', 'b'], answer: 'c', why });
    expect(r.success).toBe(false);
  });
  it('requires exactly one gap', () => {
    const r = CheckItemSchema.safeParse({ id: 'a', type: 'gap', prompt: 'no gap', options: ['a', 'b'], answer: 'a', why });
    expect(r.success).toBe(false);
  });
  it('requires a listen answer among options', () => {
    const r = CheckItemSchema.safeParse({ id: 'a', type: 'listen', audio: 'x', options: ['a', 'b'], answer: 'x', why });
    expect(r.success).toBe(false);
  });
  it('requires a spell answer to be exactly the joined letters', () => {
    const ok = CheckItemSchema.safeParse({ id: 'a', type: 'spell', letters: ['ب', 'ي', 'ت'], answer: 'بيت', why });
    expect(ok.success).toBe(true);
    const bad = CheckItemSchema.safeParse({ id: 'a', type: 'spell', letters: ['ب', 'ي', 'ت'], answer: 'تيب', why });
    expect(bad.success).toBe(false);
  });
  it('requires dictation to have audio', () => {
    const r = CheckItemSchema.safeParse({ id: 'a', type: 'spell', letters: ['ب', 'ي', 'ت'], answer: 'بيت', dictation: true, why });
    expect(r.success).toBe(false);
  });
  it('checks a mark answer against the word itself', () => {
    const base = { id: 'a', type: 'mark', ar: 'دَرْسٌ', target: 1, options: ['fatha', 'sukun'], why };
    expect(CheckItemSchema.safeParse({ ...base, answer: 'sukun' }).success).toBe(true);
    expect(CheckItemSchema.safeParse({ ...base, answer: 'fatha' }).success).toBe(false);
    expect(CheckItemSchema.safeParse({ ...base, target: 9, answer: 'sukun' }).success).toBe(false);
  });
  it('requires order answers to use the tiles', () => {
    const r = CheckItemSchema.safeParse({ id: 'a', type: 'order', tiles: ['a', 'b'], answer: ['a', 'c'], why });
    expect(r.success).toBe(false);
  });
});

describe('content loaders', () => {
  it('loads the curriculum', () => {
    expect(getCurriculum().length).toBeGreaterThan(0);
  });
});
