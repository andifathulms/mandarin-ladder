---
id: easy1-18-di-kafe
rung: easy-1
order: 18
status: draft
minutes: 10
title: { id: "Di kafe", en: "At the café", zh: "一 杯 咖啡", py: "yì bēi kāfēi" }
summary:
  id: "Satu percakapan utuh di kafe. 请 untuk meminta dengan sopan, 别 untuk *jangan*, 还是 untuk memilih, dan jumlah selalu sebelum bendanya: 一杯咖啡."
  en: "A whole conversation at a café. 请 to ask politely, 别 for *don't*, 还是 to choose, and the amount always before the noun: 一杯咖啡."
introduces: [g1-34, g1-47]
spiral: questions
worked:
  - { zh: "你 好 ， [[请 坐]] 。", py: "nǐ hǎo , [[qǐng zuò]] .", id: "Halo, silakan duduk.", en: "Hello, please have a seat." }
  - { zh: "你 要 咖啡 [[还是]] 茶 ？", py: "nǐ yào kāfēi [[háishi]] chá ?", id: "Kamu mau kopi atau teh?", en: "Would you like coffee or tea?" }
  - { zh: "我 要 [[一 杯]] 咖啡 。", py: "wǒ yào [[yì bēi]] kāfēi .", id: "Aku mau secangkir kopi.", en: "A coffee, please." }
  - { zh: "[[等 一下儿]] 。", py: "[[děng yíxiàr]] .", id: "Tunggu sebentar.", en: "Just a moment." }
examples:
  - zh: "[[请]] 给 我 一 杯 牛奶 。"
    py: "[[qǐng]] gěi wǒ yì bēi niúnǎi ."
    id: "Tolong beri aku segelas susu."
    en: "A glass of milk, please."
    note: { id: "**请** di depan membuat permintaan jadi sopan, seperti *tolong* atau *silakan*.", en: "**请** in front makes a request polite, like *please*." }
  - zh: "你 要 大 杯 [[还是]] 小 杯 ？"
    py: "nǐ yào dà bēi [[háishi]] xiǎo bēi ?"
    id: "Kamu mau gelas besar atau kecil?"
    en: "Large or small?"
  - zh: "你 [[等 一下儿]] 。"
    py: "nǐ [[děng yíxiàr]] ."
    id: "Tunggu sebentar, ya."
    en: "Wait a moment."
    note: { id: "**一下儿** sesudah kata kerja melunakkan perintah: *sebentar saja*.", en: "**一下儿** after a verb softens a request: *just a moment*." }
  - zh: "咖啡 很 热 ， [[别]] 马上 喝 。"
    py: "kāfēi hěn rè , [[bié]] mǎshàng hē ."
    id: "Kopinya panas, jangan langsung diminum."
    en: "The coffee's hot, don't drink it straight away."
  - zh: "我 [[用]] 微信 ， 行 吗 ？"
    py: "wǒ [[yòng]] Wēixìn , xíng ma ?"
    id: "Aku bayar pakai WeChat, bisa?"
    en: "Can I pay with WeChat?"
  - zh: "[[请问]] ， 洗手间 在 哪儿 ？"
    py: "[[qǐngwèn]] , xǐshǒujiān zài nǎr ?"
    id: "Permisi, toiletnya di mana?"
    en: "Excuse me, where's the toilet?"
pair:
  off: { zh: "我 要 咖啡 一 杯 。", py: "wǒ yào kāfēi yì bēi ." }
  natural: { zh: "我 要 [[一 杯]] 咖啡 。", py: "wǒ yào [[yì bēi]] kāfēi ." }
tone: { zh: "咖啡", py: "kāfēi", note: { id: "Dua nada 1: tinggi dan datar dua kali. Jaga nadanya tetap tinggi sampai akhir, jangan turun di suku kata kedua.", en: "Two tone 1s: high and level twice. Keep it high to the end; don't let the second syllable fall." } }
hanzi: [请, 给, 用, 等, 别, 洗, 间, 行]
words:
  id: "Di warung kita bilang *kopi satu, teh dua*: bendanya dulu, jumlahnya belakangan. Mandarin selalu jumlah dulu: **一杯咖啡**, **两杯茶**. Kamu juga tahu *bakpao* dari Hokkien; dalam Mandarin bakpao pada umumnya **包子** bāozi."
  en: "At an Indonesian stall you say *kopi satu, teh dua*: the thing first, the amount after. Mandarin always puts the amount first: **一杯咖啡**, **两杯茶**. You also know *bakpao* from Hokkien; in Mandarin buns in general are **包子** bāozi."
hokkien: [bakpao]
talk:
  lines:
    - { who: "Pelayan", zh: "你 好 ， 请 坐 。 你 要 什么 ？", py: "nǐ hǎo , qǐng zuò . nǐ yào shénme ?", id: "Halo, silakan duduk. Mau pesan apa?", en: "Hello, have a seat. What would you like?" }
    - { who: "Rina", zh: "我 要 一 杯 咖啡 。 有 包子 吗 ？", py: "wǒ yào yì bēi kāfēi . yǒu bāozi ma ?", id: "Aku mau secangkir kopi. Ada bakpao?", en: "A coffee, please. Do you have buns?" }
    - { who: "Pelayan", zh: "有 。 你 要 几 个 ？", py: "yǒu . nǐ yào jǐ gè ?", id: "Ada. Mau berapa?", en: "We do. How many?" }
    - { who: "Rina", zh: "两 个 ， 谢谢 。", py: "liǎng gè , xièxie .", id: "Dua, terima kasih.", en: "Two, thanks." }
tirukan: { zh: "请 给 我 一 杯 咖啡 ， 谢谢 。", py: "qǐng gěi wǒ yì bēi kāfēi , xièxie .", id: "Tolong secangkir kopi, terima kasih.", en: "A coffee, please. Thank you." }
check:
  - id: e1-18-c1
    type: gap
    cue: "Kamu mau kopi atau teh?"
    prompt: "你 要 咖啡 ___ 茶 ？"
    options: ["还是", "和", "也"]
    answer: "还是"
    why: { id: "Pertanyaan pilihan memakai **还是**. **和** berarti *dan*.", en: "An either-or question uses **还是**. **和** means *and*." }
  - id: e1-18-c2
    type: fix
    wrong: "我 要 咖啡 一 杯 。"
    options: ["我 要 一 杯 咖啡 。", "我 一 杯 要 咖啡 。"]
    answer: "我 要 一 杯 咖啡 。"
    why: { id: "Bukan *kopi satu*: jumlah dan penggolong selalu sebelum benda, **一杯咖啡**.", en: "Not *coffee one*: the number and measure word always come before the noun, **一杯咖啡**." }
  - id: e1-18-c3
    type: order
    cue: "Tolong beri aku segelas susu."
    tiles: ["给", "请", "牛奶", "我", "一", "杯"]
    answer: ["请", "给", "我", "一", "杯", "牛奶"]
    why: { id: "**请** di depan, lalu **给我**, lalu **一杯牛奶**.", en: "**请** first, then **给我**, then **一杯牛奶**." }
  - id: e1-18-c4
    type: choice
    show_pinyin: false
    prompt: "Kata mana yang berarti *jangan*?"
    options: ["别", "不", "没"]
    answer: "别"
    why: { id: "**别** bié: jangan. **别马上喝**, jangan langsung diminum.", en: "**别** bié: don't. **别马上喝**, don't drink it straight away." }
  - id: e1-18-c5
    type: listen
    audio: "请问 ， 洗手间 在 哪儿 ？"
    options: ["Permisi, toiletnya di mana?", "Permisi, kafenya di mana?", "Boleh bayar pakai WeChat?"]
    answer: "Permisi, toiletnya di mana?"
    why: { id: "**请问** permisi (boleh bertanya), **洗手间** toilet, **在哪儿** di mana.", en: "**请问** excuse me, **洗手间** toilet, **在哪儿** where." }
  - id: e1-18-c6
    type: trace
    char: "请"
    guide: on
    why: { id: "**请** = **讠** (kata-kata) di kiri, **青** di kanan. Tulis **讠** dulu.", en: "**请** = **讠** (speech) on the left, **青** on the right. Write **讠** first." }
glossary:
  - { zh: "咖啡", py: "kāfēi", id: "kopi", en: "coffee", mw: "杯", hsk: "3" }
  - { zh: "请", py: "qǐng", id: "silakan, tolong", en: "please", hsk: "1" }
  - { zh: "请问", py: "qǐngwèn", id: "permisi (mau bertanya)", en: "excuse me (may I ask)", hsk: "1" }
  - { zh: "给", py: "gěi", id: "memberi; untuk", en: "to give; for", hsk: "1" }
  - { zh: "等", py: "děng", id: "menunggu", en: "to wait", hsk: "1" }
  - { zh: "一下儿", py: "yíxiàr", id: "sebentar", en: "a moment", hsk: "1" }
  - { zh: "别", py: "bié", id: "jangan", en: "don't", hsk: "1" }
  - { zh: "用", py: "yòng", id: "memakai", en: "to use", hsk: "1" }
  - { zh: "行", py: "xíng", id: "boleh, bisa", en: "OK, fine", hsk: "1" }
  - { zh: "大", py: "dà", id: "besar", en: "big", hsk: "1" }
  - { zh: "小", py: "xiǎo", id: "kecil", en: "small", hsk: "1" }
  - { zh: "洗手间", py: "xǐshǒujiān", id: "toilet", en: "toilet", mw: "个", hsk: "1" }
  - { zh: "包子", py: "bāozi", id: "bakpao", en: "steamed bun", mw: "个", hsk: "1" }
  - { zh: "牛奶", py: "niúnǎi", id: "susu", en: "milk", mw: "杯", hsk: "1" }
  - { zh: "谢谢", py: "xièxie", id: "terima kasih", en: "thank you", hsk: "1" }
extra:
  - { zh: "咖啡", reason: "coffee, the word on every café menu; PRD §4.3 Easy 1 lesson 18 is set in a café (HSK 3)" }
---

## concept.id

Pelajaran ini merangkum semuanya dalam satu kunjungan ke kafe.

**Meminta dengan sopan.** **请** (qǐng) di depan kata kerja: **请坐** (silakan duduk), **请给我一杯牛奶** (tolong beri aku segelas susu). **请问** membuka pertanyaan: *permisi, boleh tanya*.

**Melarang dengan lembut.** **别** (bié) berarti *jangan*: **别马上喝**. Untuk melunakkan permintaan, tambah **一下儿** sesudah kata kerja: **等一下儿**, tunggu sebentar.

**Memilih.** **还是** di antara dua pilihan: **大杯还是小杯？**

**Jumlah.** Angka + penggolong + benda, selalu dalam urutan ini: **一杯咖啡**, **两个包子**.

## concept.en

This lesson pulls everything together in one café visit.

**Asking politely.** **请** (qǐng) before the verb: **请坐** (have a seat), **请给我一杯牛奶** (a glass of milk, please). **请问** opens a question: *excuse me, may I ask*.

**Saying don't, gently.** **别** (bié) means *don't*: **别马上喝**. To soften a request, add **一下儿** after the verb: **等一下儿**, just a moment.

**Choosing.** **还是** between two choices: **大杯还是小杯？**

**Amounts.** Number + measure word + noun, always in this order: **一杯咖啡**, **两个包子**.

## contrast.id

**请** mirip *silakan* dan *tolong*: keduanya di depan. Bedanya, Mandarin memakai satu kata untuk dua-duanya. **请坐** (*silakan duduk*) dan **请给我** (*tolong beri aku*) sama-sama **请**.

Di warung kita memesan *kopi satu*, *teh manis dua*. Urutan itu tidak bisa dipakai dalam Mandarin: **咖啡一杯** hanya muncul di daftar atau menu, bukan dalam kalimat. Saat berbicara, jumlahnya selalu di depan: **我要一杯咖啡**.

## contrast.en

**请** is like *silakan* and *tolong*: both come first. The difference is that Mandarin uses one word for both. **请坐** (*have a seat*) and **请给我** (*please give me*) are both **请**.

At an Indonesian stall you order *kopi satu*, *teh manis dua*. That order doesn't work in Mandarin: **咖啡一杯** appears only in lists or menus, not in sentences. When you speak, the amount always comes first: **我要一杯咖啡**.
