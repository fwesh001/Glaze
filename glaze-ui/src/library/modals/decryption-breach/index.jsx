'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import './style.css';

const ASCII = '!<>-_\\/[]{}—=+*^?#________';

function randomizeToTarget(target, progress) {
  const threshold = Math.floor(target.length * progress);
  return target
    .split('')
    .map((char, index) => {
      if (char === ' ') return ' ';
      if (index <= threshold) return char;
      return ASCII[Math.floor(Math.random() * ASCII.length)];
    })
    .join('');
}

export default function DecryptionBreachModal({
  isOpen = true,
  isEmbedded = false,
  title = 'Decryption Breach',
  message = 'Cipher stream stabilized. Deploy secure handoff?',
  confirmText = 'Authorize',
  cancelText = 'Abort',
  speed = 1,
  onClose = () => {},
  onConfirm = () => {},
  onCancel = () => {},
}) {
  const shellRef = useRef(null);
  const panelRef = useRef(null);
  const tlRef = useRef(null);
  const scrambleTimerRef = useRef(null);
  const [titleText, setTitleText] = useState(title);
  const [messageText, setMessageText] = useState(message);
  const [confirmLabel, setConfirmLabel] = useState(confirmText);
  const normalizedSpeed = Math.max(0.35, Number(speed) || 1);

  useEffect(() => {
    if (!isOpen || !panelRef.current) return undefined;
    const previousOverflow = document.body.style.overflow;
    const onEsc = (event) => {
      if (event.key === 'Escape') onClose();
    };

    if (!isEmbedded) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', onEsc);
    }

    tlRef.current?.kill();
    tlRef.current = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tlRef.current.fromTo(shellRef.current, { opacity: 0 }, { opacity: 1, duration: 0.22 });
    tlRef.current.fromTo(panelRef.current, { x: -90, opacity: 0 }, { x: 0, opacity: 1, duration: 0.28 }, 0);

    const start = performance.now();
    const settleDuration = 800 / normalizedSpeed;
    scrambleTimerRef.current = window.setInterval(() => {
      const elapsed = performance.now() - start;
      const progress = Math.min(1, elapsed / settleDuration);
      setTitleText(randomizeToTarget(title, progress));
      setMessageText(randomizeToTarget(message, progress));
      setConfirmLabel(randomizeToTarget(confirmText, progress));
      if (progress >= 1 && scrambleTimerRef.current) {
        window.clearInterval(scrambleTimerRef.current);
        scrambleTimerRef.current = null;
      }
    }, Math.max(16, 50 / normalizedSpeed));

    return () => {
      tlRef.current?.kill();
      if (scrambleTimerRef.current) window.clearInterval(scrambleTimerRef.current);
      if (!isEmbedded) {
        document.body.style.overflow = previousOverflow;
        window.removeEventListener('keydown', onEsc);
      }
    };
  }, [isOpen, isEmbedded, onClose, title, message, confirmText, normalizedSpeed]);

  useEffect(() => {
    setTitleText(title);
    setMessageText(message);
    setConfirmLabel(confirmText);
  }, [title, message, confirmText]);

  const shellClass = useMemo(() => `decryption-breach-shell ${isEmbedded ? 'embedded' : ''}`, [isEmbedded]);
  if (!isOpen) return null;

  return (
    <div ref={shellRef} className={shellClass}>
      <div className="decryption-breach-backdrop" onClick={onClose} />
      <div ref={panelRef} className="decryption-breach-panel">
        <div className="decryption-breach-grid" />
        <div className="relative z-10 flex flex-col gap-4">
          <h2 className="decryption-breach-title text-lg font-semibold">{titleText}</h2>
          <p className="decryption-breach-body text-sm">{messageText}</p>
          <div className="flex items-center justify-end gap-3 pt-3">
            <button type="button" onClick={() => { onCancel(); onClose(); }} className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.24em] text-zinc-300">{cancelText}</button>
            <button type="button" onClick={() => { onConfirm(); onClose(); }} className="rounded-lg border border-emerald-300/40 bg-emerald-300/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-emerald-200">{confirmLabel}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
