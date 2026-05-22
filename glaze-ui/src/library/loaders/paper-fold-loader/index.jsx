'use client';

import { useEffect, useRef } from 'react';

import gsap from 'gsap';

import { useWorkspace } from '../../../components/WorkspaceProvider.jsx';
import './style.css';

const toneStyles = {
  Kraft: { paper: '#dcc09a', crease: 'rgba(102, 71, 38, 0.32)', ink: '#493624' },
  Ivory: { paper: '#f5ecd6', crease: 'rgba(82, 61, 33, 0.24)', ink: '#413325' },
  Parchment: { paper: '#ead2a2', crease: 'rgba(110, 75, 30, 0.26)', ink: '#4f3d27' },
};

export default function PaperFoldLoader({
  isOpen = true,
  message = 'Preparing the paper',
  tone = 'Parchment',
  speed = 1,
  thickness = 4,
}) {
  const loaderRef = useRef(null);
  const sheetRef = useRef(null);
  const foldRef = useRef(null);
  const { settings } = useWorkspace();

  const activeTone = toneStyles[tone] ?? toneStyles.Parchment;
  const foldSpeed = Math.max(0.35, Number(speed) || 1);
  const paperThickness = Math.max(1, Number(thickness) || 4);

  useEffect(() => {
    if (!loaderRef.current || !sheetRef.current || !foldRef.current || !isOpen) {
      return undefined;
    }

    const tl = gsap.timeline({ repeat: -1, defaults: { ease: 'power2.inOut' } });

    tl.to(sheetRef.current, {
      rotateX: 0,
      scaleY: 0.82,
      duration: 0.7 / foldSpeed,
    })
      .to(
        foldRef.current,
        {
          scaleY: 1,
          opacity: 1,
          duration: 0.45 / foldSpeed,
        },
        '<0.05'
      )
      .to(sheetRef.current, {
        rotateX: -18,
        scaleY: 1,
        duration: 0.7 / foldSpeed,
      })
      .to(foldRef.current, {
        scaleY: 0.12,
        opacity: 0.45,
        duration: 0.45 / foldSpeed,
      });

    return () => tl.kill();
  }, [foldSpeed, isOpen]);

  if (!isOpen) return null;

  return (
    <div ref={loaderRef} className="paper-fold-loader-shell">
      <div className="paper-fold-loader-backdrop" />
      <div
        className="paper-fold-loader"
        style={{
          '--paper-sheet': activeTone.paper,
          '--paper-crease': activeTone.crease,
          '--paper-ink': activeTone.ink,
          '--paper-thickness': `${paperThickness}px`,
          '--paper-warm-glow': settings?.blur ? 'rgba(103, 76, 45, 0.16)' : 'rgba(103, 76, 45, 0.12)',
        }}
      >
        <div ref={sheetRef} className="paper-fold-loader-sheet" />
        <div ref={foldRef} className="paper-fold-loader-fold" />
        <div className="paper-fold-loader-shadow" />
        <div className="paper-fold-loader-label">
          <span className="paper-fold-loader-title">{message}</span>
          <span className="paper-fold-loader-subtitle">Folded paper loop</span>
        </div>
      </div>
    </div>
  );
}
