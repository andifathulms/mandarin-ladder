---
id: dasar2-02-delapan-goresan
rung: dasar-2
order: 2
status: draft
minutes: 8
title: { id: "Delapan goresan dasar", en: "The eight basic strokes", zh: "笔画", py: "bǐhuà" }
summary:
  id: "Semua karakter dibangun dari beberapa goresan dasar: 横 (mendatar), 竖 (tegak), 撇 (miring ke kiri), 点 (titik), 捺 (miring ke kanan), 提 (naik), 折 (belok) dan 钩 (kait)."
  en: "Every character is built from a few basic strokes: 横 (horizontal), 竖 (vertical), 撇 (falling left), 点 (dot), 捺 (falling right), 提 (rising), 折 (turning) and 钩 (hook)."
introduces: [d2-strokes]
spiral: strokes
visual: { id: stroke-order, props: { char: "大" } }
examples:
  - zh: "[[十]]"
    py: "[[shí]]"
    id: "sepuluh: 横 dari kiri ke kanan, lalu 竖 dari atas ke bawah"
    en: "ten: 横 from left to right, then 竖 from top to bottom"
  - zh: "[[人]]"
    py: "[[rén]]"
    id: "orang: 撇 turun ke kiri, 捺 turun ke kanan"
    en: "person: 撇 falls to the left, 捺 falls to the right"
    note: { id: "**撇** makin tipis di ujung. **捺** makin tebal, lalu melebar di ujungnya.", en: "**撇** thins out at its end. **捺** grows heavier, then flares at its end." }
  - zh: "[[六]]"
    py: "[[liù]]"
    id: "enam: dimulai dengan 点, titik kecil di atas"
    en: "six: it starts with 点, a small dot on top"
  - zh: "[[打]]"
    py: "[[dǎ]]"
    id: "memukul, menelepon: goresan ketiga adalah 提, naik dari kiri bawah ke kanan atas"
    en: "to hit, to call: the third stroke is 提, rising from bottom left to top right"
  - zh: "[[口]]"
    py: "[[kǒu]]"
    id: "mulut: goresan kedua adalah 折, mendatar lalu belok ke bawah tanpa mengangkat pena"
    en: "mouth: the second stroke is 折, across and then down without lifting the pen"
  - zh: "[[小]]"
    py: "[[xiǎo]]"
    id: "kecil: goresan tengah adalah 竖 yang diakhiri 钩, kait kecil ke kiri"
    en: "small: the middle stroke is a 竖 that ends in 钩, a small hook to the left"
pair:
  off: { zh: "太", py: "tài" }
  natural: { zh: "[[大]]", py: "[[dà]]" }
hanzi: [大, 十, 人, 六, 打, 口, 小]
words:
  id: "Nama goresan juga kata biasa: **横** héng berarti *melintang*, **点** diǎn berarti *titik*. Kamu tidak perlu menghafal namanya dalam bahasa Mandarin. Yang penting arah dan bentuknya."
  en: "Stroke names are ordinary words too: **横** héng means *across*, **点** diǎn means *dot*. You don't need to memorise the Chinese names. What matters is the direction and the shape."
tirukan: { zh: "大", py: "dà", id: "besar", en: "big" }
check:
  - id: d2-02-c1
    type: choice
    prompt: "Goresan mana yang ditulis dari kiri bawah naik ke kanan atas?"
    options: ["tí", "piě", "nà"]
    answer: "tí"
    why: { id: "**提** satu-satunya goresan yang naik. **撇** dan **捺** sama-sama turun.", en: "**提** is the only stroke that rises. **撇** and **捺** both fall." }
  - id: d2-02-c2
    type: choice
    prompt: "Dalam **人**, goresan yang turun ke kanan disebut apa?"
    options: ["nà", "piě", "héng"]
    answer: "nà"
    why: { id: "**捺** turun ke kanan dan melebar di ujung. **撇** turun ke kiri.", en: "**捺** falls to the right and flares at the end. **撇** falls to the left." }
  - id: d2-02-c3
    type: choice
    prompt: "**横** ditulis ke arah mana?"
    options: ["dari kiri ke kanan", "dari kanan ke kiri", "dari atas ke bawah"]
    answer: "dari kiri ke kanan"
    why: { id: "**横** selalu dari kiri ke kanan, sedikit naik di ujungnya. Dari atas ke bawah adalah **竖**.", en: "**横** always goes left to right, rising slightly at the end. Top to bottom is **竖**." }
  - id: d2-02-c4
    type: choice
    show_pinyin: false
    prompt: "Karakter mana yang dimulai dengan sebuah 点 (titik)?"
    options: ["六", "十", "人"]
    answer: "六"
    why: { id: "**六** liù dimulai dengan titik di atas. **十** dimulai dengan **横**, **人** dengan **撇**.", en: "**六** liù starts with a dot on top. **十** starts with **横**, **人** with **撇**." }
  - id: d2-02-c5
    type: choice
    prompt: "Dalam **口**, goresan kedua mendatar lalu belok ke bawah. Itu goresan apa?"
    options: ["折 (zhé)", "钩 (gōu)", "竖 (shù)"]
    answer: "折 (zhé)"
    why: { id: "**折** adalah goresan yang berbelok tanpa mengangkat pena. **钩** hanya kait kecil di ujung goresan.", en: "**折** is a stroke that turns without lifting the pen. **钩** is only a small hook at the end of a stroke." }
glossary:
  - { zh: "十", py: "shí", id: "sepuluh", en: "ten", hsk: "1" }
  - { zh: "人", py: "rén", id: "orang", en: "person", hsk: "1" }
  - { zh: "大", py: "dà", id: "besar", en: "big", hsk: "1" }
  - { zh: "口", py: "kǒu", id: "mulut", en: "mouth", hsk: "1" }
  - { zh: "小", py: "xiǎo", id: "kecil", en: "small", hsk: "1" }
  - { zh: "打", py: "dǎ", id: "memukul; menelepon (打电话)", en: "to hit; to make (a call)", hsk: "1" }
extra:
  - { zh: "笔画", reason: "the word for strokes, the topic of the lesson" }
  - { zh: "横", reason: "stroke name (héng), taught in Dasar 2" }
  - { zh: "竖", reason: "stroke name (shù), taught in Dasar 2" }
  - { zh: "撇", reason: "stroke name (piě), taught in Dasar 2" }
  - { zh: "捺", reason: "stroke name (nà), taught in Dasar 2" }
  - { zh: "提", reason: "stroke name (tí), taught in Dasar 2" }
  - { zh: "折", reason: "stroke name (zhé), taught in Dasar 2" }
  - { zh: "钩", reason: "stroke name (gōu), taught in Dasar 2" }
next: dasar2-03-urutan-goresan
---

## concept.id

Karakter tidak digambar bebas. Setiap karakter dibangun dari goresan, dan hampir semua goresan termasuk delapan jenis dasar.

- **横** héng: mendatar, dari kiri ke kanan. Seperti goresan pertama **十**.
- **竖** shù: tegak, dari atas ke bawah. Goresan kedua **十**.
- **撇** piě: miring turun ke kiri, makin tipis di ujung. Kaki kiri **人**.
- **点** diǎn: titik pendek, biasanya turun ke kanan. Atas **六**.
- **捺** nà: miring turun ke kanan, melebar di ujung. Kaki kanan **人**.
- **提** tí: naik dari kiri bawah ke kanan atas. Goresan ketiga **打**.
- **折** zhé: belok tanpa mengangkat pena. Goresan kedua **口**.
- **钩** gōu: kait kecil di ujung goresan. Tengah **小**.

Lihat **大** di atas: **横**, lalu **撇**, lalu **捺**. Tiga goresan, satu karakter.

## concept.en

Characters aren't drawn freehand. Every character is built from strokes, and nearly every stroke belongs to one of eight basic kinds.

- **横** héng: horizontal, left to right. Like the first stroke of **十**.
- **竖** shù: vertical, top to bottom. The second stroke of **十**.
- **撇** piě: falling to the left, thinning at the end. The left leg of **人**.
- **点** diǎn: a short dot, usually falling to the right. The top of **六**.
- **捺** nà: falling to the right, flaring at the end. The right leg of **人**.
- **提** tí: rising from bottom left to top right. The third stroke of **打**.
- **折** zhé: a turn without lifting the pen. The second stroke of **口**.
- **钩** gōu: a small hook at the end of a stroke. The middle of **小**.

Look at **大** above: **横**, then **撇**, then **捺**. Three strokes, one character.

## contrast.id

Satu goresan bisa mengubah karakter. **大** dà (besar) ditambah satu **点** menjadi **太** tài (terlalu). Jadi hitung goresannya, jangan hanya melihat bentuk kasarnya.

Huruf Latin juga punya garis dan lengkung, dan kamu bisa menulis *a* dengan cara apa saja selama terbaca. Karakter lebih ketat: arah goresan ikut menentukan bentuknya. **撇** dan **提** sama-sama miring, tapi **撇** turun ke kiri, **提** naik ke kanan.

## contrast.en

One stroke can change the character. **大** dà (big) plus one **点** becomes **太** tài (too). So count the strokes, don't just look at the rough shape.

Latin letters have lines and curves too, and you can write *a* any way you like as long as it's readable. Characters are stricter: a stroke's direction shapes it. **撇** and **提** are both slanted, but **撇** falls to the left and **提** rises to the right.
