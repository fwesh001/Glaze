'use client';

import { useEffect, useRef } from 'react';

const MODE_CONFIG = {
  default: { label: 'NAV', tone: 'rgba(255,255,255,0.92)', glow: 'rgba(52,211,255,0.22)' },
  landing: { label: 'ENTER', tone: 'rgba(255,255,255,0.96)', glow: 'rgba(52,211,255,0.30)' },
  browse: { label: 'BROWSE', tone: 'rgba(52,211,255,0.96)', glow: 'rgba(52,211,255,0.24)' },
  build: { label: 'BUILD', tone: 'rgba(34,211,238,0.96)', glow: 'rgba(34,211,238,0.24)' },
  profile: { label: 'MANAGE', tone: 'rgba(244,114,182,0.96)', glow: 'rgba(244,114,182,0.22)' },
  compose: { label: 'CREATE', tone: 'rgba(167,139,250,0.96)', glow: 'rgba(167,139,250,0.22)' },
};

const INTERACTIVE_SELECTOR = 'a, button, input, textarea, select, [role="button"], [data-cursor="hover"], [data-cursor-magnetic="true"]';

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function lerp(start, end, amount) {
  return start + (end - start) * amount;
}

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const labelRef = useRef(null);
  const stateRef = useRef({
    visible: false,
    active: false,
    magnetic: false,
    x: 0,
    y: 0,
    tx: 0,
    ty: 0,
    rx: 0,
    ry: 0,
    mode: 'default',
    label: MODE_CONFIG.default.label,
    tone: MODE_CONFIG.default.tone,
    glow: MODE_CONFIG.default.glow,
    frame: 0,
  });

  const cursorScale = 0.54;
  const cursorTilt = -18;

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

      if (target instanceof Element) {
        const modeTarget = target.closest('[data-glaze-cursor-mode]');
        const mode = modeTarget?.getAttribute('data-glaze-cursor-mode') || 'default';
        const config = MODE_CONFIG[mode] ?? MODE_CONFIG.default;
        stateRef.current.mode = mode;
        stateRef.current.label = config.label;
        stateRef.current.tone = config.tone;
        stateRef.current.glow = config.glow;

        const interactiveTarget = target.closest(INTERACTIVE_SELECTOR);
        const magneticTarget = target.closest('[data-cursor-magnetic="true"]') || interactiveTarget;

        stateRef.current.active = Boolean(interactiveTarget);
        stateRef.current.magnetic = Boolean(magneticTarget);

        if (magneticTarget) {
          const rect = magneticTarget.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const distance = Math.hypot(clientX - centerX, clientY - centerY);
          const influence = clamp(1 - distance / 220, 0, 1);

          stateRef.current.tx = lerp(clientX, centerX, influence * 0.28);
          stateRef.current.ty = lerp(clientY, centerY, influence * 0.28);
        } else {
          stateRef.current.tx = clientX;
          stateRef.current.ty = clientY;
        }
      } else {
        stateRef.current.mode = 'default';
        stateRef.current.label = MODE_CONFIG.default.label;
        stateRef.current.tone = MODE_CONFIG.default.tone;
        stateRef.current.glow = MODE_CONFIG.default.glow;
        stateRef.current.active = false;
        stateRef.current.magnetic = false;
        stateRef.current.tx = clientX;
        stateRef.current.ty = clientY;
      }
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

    const animationFrame = () => {
      const state = stateRef.current;
      state.rx = lerp(state.rx, state.tx, 0.18);
      state.ry = lerp(state.ry, state.ty, 0.18);

      if (cursorRef.current) {
        const scale = state.active ? 1.1 : 1;
        const magneticScale = state.magnetic ? 1.14 : 1;
        cursorRef.current.style.opacity = state.visible ? '1' : '0';
        cursorRef.current.style.transform = `translate3d(${state.rx}px, ${state.ry}px, 0) translate(-50%, -50%) scale(${cursorScale * scale * magneticScale})`;
        cursorRef.current.style.setProperty('--glaze-cursor-tone', state.tone);
        cursorRef.current.style.setProperty('--glaze-cursor-glow', state.glow);
      }

      if (labelRef.current) {
        labelRef.current.textContent = state.label;
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
        ref={cursorRef}
        className="absolute left-0 top-0 select-none"
        style={{
          opacity: 0,
          transform: 'translate3d(-100px, -100px, 0) translate(-50%, -50%)',
          willChange: 'transform, opacity',
          '--glaze-cursor-tone': MODE_CONFIG.default.tone,
          '--glaze-cursor-glow': MODE_CONFIG.default.glow,
        }}
      >
        <div className="relative flex items-start gap-1.5">
          <div
            className="relative h-24 w-24 drop-shadow-[0_0_24px_var(--glaze-cursor-glow)]"
            style={{ transform: `rotate(${cursorTilt}deg)`, transformOrigin: 'center center' }}
          >
            <svg viewBox="0 0 120 140" className="h-full w-full overflow-visible">
              <path
                d="M60 4 L106 118 L68 96 L60 111 L51 96 L14 118 Z"
                fill="var(--glaze-cursor-tone)"
              />
              <path
                d="M60 4 L89 84 L63 73 L60 80 L56 73 L31 84 Z"
                fill="rgba(12,12,18,0.35)"
              />
              <path
                d="M60 12 L94 96 L64 76 L60 86 L55 76 L26 96 Z"
                fill="rgba(255,255,255,0.14)"
              />
            </svg>
          </div>

          <div
            ref={labelRef}
            className="mt-1 rounded-full border border-white/10 bg-black/70 px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.3em] text-cyan-100 shadow-[0_0_20px_rgba(0,0,0,0.35)] backdrop-blur-md"
          >
            NAV
          </div>
        </div>
      </div>
    </div>
  );
}