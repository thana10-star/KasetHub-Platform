export type EnvSafetySeverity = 'safe' | 'info' | 'warning' | 'blocker';

export type EnvSafetyStatus = 'mock_only_safe' | 'ready_for_local_staging_env' | 'needs_attention' | 'blocked';

export type EnvSafetyItem = {
  id: string;
  severity: EnvSafetySeverity;
  title: string;
  detail: string;
  recommendation: string;
};

export type EnvSafetyFlagSnapshot = {
  enableSupabase: boolean;
  enableAuth: boolean;
  enableCloudSync: boolean;
  enableDryRunNetworkCheck: boolean;
  enableGuestSyncBackend: boolean;
  enableGuestSyncEdge: boolean;
  enablePhoneAuth: boolean;
  enableLineAuth: boolean;
};

export type EnvSafetyValueSnapshot = {
  hasSupabaseUrl: boolean;
  hasSupabaseAnonKey: boolean;
  maskedSupabaseUrl: string;
  maskedAnonKey: string;
  supabaseUrlLooksPlaceholder: boolean;
  supabaseAnonKeyLooksPlaceholder: boolean;
  supabaseUrlLooksValid: boolean;
  anonKeyLooksFormatish: boolean;
  serviceRoleLikeKeyDetected: boolean;
};

export type EnvSafetyCheckResult = {
  status: EnvSafetyStatus;
  statusLabel: string;
  summary: string;
  values: EnvSafetyValueSnapshot;
  flags: EnvSafetyFlagSnapshot;
  safeRecommendedValues: string[];
  blockers: EnvSafetyItem[];
  warnings: EnvSafetyItem[];
  readyItems: EnvSafetyItem[];
  notes: EnvSafetyItem[];
};
