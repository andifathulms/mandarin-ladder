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
  it('requires a tone answer among the options, and audio_py for Chinese audio', () => {
    const base = { id: 'a', type: 'tone', audio: '你好', audio_py: 'nǐhǎo', options: [[3, 3], [2, 3]], why };
    expect(CheckItemSchema.safeParse({ ...base, answer: [2, 3] }).success).toBe(true);
    expect(CheckItemSchema.safeParse({ ...base, answer: [1, 1] }).success).toBe(false);
    const { audio_py: _, ...noPy } = base;
    expect(CheckItemSchema.safeParse({ ...noPy, answer: [2, 3] }).success).toBe(false);
    expect(CheckItemSchema.safeParse({ ...noPy, audio: 'syl-ma3', options: [[3], [2]], answer: [3] }).success).toBe(true);
  });
  it('requires build answers among the parts and trace items to name one character', () => {
    expect(CheckItemSchema.safeParse({ id: 'a', type: 'build', char: '好', parts: ['女', '子', '马'], answer: ['女', '子'], why }).success).toBe(true);
    expect(CheckItemSchema.safeParse({ id: 'a', type: 'build', char: '好', parts: ['女', '子', '马'], answer: ['女', '口'], why }).success).toBe(false);
    expect(CheckItemSchema.safeParse({ id: 'a', type: 'trace', char: '你好', why }).success).toBe(false);
    expect(CheckItemSchema.safeParse({ id: 'a', type: 'trace', char: '你', why }).success).toBe(true);
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
