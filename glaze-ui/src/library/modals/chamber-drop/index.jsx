'use client';

import { useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import './style.css';

export default function ChamberDropModal({
  isOpen = true,
  isEmbedded = false,
  title = 'Chamber Initialized',
  message = 'Drop sequence completed. Continue calibration?',
  confirmText = 'Continue',
  cancelText = 'Dismiss',
  speed = 1,
  onClose = () => {},
  onConfirm = () => {},
  onCancel = () => {},
}) {
  const shellRef = useRef(null);
  const panelRef = useRef(null);
  const tlRef = useRef(null);
  const normalizedSpeed = Math.max(0.35, Number(speed) || 1);

  useEffect(() => {
    if (!isOpen || !panelRef.current) return undefined;
    const previousOverflow = document.body.style.overflow;
    const onEsc = (event) => event.key === 'Escape' && onClose();

    if (!isEmbedded) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', onEsc);
    }

    tlRef.current?.kill();
    tlRef.current = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tlRef.current.fromTo(shellRef.current, { opacity: 0 }, { opacity: 1, duration: 0.22 });
    tlRef.current.fromTo(
      panelRef.current,
      { y: -500, scaleX: 0.9, scaleY: 1.15, borderRadius: '22% 78% 68% 32% / 32% 24% 76% 68%', opacity: 0.6 },
      { y: 0, opacity: 1, duration: 0.42 / normalizedSpeed, ease: 'expo.out' },
      0
    );
    tlRef.current.to(panelRef.current, {
      scaleX: 1.12,
      scaleY: 0.86,
      borderRadius: '52% 48% 43% 57% / 36% 61% 39% 64%',
      duration: 0.2 / normalizedSpeed,
      ease: 'power2.out',
    });
    tlRef.current.to(panelRef.current, {
      scaleX: 0.95,
      scaleY: 1.08,
      borderRadius: '38% 62% 58% 42% / 53% 42% 58% 47%',
      duration: 0.16 / normalizedSpeed,
      ease: 'power2.out',
    });
    tlRef.current.to(panelRef.current, {
      scaleX: 1,
      scaleY: 1,
      borderRadius: '2.25rem',
      duration: 0.42 / normalizedSpeed,
      ease: 'elastic.out(1, 0.45)',
    });

    return () => {
      tlRef.current?.kill();
      if (!isEmbedded) {
        document.body.style.overflow = previousOverflow;
        window.removeEventListener('keydown', onEsc);
      }
    };
  }, [isOpen, isEmbedded, onClose, normalizedSpeed]);

  const shellClass = useMemo(() => `chamber-drop-shell ${isEmbedded ? 'embedded' : ''}`, [isEmbedded]);
  if (!isOpen) return null;

  return (
    <div ref={shellRef} className={shellClass}>
      <div className="chamber-drop-backdrop" onClick={onClose} />
      <div ref={panelRef} className="chamber-drop-panel">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        <p className="mt-2 text-sm text-zinc-300">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={() => { onCancel(); onClose(); }} className="rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-sm text-zinc-200">{cancelText}</button>
          <button type="button" onClick={() => { onConfirm(); onClose(); }} className="rounded-xl border border-cyan-300/40 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-200">{confirmText}</button>
        </div>
      </div>
    </div>
  );
}
