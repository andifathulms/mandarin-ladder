# Mandarin Ladder

> **Development has moved.** Mandarin Ladder now lives in the Ladder monorepo, on the shared engine
> (`apps/mandarin` in [english-ladder](https://github.com/andifathulms/english-ladder)). This
> repository is the deploy target only: the monorepo builds the app and pushes it to this repo's
> `gh-pages` branch, which GitHub Pages serves at <https://andifathulms.github.io/mandarin-ladder/>
> (same URL, same progress storage). Please open issues and changes there. The code below is the
> last standalone version (`dd8f5fa`), kept for reference.

A calm, levelled Mandarin course for Indonesian speakers, from zero to HSK 9. Eleven rungs: **Dasar 1**
(pinyin and tones), **Dasar 2** (strokes and radicals), then Easy 1–3 = HSK 1–3, Medium 1–3 = HSK 4–6
and Hard 1–3 = HSK 7–9 (HSK 3.0, 2021).

A static Next.js site on GitHub Pages. Progress lives only in the browser: no accounts, no tracking.

**Live:** https://andifathulms.github.io/mandarin-ladder/

## v1 status

- **Live rungs:** Dasar 1 (10 lessons, pinyin and tones), Dasar 2 (10 lessons, strokes and radicals),
  Easy 1 (18 lessons, HSK 1), with rung tests, the Dasar 2 reading, the Easy 1 reading and dialogue,
  the 20-item placement check and the HSK 1 word deck (500 words).
- **Every lesson is a draft** written by Claude (`status: draft`) and waits for review by a Mandarin
  teacher. Drafts are shown on the deployed site (`NEXT_PUBLIC_SHOW_DRAFTS=true`).
- **Audio:** every syllable is recorded (audio-cmn, CC BY-SA); sentences use the browser's zh-CN voice
  until recordings are commissioned.
- **Hokkien bridges** have no reviewer yet, so they show only while drafts are shown.

- **What to build:** [`PRD.md`](PRD.md) · **How it looks:** [`DESIGN.md`](DESIGN.md) · **How to build it:** [`CLAUDE.md`](CLAUDE.md)
- **Started from:** English Ladder `58eab3c`, taken via Arabic Ladder `aedfae7` with its generic additions. See [`UPSTREAM.md`](UPSTREAM.md).

## Commands

```bash
npm ci
npm run fonts:fetch       # once: LXGW WenKai and Noto Sans SC sources into fonts-src/ (checksummed)
npm run dev               # dev server; shows drafts
npm run build             # data:check → content:check → fonts:subset → static export to ./out
npm run preview           # serve ./out
npm run test              # unit tests (Vitest)
npm run test:e2e          # Playwright + axe against ./out
npm run lint
npm run content:check     # schema, HSK lists, grammar inventory, pinyin, strokes, audio
npm run strokes:extract   # needs vendor/ from npm run data:fetch; stroke JSON for used characters
```

## Licence

Code: MIT. Data, fonts and audio keep their own licences (listed on the About page and in
`content/data/hsk/SOURCE.md`, `public/strokes/`, `public/audio/SOURCE.md` and `fonts-src/README.md`).
