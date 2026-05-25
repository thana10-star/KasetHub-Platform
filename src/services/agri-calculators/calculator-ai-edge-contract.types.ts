import type { AppRoute } from '@/types/kaset';
import type {
  CalculatorAIExecutionRequest,
  CalculatorAIExecutionSnapshot,
} from '@/services/agri-calculators/calculator-ai-backend.types';
import type { CalculatorAIExplanationBlockedAction } from '@/services/agri-calculators/calculator-ai-explanation.types';

export type CalculatorAIEdgeResponseStatus =
  | 'design_stub_ready'
  | 'blocked_before_provider'
  | 'network_disabled'
  | 'timeout_planned'
  | 'error_planned';

export type CalculatorAIEdgeAuthContext = {
  authRequiredBeforeLive: true;
  authMode: 'staging_required' | 'anonymous_preview_only';
  userId?: string;
  sessionHash?: string;
  serviceRoleKeyLocation: 'edge_secret_store_only';
  providerKeyLocation: 'edge_secret_store_only';
  frontendProviderKeysAllowed: false;
  frontendServiceRoleAllowed: false;
};

export type CalculatorAIEdgePolicyCheck = {
  policyVersionId: string;
  promptTemplateVersionId: string;
  expectedPolicyVersionId?: string;
  status: 'matched' | 'mismatch_blocked' | 'review_required';
  bannedCategories: string[];
  blockedActionIds: CalculatorAIExplanationBlockedAction[];
  sponsorSeparated: true;
};

export type CalculatorAIEdgeAuditEvent = {
  eventType:
    | 'request_received'
    | 'snapshot_lock_verified'
    | 'policy_checked'
    | 'rate_limit_checked'
    | 'provider_skipped'
    | 'safety_filtered'
    | 'response_returned';
  wouldWriteSupabase: false;
  futureTable:
    | 'calculator_ai_request_logs'
    | 'calculator_ai_snapshot_locks'
    | 'calculator_ai_policy_checks'
    | 'calculator_ai_audit_logs'
    | 'calculator_ai_backend_events';
  fields: string[];
};

export type CalculatorAIEdgeRateLimitCheck = {
  dailyLimit: number;
  repeatedRequestWindowMinutes: number;
  repeatedRequestMaxCount: number;
  status: 'planned_not_enforced' | 'would_allow' | 'would_block';
  unlockBoundary: 'rewarded_ads_future_only';
};

export type CalculatorAIEdgeTimeoutPlan = {
  requestTimeoutMs: number;
  providerTimeoutMs: number;
  retryCount: number;
  fallbackStatus: 'return_safe_disabled_message';
  deterministicResultMutableOnTimeout: false;
};

export type CalculatorAIEdgeFailureMode = {
  id: string;
  label: string;
  trigger: string;
  responseStatus: CalculatorAIEdgeResponseStatus;
  userCopy: string;
  retryable: boolean;
};

export type CalculatorAIEdgeRequest = {
  endpointName: 'calculator-ai-explain';
  method: 'POST';
  requestId: string;
  sourceRoute: AppRoute;
  executionRequest: CalculatorAIExecutionRequest;
  lockedSnapshot: CalculatorAIExecutionSnapshot;
  expectedLockedResultHash: string;
  expectedPolicyVersionId: string;
  authContext: CalculatorAIEdgeAuthContext;
  maxPayloadChars: number;
  noProviderKeyInPayload: true;
  noServiceRoleKeyInPayload: true;
  noSponsorPayload: true;
};

export type CalculatorAIEdgeResponse = {
  endpointName: 'calculator-ai-explain';
  status: CalculatorAIEdgeResponseStatus;
  explanationText?: string;
  disabledReason?: string;
  lockedResultHash: string;
  lockedResultValues: readonly string[];
  policyCheck: CalculatorAIEdgePolicyCheck;
  rateLimitCheck: CalculatorAIEdgeRateLimitCheck;
  timeoutPlan: CalculatorAIEdgeTimeoutPlan;
  auditEvents: CalculatorAIEdgeAuditEvent[];
  failureModes: CalculatorAIEdgeFailureMode[];
  safetyDisclaimers: string[];
  providerCallPlanned: false;
  providerCallAttempted: false;
  networkCallAttempted: false;
  supabaseWriteAttempted: false;
  deterministicResultUnchanged: true;
  frontendMayHoldProviderKey: false;
  noRealAICall: true;
  createdAt: string;
};
