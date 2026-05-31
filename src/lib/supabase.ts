import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return (
    supabaseUrl.length > 0 && 
    supabaseAnonKey.length > 0 && 
    supabaseUrl !== 'your-supabase-url' && 
    supabaseAnonKey !== 'your-supabase-anon-key'
  );
};

// Create a single instance of the Supabase client
// If env variables are missing, this client creation will fail silently or log a warning,
// but our db service checks isSupabaseConfigured() before calling it!
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
