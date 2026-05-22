'use client';

import { useEffect, useMemo, useRef } from 'react';

import gsap from 'gsap';
import { CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';

import { useWorkspace } from '../../../components/WorkspaceProvider.jsx';

const glowPalette = {
  'Success Green': {
    rim: 'rgba(60, 255, 143, 0.28)',
    aura: 'rgba(60, 255, 143, 0.36)',
    accent: '#3cff8f',
  },
  'Error Red': {
    rim: 'rgba(255, 77, 109, 0.28)',
    aura: 'rgba(255, 77, 109, 0.36)',
    accent: '#ff4d6d',
  },
  'Neon Cyan': {
    rim: 'rgba(52, 211, 255, 0.28)',
    aura: 'rgba(52, 211, 255, 0.36)',
    accent: '#34d3ff',
  },
};

function resolveEase(viscosity) {
  if (viscosity >= 1.5) {
    return 'elastic.out(1, 0.45)';
  }

  if (viscosity >= 0.9) {
    return 'elastic.out(1, 0.8)';
  }

  return 'power3.out';
}

function getStatusIcon(glow) {
  if (glow === 'Error Red') {
    return <AlertTriangle size={16} />;
  }

  if (glow === 'Neon Cyan') {
    return <Sparkles size={16} />;
  }

  return <CheckCircle2 size={16} />;
}

export default function LiquidToast({
  stackIndex = 0,
  positionClass = 'relative',
  className = '',
  style = {},
  trajectory = { x: 180 + stackIndex * 12, y: 18 + stackIndex * 6 },
  entranceDelay = 0,
  physicsScale = 1,
}) {
  const toastRef = useRef(null);
  const glossRef = useRef(null);
  const { settings, animationTick } = useWorkspace();

  const currentGlow = glowPalette[settings.glow] ?? glowPalette['Success Green'];
  const animationEase = useMemo(() => resolveEase(Number(settings.viscosity ?? 1)), [settings.viscosity]);

  useEffect(() => {
    const toast = toastRef.current;
    const gloss = glossRef.current;

    if (!toast || !gloss) {
      return undefined;
    }

    const entryX = trajectory.x;
    const entryY = trajectory.y;
    const distortedRadius = '30% 70% 70% 30% / 50% 30% 70% 50%';

    const timeline = gsap.timeline({ defaults: { ease: animationEase } });

    timeline
      .set(toast, {
        opacity: 0,
        x: entryX,
        y: entryY,
        scaleX: 0.88 * physicsScale,
        scaleY: 1.12 / physicsScale,
        borderRadius: distortedRadius,
      })
      .set(gloss, { opacity: 0.15, scale: 0.92 })
      .to(toast, {
        opacity: 1,
        x: stackIndex * 12,
        y: stackIndex * 6,
        scaleX: 1,
        scaleY: 1,
        borderRadius: '50px',
        duration: 0.95,
        delay: entranceDelay,
      })
      .to(
        gloss,
        {
          opacity: 1,
          scale: 1,
          duration: 0.7,
        },
        '<0.15',
      );

    return () => timeline.kill();
  }, [animationEase, animationTick, entranceDelay, physicsScale, stackIndex, trajectory.x, trajectory.y, settings.blur, settings.glow, settings.message, settings.viscosity]);

  return (
    <div
      ref={toastRef}
      className={`liquid-toast liquid-toast-stack ${positionClass} w-full overflow-hidden px-6 py-5 text-white ${className}`}
      style={{
        '--workspace-blur': `${settings.blur ?? 20}px`,
        '--glow-rim': currentGlow.rim,
        '--glow-aura': currentGlow.aura,
        '--glow-accent': currentGlow.accent,
        zIndex: 40 - stackIndex,
        ...style,
      }}
    >
      <div ref={glossRef} className="liquid-toast-gloss pointer-events-none absolute inset-0" />

      <div className="relative flex items-start gap-4">
        <div className="liquid-toast-badge inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-[var(--glow-accent)] shadow-[0_0_24px_var(--glow-aura)]">
          {getStatusIcon(settings.glow)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="text-[0.65rem] uppercase tracking-[0.45em] text-white/60">Glassmorphic Liquid Toast</div>
          <h3 className="mt-2 text-[1.35rem] font-semibold leading-tight text-white">{settings.message}</h3>
          <p className="mt-2 text-sm leading-6 text-white/70">
            Viscosity <span className="text-white">{settings.viscosity}</span> · Blur{' '}
            <span className="text-white">{settings.blur}px</span> · Glow{' '}
            <span className="text-white">{settings.glow}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
