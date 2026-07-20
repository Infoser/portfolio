import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = (): boolean =>
  typeof SUPABASE_URL === 'string' &&
  SUPABASE_URL.length > 0 &&
  typeof SUPABASE_ANON_KEY === 'string' &&
  SUPABASE_ANON_KEY.length > 0;

let client: SupabaseClient | null = null;
let clientPromise: Promise<SupabaseClient> | null = null;

export async function getSupabase(): Promise<SupabaseClient | null> {
  if (!isSupabaseConfigured()) return null;
  if (client) return client;
  if (clientPromise) return clientPromise;

  clientPromise = (async () => {
    client = createClient(SUPABASE_URL as string, SUPABASE_ANON_KEY as string, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    });
    return client;
  })();

  return clientPromise;
}

export type SupabaseSectionRow = {
  section_key: string;
  content: unknown;
  updated_by: string | null;
  updated_at: string;
};
