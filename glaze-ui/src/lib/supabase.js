import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

// Implicit flow (default): Supabase returns tokens in the URL hash (#access_token=...)
// after GitHub OAuth. The client parses them automatically via detectSessionInUrl.
// PKCE is intentionally NOT used here — Next.js App Router page reloads clear
// localStorage before the code_verifier exchange can complete.
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    detectSessionInUrl: true,
    persistSession: true,
    autoRefreshToken: true,
  },
});

export { supabase };
export default supabase;
