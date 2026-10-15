/*
 * Subsets the Chinese fonts to the characters the site uses (CLAUDE.md §7.6) and writes
 * styles/fonts-zh.css with @font-face rules. Run by `npm run build` (and before `npm run dev`).
 *
 * Characters come from content/**, the UI (lib/i18n, components, app) and the HSK character and word
 * lists of every live rung (so the word deck can show every word). They are ordered by first
 * appearance along the curriculum and cut into slices with their own unicode-range, so a page
 * downloads only the slices it uses: the first lessons need the first slice or two.
 *
 * Fails if the WenKai Regular subset (all slices) exceeds the 450 KB budget.
 */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import subsetFont from 'subset-font';
import { getCurriculum } from '../lib/content/load';
import { getChars, getWords, levelIndex, rungLevel, HSK_LEVELS } from '../lib/content/hsk';

const ROOT = process.cwd();
const SRC = path.join(ROOT, 'fonts-src');
const OUT_DIR = path.join(ROOT, 'styles', 'fonts-zh');
const CSS = path.join(ROOT, 'styles', 'fonts-zh.css');
const MANIFEST = path.join(ROOT, 'styles', 'fonts-zh.json');
export const BUDGET_WENKAI_REGULAR = 450 * 1024;

/** CJK punctuation and ASCII always ship in the first slice, so mixed lines never fall back. */
const ALWAYS = '，。！？、：；「」『』（）《》〈〉…—·～“”‘’' + Array.from({ length: 95 }, (_, i) => String.fromCharCode(32 + i)).join('');
const HAN = /\p{Script=Han}/u;

const FACES = [
  { family: 'Ladder WenKai', file: 'LXGWWenKai-Regular.ttf', weight: 400, slug: 'wenkai-400' },
  { family: 'Ladder WenKai', file: 'LXGWWenKai-Medium.ttf', weight: 500, slug: 'wenkai-500' },
  { family: 'Ladder Noto SC', file: 'NotoSansSC-Regular.otf', weight: 400, slug: 'noto-400' },
  { family: 'Ladder Noto SC', file: 'NotoSansSC-Medium.otf', weight: 500, slug: 'noto-500' },
] as const;

function walk(dir: string, exts: RegExp): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name))
    .flatMap((d) => {
      const p = path.join(dir, d.name);
      if (d.isDirectory()) return d.name === 'data' ? [] : walk(p, exts);
      return exts.test(d.name) ? [p] : [];
    });
}

/** Every Han character the site may show, in order of first appearance along the curriculum. */
export function collectChars(): string[] {
  const order: string[] = [];
  const seen = new Set<string>();
  const add = (text: string) => {
    for (const ch of text) {
      if (HAN.test(ch) && !seen.has(ch)) {
        seen.add(ch);
        order.push(ch);
      }
    }
  };
  const rungs = getCurriculum();
  // Lesson content in curriculum order, then the rest of content/ (placement, capstones, data files).
  for (const r of rungs) for (const f of walk(path.join(ROOT, 'content', r.id), /\.(md|ya?ml)$/)) add(fs.readFileSync(f, 'utf8'));
  for (const f of walk(path.join(ROOT, 'content'), /\.(md|ya?ml)$/)) add(fs.readFileSync(f, 'utf8'));
  for (const f of ['measure-words.yaml', 'hokkien.yaml', 'names.yaml', 'dasar-points.yaml', 'radicals.yaml']) {
    const p = path.join(ROOT, 'content', 'data', f);
    if (fs.existsSync(p)) add(fs.readFileSync(p, 'utf8'));
  }
  // UI strings.
  for (const dir of ['lib/i18n', 'components', 'app']) for (const f of walk(path.join(ROOT, dir), /\.(ts|tsx)$/)) add(fs.readFileSync(f, 'utf8'));
  // Live rungs: every character and word of their HSK levels (the deck shows them all).
  const live = rungs.filter((r) => r.status === 'live');
  const max = Math.max(-1, ...live.map((r) => levelIndex(rungLevel(r))));
  const chars = getChars();
  for (const l of HSK_LEVELS.slice(0, max + 1)) add(chars[l]);
  for (const w of getWords()) if (levelIndex(w.hsk) <= max) add(w.zh);
  return order;
}

/** "U+4E00-4E02,U+4E0A" for a set of characters. */
export function unicodeRange(chars: string[]): string {
  const cps = [...new Set(chars.map((c) => c.codePointAt(0)!))].sort((a, b) => a - b);
  const parts: string[] = [];
  for (let i = 0; i < cps.length; ) {
    let j = i;
    while (j + 1 < cps.length && cps[j + 1] === cps[j] + 1) j++;
    const hex = (n: number) => n.toString(16).toUpperCase();
    parts.push(i === j ? `U+${hex(cps[i])}` : `U+${hex(cps[i])}-${hex(cps[j])}`);
    i = j + 1;
  }
  return parts.join(', ');
}

/** Slices: the first ones small, so the first lessons download little. */
function slice(chars: string[]): string[][] {
  const sizes = [120, 180];
  const out: string[][] = [];
  let i = 0;
  let k = 0;
  while (i < chars.length) {
    const n = sizes[k] ?? 250;
    out.push(chars.slice(i, i + n));
    i += n;
    k += 1;
  }
  return out;
}

async function main() {
  for (const f of FACES) {
    if (!fs.existsSync(path.join(SRC, f.file))) {
      console.error(`fonts:subset — fonts-src/${f.file} is missing. Run npm run fonts:fetch.`);
      process.exit(1);
    }
  }
  const chars = collectChars();
  const slices = slice(chars);
  fs.rmSync(OUT_DIR, { recursive: true, force: true });
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const rules: string[] = [];
  const manifest: { chars: string; slices: { face: string; file: string; bytes: number; count: number }[] } = {
    chars: chars.join(''),
    slices: [],
  };
  const totals: Record<string, number> = {};
  for (const face of FACES) {
    const src = fs.readFileSync(path.join(SRC, face.file));
    for (const [k, s] of slices.entries()) {
      const text = (k === 0 ? ALWAYS : '') + s.join('');
      const buf = await subsetFont(src, text, { targetFormat: 'woff2' });
      const hash = crypto.createHash('sha1').update(buf).digest('hex').slice(0, 8);
      const file = `${face.slug}-${k}.${hash}.woff2`;
      fs.writeFileSync(path.join(OUT_DIR, file), buf);
      totals[face.slug] = (totals[face.slug] ?? 0) + buf.length;
      manifest.slices.push({ face: face.slug, file, bytes: buf.length, count: [...text].length });
      rules.push(
        `@font-face {\n  font-family: '${face.family}';\n  src: url('./fonts-zh/${file}') format('woff2');\n  font-weight: ${face.weight};\n  font-style: normal;\n  font-display: swap;\n  unicode-range: ${unicodeRange([...text])};\n}`,
      );
    }
  }
  fs.writeFileSync(
    CSS,
    `/* Generated by npm run fonts:subset: LXGW WenKai and Noto Sans SC (SIL OFL 1.1), subset to the\n   characters this site uses and sliced by unicode-range. Do not edit. */\n${rules.join('\n')}\n`,
  );
  fs.writeFileSync(MANIFEST, `${JSON.stringify(manifest)}\n`);

  const kb = (n: number) => `${(n / 1024).toFixed(0)} KB`;
  const first = manifest.slices.filter((s) => s.face === 'wenkai-400' && /-0\./.test(s.file))[0];
  console.log(
    `fonts:subset — ${chars.length} characters in ${slices.length} slices; ` +
      Object.entries(totals)
        .map(([f, n]) => `${f} ${kb(n)}`)
        .join(', ') +
      `; first WenKai slice ${kb(first.bytes)}`,
  );
  if (totals['wenkai-400'] > BUDGET_WENKAI_REGULAR) {
    console.error(`fonts:subset — WenKai Regular subset is ${kb(totals['wenkai-400'])}, over the ${kb(BUDGET_WENKAI_REGULAR)} budget`);
    process.exit(1);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename)) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
