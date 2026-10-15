---
id: easy1-10-letak
rung: easy-1
order: 10
status: draft
minutes: 8
title: { id: "Di mana bendanya?", en: "Where things are", zh: "在 哪儿 ？", py: "zài nǎr ?" }
summary:
  id: "Kata letak (上 atas, 下 bawah, 里 dalam) datang sesudah kata bendanya: 在桌子上, di atas meja. Urutannya terbalik dari bahasa Indonesia."
  en: "Place words (上 on, 下 under, 里 in) come after the noun: 在桌子上, on the table. The order is the reverse of Indonesian."
introduces: [g1-01]
spiral: word-order
visual: { id: place-scene-zh, props: { initial: under } }
examples:
  - zh: "书 在 桌子 [[上]] 。"
    py: "shū zài zhuōzi [[shang]] ."
    id: "Bukunya di atas meja."
    en: "The book is on the table."
    note: { id: "Urutannya: **在** (di) + **桌子** (meja) + **上** (atas). Kata letaknya di akhir.", en: "The order: **在** (at) + **桌子** (table) + **上** (on). The place word comes last." }
  - zh: "手机 在 书包 [[里]] 。"
    py: "shǒujī zài shūbāo [[li]] ."
    id: "Ponselnya di dalam tas."
    en: "The phone is in the bag."
  - zh: "球 在 床 [[下]] 。"
    py: "qiú zài chuáng [[xia]] ."
    id: "Bolanya di bawah tempat tidur."
    en: "The ball is under the bed."
  - zh: "老师 在 你 [[后边]] 。"
    py: "lǎoshī zài nǐ [[hòubian]] ."
    id: "Gurunya di belakangmu."
    en: "The teacher is behind you."
    note: { id: "**后边** (belakang) dan **前边** (depan) juga bisa sesudah orang: **你后边**, di belakangmu.", en: "**后边** (behind) and **前边** (in front) can follow a person too: **你后边**, behind you." }
  - zh: "学校 [[旁边]] 有 一 个 商店 。"
    py: "xuéxiào [[pángbiān]] yǒu yí gè shāngdiàn ."
    id: "Di sebelah sekolah ada sebuah toko."
    en: "There's a shop next to the school."
    note: { id: "Tempat + **有** + benda: di tempat itu ada sesuatu. Tidak perlu **在** di depan.", en: "Place + **有** + thing: there is something at that place. No **在** in front." }
pair:
  off: { zh: "书 在 上 桌子 。", py: "shū zài shàng zhuōzi ." }
  natural: { zh: "书 在 桌子 [[上]] 。", py: "shū zài zhuōzi [[shang]] ." }
tone: { zh: "旁边", py: "pángbiān", note: { id: "Nada 2 lalu nada 1: naik, lalu tinggi datar. Jangan turunkan suku kata kedua.", en: "Tone 2 then tone 1: rising, then high and level. Don't let the second syllable drop." } }
hanzi: [桌, 上, 下, 里, 边, 旁, 前, 后, 包, 床]
words:
  id: "**上** dan **下** juga kata kerja: **上车** naik kendaraan, **下车** turun. Sesudah kata benda, keduanya penunjuk letak. Untuk bus dan kereta, Mandarin sering berkata **车上** (di atas kendaraan), padahal kita bilang *di dalam bus*."
  en: "**上** and **下** are also verbs: **上车** get on, **下车** get off. After a noun they mark place. For buses and trains Mandarin often says **车上** (on the vehicle), where Indonesian says *di dalam bus*."
talk:
  lines:
    - { who: "Rina", zh: "我 的 手机 在 哪儿 ？", py: "wǒ de shǒujī zài nǎr ?", id: "Ponselku di mana?", en: "Where's my phone?" }
    - { who: "Budi", zh: "在 桌子 上 。", py: "zài zhuōzi shang .", id: "Di atas meja.", en: "On the table." }
    - { who: "Rina", zh: "桌子 上 没有 。", py: "zhuōzi shang méiyǒu .", id: "Di atas meja tidak ada.", en: "It's not on the table." }
    - { who: "Budi", zh: "你 看 ， 在 书包 里 。", py: "nǐ kàn , zài shūbāo li .", id: "Lihat, di dalam tas.", en: "Look, it's in the bag." }
tirukan: { zh: "书 在 桌子 上 ， 手机 在 书包 里 。", py: "shū zài zhuōzi shang , shǒujī zài shūbāo li .", id: "Bukunya di atas meja, ponselnya di dalam tas.", en: "The book is on the table, the phone is in the bag." }
check:
  - id: e1-10-c1
    type: scene
    prompt: "Di mana bolanya?"
    visual: { id: place-scene-zh, props: { state: under } }
    options: ["球 在 桌子 上 。", "球 在 桌子 下 。", "球 在 桌子 旁边 。"]
    answer: "球 在 桌子 下 。"
    why: { id: "Bolanya di bawah meja: **桌子下**. Kata letak **下** sesudah **桌子**.", en: "The ball is under the table: **桌子下**. The place word **下** follows **桌子**." }
  - id: e1-10-c2
    type: order
    cue: "Ponselnya di dalam tas."
    tiles: ["书包", "手机", "里", "在"]
    answer: ["手机", "在", "书包", "里"]
    why: { id: "Benda + **在** + tempat + kata letak: **手机在书包里**.", en: "Thing + **在** + place + place word: **手机在书包里**." }
  - id: e1-10-c3
    type: fix
    wrong: "书 在 上 桌子 。"
    options: ["书 在 桌子 上 。", "书 上 在 桌子 。"]
    answer: "书 在 桌子 上 。"
    why: { id: "Dalam bahasa Indonesia *di atas meja*; dalam Mandarin **在桌子上**. Kata letak pindah ke belakang.", en: "Indonesian says *di atas meja*; Mandarin says **在桌子上**. The place word moves to the end." }
  - id: e1-10-c4
    type: choice
    show_pinyin: false
    prompt: "Kata mana yang berarti *di sebelah*?"
    options: ["旁边", "后边", "里边"]
    answer: "旁边"
    why: { id: "**旁边** pángbiān: sebelah. **后边** belakang, **里边** dalam.", en: "**旁边** pángbiān: next to. **后边** behind, **里边** inside." }
  - id: e1-10-c5
    type: listen
    audio: "老师 在 你 后边 。"
    options: ["Gurunya di belakangmu.", "Gurunya di depanmu.", "Gurunya di sebelahmu."]
    answer: "Gurunya di belakangmu."
    why: { id: "**后边** hòubian: belakang. Depan adalah **前边** qiánbian.", en: "**后边** hòubian: behind. In front is **前边** qiánbian." }
  - id: e1-10-c6
    type: trace
    char: "上"
    guide: on
    why: { id: "**上** tiga goresan: garis tegak dulu, lalu garis pendek ke kanan, lalu garis datar panjang di bawah.", en: "**上** has three strokes: the vertical first, then the short stroke to the right, then the long horizontal at the bottom." }
glossary:
  - { zh: "桌子", py: "zhuōzi", id: "meja", en: "table", mw: "张", hsk: "1" }
  - { zh: "上", py: "shàng", id: "atas; naik", en: "on, above; to go up", hsk: "1" }
  - { zh: "下", py: "xià", id: "bawah; turun", en: "under, below; to go down", hsk: "1" }
  - { zh: "里", py: "lǐ", id: "dalam", en: "in, inside", hsk: "1" }
  - { zh: "旁边", py: "pángbiān", id: "sebelah, samping", en: "next to, beside", hsk: "1" }
  - { zh: "前边", py: "qiánbian", id: "depan", en: "in front", hsk: "1" }
  - { zh: "后边", py: "hòubian", id: "belakang", en: "behind", hsk: "1" }
  - { zh: "外边", py: "wàibian", id: "luar", en: "outside", hsk: "1" }
  - { zh: "书包", py: "shūbāo", id: "tas sekolah", en: "school bag", mw: "个", hsk: "1" }
  - { zh: "手机", py: "shǒujī", id: "ponsel", en: "mobile phone", mw: "个", hsk: "1" }
  - { zh: "床", py: "chuáng", id: "tempat tidur", en: "bed", mw: "张", hsk: "1" }
  - { zh: "球", py: "qiú", id: "bola", en: "ball", mw: "个", hsk: "1" }
  - { zh: "商店", py: "shāngdiàn", id: "toko", en: "shop", mw: "个", hsk: "1" }
  - { zh: "学校", py: "xuéxiào", id: "sekolah", en: "school", mw: "个", hsk: "1" }
next: easy1-11-ingin-suka
---

## concept.id

Untuk bilang *di mana* sebuah benda, Mandarin memakai **在** (zài, di) lalu tempatnya. Kalau tempatnya benda biasa, seperti meja atau tas, tambahkan kata letak (*kata penunjuk tempat*, 方位词 fāngwèicí) **sesudah** kata bendanya.

**桌子上** artinya *di atas meja*, **书包里** *di dalam tas*, **床下** *di bawah tempat tidur*. Urutannya: benda + **在** + tempat + kata letak: **书在桌子上**.

Kata letak juga punya bentuk dua karakter: **上边**, **下边**, **里边**, **前边**, **后边**, **旁边**. Artinya sama. **旁边** (sebelah) hanya punya bentuk panjang ini.

Tempat bisa juga berdiri di depan kalimat dengan **有**: **学校旁边有一个商店**, di sebelah sekolah ada sebuah toko.

## concept.en

To say where something is, Mandarin uses **在** (zài, at) and then the place. When the place is an ordinary object, like a table or a bag, add a place word (方位词 fāngwèicí) **after** the noun.

**桌子上** means *on the table*, **书包里** *in the bag*, **床下** *under the bed*. The order: thing + **在** + place + place word: **书在桌子上**.

Place words also have two-character forms: **上边**, **下边**, **里边**, **前边**, **后边**, **旁边**. They mean the same. **旁边** (next to) only has this long form.

A place can also open the sentence with **有**: **学校旁边有一个商店**, there's a shop next to the school.

## contrast.id

**在** mirip *di*: keduanya datang sebelum tempat. Tapi bahasa Indonesia menaruh kata letak di depan (*di atas meja*), dan Mandarin di belakang (**在桌子上**). Bayangkan *di meja atasnya*.

Kata letak juga tidak boleh hilang. Untuk benda biasa, **书在桌子** terdengar belum selesai. Hanya nama tempat, seperti **学校** atau **雅加达**, yang boleh berdiri sendiri: **他在学校**.

## contrast.en

**在** is like *di*: both come before the place. But Indonesian puts the place word first (*di atas meja*) and Mandarin puts it last (**在桌子上**). Think *at the table, on top*.

The place word can't go missing either. With an ordinary object, **书在桌子** sounds unfinished. Only place names, like **学校** or **雅加达**, can stand alone: **他在学校**.
