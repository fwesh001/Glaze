'use client';

import { useEffect, useRef } from 'react';

import gsap from 'gsap';
import { X } from 'lucide-react';

import { useWorkspace } from '../../../components/WorkspaceProvider.jsx';
import './style.css';

export default function GlassmorphicLiquidLoader({
  isOpen = true,
  isEmbedded = false,
  onDismiss = () => {},
  message = 'Loading your experience',
  size = 112,
  speed = 1,
}) {
  const loaderRef = useRef(null);
  const orbRef = useRef(null);
  const ringRef = useRef(null);
  const { settings } = useWorkspace();

  const spinSpeed = Math.max(0.2, Number(speed) || 1);
  const loaderSize = Math.max(48, Number(size) || 112);
  const spinDuration = 2.4 / spinSpeed;
  const ringDuration = 3.4 / spinSpeed;
  const pulseDuration = Math.max(0.8, 1.5 / spinSpeed);
  const haloDuration = Math.max(1, 2 / spinSpeed);
  const dotDuration = Math.max(0.6, 1 / spinSpeed);

  useEffect(() => {
    if (!loaderRef.current) return undefined;

    const orbitTween = gsap.to(orbRef.current, {
      rotate: 360,
      duration: spinDuration,
      repeat: -1,
      ease: 'none',
      overwrite: 'auto',
    });

    const ringTween = gsap.to(ringRef.current, {
      rotate: -360,
      duration: ringDuration,
      repeat: -1,
      ease: 'none',
      overwrite: 'auto',
    });

    return () => {
      orbitTween.kill();
      ringTween.kill();
      gsap.killTweensOf([orbRef.current, ringRef.current]);
    };
  }, [spinDuration, ringDuration]);

  if (!isOpen) return null;

  return (
    <div className={`glassmorphic-liquid-loader-shell ${isEmbedded ? 'embedded' : ''}`}>
      {!isEmbedded ? <div className="glassmorphic-liquid-loader-backdrop" /> : null}

      <div
        ref={loaderRef}
        className="glassmorphic-liquid-loader"
        style={{
          width: `${loaderSize}px`,
          height: `${loaderSize}px`,
          '--loader-size': `${loaderSize}px`,
          '--loader-blur': settings?.blur || '16px',
          '--loader-pulse-duration': `${pulseDuration}s`,
          '--loader-halo-duration': `${haloDuration}s`,
          '--loader-dot-duration': `${dotDuration}s`,
        }}
      >
        {!isEmbedded ? (
          <button
            type="button"
            className="glassmorphic-liquid-loader-close"
            onClick={onDismiss}
            aria-label="Dismiss loader"
          >
            <X size={18} />
          </button>
        ) : null}

        <div className="glassmorphic-liquid-loader-orb" ref={orbRef}>
          <div className="glassmorphic-liquid-loader-core" />
        </div>

        <div className="glassmorphic-liquid-loader-ring" ref={ringRef} />

        <div className="glassmorphic-liquid-loader-halo" />

        <div className="glassmorphic-liquid-loader-label">
          <span className="glassmorphic-liquid-loader-text">{message}</span>
          <span className="glassmorphic-liquid-loader-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        </div>
      </div>
    </div>
  );
}
