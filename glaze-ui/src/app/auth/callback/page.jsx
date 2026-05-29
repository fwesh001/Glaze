'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ShieldCheck, ShieldX } from 'lucide-react';
import supabase from '../../../lib/supabase';

// This page handles the redirect back from Supabase GitHub OAuth.
// It runs entirely client-side so the same browser Supabase instance that
// generated the PKCE code_verifier is the one that exchanges it — avoiding
// the cookie/localStorage mismatch that breaks server-side exchange.

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('Verifying identity...');

  useEffect(() => {
    let mounted = true;
    let timeoutId;

    const handleCallback = async () => {
      try {
        const url = new URL(window.location.href);
        const code = url.searchParams.get('code');
        const errorParam = url.searchParams.get('error');
        const errorDescription = url.searchParams.get('error_description');

        // GitHub/Supabase returned an explicit error
        if (errorParam) {
          console.error('[auth/callback] OAuth error:', errorParam, errorDescription);
          if (mounted) {
            setStatus('error');
            setMessage(errorDescription || 'Authorization was denied.');
          }
          setTimeout(() => router.replace('/'), 2500);
          return;
        }

        // ── PKCE flow: Supabase returned ?code= ──────────────────────────────
        if (code) {
          if (mounted) setMessage('Exchanging authorization code...');
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);

          if (error) {
            console.error('[auth/callback] PKCE exchange failed:', error.message);
            if (mounted) {
              setStatus('error');
              setMessage('Session exchange failed. Redirecting...');
            }
            setTimeout(() => router.replace('/'), 2500);
            return;
          }

          if (data?.session && mounted) {
            setStatus('success');
            setMessage('Session established. Entering dashboard...');
            setTimeout(() => router.replace('/dashboard'), 800);
            return;
          }
        }

        // ── Implicit flow fallback: tokens in URL hash ────────────────────────
        // The Supabase browser client picks up #access_token automatically via
        // onAuthStateChange when the page loads.
        if (mounted) setMessage('Establishing session...');

        // Check if session already exists (client may have parsed the hash)
        const { data: { session: existingSession } } = await supabase.auth.getSession();
        if (existingSession && mounted) {
          setStatus('success');
          setMessage('Session established. Entering dashboard...');
          setTimeout(() => router.replace('/dashboard'), 800);
          return;
        }

        // Subscribe and wait for the client to fire SIGNED_IN
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          if (!mounted) return;

          if (event === 'SIGNED_IN' && session) {
            subscription.unsubscribe();
            clearTimeout(timeoutId);
            setStatus('success');
            setMessage('Session established. Entering dashboard...');
            setTimeout(() => router.replace('/dashboard'), 800);
          }
        });

        // Safety timeout after 8 seconds
        timeoutId = setTimeout(() => {
          subscription.unsubscribe();
          if (mounted) {
            setStatus('error');
            setMessage('Authorization timed out. Redirecting...');
          }
          setTimeout(() => router.replace('/'), 2000);
        }, 8000);
      } catch (err) {
        console.error('[auth/callback] Unexpected error:', err);
        if (mounted) {
          setStatus('error');
          setMessage('An unexpected error occurred.');
        }
        setTimeout(() => router.replace('/'), 2500);
      }
    };

    handleCallback();

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white px-6">
      <div className="flex flex-col items-center gap-6 rounded-3xl border border-white/10 bg-zinc-950/80 px-12 py-14 backdrop-blur-xl shadow-2xl">

        {/* Icon */}
        <div className="relative">
          <div className={`absolute inset-0 rounded-full blur-xl opacity-30 ${
            status === 'success' ? 'bg-cyan-400' :
            status === 'error'   ? 'bg-red-500'  : 'bg-white'
          }`} />
          {status === 'success' ? (
            <ShieldCheck size={40} className="relative text-cyan-400" />
          ) : status === 'error' ? (
            <ShieldX size={40} className="relative text-red-400" />
          ) : (
            <Loader2 size={40} className="relative text-zinc-300 animate-spin" />
          )}
        </div>

        {/* Label */}
        <div className="text-center space-y-2">
          <div className={`text-xs uppercase tracking-[0.4em] font-semibold ${
            status === 'success' ? 'text-cyan-300' :
            status === 'error'   ? 'text-red-400'  : 'text-zinc-400'
          }`}>
            {status === 'success' ? 'Authorized' :
             status === 'error'   ? 'Failed'      : 'Handshake'}
          </div>
          <p className="text-sm text-zinc-300 max-w-xs">{message}</p>
        </div>

        {/* Progress bar */}
        {status === 'verifying' && (
          <div className="w-48 h-0.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-cyan-400 rounded-full animate-pulse w-2/3" />
          </div>
        )}
      </div>
    </div>
  );
}
