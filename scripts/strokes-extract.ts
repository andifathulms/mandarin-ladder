/*
 * Copies stroke data for every character a learner can open (lib/content/usedChars.ts) from Make Me a
 * Hanzi's graphics.txt (vendor/, npm run data:fetch) into public/strokes/<codepoint>.json, with the
 * Arphic licence alongside (CLAUDE.md §5.6, §7.5). Each file: { strokes: [svgPath], medians: [[x,y][]] }
 * on the 1024 grid with y pointing up (flip when drawing). Files for characters no longer used are removed.
 */
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { usedChars } from '../lib/content/usedChars';
import { VENDOR } from './data-fetch';

const OUT = path.join(process.cwd(), 'public', 'strokes');

export const strokeFile = (ch: string) => `${ch.codePointAt(0)!.toString(16)}.json`;

async function main() {
  const src = path.join(VENDOR, 'mmah', 'graphics.txt');
  if (!fs.existsSync(src)) {
    console.error('strokes:extract — vendor/mmah/graphics.txt is missing (npm run data:fetch)');
    process.exit(1);
  }
  const want = usedChars().strokes;
  fs.mkdirSync(OUT, { recursive: true });
  const found = new Set<string>();
  const rl = readline.createInterface({ input: fs.createReadStream(src, 'utf8'), crlfDelay: Infinity });
  for await (const line of rl) {
    if (!line) continue;
    const ch = /^\{"character":"(.)"/u.exec(line)?.[1];
    if (!ch || !want.has(ch)) continue;
    const g = JSON.parse(line) as { strokes: string[]; medians: number[][][] };
    fs.writeFileSync(path.join(OUT, strokeFile(ch)), JSON.stringify({ strokes: g.strokes, medians: g.medians }));
    found.add(ch);
  }
  // Remove files for characters no longer used.
  let removed = 0;
  for (const f of fs.readdirSync(OUT)) {
    if (!f.endsWith('.json')) continue;
    const ch = String.fromCodePoint(parseInt(f.replace('.json', ''), 16));
    if (!want.has(ch)) {
      fs.unlinkSync(path.join(OUT, f));
      removed++;
    }
  }
  for (const f of ['COPYING']) fs.copyFileSync(path.join(VENDOR, 'mmah', f), path.join(OUT, f));
  const apl = path.join(VENDOR, 'mmah', 'APL', 'ARPHICPL.TXT');
  if (fs.existsSync(apl)) fs.copyFileSync(apl, path.join(OUT, 'ARPHICPL.TXT'));
  fs.writeFileSync(
    path.join(OUT, 'README.md'),
    'Stroke outlines and medians from [Make Me a Hanzi](https://github.com/skishore/makemeahanzi) `graphics.txt`\n' +
      '(pinned in `content/data/hsk/SOURCE.md`), derived from Arphic PL KaitiM GB and Arphic PL UKai and\n' +
      'redistributed under the Arphic Public License (`ARPHICPL.TXT`); see `COPYING`.\n' +
      'Written by `npm run strokes:extract`; one file per character, named by its code point.\n',
  );
  const missing = [...want].filter((c) => !found.has(c));
  console.log(`strokes:extract — ${found.size} characters written, ${removed} removed`);
  if (missing.length) console.warn(`strokes:extract — no stroke data for: ${missing.join('')}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
