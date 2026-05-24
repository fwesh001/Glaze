'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import Link from 'next/link';
import gsap from 'gsap';
import { ChevronsLeftRight, Lock, Menu, PanelLeft, Search, Sparkles } from 'lucide-react';

import useMockSession from './auth/useMockSession';
import { componentRegistries, getRegistryEntriesByCategory } from '../registry/index.js';

const categoryTabs = [
  { key: 'all', label: 'All' },
  { key: 'toast', label: 'Toasts' },
  { key: 'modal', label: 'Modals' },
  { key: 'loader', label: 'Loaders' },
];

export default function Sidebar({ registryItem }) {
  const [collapsed, setCollapsed] = useState(false);
  const [activeCategory, setActiveCategory] = useState(registryItem?.category ?? 'all');
  const [query, setQuery] = useState('');
  const asideRef = useRef(null);
  const labelRefs = useRef([]);
  const { isAuthenticated } = useMockSession();

  labelRefs.current = [];

  useEffect(() => {
    setActiveCategory(registryItem?.category ?? 'all');
  }, [registryItem?.id, registryItem?.category]);

  const setLabelRef = (element) => {
    if (element && !labelRefs.current.includes(element)) {
      labelRefs.current.push(element);
    }
  };

  const toggleSidebar = () => {
    const nextCollapsed = !collapsed;

    gsap.to(asideRef.current, {
      width: nextCollapsed ? 88 : 320,
      duration: 0.35,
      ease: 'power2.inOut',
      overwrite: 'auto',
    });

    gsap.to(labelRefs.current, {
      opacity: nextCollapsed ? 0 : 1,
      xPercent: nextCollapsed ? -14 : 0,
      duration: 0.25,
      stagger: 0.03,
      ease: 'power2.out',
      overwrite: 'auto',
    });

    setCollapsed(nextCollapsed);
  };

  const registryCount = componentRegistries[activeCategory]?.length ?? getRegistryEntriesByCategory(activeCategory).length;

  const visibleItems = useMemo(() => {
    const source = getRegistryEntriesByCategory(activeCategory === 'all' ? 'all' : activeCategory);
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
    <aside
      ref={asideRef}
      style={{ width: 320 }}
      className="sticky top-4 max-h-[calc(100vh-2rem)] overflow-hidden rounded-[2rem] border border-zinc-800 bg-zinc-950/95 px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_24px_90px_rgba(0,0,0,0.55)] lg:top-5 lg:max-h-[calc(100vh-2.5rem)]"
    >
      <div className="flex items-center justify-between gap-3 border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white">
            <ChevronsLeftRight size={16} />
          </div>
          {!collapsed ? (
            <div>
              <div className="text-xs uppercase tracking-[0.35em] text-zinc-500">Navigation</div>
              <div className="mt-1 text-sm text-zinc-200">Component Tree</div>
            </div>
          ) : null}
        </div>

        <button
          type="button"
          onClick={toggleSidebar}
          className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-white transition-colors hover:bg-white/[0.08]"
          aria-label="Toggle sidebar"
        >
          {collapsed ? <Menu size={16} /> : <PanelLeft size={16} />}
        </button>
      </div>

      {!collapsed ? (
        <>
          <div className="mt-4 flex flex-wrap gap-2">
            {categoryTabs.map((tab) => {
              const isActive = activeCategory === tab.key;

              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveCategory(tab.key)}
                  className={[
                    'rounded-full border px-3 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.32em] transition-colors',
                    isActive
                      ? 'border-white bg-white text-black'
                      : 'border-white/10 bg-white/[0.03] text-zinc-500 hover:border-white/20 hover:text-white',
                  ].join(' ')}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
Link
            href="/synthesis"
            title={isAuthenticated ? 'Synthesis Engine' : 'Synthesis Engine (Locked)'}
            className="mt-4 flex items-center gap-3 rounded-2xl border border-white/5 bg-gradient-to-r from-cyan-500/10 to-purple-500/5 px-3 py-3 text-sm transition-colors hover:border-cyan-400/30 hover:bg-cyan-500/15"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400/20 to-purple-400/10">
              {isAuthenticated ? (
                <Sparkles size={16} className="text-cyan-400" />
              ) : (
                <Lock size={16} className="text-zinc-500" />
              )}
            </div>
            <span className="min-w-0 flex-1 truncate">Synthesis</span>
          </Link>

          <
          <label className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-zinc-400 focus-within:border-cyan-400/40">
            <Search size={15} className="shrink-0 text-zinc-500" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search components"
              className="w-full bg-transparent outline-none placeholder:text-zinc-600"
            />
          </label>

          <div className="mt-4 flex items-center justify-between text-[0.65rem] uppercase tracking-[0.4em] text-zinc-500">
            <span>{activeCategory === 'all' ? 'All' : `${activeCategory}s`}</span>
            <span>{registryCount} items</span>
          </div>

          <nav className="mt-4 space-y-2 overflow-auto pr-1" style={{ maxHeight: 'calc(100vh - 18rem)' }}>
            {visibleItems.map((item) => {
              const isSelected = registryItem?.id === item.id;

              return (
                <Link
                  key={item.id}
                  href={`/component/${item.id}`}
                  className={[
                    'flex items-center gap-3 rounded-2xl border px-3 py-3 text-sm transition-colors',
                    isSelected
                      ? 'border-cyan-300/40 bg-cyan-300/10 text-white shadow-[0_0_24px_rgba(52,211,255,0.12)]'
                      : 'border-white/5 bg-white/[0.02] text-zinc-300 hover:border-white/10 hover:bg-white/[0.04]',
                  ].join(' ')}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-black/50 text-[0.62rem] uppercase tracking-[0.28em] text-cyan-300/80">
                    {item.name?.[0]}
                  </span>
                  <span ref={setLabelRef} className="min-w-0 flex-1 truncate">
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>
        </>
      ) : (
        <nav className="mt-4 flex flex-col gap-3">
          {categoryTabs.map((tab) => {
            const isActive = activeCategory === tab.key;
            const abbreviation = tab.key === 'all' ? 'A' : tab.key[0].toUpperCase();

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveCategory(tab.key)}
                title={tab.label}
                className={[
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-all',
                  isActive
                    ? 'border-cyan-300/40 bg-cyan-300/20 text-cyan-200 shadow-[0_0_20px_rgba(52,211,255,0.15)]'
                    : 'border-white/10 bg-white/[0.04] text-zinc-400 hover:border-white/20 hover:bg-white/[0.08] hover:text-white',
                ].join(' ')}
              >
                <span className="text-[0.7rem] font-bold uppercase tracking-[0.24em]">{abbreviation}</span>
              </button>
            );
          })}

          <Link
            href="/synthesis"
            title={isAuthenticated ? 'Synthesis Engine' : 'Synthesis Engine (Locked)'}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/5 bg-gradient-to-br from-cyan-400/20 to-purple-400/10 transition-all hover:border-cyan-400/30 hover:bg-cyan-500/15"
          >
            {isAuthenticated ? (
              <Sparkles size={16} className="text-cyan-400" />
            ) : (
              <Lock size={16} className="text-zinc-500" />
            )}
          </Link>
        </nav>
      )}
    </aside>
  );
}
