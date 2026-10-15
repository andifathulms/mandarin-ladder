---
id: easy1-04-angka-umur
rung: easy-1
order: 4
status: draft
minutes: 8
title: { id: "Angka dan umur", en: "Numbers and age", zh: "你 多 大 ？", py: "nǐ duō dà ?" }
summary:
  id: "Angka 1 sampai 99 disusun seperti bahasa Indonesia: 二十五 = dua puluh lima. Umur memakai 岁, tanpa 是: 我二十岁."
  en: "Numbers 1 to 99 are built like Indonesian: 二十五 = two tens five. Age uses 岁, without 是: 我二十岁."
introduces: [g1-07, g1-23]
spiral: numbers
worked:
  - { zh: "[[十一]]", py: "[[shíyī]]", id: "11 = sepuluh + satu", en: "11 = ten + one" }
  - { zh: "[[二十]]", py: "[[èrshí]]", id: "20 = dua × sepuluh", en: "20 = two × ten" }
  - { zh: "[[二十五]]", py: "[[èrshíwǔ]]", id: "25 = dua puluh lima", en: "25 = twenty-five" }
  - { zh: "[[九十九]]", py: "[[jiǔshíjiǔ]]", id: "99 = sembilan puluh sembilan", en: "99 = ninety-nine" }
  - { zh: "我 二十 [[岁]] 。", py: "wǒ èrshí [[suì]] .", id: "Aku dua puluh tahun.", en: "I'm twenty." }
examples:
  - zh: "你 [[几]] 岁 ？"
    py: "nǐ [[jǐ]] suì ?"
    id: "Umurmu berapa? (kepada anak)"
    en: "How old are you? (to a child)"
    note: { id: "**几** menanyakan angka kecil, kira-kira di bawah sepuluh. Karena itu **几岁** dipakai untuk anak-anak.", en: "**几** asks about a small number, roughly under ten. That's why **几岁** is used for children." }
  - zh: "我 女儿 [[八]] 岁 。"
    py: "wǒ nǚ'ér [[bā]] suì ."
    id: "Anak perempuanku umur delapan tahun."
    en: "My daughter is eight."
    note: { id: "Tidak ada **是** di depan umur: **她八岁**, dia delapan tahun.", en: "No **是** before an age: **她八岁**, she's eight." }
  - zh: "你 [[多 大]] ？"
    py: "nǐ [[duō dà]] ?"
    id: "Umurmu berapa?"
    en: "How old are you?"
    note: { id: "**多大** (seberapa besar) untuk teman sebaya dan orang dewasa muda.", en: "**多大** (how big) for peers and young adults." }
  - zh: "我 [[二十五]] 岁 。"
    py: "wǒ [[èrshíwǔ]] suì ."
    id: "Aku dua puluh lima tahun."
    en: "I'm twenty-five."
  - zh: "我 爸爸 [[五十六]] 岁 。"
    py: "wǒ bàba [[wǔshíliù]] suì ."
    id: "Papaku lima puluh enam tahun."
    en: "My dad is fifty-six."
pair:
  off: { zh: "我 二十 年 。", py: "wǒ èrshí nián ." }
  natural: { zh: "我 二十 [[岁]] 。", py: "wǒ èrshí [[suì]] ." }
tone: { zh: "几 岁", py: "jǐ suì", note: { id: "Nada 3 lalu nada 4. Di depan suku kata lain, nada 3 cukup rendah saja, lalu **岁** turun tajam.", en: "Tone 3 then tone 4. Before another syllable, tone 3 is just low, then **岁** falls sharply." } }
hanzi: [一, 二, 三, 四, 五, 六, 七, 八, 九, 十, 几, 岁]
words:
  id: "*Dua puluh tahun* bukan **二十年**. **年** adalah tahun sebagai lama waktu atau tahun kalender. Untuk umur, Mandarin memakai **岁** suì: **二十岁**."
  en: "*Twenty years old* is not **二十年**. **年** is a year as a length of time or a calendar year. For age, Mandarin uses **岁** suì: **二十岁**."
hokkien: [cepek]
talk:
  lines:
    - { who: "王 明", zh: "丽娜 ， 你 多 大 ？", py: "Lìnà , nǐ duō dà ?", id: "Rina, umurmu berapa?", en: "Rina, how old are you?" }
    - { who: "Rina", zh: "我 二十二 岁 。 你 弟弟 几 岁 ？", py: "wǒ èrshí'èr suì . nǐ dìdi jǐ suì ?", id: "Aku dua puluh dua. Adikmu umur berapa?", en: "I'm twenty-two. How old is your little brother?" }
    - { who: "王 明", zh: "我 弟弟 七 岁 。", py: "wǒ dìdi qī suì .", id: "Adikku tujuh tahun.", en: "My little brother is seven." }
tirukan: { zh: "你 多 大 ？ 我 二十 岁 。", py: "nǐ duō dà ? wǒ èrshí suì .", id: "Umurmu berapa? Aku dua puluh tahun.", en: "How old are you? I'm twenty." }
check:
  - id: e1-04-c1
    type: gap
    cue: "Aku dua puluh tahun."
    prompt: "我 二十 ___ 。"
    options: ["岁", "年", "大"]
    answer: "岁"
    why: { id: "Umur memakai **岁**, bukan **年**.", en: "Age uses **岁**, not **年**." }
  - id: e1-04-c2
    type: choice
    show_pinyin: false
    prompt: "Bagaimana menulis **35**?"
    options: ["三十五", "五十三", "三五"]
    answer: "三十五"
    why: { id: "Tiga, sepuluh, lima: **三十五**, persis seperti *tiga puluh lima*.", en: "Three, ten, five: **三十五**, just like *thirty-five*." }
  - id: e1-04-c3
    type: choice
    prompt: "Kamu bertanya umur teman sekelas di kampus. Mana yang pas?"
    options: ["你 多 大 ？", "你 几 岁 ？"]
    answer: "你 多 大 ？"
    why: { id: "**几岁** untuk anak-anak. Kepada teman sebaya, tanyakan **多大**.", en: "**几岁** is for children. Ask a peer **多大**." }
  - id: e1-04-c4
    type: listen
    audio: "我 爸爸 六十 岁 。"
    options: ["Papaku enam puluh tahun.", "Papaku enam belas tahun.", "Papaku enam tahun."]
    answer: "Papaku enam puluh tahun."
    why: { id: "**六十** = enam × sepuluh = 60. Enam belas adalah **十六**: sepuluh dulu, baru enam.", en: "**六十** = six × ten = 60. Sixteen is **十六**: ten first, then six." }
  - id: e1-04-c5
    type: order
    cue: "Adik laki-lakiku sembilan tahun."
    tiles: ["岁", "我", "九", "弟弟"]
    answer: ["我", "弟弟", "九", "岁"]
    why: { id: "Orangnya dulu, lalu angka + **岁**. Tidak perlu **是**.", en: "The person first, then the number + **岁**. No **是** needed." }
  - id: e1-04-c6
    type: trace
    char: "岁"
    guide: on
    why: { id: "**岁** = **山** di atas, lalu **夕** di bawah. Atas dulu, baru bawah.", en: "**岁** = **山** on top, then **夕** below. Top first, then bottom." }
glossary:
  - { zh: "一", py: "yī", id: "satu", en: "one", hsk: "1" }
  - { zh: "二", py: "èr", id: "dua", en: "two", hsk: "1" }
  - { zh: "三", py: "sān", id: "tiga", en: "three", hsk: "1" }
  - { zh: "四", py: "sì", id: "empat", en: "four", hsk: "1" }
  - { zh: "五", py: "wǔ", id: "lima", en: "five", hsk: "1" }
  - { zh: "六", py: "liù", id: "enam", en: "six", hsk: "1" }
  - { zh: "七", py: "qī", id: "tujuh", en: "seven", hsk: "1" }
  - { zh: "八", py: "bā", id: "delapan", en: "eight", hsk: "1" }
  - { zh: "九", py: "jiǔ", id: "sembilan", en: "nine", hsk: "1" }
  - { zh: "十", py: "shí", id: "sepuluh", en: "ten", hsk: "1" }
  - { zh: "几", py: "jǐ", id: "berapa (angka kecil)", en: "how many (small numbers)", hsk: "1" }
  - { zh: "岁", py: "suì", id: "tahun (umur)", en: "years old", hsk: "1" }
  - { zh: "多", py: "duō", id: "banyak; seberapa", en: "many; how", hsk: "1" }
  - { zh: "大", py: "dà", id: "besar; tua (umur)", en: "big; old (age)", hsk: "1" }
  - { zh: "年", py: "nián", id: "tahun", en: "year", hsk: "1" }
next: easy1-05-penggolong-1
---

## concept.id

Kalau kamu bisa menghitung sampai sepuluh, kamu sudah bisa menghitung sampai 99. Mandarin menyusun angka seperti bahasa Indonesia.

**十一** (sepuluh satu) = 11, **十二** = 12, dan seterusnya. **二十** (dua sepuluh) = 20, **二十五** (dua sepuluh lima) = 25, **九十九** = 99. Tidak ada kata khusus seperti *belas*: sebelas sampai sembilan belas cukup **十** + angka.

Untuk umur, pakai angka + **岁** (suì). Kalimatnya tidak memakai **是**: **我二十岁**, aku dua puluh tahun.

Untuk bertanya, ada dua cara. **你几岁？** untuk anak-anak, karena **几** menanyakan angka kecil. **你多大？** untuk teman sebaya. Kepada orang yang jauh lebih tua, nanti ada bentuk yang lebih sopan.

## concept.en

If you can count to ten, you can count to 99. Mandarin builds numbers like Indonesian.

**十一** (ten one) = 11, **十二** = 12, and so on. **二十** (two ten) = 20, **二十五** (two ten five) = 25, **九十九** = 99. There's no special word like *belas* (-teen): eleven to nineteen are just **十** + a number.

For age, use a number + **岁** (suì). The sentence has no **是**: **我二十岁**, I'm twenty.

To ask, there are two ways. **你几岁？** for children, because **几** asks about a small number. **你多大？** for peers. For people much older than you, a more polite form comes later.

## contrast.id

Puluhan dalam Mandarin persis seperti bahasa Indonesia: *dua puluh lima* = **二十五**. Belasan malah lebih mudah: tidak ada *belas*, cukup **十** dulu. Hati-hati dengan **十六** (16) dan **六十** (60): yang di depan **十** adalah berapa puluhnya.

Tapi umur berbeda. Kita berkata *dua puluh tahun*, dan *tahun* juga dipakai untuk lama waktu. Mandarin memisahkannya: **岁** untuk umur, **年** untuk tahun lainnya.

## contrast.en

Tens in Mandarin are just like Indonesian: *dua puluh lima* = **二十五**. The teens are even easier: there's no *belas*, just **十** first. Watch **十六** (16) and **六十** (60): what comes before **十** says how many tens.

Age is different, though. Indonesian says *dua puluh tahun*, and *tahun* is also used for lengths of time. Mandarin keeps them apart: **岁** for age, **年** for other years.
