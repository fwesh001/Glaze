import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') ?? '/dashboard';
  const origin = requestUrl.origin;

  // No code means Supabase is still on Implicit flow — this route only handles PKCE.
  // Switch to PKCE in: Supabase Dashboard → Authentication → Configuration → Flow type.
  if (!code) {
    console.error('[auth/callback] No PKCE code received. Check that Supabase Auth flow type is set to PKCE.');
    return NextResponse.redirect(`${origin}/?error=auth_failed`);
  }

  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Safe to ignore in middleware/read-only contexts
          }
        },
      },
    }
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error('[auth/callback] Code exchange failed:', error.message);
    return NextResponse.redirect(`${origin}/?error=auth_failed`);
  }

  // Successful PKCE exchange — send user to dashboard (or ?next= param)
  return NextResponse.redirect(`${origin}${next}`);
}
