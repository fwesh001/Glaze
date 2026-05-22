'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function GlazeSiteModal({
  title = 'Notification',
  message = 'This is a message',
  ctaLabel = 'Confirm',
  onConfirm = () => {},
  onClose = () => {},
}) {
  const backdropRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    // Lock scroll on mount
    document.body.style.overflow = 'hidden';

    if (backdropRef.current && modalRef.current) {
      const timeline = gsap.timeline();

      // Backdrop fade in
      timeline.to(
        backdropRef.current,
        {
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out',
        },
        0
      );

      // Modal pop in with expressive scale
      timeline.fromTo(
        modalRef.current,
        {
          opacity: 0,
          scale: 0.85,
        },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: 'cubic.out',
        },
        0.1
      );
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleConfirm = () => {
    if (!backdropRef.current || !modalRef.current) return;

    const timeline = gsap.timeline();

    timeline.to(modalRef.current, {
      opacity: 0,
      scale: 0.9,
      duration: 0.3,
      ease: 'power2.in',
    });

    timeline.to(
      backdropRef.current,
      {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          onConfirm();
        },
      },
      0
    );
  };

  const handleClose = () => {
    if (!backdropRef.current || !modalRef.current) return;

    const timeline = gsap.timeline();

    timeline.to(modalRef.current, {
      opacity: 0,
      scale: 0.9,
      duration: 0.3,
      ease: 'power2.in',
    });

    timeline.to(
      backdropRef.current,
      {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          onClose();
        },
      },
      0
    );
  };

  return (
    <>
      {/* Backdrop */}
      <div
        ref={backdropRef}
        onClick={handleClose}
        className="fixed inset-0 z-40 bg-black/60 opacity-0 backdrop-blur-sm"
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div
          ref={modalRef}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-sm rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900/95 to-black/95 p-8 shadow-[0_24px_96px_rgba(0,0,0,0.5)]"
        >
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <p className="mt-3 text-sm text-zinc-400">{message}</p>

          <div className="mt-8 flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 rounded-lg border border-white/10 px-4 py-3 text-sm font-medium text-zinc-200 transition-colors hover:border-white/20 hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="flex-1 rounded-lg border border-cyan-400/40 bg-cyan-400/10 px-4 py-3 text-sm font-medium text-cyan-200 shadow-[0_0_24px_rgba(34,211,238,0.15)] transition-all hover:border-cyan-300/60 hover:bg-cyan-400/20 hover:shadow-[0_0_32px_rgba(34,211,238,0.25)]"
            >
              {ctaLabel}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
