---
id: easy1-01-perkenalan
rung: easy-1
order: 1
status: draft
minutes: 8
title: { id: "Perkenalan", en: "Introductions", zh: "你 好 ！", py: "nǐ hǎo !" }
summary:
  id: "是 menyambung dua kata benda (我是学生). 叫 untuk nama, 也 untuk juga. Tidak ada akhiran yang berubah."
  en: "是 joins two nouns (我是学生). 叫 for names, 也 for also. Nothing changes its ending."
introduces: [g1-36, g1-05, g1-24, g1-32, g1-13]
spiral: word-order
worked:
  - { zh: "我 [[叫]] 丽娜 。", py: "wǒ [[jiào]] Lìnà .", id: "Namaku Rina.", en: "My name is Rina." }
  - { zh: "我 [[是]] 印尼人 。", py: "wǒ [[shì]] Yìnnírén .", id: "Aku orang Indonesia.", en: "I'm Indonesian." }
  - { zh: "我 [[是]] 学生 。", py: "wǒ [[shì]] xuésheng .", id: "Aku pelajar.", en: "I'm a student." }
examples:
  - zh: "你 好 ！ 我 [[叫]] 王 明 。"
    py: "nǐ hǎo ! wǒ [[jiào]] Wáng Míng ."
    id: "Halo! Namaku Wang Ming."
    en: "Hello! My name is Wang Ming."
    note: { id: "**叫** jiào: bernama. Nama keluarga Tionghoa di depan: **王** Wáng, lalu nama diri **明** Míng.", en: "**叫** jiào: to be called. Chinese family names come first: **王** Wáng, then the given name **明** Míng." }
  - zh: "我 [[是]] 中国 人 。"
    py: "wǒ [[shì]] Zhōngguó rén ."
    id: "Aku orang Tiongkok."
    en: "I'm Chinese."
  - zh: "她 [[是]] 印尼人 。"
    py: "tā [[shì]] Yìnnírén ."
    id: "Dia (perempuan) orang Indonesia."
    en: "She's Indonesian."
    note: { id: "**他** dan **她** sama-sama dibaca **tā**. Hanya tulisannya yang membedakan laki-laki dan perempuan.", en: "**他** and **她** are both read **tā**. Only the writing tells he from she." }
  - zh: "他 是 老师 ， 我 [[也]] 是 老师 。"
    py: "tā shì lǎoshī , wǒ [[yě]] shì lǎoshī ."
    id: "Dia guru, aku juga guru."
    en: "He's a teacher, and I'm a teacher too."
    note: { id: "**也** (juga) berdiri sebelum kata kerja: **我也是**, bukan *我是也*.", en: "**也** (also) goes before the verb: **我也是**, not *我是也*." }
  - zh: "认识 你 很 [[高兴]] 。"
    py: "rènshi nǐ hěn [[gāoxìng]] ."
    id: "Senang berkenalan denganmu."
    en: "Nice to meet you."
pair:
  off: { zh: "我 学生 。", py: "wǒ xuésheng ." }
  natural: { zh: "我 [[是]] 学生 。", py: "wǒ [[shì]] xuésheng ." }
tone: { zh: "老师", py: "lǎoshī", note: { id: "Nada 3 lalu nada 1: turun rendah, lalu tinggi datar. Di depan suku kata lain, nada 3 cukup diucapkan rendah saja.", en: "Tone 3 then tone 1: down low, then high and level. Before another syllable, tone 3 is just said low." } }
hanzi: [我, 你, 是, 他, 她, 叫, 人, 老, 师, 也]
words:
  id: "**是** shì bukan *adalah* dalam semua kalimat. *Aku senang* tidak memakai **是**: itu nanti di pelajaran 7."
  en: "**是** shì isn't *adalah* in every sentence. *I'm happy* doesn't use **是**: that comes in lesson 7."
hokkien: [gua, lu]
talk:
  lines:
    - { who: "Rina", zh: "你 好 ！ 我 叫 丽娜 。", py: "nǐ hǎo ! wǒ jiào Lìnà .", id: "Halo! Namaku Rina.", en: "Hello! I'm Rina." }
    - { who: "李 华", zh: "你 好 ！ 我 叫 李 华 。 你 是 学生 吗 ？", py: "nǐ hǎo ! wǒ jiào Lǐ Huá . nǐ shì xuésheng ma ?", id: "Halo! Namaku Li Hua. Kamu pelajar?", en: "Hello! I'm Li Hua. Are you a student?" }
    - { who: "Rina", zh: "是 ， 我 是 学生 。 认识 你 很 高兴 。", py: "shì , wǒ shì xuésheng . rènshi nǐ hěn gāoxìng .", id: "Ya, aku pelajar. Senang berkenalan.", en: "Yes, I'm a student. Nice to meet you." }
tirukan: { zh: "我 叫 丽娜 ， 我 是 印尼人 。", py: "wǒ jiào Lìnà , wǒ shì Yìnnírén .", id: "Namaku Rina, aku orang Indonesia.", en: "I'm Rina, I'm Indonesian." }
check:
  - id: e1-01-c1
    type: gap
    cue: "Aku pelajar."
    prompt: "我 ___ 学生 。"
    options: ["是", "叫", "也"]
    answer: "是"
    why: { id: "**是** menyambung dua kata benda: aku = pelajar.", en: "**是** joins two nouns: I = student." }
  - id: e1-01-c2
    type: order
    cue: "Dia juga guru."
    tiles: ["老师", "是", "他", "也"]
    answer: ["他", "也", "是", "老师"]
    why: { id: "**也** sebelum kata kerja **是**: 他也是老师.", en: "**也** before the verb **是**: 他也是老师." }
  - id: e1-01-c3
    type: choice
    show_pinyin: false
    prompt: "Kata mana yang berarti *dia (perempuan)*?"
    options: ["她", "他", "你"]
    answer: "她"
    why: { id: "**她** punya komponen **女** (perempuan). **他** punya **亻** (orang).", en: "**她** has the component **女** (woman). **他** has **亻** (person)." }
  - id: e1-01-c4
    type: fix
    wrong: "我 是 也 印尼人 。"
    options: ["我 也 是 印尼人 。", "我 是 印尼人 也 。"]
    answer: "我 也 是 印尼人 。"
    why: { id: "**也** selalu sebelum kata kerja, tidak sesudahnya.", en: "**也** always comes before the verb, never after it." }
  - id: e1-01-c5
    type: listen
    audio: "我 叫 王 明 。"
    options: ["Namaku Wang Ming.", "Aku guru.", "Aku orang Tiongkok."]
    answer: "Namaku Wang Ming."
    why: { id: "**叫** jiào + nama: namaku …", en: "**叫** jiào + a name: my name is …" }
  - id: e1-01-c6
    type: trace
    char: "人"
    guide: on
    why: { id: "**人** dua goresan: sapuan kiri dulu, lalu sapuan kanan.", en: "**人** has two strokes: the left-falling one first, then the right-falling one." }
glossary:
  - { zh: "你", py: "nǐ", id: "kamu", en: "you", hsk: "1" }
  - { zh: "我", py: "wǒ", id: "aku, saya", en: "I, me", hsk: "1" }
  - { zh: "他", py: "tā", id: "dia (laki-laki)", en: "he, him", hsk: "1" }
  - { zh: "她", py: "tā", id: "dia (perempuan)", en: "she, her", hsk: "1" }
  - { zh: "是", py: "shì", id: "adalah, ya", en: "to be, yes", hsk: "1" }
  - { zh: "叫", py: "jiào", id: "bernama, memanggil", en: "to be called", hsk: "1" }
  - { zh: "人", py: "rén", id: "orang", en: "person", hsk: "1" }
  - { zh: "中国", py: "Zhōngguó", id: "Tiongkok", en: "China", hsk: "1" }
  - { zh: "老师", py: "lǎoshī", id: "guru", en: "teacher", hsk: "1" }
  - { zh: "学生", py: "xuésheng", id: "pelajar, murid", en: "student", hsk: "1" }
  - { zh: "也", py: "yě", id: "juga", en: "also", hsk: "1" }
  - { zh: "认识", py: "rènshi", id: "kenal", en: "to know (someone)", hsk: "1" }
  - { zh: "高兴", py: "gāoxìng", id: "senang", en: "glad, happy", hsk: "1" }
next: easy1-02-pertanyaan
---

## concept.id

Untuk memperkenalkan diri, kamu cukup tiga kata kerja kecil.

**叫** (jiào) untuk nama: **我叫丽娜**, namaku Rina. **是** (shì) menyambung dua kata benda, seperti *adalah*: **我是学生**, aku (adalah) pelajar. **也** (yě) berarti *juga*, dan selalu duduk tepat sebelum kata kerja: **我也是学生**.

Seperti bahasa Indonesia, tidak ada yang berubah bentuk. **我**, **你**, **他** tetap sama sebagai pelaku atau sasaran, dan **是** tetap **是** untuk aku, kamu, atau mereka. Dalam bahasa Inggris ada *I am, you are, he is*; dalam Mandarin cukup **是**.

## concept.en

To introduce yourself you need three small verbs.

**叫** (jiào) for names: **我叫丽娜**, my name is Rina. **是** (shì) joins two nouns, like *adalah*: **我是学生**, I'm a student. **也** (yě) means *also*, and always sits right before the verb: **我也是学生**.

As in Indonesian, nothing changes form. **我**, **你**, **他** stay the same as subject or object, and **是** stays **是** for I, you or they. English has *I am, you are, he is*; Mandarin just has **是**.

## contrast.id

Dalam bahasa Indonesia sehari-hari, *adalah* sering dilewati: *aku pelajar*. Dalam Mandarin, **是** di antara dua kata benda tidak boleh hilang. **我学生** terdengar putus.

Tapi hati-hati ke arah sebaliknya: **是** hanya untuk kata benda. Untuk sifat (*aku sibuk*), Mandarin tidak memakai **是**. Itu pelajaran 7.

## contrast.en

In everyday Indonesian, *adalah* is often left out: *aku pelajar*. In Mandarin, **是** between two nouns can't go missing. **我学生** sounds cut off.

But watch the other direction: **是** is only for nouns. For qualities (*I'm busy*), Mandarin doesn't use **是**. That's lesson 7.
