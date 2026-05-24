'use client';

import { useEffect, useRef } from 'react';
import { Lock } from 'lucide-react';
import gsap from 'gsap';
import useMockSession from '../auth/useMockSession';

export default function AuthGate() {
  const { isAuthenticated, login } = useMockSession();
  const gateRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated && gateRef.current) {
      // Fade out auth gate when authenticated
      gsap.to(gateRef.current, {
        opacity: 0,
        duration: 0.6,
        ease: 'cubic.out',
        pointerEvents: 'none',
      });
    }
  }, [isAuthenticated]);

  if (isAuthenticated) {
    return null;
  }

  return (
    <div
      ref={gateRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-[12px]"
    >
      <div className="flex flex-col items-center gap-8 rounded-3xl border border-white/10 bg-black/70 px-12 py-16 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-full bg-gradient-to-br from-cyan-400/20 to-purple-400/10 p-6">
            <Lock size={40} className="text-cyan-400" />
          </div>
          <h2 className="text-center text-3xl font-bold tracking-tight text-white">Terminal Locked</h2>
          <p className="max-w-sm text-center text-sm text-zinc-400">
            Access to the Synthesis Core requires an active developer session.
          </p>
        </div>

        <button
          onClick={login}
          type="button"
          className="relative inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-cyan-400 px-8 py-3 font-semibold text-black shadow-[0_0_24px_rgba(34,211,238,0.4)] transition-all hover:shadow-[0_0_32px_rgba(34,211,238,0.6)]"
        >
          Initialize Session
        </button>

        <div className="text-xs uppercase tracking-[0.35em] text-zinc-500">Developer Mode</div>
      </div>
    </div>
  );
}
