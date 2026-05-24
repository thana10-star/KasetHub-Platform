import { publicEnv } from '@/config/env';
import {
  buildAITextAuditPreview,
  buildAITextRateLimitPreview,
} from '@/services/ai-text/ai-text-audit-preview';
import { aiTextCalculatorFixtureRequest } from '@/services/ai-text/ai-text-fixtures';
import {
  AI_TEXT_POLICY_VERSION,
  aiTextAllowedRequestTypes,
  aiTextBlockedActions,
  detectAITextBlockedActions,
  isAITextRequestTypeAllowed,
} from '@/services/ai-text/ai-text-policy';
import {
  findFrontendAITextSecretKeys,
  isFrontendAITextSecretKeyAllowed,
} from '@/services/ai-text/ai-text-proxy';
import type {
  AITextEndpointAuditEvent,
  AITextEndpointBlockedReason,
  AITextEndpointDryRunStatus,
  AITextEndpointEnv,
  AITextEndpointFailureMode,
  AITextEndpointPolicyCheck,
  AITextEndpointRateLimitCheck,
  AITextEndpointRequest,
  AITextEndpointResponse,
  AITextEndpointTimeoutPlan,
} from '@/services/ai-text/ai-text-endpoint-contract.types';
import type {
  AITextMode,
  AITextProxyMode,
  AITextRequest,
} from '@/services/ai-text/ai-text-proxy.types';

const aiTextModes: AITextMode[] = [
  'local_fixture',
  'staging_proxy_disabled',
  'staging_proxy_ready',
  'production_disabled',
];

const aiTextProxyModes: AITextProxyMode[] = ['staging_proxy'];

const blockedReasonCopy: Record<AITextEndpointBlockedReason['id'], Omit<AITextEndpointBlockedReason, 'id'>> = {
  default_network_disabled: {
    label: 'Default network disabled',
    reason: 'ค่าเริ่มต้นยังไม่อนุญาตให้ frontend เรียก endpoint หรือ provider',
    blocksProvider: true,
  },
  endpoint_url_missing: {
    label: 'Endpoint URL missing',
    reason: 'ยังไม่มี staging proxy URL สำหรับ ai-text-proxy',
    blocksProvider: true,
  },
  endpoint_url_alone_not_enough: {
    label: 'Endpoint URL alone is not enough',
    reason: 'มี URL อย่างเดียวไม่พอ ต้องมี dry-run/network flags และยังต้องผ่าน review เพิ่ม',
    blocksProvider: true,
  },
  endpoint_dry_run_disabled: {
    label: 'Endpoint dry-run disabled',
    reason: 'VITE_ENABLE_AI_TEXT_ENDPOINT_DRY_RUN ยังปิดอยู่',
    blocksProvider: true,
  },
  endpoint_network_disabled: {
    label: 'Endpoint network disabled',
    reason: 'VITE_ENABLE_AI_TEXT_ENDPOINT_NETWORK ยังปิดอยู่',
    blocksProvider: true,
  },
  ai_text_mode_not_ready: {
    label: 'AI text mode not ready',
    reason: 'ต้องเป็น staging_proxy_ready เท่านั้นจึงจะเข้าสู่ dry-run readiness ได้',
    blocksProvider: true,
  },
  real_ai_flag_disabled: {
    label: 'Real AI flag disabled',
    reason: 'VITE_ENABLE_REAL_AI_TEXT ยังปิดอยู่',
    blocksProvider: true,
  },
  ai_text_network_flag_disabled: {
    label: 'AI text network flag disabled',
    reason: 'VITE_ENABLE_AI_TEXT_NETWORK ยังปิดอยู่',
    blocksProvider: true,
  },
  production_disabled: {
    label: 'Production disabled',
    reason: 'production_disabled ปิดทุกเส้นทาง AI text endpoint',
    blocksProvider: true,
  },
  provider_key_frontend_blocked: {
    label: 'Provider key blocked from frontend',
    reason: 'provider key ต้องอยู่ backend/Edge secret store เท่านั้น',
    blocksProvider: true,
  },
  service_role_frontend_blocked: {
    label: 'Service-role key blocked from frontend',
    reason: 'service-role key ห้ามอยู่ใน Vite/frontend env',
    blocksProvider: true,
  },
  unsafe_request_blocked: {
    label: 'Unsafe request blocked',
    reason: 'คำขอมีหมวดที่ถูกบล็อก เช่น prescription, guarantee, sponsor หรือ diagnosis',
    blocksProvider: true,
  },
  backend_endpoint_not_deployed: {
    label: 'Backend endpoint not deployed',
    reason: 'M82 เป็น contract/dry-run เท่านั้น ยังไม่มี deployed Edge Function',
    blocksProvider: true,
  },
  m82_provider_call_blocked: {
    label: 'Provider call blocked in M82',
    reason: 'M82 พิสูจน์ dry-run และ contract โดยไม่เรียก provider จริง',
    blocksProvider: true,
  },
};

function blockedReason(id: AITextEndpointBlockedReason['id']): AITextEndpointBlockedReason {
  return { id, ...blockedReasonCopy[id] };
}

function normalizeAITextMode(mode?: string): AITextMode {
  return aiTextModes.includes(mode as AITextMode) ? (mode as AITextMode) : 'local_fixture';
}

function normalizeAITextProxyMode(mode?: string): AITextProxyMode {
  return aiTextProxyModes.includes(mode as AITextProxyMode) ? (mode as AITextProxyMode) : 'staging_proxy';
}

export function resolveAITextEndpointEnv(overrides?: AITextEndpointEnv) {
  return {
    enableRealAIText: overrides?.enableRealAIText ?? publicEnv.enableRealAIText,
    aiTextMode: normalizeAITextMode(overrides?.aiTextMode ?? publicEnv.aiTextMode),
    aiTextProxyMode: normalizeAITextProxyMode(overrides?.aiTextProxyMode ?? publicEnv.aiTextProxyMode),
    enableAITextNetwork: overrides?.enableAITextNetwork ?? publicEnv.enableAITextNetwork,
    aiTextEndpointUrl: (overrides?.aiTextEndpointUrl ?? publicEnv.aiTextEndpointUrl).trim(),
    enableAITextEndpointDryRun:
      overrides?.enableAITextEndpointDryRun ?? publicEnv.enableAITextEndpointDryRun,
    enableAITextEndpointNetwork:
      overrides?.enableAITextEndpointNetwork ?? publicEnv.enableAITextEndpointNetwork,
    frontendConfig: overrides?.frontendConfig ?? {},
  };
}

export function maskAITextEndpointUrl(url?: string): string {
  const trimmed = url?.trim();

  if (!trimmed) {
    return 'not_configured';
  }

  try {
    const parsed = new URL(trimmed);
    const pathHint = parsed.pathname.split('/').filter(Boolean).slice(-1)[0] ?? 'endpoint';
    return `${parsed.protocol}//${parsed.hostname.slice(0, 3)}.../${pathHint}`;
  } catch {
    return 'configured_masked';
  }
}

export function isFrontendAITextEndpointSecretKeyAllowed(key: string): boolean {
  return isFrontendAITextSecretKeyAllowed(key);
}

export function findFrontendAITextEndpointSecretKeys(config: Record<string, unknown>): string[] {
  return findFrontendAITextSecretKeys(config);
}

export function buildAITextEndpointRequest(request: AITextRequest): AITextEndpointRequest {
  return {
    id: `endpoint-${request.id}`,
    endpointName: 'ai-text-proxy',
    requestType: request.requestType,
    prompt: request.prompt,
    contextSummary: request.contextSummary,
    requestedActions: [...request.requestedActions],
    sourceRoute: request.sourceRoute ?? '/app/ai-text-status',
    policyVersion: AI_TEXT_POLICY_VERSION,
    lockedOutputSnapshot: request.lockedOutputSnapshot,
    authContext: {
      authRequired: true,
      authStatus: 'staging_session_required',
      frontendProviderKeyBlocked: true,
      frontendServiceRoleBlocked: true,
    },
    dryRun: true,
    noProviderKeyInFrontend: true,
    noServiceRoleKeyInFrontend: true,
  };
}

export function buildAITextEndpointPolicyCheck(
  request: AITextRequest,
  blockers: AITextEndpointBlockedReason[] = [],
): AITextEndpointPolicyCheck {
  const blockedActions = detectAITextBlockedActions(request);
  const policyBlockers = blockedActions.length > 0 ? [blockedReason('unsafe_request_blocked')] : [];

  return {
    allowed: blockedActions.length === 0 && blockers.length === 0,
    policyVersion: AI_TEXT_POLICY_VERSION,
    blockedActions,
    blockedReasons: [...policyBlockers, ...blockers],
    allowedRequestType: isAITextRequestTypeAllowed(request.requestType),
    immutableCalculatorOutput: true,
    noExactPrescription: true,
    noSponsorProduct: true,
    noGuaranteedOutcome: true,
  };
}

export function buildAITextEndpointAuditEvents(request: Pick<AITextRequest, 'id' | 'requestType'>): AITextEndpointAuditEvent[] {
  const auditPreview = buildAITextAuditPreview(request);

  return [
    {
      id: `${request.id}-request-received`,
      eventType: 'request_received',
      label: auditPreview.events[0] ?? 'request_received',
      wouldWriteSupabase: false,
      noSupabaseWrite: true,
    },
    {
      id: `${request.id}-auth-checked`,
      eventType: 'auth_checked',
      label: 'staging auth context previewed',
      wouldWriteSupabase: false,
      noSupabaseWrite: true,
    },
    {
      id: `${request.id}-policy-checked`,
      eventType: 'policy_checked',
      label: `policy checked: ${AI_TEXT_POLICY_VERSION}`,
      wouldWriteSupabase: false,
      noSupabaseWrite: true,
    },
    {
      id: `${request.id}-rate-limit-checked`,
      eventType: 'rate_limit_checked',
      label: 'rate limit dry-run only',
      wouldWriteSupabase: false,
      noSupabaseWrite: true,
    },
    {
      id: `${request.id}-provider-skipped`,
      eventType: 'provider_skipped',
      label: 'provider call skipped in M82',
      wouldWriteSupabase: false,
      noSupabaseWrite: true,
    },
  ];
}

export function buildAITextEndpointRateLimitCheck(): AITextEndpointRateLimitCheck {
  const rateLimit = buildAITextRateLimitPreview();

  return {
    scope: rateLimit.scope,
    dailyLimit: rateLimit.dailyLimit,
    cooldownSeconds: rateLimit.cooldownSeconds,
    wouldWriteSupabase: false,
    noSupabaseWrite: true,
    requiredBeforeProvider: true,
  };
}

export function buildAITextEndpointTimeoutPlan(): AITextEndpointTimeoutPlan {
  return {
    requestTimeoutMs: 12_000,
    providerTimeoutMs: 8_000,
    safeFallbackText: 'ยังไม่เรียก provider จริง หาก timeout ให้กลับไปใช้คำอธิบายตัวอย่างที่ปลอดภัย',
    returnsFixtureOnTimeout: true,
    providerCallSkippedInM82: true,
    canMutateCalculatorOutput: false,
  };
}

export function getAITextEndpointFailureModes(): AITextEndpointFailureMode[] {
  return [
    {
      id: 'endpoint_disabled',
      label: 'Endpoint disabled',
      safeFallback: 'ใช้ local fixture หรือ controlled disabled response',
      providerCalled: false,
    },
    {
      id: 'timeout',
      label: 'Timeout',
      safeFallback: 'คืน safe fallback โดยไม่แก้ผลคำนวณ',
      providerCalled: false,
    },
    {
      id: 'provider_unavailable',
      label: 'Provider unavailable',
      safeFallback: 'แสดงข้อความว่าข้อมูล AI ยังไม่พร้อมและให้ใช้ข้อมูลเดิม',
      providerCalled: false,
    },
    {
      id: 'unsafe_request',
      label: 'Unsafe request',
      safeFallback: 'บล็อกหมวดเสี่ยงและแสดงขอบเขตความปลอดภัย',
      providerCalled: false,
    },
    {
      id: 'audit_unavailable',
      label: 'Audit unavailable',
      safeFallback: 'บล็อก provider จนกว่า audit write พร้อม',
      providerCalled: false,
    },
    {
      id: 'rate_limit_unavailable',
      label: 'Rate limit unavailable',
      safeFallback: 'บล็อก provider จนกว่า rate limit พร้อม',
      providerCalled: false,
    },
  ];
}

export function getAITextEndpointDryRunStatus(env?: AITextEndpointEnv): AITextEndpointDryRunStatus {
  const resolved = resolveAITextEndpointEnv(env);
  const endpointUrlPresent = Boolean(resolved.aiTextEndpointUrl);
  const frontendSecrets = findFrontendAITextEndpointSecretKeys(resolved.frontendConfig);
  const blockers: AITextEndpointBlockedReason[] = [];

  if (!endpointUrlPresent) {
    blockers.push(blockedReason('endpoint_url_missing'));
  } else {
    blockers.push(blockedReason('endpoint_url_alone_not_enough'));
  }

  if (!resolved.enableAITextEndpointDryRun) {
    blockers.push(blockedReason('endpoint_dry_run_disabled'));
  }

  if (!resolved.enableAITextEndpointNetwork) {
    blockers.push(blockedReason('endpoint_network_disabled'));
  }

  if (!resolved.enableRealAIText) {
    blockers.push(blockedReason('real_ai_flag_disabled'));
  }

  if (!resolved.enableAITextNetwork) {
    blockers.push(blockedReason('ai_text_network_flag_disabled'));
  }

  if (resolved.aiTextMode !== 'staging_proxy_ready') {
    blockers.push(
      blockedReason(resolved.aiTextMode === 'production_disabled' ? 'production_disabled' : 'ai_text_mode_not_ready'),
    );
  }

  if (frontendSecrets.some((key) => /SERVICE_ROLE|SUPABASE_SERVICE/i.test(key))) {
    blockers.push(blockedReason('service_role_frontend_blocked'));
  }

  if (frontendSecrets.some((key) => !/SERVICE_ROLE|SUPABASE_SERVICE/i.test(key))) {
    blockers.push(blockedReason('provider_key_frontend_blocked'));
  }

  blockers.push(blockedReason('backend_endpoint_not_deployed'));
  blockers.push(blockedReason('m82_provider_call_blocked'));

  return {
    mode: resolved.aiTextMode,
    proxyMode: resolved.aiTextProxyMode,
    endpointUrlPresent,
    endpointUrlMasked: maskAITextEndpointUrl(resolved.aiTextEndpointUrl),
    dryRunEnabled: resolved.enableAITextEndpointDryRun,
    endpointNetworkEnabled: resolved.enableAITextEndpointNetwork,
    realAIEnabled: resolved.enableRealAIText,
    aiTextNetworkEnabled: resolved.enableAITextNetwork,
    canCallEndpoint: false,
    fetchWouldRun: false,
    providerWouldRun: false,
    productionBlocked: resolved.aiTextMode === 'production_disabled',
    noProviderKeyInFrontend: true,
    noServiceRoleKeyInFrontend: true,
    noSupabaseWrite: true,
    blockers,
  };
}

export function buildAITextEndpointResponse(
  request: AITextRequest,
  env?: AITextEndpointEnv,
): AITextEndpointResponse {
  const status = getAITextEndpointDryRunStatus(env);
  const policyCheck = buildAITextEndpointPolicyCheck(request, status.blockers);
  const auditEvents = buildAITextEndpointAuditEvents(request);
  const unsafeBlocked = policyCheck.blockedActions.length > 0;

  return {
    id: `ai-text-endpoint-response-${request.id}`,
    requestId: request.id,
    endpointName: 'ai-text-proxy',
    status: unsafeBlocked ? 'policy_blocked' : 'dry_run_blocked',
    requestType: request.requestType,
    text: unsafeBlocked
      ? 'คำขอนี้ถูกบล็อกตามนโยบายความปลอดภัย'
      : 'M82 เป็น dry-run contract เท่านั้น ยังไม่เรียก provider จริง',
    policyCheck,
    auditEvents,
    rateLimitCheck: buildAITextEndpointRateLimitCheck(),
    timeoutPlan: buildAITextEndpointTimeoutPlan(),
    failureModes: getAITextEndpointFailureModes(),
    blockedReasons: policyCheck.blockedReasons,
    lockedOutputSnapshot: request.lockedOutputSnapshot,
    immutableOutputPreserved: true,
    providerCalled: false,
    networkAttempted: false,
    noDirectProviderCall: true,
    noSupabaseWrite: true,
  };
}

export function getAITextEndpointContractSummary() {
  return {
    endpointName: 'ai-text-proxy' as const,
    policyVersion: AI_TEXT_POLICY_VERSION,
    allowedRequestTypes: aiTextAllowedRequestTypes,
    blockedActions: aiTextBlockedActions,
    authRequired: true,
    providerKeyBackendOnly: true,
    serviceRoleBackendOnly: true,
    immutableCalculatorOutput: true,
    noProviderCallInM82: true,
    timeoutPlan: buildAITextEndpointTimeoutPlan(),
    sampleRequest: buildAITextEndpointRequest(aiTextCalculatorFixtureRequest),
  };
}
