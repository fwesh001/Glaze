'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useWorkspace } from '../../../components/WorkspaceProvider';

const GRID_SIZE = 4; // 4x4 = 16 dots
const DOT_SIZE = 8;
const SPACING = 28;

export default function QuantumGridLoader() {
  const containerRef = useRef(null);
  const dotsRef = useRef([]);
  const timelineRef = useRef(null);
  const { settings } = useWorkspace();

  const speed = parseFloat(settings.speed) || 1;

  useEffect(() => {
    if (!containerRef.current) return;

    // Kill existing timeline
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    dotsRef.current = [];

    const dots = Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => {
      const dot = containerRef.current.querySelectorAll('[data-dot]')[i];
      if (dot) dotsRef.current.push(dot);
      return dot;
    });

    const centersX = Array.from({ length: GRID_SIZE }, (_, i) => (i - GRID_SIZE / 2 + 0.5) * SPACING);
    const centersY = Array.from({ length: GRID_SIZE }, (_, i) => (i - GRID_SIZE / 2 + 0.5) * SPACING);

    // Create timeline
    timelineRef.current = gsap.timeline({ repeat: -1 });

    // Chaos phase
    timelineRef.current.to(
      dots,
      {
        x: () => gsap.utils.random(-60, 60),
        y: () => gsap.utils.random(-60, 60),
        opacity: 0.3,
        duration: 0.8 / speed,
        ease: 'sine.inOut',
        stagger: 0.04,
      },
      0
    );

    // Snapping phase - magnetic snap back to grid
    timelineRef.current.to(
      dots,
      {
        x: (i) => centersX[i % GRID_SIZE],
        y: (i) => centersY[Math.floor(i / GRID_SIZE)],
        opacity: 1,
        duration: 0.6 / speed,
        ease: 'elastic.out(1.2, 0.6)',
        stagger: 0.03,
      },
      0.3 / speed
    );

    // Hold phase
    timelineRef.current.to(dots, { duration: 0.4 / speed }, '+=0.6');

    return () => {
      if (timelineRef.current) timelineRef.current.kill();
    };
  }, [speed]);

  return (
    <div className="flex items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-900/80 to-black/90 px-6 py-6 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
      <div ref={containerRef} className="relative" style={{ width: SPACING * GRID_SIZE, height: SPACING * GRID_SIZE }}>
        {/* Central nucleus */}
        <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-gradient-to-br from-cyan-300 to-cyan-500 shadow-[0_0_16px_rgba(34,211,238,0.8)]" />

        {/* Grid dots */}
        {Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => {
          const row = Math.floor(i / GRID_SIZE);
          const col = i % GRID_SIZE;
          const x = (col - GRID_SIZE / 2 + 0.5) * SPACING;
          const y = (row - GRID_SIZE / 2 + 0.5) * SPACING;

          return (
            <div
              key={i}
              data-dot
              className="absolute h-2 w-2 rounded-full bg-cyan-400/70 shadow-[0_0_8px_rgba(34,211,238,0.5)]"
              style={{
                left: '50%',
                top: '50%',
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                willChange: 'transform, opacity',
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
