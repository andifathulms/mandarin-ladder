---
id: dasar2-10-kalimat-pertama
rung: dasar-2
order: 10
status: draft
minutes: 8
title: { id: "Kalimat pertamamu", en: "Your first sentences", zh: "我 是 印尼人", py: "wǒ shì Yìnnírén" }
summary:
  id: "Kamu sudah bisa membaca kalimat pertama dalam karakter: 你好 (halo), 谢谢 (terima kasih), 再见 (sampai jumpa) dan 我是印尼人 (aku orang Indonesia)."
  en: "You can already read your first sentences in characters: 你好 (hello), 谢谢 (thank you), 再见 (goodbye) and 我是印尼人 (I'm Indonesian)."
introduces: [d2-sentences]
spiral: word-order
worked:
  - { zh: "[[你 好]] ！", py: "[[nǐ hǎo]] !", id: "Halo!", en: "Hello!" }
  - { zh: "[[谢谢]] ！", py: "[[xièxie]] !", id: "Terima kasih!", en: "Thank you!" }
  - { zh: "我 [[是]] 印尼人 。", py: "wǒ [[shì]] Yìnnírén .", id: "Aku orang Indonesia.", en: "I'm Indonesian." }
examples:
  - zh: "[[你 好]] ！"
    py: "[[nǐ hǎo]] !"
    id: "Halo!"
    en: "Hello!"
    note: { id: "Dua kata, **你** (kamu) dan **好** (baik), ditulis rapat: **你好**. Dua nada ketiga: yang pertama diucapkan naik.", en: "Two words, **你** (you) and **好** (good), written solid: **你好**. Two third tones: the first is said rising." }
  - zh: "[[谢谢]] 老师 ！"
    py: "[[xièxie]] lǎoshī !"
    id: "Terima kasih, Pak/Bu Guru!"
    en: "Thank you, teacher!"
    note: { id: "**谢** punya **讠** (bicara). **谢** kedua bernada netral: **xièxie**.", en: "**谢** has **讠** (speech). The second **谢** is neutral: **xièxie**." }
  - zh: "[[再见]] ！"
    py: "[[zàijiàn]] !"
    id: "Sampai jumpa!"
    en: "Goodbye!"
  - zh: "我 [[是]] 印尼人 。"
    py: "wǒ [[shì]] Yìnnírén ."
    id: "Aku orang Indonesia."
    en: "I'm Indonesian."
  - zh: "我 [[不 是]] 中国 人 。"
    py: "wǒ [[bú shì]] Zhōngguó rén ."
    id: "Aku bukan orang Tiongkok."
    en: "I'm not Chinese."
    note: { id: "**不** bù menjadi **bú** sebelum nada keempat: **bú shì**.", en: "**不** bù becomes **bú** before a fourth tone: **bú shì**." }
  - zh: "她 是 [[老师]] 。"
    py: "tā shì [[lǎoshī]] ."
    id: "Dia (perempuan) guru."
    en: "She's a teacher."
pair:
  off: { zh: "我 印尼人 。", py: "wǒ Yìnnírén ." }
  natural: { zh: "我 [[是]] 印尼人 。", py: "wǒ [[shì]] Yìnnírén ." }
hanzi: [我, 是, 不, 谢, 再, 见]
words:
  id: "Kamu sudah mengenal hampir semua karakter di sini: **你** dengan **亻**, **好** dengan **女** dan **子**, **谢** dengan **讠**, **是** dengan **日** di atas. Membaca karakter adalah mengenali bagian-bagiannya."
  en: "You already know almost every character here: **你** with **亻**, **好** with **女** and **子**, **谢** with **讠**, **是** with **日** on top. Reading characters means recognising their parts."
tirukan: { zh: "你 好 ！ 我 是 印尼人 。", py: "nǐ hǎo ! wǒ shì Yìnnírén .", id: "Halo! Aku orang Indonesia.", en: "Hello! I'm Indonesian." }
check:
  - id: d2-10-c1
    type: order
    cue: "Aku orang Indonesia."
    tiles: ["印尼人", "是", "我"]
    answer: ["我", "是", "印尼人"]
    why: { id: "Seperti bahasa Indonesia: **我** (aku) **是** **印尼人** (orang Indonesia).", en: "Like Indonesian: **我** (I) **是** **印尼人** (Indonesian)." }
  - id: d2-10-c2
    type: listen
    audio: "谢谢 ！"
    options: ["Terima kasih!", "Halo!", "Sampai jumpa!"]
    answer: "Terima kasih!"
    why: { id: "**谢谢** xièxie: terima kasih.", en: "**谢谢** xièxie: thank you." }
  - id: d2-10-c3
    type: choice
    show_pinyin: false
    prompt: "Mana yang berarti *sampai jumpa*?"
    options: ["再见", "你 好", "谢谢"]
    answer: "再见"
    why: { id: "**再见** zàijiàn: sampai jumpa. **再** (lagi) + **见** (bertemu): bertemu lagi.", en: "**再见** zàijiàn: goodbye. **再** (again) + **见** (see): see you again." }
  - id: d2-10-c4
    type: fix
    wrong: "我 印尼人 。"
    options: ["我 是 印尼人 。", "是 我 印尼人 。"]
    answer: "我 是 印尼人 。"
    why: { id: "Dua kata benda perlu **是** di antaranya: **我是印尼人**.", en: "Two nouns need **是** between them: **我是印尼人**." }
  - id: d2-10-c5
    type: trace
    char: "我"
    guide: "on"
    why: { id: "**我** punya tujuh goresan: **撇**, **横**, **钩**, **提**, kait miring panjang, **撇**, lalu **点** paling akhir.", en: "**我** has seven strokes: **撇**, **横**, **钩**, **提**, the long slanting hook, **撇**, then the **点** last." }
glossary:
  - { zh: "我", py: "wǒ", id: "aku, saya", en: "I, me", hsk: "1" }
  - { zh: "是", py: "shì", id: "adalah", en: "to be", hsk: "1" }
  - { zh: "不", py: "bù", id: "tidak, bukan", en: "not", hsk: "1" }
  - { zh: "谢谢", py: "xièxie", id: "terima kasih", en: "thank you", hsk: "1" }
  - { zh: "再见", py: "zàijiàn", id: "sampai jumpa", en: "goodbye", hsk: "1" }
  - { zh: "印尼人", py: "Yìnnírén", id: "orang Indonesia", en: "Indonesian (person)" }
---

## concept.id

Kamu sudah tahu goresan, urutan, radikal dan komponen. Sekarang kamu bisa membaca kalimat pertama dalam karakter.

- **你好** nǐ hǎo: halo. **你** (kamu) + **好** (baik).
- **谢谢** xièxie: terima kasih.
- **再见** zàijiàn: sampai jumpa. **再** (lagi) + **见** (bertemu).
- **我是印尼人** wǒ shì Yìnnírén: aku orang Indonesia.

Kalimat Mandarin ditulis tanpa spasi, dan diakhiri titik bulat kecil: **。** Tanda tanya dan tanda seru juga ada: **？** **！**

**是** menyambung dua kata benda: **我** (aku) **是** **印尼人** (orang Indonesia). Untuk *bukan*, pakai **不是** bú shì.

## concept.en

You know strokes, order, radicals and components. Now you can read your first sentences in characters.

- **你好** nǐ hǎo: hello. **你** (you) + **好** (good).
- **谢谢** xièxie: thank you.
- **再见** zàijiàn: goodbye. **再** (again) + **见** (see).
- **我是印尼人** wǒ shì Yìnnírén: I'm Indonesian.

Chinese sentences are written without spaces and end with a small round full stop: **。** Question and exclamation marks exist too: **？** **！**

**是** joins two nouns: **我** (I) **是** **印尼人** (Indonesian). For *not*, use **不是** bú shì.

## contrast.id

Dalam bahasa Indonesia, *Aku orang Indonesia* tidak perlu *adalah*. Dalam bahasa Mandarin, dua kata benda perlu **是**: **我是印尼人**, bukan *我印尼人*.

Urutan kata **我是印尼人** sama dengan *aku (adalah) orang Indonesia*: aku, adalah, orang Indonesia. Satu batas yang jujur: **是** tidak dipakai di depan kata sifat. *Aku sibuk* adalah **我很忙**, bukan *我是忙*. Kamu akan belajar ini di Easy 1.

## contrast.en

In Indonesian, *Aku orang Indonesia* needs no *adalah*. In Mandarin, two nouns need **是**: **我是印尼人**, not *我印尼人*.

The word order of **我是印尼人** matches *aku (adalah) orang Indonesia*: I, am, Indonesian. One honest limit: **是** isn't used before adjectives. *I'm busy* is **我很忙**, not *我是忙*. You'll learn this in Easy 1.
