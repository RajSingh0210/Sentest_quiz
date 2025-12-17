import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn(
    'Supabase environment variables are not set. SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required for server-side operations.',
  );
}

let client: SupabaseClient | null = null;

// Server-side Supabase client using the service role key for inserts.
export const getSupabaseClient = (): SupabaseClient => {
  if (!client) {
    client = createClient(supabaseUrl || '', supabaseServiceKey || '');
  }
  return client;
};
