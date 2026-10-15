import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import yaml from 'js-yaml';
import { expect, type Page } from '@playwright/test';

type Item = {
  id: string;
  type: string;
  answer: string | string[] | number[];
  letters?: string[];
  char?: string;
};

const load = (p: string) => yaml.load(fs.readFileSync(p, 'utf8'), { schema: yaml.JSON_SCHEMA });

export function lessonItems(rung: string, file: string): Item[] {
  const raw = fs.readFileSync(path.join('content', rung, file), 'utf8');
  return (
    matter(raw, { engines: { yaml: (s) => yaml.load(s, { schema: yaml.JSON_SCHEMA }) as object } })
      .data as { check: Item[] }
  ).check;
}

export function lessonFile(rung: string, order: number): string {
  return fs
    .readdirSync(path.join('content', rung))
    .find((f) => f.startsWith(String(order).padStart(2, '0') + '-'))!;
}

export function poolItems(file: string): Record<string, Item> {
  const pool = load(file) as { items: Item[] };
  return Object.fromEntries(pool.items.map((i) => [i.id, i]));
}

type Strokes = { strokes: string[]; medians: [number, number][][] };

/** Stroke data as the app serves it (public/strokes/<codepoint>.json). */
export function strokesFor(char: string): Strokes {
  return JSON.parse(
    fs.readFileSync(
      path.join('public', 'strokes', `${char.codePointAt(0)!.toString(16)}.json`),
      'utf8',
    ),
  );
}

/** Draws every stroke of a character on the trace pad by following its medians with the pointer. */
export async function drawChar(page: Page, char: string) {
  const pad = page.locator('[data-item] [data-trace-pad]');
  await expect(pad).toBeVisible();
  const box = (await pad.boundingBox())!;
  // Make Me a Hanzi medians: 1024 grid, y up, baseline 900 (lib/zh/trace.ts toScreen).
  const at = ([x, y]: [number, number]) =>
    [box.x + (x / 1024) * box.width, box.y + ((900 - y) / 1024) * box.height] as const;
  for (const median of strokesFor(char).medians) {
    const [x0, y0] = at(median[0]);
    await page.mouse.move(x0, y0);
    await page.mouse.down();
    for (let i = 1; i < median.length; i++) {
      const [a, b] = at(median[i - 1]);
      const [c, d] = at(median[i]);
      for (let k = 1; k <= 4; k++)
        await page.mouse.move(a + ((c - a) * k) / 4, b + ((d - b) * k) / 4);
    }
    await page.mouse.up();
  }
}

/** Option text without markup, spaces or pinyin, for matching what is on screen to the authored answer. */
const optionKey = (s: string) =>
  s
    .normalize('NFC')
    // Pinyin shown after hanzi inside Latin text: 女 (nǚ).
    .replace(/\s*\([^()\p{Script=Han}]*\)/gu, '')
    .replace(/\u200d|\*\*|\*|\[\[|\]\]/g, '')
    .replace(/\s+/g, '');

/** Answers whatever check item is on screen, correctly. */
export async function answer(page: Page, items: Record<string, Item>, practice = true) {
  const id = await page.locator('[data-item]').first().getAttribute('data-item');
  const item = items[id!];
  if (!item) throw new Error(`unknown item ${id}`);
  if (item.type === 'tone') {
    await page.locator(`[data-item] [data-tones="${(item.answer as number[]).join(',')}"]`).click();
  } else if (item.type === 'pinyin') {
    await page.locator('[data-item] [data-pinyin-input]').fill(item.answer as string);
    if (practice) await page.getByRole('button', { name: /^(Periksa|Check)$/ }).click();
  } else if (item.type === 'build') {
    for (const part of item.answer as string[])
      await page.locator(`[data-item] [data-part="${part}"]`).first().click();
    if (practice) await page.getByRole('button', { name: /^(Periksa|Check)$/ }).click();
  } else if (item.type === 'trace') {
    await drawChar(page, item.char!);
  } else if (item.type === 'order' || item.type === 'spell') {
    const seq = item.type === 'spell' ? item.letters! : (item.answer as string[]);
    for (const w of seq) {
      await page
        .locator(`[data-item] [role="group"]:last-of-type [data-tile="${w}"]`)
        .first()
        .click();
    }
    if (practice) await page.getByRole('button', { name: /^(Periksa|Check)$/ }).click();
  } else if (item.type === 'mark') {
    await page.locator(`[data-item] [data-mark="${item.answer}"]`).click();
  } else {
    const want = optionKey(item.answer as string);
    const pills = page.locator('[data-item] button[data-state]');
    const texts = await pills.evaluateAll((els) =>
      els.map((el) => {
        const c = el.cloneNode(true) as HTMLElement;
        c.querySelectorAll('rt, [aria-hidden="true"]').forEach((x) => x.remove());
        return c.textContent ?? '';
      }),
    );
    const i = texts.findIndex((t) => optionKey(t) === want);
    if (i >= 0) {
      await pills.nth(i).click();
      return;
    }
    throw new Error(`no option "${want}" for ${id} in ${JSON.stringify(texts.map(optionKey))}`);
  }
}

export async function next(page: Page) {
  await page.getByRole('button', { name: /^(Lanjut|Continue)/ }).click();
}

export async function expectNoHorizontalScroll(page: Page) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
}
