import { describe, expect, it } from 'vitest';
import { chunks, pickVoice } from '@/lib/speech/speak';
import { sha1 } from '@/lib/speech/sha1';
import { __setManifest, audioFor, audioKey, canPlay, isSyllableKey, syllableKey } from '@/lib/speech/audio';
import { normZh } from '@/lib/zh/text';

const v = (name: string, lang: string, extra: Partial<SpeechSynthesisVoice> = {}) =>
  ({ name, lang, localService: true, default: false, voiceURI: name, ...extra }) as SpeechSynthesisVoice;

const voices = [
  v('Albert', 'en-US'),
  v('Sinji', 'zh-HK'),
  v('Meijia', 'zh-TW'),
  v('Tingting', 'zh-CN'),
  v('Microsoft Xiaoxiao Online (Natural) - Chinese (Mainland)', 'zh-CN', { localService: false }),
  v('Microsoft Yunxi Online (Natural) - Chinese (Mainland)', 'zh-CN', { localService: false }),
  v('Damayanti', 'id-ID'),
];

describe('pickVoice', () => {
  it('prefers a clear Mainland female voice', () => {
    expect(pickVoice(voices)?.name).toMatch(/Xiaoxiao/);
  });
  it('honours a male preference', () => {
    expect(pickVoice(voices, 'male')?.name).toMatch(/Yunxi/);
  });
  it('never picks Hong Kong or Taiwan voices', () => {
    expect(pickVoice([v('Sinji', 'zh-HK'), v('Meijia', 'zh-TW')])).toBeNull();
    expect(pickVoice([v('Sinji', 'zh-HK'), v('Tingting', 'zh-CN')])?.name).toBe('Tingting');
  });
  it('accepts cmn voices and pushes novelty voices out', () => {
    expect(pickVoice([v('Some Voice', 'cmn-Hans-CN')])?.name).toBe('Some Voice');
    expect(pickVoice([v('Whisper', 'zh-CN'), v('Li-mu', 'zh-CN')])?.name).toBe('Li-mu');
  });
  it('returns null without Chinese voices', () => {
    expect(pickVoice([v('Damayanti', 'id-ID'), v('Samantha', 'en-US')])).toBeNull();
  });
});

describe('chunks', () => {
  it('keeps short text whole', () => {
    expect(chunks('我很好。')).toEqual([{ text: '我很好。', start: 0 }]);
  });
  it('splits on 。！？； and Latin ends, keeping offsets', () => {
    const text = '你好！我是王明。你呢？Long enough.';
    const parts = chunks(text, 6);
    expect(parts.map((p) => p.text)).toEqual(['你好！', '我是王明。', '你呢？', 'Long enough.']);
    for (const p of parts) expect(text.slice(p.start, p.start + p.text.length)).toBe(p.text);
  });
});

describe('audio keys', () => {
  it('sha1 matches the standard test vectors', () => {
    expect(sha1('abc')).toBe('a9993e364706816aba3e25717850c26c9cd0d89d');
    expect(sha1('')).toBe('da39a3ee5e6b4b0d3255bfef95601890afd80709');
  });
  it('keys normalised Chinese, 12 hex digits (CLAUDE.md §7.7)', () => {
    const k = audioKey('书 在 桌子 [[上]] 。');
    expect(k).toMatch(/^[0-9a-f]{12}$/);
    expect(audioKey('书在桌子上.')).toBe(k);
    expect(k).toBe(sha1(normZh('书在桌子上。')).slice(0, 12));
  });
  it('uses syl-<base><tone> for syllables', () => {
    expect(syllableKey('ma', 3)).toBe('syl-ma3');
    expect(isSyllableKey('syl-lü4')).toBe(true);
    expect(isSyllableKey('ma3')).toBe(false);
    expect(audioKey('syl-ma3')).toBe('syl-ma3');
  });
  it('looks recordings up in the manifest; syllables never fall back to speech', () => {
    __setManifest({ [audioKey('你好')]: { file: 'x.mp3', dur: 400 }, 'syl-ma1': { file: 'y.mp3', dur: 300 } });
    expect(audioFor('你好')?.file).toBe('x.mp3');
    expect(audioFor('您好')).toBeNull();
    expect(canPlay('syl-ma1')).toBe(true);
    expect(canPlay('syl-ma2')).toBe(false);
    __setManifest(null);
  });
});
