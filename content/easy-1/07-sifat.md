---
id: easy1-07-sifat
rung: easy-1
order: 7
status: draft
minutes: 8
title: { id: "Kata sifat", en: "Describing words", zh: "我 很 忙 。", py: "wǒ hěn máng ." }
summary:
  id: "Kata sifat tidak memakai 是. Dalam kalimat biasa, pakai 很 di depannya: 我很忙. Untuk bertanya, bisa 忙不忙?"
  en: "Adjectives don't take 是. In a plain statement, put 很 in front: 我很忙. To ask, you can say 忙不忙?"
introduces: [g1-09, g1-30, g1-48]
spiral: word-order
worked:
  - { zh: "我 [[很]] 忙 。", py: "wǒ [[hěn]] máng .", id: "Aku sibuk.", en: "I'm busy." }
  - { zh: "我 [[不]] 忙 。", py: "wǒ [[bù]] máng .", id: "Aku tidak sibuk.", en: "I'm not busy." }
  - { zh: "你 忙 [[吗]] ？", py: "nǐ máng [[ma]] ?", id: "Kamu sibuk?", en: "Are you busy?" }
  - { zh: "你 忙 [[不 忙]] ？", py: "nǐ máng [[bù máng]] ?", id: "Kamu sibuk atau tidak?", en: "Are you busy or not?" }
examples:
  - zh: "我 [[很]] 忙 。"
    py: "wǒ [[hěn]] máng ."
    id: "Aku sibuk."
    en: "I'm busy."
    note: { id: "Di sini **很** hampir tidak berarti *sangat*. Ia hanya membuat kalimat terdengar lengkap.", en: "Here **很** hardly means *very*. It just makes the sentence sound complete." }
  - zh: "这 本 书 [[非常]] 好看 。"
    py: "zhè běn shū [[fēicháng]] hǎokàn ."
    id: "Buku ini sangat bagus."
    en: "This book is really good."
    note: { id: "Kalau kamu memang ingin berkata *sangat*, pakai **非常**.", en: "If you really mean *very*, use **非常**." }
  - zh: "他 [[不]] 高 。"
    py: "tā [[bù]] gāo ."
    id: "Dia tidak tinggi."
    en: "He isn't tall."
    note: { id: "Dengan **不**, **很** tidak diperlukan.", en: "With **不**, **很** isn't needed." }
  - zh: "你 忙 [[不 忙]] ？"
    py: "nǐ máng [[bù máng]] ?"
    id: "Kamu sibuk atau tidak?"
    en: "Are you busy?"
    note: { id: "Kata sifat + **不** + kata sifat sama dengan **吗**. Jangan tambahkan **吗** lagi.", en: "Adjective + **不** + adjective works like **吗**. Don't add **吗** as well." }
  - zh: "那 个 学校 [[真]] 大 。"
    py: "nà gè xuéxiào [[zhēn]] dà ."
    id: "Sekolah itu besar sekali."
    en: "That school is really big."
  - zh: "王 老师 的 女儿 [[最]] 小 。"
    py: "Wáng lǎoshī de nǚ'ér [[zuì]] xiǎo ."
    id: "Anak perempuan Pak Wang yang paling kecil."
    en: "Teacher Wang's daughter is the youngest."
pair:
  off: { zh: "我 是 忙 。", py: "wǒ shì máng ." }
  natural: { zh: "我 [[很]] 忙 。", py: "wǒ [[hěn]] máng ." }
tone: { zh: "很 好", py: "hěn hǎo", note: { id: "Ditulis nada 3 + nada 3. Diucapkan **hén hǎo**: nada 3 pertama naik seperti nada 2. Aplikasi menunjukkan perubahan ini, kamu tidak perlu menulisnya.", en: "Written tone 3 + tone 3. Said **hén hǎo**: the first tone 3 rises like tone 2. The app shows this change; you don't write it." } }
hanzi: [很, 忙, 好, 大, 小, 高, 非, 常, 真, 最, 看]
words:
  id: "**很** biasanya diterjemahkan *sangat*, tapi dalam **我很忙** artinya hanya *aku sibuk*. Kalau kamu menghapus **很**, kalimatnya terdengar seperti perbandingan yang belum selesai: *aku sibuk (tapi dia tidak)*."
  en: "**很** is usually translated *very*, but in **我很忙** it just means *I'm busy*. If you drop **很**, the sentence sounds like an unfinished comparison: *I'm busy (but he isn't)*."
talk:
  lines:
    - { who: "李 华", zh: "安迪 ， 你 忙 不 忙 ？", py: "Āndí , nǐ máng bù máng ?", id: "Andi, kamu sibuk?", en: "Andi, are you busy?" }
    - { who: "Andi", zh: "我 很 忙 。 你 忙 吗 ？", py: "wǒ hěn máng . nǐ máng ma ?", id: "Aku sibuk. Kamu sibuk?", en: "I'm busy. Are you?" }
    - { who: "李 华", zh: "我 不 忙 。 我们 一起 吃饭 ， 好 不 好 ？", py: "wǒ bù máng . wǒmen yìqǐ chīfàn , hǎo bù hǎo ?", id: "Aku tidak sibuk. Kita makan bareng, ya?", en: "I'm not busy. Shall we eat together?" }
    - { who: "Andi", zh: "好 。", py: "hǎo .", id: "Oke.", en: "OK." }
tirukan: { zh: "我 很 忙 ， 你 忙 不 忙 ？", py: "wǒ hěn máng , nǐ máng bù máng ?", id: "Aku sibuk, kamu sibuk?", en: "I'm busy, are you?" }
check:
  - id: e1-07-c1
    type: fix
    wrong: "他 是 高 。"
    options: ["他 很 高 。", "他 高 是 。"]
    answer: "他 很 高 。"
    why: { id: "Kata sifat tidak memakai **是**. Pakai **很**: **他很高**.", en: "Adjectives don't take **是**. Use **很**: **他很高**." }
  - id: e1-07-c2
    type: gap
    cue: "Aku tidak sibuk."
    prompt: "我 ___ 忙 。"
    options: ["不", "很", "是"]
    answer: "不"
    why: { id: "*Tidak* sebelum kata sifat = **不**. Tanpa **很**.", en: "*Not* before an adjective = **不**. No **很**." }
  - id: e1-07-c3
    type: order
    cue: "Buku ini sangat bagus."
    tiles: ["好看", "书", "非常", "这", "本"]
    answer: ["这", "本", "书", "非常", "好看"]
    why: { id: "**这本书** dulu, lalu **非常** + kata sifat.", en: "**这本书** first, then **非常** + adjective." }
  - id: e1-07-c4
    type: choice
    prompt: "Mana yang berarti *Kamu sibuk?*"
    options: ["你 忙 不 忙 ？", "你 不 忙 。", "你 很 忙 。"]
    answer: "你 忙 不 忙 ？"
    why: { id: "**忙不忙** bertanya ya atau tidak, seperti **忙吗**. Dua yang lain adalah pernyataan.", en: "**忙不忙** asks yes or no, like **忙吗**. The other two are statements." }
  - id: e1-07-c5
    type: listen
    audio: "我 妈妈 很 忙 。"
    options: ["Mamaku sibuk.", "Mamaku tidak sibuk.", "Mamaku tinggi."]
    answer: "Mamaku sibuk."
    why: { id: "**很忙** = sibuk. *Tidak sibuk* adalah **不忙**, *tinggi* adalah **高**.", en: "**很忙** = busy. *Not busy* is **不忙**, *tall* is **高**." }
  - id: e1-07-c6
    type: trace
    char: "小"
    guide: on
    why: { id: "**小** dimulai dari garis tengah yang berkait, lalu titik kiri, lalu titik kanan.", en: "**小** starts with the hooked middle stroke, then the left dot, then the right dot." }
glossary:
  - { zh: "很", py: "hěn", id: "(sebelum kata sifat); sangat", en: "(before adjectives); very", hsk: "1" }
  - { zh: "非常", py: "fēicháng", id: "sangat", en: "extremely, very", hsk: "1" }
  - { zh: "真", py: "zhēn", id: "sungguh, sekali", en: "really", hsk: "1" }
  - { zh: "最", py: "zuì", id: "paling", en: "most", hsk: "1" }
  - { zh: "忙", py: "máng", id: "sibuk", en: "busy", hsk: "1" }
  - { zh: "好", py: "hǎo", id: "baik; oke", en: "good; OK", hsk: "1" }
  - { zh: "好看", py: "hǎokàn", id: "bagus, cantik (dilihat)", en: "good-looking, nice", hsk: "1" }
  - { zh: "大", py: "dà", id: "besar", en: "big", hsk: "1" }
  - { zh: "小", py: "xiǎo", id: "kecil", en: "small", hsk: "1" }
  - { zh: "高", py: "gāo", id: "tinggi", en: "tall, high", hsk: "1" }
  - { zh: "学校", py: "xuéxiào", id: "sekolah", en: "school", mw: "个", hsk: "1" }
  - { zh: "我们", py: "wǒmen", id: "kami, kita", en: "we", hsk: "1" }
  - { zh: "一起", py: "yìqǐ", id: "bersama", en: "together", hsk: "1" }
  - { zh: "吃饭", py: "chīfàn", id: "makan", en: "to eat (a meal)", hsk: "1" }
next: easy1-08-waktu
---

## concept.id

Di pelajaran 1, **是** menyambung dua kata benda: **我是学生**. Untuk kata sifat, **是** tidak dipakai. *Aku sibuk* bukan **我是忙**.

Dalam kalimat biasa, taruh **很** (hěn) di depan kata sifat: **我很忙**, **他很高**. **很** di sini lemah, hampir tidak berarti *sangat*. Ia membuat kalimat terdengar selesai. Kalau kamu memang ingin *sangat*, pakai **非常** atau **真**. **最** berarti *paling*.

Untuk negatif, pakai **不** tanpa **很**: **我不忙**.

Untuk bertanya, ada dua cara: **你忙吗？** atau **你忙不忙？** (sibuk, tidak sibuk?). Cara kedua tidak memakai **吗**. **好不好？** di akhir kalimat berarti *ya?* atau *bagaimana?*, untuk mengajak.

## concept.en

In lesson 1, **是** joined two nouns: **我是学生**. Adjectives don't take **是**. *I'm busy* isn't **我是忙**.

In a plain statement, put **很** (hěn) before the adjective: **我很忙**, **他很高**. Here **很** is weak and hardly means *very*. It makes the sentence sound finished. If you really mean *very*, use **非常** or **真**. **最** means *most*.

For the negative, use **不** without **很**: **我不忙**.

To ask, there are two ways: **你忙吗？** or **你忙不忙？** (busy, not busy?). The second takes no **吗**. **好不好？** at the end of a sentence means *OK?*, for suggestions.

## contrast.id

Di sini bahasa Indonesia justru membantu. Kita juga tidak berkata *aku adalah sibuk*. Kata sifat langsung mengikuti orangnya, tanpa *adalah*. Mandarin sama: tidak ada **是**.

Batasnya: bahasa Indonesia cukup *aku sibuk*, tanpa kata tambahan. Mandarin biasa menambahkan **很**, walaupun artinya bukan *sangat*. Jadi **我很忙** diterjemahkan *aku sibuk*, bukan *aku sangat sibuk*.

## contrast.en

Here Indonesian actually helps. We don't say *aku adalah sibuk* either. The adjective follows the person directly, with no *adalah*. Mandarin is the same: no **是**.

The limit: Indonesian is happy with just *aku sibuk*, with nothing extra. Mandarin normally adds **很**, even though it doesn't mean *very*. So **我很忙** translates as *I'm busy*, not *I'm very busy*.
