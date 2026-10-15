// Regenerates the table in UPSTREAM.md by comparing this repo with an English Ladder checkout.
// Usage: node scripts/upstream.mjs <path-to-english-ladder-at-58eab3c>
// A file is "verbatim" when identical, "adapted" when it exists here but differs, and
// "replaced" when English Ladder's file was removed and an Arabic counterpart took its place.
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const src = process.argv[2];
if (!src) {
  console.error('usage: node scripts/upstream.mjs <english-ladder checkout>');
  process.exit(1);
}
const REPLACED = {
  'components/ui/Contours.tsx': 'components/ui/Lattice.tsx',
  'components/lesson/ExplainToggle.tsx': 'components/lesson/LessonTopToggles.tsx',
  'components/visuals/NounBuilder.tsx': '(removed: English only)',
  'components/visuals/NearFar.tsx': '(removed: English only)',
  'components/visuals/nounLogic.ts': '(removed: English only)',
  'tests/unit/visuals.test.tsx': 'tests/unit/visuals.test.tsx (Arabic visuals)',
  'tests/e2e/flows.spec.ts': 'tests/e2e/flows.spec.ts (Arabic flows)',
};
const files = execSync('git ls-files', { cwd: src, encoding: 'utf8' })
  .split('\n')
  .filter((f) => f && !f.startsWith('content/') && !/^(CLAUDE|DESIGN|PRD|README)\.md$/.test(f));
const rows = files.map((f) => {
  const here = path.join(process.cwd(), f);
  if (REPLACED[f]) return `| \`${f}\` | replaced | ${REPLACED[f]} |`;
  if (!fs.existsSync(here)) return `| \`${f}\` | replaced | (removed) |`;
  const same = fs.readFileSync(here).equals(fs.readFileSync(path.join(src, f)));
  return `| \`${f}\` | ${same ? 'verbatim' : 'adapted'} | |`;
});
const doc = fs.readFileSync('UPSTREAM.md', 'utf8');
const start = doc.indexOf('<!-- table -->');
const end = doc.indexOf('<!-- /table -->');
const table = ['<!-- table -->', '| English Ladder file | Status | Arabic Ladder counterpart |', '|---|---|---|', ...rows, '<!-- /table -->'].join('\n');
fs.writeFileSync('UPSTREAM.md', doc.slice(0, start) + table + doc.slice(end + '<!-- /table -->'.length));
console.log(`UPSTREAM.md: ${rows.length} files`);
