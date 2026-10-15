---
id: dasar1-04-hembusan
rung: dasar-1
order: 4
status: draft
minutes: 8
title: { id: "Hembusan udara: b dan p", en: "A puff of air: b and p", zh: "爸爸 ， 跑 。", py: "bàba , pǎo ." }
summary:
  id: "Dalam pinyin, b/p, d/t, dan g/k tidak dibedakan oleh getaran suara, tapi oleh hembusan udara. p, t, k diucapkan dengan hembusan kuat."
  en: "In pinyin, b/p, d/t and g/k differ not by voicing but by a puff of air. p, t, k are said with a strong puff."
introduces: [d1-aspiration]
spiral: pinyin
visual: { id: mouth-places, props: { initial: "lips", aspiration: true } }
examples:
  - zh: "[[爸爸]]"
    py: "[[bàba]]"
    id: "ayah"
    en: "father"
    note: { id: "**b** tanpa hembusan. Bunyinya dekat dengan *p* dalam *sapu*: tidak ada udara yang keluar.", en: "**b** has no puff. It's close to the *p* in Indonesian *sapu*: no air comes out." }
  - zh: "[[跑]]"
    py: "[[pǎo]]"
    id: "lari"
    en: "to run"
    note: { id: "**p** dengan hembusan kuat. Taruh tanganmu di depan mulut: kamu harus merasakan udaranya.", en: "**p** with a strong puff. Put your hand in front of your mouth: you should feel the air." }
  - zh: "[[大]]"
    py: "[[dà]]"
    id: "besar"
    en: "big"
  - zh: "[[他]]"
    py: "[[tā]]"
    id: "dia (laki-laki)"
    en: "he"
    note: { id: "**d** dan **t** di tempat yang sama, ujung lidah di belakang gigi atas. Bedanya hanya hembusan pada **t**.", en: "**d** and **t** are made in the same place, tongue tip behind the upper teeth. Only **t** has the puff." }
  - zh: "[[哥哥]]"
    py: "[[gēge]]"
    id: "kakak laki-laki"
    en: "older brother"
  - zh: "[[看]]"
    py: "[[kàn]]"
    id: "melihat"
    en: "to look"
    note: { id: "**k** dengan hembusan, **g** tanpa hembusan. Keduanya dibuat di belakang mulut.", en: "**k** with a puff, **g** without. Both are made at the back of the mouth." }
pair:
  off: { zh: "跑", py: "bǎo" }
  natural: { zh: "[[跑]]", py: "[[pǎo]]" }
tone: { zh: "爸爸", py: "bàba", note: { id: "Nada 4 lalu nada netral: turun tegas, lalu suku kata kedua ringan dan pendek.", en: "Tone 4 then the neutral tone: a firm fall, then a light, short second syllable." } }
tirukan: { zh: "他 是 我 哥哥 。", py: "tā shì wǒ gēge .", id: "Dia kakakku.", en: "He's my older brother." }
check:
  - id: d1-04-c1
    type: choice
    prompt: "Apa beda **b** dan **p** dalam pinyin?"
    options: ["**p** diucapkan dengan hembusan udara", "**b** menggetarkan pita suara", "tidak ada bedanya"]
    answer: "**p** diucapkan dengan hembusan udara"
    why: { id: "Keduanya tidak bersuara. Yang membedakan hanya hembusan udara pada **p**.", en: "Neither is voiced. Only the puff of air on **p** tells them apart." }
  - id: d1-04-c2
    type: pinyin
    audio: "syl-pa4"
    answer: "pà"
    why: { id: "Ada hembusan udara: **p**. Suaranya turun: nada 4.", en: "There's a puff of air: **p**. The voice falls: tone 4." }
  - id: d1-04-c3
    type: pinyin
    audio: "syl-tu2"
    answer: "tú"
    why: { id: "Hembusan udara berarti **t**, bukan **d**. Suaranya naik: nada 2.", en: "A puff of air means **t**, not **d**. The voice rises: tone 2." }
  - id: d1-04-c4
    type: choice
    prompt: "Bunyi mana yang paling dekat dengan **bā**?"
    options: ["*pa* tanpa hembusan udara", "*pa* dengan hembusan kuat"]
    answer: "*pa* tanpa hembusan udara"
    why: { id: "**b** pinyin tidak bersuara dan tanpa hembusan, seperti *p* dalam bahasa Indonesia.", en: "Pinyin **b** is voiceless with no puff, like Indonesian *p*." }
  - id: d1-04-c5
    type: listen
    audio: "哥哥"
    options: ["kakak laki-laki", "ayah", "besar"]
    answer: "kakak laki-laki"
    why: { id: "**哥哥** gēge: kakak laki-laki. **g** tanpa hembusan.", en: "**哥哥** gēge: older brother. **g** without a puff." }
glossary:
  - { zh: "爸爸", py: "bàba", id: "ayah, papa", en: "father, dad", hsk: "1" }
  - { zh: "跑", py: "pǎo", id: "lari", en: "to run", hsk: "1" }
  - { zh: "大", py: "dà", id: "besar", en: "big", hsk: "1" }
  - { zh: "他", py: "tā", id: "dia (laki-laki)", en: "he, him", hsk: "1" }
  - { zh: "哥哥", py: "gēge", id: "kakak laki-laki", en: "older brother", hsk: "1" }
  - { zh: "看", py: "kàn", id: "melihat", en: "to look, to watch", hsk: "1" }
next: dasar1-05-jqx
---

## concept.id

Dalam bahasa Indonesia, *b* dan *p* dibedakan oleh getaran pita suara. Pada *b*, tenggorokanmu bergetar. Pada *p*, tidak.

Pinyin memakai huruf yang sama untuk perbedaan yang lain. **b**, **d**, **g** tidak bersuara dan tanpa hembusan. **p**, **t**, **k** juga tidak bersuara, tapi diucapkan dengan **hembusan udara** yang kuat.

Jadi **b** pinyin bunyinya dekat dengan *p* bahasa Indonesia, **d** dekat dengan *t*, dan **g** dekat dengan *k*. Sedangkan **p**, **t**, **k** pinyin adalah *p*, *t*, *k* dengan udara yang menyembur keluar.

Coba dengan selembar tisu di depan mulut. Pada **pǎo**, tisunya bergerak. Pada **bàba**, tisunya diam.

## concept.en

In Indonesian, *b* and *p* differ by voicing. On *b*, your throat vibrates. On *p*, it doesn't.

Pinyin uses the same letters for a different contrast. **b**, **d**, **g** are voiceless with no puff. **p**, **t**, **k** are voiceless too, but said with a strong **puff of air**.

So pinyin **b** sounds close to Indonesian *p*, **d** close to *t*, and **g** close to *k*. Pinyin **p**, **t**, **k** are *p*, *t*, *k* with a burst of air.

Try it with a tissue in front of your mouth. On **pǎo**, the tissue moves. On **bàba**, it stays still.

## contrast.id

*p*, *t*, *k* dalam bahasa Indonesia diucapkan tanpa hembusan. Karena itu, kalau kamu mengucapkan **pǎo** seperti *pao* Indonesia, orang Tionghoa akan mendengar **bǎo**. Untuk **p**, **t**, **k**, tambahkan hembusannya dengan sengaja.

Batas yang jujur: kalau kamu mengucapkan **b** dengan *b* Indonesia yang bersuara, biasanya masih dimengerti. Yang paling penting adalah hembusan pada **p**, **t**, **k**, karena itulah yang membedakan kata.

## contrast.en

Indonesian *p*, *t*, *k* have no puff. So if you say **pǎo** like Indonesian *pao*, a Chinese listener will hear **bǎo**. For **p**, **t**, **k**, add the puff on purpose.

An honest limit: if you say **b** with a voiced Indonesian *b*, you'll usually still be understood. What matters most is the puff on **p**, **t**, **k**, because that's what tells the words apart.
