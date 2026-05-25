import { hasSupabaseEnv, publicEnv, type PublicRuntimeEnv } from '@/config/env';

export type SupabaseConfigCheck = {
  hasUrl: boolean;
  hasAnonKey: boolean;
  hasRequiredEnv: boolean;
  urlLooksValid: boolean;
  anonKeyLooksUsable: boolean;
  enableSupabaseFlag: boolean;
  enableAuthFlag: boolean;
  enableCloudSyncFlag: boolean;
  enableDryRunNetworkCheckFlag: boolean;
  canCreateClient: boolean;
  warnings: string[];
};

function looksLikeSupabaseUrl(value: string) {
  if (!value) {
    return false;
  }

  try {
    const url = new URL(value);
    return (
      (url.protocol === 'https:' && url.hostname.endsWith('.supabase.co')) ||
      (url.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(url.hostname))
    );
  } catch {
    return false;
  }
}

function decodeJwtPayload(value: string) {
  const [, payload] = value.split('.');

  if (!payload) {
    return '';
  }

  try {
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    return atob(padded);
  } catch {
    return '';
  }
}

function looksLikeServiceRoleKey(value: string) {
  const lower = value.toLowerCase();
  const decodedPayload = decodeJwtPayload(value).toLowerCase();

  return (
    lower.includes('service_role') ||
    lower.includes('service-role') ||
    lower.includes('service role') ||
    decodedPayload.includes('"role":"service_role"') ||
    decodedPayload.includes('service_role')
  );
}

function looksLikePlaceholder(value: string) {
  return /your_|replace_|placeholder|example/i.test(value);
}

export function checkSupabaseConfig(env: PublicRuntimeEnv = publicEnv): SupabaseConfigCheck {
  const hasUrl = Boolean(env.supabaseUrl);
  const hasAnonKey = Boolean(env.supabaseAnonKey);
  const hasRequiredEnv = hasSupabaseEnv(env);
  const urlLooksValid = hasUrl ? looksLikeSupabaseUrl(env.supabaseUrl) : false;
  const anonKeyLooksUsable = hasAnonKey && !looksLikeServiceRoleKey(env.supabaseAnonKey) && !looksLikePlaceholder(env.supabaseAnonKey);
  const warnings: string[] = [];

  if (env.enableSupabase && !hasRequiredEnv) {
    warnings.push('เปิด VITE_ENABLE_SUPABASE แล้ว แต่ยังไม่มี VITE_SUPABASE_URL หรือ VITE_SUPABASE_ANON_KEY');
  }

  if (hasUrl && !urlLooksValid) {
    warnings.push('รูปแบบ VITE_SUPABASE_URL ยังไม่เหมือน URL ของ Supabase หรือ local Supabase');
  }

  if (hasAnonKey && looksLikeServiceRoleKey(env.supabaseAnonKey)) {
    warnings.push('ห้ามใช้ service role key ใน frontend ให้ใช้ anon key เท่านั้น');
  }

  if (hasAnonKey && looksLikePlaceholder(env.supabaseAnonKey)) {
    warnings.push('VITE_SUPABASE_ANON_KEY ยังเป็นค่า placeholder');
  }

  if ((env.enableAuth || env.enableCloudSync) && !env.enableSupabase) {
    warnings.push('Auth หรือ Cloud Sync จะไม่ทำงานจนกว่า VITE_ENABLE_SUPABASE=true');
  }

  if (env.enableSupabaseDryRunNetworkCheck && (!env.enableSupabase || !hasRequiredEnv)) {
    warnings.push('VITE_ENABLE_SUPABASE_DRY_RUN_NETWORK_CHECK=true แต่ Supabase ยังไม่พร้อม จึงไม่ควรรัน network probe');
  }

  return {
    hasUrl,
    hasAnonKey,
    hasRequiredEnv,
    urlLooksValid,
    anonKeyLooksUsable,
    enableSupabaseFlag: env.enableSupabase,
    enableAuthFlag: env.enableAuth,
    enableCloudSyncFlag: env.enableCloudSync,
    enableDryRunNetworkCheckFlag: env.enableSupabaseDryRunNetworkCheck,
    canCreateClient: env.enableSupabase && hasRequiredEnv && urlLooksValid && anonKeyLooksUsable,
    warnings,
  };
}
