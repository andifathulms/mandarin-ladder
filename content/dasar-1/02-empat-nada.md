---
id: dasar1-02-empat-nada
rung: dasar-1
order: 2
status: draft
minutes: 8
title: { id: "Empat nada dan nada netral", en: "Four tones and the neutral tone", zh: "妈 麻 马 骂", py: "mā má mǎ mà" }
summary:
  id: "Setiap suku kata Mandarin punya nada: tinggi datar, naik, rendah, atau turun. Ada juga nada netral yang ringan dan pendek. Nada yang berbeda berarti kata yang berbeda."
  en: "Every Mandarin syllable has a tone: high and level, rising, low, or falling. There is also a light, short neutral tone. A different tone means a different word."
introduces: [d1-tones]
spiral: tones
visual: { id: tone-contour, props: { initial: { tone: 1, base: "ma" }, syllables: ["ma", "ba", "yi", "shi", "wu"] } }
examples:
  - zh: "[[妈]]"
    py: "[[mā]]"
    id: "ibu"
    en: "mother"
    note: { id: "Nada 1: tinggi dan datar. Tahan suaramu di atas, seperti menahan satu nada saat bernyanyi.", en: "Tone 1: high and level. Hold your voice up high, like holding one note when you sing." }
  - zh: "[[麻]]"
    py: "[[má]]"
    id: "rami; kebas"
    en: "hemp; numb"
    note: { id: "Nada 2: naik dari tengah ke atas, seperti saat kamu bertanya *Hah?*", en: "Tone 2: rises from the middle to the top, like when you ask *Huh?*" }
  - zh: "[[马]]"
    py: "[[mǎ]]"
    id: "kuda"
    en: "horse"
    note: { id: "Nada 3: turun ke bawah, rendah sekali. Diucapkan sendiri, suaranya naik lagi di akhir.", en: "Tone 3: drops down low. Said on its own, it rises again at the end." }
  - zh: "[[骂]]"
    py: "[[mà]]"
    id: "memarahi"
    en: "to scold"
    note: { id: "Nada 4: turun tajam dari atas ke bawah, pendek dan tegas.", en: "Tone 4: falls sharply from the top to the bottom, short and firm." }
  - zh: "你 好 [[吗]] ？"
    py: "nǐ hǎo [[ma]] ?"
    id: "Apa kabar?"
    en: "How are you?"
    note: { id: "**吗** ma tidak punya tanda nada: itu nada netral. Ucapkan ringan dan pendek.", en: "**吗** ma has no tone mark: it's the neutral tone. Say it light and short." }
pair:
  off: { zh: "马", py: "ma" }
  natural: { zh: "[[马]]", py: "[[mǎ]]" }
tone: { zh: "妈妈", py: "māma", note: { id: "Nada 1, lalu nada netral. Suku kata kedua ringan dan lebih pendek, tanpa tanda nada.", en: "Tone 1, then the neutral tone. The second syllable is light and shorter, with no tone mark." } }
tirukan: { zh: "妈 麻 马 骂", py: "mā má mǎ mà", id: "ibu, rami, kuda, memarahi", en: "mother, hemp, horse, scold" }
check:
  - id: d1-02-c1
    type: tone
    audio: "syl-ma3"
    options: [[1], [2], [3], [4]]
    answer: [3]
    why: { id: "Nada 3 turun rendah, lalu naik sedikit di akhir.", en: "Tone 3 dips low, then rises a little at the end." }
  - id: d1-02-c2
    type: tone
    audio: "syl-ma2"
    options: [[2], [4]]
    answer: [2]
    why: { id: "Suaranya naik, seperti bertanya. Itu nada 2. Nada 4 justru turun.", en: "The voice rises, like a question. That's tone 2. Tone 4 falls instead." }
  - id: d1-02-c3
    type: choice
    prompt: "Nada mana yang turun tajam dari atas ke bawah?"
    options: ["nada 1", "nada 2", "nada 3", "nada 4"]
    answer: "nada 4"
    why: { id: "Nada 4 (**mà**) turun tajam. Tandanya pun miring ke bawah: **ˋ**.", en: "Tone 4 (**mà**) falls sharply. Its mark slopes down too: **ˋ**." }
  - id: d1-02-c4
    type: pinyin
    audio: "syl-ma1"
    answer: "mā"
    why: { id: "Tinggi dan datar: nada 1. Ketik **ma1** atau **mā**.", en: "High and level: tone 1. Type **ma1** or **mā**." }
  - id: d1-02-c5
    type: choice
    prompt: "Dalam **māma**, suku kata kedua bernada apa?"
    options: ["nada netral", "nada 1", "nada 3"]
    answer: "nada netral"
    why: { id: "Tidak ada tanda di atas **ma** yang kedua: itu nada netral, ringan dan pendek.", en: "There's no mark over the second **ma**: it's the neutral tone, light and short." }
glossary:
  - { zh: "妈妈", py: "māma", id: "ibu, mama", en: "mother, mum", hsk: "1" }
  - { zh: "吗", py: "ma", id: "partikel tanya", en: "question particle", hsk: "1" }
  - { zh: "马", py: "mǎ", id: "kuda", en: "horse" }
extra:
  - { zh: "妈", reason: "the classic four-tone set mā má mǎ mà; on its own it is not an HSK 1 word (妈妈 is)" }
  - { zh: "麻", reason: "the classic four-tone set mā má mǎ mà (tone 2); not on the HSK 1 list" }
  - { zh: "马", reason: "the classic four-tone set mā má mǎ mà (tone 3); not on the HSK 1 list" }
  - { zh: "骂", reason: "the classic four-tone set mā má mǎ mà (tone 4); not on the HSK 1 list" }
next: dasar1-03-inisial-mudah
---

## concept.id

Dalam bahasa Mandarin, setiap suku kata punya **nada**: arah naik-turun suaramu. Nada bukan perasaan atau logat. Nada adalah bagian dari kata.

Ada empat nada, ditambah satu nada netral.

**Nada 1** (**mā**): tinggi dan datar. Tahan suaramu di atas.

**Nada 2** (**má**): naik dari tengah ke atas, seperti saat kamu bertanya *Hah?*

**Nada 3** (**mǎ**): turun ke bawah, rendah sekali. Kalau diucapkan sendiri, suaranya naik lagi di akhir. Di dalam kalimat, biasanya cukup rendah saja.

**Nada 4** (**mà**): turun tajam dari atas ke bawah, pendek dan tegas.

**Nada netral** (**ma**): tidak ada tandanya. Ucapkan ringan dan pendek, tanpa tekanan. Contohnya **吗** dan suku kata kedua dalam **妈妈** (māma).

Tanda nadanya menggambar arah suara: **ˉ** datar, **ˊ** naik, **ˇ** turun lalu naik, **ˋ** turun.

## concept.en

In Mandarin every syllable has a **tone**: the direction your voice moves. A tone isn't a feeling or an accent. It's part of the word.

There are four tones, plus a neutral tone.

**Tone 1** (**mā**): high and level. Hold your voice up high.

**Tone 2** (**má**): rises from the middle to the top, like when you ask *Huh?*

**Tone 3** (**mǎ**): drops down low. Said on its own, it rises again at the end. Inside a sentence it is usually just low.

**Tone 4** (**mà**): falls sharply from the top to the bottom, short and firm.

**The neutral tone** (**ma**): no mark. Say it light and short, without stress. Examples are **吗** and the second syllable of **妈妈** (māma).

The marks draw the voice's direction: **ˉ** level, **ˊ** rising, **ˇ** dipping, **ˋ** falling.

## contrast.id

Bahasa Indonesia tidak memakai nada untuk membedakan kata. *Apa* tetap *apa*, diucapkan tinggi atau rendah. Kita memakai naik-turun suara untuk kalimat: suara naik di akhir pertanyaan, turun di akhir pernyataan.

Karena itu, penutur bahasa Indonesia sering mengucapkan semua suku kata dengan suara yang sama, atau membiarkan intonasi kalimat mengubah nada kata terakhir. Dalam Mandarin, **mǎ** tetap rendah walaupun ada di akhir pertanyaan. Pertanyaan ditandai dengan kata seperti **吗**, bukan dengan menaikkan suara.

Kabar baiknya: telingamu sudah biasa mendengar suara naik dan turun. Sekarang kamu tinggal memasangnya pada setiap suku kata.

## contrast.en

Indonesian doesn't use tones to tell words apart. *Apa* is still *apa*, said high or low. We use pitch for sentences: the voice rises at the end of a question and falls at the end of a statement.

So Indonesian speakers often say every syllable on the same pitch, or let the sentence melody change the tone of the last word. In Mandarin, **mǎ** stays low even at the end of a question. Questions are marked with words like **吗**, not by raising the voice.

The good news: your ear already knows rising and falling pitch. Now you attach it to every syllable.
