/** Indonesian letter names, for screen-reader labels on tiles and visuals (matches content/data/letters.yaml). */
export const LETTER_NAME: Record<string, string> = {
  ا: 'alif', ب: 'ba', ت: 'ta', ث: 'tsa', ج: 'jim', ح: 'ḥa', خ: 'kha', د: 'dal', ذ: 'dzal', ر: 'ra', ز: 'zai',
  س: 'sin', ش: 'syin', ص: 'shad', ض: 'dhad', ط: 'tha', ظ: 'zha', ع: 'ʿain', غ: 'ghain', ف: 'fa', ق: 'qaf',
  ك: 'kaf', ل: 'lam', م: 'mim', ن: 'nun', ه: 'ha', و: 'wau', ي: 'ya', ء: 'hamzah', أ: 'alif hamzah', إ: 'alif hamzah bawah',
  آ: 'alif madd', ؤ: 'wau hamzah', ئ: 'ya hamzah', ة: 'ta marbuthah', ى: 'alif maqshurah',
};

/** "kaf" for ك, "ba fathah" for بَ; falls back to the text itself. */
export function letterLabel(s: string): string {
  const base = [...s].find((c) => LETTER_NAME[c]);
  if (!base) return s;
  const marks: [string, string][] = [['َ', 'fathah'], ['ِ', 'kasrah'], ['ُ', 'dhammah'], ['ْ', 'sukun'], ['ّ', 'syaddah']];
  const extra = marks.filter(([m]) => s.includes(m)).map(([, n]) => n);
  return [LETTER_NAME[base], ...extra].join(' ');
}
