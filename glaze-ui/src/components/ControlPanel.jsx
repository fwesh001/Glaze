'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import gsap from 'gsap';
import { Copy } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

import { useWorkspace } from './WorkspaceProvider.jsx';
import { BASE_TOAST_SNIPPET, TARGET_LANGUAGE_MAP, buildMorphCode, requestMorphCode, serializeMorphPayload } from '../lib/morph.js';
import { useGlazeAuth } from './auth/GlazeAuthProvider.jsx';
import { supabase } from '../lib/supabase.js';

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
  const { isAuthenticated, user } = useGlazeAuth();
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

  const { textSettings, physicsSettings } = useMemo(() => {
    const settingsConfig = registryItem?.settingsConfig ?? [];

    return {
      textSettings: settingsConfig.filter((setting) => setting.type === 'text' || setting.type === 'select'),
      physicsSettings: settingsConfig.filter((setting) => setting.type === 'slider'),
    };
  }, [registryItem]);

  const handleSaveComponent = async () => {
    if (!isAuthenticated || !user?.id) {
      try {
        const stored = window.localStorage.getItem('glaze_guest_presets');
        const existing = stored ? JSON.parse(stored) : [];
        const categoryMap = { toast: 'T', modal: 'M', loader: 'L' };
        const newPreset = {
          type: categoryMap[registryItem?.category] || 'M',
          title: `${registryItem?.name || 'Component'} (Custom)`,
          physics_config: settings,
          compiled_code: displayCode,
        };
        window.localStorage.setItem('glaze_guest_presets', JSON.stringify([...existing, newPreset]));
        showCompilerToast('Saved locally as guest preset. Log in to sync.', 'success');
      } catch (err) {
        showCompilerToast('Failed to save preset locally.', 'error');
      }
      return;
    }

    try {
      const categoryMap = { toast: 'T', modal: 'M', loader: 'L' };
      const { error } = await supabase
        .from('glaze_components')
        .insert({
          author_id: user.id,
          type: categoryMap[registryItem?.category] || 'M',
          title: `${registryItem?.name || 'Component'} (Custom)`,
          physics_config: settings,
          compiled_code: displayCode,
          is_public: false,
        });

      if (error) throw error;
      showCompilerToast('Saved component to your cloud profile!', 'success');
    } catch (err) {
      showCompilerToast(`Failed to save component: ${err.message}`, 'error');
    }
  };

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

        // Perform prompt logging and component saving if logged in
        if (isAuthenticated && user?.id) {
          const categoryMap = { toast: 'T', modal: 'M', loader: 'L' };
          const dbType = categoryMap[registryItem?.category] || 'M';

          void (async () => {
            try {
              const { data: compData, error: compError } = await supabase
                .from('glaze_components')
                .insert({
                  author_id: user.id,
                  type: dbType,
                  title: `${registryItem?.name || 'Component'} (AI Morph)`,
                  physics_config: settings,
                  compiled_code: nextCode,
                  is_public: false,
                })
                .select('id')
                .single();

              if (compError) {
                console.error('[ControlPanel] Failed to save AI morphed component:', compError);
              } else if (compData?.id && prompt?.trim()) {
                const { error: logError } = await supabase
                  .from('glaze_interaction_logs')
                  .insert({
                    user_id: user.id,
                    component_id: compData.id,
                    prompt_text: prompt.trim(),
                  });
                if (logError) {
                  console.error('[ControlPanel] Failed to log interaction prompt:', logError);
                }
              }
            } catch (err) {
              console.error('[ControlPanel] Unexpected error during component log sync:', err);
            }
          })();
        }
      } catch (error) {
        showCompilerToast(`Compiler morph failed. ${error?.message ?? 'Using local fallback.'}`, 'error');
        setDisplayCode(buildMorphCode(serializedPayload));
        setIsMorphing(false);
      } finally {
        setCompilerLoading(false);
      }
    }, [serializedPayload, setCompilerLoading, showCompilerToast, setDisplayCode, isAuthenticated, user, registryItem, settings, prompt]);

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

          <div className="col-span-1 lg:col-span-2 flex justify-end pt-2 border-t border-white/5">
            <button
              type="button"
              onClick={handleSaveComponent}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-zinc-300 transition-all hover:bg-cyan-400/10 hover:border-cyan-400/30 hover:text-cyan-300"
            >
              Save Custom Component
            </button>
          </div>
        </div>
      ) : (
      <div className="mt-1">
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
                  className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.35em] transition-all ${
                    copyFeedback
                      ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300'
                      : 'border-white/10 bg-white/[0.05] text-zinc-500 hover:border-white/20 hover:bg-white/[0.08] hover:text-white'
                  }`}
                >
                  <Copy size={14} />
                  <span>Copy</span>
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
      </div>
      )}
    </section>
  );
}
