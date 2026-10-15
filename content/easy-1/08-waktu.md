---
id: easy1-08-waktu
rung: easy-1
order: 8
status: draft
minutes: 9
title: { id: "Waktu", en: "Time", zh: "现在 几 点 ？", py: "xiànzài jǐ diǎn ?" }
summary:
  id: "Hari, tanggal dan jam. Waktu berdiri sebelum kata kerja: 我明天上课, bukan *aku ada kelas besok* dengan urutan kita."
  en: "Days, dates and clock times. Time goes before the verb: 我明天上课, not the Indonesian order with *besok* at the end."
introduces: [g1-44, g1-28, g1-12]
spiral: time-place
worked:
  - { zh: "星期 [[一]]", py: "xīngqī [[yī]]", id: "Senin (hari ke-1)", en: "Monday (day 1)" }
  - { zh: "星期 [[六]]", py: "xīngqī [[liù]]", id: "Sabtu (hari ke-6)", en: "Saturday (day 6)" }
  - { zh: "[[星期天]]", py: "[[xīngqītiān]]", id: "Minggu", en: "Sunday" }
  - { zh: "十 月 十六 [[号]]", py: "shí yuè shíliù [[hào]]", id: "16 Oktober", en: "16 October" }
  - { zh: "八 [[点]]", py: "bā [[diǎn]]", id: "jam delapan", en: "eight o'clock" }
  - { zh: "八 点 [[半]]", py: "bā diǎn [[bàn]]", id: "jam setengah sembilan (08.30)", en: "half past eight (8:30)" }
examples:
  - zh: "我 [[明天]] 上课 。"
    py: "wǒ [[míngtiān]] shàngkè ."
    id: "Besok aku ada kelas."
    en: "I have class tomorrow."
    note: { id: "Waktu sebelum kata kerja. **明天我上课** juga benar: waktu boleh di depan orangnya.", en: "Time before the verb. **明天我上课** is also right: time can go before the person." }
  - zh: "我们 [[星期 六]] 见 。"
    py: "wǒmen [[xīngqī liù]] jiàn ."
    id: "Kita ketemu hari Sabtu."
    en: "See you on Saturday."
  - zh: "他 [[八 点 半]] 上班 。"
    py: "tā [[bā diǎn bàn]] shàngbān ."
    id: "Dia mulai kerja jam setengah sembilan."
    en: "He starts work at half past eight."
    note: { id: "**八点半** = 08.30, yang dalam bahasa Indonesia disebut *setengah sembilan*.", en: "**八点半** = 8:30, which Indonesian calls *setengah sembilan* (half nine)." }
  - zh: "今天 是 十 月 十六 [[号]] 。"
    py: "jīntiān shì shí yuè shíliù [[hào]] ."
    id: "Hari ini tanggal 16 Oktober."
    en: "Today is 16 October."
    note: { id: "Bulan dulu, baru tanggal: **十月十六号**. Bulan cukup angka + **月**.", en: "Month first, then the date: **十月十六号**. A month is just a number + **月**." }
  - zh: "我 晚上 [[常常]] 看 书 。"
    py: "wǒ wǎnshang [[chángcháng]] kàn shū ."
    id: "Malam hari aku sering membaca buku."
    en: "I often read in the evening."
    note: { id: "**常常** (sering) juga sebelum kata kerja.", en: "**常常** (often) also goes before the verb." }
  - zh: "[[现在]] 几 点 ？"
    py: "[[xiànzài]] jǐ diǎn ?"
    id: "Sekarang jam berapa?"
    en: "What time is it now?"
pair:
  off: { zh: "我 上课 明天 。", py: "wǒ shàngkè míngtiān ." }
  natural: { zh: "我 [[明天]] 上课 。", py: "wǒ [[míngtiān]] shàngkè ." }
tone: { zh: "几 点", py: "jǐ diǎn", note: { id: "Ditulis nada 3 + nada 3. Diucapkan **jí diǎn**: **几** naik seperti nada 2. Sama seperti **你好**.", en: "Written tone 3 + tone 3. Said **jí diǎn**: **几** rises like tone 2. The same as **你好**." } }
hanzi: [星, 期, 月, 号, 点, 半, 现, 今, 明, 天, 午, 晚]
words:
  id: "Hati-hati dengan *setengah*. Kita berkata *setengah sembilan* untuk 08.30, setengah jam menuju jam sembilan. Mandarin menghitung dari jam yang sudah lewat: **八点半**, jam delapan lebih setengah. Jadi **八点半** bukan *setengah delapan*."
  en: "Watch out for *setengah* (half). Indonesian says *setengah sembilan* (half nine) for 8:30, half an hour to nine. Mandarin counts from the hour already passed: **八点半**, eight and a half. So **八点半** is not *setengah delapan* (7:30)."
talk:
  lines:
    - { who: "王 明", zh: "丽娜 ， 你 星期 六 上课 吗 ？", py: "Lìnà , nǐ xīngqī liù shàngkè ma ?", id: "Rina, hari Sabtu kamu ada kelas?", en: "Rina, do you have class on Saturday?" }
    - { who: "Rina", zh: "不 上课 。", py: "bú shàngkè .", id: "Tidak ada.", en: "No, I don't." }
    - { who: "王 明", zh: "我们 星期 六 下午 三 点 见 ， 好 不 好 ？", py: "wǒmen xīngqī liù xiàwǔ sān diǎn jiàn , hǎo bù hǎo ?", id: "Kita ketemu hari Sabtu jam tiga sore, ya?", en: "Shall we meet on Saturday at three in the afternoon?" }
    - { who: "Rina", zh: "好 ， 星期 六 见 。", py: "hǎo , xīngqī liù jiàn .", id: "Oke, sampai ketemu hari Sabtu.", en: "OK, see you on Saturday." }
tirukan: { zh: "我 明天 八 点 半 上课 。", py: "wǒ míngtiān bā diǎn bàn shàngkè .", id: "Besok aku ada kelas jam setengah sembilan.", en: "Tomorrow I have class at half past eight." }
check:
  - id: e1-08-c1
    type: order
    cue: "Aku mulai kerja jam sembilan pagi."
    tiles: ["上班", "我", "九", "点", "上午"]
    answer: ["我", "上午", "九", "点", "上班"]
    accept: [["上午", "九", "点", "我", "上班"]]
    why: { id: "Waktu sebelum kata kerja. Yang besar dulu: **上午** (pagi), lalu **九点**.", en: "Time before the verb. The bigger unit first: **上午** (morning), then **九点**." }
  - id: e1-08-c2
    type: fix
    wrong: "我 上课 星期 一 。"
    options: ["我 星期 一 上课 。", "星期 一 上课 我 。"]
    answer: "我 星期 一 上课 。"
    why: { id: "Waktu tidak di akhir kalimat. Taruh sebelum kata kerja: **我星期一上课**.", en: "Time doesn't go at the end. Put it before the verb: **我星期一上课**." }
  - id: e1-08-c3
    type: choice
    show_pinyin: false
    cue: "Jam berapa ini?"
    prompt: "八 点 半"
    options: ["08.30", "07.30", "08.15"]
    answer: "08.30"
    why: { id: "**八点半** = jam delapan lebih setengah = 08.30, *setengah sembilan* dalam bahasa Indonesia.", en: "**八点半** = eight and a half = 8:30, *setengah sembilan* in Indonesian." }
  - id: e1-08-c4
    type: listen
    audio: "今天 星期 三 。"
    options: ["Hari ini Rabu.", "Hari ini Selasa.", "Hari ini Kamis."]
    answer: "Hari ini Rabu."
    why: { id: "**星期三** = hari ke-3 dari Senin: Rabu.", en: "**星期三** = day 3 counting from Monday: Wednesday." }
  - id: e1-08-c5
    type: gap
    cue: "Malam hari aku sering membaca buku."
    prompt: "我 晚上 ___ 看 书 。"
    options: ["常常", "现在", "明天"]
    answer: "常常"
    why: { id: "*Sering* = **常常**, sebelum kata kerja.", en: "*Often* = **常常**, before the verb." }
  - id: e1-08-c6
    type: trace
    char: "月"
    guide: on
    why: { id: "**月** dimulai dengan sapuan kiri yang panjang, lalu sisi kanan yang berkait, lalu dua garis datar di dalam.", en: "**月** starts with the long left-falling stroke, then the hooked right side, then the two horizontals inside." }
glossary:
  - { zh: "星期", py: "xīngqī", id: "minggu; hari (dalam minggu)", en: "week; day of the week", mw: "个", hsk: "1" }
  - { zh: "星期天", py: "xīngqītiān", id: "hari Minggu", en: "Sunday", hsk: "1" }
  - { zh: "月", py: "yuè", id: "bulan", en: "month", mw: "个", hsk: "1" }
  - { zh: "号", py: "hào", id: "tanggal; nomor", en: "date; number", hsk: "1" }
  - { zh: "点", py: "diǎn", id: "jam (pukul)", en: "o'clock", hsk: "1" }
  - { zh: "半", py: "bàn", id: "setengah", en: "half", hsk: "1" }
  - { zh: "现在", py: "xiànzài", id: "sekarang", en: "now", hsk: "1" }
  - { zh: "明天", py: "míngtiān", id: "besok", en: "tomorrow", hsk: "1" }
  - { zh: "上午", py: "shàngwǔ", id: "pagi (sampai siang)", en: "morning", hsk: "1" }
  - { zh: "下午", py: "xiàwǔ", id: "sore", en: "afternoon", hsk: "1" }
  - { zh: "晚上", py: "wǎnshang", id: "malam", en: "evening", hsk: "1" }
  - { zh: "上课", py: "shàngkè", id: "masuk kelas, ada kelas", en: "to have class", hsk: "1" }
  - { zh: "上班", py: "shàngbān", id: "masuk kerja", en: "to go to work", hsk: "1" }
  - { zh: "常常", py: "chángcháng", id: "sering", en: "often", hsk: "1" }
  - { zh: "看", py: "kàn", id: "melihat; membaca", en: "to look; to read", hsk: "1" }
  - { zh: "见", py: "jiàn", id: "bertemu", en: "to see, to meet", hsk: "1" }
next: easy1-09-tempat
---

## concept.id

Hari dalam seminggu cukup dihitung: **星期一** (hari ke-1) adalah Senin, **星期二** Selasa, sampai **星期六** Sabtu. Minggu adalah **星期天** atau **星期日**.

Tanggal disusun dari yang besar ke yang kecil: bulan, lalu tanggal. **十月十六号** = 16 Oktober. Bulan cukup angka + **月**: **一月** Januari, **十月** Oktober.

Jam memakai **点**: **八点** jam delapan, **八点半** 08.30. Untuk bertanya: **现在几点？**

Yang paling penting: waktu berdiri **sebelum kata kerja**. **我明天上课**, besok aku ada kelas. **他八点半上班**. Kata seperti **常常** (sering) juga di sana: **我晚上常常看书**. Waktu boleh juga di awal kalimat (**明天我上课**), tapi tidak di akhir.

Satu kata lagi: **再** (lagi). Kamu sudah tahu dari **再见**: lagi + bertemu, sampai jumpa.

## concept.en

Days of the week are simply counted: **星期一** (day 1) is Monday, **星期二** Tuesday, up to **星期六** Saturday. Sunday is **星期天** or **星期日**.

Dates go from big to small: month, then day. **十月十六号** = 16 October. A month is just a number + **月**: **一月** January, **十月** October.

Clock times use **点**: **八点** eight o'clock, **八点半** 8:30. To ask: **现在几点？**

Most important: time goes **before the verb**. **我明天上课**, I have class tomorrow. **他八点半上班**. Words like **常常** (often) go there too: **我晚上常常看书**. Time can also start the sentence (**明天我上课**), but never end it.

One more word: **再** (again). You know it from **再见**: again + see, goodbye.

## contrast.id

Dalam bahasa Indonesia, waktu bebas berpindah: *besok aku ada kelas* dan *aku ada kelas besok* sama-sama wajar. Mandarin hanya mengizinkan bagian pertama: waktu di depan, sebelum kata kerja. **我上课明天** terdengar salah.

Hari juga berbeda. Nama hari kita (*Senin*, *Selasa*) harus dihafal, sedangkan Mandarin cukup menghitung. Tapi tanggal Mandarin dibaca terbalik dari kebiasaan kita: *16 Oktober* menjadi **十月十六号**, bulan dulu.

## contrast.en

In Indonesian, time moves freely: *besok aku ada kelas* and *aku ada kelas besok* both sound fine. Mandarin only allows the first: time up front, before the verb. **我上课明天** sounds wrong.

Days differ too. Indonesian day names (*Senin*, *Selasa*) must be learned by heart, while Mandarin just counts. But Mandarin dates run the opposite way to Indonesian habit: *16 Oktober* becomes **十月十六号**, month first.
