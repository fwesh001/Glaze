'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import './style.css';

export default function DepthStackerToast({
  message = 'Depth focus lock acquired',
  stack = 4,
  speed = 1,
}) {
  const refs = useRef([]);
  const timerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const count = Math.max(2, Math.min(5, Number(stack) || 4));
  const items = useMemo(() => Array.from({ length: count }, (_, index) => `${message} #${index + 1}`), [count, message]);

  useEffect(() => {
    refs.current = refs.current.slice(0, count);
  }, [count]);

  useEffect(() => {
    const cycleMs = 1100 / Math.max(0.35, Number(speed) || 1);
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setActiveIndex((previous) => (previous + 1) % count);
    }, cycleMs);

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [count, speed]);

  useEffect(() => {
    refs.current.forEach((node, index) => {
      if (!node) return;
      const age = (index - activeIndex + count) % count;
      const scale = 1 - age * 0.06;
      const y = age * 18;
      const z = -age * 80;
      const opacity = 1 - age * 0.22;
      const blur = Math.min(14, age * 3);

      gsap.to(node, {
        duration: 0.35,
        ease: 'power2.out',
        scale,
        y,
        z,
        opacity,
        '--stack-blur': `${blur}px`,
      });
    });

    return () => {
      refs.current.forEach((node) => node && gsap.killTweensOf(node));
    };
  }, [activeIndex, count]);

  return (
    <div className="depth-stacker-scene">
      {items.map((text, index) => (
        <div
          key={`${text}-${index}`}
          ref={(element) => {
            refs.current[index] = element;
          }}
          className="depth-stacker-item -translate-x-1/2 -translate-y-1/2 px-5 py-4"
        >
          <div className="text-[0.62rem] uppercase tracking-[0.35em] text-cyan-300/80">Holographic Stack</div>
          <div className="mt-2 text-sm text-zinc-100">{text}</div>
        </div>
      ))}
    </div>
  );
}
