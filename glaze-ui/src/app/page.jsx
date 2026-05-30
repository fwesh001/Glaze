'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useGlazeAuth } from '../components/auth/GlazeAuthProvider';
import Footer from '../components/Footer';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, user, login } = useGlazeAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleInitSession = async () => {
    setIsRedirecting(true);
    // Call Supabase OAuth login
    await login();
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-between px-6 py-8 sm:px-10 lg:px-12">
        <div className="flex-1 flex items-center">
          <div className="w-full max-w-4xl">
            <p className="text-xs uppercase tracking-[0.55em] text-zinc-500">UI Laboratory</p>
            <h1 className="mt-6 text-6xl font-black uppercase tracking-[0.55em] text-white sm:text-7xl lg:text-8xl">
              GLAZE
            </h1>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
              A collection of cutting-edge React components and hooks designed to accelerate development and enhance user experiences. Built with the latest web technologies, Glaze empowers developers to create stunning interfaces with ease and efficiency.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-white transition-colors hover:border-white hover:bg-white/5"
              >
                Enter as Guest
              </Link>

              {isAuthenticated ? (
                <Link
                  href="/profile"
                  className="group relative inline-flex items-center gap-4 rounded-full border border-white/10 bg-zinc-950/80 p-2 pr-6 text-sm font-semibold uppercase tracking-[0.35em] text-white transition-all hover:border-cyan-400/50 hover:bg-zinc-900 hover:shadow-[0_0_25px_rgba(34,211,238,0.15)]"
                >
                  <img
                    src={user?.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256'}
                    alt={user?.user_metadata?.name || 'Developer Profile'}
                    className="h-10 w-10 rounded-full border border-white/10 object-cover"
                  />
                  <span className="text-zinc-300 group-hover:text-cyan-300 transition-colors">
                    Profile
                  </span>
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={handleInitSession}
                  disabled={isRedirecting}
                  className="inline-flex items-center justify-center rounded-full border border-white/10 bg-gradient-to-r from-white via-cyan-100 to-zinc-100 px-6 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-black shadow-[0_0_35px_rgba(255,255,255,0.12)] transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none"
                >
                  {isRedirecting ? 'Initializing...' : 'Initialize Session'}
                </button>
              )}
            </div>
          </div>
        </div>

        <Footer />
      </section>

      {isRedirecting ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-6 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-zinc-950 p-6 shadow-glass">
            <div className="text-xs uppercase tracking-[0.4em] text-cyan-300/80">Auth Redirect</div>
            <h2 className="mt-3 text-2xl font-semibold text-white">Contacting Supabase Auth</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              Initializing secure GitHub OAuth handshake. Redirecting to provider...
            </p>
            <div className="mt-6 h-1 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-2/3 rounded-full bg-cyan-400 animate-pulse" />
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
