---
id: easy1-02-pertanyaan
rung: easy-1
order: 2
status: draft
minutes: 8
title: { id: "Bertanya", en: "Asking questions", zh: "你 叫 什么 名字 ？", py: "nǐ jiào shénme míngzi ?" }
summary:
  id: "Tambahkan 吗 di akhir kalimat untuk bertanya ya atau tidak. Kata tanya (什么, 谁, 哪儿) tetap di tempat jawabannya."
  en: "Add 吗 at the end of a sentence for a yes-or-no question. Question words (什么, 谁, 哪儿) stay where the answer goes."
introduces: [g1-45, g1-46, g1-04, g1-33]
spiral: questions
worked:
  - { zh: "你 是 老师 。", py: "nǐ shì lǎoshī .", id: "Kamu guru.", en: "You're a teacher." }
  - { zh: "你 是 老师 [[吗]] ？", py: "nǐ shì lǎoshī [[ma]] ?", id: "Kamu guru?", en: "Are you a teacher?" }
  - { zh: "他 是 [[王 明]] 。", py: "tā shì [[Wáng Míng]] .", id: "Dia Wang Ming.", en: "He's Wang Ming." }
  - { zh: "他 是 [[谁]] ？", py: "tā shì [[shéi]] ?", id: "Dia siapa?", en: "Who is he?" }
examples:
  - zh: "你 是 学生 [[吗]] ？"
    py: "nǐ shì xuésheng [[ma]] ?"
    id: "Kamu pelajar?"
    en: "Are you a student?"
    note: { id: "Kalimat biasa + **吗**. Urutan kata tidak berubah.", en: "A plain sentence + **吗**. The word order doesn't change." }
  - zh: "你 叫 [[什么]] 名字 ？"
    py: "nǐ jiào [[shénme]] míngzi ?"
    id: "Siapa namamu?"
    en: "What's your name?"
    note: { id: "Kita bertanya *siapa* nama, Mandarin bertanya **什么** (apa) nama.", en: "Indonesian asks *siapa* (who) for a name; Mandarin asks **什么** (what)." }
  - zh: "他 是 [[谁]] ？"
    py: "tā shì [[shéi]] ?"
    id: "Dia siapa?"
    en: "Who is he?"
    note: { id: "**谁** juga sering dibaca **shuí**. Keduanya benar.", en: "**谁** is also often read **shuí**. Both are correct." }
  - zh: "你 是 [[哪]] 国 人 ？"
    py: "nǐ shì [[nǎ]] guó rén ?"
    id: "Kamu orang negara mana?"
    en: "Which country are you from?"
  - zh: "你 是 [[哪儿]] 人 ？"
    py: "nǐ shì [[nǎr]] rén ?"
    id: "Kamu orang mana?"
    en: "Where are you from?"
    note: { id: "**哪** (yang mana) dan **哪儿** (di mana) mirip. **儿** di akhir dibaca sebagai bunyi r.", en: "**哪** (which) and **哪儿** (where) look alike. The final **儿** is said as an r sound." }
pair:
  off: { zh: "什么 你 是 学生 ？", py: "shénme nǐ shì xuésheng ?" }
  natural: { zh: "你 是 学生 [[吗]] ？", py: "nǐ shì xuésheng [[ma]] ?" }
tone: { zh: "什么", py: "shénme", note: { id: "Nada 2 lalu nada netral: naik, lalu pendek dan ringan. **么** hampir tidak terdengar.", en: "Tone 2 then the neutral tone: rising, then short and light. **么** is barely heard." } }
hanzi: [吗, 什, 么, 谁, 哪, 儿, 名, 字, 国]
words:
  id: "*Apa* dalam *Apa kamu pelajar?* bukan **什么**. Untuk pertanyaan ya atau tidak, Mandarin memakai **吗** di akhir kalimat. **什么** hanya untuk *apa* yang menanyakan benda atau nama."
  en: "*Apa* in *Apa kamu pelajar?* is not **什么**. For yes-or-no questions, Mandarin puts **吗** at the end. **什么** is only the *apa* that asks for a thing or a name."
talk:
  lines:
    - { who: "张 丽", zh: "您 好 ！ 您 叫 什么 名字 ？", py: "nín hǎo ! nín jiào shénme míngzi ?", id: "Halo. Siapa nama Anda?", en: "Hello. What's your name?" }
    - { who: "Budi", zh: "我 叫 布迪 。", py: "wǒ jiào Bùdí .", id: "Nama saya Budi.", en: "My name is Budi." }
    - { who: "张 丽", zh: "您 是 哪 国 人 ？", py: "nín shì nǎ guó rén ?", id: "Anda orang negara mana?", en: "Which country are you from?" }
    - { who: "Budi", zh: "我 是 印尼人 。", py: "wǒ shì Yìnnírén .", id: "Saya orang Indonesia.", en: "I'm Indonesian." }
tirukan: { zh: "你 叫 什么 名字 ？", py: "nǐ jiào shénme míngzi ?", id: "Siapa namamu?", en: "What's your name?" }
check:
  - id: e1-02-c1
    type: gap
    cue: "Kamu guru?"
    prompt: "你 是 老师 ___ ？"
    options: ["吗", "什么", "谁"]
    answer: "吗"
    why: { id: "Pertanyaan ya atau tidak: kalimat biasa + **吗** di akhir.", en: "A yes-or-no question: a plain sentence + **吗** at the end." }
  - id: e1-02-c2
    type: fix
    wrong: "你 叫 什么 名字 吗 ？"
    options: ["你 叫 什么 名字 ？", "吗 你 叫 什么 名字 ？"]
    answer: "你 叫 什么 名字 ？"
    why: { id: "Kalimat yang sudah punya kata tanya (**什么**) tidak memakai **吗** lagi.", en: "A sentence that already has a question word (**什么**) doesn't take **吗** as well." }
  - id: e1-02-c3
    type: order
    cue: "Kamu orang negara mana?"
    tiles: ["国", "你", "人", "是", "哪"]
    answer: ["你", "是", "哪", "国", "人"]
    why: { id: "Kata tanya duduk di tempat jawabannya: 我是**印尼**人 → 你是**哪国**人.", en: "The question word sits where the answer goes: 我是**印尼**人 → 你是**哪国**人." }
  - id: e1-02-c4
    type: choice
    show_pinyin: false
    prompt: "Kata mana yang berarti *siapa*?"
    options: ["谁", "什么", "哪儿"]
    answer: "谁"
    why: { id: "**谁** (shéi) = siapa. **什么** = apa, **哪儿** = di mana.", en: "**谁** (shéi) = who. **什么** = what, **哪儿** = where." }
  - id: e1-02-c5
    type: listen
    audio: "你 叫 什么 名字 ？"
    options: ["Siapa namamu?", "Kamu orang mana?", "Kamu pelajar?"]
    answer: "Siapa namamu?"
    why: { id: "**叫什么名字**: bernama apa, yaitu *siapa namamu*.", en: "**叫什么名字**: called what name, that is *what's your name*." }
  - id: e1-02-c6
    type: trace
    char: "什"
    guide: on
    why: { id: "**什** = **亻** (orang) di kiri, lalu **十** di kanan. Kiri dulu, baru kanan.", en: "**什** = **亻** (person) on the left, then **十** on the right. Left first, then right." }
glossary:
  - { zh: "吗", py: "ma", id: "(partikel tanya ya/tidak)", en: "(yes-no question particle)", hsk: "1" }
  - { zh: "什么", py: "shénme", id: "apa", en: "what", hsk: "1" }
  - { zh: "谁", py: "shéi", id: "siapa", en: "who", hsk: "1" }
  - { zh: "哪", py: "nǎ", id: "yang mana", en: "which", hsk: "1" }
  - { zh: "哪儿", py: "nǎr", id: "di mana, mana", en: "where", hsk: "1" }
  - { zh: "名字", py: "míngzi", id: "nama", en: "name", mw: "个", hsk: "1" }
  - { zh: "国", py: "guó", id: "negara", en: "country", hsk: "1" }
  - { zh: "您", py: "nín", id: "Anda", en: "you (polite)", hsk: "1" }
  - { zh: "好", py: "hǎo", id: "baik", en: "good, well", hsk: "1" }
next: easy1-03-keluarga
---

## concept.id

Ada dua cara bertanya, dan keduanya tidak mengubah urutan kata.

Untuk pertanyaan ya atau tidak, ambil kalimat biasa dan tambahkan **吗** (ma) di akhir: **你是老师** (kamu guru) menjadi **你是老师吗？** (kamu guru?). Jawabannya cukup **是** (ya) atau **不是** (bukan).

Untuk pertanyaan dengan kata tanya, taruh kata tanya di tempat jawabannya nanti. **他是王明** → **他是谁？** **我叫丽娜** → **你叫什么名字？** **我是印尼人** → **你是哪国人？** Kata tanyanya: **什么** (apa), **谁** (siapa), **哪** (yang mana), **哪儿** (di mana).

Kalimat dengan kata tanya tidak memakai **吗** lagi. Pilih salah satu.

## concept.en

There are two ways to ask, and neither changes the word order.

For a yes-or-no question, take a plain sentence and add **吗** (ma) at the end: **你是老师** (you're a teacher) becomes **你是老师吗？** (are you a teacher?). The answer can be just **是** (yes) or **不是** (no).

For a question-word question, put the question word where the answer will go. **他是王明** → **他是谁？** **我叫丽娜** → **你叫什么名字？** **我是印尼人** → **你是哪国人？** The question words: **什么** (what), **谁** (who), **哪** (which), **哪儿** (where).

A sentence with a question word doesn't take **吗** as well. Use one or the other.

## contrast.id

Dalam obrolan sehari-hari, kita juga sering membiarkan kata tanya di tempatnya: *Dia siapa?*, *Kamu orang mana?* Mandarin selalu begitu. Itu memudahkan.

Tapi ada dua perbedaan. Bahasa Indonesia baku sering memindahkan kata tanya ke depan (*Siapa dia?*) atau memakai *apakah* di awal. Mandarin tidak punya *apakah* di awal: tanda tanya ya atau tidak adalah **吗** di akhir. Dan *apa* dalam *Apa kamu pelajar?* tidak diterjemahkan menjadi **什么**.

## contrast.en

In everyday Indonesian we often leave the question word in place too: *Dia siapa?*, *Kamu orang mana?* Mandarin always does this. That makes it easier.

But there are two differences. Formal Indonesian often moves the question word to the front (*Siapa dia?*) or starts with *apakah*. Mandarin has no *apakah* at the front: the yes-or-no marker is **吗** at the end. And the *apa* in *Apa kamu pelajar?* is not translated as **什么**.
