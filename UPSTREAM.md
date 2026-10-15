# Upstream: English Ladder (via Arabic Ladder)

Mandarin Ladder started from [English Ladder](https://github.com/andifathulms/english-ladder) at commit
**`58eab3c`** ("feat(speech): clearer voice selection, female by default"). It is not a fork on GitHub
and shares no git history.

CLAUDE.md §2.5 asks for Arabic Ladder's generic additions to be ported rather than rewritten. Arabic
Ladder already carries them on top of the same English Ladder commit, so the files were taken from
[Arabic Ladder](https://github.com/andifathulms/arabic-ladder) at **`aedfae7`** ("fix(lesson): render
markup in focus, Mesir, talk and dialogue notes"). The generic additions ported that way:

| From Arabic Ladder | Files here |
|---|---|
| Two-door welcome | `components/ladder/TwoDoorWelcome.tsx` |
| Placement runner and scoring | `components/check/PlacementRunner.tsx`, `lib/check/placement.ts`, `applyPlacement` in `lib/progress/store.ts` |
| Capstone cards, reading and dialogue pages, saved capstones | `components/ladder/CapstoneCard.tsx`, `components/lesson/ReadingView.tsx`, `components/lesson/DialogueView.tsx`, `completeCapstone` |
| Lesson-scoped toggles | `components/lesson/LessonTopToggles.tsx` (Pinyin + Nada here) |
| Tirukan card | `components/lesson/TirukanCard.tsx` |
| Audio manifest pipeline | `lib/speech/audio.ts`, `scripts/audio-list.ts`, `scripts/audio-ingest.ts` |
| English Ladder fixes 3–7, 13–15 | quick review exit, capstones saved, lesson-scoped toggles, test progress by question, notch counts from data, climb title translated, theme-color follows the app, glossary audio on the Done screen |

Every English Ladder file is listed below:

- **verbatim**: identical to English Ladder at `58eab3c`. When English Ladder changes it, copy the new version across and run the tests.
- **adapted**: copied, then changed (for Mandarin, or by Arabic Ladder's generic additions). Port English Ladder fixes by hand and add a line to the log below.
- **replaced**: removed, with a Mandarin counterpart (or nothing) in its place.

Regenerate the table after adapting files:

```bash
git clone https://github.com/andifathulms/english-ladder /tmp/el && git -C /tmp/el checkout 58eab3c
node scripts/upstream.mjs /tmp/el
```

Once the three apps have been stable for a month after v1.0, the verbatim set is extracted into a
shared `ladder-core` package. Not before.

## Files

<!-- table -->
| English Ladder file | Status | Mandarin Ladder counterpart |
|---|---|---|
| `.eslintrc.json` | verbatim | |
| `.github/workflows/deploy.yml` | adapted | |
| `.gitignore` | adapted | |
| `.prettierignore` | verbatim | |
| `.prettierrc` | verbatim | |
| `app/about/page.tsx` | verbatim | |
| `app/font-files/AtkinsonNext-Italic-Variable.woff2` | adapted | |
| `app/font-files/AtkinsonNext-Variable.woff2` | adapted | |
| `app/font-files/README.md` | adapted | |
| `app/fonts.ts` | adapted | |
| `app/layout.tsx` | adapted | |
| `app/me/page.tsx` | verbatim | |
| `app/not-found.tsx` | verbatim | |
| `app/page.tsx` | adapted | |
| `app/review/page.tsx` | adapted | |
| `app/rung/[rung]/[lesson]/page.tsx` | adapted | |
| `app/rung/[rung]/page.tsx` | adapted | |
| `app/rung/[rung]/read/page.tsx` | adapted | |
| `app/rung/[rung]/test/page.tsx` | adapted | |
| `app/settings/page.tsx` | verbatim | |
| `app/themeScript.ts` | adapted | |
| `app/words/page.tsx` | adapted | |
| `components/AboutView.tsx` | adapted | |
| `components/MeView.tsx` | verbatim | |
| `components/ProgressProvider.tsx` | adapted | |
| `components/SettingsView.tsx` | adapted | |
| `components/WordsView.tsx` | adapted | |
| `components/check/CheckItemView.tsx` | adapted | |
| `components/check/CheckStep.tsx` | adapted | |
| `components/check/ClimbMoment.tsx` | adapted | |
| `components/check/OptionPill.tsx` | adapted | |
| `components/check/ReviewRunner.tsx` | adapted | |
| `components/check/TestRunner.tsx` | adapted | |
| `components/check/TileTray.tsx` | adapted | |
| `components/check/WhyLine.tsx` | adapted | |
| `components/ladder/ContinueCard.tsx` | adapted | |
| `components/ladder/HomeView.tsx` | adapted | |
| `components/ladder/LadderRail.tsx` | adapted | |
| `components/ladder/LessonRow.tsx` | adapted | |
| `components/ladder/LessonStrip.tsx` | adapted | |
| `components/ladder/NotchBar.tsx` | adapted | |
| `components/ladder/RungDetail.tsx` | adapted | |
| `components/ladder/RungView.tsx` | adapted | |
| `components/ladder/WeekStrip.tsx` | verbatim | |
| `components/lesson/BottomActionBar.tsx` | verbatim | |
| `components/lesson/ExplainToggle.tsx` | replaced | components/lesson/LessonTopToggles.tsx |
| `components/lesson/LessonPlayer.tsx` | adapted | |
| `components/lesson/PairCard.tsx` | adapted | |
| `components/lesson/PlayButton.tsx` | adapted | |
| `components/lesson/Prose.tsx` | adapted | |
| `components/lesson/ReadingView.tsx` | adapted | |
| `components/lesson/Sentence.tsx` | adapted | |
| `components/lesson/StepBar.tsx` | verbatim | |
| `components/lesson/StepLabel.tsx` | verbatim | |
| `components/lesson/StrandCards.tsx` | adapted | |
| `components/lesson/steps.ts` | verbatim | |
| `components/ui/AppHeader.tsx` | verbatim | |
| `components/ui/AppNav.tsx` | adapted | |
| `components/ui/AppShell.tsx` | verbatim | |
| `components/ui/Badge.tsx` | verbatim | |
| `components/ui/Contours.tsx` | replaced | components/ui/Grid.tsx |
| `components/ui/Icon.tsx` | adapted | |
| `components/ui/Mark.tsx` | adapted | |
| `components/ui/PageShell.tsx` | verbatim | |
| `components/ui/ProgressRing.tsx` | verbatim | |
| `components/ui/Segmented.tsx` | verbatim | |
| `components/ui/TierDot.tsx` | verbatim | |
| `components/ui/Toggle.tsx` | verbatim | |
| `components/ui/tier.ts` | adapted | |
| `components/useSpeech.ts` | adapted | |
| `components/visuals/NearFar.tsx` | replaced | (removed: English only) |
| `components/visuals/NounBuilder.tsx` | replaced | (removed: English only) |
| `components/visuals/PlaceScene.tsx` | adapted | |
| `components/visuals/VisualStage.tsx` | adapted | |
| `components/visuals/nounLogic.ts` | replaced | (removed: English only) |
| `components/visuals/placeLogic.ts` | verbatim | |
| `components/visuals/registry.ts` | adapted | |
| `components/visuals/types.ts` | verbatim | |
| `components/visuals/useRoving.ts` | adapted | |
| `lib/basePath.ts` | adapted | |
| `lib/check/draw.ts` | verbatim | |
| `lib/check/grade.ts` | adapted | |
| `lib/check/leitner.ts` | verbatim | |
| `lib/check/random.ts` | verbatim | |
| `lib/check/text.ts` | adapted | |
| `lib/content/lint.ts` | adapted | |
| `lib/content/load.ts` | adapted | |
| `lib/content/schema.ts` | adapted | |
| `lib/content/sections.ts` | verbatim | |
| `lib/i18n/en.ts` | adapted | |
| `lib/i18n/id.ts` | adapted | |
| `lib/i18n/index.ts` | verbatim | |
| `lib/markup.ts` | verbatim | |
| `lib/progress/constants.ts` | adapted | |
| `lib/progress/defaults.ts` | adapted | |
| `lib/progress/derive.ts` | adapted | |
| `lib/progress/migrations.ts` | adapted | |
| `lib/progress/store.ts` | adapted | |
| `lib/progress/types.ts` | adapted | |
| `lib/routes.ts` | adapted | |
| `lib/speech/sfx.ts` | verbatim | |
| `lib/speech/speak.ts` | adapted | |
| `lib/sw.ts` | verbatim | |
| `lib/types.ts` | adapted | |
| `lib/visualIds.ts` | adapted | |
| `next.config.mjs` | verbatim | |
| `package-lock.json` | adapted | |
| `package.json` | adapted | |
| `playwright.config.ts` | verbatim | |
| `postcss.config.mjs` | verbatim | |
| `public/icons/icon-192.png` | verbatim | |
| `public/icons/icon-512.png` | verbatim | |
| `public/icons/icon-maskable-512.png` | verbatim | |
| `public/icons/icon.svg` | adapted | |
| `public/manifest.webmanifest` | adapted | |
| `public/sw.js` | adapted | |
| `scripts/content-check.ts` | adapted | |
| `scripts/make-icons.mjs` | adapted | |
| `scripts/serve.mjs` | adapted | |
| `styles/globals.css` | adapted | |
| `styles/tokens.css` | adapted | |
| `tailwind.config.ts` | adapted | |
| `tests/e2e/a11y.spec.ts` | adapted | |
| `tests/e2e/flows.spec.ts` | adapted | |
| `tests/e2e/helpers.ts` | adapted | |
| `tests/setup.ts` | verbatim | |
| `tests/unit/Sentence.test.tsx` | verbatim | |
| `tests/unit/check-ui.test.tsx` | adapted | |
| `tests/unit/check.test.ts` | adapted | |
| `tests/unit/content.test.ts` | adapted | |
| `tests/unit/i18n.test.ts` | verbatim | |
| `tests/unit/markup.test.ts` | verbatim | |
| `tests/unit/progress.test.ts` | adapted | |
| `tests/unit/speech.test.ts` | adapted | |
| `tests/unit/tier.test.ts` | adapted | |
| `tests/unit/visuals.test.tsx` | adapted | |
| `tsconfig.json` | verbatim | |
| `vitest.config.ts` | verbatim | |
<!-- /table -->

## Port log

| Date | Source | Files | Note |
|---|---|---|---|
| 2026-10-16 | English Ladder `58eab3c` via Arabic Ladder `aedfae7` | all | Initial copy |
