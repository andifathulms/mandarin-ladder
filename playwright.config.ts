import { defineConfig, devices } from '@playwright/test';

// Runs against the built site: `npm run build` first (CI builds with drafts shown).
export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 60_000,
  fullyParallel: true,
  reporter: process.env.CI ? 'github' : 'list',
  use: { baseURL: 'http://localhost:4173', trace: 'retain-on-failure' },
  projects: [{ name: 'chromium', use: { ...devices['Pixel 7'], viewport: { width: 360, height: 780 } } }],
  webServer: { command: 'node scripts/serve.mjs', url: 'http://localhost:4173/', reuseExistingServer: true, env: { PORT: '4173', NEXT_PUBLIC_BASE_PATH: '' } },
});
