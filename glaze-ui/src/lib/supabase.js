import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

// Browser singleton — uses PKCE so the auth callback receives ?code= instead
// of hash-based implicit tokens. The code_verifier is stored in localStorage
// and exchanged client-side in /auth/callback/page.jsx.
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    flowType: 'pkce',
    persistSession: true,
    autoRefreshToken: true,
  },
});

export { supabase };
export default supabase;
