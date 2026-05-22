export type PublicRuntimeEnv = {
  mode: string;
  isDev: boolean;
  isProd: boolean;
  supabaseUrl: string;
  supabaseAnonKey: string;
  enableSupabase: boolean;
  enableAuth: boolean;
  enableCloudSync: boolean;
  aiProxyMode: string;
  enableAIBackendProxy: boolean;
  enableLocalAIProxyHandler: boolean;
  guestSyncMode: string;
  enableGuestSyncBackend: boolean;
  enableLocalGuestSyncHandler: boolean;
  phoneAuthMode: string;
  enablePhoneAuth: boolean;
  enablePhoneAuthLocalMock: boolean;
  lineAuthMode: string;
  enableLineAuth: boolean;
  enableLineAuthLocalMock: boolean;
};

function readStringEnv(key: keyof ImportMetaEnv): string {
  const value = import.meta.env[key];
  return typeof value === 'string' ? value.trim() : '';
}

function readBooleanEnv(key: keyof ImportMetaEnv, fallback = false): boolean {
  const value = readStringEnv(key).toLowerCase();

  if (['true', '1', 'yes', 'on'].includes(value)) {
    return true;
  }

  if (['false', '0', 'no', 'off', ''].includes(value)) {
    return false;
  }

  return fallback;
}

export const publicEnv: PublicRuntimeEnv = Object.freeze({
  mode: import.meta.env.MODE,
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
  supabaseUrl: readStringEnv('VITE_SUPABASE_URL'),
  supabaseAnonKey: readStringEnv('VITE_SUPABASE_ANON_KEY'),
  enableSupabase: readBooleanEnv('VITE_ENABLE_SUPABASE', false),
  enableAuth: readBooleanEnv('VITE_ENABLE_AUTH', false),
  enableCloudSync: readBooleanEnv('VITE_ENABLE_CLOUD_SYNC', false),
  aiProxyMode: readStringEnv('VITE_AI_PROXY_MODE') || 'local_fixture',
  enableAIBackendProxy: readBooleanEnv('VITE_ENABLE_AI_BACKEND_PROXY', false),
  enableLocalAIProxyHandler: readBooleanEnv('VITE_ENABLE_LOCAL_AI_PROXY_HANDLER', false),
  guestSyncMode: readStringEnv('VITE_GUEST_SYNC_MODE') || 'local_fixture',
  enableGuestSyncBackend: readBooleanEnv('VITE_ENABLE_GUEST_SYNC_BACKEND', false),
  enableLocalGuestSyncHandler: readBooleanEnv('VITE_ENABLE_LOCAL_GUEST_SYNC_HANDLER', false),
  phoneAuthMode: readStringEnv('VITE_PHONE_AUTH_MODE') || 'local_mock',
  enablePhoneAuth: readBooleanEnv('VITE_ENABLE_PHONE_AUTH', false),
  enablePhoneAuthLocalMock: readBooleanEnv('VITE_ENABLE_PHONE_AUTH_LOCAL_MOCK', true),
  lineAuthMode: readStringEnv('VITE_LINE_AUTH_MODE') || 'local_mock',
  enableLineAuth: readBooleanEnv('VITE_ENABLE_LINE_AUTH', false),
  enableLineAuthLocalMock: readBooleanEnv('VITE_ENABLE_LINE_AUTH_LOCAL_MOCK', true),
});

export function hasSupabaseEnv(env: Pick<PublicRuntimeEnv, 'supabaseUrl' | 'supabaseAnonKey'> = publicEnv) {
  return Boolean(env.supabaseUrl && env.supabaseAnonKey);
}
