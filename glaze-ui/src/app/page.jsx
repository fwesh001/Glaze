'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

const footerLinks = [
  { label: 'GitHub', href: 'https://github.com' },
  { label: 'MIT License', href: 'https://opensource.org/license/mit' },
  { label: 'Docs', href: 'https://nextjs.org/docs' },
];

export default function Home() {
  const router = useRouter();
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    if (!authOpen) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      router.push('/dashboard');
    }, 650);

    return () => window.clearTimeout(timeoutId);
  }, [authOpen, router]);

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-between px-6 py-8 sm:px-10 lg:px-12">
        <div className="flex-1 flex items-center">
          <div className="w-full max-w-4xl">
            <p className="text-xs uppercase tracking-[0.55em] text-zinc-500">Liquid UI Laboratory</p>
            <h1 className="mt-6 text-6xl font-black uppercase tracking-[0.55em] text-white sm:text-7xl lg:text-8xl">
              GLAZE
            </h1>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
              Premium glassmorphic component research with a registry-driven dashboard and physics-led motion.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-white transition-colors hover:border-white hover:bg-white/5"
              >
                Enter as Guest
              </Link>

              <button
                type="button"
                onClick={() => setAuthOpen(true)}
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-gradient-to-r from-white via-cyan-100 to-zinc-100 px-6 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-black shadow-[0_0_35px_rgba(255,255,255,0.12)] transition-transform hover:-translate-y-0.5"
              >
                Initialize Session
              </button>
            </div>
          </div>
        </div>

        <footer className="grid gap-4 border-t border-white/10 py-6 text-xs uppercase tracking-[0.35em] text-zinc-500 sm:grid-cols-3">
          {footerLinks.map((item) => (
            <a key={item.label} href={item.href} target="_blank" rel="noreferrer" className="transition-colors hover:text-white">
              {item.label}
            </a>
          ))}
        </footer>
      </section>

      {authOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-6 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-zinc-950 p-6 shadow-glass">
            <div className="text-xs uppercase tracking-[0.4em] text-cyan-300/80">Auth Placeholder</div>
            <h2 className="mt-3 text-2xl font-semibold text-white">Initializing session</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              Mock session handshake active. Redirecting to the dashboard.
            </p>
            <div className="mt-6 h-1 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-2/3 rounded-full bg-white" />
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
