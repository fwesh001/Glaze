'use client';

import Link from 'next/link';

import ControlPanel from './ControlPanel.jsx';
import MercuryChamber from './MercuryChamber.jsx';
import Sidebar from './Sidebar.jsx';
import { WorkspaceProvider } from './WorkspaceProvider.jsx';

const navItems = [
  { id: 'toasts', label: 'Toasts', href: '/component/glassmorphic-liquid-toast', shortLabel: 'T' },
  { id: 'modals', label: 'Modals', href: '/component/glassmorphic-liquid-modal', shortLabel: 'M' },
  { id: 'loaders', label: 'Loaders', href: '/component/glassmorphic-pulse-loader', shortLabel: 'L' },
];

export default function WorkspaceShell({ registryItem }) {
  return (
    <WorkspaceProvider registryItem={registryItem}>
      <main className="min-h-screen bg-black px-5 py-5 text-white">
        <div className="mx-auto flex max-w-7xl gap-5">
          <Sidebar items={navItems} />

          <div className="flex min-w-0 flex-1 flex-col gap-5">
            <header className="rounded-[2rem] border border-white/10 bg-white/[0.03] px-6 py-5 shadow-glass backdrop-blur-xl">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <Link href="/dashboard" className="text-2xl font-black tracking-[0.45em] text-white">
                    GLAZE
                  </Link>
                  <div className="mt-2 text-sm text-zinc-400">Control deck workspace</div>
                </div>

                <div className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-cyan-300/80">
                  {registryItem?.category ?? 'component'}
                </div>
              </div>
            </header>

            <MercuryChamber />
            <ControlPanel />
          </div>
        </div>
      </main>
    </WorkspaceProvider>
  );
}
