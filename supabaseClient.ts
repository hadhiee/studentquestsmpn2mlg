
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase URL or Anon Key is missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env.local file.');
}

// Fallback to avoid app crash if keys are missing (e.g. in Vercel before setup)
const options = {};
const isConfigured = supabaseUrl && supabaseAnonKey;

if (!isConfigured) {
    console.error("Supabase is not configured. Redirecting requests to void.");
}

export const supabase = isConfigured
    ? createClient(supabaseUrl, supabaseAnonKey, options)
    : createClient('https://placeholder.supabase.co', 'placeholder', options); // This will fail network requests but won't crash the JS bundle immediately

