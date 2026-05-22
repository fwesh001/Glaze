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

  useEffect(() => {
    if (!loaderRef.current) return undefined;

    const timeline = gsap.timeline({ repeat: -1, defaults: { ease: 'none' } });

    timeline.to(orbRef.current, {
      rotate: 360,
      duration: 2.4 / speed,
    });

    timeline.to(
      ringRef.current,
      {
        rotate: -360,
        duration: 3.4 / speed,
      },
      0
    );

    return () => {
      timeline.kill();
    };
  }, [speed]);

  if (!isOpen) return null;

  return (
    <div className={`glassmorphic-liquid-loader-shell ${isEmbedded ? 'embedded' : ''}`}>
      {!isEmbedded ? <div className="glassmorphic-liquid-loader-backdrop" /> : null}

      <div
        ref={loaderRef}
        className="glassmorphic-liquid-loader"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          '--loader-size': `${size}px`,
          '--loader-blur': settings?.blur || '16px',
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
