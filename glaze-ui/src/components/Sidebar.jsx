'use client';

import { useRef, useState } from 'react';

import gsap from 'gsap';
import { ChevronsLeftRight, Menu, PanelLeft } from 'lucide-react';

export default function Sidebar({ items = [] }) {
  const [collapsed, setCollapsed] = useState(false);
  const asideRef = useRef(null);
  const labelRefs = useRef([]);

  labelRefs.current = [];

  const setLabelRef = (element) => {
    if (element && !labelRefs.current.includes(element)) {
      labelRefs.current.push(element);
    }
  };

  const toggleSidebar = () => {
    const nextCollapsed = !collapsed;

    gsap.to(asideRef.current, {
      width: nextCollapsed ? 88 : 272,
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

  return (
    <aside
      ref={asideRef}
      style={{ width: 272 }}
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

      <nav className="mt-4 space-y-2">
        {items.map((item) => (
          <a
            key={item.id}
            href={item.href}
            className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.02] px-3 py-3 text-sm text-zinc-300 transition-colors hover:border-white/10 hover:bg-white/[0.04]"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-black/50 text-xs uppercase tracking-[0.35em] text-cyan-300/80">
              {item.shortLabel ?? item.label?.[0]}
            </span>
            {!collapsed ? (
              <span ref={setLabelRef} className="min-w-0 flex-1 truncate">
                {item.label}
              </span>
            ) : null}
          </a>
        ))}
      </nav>
    </aside>
  );
}
