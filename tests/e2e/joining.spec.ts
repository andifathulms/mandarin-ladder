import fs from 'node:fs';
import path from 'node:path';
import { expect, test } from '@playwright/test';

// The one pixel-snapshot test (CLAUDE.md §9): joining bugs are invisible to DOM tests.
// Baselines are reviewed by eye and are per platform, because font rendering differs.
const snap = path.join(__dirname, 'joining.spec.ts-snapshots', `joining-sheet-chromium-${process.platform}.png`);

test('joining sheet matches the reviewed baseline', async ({ page }) => {
  test.skip(!fs.existsSync(snap) && !process.env.UPDATE_JOINING, `no reviewed baseline for ${process.platform} yet`);
  await page.setViewportSize({ width: 900, height: 1200 });
  await page.goto('/joining/');
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator('[data-joining-sheet]')).toHaveScreenshot('joining-sheet.png', { maxDiffPixelRatio: 0.002 });
});
