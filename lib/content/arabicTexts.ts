import type { CheckItem, Dialogue, Lesson, Reading } from '../types';
import { stripMarkup } from '../markup';
import { hasArabic } from '../arabic/text';

/** One Arabic string a learner sees, with where it came from. Egyptian strings are marked. */
export type ArText = { where: string; ar: string; tr?: string; eg: boolean; displayOnly?: boolean };

/** Arabic strings inside a check item (prompts, options, tiles, audio). */
export function itemArabic(item: CheckItem): string[] {
  const out: string[] = [];
  const push = (s: string | undefined) => {
    if (s && hasArabic(s)) out.push(s);
  };
  switch (item.type) {
    case 'choice':
    case 'gap':
      push(item.prompt.replace('___', item.answer));
      item.options.forEach(push);
      break;
    case 'order':
      push(item.answer.join(' '));
      push(item.prompt);
      break;
    case 'scene':
      item.options.forEach(push);
      push(item.prompt);
      break;
    case 'fix':
      item.options.forEach(push);
      break;
    case 'listen':
      push(item.audio);
      item.options.forEach(push);
      break;
    case 'read':
      push(item.ar);
      item.options.forEach(push);
      break;
    case 'spell':
      push(item.answer);
      push(item.audio);
      break;
    case 'mark':
      push(item.ar);
      break;
  }
  return out.map(stripMarkup);
}

/** Every Arabic string in a lesson except explanations, Fusha and Egyptian. */
export function lessonArabic(l: Lesson): ArText[] {
  const out: ArText[] = [];
  const add = (where: string, ar: string | undefined, tr?: string, eg = false, displayOnly = false) => {
    if (ar) out.push({ where, ar: stripMarkup(ar), tr: tr && stripMarkup(tr), eg, displayOnly });
  };
  l.examples.forEach((e, i) => {
    add(`examples[${i}]`, e.ar, e.tr, false, e.display_only);
    add(`examples[${i}].eg`, e.eg, e.eg_tr, true);
  });
  l.worked?.forEach((e, i) => add(`worked[${i}]`, e.ar, e.tr, false, e.display_only));
  add('pair.off', l.pair.off.ar, l.pair.off.tr);
  add('pair.natural', l.pair.natural.ar, l.pair.natural.tr);
  l.sound?.words.forEach((w, i) => add(`sound.words[${i}]`, w.ar, w.tr));
  l.talk?.lines.forEach((t, i) => add(`talk[${i}]`, t.ar, t.tr, l.talk!.variety === 'eg'));
  add('tirukan', l.tirukan.ar, l.tirukan.tr);
  l.glossary.forEach((g, i) => {
    add(`glossary[${i}]`, g.ar, g.tr, false, g.display_only);
    add(`glossary[${i}].eg`, g.eg, g.eg_tr, true);
  });
  l.check.forEach((c) => itemArabic(c).forEach((s) => add(c.id, s)));
  return out;
}

export function readingArabic(r: Reading): ArText[] {
  return [
    { where: 'text', ar: stripMarkup(r.ar), tr: stripMarkup(r.tr), eg: false },
    ...r.glossary.map((g, i) => ({ where: `glossary[${i}]`, ar: g.ar, tr: g.tr, eg: false })),
    ...r.items.flatMap((c) => itemArabic(c).map((ar) => ({ where: c.id, ar, eg: false }))),
  ];
}

export function dialogueArabic(d: Dialogue): ArText[] {
  const eg = d.variety === 'eg';
  return [
    ...d.lines.map((l, i) => ({ where: `lines[${i}]`, ar: stripMarkup(l.ar), tr: stripMarkup(l.tr), eg })),
    ...d.items.flatMap((c) => itemArabic(c).map((ar) => ({ where: c.id, ar, eg: eg || c.type === 'listen' }))),
  ];
}

/** Every Arabic string with its audio variety, for audio:list and the manifest check. */
export function audioStrings(l: Lesson): { text: string; variety: 'fusha' | 'eg' }[] {
  const out: { text: string; variety: 'fusha' | 'eg' }[] = [];
  const add = (s: string | undefined, variety: 'fusha' | 'eg' = 'fusha') => {
    if (s && hasArabic(s)) out.push({ text: stripMarkup(s), variety });
  };
  l.examples.forEach((e) => {
    add(e.ar);
    add(e.eg, 'eg');
  });
  l.worked?.forEach((e) => add(e.ar));
  add(l.pair.natural.ar);
  l.sound?.words.forEach((w) => add(w.ar));
  l.talk?.lines.forEach((t) => add(t.ar, l.talk!.variety));
  add(l.tirukan.ar);
  l.glossary.forEach((g) => {
    add(g.ar);
    add(g.eg, 'eg');
  });
  l.check.forEach((c) => {
    if (c.type === 'listen') add(c.audio, c.variety);
    if (c.type === 'spell' && c.audio) add(c.audio);
  });
  return out;
}
