import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const sw = fs.readFileSync(path.join(process.cwd(), 'public/sw.js'), 'utf8');

describe('service worker', () => {
  it('uses the arabic-ladder cache prefix', () => {
    expect(sw).toMatch(/const CACHE = `arabic-ladder-\$\{CACHE_VERSION\}`/);
    expect(sw).toMatch(/k\.startsWith\('arabic-ladder-'\)/);
  });
  it('precaches the v1 rungs and the placement check', () => {
    for (const p of ['rung/huruf-1/', 'rung/huruf-2/', 'rung/easy-1/', 'placement/']) expect(sw).toContain(`'${p}'`);
  });
  it('never precaches audio files, and serves them cache-first', () => {
    const shell = sw.slice(sw.indexOf('const SHELL'), sw.indexOf('];', sw.indexOf('const SHELL')));
    expect(shell).not.toMatch(/\.mp3/);
    expect(sw).toMatch(/\/audio\/.*\.mp3/s);
  });
});
