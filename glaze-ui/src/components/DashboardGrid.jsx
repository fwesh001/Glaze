export default function DashboardGrid({ items = [], onSelect = () => {} }) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onSelect(item)}
          className="group rounded-3xl border border-white/10 bg-white/[0.03] p-5 text-left transition-transform duration-200 hover:-translate-y-1 hover:bg-white/[0.05]"
        >
          <div className="text-xs uppercase tracking-[0.35em] text-cyan-300/80">{item.category}</div>
          <h3 className="mt-3 text-lg font-semibold text-white">{item.name}</h3>
          <p className="mt-2 text-sm leading-6 text-zinc-400">{item.description}</p>
        </button>
      ))}
    </section>
  );
}
