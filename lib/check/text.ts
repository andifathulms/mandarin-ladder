import type { CheckItem } from '../types';
import { stripMarkup } from '../markup';
import { plainZh } from '../zh/text';

const toneSeq = (t: number[]) => t.map((n) => (n === 0 ? '·' : n)).join(' + ');

/** A one-line text representation of an item, for the continue card and review lists. */
export function itemText(item: CheckItem): string {
  switch (item.type) {
    case 'choice':
    case 'gap':
      return plainZh(stripMarkup(item.prompt));
    case 'order':
      return item.prompt ? stripMarkup(item.prompt) : item.tiles.join(' · ');
    case 'scene':
      return item.prompt ? stripMarkup(item.prompt) : stripMarkup(item.answer);
    case 'fix':
      return plainZh(item.wrong);
    case 'listen':
      return item.prompt ? stripMarkup(item.prompt) : 'Dengarkan, lalu pilih.';
    case 'tone':
      return item.prompt ? stripMarkup(item.prompt) : 'Dengarkan, lalu pilih nadanya.';
    case 'pinyin':
      return item.prompt ? stripMarkup(item.prompt) : 'Dengarkan, lalu tulis pinyinnya.';
    case 'trace':
      return item.prompt ? stripMarkup(item.prompt) : `Tulis ${item.char}`;
    case 'build':
      return item.prompt ? stripMarkup(item.prompt) : `Bangun ${item.char}`;
  }
}

/** The correct answer as a sentence-ish string. */
export function answerText(item: CheckItem): string {
  switch (item.type) {
    case 'order':
      return plainZh(item.answer.join(' '));
    case 'tone':
      return `${plainZh(item.audio)} · ${toneSeq(item.answer)}`;
    case 'pinyin':
      return item.answer;
    case 'trace':
      return item.char;
    case 'build':
      return `${item.char} = ${item.answer.join(' + ')}`;
    case 'gap':
    case 'choice':
      if (item.prompt.includes('___')) return plainZh(stripMarkup(item.prompt.replace('___', item.answer)));
      return plainZh(stripMarkup(item.answer));
    default:
      return plainZh(stripMarkup(item.answer));
  }
}
