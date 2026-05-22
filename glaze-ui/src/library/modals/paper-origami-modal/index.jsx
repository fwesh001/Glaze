'use client';

import { useEffect, useRef } from 'react';

import gsap from 'gsap';

import { useWorkspace } from '../../../components/WorkspaceProvider.jsx';
import './style.css';

const toneStyles = {
  Kraft: { surface: '#dfc59b', ink: '#4a3724', shadow: 'rgba(62, 43, 22, 0.24)' },
  Ivory: { surface: '#f7efd8', ink: '#3f3126', shadow: 'rgba(58, 44, 24, 0.18)' },
  Parchment: { surface: '#efd9ac', ink: '#4d3a25', shadow: 'rgba(68, 48, 22, 0.22)' },
};

export default function PaperOrigamiModal({
  isOpen = true,
  isEmbedded = false,
  title = 'Open document',
  message = 'This paper fold can reveal any content.',
  tone = 'Ivory',
  speed = 1,
  shadow = 14,
}) {
  const modalRef = useRef(null);
  const paperRef = useRef(null);
  const foldRef = useRef(null);
  const { settings } = useWorkspace();

  const activeTone = toneStyles[tone] ?? toneStyles.Ivory;
  const unfoldSpeed = Math.max(0.35, Number(speed) || 1);
  const shadowStrength = Math.max(4, Number(shadow) || 14);

  useEffect(() => {
    if (!modalRef.current || !paperRef.current || !foldRef.current || !isOpen) {
      return undefined;
    }

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.set(paperRef.current, {
      opacity: 0,
      scale: 0.72,
      rotate: -2.5,
      clipPath: 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)',
    })
      .set(foldRef.current, { opacity: 0, scale: 0.6 })
      .to(paperRef.current, {
        opacity: 1,
        scale: 1,
        rotate: 0,
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        duration: 0.95 / unfoldSpeed,
      })
      .to(
        foldRef.current,
        {
          opacity: 1,
          scale: 1,
          duration: 0.55 / unfoldSpeed,
        },
        '<0.15'
      );

    return () => tl.kill();
  }, [isOpen, unfoldSpeed]);

  if (!isOpen) return null;

  return (
    <div ref={modalRef} className={`paper-origami-modal-shell ${isEmbedded ? 'embedded' : ''}`}>
      <div className={`paper-origami-modal-backdrop ${isEmbedded ? 'embedded' : ''}`} />
      <div
        ref={paperRef}
        className="paper-origami-modal"
        style={{
          '--paper-surface': activeTone.surface,
          '--paper-ink': activeTone.ink,
          '--paper-shadow': activeTone.shadow,
          '--paper-shadow-depth': `${shadowStrength}px`,
          '--paper-warm-glow': settings?.blur ? 'rgba(101, 73, 40, 0.18)' : 'rgba(101, 73, 40, 0.14)',
        }}
      >
        <div ref={foldRef} className="paper-origami-modal-fold" />
        <div className="paper-origami-modal-ridge paper-origami-modal-ridge-left" />
        <div className="paper-origami-modal-ridge paper-origami-modal-ridge-right" />

        <div className="paper-origami-modal-content">
          <div className="paper-origami-modal-label">Paper Note</div>
          <h2 className="paper-origami-modal-title">{title}</h2>
          <p className="paper-origami-modal-message">{message}</p>

          <div className="paper-origami-modal-actions">
            <button type="button" className="paper-origami-modal-btn secondary">Cancel</button>
            <button type="button" className="paper-origami-modal-btn primary">Confirm</button>
          </div>
        </div>
      </div>
    </div>
  );
}
