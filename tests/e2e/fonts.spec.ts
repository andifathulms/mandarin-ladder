import { expect, test } from '@playwright/test';

// Fonts (CLAUDE.md §9): the Arabic faces load, and transliteration glyphs never fall back.
const TRANSLIT = ['ā', 'ī', 'ū', 'ḥ', 'ṣ', 'ḍ', 'ṭ', 'ẓ', 'ʿ', 'ʾ', 'ḥ'];

test('Arabic faces are loaded', async ({ page }) => {
  await page.goto('/joining/');
  await page.evaluate(() => document.fonts.ready);
  const families = await page.evaluate(() =>
    [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family.replace(/['"]/g, '')),
  );
  for (const face of ['Noto_Naskh_Arabic', 'Amiri', 'IBM_Plex_Sans_Arabic']) {
    expect(families.some((f) => f.includes(face)), face).toBe(true);
  }
});

test('transliteration glyphs render in the transliteration face, not a fallback', async ({ page }) => {
  await page.goto('/joining/');
  await page.evaluate(() => document.fonts.ready);
  const missing = await page.evaluate((glyphs) => {
    const family = getComputedStyle(document.querySelector('.tr-text')!).fontFamily.split(',')[0].trim();
    const c = document.createElement('canvas').getContext('2d')!;
    // A glyph the face lacks falls through to the next font, so its width changes with the fallback.
    const width = (g: string, fallback: string) => {
      c.font = `32px ${family}, ${fallback}`;
      return c.measureText(g).width;
    };
    return glyphs.filter((g) => Math.abs(width(g, 'monospace') - width(g, 'serif')) > 0.01);
  }, TRANSLIT);
  expect(missing).toEqual([]);
});
