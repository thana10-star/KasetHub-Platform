export type PublicRuntimeEnv = {
  mode: string;
  isDev: boolean;
  isProd: boolean;
  supabaseUrl: string;
  supabaseAnonKey: string;
  enableSupabase: boolean;
  enableAuth: boolean;
  enableCloudSync: boolean;
  enableCommunityWrites: boolean;
  adminEmails: string[];
  enableSupabaseDryRunNetworkCheck: boolean;
  aiProxyMode: string;
  aiBackendContractEnabled: boolean;
  enableAIBackendProxy: boolean;
  enableLocalAIProxyHandler: boolean;
  enableRealAIText: boolean;
  aiTextMode: string;
  aiTextProxyMode: string;
  enableAITextNetwork: boolean;
  aiTextEndpointUrl: string;
  enableAITextEndpointDryRun: boolean;
  enableAITextEndpointNetwork: boolean;
  calculatorAIMode: string;
  enableCalculatorAIBackend: boolean;
  enableCalculatorAINetwork: boolean;
  calculatorAIEdgeUrl: string;
  enableCalculatorAIEdgeDryRun: boolean;
  enableCalculatorAIEdgeNetwork: boolean;
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
  weatherMode: string;
  enableRealWeatherApi: boolean;
  weatherDefaultLat: number;
  weatherDefaultLon: number;
  weatherDefaultLabel: string;
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

function readNumberEnv(key: keyof ImportMetaEnv, fallback: number): number {
  const value = Number(readStringEnv(key));
  return Number.isFinite(value) ? value : fallback;
}

function readStringListEnv(key: keyof ImportMetaEnv): string[] {
  return readStringEnv(key)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
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
  enableCommunityWrites: readBooleanEnv('VITE_ENABLE_COMMUNITY_WRITES', false),
  adminEmails: readStringListEnv('VITE_ADMIN_EMAILS'),
  enableSupabaseDryRunNetworkCheck: readBooleanEnv('VITE_ENABLE_SUPABASE_DRY_RUN_NETWORK_CHECK', false),
  aiProxyMode: readStringEnv('VITE_AI_PROXY_MODE') || 'local_fixture',
  aiBackendContractEnabled: readBooleanEnv('VITE_AI_BACKEND_CONTRACT_ENABLED', false),
  enableAIBackendProxy: readBooleanEnv('VITE_ENABLE_AI_BACKEND_PROXY', false),
  enableLocalAIProxyHandler: readBooleanEnv('VITE_ENABLE_LOCAL_AI_PROXY_HANDLER', false),
  enableRealAIText: readBooleanEnv('VITE_ENABLE_REAL_AI_TEXT', false),
  aiTextMode: readStringEnv('VITE_AI_TEXT_MODE') || 'local_fixture',
  aiTextProxyMode: readStringEnv('VITE_AI_TEXT_PROXY_MODE') || 'staging_proxy',
  enableAITextNetwork: readBooleanEnv('VITE_ENABLE_AI_TEXT_NETWORK', false),
  aiTextEndpointUrl: readStringEnv('VITE_AI_TEXT_ENDPOINT_URL'),
  enableAITextEndpointDryRun: readBooleanEnv('VITE_ENABLE_AI_TEXT_ENDPOINT_DRY_RUN', false),
  enableAITextEndpointNetwork: readBooleanEnv('VITE_ENABLE_AI_TEXT_ENDPOINT_NETWORK', false),
  calculatorAIMode: readStringEnv('VITE_CALCULATOR_AI_MODE') || 'local_fixture',
  enableCalculatorAIBackend: readBooleanEnv('VITE_ENABLE_CALCULATOR_AI_BACKEND', false),
  enableCalculatorAINetwork: readBooleanEnv('VITE_ENABLE_CALCULATOR_AI_NETWORK', false),
  calculatorAIEdgeUrl: readStringEnv('VITE_CALCULATOR_AI_EDGE_URL'),
  enableCalculatorAIEdgeDryRun: readBooleanEnv('VITE_ENABLE_CALCULATOR_AI_EDGE_DRY_RUN', false),
  enableCalculatorAIEdgeNetwork: readBooleanEnv('VITE_ENABLE_CALCULATOR_AI_EDGE_NETWORK', false),
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
  weatherMode: readStringEnv('VITE_WEATHER_MODE') || 'local_fixture',
  enableRealWeatherApi: readBooleanEnv('VITE_ENABLE_REAL_WEATHER_API', false),
  weatherDefaultLat: readNumberEnv('VITE_WEATHER_DEFAULT_LAT', 13.7563),
  weatherDefaultLon: readNumberEnv('VITE_WEATHER_DEFAULT_LON', 100.5018),
  weatherDefaultLabel: readStringEnv('VITE_WEATHER_DEFAULT_LABEL') || 'กรุงเทพฯ',
});

export function hasSupabaseEnv(env: Pick<PublicRuntimeEnv, 'supabaseUrl' | 'supabaseAnonKey'> = publicEnv) {
  return Boolean(env.supabaseUrl && env.supabaseAnonKey);
}
