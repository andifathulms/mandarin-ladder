---
id: dasar1-10-membaca-pinyin
rung: dasar-1
order: 10
status: draft
minutes: 9
title: { id: "Membaca pinyin", en: "Reading pinyin", zh: "谢谢 ， 再见 。", py: "xièxie , zàijiàn ." }
summary:
  id: "Salam dan angka 1 sampai 10 dalam pinyin. Aturan ejaan yi, wu, yu, dan di mana tanda nada diletakkan."
  en: "Greetings and the numbers 1 to 10 in pinyin. The spelling rules yi, wu, yu, and where the tone mark goes."
introduces: [d1-reading]
spiral: numbers
worked:
  - { zh: "[[你 好]] ！", py: "[[nǐ hǎo]] !", id: "Halo!", en: "Hello!" }
  - { zh: "[[谢谢]] 。", py: "[[xièxie]] .", id: "Terima kasih.", en: "Thank you." }
  - { zh: "[[不客气]] 。", py: "[[búkèqi]] .", id: "Sama-sama.", en: "You're welcome." }
  - { zh: "[[对不起]] 。", py: "[[duìbuqǐ]] .", id: "Maaf.", en: "Sorry." }
  - { zh: "[[再见]] 。", py: "[[zàijiàn]] .", id: "Sampai jumpa.", en: "Goodbye." }
  - { zh: "一 二 三 四 五", py: "yī èr sān sì wǔ", id: "satu, dua, tiga, empat, lima", en: "one, two, three, four, five" }
  - { zh: "六 七 八 九 十", py: "liù qī bā jiǔ shí", id: "enam, tujuh, delapan, sembilan, sepuluh", en: "six, seven, eight, nine, ten" }
examples:
  - zh: "[[一]] 二 三"
    py: "[[yī]] èr sān"
    id: "satu, dua, tiga"
    en: "one, two, three"
    note: { id: "Vokal **i** tanpa inisial ditulis **yi**. Saat berhitung, **一** tetap nada 1.", en: "The vowel **i** with no initial is written **yi**. When counting, **一** keeps tone 1." }
  - zh: "[[五]]"
    py: "[[wǔ]]"
    id: "lima"
    en: "five"
    note: { id: "Vokal **u** tanpa inisial ditulis **wu**. Huruf **w** tidak dibaca tersendiri.", en: "The vowel **u** with no initial is written **wu**. The **w** isn't read on its own." }
  - zh: "[[雨]]"
    py: "[[yǔ]]"
    id: "hujan"
    en: "rain"
    note: { id: "Vokal **ü** tanpa inisial ditulis **yu**, tanpa titik. Bunyinya tetap **ü**.", en: "The vowel **ü** with no initial is written **yu**, without dots. It still sounds **ü**." }
  - zh: "[[九]]"
    py: "[[jiǔ]]"
    id: "sembilan"
    en: "nine"
    note: { id: "Dalam **iu**, tanda nada di atas vokal kedua: **jiǔ**, **liù**.", en: "In **iu**, the tone mark goes on the second vowel: **jiǔ**, **liù**." }
  - zh: "[[对不起]] 。"
    py: "[[duìbuqǐ]] ."
    id: "Maaf."
    en: "Sorry."
    note: { id: "Dalam **ui**, tanda nada juga di atas vokal kedua: **duì**. Di tengah **对不起**, **不** bernada netral.", en: "In **ui**, the tone mark also goes on the second vowel: **duì**. In the middle of **对不起**, **不** is neutral." }
  - zh: "[[谢谢]] 。"
    py: "[[xièxie]] ."
    id: "Terima kasih."
    en: "Thank you."
    note: { id: "Kalau ada **a**, **o**, atau **e**, tanda nada ada di sana: **xiè**, **hǎo**, **zǒu**.", en: "If there's an **a**, **o** or **e**, the tone mark goes there: **xiè**, **hǎo**, **zǒu**." }
pair:
  off: { zh: "九", py: "jǐu" }
  natural: { zh: "[[九]]", py: "[[jiǔ]]" }
tone: { zh: "对不起", py: "duìbuqǐ", note: { id: "Nada 4, nada netral, nada 3. **不** di tengah kata ini ringan dan pendek.", en: "Tone 4, neutral, tone 3. **不** in the middle of this word is light and short." } }
tirukan: { zh: "一 二 三 四 五 六 七 八 九 十", py: "yī èr sān sì wǔ liù qī bā jiǔ shí", id: "satu sampai sepuluh", en: "one to ten" }
check:
  - id: d1-10-c1
    type: pinyin
    audio: "九"
    answer: "jiǔ"
    why: { id: "**j**, lalu **iu** dengan nada 3. Tandanya di atas **u**: **jiǔ**.", en: "**j**, then **iu** on tone 3. The mark sits on the **u**: **jiǔ**." }
  - id: d1-10-c2
    type: choice
    prompt: "Mana penulisan yang benar untuk **dui** dengan nada 4?"
    options: ["duì", "dùi"]
    answer: "duì"
    why: { id: "Dalam **ui**, tanda nada di atas vokal kedua, **i**.", en: "In **ui**, the tone mark goes on the second vowel, **i**." }
  - id: d1-10-c3
    type: choice
    prompt: "Bagaimana vokal **ü** tanpa inisial ditulis?"
    options: ["yu", "yü", "wu"]
    answer: "yu"
    why: { id: "**ü** sendiri ditulis **yu**, seperti dalam **yǔ** (hujan). **wu** adalah **u**.", en: "**ü** on its own is written **yu**, as in **yǔ** (rain). **wu** is **u**." }
  - id: d1-10-c4
    type: listen
    audio: "谢谢 。"
    options: ["Terima kasih.", "Sampai jumpa.", "Maaf."]
    answer: "Terima kasih."
    why: { id: "**谢谢** xièxie: terima kasih.", en: "**谢谢** xièxie: thank you." }
  - id: d1-10-c5
    type: pinyin
    audio: "再见"
    answer: "zàijiàn"
    why: { id: "Dua nada 4: **zài** dan **jiàn**. Ketik **zai4jian4**.", en: "Two fourth tones: **zài** and **jiàn**. Type **zai4jian4**." }
  - id: d1-10-c6
    type: choice
    prompt: "Mana ejaan yang benar untuk angka 5?"
    options: ["wǔ", "ǔ", "wǚ"]
    answer: "wǔ"
    why: { id: "**u** tanpa inisial ditulis **wu**. Tanda nadanya tetap di atas **u**.", en: "**u** with no initial is written **wu**. The tone mark stays on the **u**." }
glossary:
  - { zh: "谢谢", py: "xièxie", id: "terima kasih", en: "thank you", hsk: "1" }
  - { zh: "不客气", py: "búkèqi", id: "sama-sama", en: "you're welcome", hsk: "1" }
  - { zh: "对不起", py: "duìbuqǐ", id: "maaf", en: "sorry", hsk: "1" }
  - { zh: "再见", py: "zàijiàn", id: "sampai jumpa", en: "goodbye", hsk: "1" }
  - { zh: "五", py: "wǔ", id: "lima", en: "five", hsk: "1" }
  - { zh: "九", py: "jiǔ", id: "sembilan", en: "nine", hsk: "1" }
---

## concept.id

Kamu sudah mengenal semua bagian pinyin. Sekarang tinggal tiga aturan ejaan.

**Tanpa inisial.** Kalau suku kata dimulai dengan **i**, **u**, atau **ü**, pinyin menambahkan **y** atau **w**: **i** menjadi **yi**, **u** menjadi **wu**, **ü** menjadi **yu**. Huruf **y** dan **w** di sini hanya ejaan. **yī**, **wǔ**, **yǔ** dibaca *i*, *u*, *ü*.

**Titik ü.** Setelah **j**, **q**, **x**, dan **y**, titik ü tidak ditulis (**qù**, **yǔ**). Setelah **n** dan **l**, titiknya ditulis (**nǚ**).

**Letak tanda nada.** Kalau ada **a**, **o**, atau **e**, tanda nada diletakkan di sana: **hǎo**, **zǒu**, **xiè**. Dalam **iu** dan **ui**, tanda nada di atas vokal kedua: **jiǔ**, **duì**.

Dengan aturan ini, kamu bisa membaca salam dan angka 1 sampai 10. Itu cukup untuk pergi ke Dasar 2, atau langsung ke Easy 1.

## concept.en

You've met every part of pinyin. Three spelling rules are left.

**No initial.** When a syllable starts with **i**, **u** or **ü**, pinyin adds **y** or **w**: **i** becomes **yi**, **u** becomes **wu**, **ü** becomes **yu**. The **y** and **w** are only spelling here. **yī**, **wǔ**, **yǔ** are said *i*, *u*, *ü*.

**The dots on ü.** After **j**, **q**, **x** and **y**, the dots aren't written (**qù**, **yǔ**). After **n** and **l**, they are (**nǚ**).

**Where the tone mark goes.** If there's an **a**, **o** or **e**, the mark goes there: **hǎo**, **zǒu**, **xiè**. In **iu** and **ui**, it goes on the second vowel: **jiǔ**, **duì**.

With these rules you can read greetings and the numbers 1 to 10. That's enough to go on to Dasar 2, or straight to Easy 1.

## contrast.id

Ejaan bahasa Indonesia hampir selalu dibaca persis seperti tulisannya, dan pinyin juga begitu, asal kamu tahu aturannya. Tapi beberapa huruf menipu mata orang Indonesia: **yu** dibaca *ü*, bukan *yu* dalam *ayu*, dan **wu** dibaca *u* saja, bukan *wu* dalam *wujud*.

Batas yang jujur: pinyin adalah alat bantu membaca, bukan tulisan sehari-hari orang Tiongkok. Di jalan, di menu, dan di WeChat, kamu akan melihat karakter. Pinyin adalah jembatanmu ke sana, dan di Dasar 2 kamu mulai menyeberanginya.

## contrast.en

Indonesian spelling is almost always read exactly as written, and so is pinyin, once you know its rules. But some letters trick an Indonesian eye: **yu** is read *ü*, not the *yu* of *ayu*, and **wu** is just *u*, not the *wu* of *wujud*.

An honest limit: pinyin is a reading aid, not what people in China write every day. On the street, on menus and on WeChat, you'll see characters. Pinyin is your bridge there, and in Dasar 2 you start to cross it.
