import { getRegistryCounts, registryCatalog } from '../registry/index.js';

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="text-[0.65rem] uppercase tracking-[0.35em] text-zinc-500">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-white">{value}</div>
    </div>
  );
}

export default function Home() {
  const counts = getRegistryCounts();

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <section className="mx-auto flex max-w-5xl flex-col gap-8 rounded-3xl border border-white/10 bg-white/[0.03] p-8 shadow-glass backdrop-blur-xl">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-cyan-300/80">Glaze UI</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">Core scaffold online.</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
            Next.js, Tailwind, GSAP, and the registry engine are wired for Phase 1.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Toasts" value={counts.toasts} />
          <StatCard label="Modals" value={counts.modals} />
          <StatCard label="Loaders" value={counts.loaders} />
          <StatCard label="Total" value={counts.total} />
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/60 p-4">
          <div className="mb-3 text-xs uppercase tracking-[0.3em] text-zinc-500">Registry Snapshot</div>
          <pre className="overflow-auto text-xs leading-6 text-zinc-300">
            {JSON.stringify(
              registryCatalog.map(({ id, name, category, directoryPath }) => ({
                id,
                name,
                category,
                directoryPath,
              })),
              null,
              2,
            )}
          </pre>
        </div>
      </section>
    </main>
  );
}
