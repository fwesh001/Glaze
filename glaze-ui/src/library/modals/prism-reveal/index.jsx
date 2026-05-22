'use client';

import { useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import './style.css';

export default function PrismRevealModal({
  isOpen = true,
  isEmbedded = false,
  title = 'Prism Channel',
  message = 'Spectrum gate expanded. Apply refracted profile now?',
  confirmText = 'Apply',
  cancelText = 'Cancel',
  speed = 1,
  onClose = () => {},
  onConfirm = () => {},
  onCancel = () => {},
}) {
  const shellRef = useRef(null);
  const panelRef = useRef(null);
  const flareRef = useRef(null);
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
    tlRef.current.fromTo(shellRef.current, { opacity: 0 }, { opacity: 1, duration: 0.24 });
    tlRef.current.fromTo(panelRef.current, { clipPath: 'circle(0% at 50% 50%)', scale: 0.7, opacity: 0 }, { clipPath: 'circle(74% at 50% 50%)', scale: 1, opacity: 1, duration: 0.85 / normalizedSpeed, ease: 'expo.out' }, 0);
    tlRef.current.fromTo(flareRef.current, { xPercent: -140, opacity: 0 }, { xPercent: 130, opacity: 0.9, duration: 0.85 / normalizedSpeed, ease: 'none' }, 0.04);

    return () => {
      tlRef.current?.kill();
      if (!isEmbedded) {
        document.body.style.overflow = previousOverflow;
        window.removeEventListener('keydown', onEsc);
      }
    };
  }, [isOpen, isEmbedded, onClose, normalizedSpeed]);

  const shellClass = useMemo(() => `prism-reveal-shell ${isEmbedded ? 'embedded' : ''}`, [isEmbedded]);
  if (!isOpen) return null;

  return (
    <div ref={shellRef} className={shellClass}>
      <div className="prism-reveal-backdrop" onClick={onClose} />
      <div ref={panelRef} className="prism-reveal-panel">
        <div className="prism-reveal-rim" />
        <div ref={flareRef} className="absolute inset-y-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/55 to-transparent blur-md" />
        <div className="prism-reveal-content">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <p className="mt-3 text-sm text-zinc-200">{message}</p>
          <div className="mt-6 flex justify-center gap-3">
            <button type="button" onClick={() => { onCancel(); onClose(); }} className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm text-zinc-200">{cancelText}</button>
            <button type="button" onClick={() => { onConfirm(); onClose(); }} className="rounded-full border border-fuchsia-300/40 bg-fuchsia-300/15 px-4 py-2 text-sm text-fuchsia-100">{confirmText}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
