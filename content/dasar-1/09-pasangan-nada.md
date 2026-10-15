---
id: dasar1-09-pasangan-nada
rung: dasar-1
order: 9
status: draft
minutes: 9
title: { id: "Dua puluh pasangan nada", en: "The twenty tone pairs", zh: "老师 ， 再见 。", py: "lǎoshī , zàijiàn ." }
summary:
  id: "Kebanyakan kata Mandarin terdiri dari dua suku kata. Empat nada di depan dan lima nada di belakang (termasuk netral) membentuk 20 pasangan. Kenali pasangannya, dan kamu bisa membaca kata apa pun."
  en: "Most Mandarin words have two syllables. Four tones in front and five behind (including neutral) make 20 pairs. Know the pairs, and you can read any word."
introduces: [d1-pairs]
spiral: tones
visual: { id: tone-contour, props: { initial: { tone: 3, base: "ma" }, compare: true } }
examples:
  - zh: "[[今天]]"
    py: "[[jīntiān]]"
    id: "hari ini"
    en: "today"
    note: { id: "1 + 1: tinggi, lalu tetap tinggi. Jangan biarkan suku kata kedua turun.", en: "1 + 1: high, then still high. Don't let the second syllable drop." }
  - zh: "[[中国]]"
    py: "[[Zhōngguó]]"
    id: "Tiongkok"
    en: "China"
    note: { id: "1 + 2: tinggi datar, lalu naik.", en: "1 + 2: high and level, then rising." }
  - zh: "[[学习]]"
    py: "[[xuéxí]]"
    id: "belajar"
    en: "to study"
    note: { id: "2 + 2: naik, lalu naik lagi.", en: "2 + 2: rising, then rising again." }
  - zh: "[[老师]]"
    py: "[[lǎoshī]]"
    id: "guru"
    en: "teacher"
    note: { id: "3 + 1: nada 3 cukup rendah saja, lalu melompat ke nada 1 yang tinggi.", en: "3 + 1: tone 3 just stays low, then jumps to a high tone 1." }
  - zh: "[[汉语]]"
    py: "[[Hànyǔ]]"
    id: "bahasa Mandarin"
    en: "Chinese (language)"
    note: { id: "4 + 3: turun tajam, lalu rendah.", en: "4 + 3: a sharp fall, then low." }
  - zh: "[[朋友]]"
    py: "[[péngyou]]"
    id: "teman"
    en: "friend"
    note: { id: "2 + netral: naik, lalu ringan dan pendek.", en: "2 + neutral: rising, then light and short." }
pair:
  off: { zh: "老师", py: "láoshī" }
  natural: { zh: "[[老师]]", py: "[[lǎoshī]]" }
tone: { zh: "再见", py: "zàijiàn", note: { id: "4 + 4: dua nada turun. Yang pertama sedikit lebih ringan, yang kedua turun penuh.", en: "4 + 4: two falling tones. The first is a little lighter, the second falls all the way." } }
tirukan: { zh: "老师 ， 再见 。", py: "lǎoshī , zàijiàn .", id: "Sampai jumpa, Bu Guru.", en: "Goodbye, teacher." }
check:
  - id: d1-09-c1
    type: tone
    audio: "今天"
    audio_py: "jīntiān"
    options: [[1, 1], [1, 2], [4, 1]]
    answer: [1, 1]
    why: { id: "Keduanya tinggi dan datar: 1 + 1.", en: "Both are high and level: 1 + 1." }
  - id: d1-09-c2
    type: tone
    audio: "学习"
    audio_py: "xuéxí"
    options: [[2, 2], [2, 4], [3, 2]]
    answer: [2, 2]
    why: { id: "Naik, lalu naik lagi: 2 + 2.", en: "Rising, then rising again: 2 + 2." }
  - id: d1-09-c3
    type: tone
    audio: "汉语"
    audio_py: "Hànyǔ"
    options: [[4, 3], [3, 4], [4, 4]]
    answer: [4, 3]
    why: { id: "Turun tajam, lalu rendah: 4 + 3.", en: "A sharp fall, then low: 4 + 3." }
  - id: d1-09-c4
    type: tone
    audio: "朋友"
    audio_py: "péngyou"
    options: [[2, 0], [2, 3], [3, 0]]
    answer: [2, 0]
    why: { id: "Naik, lalu ringan dan pendek: 2 + netral.", en: "Rising, then light and short: 2 + neutral." }
  - id: d1-09-c5
    type: pinyin
    audio: "老师"
    answer: "lǎoshī"
    why: { id: "Rendah, lalu tinggi datar: **lǎo** nada 3, **shī** nada 1. Ketik **lao3shi1**.", en: "Low, then high and level: **lǎo** tone 3, **shī** tone 1. Type **lao3shi1**." }
  - id: d1-09-c6
    type: choice
    prompt: "Ada berapa pasangan nada untuk kata dua suku kata?"
    options: ["20", "16", "8"]
    answer: "20"
    why: { id: "Suku kata pertama punya 4 nada, suku kata kedua punya 4 nada ditambah nada netral: 4 × 5 = 20.", en: "The first syllable has 4 tones, the second has 4 tones plus the neutral tone: 4 × 5 = 20." }
glossary:
  - { zh: "今天", py: "jīntiān", id: "hari ini", en: "today", hsk: "1" }
  - { zh: "中国", py: "Zhōngguó", id: "Tiongkok", en: "China", hsk: "1" }
  - { zh: "学习", py: "xuéxí", id: "belajar", en: "to study", hsk: "1" }
  - { zh: "老师", py: "lǎoshī", id: "guru", en: "teacher", hsk: "1" }
  - { zh: "汉语", py: "Hànyǔ", id: "bahasa Mandarin", en: "Chinese (language)", hsk: "1" }
  - { zh: "朋友", py: "péngyou", id: "teman", en: "friend", hsk: "1" }
next: dasar1-10-membaca-pinyin
---

## concept.id

Kebanyakan kata Mandarin terdiri dari dua suku kata. Suku kata pertama punya salah satu dari empat nada. Suku kata kedua punya salah satu dari empat nada, atau nada netral. Jadi ada 4 × 5 = **20 pasangan**.

Ini semuanya, dengan kata HSK 1:

**1 +**: 今天 jīntiān (1 + 1), 中国 Zhōngguó (1 + 2), 身体 shēntǐ (1 + 3), 商店 shāngdiàn (1 + 4), 东西 dōngxi (1 + netral).

**2 +**: 明天 míngtiān (2 + 1), 学习 xuéxí (2 + 2), 牛奶 niúnǎi (2 + 3), 学校 xuéxiào (2 + 4), 朋友 péngyou (2 + netral).

**3 +**: 老师 lǎoshī (3 + 1), 小学 xiǎoxué (3 + 2), 水果 shuǐguǒ (3 + 3, diucapkan *shuíguǒ*), 考试 kǎoshì (3 + 4), 喜欢 xǐhuan (3 + netral).

**4 +**: 汽车 qìchē (4 + 1), 大学 dàxué (4 + 2), 汉语 Hànyǔ (4 + 3), 再见 zàijiàn (4 + 4), 谢谢 xièxie (4 + netral).

Perhatikan nada 3. Di depan suku kata lain, nada 3 cukup rendah saja, tidak naik lagi. Hanya di akhir, atau saat diucapkan sendiri, ia naik di ujungnya.

## concept.en

Most Mandarin words have two syllables. The first syllable has one of four tones. The second has one of four tones, or the neutral tone. That makes 4 × 5 = **20 pairs**.

Here they all are, with HSK 1 words:

**1 +**: 今天 jīntiān (1 + 1), 中国 Zhōngguó (1 + 2), 身体 shēntǐ (1 + 3), 商店 shāngdiàn (1 + 4), 东西 dōngxi (1 + neutral).

**2 +**: 明天 míngtiān (2 + 1), 学习 xuéxí (2 + 2), 牛奶 niúnǎi (2 + 3), 学校 xuéxiào (2 + 4), 朋友 péngyou (2 + neutral).

**3 +**: 老师 lǎoshī (3 + 1), 小学 xiǎoxué (3 + 2), 水果 shuǐguǒ (3 + 3, said *shuíguǒ*), 考试 kǎoshì (3 + 4), 喜欢 xǐhuan (3 + neutral).

**4 +**: 汽车 qìchē (4 + 1), 大学 dàxué (4 + 2), 汉语 Hànyǔ (4 + 3), 再见 zàijiàn (4 + 4), 谢谢 xièxie (4 + neutral).

Watch tone 3. Before another syllable, tone 3 just stays low and doesn't rise again. Only at the end, or said alone, does it rise at the tip.

## contrast.id

Dalam bahasa Indonesia, tekanan kata biasanya jatuh di suku kata kedua dari belakang, dan nadanya bebas. Dalam Mandarin, setiap suku kata membawa nadanya sendiri, jadi kata dua suku kata punya dua gerakan suara.

Kesalahan yang paling sering adalah menyamakan nada kedua dengan nada pertama, atau menaikkan nada 3 seperti nada 2: **lǎoshī** menjadi *láoshī*. Latih pasangannya satu per satu, seperti menghafal irama lagu. Setelah 20 pasangan ini terasa biasa, kata baru tinggal kamu pasangkan dengan irama yang sudah kamu kenal.

## contrast.en

In Indonesian, word stress usually falls on the second-to-last syllable, and the pitch is free. In Mandarin each syllable carries its own tone, so a two-syllable word has two voice movements.

The most common mistake is matching the second tone to the first, or raising tone 3 like tone 2: **lǎoshī** becomes *láoshī*. Practise the pairs one at a time, like learning the rhythm of a song. Once these 20 pairs feel normal, each new word just fits a rhythm you already know.
