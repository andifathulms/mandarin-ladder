---
id: dasar2-05-radikal-1
rung: dasar-2
order: 5
status: draft
minutes: 9
title: { id: "Radikal (1)", en: "Radicals (1)", zh: "人 口 女 子 木 水", py: "rén kǒu nǚ zǐ mù shuǐ" }
summary:
  id: "Radikal adalah bagian yang memberi petunjuk arti. Enam yang pertama: 人/亻 (orang), 口 (mulut), 女 (perempuan), 子 (anak), 木 (pohon) dan 水/氵 (air)."
  en: "A radical is the part that hints at the meaning. The first six: 人/亻 (person), 口 (mouth), 女 (woman), 子 (child), 木 (tree) and 水/氵 (water)."
introduces: [d2-radicals-1]
spiral: radicals
visual: { id: character-parts, props: { char: "好" } }
examples:
  - zh: "[[你]]"
    py: "[[nǐ]]"
    id: "kamu: 亻 (orang) di kiri"
    en: "you: 亻 (person) on the left"
    note: { id: "**人** menjadi **亻** saat berdiri di sisi kiri: lebih ramping, supaya ada ruang untuk bagian kanan.", en: "**人** becomes **亻** when it stands on the left: slimmer, to leave room for the right part." }
  - zh: "[[吃]]"
    py: "[[chī]]"
    id: "makan: 口 (mulut) di kiri"
    en: "to eat: 口 (mouth) on the left"
  - zh: "[[她]]"
    py: "[[tā]]"
    id: "dia (perempuan): 女 (perempuan) di kiri"
    en: "she: 女 (woman) on the left"
  - zh: "[[字]]"
    py: "[[zì]]"
    id: "karakter: 子 (anak) di bawah atap"
    en: "character: 子 (child) under a roof"
  - zh: "[[杯子]]"
    py: "[[bēizi]]"
    id: "gelas, cangkir: 杯 punya 木 (kayu) di kiri, karena cangkir dulu dibuat dari kayu"
    en: "cup: 杯 has 木 (wood) on the left, because cups were once made of wood"
  - zh: "[[洗]]"
    py: "[[xǐ]]"
    id: "mencuci: 氵 (air) di kiri"
    en: "to wash: 氵 (water) on the left"
    note: { id: "**水** menjadi **氵**, tiga titik, saat berdiri di kiri.", en: "**水** becomes **氵**, three dots, when it stands on the left." }
pair:
  off: { zh: "他", py: "tā" }
  natural: { zh: "[[她]]", py: "[[tā]]" }
hanzi: [你, 他, 她, 吃, 喝, 洗, 杯]
words:
  id: "Radikal hanya petunjuk, bukan definisi. **好** (baik) punya **女** dan **子**, tapi artinya bukan *perempuan dan anak*. Radikal membantu kamu mengingat dan menebak, bukan menerjemahkan."
  en: "A radical is a hint, not a definition. **好** (good) has **女** and **子**, but it doesn't mean *woman and child*. Radicals help you remember and guess, not translate."
tirukan: { zh: "你 好", py: "nǐ hǎo", id: "halo", en: "hello" }
check:
  - id: d2-05-c1
    type: choice
    prompt: "Radikal apa yang sama dalam **吃** (makan) dan **喝** (minum)?"
    options: ["口 (mulut)", "女 (perempuan)", "木 (pohon)"]
    answer: "口 (mulut)"
    why: { id: "Makan dan minum memakai mulut: keduanya punya **口** di kiri.", en: "Eating and drinking use the mouth: both have **口** on the left." }
  - id: d2-05-c2
    type: build
    prompt: "Bangun **休** (istirahat): orang yang bersandar di pohon."
    char: "休"
    parts: ["亻", "木", "女", "口", "子"]
    answer: ["亻", "木"]
    why: { id: "**休** = **亻** (orang) + **木** (pohon). Kamu akan bertemu dengannya dalam **休息** (istirahat).", en: "**休** = **亻** (person) + **木** (tree). You'll meet it in **休息** (to rest)." }
  - id: d2-05-c3
    type: choice
    show_pinyin: false
    prompt: "Karakter mana yang punya radikal air?"
    options: ["洗", "你", "吃"]
    answer: "洗"
    why: { id: "**洗** (mencuci) punya **氵**, tiga titik air, di kiri. **你** punya **亻**, **吃** punya **口**.", en: "**洗** (to wash) has **氵**, three drops of water, on the left. **你** has **亻**, **吃** has **口**." }
  - id: d2-05-c4
    type: choice
    prompt: "**他** dan **她** sama-sama dibaca **tā**. Apa yang membedakan tulisannya?"
    options: ["bagian kiri: radikal orang atau 女", "bagian kanan", "nadanya"]
    answer: "bagian kiri: radikal orang atau 女"
    why: { id: "**他** (dia, laki-laki) punya **亻**, **她** (dia, perempuan) punya **女**. Bagian kanannya sama, nadanya juga sama.", en: "**他** (he) has **亻**, **她** (she) has **女**. The right part is the same, and so is the tone." }
  - id: d2-05-c5
    type: trace
    char: "女"
    guide: "on"
    why: { id: "**女**: **折** dulu (turun lalu belok), lalu **撇**, lalu **横** panjang.", en: "**女**: **折** first (down, then turning), then **撇**, then the long **横**." }
glossary:
  - { zh: "你", py: "nǐ", id: "kamu", en: "you", hsk: "1" }
  - { zh: "吃", py: "chī", id: "makan", en: "to eat", hsk: "1" }
  - { zh: "喝", py: "hē", id: "minum", en: "to drink", hsk: "1" }
  - { zh: "她", py: "tā", id: "dia (perempuan)", en: "she, her", hsk: "1" }
  - { zh: "洗", py: "xǐ", id: "mencuci", en: "to wash", hsk: "1" }
  - { zh: "杯子", py: "bēizi", id: "gelas, cangkir", en: "cup, glass", mw: "个", hsk: "1" }
extra:
  - { zh: "休", reason: "the character of 休息 (HSK 1), as a build item: 亻 + 木" }
next: dasar2-06-radikal-2
---

## concept.id

Banyak karakter punya satu bagian yang memberi petunjuk arti. Bagian ini disebut **radikal** (*radical*, **部首** bùshǒu). Kamu sudah melihat satu: **女** dalam **妈**.

Enam radikal pertama:

- **人 / 亻** (orang): **你** (kamu), **他** (dia, laki-laki), **休** (istirahat).
- **口** (mulut): **吃** (makan), **喝** (minum), **吗**.
- **女** (perempuan): **她** (dia, perempuan), **妈** (ibu), **好** (baik).
- **子** (anak): **字** (karakter), **好** (baik).
- **木** (pohon, kayu): **杯** (cangkir), **休** (istirahat).
- **水 / 氵** (air): **洗** (mencuci), **汉** (seperti dalam **汉语**, bahasa Mandarin).

Beberapa radikal berubah bentuk saat berdiri di kiri. **人** menjadi **亻**, **水** menjadi **氵**. Bentuknya lebih ramping, tapi artinya sama.

## concept.en

Many characters have one part that hints at the meaning. It's called a **radical** (**部首** bùshǒu). You've already seen one: **女** in **妈**.

The first six radicals:

- **人 / 亻** (person): **你** (you), **他** (he), **休** (rest).
- **口** (mouth): **吃** (eat), **喝** (drink), **吗**.
- **女** (woman): **她** (she), **妈** (mother), **好** (good).
- **子** (child): **字** (character), **好** (good).
- **木** (tree, wood): **杯** (cup), **休** (rest).
- **水 / 氵** (water): **洗** (wash), **汉** (as in **汉语**, Chinese).

Some radicals change shape when they stand on the left. **人** becomes **亻**, **水** becomes **氵**. The shape is slimmer, but the meaning is the same.

## contrast.id

Dalam bahasa Indonesia, **他** dan **她** sama-sama *dia*, dan dalam bahasa Mandarin lisan juga sama: **tā**. Perbedaannya hanya dalam tulisan. Jadi saat menulis tentang perempuan, pakai **她**, dengan **女**.

Kata Indonesia sering bisa ditebak dari imbuhannya: *pe-*, *-an*. Radikal mirip, tapi lebih longgar. **口** muncul di **吃** dan **喝**, yang memang memakai mulut, tapi juga di **吗**, kata tanya, yang hubungannya dengan mulut hanya karena diucapkan.

## contrast.en

In Indonesian, **他** and **她** are both *dia*, and in spoken Mandarin they're the same too: **tā**. The difference is only in writing. So when writing about a woman, use **她**, with **女**.

Indonesian words can often be guessed from their affixes: *pe-*, *-an*. Radicals are similar, but looser. **口** appears in **吃** and **喝**, which really use the mouth, but also in **吗**, a question word, linked to the mouth only because it's spoken.
