'use client';

import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const stateRef = useRef({
    visible: false,
    active: false,
    x: 0,
    y: 0,
    rx: 0,
    ry: 0,
    frame: 0,
  });

  useEffect(() => {
    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!hasFinePointer || prefersReducedMotion) {
      return undefined;
    }

    const body = document.body;
    body.classList.add('glaze-custom-cursor');

    const setVisible = (nextVisible) => {
      stateRef.current.visible = nextVisible;
    };

    const setActive = (nextActive) => {
      stateRef.current.active = nextActive;
    };

    const handlePointerMove = (event) => {
      const { clientX, clientY, target } = event;

      stateRef.current.x = clientX;
      stateRef.current.y = clientY;

      if (!stateRef.current.visible) {
        setVisible(true);
      }

      const isInteractive = target instanceof Element
        ? Boolean(target.closest('a, button, input, textarea, select, [role="button"], [data-cursor="hover"]'))
        : false;

      setActive(isInteractive);
    };

    const handlePointerEnter = () => setVisible(true);
    const handlePointerLeave = (event) => {
      if (!event.relatedTarget) {
        setVisible(false);
      }
    };
    const handleBlur = () => setVisible(false);

    const handlePointerDown = () => setActive(true);
    const handlePointerUp = () => setActive(false);

    const handleAnimate = () => {
      const { x, y, rx, ry } = stateRef.current;
      stateRef.current.rx += (x - rx) * 0.18;
      stateRef.current.ry += (y - ry) * 0.18;
    };

    const animationFrame = () => {
      handleAnimate();
      if (dotRef.current && ringRef.current) {
        const { x, y, rx, ry, active, visible } = stateRef.current;
        dotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${active ? '1.8' : '1'})`;
        ringRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%) scale(${active ? '1.25' : '1'})`;
        dotRef.current.style.opacity = visible ? '1' : '0';
        ringRef.current.style.opacity = visible ? '1' : '0';
      }
      stateRef.current.frame = requestAnimationFrame(animationFrame);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('mouseover', handlePointerEnter);
    window.addEventListener('mouseout', handlePointerLeave);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);

    stateRef.current.frame = requestAnimationFrame(animationFrame);

    return () => {
      body.classList.remove('glaze-custom-cursor');
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('mouseover', handlePointerEnter);
      window.removeEventListener('mouseout', handlePointerLeave);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      cancelAnimationFrame(stateRef.current.frame);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[9998] hidden lg:block">
      <div
        ref={ringRef}
        className="absolute left-0 top-0 h-12 w-12 rounded-full border border-cyan-300/70 bg-cyan-300/10 shadow-[0_0_24px_rgba(52,211,255,0.2)] transition-[opacity,transform] duration-150 ease-out"
        style={{ opacity: 0, transform: 'translate3d(-100px, -100px, 0) translate(-50%, -50%)' }}
      />
      <div
        ref={dotRef}
        className="absolute left-0 top-0 h-3 w-3 rounded-full bg-white shadow-[0_0_18px_rgba(255,255,255,0.55)] transition-[opacity,transform] duration-75 ease-out"
        style={{ opacity: 0, transform: 'translate3d(-100px, -100px, 0) translate(-50%, -50%)' }}
      />
    </div>
  );
}