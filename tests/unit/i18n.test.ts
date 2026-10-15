import { describe, expect, it } from 'vitest';
import { translate } from '@/lib/i18n';
import { id } from '@/lib/i18n/id';
import { en } from '@/lib/i18n/en';

describe('i18n', () => {
  it('has the same keys in both languages', () => {
    expect(Object.keys(en).sort()).toEqual(Object.keys(id).sort());
  });
  it('interpolates variables', () => {
    expect(translate('id', 'lesson.stepAnnounce', { n: 3, name: 'Contoh' })).toBe(
      'Langkah 3 dari 6: Contoh',
    );
  });
  it('never uses exclamation marks in feedback copy', () => {
    for (const k of ['check.wrong', 'check.correct', 'test.notYet'] as const) {
      expect(id[k]).not.toContain('!');
      expect(en[k]).not.toContain('!');
    }
  });
});
