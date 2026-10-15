---
id: easy1-06-punya
rung: easy-1
order: 6
status: draft
minutes: 8
title: { id: "Punya dan ada", en: "Have and there is", zh: "你 有 微信 吗 ？", py: "nǐ yǒu Wēixìn ma ?" }
summary:
  id: "有 berarti punya dan juga ada. Bentuk negatifnya selalu 没有, tidak pernah 不有."
  en: "有 means to have and also there is. Its negative is always 没有, never 不有."
introduces: [g1-37]
spiral: negation
worked:
  - { zh: "我 [[有]] 一 个 哥哥 。", py: "wǒ [[yǒu]] yí gè gēge .", id: "Aku punya seorang kakak laki-laki.", en: "I have an older brother." }
  - { zh: "我 [[没有]] 姐姐 。", py: "wǒ [[méiyǒu]] jiějie .", id: "Aku tidak punya kakak perempuan.", en: "I don't have an older sister." }
  - { zh: "这儿 [[有]] 一 个 商店 。", py: "zhèr [[yǒu]] yí gè shāngdiàn .", id: "Di sini ada sebuah toko.", en: "There's a shop here." }
  - { zh: "你 有 微信 [[吗]] ？", py: "nǐ yǒu Wēixìn [[ma]] ?", id: "Kamu punya WeChat?", en: "Do you have WeChat?" }
examples:
  - zh: "我 [[有]] 三 个 中国 朋友 。"
    py: "wǒ [[yǒu]] sān gè Zhōngguó péngyou ."
    id: "Aku punya tiga teman orang Tiongkok."
    en: "I have three Chinese friends."
    note: { id: "Sesudah angka, jangan lupa penggolong: **三个朋友**.", en: "After a number, don't forget the measure word: **三个朋友**." }
  - zh: "我 [[没有]] 哥哥 。"
    py: "wǒ [[méiyǒu]] gēge ."
    id: "Aku tidak punya kakak laki-laki."
    en: "I don't have an older brother."
    note: { id: "**有** diingkari dengan **没** (méi), bukan **不**.", en: "**有** is negated with **没** (méi), not **不**." }
  - zh: "你 [[有]] 微信 吗 ？"
    py: "nǐ [[yǒu]] Wēixìn ma ?"
    id: "Kamu punya WeChat?"
    en: "Do you have WeChat?"
    note: { id: "Jawabannya cukup **有** (punya) atau **没有** (tidak punya).", en: "The answer can be just **有** (yes) or **没有** (no)." }
  - zh: "我 家 [[有]] 四 口 人 。"
    py: "wǒ jiā [[yǒu]] sì kǒu rén ."
    id: "Keluargaku empat orang."
    en: "There are four people in my family."
    note: { id: "**口** (mulut) adalah penggolong untuk anggota keluarga, seperti *jiwa*.", en: "**口** (mouth) is the measure word for family members." }
  - zh: "这儿 [[有]] 一 个 商店 。"
    py: "zhèr [[yǒu]] yí gè shāngdiàn ."
    id: "Di sini ada sebuah toko."
    en: "There's a shop here."
    note: { id: "Tempat dulu, lalu **有**, lalu bendanya.", en: "The place first, then **有**, then the thing." }
  - zh: "我 今天 [[没有]] 时间 。"
    py: "wǒ jīntiān [[méiyǒu]] shíjiān ."
    id: "Hari ini aku tidak punya waktu."
    en: "I don't have time today."
pair:
  off: { zh: "我 不 有 哥哥 。", py: "wǒ bù yǒu gēge ." }
  natural: { zh: "我 [[没有]] 哥哥 。", py: "wǒ [[méiyǒu]] gēge ." }
tone: { zh: "没有", py: "méiyǒu", note: { id: "Nada 2 lalu nada 3: naik, lalu rendah. Dalam bicara cepat, **有** sering diucapkan ringan.", en: "Tone 2 then tone 3: rising, then low. In fast speech, **有** is often said lightly." } }
hanzi: [有, 没, 口, 家, 商, 店, 朋, 友]
words:
  id: "*Tidak* biasanya **不**, tapi tidak di depan **有**. *Tidak punya* dan *tidak ada* selalu **没有**. **不有** tidak ada dalam Mandarin."
  en: "*Not* is usually **不**, but not before **有**. *Don't have* and *there isn't* are always **没有**. **不有** doesn't exist in Mandarin."
talk:
  lines:
    - { who: "张 丽", zh: "你 家 有 几 口 人 ？", py: "nǐ jiā yǒu jǐ kǒu rén ?", id: "Keluargamu berapa orang?", en: "How many people are in your family?" }
    - { who: "Siti", zh: "我 家 有 五 口 人 。 我 有 两 个 姐姐 ， 没有 哥哥 。", py: "wǒ jiā yǒu wǔ kǒu rén . wǒ yǒu liǎng gè jiějie , méiyǒu gēge .", id: "Keluargaku lima orang. Aku punya dua kakak perempuan, tidak punya kakak laki-laki.", en: "There are five of us. I have two older sisters and no older brother." }
    - { who: "张 丽", zh: "你 有 微信 吗 ？", py: "nǐ yǒu Wēixìn ma ?", id: "Kamu punya WeChat?", en: "Do you have WeChat?" }
    - { who: "Siti", zh: "有 。", py: "yǒu .", id: "Punya.", en: "I do." }
tirukan: { zh: "我 没有 哥哥 ， 我 有 一 个 姐姐 。", py: "wǒ méiyǒu gēge , wǒ yǒu yí gè jiějie .", id: "Aku tidak punya kakak laki-laki, aku punya seorang kakak perempuan.", en: "I don't have an older brother, I have an older sister." }
check:
  - id: e1-06-c1
    type: gap
    cue: "Aku tidak punya adik perempuan."
    prompt: "我 ___ 妹妹 。"
    options: ["没有", "不", "是"]
    answer: "没有"
    why: { id: "*Tidak punya* = **没有**. **不** tidak dipakai dengan **有**.", en: "*Don't have* = **没有**. **不** isn't used with **有**." }
  - id: e1-06-c2
    type: fix
    wrong: "我 不 有 手机 。"
    options: ["我 没有 手机 。", "我 有 不 手机 。"]
    answer: "我 没有 手机 。"
    why: { id: "**有** selalu diingkari dengan **没**: **没有**.", en: "**有** is always negated with **没**: **没有**." }
  - id: e1-06-c3
    type: choice
    show_pinyin: false
    cue: "Apa artinya?"
    prompt: "你 家 有 几 口 人 ？"
    options: ["Keluargamu berapa orang?", "Rumahmu di mana?", "Kamu punya berapa kakak?"]
    answer: "Keluargamu berapa orang?"
    why: { id: "**家** = keluarga, **几口人** = berapa jiwa.", en: "**家** = family, **几口人** = how many people." }
  - id: e1-06-c4
    type: order
    cue: "Di sini ada sebuah toko."
    tiles: ["商店", "这儿", "一", "有", "个"]
    answer: ["这儿", "有", "一", "个", "商店"]
    why: { id: "Tempat + **有** + benda: **这儿有一个商店**.", en: "Place + **有** + thing: **这儿有一个商店**." }
  - id: e1-06-c5
    type: listen
    audio: "我 没有 微信 。"
    options: ["Aku tidak punya WeChat.", "Aku punya WeChat.", "Kamu punya WeChat?"]
    answer: "Aku tidak punya WeChat."
    why: { id: "**没有** = tidak punya.", en: "**没有** = don't have." }
  - id: e1-06-c6
    type: trace
    char: "有"
    guide: on
    why: { id: "**有** dimulai dengan garis datar, lalu sapuan ke kiri, baru **月** di bawahnya.", en: "**有** starts with the horizontal, then the left-falling stroke, then **月** underneath." }
glossary:
  - { zh: "有", py: "yǒu", id: "punya; ada", en: "to have; there is", hsk: "1" }
  - { zh: "没有", py: "méiyǒu", id: "tidak punya; tidak ada", en: "not have; there isn't", hsk: "1" }
  - { zh: "口", py: "kǒu", id: "mulut; (penggolong anggota keluarga)", en: "mouth; (measure word for family members)", hsk: "1" }
  - { zh: "家", py: "jiā", id: "rumah, keluarga", en: "home, family", mw: "个", hsk: "1" }
  - { zh: "朋友", py: "péngyou", id: "teman", en: "friend", mw: "个", hsk: "1" }
  - { zh: "商店", py: "shāngdiàn", id: "toko", en: "shop", mw: "个", hsk: "1" }
  - { zh: "这儿", py: "zhèr", id: "di sini", en: "here", hsk: "1" }
  - { zh: "时间", py: "shíjiān", id: "waktu", en: "time", hsk: "1" }
  - { zh: "今天", py: "jīntiān", id: "hari ini", en: "today", hsk: "1" }
  - { zh: "微信", py: "Wēixìn", id: "WeChat", en: "WeChat" }
next: easy1-07-sifat
---

## concept.id

**有** (yǒu) punya dua arti, dan keduanya sering dipakai. Arti pertama: *punya*. **我有一个哥哥**, aku punya seorang kakak laki-laki. Arti kedua: *ada*. **这儿有一个商店**, di sini ada sebuah toko. Untuk arti *ada*, tempatnya di depan **有**.

Bentuk negatifnya selalu **没有** (méiyǒu): **我没有哥哥**, **这儿没有商店**. Bukan **不有**. Ini satu-satunya kata kerja yang tidak pernah memakai **不**.

Untuk bertanya, tambahkan **吗**: **你有微信吗？** Jawab dengan **有** atau **没有**.

## concept.en

**有** (yǒu) has two meanings, and both are common. The first: *to have*. **我有一个哥哥**, I have an older brother. The second: *there is*. **这儿有一个商店**, there's a shop here. For *there is*, the place goes before **有**.

The negative is always **没有** (méiyǒu): **我没有哥哥**, **这儿没有商店**. Never **不有**. It's the one verb that never takes **不**.

To ask, add **吗**: **你有微信吗？** Answer with **有** or **没有**.

## contrast.id

Kabar baik: dalam bahasa Indonesia sehari-hari, *ada* juga dipakai untuk *punya*: *Kamu ada WeChat?* Mandarin persis begitu. Satu kata, **有**, untuk keduanya.

Batasnya ada di kata *tidak*. Kita berkata *tidak punya* dan *tidak ada*, memakai *tidak* yang sama dengan *tidak mau*. Mandarin memisahkannya: **不** untuk kebanyakan kata kerja, tapi **没** untuk **有**. Telinga kita ingin **不有**. Latih **没有** sampai terasa wajar.

## contrast.en

Good news: in everyday Indonesian, *ada* is also used for *to have*: *Kamu ada WeChat?* Mandarin is just like that. One word, **有**, for both.

The limit is the word *tidak* (not). Indonesian says *tidak punya* and *tidak ada*, with the same *tidak* as in *tidak mau*. Mandarin splits them: **不** for most verbs, but **没** for **有**. Our ears want **不有**. Practise **没有** until it feels normal.
