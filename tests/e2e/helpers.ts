import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import yaml from 'js-yaml';
import { expect, type Page } from '@playwright/test';

type Item = { id: string; type: string; answer: string | string[]; letters?: string[] };

const load = (p: string) => yaml.load(fs.readFileSync(p, 'utf8'), { schema: yaml.JSON_SCHEMA });

export function lessonItems(rung: string, file: string): Item[] {
  const raw = fs.readFileSync(path.join('content', rung, file), 'utf8');
  return (matter(raw, { engines: { yaml: (s) => yaml.load(s, { schema: yaml.JSON_SCHEMA }) as object } }).data as { check: Item[] }).check;
}

export function lessonFile(rung: string, order: number): string {
  return fs.readdirSync(path.join('content', rung)).find((f) => f.startsWith(String(order).padStart(2, '0') + '-'))!;
}

export function poolItems(file: string): Record<string, Item> {
  const pool = load(file) as { items: Item[] };
  return Object.fromEntries(pool.items.map((i) => [i.id, i]));
}

/** Answers whatever check item is on screen, correctly. */
export async function answer(page: Page, items: Record<string, Item>, practice = true) {
  const id = await page.locator('[data-item]').getAttribute('data-item');
  const item = items[id!];
  if (item.type === 'order' || item.type === 'spell') {
    const seq = item.type === 'spell' ? item.letters! : (item.answer as string[]);
    for (const w of seq) {
      await page.locator(`[data-item] [role="group"]:last-of-type [data-tile="${w}"]`).first().click();
    }
    if (practice) await page.getByRole('button', { name: /^(Periksa|Check)$/ }).click();
  } else if (item.type === 'mark') {
    await page.locator(`[data-item] [data-mark="${item.answer}"]`).click();
  } else {
    const want = (item.answer as string).normalize('NFC');
    const pills = page.locator('[data-item] button[data-state]');
    const n = await pills.count();
    for (let i = 0; i < n; i++) {
      const text = ((await pills.nth(i).textContent()) ?? '').replace(/‍/g, '').replace(/^\d/, '').trim().normalize('NFC');
      if (text === want) {
        await pills.nth(i).click();
        return;
      }
    }
    throw new Error(`no option "${want}" for ${id}`);
  }
}

export async function next(page: Page) {
  await page.getByRole('button', { name: /^(Lanjut|Continue)/ }).click();
}

export async function expectNoHorizontalScroll(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
}
