'use client';

import { useMemo, useState } from 'react';

import { useWorkspace } from './WorkspaceProvider.jsx';

function ControlRow({ label, children, hint }) {
  return (
    <label className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-zinc-300">
      <div className="flex items-center justify-between gap-4">
        <span className="font-medium text-white">{label}</span>
        {hint ? <span className="text-xs uppercase tracking-[0.3em] text-zinc-500">{hint}</span> : null}
      </div>
      {children}
    </label>
  );
}

export default function ControlPanel() {
  const [activeTab, setActiveTab] = useState('settings');
  const { registryItem, settings, setSetting } = useWorkspace();

  const { textSettings, physicsSettings } = useMemo(() => {
    const settingsConfig = registryItem?.settingsConfig ?? [];

    return {
      textSettings: settingsConfig.filter((setting) => setting.type === 'text' || setting.type === 'select'),
      physicsSettings: settingsConfig.filter((setting) => setting.type === 'slider'),
    };
  }, [registryItem]);

  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 shadow-glass">
      <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/50 p-1">
        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={[
            'flex-1 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] transition-colors',
            activeTab === 'settings' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white',
          ].join(' ')}
        >
          Settings
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('code')}
          className={[
            'flex-1 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] transition-colors',
            activeTab === 'code' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white',
          ].join(' ')}
        >
          Code
        </button>
      </div>

      {activeTab === 'settings' ? (
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="text-xs uppercase tracking-[0.4em] text-zinc-500">Component State</div>
            {textSettings.map((setting) => (
              <ControlRow key={setting.id} label={setting.label} hint={setting.type}>
                {setting.type === 'text' ? (
                  <input
                    value={settings[setting.id] ?? ''}
                    onChange={(event) => setSetting(setting.id, event.target.value)}
                    className="rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-white outline-none placeholder:text-zinc-600"
                  />
                ) : (
                  <select
                    value={settings[setting.id] ?? setting.default}
                    onChange={(event) => setSetting(setting.id, event.target.value)}
                    className="rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-white outline-none"
                  >
                    {(setting.options ?? []).map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                )}
              </ControlRow>
            ))}
          </div>

          <div className="space-y-4">
            <div className="text-xs uppercase tracking-[0.4em] text-zinc-500">Animation Physics</div>
            {physicsSettings.map((setting) => (
              <ControlRow key={setting.id} label={setting.label} hint="slider">
                <input
                  type="range"
                  min={setting.min}
                  max={setting.max}
                  step={setting.step ?? 0.01}
                  value={settings[setting.id] ?? setting.default}
                  onChange={(event) => setSetting(setting.id, Number(event.target.value))}
                  className="w-full accent-white"
                />
                <div className="text-xs uppercase tracking-[0.35em] text-cyan-300/80">
                  {settings[setting.id] ?? setting.default}
                </div>
              </ControlRow>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-5 grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="rounded-2xl border border-white/10 bg-black/60 p-4 text-sm text-zinc-400">
            <div className="text-xs uppercase tracking-[0.35em] text-zinc-500">Code Output</div>
            <pre className="mt-4 overflow-auto text-xs leading-6 text-zinc-300">
{`<${registryItem?.name ?? 'Component'} />
// code placeholder will render here`}
            </pre>
          </div>

          <label className="flex flex-col rounded-2xl border border-white/10 bg-black/60 p-4 text-sm text-zinc-300">
            <div className="text-xs uppercase tracking-[0.35em] text-zinc-500">AI Prompt Console</div>
            <textarea
              rows={9}
              placeholder="Describe the next transform..."
              className="mt-4 min-h-40 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white outline-none placeholder:text-zinc-600"
            />
          </label>
        </div>
      )}
    </section>
  );
}
