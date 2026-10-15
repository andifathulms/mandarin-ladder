# Mandarin Ladder — Design

**Read with:** `PRD.md` (what), `CLAUDE.md` (how to build).
**Baseline:** English Ladder **as built**, described in its `RECON.md` §6–§7. Mandarin Ladder keeps its cream catalogue, screens, components, motion and sound. The deliberate differences are colour (lacquer red and gold, §3), the board pattern (§9), and everything Chinese text needs (§4, §6). Arabic Ladder is the third sibling; where this file says "as Arabic Ladder", its DESIGN.md has the detail.

**Precedence:** owner's words → this file → English Ladder as built → the portfolio house layer.

---

## 1. The feeling

The same quiet study desk, now with **a red-bound exercise book with a 田字格 practice grid, a brush pen, and a dictionary with a gold-stamped spine.** The board is the book's red cover; the cream is the grid paper. Characters are the most beautiful thing on every screen: large, in a hand-like Kai style, with room above for pinyin.

The three sibling promises stay (kind, visible progress, handmade). One is added:

4. **Tones and strokes are visible.** Sound has a shape (the tone contour) and every character has an order (the strokes). Both can always be seen, never only described.

---

## 2. Brand

- **Name:** Mandarin Ladder. The word **阶梯** (*jiētī*, ladder or staircase) appears beside the wordmark with its pinyin.
- **Mark:** the same ladder mark as the siblings (two rails, three rungs, the top rung in `--rung`). The app icon is the same, on lacquer red `#6B1A16`.
- **Wordmark:** the mark in a 40px `--board-ink` disc; "Mandarin Ladder" in the Latin display face at `--t-wordmark` 600; underneath, the mono line "DASAR → HSK 9" followed by 阶梯 in the hanzi face at 1rem, with jiētī as tiny ruby.
- **Board pattern:** **Grid**, a faint 田字格/米字格 practice-grid pattern (§9), in place of English Ladder's Contours and Arabic Ladder's Lattice.
- **Voice:** a patient older sibling who studied in China for a year. Warm, plain, a little playful. Hokkien jokes allowed, sparingly.

---

## 3. Colour

### 3.1 Palette: lacquer red and gold

Every token name, role and the dark-mode mechanism are as in English Ladder's `styles/tokens.css`. Copy that file and replace the values below. Rows marked **same** keep English Ladder's value.

| Token | Light | Dark | |
|---|---|---|---|
| `--paper` | `#F6F2E9` | `#170F0E` | light same |
| `--paper-2` | `#EDE6D6` | `#201514` | light same |
| `--surface` | `#FFFDF8` | `#281A18` | light same |
| `--ink` | `#241514` | `#F0E6DE` | red-black ink |
| `--muted` | `#67585A` | `#B9A7A2` | |
| `--rule` | `#E2D9C6` | `#3A2723` | light same |
| `--accent` | `#A3271C` | `#F08A74` | cinnabar: buttons, links, focus |
| `--accent-ink` | `#FFFFFF` | `#170F0E` | |
| `--accent-soft` | `#F6E3DD` | `#3A1E19` | |
| `--board` / `--board-2` | `#6B1A16` / `#84261F` | `#4A1411` / `#5E1D18` | lacquer red |
| `--board-ink` / `--board-muted` | `#F6F2E9` / `#DDBFB8` | `#F2ECDF` / `#D3B5AD` | |
| `--brass` | `#D9B26A` | `#DDBA7E` | gold stamping |
| `--rung` / `--rung-soft` | `#B8862E` / `#F7EBCF` | `#E2B45A` / `#2C2516` | same |
| `--good` / `--good-bg` | `#2F6B45` / `#E3F0E4` | `#8FCB9F` / `#16281F` | same (green reads clearly against a red brand) |
| `--off` / `--off-bg` | `#9B3254` / `#F6E2E8` | `#F08FB0` / `#3A1B26` | **raspberry**, bluer than the cinnabar accent (see 3.3) |
| `--easy` / `--easy-soft` | `#2D7480` / `#E1EEF0` | `#7CC4CF` / `#13282B` | teal, as Arabic Ladder |
| `--medium` / `--medium-soft` | `#2A4A7F` / `#E4E9F2` | `#9DB8E6` / `#1E2C4B` | same navy |
| `--hard` / `--hard-soft` | `#6A4E8F` / `#EDE7F3` | `#C1A8E6` / `#251E37` | same |
| `--wood` / `--wood-dark` | `#B98A5A` / `#8C6440` | `#9C7550` / `#6E5236` | same |
| `--card` / `--card-top` / `--card-side` | `#D9C3A0` / `#E8D7BA` / `#B79E77` | `#B39C78` / `#C3AE8C` / `#8E7956` | same |
| `--subject` | `#2E7D6B` | `#5FBFA7` | **jade** ball, so the subject never blends with the red brand |
| `--shadow-rgb` | `60 20 18` | `0 0 0` | warm shadows |

Manifest `theme_color` and the icon background are `#6B1A16`. The `theme-color` meta follows the in-app theme.

### 3.2 New tokens

| Token | Light | Dark | Role |
|---|---|---|---|
| `--dasar` / `--dasar-soft` | `#865A22` / `#F3E8D6` | `#D9AE6E` / `#2A2216` | Tier colour for the Dasar rungs (ink brown, as Arabic's Huruf) |
| `--tone-1` | `#2B5FA8` | `#8DB4EE` | First tone (high, level): blue |
| `--tone-2` | `#2E7A40` | `#8FD09B` | Second tone (rising): green |
| `--tone-3` | `#9A6510` | `#E6B45C` | Third tone (dipping): amber |
| `--tone-4` | `#B03A2E` | `#F2907F` | Fourth tone (falling): red |
| `--tone-0` | `var(--muted)` | `var(--muted)` | Neutral tone: grey |
| `--grid-line` | `color-mix(in srgb, var(--accent) 22%, transparent)` | same formula | 田字格 lines in tracing and StrokeOrder |

All tone colours reach 4.5:1 on `--surface` and `--paper` in both themes (measured: lowest 4.87:1, tone 3 in light).

### 3.3 Keeping "red = brand" apart from "red = wrong"

- **Hue:** the accent is an orange-leaning cinnabar (`#A3271C`); wrong is a blue-leaning raspberry (`#9B3254`) on a pink-grey background.
- **Shape:** wrong states always have the ✕ icon and strikethrough, as in English Ladder.
- **Place:** cinnabar fills buttons and marks focus words; raspberry appears only on answered pills and the "terdengar aneh" pair card.
- **Tone 4 vs accent:** both are reds. When tone colours are on, the focus word drops its colour and keeps only its underline (§4.4), so a red syllable always means tone 4.

**Contrast:** measured values for the main pairs are accent on paper 6.6, raspberry on its background 5.7, board-ink on board 10.5, brass on board 5.9. A unit test re-checks them from the token file.

---

## 4. Typography

### 4.1 Families

| Role | Face | Notes |
|---|---|---|
| Latin display | **Newsreader** | As siblings |
| Latin body | **Atkinson Hyperlegible Next** | As siblings; also **pinyin** (needs ā á ǎ à ē é ě è ī í ǐ ì ō ó ǒ ò ū ú ǔ ù ǖ ǘ ǚ ǜ ü; latin-ext; a test checks coverage) |
| Latin mono | **IBM Plex Mono** | As siblings |
| **Hanzi (teaching)** | **LXGW WenKai** (霞鹜文楷, OFL), Regular and Medium | Every Chinese sentence, word, tile, option and glossary entry. A Kai face shows the strokes the way they are written, which is what a learner needs to copy |
| **Hanzi (UI)** | **Noto Sans SC** 400/500 | Small hanzi inside UI chrome: chips, SVG labels, the deck list at small sizes |
| **Hanzi (stroke data)** | not a font | StrokeOrder and tracing draw from stroke path data (CLAUDE.md §7.5), not from a font |

Both Chinese faces are **subset at build time** to the characters used in content (CLAUDE.md §7.6). Never load a full CJK font.

### 4.2 Scale

English Ladder's tokens stay as built (`--t-hero` 3rem … `--t-label` 0.74rem). Chinese tokens are added. Hanzi are square and dense, so they need size, and pinyin above them needs line height:

| Token | Size | Line-height | Face | Use |
|---|---|---|---|---|
| `--t-zh-sentence` | 2rem (1.75rem ≤ 480px) | 2.4 (makes room for ruby) | WenKai 500 | The Chinese sentence being taught |
| `--t-zh-body` | 1.5rem | 2.2 | WenKai 400 | Talk lines, readings, options, tiles |
| `--t-zh-small` | 1.2rem | 1.9 | WenKai 400 / Noto Sans SC | Glossary chips, deck list, review rows |
| `--t-zh-glyph` | 6rem (4.5rem ≤ 480px) | 1.2 | WenKai 500 | Single characters in Dasar 2, the deck card face |
| `--t-py-ruby` | 0.42em of the hanzi size | 1 | Atkinson 400 | Pinyin above characters |
| `--t-py` | `--t-body` | 1.5 | Atkinson 400 | Pinyin on its own (Dasar 1, glossary, deck) |

The **Ukuran hanzi** setting scales `--t-zh-*` (100 / 120 / 140%) through `:root[data-zh-size]`.

### 4.3 Ruby (pinyin over characters)

- Use `<ruby>` per **word**, not per character. Inside a word, one `<rt>` per character keeps the alignment exact.
- `ruby-position: over`; `ruby-align: center`. Pinyin uses `--t-py-ruby` in `--muted`, tone-coloured when tone colours are on.
- When pinyin is hidden (fade or toggle), the `<rt>` keeps its height (`visibility: hidden`), so lines don't jump when it is revealed.
- Hold-to-reveal (P key or a long press on a word) shows that word's ruby only.

### 4.4 Text conventions

From the siblings: Indonesian is italic and muted; wrong sentences use `--off` with strikethrough; headings use `text-wrap: balance`.

Chinese rules:
- **Never italic, never letter-spaced, never uppercase-transformed.** Hanzi have no italic; synthetic slant ruins strokes.
- **Never bold for emphasis inside a sentence.** Bold Kai fills in the strokes learners are trying to see. The focus style is a 2px underline in `--accent`, offset 4px, plus `--accent` colour when tone colours are off. When tone colours are on, the underline only.
- **Pinyin is upright.** Italic means Indonesian. Pinyin carries `lang="zh-Latn-pinyin"`; Chinese carries `lang="zh-Hans"`.
- **Tone colours** apply to the hanzi and its pinyin together, per syllable. Neutral-tone syllables use `--tone-0`.
- **Punctuation** in Chinese text is full-width (，。？！：「」).
- **Line breaking:** `line-break: strict; word-break: keep-all` on the Chinese sentence block, so a word never splits across lines and punctuation never starts a line. Words are wrapped in spans from the authored spaces (CLAUDE.md §5.2).

---

## 5. Space, shape, depth, motion

Identical to English Ladder as built (spacing, radii, `--e-1`, `--e-2`, motion tokens, reduced-motion overrides). `--m-settle-d: 1400ms` becomes a token, as in Arabic Ladder.

New motion:

| Name | Duration / easing | Use |
|---|---|---|
| **stroke** | 450ms per stroke, `--ease` (0ms gap between strokes; 600ms at 0.75× speed) | StrokeOrder drawing: each stroke reveals along its median |
| **contour** | 600ms, linear | ToneContour: the pitch line draws in time with the syllable |
| **sandhi** | `--m-object-d`, `--ease-object` | SandhiStrip: a changing tone mark lifts, swaps and settles |
| **explode** | `--m-object-d`, `--ease-object` | CharacterParts: components slide apart and back |

With reduced motion, strokes appear one by one without the drawing sweep, contours appear whole, and parts fade between states.

---

## 6. Layout and screens

### 6.1 Direction
Left-to-right throughout. Chinese is LTR, so the siblings' shell works unchanged. No bidi work.

### 6.2 Home
As English Ladder. First visit shows two doors on the red board ("Baru mulai dari nol" / "Sudah bisa pinyin"), laid out as in Arabic Ladder's DESIGN §6.2. The continue quote shows the Chinese sentence in `--t-zh-body` with ruby pinyin in `--board-muted`, and a brass underline for a gap.

### 6.3 Ladder
Same rails, rows and notches. Tiers from top to bottom: Hard → Medium → Easy → **Dasar** (`--dasar` dot). Each rung row shows an **HSK chip** (mono, `--muted`, e.g. "HSK 1") where English Ladder shows CEFR. Rows show a Chinese subtitle in Noto Sans SC `--t-zh-small` (e.g. Dasar 1 · 拼音), hidden below 380px. Notch bars with 18–20 notches use 6px notches with 3px gaps; if they would wrap, they become a thin progress line with the count "7 / 18".

### 6.4 The Chinese sentence block (`ZhSentence`)

```
┌──────────────────────────────────────────────┐
│  qiú    zài  zhuōzi  xià                      │  ← ruby pinyin, tone-coloured
│  球     在   桌子    [[下]]。             ▶   │  ← WenKai --t-zh-sentence, focus underlined
│  Bolanya di bawah meja.                      │  ← Indonesian, italic muted
└──────────────────────────────────────────────┘
```

- **Layout:** an LTR row `[text block (grows)] [play 44px]`; the Indonesian sits under the Chinese.
- **Speaking highlight:** the current word gets `--accent-soft` behind both the hanzi and its ruby. It comes from recorded word timings or browser boundary events, with no highlight if neither exists.
- **Tap a word:** a small sheet with the word, its pinyin, its meaning, the measure word if it's a noun, and "Lihat goresan" (stroke order) for each character.
- **Variants:**
  - `body`, for talk lines, readings and options
  - `glyph`, a single character at `--t-zh-glyph` on `--paper-2` with the 田字格 grid behind it
  - `pair`, for PairCard

### 6.5 Lesson player
As English Ladder (top bar, StepBar, content column, BottomActionBar, feedback sheet, announcements), with:
- **Top bar toggles** (32px pills, lesson-scoped):
  - **Pinyin**, shown when the rung's `pinyin` is `new` or `on-request`
  - **Nada** (tone colours), with a tiny four-colour dot cluster
- **Concept title:** the Latin title, the Indonesian italic, and a Chinese title in WenKai `--t-zh-body` with ruby.

### 6.6 Strand cards

| Card | Look |
|---|---|
| **Nada** | `--paper-2` card; mono label "NADA"; the word with its tone contour drawn small (ToneContour mini, 160×60) and two play buttons, "ditulis" (citation tones) and "diucapkan" (with sandhi) |
| **Hanzi** | `--surface` card; each new character as a `glyph` tile (72px) with stroke count, radical chip and a "▶ goresan" button that plays StrokeOrder inline; one-line memory note |
| **Kata** | `--accent-soft` card, as siblings; Hokkien bridges show "Hokkien · *bakmi*" → "Mandarin · 肉面 ròumiàn" |
| **Ngobrol** | As English Ladder's TalkCard, with ruby |
| **Tirukan** | As Arabic Ladder's §6.6b, plus a ToneContour mini of the whole phrase above the sentence |

### 6.7 Check items (Chinese)

- **Options with Chinese:** full-width pills in `--t-zh-body`, with ruby only when the item allows it.
- **`tone`:** the play button large (56px); options are tone sequences drawn as small contour glyphs (four tiny line shapes) with their numbers ("3 + 3", "2 + 3").
- **`pinyin`:** an input with a live preview that converts tone numbers to marks as you type (`ni3 hao3` → nǐ hǎo). A row of helper keys sits below: ¯ ´ ˇ ` ü. The answer is checked on Enter or the Periksa button.
- **`trace`:**
  - A 280×280 (phone) / 320×320 (desktop) 田字格 grid on `--surface`, with the character as a faint `--rule` guide (it can be hidden at higher rungs).
  - The learner draws each stroke. A correct stroke snaps to its true shape in `--ink` (`stroke` motion).
  - A wrong stroke flashes `--off` for 300ms and fades. After two misses, the expected stroke pulses in `--accent` at 40%.
  - A stroke counter "3 / 7" sits above. Undo is not needed; strokes are judged one at a time.
- **`build`:** component tiles (WenKai `--t-zh-body`) and an answer box that assembles the character as parts are chosen (CharacterParts in reverse).
- **`order`:** word tiles; the answer line shows the joined sentence with no spaces, ruby above if allowed.
- **Feedback:** as English Ladder (hint after two misses, feedback sheet in `--good-bg`, sounds).

### 6.8 Kartu kata (word deck)

Lives in the **Kata** tab (`Kata-kataku | Kartu kata` as a two-segment control at the top).

- **Deck home:**
  - one card per rung: "HSK 1 · 212 dari 500 dipelajari", a thin progress line, "Hari ini: 10 baru · 14 diulang", and a primary "Mulai" button
  - the full list below, with a search field and filters (baru / dipelajari / dari pelajaran)
- **Card (focus mode):**
  - The front shows the hanzi at `--t-zh-glyph` on the grid (or the meaning, or a play button, depending on face direction).
  - Tap to flip. The back shows the hanzi, pinyin (tone-coloured), Indonesian, the measure word, one example `ZhSentence` with audio, and "Lihat goresan".
  - Grade with two buttons, "Belum ingat" and "Ingat". There is no four-way grading; two choices keep it calm.
  - On phones, swiping left and right does the same.
- Ends with a one-line summary. No streak.

### 6.9 Rung page, test, climb, review, words, Saya, settings, about

As English Ladder and Arabic Ladder, with:
- **Rung header:** red board with Grid; the HSK chip in brass; the Chinese subtitle in WenKai with ruby.
- **Lesson rows:** a key-character chip at the end (e.g. «下»).
- **Capstone cards** below the lessons; the deck card ("Kartu kata HSK 1") after them.
- **Climb moment:**
  - the red board with Grid
  - the rung's Chinese name in WenKai brass
  - the title translated ("Easy 1 · naik"), then the line "Satu anak tangga lagi. *Pelan-pelan, tapi naik.*"
  - 一步一步 *yí bù yí bù* (step by step) in WenKai `--board-muted`, with ruby
- **My words:** each row has hanzi (`--t-zh-small`), pinyin, Indonesian italic, the measure word chip, the HSK chip, and traditional in `--muted` when different.
- **Settings:** adds Ukuran hanzi (with a preview of 我很好 wǒ hěn hǎo), Warna nada, and the deck options.

### 6.10 Placement check (Cek dasar)
As Arabic Ladder's §6.9, with "Baru mulai" / "Sudah bisa pinyin" wording and the Dasar rungs.

---

## 7. Components (inventory)

Everything in English Ladder's component list carries over. New or changed:

| Component | Status |
|---|---|
| `ZhSentence`, `Ruby`, `Pinyin`, `ToneText` | new |
| `WordSheet` | new: tap-a-word sheet |
| `LessonTopToggles` | new: Pinyin + Nada, lesson-scoped |
| `StrandCards` | changed: Nada, Hanzi, Kata, Ngobrol |
| `TirukanCard` | new (with contour) |
| `PinyinInput` | new: tone-number to mark conversion, helper keys |
| `TracePad` | new: 田字格 drawing surface with stroke matching |
| `ToneOption`, `ComponentTiles` | new |
| `DeckHome`, `DeckCard`, `DeckRunner` | new |
| `TwoDoorWelcome`, `PlacementRunner`, `CapstoneCard` | as Arabic Ladder |
| `Grid` | new board pattern (replaces Contours) |
| `HskChip` | new |
| `Wordmark` | changed: Mandarin Ladder + 阶梯 |

---

## 8. Visuals

All follow English Ladder's illustration system: oblique 2.5D for objects, light from the top-left, three tones, no outlines except 1.5px edges, ground shadows, the subject in `--subject` (jade here), mono labels, a `--paper-2` stage, a radiogroup with roving focus, and a live text alternative. Diagrams of sound and stroke are flat line drawings in the same palette.

### 8.1 ToneContour (Dasar 1)
- **Axes:** a vertical scale of five pitch levels (1 low to 5 high), labelled in mono at the left, with faint `--rule` lines; time runs left to right.
- **The four citation contours:** 55 flat high, 35 rising, 214 dip, 51 falling. Each is a 4px round-capped line in its tone colour, drawn with the `contour` motion as the syllable plays. Neutral tone is a short dot at mid-low pitch.
- **Controls:** a radiogroup of the four tones plus neutral; a syllable picker (ma, ba, yi, shi…).
- **Compare:** two syllables overlaid, the second dashed.
- **Mini variant** (160×60): for strand cards and Tirukan, drawing the whole phrase's contour joined.

### 8.2 SyllableBuilder (Dasar 1)
- Three columns of chips: initials (grouped by mouth place, with group labels), finals (grouped), and tones (four contour glyphs).
- The syllable assembles at `--t-py` × 2 in the centre. The tone mark drops onto the correct vowel (`sandhi` motion), with the placement rule as a one-line caption ("tanda nada di atas a / o / e dulu").
- If the syllable doesn't exist in Mandarin, the result shows in `--muted` with "Suku kata ini tidak ada dalam bahasa Mandarin." Otherwise it plays.
- A small "contoh" line shows a real word with that syllable, in hanzi with ruby.

### 8.3 MouthPlaces (Dasar 1)
- The same stylised side section as Arabic Ladder's Makhraj, redrawn without throat detail.
- **Places:** lips; teeth ridge (z c s); behind the ridge with the tongue curled (zh ch sh r); flat tongue to the palate (j q x); back (g k h).
- Picking a group highlights the place and draws the tongue shape for it.
- **Aspiration toggle:** a small puff (three short curved lines in `--muted`) from the lips for p/t/k, and none for b/d/g, alongside the Indonesian note: "b di pinyin tidak bersuara seperti b Indonesia; bedanya hanya hembusan."

### 8.4 SandhiStrip (Dasar 1)
- A row of syllable cards (hanzi, ruby pinyin, tone glyph), with presets: 你好, 很好, 不是, 不对, 一个, 一天, 老鼠, 我很好.
- Toggle **ditulis** (written) / **diucapkan** (spoken). In spoken mode, the changing tone glyphs lift, swap and settle (`sandhi` motion), recolour, and a note names the rule.

### 8.5 StrokeOrder (Dasar 2, used everywhere)
- A 田字格 grid (a square with a dashed cross in `--grid-line`; a 米字格 adds the diagonals as an option).
- The character draws stroke by stroke along stroke medians, with each stroke's number at its start point in mono 10px.
- Strokes already drawn are `--ink`; the current stroke is `--accent`; the guide is `--rule`.
- **Controls:** play / pause, step back / forward, speed (0.75× / 1×), and stroke names listed beneath with the current one highlighted.

### 8.6 CharacterParts (Dasar 2)
- The character at `--t-zh-glyph`. **Pisahkan** (split) slides components apart (`explode`), each labelled:
  - its meaning role ("arti: perempuan")
  - or its sound role ("bunyi: mǎ")
  - or its position (kiri, kanan, atas, bawah, luar, dalam)
- Tapping a component shows a row of other characters sharing it, each tappable.
- The radical has a `--dasar` outline.

### 8.7 PlaceScene, Chinese (Easy 1)
- English Ladder's scene unchanged (table, box, ball, now in jade).
- The radiogroup holds 上 下 里 旁边 后面 前面 with pinyin.
- **Sentence:** 球在盒子[[上]]。 / 球在桌子[[下]]。
- **"Bandingkan dengan Indonesia":** shows *Bola di [atas] kotak* beneath, with connecting lines between matching words, so the learner sees the localiser jump to the end.

### 8.8 MeasureWords (Easy 1)
- A shelf (wood tones) holding six objects in the drawing system: a book, a cat, a cup, a shirt, a sheet of paper, a person.
- Picking one lifts it slightly. The phrase 一**本**书 appears with ruby, with the Indonesian match beneath (*se**buah** buku*; *se**ekor** kucing*; *se**lembar** kertas*; *se**cangkir** teh*).
- Where Indonesian has no classifier, or uses a different one, the note says so.

---

## 9. Grid (board pattern)

- A 田字格 practice grid: squares of 48px with a dashed cross inside each; every fourth square also gets the 米字格 diagonals.
- **Strokes:** `--board-ink` at 0.07 opacity, 1px; dashed segments 3px on, 3px off; every eighth square outlined in `--brass` at 0.22. These are the siblings' Contours/Lattice values.
- Generated in code (no hand-written paths), `aria-hidden`, with the same inline-start fade mask as Arabic Ladder's Lattice, so text always sits on plain red.

---

## 10. Sound
The siblings' synthesised effects, unchanged. Speech and syllable audio are separate (PRD §5.6).

---

## 11. Copy voice

As the siblings: *kamu*, short sentences, specific feedback, no shaming, no exclamation marks except at the climb, no emoji.

Mandarin-specific:
- Introduce terms in Indonesian first: "kata penggolong (*measure word*, 量词 liàngcí)".
- Use the Indonesian likeness when it's real ("seperti *seekor*"), and say plainly when it isn't.
- Hokkien bridges are friendly: "Kamu sudah tahu *cepek* (seratus, dari Hokkien). Dalam bahasa Mandarin: 一百 yìbǎi."
- No political content. Places are neutral and everyday (a café in Shanghai, a market in Medan, a university in Beijing).

Sample strings:

| Place | Bahasa Indonesia | English |
|---|---|---|
| Door 1 | Baru mulai dari nol | Starting from zero |
| Door 2 | Sudah bisa pinyin | I can already read pinyin |
| Tone hint | Dengarkan arah suaranya: naik, turun, atau datar? | Listen to the direction: rising, falling or level? |
| Trace miss | Coba lagi. Perhatikan arah goresannya. | Try again. Watch the stroke's direction. |
| Deck done | Selesai untuk hari ini. Kartu yang belum ingat akan muncul lagi besok. | Done for today. Cards you missed will come back tomorrow. |
| Climb | Satu anak tangga lagi. Pelan-pelan, tapi naik. | One more rung. Slowly, but upward. |

---

## 12. Accessibility

English Ladder §12 applies, plus:
- `lang="zh-Hans"` on Chinese; `lang="zh-Latn-pinyin"` on pinyin; `lang="id"` on Indonesian.
- Ruby is read sensibly. The accessible name of a `ZhSentence` is the hanzi followed by the pinyin in brackets, so screen readers don't interleave them.
- **Tone colours are never the only signal.** Tone marks are always on the pinyin, and tone glyphs carry numbers.
- **Tracing has keyboard and screen-reader alternatives:** the stroke-order quiz ("goresan berikutnya?") with stroke names, and StrokeOrder's step controls.
- Hanzi size up to 140% with text at 130% on 360px, with ruby intact.

---

## 13. Things this app never does

Everything in the siblings' lists, plus:
- Hanzi in italic, bold-for-emphasis, or letter-spaced.
- A full CJK font download.
- Pinyin without tone marks (except in the `pinyin` input, where numbers are accepted).
- Red as the only signal for anything.
- Dragons, lanterns, pandas or zodiac animals as decoration.

---

## 14. Quality bar

All of English Ladder's checks, plus:
- [ ] Ruby pinyin aligns over each character and never collides with the line above at 140%
- [ ] No hanzi falls back to a system font (subset includes every character in content; a test fails otherwise)
- [ ] Every pinyin glyph with a tone mark renders in Atkinson
- [ ] Tone colours on and off both read correctly; the focus underline is visible in both
- [ ] Tracing works by touch, pen and mouse, and the keyboard alternative works
- [ ] Wrong (raspberry) and accent (cinnabar) are distinguishable side by side in both themes
