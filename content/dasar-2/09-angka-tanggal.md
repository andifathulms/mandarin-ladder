---
id: dasar2-09-angka-tanggal
rung: dasar-2
order: 9
status: draft
minutes: 9
title: { id: "Angka dan tanggal", en: "Numbers and dates", zh: "十 月 十六 日", py: "shí yuè shíliù rì" }
summary:
  id: "一 sampai 十 cukup untuk menulis angka sampai 99: 十一 = 10 + 1, 二十 = 2 × 10. Tanggal ditulis dari yang besar ke yang kecil: 年 (tahun), 月 (bulan), 日 (tanggal)."
  en: "一 to 十 are enough to write numbers up to 99: 十一 = 10 + 1, 二十 = 2 × 10. Dates go from big to small: 年 (year), 月 (month), 日 (day)."
introduces: [d2-numbers]
spiral: numbers
visual: { id: stroke-order, props: { char: "三" } }
examples:
  - zh: "[[三]]"
    py: "[[sān]]"
    id: "tiga: tiga 横, yang tengah paling pendek, yang bawah paling panjang"
    en: "three: three 横, the middle one shortest, the bottom one longest"
  - zh: "[[十一]]"
    py: "[[shíyī]]"
    id: "sebelas: 十 + 一, sepuluh dan satu"
    en: "eleven: 十 + 一, ten and one"
  - zh: "[[二十]]"
    py: "[[èrshí]]"
    id: "dua puluh: 二 × 十, dua kali sepuluh"
    en: "twenty: 二 × 十, two tens"
    note: { id: "Angka di depan **十** mengalikan, angka di belakang menambah. **二十** = 20, **十二** = 12.", en: "A number before **十** multiplies, a number after it adds. **二十** = 20, **十二** = 12." }
  - zh: "[[一百]]"
    py: "[[yìbǎi]]"
    id: "seratus: 一 dibaca yì sebelum nada ketiga"
    en: "one hundred: 一 is read yì before a third tone"
  - zh: "[[十 月]]"
    py: "[[shí yuè]]"
    id: "Oktober: bulan kesepuluh"
    en: "October: the tenth month"
  - zh: "今天 是 十 月 [[十六 日]] 。"
    py: "jīntiān shì shí yuè [[shíliù rì]] ."
    id: "Hari ini tanggal 16 Oktober."
    en: "Today is 16 October."
    note: { id: "Dalam tulisan, tanggal memakai **日**. Dalam percakapan, orang biasanya memakai **号** hào: **十六号**.", en: "In writing, dates use **日**. In speech, people usually use **号** hào: **十六号**." }
pair:
  off: { zh: "十六 日 十 月", py: "shíliù rì shí yuè" }
  natural: { zh: "十 月 [[十六 日]]", py: "shí yuè [[shíliù rì]]" }
hanzi: [一, 二, 三, 四, 五, 七, 八, 九, 百, 年]
words:
  id: "Kamu mungkin sudah tahu *cepek* dan *gopek* dari bahasa Hokkien. Dalam bahasa Mandarin, seratus adalah **一百** yìbǎi, lima ratus **五百** wǔbǎi."
  en: "You may already know *cepek* and *gopek* from Hokkien. In Mandarin, a hundred is **一百** yìbǎi, five hundred **五百** wǔbǎi."
hokkien: [cepek, gopek]
tirukan: { zh: "今天 是 十 月 十六 日 。", py: "jīntiān shì shí yuè shíliù rì .", id: "Hari ini tanggal 16 Oktober.", en: "Today is 16 October." }
check:
  - id: d2-09-c1
    type: choice
    show_pinyin: false
    prompt: "Karakter mana yang berarti *tiga*?"
    options: ["三", "二", "十"]
    answer: "三"
    why: { id: "**三** sān: tiga garis, tiga. **二** èr: dua. **十** shí: sepuluh.", en: "**三** sān: three lines, three. **二** èr: two. **十** shí: ten." }
  - id: d2-09-c2
    type: choice
    py: { "十二": "shí'èr" }
    prompt: "Bagaimana menulis *dua puluh*?"
    options: ["二十", "十二"]
    answer: "二十"
    why: { id: "**二** di depan **十** mengalikan: 2 × 10. **十二** adalah 10 + 2, dua belas.", en: "**二** before **十** multiplies: 2 × 10. **十二** is 10 + 2, twelve." }
  - id: d2-09-c3
    type: gap
    cue: "16 Oktober"
    prompt: "十 月 十六 ___"
    options: ["日", "月", "年"]
    answer: "日"
    why: { id: "Bulan dulu (**十月**), lalu tanggal dengan **日**.", en: "The month first (**十月**), then the day with **日**." }
  - id: d2-09-c4
    type: listen
    audio: "一百"
    options: ["seratus", "sepuluh", "sebelas"]
    answer: "seratus"
    why: { id: "**一百** yìbǎi: seratus. **十** shí: sepuluh. **十一** shíyī: sebelas.", en: "**一百** yìbǎi: one hundred. **十** shí: ten. **十一** shíyī: eleven." }
  - id: d2-09-c5
    type: trace
    char: "三"
    guide: "off"
    why: { id: "Tiga **横**, dari atas ke bawah. Yang tengah paling pendek, yang bawah paling panjang.", en: "Three **横**, from top to bottom. The middle one shortest, the bottom one longest." }
  - id: d2-09-c6
    type: choice
    prompt: "Dalam bahasa Mandarin, tanggal ditulis dengan urutan …"
    options: ["tahun, bulan, tanggal", "tanggal, bulan, tahun"]
    answer: "tahun, bulan, tanggal"
    why: { id: "Dari yang besar ke yang kecil: **年**, **月**, **日**. Kebalikan dari bahasa Indonesia.", en: "From big to small: **年**, **月**, **日**. The reverse of Indonesian." }
glossary:
  - { zh: "一", py: "yī", id: "satu", en: "one", hsk: "1" }
  - { zh: "百", py: "bǎi", id: "ratus", en: "hundred", hsk: "1" }
  - { zh: "年", py: "nián", id: "tahun", en: "year", hsk: "1" }
  - { zh: "月", py: "yuè", id: "bulan", en: "month", hsk: "1" }
  - { zh: "日", py: "rì", id: "tanggal, hari (tulisan)", en: "day of the month (written)", hsk: "1" }
  - { zh: "号", py: "hào", id: "tanggal (lisan); nomor", en: "day of the month (spoken); number", hsk: "1" }
next: dasar2-10-kalimat-pertama
---

## concept.id

Angka Mandarin sangat teratur. Sepuluh karakter cukup untuk menulis angka sampai 99:

**一** 1, **二** 2, **三** 3, **四** 4, **五** 5, **六** 6, **七** 7, **八** 8, **九** 9, **十** 10.

- **一 二 三** adalah satu, dua, tiga garis **横**, ditulis dari atas ke bawah.
- Angka di belakang **十** menambah: **十一** 11, **十六** 16.
- Angka di depan **十** mengalikan: **二十** 20, **九十九** 99.
- **百** berarti ratus: **一百** 100, **五百** 500.

Tanggal ditulis dari yang besar ke yang kecil: tahun **年**, bulan **月**, tanggal **日**. Bulan cukup angka + **月**: **一月** Januari, **十月** Oktober, **十二月** Desember. Tahun biasanya ditulis dengan angka biasa dan dibaca angka per angka: **2026年** = èr líng èr liù nián.

## concept.en

Mandarin numbers are very regular. Ten characters are enough to write every number up to 99:

**一** 1, **二** 2, **三** 3, **四** 4, **五** 5, **六** 6, **七** 7, **八** 8, **九** 9, **十** 10.

- **一 二 三** are one, two, three **横** strokes, written top to bottom.
- A number after **十** adds: **十一** 11, **十六** 16.
- A number before **十** multiplies: **二十** 20, **九十九** 99.
- **百** means hundred: **一百** 100, **五百** 500.

Dates go from big to small: year **年**, month **月**, day **日**. A month is just a number + **月**: **一月** January, **十月** October, **十二月** December. Years are usually written in ordinary digits and read digit by digit: **2026年** = èr líng èr liù nián.

## contrast.id

Penutur bahasa Indonesia sering mengikuti urutan *16 Oktober*. Dalam bahasa Mandarin, urutannya terbalik: **十月十六日**, bulan dulu, tanggal kemudian.

Cara membentuk angka mirip bahasa Indonesia: *dua puluh* = dua × sepuluh, *sebelas* kira-kira sepuluh + satu. Bedanya, Mandarin tidak punya kata khusus seperti *belas*: **十二** hanya *sepuluh dua*. Dan ingat nada **一**: **yī** saat menghitung, tapi **yì** dalam **一百**.

## contrast.en

Indonesian speakers often follow the order of *16 Oktober*. In Mandarin the order is reversed: **十月十六日**, month first, day after.

Building numbers is like Indonesian: *dua puluh* = two × ten, *sebelas* roughly ten + one. The difference is that Mandarin has no special word like *belas*: **十二** is just *ten two*. And remember the tone of **一**: **yī** when counting, but **yì** in **一百**.
