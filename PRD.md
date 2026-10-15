# Mandarin Ladder — Product Requirements (v1)

**Status:** Draft for build · **Owner:** Fathul · **Date:** 16 October 2026
**Companion docs:** `CLAUDE.md` (how to build), `DESIGN.md` (how it looks and feels)
**Siblings:** English Ladder, as built (see its `RECON.md`), and Arabic Ladder (specified, same pattern). Mandarin Ladder reuses English Ladder's engine, screens and structure. This document covers only what Mandarin needs.

---

## 1. Summary

Mandarin Ladder is a levelled Mandarin Chinese course for Indonesian speakers, starting from **complete zero**: no pinyin, no tones, no characters. It climbs to reading real Chinese text and holding everyday and work conversations.

It keeps everything that works in English Ladder: the ladder, six-step lessons, interactive visuals, the check engine, quick review, rung tests, the climb moment, the cream catalogue look, progress saved only in the browser, and static hosting on GitHub Pages. Its colour is **lacquer red and gold** where English Ladder is navy and Arabic Ladder is green.

What makes it a Mandarin course rather than a copy:

1. **The ladder is HSK.** The rungs follow the official nine-level HSK 3.0 standard (2021): Easy 1–3 are HSK 1–3, Medium 1–3 are HSK 4–6, and Hard 1–3 split HSK 7–9. A learner always knows which exam level they're working toward.
2. **Two foundation rungs before Easy 1.** *Dasar 1* teaches pinyin and the four tones; *Dasar 2* teaches how characters are built (strokes, stroke order, radicals and components). Learners who already read pinyin can test out of them.
3. **Tones are seen, not only heard.** Every syllable can show its pitch contour and tone colour. Tone pairs and tone changes (sandhi) are drilled from the first week.
4. **Characters are written.** Stroke-order animation for every new character, and a tracing check where the learner draws strokes with a finger or mouse, as HSK 3.0's handwriting requirements expect.
5. **Built for Indonesian speakers.** Mandarin grammar is in some ways closer to Indonesian than English is: no tense endings, no plural endings, and counting words much like *seekor*, *sebuah* and *selembar*. The course uses that, and drills where Indonesian misleads. Modifiers go **before** the noun (我的书 vs *buku saya*); time and place go **before** the verb; adjectives don't take 是 (*saya adalah sibuk*). Indonesians also already know Hokkien loanwords (*bakmi*, *cuan*, *angpao*, *cepek*), which become a bridge to their Mandarin forms.

**v1 ships Dasar 1, Dasar 2 and Easy 1 (HSK 1), complete:** 38 lessons, three rung tests, the placement check, the HSK 1 word deck, one reading and one dialogue capstone, eight visuals, recorded syllable audio, and the full app shell with all eleven rungs on the ladder.

---

## 2. Goals and non-goals

### Goals (v1)
- Someone with no Chinese can, after Dasar 1, read any pinyin syllable aloud with the right tone, and write pinyin for a syllable they hear 80% of the time.
- After Dasar 2, a learner can name the strokes, follow stroke order and split a character into its radical and components.
- After Easy 1, a learner knows the HSK 1 vocabulary (500 words) and its 300 characters, can write the 100 HSK 1 handwriting characters, and can hold the basic exchanges HSK 1 expects: introductions, numbers, time, prices, family, likes, simple requests.
- Every syllable and every lesson sentence has audio. Syllables are recorded; sentences use recordings where they exist and the browser's Chinese voice otherwise.
- No Chinese text in a shipped lesson has been seen only by AI. Every reviewed lesson names its reviewer.

### Non-goals (v1)
- Speaking assessment or microphone tone scoring (planned for v2).
- Traditional characters as a learning track (shown as a reference in My words only).
- Cantonese, Hokkien or other varieties as tracks. Hokkien appears only as loanword bridges.
- HSK exam simulation (timed papers). The rung test is not the exam.
- Accounts, sync, leaderboards, analytics, ads.

---

## 3. Audience

| Persona | Starting point | Door into the app |
|---|---|---|
| **True beginner** (the owner) | No pinyin, no tones, no characters | Dasar 1, lesson 1 |
| **School leaver** | Studied some Mandarin at school (common in Indonesia), knows pinyin, forgot most words | Placement → Dasar 2 or Easy 1 |
| **Chinese-Indonesian heritage learner** | Understands some spoken Mandarin or Hokkien at home, can't read | Placement → Dasar 2; moves fast through Easy 1 |
| **Work and study** | Needs HSK for a scholarship, a job with Chinese companies, or study in China or Taiwan | Any door; the HSK labels on every rung |

Copy, pacing and explanations assume a true beginner.

---

## 4. The curriculum

### 4.1 How this sequence was checked

The order follows what established programmes do, so a Mandarin teacher should recognise it:
- **HSK 3.0 (GF 0025—2021, *Chinese Proficiency Grading Standards for International Chinese Language Education*)** sets the syllables, characters, words, handwriting characters and grammar points for each level. Arabic Ladder had no single standard to follow; Mandarin does, and the ladder is built on it.
- **HSK Standard Course** and **Integrated Chinese** start the same way: pinyin and tones first, then characters gradually alongside words from the first lessons; 是, 很 + adjective, 吗 questions and measure words early; 了 and complements later.
- **Indonesian school Mandarin** (SMA/SMK electives and Mandarin courses) teaches pinyin first with heavy tone drilling, and uses Indonesian explanations.

Where Mandarin Ladder deliberately differs:
- Characters are introduced in Dasar 2 **as a system** (strokes, radicals, components) before Easy 1, rather than only one by one. Learners meet 300 characters in HSK 1, and knowing the parts makes that manageable.
- The Indonesian contrast (word order, classifiers, adjectives without 是, Hokkien loanwords) runs throughout.

A qualified Mandarin teacher must approve the sequence before content beyond Easy 1 is written (§12).

### 4.2 Rungs

The HSK 3.0 figures below (words, characters and handwriting characters, cumulative) are taken from the standard. `content:check` imports the official lists (CLAUDE.md §5.6) and the counts must be re-verified against them before authoring.

| # | Rung | Tier | HSK | Lessons | Words (cum.) | Characters (cum.) | Pinyin over characters | Status |
|---|---|---|---|---|---|---|---|---|
| 0 | **Dasar 1** · Pinyin dan nada | dasar | — | 10 + test | 30 | — | always | **v1** |
| 1 | **Dasar 2** · Goresan dan radikal | dasar | — | 10 + test | 60 | 80 | always | **v1** |
| 2 | **Easy 1** · HSK 1 | easy | 1 | 18 + test | 500 | 300 | always | **v1** |
| 3 | Easy 2 · HSK 2 | easy | 2 | 18 + test | 1,272 | 600 | new words only | v1.1 |
| 4 | Easy 3 · HSK 3 | easy | 3 | 20 + test | 2,245 | 900 | new words only | v1.2 |
| 5 | Medium 1 · HSK 4 | medium | 4 | 20 + test | 3,245 | 1,200 | on request | later |
| 6 | Medium 2 · HSK 5 | medium | 5 | 20 + test | 4,316 | 1,500 | on request | later |
| 7 | Medium 3 · HSK 6 | medium | 6 | 20 + test | 5,456 | 1,800 | on request | later |
| 8 | Hard 1 · HSK 7–9 (1) | hard | 7–9 | 20 + test | ~7,300 | ~2,200 | off | later |
| 9 | Hard 2 · HSK 7–9 (2) | hard | 7–9 | 20 + test | ~9,200 | ~2,600 | off | later |
| 10 | Hard 3 · HSK 7–9 (3) | hard | 7–9 | 20 + test | 11,092 | 3,000 | off | later |

That's 196 lessons, the longest of the three ladders. Mandarin takes Indonesian adults the longest of the three languages, and the About page says so plainly: HSK 4 usually takes two years of steady study, HSK 6 four or more.

Both Dasar rungs are `optional: true` (like English Ladder's Starter). They are never chosen as the learner's current rung on their own, and passing the placement check marks them climbed.

**Lessons and the word deck.** An HSK level has more words than 18–20 short lessons can teach in context (HSK 1 alone is 500). So each rung has two parts:
- **Lessons** teach about 300 core words of HSK 1 in context: grammar, sentences, dialogues, characters.
- The **Kartu kata** deck (§5.8) holds the rung's full official word list as flashcards with audio, example sentences and Leitner review. Words taught in a lesson enter the deck automatically; the rest can be studied from the deck at any time.

Together they cover the full HSK list.

### 4.3 Topics per rung

**Dasar 1 · Pinyin dan nada (pinyin and tones)**
1. *Mandarin itu lebih dekat dari yang kamu kira*: no tense, no plurals; Hokkien words you know (bakmi, cuan, angpao) and their Mandarin forms; what pinyin is
2. The four tones and the neutral tone: mā má mǎ mà ma
3. Initials that match Indonesian: m f n l s; vowels a o e i u
4. b/p, d/t, g/k: the difference is a puff of air (aspiration), not voicing
5. j q x and the ü vowel
6. z c s vs zh ch sh r: the tongue curled back
7. Finals: ai ei ao ou, an en ang eng ong, and the -n / -ng difference
8. Tone sandhi: 3 + 3 → 2 + 3 (你好 ní hǎo); 不 bù/bú; 一 yī/yí/yì
9. Tone pairs: the 20 two-syllable combinations, heard and read
10. Reading pinyin sentences: greetings, numbers 1–10, and spelling rules (yi, wu, yu; tone mark placement)

**Dasar 2 · Goresan dan radikal (strokes and radicals)**
1. What characters are: pictures, ideas, and sound + meaning pairs (most characters)
2. The eight basic strokes: 横 竖 撇 点 捺 提 折 钩
3. Stroke order rules: top before bottom, left before right, outside before inside, close last
4. The practice grid (田字格) and proportion
5. Radicals (1): 人/亻, 口, 女, 子, 木, 水/氵
6. Radicals (2): 心/忄, 手/扌, 言/讠, 日, 月, 火/灬
7. Components: meaning part + sound part (妈 = 女 + 马)
8. Characters that are words, and words of two characters (中国, 老师)
9. Numbers and dates in characters: 一 to 十, 百, 年 月 日
10. Your first sentences in characters: 你好, 谢谢, 我是印尼人

**Easy 1 · HSK 1 (18 lessons)**
1. Introductions: 你好, 我叫…, 我是印尼人; 是 joins two nouns
2. Questions with 吗 and question words: 什么, 谁, 哪儿
3. Family and 的: 我的妈妈. **Modifier before the noun**, the opposite of *mama saya*
4. Numbers 1–99 and age: 你几岁? 你多大?
5. Measure words (1): 个, 本, 只: just like *sebuah*, *seekor*
6. 有 and 没有: having and there-is
7. Adjectives: 很 + adjective; **no 是 before an adjective** (*saya adalah sibuk* → 我很忙)
8. Time: days, dates, clock times; **time before the verb** (我明天去)
9. Place with 在: 我在家; **place before the verb** (我在家吃饭)
10. Where things are: 在桌子上/下/里; the location word comes **after** the noun (opposite of *di atas meja*)
11. Wanting and liking: 想, 要, 喜欢 + verb
12. Money and shopping: 多少钱? 块, 毛; measure words (2): 件, 杯, 张
13. Doing things: verb + object; 不 vs 没 (not / didn't)
14. Can: 会, 能
15. Going places: 去, 来; 坐 + transport
16. Completed actions with 了 (first use: something happened)
17. Weather and feelings: 太…了, 有点儿
18. A whole conversation: review through a dialogue at a café

**Easy 2 onward** (outline, entered in `curriculum.yaml` with `status: soon`; topics follow the HSK 3.0 grammar list for each level)
- **Easy 2 · HSK 2:** 了 and 过 (aspect); 正在…呢; comparison with 比; resultative complements (看见, 听懂); 还是 vs 或者; 因为…所以; duration; directional complements (basic); 就 and 才; measure words (3).
- **Easy 3 · HSK 3:** potential complements (听得懂); 把 sentences; 被 passive (basic); degree complements (说得很好); 越来越; 一边…一边; 虽然…但是; 除了…以外; reduplication; directional complements (complex).
- **Medium 1–3 · HSK 4–6:** complex complements; 连…都; rhetorical questions; written-style connectors; formal register; idiom-like four-character phrases (成语) begin; reading news and workplace texts; essays and email.
- **Hard 1–3 · HSK 7–9:** formal written Chinese; 成语 and 歇后语; classical traces in modern text (之, 其, 以); academic and professional texts; listening at natural speed; translation between Indonesian and Chinese.

### 4.4 The four skills

| Skill | How |
|---|---|
| **Listening** | Recorded syllables in Dasar 1; audio on every sentence; `listen` items; tone-identification items; dialogues |
| **Speaking** | **Tirukan** (repeat after) at the end of every Examples step, with a visible tone contour for the sentence; no scoring in v1 |
| **Reading** | Every lesson; the pinyin fade; readings at each rung |
| **Writing** | Pinyin typing with tone numbers (`pinyin` items); stroke-order **tracing** (`trace` items) for the HSK handwriting characters; character building from components (`build` items) |

### 4.5 The fade: pinyin over characters

Characters are shown from Easy 1 on. Pinyin appears above them as ruby text, and fades by rung (rung field `pinyin`):
- `always`: pinyin over every character (Dasar 1–2, Easy 1)
- `new`: pinyin only over words introduced in this lesson and the previous two (Easy 2–3)
- `on-request`: hidden; tap and hold a word (or press **P**) to show it, or switch the **Pinyin** toggle for the lesson (Medium 1–3)
- `off`: hidden; only My words shows pinyin (Hard 1–3)

**Tone colours** (each syllable coloured by its tone, §DESIGN 4.4) are on by default up to Easy 1 and can be switched on or off in Settings at any rung.

In Dasar 2 and Easy 1, every check item that tests reading characters hides the pinyin, so learners can't answer from the pinyin.

### 4.6 Grammar and vocabulary inventory rule

Same rule as English Ladder: a lesson may use only structures and words from earlier rungs plus the current rung's inventory up to and including this lesson.

Mandarin-specific rules:
- **Words and characters come from the HSK lists.** Every word in a lesson must be on the official list for this rung or earlier, or be a proper name, or be marked `extra: true` with a reason. Lint checks this.
- **Grammar terms come late.** Terms such as 补语 (complement) or 量词 (measure word) are introduced in Indonesian first (*kata penggolong*), with the Chinese term once.
- **Handwriting** is only asked for characters on the official handwriting list for this rung or earlier.

### 4.7 Spiral threads
As in English Ladder. Threads include `tones`, `sandhi`, `pinyin`, `strokes`, `radicals`, `word-order`, `measure-words`, `questions`, `negation`, `aspect`, `complements`, `comparison`, `time-place`, `numbers`, `register`.

---

## 5. Features

Everything in English Ladder carries over: home (board, lesson strip, ladder), rung page, six-step lesson player, check step with feedback sheet, rung test, climb moment, quick review with Leitner boxes, My words, Saya, Settings, About. The changes are listed here.

### 5.1 Home: two doors
First visit shows the red board with two choices:
- **Baru mulai dari nol** → Dasar 1, lesson 1
- **Sudah bisa pinyin** → the placement check (§5.2)

After the first choice, the board behaves like English Ladder's continue card.

### 5.2 Placement check (Cek dasar)
- 20 items, with no feedback during the check:
  - tone identification by ear (6)
  - pinyin for a heard syllable (4)
  - sandhi (2)
  - stroke order (2)
  - radicals (3)
  - recognising 3 very common characters (3)
- **17+:** Dasar 1 and 2 marked climbed; start at Easy 1.
- **12–16:** Dasar 1 marked climbed; go to Dasar 2.
- **Under 12:** start at Dasar 1.
- It can be retaken any time. It never un-climbs a rung. The climb moment doesn't play for rungs climbed this way.

### 5.3 Lesson player
The same six steps: Konsep, Lihat, Contoh, Bandingkan, Latihan, Selesai.

**The Chinese sentence block:** characters with pinyin ruby above (per the fade), tone colours if on, the Indonesian translation below, and a play button.

**Top bar toggles** (both lesson-scoped and reset when the lesson closes):
- **Pinyin**: shown when the rung's `pinyin` is `new` or `on-request`
- **Warna nada** (tone colours): always shown; mirrors the setting for this lesson only

**Strand cards:**
- **Nada** (tones): the tone contour of a word or phrase, the sandhi applied if any, and play buttons for the citation form and the spoken form
- **Hanzi** (characters): new characters of the lesson with stroke-order playback, radical, components and a memory note ("妈 = 女 (perempuan) + 马 (bunyi mǎ)")
- **Kata** (words): Indonesian–Chinese word traps and bridges: Hokkien loanwords (*bakmi* ← 肉面 in Hokkien; Mandarin 肉面 ròumiàn), false friends, measure words matched to *se-* classifiers
- **Ngobrol** (talk): a 2–4 line exchange

**Tirukan** closes the Examples step: one sentence plays, pauses, plays again, with its tone contour drawn.

**Explanations** are always in Bahasa Indonesia, with an English UI option as in English Ladder.

### 5.4 Check engine
All six English Ladder types carry over (`choice`, `gap`, `order`, `scene`, `fix`, `listen`). Mandarin adds four:

| Type | Interaction | Example |
|---|---|---|
| `tone` | Hear a syllable or word; pick its tones | 你好 → 3+3 heard as 2+3 |
| `pinyin` | Type pinyin with tone numbers or tone marks; both accepted | hear "xièxie" → `xie4 xie5` / `xièxie` |
| `trace` | Draw a character stroke by stroke over a faint guide in the practice grid; each stroke is checked for direction, order and rough shape. After two misses on a stroke, its path is shown | 你 (7 strokes) |
| `build` | Pick the components that make a character | 好 = 女 + 子 |

`order` items use word tiles, and Chinese has no spaces, so the answer line shows the joined sentence.

**Grading:**
- Characters are normalised (full-width punctuation unified, spaces removed).
- Pinyin is normalised: tone numbers and tone marks are treated as equal; ü may be typed as `v` or `u:`; case is ignored; spaces and apostrophes are ignored.
- `tone` items compare tone sequences.
- `trace` uses stroke medians (CLAUDE.md §7.5).

### 5.5 Rung tests and capstones
- Dasar 1: draw 14 of 28, pass 11. Dasar 2: draw 14 of 28, pass 11. Easy 1: draw 20 of 40, pass 15.
- Capstones per live rung: **Baca dan dengar** (a reading) and **Ngobrol** (a 6–10 line dialogue), each with audio and 3–4 check items. Dasar 1 has neither; Dasar 2 has a short reading.
- Capstone completion is saved and shown on the rung page.

### 5.6 Audio
Browser Chinese voices (zh-CN) are generally good at reading characters, including sandhi, but they can't reliably say isolated pinyin syllables in each tone, and quality differs by device. So:
- **Syllables:** the Dasar 1 syllable set (about 400 syllable–tone pairs needed by Dasar 1 and Easy 1) is **recorded**. A complete open-licensed syllable set may be usable if its licence permits redistribution and trimming (CLAUDE.md §8). Otherwise it's recorded by a native Putonghua speaker.
- **Sentences and words:** a recording is used if one exists (same hash-keyed manifest as Arabic Ladder); otherwise the browser's zh-CN voice reads the characters. v1 aims to record all Easy 1 examples and dialogues. Lessons still go live with browser voice where recordings are missing; the button is hidden only if neither exists.
- **Speed:** 0.75× / 1×.

### 5.7 My words
As in English Ladder. Each word shows:
- characters, pinyin (always) and Indonesian
- the measure word for nouns (一**本**书)
- traditional characters (reference only), when they differ
- the HSK level

Search accepts characters, pinyin with or without tones, or Indonesian.

### 5.8 Kartu kata (word deck)
- One deck per rung: the full official HSK word list for that level, each card with characters, pinyin, Indonesian, audio and one example sentence.
- Cards from completed lessons are marked "dipelajari" (learned). Others are "baru" (new) and can be studied directly.
- Review uses the same Leitner boxes as quick review, with a daily suggestion of 10 new and up to 20 due cards. There is no streak and no penalty for skipping.
- Card faces: characters → meaning, meaning → characters, audio → characters. The learner picks which in Settings.
- The deck lives under the **Kata** tab, next to My words.

### 5.9 Settings (changes)
- **Suara:** speed; voice gender for browser speech; sample.
- **Tampilan:** text size; **Ukuran hanzi** (100 / 120 / 140%); tone colours on/off; theme; reduce motion.
- **Bahasa:** interface language (Indonesian / English).
- **Kartu kata:** daily new cards (5 / 10 / 20); card face direction.

### 5.10 Known English Ladder issues fixed here
As for Arabic Ladder: quick review exit; capstones saved; lesson-scoped toggles; test progress labelled by question; notch counts from data; climb title translated; theme-color follows the app theme; Done-screen glossary audio; My words groups labelled by rung.

---

## 6. Content model (summary)

Full schema in CLAUDE.md §5. Target-language fields are named by what they hold:

| Field | Meaning |
|---|---|
| `zh` | Simplified Chinese, words separated by spaces (removed at render), with `[[focus]]` markup |
| `py` | Pinyin with tone marks, word-aligned to `zh` |
| `id` | Indonesian translation |
| `en` | English translation for the English UI (optional) |
| `trad` | Traditional form (optional, glossary only) |

UI-facing bilingual fields (`why`, `summary`, `note`, `tip`) keep `{ id, en }`.

Every lesson has `status: draft | reviewed`, and a reviewed lesson needs `review: { by, date }`.

---

## 7. Visual components (v1)

| Visual | Rung | What it shows |
|---|---|---|
| **ToneContour** | Dasar 1 | The five-level pitch scale (Chao numbers 1–5) with the four tone shapes (55, 35, 214, 51) and neutral tone. Pick a tone and its contour draws while the syllable plays. Compare mode overlays two syllables. |
| **SyllableBuilder** | Dasar 1 | Pick an initial, a final and a tone. The syllable assembles in pinyin, the tone mark lands on the right vowel (with the rule shown), and it plays if that syllable exists. Combinations that don't exist in Mandarin are greyed with a note. |
| **MouthPlaces** | Dasar 1 | A stylised side section of the mouth, as in Arabic Ladder's Makhraj: where z/zh/j are made and how the tongue curls for the retroflex set; a puff of air for aspirated b/p d/t g/k. |
| **SandhiStrip** | Dasar 1 | A row of syllables with their written tones; tap "ucapkan" (spoken) and the tones that change animate to their spoken values (3+3→2+3, 不 before tone 4, 一 changes). |
| **StrokeOrder** | Dasar 2 | A character in the 田字格 grid, drawn stroke by stroke with numbered strokes, play/pause/step controls and the stroke names. The same component powers `trace` checks. |
| **CharacterParts** | Dasar 2 | A character exploded into its radical and components, each labelled with its meaning or sound role; tap a part to see other characters that share it (女 → 妈 好 姐 她). |
| **PlaceScene (Chinese)** | Easy 1 | English Ladder's table, box and ball with Chinese localisers: 上 下 里 旁边 后面 前面. The sentence shows the word order 球在桌子**下**, and an "Indonesia" toggle shows *di bawah meja* aligned word by word, so the reversal is visible. |
| **MeasureWords** | Easy 1 | Objects on a shelf (a book, a cat, a cup, a shirt, a sheet of paper). Pick one and see its measure word, matched where possible to the Indonesian classifier (一**只**猫 — *se**ekor** kucing*). |

---

## 8. Progress data

As English Ladder (CLAUDE.md §7.4), with:
- storage key `mandarin-ladder:v1`
- `capstones`
- `placement`
- `deck`: per word id, `{ box, lastSeen, learned }`
- `traces`: per character, `{ bestMisses, lastSeen }`
- settings: `uiLang`, `voice`, `rate`, `sfx`, `textSize`, `hanziSize`, `toneColours`, `deckDaily`, `deckFace`, `theme`, `motion`

---

## 9. Non-functional requirements

Same as English Ladder, plus:
- **Chinese fonts are large.** Fonts are subset at build time to the characters the site actually uses (about 1,000 for v1), keeping the first lesson load under 300 KB of fonts. No full CJK font is ever shipped.
- **Ruby layout:** pinyin never collides with the line above at 140% hanzi size and 130% text size on a 360px screen.
- **Tracing** works with touch, pen and mouse, and has a keyboard alternative (the stroke-order quiz in `choice` form: "which stroke comes next?").
- **Audio:** syllable clips lazy-loaded per lesson; a whole rung under 8 MB.

---

## 10. Success measures
- 5 true beginners finish Dasar 1; at least 4 of 5 identify tones by ear on 20 unseen syllables at 80% or better.
- Easy 1 testers score ≥ 75% on the rung test and can trace the 100 HSK 1 handwriting characters with at most one miss per character on average.
- A native Putonghua teacher rates every Ngobrol dialogue as natural.

---

## 11. Release plan

| Release | Contents |
|---|---|
| **v1.0-dasar** | App shell, all eleven rungs on the ladder, placement, Dasar 1 and 2 with syllable audio, six foundation visuals |
| **v1.0** | Easy 1 (HSK 1) complete, HSK 1 word deck, PlaceScene and MeasureWords, reading and dialogue |
| v1.1 | Easy 2 (HSK 2) + deck |
| v1.2 | Easy 3 (HSK 3) + deck |
| later | Medium and Hard; tone scoring with the microphone (v2) |

---

## 12. Decisions made
0. **Sequence approval:** a qualified Mandarin teacher reviews §4 before content beyond Easy 1 is written, and signs off each rung's topic list before its lessons are drafted.
1. **Standard:** Putonghua (Mainland standard Mandarin), Simplified characters, Hanyu Pinyin with tone marks.
2. **Levels:** HSK 3.0 (2021), nine levels, mapped to the nine Easy–Hard rungs; official word, character and handwriting lists imported as data.
3. **Character style:** Kai (楷体), the handwriting-like style used to teach stroke order, for teaching; a sans for small UI text.
4. **Audio:** recorded syllables; recorded sentences where available, browser zh-CN voice otherwise.
5. **Writing:** tracing in v1 for the official handwriting characters.

## 13. Open questions (not blocking v1)
- Which syllable recording set: an existing open set (licence permitting) or a commissioned one?
- Should Taiwan-bound learners get a Traditional-characters toggle across the whole app later?
- Should the word deck support an HSK 1 "exam warm-up" mode with timed listening?
