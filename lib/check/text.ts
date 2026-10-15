import type { CheckItem } from '../types';
import { stripMarkup } from '../markup';
import { MARK_LABEL } from '../arabic/marks';

/** A one-line text representation of an item, for the continue card and review lists. */
export function itemText(item: CheckItem): string {
  switch (item.type) {
    case 'choice':
    case 'gap':
      return stripMarkup(item.prompt);
    case 'order':
      return item.prompt ? stripMarkup(item.prompt) : item.tiles.join(' · ');
    case 'scene':
      return item.prompt ? stripMarkup(item.prompt) : stripMarkup(item.answer);
    case 'fix':
      return stripMarkup(item.wrong);
    case 'listen':
      return item.prompt ? stripMarkup(item.prompt) : 'Dengarkan, lalu pilih.';
    case 'read':
      return stripMarkup(item.ar);
    case 'spell':
      return item.prompt ? stripMarkup(item.prompt) : item.dictation ? 'Dengarkan, lalu susun hurufnya.' : 'Susun hurufnya.';
    case 'mark':
      return stripMarkup(item.ar);
  }
}

/** The correct answer as a sentence-ish string. */
export function answerText(item: CheckItem): string {
  if (item.type === 'order') return item.answer.join(' ');
  if (item.type === 'mark') return `${stripMarkup(item.ar)} · ${MARK_LABEL[item.answer]}`;
  if (item.type === 'read') return `${stripMarkup(item.ar)} · ${item.answer}`;
  if ((item.type === 'gap' || item.type === 'choice') && item.prompt.includes('___')) {
    return stripMarkup(item.prompt.replace('___', item.answer));
  }
  return stripMarkup(item.answer);
}
