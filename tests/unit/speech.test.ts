import { describe, expect, it } from 'vitest';
import { chunks, pickVoice } from '@/lib/speech/speak';
import { sha1 } from '@/lib/speech/sha1';
import { __setManifest, audioFor, audioKey } from '@/lib/speech/audio';

const v = (name: string, lang: string, extra: Partial<SpeechSynthesisVoice> = {}) =>
  ({ name, lang, localService: true, default: false, voiceURI: name, ...extra }) as SpeechSynthesisVoice;

const voices = [
  v('Albert', 'en-US'),
  v('Maged', 'ar-SA'),
  v('Microsoft Hoda - Arabic (Egypt)', 'ar-EG'),
  v('Microsoft Salma Online (Natural) - Arabic (Egypt)', 'ar-EG', { localService: false }),
  v('Microsoft Zariyah Online (Natural) - Arabic (Saudi Arabia)', 'ar-SA', { localService: false }),
  v('Microsoft Hamed Online (Natural) - Arabic (Saudi Arabia)', 'ar-SA', { localService: false }),
  v('Damayanti', 'id-ID'),
];

describe('pickVoice', () => {
  it('prefers a clear Saudi female voice for Fusha', () => {
    expect(pickVoice(voices, 'fusha')?.name).toMatch(/Zariyah/);
  });
  it('prefers ar-EG for Egyptian', () => {
    expect(pickVoice(voices, 'eg')?.name).toMatch(/Salma/);
  });
  it('honours a male preference', () => {
    expect(pickVoice(voices, 'fusha', 'male')?.name).toMatch(/Hamed/);
  });
  it('falls back to any Arabic voice', () => {
    expect(pickVoice([v('Maged', 'ar-SA')], 'eg')?.name).toBe('Maged');
  });
  it('returns null without Arabic voices', () => {
    expect(pickVoice([v('Damayanti', 'id-ID'), v('Samantha', 'en-US')])).toBeNull();
  });
});

describe('chunks', () => {
  it('keeps short text whole', () => {
    expect(chunks('أَنَا طَالِبٌ.')).toEqual([{ text: 'أَنَا طَالِبٌ.', start: 0 }]);
  });
  it('splits on Arabic and Latin sentence ends and keeps offsets', () => {
    const text = 'مَا هٰذَا؟ هٰذَا كِتَابٌ. This is long enough.';
    const parts = chunks(text, 20);
    expect(parts.map((p) => p.text)).toEqual(['مَا هٰذَا؟', 'هٰذَا كِتَابٌ.', 'This is long enough.']);
    for (const p of parts) expect(text.slice(p.start, p.start + p.text.length)).toBe(p.text);
  });
});

describe('audio keys', () => {
  it('sha1 matches the standard test vectors', () => {
    expect(sha1('abc')).toBe('a9993e364706816aba3e25717850c26c9cd0d89d');
    expect(sha1('')).toBe('da39a3ee5e6b4b0d3255bfef95601890afd80709');
  });
  it('keys normalised text plus variety, 12 hex digits', () => {
    const k = audioKey('كِتَابٌ', 'fusha');
    expect(k).toMatch(/^[0-9a-f]{12}$/);
    expect(audioKey('كِتَابٌ  ', 'fusha')).toBe(k);
    expect(audioKey('[[كِتَابٌ]]', 'fusha')).toBe(k);
    expect(audioKey('كِتَابٌ', 'eg')).not.toBe(k);
    expect(audioKey('كِتَابٌ', 'fusha')).toBe(sha1('كِتَابٌ|fusha').slice(0, 12));
  });
  it('looks recordings up in the manifest', () => {
    __setManifest({ [audioKey('بَ')]: { file: 'x.mp3', dur: 400 } });
    expect(audioFor('بَ')?.file).toBe('x.mp3');
    expect(audioFor('بِ')).toBeNull();
    __setManifest(null);
  });
});
