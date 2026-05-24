'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { AlertTriangle, CheckCircle2, Info } from 'lucide-react';

import ControlPanel from './ControlPanel.jsx';
import MercuryChamber from './MercuryChamber.jsx';
import Sidebar from './Sidebar.jsx';
import GlazeSiteToast from './ui/GlazeSiteToast.jsx';
import { WorkspaceProvider, useWorkspace } from './WorkspaceProvider.jsx';

function CompilerToastHost() {
  const { compilerToast, clearCompilerToast } = useWorkspace();

  useEffect(() => {
    if (!compilerToast) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      clearCompilerToast();
    }, 3200);

    return () => window.clearTimeout(timer);
  }, [clearCompilerToast, compilerToast]);

  if (!compilerToast) {
    return null;
  }

  const iconMap = {
    success: CheckCircle2,
    error: AlertTriangle,
    info: Info,
  };

  const Icon = iconMap[compilerToast.tone] ?? Info;

  return <GlazeSiteToast message={compilerToast.message} icon={Icon} onDismiss={clearCompilerToast} />;
}

export default function WorkspaceShell({ registryItem }) {
  return (
    <WorkspaceProvider registryItem={registryItem}>
      <main data-glaze-root className="min-h-screen bg-black px-4 py-4 text-white lg:px-5 lg:py-5">
        <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-[1600px] gap-5 lg:min-h-[calc(100vh-2.5rem)]">
          <Sidebar registryItem={registryItem} />

          <div className="flex min-w-0 flex-1 flex-col gap-5 pb-1">
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

        <CompilerToastHost />
      </main>
    </WorkspaceProvider>
  );
}
