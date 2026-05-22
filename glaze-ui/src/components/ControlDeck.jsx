export default function ControlDeck({ title = 'Control Deck', children }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-glass">
      <div className="mb-4 text-xs uppercase tracking-[0.35em] text-zinc-500">{title}</div>
      <div>{children}</div>
    </section>
  );
}
