'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import gsap from 'gsap';
import { Copy } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

import { useWorkspace } from './WorkspaceProvider.jsx';
import { BASE_TOAST_SNIPPET, TARGET_LANGUAGE_MAP, buildMorphCode, requestMorphCode, serializeMorphPayload } from '../lib/morph.js';

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

function scrambleCode(source) {
  const glyphs = '░▒▓█<>/={}[]()_+-*#@$';

  return source
    .split('')
    .map((character) => {
      if (character === '\n' || character === '\t' || character === ' ') {
        return character;
      }

      return glyphs[Math.floor(Math.random() * glyphs.length)];
    })
    .join('');
}

export default function ControlPanel() {
  const [activeTab, setActiveTab] = useState('settings');
  const [isMorphing, setIsMorphing] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const {
    registryItem,
    settings,
    setSetting,
    language,
    setLanguage,
    prompt,
    setPrompt,
    displayCode,
    setDisplayCode,
    setCompilerLoading,
    showCompilerToast,
  } = useWorkspace();
  const codePaneRef = useRef(null);
  const morphTimersRef = useRef([]);
  const copyTimerRef = useRef(null);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(displayCode);
      setCopyFeedback(true);
      if (copyTimerRef.current) {
        window.clearTimeout(copyTimerRef.current);
      }
      copyTimerRef.current = window.setTimeout(() => {
        setCopyFeedback(false);
      }, 1800);
    } catch (err) {
      showCompilerToast('Failed to copy code.', 'error');
    }
  };

  const { textSettings, physicsSettings } = useMemo(() => {
    const settingsConfig = registryItem?.settingsConfig ?? [];

    return {
      textSettings: settingsConfig.filter((setting) => setting.type === 'text' || setting.type === 'select'),
      physicsSettings: settingsConfig.filter((setting) => setting.type === 'slider'),
    };
  }, [registryItem]);

  const serializedPayload = useMemo(
    () =>
      serializeMorphPayload({
        language,
        settings,
        prompt,
        registryItem,
        snippet: BASE_TOAST_SNIPPET,
      }),
    [language, prompt, registryItem, settings],
  );

  const syntaxLanguage = TARGET_LANGUAGE_MAP[language] ?? 'jsx';

  // Initialize display code without triggering compile
  useEffect(() => {
    setDisplayCode(buildMorphCode(serializedPayload));
  }, [serializedPayload, setDisplayCode]);

  // Manual morphing handler (not auto-triggered)
  const handleMorph = useCallback(async () => {
    morphTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    morphTimersRef.current = [];

    setIsMorphing(true);
    setCompilerLoading(true);

      try {
        const response = await requestMorphCode(serializedPayload);

        if (!response?.success || !response.code) {
          throw new Error(response?.error ?? 'Empty response from compiler service.');
        }

        const nextCode = response.code;

        showCompilerToast('Compiler morph complete.', 'success');

        const pane = codePaneRef.current;

        if (pane) {
          gsap.fromTo(
            pane,
            { filter: 'brightness(1.12)', boxShadow: '0 0 0 1px rgba(255,255,255,0.14), 0 0 26px rgba(52, 211, 255, 0.12)' },
            { filter: 'brightness(1)', boxShadow: '0 0 0 1px rgba(255,255,255,0.08), 0 30px 70px rgba(0,0,0,0.45)', duration: 0.28 },
          );
        }

        setDisplayCode(scrambleCode(nextCode));

        const revealTimer = window.setTimeout(() => {
          setDisplayCode(nextCode);
        }, 110);

        const settleTimer = window.setTimeout(() => {
          setIsMorphing(false);
        }, 220);

        morphTimersRef.current = [revealTimer, settleTimer];
      } catch (error) {
        showCompilerToast(`Compiler morph failed. ${error?.message ?? 'Using local fallback.'}`, 'error');
        setDisplayCode(buildMorphCode(serializedPayload));
        setIsMorphing(false);
      } finally {
        setCompilerLoading(false);
      }
    }, [serializedPayload, setCompilerLoading, showCompilerToast, setDisplayCode]);

  // Trigger compile when language changes in Code tab
  useEffect(() => {
    if (activeTab !== 'code') {
      return undefined;
    }

    if (!language || language === 'Select language') {
      return undefined;
    }

    const debounceTimer = window.setTimeout(() => {
      void handleMorph();
    }, 220);

    return () => {
      window.clearTimeout(debounceTimer);
      morphTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    };
  }, [language, activeTab, handleMorph]);

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
        <div className="mt-5 grid gap-4 lg:grid-cols-[1.45fr_0.55fr]">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/70 px-4 py-3">
              <div>
                <div className="text-xs uppercase tracking-[0.4em] text-zinc-500">Code Matrix</div>
                <div className="mt-1 text-sm text-zinc-300">{registryItem?.name ?? 'Component Blueprint'}</div>
              </div>

              <label className="flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-zinc-500">
                Language
                <select
                  value={language}
                  onChange={(event) => setLanguage(event.target.value)}
                  className="rounded-full border border-white/10 bg-black px-3 py-2 text-white outline-none"
                >
                  <option value="Select language">Select language</option>
                  <option>React (JSX)</option>
                  <option>Vue</option>
                  <option>Vanilla JS</option>
                </select>
              </label>
            </div>

            <div
              ref={codePaneRef}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#07070a] shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_24px_80px_rgba(0,0,0,0.45)]"
            >
              <div className="flex items-center justify-between border-b border-white/5 px-4 py-3 text-[0.65rem] uppercase tracking-[0.4em] text-zinc-500">
                <span>Syntax Visualizer</span>
                <div className="flex items-center gap-3">
                  <span className={isMorphing ? 'text-cyan-300/80' : 'text-zinc-500'}>{isMorphing ? 'Recompiling' : 'Stable'}</span>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    title="Copy code to clipboard"
                    className={`transition-all ${
                      copyFeedback
                        ? 'text-emerald-400'
                        : 'text-zinc-500 hover:text-white'
                    }`}
                  >
                    <Copy size={14} />
                  </button>
                </div>
              </div>

              {isMorphing && (
                <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                  <div className="rounded-full border border-white/10 bg-gradient-to-br from-zinc-900/80 to-black/90 px-6 py-4 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                    <div className="flex items-center justify-center gap-2">
                      {[0, 1, 2].map((i) => (
                        <div key={i} className="h-2.5 w-2.5 rounded-full bg-cyan-400/80 shadow-[0_0_12px_rgba(34,211,238,0.5)] animate-pulse" />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <SyntaxHighlighter
                language={syntaxLanguage}
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  padding: '1.25rem',
                  background: '#07070a',
                  fontSize: '0.78rem',
                  lineHeight: '1.7',
                  minHeight: '22rem',
                }}
                codeTagProps={{ style: { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' } }}
                wrapLongLines
              >
                {displayCode}
              </SyntaxHighlighter>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <label className="flex h-full flex-1 flex-col rounded-2xl border border-white/10 bg-black/60 p-4 text-sm text-zinc-300">
              <div className="text-xs uppercase tracking-[0.35em] text-zinc-500">AI Prompt Console</div>
              <textarea
                rows={10}
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                placeholder="Change it to use Tailwind utility classes..."
                className="mt-4 min-h-40 flex-1 rounded-2xl border border-white/10 bg-white/[0.03] p-4 font-mono text-sm text-white outline-none placeholder:text-zinc-600"
              />
            </label>

            <div className="rounded-2xl border border-white/10 bg-black/60 p-4 text-xs text-zinc-400">
              <div className="uppercase tracking-[0.35em] text-zinc-500">Serialized Telemetry</div>
              <pre className="mt-4 max-h-48 overflow-auto whitespace-pre-wrap break-words text-[0.7rem] leading-6 text-zinc-300">
                {JSON.stringify(serializedPayload, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
