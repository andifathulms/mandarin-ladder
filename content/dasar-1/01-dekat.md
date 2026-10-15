---
id: dasar1-01-dekat
rung: dasar-1
order: 1
status: draft
minutes: 7
title: { id: "Mandarin lebih dekat dari yang kamu kira", en: "Mandarin is closer than you think", zh: "你 好 ！", py: "nǐ hǎo !" }
summary:
  id: "Kata kerja Mandarin tidak berubah karena waktu, kata benda tidak berubah karena jumlah, dan setiap suku kata ditulis dengan pinyin: awal, akhir, dan nada."
  en: "Mandarin verbs don't change with time, nouns don't change with number, and every syllable is written in pinyin: an initial, a final and a tone."
introduces: [d1-intro]
spiral: pinyin
visual: { id: syllable-builder, props: { initial: { initial: "m", final: "a", tone: 1 } } }
examples:
  - zh: "[[你 好]] ！"
    py: "[[nǐ hǎo]] !"
    id: "Halo!"
    en: "Hello!"
    note: { id: "Dua kata: **你** (kamu) dan **好** (baik). Salam yang paling umum.", en: "Two words: **你** (you) and **好** (good). The most common greeting." }
  - zh: "我 是 [[学生]] 。"
    py: "wǒ shì [[xuésheng]] ."
    id: "Aku pelajar."
    en: "I'm a student."
  - zh: "我们 是 [[学生]] 。"
    py: "wǒmen shì [[xuésheng]] ."
    id: "Kami pelajar."
    en: "We're students."
    note: { id: "**学生** tidak berubah walau orangnya banyak, sama seperti *pelajar* dalam *kami pelajar*.", en: "**学生** doesn't change for more than one person, just like *pelajar* in *kami pelajar*." }
  - zh: "我 [[明天]] 去 。"
    py: "wǒ [[míngtiān]] qù ."
    id: "Aku pergi besok."
    en: "I'm going tomorrow."
  - zh: "我 [[今天]] 去 。"
    py: "wǒ [[jīntiān]] qù ."
    id: "Aku pergi hari ini."
    en: "I'm going today."
    note: { id: "**去** (pergi) tetap **去**. Waktunya ada di **今天** dan **明天**, seperti *hari ini* dan *besok*.", en: "**去** (go) stays **去**. The time is in **今天** and **明天**, like *hari ini* and *besok*." }
pair:
  off: { zh: "我 是 学生们 。", py: "wǒ shì xuéshengmen ." }
  natural: { zh: "我 是 [[学生]] 。", py: "wǒ shì [[xuésheng]] ." }
tone: { zh: "你 好", py: "nǐ hǎo", note: { id: "Dua nada ketiga berurutan: yang pertama diucapkan naik. Pinyin tetap menulis **nǐ hǎo**; aplikasi ini menunjukkan perubahannya. Lebih lengkap di pelajaran 8.", en: "Two third tones in a row: the first is said rising. Pinyin still writes **nǐ hǎo**; the app shows the change. More in lesson 8." } }
words:
  id: "Kamu sudah tahu beberapa kata Mandarin lewat bahasa Hokkien, yang dibawa banyak keluarga Tionghoa ke Indonesia. Bunyinya berbeda, tapi karakternya sering sama."
  en: "You already know some Chinese words through Hokkien, which many Chinese families brought to Indonesia. The sounds differ, but the characters are often the same."
hokkien: [bakmi, angpao, cuan]
tirukan: { zh: "你 好 ！", py: "nǐ hǎo !", id: "Halo!", en: "Hello!" }
check:
  - id: d1-01-c1
    type: choice
    prompt: "Dalam pinyin **mā**, bagian mana yang menunjukkan nada?"
    options: ["tanda ¯ di atas a", "huruf m", "huruf a"]
    answer: "tanda ¯ di atas a"
    why: { id: "Tanda di atas vokal adalah nadanya. **m** adalah awal (inisial), **a** adalah akhir (final).", en: "The mark over the vowel is the tone. **m** is the initial, **a** the final." }
  - id: d1-01-c2
    type: tone
    audio: "syl-ma1"
    options: [[1], [3]]
    answer: [1]
    why: { id: "Nada pertama tinggi dan datar, seperti menahan satu nada saat bernyanyi.", en: "The first tone is high and level, like holding one note when you sing." }
  - id: d1-01-c3
    type: choice
    cue: "Apa artinya?"
    prompt: "我 明天 去 。"
    options: ["Aku pergi besok.", "Aku pergi kemarin.", "Aku sudah pergi."]
    answer: "Aku pergi besok."
    why: { id: "**明天** berarti besok. **去** tidak berubah: waktunya ada di kata **明天**.", en: "**明天** means tomorrow. **去** doesn't change: the time is in **明天**." }
  - id: d1-01-c4
    type: listen
    audio: "你 好 ！"
    options: ["Halo!", "Terima kasih!", "Sampai jumpa!"]
    answer: "Halo!"
    why: { id: "**你好** nǐ hǎo: halo.", en: "**你好** nǐ hǎo: hello." }
  - id: d1-01-c5
    type: fix
    wrong: "我们 是 学生们 。"
    options: ["我们 是 学生 。", "我 是 学生们 。"]
    answer: "我们 是 学生 。"
    why: { id: "**学生** tidak perlu tanda jamak: **我们** sudah menunjukkan banyak orang.", en: "**学生** needs no plural ending: **我们** already says there are several people." }
glossary:
  - { zh: "你", py: "nǐ", id: "kamu", en: "you", hsk: "1" }
  - { zh: "好", py: "hǎo", id: "baik", en: "good", hsk: "1" }
  - { zh: "我", py: "wǒ", id: "aku, saya", en: "I, me", hsk: "1" }
  - { zh: "我们", py: "wǒmen", id: "kami, kita", en: "we", hsk: "1" }
  - { zh: "学生", py: "xuésheng", id: "pelajar, murid", en: "student", hsk: "1" }
next: dasar1-02-empat-nada
---

## concept.id

Kabar baik dulu: dalam beberapa hal, bahasa Mandarin lebih mirip bahasa Indonesia daripada bahasa Inggris.

Kata kerja tidak berubah karena waktu. **去** (qù, pergi) tetap **去**, entah hari ini, besok, atau kemarin. Waktunya ditunjukkan oleh kata lain, seperti **今天** (hari ini) dan **明天** (besok), persis seperti *hari ini* dan *besok* dalam bahasa Indonesia.

Kata benda juga tidak berubah karena jumlah. **学生** (pelajar) tetap **学生**, satu atau banyak.

Bunyi Mandarin ditulis dengan **pinyin**, huruf Latin untuk Mandarin. Setiap suku kata punya tiga bagian: awal (inisial) seperti **m**, akhir (final) seperti **a**, dan **nada**, tanda kecil di atas vokal. **mā** dan **mǎ** adalah dua kata berbeda. Nada adalah bagian dari kata, bukan hiasan.

## concept.en

Good news first: in some ways Mandarin is closer to Indonesian than English is.

Verbs don't change with time. **去** (qù, go) stays **去**, today, tomorrow or yesterday. Other words carry the time, like **今天** (today) and **明天** (tomorrow), just like *hari ini* and *besok* in Indonesian.

Nouns don't change with number either. **学生** (student) stays **学生**, one or many.

Mandarin sounds are written in **pinyin**, Latin letters for Mandarin. Every syllable has three parts: an initial like **m**, a final like **a**, and a **tone**, the small mark over the vowel. **mā** and **mǎ** are two different words. The tone is part of the word, not decoration.

## contrast.id

Penutur bahasa Indonesia kadang menambahkan **们** (men) pada setiap kata benda jamak, seperti akhiran *-s* dalam bahasa Inggris. Mandarin hampir tidak pernah melakukannya untuk benda, dan untuk orang pun biasanya tidak perlu. **我们是学生** sudah berarti *kami pelajar*.

Satu batas yang jujur: Mandarin memang tidak punya akhiran waktu, tapi punya kata kecil seperti **了** yang menunjukkan sesuatu sudah terjadi. Itu mirip *sudah*, tapi tidak sama persis. Kamu akan bertemu dengannya di Easy 1.

## contrast.en

Indonesian speakers sometimes add **们** (men) to every plural noun, like English *-s*. Mandarin almost never does this for things, and usually doesn't need it for people either. **我们是学生** already means *we're students*.

One honest limit: Mandarin has no tense endings, but it has small words like **了** that show something has happened. It's similar to *sudah*, but not the same. You'll meet it in Easy 1.
