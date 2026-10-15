---
id: dasar1-08-perubahan-nada
rung: dasar-1
order: 8
status: draft
minutes: 9
title: { id: "Saat nada berubah", en: "When tones change", zh: "我 不 是 老师 。", py: "wǒ bú shì lǎoshī ." }
summary:
  id: "Tiga aturan perubahan nada: nada 3 sebelum nada 3 diucapkan naik, 不 menjadi bú sebelum nada 4, dan 一 berubah menurut nada sesudahnya."
  en: "Three tone-change rules: tone 3 before tone 3 is said rising, 不 becomes bú before tone 4, and 一 changes with the tone after it."
introduces: [d1-sandhi]
spiral: sandhi
visual: { id: sandhi-strip, props: { initial: { preset: 0, mode: "written" }, presets: [0, 1, 7, 2, 3, 4, 5] } }
examples:
  - zh: "[[你 好]] 。"
    py: "[[nǐ hǎo]] ."
    id: "Halo."
    en: "Hello."
    note: { id: "Ditulis **nǐ hǎo**, diucapkan *ní hǎo*. Nada 3 yang pertama menjadi nada 2.", en: "Written **nǐ hǎo**, said *ní hǎo*. The first tone 3 becomes tone 2." }
  - zh: "[[很 好]] 。"
    py: "[[hěn hǎo]] ."
    id: "Baik sekali."
    en: "Very good."
    note: { id: "Aturan yang sama berlaku di antara dua kata: *hén hǎo*.", en: "The same rule works across two words: *hén hǎo*." }
  - zh: "[[不 是]] 。"
    py: "[[bú shì]] ."
    id: "Bukan."
    en: "No, it isn't."
    note: { id: "**不** biasanya **bù**. Sebelum nada 4 (**shì**), ia menjadi **bú**. Di aplikasi ini, **不** ditulis dengan nada ucapannya.", en: "**不** is usually **bù**. Before tone 4 (**shì**), it becomes **bú**. In this app, **不** is written with its spoken tone." }
  - zh: "[[不 好]] 。"
    py: "[[bù hǎo]] ."
    id: "Tidak baik."
    en: "Not good."
    note: { id: "Sebelum nada 1, 2, atau 3, **不** tetap **bù**.", en: "Before tones 1, 2 or 3, **不** stays **bù**." }
  - zh: "[[一 个]]"
    py: "[[yí gè]]"
    id: "satu (buah)"
    en: "one (of something)"
    note: { id: "**一** sebelum nada 4 menjadi **yí**.", en: "**一** before tone 4 becomes **yí**." }
  - zh: "[[一 天]]"
    py: "[[yì tiān]]"
    id: "satu hari"
    en: "one day"
    note: { id: "**一** sebelum nada 1, 2, atau 3 menjadi **yì**. Saat berhitung atau di akhir, ia tetap **yī**.", en: "**一** before tones 1, 2 or 3 becomes **yì**. When counting or at the end, it stays **yī**." }
pair:
  off: { zh: "不 是 。", py: "bù shì ." }
  natural: { zh: "[[不 是]] 。", py: "[[bú shì]] ." }
tone: { zh: "水果", py: "shuǐguǒ", note: { id: "Ditulis 3 + 3, diucapkan 2 + 3: *shuíguǒ*. Pinyin tetap menulis nada aslinya.", en: "Written 3 + 3, said 2 + 3: *shuíguǒ*. Pinyin still writes the original tones." } }
tirukan: { zh: "我 不 是 老师 。", py: "wǒ bú shì lǎoshī .", id: "Aku bukan guru.", en: "I'm not a teacher." }
check:
  - id: d1-08-c1
    type: tone
    audio: "你 好"
    audio_py: "nǐ hǎo"
    ask: spoken
    options: [[3, 3], [2, 3]]
    answer: [2, 3]
    why: { id: "Dua nada 3 berurutan: yang pertama diucapkan naik, *ní hǎo*.", en: "Two third tones in a row: the first is said rising, *ní hǎo*." }
  - id: d1-08-c2
    type: tone
    audio: "不 是"
    audio_py: "bú shì"
    ask: spoken
    options: [[4, 4], [2, 4]]
    answer: [2, 4]
    why: { id: "**不** sebelum nada 4 menjadi **bú**.", en: "**不** before tone 4 becomes **bú**." }
  - id: d1-08-c3
    type: tone
    audio: "不 好"
    audio_py: "bù hǎo"
    ask: spoken
    options: [[4, 3], [2, 3]]
    answer: [4, 3]
    why: { id: "**好** bernada 3, bukan 4. Jadi **不** tetap **bù**.", en: "**好** is tone 3, not tone 4. So **不** stays **bù**." }
  - id: d1-08-c4
    type: tone
    audio: "一 个"
    audio_py: "yí gè"
    ask: spoken
    options: [[1, 4], [2, 4], [4, 4]]
    answer: [2, 4]
    why: { id: "**个** bernada 4, jadi **一** menjadi **yí**.", en: "**个** is tone 4, so **一** becomes **yí**." }
  - id: d1-08-c5
    type: choice
    prompt: "Bagaimana **一** diucapkan sebelum **天**?"
    options: ["yī", "yí", "yì"]
    answer: "yì"
    why: { id: "**天** bernada 1. Sebelum nada 1, 2, atau 3, **一** menjadi **yì**.", en: "**天** is tone 1. Before tones 1, 2 or 3, **一** becomes **yì**." }
glossary:
  - { zh: "不", py: "bù", id: "tidak", en: "not", hsk: "1" }
  - { zh: "一", py: "yī", id: "satu", en: "one", hsk: "1" }
  - { zh: "个", py: "gè", id: "kata penggolong umum", en: "general measure word", hsk: "1" }
  - { zh: "天", py: "tiān", id: "hari; langit", en: "day; sky", hsk: "1" }
  - { zh: "很", py: "hěn", id: "sangat", en: "very", hsk: "1" }
  - { zh: "水果", py: "shuǐguǒ", id: "buah", en: "fruit", hsk: "1" }
next: dasar1-09-pasangan-nada
---

## concept.id

Dalam bicara, beberapa nada berubah karena nada sesudahnya. Ada tiga aturan.

**Nada 3 + nada 3.** Kalau dua nada 3 berurutan, yang pertama diucapkan seperti nada 2. **你好** ditulis **nǐ hǎo**, diucapkan *ní hǎo*. Pinyin tidak mengubah tulisannya; aplikasi ini menunjukkan nada ucapannya untukmu.

**不 bù.** **不** bernada 4, tapi sebelum nada 4 lain ia menjadi nada 2: **bú shì**, **bú duì**. Sebelum nada lain, ia tetap **bù**: **bù hǎo**.

**一 yī.** Saat berhitung, di akhir, atau di dalam angka (**十一**), **一** tetap **yī**. Sebelum nada 4 ia menjadi **yí** (**yí gè**), dan sebelum nada 1, 2, atau 3 ia menjadi **yì** (**yì tiān**).

Buku pelajaran, dan aplikasi ini, menulis **不** dan **一** dengan nada ucapannya. Untuk kata lain, pinyin selalu menulis nada asli.

## concept.en

In speech, some tones change because of the tone after them. There are three rules.

**Tone 3 + tone 3.** When two third tones come in a row, the first is said like tone 2. **你好** is written **nǐ hǎo** and said *ní hǎo*. Pinyin doesn't change the spelling; this app shows the spoken tones for you.

**不 bù.** **不** is tone 4, but before another tone 4 it becomes tone 2: **bú shì**, **bú duì**. Before other tones it stays **bù**: **bù hǎo**.

**一 yī.** When counting, at the end, or inside a number (**十一**), **一** stays **yī**. Before tone 4 it becomes **yí** (**yí gè**), and before tones 1, 2 or 3 it becomes **yì** (**yì tiān**).

Textbooks, and this app, write **不** and **一** with their spoken tones. For every other word, pinyin writes the original tone.

## contrast.id

Bahasa Indonesia juga mengubah bunyi karena bunyi sesudahnya: *meN-* menjadi *mem-*, *men-*, atau *meng-* menurut huruf berikutnya (*membeli*, *menulis*, *menggambar*). Perubahan nada Mandarin mirip seperti itu: aturannya tetap, dan penutur aslinya melakukannya tanpa berpikir.

Bedanya, perubahan *meN-* ditulis, sedangkan perubahan nada 3 + 3 tidak. Jadi kamu harus membaca **nǐ hǎo** dan mengucapkan *ní hǎo*. Kalau tiga nada 3 berurutan (**我很好**), penutur asli kadang mengelompokkannya dengan cara berbeda. Aplikasi ini menunjukkan satu cara yang umum.

## contrast.en

Indonesian changes sounds because of the next sound too: *meN-* becomes *mem-*, *men-* or *meng-* depending on the next letter (*membeli*, *menulis*, *menggambar*). Mandarin tone changes are like that: the rules are fixed, and native speakers apply them without thinking.

The difference is that the *meN-* change is written, and the 3 + 3 change isn't. So you read **nǐ hǎo** and say *ní hǎo*. When three third tones come in a row (**我很好**), native speakers sometimes group them differently. This app shows one common way.
