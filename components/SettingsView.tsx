'use client';

import { useEffect, useRef, useState } from 'react';
import * as store from '@/lib/progress/store';
import type { Settings } from '@/lib/progress/types';
import { useSettings, useT } from './ProgressProvider';
import { PageShell } from './ui/PageShell';
import { Segmented } from './ui/Segmented';
import { Toggle } from './ui/Toggle';
import { usePlay } from './useSpeech';
import { IconPlay } from './ui/Icon';
import { canSpeak as browserCanSpeak, chosenVoiceName, onVoicesChanged } from '@/lib/speech/speak';
import { ArIsland } from './ar/ArIsland';

/** أَهْلًا وَسَهْلًا: the sample line for “Coba suara”. */
const VOICE_SAMPLE = 'أَهْلًا وَسَهْلًا';

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-2" aria-labelledby={`g-${title}`}>
      <h2 id={`g-${title}`} className="eyebrow">{title}</h2>
      <div className="card flex flex-col gap-5 p-5">{children}</div>
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-bold">{label}</span>
      {children}
    </div>
  );
}

export function SettingsView() {
  const { t } = useT();
  const s = useSettings();
  const set = (patch: Partial<Settings>) => store.setSettings(patch);
  const [canSpeak, setCanSpeak] = useState(false);
  const playSample = usePlay();
  const [voiceName, setVoiceName] = useState<string | null>(null);
  useEffect(() => {
    const check = () => {
      setCanSpeak(browserCanSpeak());
      setVoiceName(chosenVoiceName('fusha', s.voice));
    };
    check();
    return onVoicesChanged(check) as () => void;
  }, [s.voice]);
  const [storageOk, setStorageOk] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => setStorageOk(store.isStorageAvailable()), []);

  const doExport = () => {
    const blob = new Blob([store.exportJSON()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mandarin-ladder-progress-${store.todayKey()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const doImport = async (file: File) => {
    const r = store.importJSON(await file.text());
    setMsg(r.ok ? t('settings.importOk') : t('settings.importFail'));
  };

  return (
    <PageShell title={t('settings.title')} back={{ href: '/me/', label: t('nav.me') }}>
      {!storageOk && (
        <p className="rounded-md bg-paper-2 px-4 py-3 text-small" role="status">
          {t('settings.storageOff')}
        </p>
      )}

      <Group title={t('settings.group.lang')}>
        <Row label={t('settings.uiLang')}>
          <Segmented
            label={t('settings.uiLang')}
            value={s.uiLang}
            onChange={(v) => set({ uiLang: v })}
            options={[
              { value: 'id', label: 'Bahasa Indonesia', lang: 'id' },
              { value: 'en', label: 'English', lang: 'en' },
            ]}
          />
        </Row>
      </Group>

      <Group title={t('settings.group.sound')}>
        {!canSpeak && <p className="text-small text-muted">{t('settings.speechOff')}</p>}
        <Row label={t('settings.voice')}>
          <Segmented
            label={t('settings.voice')}
            value={s.voice}
            onChange={(v) => set({ voice: v })}
            options={[
              { value: 'female', label: t('settings.voice.female') },
              { value: 'male', label: t('settings.voice.male') },
            ]}
          />
        </Row>
        <div className="flex flex-col gap-1">
          {/* Plays the recorded sample when there is one, else the browser's Arabic voice. */}
          <button type="button" className="btn btn-ghost self-start" onClick={() => void playSample(VOICE_SAMPLE)}>
            <IconPlay size={18} /> {t('settings.voiceSample')}
          </button>
          {canSpeak && voiceName && <p className="text-small text-muted">{t('settings.voiceUsing', { name: voiceName })}</p>}
        </div>
        <Row label={t('settings.speed')}>
          <Segmented
            label={t('settings.speed')}
            value={s.rate}
            onChange={(v) => set({ rate: v })}
            options={[
              { value: 0.75, label: t('settings.speed.slow') },
              { value: 1, label: t('settings.speed.normal') },
            ]}
          />
        </Row>
        <Toggle
          label={t('settings.sfx')}
          hint={t('settings.sfxHint')}
          checked={s.sfx}
          onChange={(v) => set({ sfx: v })}
          onLabel={t('settings.on')}
          offLabel={t('settings.off')}
        />
      </Group>

      <Group title={t('settings.group.display')}>
        <Row label={t('settings.textSize')}>
          <Segmented
            label={t('settings.textSize')}
            value={s.textSize}
            onChange={(v) => set({ textSize: v })}
            options={[
              { value: 100, label: '100%' },
              { value: 115, label: '115%' },
              { value: 130, label: '130%' },
            ]}
          />
        </Row>
        <Row label={t('settings.arabicSize')}>
          <Segmented
            label={t('settings.arabicSize')}
            value={s.arabicSize}
            onChange={(v) => set({ arabicSize: v })}
            options={[
              { value: 100, label: '100%' },
              { value: 120, label: '120%' },
              { value: 140, label: '140%' },
            ]}
          />
          <div className="flex flex-col gap-1 rounded-md bg-paper-2 px-4 py-2" aria-live="polite">
            <ArIsland block size="sentence">
              كِتَابٌ جَدِيدٌ
            </ArIsland>
            <p className="text-small">
              <span lang="ar-Latn" className="tr-text">
                kitābun jadīdun
              </span>{' '}
              · <span className="id-text">{t('settings.arabicSizePreview')}</span>
            </p>
          </div>
        </Row>
        <Row label={t('settings.theme')}>
          <Segmented
            label={t('settings.theme')}
            value={s.theme}
            onChange={(v) => set({ theme: v })}
            options={[
              { value: 'light', label: t('settings.theme.light') },
              { value: 'dark', label: t('settings.theme.dark') },
              { value: 'system', label: t('settings.theme.system') },
            ]}
          />
        </Row>
        <Row label={t('settings.motion')}>
          <Segmented
            label={t('settings.motion')}
            value={s.motion}
            onChange={(v) => set({ motion: v })}
            options={[
              { value: 'system', label: t('settings.motion.system') },
              { value: 'reduce', label: t('settings.motion.reduce') },
            ]}
          />
        </Row>
      </Group>

      <Group title={t('settings.group.progress')}>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn btn-ghost" onClick={doExport}>
            {t('settings.export')}
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => fileRef.current?.click()}>
            {t('settings.import')}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="sr-only"
            tabIndex={-1}
            aria-hidden
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void doImport(f);
              e.target.value = '';
            }}
          />
        </div>
        <p role="status" aria-live="polite" className="text-small">
          {msg}
        </p>
        {!confirming ? (
          <button type="button" className="btn btn-quiet self-start px-0 text-off" onClick={() => setConfirming(true)}>
            {t('settings.reset')}
          </button>
        ) : (
          <div className="flex flex-col gap-3 rounded-md p-4" style={{ background: 'var(--off-bg)' }}>
            <p>{t('settings.resetWarn')}</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="btn"
                style={{ background: 'var(--off)', color: 'var(--surface)' }}
                onClick={() => {
                  store.reset();
                  setConfirming(false);
                  setMsg(t('settings.resetDone'));
                }}
              >
                {t('settings.resetConfirm')}
              </button>
              <button type="button" className="btn btn-quiet" onClick={() => setConfirming(false)}>
                {t('settings.resetCancel')}
              </button>
            </div>
          </div>
        )}
      </Group>
    </PageShell>
  );
}
