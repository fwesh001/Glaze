'use client';

import { useEffect, useRef, useState } from 'react';

import gsap from 'gsap';
import { Activity, RefreshCw } from 'lucide-react';

import LiquidToast from '../library/toasts/liquid-toast/index.jsx';
import { useWorkspace } from './WorkspaceProvider.jsx';

export default function MercuryChamber() {
  const chamberRef = useRef(null);
  const glowRef = useRef(null);
  const overclockTimerRef = useRef(null);
  const [overclockNodes, setOverclockNodes] = useState([]);
  const { registryItem, animationTick, resetAnimation } = useWorkspace();

  const hasToastPreview = registryItem?.category === 'toast';

  const createOverclockNodes = () => {
    const count = Math.floor(gsap.utils.random(30, 50, 1));

    return Array.from({ length: count }, (_, index) => ({
      id: `${Date.now()}-${index}-${Math.random().toString(36).slice(2, 7)}`,
      left: `${gsap.utils.random(4, 92)}%`,
      top: `${gsap.utils.random(6, 86)}%`,
      width: `${gsap.utils.random(220, 320)}px`,
      delay: index * 0.03 + gsap.utils.random(0, 0.12),
      initialOffset: {
        x: gsap.utils.random(-220, 220),
        y: gsap.utils.random(-160, 160),
      },
      viscosity: gsap.utils.random(0.75, 1.9),
    }));
  };

  const runOverclock = () => {
    const nodes = createOverclockNodes();
    setOverclockNodes(nodes);

    if (overclockTimerRef.current) {
      window.clearTimeout(overclockTimerRef.current);
    }

    overclockTimerRef.current = window.setTimeout(() => {
      setOverclockNodes([]);
    }, 7000);
  };

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
      if (overclockTimerRef.current) {
        window.clearTimeout(overclockTimerRef.current);
      }
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
        <div className="absolute inset-0 overflow-hidden rounded-[2rem]">
          {hasToastPreview ? (
            <div className="relative h-full w-full">
              <div className="absolute left-4 top-4 text-[0.65rem] uppercase tracking-[0.45em] text-cyan-300/80">Physics Grid</div>

              <div className="absolute inset-0">
                {overclockNodes.map((node, index) => (
                  <LiquidToast
                    key={node.id}
                    stackIndex={index}
                    positionClass="absolute"
                    className="absolute"
                    style={{ left: node.left, top: node.top, width: node.width }}
                    trajectory={node.initialOffset}
                    entranceDelay={node.delay}
                    physicsScale={node.viscosity}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="relative flex w-full max-w-2xl flex-col gap-4">
          {registryItem?.category === 'toast' && overclockNodes.length === 0 ? (
            <LiquidToast stackIndex={0} />
          ) : registryItem?.category !== 'toast' ? (
            <div className="rounded-[2rem] border border-white/10 bg-black/40 p-8 text-sm text-zinc-400">
              No component selected.
            </div>
          ) : null}
        </div>

        <div className="absolute bottom-4 right-4 flex items-center gap-3">
          <button
            type="button"
            onClick={runOverclock}
            className="inline-flex h-12 items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-cyan-200 shadow-[0_0_35px_rgba(52,211,255,0.12)] transition-transform hover:scale-105"
            aria-label="Run overclock stress test"
          >
            <Activity size={16} />
            Overclock
          </button>

          <button
            type="button"
            onClick={resetAnimation}
            className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-white text-black shadow-[0_0_35px_rgba(255,255,255,0.15)] transition-transform hover:scale-105"
            aria-label="Reload component animation"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
