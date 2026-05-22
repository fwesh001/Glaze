'use client';

import { useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import './style.css';

export default function SplitPaneModal({
  isOpen = true,
  isEmbedded = false,
  title = 'Split Matrix',
  message = 'Panels deployed. Adjust matrix parameters before commit.',
  confirmText = 'Commit',
  cancelText = 'Abort',
  speed = 1,
  onClose = () => {},
  onConfirm = () => {},
  onCancel = () => {},
}) {
  const shellRef = useRef(null);
  const lineRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const tlRef = useRef(null);
  const normalizedSpeed = Math.max(0.35, Number(speed) || 1);

  useEffect(() => {
    if (!isOpen || !lineRef.current || !leftRef.current || !rightRef.current) return undefined;
    const previousOverflow = document.body.style.overflow;
    const onEsc = (event) => event.key === 'Escape' && onClose();

    if (!isEmbedded) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', onEsc);
    }

    tlRef.current?.kill();
    tlRef.current = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tlRef.current.fromTo(shellRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2 });
    tlRef.current.fromTo(lineRef.current, { scaleY: 0, opacity: 0 }, { scaleY: 1, opacity: 1, duration: 0.2 / normalizedSpeed, transformOrigin: '50% 50%' }, 0);
    tlRef.current.fromTo(leftRef.current, { xPercent: 100 }, { xPercent: 0, duration: 0.55 / normalizedSpeed, ease: 'power4.out' }, 0.12 / normalizedSpeed);
    tlRef.current.fromTo(rightRef.current, { xPercent: -100 }, { xPercent: 0, duration: 0.55 / normalizedSpeed, ease: 'power4.out' }, 0.12 / normalizedSpeed);

    return () => {
      tlRef.current?.kill();
      if (!isEmbedded) {
        document.body.style.overflow = previousOverflow;
        window.removeEventListener('keydown', onEsc);
      }
    };
  }, [isOpen, isEmbedded, onClose, normalizedSpeed]);

  const shellClass = useMemo(() => `split-pane-shell ${isEmbedded ? 'embedded' : ''}`, [isEmbedded]);
  if (!isOpen) return null;

  return (
    <div ref={shellRef} className={shellClass}>
      <div className="split-pane-backdrop" onClick={onClose} />
      <div className="split-pane-stage">
        <div ref={lineRef} className="split-pane-line" />
        <div ref={leftRef} className="split-pane-panel split-pane-left">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <p className="mt-2 text-sm text-zinc-300">{message}</p>
        </div>
        <div ref={rightRef} className="split-pane-panel split-pane-right flex flex-col justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-zinc-400">Settings</div>
            <div className="mt-2 text-sm text-zinc-200">Grid Sync Enabled</div>
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => { onCancel(); onClose(); }} className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm text-zinc-200">{cancelText}</button>
            <button type="button" onClick={() => { onConfirm(); onClose(); }} className="rounded-lg border border-cyan-300/45 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-200">{confirmText}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
