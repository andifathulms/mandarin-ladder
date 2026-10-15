---
id: dasar2-08-kata-dua-karakter
rung: dasar-2
order: 8
status: draft
minutes: 8
title: { id: "Kata dua karakter", en: "Two-character words", zh: "中国 老师", py: "Zhōngguó lǎoshī" }
summary:
  id: "Satu karakter bisa menjadi satu kata (人, 大), tapi kebanyakan kata Mandarin terdiri dari dua karakter: 中国, 老师, 学生. Artinya sering lebih dari jumlah kedua bagiannya."
  en: "One character can be a word (人, 大), but most Mandarin words have two characters: 中国, 老师, 学生. The meaning is often more than the sum of its parts."
introduces: [d2-words]
spiral: word-order
worked:
  - { zh: "[[中国]]", py: "[[Zhōngguó]]", id: "Tiongkok: 中 (tengah) + 国 (negara)", en: "China: 中 (middle) + 国 (country)" }
  - { zh: "[[老师]]", py: "[[lǎoshī]]", id: "guru: 老 (tua, dihormati) + 师 (guru, ahli)", en: "teacher: 老 (old, respected) + 师 (master, expert)" }
  - { zh: "[[汉字]]", py: "[[Hànzì]]", id: "karakter Mandarin: 汉 (Han, bangsa Tionghoa) + 字 (karakter)", en: "Chinese characters: 汉 (Han, the Chinese) + 字 (character)" }
examples:
  - zh: "[[人]]"
    py: "[[rén]]"
    id: "orang: satu karakter, satu kata"
    en: "person: one character, one word"
  - zh: "[[学生]]"
    py: "[[xuésheng]]"
    id: "pelajar: 学 (belajar) + 生 (orang yang …)"
    en: "student: 学 (study) + 生 (one who …)"
    note: { id: "**生** dalam **学生** bernada netral: **xuésheng**.", en: "**生** in **学生** takes the neutral tone: **xuésheng**." }
  - zh: "[[朋友]]"
    py: "[[péngyou]]"
    id: "teman: dua karakter yang sama-sama berarti teman"
    en: "friend: two characters that both mean friend"
  - zh: "[[汉语]]"
    py: "[[Hànyǔ]]"
    id: "bahasa Mandarin: 汉 (Han) + 语 (bahasa)"
    en: "Chinese (the language): 汉 (Han) + 语 (language)"
  - zh: "[[中国 人]]"
    py: "[[Zhōngguó rén]]"
    id: "orang Tiongkok: 中国 lalu 人, dua kata"
    en: "a Chinese person: 中国 then 人, two words"
    note: { id: "Urutannya terbalik dari bahasa Indonesia: *orang Tiongkok* = **中国人**, Tiongkok dulu, orang kemudian.", en: "The order is the reverse of Indonesian: *orang Tiongkok* = **中国人**, China first, person after." }
pair:
  off: { zh: "人 中国", py: "rén Zhōngguó" }
  natural: { zh: "[[中国 人]]", py: "[[Zhōngguó rén]]" }
hanzi: [国, 老, 师, 学, 生, 朋, 友, 汉, 语]
words:
  id: "Jangan menerjemahkan karakter satu per satu. **老师** bukan *guru tua*: **老** di sini tanda hormat. Guru yang masih muda pun disebut **老师**."
  en: "Don't translate character by character. **老师** isn't *an old teacher*: **老** here is a mark of respect. A young teacher is still a **老师**."
tirukan: { zh: "中国 老师", py: "Zhōngguó lǎoshī", id: "guru dari Tiongkok", en: "a teacher from China" }
check:
  - id: d2-08-c1
    type: choice
    show_pinyin: false
    prompt: "Kata mana yang berarti *pelajar*?"
    options: ["学生", "老师", "朋友"]
    answer: "学生"
    why: { id: "**学生** xuésheng: pelajar. **老师**: guru. **朋友**: teman.", en: "**学生** xuésheng: student. **老师**: teacher. **朋友**: friend." }
  - id: d2-08-c2
    type: gap
    cue: "guru"
    prompt: "老 ___"
    options: ["师", "生", "人"]
    answer: "师"
    why: { id: "**老师** lǎoshī: guru. **学生** memakai **生**, bukan **老**.", en: "**老师** lǎoshī: teacher. **学生** uses **生**, not **老**." }
  - id: d2-08-c3
    type: order
    cue: "orang Tiongkok"
    tiles: ["人", "中国"]
    answer: ["中国", "人"]
    why: { id: "Yang menjelaskan di depan: **中国** dulu, lalu **人**.", en: "The describing word comes first: **中国**, then **人**." }
  - id: d2-08-c4
    type: listen
    audio: "老师"
    options: ["guru", "pelajar", "teman"]
    answer: "guru"
    why: { id: "**老师** lǎoshī: guru.", en: "**老师** lǎoshī: teacher." }
  - id: d2-08-c5
    type: trace
    char: "中"
    guide: "on"
    why: { id: "**口** dulu (**竖**, **折**, **横**), lalu **竖** panjang di tengah, paling akhir.", en: "**口** first (**竖**, **折**, **横**), then the long **竖** through the middle, last." }
glossary:
  - { zh: "中国", py: "Zhōngguó", id: "Tiongkok", en: "China", hsk: "1" }
  - { zh: "老师", py: "lǎoshī", id: "guru", en: "teacher", mw: "个", hsk: "1" }
  - { zh: "学生", py: "xuésheng", id: "pelajar, murid", en: "student", mw: "个", hsk: "1" }
  - { zh: "朋友", py: "péngyou", id: "teman", en: "friend", mw: "个", hsk: "1" }
  - { zh: "汉字", py: "Hànzì", id: "karakter Mandarin", en: "Chinese character", mw: "个", hsk: "1" }
  - { zh: "汉语", py: "Hànyǔ", id: "bahasa Mandarin", en: "Chinese (language)", hsk: "1" }
extra:
  - { zh: "师", reason: "the second character of 老师 (HSK 1), as a gap option" }
  - { zh: "生", reason: "the second character of 学生 (HSK 1), as a gap option (HSK 2 as a word)" }
next: dasar2-09-angka-tanggal
---

## concept.id

Sejauh ini kamu melihat karakter satu per satu. Beberapa memang kata sendiri: **人** (orang), **大** (besar), **好** (baik), **我** (aku).

Tapi kebanyakan kata Mandarin terdiri dari **dua karakter**. Dua karakter digabung, dan artinya sering lebih dari jumlah kedua bagiannya:

- **中国** = **中** (tengah) + **国** (negara): Tiongkok.
- **老师** = **老** (tua, dihormati) + **师** (ahli): guru.
- **汉字** = **汉** (Han) + **字** (karakter): karakter Mandarin.

Dalam tulisan, tidak ada spasi di antara kata. **我是中国人** ditulis rapat. Aplikasi ini memberi pinyin per kata (**Zhōngguó**, bukan *Zhōng guó*) supaya kamu melihat di mana satu kata berakhir.

## concept.en

So far you've looked at characters one at a time. Some really are words by themselves: **人** (person), **大** (big), **好** (good), **我** (I).

But most Mandarin words have **two characters**. Two characters join, and the meaning is often more than the sum of its parts:

- **中国** = **中** (middle) + **国** (country): China.
- **老师** = **老** (old, respected) + **师** (master): teacher.
- **汉字** = **汉** (Han) + **字** (character): Chinese characters.

In writing, there are no spaces between words. **我是中国人** is written solid. This app gives pinyin per word (**Zhōngguó**, not *Zhōng guó*) so you can see where one word ends.

## contrast.id

Penutur bahasa Indonesia sering menulis **人中国**, mengikuti *orang Tiongkok*. Dalam bahasa Mandarin, kata yang menjelaskan selalu di depan: **中国人**, **中国老师**.

Bahasa Indonesia juga punya kata majemuk, seperti *rumah sakit* dan *kamar mandi*, yang artinya lebih dari kedua katanya. Kata dua karakter mirip. Bedanya, kata majemuk Indonesia memakai spasi dan bagian yang dijelaskan di depan (*rumah* sakit). Mandarin tanpa spasi, dan yang menjelaskan di depan.

## contrast.en

Indonesian speakers often write **人中国**, following *orang Tiongkok*. In Mandarin, the describing word always comes first: **中国人**, **中国老师**.

Indonesian also has compounds, like *rumah sakit* (hospital) and *kamar mandi* (bathroom), whose meaning goes beyond their two words. Two-character words are similar. The difference: Indonesian compounds use a space and put the head first (*rumah* sakit). Mandarin uses no space and puts the describing part first.
