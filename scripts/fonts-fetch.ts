/*
 * Downloads the Chinese source fonts into fonts-src/ (git-ignored: about 65 MB) and verifies them.
 * Both are SIL OFL 1.1 (see fonts-src/README.md). `npm run fonts:subset` needs them.
 */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const DIR = path.join(process.cwd(), 'fonts-src');

export const FONT_SOURCES = [
  {
    file: 'LXGWWenKai-Regular.ttf',
    url: 'https://github.com/lxgw/LxgwWenKai/releases/download/v1.522/LXGWWenKai-Regular.ttf',
    sha256: '39ad71264b588165b469e35e6afb162a378dacd1f95348160240ba9038ac3009',
  },
  {
    file: 'LXGWWenKai-Medium.ttf',
    url: 'https://github.com/lxgw/LxgwWenKai/releases/download/v1.522/LXGWWenKai-Medium.ttf',
    sha256: 'd4bdeb38a39151d74d084cba5090f8cb7d20bf83eedb78c35939ae70b9f4e3f6',
  },
  {
    file: 'NotoSansSC-Regular.otf',
    url: 'https://raw.githubusercontent.com/notofonts/noto-cjk/Sans2.004/Sans/SubsetOTF/SC/NotoSansSC-Regular.otf',
    sha256: 'faa6c9df652116dde789d351359f3d7e5d2285a2b2a1f04a2d7244df706d5ea9',
  },
  {
    file: 'NotoSansSC-Medium.otf',
    url: 'https://raw.githubusercontent.com/notofonts/noto-cjk/Sans2.004/Sans/SubsetOTF/SC/NotoSansSC-Medium.otf',
    sha256: '7633f5a016d4dd95e685a69633d818aabc4644c4b08e26bd35b1b30c45ed5dda',
  },
] as const;

const sha = (buf: Buffer) => crypto.createHash('sha256').update(buf).digest('hex');

async function main() {
  fs.mkdirSync(DIR, { recursive: true });
  for (const f of FONT_SOURCES) {
    const dest = path.join(DIR, f.file);
    if (fs.existsSync(dest) && sha(fs.readFileSync(dest)) === f.sha256) continue;
    let buf: Buffer | null = null;
    for (let i = 1; i <= 5 && !buf; i++) {
      try {
        const r = await fetch(f.url);
        if (!r.ok) throw new Error(`${r.status} ${f.url}`);
        buf = Buffer.from(await r.arrayBuffer());
      } catch (e) {
        if (i === 5) throw e;
        await new Promise((res) => setTimeout(res, 1500 * i));
      }
    }
    if (sha(buf!) !== f.sha256) throw new Error(`${f.file}: checksum mismatch`);
    fs.writeFileSync(dest, buf!);
    console.log(`fetched ${f.file}`);
  }
  console.log('fonts:fetch — fonts-src/ is ready');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
