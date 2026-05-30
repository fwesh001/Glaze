'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { AlertTriangle, CheckCircle2, Info } from 'lucide-react';

import ControlPanel from './ControlPanel.jsx';
import MercuryChamber from './MercuryChamber.jsx';
import Sidebar from './Sidebar.jsx';
import GlazeSiteToast from './ui/GlazeSiteToast.jsx';
import { WorkspaceProvider, useWorkspace } from './WorkspaceProvider.jsx';
import { useGlazeAuth } from './auth/GlazeAuthProvider.jsx';

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
  const { isAuthenticated, user, login } = useGlazeAuth();

  return (
    <WorkspaceProvider registryItem={registryItem}>
      <main data-glaze-root data-glaze-cursor-mode="build" className="min-h-screen bg-black px-4 py-4 text-white lg:px-5 lg:py-5">
        <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-[1600px] gap-5 lg:min-h-[calc(100vh-2.5rem)]">
          <Sidebar registryItem={registryItem} />

          <div className="flex min-w-0 flex-1 flex-col gap-5 pb-1">
            <header className="rounded-[2rem] border border-white/10 bg-white/[0.03] px-6 py-5 shadow-glass backdrop-blur-xl">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <Link href="/dashboard" className="text-2xl font-black tracking-[0.45em] text-white hover:text-cyan-300 transition-colors">
                    GLAZE
                  </Link>
                  <div className="mt-2 text-sm text-zinc-400">Control deck workspace</div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-cyan-300/80">
                    {registryItem?.category ?? 'component'}
                  </div>

                  <div className="flex items-center pl-3 border-l border-white/10 h-6">
                    {isAuthenticated ? (
                      <Link
                        href="/profile"
                        data-cursor-magnetic="true"
                        className="group relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-black overflow-hidden hover:border-cyan-400 transition-all hover:shadow-[0_0_15px_rgba(34,211,238,0.3)]"
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
                        className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white px-3 py-1.5 text-[0.6rem] font-bold uppercase tracking-[0.3em] text-black hover:bg-cyan-200 transition-colors shrink-0"
                      >
                        Init Session
                      </button>
                    )}
                  </div>
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
