import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

import { lessonFile } from './helpers';

const lesson = (rung: string, n: number) => `/rung/${rung}/${lessonFile(rung, n).replace('.md', '')}/`;
const routes = [
  '/',
  '/placement/',
  '/rung/huruf-1/',
  lesson('huruf-1', 2),
  lesson('huruf-1', 12),
  '/rung/huruf-2/',
  lesson('huruf-2', 3),
  lesson('huruf-2', 5),
  lesson('huruf-2', 7),
  '/rung/huruf-2/read/',
  '/rung/easy-1/',
  lesson('easy-1', 6),
  lesson('easy-1', 12),
  '/rung/easy-1/test/',
  '/rung/easy-1/read/',
  '/rung/easy-1/talk/',
  '/rung/hard-3/',
  '/review/',
  '/words/',
  '/me/',
  '/settings/',
  '/about/',
];

for (const scheme of ['light', 'dark'] as const) {
  for (const route of routes) {
    test(`axe: ${route} (${scheme})`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme });
      // Light is the default theme; dark is a setting, so choose it explicitly.
      // Dark is a setting; the dark run also checks the largest Arabic size.
      if (scheme === 'dark') {
        await page.addInitScript(() =>
          localStorage.setItem('arabic-ladder:v1', JSON.stringify({ schemaVersion: 1, settings: { theme: 'dark', arabicSize: 140 } })),
        );
      }
      // Tall viewport: nothing sits under the sticky bars while axe measures target sizes.
      await page.setViewportSize({ width: 360, height: 2400 });
      await page.goto(route);
      // Visit the See step too, so visuals are checked.
      if (/\/rung\/[a-z0-9-]+\/\d{2}-/.test(route)) await page.getByRole('button', { name: /^Lanjut/ }).click();
      await page.waitForTimeout(300);
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
      const serious = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
      expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual([]);
    });
  }
}
