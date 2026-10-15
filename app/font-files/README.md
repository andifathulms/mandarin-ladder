Self-hosted Latin font files, served by `next/font/local` from `app/fonts.ts`.

- `AtkinsonNext-*.woff2` — Atkinson Hyperlegible Next, Braille Institute of America, SIL Open Font License 1.1.
  The full upstream variable webfonts (Latin and Latin Extended) from
  [googlefonts/atkinson-hyperlegible-next](https://github.com/googlefonts/atkinson-hyperlegible-next) at `7925f50`
  (`fonts/webfonts/`), so pinyin's tone vowels never fall back.

The hanzi faces (LXGW WenKai, Noto Sans SC) are not here: `npm run fonts:subset` builds them into `styles/fonts-zh/`.
