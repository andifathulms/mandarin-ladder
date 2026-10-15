---
id: dasar2-04-kotak-latihan
rung: dasar-2
order: 4
status: draft
minutes: 9
title: { id: "Kotak latihan", en: "The practice grid", zh: "田字格", py: "tiánzìgé" }
summary:
  id: "田字格 adalah kotak latihan dengan garis tengah putus-putus. Setiap karakter mengisi satu kotak yang sama besar, dan garis tengah membantumu menjaga proporsi."
  en: "田字格 is a practice square with dashed centre lines. Every character fills one square of the same size, and the centre lines help you keep its proportions."
introduces: [d2-grid]
spiral: strokes
visual: { id: stroke-order, props: { char: "口" } }
examples:
  - zh: "[[口]]"
    py: "[[kǒu]]"
    id: "mulut: kotak kecil di tengah, tidak menyentuh tepi"
    en: "mouth: a small box in the middle, not touching the edges"
    note: { id: "**口** lebih kecil dari yang kamu kira. Kalau dibuat sebesar kotak, ia akan tampak terlalu berat di samping karakter lain.", en: "**口** is smaller than you'd think. Drawn as big as the square, it looks too heavy next to other characters." }
  - zh: "[[日]]"
    py: "[[rì]]"
    id: "matahari, hari: tinggi dan ramping"
    en: "sun, day: tall and narrow"
  - zh: "[[十]]"
    py: "[[shí]]"
    id: "sepuluh: 横 dan 竖 hampir tepat di garis tengah"
    en: "ten: 横 and 竖 sit almost on the centre lines"
  - zh: "[[大]]"
    py: "[[dà]]"
    id: "besar: 横 sedikit di atas tengah, 撇 dan 捺 melebar ke bawah"
    en: "big: 横 a little above the middle, 撇 and 捺 spreading downward"
  - zh: "[[中]]"
    py: "[[zhōng]]"
    id: "tengah: 竖 yang panjang tepat di garis tengah"
    en: "middle: the long 竖 runs right down the centre line"
  - zh: "[[好]]"
    py: "[[hǎo]]"
    id: "baik: 女 di kiri lebih sempit, 子 di kanan lebih lebar"
    en: "good: 女 on the left is narrower, 子 on the right is wider"
pair:
  off: { zh: "曰", py: "yuē" }
  natural: { zh: "[[日]]", py: "[[rì]]" }
hanzi: [中, 字]
words:
  id: "**田字格** artinya *kotak berbentuk karakter 田*: **田** tián (sawah) memang terlihat seperti kotak dengan garis silang di tengah. Buku latihan anak sekolah di Tiongkok penuh dengan kotak ini."
  en: "**田字格** means *the grid shaped like the character 田*: **田** tián (field) really looks like a square with a cross in the middle. Exercise books for Chinese schoolchildren are full of these squares."
tirukan: { zh: "口", py: "kǒu", id: "mulut", en: "mouth" }
check:
  - id: d2-04-c1
    type: trace
    char: "十"
    guide: "on"
    why: { id: "**横** dari kiri ke kanan, lalu **竖** dari atas ke bawah, tepat di garis tengah.", en: "**横** from left to right, then **竖** from top to bottom, right on the centre lines." }
  - id: d2-04-c2
    type: trace
    char: "口"
    guide: "on"
    why: { id: "**竖** kiri, lalu **折** atas dan kanan, lalu **横** bawah untuk menutup. Tiga goresan.", en: "Left **竖**, then **折** across the top and down the right, then the bottom **横** to close. Three strokes." }
  - id: d2-04-c3
    type: trace
    char: "大"
    guide: "on"
    why: { id: "**横** sedikit di atas tengah, lalu **撇**, lalu **捺**.", en: "**横** a little above the middle, then **撇**, then **捺**." }
  - id: d2-04-c4
    type: trace
    char: "人"
    guide: "off"
    why: { id: "**撇** dulu dari atas, lalu **捺** dimulai dari tengah **撇**.", en: "**撇** first from the top, then **捺** starting from the middle of the **撇**." }
  - id: d2-04-c5
    type: choice
    prompt: "Dalam **好**, bagian mana yang lebih sempit?"
    options: ["女 di kiri", "子 di kanan", "sama lebar"]
    answer: "女 di kiri"
    why: { id: "**女** dibuat sedikit sempit supaya **子** punya ruang. Dua bagian tetap mengisi satu kotak.", en: "**女** is drawn a little narrow so **子** has room. The two parts still fill one square." }
glossary:
  - { zh: "口", py: "kǒu", id: "mulut", en: "mouth", hsk: "1" }
  - { zh: "中", py: "zhōng", id: "tengah", en: "middle", hsk: "1" }
  - { zh: "大", py: "dà", id: "besar", en: "big", hsk: "1" }
  - { zh: "字", py: "zì", id: "karakter, tulisan", en: "character, written word", hsk: "1" }
extra:
  - { zh: "田字格", reason: "the name of the practice grid, the topic of the lesson" }
next: dasar2-05-radikal-1
---

## concept.id

Kamu menulis karakter di dalam **田字格**: kotak persegi dengan dua garis putus-putus, satu mendatar dan satu tegak, yang bersilang di tengah.

- **Satu karakter, satu kotak.** Karakter sederhana seperti **十** dan karakter rumit seperti **好** sama-sama mengisi satu kotak yang sama besar.
- **Garis tengah adalah penolong.** **竖** pada **十** dan **中** jatuh di garis tegak. **横** pada **十** jatuh di garis mendatar.
- **Jangan menyentuh tepi.** Sisakan sedikit ruang di semua sisi. **口** cukup kecil di tengah kotak.
- **Bentuk tiap karakter berbeda.** **日** tinggi dan ramping, **大** lebar di bawah. Dalam **好**, bagian kiri lebih sempit dari bagian kanan.

Di latihan berikut, kamu menulis sendiri. Jaga urutannya, dan perhatikan garis tengah.

## concept.en

You write characters inside a **田字格**: a square with two dashed lines, one horizontal and one vertical, crossing in the middle.

- **One character, one square.** A simple character like **十** and a complex one like **好** both fill a square of the same size.
- **The centre lines are your helpers.** The **竖** of **十** and **中** falls on the vertical line. The **横** of **十** falls on the horizontal line.
- **Don't touch the edges.** Leave a little room on every side. **口** sits small in the middle of the square.
- **Every character has its own shape.** **日** is tall and narrow, **大** wide at the bottom. In **好**, the left part is narrower than the right.

In the practice that follows, you write by yourself. Keep the order, and watch the centre lines.

## contrast.id

Proporsi bisa mengubah karakter. **日** rì (matahari) tinggi dan ramping. Kalau kamu membuatnya pendek dan lebar, hasilnya mirip **曰** yuē, karakter lain yang jarang dipakai.

Huruf Latin punya tinggi yang berbeda-beda: *l* tinggi, *a* pendek, dan kata panjang memakan tempat lebih banyak. Karakter tidak begitu: setiap karakter, entah dua goresan atau dua belas, menempati kotak yang sama. Karena itu tulisan Mandarin terlihat rapi seperti petak-petak.

## contrast.en

Proportions can change a character. **日** rì (sun) is tall and narrow. Draw it short and wide and it looks like **曰** yuē, a different, rarely used character.

Latin letters vary in height: *l* is tall, *a* is short, and long words take more room. Characters don't: every character, two strokes or twelve, takes the same square. That's why written Chinese looks as neat as a grid.
