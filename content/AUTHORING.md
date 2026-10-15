# Authoring Mandarin Ladder content

How to write lessons, tests and capstones so `npm run content:check` passes. The rules are CLAUDE.md
§5–§6; this file is the working summary and the v1 lesson plan. **Everything Claude writes is
`status: draft` and never fills `review`.**

## Files

```
content/<rung>/<nn>-<slug>.md      a lesson (frontmatter + four body sections)
content/<rung>/test.yaml           { rung, draw, pass, items }
content/<rung>/reading.yaml        Baca dan dengar
content/<rung>/dialogue.yaml       Ngobrol (Easy 1 only in v1)
content/<rung>/deck.yaml           Indonesian meanings and examples for the HSK words (Easy 1)
content/placement.yaml             Cek dasar: 20 items
```

## Chinese and pinyin (CLAUDE.md §5.2)

- `zh`: **words separated by single spaces**, punctuation as its own token (`。 ， ？ ！`).
  `py`: **the same number of tokens**, one pinyin word per Chinese word, syllables of a word written
  together (`zhuōzi`), punctuation as ASCII (`. , ? !`). `[[…]]` marks the focus in both, around the
  same tokens. Example: `zh: "书 在 桌子 [[上]] 。"` / `py: "shū zài zhuōzi [[shang]] ."`
- **Citation tones** (as dictionaries write them): 你好 is `nǐ hǎo`, never `ní hǎo`. The app computes
  3+3 sandhi. **Exception: 一 and 不 carry their spoken tones**: `yí gè`, `yì tiān`, `bú shì`,
  `bù hǎo`, but `yī` when counting or final (`dìyī`, `shíyī`, `xīngqīyī`).
- Neutral tones are unmarked (`xièxie`, `zhuōzi`, `wǒmen`). Erhua: `哪儿` = `nǎr`.
- Apostrophes before a/o/e syllables inside a word: `nǚ'ér`, `Xī'ān`.
- Names: Chinese names are two words, `王 明` / `Wáng Míng`. Indonesian names and places are single
  words from `content/data/names.yaml` (丽娜 Rina, 布迪 Budi, 安迪 Andi, 西蒂 Siti, 印尼 Indonesia,
  印尼人, 雅加达, 棉兰, 泗水, 万隆, 上海, 广州, 微信 WeChat).
- Check item strings need no pinyin: it is filled in at build time from the lesson glossary and the
  dictionaries. Add an item `py:` map entry only when content:check reports "no pinyin".

## Vocabulary and grammar (CLAUDE.md §6)

- Every Chinese **word token** must be an HSK word of the rung's level or below
  (`content/data/hsk/words.yaml`; Dasar rungs use HSK 1), a name, a numeral (零一二…十百千万两), or be
  listed in the lesson's `extra:` with a one-line reason. 你好 is two words: `你 好`.
- Grammar detectors: **了** (le) only from Easy 1 lesson 16; **比**, **得** (de complement), **过**
  (guo), **着** (zhe), **把**, **被**: not in v1 content at all.
- `introduces:` lists inventory ids from `content/curriculum.yaml` (Dasar: `d1-…`/`d2-…`; Easy 1:
  `g1-NN` from `content/data/hsk/grammar.yaml`).
- `hanzi:` (Easy 1: 6–12 per lesson, HSK 1 characters only) lists new characters; `trace` items use
  characters on the HSK elementary handwriting list that are HSK 1 characters (most common ones are).

## Lesson frontmatter

```yaml
id: easy1-10-localisers          # permanent
rung: easy-1
order: 10
status: draft
minutes: 8
title: { id: "Di mana bendanya?", en: "Where things are", zh: "在 哪儿 ？", py: "zài nǎr ?" }
summary: { id: "...", en: "..." }
introduces: [g1-01]
spiral: time-place               # a thread name (PRD §4.7)
visual: { id: place-scene-zh, props: { initial: under } }   # or worked: [2–8 lines]
examples:                        # 4–6, one [[focus]] each
  - { zh: "书 在 桌子 [[上]] 。", py: "shū zài zhuōzi [[shang]] .", id: "Bukunya di atas meja.", en: "The book is on the table." }
pair:
  off: { zh: "在 上 桌子 。", py: "zài shàng zhuōzi ." }      # what an Indonesian speaker might say
  natural: { zh: "在 桌子 [[上]] 。", py: "zài zhuōzi [[shang]] ." }
tone: { zh: "桌子", py: "zhuōzi", note: { id: "...", en: "..." } }   # Nada card (optional, recommended)
hanzi: [桌, 上, 下]               # Easy 1 only
words: { id: "...", en: "..." }  # Kata card: a trap or bridge (optional)
hokkien: [bakmi]                 # optional, ids from content/data/hokkien.yaml
talk:                            # Ngobrol: 2–4 lines (optional, recommended in Easy 1)
  lines:
    - { who: "Rina", zh: "...", py: "...", id: "...", en: "..." }
tirukan: { zh: "...", py: "...", id: "...", en: "..." }
check: [ 4–6 items ]
glossary:                        # Easy 1: 8–16; Dasar: 2–6
  - { zh: "桌子", py: "zhuōzi", id: "meja", en: "table", mw: "张", hsk: "1" }
extra:                           # words outside the HSK lists, with a reason
  - { zh: "只", reason: "measure word for animals, PRD topic list (HSK 3)" }
next: easy1-11-want-like         # the next lesson's id (omit on the last)
```

Body, in this order, each non-empty:

```
## concept.id
## concept.en
## contrast.id
## contrast.en
```

Explanations are Bahasa Indonesia (kamu, short sentences, no exclamation marks, no emoji), with an
English version. `**…**` marks a Chinese or pinyin term, `*…*` an Indonesian one. When Chinese is like
Indonesian, also give one honest limit (CLAUDE.md §6.6).

## Check items

Shared: `id` (permanent, lowercase-dashes, e.g. `e1-10-c1`), `type`, `why: { id, en }`, optional
`cue`, `show_pinyin` (false for items that test reading characters), `from` (test pools: the lesson id).

| type | fields | notes |
|---|---|---|
| choice | prompt, options (2–4), answer | prompt may be Chinese or Indonesian with **Chinese** |
| gap | prompt with one `___`, options, answer | e.g. `"我 ___ 学生 。"` |
| fix | wrong, options, answer | the sentence with the mistake, and corrected options |
| order | tiles, answer (+ accept) | Chinese word tiles; answer uses exactly the tiles |
| listen | audio (Chinese), options, answer | options usually Indonesian |
| tone | audio (`syl-ma3` or Chinese), audio_py (for Chinese), ask: written/spoken, options ([[3,3],[2,3]]), answer | spoken answers must equal the app's sandhi |
| pinyin | audio (`syl-ma3` or Chinese), answer (pinyin with marks), accept? | typed with numbers or marks |
| trace | char, guide: on/off | handwriting list only |
| build | char, parts (3–6, incl. distractors), answer (the 2–3 parts) | top-level parts as Make Me a Hanzi splits them |

Syllable keys (`syl-<base><tone>`, ü written ü) exist for tones 1–4 of real syllables.

## v1 lesson plan

### Dasar 1 · Pinyin dan nada (`dasar-1`, ids `dasar1-NN-slug`, check ids `d1-NN-cK`)

| nn | slug | introduces | visual | focus |
|---|---|---|---|---|
| 01 | dekat | d1-intro | syllable-builder | No tense, no plural; Hokkien words you know; what pinyin is |
| 02 | empat-nada | d1-tones | tone-contour | mā má mǎ mà ma; the neutral tone |
| 03 | inisial-mudah | d1-initials-easy | syllable-builder | m f n l s; a o e i u |
| 04 | hembusan | d1-aspiration | mouth-places (aspiration) | b/p, d/t, g/k: a puff of air, not voicing |
| 05 | jqx | d1-jqx | mouth-places (flat) | j q x and ü |
| 06 | lidah-melengkung | d1-retroflex | mouth-places (curled) | z c s vs zh ch sh r |
| 07 | final | d1-finals | syllable-builder | ai ei ao ou, an en ang eng ong, -n vs -ng |
| 08 | perubahan-nada | d1-sandhi | sandhi-strip | 3+3 → 2+3; 不; 一 |
| 09 | pasangan-nada | d1-pairs | tone-contour (compare) | the 20 tone pairs |
| 10 | membaca-pinyin | d1-reading | worked | greetings, numbers 1–10, yi/wu/yu, mark placement |

### Dasar 2 · Goresan dan radikal (`dasar-2`, ids `dasar2-NN-slug`, check ids `d2-NN-cK`)

| nn | slug | introduces | visual | focus |
|---|---|---|---|---|
| 01 | apa-itu-karakter | d2-what | character-parts (妈) | pictures, ideas, sound + meaning |
| 02 | delapan-goresan | d2-strokes | stroke-order (大) | 横 竖 撇 点 捺 提 折 钩 |
| 03 | urutan-goresan | d2-order | stroke-order (十) | top before bottom, left before right, outside before inside, close last |
| 04 | kotak-latihan | d2-grid | stroke-order (口) | 田字格 and proportion; first trace items |
| 05 | radikal-1 | d2-radicals-1 | character-parts (好) | 人/亻 口 女 子 木 水/氵 |
| 06 | radikal-2 | d2-radicals-2 | character-parts (明) | 心/忄 手/扌 言/讠 日 月 火/灬 |
| 07 | komponen | d2-components | character-parts (妈) | meaning part + sound part; build items |
| 08 | kata-dua-karakter | d2-words | worked | characters as words; 中国, 老师 |
| 09 | angka-tanggal | d2-numbers | stroke-order (三) | 一 to 十, 百, 年 月 日 |
| 10 | kalimat-pertama | d2-sentences | worked | 你好, 谢谢, 我是印尼人 |

### Easy 1 · HSK 1 (`easy-1`, ids `easy1-NN-slug`, check ids `e1-NN-cK`)

| nn | slug | introduces | visual | focus |
|---|---|---|---|---|
| 01 | perkenalan | g1-36, g1-05, g1-24, g1-32, g1-13 | worked | 你好, 我叫…, 我是印尼人; 是 joins two nouns; 也 |
| 02 | pertanyaan | g1-45, g1-46, g1-04, g1-33 | worked | 吗; 什么, 谁, 哪儿 |
| 03 | keluarga | g1-20, g1-27, g1-06, g1-10 | worked | 的: modifier before the noun (我的妈妈 vs mama saya); 都 |
| 04 | angka-umur | g1-07, g1-23 | worked | 1–99; 你几岁? 你多大? |
| 05 | penggolong-1 | g1-08 | measure-words | 个, 本, 只 (seekor) |
| 06 | punya | g1-37 | worked | 有 / 没有 |
| 07 | sifat | g1-09, g1-30, g1-48 | worked | 很 + adjective; no 是 before an adjective; 好不好? |
| 08 | waktu | g1-44, g1-28, g1-12 | worked | days, dates, clock times; time before the verb |
| 09 | tempat | g1-16 | worked | 在家; place before the verb |
| 10 | letak | g1-01 | place-scene-zh | 在桌子上/下/里: the localiser after the noun |
| 11 | ingin-suka | g1-03, g1-26, g1-39 | worked | 想, 要, 喜欢 + verb |
| 12 | belanja | g1-43, g1-19, g1-47 | measure-words | 多少钱? 块 毛; 件 杯 张; 还是 |
| 13 | tidak-belum | g1-14, g1-29, g1-25 | worked | verb + object; 不 vs 没 |
| 14 | bisa | g1-02 | worked | 会, 能 |
| 15 | pergi-datang | g1-15, g1-17, g1-11 | worked | 去, 来; 坐 + transport; 从, 跟/和 |
| 16 | sudah-terjadi | g1-21, g1-41, g1-40 | worked | 了: something happened |
| 17 | cuaca-perasaan | g1-35, g1-22, g1-31 | worked | 太…了, 有点儿; weather |
| 18 | di-kafe | g1-34, g1-47 | worked | a whole conversation at a café |

Tests: Dasar 1 and 2 pools of 28 items (draw 14, pass 11), Easy 1 a pool of 40 (draw 20, pass 15);
at least one item `from` every lesson. Capstones: Dasar 2 reading; Easy 1 reading and dialogue.

## After writing

```bash
npm run content:check      # must end with 0 errors; draft warnings are reported, fix what you can
npm run strokes:extract    # after adding characters
```
