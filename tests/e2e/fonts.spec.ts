import { expect, test } from '@playwright/test';
import { lessonFile } from './helpers';

// Fonts (CLAUDE.md §9, §11): hanzi render in WenKai (no system fallback), pinyin glyphs in Atkinson.
const PINYIN = [...'āáǎàēéěèīíǐìōóǒòūúǔùüǖǘǚǜ'];
const lesson = `/rung/easy-1/${lessonFile('easy-1', 1).replace('.md', '')}/`;

test('the WenKai subset loads for hanzi on the page', async ({ page }) => {
  await page.goto(lesson);
  await page.getByRole('button', { name: /^Lanjut/ }).click();
  await page.getByRole('button', { name: /^Lanjut/ }).click();
  await page.evaluate(() => document.fonts.ready);
  const loaded = await page.evaluate(() =>
    [...document.fonts]
      .filter((f) => f.status === 'loaded')
      .map((f) => f.family.replace(/['"]/g, '')),
  );
  expect(loaded.some((f) => f === 'Ladder WenKai')).toBe(true);
  // Every hanzi on screen is covered by the face: a covered glyph measures the same whatever the fallback.
  const missing = await page.evaluate(async () => {
    const text = [...document.querySelectorAll('[lang="zh-Hans"]')]
      .map((e) => e.textContent ?? '')
      .join('');
    const chars = [...new Set(text.match(/\p{Script=Han}/gu) ?? [])];
    await Promise.all(chars.map((c) => document.fonts.load(`32px "Ladder WenKai"`, c)));
    const c = document.createElement('canvas').getContext('2d')!;
    const width = (g: string, fallback: string) => {
      c.font = `32px "Ladder WenKai", ${fallback}`;
      return c.measureText(g).width;
    };
    return chars.filter(
      (g) =>
        !document.fonts.check(`32px "Ladder WenKai"`, g) ||
        Math.abs(width(g, 'monospace') - width(g, 'serif')) > 0.01,
    );
  });
  expect(missing).toEqual([]);
});

test('pinyin glyphs render in Atkinson, not a fallback', async ({ page }) => {
  await page.goto(lesson);
  await page.evaluate(() => document.fonts.ready);
  const missing = await page.evaluate((glyphs) => {
    const family = getComputedStyle(document.body).fontFamily.split(',')[0].trim();
    const c = document.createElement('canvas').getContext('2d')!;
    const width = (g: string, fallback: string) => {
      c.font = `32px ${family}, ${fallback}`;
      return c.measureText(g).width;
    };
    // Pinyin is rendered decomposed (base + combining mark), as the app does (pyDisplay).
    return glyphs.filter((g) => {
      const d = g.normalize('NFD');
      return Math.abs(width(d, 'monospace') - width(d, 'serif')) > 0.01;
    });
  }, PINYIN);
  expect(missing).toEqual([]);
});
