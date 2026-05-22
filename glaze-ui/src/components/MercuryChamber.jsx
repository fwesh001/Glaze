'use client';

import { useEffect, useMemo, useRef } from 'react';

import gsap from 'gsap';
import { RefreshCw } from 'lucide-react';

import { useWorkspace } from './WorkspaceProvider.jsx';

function LiquidToastPreview({ settings }) {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-white/[0.04] px-6 py-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_30px_90px_rgba(0,0,0,0.45)] backdrop-blur-3xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(52,211,255,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.12),transparent_32%)]" />
      <div className="relative">
        <div className="text-xs uppercase tracking-[0.45em] text-cyan-300/80">Preview</div>
        <h3 className="mt-4 text-2xl font-semibold text-white">{settings.message}</h3>
        <p className="mt-3 max-w-md text-sm leading-6 text-zinc-300">
          Viscosity {settings.viscosity} · Blur {settings.blur}px · Glow {settings.glow}
        </p>
      </div>
    </div>
  );
}

export default function MercuryChamber() {
  const chamberRef = useRef(null);
  const previewRef = useRef(null);
  const glowRef = useRef(null);
  const { registryItem, settings, animationTick, resetAnimation } = useWorkspace();

  const componentPreview = useMemo(() => {
    if (!registryItem) {
      return null;
    }

    return <LiquidToastPreview settings={settings} />;
  }, [registryItem, settings]);

  useEffect(() => {
    const preview = previewRef.current;
    const glow = glowRef.current;

    if (!preview || !glow) {
      return undefined;
    }

    const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

    timeline
      .set([preview, glow], { clearProps: 'all' })
      .fromTo(preview, { opacity: 0, y: 18, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: 0.6 })
      .fromTo(glow, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.55 }, '<');

    const mesh = gsap.to(chamberRef.current, {
      backgroundPosition: '100% 100%',
      duration: 10,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    return () => {
      timeline.kill();
      mesh.kill();
    };
  }, [animationTick, registryItem]);

  return (
    <section
      ref={chamberRef}
      className="relative min-h-[420px] overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02),rgba(52,211,255,0.08))] bg-[length:200%_200%] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),inset_0_-30px_60px_rgba(0,0,0,0.5),0_35px_100px_rgba(0,0,0,0.5)]"
    >
      <div
        ref={glowRef}
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(52,211,255,0.18),transparent_30%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.12),transparent_28%),radial-gradient(circle_at_55%_85%,rgba(0,255,170,0.1),transparent_30%)]"
      />

      <div className="relative flex h-full min-h-[360px] items-center justify-center">
        <div ref={previewRef} className="w-full max-w-2xl">
          {componentPreview ?? (
            <div className="rounded-[2rem] border border-white/10 bg-black/40 p-8 text-sm text-zinc-400">
              No component selected.
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={resetAnimation}
          className="absolute bottom-4 right-4 inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-white text-black shadow-[0_0_35px_rgba(255,255,255,0.15)] transition-transform hover:scale-105"
          aria-label="Reload component animation"
        >
          <RefreshCw size={18} />
        </button>
      </div>
    </section>
  );
}
