'use client';

import { useEffect, useMemo, useState } from 'react';

function getPreviewMode(code) {
  const source = code?.toLowerCase?.() ?? '';

  if (source.includes('countdowncapsule') || source.includes('countdown-capsule') || source.includes('days-filler')) {
    return 'countdown';
  }

  return 'fallback';
}

function CountdownPreview() {
  const targetTime = useMemo(() => new Date('Dec 31 2026 23:59:00').getTime(), []);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const distance = Math.max(targetTime - now, 0);
  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  const metrics = [
    { label: 'Days', value: days, fill: Math.min((days / 365) * 100, 100) },
    { label: 'Hours', value: hours, fill: (hours / 24) * 100 },
    { label: 'Minutes', value: minutes, fill: (minutes / 60) * 100 },
    { label: 'Seconds', value: seconds, fill: (seconds / 60) * 100 },
  ];

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 rounded-3xl border border-amber-300/20 bg-amber-100/10 p-6 text-zinc-100 shadow-[0_0_40px_rgba(251,191,36,0.08)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-[0.62rem] uppercase tracking-[0.45em] text-amber-200/70">Web Component Preview</div>
          <div className="mt-1 text-lg font-semibold text-white">countdown-capsule</div>
        </div>
        <div className="rounded-full border border-amber-200/20 bg-black/30 px-3 py-1 text-[0.62rem] uppercase tracking-[0.35em] text-amber-200/70">
          Live
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/25 p-5">
        {metrics.map((metric) => (
          <div key={metric.label} className="min-w-[120px] flex-1">
            <div className="mb-2 text-sm font-bold text-white">
              {metric.label}: <span className="text-amber-200">{String(metric.value).padStart(2, '0')}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-300 to-cyan-300"
                style={{ width: `${metric.fill}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="text-xs uppercase tracking-[0.35em] text-zinc-400">
        Shadow DOM + Tailwind-style capsule detected and rendered as a live preview.
      </div>
    </div>
  );
}

export default function LiveCanvas({ code, physics, isProcessing }) {
  const previewMode = getPreviewMode(code);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
      <div className="mb-4 text-xs uppercase tracking-[0.35em] text-zinc-500">Live Canvas</div>
      <div className={`flex min-h-[28rem] items-center justify-center rounded-xl border border-white/10 bg-black/40 p-4 ${isProcessing ? 'animate-pulse' : ''}`}>
        {previewMode === 'countdown' ? (
          <CountdownPreview />
        ) : (
          <p className="text-center text-sm text-zinc-400">{isProcessing ? 'Rendering component...' : 'Component preview'}</p>
        )}
      </div>
    </div>
  );
}
