'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useWorkspace } from '../../../components/WorkspaceProvider';

export default function MercurySpillLoader() {
  const containerRef = useRef(null);
  const blob1Ref = useRef(null);
  const blob2Ref = useRef(null);
  const timelineRef = useRef(null);
  const { settings } = useWorkspace();

  const speed = parseFloat(settings.speed) || 1;

  useEffect(() => {
    if (!containerRef.current || !blob1Ref.current || !blob2Ref.current) return;

    if (timelineRef.current) timelineRef.current.kill();

    timelineRef.current = gsap.timeline({ repeat: -1 });

    // Blob 1: Drift left and right
    timelineRef.current.to(
      blob1Ref.current,
      {
        x: -30,
        duration: 1.2 / speed,
        ease: 'sine.inOut',
      },
      0
    );

    timelineRef.current.to(
      blob1Ref.current,
      {
        x: 0,
        duration: 1.2 / speed,
        ease: 'sine.inOut',
      }
    );

    // Blob 2: Drift right and left (opposite phase for contact)
    timelineRef.current.to(
      blob2Ref.current,
      {
        x: 30,
        duration: 1.2 / speed,
        ease: 'sine.inOut',
      },
      0
    );

    timelineRef.current.to(
      blob2Ref.current,
      {
        x: 0,
        duration: 1.2 / speed,
        ease: 'sine.inOut',
      }
    );

    // Scale modulation for merge effect
    timelineRef.current.to(
      blob1Ref.current,
      {
        scaleX: 0.85,
        duration: 0.6 / speed,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: 3,
      },
      0
    );

    timelineRef.current.to(
      blob2Ref.current,
      {
        scaleX: 0.85,
        duration: 0.6 / speed,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: 3,
      },
      0
    );

    return () => {
      if (timelineRef.current) timelineRef.current.kill();
    };
  }, [speed]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-900/80 to-black/90 px-6 py-6 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
      <div
        ref={containerRef}
        className="relative h-24 w-64"
        style={{
          filter: 'contrast(30) blur(10px)',
        }}
      >
        {/* Blob 1 */}
        <div
          ref={blob1Ref}
          className="absolute left-16 top-1/2 h-12 w-12 -translate-y-1/2 transform rounded-full bg-gradient-to-br from-cyan-300 to-cyan-500 shadow-[0_0_20px_rgba(34,211,238,0.8)]"
          style={{
            willChange: 'transform',
          }}
        />

        {/* Blob 2 */}
        <div
          ref={blob2Ref}
          className="absolute right-16 top-1/2 h-12 w-12 -translate-y-1/2 transform rounded-full bg-gradient-to-br from-cyan-300 to-cyan-500 shadow-[0_0_20px_rgba(34,211,238,0.8)]"
          style={{
            willChange: 'transform',
          }}
        />
      </div>

      {/* Unblurred display layer for clarity */}
      <div className="flex items-center justify-center gap-6">
        <div className="h-3 w-3 rounded-full bg-cyan-400/70 shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
        <div className="text-xs text-zinc-400">⟷</div>
        <div className="h-3 w-3 rounded-full bg-cyan-400/70 shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
      </div>

      <div className="text-[0.65rem] text-zinc-400">Metaball Surface Tension</div>
    </div>
  );
}
