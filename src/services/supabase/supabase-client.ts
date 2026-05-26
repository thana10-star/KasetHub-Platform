import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { publicEnv } from '@/config/env';
import { getSupabaseStatus } from '@/services/supabase/supabase-status';

let cachedClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  const status = getSupabaseStatus();

  if (!status.canCreateClient) {
    return null;
  }

  if (!cachedClient) {
    cachedClient = createClient(publicEnv.supabaseUrl, publicEnv.supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        detectSessionInUrl: true,
        persistSession: true,
      },
    });
  }

  return cachedClient;
}

export function isSupabaseClientAvailable() {
  return getSupabaseClient() !== null;
}
