import { describe, expect, it } from 'vitest';
import { alignPinyin } from '@/lib/zh/align';
import { pinyinProblems } from '@/lib/content/lint';
import { fillItemPinyin, pinyinFor } from '@/lib/content/autopy';
import type { CheckItem } from '@/lib/types';

const problems = (zh: string, py: string) => {
  const a = alignPinyin(zh, py);
  return a.flatMap((w, i) => pinyinProblems(w, a[i + 1]));
};

describe('pinyin against CC-CEDICT (CLAUDE.md §6.4)', () => {
  it('accepts dictionary readings', () => {
    expect(problems('你好', 'nǐhǎo')).toEqual([]);
    expect(problems('书 在 桌子 上 。', 'shū zài zhuōzi shang .')).toEqual([]);
    expect(problems('北京', 'Běijīng')).toEqual([]);
  });
  it('allows neutral tones on either side', () => {
    expect(problems('谢谢', 'xièxie')).toEqual([]);
    expect(problems('谢谢', 'xièxiè')).toEqual([]);
    expect(problems('东西', 'dōngxi')).toEqual([]);
  });
  it('accepts listed heteronyms', () => {
    expect(problems('地', 'de')).toEqual([]);
    expect(problems('地', 'dì')).toEqual([]);
    expect(problems('还', 'hái')).toEqual([]);
  });
  it('accepts 一 and 不 written with their spoken tones', () => {
    expect(problems('一 个', 'yí gè')).toEqual([]);
    expect(problems('一 天', 'yì tiān')).toEqual([]);
    expect(problems('不 是', 'bú shì')).toEqual([]);
  });
  it('rejects a wrong tone', () => {
    expect(problems('好', 'hāo')[0]).toMatch(/does not match CC-CEDICT/);
  });
  it('names authored 3+3 sandhi', () => {
    expect(problems('你好', 'níhǎo')[0]).toMatch(/spoken 3\+3 change/);
  });
  it('catches a misplaced tone mark', () => {
    expect(problems('会', 'hùi')[0]).toMatch(/tone mark misplaced/);
    expect(problems('会', 'huì')).toEqual([]);
  });
  it('accepts names and numerals', () => {
    expect(problems('二十五', 'èrshíwǔ')).toEqual([]);
  });
});

describe('item pinyin at build time', () => {
  it('fills token-for-token pinyin, with 一 and 不 spoken', () => {
    expect(pinyinFor('我 不 是 老师 。', [], [])).toBe('wǒ bú shì lǎoshī .');
    expect(pinyinFor('一 个 人', [], [])).toBe('yí gè rén');
    expect(pinyinFor('十二 月', [], [])).toBe("shí'èr yuè");
    expect(pinyinFor('一 本 书', [], [])).toBe('yì běn shū');
  });
  it('uses the lesson glossary first', () => {
    expect(pinyinFor('丽娜', [{ zh: '丽娜', py: 'Lìnà', id: 'Rina' }], [])).toBe('Lìnà');
  });
  it('keeps gaps and focus marks', () => {
    expect(pinyinFor('书 在 桌子 [[上]] 。', [], [])).toBe('shū zài zhuōzi [[shàng]] .');
    expect(pinyinFor('我 ___ 学生 。', [], [])).toBe('wǒ ___ xuésheng .');
  });
  it('gives hanzi runs in Latin prompts one token each', () => {
    const item: CheckItem = { id: 'x', type: 'choice', prompt: 'Apa arti **桌子**?', options: ['meja', 'kursi'], answer: 'meja', why: { id: 'x', en: 'x' } };
    const { item: filled, missing } = fillItemPinyin(item, [], []);
    expect(missing).toEqual([]);
    expect(filled.py?.['桌子']).toBe('zhuōzi');
  });
  it('keeps an explicit override', () => {
    const item: CheckItem = { id: 'x', type: 'choice', prompt: '你 好', options: ['a', 'b'], answer: 'a', why: { id: 'x', en: 'x' }, py: { '你 好': 'nǐ hǎo' } };
    expect(fillItemPinyin(item, [], []).item.py?.['你 好']).toBe('nǐ hǎo');
  });
});
