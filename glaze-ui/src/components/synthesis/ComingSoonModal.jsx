'use client';

import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';

export default function ComingSoonModal() {
  const router = useRouter();

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-[12px]">
      <div className="mx-4 w-full max-w-md rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900/80 to-black/60 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-xl">
        <div className="flex flex-col items-center gap-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-500/10">
            <Lock size={28} className="text-cyan-300" />
          </div>

          <div className="text-center">
            <h1 className="text-2xl font-black uppercase tracking-[0.4em] text-white">Chamber Locked</h1>
            <p className="mt-6 text-sm leading-relaxed text-zinc-300">
              The Synthesis Engine is undergoing final optimization. Access to the universal text-to-component and code-refactoring pipelines is temporarily restricted. Prepare your terminal.
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="mt-4 w-full rounded-full border border-cyan-400/40 bg-gradient-to-r from-cyan-500/20 to-cyan-400/10 px-6 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-cyan-200 transition-all hover:border-cyan-300/60 hover:bg-cyan-500/30 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)]"
          >
            Return to Dashboard
          </button>

          <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">
            Coming Soon • v1.0 Beta
          </div>
        </div>
      </div>
    </div>
  );
}
