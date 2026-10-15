/*
 * Downloads the vendor sources behind `npm run data:import` into ./vendor (git-ignored), pinned to the
 * commits recorded in content/data/hsk/SOURCE.md. Rarely run: the imported data is committed.
 * CC-CEDICT is published as a rolling daily file; its date is recorded by data:import.
 * Existing files are kept; pass --force to download again.
 */
import fs from 'node:fs';
import path from 'node:path';

export const PINS = {
  hsk: { repo: 'krmanik/HSK-3.0', sha: '182692ce5a11bc30bdc771835d2f0f27491c25de' },
  ckv: { repo: 'drkameleon/complete-hsk-vocabulary', sha: '7ac65bf1a6387d35f1ade478906172a19311c7f9' },
  mmah: { repo: 'skishore/makemeahanzi', sha: 'bddc96d41bef78427ed0e034e9f7e31d71fd1b92' },
  audioCmn: { repo: 'hugolpz/audio-cmn', sha: '59dbafbda8b172ffc3b8b295cd5938ae1b3de803' },
} as const;

export const LEVELS = ['1', '2', '3', '4', '5', '6', '7-9'] as const;
export const VENDOR = path.join(process.cwd(), 'vendor');

const raw = (repo: string, sha: string, file: string) =>
  `https://raw.githubusercontent.com/${repo}/${sha}/${file.split('/').map(encodeURIComponent).join('/')}`;

function files(): [string, string][] {
  const h = PINS.hsk;
  const out: [string, string][] = [];
  const base = 'New HSK (2021)';
  for (const l of LEVELS) {
    out.push([`hsk/words-${l}.txt`, raw(h.repo, h.sha, `${base}/HSK List/HSK ${l}.txt`)]);
    out.push([`hsk/meaning-${l}.tsv`, raw(h.repo, h.sha, `${base}/HSK List (Meaning)/HSK ${l}.tsv`)]);
    out.push([`hsk/hanzi-${l}.txt`, raw(h.repo, h.sha, `${base}/HSK Hanzi/HSK ${l}.txt`)]);
    out.push([`hsk/grammar-${l}.txt`, raw(h.repo, h.sha, `${base}/HSK Grammar/HSK ${l}.txt`)]);
  }
  for (const b of ['Elementary', 'Medium', 'Advanced']) {
    out.push([`hsk/handwriting-${b}.txt`, raw(h.repo, h.sha, `${base}/HSK Handwritten/${b}.txt`)]);
  }
  out.push(['hsk/License.md', raw(h.repo, h.sha, 'License.md')]);
  for (let l = 1; l <= 7; l++) out.push([`ckv/new-${l}.json`, raw(PINS.ckv.repo, PINS.ckv.sha, `wordlists/exclusive/new/${l}.json`)]);
  out.push(['ckv/LICENSE', raw(PINS.ckv.repo, PINS.ckv.sha, 'LICENSE')]);
  for (const f of ['graphics.txt', 'dictionary.txt', 'LGPL', 'COPYING', 'README.md']) {
    out.push([`mmah/${f}`, raw(PINS.mmah.repo, PINS.mmah.sha, f)]);
  }
  out.push(['mmah/APL/ARPHICPL.TXT', raw(PINS.mmah.repo, PINS.mmah.sha, 'APL/english/ARPHICPL.TXT')]);
  out.push(['cedict/cedict.txt.gz', 'https://www.mdbg.net/chinese/export/cedict/cedict_1_0_ts_utf-8_mdbg.txt.gz']);
  return out;
}

async function get(url: string, tries = 5): Promise<Buffer> {
  for (let i = 1; ; i++) {
    try {
      const r = await fetch(url);
      if (!r.ok) throw new Error(`${r.status} ${url}`);
      return Buffer.from(await r.arrayBuffer());
    } catch (e) {
      if (i >= tries) throw e;
      await new Promise((res) => setTimeout(res, 1000 * i));
    }
  }
}

async function main() {
  const force = process.argv.includes('--force');
  for (const [rel, url] of files()) {
    const dest = path.join(VENDOR, rel);
    if (!force && fs.existsSync(dest) && fs.statSync(dest).size > 0) continue;
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    try {
      fs.writeFileSync(dest, await get(url));
      console.log(`fetched ${rel}`);
    } catch (e) {
      // Licence files are nice to have; data files are required.
      if (/APL|LGPL|COPYING|README|License/.test(rel)) console.warn(`skipped ${rel}: ${(e as Error).message}`);
      else throw e;
    }
  }
  console.log('data:fetch — vendor/ is ready');
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename)) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
