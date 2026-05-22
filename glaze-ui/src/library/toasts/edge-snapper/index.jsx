'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './style.css';

export default function EdgeSnapperToast({
  message = 'Boundary magnet active',
  snapThreshold = 70,
  speed = 1,
}) {
  const stageRef = useRef(null);
  const nodeRef = useRef(null);

  useEffect(() => {
    if (!stageRef.current || !nodeRef.current) return undefined;

    const threshold = Number(snapThreshold) || 70;
    const normalizedSpeed = Math.max(0.35, Number(speed) || 1);

    const setPosition = (x, y) => {
      const rect = stageRef.current.getBoundingClientRect();
      const nx = x - rect.left;
      const ny = y - rect.top;
      const nearLeft = nx < threshold;
      const nearRight = rect.width - nx < threshold;
      const nearTop = ny < threshold;
      const nearBottom = rect.height - ny < threshold;

      let targetX = nx - 110;
      let targetY = ny - 36;
      let snapped = false;

      if (nearLeft) {
        targetX = 6;
        snapped = true;
      } else if (nearRight) {
        targetX = rect.width - 230;
        snapped = true;
      }

      if (nearTop) {
        targetY = 6;
        snapped = true;
      } else if (nearBottom) {
        targetY = rect.height - 76;
        snapped = true;
      }

      gsap.to(nodeRef.current, {
        x: targetX,
        y: targetY,
        duration: snapped ? 0.28 / normalizedSpeed : 0.16 / normalizedSpeed,
        ease: snapped ? 'elastic.out(1,0.45)' : 'power2.out',
        borderRadius: snapped ? '0.7rem' : '1.3rem',
        scaleX: snapped ? 1.05 : 1,
        scaleY: snapped ? 0.95 : 1,
      });
    };

    const onPointer = (event) => {
      setPosition(event.clientX, event.clientY);
    };

    const onTouch = (event) => {
      const touch = event.touches[0];
      if (touch) setPosition(touch.clientX, touch.clientY);
    };

    window.addEventListener('pointermove', onPointer);
    window.addEventListener('touchmove', onTouch, { passive: true });

    gsap.set(nodeRef.current, { x: 160, y: 90 });

    return () => {
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('touchmove', onTouch);
      gsap.killTweensOf(nodeRef.current);
    };
  }, [snapThreshold, speed]);

  return (
    <div ref={stageRef} className="edge-snapper-stage">
      <div ref={nodeRef} className="edge-snapper-node px-4 py-3 text-white">
        <div className="text-[0.62rem] uppercase tracking-[0.3em] text-cyan-300/80">Edge Snapper</div>
        <p className="mt-1 text-sm text-zinc-100">{message}</p>
      </div>
    </div>
  );
}
