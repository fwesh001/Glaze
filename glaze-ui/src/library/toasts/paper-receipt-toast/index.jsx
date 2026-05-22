'use client';

import { useEffect, useRef } from 'react';

import gsap from 'gsap';

import { useWorkspace } from '../../../components/WorkspaceProvider.jsx';
import './style.css';

const toneStyles = {
  Kraft: {
    surface: 'linear-gradient(180deg, #e8d6b5 0%, #d8c09a 100%)',
    edge: 'rgba(92, 67, 40, 0.24)',
    shadow: 'rgba(70, 48, 24, 0.26)',
    ink: '#3f2f22',
  },
  Ivory: {
    surface: 'linear-gradient(180deg, #f8f1df 0%, #efe3c6 100%)',
    edge: 'rgba(104, 86, 44, 0.18)',
    shadow: 'rgba(68, 53, 25, 0.18)',
    ink: '#3d3225',
  },
  Parchment: {
    surface: 'linear-gradient(180deg, #f4e6c5 0%, #e6d2a4 100%)',
    edge: 'rgba(104, 73, 34, 0.2)',
    shadow: 'rgba(77, 53, 23, 0.22)',
    ink: '#4a3925',
  },
};

export default function PaperReceiptToast({
  message,
  tone = 'Kraft',
  speed = 1,
  depth = 14,
}) {
  const receiptRef = useRef(null);
  const edgeRef = useRef(null);
  const { settings } = useWorkspace();

  const activeTone = toneStyles[tone] ?? toneStyles.Kraft;
  const slideSpeed = Math.max(0.35, Number(speed) || 1);
  const depthPx = Math.max(4, Number(depth) || 14);

  useEffect(() => {
    const receipt = receiptRef.current;
    const edge = edgeRef.current;

    if (!receipt || !edge) {
      return undefined;
    }

    const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

    timeline
      .set(receipt, { opacity: 0, y: -28, rotate: -1.4, scaleX: 0.96 })
      .set(edge, { scaleX: 0.24, opacity: 0.4 })
      .to(receipt, { opacity: 1, y: 0, rotate: 0, scaleX: 1, duration: 0.9 / slideSpeed })
      .to(edge, { scaleX: 1, opacity: 1, duration: 0.55 / slideSpeed }, '<0.08');

    return () => timeline.kill();
  }, [slideSpeed]);

  return (
    <div
      ref={receiptRef}
      className="paper-receipt-toast"
      style={{
        '--paper-surface': activeTone.surface,
        '--paper-edge': activeTone.edge,
        '--paper-shadow': activeTone.shadow,
        '--paper-ink': activeTone.ink,
        '--paper-depth': `${depthPx}px`,
        '--paper-muted': settings?.blur ? 'rgba(63,47,34,0.72)' : 'rgba(63,47,34,0.68)',
      }}
    >
      <div ref={edgeRef} className="paper-receipt-toast-edge" />
      <div className="paper-receipt-toast-serration" aria-hidden="true" />
      <div className="paper-receipt-toast-body">
        <div className="paper-receipt-toast-kicker">Receipt Issued</div>
        <div className="paper-receipt-toast-message">{message ?? 'Payment received'}</div>
        <div className="paper-receipt-toast-meta">Paper theme · tactile slide · soft shadow</div>
      </div>
    </div>
  );
}
