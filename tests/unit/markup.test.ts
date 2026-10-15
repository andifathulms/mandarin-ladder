import { describe, expect, it } from 'vitest';
import { focusCount, parseInline, stripMarkup } from '@/lib/markup';

describe('sentence markup', () => {
  it('parses focus, bold and italic', () => {
    expect(parseInline('The ball is [[under]] the *table*, **really**.')).toEqual([
      { t: 'text', v: 'The ball is ' },
      { t: 'focus', v: 'under' },
      { t: 'text', v: ' the ' },
      { t: 'em', v: 'table' },
      { t: 'text', v: ', ' },
      { t: 'strong', v: 'really' },
      { t: 'text', v: '.' },
    ]);
  });
  it('handles focus attached to a word', () => {
    expect(parseInline("I[['m]] tired.")).toEqual([
      { t: 'text', v: 'I' },
      { t: 'focus', v: "'m" },
      { t: 'text', v: ' tired.' },
    ]);
  });
  it('strips markup to plain text', () => {
    expect(stripMarkup('My phone is [[in]] my **bag**.')).toBe('My phone is in my bag.');
  });
  it('counts focus words', () => {
    expect(focusCount('[[a]] and [[b]]')).toBe(2);
    expect(focusCount('plain')).toBe(0);
  });
});
