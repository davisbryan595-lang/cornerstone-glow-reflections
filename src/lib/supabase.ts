import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!supabase) {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (!url || !anon) {
      throw new Error("Supabase environment variables are missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
    }
    supabase = createClient(url, anon, { auth: { persistSession: true, autoRefreshToken: true } });
  }
  return supabase;
}
