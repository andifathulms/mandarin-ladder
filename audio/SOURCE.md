# Audio sources (CLAUDE.md §8)

## Syllables: `syl-*.mp3`

- **Source:** [hugolpz/audio-cmn](https://github.com/hugolpz/audio-cmn) at `59dbafb`, `64k/syllabs/cmn-<pinyin><tone>.mp3`
- **Speaker:** Chen Wang (syllabs v.2)
- **Licence:** CC BY-SA (as stated in the repository README). The licence allows redistribution and
  derivatives, so the clips may be trimmed and normalised; the processed clips here are shared under
  the same licence.
- **Processing** (`npm run audio:syllables`): silence trimmed, loudness normalised to −16 LUFS, mono
  48 kbps MP3, renamed `syl-<base><tone>-<hash>.mp3` (ü written v in file names). Keys in
  `manifest.json` are `syl-<base><tone>` with ü.
- **Coverage:** 1,632 syllable–tone pairs on the standard table, tones 1–4. The set has no
  neutral-tone clips: neutral syllables never play on their own, and their play buttons hide.

## Sentences and words

None yet. Commissioned recordings of the Easy 1 examples and dialogues are planned (PRD §5.6);
until then Chinese text plays with the browser's zh-CN voice (`content/audio/fallback.yaml`).
`npm run audio:list` lists what to record; `npm run audio:ingest` imports it.
