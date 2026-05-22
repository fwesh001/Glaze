'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './style.css';

export default function CountdownCapsuleToast({
  message = 'Telemetry uplink active',
  timer = 4,
  speed = 1,
  onAutoClose = () => {},
}) {
  const rootRef = useRef(null);
  const lineRef = useRef(null);
  const tlRef = useRef(null);

  useEffect(() => {
    if (!rootRef.current || !lineRef.current) return undefined;

    const duration = Math.max(0.2, Number(timer) || 4) / Math.max(0.35, Number(speed) || 1);

    tlRef.current?.kill();
    gsap.killTweensOf([rootRef.current, lineRef.current]);

    const tl = gsap.timeline();
    tl.fromTo(rootRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.24, ease: 'power3.out' });
    tl.fromTo(lineRef.current, { scaleX: 1 }, { scaleX: 0, duration, ease: 'none' }, 0.02);
    tl.to(rootRef.current, {
      y: -16,
      opacity: 0,
      duration: 0.24,
      ease: 'power2.in',
      onComplete: onAutoClose,
    });
    tlRef.current = tl;

    return () => {
      tlRef.current?.kill();
      gsap.killTweensOf([rootRef.current, lineRef.current]);
    };
  }, [message, timer, speed, onAutoClose]);

  return (
    <div ref={rootRef} className="countdown-capsule px-5 py-4 text-white">
      <div className="text-[0.65rem] uppercase tracking-[0.34em] text-cyan-300/80">Telemetry Countdown</div>
      <p className="mt-2 text-sm text-zinc-100">{message}</p>
      <div className="mt-3">
        <div ref={lineRef} className="countdown-capsule-line" />
      </div>
    </div>
  );
}
