// Renders public/icons/icon.svg to PNGs with Playwright. Run: node scripts/make-icons.mjs
import { chromium } from '@playwright/test';
import fs from 'node:fs';
const svg = fs.readFileSync('public/icons/icon.svg', 'utf8');
const b = await chromium.launch();
const p = await b.newPage();
for (const [name, size, pad] of [['icon-192', 192, 0], ['icon-512', 512, 0], ['icon-maskable-512', 512, 0.12]]) {
  await p.setViewportSize({ width: size, height: size });
  await p.setContent(`<body style="margin:0;background:#6B1A16;display:grid;place-items:center;height:100vh">
    <div style="width:${size * (1 - pad * 2)}px;height:${size * (1 - pad * 2)}px">${svg.replace('<svg ', '<svg width="100%" height="100%" ')}</div></body>`);
  await p.screenshot({ path: `public/icons/${name}.png` });
}
await b.close();
