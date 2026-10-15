---
id: easy1-17-cuaca-perasaan
rung: easy-1
order: 17
status: draft
minutes: 8
title: { id: "Cuaca dan perasaan", en: "Weather and feelings", zh: "今天 太 热 了", py: "jīntiān tài rè le" }
summary:
  id: "太…了 untuk *sekali* atau *terlalu*, 真 untuk *sungguh*, 有点儿 untuk *agak*. 下雨了: kalimat tanpa pelaku. 吧 untuk ajakan."
  en: "太…了 for *so* or *too*, 真 for *really*, 有点儿 for *a bit*. 下雨了: a sentence with no subject. 吧 for suggestions."
introduces: [g1-35, g1-22, g1-31]
spiral: aspect
worked:
  - { zh: "今天 [[太 热 了]] 。", py: "jīntiān [[tài rè le]] .", id: "Hari ini panas sekali.", en: "It's so hot today." }
  - { zh: "[[下雨]] 了 。", py: "[[xiàyǔ]] le .", id: "Hujan turun.", en: "It's raining." }
  - { zh: "我 [[有点儿]] 累 。", py: "wǒ [[yǒudiǎnr]] lèi .", id: "Aku agak capek.", en: "I'm a bit tired." }
examples:
  - zh: "这 个 菜 [[真]] 好吃 。"
    py: "zhè gè cài [[zhēn]] hǎochī ."
    id: "Masakan ini enak sekali."
    en: "This dish is really good."
  - zh: "北京 今天 [[太 冷 了]] 。"
    py: "Běijīng jīntiān [[tài lěng le]] ."
    id: "Hari ini Beijing dingin sekali."
    en: "Beijing is so cold today."
    note: { id: "**太** + kata sifat + **了**. Jangan lupa **了** di akhir.", en: "**太** + adjective + **了**. Don't forget the final **了**." }
  - zh: "我 [[饿 了]] 。"
    py: "wǒ [[è le]] ."
    id: "Aku lapar."
    en: "I'm hungry."
    note: { id: "**了**: tadi tidak, sekarang lapar. Keadaannya berubah.", en: "**了**: I wasn't before, now I'm hungry. The state changed." }
  - zh: "外边 下雨 了 ， 我们 打车 去 [[吧]] 。"
    py: "wàibian xiàyǔ le , wǒmen dǎchē qù [[ba]] ."
    id: "Di luar hujan, ayo kita naik taksi."
    en: "It's raining outside, let's take a taxi."
    note: { id: "**吧** di akhir: ajakan atau usul yang lembut, seperti *ayo* atau *ya*.", en: "Final **吧**: a soft suggestion, like *let's*." }
  - zh: "我 [[有点儿]] 渴 ， 想 喝 水 。"
    py: "wǒ [[yǒudiǎnr]] kě , xiǎng hē shuǐ ."
    id: "Aku agak haus, ingin minum air."
    en: "I'm a bit thirsty, I'd like some water."
  - zh: "这 件 衣服 [[太 贵 了]] 。"
    py: "zhè jiàn yīfu [[tài guì le]] ."
    id: "Baju ini terlalu mahal."
    en: "This top is too expensive."
pair:
  off: { zh: "今天 太 热 。", py: "jīntiān tài rè ." }
  natural: { zh: "今天 [[太 热 了]] 。", py: "jīntiān [[tài rè le]] ." }
tone: { zh: "有点儿", py: "yǒudiǎnr", note: { id: "Tertulis nada 3 + nada 3. Diucapkan **yóu diǎnr**: nada 3 pertama naik jadi nada 2. Aplikasi menunjukkan perubahannya.", en: "Written tone 3 + tone 3. Spoken **yóu diǎnr**: the first tone 3 rises to tone 2. The app shows the change." } }
hanzi: [太, 热, 冷, 雨, 气, 累, 饿, 渴, 吧]
words:
  id: "**太…了** bisa *terlalu* (**太贵了**, terlalu mahal) atau *sekali* (**太好了**, bagus sekali). Konteks yang menentukan. **有点儿** mirip *agak*, tapi hampir selalu untuk hal yang kurang enak: **有点儿累**, **有点儿贵**. Untuk *agak bagus*, Mandarin tidak memakai **有点儿**."
  en: "**太…了** can be *too* (**太贵了**, too expensive) or *so* (**太好了**, great). Context decides. **有点儿** is like *agak*, but almost always for something unwelcome: **有点儿累**, **有点儿贵**. For *quite good*, Mandarin doesn't use **有点儿**."
talk:
  lines:
    - { who: "王 明", zh: "今天 天气 好 不 好 ？", py: "jīntiān tiānqì hǎo bù hǎo ?", id: "Hari ini cuacanya bagus?", en: "Is the weather nice today?" }
    - { who: "Budi", zh: "不 好 ， 下雨 了 。", py: "bù hǎo , xiàyǔ le .", id: "Tidak, hujan.", en: "No, it's raining." }
    - { who: "王 明", zh: "外边 有点儿 冷 ， 我们 在 家 吃饭 吧 。", py: "wàibian yǒudiǎnr lěng , wǒmen zài jiā chīfàn ba .", id: "Di luar agak dingin, kita makan di rumah saja, ya.", en: "It's a bit cold out, let's eat at home." }
    - { who: "Budi", zh: "太 好 了 。", py: "tài hǎo le .", id: "Bagus sekali.", en: "Great." }
tirukan: { zh: "今天 太 热 了 ， 我 有点儿 渴 。", py: "jīntiān tài rè le , wǒ yǒudiǎnr kě .", id: "Hari ini panas sekali, aku agak haus.", en: "It's so hot today, I'm a bit thirsty." }
check:
  - id: e1-17-c1
    type: gap
    cue: "Hari ini panas sekali."
    prompt: "今天 ___ 热 了 。"
    options: ["太", "有点儿", "很"]
    answer: "太"
    why: { id: "**太** + kata sifat + **了**: sekali, terlalu.", en: "**太** + adjective + **了**: so, too." }
  - id: e1-17-c2
    type: choice
    prompt: "Kamu agak capek. Mana yang tepat?"
    options: ["我 有点儿 累 。", "我 太 累 。", "我 是 累 。"]
    answer: "我 有点儿 累 。"
    why: { id: "*Agak* = **有点儿**. **太** perlu **了**, dan kata sifat tidak memakai **是**.", en: "*A bit* = **有点儿**. **太** needs **了**, and adjectives don't take **是**." }
  - id: e1-17-c3
    type: fix
    wrong: "今天 是 太 冷 了 。"
    options: ["今天 太 冷 了 。", "今天 太 了 冷 。"]
    answer: "今天 太 冷 了 。"
    why: { id: "Kata sifat tidak memakai **是**: **今天太冷了**.", en: "Adjectives don't take **是**: **今天太冷了**." }
  - id: e1-17-c4
    type: listen
    audio: "外边 下雨 了 。"
    options: ["Di luar hujan.", "Di luar panas.", "Di luar dingin."]
    answer: "Di luar hujan."
    why: { id: "**下雨** xiàyǔ: hujan turun. **了**: sekarang sedang hujan.", en: "**下雨** xiàyǔ: rain falls. **了**: it's raining now." }
  - id: e1-17-c5
    type: order
    cue: "Ayo kita naik taksi."
    tiles: ["吧", "我们", "打车", "去"]
    answer: ["我们", "打车", "去", "吧"]
    why: { id: "**吧** di akhir untuk ajakan.", en: "**吧** at the end for a suggestion." }
  - id: e1-17-c6
    type: trace
    char: "雨"
    guide: on
    why: { id: "**雨**: garis datar atas, garis tegak kiri, lipatan berkait, garis tengah, lalu empat titik.", en: "**雨**: the top horizontal, the left vertical, the hooked turn, the middle vertical, then four dots." }
glossary:
  - { zh: "太", py: "tài", id: "terlalu, sekali", en: "too, so", hsk: "1" }
  - { zh: "真", py: "zhēn", id: "sungguh, benar-benar", en: "really", hsk: "1" }
  - { zh: "有点儿", py: "yǒudiǎnr", id: "agak", en: "a bit", hsk: "2" }
  - { zh: "天气", py: "tiānqì", id: "cuaca", en: "weather", hsk: "1" }
  - { zh: "热", py: "rè", id: "panas", en: "hot", hsk: "1" }
  - { zh: "冷", py: "lěng", id: "dingin", en: "cold", hsk: "1" }
  - { zh: "下雨", py: "xiàyǔ", id: "hujan (turun)", en: "to rain", hsk: "1" }
  - { zh: "雨", py: "yǔ", id: "hujan", en: "rain", hsk: "1" }
  - { zh: "累", py: "lèi", id: "capek, lelah", en: "tired", hsk: "1" }
  - { zh: "饿", py: "è", id: "lapar", en: "hungry", hsk: "1" }
  - { zh: "渴", py: "kě", id: "haus", en: "thirsty", hsk: "1" }
  - { zh: "好吃", py: "hǎochī", id: "enak", en: "tasty", hsk: "1" }
  - { zh: "吧", py: "ba", id: "(ajakan; ya?)", en: "(let's; right?)", hsk: "1" }
  - { zh: "外边", py: "wàibian", id: "luar", en: "outside", hsk: "1" }
  - { zh: "打车", py: "dǎchē", id: "naik taksi", en: "to take a taxi", hsk: "1" }
extra:
  - { zh: "有点儿", reason: "'a bit' for weather and feelings, PRD §4.3 Easy 1 lesson 17 (HSK 2)" }
next: easy1-18-di-kafe
---

## concept.id

Untuk cuaca dan perasaan, kata sifat langsung jadi inti kalimat, tanpa **是**. Yang berubah hanya kata penguatnya.

- **很** (biasa): **今天很热**.
- **真** (sungguh): **这个菜真好吃**.
- **太…了** (sekali, terlalu): **今天太热了**. **了** di akhir wajib.
- **有点儿** (agak), untuk yang kurang enak: **我有点儿累**.

Cuaca sering memakai kalimat tanpa pelaku: **下雨了**, hujan turun. Tidak ada *dia* atau *langit* di depannya, sama seperti *hujan* dalam bahasa Indonesia.

**了** juga menandai perasaan yang baru muncul: **我饿了**, aku (jadi) lapar. Dan **吧** di akhir membuat ajakan yang lembut: **我们打车去吧**.

## concept.en

For weather and feelings, the adjective is the predicate itself, with no **是**. Only the intensifier changes.

- **很** (plain): **今天很热**.
- **真** (really): **这个菜真好吃**.
- **太…了** (so, too): **今天太热了**. The final **了** is required.
- **有点儿** (a bit), for something unwelcome: **我有点儿累**.

Weather often uses a sentence with no subject: **下雨了**, it's raining. There's no *it* or *the sky* in front, just like *hujan* in Indonesian.

**了** also marks a feeling that has just arrived: **我饿了**, I'm (now) hungry. And final **吧** makes a soft suggestion: **我们打车去吧**.

## contrast.id

**下雨了** sangat dekat dengan *hujan* atau *sudah hujan*: tanpa pelaku, seperti bahasa Indonesia. Bahasa Inggris malah perlu *it*.

Batasnya ada pada *sekali*. Bahasa Indonesia menaruh *sekali* di belakang (*panas sekali*); Mandarin membungkus kata sifatnya: **太热了**. Dan **太…了** bisa berarti *terlalu*, jadi **太贵了** adalah keluhan, bukan pujian. Ingat juga: Jakarta jarang **冷**, tapi kantor ber-AC bisa **有点儿冷**.

## contrast.en

**下雨了** is very close to *hujan* or *sudah hujan*: no subject, as in Indonesian. English, by contrast, needs *it*.

The limit is with *sekali*. Indonesian puts *sekali* after (*panas sekali*); Mandarin wraps the adjective: **太热了**. And **太…了** can mean *too*, so **太贵了** is a complaint, not a compliment. Remember too: Jakarta is rarely **冷**, but an air-conditioned office can be **有点儿冷**.
