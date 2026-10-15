---
id: dasar2-03-urutan-goresan
rung: dasar-2
order: 3
status: draft
minutes: 8
title: { id: "Urutan goresan", en: "Stroke order", zh: "先 横 后 竖", py: "xiān héng hòu shù" }
summary:
  id: "Goresan ditulis dengan urutan tetap: mendatar sebelum tegak, kiri sebelum kanan, atas sebelum bawah, luar sebelum dalam, dan kotak ditutup paling akhir."
  en: "Strokes go in a fixed order: horizontal before vertical, left before right, top before bottom, outside before inside, and a box is closed last."
introduces: [d2-order]
spiral: strokes
visual: { id: stroke-order, props: { char: "十" } }
examples:
  - zh: "[[十]]"
    py: "[[shí]]"
    id: "横 dulu, lalu 竖 (先横后竖)"
    en: "横 first, then 竖 (先横后竖)"
  - zh: "[[人]]"
    py: "[[rén]]"
    id: "撇 dulu, lalu 捺: kiri dulu, lalu kanan"
    en: "撇 first, then 捺: left first, then right"
  - zh: "[[三]]"
    py: "[[sān]]"
    id: "dari atas ke bawah: tiga 横, yang paling atas dulu"
    en: "top to bottom: three 横, the top one first"
  - zh: "[[好]]"
    py: "[[hǎo]]"
    id: "dari kiri ke kanan: 女 dulu, lalu 子"
    en: "left to right: 女 first, then 子"
  - zh: "[[月]]"
    py: "[[yuè]]"
    id: "luar dulu, lalu dalam: bingkai, lalu dua 横 di dalamnya"
    en: "outside first, then inside: the frame, then the two 横 inside"
  - zh: "[[日]]"
    py: "[[rì]]"
    id: "masuk dulu, baru tutup pintu: 横 bawah ditulis paling akhir"
    en: "go in, then close the door: the bottom 横 comes last"
    note: { id: "Urutannya: **竖** kiri, **折** (atas dan kanan), **横** tengah, lalu **横** bawah yang menutup kotak.", en: "The order: left **竖**, **折** (top and right), middle **横**, then the bottom **横** that closes the box." }
pair:
  off: { zh: "入", py: "rù" }
  natural: { zh: "[[人]]", py: "[[rén]]" }
hanzi: [三, 好, 月, 日]
words:
  id: "Guru Mandarin sering mengucapkan aturan ini sebagai rumus pendek: **先横后竖** (横 dulu, 竖 kemudian), **先撇后捺** (撇 dulu, 捺 kemudian). **先** berarti *dulu*, **后** berarti *kemudian*."
  en: "Chinese teachers often say these rules as short formulas: **先横后竖** (横 first, 竖 after), **先撇后捺** (撇 first, 捺 after). **先** means *first*, **后** means *after*."
tirukan: { zh: "十", py: "shí", id: "sepuluh", en: "ten" }
check:
  - id: d2-03-c1
    type: choice
    prompt: "Goresan pertama **十** adalah …"
    options: ["横 (mendatar)", "竖 (tegak)"]
    answer: "横 (mendatar)"
    why: { id: "**先横后竖**: mendatar dulu, tegak kemudian.", en: "**先横后竖**: horizontal first, vertical after." }
  - id: d2-03-c2
    type: gap
    cue: "Mendatar dulu, tegak kemudian."
    prompt: "先 横 后 ___"
    options: ["竖", "撇", "点"]
    answer: "竖"
    why: { id: "**先横后竖**: aturan untuk **十**, **木** dan banyak karakter lain.", en: "**先横后竖**: the rule for **十**, **木** and many other characters." }
  - id: d2-03-c3
    type: choice
    prompt: "Dalam **日**, goresan mana yang ditulis paling akhir?"
    options: ["横 bawah, yang menutup kotak", "横 tengah", "竖 kiri"]
    answer: "横 bawah, yang menutup kotak"
    why: { id: "Isi dulu, baru tutup. **横** tengah ditulis sebelum **横** bawah.", en: "Fill it first, then close it. The middle **横** comes before the bottom **横**." }
  - id: d2-03-c4
    type: choice
    prompt: "Bagaimana urutan menulis **好**?"
    options: ["女 dulu, lalu 子", "子 dulu, lalu 女"]
    answer: "女 dulu, lalu 子"
    why: { id: "Kiri sebelum kanan: **女** di kiri, **子** di kanan.", en: "Left before right: **女** is on the left, **子** on the right." }
  - id: d2-03-c5
    type: choice
    prompt: "Dalam **小**, goresan mana yang pertama?"
    options: ["goresan tengah yang berkait", "titik di kiri", "titik di kanan"]
    answer: "goresan tengah yang berkait"
    why: { id: "Kalau ada bagian tengah dan dua sisi yang kecil, tengah dulu, lalu kiri, lalu kanan.", en: "When there is a middle and two small sides, the middle comes first, then left, then right." }
glossary:
  - { zh: "三", py: "sān", id: "tiga", en: "three", hsk: "1" }
  - { zh: "好", py: "hǎo", id: "baik", en: "good", hsk: "1" }
  - { zh: "月", py: "yuè", id: "bulan", en: "moon; month", hsk: "1" }
  - { zh: "日", py: "rì", id: "matahari; hari, tanggal", en: "sun; day, date", hsk: "1" }
  - { zh: "先", py: "xiān", id: "dulu, lebih dulu", en: "first", hsk: "1" }
  - { zh: "后", py: "hòu", id: "kemudian, belakang", en: "after, behind", hsk: "1" }
extra:
  - { zh: "木", reason: "the radical tree, a model for 先横后竖 (HSK 1 only inside words; taught as a radical in lesson 5)" }
next: dasar2-04-kotak-latihan
---

## concept.id

Setiap karakter punya urutan goresan yang tetap. Urutan ini bukan hiasan: tulisan jadi rapi, cepat, dan aplikasi bisa mengenali goresanmu. Hampir semuanya mengikuti beberapa aturan.

1. **Mendatar sebelum tegak** (**先横后竖**): **十** = **横**, lalu **竖**.
2. **撇 sebelum 捺**: **人** = kaki kiri, lalu kaki kanan.
3. **Atas sebelum bawah**: **三**, goresan paling atas dulu.
4. **Kiri sebelum kanan**: **好**, **女** dulu, lalu **子**.
5. **Luar sebelum dalam**: **月**, bingkainya dulu, lalu isinya.
6. **Masuk dulu, baru tutup pintu**: **日**, isi kotak dulu, **横** bawah paling akhir.
7. **Tengah sebelum dua sisi**: **小**, goresan tengah dulu, lalu titik kiri dan kanan.

Lihat **十** di atas, lalu tulis di udara dengan jarimu: kiri ke kanan, lalu atas ke bawah.

## concept.en

Every character has a fixed stroke order. It isn't decoration: it makes your writing neat and fast, and lets the app recognise your strokes. Nearly all of it follows a few rules.

1. **Horizontal before vertical** (**先横后竖**): **十** = **横**, then **竖**.
2. **撇 before 捺**: **人** = left leg, then right leg.
3. **Top before bottom**: **三**, the top stroke first.
4. **Left before right**: **好**, **女** first, then **子**.
5. **Outside before inside**: **月**, the frame first, then what's inside.
6. **Go in, then close the door**: **日**, fill the box first, the bottom **横** last.
7. **Middle before the two sides**: **小**, the middle stroke first, then the left and right dots.

Watch **十** above, then write it in the air with your finger: left to right, then top to bottom.

## contrast.id

Kalau **人** ditulis dengan **捺** yang dimulai dari atas dan **撇** yang pendek, hasilnya **入** rù (masuk), karakter lain. Urutan yang benar membantu kamu membuat bentuk yang benar.

Saat menulis huruf Latin, urutan garis jarang dipersoalkan: setiap orang menulis *t* atau *E* dengan caranya sendiri. Dalam karakter, urutan diajarkan dan dipakai semua orang. Satu batas yang jujur: ada karakter yang punya kekecualian, dan aturan di Tiongkok, Taiwan dan Jepang kadang berbeda sedikit. Aplikasi ini mengikuti standar Tiongkok daratan.

## contrast.en

If you write **人** with a **捺** that starts at the top and a short **撇**, you get **入** rù (to enter), a different character. The right order helps you make the right shape.

When writing Latin letters, stroke order rarely matters: everyone writes *t* or *E* their own way. With characters, the order is taught and everyone uses it. One honest limit: some characters have exceptions, and the rules in mainland China, Taiwan and Japan sometimes differ slightly. This app follows the mainland standard.
