# Mandarin Ladder

A calm, levelled Mandarin course for Indonesian speakers, from zero to HSK 9. Eleven rungs: **Dasar 1**
(pinyin and tones), **Dasar 2** (strokes and radicals), then Easy 1–3 = HSK 1–3, Medium 1–3 = HSK 4–6
and Hard 1–3 = HSK 7–9 (HSK 3.0, 2021).

A static Next.js site on GitHub Pages. Progress lives only in the browser: no accounts, no tracking.

- **What to build:** [`PRD.md`](PRD.md) · **How it looks:** [`DESIGN.md`](DESIGN.md) · **How to build it:** [`CLAUDE.md`](CLAUDE.md)
- **Started from:** English Ladder `58eab3c`, taken via Arabic Ladder `aedfae7` with its generic additions. See [`UPSTREAM.md`](UPSTREAM.md).

## Commands

```bash
npm ci
npm run dev               # dev server; shows drafts
npm run build             # data:check → content:check → fonts:subset → static export to ./out
npm run preview           # serve ./out
npm run test              # unit tests (Vitest)
npm run test:e2e          # Playwright + axe against ./out
npm run lint
```

## Licence

Code: MIT. Data, fonts and audio keep their own licences (listed on the About page and in
`content/data/hsk/SOURCE.md`, `public/strokes/`, `public/audio/SOURCE.md` and `fonts-src/README.md`).
