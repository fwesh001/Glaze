'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import './style.css';

const NODES = 24;

export default function ParticleShatterToast({
  message = 'Container integrity compromised',
  speed = 1,
}) {
  const shellRef = useRef(null);
  const gridRef = useRef(null);
  const nodesRef = useRef([]);
  const tlRef = useRef(null);
  const resetRef = useRef(null);
  const [shattering, setShattering] = useState(false);

  const runShatter = () => {
    if (!shellRef.current || !gridRef.current) return;
    setShattering(true);

    tlRef.current?.kill();
    gsap.killTweensOf([shellRef.current, ...nodesRef.current]);

    gsap.set(nodesRef.current, { opacity: 1, x: 0, y: 0, scale: 1 });

    const tl = gsap.timeline();
    tl.to(shellRef.current, { opacity: 0, scale: 0.96, duration: 0.16, ease: 'power2.in' });
    tl.to(
      nodesRef.current,
      {
        x: () => gsap.utils.random(-160, 160),
        y: () => gsap.utils.random(-110, 110),
        scale: () => gsap.utils.random(0.6, 1.8),
        opacity: 0,
        duration: 0.45 / Math.max(0.35, Number(speed) || 1),
        ease: 'power2.out',
        stagger: { each: 0.01, from: 'random' },
      },
      '<',
    );
    tlRef.current = tl;

    if (resetRef.current) window.clearTimeout(resetRef.current);
    resetRef.current = window.setTimeout(() => {
      gsap.set(shellRef.current, { opacity: 1, scale: 1 });
      setShattering(false);
    }, 1000);
  };

  useEffect(() => {
    return () => {
      tlRef.current?.kill();
      if (resetRef.current) window.clearTimeout(resetRef.current);
      gsap.killTweensOf([shellRef.current, ...nodesRef.current]);
    };
  }, []);

  return (
    <div className="relative">
      <div ref={shellRef} className="particle-shatter-shell px-5 py-4 text-white">
        <div className="text-[0.62rem] uppercase tracking-[0.35em] text-cyan-300/80">Particle Deconstruction</div>
        <p className="mt-2 text-sm text-zinc-100">{message}</p>
        <button
          type="button"
          onClick={runShatter}
          className="mt-4 rounded-lg border border-cyan-300/35 bg-cyan-300/10 px-3 py-2 text-xs uppercase tracking-[0.24em] text-cyan-100"
        >
          Dismiss
        </button>
      </div>

      <div ref={gridRef} className="particle-shatter-grid">
        {Array.from({ length: NODES }, (_, index) => {
          const col = index % 6;
          const row = Math.floor(index / 6);
          return (
            <span
              key={index}
              ref={(node) => {
                nodesRef.current[index] = node;
              }}
              className="particle-shatter-node"
              style={{ left: `${12 + col * 12}%`, top: `${20 + row * 17}%`, opacity: shattering ? 1 : 0 }}
            />
          );
        })}
      </div>
    </div>
  );
}
