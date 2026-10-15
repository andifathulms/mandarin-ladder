---
id: dasar1-03-inisial-mudah
rung: dasar-1
order: 3
status: draft
minutes: 7
title: { id: "Bunyi yang sudah kamu kenal", en: "Sounds you already know", zh: "妈妈 ， 米饭 。", py: "māma , mǐfàn ." }
summary:
  id: "Inisial m, f, n, l, s dan vokal a, i, u hampir sama dengan bahasa Indonesia. Vokal e dan o yang perlu diperhatikan."
  en: "The initials m, f, n, l, s and the vowels a, i, u are almost the same as Indonesian. The vowels e and o need attention."
introduces: [d1-initials-easy]
spiral: pinyin
visual: { id: syllable-builder, props: { initial: { initial: "f", final: "a", tone: 1 } } }
examples:
  - zh: "[[妈妈]]"
    py: "[[māma]]"
    id: "ibu"
    en: "mother"
    note: { id: "**m** dan **a** persis seperti dalam *mama*. Yang baru hanya nadanya.", en: "**m** and **a** are just like Indonesian *mama*. Only the tone is new." }
  - zh: "[[米饭]]"
    py: "[[mǐfàn]]"
    id: "nasi"
    en: "cooked rice"
    note: { id: "**f** dibuat dengan gigi atas menyentuh bibir bawah, seperti *f* dalam *foto*. Jangan diganti *p*.", en: "**f** is made with the upper teeth on the lower lip, as in *foto*. Don't replace it with *p*." }
  - zh: "[[你]]"
    py: "[[nǐ]]"
    id: "kamu"
    en: "you"
  - zh: "[[路]]"
    py: "[[lù]]"
    id: "jalan"
    en: "road"
    note: { id: "**l** dan **u** sama dengan *l* dan *u* dalam *lupa*.", en: "**l** and **u** are the same as *l* and *u* in *lupa*." }
  - zh: "[[饿]]"
    py: "[[è]]"
    id: "lapar"
    en: "hungry"
    note: { id: "**e** pinyin bukan *é* dalam *enak*. Bunyinya mirip *e* dalam *empat*, tapi diucapkan lebih ke belakang mulut.", en: "Pinyin **e** isn't the *é* of *enak*. It's close to the *e* of *empat*, but said further back in the mouth." }
pair:
  off: { zh: "米饭", py: "mǐpàn" }
  natural: { zh: "[[米饭]]", py: "[[mǐfàn]]" }
tone: { zh: "米饭", py: "mǐfàn", note: { id: "Nada 3 lalu nada 4. Sebelum suku kata lain, nada 3 cukup diucapkan rendah, tanpa naik lagi.", en: "Tone 3 then tone 4. Before another syllable, tone 3 is just said low, without rising again." } }
tirukan: { zh: "你 好 ， 妈妈 。", py: "nǐ hǎo , māma .", id: "Halo, Ma.", en: "Hello, Mum." }
check:
  - id: d1-03-c1
    type: choice
    prompt: "Bunyi **e** dalam **è** paling mirip dengan…"
    options: ["*e* dalam *empat*", "*é* dalam *enak*", "*a* dalam *apa*"]
    answer: "*e* dalam *empat*"
    why: { id: "**e** pinyin dekat dengan *e* pepet (*empat*), hanya lebih ke belakang. Bukan *é* dalam *enak*.", en: "Pinyin **e** is close to the *e* of *empat*, just further back. Not the *é* of *enak*." }
  - id: d1-03-c2
    type: pinyin
    audio: "syl-fa1"
    answer: "fā"
    why: { id: "**f** seperti dalam *foto*, lalu **a** dengan nada 1 yang tinggi datar.", en: "**f** as in *foto*, then **a** on a high, level tone 1." }
  - id: d1-03-c3
    type: tone
    audio: "syl-lu4"
    options: [[1], [2], [3], [4]]
    answer: [4]
    why: { id: "Suaranya turun tajam: nada 4, **lù**.", en: "The voice falls sharply: tone 4, **lù**." }
  - id: d1-03-c4
    type: listen
    audio: "米饭"
    options: ["nasi", "ibu", "jalan"]
    answer: "nasi"
    why: { id: "**米饭** mǐfàn: nasi. Dengarkan **f** di suku kata kedua.", en: "**米饭** mǐfàn: rice. Listen for the **f** in the second syllable." }
  - id: d1-03-c5
    type: pinyin
    audio: "syl-nu3"
    answer: "nǔ"
    why: { id: "**n** lalu **u**, dengan nada 3 yang turun rendah.", en: "**n** then **u**, on a low, dipping tone 3." }
glossary:
  - { zh: "妈妈", py: "māma", id: "ibu, mama", en: "mother, mum", hsk: "1" }
  - { zh: "米饭", py: "mǐfàn", id: "nasi", en: "cooked rice", hsk: "1" }
  - { zh: "你", py: "nǐ", id: "kamu", en: "you", hsk: "1" }
  - { zh: "路", py: "lù", id: "jalan", en: "road", hsk: "1" }
  - { zh: "饿", py: "è", id: "lapar", en: "hungry", hsk: "1" }
next: dasar1-04-hembusan
---

## concept.id

Banyak bunyi pinyin sudah kamu kenal dari bahasa Indonesia.

Inisial **m**, **n**, **l**, dan **s** hampir sama persis. **f** juga sama dengan *f* dalam *foto*: gigi atas menyentuh bibir bawah.

Vokal **a**, **i**, dan **u** juga mirip: **mā** seperti *ma*, **nǐ** seperti *ni*, **lù** seperti *lu*.

Dua vokal perlu perhatian. **e** pinyin bukan *é* dalam *enak*. Bunyinya dekat dengan *e* dalam *empat*, tapi diucapkan lebih ke belakang mulut, dengan bibir tidak bulat. **o** pinyin (dalam **mō**, **fó**) terdengar seperti *u* pendek lalu *o*: *muo*, *fuo*.

## concept.en

You already know many pinyin sounds from Indonesian.

The initials **m**, **n**, **l** and **s** are almost exactly the same. **f** is like the *f* in *foto* too: upper teeth on the lower lip.

The vowels **a**, **i** and **u** are close as well: **mā** like *ma*, **nǐ** like *ni*, **lù** like *lu*.

Two vowels need attention. Pinyin **e** isn't the *é* of *enak*. It's close to the *e* of *empat*, but said further back, with unrounded lips. Pinyin **o** (in **mō**, **fó**) sounds like a short *u* then *o*: *muo*, *fuo*.

## contrast.id

Di beberapa daerah di Indonesia, *f* sering diucapkan *p*: *pitnah* untuk *fitnah*. Dalam Mandarin, **fàn** (nasi) dan **pàn** adalah kata yang berbeda, jadi jaga **f** tetap **f**.

Satu batas yang jujur: tidak semua huruf yang sama dibaca sama. **si** dalam pinyin bukan *si* dalam *siapa*. Vokalnya berbeda, dan kamu akan mempelajarinya di pelajaran 6. Begitu juga **c**, **q**, dan **x**: hurufnya Latin, bunyinya milik Mandarin.

## contrast.en

In some parts of Indonesia, *f* is often said as *p*: *pitnah* for *fitnah*. In Mandarin, **fàn** (rice) and **pàn** are different words, so keep **f** as **f**.

One honest limit: not every familiar letter is read the familiar way. Pinyin **si** isn't the *si* of *siapa*. The vowel is different, and you'll learn it in lesson 6. The same goes for **c**, **q** and **x**: the letters are Latin, the sounds belong to Mandarin.
