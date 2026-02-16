
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase URL or Anon Key is missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env.local file.');
}

const isConfigured = supabaseUrl && supabaseAnonKey;

if (!isConfigured) {
    console.error("Supabase is not configured. Redirecting requests to void.");
}

// Create a valid client only if configured. Otherwise, return a mock object.
// The mock object needs to simulate critical methods like auth.getSession() to prevent crashes.
const mockSupabase = {
    auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        signInWithOAuth: async () => ({ data: {}, error: { message: "Supabase not configured (Mock Mode)" } }),
        signOut: async () => ({ error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
    },
    from: () => ({
        select: () => ({ eq: () => ({ single: async () => ({ data: null, error: null }) }) }),
        insert: async () => ({ error: null }),
        update: () => ({ eq: async () => ({ error: null }) }),
    })
};

export const supabase = isConfigured
    ? createClient(supabaseUrl, supabaseAnonKey)
    : (mockSupabase as any);

