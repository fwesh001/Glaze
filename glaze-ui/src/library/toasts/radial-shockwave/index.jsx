'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './style.css';

export default function RadialShockwaveToast({
  message = 'Shockwave event registered',
  speed = 1,
}) {
  const rootRef = useRef(null);
  const tlRef = useRef(null);

  useEffect(() => {
    if (!rootRef.current) return undefined;

    const normalizedSpeed = Math.max(0.35, Number(speed) || 1);

    tlRef.current?.kill();
    gsap.killTweensOf(rootRef.current);

    const tl = gsap.timeline();
    tl.set(rootRef.current, {
      width: 72,
      minHeight: 72,
      borderRadius: '999px',
      y: -220,
      opacity: 1,
      transformOrigin: '50% 100%',
    });
    tl.to(rootRef.current, { y: 0, duration: 0.28 / normalizedSpeed, ease: 'power2.in' });
    tl.to(rootRef.current, {
      width: 520,
      minHeight: 118,
      borderRadius: '20% 80% 22% 78% / 58% 45% 55% 42%',
      duration: 0.36 / normalizedSpeed,
      ease: 'power2.out',
    });
    tl.to(rootRef.current, {
      borderRadius: '1rem',
      duration: 0.42 / normalizedSpeed,
      ease: 'elastic.out(1,0.55)',
    });
    tlRef.current = tl;

    return () => {
      tlRef.current?.kill();
      gsap.killTweensOf(rootRef.current);
    };
  }, [message, speed]);

  return (
    <div ref={rootRef} className="radial-shockwave px-5 py-4 text-white">
      <div className="text-[0.62rem] uppercase tracking-[0.35em] text-cyan-100/90">Radial Shockwave</div>
      <p className="mt-2 text-sm text-white">{message}</p>
    </div>
  );
}
