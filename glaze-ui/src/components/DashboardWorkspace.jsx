'use client';

import { useMemo, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { getRegistryEntriesByCategory, registryCatalog } from '../registry/index.js';
import DashboardGrid from './DashboardGrid.jsx';

const tabs = [
  { key: 'all', label: 'ALL' },
  { key: 'toast', label: 'TOAST' },
  { key: 'modal', label: 'MODAL' },
  { key: 'loader', label: 'LOADERS' },
];

export default function DashboardWorkspace() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('all');
  const [query, setQuery] = useState('');

  const filteredItems = useMemo(() => {
    const source = activeCategory === 'all' ? registryCatalog : getRegistryEntriesByCategory(activeCategory);
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return source;
    }

    return source.filter((item) => {
      const haystack = [item.name, item.category, item.description, item.id].join(' ').toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [activeCategory, query]);

  return (
    <main data-glaze-root className="min-h-screen bg-black px-6 py-6 text-white">
      <section className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-5 shadow-glass backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Link href="/" className="text-2xl font-black tracking-[0.45em] text-white">
              GLAZE
            </Link>
            <p className="mt-2 text-sm text-zinc-400">Registry-driven component dashboard</p>
          </div>

          <div className="flex w-full flex-col gap-3 lg:max-w-2xl lg:flex-row lg:items-center">
            <label className="flex flex-1 items-center rounded-2xl border border-white/10 bg-black/70 px-4 py-3 text-sm text-zinc-300 focus-within:border-cyan-400/40">
              <span className="mr-3 text-zinc-500">Search</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search registry items"
                className="w-full bg-transparent outline-none placeholder:text-zinc-600"
              />
            </label>

            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => {
                const isActive = activeCategory === tab.key;

                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveCategory(tab.key)}
                    className={[
                      'rounded-full border px-4 py-2 text-xs font-semibold tracking-[0.35em] transition-all duration-200',
                      isActive
                        ? 'border-white bg-white text-black'
                        : 'border-white/10 bg-white/[0.03] text-zinc-400 hover:border-white/20 hover:text-white',
                    ].join(' ')}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </header>

        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm text-zinc-400">
          <span>
            Showing <span className="text-white">{filteredItems.length}</span> of{' '}
            <span className="text-white">{registryCatalog.length}</span> components
          </span>
        </div>

        <DashboardGrid items={filteredItems} onSelect={(item) => router.push(`/component/${item.id}`)} />
      </section>
    </main>
  );
}