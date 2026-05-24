import type { CalculatorAIAdapterMode } from '@/services/agri-calculators/calculator-ai-adapter.types';

export type CalculatorAIEdgeDryRunMode =
  | 'default_disabled'
  | 'endpoint_missing'
  | 'endpoint_configured_flags_missing'
  | 'dry_run_flag_only'
  | 'network_flag_only'
  | 'staging_flags_ready_no_fetch'
  | 'production_blocked';

export type CalculatorAIEdgeDryRunReadiness =
  | 'blocked_by_default'
  | 'blocked_missing_endpoint'
  | 'blocked_missing_dry_run_flag'
  | 'blocked_missing_network_flag'
  | 'ready_for_local_dry_run_review'
  | 'blocked_for_production';

export type CalculatorAIEdgeDryRunValidationStatus =
  | 'would_pass'
  | 'blocked_missing_snapshot'
  | 'blocked_lock_hash_mismatch'
  | 'blocked_policy_mismatch'
  | 'blocked_oversized_payload'
  | 'blocked_sponsor_injection'
  | 'blocked_chemical_recommendation'
  | 'blocked_auth_required'
  | 'timeout_fallback_planned';

export type CalculatorAIEdgeDryRunValidationCase = {
  id: string;
  label: string;
  scenario: string;
  expectedStatus: CalculatorAIEdgeDryRunValidationStatus;
  actualStatus: CalculatorAIEdgeDryRunValidationStatus;
  severity: 'info' | 'warning' | 'danger';
  passed: boolean;
  noFetch: true;
};

export type CalculatorAIEdgeDryRunAuditPreview = {
  wouldWriteSupabase: false;
  events: Array<{
    eventType: string;
    futureTable: string;
    dryRunOnly: true;
  }>;
};

export type CalculatorAIEdgeDryRunRateLimitPreview = {
  dailyLimit: number;
  repeatedRequestWindowMinutes: number;
  repeatedRequestMaxCount: number;
  wouldEnforceNow: false;
  dryRunOnly: true;
};

export type CalculatorAIEdgeDryRunSecretChecklist = {
  id: string;
  label: string;
  requiredState: string;
  currentState: string;
  passed: boolean;
  severity: 'success' | 'warning' | 'danger';
};

export type CalculatorAIEdgeDryRunProductionBlocker = {
  id: string;
  label: string;
  detail: string;
  blocksProduction: true;
};

export type CalculatorAIEdgeDryRunEnv = {
  calculatorAIEdgeUrl: string;
  enableCalculatorAIEdgeDryRun: boolean;
  enableCalculatorAIEdgeNetwork: boolean;
  calculatorAIMode: string;
  enableCalculatorAIBackend: boolean;
  enableCalculatorAINetwork: boolean;
  isProd: boolean;
};

export type CalculatorAIEdgeDryRunPlan = {
  mode: CalculatorAIEdgeDryRunMode;
  readiness: CalculatorAIEdgeDryRunReadiness;
  readinessLabel: string;
  endpointUrlConfigured: boolean;
  endpointUrlMasked: string;
  dryRunFlagEnabled: boolean;
  edgeNetworkFlagEnabled: boolean;
  adapterMode: CalculatorAIAdapterMode;
  adapterBackendEnabled: boolean;
  adapterNetworkEnabled: boolean;
  authReady: false;
  frontendProviderKeyAccepted: false;
  frontendServiceRoleAccepted: false;
  canCallEndpoint: false;
  fetchWouldRun: false;
  noRealEndpointCall: true;
  noSupabaseWrite: true;
  noProductionBehavior: true;
  secretChecklist: CalculatorAIEdgeDryRunSecretChecklist[];
  validationCases: CalculatorAIEdgeDryRunValidationCase[];
  auditPreview: CalculatorAIEdgeDryRunAuditPreview;
  rateLimitPreview: CalculatorAIEdgeDryRunRateLimitPreview;
  productionBlockers: CalculatorAIEdgeDryRunProductionBlocker[];
};
