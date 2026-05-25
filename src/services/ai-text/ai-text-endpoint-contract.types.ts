import type {
  AITextBlockedAction,
  AITextLockedOutputSnapshot,
  AITextMode,
  AITextProxyMode,
  AITextRequestType,
} from '@/services/ai-text/ai-text-proxy.types';

export type AITextEndpointBlockedReasonId =
  | 'default_network_disabled'
  | 'endpoint_url_missing'
  | 'endpoint_url_alone_not_enough'
  | 'endpoint_dry_run_disabled'
  | 'endpoint_network_disabled'
  | 'ai_text_mode_not_ready'
  | 'real_ai_flag_disabled'
  | 'ai_text_network_flag_disabled'
  | 'production_disabled'
  | 'provider_key_frontend_blocked'
  | 'service_role_frontend_blocked'
  | 'unsafe_request_blocked'
  | 'backend_endpoint_not_deployed'
  | 'm82_provider_call_blocked';

export type AITextEndpointBlockedReason = {
  id: AITextEndpointBlockedReasonId;
  label: string;
  reason: string;
  blocksProvider: true;
};

export type AITextEndpointAuthContext = {
  authRequired: true;
  authStatus: 'staging_session_required' | 'not_ready';
  userIdMasked?: string;
  frontendServiceRoleBlocked: true;
  frontendProviderKeyBlocked: true;
};

export type AITextEndpointRequest = {
  id: string;
  endpointName: 'ai-text-proxy';
  requestType: AITextRequestType;
  prompt: string;
  contextSummary: string;
  requestedActions: string[];
  sourceRoute: string;
  policyVersion: string;
  lockedOutputSnapshot?: AITextLockedOutputSnapshot;
  authContext: AITextEndpointAuthContext;
  dryRun: true;
  noProviderKeyInFrontend: true;
  noServiceRoleKeyInFrontend: true;
};

export type AITextEndpointPolicyCheck = {
  allowed: boolean;
  policyVersion: string;
  blockedActions: AITextBlockedAction[];
  blockedReasons: AITextEndpointBlockedReason[];
  allowedRequestType: boolean;
  immutableCalculatorOutput: true;
  noExactPrescription: true;
  noSponsorProduct: true;
  noGuaranteedOutcome: true;
};

export type AITextEndpointAuditEvent = {
  id: string;
  eventType:
    | 'request_received'
    | 'auth_checked'
    | 'policy_checked'
    | 'rate_limit_checked'
    | 'provider_skipped'
    | 'timeout_planned'
    | 'blocked_action_recorded';
  label: string;
  wouldWriteSupabase: false;
  noSupabaseWrite: true;
};

export type AITextEndpointRateLimitCheck = {
  scope: 'staging_user_or_device';
  dailyLimit: number;
  cooldownSeconds: number;
  wouldWriteSupabase: false;
  noSupabaseWrite: true;
  requiredBeforeProvider: true;
};

export type AITextEndpointTimeoutPlan = {
  requestTimeoutMs: number;
  providerTimeoutMs: number;
  safeFallbackText: string;
  returnsFixtureOnTimeout: true;
  providerCallSkippedInM82: true;
  canMutateCalculatorOutput: false;
};

export type AITextEndpointFailureMode = {
  id:
    | 'endpoint_disabled'
    | 'timeout'
    | 'provider_unavailable'
    | 'unsafe_request'
    | 'audit_unavailable'
    | 'rate_limit_unavailable';
  label: string;
  safeFallback: string;
  providerCalled: false;
};

export type AITextEndpointResponseStatus = 'dry_run_blocked' | 'policy_blocked' | 'safe_fallback';

export type AITextEndpointResponse = {
  id: string;
  requestId: string;
  endpointName: 'ai-text-proxy';
  status: AITextEndpointResponseStatus;
  requestType: AITextRequestType;
  text?: string;
  policyCheck: AITextEndpointPolicyCheck;
  auditEvents: AITextEndpointAuditEvent[];
  rateLimitCheck: AITextEndpointRateLimitCheck;
  timeoutPlan: AITextEndpointTimeoutPlan;
  failureModes: AITextEndpointFailureMode[];
  blockedReasons: AITextEndpointBlockedReason[];
  lockedOutputSnapshot?: AITextLockedOutputSnapshot;
  immutableOutputPreserved: true;
  providerCalled: false;
  networkAttempted: false;
  noDirectProviderCall: true;
  noSupabaseWrite: true;
};

export type AITextEndpointEnv = {
  enableRealAIText?: boolean;
  aiTextMode?: string;
  aiTextProxyMode?: string;
  enableAITextNetwork?: boolean;
  aiTextEndpointUrl?: string;
  enableAITextEndpointDryRun?: boolean;
  enableAITextEndpointNetwork?: boolean;
  frontendConfig?: Record<string, unknown>;
};

export type AITextEndpointDryRunStatus = {
  mode: AITextMode;
  proxyMode: AITextProxyMode;
  endpointUrlPresent: boolean;
  endpointUrlMasked: string;
  dryRunEnabled: boolean;
  endpointNetworkEnabled: boolean;
  realAIEnabled: boolean;
  aiTextNetworkEnabled: boolean;
  canCallEndpoint: false;
  fetchWouldRun: false;
  providerWouldRun: false;
  productionBlocked: boolean;
  noProviderKeyInFrontend: true;
  noServiceRoleKeyInFrontend: true;
  noSupabaseWrite: true;
  blockers: AITextEndpointBlockedReason[];
};

export type AITextEndpointDryRunPlan = AITextEndpointDryRunStatus & {
  requestPreview: AITextEndpointRequest;
  responsePreview: AITextEndpointResponse;
  auditEvents: AITextEndpointAuditEvent[];
  rateLimitCheck: AITextEndpointRateLimitCheck;
  timeoutPlan: AITextEndpointTimeoutPlan;
  failureModes: AITextEndpointFailureMode[];
  blockedActions: AITextBlockedAction[];
  defaultNoNetworkProof: true;
};
