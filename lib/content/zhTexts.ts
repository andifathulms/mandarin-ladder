import type { CheckItem, Dialogue, Lesson, Reading } from '../types';
import { itemChinese } from './autopy';

/** One Chinese line a learner sees, with where it came from and its pinyin (when authored). */
export type ZhText = { where: string; zh: string; py?: string; off?: boolean };

const isLatinLine = (s: string) => /[A-Za-z]/.test(s.replace(/\*\*|\*|\[\[|\]\]/g, ''));

/**
 * Chinese strings inside a check item, with the pinyin filled in at load time. A mostly-Latin prompt
 * contributes each of its hanzi runs; strings still without pinyin are left out (content-check
 * reports them).
 */
export function itemTexts(c: CheckItem, where = c.id): ZhText[] {
  const out: ZhText[] = [];
  // A fix item's wrong sentence and wrong options are mistakes on purpose, like pair.off.
  const off = (s: string) => c.type === 'fix' && s !== c.answer;
  for (const s of itemChinese(c)) {
    if (isLatinLine(s)) {
      for (const m of s.matchAll(/\p{Script=Han}+/gu)) if (c.py?.[m[0]]) out.push({ where, zh: m[0], py: c.py[m[0]], off: off(s) });
    } else if (c.py?.[s]) out.push({ where, zh: s, py: c.py[s], off: off(s) });
  }
  return out;
}

/** Every Chinese line in a lesson except explanations. pair.off is marked: it is wrong on purpose. */
export function lessonZh(l: Lesson): ZhText[] {
  const out: ZhText[] = [];
  const add = (where: string, x?: { zh: string; py: string }, off = false) => {
    if (x) out.push({ where, zh: x.zh, py: x.py, off });
  };
  add('title', l.title);
  l.examples.forEach((e, i) => add(`examples[${i}]`, e));
  l.worked?.forEach((e, i) => add(`worked[${i}]`, e));
  add('pair.off', l.pair.off, true);
  add('pair.natural', l.pair.natural);
  add('tone', l.tone);
  l.talk?.lines.forEach((t, i) => add(`talk[${i}]`, t));
  add('tirukan', l.tirukan);
  l.glossary.forEach((g, i) => add(`glossary[${i}]`, g));
  l.check.forEach((c) => out.push(...itemTexts(c)));
  return out;
}

export function readingZh(r: Reading): ZhText[] {
  return [
    { where: 'title', zh: r.title.zh, py: r.title.py },
    ...r.lines.map((x, i) => ({ where: `lines[${i}]`, zh: x.zh, py: x.py })),
    ...r.glossary.map((g, i) => ({ where: `glossary[${i}]`, zh: g.zh, py: g.py })),
    ...r.items.flatMap((c) => itemTexts(c)),
  ];
}

export function dialogueZh(d: Dialogue): ZhText[] {
  return [
    { where: 'title', zh: d.title.zh, py: d.title.py },
    ...d.lines.map((x, i) => ({ where: `lines[${i}]`, zh: x.zh, py: x.py })),
    ...d.items.flatMap((c) => itemTexts(c)),
  ];
}
