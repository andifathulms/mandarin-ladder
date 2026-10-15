---
id: easy1-13-tidak-belum
rung: easy-1
order: 13
status: draft
minutes: 9
title: { id: "Tidak dan belum", en: "Not and didn't", zh: "不 和 没", py: "bù hé méi" }
summary:
  id: "Kalimat dasar: pelaku + kata kerja + sasaran (我喝茶). 不 untuk kebiasaan, keinginan dan masa depan; 没 untuk yang tidak terjadi; 还没 untuk *belum*."
  en: "The basic sentence: subject + verb + object (我喝茶). 不 for habits, wishes and the future; 没 for what didn't happen; 还没 for *not yet*."
introduces: [g1-14, g1-29, g1-25]
spiral: negation
worked:
  - { zh: "我 [[不]] 喝 茶 。", py: "wǒ [[bù]] hē chá .", id: "Aku tidak minum teh.", en: "I don't drink tea." }
  - { zh: "我 昨天 [[没]] 喝 茶 。", py: "wǒ zuótiān [[méi]] hē chá .", id: "Kemarin aku tidak minum teh.", en: "I didn't drink tea yesterday." }
  - { zh: "我 [[还 没]] 吃 早饭 。", py: "wǒ [[hái méi]] chī zǎofàn .", id: "Aku belum sarapan.", en: "I haven't had breakfast yet." }
examples:
  - zh: "布迪 [[不]] 吃 肉 。"
    py: "Bùdí [[bù]] chī ròu ."
    id: "Budi tidak makan daging."
    en: "Budi doesn't eat meat."
    note: { id: "Kebiasaan atau pilihan: **不**.", en: "A habit or a choice: **不**." }
  - zh: "明天 我 [[不]] 上课 。"
    py: "míngtiān wǒ [[bú]] shàngkè ."
    id: "Besok aku tidak masuk kelas."
    en: "I have no class tomorrow."
    note: { id: "Sebelum nada 4, **不** dibaca **bú**: **不上课** bú shàngkè.", en: "Before tone 4, **不** is read **bú**: **不上课** bú shàngkè." }
  - zh: "他 昨天 [[没]] 上班 。"
    py: "tā zuótiān [[méi]] shàngbān ."
    id: "Kemarin dia tidak masuk kerja."
    en: "He didn't go to work yesterday."
  - zh: "我 [[没有]] 去 医院 。"
    py: "wǒ [[méiyǒu]] qù yīyuàn ."
    id: "Aku tidak pergi ke rumah sakit."
    en: "I didn't go to the hospital."
    note: { id: "**没有** + kata kerja sama dengan **没** + kata kerja: tidak terjadi.", en: "**没有** + verb is the same as **没** + verb: it didn't happen." }
  - zh: "她 [[还 没]] 来 。"
    py: "tā [[hái méi]] lái ."
    id: "Dia belum datang."
    en: "She hasn't come yet."
  - zh: "这 个 菜 [[不]] 贵 。"
    py: "zhè gè cài [[bú]] guì ."
    id: "Masakan ini tidak mahal."
    en: "This dish isn't expensive."
    note: { id: "Kata sifat langsung jadi inti kalimat, tanpa **是**. Sangkalannya **不**.", en: "An adjective is the predicate itself, with no **是**. It's negated with **不**." }
pair:
  off: { zh: "我 昨天 不 去 学校 。", py: "wǒ zuótiān bú qù xuéxiào ." }
  natural: { zh: "我 昨天 [[没]] 去 学校 。", py: "wǒ zuótiān [[méi]] qù xuéxiào ." }
tone: { zh: "不 去", py: "bú qù", note: { id: "**不** biasanya nada 4, tapi sebelum nada 4 lain berubah jadi nada 2: **bú qù**. **没** selalu nada 2.", en: "**不** is usually tone 4, but before another tone 4 it becomes tone 2: **bú qù**. **没** is always tone 2." } }
hanzi: [昨, 菜, 肉, 课, 班, 早]
words:
  id: "*Tidak punya* selalu **没有**, tidak pernah *不有*: **我没有钱**. Dan *belum* adalah **还没** (hái méi), bukan **不** saja: **我还没吃早饭**."
  en: "*Don't have* is always **没有**, never *不有*: **我没有钱**. And *not yet* is **还没** (hái méi), not just **不**: **我还没吃早饭**."
talk:
  lines:
    - { who: "张 丽", zh: "布迪 ， 你 吃 肉 吗 ？", py: "Bùdí , nǐ chī ròu ma ?", id: "Budi, kamu makan daging?", en: "Budi, do you eat meat?" }
    - { who: "Budi", zh: "我 不 吃 肉 ， 我 吃 菜 。", py: "wǒ bù chī ròu , wǒ chī cài .", id: "Aku tidak makan daging, aku makan sayur.", en: "I don't eat meat, I eat vegetables." }
    - { who: "张 丽", zh: "王 明 还 没 来 。", py: "Wáng Míng hái méi lái .", id: "Wang Ming belum datang.", en: "Wang Ming hasn't come yet." }
    - { who: "Budi", zh: "他 今天 不 来 。", py: "tā jīntiān bù lái .", id: "Hari ini dia tidak datang.", en: "He isn't coming today." }
tirukan: { zh: "我 昨天 没 去 ， 明天 我 去 。", py: "wǒ zuótiān méi qù , míngtiān wǒ qù .", id: "Kemarin aku tidak pergi, besok aku pergi.", en: "I didn't go yesterday; I'll go tomorrow." }
check:
  - id: e1-13-c1
    type: gap
    cue: "Kemarin dia tidak masuk kerja."
    prompt: "他 昨天 ___ 上班 。"
    options: ["没", "不", "也"]
    answer: "没"
    why: { id: "**昨天** dan sesuatu yang tidak terjadi: **没**.", en: "**昨天** and something that didn't happen: **没**." }
  - id: e1-13-c2
    type: gap
    cue: "Budi tidak makan daging (memang tidak pernah)."
    prompt: "布迪 ___ 吃 肉 。"
    options: ["不", "没", "还 没"]
    answer: "不"
    why: { id: "Kebiasaan atau pilihan memakai **不**.", en: "A habit or a choice takes **不**." }
  - id: e1-13-c3
    type: fix
    wrong: "我 昨天 不 去 学校 。"
    options: ["我 昨天 没 去 学校 。", "我 没 昨天 去 学校 。"]
    answer: "我 昨天 没 去 学校 。"
    why: { id: "Sesuatu yang tidak terjadi kemarin memakai **没**. Waktu tetap sebelum kata kerja.", en: "Something that didn't happen yesterday takes **没**. The time stays before the verb." }
  - id: e1-13-c4
    type: choice
    prompt: "Bagaimana bilang *aku belum sarapan*?"
    options: ["我 还 没 吃 早饭 。", "我 不 吃 早饭 。", "我 没有 早饭 。"]
    answer: "我 还 没 吃 早饭 。"
    why: { id: "*Belum* = **还没**. **我不吃早饭** berarti aku tidak (biasa) sarapan.", en: "*Not yet* = **还没**. **我不吃早饭** means I don't (usually) eat breakfast." }
  - id: e1-13-c5
    type: listen
    audio: "她 还 没 来 。"
    options: ["Dia belum datang.", "Dia tidak mau datang.", "Dia sudah datang."]
    answer: "Dia belum datang."
    why: { id: "**还没来**: belum datang, tapi mungkin sebentar lagi.", en: "**还没来**: hasn't come yet, but may soon." }
  - id: e1-13-c6
    type: trace
    char: "早"
    guide: on
    why: { id: "**早** = **日** di atas, **十** di bawah. Tulis **日** dulu, lalu garis datar, lalu garis tegak.", en: "**早** = **日** on top, **十** below. Write **日** first, then the horizontal, then the vertical." }
glossary:
  - { zh: "不", py: "bù", id: "tidak", en: "not", hsk: "1" }
  - { zh: "没", py: "méi", id: "tidak (terjadi)", en: "didn't, not (happen)", hsk: "1" }
  - { zh: "没有", py: "méiyǒu", id: "tidak punya; tidak (terjadi)", en: "not have; didn't", hsk: "1" }
  - { zh: "还", py: "hái", id: "masih", en: "still", hsk: "1" }
  - { zh: "昨天", py: "zuótiān", id: "kemarin", en: "yesterday", hsk: "1" }
  - { zh: "明天", py: "míngtiān", id: "besok", en: "tomorrow", hsk: "1" }
  - { zh: "早饭", py: "zǎofàn", id: "sarapan", en: "breakfast", hsk: "1" }
  - { zh: "肉", py: "ròu", id: "daging", en: "meat", hsk: "1" }
  - { zh: "菜", py: "cài", id: "sayur; masakan", en: "vegetable; dish", hsk: "1" }
  - { zh: "上课", py: "shàngkè", id: "masuk kelas", en: "to have class", hsk: "1" }
  - { zh: "上班", py: "shàngbān", id: "masuk kerja", en: "to go to work", hsk: "1" }
  - { zh: "医院", py: "yīyuàn", id: "rumah sakit", en: "hospital", mw: "个", hsk: "1" }
  - { zh: "来", py: "lái", id: "datang", en: "to come", hsk: "1" }
  - { zh: "去", py: "qù", id: "pergi", en: "to go", hsk: "1" }
next: easy1-14-bisa
---

## concept.id

Kalimat dasar Mandarin sama dengan bahasa Indonesia: pelaku + kata kerja + sasaran. **我喝茶**, aku minum teh. Kata kerjanya tidak berubah untuk siapa pun atau kapan pun.

Untuk menyangkal, ada dua kata, dan keduanya duduk tepat sebelum kata kerja.

**不** (bù) untuk kebiasaan, pilihan, keinginan, dan yang akan datang: **我不喝茶** (aku tidak minum teh), **明天我不上课** (besok aku tidak masuk kelas). **不** juga menyangkal kata sifat: **不贵**.

**没** atau **没有** (méi, méiyǒu) untuk sesuatu yang tidak terjadi: **他昨天没上班**. Dengan **还** di depannya, artinya *belum*: **她还没来**.

## concept.en

The basic Mandarin sentence is the same as Indonesian: subject + verb + object. **我喝茶**, I drink tea. The verb doesn't change for anyone or any time.

To negate, there are two words, and both sit right before the verb.

**不** (bù) is for habits, choices, wishes and what's to come: **我不喝茶** (I don't drink tea), **明天我不上课** (I have no class tomorrow). **不** also negates adjectives: **不贵**.

**没** or **没有** (méi, méiyǒu) is for something that didn't happen: **他昨天没上班**. With **还** in front, it means *not yet*: **她还没来**.

## contrast.id

Bahasa Indonesia memakai satu kata, *tidak*, untuk dua hal yang dibedakan Mandarin. *Aku tidak pergi* bisa berarti **我不去** (aku tidak mau atau tidak akan pergi) atau **我没去** (aku memang tidak pergi). Tanyakan: ini soal kebiasaan atau rencana, atau soal kejadian?

*Belum* lebih mudah: hampir selalu **还没**. Tapi bahasa Indonesia sering memakai *belum* untuk yang masih mungkin terjadi, sedangkan **没** tanpa **还** hanya berkata *tidak terjadi*, tanpa harapan.

## contrast.en

Indonesian uses one word, *tidak*, for two things Mandarin keeps apart. *Aku tidak pergi* can mean **我不去** (I won't or don't want to go) or **我没去** (I didn't go). Ask: is it a habit or a plan, or is it about something that happened?

*Belum* is easier: it's almost always **还没**. But Indonesian uses *belum* for things that may still happen, while **没** without **还** just says *didn't happen*, with no hint of later.
