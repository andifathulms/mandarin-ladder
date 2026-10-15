---
id: dasar2-01-apa-itu-karakter
rung: dasar-2
order: 1
status: draft
minutes: 8
title: { id: "Apa itu karakter", en: "What characters are", zh: "汉字", py: "Hànzì" }
summary:
  id: "Sebagian kecil karakter adalah gambar (人 山 日), sebagian ide (上 下), dan kebanyakan gabungan bagian arti dan bagian bunyi (妈 = 女 + 马)."
  en: "A few characters are pictures (人 山 日), some are ideas (上 下), and most join a meaning part and a sound part (妈 = 女 + 马)."
introduces: [d2-what]
spiral: radicals
visual: { id: character-parts, props: { char: "妈" } }
examples:
  - zh: "[[人]]"
    py: "[[rén]]"
    id: "orang: gambar orang berjalan, dua kaki"
    en: "person: a picture of a person walking, two legs"
  - zh: "[[山]]"
    py: "[[shān]]"
    id: "gunung: tiga puncak"
    en: "mountain: three peaks"
  - zh: "[[上]]"
    py: "[[shàng]]"
    id: "atas: garis pendek di atas garis dasar"
    en: "up, on: a short line above a base line"
  - zh: "[[妈妈]]"
    py: "[[māma]]"
    id: "ibu: 女 (perempuan) memberi arti, 马 (mǎ) memberi bunyi"
    en: "mother: 女 (woman) gives the meaning, 马 (mǎ) gives the sound"
pair:
  off: { zh: "妈妈", py: "mǎma" }
  natural: { zh: "[[妈妈]]", py: "[[māma]]" }
words:
  id: "Satu karakter adalah satu suku kata. **妈** dibaca **mā**, satu suku kata, dan hampir selalu punya arti sendiri. Karena itu bahasa Mandarin tidak punya ejaan: kamu belajar karakter, dan pinyin membantu membacanya."
  en: "One character is one syllable. **妈** reads **mā**, one syllable, and almost always has a meaning of its own. So Mandarin has no spelling: you learn characters, and pinyin helps you read them."
tirukan: { zh: "妈妈", py: "māma", id: "ibu", en: "mother" }
check:
  - id: d2-01-c1
    type: choice
    prompt: "Dalam **妈**, bagian mana yang memberi bunyi?"
    options: ["马 (mǎ)", "女 (perempuan)"]
    answer: "马 (mǎ)"
    why: { id: "**马** dibaca **mǎ**, dekat dengan **mā**. **女** memberi arti: perempuan.", en: "**马** reads **mǎ**, close to **mā**. **女** gives the meaning: woman." }
  - id: d2-01-c2
    type: build
    prompt: "Bangun **妈** (ibu)."
    char: "妈"
    parts: ["女", "马", "口", "子"]
    answer: ["女", "马"]
    why: { id: "**妈** = **女** (perempuan, arti) + **马** (mǎ, bunyi).", en: "**妈** = **女** (woman, meaning) + **马** (mǎ, sound)." }
  - id: d2-01-c3
    type: choice
    show_pinyin: false
    prompt: "Karakter mana yang berasal dari gambar gunung?"
    options: ["山", "上", "人"]
    answer: "山"
    why: { id: "**山** shān: tiga puncak gunung.", en: "**山** shān: three mountain peaks." }
  - id: d2-01-c4
    type: choice
    prompt: "Berapa suku kata dalam **妈妈**?"
    options: ["dua", "satu", "empat"]
    answer: "dua"
    why: { id: "Dua karakter, dua suku kata: **mā** dan **ma**.", en: "Two characters, two syllables: **mā** and **ma**." }
glossary:
  - { zh: "妈妈", py: "māma", id: "ibu, mama", en: "mother", hsk: "1" }
  - { zh: "人", py: "rén", id: "orang", en: "person", hsk: "1" }
  - { zh: "上", py: "shàng", id: "atas", en: "up, on", hsk: "1" }
extra:
  - { zh: "山", reason: "a picture character used to explain how characters began (HSK 2)" }
  - { zh: "马", reason: "the sound part of 妈 (HSK 3)" }
  - { zh: "妈", reason: "the character on its own, as the build answer (妈妈 is HSK 1)" }
next: dasar2-02-delapan-goresan
---

## concept.id

Karakter Mandarin bukan huruf. Satu karakter adalah satu suku kata, dan hampir selalu satu arti.

Beberapa karakter berasal dari **gambar**: **人** (orang) adalah orang berjalan, **山** (gunung) tiga puncak, **日** (matahari) matahari dalam bingkai. Beberapa menggambarkan **ide**: **上** (atas) dan **下** (bawah).

Tapi kebanyakan karakter adalah **gabungan**: satu bagian memberi petunjuk arti, satu bagian memberi petunjuk bunyi. **妈** (mā, ibu) = **女** (perempuan) + **马** (mǎ, kuda, di sini hanya untuk bunyinya). Kalau kamu kenal bagian-bagiannya, karakter baru jadi lebih mudah diingat.

## concept.en

Chinese characters aren't letters. One character is one syllable, and almost always one meaning.

Some characters began as **pictures**: **人** (person) is someone walking, **山** (mountain) three peaks, **日** (sun) the sun in a frame. Some show **ideas**: **上** (up) and **下** (down).

But most characters are **compounds**: one part hints at the meaning, one part hints at the sound. **妈** (mā, mother) = **女** (woman) + **马** (mǎ, horse, here only for its sound). Once you know the parts, new characters become easier to remember.

## contrast.id

Bagian bunyi hanya petunjuk. Membaca **妈妈** dengan nada **马** (mǎ) terdengar aneh: yang benar **māma**.

Bahasa Indonesia ditulis dengan huruf yang mewakili bunyi, jadi kata yang belum pernah kamu lihat pun bisa kamu baca. Karakter tidak begitu: **马** dan **妈** mirip bunyinya, tapi bentuknya tidak memberi tahu nadanya. Itulah gunanya pinyin di atas karakter.

Bagian bunyi juga hanya petunjuk, bukan aturan. **马** mǎ dan **妈** mā berbeda nada. Kadang bagian bunyi sudah jauh dari bunyi aslinya.

## contrast.en

The sound part is only a hint. Reading **妈妈** with the tone of **马** (mǎ) sounds odd: it's **māma**.

Indonesian is written in letters that stand for sounds, so you can read words you've never seen. Characters don't work that way: **马** and **妈** sound alike, but their shapes don't tell you the tone. That's what pinyin over the characters is for.

The sound part is also only a hint, not a rule. **马** mǎ and **妈** mā have different tones. Sometimes the sound part has drifted far from its original sound.
