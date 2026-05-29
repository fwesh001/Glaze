'use client';

import { useEffect, useMemo, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Database, Loader2, LogOut, Plus, RefreshCw, User } from 'lucide-react';

import { useGlazeAuth } from '../../components/auth/GlazeAuthProvider';
import supabase from '../../lib/supabase';

const sampleGuestPresets = [
  {
    type: 'M',
    title: 'Guest Pulse Panel',
    physics_config: { blur: 22, viscosity: 1.4, mass: 0.7 },
    compiled_code:
      'export default function GuestPulsePanel(){return <div className="rounded-3xl border border-cyan-400/30 bg-black/80 p-6 text-cyan-200">Guest Pulse Panel</div>}',
  },
  {
    type: 'L',
    title: 'Guest Glass Modal',
    physics_config: { blur: 28, viscosity: 0.9, mass: 1.1 },
    compiled_code:
      'export default function GuestGlassModal(){return <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-white backdrop-blur-2xl">Guest Glass Modal</div>}',
  },
];

function Avatar({ src, name }) {
  return src ? (
    <img src={src} alt={name || 'Profile avatar'} className="h-24 w-24 rounded-full border border-white/10 object-cover" />
  ) : (
    <div className="flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-xl font-black text-cyan-300">
      G
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated, user, loading, logout, avatarUrl, displayName } = useGlazeAuth();
  const [components, setComponents] = useState([]);
  const [componentsLoading, setComponentsLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const email = user?.email || 'Unknown';
  const username = user?.user_metadata?.user_name || user?.user_metadata?.preferred_username || 'anonymous_dev';
  const joined = useMemo(() => {
    const value = user?.created_at;
    return value ? new Date(value).toLocaleDateString() : 'Unknown';
  }, [user?.created_at]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, loading, router]);

  const fetchComponents = async () => {
    if (!user?.id) return;

    setComponentsLoading(true);
    try {
      const { data, error } = await supabase
        .from('glaze_components')
        .select('id, title, type, created_at, physics_config')
        .eq('author_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setComponents(data ?? []);
    } catch (error) {
      console.error('[Profile] Failed to load components:', error);
    } finally {
      setComponentsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchComponents();
    }
  }, [user?.id]);

  const seedGuestData = async () => {
    if (typeof window === 'undefined') return;
    setSeeding(true);

    try {
      window.localStorage.setItem('glaze_guest_presets', JSON.stringify(sampleGuestPresets));
      await fetchComponents();
    } finally {
      setSeeding(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white">
        <div className="flex min-h-screen items-center justify-center">
          <div className="flex items-center gap-3 text-zinc-400">
            <Loader2 className="h-5 w-5 animate-spin text-cyan-400" />
            <span className="text-xs uppercase tracking-[0.35em]">Checking session</span>
          </div>
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <main className="min-h-screen bg-black px-6 py-6 text-white sm:px-10 lg:px-12">
      <section className="mx-auto flex max-w-6xl flex-col gap-6">
        <header className="flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-white/[0.03] px-6 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_24px_90px_rgba(0,0,0,0.45)] backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-zinc-400 transition-colors hover:border-white/20 hover:text-white"
            >
              <ArrowLeft size={16} />
            </Link>
            <div>
              <div className="text-xs uppercase tracking-[0.4em] text-zinc-500">User Center</div>
              <h1 className="mt-1 text-2xl font-black tracking-[0.25em] text-white">Developer Profile</h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={fetchComponents}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-zinc-300 transition-colors hover:border-cyan-400/30 hover:text-cyan-300"
            >
              <RefreshCw size={13} />
              Refresh
            </button>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-red-300 transition-colors hover:bg-red-500/15"
            >
              <LogOut size={13} />
              Logout
            </button>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.5fr_0.9fr]">
          <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_24px_90px_rgba(0,0,0,0.45)] backdrop-blur-xl">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-xl" />
                <Avatar src={avatarUrl || user?.user_metadata?.avatar_url} name={displayName} />
              </div>

              <div className="min-w-0 flex-1 space-y-2">
                <div className="text-xs uppercase tracking-[0.35em] text-cyan-300/80">Authenticated Session</div>
                <h2 className="truncate text-3xl font-black tracking-tight text-white">{displayName}</h2>
                <p className="text-sm text-zinc-400">{email}</p>
                <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">@{username}</p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                ['Email', email],
                ['Username', `@${username}`],
                ['Joined', joined],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3">
                  <div className="text-[0.65rem] uppercase tracking-[0.3em] text-zinc-500">{label}</div>
                  <div className="mt-1 truncate text-sm text-white">{value}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_24px_90px_rgba(0,0,0,0.45)] backdrop-blur-xl">
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-cyan-300/80">
              <User size={14} />
              Session Tools
            </div>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              Seed guest presets into localStorage to test the migration hook, then sign in again to sync them into Supabase.
            </p>

            <button
              type="button"
              onClick={seedGuestData}
              disabled={seeding}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200 transition-colors hover:bg-cyan-400/20 disabled:opacity-60"
            >
              {seeding ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
              {seeding ? 'Seeding' : 'Inject Guest Presets'}
            </button>
          </section>
        </div>

        <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_24px_90px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-4">
            <div>
              <div className="text-xs uppercase tracking-[0.35em] text-zinc-500">Database</div>
              <h3 className="mt-1 text-lg font-semibold text-white">Synced Components</h3>
            </div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-zinc-500">
              <Database size={14} />
              {components.length} records
            </div>
          </div>

          <div className="mt-5 min-h-[12rem]">
            {componentsLoading ? (
              <div className="flex min-h-[12rem] items-center justify-center text-zinc-400">
                <Loader2 className="mr-2 h-5 w-5 animate-spin text-cyan-400" />
                Loading database state
              </div>
            ) : components.length === 0 ? (
              <div className="flex min-h-[12rem] items-center justify-center rounded-3xl border border-dashed border-white/10 bg-black/30 text-sm text-zinc-500">
                No synced components yet.
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {components.map((component) => (
                  <article key={component.id} className="rounded-3xl border border-white/10 bg-black/35 p-4">
                    <div className="text-[0.65rem] uppercase tracking-[0.3em] text-cyan-300/80">{component.type}</div>
                    <h4 className="mt-2 truncate text-base font-semibold text-white">{component.title}</h4>
                    <p className="mt-3 line-clamp-3 text-xs leading-5 text-zinc-500">
                      {JSON.stringify(component.physics_config || {})}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}
