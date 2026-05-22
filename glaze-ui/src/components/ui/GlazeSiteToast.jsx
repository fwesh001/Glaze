'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { X } from 'lucide-react';

export default function GlazeSiteToast({ message = 'Notification', icon: IconComponent = null, onDismiss = () => {} }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Entrance animation: slide in from right
    gsap.fromTo(
      containerRef.current,
      {
        opacity: 0,
        x: 400,
      },
      {
        opacity: 1,
        x: 0,
        duration: 0.5,
        ease: 'cubic.out',
      }
    );
  }, []);

  const handleDismiss = () => {
    if (!containerRef.current) return;

    gsap.to(containerRef.current, {
      opacity: 0,
      x: 400,
      duration: 0.35,
      ease: 'power2.in',
      onComplete: () => {
        onDismiss();
      },
    });
  };

  return (
    <div
      ref={containerRef}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-4 rounded-2xl border border-white/10 bg-gradient-to-r from-zinc-900/95 to-black/95 px-5 py-4 backdrop-blur-md shadow-[0_16px_48px_rgba(0,0,0,0.4)]"
    >
      {IconComponent ? (
        <IconComponent size={18} className="shrink-0 text-cyan-400" />
      ) : null}
      <p className="text-sm text-zinc-200">{message}</p>
      <button
        type="button"
        onClick={handleDismiss}
        className="ml-2 shrink-0 text-zinc-400 transition-colors hover:text-white"
        aria-label="Dismiss notification"
      >
        <X size={16} />
      </button>
    </div>
  );
}
