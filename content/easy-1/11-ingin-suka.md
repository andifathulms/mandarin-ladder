---
id: easy1-11-ingin-suka
rung: easy-1
order: 11
status: draft
minutes: 8
title: { id: "Ingin dan suka", en: "Wanting and liking", zh: "想 和 喜欢", py: "xiǎng hé xǐhuan" }
summary:
  id: "想 (ingin), 要 (mau) dan 喜欢 (suka) langsung diikuti kata kerja: 我想喝茶. Dua kalimat bisa berdampingan tanpa kata sambung."
  en: "想 (would like), 要 (want) and 喜欢 (like) go straight before a verb: 我想喝茶. Two clauses can sit side by side without a linking word."
introduces: [g1-03, g1-26, g1-39]
spiral: word-order
worked:
  - { zh: "我 [[想]] 喝 茶 。", py: "wǒ [[xiǎng]] hē chá .", id: "Aku ingin minum teh.", en: "I'd like to drink tea." }
  - { zh: "我 [[要]] 一 杯 水 。", py: "wǒ [[yào]] yì bēi shuǐ .", id: "Aku mau segelas air.", en: "I want a glass of water." }
  - { zh: "我 [[喜欢]] 看 电影 。", py: "wǒ [[xǐhuan]] kàn diànyǐng .", id: "Aku suka menonton film.", en: "I like watching films." }
examples:
  - zh: "你 [[想]] 吃 什么 ？"
    py: "nǐ [[xiǎng]] chī shénme ?"
    id: "Kamu ingin makan apa?"
    en: "What would you like to eat?"
  - zh: "他 [[要]] 买 一 个 手机 。"
    py: "tā [[yào]] mǎi yí gè shǒujī ."
    id: "Dia mau membeli ponsel."
    en: "He wants to buy a phone."
    note: { id: "**要** lebih tegas daripada **想**: sudah jadi rencana.", en: "**要** is firmer than **想**: it's already a plan." }
  - zh: "西蒂 [[喜欢]] 喝 牛奶 。"
    py: "Xīdì [[xǐhuan]] hē niúnǎi ."
    id: "Siti suka minum susu."
    en: "Siti likes drinking milk."
  - zh: "你 [[想 不 想]] 喝 水 ？"
    py: "nǐ [[xiǎng bù xiǎng]] hē shuǐ ?"
    id: "Kamu mau minum air atau tidak?"
    en: "Do you want to drink some water?"
  - zh: "我 喜欢 看 电视 ， 弟弟 喜欢 [[打球]] 。"
    py: "wǒ xǐhuan kàn diànshì , dìdi xǐhuan [[dǎqiú]] ."
    id: "Aku suka menonton TV, adikku suka main bola."
    en: "I like watching TV, my younger brother likes playing ball."
    note: { id: "Dua kalimat cukup dipisah koma. Tidak perlu kata seperti *sedangkan*.", en: "A comma is enough between the two clauses. No word like *whereas* is needed." }
  - zh: "我 喜欢 唱歌 ， 丽娜 [[也]] 喜欢 唱歌 。"
    py: "wǒ xǐhuan chànggē , Lìnà [[yě]] xǐhuan chànggē ."
    id: "Aku suka menyanyi, Rina juga suka menyanyi."
    en: "I like singing, and Rina likes singing too."
pair:
  off: { zh: "我 想 茶 。", py: "wǒ xiǎng chá ." }
  natural: { zh: "我 想 [[喝]] 茶 。", py: "wǒ xiǎng [[hē]] chá ." }
tone: { zh: "喜欢", py: "xǐhuan", note: { id: "Nada 3 lalu nada netral: suku kata pertama rendah, **huan** pendek dan ringan, sedikit lebih tinggi.", en: "Tone 3 then the neutral tone: the first syllable low, **huan** short and light, a little higher." } }
hanzi: [想, 要, 喜, 欢, 喝, 茶, 水, 牛, 奶, 电, 影]
words:
  id: "**想** punya dua arti. Dengan kata kerja artinya *ingin*: **我想喝茶**. Dengan orang atau benda artinya *rindu* atau *memikirkan*: **我想妈妈**, aku kangen mama. Jadi **我想茶** terdengar seperti kamu merindukan teh. Untuk meminta benda, pakai **要**: **我要茶**."
  en: "**想** has two meanings. With a verb it means *would like to*: **我想喝茶**. With a person or thing it means *miss* or *think about*: **我想妈妈**, I miss mum. So **我想茶** sounds like you're missing your tea. To ask for a thing, use **要**: **我要茶**."
talk:
  lines:
    - { who: "王 明", zh: "你 想 喝 什么 ？", py: "nǐ xiǎng hē shénme ?", id: "Kamu ingin minum apa?", en: "What would you like to drink?" }
    - { who: "Rina", zh: "我 要 一 杯 茶 。 你 呢 ？", py: "wǒ yào yì bēi chá . nǐ ne ?", id: "Aku mau secangkir teh. Kamu?", en: "I'll have a cup of tea. And you?" }
    - { who: "王 明", zh: "我 不 想 喝 茶 ， 我 想 喝 水 。", py: "wǒ bù xiǎng hē chá , wǒ xiǎng hē shuǐ .", id: "Aku tidak ingin teh, aku ingin minum air.", en: "I don't feel like tea, I'd like water." }
tirukan: { zh: "我 喜欢 喝 茶 ， 也 喜欢 喝 牛奶 。", py: "wǒ xǐhuan hē chá , yě xǐhuan hē niúnǎi .", id: "Aku suka minum teh, juga suka minum susu.", en: "I like drinking tea, and I like milk too." }
check:
  - id: e1-11-c1
    type: gap
    cue: "Aku ingin minum teh."
    prompt: "我 ___ 喝 茶 。"
    options: ["想", "喜欢", "是"]
    answer: "想"
    why: { id: "*Ingin* + kata kerja: **想喝**. **喜欢** berarti *suka*.", en: "*Would like* + verb: **想喝**. **喜欢** means *like*." }
  - id: e1-11-c2
    type: order
    cue: "Siti suka minum susu."
    tiles: ["牛奶", "西蒂", "喝", "喜欢"]
    answer: ["西蒂", "喜欢", "喝", "牛奶"]
    why: { id: "Orang + **喜欢** + kata kerja + benda, seperti bahasa Indonesia.", en: "Person + **喜欢** + verb + object, as in Indonesian." }
  - id: e1-11-c3
    type: fix
    wrong: "我 想 茶 。"
    options: ["我 想 喝 茶 。", "我 茶 想 。"]
    answer: "我 想 喝 茶 。"
    why: { id: "**想** + benda berarti *rindu*. Untuk *ingin minum teh*, tambahkan kata kerjanya: **想喝茶**.", en: "**想** + a thing means *miss*. For *would like some tea*, add the verb: **想喝茶**." }
  - id: e1-11-c4
    type: choice
    show_pinyin: false
    prompt: "Kata mana yang berarti *suka*?"
    options: ["喜欢", "想", "要"]
    answer: "喜欢"
    why: { id: "**喜欢** xǐhuan: suka. **想** ingin, **要** mau.", en: "**喜欢** xǐhuan: like. **想** would like, **要** want." }
  - id: e1-11-c5
    type: listen
    audio: "我 喜欢 看 电视 ， 弟弟 喜欢 打球 。"
    options: ["Aku suka menonton TV, adikku suka main bola.", "Aku dan adikku suka menonton TV.", "Adikku suka menonton TV, aku suka main bola."]
    answer: "Aku suka menonton TV, adikku suka main bola."
    why: { id: "Kalimat pertama tentang **我** dan **看电视**, kalimat kedua tentang **弟弟** dan **打球**.", en: "The first clause is about **我** and **看电视**, the second about **弟弟** and **打球**." }
  - id: e1-11-c6
    type: trace
    char: "水"
    guide: on
    why: { id: "**水** dimulai dari garis tegak berkait di tengah, lalu sisi kiri, lalu sisi kanan.", en: "**水** starts with the hooked vertical in the middle, then the left side, then the right side." }
glossary:
  - { zh: "想", py: "xiǎng", id: "ingin; rindu, memikirkan", en: "would like to; to miss, to think", hsk: "1" }
  - { zh: "要", py: "yào", id: "mau, minta", en: "to want", hsk: "1" }
  - { zh: "喜欢", py: "xǐhuan", id: "suka", en: "to like", hsk: "1" }
  - { zh: "喝", py: "hē", id: "minum", en: "to drink", hsk: "1" }
  - { zh: "吃", py: "chī", id: "makan", en: "to eat", hsk: "1" }
  - { zh: "茶", py: "chá", id: "teh", en: "tea", mw: "杯", hsk: "1" }
  - { zh: "水", py: "shuǐ", id: "air", en: "water", mw: "杯", hsk: "1" }
  - { zh: "牛奶", py: "niúnǎi", id: "susu", en: "milk", mw: "杯", hsk: "1" }
  - { zh: "看", py: "kàn", id: "melihat, menonton", en: "to look, to watch", hsk: "1" }
  - { zh: "电影", py: "diànyǐng", id: "film", en: "film, movie", mw: "个", hsk: "1" }
  - { zh: "电视", py: "diànshì", id: "televisi", en: "television", hsk: "1" }
  - { zh: "打球", py: "dǎqiú", id: "main bola", en: "to play ball", hsk: "1" }
  - { zh: "唱歌", py: "chànggē", id: "menyanyi", en: "to sing", hsk: "1" }
  - { zh: "弟弟", py: "dìdi", id: "adik laki-laki", en: "younger brother", hsk: "1" }
next: easy1-12-belanja
---

## concept.id

Tiga kata untuk keinginan dan kesukaan. Ketiganya berdiri tepat sebelum kata kerja, seperti dalam bahasa Indonesia.

**想** (xiǎng) berarti *ingin*, lembut dan sopan: **我想喝茶**. **要** (yào) berarti *mau*, lebih tegas, sering sudah jadi rencana: **他要买手机**. **要** juga bisa langsung diikuti benda untuk meminta: **我要一杯水**. **喜欢** (xǐhuan) berarti *suka*, untuk benda atau kegiatan: **我喜欢茶**, **我喜欢看电影**.

Untuk *tidak ingin*, pakai **不想**: **我不想喝茶**. Untuk bertanya, ada **吗** atau bentuk **想不想**.

Dua kalimat tentang dua orang bisa berdampingan hanya dengan koma: **我喜欢看电视，弟弟喜欢打球**. Kalau sama, pakai **也**: **丽娜也喜欢唱歌**.

## concept.en

Three words for wanting and liking. All three sit right before the verb, as in Indonesian.

**想** (xiǎng) means *would like to*, soft and polite: **我想喝茶**. **要** (yào) means *want*, firmer, often already a plan: **他要买手机**. **要** can also take a thing directly when you ask for it: **我要一杯水**. **喜欢** (xǐhuan) means *like*, for things or activities: **我喜欢茶**, **我喜欢看电影**.

For *don't want to*, use **不想**: **我不想喝茶**. To ask, there's **吗** or the **想不想** form.

Two clauses about two people can sit side by side with just a comma: **我喜欢看电视，弟弟喜欢打球**. If it's the same, use **也**: **丽娜也喜欢唱歌**.

## contrast.id

Polanya dekat dengan bahasa Indonesia: *aku ingin minum*, **我想喝**. Kata kerjanya tidak berubah.

Batasnya ada pada benda. Dalam bahasa Indonesia *aku mau teh* dan *aku ingin teh* sama-sama wajar. Dalam Mandarin, **我要茶** wajar, tapi **我想茶** berarti *aku kangen teh*. Dengan **想**, sebut kata kerjanya: **我想喝茶**.

Hati-hati juga dengan **不要**: sering berarti *jangan*, bukan *tidak mau*. Untuk *aku tidak mau minum*, pakai **我不想喝**.

## contrast.en

The pattern is close to Indonesian: *aku ingin minum*, **我想喝**. The verb doesn't change.

The limit is with things. In Indonesian *aku mau teh* and *aku ingin teh* are both fine. In Mandarin **我要茶** is fine, but **我想茶** means *I miss tea*. With **想**, say the verb: **我想喝茶**.

Watch **不要** too: it often means *don't*, not *I don't want*. For *I don't want to drink*, use **我不想喝**.
