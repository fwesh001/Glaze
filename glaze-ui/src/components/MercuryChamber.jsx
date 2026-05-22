'use client';

import { useEffect, useRef } from 'react';

import gsap from 'gsap';
import { RefreshCw } from 'lucide-react';

import LiquidToast from '../library/toasts/liquid-toast/index.jsx';
import { useWorkspace } from './WorkspaceProvider.jsx';

export default function MercuryChamber() {
  const chamberRef = useRef(null);
  const glowRef = useRef(null);
  const { registryItem, animationTick, resetAnimation } = useWorkspace();

  useEffect(() => {
    const glow = glowRef.current;

    if (!glow) {
      return undefined;
    }

    const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

    timeline.fromTo(glow, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.55 });

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
        <div className="flex w-full max-w-2xl flex-col gap-4">
          {registryItem?.category === 'toast' ? (
            <LiquidToast stackIndex={0} />
          ) : (
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
