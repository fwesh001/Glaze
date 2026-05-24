'use client';

export default function LiveCanvas({ code, physics, isProcessing }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
      <div className="mb-4 text-xs uppercase tracking-[0.35em] text-zinc-500">Live Canvas</div>
      <div className={`h-[calc(100%-2.5rem)] rounded-xl border border-white/10 bg-black/40 ${isProcessing ? 'animate-pulse' : ''}`}>
        <p className="flex items-center justify-center h-full text-center text-sm text-zinc-400">
          {isProcessing ? 'Rendering component...' : 'Component preview'}
        </p>
      </div>
    </div>
  );
}
