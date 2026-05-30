'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function GlazeLoader() {
  const dotsRef = useRef([]);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const timeline = gsap.timeline({ repeat: -1 });

    // Staggered scale and opacity animation for the three dots
    timeline.to(
      dotsRef.current,
      {
        opacity: 0.4,
        scale: 1.4,
        duration: 0.6,
        ease: 'power2.inOut',
        stagger: 0.15,
      },
      0
    );

    timeline.to(
      dotsRef.current,
      {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: 'power2.inOut',
        stagger: 0.15,
      },
      0.5
    );

    return () => {
      timeline.kill();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center gap-2 rounded-full border border-white/10 bg-gradient-to-br from-zinc-900/80 to-black/90 px-6 py-4 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          ref={(el) => {
            if (el) dotsRef.current[i] = el;
          }}
          className="h-2.5 w-2.5 rounded-full bg-cyan-400/80 shadow-[0_0_12px_rgba(34,211,238,0.5)]"
        />
      ))}
    </div>
  );
}
