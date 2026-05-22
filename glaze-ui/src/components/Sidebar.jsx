export default function Sidebar({ items = [], collapsed = false }) {
  return (
    <aside
      className={[
        'rounded-3xl border border-white/10 bg-black/60 p-4 transition-all duration-300',
        collapsed ? 'w-20' : 'w-64',
      ].join(' ')}
    >
      <div className="text-xs uppercase tracking-[0.35em] text-zinc-500">Sidebar</div>
      <nav className="mt-4 space-y-2">
        {items.map((item) => (
          <div key={item.id} className="rounded-2xl border border-white/5 px-3 py-2 text-sm text-zinc-300">
            {collapsed ? item.shortLabel ?? item.label : item.label}
          </div>
        ))}
      </nav>
    </aside>
  );
}
