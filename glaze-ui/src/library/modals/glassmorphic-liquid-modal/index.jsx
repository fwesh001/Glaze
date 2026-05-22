'use client';

import { useEffect, useRef } from 'react';

import gsap from 'gsap';
import { X } from 'lucide-react';

import { useWorkspace } from '../../../components/WorkspaceProvider.jsx';
import './style.css';

export default function GlassmorphicLiquidModal({
  stackIndex = 0,
  isOpen = true,
  onClose = () => {},
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm = () => {},
  onCancel = () => {},
  viscosity = 1.2,
  entranceDelay = 0,
  isEmbedded = false,
}) {
  const modalRef = useRef(null);
  const backdropRef = useRef(null);
  const contentRef = useRef(null);
  const animationTimelineRef = useRef(null);
  const { settings } = useWorkspace();

  // Map viscosity to easing curve (same as Liquid Toast)
  const getEasingCurve = () => {
    if (viscosity >= 1.5) return 'elastic.out(1, 0.45)';
    if (viscosity >= 0.9) return 'elastic.out(1, 0.8)';
    return 'power3.out';
  };

  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    // Kill existing animation
    if (animationTimelineRef.current) {
      animationTimelineRef.current.kill();
    }

    const timeline = gsap.timeline();

    // Backdrop fade in
    timeline.fromTo(
      backdropRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.4, ease: 'power2.out' },
      0
    );

    // Modal entrance with blob morphing
    timeline.fromTo(
      contentRef.current,
      {
        opacity: 0,
        scale: 0.88 * viscosity,
        borderRadius: '30% 70% 50% 30%',
        rotate: gsap.utils.random(-8, 8),
      },
      {
        opacity: 1,
        scale: 1,
        borderRadius: '24px',
        rotate: 0,
        duration: 0.95,
        delay: entranceDelay,
        ease: getEasingCurve(),
      },
      entranceDelay > 0 ? entranceDelay : 0
    );

    animationTimelineRef.current = timeline;

    return () => {
      if (animationTimelineRef.current) {
        animationTimelineRef.current.kill();
      }
    };
  }, [isOpen, viscosity, entranceDelay]);

  if (!isOpen) return null;

  const containerClass = `glassmorphic-liquid-modal-container ${isEmbedded ? 'embedded' : ''}`;
  const backdropClass = `glassmorphic-liquid-modal-backdrop ${isEmbedded ? 'embedded' : ''}`;

  return (
    <div className={containerClass}>
      <div
        ref={backdropRef}
        className={backdropClass}
        onClick={onClose}
      />

      <div className="glassmorphic-liquid-modal-center">
        <div
          ref={contentRef}
          className="glassmorphic-liquid-modal"
          style={{
            '--glow-rim': settings?.glowRim || 'rgba(52, 211, 255, 0.25)',
            '--glow-aura': settings?.glowAura || 'rgba(60, 255, 143, 0.2)',
            '--glow-accent': settings?.glowAccent || 'rgba(255, 77, 109, 0.2)',
            '--modal-blur': settings?.blur || '16px',
          }}
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="glassmorphic-liquid-modal-close"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>

          {/* Header */}
          <div className="glassmorphic-liquid-modal-header">
            <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-cyan-300/30 to-transparent" />
          </div>

          {/* Content */}
          <div className="glassmorphic-liquid-modal-content">
            <h2 className="text-lg font-semibold text-white/95">{title}</h2>
            <p className="mt-2 text-sm text-white/60">{message}</p>
          </div>

          {/* Actions */}
          <div className="glassmorphic-liquid-modal-actions">
            <button
              type="button"
              onClick={() => {
                onCancel();
                onClose();
              }}
              className="glassmorphic-liquid-modal-btn cancel"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="glassmorphic-liquid-modal-btn confirm"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
