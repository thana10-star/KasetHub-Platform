export type SupabaseConnectionDryRunCode =
  | 'local_only_supabase_disabled'
  | 'local_only_env_missing'
  | 'blocked_service_role_like_key'
  | 'blocked_invalid_env'
  | 'client_ready_no_network'
  | 'network_probe_ready';

export type SupabaseConnectionHealth = 'safe_local' | 'ready_for_staging_check' | 'warning' | 'blocked';

export type SupabaseSchemaCheckStatus = 'not_checked' | 'schema_not_applied_yet' | 'public_probe_ok' | 'unknown_error';

export type SupabaseConnectionFlagSnapshot = {
  enableSupabase: boolean;
  enableAuth: boolean;
  enableCloudSync: boolean;
  enableDryRunNetworkCheck: boolean;
};

export type SupabaseConnectionEnvSnapshot = {
  hasUrl: boolean;
  hasAnonKey: boolean;
  hasRequiredEnv: boolean;
  urlLooksValid: boolean;
  anonKeyLooksUsable: boolean;
  anonKeyLooksPlaceholder: boolean;
  serviceRoleLikeKeyDetected: boolean;
};

export type SupabaseNetworkProbePlan = {
  enabled: boolean;
  allowedByGuards: boolean;
  attempted: boolean;
  targetLabel: string;
  schemaStatus: SupabaseSchemaCheckStatus;
  message: string;
};

export type SupabaseConnectionDryRunResult = {
  code: SupabaseConnectionDryRunCode;
  health: SupabaseConnectionHealth;
  label: string;
  description: string;
  env: SupabaseConnectionEnvSnapshot;
  flags: SupabaseConnectionFlagSnapshot;
  canCreateClient: boolean;
  networkProbe: SupabaseNetworkProbePlan;
  noWriteGuarantees: string[];
  warnings: string[];
  nextSteps: string[];
};

export type SupabasePublicReadProbeResult = {
  attempted: boolean;
  schemaStatus: SupabaseSchemaCheckStatus;
  message: string;
  errorCode?: string;
};
