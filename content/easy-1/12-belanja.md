---
id: easy1-12-belanja
rung: easy-1
order: 12
status: draft
minutes: 9
title: { id: "Berapa harganya?", en: "How much is it?", zh: "多少 钱 ？", py: "duōshao qián ?" }
summary:
  id: "多少钱 untuk menanyakan harga. Uang dalam percakapan: 块 dan 毛. Penggolong baru: 件 untuk baju, 张 untuk tiket, 杯 untuk minuman. 还是 untuk *atau* dalam pertanyaan."
  en: "多少钱 asks the price. Money in speech: 块 and 毛. New measure words: 件 for clothes, 张 for tickets, 杯 for drinks. 还是 for *or* in questions."
introduces: [g1-43, g1-19, g1-47]
spiral: measure-words
visual: { id: measure-words, props: { initial: shirt } }
examples:
  - zh: "这 件 衣服 [[多少 钱]] ？"
    py: "zhè jiàn yīfu [[duōshao qián]] ?"
    id: "Baju ini berapa harganya?"
    en: "How much is this top?"
    note: { id: "**这** + penggolong + benda: **这件衣服**, baju ini. Penggolongnya tetap dipakai sesudah **这**.", en: "**这** + measure word + noun: **这件衣服**, this top. The measure word stays after **这**." }
  - zh: "这 件 衣服 [[九十八 块]] 。"
    py: "zhè jiàn yīfu [[jiǔshíbā kuài]] ."
    id: "Baju ini 98 yuan."
    en: "This top is 98 yuan."
  - zh: "一 杯 茶 [[三 块 五]] 。"
    py: "yì bēi chá [[sān kuài wǔ]] ."
    id: "Secangkir teh 3,50 yuan."
    en: "A cup of tea is 3.50 yuan."
    note: { id: "**三块五** = **三块五毛**. Satuan terakhir boleh dilewati. Satu **毛** = sepersepuluh **块**.", en: "**三块五** = **三块五毛**. The last unit can be dropped. One **毛** is a tenth of a **块**." }
  - zh: "我 要 [[两 张]] 车票 。"
    py: "wǒ yào [[liǎng zhāng]] chēpiào ."
    id: "Aku mau dua tiket."
    en: "I'd like two tickets."
  - zh: "你 要 茶 [[还是]] 牛奶 ？"
    py: "nǐ yào chá [[háishi]] niúnǎi ?"
    id: "Kamu mau teh atau susu?"
    en: "Would you like tea or milk?"
  - zh: "丽娜 [[和]] 西蒂 都 买 衣服 。"
    py: "Lìnà [[hé]] Xīdì dōu mǎi yīfu ."
    id: "Rina dan Siti sama-sama membeli baju."
    en: "Rina and Siti are both buying clothes."
pair:
  off: { zh: "我 要 二 张 车票 。", py: "wǒ yào èr zhāng chēpiào ." }
  natural: { zh: "我 要 [[两]] 张 车票 。", py: "wǒ yào [[liǎng]] zhāng chēpiào ." }
tone: { zh: "多少 钱", py: "duōshao qián", note: { id: "**duō** tinggi datar, **shao** ringan tanpa nada, lalu **qián** naik. Sendirian, **少** dibaca **shǎo** (sedikit).", en: "**duō** high and level, **shao** light and toneless, then **qián** rising. On its own, **少** is **shǎo** (few)." } }
hanzi: [钱, 块, 毛, 买, 少, 衣, 服, 贵, 还, 元]
words:
  id: "Kamu sudah tahu *cepek* dan *gopek* dari Hokkien. Dalam Mandarin: **一百** yìbǎi dan **五百** wǔbǎi. Di label harga tertulis **元** yuán; dalam percakapan orang bilang **块** kuài."
  en: "You already know *cepek* and *gopek* from Hokkien. In Mandarin: **一百** yìbǎi and **五百** wǔbǎi. Price tags say **元** yuán; in speech people say **块** kuài."
hokkien: [cepek, gopek]
talk:
  lines:
    - { who: "Andi", zh: "你 好 ， 这 件 衣服 多少 钱 ？", py: "nǐ hǎo , zhè jiàn yīfu duōshao qián ?", id: "Halo, baju ini berapa?", en: "Hello, how much is this top?" }
    - { who: "Penjual", zh: "九十 块 。", py: "jiǔshí kuài .", id: "Sembilan puluh yuan.", en: "Ninety yuan." }
    - { who: "Andi", zh: "九十 块 很 贵 。 这 件 呢 ？", py: "jiǔshí kuài hěn guì . zhè jiàn ne ?", id: "Sembilan puluh yuan mahal. Kalau yang ini?", en: "Ninety is expensive. What about this one?" }
    - { who: "Penjual", zh: "这 件 六十 块 。", py: "zhè jiàn liùshí kuài .", id: "Yang ini enam puluh yuan.", en: "This one is sixty yuan." }
tirukan: { zh: "这 件 衣服 多少 钱 ？", py: "zhè jiàn yīfu duōshao qián ?", id: "Baju ini berapa harganya?", en: "How much is this top?" }
check:
  - id: e1-12-c1
    type: gap
    cue: "Baju ini berapa harganya?"
    prompt: "这 ___ 衣服 多少 钱 ？"
    options: ["件", "本", "杯"]
    answer: "件"
    why: { id: "Baju atasan memakai **件**, seperti *sehelai*. **本** untuk buku, **杯** untuk minuman.", en: "Tops take **件**, like *sehelai*. **本** is for books, **杯** for drinks." }
  - id: e1-12-c2
    type: choice
    prompt: "**三 块 五** itu berapa?"
    options: ["3,50 yuan", "3,05 yuan", "35 yuan"]
    answer: "3,50 yuan"
    why: { id: "**五** sesudah **块** berarti lima **毛**: 0,50. Lengkapnya **三块五毛**.", en: "**五** after **块** means five **毛**: 0.50. In full, **三块五毛**." }
  - id: e1-12-c3
    type: fix
    wrong: "我 要 二 张 车票 。"
    options: ["我 要 两 张 车票 。", "我 要 张 二 车票 。"]
    answer: "我 要 两 张 车票 。"
    why: { id: "Sebelum penggolong, *dua* adalah **两** liǎng, bukan **二** èr.", en: "Before a measure word, *two* is **两** liǎng, not **二** èr." }
  - id: e1-12-c4
    type: order
    cue: "Kamu mau teh atau susu?"
    tiles: ["还是", "你", "牛奶", "要", "茶"]
    answer: ["你", "要", "茶", "还是", "牛奶"]
    why: { id: "Dalam pertanyaan pilihan, *atau* adalah **还是**, di antara dua pilihannya.", en: "In an either-or question, *or* is **还是**, between the two choices." }
  - id: e1-12-c5
    type: listen
    audio: "一 杯 茶 六 块 。"
    options: ["Secangkir teh enam yuan.", "Enam cangkir teh.", "Secangkir teh sepuluh yuan."]
    answer: "Secangkir teh enam yuan."
    why: { id: "**一杯茶**: secangkir teh. **六块**: enam yuan.", en: "**一杯茶**: a cup of tea. **六块**: six yuan." }
  - id: e1-12-c6
    type: trace
    char: "买"
    guide: on
    why: { id: "**买** dimulai dari goresan lipat di atas, lalu dua titik, lalu bagian bawah seperti **头**.", en: "**买** starts with the turning stroke on top, then two dots, then the lower part shaped like **头**." }
glossary:
  - { zh: "多少", py: "duōshao", id: "berapa", en: "how many, how much", hsk: "1" }
  - { zh: "钱", py: "qián", id: "uang", en: "money", hsk: "1" }
  - { zh: "块", py: "kuài", id: "yuan (lisan); potong", en: "yuan (spoken); piece", hsk: "1" }
  - { zh: "毛", py: "máo", id: "sepersepuluh yuan", en: "a tenth of a yuan", hsk: "1" }
  - { zh: "元", py: "yuán", id: "yuan (tulisan)", en: "yuan (written)", hsk: "1" }
  - { zh: "买", py: "mǎi", id: "membeli", en: "to buy", hsk: "1" }
  - { zh: "衣服", py: "yīfu", id: "baju, pakaian", en: "clothes", mw: "件", hsk: "1" }
  - { zh: "贵", py: "guì", id: "mahal", en: "expensive", hsk: "1" }
  - { zh: "杯", py: "bēi", id: "cangkir, gelas (penggolong)", en: "cup (measure word)", hsk: "1" }
  - { zh: "车票", py: "chēpiào", id: "tiket kereta atau bus", en: "train or bus ticket", mw: "张", hsk: "1" }
  - { zh: "两", py: "liǎng", id: "dua (sebelum penggolong)", en: "two (before a measure word)", hsk: "1" }
  - { zh: "还是", py: "háishi", id: "atau (dalam pertanyaan)", en: "or (in questions)", hsk: "1" }
  - { zh: "和", py: "hé", id: "dan", en: "and", hsk: "1" }
  - { zh: "这", py: "zhè", id: "ini", en: "this", hsk: "1" }
extra:
  - { zh: "件", reason: "measure word for tops and clothes, PRD §4.3 Easy 1 lesson 12 (HSK 2)" }
  - { zh: "张", reason: "measure word for flat things such as tickets, PRD §4.3 Easy 1 lesson 12 (HSK 3)" }
next: easy1-13-tidak-belum
---

## concept.id

Untuk menanyakan harga: benda + **多少钱**? **这件衣服多少钱？** Baju ini berapa?

Dalam percakapan, uang Tiongkok dihitung dengan **块** (kuài). Di label harga dan di struk tertulis **元** (yuán). Satu **块** = sepuluh **毛** (máo). Jadi 3,50 yuan adalah **三块五毛**, dan biasanya cukup **三块五**: satuan terakhir dilewati.

Penggolong (*kata penggolong*, 量词 liàngcí) tetap wajib di antara angka dan benda. Tiga yang baru: **件** untuk baju atasan (seperti *sehelai*), **张** untuk benda datar seperti tiket (seperti *selembar*), dan **杯** untuk minuman (seperti *secangkir*). Sebelum penggolong, *dua* adalah **两**: **两张车票**.

Untuk *atau* dalam pertanyaan pilihan, pakai **还是**: **你要茶还是牛奶？** Untuk *dan* di antara dua kata benda, pakai **和**: **丽娜和西蒂**.

## concept.en

To ask a price: thing + **多少钱**? **这件衣服多少钱？** How much is this top?

In speech, Chinese money is counted in **块** (kuài). Price tags and receipts say **元** (yuán). One **块** = ten **毛** (máo). So 3.50 yuan is **三块五毛**, and usually just **三块五**: the last unit is dropped.

A measure word (量词 liàngcí) is still required between a number and a noun. Three new ones: **件** for tops (like *sehelai*), **张** for flat things such as tickets (like *selembar*), and **杯** for drinks (like *secangkir*). Before a measure word, *two* is **两**: **两张车票**.

For *or* in an either-or question, use **还是**: **你要茶还是牛奶？** For *and* between two nouns, use **和**: **丽娜和西蒂**.

## contrast.id

Penggolongnya mirip bahasa Indonesia: **一张票** seperti *selembar tiket*, **一杯茶** seperti *secangkir teh*. Tapi penggolong Mandarin lebih banyak dan wajib. **张** juga dipakai untuk meja dan tempat tidur, padahal kita bilang *sebuah meja*.

Bahasa Indonesia memakai *atau* untuk pertanyaan dan pernyataan. Mandarin memakai **还是** hanya dalam pertanyaan pilihan. Untuk *atau* dalam pernyataan ada kata lain, nanti di Easy 2. Dan **和** hanya menyambung kata benda, bukan dua kalimat.

## contrast.en

The measure words are like Indonesian: **一张票** like *selembar tiket*, **一杯茶** like *secangkir teh*. But Mandarin has more of them and they're required. **张** is also used for tables and beds, where Indonesian says *sebuah meja*.

Indonesian uses *atau* in questions and statements. Mandarin uses **还是** only in either-or questions. *Or* in statements is a different word, in Easy 2. And **和** only joins nouns, not two clauses.
