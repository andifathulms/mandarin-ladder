import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

import { lessonFile } from './helpers';

const lesson = (rung: string, n: number) =>
  `/rung/${rung}/${lessonFile(rung, n).replace('.md', '')}/`;
const routes = [
  '/',
  '/placement/',
  '/rung/dasar-1/',
  lesson('dasar-1', 2),
  lesson('dasar-1', 4),
  lesson('dasar-1', 8),
  '/rung/dasar-1/test/',
  '/rung/dasar-2/',
  lesson('dasar-2', 1),
  lesson('dasar-2', 4),
  '/rung/dasar-2/read/',
  '/rung/easy-1/',
  lesson('easy-1', 1),
  lesson('easy-1', 10),
  lesson('easy-1', 12),
  '/rung/easy-1/test/',
  '/rung/easy-1/read/',
  '/rung/easy-1/talk/',
  '/rung/hard-3/',
  '/review/',
  '/words/',
  '/words/#deck',
  '/me/',
  '/settings/',
  '/about/',
];

for (const scheme of ['light', 'dark'] as const) {
  for (const route of routes) {
    test(`axe: ${route} (${scheme})`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme });
      // Light is the default theme; dark is a setting, so choose it explicitly.
      // The dark run also checks the largest hanzi size (CLAUDE.md §9).
      if (scheme === 'dark') {
        await page.addInitScript(() =>
          localStorage.setItem(
            'mandarin-ladder:v1',
            JSON.stringify({ schemaVersion: 1, settings: { theme: 'dark', zhSize: 140 } }),
          ),
        );
      }
      // Tall viewport: nothing sits under the sticky bars while axe measures target sizes.
      await page.setViewportSize({ width: 360, height: 2400 });
      await page.goto(route);
      // Visit the See step too, so visuals are checked.
      if (/\/rung\/[a-z0-9-]+\/\d{2}-/.test(route))
        await page.getByRole('button', { name: /^Lanjut/ }).click();
      await page.waitForTimeout(300);
      const results = await new AxeBuilder({ page: page as never })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze();
      const serious = results.violations.filter(
        (v) => v.impact === 'serious' || v.impact === 'critical',
      );
      expect(
        serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`),
      ).toEqual([]);
    });
  }
}
