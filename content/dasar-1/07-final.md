---
id: dasar1-07-final
rung: dasar-1
order: 7
status: draft
minutes: 8
title: { id: "Final: ai, ao, an, ang", en: "Finals: ai, ao, an, ang", zh: "我 很 忙 。", py: "wǒ hěn máng ." }
summary:
  id: "Final adalah bagian akhir suku kata. ai, ei, ao, ou meluncur dari satu vokal ke vokal lain. an, en, ang, eng, ong berakhir dengan -n atau -ng, dan bedanya mengubah kata."
  en: "The final is the end of the syllable. ai, ei, ao, ou glide from one vowel to another. an, en, ang, eng, ong end in -n or -ng, and the difference changes the word."
introduces: [d1-finals]
spiral: pinyin
visual: { id: syllable-builder, props: { initial: { initial: "f", final: "an", tone: 4 } } }
examples:
  - zh: "[[买]]"
    py: "[[mǎi]]"
    id: "membeli"
    en: "to buy"
    note: { id: "**ai** seperti *ai* dalam *pantai*.", en: "**ai** like the *ai* in Indonesian *pantai*." }
  - zh: "[[好]]"
    py: "[[hǎo]]"
    id: "baik"
    en: "good"
    note: { id: "**ao** seperti *au* dalam *pulau*. Pinyin menulisnya **ao**, bukan *au*.", en: "**ao** like the *au* in Indonesian *pulau*. Pinyin writes it **ao**, not *au*." }
  - zh: "[[走]]"
    py: "[[zǒu]]"
    id: "berjalan"
    en: "to walk"
    note: { id: "**ou**: mulai dari *o*, lalu meluncur ke *u*.", en: "**ou**: start on *o*, then glide to *u*." }
  - zh: "[[饭]]"
    py: "[[fàn]]"
    id: "nasi, makanan"
    en: "rice, meal"
    note: { id: "**-n**: ujung lidah menyentuh belakang gigi atas, seperti akhir *makan*.", en: "**-n**: the tongue tip touches behind the upper teeth, as at the end of *makan*." }
  - zh: "[[忙]]"
    py: "[[máng]]"
    id: "sibuk"
    en: "busy"
    note: { id: "**-ng**: pangkal lidah naik ke belakang, seperti akhir *datang*. **mán** dan **máng** adalah kata yang berbeda.", en: "**-ng**: the back of the tongue rises, as at the end of *datang*. **mán** and **máng** are different words." }
  - zh: "[[东西]]"
    py: "[[dōngxi]]"
    id: "barang"
    en: "thing, stuff"
    note: { id: "**ong** terdengar lebih dekat dengan *ung* daripada *ong* dalam *bohong*.", en: "**ong** sounds closer to *ung* than to the *ong* of *bohong*." }
pair:
  off: { zh: "忙", py: "mán" }
  natural: { zh: "[[忙]]", py: "[[máng]]" }
tone: { zh: "东西", py: "dōngxi", note: { id: "Nada 1, lalu nada netral. **dōngxī** dengan nada 1 di akhir berarti *timur dan barat*, kata yang lain.", en: "Tone 1, then the neutral tone. **dōngxī** with tone 1 at the end means *east and west*, a different word." } }
tirukan: { zh: "我 很 忙 。", py: "wǒ hěn máng .", id: "Aku sibuk.", en: "I'm busy." }
check:
  - id: d1-07-c1
    type: pinyin
    audio: "syl-fan4"
    answer: "fàn"
    why: { id: "Berakhir dengan **-n**, lidah di depan. Turun tajam: nada 4.", en: "Ends in **-n**, tongue at the front. A sharp fall: tone 4." }
  - id: d1-07-c2
    type: pinyin
    audio: "syl-fang2"
    answer: "fáng"
    why: { id: "Berakhir dengan **-ng**, seperti *datang*. Naik: nada 2.", en: "Ends in **-ng**, as in *datang*. Rising: tone 2." }
  - id: d1-07-c3
    type: choice
    prompt: "**ao** dalam **hǎo** berbunyi seperti…"
    options: ["*au* dalam *pulau*", "*a* lalu *o*, terpisah", "*o* saja"]
    answer: "*au* dalam *pulau*"
    why: { id: "**ao** adalah satu luncuran, seperti *au* dalam bahasa Indonesia.", en: "**ao** is one glide, like Indonesian *au*." }
  - id: d1-07-c4
    type: pinyin
    audio: "syl-men2"
    answer: "mén"
    why: { id: "**-n**, bukan **-ng**. **mén** berarti pintu.", en: "**-n**, not **-ng**. **mén** means door." }
  - id: d1-07-c5
    type: choice
    prompt: "Bagaimana **tiān** dibaca?"
    options: ["seperti *tien*", "seperti *ti-an*, dengan *a* yang jelas"]
    answer: "seperti *tien*"
    why: { id: "Di antara **i** dan **n**, huruf **a** terdengar seperti *e*: **tiān**, **diàn**, **qián**.", en: "Between **i** and **n**, the letter **a** sounds like *e*: **tiān**, **diàn**, **qián**." }
glossary:
  - { zh: "买", py: "mǎi", id: "membeli", en: "to buy", hsk: "1" }
  - { zh: "好", py: "hǎo", id: "baik", en: "good", hsk: "1" }
  - { zh: "走", py: "zǒu", id: "berjalan", en: "to walk", hsk: "1" }
  - { zh: "饭", py: "fàn", id: "nasi, makanan", en: "rice, meal", hsk: "1" }
  - { zh: "忙", py: "máng", id: "sibuk", en: "busy", hsk: "1" }
  - { zh: "东西", py: "dōngxi", id: "barang", en: "thing, stuff", hsk: "1" }
next: dasar1-08-perubahan-nada
---

## concept.id

**Final** adalah bagian akhir suku kata, sesudah inisial. Ada dua jenis yang paling sering.

**Vokal luncur**: **ai**, **ei**, **ao**, **ou**. Suaramu mulai di vokal pertama, lalu meluncur ke vokal kedua dalam satu tarikan. **ai** seperti *pantai*, **ao** seperti *pulau*, **ei** seperti *é* lalu *i*, dan **ou** seperti *o* lalu *u*.

**Akhiran sengau**: **an**, **en**, **ang**, **eng**, **ong**. Bahasa Indonesia punya *-n* dan *-ng* juga, jadi kamu sudah bisa membedakannya: *makan* dan *datang*. Dalam Mandarin, bedanya mengubah kata. **fàn** (nasi) dan **fàng** (menaruh) berbeda, begitu juga **mén** (pintu) dan **méng**.

Dua hal kecil: **ong** terdengar lebih dekat dengan *ung*, dan dalam **ian** huruf **a** terdengar seperti *e*: **tiān** dibaca seperti *tien*.

## concept.en

The **final** is the end of the syllable, after the initial. Two kinds are the most common.

**Glides**: **ai**, **ei**, **ao**, **ou**. Your voice starts on the first vowel and glides to the second in one go. **ai** like *pantai*, **ao** like *pulau*, **ei** like *é* then *i*, and **ou** like *o* then *u*.

**Nasal endings**: **an**, **en**, **ang**, **eng**, **ong**. Indonesian has *-n* and *-ng* too, so you can already tell them apart: *makan* and *datang*. In Mandarin the difference changes the word. **fàn** (rice) and **fàng** (to put) are different, and so are **mén** (door) and **méng**.

Two small points: **ong** sounds closer to *ung*, and in **ian** the **a** sounds like *e*: **tiān** is said like *tien*.

## contrast.id

Di sini bahasa Indonesia benar-benar membantu. *-n* dan *-ng* di akhir kata sudah biasa kamu ucapkan, sedangkan banyak pelajar dari negara lain kesulitan.

Batas yang jujur: dalam bicara cepat, penutur Indonesia kadang melemahkan bunyi akhir, sehingga **máng** terdengar seperti **mán**. Dalam Mandarin, ucapkan akhirannya dengan jelas. Dan **e** dalam **en** dan **eng** adalah **e** pinyin dari pelajaran 3, bukan *é* dalam *enak*.

## contrast.en

Here Indonesian really helps. You already say *-n* and *-ng* at the end of words, while many learners from other countries struggle.

An honest limit: in fast speech, Indonesian speakers sometimes weaken the final sound, so **máng** sounds like **mán**. In Mandarin, say the ending clearly. And the **e** in **en** and **eng** is the pinyin **e** from lesson 3, not the *é* of *enak*.
