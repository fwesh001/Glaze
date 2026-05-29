'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ShieldCheck, ShieldX } from 'lucide-react';
import supabase from '../../../lib/supabase';

// Implicit OAuth flow callback handler.
//
// After GitHub OAuth, Supabase redirects here with tokens in the URL hash:
//   /auth/callback#access_token=...&refresh_token=...
//
// The Supabase client (detectSessionInUrl: true) parses the hash automatically
// and fires onAuthStateChange('SIGNED_IN'). We just wait for that event and
// redirect to /dashboard. No manual code exchange needed.

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('Verifying identity...');

  useEffect(() => {
    let mounted = true;
    let timeoutId;

    const handleCallback = async () => {
      // Check for an explicit OAuth error in the query string
      const params = new URLSearchParams(window.location.search);
      const oauthError = params.get('error');
      if (oauthError) {
        if (mounted) {
          setStatus('error');
          setMessage(params.get('error_description') || 'Authorization was denied.');
        }
        setTimeout(() => router.replace('/'), 2500);
        return;
      }

      // Check if Supabase has already parsed the hash and established a session
      const { data: { session } } = await supabase.auth.getSession();
      if (session && mounted) {
        setStatus('success');
        setMessage('Session established. Entering dashboard...');
        setTimeout(() => router.replace('/dashboard'), 600);
        return;
      }

      // Otherwise wait for onAuthStateChange to fire once Supabase parses
      // the #access_token hash from the URL
      if (mounted) setMessage('Establishing session...');

      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (!mounted) return;

        if (event === 'SIGNED_IN' && session) {
          subscription.unsubscribe();
          clearTimeout(timeoutId);
          setStatus('success');
          setMessage('Session established. Entering dashboard...');
          setTimeout(() => router.replace('/dashboard'), 600);
        }
      });

      // Fallback: 10 seconds, then give up
      timeoutId = setTimeout(() => {
        subscription.unsubscribe();
        if (mounted) {
          setStatus('error');
          setMessage('Authorization timed out. Please try again.');
        }
        setTimeout(() => router.replace('/'), 2000);
      }, 10000);

      return () => {
        subscription.unsubscribe();
        clearTimeout(timeoutId);
      };
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

        {/* Text */}
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

        {/* Pulse bar */}
        {status === 'verifying' && (
          <div className="w-48 h-0.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-cyan-400/60 rounded-full animate-pulse w-2/3" />
          </div>
        )}
      </div>
    </div>
  );
}
