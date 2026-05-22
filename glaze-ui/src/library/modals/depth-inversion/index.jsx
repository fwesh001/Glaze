'use client';

import { useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import './style.css';

export default function DepthInversionModal({
  isOpen = true,
  isEmbedded = false,
  title = 'Depth Inversion',
  message = 'Foreground plate active. Background context shifted to depth mode.',
  confirmText = 'Acknowledge',
  cancelText = 'Close',
  speed = 1,
  onClose = () => {},
  onConfirm = () => {},
  onCancel = () => {},
}) {
  const shellRef = useRef(null);
  const panelRef = useRef(null);
  const tlRef = useRef(null);
  const depthTargetRef = useRef(null);
  const normalizedSpeed = Math.max(0.35, Number(speed) || 1);

  useEffect(() => {
    if (!isOpen || !panelRef.current) return undefined;
    const previousOverflow = document.body.style.overflow;
    const onEsc = (event) => event.key === 'Escape' && onClose();

    const depthTarget = document.querySelector('[data-glaze-root]') || document.body;
    depthTargetRef.current = depthTarget;

    if (!isEmbedded) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', onEsc);
    }

    tlRef.current?.kill();
    tlRef.current = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tlRef.current.fromTo(shellRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2 });
    if (!isEmbedded) {
      tlRef.current.to(depthTarget, { scale: 0.85, rotateX: -8, filter: 'blur(6px)', transformOrigin: '50% 50%', duration: 0.55 / normalizedSpeed, ease: 'expo.out' }, 0);
    }
    tlRef.current.fromTo(panelRef.current, { y: 60, opacity: 0, z: 120 }, { y: 0, opacity: 1, z: 0, duration: 0.5 / normalizedSpeed, ease: 'power4.out' }, 0.06);

    return () => {
      tlRef.current?.kill();
      if (!isEmbedded) {
        gsap.set(depthTarget, { clearProps: 'transform,filter' });
        document.body.style.overflow = previousOverflow;
        window.removeEventListener('keydown', onEsc);
      }
    };
  }, [isOpen, isEmbedded, onClose, normalizedSpeed]);

  const shellClass = useMemo(() => `depth-inversion-shell ${isEmbedded ? 'embedded' : ''}`, [isEmbedded]);
  if (!isOpen) return null;

  return (
    <div ref={shellRef} className={shellClass}>
      <div className="depth-inversion-backdrop" onClick={onClose} />
      <div ref={panelRef} className="depth-inversion-panel">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="mt-2 text-sm text-slate-700">{message}</p>
        <div className="mt-5 flex justify-end gap-3">
          <button type="button" onClick={() => { onCancel(); onClose(); }} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700">{cancelText}</button>
          <button type="button" onClick={() => { onConfirm(); onClose(); }} className="rounded-lg border border-slate-900 bg-slate-900 px-4 py-2 text-sm text-white">{confirmText}</button>
        </div>
      </div>
    </div>
  );
}
