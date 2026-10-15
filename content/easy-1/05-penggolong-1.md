---
id: easy1-05-penggolong-1
rung: easy-1
order: 5
status: draft
minutes: 9
title: { id: "Kata penggolong (1)", en: "Measure words (1)", zh: "一 本 书", py: "yì běn shū" }
summary:
  id: "Di antara angka dan benda selalu ada penggolong: 一个人, 一本书, 一只猫. Mirip seorang, sebuah, seekor, tapi tidak pernah boleh dilewati."
  en: "Between a number and a noun there is always a measure word: 一个人, 一本书, 一只猫. Like Indonesian seorang, sebuah, seekor, but never left out."
introduces: [g1-08]
spiral: measure-words
visual: { id: measure-words, props: { initial: book } }
examples:
  - zh: "这 是 一 [[本]] 书 。"
    py: "zhè shì yì [[běn]] shū ."
    id: "Ini sebuah buku."
    en: "This is a book."
    note: { id: "**本** untuk buku dan benda berjilid, seperti **本子** (buku tulis).", en: "**本** is for books and bound things, like **本子** (a notebook)." }
  - zh: "他 是 一 [[个]] 老师 。"
    py: "tā shì yí [[gè]] lǎoshī ."
    id: "Dia seorang guru."
    en: "He's a teacher."
    note: { id: "**个** penggolong paling umum, untuk orang dan banyak benda.", en: "**个** is the most general measure word, for people and many things." }
  - zh: "那 是 一 [[只]] 猫 。"
    py: "nà shì yì [[zhī]] māo ."
    id: "Itu seekor kucing."
    en: "That's a cat."
    note: { id: "**只** untuk banyak hewan, seperti *seekor*.", en: "**只** is for many animals, like *seekor*." }
  - zh: "这 [[两]] 本 书 都 是 我 的 。"
    py: "zhè [[liǎng]] běn shū dōu shì wǒ de ."
    id: "Dua buku ini punyaku."
    en: "These two books are both mine."
    note: { id: "Dua di depan penggolong adalah **两** liǎng, bukan **二**: **两本书**, **两个人**.", en: "Two before a measure word is **两** liǎng, not **二**: **两本书**, **两个人**." }
  - zh: "这 [[个]] 手机 是 谁 的 ？"
    py: "zhè [[ge]] shǒujī shì shéi de ?"
    id: "HP ini punya siapa?"
    en: "Whose phone is this?"
    note: { id: "**这** dan **那** juga memakai penggolong: **这个**, **那本**. **个** di sini sering diucapkan ringan.", en: "**这** and **那** take a measure word too: **这个**, **那本**. Here **个** is often said lightly." }
pair:
  off: { zh: "这 是 一 书 。", py: "zhè shì yī shū ." }
  natural: { zh: "这 是 一 [[本]] 书 。", py: "zhè shì yì [[běn]] shū ." }
tone: { zh: "一 个", py: "yí gè", note: { id: "**一** berubah nada. Sebelum nada 4 (**个** gè) menjadi **yí**. Sebelum nada 1, 2, 3 (**本** běn, **只** zhī) menjadi **yì**. Saat menghitung, tetap **yī**.", en: "**一** changes tone. Before tone 4 (**个** gè) it becomes **yí**. Before tones 1, 2, 3 (**本** běn, **只** zhī) it becomes **yì**. When counting, it stays **yī**." } }
hanzi: [个, 本, 两, 书, 子, 手, 机]
words:
  id: "Bahasa Indonesia juga punya penggolong: *seorang*, *sebuah*, *seekor*, *selembar*. Jadi idenya sudah kamu kenal. Bedanya, kita sering melewatinya (*dua buku*, *tiga kucing*). Mandarin tidak: angka atau **这**/**那** di depan benda selalu butuh penggolong, dan jumlah penggolongnya jauh lebih banyak."
  en: "Indonesian has measure words too: *seorang*, *sebuah*, *seekor*, *selembar*. So you already know the idea. The difference: Indonesian often skips them (*dua buku*, *tiga kucing*). Mandarin doesn't: a number or **这**/**那** before a noun always needs one, and there are many more of them."
talk:
  lines:
    - { who: "李 华", zh: "这 是 谁 的 书 ？", py: "zhè shì shéi de shū ?", id: "Ini buku siapa?", en: "Whose book is this?" }
    - { who: "Andi", zh: "这 本 书 是 我 的 。 那 两 本 是 王 明 的 。", py: "zhè běn shū shì wǒ de . nà liǎng běn shì Wáng Míng de .", id: "Buku ini punyaku. Dua yang itu punya Wang Ming.", en: "This book is mine. Those two are Wang Ming's." }
    - { who: "李 华", zh: "那 只 猫 也 是 你 的 吗 ？", py: "nà zhī māo yě shì nǐ de ma ?", id: "Kucing itu juga punyamu?", en: "Is that cat yours too?" }
    - { who: "Andi", zh: "是 ， 那 是 我 的 猫 。", py: "shì , nà shì wǒ de māo .", id: "Ya, itu kucingku.", en: "Yes, that's my cat." }
tirukan: { zh: "一 个 人 ， 一 本 书 ， 一 只 猫 。", py: "yí gè rén , yì běn shū , yì zhī māo .", id: "seorang manusia, sebuah buku, seekor kucing", en: "a person, a book, a cat" }
check:
  - id: e1-05-c1
    type: gap
    cue: "sebuah buku"
    prompt: "一 ___ 书"
    options: ["本", "个", "只"]
    answer: "本"
    why: { id: "Buku memakai **本**.", en: "Books take **本**." }
  - id: e1-05-c2
    type: gap
    cue: "seekor kucing"
    prompt: "一 ___ 猫"
    options: ["只", "本", "个"]
    answer: "只"
    why: { id: "Kucing dan banyak hewan lain memakai **只**, seperti *seekor*.", en: "Cats and many other animals take **只**, like *seekor*." }
  - id: e1-05-c3
    type: fix
    wrong: "这 是 二 本 书 。"
    options: ["这 是 两 本 书 。", "这 是 二 书 。"]
    answer: "这 是 两 本 书 。"
    why: { id: "Dua di depan penggolong adalah **两**. Penggolongnya tetap harus ada.", en: "Two before a measure word is **两**. The measure word must still be there." }
  - id: e1-05-c4
    type: order
    cue: "Cangkir ini punya siapa?"
    tiles: ["杯子", "这", "谁", "个", "是", "的"]
    answer: ["这", "个", "杯子", "是", "谁", "的"]
    why: { id: "**这** + penggolong + benda: **这个杯子**.", en: "**这** + measure word + noun: **这个杯子**." }
  - id: e1-05-c5
    type: listen
    audio: "这 是 三 本 书 。"
    options: ["Ini tiga buku.", "Ini tiga orang.", "Ini sebuah buku."]
    answer: "Ini tiga buku."
    why: { id: "**三本书**: tiga + **本** + buku.", en: "**三本书**: three + **本** + book." }
  - id: e1-05-c6
    type: trace
    char: "本"
    guide: on
    why: { id: "**本** = **木** (pohon) dengan satu garis pendek di bawah: akarnya. Garis itu ditulis terakhir.", en: "**本** = **木** (tree) with a short line at the bottom: its root. That line is written last." }
glossary:
  - { zh: "个", py: "gè", id: "(penggolong umum)", en: "(general measure word)", hsk: "1" }
  - { zh: "本", py: "běn", id: "(penggolong buku)", en: "(measure word for books)", hsk: "1" }
  - { zh: "只", py: "zhī", id: "(penggolong hewan) seekor", en: "(measure word for animals)" }
  - { zh: "两", py: "liǎng", id: "dua (sebelum penggolong)", en: "two (before a measure word)", hsk: "1" }
  - { zh: "书", py: "shū", id: "buku", en: "book", mw: "本", hsk: "1" }
  - { zh: "本子", py: "běnzi", id: "buku tulis", en: "notebook", mw: "本", hsk: "1" }
  - { zh: "猫", py: "māo", id: "kucing", en: "cat", mw: "只" }
  - { zh: "杯子", py: "bēizi", id: "cangkir, gelas", en: "cup, glass", mw: "个", hsk: "1" }
  - { zh: "手机", py: "shǒujī", id: "HP, ponsel", en: "mobile phone", mw: "个", hsk: "1" }
  - { zh: "一", py: "yī", id: "satu", en: "one", hsk: "1" }
extra:
  - { zh: "只", reason: "measure word for animals (seekor), PRD Easy 1 topic 5; HSK 2–3" }
  - { zh: "猫", reason: "the everyday animal to show 只 with; not on the HSK 1 list" }
next: easy1-06-punya
---

## concept.id

Dalam Mandarin, angka tidak langsung bertemu benda. Di antaranya selalu ada kata penggolong: angka + penggolong + benda.

**一个人** (seorang), **一本书** (sebuah buku), **一只猫** (seekor kucing). **个** (gè) paling umum, untuk orang dan banyak benda. **本** (běn) untuk buku. **只** (zhī) untuk banyak hewan.

Penggolong juga muncul sesudah **这** dan **那**: **这个手机** (HP ini), **那本书** (buku itu).

Untuk *dua* di depan penggolong, pakai **两** (liǎng), bukan **二**: **两个人**, **两本书**. **二** tetap dipakai saat menghitung dan di dalam angka (**十二**, **二十**).

## concept.en

In Mandarin, a number never meets a noun directly. There's always a measure word between them: number + measure word + noun.

**一个人** (a person), **一本书** (a book), **一只猫** (a cat). **个** (gè) is the most general, for people and many things. **本** (běn) is for books. **只** (zhī) is for many animals.

Measure words also come after **这** and **那**: **这个手机** (this phone), **那本书** (that book).

For *two* before a measure word, use **两** (liǎng), not **二**: **两个人**, **两本书**. **二** is still used for counting and inside numbers (**十二**, **二十**).

## contrast.id

Ini salah satu bagian Mandarin yang paling akrab bagi kita. *Seorang guru*, *sebuah buku*, *seekor kucing*: bahasa Indonesia juga punya penggolong, dan maknanya mirip.

Tapi ada dua batas yang jujur. Pertama, kita boleh berkata *dua buku* tanpa penggolong. Dalam Mandarin **两书** salah. Penggolong wajib. Kedua, Mandarin punya jauh lebih banyak penggolong, dan tiap benda punya pasangannya sendiri. Kalau ragu, **个** sering masih bisa dipakai, tapi tidak selalu.

## contrast.en

This is one of the parts of Mandarin that feels most familiar. *Seorang guru*, *sebuah buku*, *seekor kucing*: Indonesian has measure words too, with similar meanings.

But there are two honest limits. First, Indonesian can say *dua buku* without one. In Mandarin **两书** is wrong. The measure word is required. Second, Mandarin has many more measure words, and each noun has its own partner. When unsure, **个** often still works, but not always.
