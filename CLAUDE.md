# CLAUDE.md — Mandarin Ladder

Guidance for Claude Code in this repository. Read `PRD.md` for what to build and `DESIGN.md` for how it must look. This file covers how to build it.

---

## 1. What this is

A static, levelled Mandarin course for Indonesian speakers, from zero to HSK 9. Eleven rungs: Dasar 1 (pinyin and tones), Dasar 2 (strokes and radicals), then Easy 1–3 = HSK 1–3, Medium 1–3 = HSK 4–6, Hard 1–3 = HSK 7–9.

v1 ships the shell, the placement check, Dasar 1, Dasar 2 and Easy 1 (HSK 1) with the HSK 1 word deck, tracing, recorded syllables and eight visuals. It deploys to GitHub Pages; progress lives only in the browser.

It is a sibling of English Ladder (built) and Arabic Ladder (specified), and starts from English Ladder's code. If something here is unclear, do what English Ladder does.

---

## 2. Starting point

As Arabic Ladder: a **copy of English Ladder, then adapted**. No shared package yet.

1. Clone `andifathulms/english-ladder` at its current `main` into a fresh repo `mandarin-ladder`. Record the source commit in `README.md` and `UPSTREAM.md`.
2. Delete `content/**` (keep the layout), `NounBuilder`, `NearFar` and the English lint rules. Keep `PlaceScene`'s drawing.
3. Rename everything branded: storage key, SW cache prefix, manifest, metadata, `Wordmark`, `AppNav` aria-label, export filename, About copy, repo URL.
4. `UPSTREAM.md` lists every file kept from English Ladder as **verbatim**, **adapted** or **replaced**, so fixes can be ported across.
5. If Arabic Ladder exists by then, port its generic additions (two-door welcome, placement runner, capstone cards, lesson-scoped toggles, Tirukan card, audio manifest pipeline, English Ladder fixes) instead of rewriting them, and note them in `UPSTREAM.md`.

---

## 3. Stack

As English Ladder: Next.js 14.2 static export, React 18.3, TypeScript strict, Tailwind 3.4 with the palette replaced by tokens, gray-matter + js-yaml + zod at build, Vitest, Playwright + axe, ESLint + Prettier.

Runtime dependencies stay `next`, `react` and `react-dom`. Pinyin, tone, sandhi and stroke-matching code is hand-written and tested.

Build-only additions (devDependencies):
- `subset-font` (or a Python `fonttools` script run in CI) to subset the Chinese fonts
- nothing else at runtime

**Fonts:**
- Newsreader, Atkinson Hyperlegible Next (local files, as English Ladder; add `latin-ext`) and IBM Plex Mono through `next/font`
- **LXGW WenKai** and **Noto Sans SC** as source font files in `fonts-src/` (both OFL), subset at build into `public/fonts/` and loaded with `@font-face` (§7.6)

---

## 4. Commands

```bash
npm run dev               # dev server; shows drafts
npm run build             # data:check → content:check → fonts:subset → static export
npm run preview
npm run content:check     # schema, HSK list checks, inventory lint, pinyin checks, audio manifest
npm run data:import       # (re)build content/data from vendor sources (§5.6); rarely run
npm run fonts:subset      # collect every hanzi used in content and UI strings, subset both fonts
npm run strokes:extract   # copy stroke data for every used character into public/strokes/
npm run audio:list        # strings and syllables without a recording (CSV)
npm run audio:ingest      # import recordings, normalise to −16 LUFS, trim, mono 48 kbps mp3, update manifest
npm run test
npm run test:e2e
npm run lint
```

---

## 5. Content model

### 5.1 `content/curriculum.yaml`

```yaml
rungs:
  - id: easy-1
    name: Easy 1
    name_zh: { zh: "初级 一", py: "chūjí yī" }
    tier: easy                 # dasar | easy | medium | hard
    hsk: "1"                   # "—" for dasar, "7-9" for hard rungs
    status: live
    optional: false
    lessons: 18                # must equal the lesson file count once live
    pinyin: always             # always | new | on-request | off
    tone_colours_default: true
    words_cum: 500             # cumulative targets from HSK 3.0; checked against the imported list
    chars_cum: 300
    description: { id: "...", en: "..." }
    topics: [...]
    threads: [...]
    inventory: [...]           # grammar point ids from content/data/hsk/grammar.yaml
```

### 5.2 Lesson file `content/<rung>/<nn>-<slug>.md`

```yaml
id: easy1-10-localisers
rung: easy-1
order: 10
status: draft
review: { by: "Laoshi …", date: 2026-12-01 }   # required when reviewed
minutes: 8
title: { id: "Di mana bendanya?", en: "Where things are", zh: "在哪儿？", py: "zài nǎr?" }
summary: { id: "...", en: "..." }
introduces: [g1-zai-location, g1-localisers]   # grammar ids from the HSK list
spiral: word-order
visual: { id: place-scene-zh, props: { initial: shang } }
examples:
  - zh: "书 在 桌子 [[上]] 。"
    py: "shū zài zhuōzi [[shang]] ."
    id: "Bukunya di atas meja."
    en: "The book is on the table."       # optional
    note: { id: "...", en: "..." }        # optional
pair:
  off: { zh: "在 上 桌子 。", py: "zài shàng zhuōzi ." }
  natural: { zh: "在 桌子 [[上]] 。", py: "zài zhuōzi [[shang]] ." }
tone:   { zh: "桌子", py: "zhuōzi", note: { id: "...", en: "..." } }   # Nada card
hanzi:  [桌, 上, 下]                   # characters introduced (must be in this rung's list)
words:  { id: "...", en: "..." }       # Kata card
talk:   { lines: [{ who, zh, py, id, en? }] }
tirukan: { zh: "...", py: "...", id: "..." }
check: [ ...4–6 items ]
glossary:
  - { zh: "桌子", py: "zhuōzi", id: "meja", mw: "张", hsk: "1" }
next: easy1-11-…
```

**Spacing convention:**
- `zh` strings separate **words** with single spaces; the renderer removes them. Punctuation is its own token.
- `py` has the same number of tokens as `zh`, one pinyin word per Chinese word (syllables inside a word written together, as in standard pinyin orthography).
- `[[focus]]` wraps the same token in both.
- `content:check` fails on any token-count mismatch, or on a syllable count that doesn't match the characters.

**Pinyin is authored with citation tones (tone marks), as dictionaries write it.** The app computes spoken sandhi for the Nada card and SandhiStrip from `lib/zh/sandhi.ts`. The exception is 一 and 不, which are authored with their **spoken** tones (yí gè, bú shì), as textbooks do. Lint knows this.

Body sections: `concept.id`, `concept.en`, `contrast.id`, `contrast.en`, as English Ladder. In prose, `**…**` marks a Chinese or pinyin term and `*…*` marks Indonesian. Hanzi runs in prose are detected and wrapped with `lang="zh-Hans"` automatically.

### 5.3 Check items

Shared fields: `id`, `cue?`, `why: { id, en }`, `from?`, `show_pinyin?: boolean` (default: follow the rung, except reading tests where it is false).

| type | fields |
|---|---|
| `choice`, `gap`, `fix`, `scene`, `listen` | as English Ladder; strings may be Chinese (spaced as §5.2) |
| `order` | word tiles; the answer line joins without spaces |
| `tone` | `audio` (zh text or a syllable key), `answer` (e.g. `[3, 3]` written or `[2, 3]` spoken), `ask: written | spoken`, `options` (2–4 tone sequences) |
| `pinyin` | `audio`, `answer` (pinyin with marks), `accept?` |
| `trace` | `char` (single hanzi on the handwriting list for this rung or earlier), `guide: on | off` |
| `build` | `char`, `parts` (component tiles incl. distractors), `answer` (the correct parts) |

### 5.4 Other content files
- `content/<rung>/test.yaml`: `{ rung, draw, pass, items }`
- `content/placement.yaml`: 20 items tagged by section, with thresholds `{ easy1: 17, dasar2: 12 }`
- `content/<rung>/reading.yaml` and `dialogue.yaml`: capstones, with `zh`/`py`/`id` lines and items
- `content/<rung>/deck.yaml`: optional authored example sentences for deck words (otherwise examples come from lessons, or the card has none)
- `content/data/syllables.yaml`: every valid Putonghua syllable `{ py_base, initial, final, tones: [1,2,3,4,0], audio: { 1: key, … } }`
- `content/data/measure-words.yaml`: `{ mw, py, id_classifier?, note, examples }`
- `content/data/hokkien.yaml`: loanword bridges `{ id_word, hokkien, zh, py, meaning }`

### 5.5 Glossary and deck ids
A word's id is `w-<hsk>-<sha1(zh+py) first 8>`. Ids are permanent, like check ids. Deck progress is keyed by them.

### 5.6 Imported data (`content/data/hsk/`, `public/strokes/`)

| Data | Source | Licence | Notes |
|---|---|---|---|
| HSK 3.0 words, characters, handwriting characters, grammar points, per level | GF 0025—2021 (official PDF), via a vetted machine-readable transcription | Standard is public; transcription licence recorded in `content/data/hsk/SOURCE.md` | `data:import` writes `words.yaml`, `chars.yaml`, `handwriting.yaml`, `grammar.yaml`. Spot-check 50 entries per level against the PDF and record the check in `SOURCE.md` |
| Pinyin and traditional cross-check | CC-CEDICT | CC BY-SA 4.0 | Used to validate authored `py` and fill `trad`; attribution on the About page |
| Stroke medians and outlines | Make Me a Hanzi (`graphics.txt`, also the data behind hanzi-writer-data) | Arphic Public License (graphics); LGPL (dictionary) | `strokes:extract` writes one JSON per used character to `public/strokes/`; licence files copied alongside; attribution on About |
| Radical and component decomposition | Make Me a Hanzi `dictionary.txt` | LGPL | For CharacterParts and `build` items; authored overrides in `content/data/components-overrides.yaml` |

Nothing from these sources is fetched at runtime.

---

## 6. Content and accuracy rules (most important section)

1. **HSK lists rule the vocabulary.** Every word in a lesson's `zh` must be on the HSK list for this rung or below, be a proper name in `content/data/names.yaml`, or be listed in the lesson's `extra:` with a one-line reason. Errors in reviewed lessons, warnings in drafts.
2. **Grammar inventory.** Only grammar points (HSK grammar ids) from earlier rungs, plus this rung's up to and including this lesson. Lint has detectors for the common ones, e.g. 了 before its lesson; 把/被 before Easy 3; 比 before Easy 2; complements (得, 得懂, 下来) before their rungs.
3. **Characters.** `hanzi:` lists only characters on this rung's list or below. `trace` items only use characters on the **handwriting** list for this rung or below.
4. **Pinyin correctness.**
   - `py` must match CC-CEDICT readings for each word (allowing for 一/不 spoken tones, neutral tones, and listed heteronyms).
   - Tone marks go on the correct vowel (a/o/e first; in iu and ui on the second vowel).
   - Apostrophes are used where pinyin needs them (xī'ān).
   - `content:check` errors on unknown syllables.
5. **Sandhi is never authored by hand,** except 一/不 as above. The renderer computes it.
6. **Indonesian contrast must be true.** When a lesson says Chinese is like Indonesian (classifiers, no tense), give one honest limit too ("…tapi Mandarin punya lebih banyak penggolong, dan wajib dipakai").
7. **Hokkien bridges** go only in the Kata card, are taken from `hokkien.yaml`, and each entry is marked as reviewed by someone who knows the Hokkien form.
8. **Everyday content.** Indonesian and Chinese names (Rina, Budi, Andi, Siti; 王明 Wáng Míng, 李华 Lǐ Huá, 张丽 Zhāng Lì), cafés, markets, schools, offices, trains, WeChat. No politics, no contested places as subjects.
9. **Reviews.**
   - Claude drafts with `status: draft` and never sets `reviewed` or fills `review`.
   - Reviewed lessons need `review.by` and `review.date`; `content:check` enforces this.
10. **Sizes:** one idea per lesson; 4–6 examples; 4–6 checks; 8–16 glossary words (HSK 1 lessons carry more words than English Ladder's); 6–12 new characters in `hanzi`.
11. **Ids are permanent:** lesson ids, check ids and word ids.

---

## 7. Architecture

### 7.1 `lib/zh/` (new, pure, unit-tested)

| Function | Purpose |
|---|---|
| `tokens(zh)` / `joinZh(tokens)` | Split authored text into words and punctuation; join for display (no spaces) |
| `alignPinyin(zhTokens, pyTokens)` | Pair each character with its syllable; throws on mismatch |
| `syllables(pyWord)` | Split a pinyin word into syllables using the syllable table |
| `toneOf(syllable)` / `stripTone` | Read and remove tone marks; neutral = 0 |
| `numToMarks("ni3 hao3")` / `marksToNum` | Convert between numeric and marked pinyin (ü via `v` or `u:`) |
| `normPinyin(s)` | For grading: lowercase, numeric form, no spaces or apostrophes, ü unified |
| `sandhi(words)` | Spoken tones: 3+3→2+3 inside a prosodic word (and in common chains, left-to-right per standard rules); 不 → bú before tone 4; 一 → yí before 4, yì before 1/2/3, yī when counting or final. Returns per-syllable `{ written, spoken }` |
| `isValidSyllable(base)` | Check against `syllables.yaml` |
| `normZh(s)` | NFC, full-width punctuation unified, spaces removed |

### 7.2 Rendering pinyin and tone colours
- `LessonContext` provides `{ pinyin: 'always' | 'new' | 'on-request' | 'off', showPinyin, toneColours, recentWords }`, built from the rung, the lesson-scoped toggles and settings.
- `ZhSentence` renders one `<ruby>` per word, with one `<rt>` per character. An `<rt>` hidden by the fade uses `visibility: hidden` so it keeps its space.
- In `new` mode, ruby is visible for words introduced in this lesson or the previous two (`recentWords` from lesson `glossary`).
- Tone colour classes `tone-1…tone-0` are applied per syllable to both the hanzi span and its `rt`.

### 7.3 Grading (`lib/check/grade.ts`, adapted)
- A `compare(a, b)` hook: Chinese → `normZh(a) === normZh(b)`; pinyin → `normPinyin(a) === normPinyin(b)`.
- `sameOrder` compares token arrays with `normZh`. There is no case rule.
- `tone` compares sequences. The spoken answer for `ask: spoken` comes from `sandhi()`, not from authoring.
- `trace` → `lib/zh/trace.ts` (§7.5).

### 7.4 Progress
- Copy `lib/progress/*`. Key `mandarin-ladder:v1`, `SCHEMA_VERSION = 1`.
- Add to the state:
  - `capstones`
  - `placement`
  - `deck: Record<wordId, { box: 1|2|3|4|5, due: dayNumber, learned: boolean, lastSeen }>`
  - `traces: Record<char, { bestMisses, lastSeen }>`
- Deck scheduling is Leitner with five boxes and fixed intervals of 1, 2, 4, 8 and 16 days. It is deterministic and has no randomness except the seeded new-card order.
- Settings: `uiLang`, `voice`, `rate`, `sfx`, `textSize`, `zhSize: 100|120|140`, `toneColours: boolean | 'rung'`, `deckDaily: 5|10|20`, `deckFace: 'hanzi'|'meaning'|'audio'`, `theme`, `motion`.

### 7.5 Strokes and tracing (`lib/zh/trace.ts`, `components/zh/TracePad.tsx`)
- **Stroke data:** `public/strokes/<codepoint>.json` = `{ strokes: [svgPath], medians: [[x,y][]] }` on Make Me a Hanzi's 1024 grid (y flipped). Loaded on demand, cached by the SW.
- **StrokeOrder:** each stroke is drawn by animating a clip of the outline along its median (stroke-dasharray on a thick median path used as a mask). Stroke numbers sit at median start points.
- **Matching a drawn stroke** against the expected stroke `k`:
  - resample both polylines to 32 points in grid space
  - **start and end distance:** each must be within 0.18 × grid size
  - **direction:** the cosine similarity of the overall vectors must be ≥ 0.6
  - **shape:** the mean point distance must be ≤ 0.12 × grid size, and ≤ 0.2 for hooks and turns (stroke type from the data)
  - **length ratio:** between 0.5 and 1.6
  - A drawn stroke that matches a later stroke counts as a **miss** (wrong order), not a pass.
  - Thresholds live in one config object and are tuned by tests on recorded sample traces in `tests/fixtures/traces/`.
- **Input:** pointer events with `touch-action: none` on the pad and pen pressure ignored; coalesced events are used when available.
- **Result:** misses per character → `recordTrace(char, misses)`; ≤ 2 total misses counts as correct for the item.

### 7.6 Chinese fonts
- `scripts/fonts-subset.ts` collects every Han character from:
  - `content/**`
  - `lib/i18n/**`
  - `content/data/hsk/chars.yaml` for **live rungs only** (so the deck can show every word of a live rung)
- It subsets `fonts-src/LXGWWenKai-Regular.ttf`, `-Medium.ttf` and `NotoSansSC-Regular.otf` / `-Medium.otf` to WOFF2 in `public/fonts/`, and writes `styles/fonts-zh.css` with `@font-face` rules (`font-display: swap`, `unicode-range` from the subset).
- **Budget check:** fail the build if the WenKai Regular subset exceeds 450 KB. A test asserts every character in content is covered.
- Tailwind adds `font-zh` (WenKai, then Noto Sans SC, then system), `font-zh-ui` (Noto Sans SC), and the `text-zh-*` sizes.

### 7.7 Speech and audio (`lib/speech/`)
- **Recordings:** `audioFor(text)` uses key = `sha1(normZh(text)).slice(0, 12)`; syllables use the key `syl-<base><tone>` (e.g. `syl-ma3`). There is one manifest for both.
- **`play(text | syllableKey, { rate, onWord })`:** use the recording if it exists. Otherwise, for text only, use Web Speech with a voice scorer that prefers `zh-CN`, then `cmn-*` / `zh-*` other than `zh-HK` / `zh-TW`; prefers neural/natural voices; penalises novelty voices; respects gender.
- **Syllables never fall back to Web Speech.** If a syllable has no recording, its play button hides.
- `chunks()` splits on 。！？；and Latin punctuation.
- The service worker caches audio and stroke JSON on demand. It never precaches all of it.

### 7.8 Components (new or changed)
`components/zh/`:
- `ZhSentence`, `Ruby`, `Pinyin`, `ToneText`, `WordSheet`
- `PinyinInput`, `TracePad`, `ToneOption`, `ComponentTiles`
- `DeckHome`, `DeckCard`, `DeckRunner`

`components/visuals/`:
- `ToneContour` (+ mini), `SyllableBuilder`, `MouthPlaces`, `SandhiStrip`
- `StrokeOrder`, `CharacterParts`
- `PlaceSceneZh` (wraps the copied PlaceScene drawing), `MeasureWords`

Plus `components/ui/Grid.tsx` (replaces Contours), `HskChip`, `LessonTopToggles`, `TirukanCard`, `TwoDoorWelcome`, `PlacementRunner`, `CapstoneCard`.

### 7.9 i18n, theme, SW
- **i18n:** copy the `id`/`en` tables; replace English-specific strings; add keys for doors, placement, toggles, strand cards, tracing, deck and HSK labels.
- **Theme:**
  - Copy `tokens.css`, `globals.css`, `tailwind.config.ts` and `themeScript.ts`, then set DESIGN §3.1–3.2 values.
  - Add `data-zh-size`.
  - The `theme-color` meta follows the in-app theme.
  - A unit test checks the DESIGN §3.3 contrast pairs.
- **SW:** cache prefix `mandarin-ladder-`; precache the shell, `rung/dasar-1/`, `rung/dasar-2/`, `rung/easy-1/`, `placement/`, `words/`, plus `styles/fonts-zh.css` and the WenKai Regular subset.

---

## 8. Audio and licences checklist

- **Syllables:** about 400 syllable–tone pairs for Dasar 1 and Easy 1. Either:
  - (a) use an existing recorded syllable set **only if** its licence allows redistribution and trimming in a free public app (record the licence in `public/audio/SOURCE.md`; "no derivatives" licences don't qualify if clips are trimmed or normalised), or
  - (b) commission a native Putonghua speaker: one session, about 1,600 short clips for the full table, or about 400 for v1.
- **Sentences:** commissioned recordings preferred; browser voice is the fallback.
- **About page attributions:** CC-CEDICT, Make Me a Hanzi (Arphic Public License / LGPL), LXGW WenKai (OFL), Noto Sans SC (OFL), the HSK standard, and any audio source.

---

## 9. Testing

As English Ladder, plus:
- **Unit (`lib/zh`):**
  - `numToMarks` and `marksToNum` round-trip over the whole syllable table
  - `normPinyin`, including ü forms
  - `sandhi` against a table of 120 cases (3+3 chains, 不, 一 in all positions, neutral tones)
  - `alignPinyin` mismatches
  - `isValidSyllable`
- **Trace matcher:** recorded fixture traces (correct, reversed, wrong order, sloppy-but-acceptable) for 30 characters; assert pass/miss as labelled.
- **Component:**
  - `ZhSentence` ruby counts, hidden `rt` keeps its space, tone classes, `lang` attributes
  - `PinyinInput` live conversion
  - `TracePad` with synthetic pointer events
  - `LessonTopToggles` reset on unmount
- **Fonts:** a build test asserts every Han character in content is in the subset, and a Playwright check confirms WenKai renders (no fallback). The pinyin glyph set renders in Atkinson.
- **Data:** HSK import counts per level match the standard's published totals (PRD §4.2), and the `SOURCE.md` spot check is present.
- **E2E:**
  - door 1 → Dasar 1 lesson 1
  - door 2 → placement (seeded) → lands on Easy 1, Dasar rungs marked "lewat cek", no climb moment
  - a trace item completed with synthetic strokes
  - deck: study 5 cards, grade, reload, due counts persist
- **Accessibility:** axe on every route in both themes, and at 140% hanzi size.

---

## 10. Build order

Finish each milestone with tests passing before starting the next.

1. **M0 Fork:** §2; app builds empty; rename; `UPSTREAM.md`.
2. **M1 Data:** `data:import` (HSK lists, CC-CEDICT subset, Make Me a Hanzi subset), `SOURCE.md` spot checks, syllable table.
3. **M2 Chinese text core:**
   - `lib/zh/*` with tests
   - font subsetting pipeline and `fonts-zh.css`
   - `ZhSentence`, `Ruby`, `ToneText`, tone tokens, `data-zh-size`
   - the navy → lacquer red palette swap and contrast test
4. **M3 Content pipeline:**
   - schema (§5) and lint (§6)
   - curriculum with all eleven rungs
   - `lessons` count check and words/chars target checks
5. **M4 Shell:**
   - Grid pattern, two-door welcome, Dasar tier and HSK chips on the ladder
   - capstone cards, lesson-scoped toggles, strand cards, Tirukan, English Ladder fixes
6. **M5 Check engine:** `tone`, `pinyin` (PinyinInput), `build`; placement runner.
7. **M6 Strokes:** `strokes:extract`, StrokeOrder, TracePad + matcher with fixtures, `trace` items.
8. **M7 Audio:** manifest pipeline, syllable playback, zh-CN fallback, SW caching.
9. **M8 Dasar visuals and content:**
   - ToneContour, SyllableBuilder, MouthPlaces, SandhiStrip, CharacterParts
   - 20 lessons, two test pools, placement pool, Dasar 2 reading
   - **Release v1.0-dasar** after review and syllable recordings
10. **M9 Easy 1:**
    - PlaceSceneZh, MeasureWords
    - 18 lessons, test pool, reading, dialogue
    - word deck (DeckHome, DeckCard, DeckRunner, scheduling) for HSK 1
11. **M10 Polish:** delight list, reduced motion, axe, Lighthouse ≥ 95 mobile, DESIGN §14 checklist. **Release v1.0.**

---

## 11. Definition of done

As English Ladder, plus:
- Ruby aligns and never collides at 140% hanzi / 130% text on 360px.
- No hanzi falls back to a system font.
- Every Chinese element has `lang="zh-Hans"`; pinyin has `lang="zh-Latn-pinyin"`.
- `content:check` is clean, including the HSK list, grammar inventory, pinyin checks and reviewer fields.
- Every syllable used in a live rung has a recording.

---

## 12. Don't

Everything in English Ladder's list, plus:
- Don't ship or load a full CJK font; don't load Chinese fonts from Google Fonts at runtime.
- Don't bold, italicise or letter-space hanzi.
- Don't author spoken sandhi tones (except 一/不); don't author pinyin without tone marks.
- Don't put words outside the HSK lists into lessons without an `extra:` reason.
- Don't fall back to Web Speech for isolated syllables.
- Don't fetch dictionary, stroke or audio data from third-party hosts at runtime.
- Don't set `status: reviewed` or fill `review` fields.
- Don't use red as the only signal for anything.
