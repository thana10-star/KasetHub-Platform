import {
  buildCalculatorAIBackendArchitectureReview,
  calculatorAIRateLimitPlan,
} from '@/services/agri-calculators/calculator-ai-backend-review';
import type { CalculatorAIAdapterRequest } from '@/services/agri-calculators/calculator-ai-adapter.types';
import type {
  CalculatorAIEdgeAuditEvent,
  CalculatorAIEdgeAuthContext,
  CalculatorAIEdgeFailureMode,
  CalculatorAIEdgePolicyCheck,
  CalculatorAIEdgeRateLimitCheck,
  CalculatorAIEdgeRequest,
  CalculatorAIEdgeResponse,
  CalculatorAIEdgeTimeoutPlan,
} from '@/services/agri-calculators/calculator-ai-edge-contract.types';
import { getLocalCalculatorAIDisclaimers } from '@/services/agri-calculators/calculator-ai-local-fixtures';

export const CALCULATOR_AI_EDGE_FUNCTION_NAME = 'calculator-ai-explain';

export const calculatorAIEdgeContractSecurityRules = [
  'provider key ต้องอยู่ใน Edge Function secret store เท่านั้น',
  'service-role key ต้องอยู่ใน Edge Function secret store เท่านั้น',
  'frontend ส่งได้เฉพาะ locked snapshot, policy id, source route และคำถามที่ผ่าน validation',
  'Edge Function ต้องตรวจ lock hash และ policy version ก่อน prompt builder',
  'AI provider response ต้องผ่าน safety filter ก่อนแสดงผล',
  'ห้ามแทรก sponsor, affiliate, product placement หรือคำแนะนำแฝงในคำอธิบาย',
];

export const calculatorAIEdgeFailureModes: CalculatorAIEdgeFailureMode[] = [
  {
    id: 'network_disabled_by_default',
    label: 'Network disabled by default',
    trigger: 'VITE_ENABLE_CALCULATOR_AI_NETWORK ไม่ได้เปิดใน milestone ที่ review แล้ว',
    responseStatus: 'network_disabled',
    userCopy: 'ยังไม่เปิดการอธิบายผลด้วย AI จริง ใช้สรุปผลคำนวณเดิมได้ตามปกติ',
    retryable: false,
  },
  {
    id: 'lock_hash_mismatch',
    label: 'Lock hash mismatch',
    trigger: 'expectedLockedResultHash ไม่ตรงกับ snapshot lock hash',
    responseStatus: 'blocked_before_provider',
    userCopy: 'ผลคำนวณไม่ตรงกับ snapshot ที่ล็อกไว้ จึงไม่ส่งต่อให้ AI',
    retryable: false,
  },
  {
    id: 'policy_version_mismatch',
    label: 'Policy version mismatch',
    trigger: 'expectedPolicyVersionId ไม่ตรงกับ policy ที่ backend เลือก',
    responseStatus: 'blocked_before_provider',
    userCopy: 'นโยบายความปลอดภัยไม่ตรงกัน จึงหยุดก่อนสร้าง prompt',
    retryable: false,
  },
  {
    id: 'provider_timeout',
    label: 'Provider timeout',
    trigger: 'provider ใช้เวลานานเกิน providerTimeoutMs',
    responseStatus: 'timeout_planned',
    userCopy: 'ระบบอธิบายผลใช้เวลานานเกินไป ผลคำนวณเดิมยังไม่เปลี่ยน',
    retryable: true,
  },
  {
    id: 'safety_filter_blocked',
    label: 'Safety filter blocked',
    trigger: 'คำตอบ AI มี sponsor, product, label override หรือ formula mutation',
    responseStatus: 'blocked_before_provider',
    userCopy: 'คำอธิบายนี้ไม่ผ่านตัวกรองความปลอดภัย จึงไม่แสดงผล',
    retryable: false,
  },
];

export const calculatorAIEdgeTimeoutPlan: CalculatorAIEdgeTimeoutPlan = {
  requestTimeoutMs: 12_000,
  providerTimeoutMs: 8_000,
  retryCount: 0,
  fallbackStatus: 'return_safe_disabled_message',
  deterministicResultMutableOnTimeout: false,
};

function buildAuthContext(): CalculatorAIEdgeAuthContext {
  return {
    authRequiredBeforeLive: true,
    authMode: 'anonymous_preview_only',
    sessionHash: 'local-preview-session-hash',
    serviceRoleKeyLocation: 'edge_secret_store_only',
    providerKeyLocation: 'edge_secret_store_only',
    frontendProviderKeysAllowed: false,
    frontendServiceRoleAllowed: false,
  };
}

function buildPolicyCheck(request: CalculatorAIAdapterRequest): CalculatorAIEdgePolicyCheck {
  const review = buildCalculatorAIBackendArchitectureReview(request);

  return {
    policyVersionId: review.policyVersion.id,
    promptTemplateVersionId: review.policyVersion.promptTemplateVersionId,
    expectedPolicyVersionId: request.expectedPolicyVersionId,
    status:
      request.expectedPolicyVersionId && request.expectedPolicyVersionId !== review.policyVersion.id
        ? 'mismatch_blocked'
        : review.policyVersion.status === 'active' || review.policyVersion.status === 'review_ready'
          ? 'matched'
          : 'review_required',
    bannedCategories: review.safetyDecision.bannedCategoryMatches,
    blockedActionIds: review.safetyDecision.blockedActionIds,
    sponsorSeparated: true,
  };
}

function buildRateLimitCheck(): CalculatorAIEdgeRateLimitCheck {
  return {
    dailyLimit: calculatorAIRateLimitPlan.dailyExplanationLimit,
    repeatedRequestWindowMinutes: calculatorAIRateLimitPlan.repeatedRequestWindowMinutes,
    repeatedRequestMaxCount: calculatorAIRateLimitPlan.repeatedRequestMaxCount,
    status: 'planned_not_enforced',
    unlockBoundary: 'rewarded_ads_future_only',
  };
}

function buildAuditEvents(): CalculatorAIEdgeAuditEvent[] {
  return [
    {
      eventType: 'request_received',
      wouldWriteSupabase: false,
      futureTable: 'calculator_ai_request_logs',
      fields: ['request_id', 'calculator_category', 'source_route', 'created_at'],
    },
    {
      eventType: 'snapshot_lock_verified',
      wouldWriteSupabase: false,
      futureTable: 'calculator_ai_snapshot_locks',
      fields: ['snapshot_id', 'snapshot_lock_hash', 'calculator_category'],
    },
    {
      eventType: 'policy_checked',
      wouldWriteSupabase: false,
      futureTable: 'calculator_ai_policy_checks',
      fields: ['policy_version_id', 'prompt_template_version_id', 'check_status'],
    },
    {
      eventType: 'rate_limit_checked',
      wouldWriteSupabase: false,
      futureTable: 'calculator_ai_backend_events',
      fields: ['session_hash', 'period_start', 'request_status'],
    },
    {
      eventType: 'provider_skipped',
      wouldWriteSupabase: false,
      futureTable: 'calculator_ai_backend_events',
      fields: ['provider_call_attempted', 'network_call_attempted'],
    },
    {
      eventType: 'safety_filtered',
      wouldWriteSupabase: false,
      futureTable: 'calculator_ai_audit_logs',
      fields: ['safety_decision', 'blocked_action_ids', 'risk_level'],
    },
  ];
}

export function buildCalculatorAIEdgeRequest(request: CalculatorAIAdapterRequest): CalculatorAIEdgeRequest {
  const review = buildCalculatorAIBackendArchitectureReview(request);

  return {
    endpointName: CALCULATOR_AI_EDGE_FUNCTION_NAME,
    method: 'POST',
    requestId: `edge-contract:${review.requestId}`,
    sourceRoute: request.sourceRoute,
    executionRequest: request,
    lockedSnapshot: review.snapshot,
    expectedLockedResultHash: request.expectedLockedResultHash ?? review.snapshot.lockHash,
    expectedPolicyVersionId: request.expectedPolicyVersionId ?? review.policyVersion.id,
    authContext: buildAuthContext(),
    maxPayloadChars: calculatorAIRateLimitPlan.maxPromptPayloadChars,
    noProviderKeyInPayload: true,
    noServiceRoleKeyInPayload: true,
    noSponsorPayload: true,
  };
}

export function buildCalculatorAIEdgeResponseContract(
  request: CalculatorAIAdapterRequest,
  createdAt = '2026-05-24T10:00:00.000Z',
): CalculatorAIEdgeResponse {
  const review = buildCalculatorAIBackendArchitectureReview(request);
  const edgeRequest = buildCalculatorAIEdgeRequest(request);
  const policyCheck = buildPolicyCheck(request);
  const lockMismatch = edgeRequest.expectedLockedResultHash !== review.snapshot.lockHash;
  const policyMismatch = policyCheck.status === 'mismatch_blocked';
  const safetyBlocked = review.safetyDecision.status === 'rejected_before_ai';
  const blockedReasons = [
    ...(lockMismatch ? ['locked hash mismatch'] : []),
    ...(policyMismatch ? ['policy version mismatch'] : []),
    ...review.safetyDecision.reasons,
  ];

  return {
    endpointName: CALCULATOR_AI_EDGE_FUNCTION_NAME,
    status: lockMismatch || policyMismatch || safetyBlocked ? 'blocked_before_provider' : 'design_stub_ready',
    disabledReason:
      lockMismatch || policyMismatch || safetyBlocked
        ? `หยุดก่อนเรียก provider: ${blockedReasons.join(', ')}`
        : 'M59 เป็น Edge Function design stub เท่านั้น ยังไม่เรียก provider และยังไม่เขียน Supabase',
    lockedResultHash: review.snapshot.lockHash,
    lockedResultValues: review.snapshot.resultValues,
    policyCheck,
    rateLimitCheck: buildRateLimitCheck(),
    timeoutPlan: calculatorAIEdgeTimeoutPlan,
    auditEvents: buildAuditEvents(),
    failureModes: calculatorAIEdgeFailureModes,
    safetyDisclaimers: getLocalCalculatorAIDisclaimers(review),
    providerCallPlanned: false,
    providerCallAttempted: false,
    networkCallAttempted: false,
    supabaseWriteAttempted: false,
    deterministicResultUnchanged: true,
    frontendMayHoldProviderKey: false,
    noRealAICall: true,
    createdAt,
  };
}

export function getCalculatorAIEdgeFunctionContractSummary(request: CalculatorAIAdapterRequest) {
  const edgeRequest = buildCalculatorAIEdgeRequest(request);
  const edgeResponse = buildCalculatorAIEdgeResponseContract(request);

  return {
    endpointName: CALCULATOR_AI_EDGE_FUNCTION_NAME,
    method: edgeRequest.method,
    requestPayloadReady: true,
    responsePayloadReady: true,
    deployed: false,
    providerKeysInFrontend: false,
    serviceRoleKeyInFrontend: false,
    networkEnabledByDefault: false,
    supabaseWritesEnabled: false,
    providerCallAttempted: edgeResponse.providerCallAttempted,
    networkCallAttempted: edgeResponse.networkCallAttempted,
    lockedResultHash: edgeResponse.lockedResultHash,
    policyStatus: edgeResponse.policyCheck.status,
    auditEventCount: edgeResponse.auditEvents.length,
    failureModeCount: edgeResponse.failureModes.length,
  };
}
