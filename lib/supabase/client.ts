import { createBrowserClient as createSupabaseBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';

let browserClient: SupabaseClient<Database> | null = null;

/**
 * Returns a high-performance singleton browser Supabase client.
 * Reuses instance across component renders for lightning-fast response times.
 */
export function createClient(): SupabaseClient<Database> {
  if (browserClient) return browserClient;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  browserClient = createSupabaseBrowserClient<Database>(supabaseUrl, supabaseKey);
  return browserClient;
}

export const createBrowserClient = createClient;
