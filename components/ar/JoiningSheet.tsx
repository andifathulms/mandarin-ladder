'use client';

import { EXTRA_LETTERS, HIJAI } from '@/lib/arabic/alphabet';
import { letterForm } from '@/lib/arabic/join';
import { ArIsland } from './ArIsland';
import { ArSentence } from './ArSentence';
import { Translit } from './Translit';

const POSITIONS = ['isolated', 'initial', 'medial', 'final'] as const;

// Focus boundaries inside words: after a joining letter, after a non-joiner, and at a suffix.
const FOCUS_CASES = [
  '[[ال]]كِتَابُ',
  'كِتَابُ[[كَ]]',
  'بَيْتُ[[هَا]]',
  '[[بِ]]جَانِبِ',
  'مُ[[دَرِّ]]سٌ',
  'دَ[[ارٌ]]',
  'الْ[[قَمَرُ]]',
  'مُعَلِّمَ[[ةٌ]]',
];

// What the spell answer line shows as letters are placed one by one.
const SPELL_STEPS = ['ك', 'كت', 'كتا', 'كتاب', 'م', 'مد', 'مدر', 'مدرس', 'مدرسة', 'و', 'ور', 'ورد'];

/** Every letter in its four forms, focus cases mid-word and spell answer lines, for screenshot review. */
export function JoiningSheet() {
  return (
    <main className="page flex max-w-home flex-col gap-6 bg-paper py-6" data-joining-sheet>
      <h1 className="text-h2">Joining sheet</h1>
      <section aria-label="letter forms" className="grid grid-cols-2 gap-x-6 gap-y-1 min-[700px]:grid-cols-3">
        {[...HIJAI, ...EXTRA_LETTERS].map((l) => (
          <div key={l} className="flex items-center justify-between gap-2 border-b border-rule">
            <span className="label text-muted">{l.codePointAt(0)!.toString(16).toUpperCase()}</span>
            <ArIsland block size="body" className="flex gap-4">
              {POSITIONS.map((p) => (
                <span key={p}>{letterForm(l, p)}</span>
              ))}
              <span className="text-muted">
                {'ب' + l + 'ب'}
              </span>
            </ArIsland>
          </div>
        ))}
      </section>
      <section aria-label="focus inside words" className="grid grid-cols-2 gap-3 min-[700px]:grid-cols-4">
        {FOCUS_CASES.map((c) => (
          <ArSentence key={c} ar={c} play={false} />
        ))}
      </section>
      <section aria-label="faces" className="flex flex-wrap items-end gap-6">
        <ArIsland block size="glyph" face="display">
          سُلَّم
        </ArIsland>
        <ArIsland block size="small" face="ui">
          طاولة · كتاب
        </ArIsland>
        <Translit text="ā ī ū ḥ ṣ ḍ ṭ ẓ ʿ ʾ · asy-syamsu · fī l-bayti" />
      </section>
      <section aria-label="spell answer lines" className="flex flex-wrap gap-3">
        {SPELL_STEPS.map((s) => (
          <ArIsland key={s} block size="body" className="rounded-sm border-b-2 border-rule px-3">
            {s}
          </ArIsland>
        ))}
      </section>
    </main>
  );
}
