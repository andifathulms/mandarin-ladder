import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { ProgressProvider } from '@/components/ProgressProvider';
import { VisualDataProvider } from '@/components/visuals/VisualData';
import { LetterForms, highlightLetter } from '@/components/visuals/LetterForms';
import { WordJoiner, formsOf } from '@/components/visuals/WordJoiner';
import { HarakatBuilder, syllable } from '@/components/visuals/HarakatBuilder';
import { SunMoon, withArticle } from '@/components/visuals/SunMoon';
import { Makhraj } from '@/components/visuals/Makhraj';
import { Agreement, agreeWord } from '@/components/visuals/Agreement';
import { PlaceSceneAr, placeSentenceAr } from '@/components/visuals/PlaceSceneAr';
import { getLetters, getMakhraj } from '@/lib/content/load';
import { ZWJ } from '@/lib/arabic';

const data = { letters: getLetters(), makhraj: getMakhraj() };
const wrap = (ui: React.ReactNode) =>
  render(
    <ProgressProvider>
      <VisualDataProvider value={data}>{ui}</VisualDataProvider>
    </ProgressProvider>,
  );

describe('LetterForms', () => {
  it('colours one letter in a word with ZWJ on joined sides', () => {
    expect(highlightLetter('صَبَاحٌ', 'ب', 'medial')).toEqual([`صَ${ZWJ}`, `${ZWJ}بَ${ZWJ}`, `${ZWJ}احٌ`]);
    expect(highlightLetter('قَلْبٌ', 'ب', 'final')).toEqual([`قَلْ${ZWJ}`, `${ZWJ}بٌ`, '']);
    // after alif (non-joiner) no ZWJ
    expect(highlightLetter('بَابٌ', 'ا', 'medial')[2]).toBe('بٌ');
  });
  it('switches family letters and positions, with RTL arrows', () => {
    wrap(<LetterForms letter="ب" lang="id" />);
    fireEvent.click(screen.getAllByRole('button', { name: 'tsa' })[0]);
    expect(screen.getByText(/Huruf tsa, bentuk awal/)).toBeInTheDocument();
    fireEvent.keyDown(screen.getByRole('radiogroup'), { key: 'ArrowLeft' });
    expect(screen.getByText(/bentuk tengah/)).toBeInTheDocument();
  });
  it('marks non-joiners', () => {
    wrap(<LetterForms letter="د" lang="id" />);
    expect(screen.getAllByText('tidak menyambung ke kiri').length).toBeGreaterThan(0);
  });
});

describe('WordJoiner', () => {
  it('names each form from the joining rules', () => {
    expect(formsOf([...'كتب'])).toEqual(['awal', 'tengah', 'akhir']);
    expect(formsOf([...'ورد'])).toEqual(['sendiri', 'sendiri', 'sendiri']);
    expect(formsOf([...'بيت'])).toEqual(['awal', 'tengah', 'akhir']);
    expect(formsOf([...'مدرسة'])).toEqual(['awal', 'akhir', 'sendiri', 'awal', 'akhir']);
  });
  it('pulls the word apart and back', () => {
    wrap(<WordJoiner preset="قلم" lang="id" />);
    fireEvent.click(screen.getByRole('button', { name: 'Lepas' }));
    expect(screen.getByRole('button', { name: 'Sambung' })).toHaveAttribute('aria-pressed', 'true');
  });
});

describe('HarakatBuilder', () => {
  it('builds syllables, stacks syaddah with a vowel, and adds mad', () => {
    expect(syllable('ب', false, 'fatha')).toBe('بَ');
    expect(syllable('ب', true, 'fatha')).toBe('بَّ'.normalize('NFC').length === 3 ? 'بَّ' : 'بَّ');
    expect(syllable('ب', false, 'mad-u')).toBe('بُو');
  });
  it('offers only three marks in Huruf 1', () => {
    wrap(<HarakatBuilder letter="ب" set="short" lang="id" />);
    expect(screen.queryByRole('button', { name: 'sukun' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'kasrah' }));
    expect(screen.getByText(/ba kasrah: bi/)).toBeInTheDocument();
  });
});

describe('SunMoon', () => {
  it('assimilates sun letters and keeps the lam before moon letters', () => {
    expect(withArticle('شَمْسُ', true)).toBe('الشّ' + 'َمْسُ');
    expect(withArticle('قَمَرُ', false)).toBe('الْقَمَرُ');
  });
  it('announces the reading', () => {
    wrap(<SunMoon letter="ش" lang="id" />);
    expect(screen.getByText(/syin huruf syamsiyah, dibaca asy-syamsu/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'qaf' }));
    expect(screen.getByText(/qaf huruf qamariyah, dibaca al-qamaru/)).toBeInTheDocument();
  });
});

describe('Makhraj', () => {
  it('labels both places of articulation', () => {
    wrap(<Makhraj pair={['ع', 'ء']} lang="id" />);
    expect(screen.getByText('tengah tenggorokan')).toBeInTheDocument();
    expect(screen.getByText('pangkal tenggorokan')).toBeInTheDocument();
  });
});

describe('Agreement', () => {
  it('adds ة for a feminine noun and al- on both words', () => {
    expect(agreeWord('كَبِيرٌ', { definite: false, feminine: true }).join('')).toBe('كَبِيرَةٌ');
    expect(agreeWord('سَيَّارَةٌ', { definite: true }).join('').normalize('NFC')).toBe('السَّيَّارَةُ'.normalize('NFC'));
    expect(agreeWord('بَيْتٌ', { definite: true }).join('')).toBe('البَيْتُ');
  });
  it('renders the phrase', () => {
    wrap(<Agreement noun="سَيَّارَةٌ" adjective="جَدِيدٌ" lang="id" />);
    expect(screen.getByText('mobil baru')).toBeInTheDocument();
  });
});

describe('PlaceSceneAr', () => {
  it('builds the Arabic sentence for a place', () => {
    expect(placeSentenceAr('under').ar).toBe('الكُرَةُ [[تَحْتَ]] الطَّاوِلَةِ.');
    expect(placeSentenceAr('in').tr).toBe('al-kuratu [[fī]] ṣ-ṣundūqi.');
  });
  it('moves the ball with RTL arrow keys', () => {
    wrap(<PlaceSceneAr initial="in" lang="id" />);
    fireEvent.keyDown(screen.getByRole('radiogroup'), { key: 'ArrowLeft' });
    expect(screen.getByRole('radio', { checked: true })).toHaveAccessibleName(/ʿalā/);
  });
});
