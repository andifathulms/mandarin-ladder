import { describe, expect, it } from 'vitest';
import { hanRuns, joinZh, normZh, plainZh, tokens } from '@/lib/zh/text';
import { AlignError, alignPinyin, tryAlign } from '@/lib/zh/align';
import { wordId } from '@/lib/zh/ids';

describe('tokens', () => {
  it('splits words and punctuation, keeping focus', () => {
    const t = tokens('书 在 桌子 [[上]] 。');
    expect(t.map((x) => x.text)).toEqual(['书', '在', '桌子', '上', '。']);
    expect(t.map((x) => x.focus)).toEqual([false, false, false, true, false]);
    expect(t.map((x) => x.kind)).toEqual(['han', 'han', 'han', 'han', 'punct']);
  });
  it('gives a multi-word focus one group', () => {
    const t = tokens('我 [[不 是]] 老师 。');
    expect(t[1].focus && t[2].focus).toBe(true);
    expect(t[1].group).toBe(t[2].group);
  });
  it('marks Latin tokens', () => {
    expect(tokens('我 用 WeChat 。').map((x) => x.kind)).toEqual(['han', 'han', 'latin', 'punct']);
  });
});

describe('joining and normalising', () => {
  it('joins words without spaces', () => {
    expect(plainZh('书 在 桌子 [[上]] 。')).toBe('书在桌子上。');
    expect(joinZh([{ text: 'Hello' }, { text: 'World' }])).toBe('Hello World');
  });
  it('normZh removes spaces and markup and unifies punctuation', () => {
    expect(normZh('你好 , 我 [[是]] Rina .')).toBe(normZh('你好，我是Rina。'));
    expect(normZh('好吗?')).toBe('好吗？');
    expect(normZh('ａ'.normalize('NFC'))).toBe('ａ');
  });
});

describe('hanzi runs in prose', () => {
  it('finds hanzi runs between Latin text', () => {
    const r = hanRuns('Kata 你好 artinya halo, dan 谢谢。 terima kasih');
    expect(r.map((x) => x.text)).toEqual(['你好', '谢谢。']);
  });
});

describe('alignPinyin', () => {
  it('pairs each character with its syllable', () => {
    const a = alignPinyin('书 在 桌子 [[上]] 。', 'shū zài zhuōzi [[shang]] .');
    expect(a[2].chars.map((c) => `${c.ch}${c.syl.text}`)).toEqual(['桌zhuō', '子zi']);
    expect(a[3].focus).toBe(true);
    expect(a[4].chars).toEqual([]);
  });
  it('pairs erhua r with 儿', () => {
    const a = alignPinyin('你 去 哪儿 ？', 'nǐ qù nǎr ?');
    expect(a[2].chars.map((c) => c.syl.text)).toEqual(['nǎ', 'r']);
  });
  it('throws on a token count mismatch', () => {
    expect(() => alignPinyin('我 是 学生', 'wǒ shì')).toThrow(AlignError);
  });
  it('throws on a syllable count mismatch', () => {
    expect(() => alignPinyin('学生', 'xué')).toThrow(/2 characters but "xué" has 1/);
    expect(() => alignPinyin('学', 'xuéshēng')).toThrow(AlignError);
  });
  it('throws on unknown syllables and on focus that differs', () => {
    expect(() => alignPinyin('好', 'hxo')).toThrow(/does not split/);
    expect(() => alignPinyin('[[好]]', 'hǎo')).toThrow(/focus/);
  });
  it('throws when erhua r is not 儿', () => {
    expect(() => alignPinyin('哪里', 'nǎr')).toThrow(AlignError);
  });
  it('tryAlign returns null instead of throwing', () => {
    expect(tryAlign('学生', 'xué')).toBeNull();
  });
});

describe('word ids', () => {
  it('are stable, level-prefixed, and differ by sense', () => {
    expect(wordId('1', '爱', 'ài')).toMatch(/^w-1-[0-9a-f]{8}$/);
    expect(wordId('1', '爱', 'ài')).toBe(wordId('1', '爱', 'ài'));
    expect(wordId('2', '面', 'miàn', 2)).not.toBe(wordId('2', '面', 'miàn'));
  });
});
