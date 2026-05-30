'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getRegistryEntriesByCategory, registryCatalog } from '../registry/index.js';
import DashboardGrid from './DashboardGrid.jsx';
import { useGlazeAuth } from './auth/GlazeAuthProvider.jsx';

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
  const { isAuthenticated, user, login } = useGlazeAuth();

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
    <main data-glaze-root data-glaze-cursor-mode="browse" className="min-h-screen bg-black px-6 py-6 text-white">
      <section className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-5 shadow-glass backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Link href="/" className="text-2xl font-black tracking-[0.45em] text-white hover:text-cyan-300 transition-colors">
              GLAZE
            </Link>
            <p className="mt-2 text-sm text-zinc-400">Registry-driven component dashboard</p>
          </div>

          <div className="flex w-full flex-col gap-3 lg:max-w-4xl lg:flex-row lg:items-center">
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
                    data-cursor-magnetic="true"
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

            <div className="flex items-center gap-3 pl-3 border-t border-white/10 pt-3 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-3 shrink-0">
              {isAuthenticated ? (
                <Link
                  href="/profile"
                  data-cursor-magnetic="true"
                  className="group relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-black overflow-hidden hover:border-cyan-400 transition-all hover:shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                  title="Developer Profile"
                >
                  <img
                    src={user?.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256'}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={login}
                  data-cursor-magnetic="true"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white px-4 py-2 text-[0.65rem] font-bold uppercase tracking-[0.3em] text-black hover:bg-cyan-200 transition-colors shrink-0"
                >
                  Init Session
                </button>
              )}
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