export type SupabaseReadonlyProbeTableName = 'articles' | 'videos' | 'crop_price_snapshots';

export type SupabaseReadonlyProbeOverallStatus =
  | 'network_disabled'
  | 'config_missing'
  | 'client_not_created'
  | 'blocked_by_safety_flags'
  | 'running'
  | 'success'
  | 'partial'
  | 'blocked'
  | 'error';

export type SupabaseReadonlyProbeTableStatus =
  | 'not_attempted'
  | 'empty_success'
  | 'read_success'
  | 'rls_or_policy_blocked'
  | 'table_missing'
  | 'network_error'
  | 'unknown_error';

export type SupabaseReadonlyProbeTable = {
  name: SupabaseReadonlyProbeTableName;
  label: string;
  purpose: string;
};

export type SupabaseReadonlyProbeFlags = {
  enableSupabase: boolean;
  enableDryRunNetworkCheck: boolean;
  enableAuth: boolean;
  enableCloudSync: boolean;
};

export type SupabaseReadonlyProbeConfig = {
  hasUrl: boolean;
  hasAnonKey: boolean;
  hasRequiredEnv: boolean;
  urlLooksValid: boolean;
  anonKeyLooksUsable: boolean;
  serviceRoleLikeKeyDetected: boolean;
};

export type SupabaseReadonlyProbePlan = {
  milestone: 'M43';
  status: SupabaseReadonlyProbeOverallStatus;
  statusLabel: string;
  statusTone: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  connectionStatus: string;
  configSafetyStatus: string;
  config: SupabaseReadonlyProbeConfig;
  flags: SupabaseReadonlyProbeFlags;
  clientCreated: boolean;
  networkEnabled: boolean;
  allowedByGuards: boolean;
  tables: SupabaseReadonlyProbeTable[];
  noWriteGuarantees: string[];
  blockers: string[];
  warnings: string[];
  nextSteps: string[];
};

export type SupabaseReadonlyProbeTableResult = {
  table: SupabaseReadonlyProbeTableName;
  label: string;
  status: SupabaseReadonlyProbeTableStatus;
  statusLabel: string;
  message: string;
  rowsReturned: number | null;
  errorCode?: string;
  safeErrorMessage?: string;
};

export type SupabaseReadonlyProbeResult = SupabaseReadonlyProbePlan & {
  attempted: boolean;
  completedAt: string | null;
  tableResults: SupabaseReadonlyProbeTableResult[];
  tablesChecked: SupabaseReadonlyProbeTableName[];
  totalRowsReturned: number;
};
