// 150 hand-checked transliteration pairs (CLAUDE.md §9, §10). Written from the scheme, not from
// the function: when one fails, check the scheme first, then fix the code.
export const PAIRS: [string, string][] = [
  // short vowels, syllables (Huruf 1)
  ['بَ', 'ba'], ['بِ', 'bi'], ['بُ', 'bu'], ['تَ', 'ta'], ['ثَ', 'tsa'], ['جِ', 'ji'], ['حُ', 'ḥu'], ['خَ', 'kha'],
  ['دَ', 'da'], ['ذُ', 'dzu'], ['رِ', 'ri'], ['زَ', 'za'], ['سُ', 'su'], ['شَ', 'sya'], ['صِ', 'ṣi'], ['ضَ', 'ḍa'],
  ['طُ', 'ṭu'], ['ظَ', 'ẓa'], ['عَ', 'ʿa'], ['غِ', 'ghi'], ['فُ', 'fu'], ['قَ', 'qa'], ['كِ', 'ki'], ['لُ', 'lu'],
  ['مَ', 'ma'], ['نِ', 'ni'], ['هُ', 'hu'], ['وَ', 'wa'], ['يَ', 'ya'],
  // short-vowel words
  ['كَتَبَ', 'kataba'], ['بَرَدَ', 'barada'], ['ثَبَتَ', 'tsabata'], ['جَلَسَ', 'jalasa'], ['خَرَجَ', 'kharaja'],
  ['رَجَعَ', 'rajaʿa'], ['ذَهَبَ', 'dzahaba'], ['فَتَحَ', 'fataḥa'], ['قَلَمٌ', 'qalamun'], ['وَلَدٌ', 'waladun'],
  ['بَقَرٌ', 'baqarun'], ['شَجَرٌ', 'syajarun'], ['جَبَلٌ', 'jabalun'], ['حَسَنٌ', 'ḥasanun'], ['قَمَرٌ', 'qamarun'],
  ['عُمَرُ', 'ʿumaru'], ['مَلِكٌ', 'malikun'], ['كُتُبٌ', 'kutubun'], ['رُسُلٌ', 'rusulun'], ['إِبِلٌ', 'ibilun'],
  // long vowels (mad)
  ['بَابٌ', 'bābun'], ['كِتَابٌ', 'kitābun'], ['نُورٌ', 'nūrun'], ['دِينٌ', 'dīnun'], ['سُوقٌ', 'sūqun'],
  ['فِيلٌ', 'fīlun'], ['نَارٌ', 'nārun'], ['طَالِبٌ', 'ṭālibun'], ['قَالَ', 'qāla'], ['كَبِيرٌ', 'kabīrun'],
  ['صَغِيرٌ', 'ṣaghīrun'], ['جَمِيلٌ', 'jamīlun'], ['طَوِيلٌ', 'ṭawīlun'], ['قَصِيرٌ', 'qaṣīrun'], ['جَدِيدٌ', 'jadīdun'],
  ['عَلَى', 'ʿalā'], ['فِي', 'fī'], ['أَبُو', 'abū'], ['مُوسَى', 'mūsā'], ['هٰذَا', 'hādzā'],
  ['ذٰلِكَ', 'dzālika'], ['هٰذِهِ', 'hādzihi'], ['تِلْكَ', 'tilka'], ['هُوَ', 'huwa'], ['هِيَ', 'hiya'],
  // sukun and diphthongs
  ['بَيْتٌ', 'baytun'], ['يَوْمٌ', 'yawmun'], ['لَوْنٌ', 'lawnun'], ['مَدْرَسَةٌ', 'madrasatun'], ['مَكْتَبٌ', 'maktabun'],
  ['قُلْ', 'qul'], ['نَعَمْ', 'naʿam'], ['أَنْتَ', 'anta'], ['أَنْتِ', 'anti'], ['مِنْ', 'min'],
  ['أَيْنَ', 'ayna'], ['كَيْفَ', 'kayfa'], ['خَوْفٌ', 'khawfun'], ['عَيْنٌ', 'ʿaynun'], ['شَمْسٌ', 'syamsun'],
  // shaddah
  ['مُعَلِّمٌ', 'muʿallimun'], ['مُدَرِّسٌ', 'mudarrisun'], ['سُكَّرٌ', 'sukkarun'], ['حَمَّامٌ', 'ḥammāmun'], ['كُرْسِيٌّ', 'kursiyyun'],
  ['إِنْدُونِيسِيٌّ', 'indūnīsiyyun'], ['مِصْرِيٌّ', 'miṣriyyun'], ['عَرَبِيٌّ', 'ʿarabiyyun'], ['قِطَّةٌ', 'qiṭṭatun'], ['جَدَّةٌ', 'jaddatun'],
  // tanwin
  ['كِتَابًا', 'kitāban'], ['بَيْتًا', 'baytan'], ['وَلَدٍ', 'waladin'], ['شُكْرًا', 'syukran'], ['عَفْوًا', 'ʿafwan'],
  ['أَهْلًا', 'ahlan'], ['جِدًّا', 'jiddan'], ['مَدِينَةٍ', 'madīnatin'], ['هُدًى', 'hudan'], ['سَهْلًا', 'sahlan'],
  // ta marbuta, pausal and vowelled
  ['مَدْرَسَة', 'madrasa'], ['طَاوِلَة', 'ṭāwila'], ['سَيَّارَة', 'sayyāra'], ['غُرْفَةُ', 'ghurfatu'], ['فَاطِمَةُ', 'fāṭimatu'],
  // hamza
  ['أَنَا', 'anā'], ['أُمٌّ', 'ummun'], ['إِلَى', 'ilā'], ['سَأَلَ', 'saʾala'], ['مَاءٌ', 'māʾun'],
  ['سَمَاءٌ', 'samāʾun'], ['رَأْسٌ', 'raʾsun'], ['بِئْرٌ', 'biʾrun'], ['مُؤْمِنٌ', 'muʾminun'], ['آبَاءٌ', 'ābāʾun'],
  // the article: moon letters
  ['الْقَمَرُ', 'al-qamaru'], ['الكِتَابُ', 'al-kitābu'], ['البَيْتُ', 'al-baytu'], ['الْوَلَدُ', 'al-waladu'], ['الْبَابُ', 'al-bābu'],
  ['الْمَدْرَسَةُ', 'al-madrasatu'], ['الْأُمُّ', 'al-ummu'], ['الْعَرَبِيَّةُ', 'al-ʿarabiyyatu'], ['الْجَبَلُ', 'al-jabalu'], ['الْخُبْزُ', 'al-khubzu'],
  // the article: sun letters
  ['الشَّمْسُ', 'asy-syamsu'], ['الطَّاوِلَةُ', 'aṭ-ṭāwilatu'], ['الرَّجُلُ', 'ar-rajulu'], ['السَّلَامُ', 'as-salāmu'], ['النُّورُ', 'an-nūru'],
  ['الدَّرْسُ', 'ad-darsu'], ['التُّفَّاحُ', 'at-tuffāḥu'], ['الصُّنْدُوقُ', 'aṣ-ṣundūqu'], ['الذَّهَبُ', 'adz-dzahabu'], ['الثَّوْبُ', 'ats-tsawbu'],
  // hamzat wasl after a vowel, and clitics
  ['فِي الْبَيْتِ', 'fī l-bayti'], ['عَلَى الطَّاوِلَةِ', 'ʿalā ṭ-ṭāwilati'], ['بَابُ البَيْتِ', 'bābu l-bayti'], ['صَبَاحُ الخَيْرِ', 'ṣabāḥu l-khayri'], ['بِالْقَلَمِ', 'bil-qalami'],
  ['وَالشَّمْسُ', 'wasy-syamsu'], ['لِلْبَيْتِ', 'lil-bayti'], ['اِسْمِي', 'ismī'], ['اللهُ', 'allāhu'], ['الْحَمْدُ لِلّٰهِ', 'al-ḥamdu lillāhi'],
  // phrases and sentences
  ['السَّلَامُ عَلَيْكُمْ', 'as-salāmu ʿalaykum'], ['أَنَا مِنْ إِنْدُونِيسِيَا', 'anā min indūnīsiyā'], ['مَا هٰذَا؟', 'mā hādzā?'],
  ['هٰذَا كِتَابٌ.', 'hādzā kitābun.'], ['البَيْتُ كَبِيرٌ.', 'al-baytu kabīrun.'], ['الكِتَابُ عَلَى الطَّاوِلَةِ.', 'al-kitābu ʿalā ṭ-ṭāwilati.'],
  ['مَنْ أَنْتَ؟', 'man anta?'], ['هَلْ أَنْتِ مُعَلِّمَةٌ؟', 'hal anti muʿallimatun?'], ['أَيْنَ الْقَلَمُ؟', 'ayna l-qalamu?'], ['نَعَمْ، أَنَا طَالِبٌ.', 'naʿam, anā ṭālibun.'],
];
