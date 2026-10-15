---
id: easy1-03-keluarga
rung: easy-1
order: 3
status: draft
minutes: 8
title: { id: "Keluarga", en: "Family", zh: "我 的 家人", py: "wǒ de jiārén" }
summary:
  id: "Pemilik dulu, lalu 的, lalu bendanya: 我的妈妈, kebalikan dari *mama saya*. 这 dan 那 untuk ini dan itu, 都 untuk semua."
  en: "Owner first, then 的, then the thing: 我的妈妈, the reverse of Indonesian *mama saya*. 这 and 那 for this and that, 都 for all."
introduces: [g1-20, g1-27, g1-06, g1-10]
spiral: word-order
worked:
  - { zh: "妈妈", py: "māma", id: "mama", en: "mum" }
  - { zh: "我 [[的]] 妈妈", py: "wǒ [[de]] māma", id: "mama saya", en: "my mum" }
  - { zh: "王 老师 [[的]] 学生", py: "Wáng lǎoshī [[de]] xuésheng", id: "murid Pak Wang", en: "Teacher Wang's student" }
  - { zh: "[[这]] 是 我 的 妈妈 。", py: "[[zhè]] shì wǒ de māma .", id: "Ini mama saya.", en: "This is my mum." }
examples:
  - zh: "这 是 我 [[的]] 妈妈 。"
    py: "zhè shì wǒ [[de]] māma ."
    id: "Ini mama saya."
    en: "This is my mum."
    note: { id: "Urutannya terbalik dari bahasa Indonesia: **我的妈妈** = saya + 的 + mama.", en: "The order is the reverse of Indonesian: **我的妈妈** = I + 的 + mum." }
  - zh: "那 是 [[我 爸爸]] 。"
    py: "nà shì [[wǒ bàba]] ."
    id: "Itu papa saya."
    en: "That's my dad."
    note: { id: "Untuk keluarga dan orang dekat, **的** sering dilewati: **我爸爸**, **我妈妈**. Untuk benda, **的** biasanya tetap ada: **我的书**.", en: "For family and close people, **的** is often dropped: **我爸爸**, **我妈妈**. For things, **的** usually stays: **我的书**." }
  - zh: "他们 [[都]] 是 我 的 哥哥 。"
    py: "tāmen [[dōu]] shì wǒ de gēge ."
    id: "Mereka semua kakak laki-lakiku."
    en: "They're all my older brothers."
    note: { id: "**都** (semua) berdiri sebelum kata kerja, seperti **也**.", en: "**都** (all) goes before the verb, like **也**." }
  - zh: "[[这]] 是 谁 的 书 ？"
    py: "[[zhè]] shì shéi de shū ?"
    id: "Ini buku siapa?"
    en: "Whose book is this?"
    note: { id: "**这** (zhè) = ini, **那** (nà) = itu. **谁的** = milik siapa.", en: "**这** (zhè) = this, **那** (nà) = that. **谁的** = whose." }
  - zh: "那 是 李 华 的 [[女儿]] 。"
    py: "nà shì Lǐ Huá de [[nǚ'ér]] ."
    id: "Itu anak perempuan Li Hua."
    en: "That's Li Hua's daughter."
pair:
  off: { zh: "妈妈 我 。", py: "māma wǒ ." }
  natural: { zh: "我 [[的]] 妈妈 。", py: "wǒ [[de]] māma ." }
tone: { zh: "妈妈", py: "māma", note: { id: "Nada 1 lalu nada netral: tinggi datar, lalu pendek dan ringan. Jangan tertukar dengan **吗** ma, yang hanya nada netral.", en: "Tone 1 then the neutral tone: high and level, then short and light. Don't mix it up with **吗** ma, which is only the neutral tone." } }
hanzi: [的, 妈, 爸, 哥, 姐, 弟, 妹, 这, 那, 都]
words:
  id: "*Kakak* dan *adik* dalam bahasa Indonesia tidak menyebut laki-laki atau perempuan. Mandarin selalu menyebut keduanya: **哥哥** kakak laki-laki, **姐姐** kakak perempuan, **弟弟** adik laki-laki, **妹妹** adik perempuan. Kalau kamu memanggil *koko* atau *cici*, kamu sudah dekat."
  en: "Indonesian *kakak* and *adik* don't say male or female. Mandarin always says both: **哥哥** older brother, **姐姐** older sister, **弟弟** younger brother, **妹妹** younger sister. If you say *koko* or *cici*, you're already close."
hokkien: [koko, cici]
talk:
  lines:
    - { who: "Andi", zh: "这 是 谁 ？", py: "zhè shì shéi ?", id: "Ini siapa?", en: "Who's this?" }
    - { who: "Siti", zh: "这 是 我 的 妈妈 。 那 是 我 爸爸 。", py: "zhè shì wǒ de māma . nà shì wǒ bàba .", id: "Ini mamaku. Itu papaku.", en: "This is my mum. That's my dad." }
    - { who: "Andi", zh: "他们 都 是 老师 吗 ？", py: "tāmen dōu shì lǎoshī ma ?", id: "Mereka berdua guru?", en: "Are they both teachers?" }
    - { who: "Siti", zh: "是 ， 他们 都 是 老师 。", py: "shì , tāmen dōu shì lǎoshī .", id: "Ya, mereka berdua guru.", en: "Yes, they're both teachers." }
tirukan: { zh: "这 是 我 的 妈妈 。", py: "zhè shì wǒ de māma .", id: "Ini mama saya.", en: "This is my mum." }
check:
  - id: e1-03-c1
    type: order
    cue: "Ini kakak perempuanku."
    tiles: ["姐姐", "的", "这", "是", "我"]
    answer: ["这", "是", "我", "的", "姐姐"]
    why: { id: "Pemilik dulu, lalu **的**, lalu orangnya: **我的姐姐**.", en: "The owner first, then **的**, then the person: **我的姐姐**." }
  - id: e1-03-c2
    type: fix
    wrong: "这 是 妈妈 我 。"
    options: ["这 是 我 的 妈妈 。", "这 是 妈妈 的 我 。"]
    answer: "这 是 我 的 妈妈 。"
    why: { id: "Bukan urutan *mama saya*. Dalam Mandarin pemilik selalu di depan: **我的妈妈**.", en: "Not the Indonesian order *mama saya*. In Mandarin the owner always comes first: **我的妈妈**." }
  - id: e1-03-c3
    type: gap
    cue: "Mereka semua pelajar."
    prompt: "他们 ___ 是 学生 。"
    options: ["都", "的", "这"]
    answer: "都"
    why: { id: "**都** (semua) sebelum kata kerja **是**.", en: "**都** (all) before the verb **是**." }
  - id: e1-03-c4
    type: choice
    show_pinyin: false
    prompt: "Kata mana yang berarti *adik laki-laki*?"
    options: ["弟弟", "哥哥", "妹妹"]
    answer: "弟弟"
    why: { id: "**弟弟** dìdi = adik laki-laki. **哥哥** = kakak laki-laki, **妹妹** = adik perempuan (ada **女** di kirinya).", en: "**弟弟** dìdi = younger brother. **哥哥** = older brother, **妹妹** = younger sister (with **女** on its left)." }
  - id: e1-03-c5
    type: listen
    audio: "那 是 我 的 哥哥 。"
    options: ["Itu kakak laki-lakiku.", "Itu adik laki-lakiku.", "Ini papaku."]
    answer: "Itu kakak laki-lakiku."
    why: { id: "**那** = itu, **哥哥** gēge = kakak laki-laki.", en: "**那** = that, **哥哥** gēge = older brother." }
  - id: e1-03-c6
    type: trace
    char: "妈"
    guide: on
    why: { id: "**妈** = **女** (perempuan) di kiri dan **马** (mǎ, bunyinya) di kanan. Tulis **女** dulu.", en: "**妈** = **女** (woman) on the left and **马** (mǎ, the sound) on the right. Write **女** first." }
glossary:
  - { zh: "的", py: "de", id: "(penanda milik)", en: "(possessive marker)", hsk: "1" }
  - { zh: "妈妈", py: "māma", id: "mama, ibu", en: "mum, mother", mw: "个", hsk: "1" }
  - { zh: "爸爸", py: "bàba", id: "papa, ayah", en: "dad, father", mw: "个", hsk: "1" }
  - { zh: "哥哥", py: "gēge", id: "kakak laki-laki", en: "older brother", mw: "个", hsk: "1" }
  - { zh: "姐姐", py: "jiějie", id: "kakak perempuan", en: "older sister", mw: "个", hsk: "1" }
  - { zh: "弟弟", py: "dìdi", id: "adik laki-laki", en: "younger brother", mw: "个", hsk: "1" }
  - { zh: "妹妹", py: "mèimei", id: "adik perempuan", en: "younger sister", mw: "个", hsk: "1" }
  - { zh: "女儿", py: "nǚ'ér", id: "anak perempuan", en: "daughter", mw: "个", hsk: "1" }
  - { zh: "家人", py: "jiārén", id: "keluarga, anggota keluarga", en: "family members", hsk: "1" }
  - { zh: "这", py: "zhè", id: "ini", en: "this", hsk: "1" }
  - { zh: "那", py: "nà", id: "itu", en: "that", hsk: "1" }
  - { zh: "都", py: "dōu", id: "semua, semuanya", en: "all, both", hsk: "1" }
  - { zh: "他们", py: "tāmen", id: "mereka", en: "they", hsk: "1" }
  - { zh: "书", py: "shū", id: "buku", en: "book", mw: "本", hsk: "1" }
next: easy1-04-angka-umur
---

## concept.id

Dalam bahasa Indonesia, pemilik datang sesudah bendanya: *mama saya*, *buku Rina*. Dalam Mandarin urutannya terbalik. Pemilik dulu, lalu **的** (de), lalu bendanya: **我的妈妈** (mama saya), **丽娜的书** (buku Rina), **王老师的学生** (murid Pak Wang).

Aturan ini berlaku untuk semua keterangan di depan kata benda, bukan hanya milik. Apa pun yang menerangkan, duduk di depan.

Untuk keluarga dan orang dekat, **的** sering dilewati: **我爸爸**, **我妈妈**, **我哥哥**. Untuk benda, biasanya **的** tetap ada.

**这** (zhè) berarti *ini*, **那** (nà) berarti *itu*. **都** (dōu) berarti *semua* dan berdiri sebelum kata kerja: **他们都是老师**, mereka semua guru.

## concept.en

In Indonesian the owner comes after the thing: *mama saya*, *buku Rina*. In Mandarin the order is reversed. The owner first, then **的** (de), then the thing: **我的妈妈** (my mum), **丽娜的书** (Rina's book), **王老师的学生** (Teacher Wang's student).

This holds for anything that describes a noun, not only owners. Whatever describes it sits in front.

For family and close people, **的** is often dropped: **我爸爸**, **我妈妈**, **我哥哥**. For things, **的** usually stays.

**这** (zhè) means *this*, **那** (nà) means *that*. **都** (dōu) means *all* and goes before the verb: **他们都是老师**, they're all teachers.

## contrast.id

Ini salah satu kebiasaan yang paling sulit dibalik. Telinga kita ingin *mama saya*, jadi mulut ingin **妈妈我**. Ingat saja: dalam Mandarin, yang menerangkan selalu di depan.

Ada satu kemiripan yang membantu: *-nya* dalam *bukunya Rina* juga menghubungkan benda dengan pemiliknya, sedikit seperti **的**. Tapi urutannya tetap terbalik. Mandarin berkata **丽娜的书**: pemilik dulu, **的** di tengah, benda di akhir.

## contrast.en

This is one of the hardest habits to reverse. Our ears want *mama saya*, so our mouths want **妈妈我**. Just remember: in Mandarin, whatever describes always comes first.

One thing helps: the *-nya* in *bukunya Rina* also links a thing to its owner, a little like **的**. But the order is still reversed. Mandarin says **丽娜的书**: the owner first, **的** in the middle, the thing last.
