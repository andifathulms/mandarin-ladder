---
id: dasar2-07-komponen
rung: dasar-2
order: 7
status: draft
minutes: 9
title: { id: "Bagian arti, bagian bunyi", en: "Meaning part, sound part", zh: "妈 吗", py: "mā ma" }
summary:
  id: "Kebanyakan karakter = komponen arti + komponen bunyi. 妈 dan 吗 sama-sama memakai 马 (mǎ) untuk bunyinya, tapi 女 dan 口 memberi arti yang berbeda."
  en: "Most characters = a meaning component + a sound component. 妈 and 吗 both use 马 (mǎ) for the sound, but 女 and 口 give different meanings."
introduces: [d2-components]
spiral: radicals
visual: { id: character-parts, props: { char: "妈" } }
examples:
  - zh: "[[妈妈]]"
    py: "[[māma]]"
    id: "ibu: 女 (perempuan, arti) + 马 (mǎ, bunyi)"
    en: "mother: 女 (woman, meaning) + 马 (mǎ, sound)"
  - zh: "好 [[吗]] ？"
    py: "hǎo [[ma]] ?"
    id: "Baik? 吗 = 口 (mulut, arti) + 马 (mǎ, bunyi)"
    en: "Good? 吗 = 口 (mouth, meaning) + 马 (mǎ, sound)"
    note: { id: "**吗** membuat kalimat menjadi pertanyaan. Kamu akan memakainya di Easy 1.", en: "**吗** turns a sentence into a question. You'll use it in Easy 1." }
  - zh: "[[爸爸]]"
    py: "[[bàba]]"
    id: "ayah: 父 (ayah, arti) di atas + 巴 (bā, bunyi) di bawah"
    en: "father: 父 (father, meaning) on top + 巴 (bā, sound) below"
  - zh: "[[我们]]"
    py: "[[wǒmen]]"
    id: "kami, kita: 们 = 亻 (orang, arti) + 门 (mén, bunyi)"
    en: "we: 们 = 亻 (person, meaning) + 门 (mén, sound)"
  - zh: "[[请]]"
    py: "[[qǐng]]"
    id: "silakan, tolong: 讠 (bicara, arti) + 青 (qīng, bunyi)"
    en: "please: 讠 (speech, meaning) + 青 (qīng, sound)"
  - zh: "[[洗]]"
    py: "[[xǐ]]"
    id: "mencuci: 氵 (air, arti) + 先 (xiān, bunyi)"
    en: "to wash: 氵 (water, meaning) + 先 (xiān, sound)"
pair:
  off: { zh: "请", py: "qīng" }
  natural: { zh: "[[请]]", py: "[[qǐng]]" }
hanzi: [妈, 吗, 爸, 们, 门, 问]
words:
  id: "Bagian bunyi memberi bunyi dasar, bukan nadanya. **马** mǎ, **妈** mā, **吗** ma: suku katanya sama, nadanya berbeda. Selalu lihat pinyinnya."
  en: "The sound part gives the basic sound, not the tone. **马** mǎ, **妈** mā, **吗** ma: same syllable, different tones. Always check the pinyin."
tirukan: { zh: "妈妈 好 吗 ？", py: "māma hǎo ma ?", id: "Ibu baik-baik saja?", en: "Are you well, Mum?" }
check:
  - id: d2-07-c1
    type: build
    prompt: "Bangun **吗**: mulut + bunyi mǎ."
    char: "吗"
    parts: ["口", "马", "女", "门"]
    answer: ["口", "马"]
    why: { id: "**吗** = **口** (mulut, arti) + **马** (mǎ, bunyi). Dengan **女**, kamu mendapat **妈**.", en: "**吗** = **口** (mouth, meaning) + **马** (mǎ, sound). With **女**, you get **妈**." }
  - id: d2-07-c2
    type: build
    prompt: "Bangun **们** (penanda jamak untuk orang): orang + bunyi mén."
    char: "们"
    parts: ["亻", "门", "口", "马", "女"]
    answer: ["亻", "门"]
    why: { id: "**们** = **亻** (orang, arti) + **门** (mén, bunyi). Itu sebabnya **们** ada dalam **我们** dan **你们**.", en: "**们** = **亻** (person, meaning) + **门** (mén, sound). That's why **们** is in **我们** and **你们**." }
  - id: d2-07-c3
    type: choice
    prompt: "Dalam **请** (qǐng), bagian mana yang memberi bunyi?"
    options: ["青 (qīng) di kanan", "radikal bicara di kiri"]
    answer: "青 (qīng) di kanan"
    why: { id: "**青** qīng memberi bunyi, **讠** memberi arti: berbicara dengan sopan.", en: "**青** qīng gives the sound, **讠** the meaning: speaking politely." }
  - id: d2-07-c4
    type: choice
    prompt: "**爸** dibaca **bà**. Bagian mana yang memberi bunyi?"
    options: ["巴 (bā) di bawah", "父 (ayah) di atas"]
    answer: "巴 (bā) di bawah"
    why: { id: "**巴** bā memberi bunyi. **父** (ayah) memberi arti, di atas.", en: "**巴** bā gives the sound. **父** (father) gives the meaning, on top." }
  - id: d2-07-c5
    type: listen
    audio: "爸爸"
    options: ["ayah", "ibu", "kami"]
    answer: "ayah"
    why: { id: "**爸爸** bàba: ayah. **妈妈** māma: ibu.", en: "**爸爸** bàba: father. **妈妈** māma: mother." }
glossary:
  - { zh: "妈妈", py: "māma", id: "ibu, mama", en: "mother", hsk: "1" }
  - { zh: "爸爸", py: "bàba", id: "ayah, papa", en: "father", hsk: "1" }
  - { zh: "吗", py: "ma", id: "partikel tanya", en: "question particle", hsk: "1" }
  - { zh: "我们", py: "wǒmen", id: "kami, kita", en: "we", hsk: "1" }
  - { zh: "请", py: "qǐng", id: "silakan, tolong", en: "please", hsk: "1" }
  - { zh: "门", py: "mén", id: "pintu", en: "door", hsk: "1" }
extra:
  - { zh: "青", reason: "the sound part of 请, named in a check (HSK 5)" }
  - { zh: "巴", reason: "the sound part of 爸, named in a check" }
  - { zh: "父", reason: "the meaning part of 爸, named in a check" }
  - { zh: "爸", reason: "the character of 爸爸 (HSK 1), named on its own in a check" }
next: dasar2-08-kata-dua-karakter
---

## concept.id

Di pelajaran 1 kamu bertemu **妈** = **女** + **马**. Pola ini sangat umum: kira-kira delapan dari sepuluh karakter punya **komponen arti** dan **komponen bunyi**.

- **Komponen arti** biasanya radikal: **女**, **口**, **亻**, **讠**, **氵**. Ia memberi tahu *tentang apa* karakter itu.
- **Komponen bunyi** memberi petunjuk cara membacanya: **马** mǎ dalam **妈** mā dan **吗** ma, **门** mén dalam **们** men dan **问** wèn.

Kalau kamu kenal **马**, kamu bisa menebak bahwa **妈** dan **吗** berbunyi kira-kira *ma*. Kalau kamu kenal **女**, kamu bisa menebak bahwa **妈** tentang perempuan.

## concept.en

In lesson 1 you met **妈** = **女** + **马**. This pattern is very common: roughly eight in ten characters have a **meaning component** and a **sound component**.

- The **meaning component** is usually a radical: **女**, **口**, **亻**, **讠**, **氵**. It tells you *what* the character is about.
- The **sound component** hints at how to read it: **马** mǎ in **妈** mā and **吗** ma, **门** mén in **们** men and **问** wèn.

If you know **马**, you can guess that **妈** and **吗** sound roughly like *ma*. If you know **女**, you can guess that **妈** is about a woman.

## contrast.id

Jangan membaca karakter persis seperti bagian bunyinya. **请** bukan **qīng** seperti **青**: yang benar **qǐng**, nada ketiga. Petunjuk bunyi membantu mengingat, tapi pinyin tetap penentunya.

Dalam bahasa Indonesia, ejaan hampir selalu memberi bunyi yang tepat. Komponen bunyi tidak setepat itu. Kadang hanya nadanya yang berbeda (**马** mǎ, **妈** mā), kadang awalnya pun berbeda (**门** mén, **问** wèn). Dan sebagian karakter, seperti **好** (**女** + **子**), tidak punya komponen bunyi sama sekali: keduanya memberi arti.

## contrast.en

Don't read a character exactly like its sound part. **请** isn't **qīng** like **青**: it's **qǐng**, third tone. The sound hint helps you remember, but the pinyin decides.

In Indonesian, spelling almost always gives you the exact sound. Sound components aren't that exact. Sometimes only the tone differs (**马** mǎ, **妈** mā), sometimes even the initial does (**门** mén, **问** wèn). And some characters, like **好** (**女** + **子**), have no sound component at all: both parts give meaning.
