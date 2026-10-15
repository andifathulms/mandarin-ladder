---
id: easy1-09-tempat
rung: easy-1
order: 9
status: draft
minutes: 8
title: { id: "Di mana kamu?", en: "Where are you?", zh: "你 在 哪儿 ？", py: "nǐ zài nǎr ?" }
summary:
  id: "在 berarti di atau berada di. 在 + tempat berdiri sebelum kata kerja: 我在家吃饭, aku makan di rumah."
  en: "在 means at, or to be at. 在 + place goes before the verb: 我在家吃饭, I eat at home."
introduces: [g1-16]
spiral: time-place
worked:
  - { zh: "我 [[在]] 家 。", py: "wǒ [[zài]] jiā .", id: "Aku di rumah.", en: "I'm at home." }
  - { zh: "我 在 家 [[吃饭]] 。", py: "wǒ zài jiā [[chīfàn]] .", id: "Aku makan di rumah.", en: "I eat at home." }
  - { zh: "我 [[明天]] 在 家 吃饭 。", py: "wǒ [[míngtiān]] zài jiā chīfàn .", id: "Besok aku makan di rumah.", en: "Tomorrow I'll eat at home." }
examples:
  - zh: "妈妈 [[在]] 家 。"
    py: "māma [[zài]] jiā ."
    id: "Mama di rumah."
    en: "Mum is at home."
    note: { id: "Di sini **在** adalah kata kerjanya sendiri: berada di.", en: "Here **在** is the verb itself: to be at." }
  - zh: "我 [[在]] 学校 学习 。"
    py: "wǒ [[zài]] xuéxiào xuéxí ."
    id: "Aku belajar di sekolah."
    en: "I study at school."
    note: { id: "**在学校** (di sekolah) sebelum kata kerja **学习** (belajar).", en: "**在学校** (at school) before the verb **学习** (study)." }
  - zh: "他 在 [[医院]] 工作 。"
    py: "tā zài [[yīyuàn]] gōngzuò ."
    id: "Dia bekerja di rumah sakit."
    en: "He works at a hospital."
  - zh: "我们 在 [[饭店]] 吃饭 。"
    py: "wǒmen zài [[fàndiàn]] chīfàn ."
    id: "Kami makan di restoran."
    en: "We eat at a restaurant."
    note: { id: "**饭店** bisa berarti restoran, dan juga hotel. Konteks yang menentukan.", en: "**饭店** can mean a restaurant, and also a hotel. Context decides." }
  - zh: "李 华 明天 [[在 家]] 休息 。"
    py: "Lǐ Huá míngtiān [[zài jiā]] xiūxi ."
    id: "Besok Li Hua istirahat di rumah."
    en: "Li Hua is resting at home tomorrow."
    note: { id: "Urutannya: orang, waktu, tempat, kata kerja.", en: "The order: person, time, place, verb." }
  - zh: "你 在 [[哪儿]] 工作 ？"
    py: "nǐ zài [[nǎr]] gōngzuò ?"
    id: "Kamu kerja di mana?"
    en: "Where do you work?"
pair:
  off: { zh: "我 学习 在 学校 。", py: "wǒ xuéxí zài xuéxiào ." }
  natural: { zh: "我 [[在 学校]] 学习 。", py: "wǒ [[zài xuéxiào]] xuéxí ." }
tone: { zh: "学习", py: "xuéxí", note: { id: "Dua nada 2: naik, lalu naik lagi. Mulailah dari nada tengah supaya suku kata kedua masih bisa naik.", en: "Two tone 2s: rising, then rising again. Start mid-range so the second syllable still has room to rise." } }
hanzi: [在, 学, 校, 习, 医, 院, 工, 作, 饭, 休, 息]
words:
  id: "**在** mirip *di*, dan urutan **在家** sama dengan *di rumah*. Bahkan **妈妈在家** sama dengan *mama di rumah*, tanpa kata kerja lain. Bedanya hanya satu, tapi penting: kalau ada kata kerja, **在** + tempat pindah ke depan kata kerja."
  en: "**在** is like *di*, and **在家** has the same order as *di rumah*. Even **妈妈在家** matches *mama di rumah*, with no other verb. There's one difference, but it matters: when there is a verb, **在** + place moves before it."
talk:
  lines:
    - { who: "Andi", zh: "你 在 哪儿 ？", py: "nǐ zài nǎr ?", id: "Kamu di mana?", en: "Where are you?" }
    - { who: "张 丽", zh: "我 在 学校 。 你 在 家 吗 ？", py: "wǒ zài xuéxiào . nǐ zài jiā ma ?", id: "Aku di sekolah. Kamu di rumah?", en: "I'm at school. Are you at home?" }
    - { who: "Andi", zh: "不 在 。 我 在 饭店 吃饭 。", py: "bú zài . wǒ zài fàndiàn chīfàn .", id: "Nggak. Aku lagi makan di restoran.", en: "No. I'm eating at a restaurant." }
tirukan: { zh: "我 在 学校 学习 。", py: "wǒ zài xuéxiào xuéxí .", id: "Aku belajar di sekolah.", en: "I study at school." }
check:
  - id: e1-09-c1
    type: order
    cue: "Aku bekerja di Jakarta."
    tiles: ["工作", "我", "雅加达", "在"]
    answer: ["我", "在", "雅加达", "工作"]
    why: { id: "**在** + tempat sebelum kata kerja: **我在雅加达工作**.", en: "**在** + place before the verb: **我在雅加达工作**." }
  - id: e1-09-c2
    type: fix
    wrong: "他 吃饭 在 家 。"
    options: ["他 在 家 吃饭 。", "他 吃饭 家 在 。"]
    answer: "他 在 家 吃饭 。"
    why: { id: "Bukan urutan *makan di rumah*. Tempat dulu, baru kata kerja: **在家吃饭**.", en: "Not the Indonesian order *makan di rumah*. The place first, then the verb: **在家吃饭**." }
  - id: e1-09-c3
    type: gap
    cue: "Mama di rumah."
    prompt: "妈妈 ___ 家 。"
    options: ["在", "是", "的"]
    answer: "在"
    why: { id: "*Berada di* = **在**. **是** hanya menyambung dua kata benda.", en: "*To be at* = **在**. **是** only joins two nouns." }
  - id: e1-09-c4
    type: choice
    show_pinyin: false
    prompt: "Kata mana yang berarti *rumah sakit*?"
    options: ["医院", "学校", "饭店"]
    answer: "医院"
    why: { id: "**医院** yīyuàn: **医** (pengobatan) + **院** (gedung, halaman). **学校** = sekolah, **饭店** = restoran.", en: "**医院** yīyuàn: **医** (medicine) + **院** (courtyard, institution). **学校** = school, **饭店** = restaurant." }
  - id: e1-09-c5
    type: listen
    audio: "我 明天 在 家 休息 。"
    options: ["Besok aku istirahat di rumah.", "Hari ini aku belajar di rumah.", "Besok aku bekerja di sekolah."]
    answer: "Besok aku istirahat di rumah."
    why: { id: "**明天** besok, **在家** di rumah, **休息** istirahat.", en: "**明天** tomorrow, **在家** at home, **休息** rest." }
  - id: e1-09-c6
    type: trace
    char: "在"
    guide: on
    why: { id: "**在** dimulai dengan garis datar, lalu sapuan kiri yang panjang, lalu garis tegak pendek. **土** ditulis terakhir.", en: "**在** starts with the horizontal, then the long left-falling stroke, then the short vertical. **土** comes last." }
glossary:
  - { zh: "在", py: "zài", id: "di; berada di", en: "at, in; to be at", hsk: "1" }
  - { zh: "家", py: "jiā", id: "rumah", en: "home", mw: "个", hsk: "1" }
  - { zh: "学习", py: "xuéxí", id: "belajar", en: "to study", hsk: "1" }
  - { zh: "学校", py: "xuéxiào", id: "sekolah", en: "school", mw: "个", hsk: "1" }
  - { zh: "医院", py: "yīyuàn", id: "rumah sakit", en: "hospital", mw: "家", hsk: "1" }
  - { zh: "工作", py: "gōngzuò", id: "bekerja; pekerjaan", en: "to work; job", hsk: "1" }
  - { zh: "饭店", py: "fàndiàn", id: "restoran; hotel", en: "restaurant; hotel", mw: "家", hsk: "1" }
  - { zh: "吃饭", py: "chīfàn", id: "makan", en: "to eat (a meal)", hsk: "1" }
  - { zh: "休息", py: "xiūxi", id: "istirahat", en: "to rest", hsk: "1" }
  - { zh: "哪儿", py: "nǎr", id: "di mana", en: "where", hsk: "1" }
  - { zh: "雅加达", py: "Yǎjiādá", id: "Jakarta", en: "Jakarta" }
next: easy1-10-letak
---

## concept.id

**在** (zài) punya dua tugas. Sendirian, ia kata kerja: *berada di*. **妈妈在家**, mama di rumah. **你在哪儿？** kamu di mana?

Bersama kata kerja lain, **在** + tempat menjadi keterangan, dan keterangan itu berdiri **sebelum** kata kerja. **我在学校学习**: aku, di sekolah, belajar. **他在医院工作**: dia, di rumah sakit, bekerja.

Ini aturan yang sama dengan waktu di pelajaran 8. Kalau ada keduanya, waktu dulu, lalu tempat: **李华明天在家休息**. Orang, waktu, tempat, kata kerja.

## concept.en

**在** (zài) has two jobs. On its own, it's a verb: *to be at*. **妈妈在家**, mum is at home. **你在哪儿？** where are you?

With another verb, **在** + place becomes a modifier, and it goes **before** the verb. **我在学校学习**: I, at school, study. **他在医院工作**: he, at a hospital, works.

This is the same rule as time in lesson 8. When there are both, time first, then place: **李华明天在家休息**. Person, time, place, verb.

## contrast.id

**在** sangat mirip *di*. Urutannya sama (**在家** = *di rumah*), dan seperti *mama di rumah*, **妈妈在家** tidak butuh kata kerja lain.

Batasnya ada pada letak. Kita biasa berkata *aku belajar di sekolah*, dengan tempat di akhir. Mandarin memindahkan **在学校** ke depan kata kerja: **我在学校学习**. Kalau kamu menerjemahkan kata demi kata, kamu akan menulis **我学习在学校**, dan itu salah.

## contrast.en

**在** is very like *di*. The order is the same (**在家** = *di rumah*), and like *mama di rumah*, **妈妈在家** needs no other verb.

The limit is position. Indonesian usually says *aku belajar di sekolah*, with the place at the end. Mandarin moves **在学校** before the verb: **我在学校学习**. Translate word by word and you'll write **我学习在学校**, which is wrong.
