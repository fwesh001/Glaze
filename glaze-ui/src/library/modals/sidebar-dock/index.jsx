'use client';

import { useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import './style.css';

export default function SidebarDockModal({
  isOpen = true,
  isEmbedded = false,
  title = 'Dock Detached',
  message = 'Sidebar payload migrated to central workspace.',
  confirmText = 'Confirm',
  cancelText = 'Close',
  speed = 1,
  onClose = () => {},
  onConfirm = () => {},
  onCancel = () => {},
}) {
  const shellRef = useRef(null);
  const panelRef = useRef(null);
  const gridRef = useRef(null);
  const tlRef = useRef(null);
  const normalizedSpeed = Math.max(0.35, Number(speed) || 1);

  useEffect(() => {
    if (!isOpen || !panelRef.current || !gridRef.current) return undefined;
    const previousOverflow = document.body.style.overflow;
    const onEsc = (event) => event.key === 'Escape' && onClose();

    if (!isEmbedded) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', onEsc);
    }

    tlRef.current?.kill();
    tlRef.current = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tlRef.current.fromTo(shellRef.current, { opacity: 0 }, { opacity: 1, duration: 0.22 });
    tlRef.current.fromTo(panelRef.current, { x: -340, y: 80, scaleX: 0.68, scaleY: 0.84, borderRadius: '2.25rem', opacity: 0.5 }, { x: 0, y: 0, scaleX: 1, scaleY: 1, opacity: 1, borderRadius: '1.5rem', duration: 0.78 / normalizedSpeed, ease: 'elastic.out(1,0.62)' }, 0);
    tlRef.current.fromTo(gridRef.current.children, { opacity: 0, scaleX: 0.75 }, { opacity: 1, scaleX: 1, duration: 0.45 / normalizedSpeed, stagger: 0.05, ease: 'power2.out' }, 0.28 / normalizedSpeed);

    return () => {
      tlRef.current?.kill();
      if (!isEmbedded) {
        document.body.style.overflow = previousOverflow;
        window.removeEventListener('keydown', onEsc);
      }
    };
  }, [isOpen, isEmbedded, onClose, normalizedSpeed]);

  const shellClass = useMemo(() => `sidebar-dock-shell ${isEmbedded ? 'embedded' : ''}`, [isEmbedded]);
  if (!isOpen) return null;

  return (
    <div ref={shellRef} className={shellClass}>
      <div className="sidebar-dock-backdrop" onClick={onClose} />
      <div ref={panelRef} className="sidebar-dock-panel">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <p className="mt-2 text-sm text-zinc-300">{message}</p>
        <div ref={gridRef} className="sidebar-dock-grid mt-5">
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-zinc-200">Signals</div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-zinc-200">Metrics</div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-zinc-200">Access</div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-zinc-200">Queue</div>
        </div>
        <div className="mt-5 flex justify-end gap-3">
          <button type="button" onClick={() => { onCancel(); onClose(); }} className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm text-zinc-200">{cancelText}</button>
          <button type="button" onClick={() => { onConfirm(); onClose(); }} className="rounded-lg border border-cyan-300/45 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-200">{confirmText}</button>
        </div>
      </div>
    </div>
  );
}
