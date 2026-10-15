import { expect, test, type Page } from '@playwright/test';
import {
  answer,
  expectNoHorizontalScroll,
  lessonFile,
  lessonItems,
  next,
  poolItems,
} from './helpers';

const lessonUrl = (rung: string, n: number) =>
  `/rung/${rung}/${lessonFile(rung, n).replace('.md', '')}/`;

/** Walks a lesson from wherever it is to the done screen, answering every check item correctly. */
async function finishLesson(page: Page, rung: string, n: number) {
  const items = Object.fromEntries(lessonItems(rung, lessonFile(rung, n)).map((i) => [i.id, i]));
  const done = page.getByRole('heading', { name: /^Selesai:/ });
  for (let guard = 0; guard < 60; guard++) {
    if (await done.isVisible()) return;
    if (await page.locator('[data-item]').count()) await answer(page, items);
    await next(page);
  }
  await expect(done).toBeVisible();
}

test('door 1 → Dasar 1 lesson 1 → done', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Mulai dari anak tangga pertama' })).toBeVisible();
  await expectNoHorizontalScroll(page);
  await page.getByRole('link', { name: /Baru mulai dari nol/ }).click();
  await expect(page).toHaveURL(/\/rung\/dasar-1\/01-/);
  await finishLesson(page, 'dasar-1', 1);
  await page.goto('/');
  await expect(page.getByRole('region', { name: /Lanjut · Dasar 1 · Pelajaran 2/ })).toBeVisible();
});

test('door 2 → placement with right answers → Easy 1, Dasar marked lewat cek, no climb moment', async ({
  page,
}) => {
  const items = poolItems('content/placement.yaml');
  await page.goto('/');
  await page.getByRole('link', { name: /Sudah bisa pinyin/ }).click();
  await page.getByRole('button', { name: /Mulai cek/ }).click();
  for (let i = 0; i < 20; i++) {
    await answer(page, items, false);
    await page.getByRole('button', { name: i === 19 ? /Lihat hasil/ : /^Lanjut/ }).click();
  }
  await expect(page.getByRole('heading', { name: '20 / 20' })).toBeVisible();
  await expect(page.getByText('Kamu siap mulai dari Easy 1.')).toBeVisible();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.goto('/');
  await expect(page.getByText('· lewat cek').first()).toBeVisible();
});

test('a trace item is completed with synthetic strokes', async ({ page }) => {
  const rung = 'dasar-2';
  const n = 4; // kotak-latihan: the first trace items
  expect(lessonItems(rung, lessonFile(rung, n)).some((i) => i.type === 'trace')).toBe(true);
  await page.goto(lessonUrl(rung, n));
  await finishLesson(page, rung, n);
  const traces = await page.evaluate(
    () => JSON.parse(localStorage.getItem('mandarin-ladder:v1') ?? '{}').traces ?? {},
  );
  expect(Object.keys(traces).length).toBeGreaterThan(0);
});

test('deck: study 5 cards, grade, reload, counts persist', async ({ page }) => {
  await page.addInitScript(() => {
    if (!localStorage.getItem('mandarin-ladder:v1')) {
      localStorage.setItem(
        'mandarin-ladder:v1',
        JSON.stringify({ schemaVersion: 1, settings: { deckDaily: 5 } }),
      );
    }
  });
  await page.goto('/words/#deck');
  await expect(page.getByText('0 dari 500 dipelajari')).toBeVisible();
  await expect(page.getByText('Hari ini: 5 baru · 0 diulang')).toBeVisible();
  await page.getByRole('button', { name: /^Mulai/ }).click();
  for (let i = 0; i < 5; i++) {
    await page.getByRole('button', { name: 'Balik kartu' }).click();
    await page.getByRole('button', { name: i % 2 ? 'Belum ingat' : 'Ingat', exact: true }).click();
  }
  await expect(page.getByText(/3 \/ 5|3 dari 5/)).toBeVisible();
  await page.reload();
  await expect(page.getByText('5 dari 500 dipelajari')).toBeVisible();
  await expect(page.getByText('Hari ini: 0 baru · 0 diulang')).toBeVisible();
});

test('close mid-lesson and resume at the same step', async ({ page }) => {
  await page.goto(lessonUrl('dasar-1', 2));
  await next(page);
  await next(page);
  await expect(page.getByRole('heading', { name: 'Contoh', level: 2 })).toBeVisible();
  await page.getByRole('link', { name: 'Tutup pelajaran' }).click();
  await expect(page).toHaveURL(/\/rung\/dasar-1\/$/);
  await page.goto(lessonUrl('dasar-1', 2));
  await expect(page.getByRole('heading', { name: 'Contoh', level: 2 })).toBeVisible();
});

test('Chinese text carries lang attributes', async ({ page }) => {
  await page.goto(lessonUrl('easy-1', 1));
  await next(page);
  await next(page);
  await expect(page.locator('[lang="zh-Hans"]').first()).toBeVisible();
  await expect(
    page.locator('rt[lang="zh-Latn-pinyin"], [lang="zh-Latn-pinyin"]').first(),
  ).toBeAttached();
});

test('works with storage disabled', async ({ browser }) => {
  const ctx = await browser.newContext();
  await ctx.addInitScript(() => {
    const deny = () => {
      throw new DOMException('blocked', 'SecurityError');
    };
    Object.defineProperty(window, 'localStorage', { get: deny, configurable: true });
  });
  const page = await ctx.newPage();
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(lessonUrl('dasar-1', 2));
  await next(page);
  await expect(page.getByRole('heading', { name: 'Lihat', level: 2 })).toBeVisible();
  await page.goto('/settings/');
  await expect(page.getByText('Progres tidak tersimpan di browser ini.')).toBeVisible();
  expect(errors).toEqual([]);
  await ctx.close();
});

test('survives 130% text and 140% hanzi at 360px without horizontal scroll', async ({ page }) => {
  await page.addInitScript(() =>
    localStorage.setItem(
      'mandarin-ladder:v1',
      JSON.stringify({ schemaVersion: 1, settings: { textSize: 130, zhSize: 140 } }),
    ),
  );
  for (const url of [
    '/',
    '/rung/dasar-1/',
    lessonUrl('dasar-1', 9),
    lessonUrl('easy-1', 12),
    lessonUrl('easy-1', 18),
    '/settings/',
    '/placement/',
    '/rung/easy-1/test/',
    '/words/#deck',
  ]) {
    await page.goto(url);
    await expectNoHorizontalScroll(page);
  }
});
