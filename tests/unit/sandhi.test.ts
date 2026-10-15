import { describe, expect, it } from 'vitest';
import { alignPinyin } from '@/lib/zh/align';
import { sandhi, spokenTones, writtenTones } from '@/lib/zh/sandhi';

/** Spoken tones of an authored line, as a compact string: "2 3 · 4" (· between words). */
const spoken = (zh: string, py: string) =>
  sandhi(alignPinyin(zh, py))
    .filter((w) => !w.punct)
    .map((w) => w.syllables.map((s) => s.spoken).join(' '))
    .join(' · ');

// [zh, py (authored: citation tones, spoken 一/不), expected spoken tones]
const CASES: [string, string, string][] = [
  // 3 + 3 inside a word
  ['你好', 'nǐhǎo', '2 3'],
  ['水果', 'shuǐguǒ', '2 3'],
  ['可以', 'kěyǐ', '2 3'],
  ['小姐', 'xiǎojiě', '2 3'],
  ['老虎', 'lǎohǔ', '2 3'],
  ['老鼠', 'lǎoshǔ', '2 3'],
  ['洗澡', 'xǐzǎo', '2 3'],
  ['手表', 'shǒubiǎo', '2 3'],
  ['雨伞', 'yǔsǎn', '2 3'],
  ['所以', 'suǒyǐ', '2 3'],
  ['理想', 'lǐxiǎng', '2 3'],
  ['了解', 'liǎojiě', '2 3'],
  ['只有', 'zhǐyǒu', '2 3'],
  ['友好', 'yǒuhǎo', '2 3'],
  ['首长', 'shǒuzhǎng', '2 3'],
  ['美好', 'měihǎo', '2 3'],
  // 3 + 3 across words and chains
  ['很 好', 'hěn hǎo', '2 · 3'],
  ['我 很 好', 'wǒ hěn hǎo', '2 · 2 · 3'],
  ['我 也 很 好', 'wǒ yě hěn hǎo', '2 · 2 · 2 · 3'],
  ['展览馆', 'zhǎnlǎnguǎn', '2 2 3'],
  ['我 想 买', 'wǒ xiǎng mǎi', '2 · 2 · 3'],
  ['你 有', 'nǐ yǒu', '2 · 3'],
  ['我 有 水果', 'wǒ yǒu shuǐguǒ', '2 · 2 · 2 3'],
  ['你 早', 'nǐ zǎo', '2 · 3'],
  ['很 冷', 'hěn lěng', '2 · 3'],
  ['很 小', 'hěn xiǎo', '2 · 3'],
  ['很 好看', 'hěn hǎokàn', '2 · 3 4'],
  ['我 很 忙', 'wǒ hěn máng', '2 · 3 · 2'],
  // A neutral tone ends the run
  ['姐姐', 'jiějie', '3 0'],
  ['奶奶', 'nǎinai', '3 0'],
  ['椅子', 'yǐzi', '3 0'],
  ['我 的', 'wǒ de', '3 · 0'],
  ['你们', 'nǐmen', '3 0'],
  ['想想', 'xiǎngxiang', '3 0'],
  ['哪儿', 'nǎr', '3 0'],
  ['你 的 手表', 'nǐ de shǒubiǎo', '3 · 0 · 2 3'],
  // Punctuation breaks the run
  ['你 好 ， 我 很 好 。', 'nǐ hǎo , wǒ hěn hǎo .', '2 · 3 · 2 · 2 · 3'],
  ['好 ！ 好 。', 'hǎo ! hǎo .', '3 · 3'],
  // Third tone before other tones: unchanged
  ['好吃', 'hǎochī', '3 1'],
  ['很 忙', 'hěn máng', '3 · 2'],
  ['很 热', 'hěn rè', '3 · 4'],
  ['北京', 'Běijīng', '3 1'],
  ['老师', 'lǎoshī', '3 1'],
  ['女儿', "nǚ'ér", '3 2'],
  ['礼物', 'lǐwù', '3 4'],
  // 不 (authored spoken)
  ['不 是', 'bú shì', '2 · 4'],
  ['不对', 'búduì', '2 4'],
  ['不 要', 'bú yào', '2 · 4'],
  ['不 去', 'bú qù', '2 · 4'],
  ['不 会', 'bú huì', '2 · 4'],
  ['不 客气', 'bú kèqi', '2 · 4 0'],
  ['不 谢', 'bú xiè', '2 · 4'],
  ['不 用', 'bú yòng', '2 · 4'],
  ['不 忙', 'bù máng', '4 · 2'],
  ['不 好', 'bù hǎo', '4 · 3'],
  ['不 吃', 'bù chī', '4 · 1'],
  ['不 来', 'bù lái', '4 · 2'],
  ['不 想', 'bù xiǎng', '4 · 3'],
  ['不 喝', 'bù hē', '4 · 1'],
  ['我 不', 'wǒ bù', '3 · 4'],
  ['我 不 想', 'wǒ bù xiǎng', '3 · 4 · 3'],
  ['我 也 不 好', 'wǒ yě bù hǎo', '2 · 3 · 4 · 3'],
  ['好 不 好', 'hǎo bu hǎo', '3 · 0 · 3'],
  ['对不起', 'duìbuqǐ', '4 0 3'],
  ['不 太 好', 'bú tài hǎo', '2 · 4 · 3'],
  ['不 大', 'bú dà', '2 · 4'],
  // 一 (authored spoken)
  ['一 个', 'yí gè', '2 · 4'],
  ['一 个', 'yí ge', '2 · 0'],
  ['一下', 'yíxià', '2 4'],
  ['一样', 'yíyàng', '2 4'],
  ['一共', 'yígòng', '2 4'],
  ['一定', 'yídìng', '2 4'],
  ['一 万', 'yí wàn', '2 · 4'],
  ['一 件', 'yí jiàn', '2 · 4'],
  ['一 天', 'yì tiān', '4 · 1'],
  ['一 杯', 'yì bēi', '4 · 1'],
  ['一 千', 'yì qiān', '4 · 1'],
  ['一 年', 'yì nián', '4 · 2'],
  ['一 瓶', 'yì píng', '4 · 2'],
  ['一起', 'yìqǐ', '4 3'],
  ['一 本', 'yì běn', '4 · 3'],
  ['一 百', 'yì bǎi', '4 · 3'],
  ['一点儿', 'yìdiǎnr', '4 3 0'],
  ['一', 'yī', '1'],
  ['第一', 'dìyī', '4 1'],
  ['十一', 'shíyī', '2 1'],
  ['二十一', 'èrshíyī', '4 2 1'],
  ['一月', 'yīyuè', '1 4'],
  ['一 号', 'yī hào', '1 · 4'],
  ['星期一', 'xīngqīyī', '1 1 1'],
  ['统一', 'tǒngyī', '3 1'],
  ['一 二 三', 'yī èr sān', '1 · 4 · 1'],
  ['一 楼', 'yī lóu', '1 · 2'],
  ['看 一 看', 'kàn yi kàn', '4 · 0 · 4'],
  ['一 一', 'yī yī', '1 · 1'],
  // 一 and 不 together, and with 3-3 runs
  ['一 本 书', 'yì běn shū', '4 · 3 · 1'],
  ['不 一定', 'bù yídìng', '4 · 2 4'],
  ['一 碗 水', 'yì wǎn shuǐ', '4 · 2 · 3'],
  ['一 把 雨伞', 'yì bǎ yǔsǎn', '4 · 2 · 2 3'],
  ['不 走', 'bù zǒu', '4 · 3'],
  ['我 一 个 人', 'wǒ yí gè rén', '3 · 2 · 4 · 2'],
];

// The 20 tone pairs (first syllable 1–4, second 1–4 or neutral) on ma.
const MARK = ['ma', 'mā', 'má', 'mǎ', 'mà'];
for (const a of [1, 2, 3, 4]) {
  for (const b of [1, 2, 3, 4, 0]) {
    const want = a === 3 && b === 3 ? '2 3' : `${a} ${b}`;
    CASES.push([`妈马`, `${MARK[a]}${MARK[b]}`, want]);
  }
}

describe('sandhi table', () => {
  const cases = CASES;
  it('has at least 120 cases', () => {
    expect(cases.length).toBeGreaterThanOrEqual(120);
  });
  it.each(cases)('%s %s → %s', (zh, py, want) => {
    expect(spoken(zh, py)).toBe(want);
  });
});

describe('written tones', () => {
  it('reports citation tones for 一 and 不 even when authored spoken', () => {
    expect(writtenTones(alignPinyin('一 个', 'yí gè'))).toEqual([1, 4]);
    expect(writtenTones(alignPinyin('不 是', 'bú shì'))).toEqual([4, 4]);
    expect(writtenTones(alignPinyin('你好', 'nǐhǎo'))).toEqual([3, 3]);
  });
  it('keeps neutral 一 and 不 neutral', () => {
    expect(writtenTones(alignPinyin('对不起', 'duìbuqǐ'))).toEqual([4, 0, 3]);
  });
  it('names the rule that changed a syllable', () => {
    const s = sandhi(alignPinyin('不 是', 'bú shì'));
    expect(s[0].syllables[0].rule).toBe('bu');
    expect(sandhi(alignPinyin('你好', 'nǐhǎo'))[0].syllables[0].rule).toBe('3-3');
    expect(sandhi(alignPinyin('一 天', 'yì tiān'))[0].syllables[0].rule).toBe('yi');
  });
  it('spokenTones flattens', () => {
    expect(spokenTones(alignPinyin('我 很 好', 'wǒ hěn hǎo'))).toEqual([2, 2, 3]);
  });
});
