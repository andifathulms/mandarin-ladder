---
id: easy1-16-sudah-terjadi
rung: easy-1
order: 16
status: draft
minutes: 9
title: { id: "Sudah terjadi", en: "It happened", zh: "吃饭 了 吗 ？", py: "chīfàn le ma ?" }
summary:
  id: "了 sesudah kata kerja: sesuatu sudah terjadi (我买了一本书). 了 di akhir kalimat: keadaannya berubah (她病了). Sangkalannya 没, tanpa 了."
  en: "了 after a verb: something happened (我买了一本书). 了 at the end of a sentence: the situation changed (她病了). The negative is 没, without 了."
introduces: [g1-21, g1-41, g1-40]
spiral: aspect
worked:
  - { zh: "我 买 [[了]] 一 本 书 。", py: "wǒ mǎi [[le]] yì běn shū .", id: "Aku membeli sebuah buku.", en: "I bought a book." }
  - { zh: "我 [[没]] 买 书 。", py: "wǒ [[méi]] mǎi shū .", id: "Aku tidak membeli buku.", en: "I didn't buy a book." }
  - { zh: "他 吃 早饭 [[了]] 。", py: "tā chī zǎofàn [[le]] .", id: "Dia sudah sarapan.", en: "He's had breakfast." }
examples:
  - zh: "布迪 喝 [[了]] 两 杯 水 。"
    py: "Bùdí hē [[le]] liǎng bēi shuǐ ."
    id: "Budi minum dua gelas air."
    en: "Budi drank two glasses of water."
    note: { id: "Kata kerja + **了** + jumlah + benda: kejadiannya selesai.", en: "Verb + **了** + amount + object: the event is done." }
  - zh: "昨天 我 看 [[了]] 一 个 电影 。"
    py: "zuótiān wǒ kàn [[le]] yí gè diànyǐng ."
    id: "Kemarin aku menonton film."
    en: "I watched a film yesterday."
  - zh: "她 病 [[了]] 。"
    py: "tā bìng [[le]] ."
    id: "Dia sakit."
    en: "She's ill."
    note: { id: "**了** di akhir: sekarang keadaannya lain. Tadinya sehat, sekarang sakit.", en: "Final **了**: things are different now. She was well, now she's ill." }
  - zh: "我 [[没]] 吃 早饭 。"
    py: "wǒ [[méi]] chī zǎofàn ."
    id: "Aku tidak sarapan."
    en: "I didn't have breakfast."
  - zh: "你 买 票 [[了 吗]] ？"
    py: "nǐ mǎi piào [[le ma]] ?"
    id: "Kamu sudah beli tiket?"
    en: "Have you bought the tickets?"
  - zh: "妈妈 回家 [[了]] 。"
    py: "māma huíjiā [[le]] ."
    id: "Mama sudah pulang."
    en: "Mum's come home."
pair:
  off: { zh: "我 没 买 了 书 。", py: "wǒ méi mǎi le shū ." }
  natural: { zh: "我 [[没]] 买 书 。", py: "wǒ [[méi]] mǎi shū ." }
tone: { zh: "买 了", py: "mǎi le", note: { id: "**了** selalu nada netral: pendek dan ringan. Sesudah nada 3, **le** terdengar sedikit lebih tinggi.", en: "**了** is always neutral: short and light. After tone 3, **le** sounds a little higher." } }
hanzi: [了, 回, 病, 票, 睡, 觉, 找, 到]
words:
  id: "Tidak setiap *sudah* menjadi **了**, dan tidak setiap **了** berarti *sudah*. **昨天我看了一个电影** cukup diterjemahkan *kemarin aku menonton film*. Sebaliknya, **昨天我很忙** (kemarin aku sibuk) tidak memakai **了**: itu gambaran, bukan kejadian."
  en: "Not every *sudah* becomes **了**, and not every **了** means *already*. **昨天我看了一个电影** is just *I watched a film yesterday*. On the other hand, **昨天我很忙** (I was busy yesterday) has no **了**: it's a description, not an event."
talk:
  lines:
    - { who: "张 丽", zh: "丽娜 ， 你 吃饭 了 吗 ？", py: "Lìnà , nǐ chīfàn le ma ?", id: "Rina, kamu sudah makan?", en: "Rina, have you eaten?" }
    - { who: "Rina", zh: "吃 了 。 我 吃 了 两 个 包子 。", py: "chī le . wǒ chī le liǎng gè bāozi .", id: "Sudah. Aku makan dua bakpao.", en: "Yes. I had two steamed buns." }
    - { who: "张 丽", zh: "你 买 车票 了 吗 ？", py: "nǐ mǎi chēpiào le ma ?", id: "Kamu sudah beli tiket?", en: "Have you bought your ticket?" }
    - { who: "Rina", zh: "还 没 买 。", py: "hái méi mǎi .", id: "Belum.", en: "Not yet." }
tirukan: { zh: "我 喝 了 一 杯 茶 。", py: "wǒ hē le yì bēi chá .", id: "Aku minum secangkir teh.", en: "I drank a cup of tea." }
check:
  - id: e1-16-c1
    type: fix
    wrong: "我 没 买 了 书 。"
    options: ["我 没 买 书 。", "我 了 没 买 书 。"]
    answer: "我 没 买 书 。"
    why: { id: "**没** dan **了** tidak dipakai bersama. **没** sudah berarti *tidak terjadi*.", en: "**没** and **了** don't go together. **没** already means *didn't happen*." }
  - id: e1-16-c2
    type: gap
    cue: "Budi minum dua gelas air."
    prompt: "布迪 喝 ___ 两 杯 水 。"
    options: ["了", "没", "不"]
    answer: "了"
    why: { id: "Kejadian selesai dengan jumlah: kata kerja + **了** + **两杯水**.", en: "A finished event with an amount: verb + **了** + **两杯水**." }
  - id: e1-16-c3
    type: choice
    prompt: "Kamu ditanya **你 吃饭 了 吗 ？** Kamu belum makan. Jawabannya…"
    options: ["还 没 吃 。", "不 吃 了 。", "吃 了 。"]
    answer: "还 没 吃 。"
    why: { id: "*Belum* = **还没**, tanpa **了**. **不吃了** berarti *aku tidak mau makan lagi*.", en: "*Not yet* = **还没**, without **了**. **不吃了** means *I won't eat any more*." }
  - id: e1-16-c4
    type: order
    cue: "Mama sudah pulang."
    tiles: ["了", "回家", "妈妈"]
    answer: ["妈妈", "回家", "了"]
    why: { id: "**了** di akhir: keadaannya berubah, sekarang mama di rumah.", en: "Final **了**: things changed, mum is home now." }
  - id: e1-16-c5
    type: listen
    audio: "我 找到 了 我 的 手机 。"
    options: ["Aku sudah menemukan ponselku.", "Aku sedang mencari ponselku.", "Aku tidak punya ponsel."]
    answer: "Aku sudah menemukan ponselku."
    why: { id: "**找** mencari, **找到** menemukan. **了**: sudah terjadi.", en: "**找** look for, **找到** find. **了**: it happened." }
  - id: e1-16-c6
    type: trace
    char: "回"
    guide: on
    why: { id: "**回**: kotak luar dulu tanpa garis bawah, lalu kotak kecil di dalam, lalu tutup dengan garis bawah.", en: "**回**: the outer box first without its bottom, then the small box inside, then close with the bottom stroke." }
glossary:
  - { zh: "了", py: "le", id: "(sudah terjadi; berubah)", en: "(completed; changed)", hsk: "1" }
  - { zh: "吃饭", py: "chīfàn", id: "makan", en: "to eat a meal", hsk: "1" }
  - { zh: "早饭", py: "zǎofàn", id: "sarapan", en: "breakfast", hsk: "1" }
  - { zh: "病", py: "bìng", id: "sakit; penyakit", en: "to be ill; illness", hsk: "1" }
  - { zh: "回家", py: "huíjiā", id: "pulang", en: "to go home", hsk: "1" }
  - { zh: "票", py: "piào", id: "tiket", en: "ticket", mw: "张", hsk: "1" }
  - { zh: "车票", py: "chēpiào", id: "tiket kereta atau bus", en: "train or bus ticket", mw: "张", hsk: "1" }
  - { zh: "包子", py: "bāozi", id: "bakpao", en: "steamed bun", mw: "个", hsk: "1" }
  - { zh: "睡觉", py: "shuìjiào", id: "tidur", en: "to sleep", hsk: "1" }
  - { zh: "找", py: "zhǎo", id: "mencari", en: "to look for", hsk: "1" }
  - { zh: "找到", py: "zhǎodào", id: "menemukan", en: "to find", hsk: "1" }
  - { zh: "书", py: "shū", id: "buku", en: "book", mw: "本", hsk: "1" }
  - { zh: "电影", py: "diànyǐng", id: "film", en: "film, movie", mw: "个", hsk: "1" }
  - { zh: "妈妈", py: "māma", id: "ibu, mama", en: "mum", hsk: "1" }
next: easy1-17-cuaca-perasaan
---

## concept.id

Mandarin tidak punya bentuk lampau. Untuk bilang sesuatu sudah terjadi, pakai **了** (le).

**了 sesudah kata kerja**: kejadiannya selesai. Biasanya ada jumlah atau benda tertentu: **我买了一本书**, **布迪喝了两杯水**.

**了 di akhir kalimat**: keadaannya berubah, sekarang lain dari tadi. **她病了** (dia jatuh sakit), **妈妈回家了** (mama sudah pulang). Untuk bertanya, tambah **吗**: **你吃饭了吗？**

Sangkalannya **没**, dan **了** hilang: **我没买书**. Untuk *belum*, **还没**: **还没买**.

## concept.en

Mandarin has no past tense. To say something has happened, use **了** (le).

**了 after a verb**: the event is done. Usually there's an amount or a specific thing: **我买了一本书**, **布迪喝了两杯水**.

**了 at the end of a sentence**: the situation changed, now it's different from before. **她病了** (she's fallen ill), **妈妈回家了** (mum's come home). To ask, add **吗**: **你吃饭了吗？**

The negative is **没**, and **了** drops out: **我没买书**. For *not yet*, **还没**: **还没买**.

## contrast.id

**了** sering cocok dengan *sudah*: **我吃饭了**, aku sudah makan. Tapi **了** bukan penanda masa lampau. Gambaran tentang kemarin tidak memakainya: **昨天很热** (kemarin panas), **昨天我在家** (kemarin aku di rumah).

Kesalahan yang paling sering: menaruh **了** bersama **没**. Dalam bahasa Indonesia *tidak* dan *sudah* bisa bertemu (*sudah tidak*), tapi **没…了** tidak bisa. Pilih salah satu: **我买了** atau **我没买**.

## contrast.en

**了** often matches *sudah*: **我吃饭了**, I've eaten. But **了** isn't a past-tense marker. Descriptions of yesterday don't use it: **昨天很热** (it was hot yesterday), **昨天我在家** (I was at home yesterday).

The most common mistake: putting **了** with **没**. In Indonesian *tidak* and *sudah* can meet (*sudah tidak*), but **没…了** can't. Pick one: **我买了** or **我没买**.
