import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

// Explicitly use PKCE flow so the auth callback receives a ?code= query parameter
// that the server-side route handler can exchange for a session.
// Also set "Auth flow type" to PKCE in:
// Supabase Dashboard → Authentication → Configuration
const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    flowType: 'pkce',
    persistSession: true,
    autoRefreshToken: true,
  },
});

export { supabase };
export default supabase;
