---
id: easy1-14-bisa
rung: easy-1
order: 14
status: draft
minutes: 8
title: { id: "Bisa", en: "Can", zh: "我 会 说 汉语", py: "wǒ huì shuō Hànyǔ" }
summary:
  id: "Bahasa Indonesia punya satu *bisa*; Mandarin punya dua. 会 untuk kemampuan yang dipelajari, 能 untuk bisa karena keadaan atau waktu."
  en: "Indonesian has one *bisa*; Mandarin has two. 会 for a skill you learned, 能 for being able because of circumstances or time."
introduces: [g1-02]
spiral: word-order
worked:
  - { zh: "我 [[会]] 说 汉语 。", py: "wǒ [[huì]] shuō Hànyǔ .", id: "Aku bisa berbahasa Mandarin.", en: "I can speak Chinese." }
  - { zh: "我 今天 [[能]] 来 。", py: "wǒ jīntiān [[néng]] lái .", id: "Hari ini aku bisa datang.", en: "I can come today." }
  - { zh: "我 [[不 会]] 开车 。", py: "wǒ [[bú huì]] kāichē .", id: "Aku tidak bisa menyetir.", en: "I can't drive." }
examples:
  - zh: "西蒂 [[会]] 唱 中文 歌 。"
    py: "Xīdì [[huì]] chàng Zhōngwén gē ."
    id: "Siti bisa menyanyi lagu Mandarin."
    en: "Siti can sing Chinese songs."
  - zh: "你 [[会]] 写 汉字 吗 ？"
    py: "nǐ [[huì]] xiě Hànzì ma ?"
    id: "Kamu bisa menulis karakter Mandarin?"
    en: "Can you write Chinese characters?"
    note: { id: "Menulis karakter itu kemampuan yang dipelajari: **会**.", en: "Writing characters is a learned skill: **会**." }
  - zh: "明天 你 [[能]] 来 吗 ？"
    py: "míngtiān nǐ [[néng]] lái ma ?"
    id: "Besok kamu bisa datang?"
    en: "Can you come tomorrow?"
  - zh: "我 很 忙 ， 今天 [[不 能]] 去 。"
    py: "wǒ hěn máng , jīntiān [[bù néng]] qù ."
    id: "Aku sibuk, hari ini tidak bisa pergi."
    en: "I'm busy, I can't go today."
    note: { id: "Tidak bisa karena keadaan: **不能**.", en: "Can't because of circumstances: **不能**." }
  - zh: "他 会 说 汉语 ， 也 [[会]] 说 印尼语 。"
    py: "tā huì shuō Hànyǔ , yě [[huì]] shuō Yìnníyǔ ."
    id: "Dia bisa berbahasa Mandarin, juga bisa berbahasa Indonesia."
    en: "He speaks Chinese, and Indonesian too."
  - zh: "我 的 手机 [[不 能]] 上网 。"
    py: "wǒ de shǒujī [[bù néng]] shàngwǎng ."
    id: "Ponselku tidak bisa dipakai internetan."
    en: "My phone can't get online."
pair:
  off: { zh: "我 能 写 汉字 。", py: "wǒ néng xiě Hànzì ." }
  natural: { zh: "我 [[会]] 写 汉字 。", py: "wǒ [[huì]] xiě Hànzì ." }
tone: { zh: "汉语", py: "Hànyǔ", note: { id: "Nada 4 lalu nada 3: turun tajam, lalu rendah. Di akhir kalimat, **yǔ** boleh naik sedikit.", en: "Tone 4 then tone 3: a sharp fall, then low. At the end of a sentence **yǔ** may rise a little." } }
hanzi: [会, 能, 汉, 语, 说, 写, 开, 车, 歌]
words:
  id: "**不会** tidak selalu berarti *tidak bisa*. **他不会来** biasanya berarti *dia tidak akan datang*: dugaan, bukan kemampuan. Untuk *dia tidak bisa datang*, pakai **他不能来**."
  en: "**不会** doesn't always mean *can't*. **他不会来** usually means *he won't come*: a guess, not an ability. For *he can't come*, use **他不能来**."
talk:
  lines:
    - { who: "王 明", zh: "你 会 说 汉语 吗 ？", py: "nǐ huì shuō Hànyǔ ma ?", id: "Kamu bisa berbahasa Mandarin?", en: "Do you speak Chinese?" }
    - { who: "Andi", zh: "会 一点儿 。 我 也 会 写 汉字 。", py: "huì yìdiǎnr . wǒ yě huì xiě Hànzì .", id: "Sedikit. Aku juga bisa menulis karakter.", en: "A little. I can write characters too." }
    - { who: "王 明", zh: "明天 你 能 来 学校 吗 ？", py: "míngtiān nǐ néng lái xuéxiào ma ?", id: "Besok kamu bisa datang ke sekolah?", en: "Can you come to school tomorrow?" }
    - { who: "Andi", zh: "不 能 ， 明天 我 很 忙 。", py: "bù néng , míngtiān wǒ hěn máng .", id: "Tidak bisa, besok aku sibuk.", en: "I can't, I'm busy tomorrow." }
tirukan: { zh: "我 会 说 一点儿 汉语 。", py: "wǒ huì shuō yìdiǎnr Hànyǔ .", id: "Aku bisa sedikit bahasa Mandarin.", en: "I speak a little Chinese." }
check:
  - id: e1-14-c1
    type: gap
    cue: "Aku bisa menyetir (sudah belajar)."
    prompt: "我 ___ 开车 。"
    options: ["会", "能", "想"]
    answer: "会"
    why: { id: "Menyetir itu kemampuan yang dipelajari: **会**.", en: "Driving is a learned skill: **会**." }
  - id: e1-14-c2
    type: gap
    cue: "Maaf, besok aku tidak bisa datang."
    prompt: "明天 我 ___ 来 。"
    options: ["不 能", "不 会", "没"]
    answer: "不 能"
    why: { id: "Tidak bisa karena keadaan: **不能**. **不会来** berarti *tidak akan datang*.", en: "Can't because of circumstances: **不能**. **不会来** means *won't come*." }
  - id: e1-14-c3
    type: choice
    prompt: "**他 不 会 来 。** artinya…"
    options: ["Dia tidak akan datang.", "Dia tidak bisa menyetir.", "Dia kemarin tidak datang."]
    answer: "Dia tidak akan datang."
    why: { id: "**会** + kata kerja juga bisa berarti *akan*: dugaan tentang nanti.", en: "**会** + verb can also mean *will*: a guess about later." }
  - id: e1-14-c4
    type: order
    cue: "Kamu bisa menulis karakter Mandarin?"
    tiles: ["汉字", "你", "写", "会", "吗"]
    answer: ["你", "会", "写", "汉字", "吗"]
    why: { id: "**会** sebelum kata kerja, **吗** di akhir.", en: "**会** before the verb, **吗** at the end." }
  - id: e1-14-c5
    type: listen
    audio: "他 会 说 汉语 ， 也 会 说 印尼语 。"
    options: ["Dia bisa berbahasa Mandarin dan juga bahasa Indonesia.", "Dia ingin belajar bahasa Mandarin.", "Dia tidak bisa berbahasa Indonesia."]
    answer: "Dia bisa berbahasa Mandarin dan juga bahasa Indonesia."
    why: { id: "**会说汉语**, **也会说印尼语**: dua bahasa.", en: "**会说汉语**, **也会说印尼语**: two languages." }
  - id: e1-14-c6
    type: trace
    char: "会"
    guide: on
    why: { id: "**会** = **人** di atas, **云** di bawah. Tulis atap **人** dulu, lalu dua garis datar, lalu bagian bawahnya.", en: "**会** = **人** on top, **云** below. Write the **人** roof first, then the two horizontals, then the bottom part." }
glossary:
  - { zh: "会", py: "huì", id: "bisa (karena belajar); akan", en: "can (learned); will", hsk: "1" }
  - { zh: "能", py: "néng", id: "bisa, dapat (karena keadaan)", en: "can, be able to", hsk: "1" }
  - { zh: "说", py: "shuō", id: "berbicara, berkata", en: "to speak, to say", hsk: "1" }
  - { zh: "汉语", py: "Hànyǔ", id: "bahasa Mandarin", en: "Chinese (language)", hsk: "1" }
  - { zh: "中文", py: "Zhōngwén", id: "bahasa Mandarin, bahasa Tionghoa", en: "Chinese (language)", hsk: "1" }
  - { zh: "写", py: "xiě", id: "menulis", en: "to write", hsk: "1" }
  - { zh: "汉字", py: "Hànzì", id: "karakter Mandarin", en: "Chinese character", mw: "个", hsk: "1" }
  - { zh: "开车", py: "kāichē", id: "menyetir", en: "to drive", hsk: "1" }
  - { zh: "唱", py: "chàng", id: "menyanyi", en: "to sing", hsk: "1" }
  - { zh: "歌", py: "gē", id: "lagu", en: "song", hsk: "1" }
  - { zh: "上网", py: "shàngwǎng", id: "internetan", en: "to go online", hsk: "1" }
  - { zh: "一点儿", py: "yìdiǎnr", id: "sedikit", en: "a little", hsk: "1" }
  - { zh: "忙", py: "máng", id: "sibuk", en: "busy", hsk: "1" }
  - { zh: "今天", py: "jīntiān", id: "hari ini", en: "today", hsk: "1" }
next: easy1-15-pergi-datang
---

## concept.id

Bahasa Indonesia memakai *bisa* untuk semuanya. Mandarin membaginya dua.

**会** (huì) untuk kemampuan yang kamu dapat dari belajar: bahasa, menyetir, menyanyi, menulis karakter. **我会说汉语**, **我会开车**.

**能** (néng) untuk bisa atau tidak bisa karena keadaan: waktu, tenaga, alat, izin. **明天你能来吗？** **我的手机不能上网.**

Keduanya duduk sebelum kata kerja, dan sangkalannya **不**: **不会**, **不能**. Ingat **不** sebelum nada 4: **不会** bú huì, tapi **不能** bù néng.

## concept.en

Indonesian uses *bisa* for everything. Mandarin splits it in two.

**会** (huì) is for skills you got by learning: languages, driving, singing, writing characters. **我会说汉语**, **我会开车**.

**能** (néng) is for can or can't because of circumstances: time, energy, a device, permission. **明天你能来吗？** **我的手机不能上网.**

Both go before the verb, and both are negated with **不**: **不会**, **不能**. Remember **不** before tone 4: **不会** bú huì, but **不能** bù néng.

## contrast.id

Tanya dirimu: apakah aku *sudah belajar* ini (**会**), atau apakah *keadaannya memungkinkan* (**能**)? *Aku bisa berenang* adalah **会**. *Aku bisa datang jam tiga* adalah **能**.

Batasnya: kadang keduanya mungkin. **我能写汉字** tidak salah, tapi terdengar seperti *tanganku sanggup menulis*, bukan *aku sudah belajar menulis*. Untuk izin, Mandarin juga punya kata lain, **可以**, nanti di Easy 2.

## contrast.en

Ask yourself: have I *learned* this (**会**), or do the *circumstances allow* it (**能**)? *I can swim* is **会**. *I can come at three* is **能**.

The limit: sometimes both work. **我能写汉字** isn't wrong, but it sounds like *my hand is able to write*, not *I've learned to write*. For permission Mandarin also has another word, **可以**, in Easy 2.
