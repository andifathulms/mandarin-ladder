---
id: dasar2-06-radikal-2
rung: dasar-2
order: 6
status: draft
minutes: 9
title: { id: "Radikal (2)", en: "Radicals (2)", zh: "心 手 言 日 月 火", py: "xīn shǒu yán rì yuè huǒ" }
summary:
  id: "Enam radikal lagi: 心/忄 (hati), 手/扌 (tangan), 言/讠 (bicara), 日 (matahari), 月 (bulan, juga tubuh) dan 火/灬 (api)."
  en: "Six more radicals: 心/忄 (heart), 手/扌 (hand), 言/讠 (speech), 日 (sun), 月 (moon, also body) and 火/灬 (fire)."
introduces: [d2-radicals-2]
spiral: radicals
visual: { id: character-parts, props: { char: "明" } }
examples:
  - zh: "[[想]]"
    py: "[[xiǎng]]"
    id: "berpikir, ingin: 心 (hati) di bawah"
    en: "to think, to want: 心 (heart) at the bottom"
  - zh: "[[忙]]"
    py: "[[máng]]"
    id: "sibuk: 忄, bentuk 心 di kiri"
    en: "busy: 忄, the form of 心 on the left"
    note: { id: "**心** di bawah tetap **心**. Di kiri, ia berdiri tegak menjadi **忄**.", en: "**心** at the bottom stays **心**. On the left, it stands upright as **忄**." }
  - zh: "[[找]]"
    py: "[[zhǎo]]"
    id: "mencari: 扌, bentuk 手 (tangan) di kiri"
    en: "to look for: 扌, the form of 手 (hand) on the left"
  - zh: "[[说]]"
    py: "[[shuō]]"
    id: "berbicara: 讠, bentuk 言 (bicara) di kiri"
    en: "to speak: 讠, the form of 言 (speech) on the left"
  - zh: "[[明天]]"
    py: "[[míngtiān]]"
    id: "besok: 明 (terang) = 日 (matahari) + 月 (bulan)"
    en: "tomorrow: 明 (bright) = 日 (sun) + 月 (moon)"
  - zh: "[[热]]"
    py: "[[rè]]"
    id: "panas: 灬, empat titik api, di bawah"
    en: "hot: 灬, four dots of fire, at the bottom"
pair:
  off: { zh: "朋天", py: "péngtiān" }
  natural: { zh: "[[明天]]", py: "[[míngtiān]]" }
hanzi: [想, 忙, 找, 说, 请, 明, 热, 点]
words:
  id: "**月** punya dua arti sebagai radikal. Kadang memang *bulan*, seperti dalam **明**. Tapi di kiri karakter tentang tubuh, ia berasal dari gambar *daging*: **脑** (otak, dalam **电脑**, komputer). Bentuknya sama, asalnya berbeda."
  en: "**月** has two meanings as a radical. Sometimes it really is *moon*, as in **明**. But on the left of characters about the body, it comes from a picture of *flesh*: **脑** (brain, in **电脑**, computer). Same shape, different origin."
tirukan: { zh: "明天 见", py: "míngtiān jiàn", id: "sampai besok", en: "see you tomorrow" }
check:
  - id: d2-06-c1
    type: build
    prompt: "Bangun **明** (terang): matahari dan bulan."
    char: "明"
    parts: ["日", "月", "目", "口", "火"]
    answer: ["日", "月"]
    why: { id: "**明** = **日** (matahari) + **月** (bulan). Dua benda yang paling terang di langit.", en: "**明** = **日** (sun) + **月** (moon). The two brightest things in the sky." }
  - id: d2-06-c2
    type: choice
    prompt: "Empat titik di bawah **热** (panas) berasal dari radikal apa?"
    options: ["api", "air", "hati"]
    answer: "api"
    why: { id: "Empat titik di bawah adalah **灬**, bentuk **火** (api). Air di kiri adalah **氵**, tiga titik.", en: "Four dots at the bottom are **灬**, the form of **火** (fire). Water on the left is **氵**, three dots." }
  - id: d2-06-c3
    type: choice
    show_pinyin: false
    prompt: "Karakter mana yang berhubungan dengan berbicara?"
    options: ["说", "找", "热"]
    answer: "说"
    why: { id: "**说** (berbicara) punya **讠**, radikal bicara. **找** punya **扌** (tangan), **热** punya **灬** (api).", en: "**说** (to speak) has **讠**, the speech radical. **找** has **扌** (hand), **热** has **灬** (fire)." }
  - id: d2-06-c4
    type: choice
    prompt: "**忙** (sibuk) punya radikal hati di kiri. Radikal itu bentuk dari …"
    options: ["心", "手", "日"]
    answer: "心"
    why: { id: "**忄** adalah **心** (hati) yang berdiri di kiri. Sibuk adalah perasaan, jadi radikalnya hati.", en: "**忄** is **心** (heart) standing on the left. Busy is a feeling, so the radical is the heart." }
  - id: d2-06-c5
    type: trace
    char: "日"
    guide: "off"
    why: { id: "**竖** kiri, **折**, **横** tengah, lalu **横** bawah yang menutup kotak.", en: "Left **竖**, **折**, the middle **横**, then the bottom **横** that closes the box." }
  - id: d2-06-c6
    type: listen
    audio: "明天"
    options: ["besok", "hari ini", "sibuk"]
    answer: "besok"
    why: { id: "**明天** míngtiān: besok. **今天** jīntiān: hari ini.", en: "**明天** míngtiān: tomorrow. **今天** jīntiān: today." }
glossary:
  - { zh: "想", py: "xiǎng", id: "berpikir; ingin", en: "to think; to want", hsk: "1" }
  - { zh: "忙", py: "máng", id: "sibuk", en: "busy", hsk: "1" }
  - { zh: "找", py: "zhǎo", id: "mencari", en: "to look for", hsk: "1" }
  - { zh: "说", py: "shuō", id: "berbicara, berkata", en: "to speak, to say", hsk: "1" }
  - { zh: "明天", py: "míngtiān", id: "besok", en: "tomorrow", hsk: "1" }
  - { zh: "热", py: "rè", id: "panas", en: "hot", hsk: "1" }
extra:
  - { zh: "心", reason: "the heart radical, taught on its own in this lesson (HSK 3 as a word)" }
  - { zh: "言", reason: "the speech radical, taught on its own in this lesson" }
  - { zh: "火", reason: "the fire radical, taught on its own in this lesson (HSK 3 as a word)" }
next: dasar2-07-komponen
---

## concept.id

Enam radikal lagi. Seperti sebelumnya, beberapa berubah bentuk menurut tempatnya.

- **心 / 忄** (hati, perasaan): **想** (berpikir, ingin) dengan **心** di bawah; **忙** (sibuk) dengan **忄** di kiri.
- **手 / 扌** (tangan): **打** (memukul), **找** (mencari). Pekerjaan tangan.
- **言 / 讠** (bicara): **说** (berbicara), **请** (silakan), **谢** (terima kasih).
- **日** (matahari, hari): **明** (terang), **星** (bintang, dalam **星期**, minggu).
- **月** (bulan; juga tubuh): **明** (terang); **脑** (otak).
- **火 / 灬** (api): **热** (panas), **点** (titik, jam).

Lihat **明** di atas. **日** di kiri sedikit lebih kecil dan ramping, **月** di kanan lebih tinggi.

## concept.en

Six more radicals. As before, some change shape depending on where they sit.

- **心 / 忄** (heart, feeling): **想** (think, want) with **心** at the bottom; **忙** (busy) with **忄** on the left.
- **手 / 扌** (hand): **打** (hit), **找** (look for). Work done by hand.
- **言 / 讠** (speech): **说** (speak), **请** (please), **谢** (thank).
- **日** (sun, day): **明** (bright), **星** (star, in **星期**, week).
- **月** (moon; also body): **明** (bright); **脑** (brain).
- **火 / 灬** (fire): **热** (hot), **点** (dot, o'clock).

Look at **明** above. **日** on the left is a little smaller and slimmer, **月** on the right taller.

## contrast.id

**明** dan **朋** (dalam **朋友**, teman) mudah tertukar. **明** = **日** + **月**; **朋** = **月** + **月**. Hitung kotak kirinya: **日** punya satu **横** di tengah, dan tidak ada kaki.

Bahasa Indonesia juga punya kata yang menyimpan gambaran, seperti *matahari* (mata + hari). Radikal bekerja mirip. Tapi satu batas yang jujur: radikal kadang sudah jauh dari artinya. **点** punya **灬** (api), tapi artinya *titik* atau *jam*, bukan sesuatu yang panas.

## contrast.en

**明** and **朋** (in **朋友**, friend) are easy to mix up. **明** = **日** + **月**; **朋** = **月** + **月**. Look at the left box: **日** has one **横** in the middle, and no legs.

Indonesian also has words that hold a picture, like *matahari* (eye + day, the sun). Radicals work in a similar way. But one honest limit: a radical has sometimes drifted far from its meaning. **点** has **灬** (fire), but it means *dot* or *o'clock*, not something hot.
