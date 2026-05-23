export type PublicRuntimeEnv = {
  mode: string;
  isDev: boolean;
  isProd: boolean;
  supabaseUrl: string;
  supabaseAnonKey: string;
  enableSupabase: boolean;
  enableAuth: boolean;
  enableCloudSync: boolean;
  enableSupabaseDryRunNetworkCheck: boolean;
  aiProxyMode: string;
  enableAIBackendProxy: boolean;
  enableLocalAIProxyHandler: boolean;
  guestSyncMode: string;
  enableGuestSyncBackend: boolean;
  enableGuestSyncEdge: boolean;
  guestSyncEdgeMode: string;
  enableLocalGuestSyncHandler: boolean;
  phoneAuthMode: string;
  enablePhoneAuth: boolean;
  enablePhoneAuthLocalMock: boolean;
  supabaseAuthRedirectUrl: string;
  authStagingLabel: string;
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
  enableSupabaseDryRunNetworkCheck: readBooleanEnv('VITE_ENABLE_SUPABASE_DRY_RUN_NETWORK_CHECK', false),
  aiProxyMode: readStringEnv('VITE_AI_PROXY_MODE') || 'local_fixture',
  enableAIBackendProxy: readBooleanEnv('VITE_ENABLE_AI_BACKEND_PROXY', false),
  enableLocalAIProxyHandler: readBooleanEnv('VITE_ENABLE_LOCAL_AI_PROXY_HANDLER', false),
  guestSyncMode: readStringEnv('VITE_GUEST_SYNC_MODE') || 'local_fixture',
  enableGuestSyncBackend: readBooleanEnv('VITE_ENABLE_GUEST_SYNC_BACKEND', false),
  enableGuestSyncEdge: readBooleanEnv('VITE_ENABLE_GUEST_SYNC_EDGE', false),
  guestSyncEdgeMode: readStringEnv('VITE_GUEST_SYNC_EDGE_MODE') || 'disabled',
  enableLocalGuestSyncHandler: readBooleanEnv('VITE_ENABLE_LOCAL_GUEST_SYNC_HANDLER', false),
  phoneAuthMode: readStringEnv('VITE_PHONE_AUTH_MODE') || 'local_mock',
  enablePhoneAuth: readBooleanEnv('VITE_ENABLE_PHONE_AUTH', false),
  enablePhoneAuthLocalMock: readBooleanEnv('VITE_ENABLE_PHONE_AUTH_LOCAL_MOCK', true),
  supabaseAuthRedirectUrl: readStringEnv('VITE_SUPABASE_AUTH_REDIRECT_URL'),
  authStagingLabel: readStringEnv('VITE_AUTH_STAGING_LABEL') || 'local',
  lineAuthMode: readStringEnv('VITE_LINE_AUTH_MODE') || 'local_mock',
  enableLineAuth: readBooleanEnv('VITE_ENABLE_LINE_AUTH', false),
  enableLineAuthLocalMock: readBooleanEnv('VITE_ENABLE_LINE_AUTH_LOCAL_MOCK', true),
});

export function hasSupabaseEnv(env: Pick<PublicRuntimeEnv, 'supabaseUrl' | 'supabaseAnonKey'> = publicEnv) {
  return Boolean(env.supabaseUrl && env.supabaseAnonKey);
}
