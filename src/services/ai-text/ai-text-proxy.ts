import { publicEnv } from '@/config/env';
import {
  buildAITextAuditPreview,
  buildAITextRateLimitPreview,
} from '@/services/ai-text/ai-text-audit-preview';
import { buildLocalAITextFixtureText } from '@/services/ai-text/ai-text-fixtures';
import {
  aiTextAllowedRequestTypes,
  aiTextBlockedActions,
  aiTextSafetyBoundary,
  detectAITextBlockedActions,
} from '@/services/ai-text/ai-text-policy';
import type {
  AITextFailureMode,
  AITextMode,
  AITextModeStatus,
  AITextProxyEnv,
  AITextProxyMode,
  AITextProxyStatus,
  AITextRequest,
  AITextResponse,
} from '@/services/ai-text/ai-text-proxy.types';

const aiTextModes: AITextMode[] = [
  'local_fixture',
  'staging_proxy_disabled',
  'staging_proxy_ready',
  'production_disabled',
];

const aiTextProxyModes: AITextProxyMode[] = ['staging_proxy'];

const frontendSecretKeyPatterns = [
  /AI.*KEY/i,
  /OPENAI/i,
  /GEMINI/i,
  /ANTHROPIC/i,
  /PROVIDER.*KEY/i,
  /SERVICE_ROLE/i,
  /SUPABASE_SERVICE/i,
];

export const aiTextFailureModes: AITextFailureMode[] = [
  {
    id: 'network-flags-off',
    label: 'Network flags off',
    reason: 'ค่าเริ่มต้นปิด VITE_ENABLE_REAL_AI_TEXT และ VITE_ENABLE_AI_TEXT_NETWORK',
    safeFallback: 'ใช้ local fixture',
  },
  {
    id: 'proxy-not-configured',
    label: 'Proxy endpoint not configured',
    reason: 'M81 ยังไม่มี backend endpoint URL สำหรับ frontend',
    safeFallback: 'คืน controlled disabled state',
  },
  {
    id: 'blocked-action',
    label: 'Blocked action',
    reason: 'คำขอมี sponsor/product, prescription, diagnosis, guarantee หรือคำแนะนำเสี่ยง',
    safeFallback: 'ปฏิเสธและแสดงขอบเขตความปลอดภัย',
  },
  {
    id: 'production-disabled',
    label: 'Production disabled',
    reason: 'M81 เป็น staging-only และ production AI ถูกปิด',
    safeFallback: 'ใช้ local fixture หรือ disabled response',
  },
];

function normalizeAITextMode(mode?: string): AITextMode {
  return aiTextModes.includes(mode as AITextMode) ? (mode as AITextMode) : 'local_fixture';
}

function normalizeAITextProxyMode(mode?: string): AITextProxyMode {
  return aiTextProxyModes.includes(mode as AITextProxyMode) ? (mode as AITextProxyMode) : 'staging_proxy';
}

function resolveAITextEnv(overrides?: AITextProxyEnv) {
  return {
    enableRealAIText: overrides?.enableRealAIText ?? publicEnv.enableRealAIText,
    aiTextMode: normalizeAITextMode(overrides?.aiTextMode ?? publicEnv.aiTextMode),
    aiTextProxyMode: normalizeAITextProxyMode(overrides?.aiTextProxyMode ?? publicEnv.aiTextProxyMode),
    enableAITextNetwork: overrides?.enableAITextNetwork ?? publicEnv.enableAITextNetwork,
    aiTextProxyEndpoint: overrides?.aiTextProxyEndpoint?.trim() ?? '',
  };
}

export function isFrontendAITextSecretKeyAllowed(key: string): boolean {
  return !frontendSecretKeyPatterns.some((pattern) => pattern.test(key));
}

export function findFrontendAITextSecretKeys(config: Record<string, unknown>): string[] {
  return Object.keys(config).filter((key) => !isFrontendAITextSecretKeyAllowed(key));
}

export function getAITextModeStatus(overrides?: AITextProxyEnv): AITextModeStatus {
  const env = resolveAITextEnv(overrides);
  const flagsReady =
    env.aiTextMode === 'staging_proxy_ready' &&
    env.aiTextProxyMode === 'staging_proxy' &&
    env.enableRealAIText &&
    env.enableAITextNetwork;
  const endpointReady = Boolean(env.aiTextProxyEndpoint);
  const canAttemptProxy = flagsReady;
  const canCallNetwork = flagsReady && endpointReady;
  const disabledReason =
    env.aiTextMode === 'local_fixture'
      ? 'ค่าเริ่มต้นใช้ local fixture และไม่เรียก network'
      : env.aiTextMode === 'staging_proxy_disabled'
        ? 'staging proxy ถูกปิดไว้'
        : env.aiTextMode === 'production_disabled'
          ? 'production AI ถูกปิดไว้'
          : !env.enableRealAIText
            ? 'ยังไม่เปิด VITE_ENABLE_REAL_AI_TEXT'
            : !env.enableAITextNetwork
              ? 'ยังไม่เปิด VITE_ENABLE_AI_TEXT_NETWORK'
              : !endpointReady
                ? 'ยังไม่มี backend proxy endpoint ใน M81'
                : undefined;

  return {
    mode: env.aiTextMode,
    proxyMode: env.aiTextProxyMode,
    realAIEnabled: env.enableRealAIText,
    networkEnabled: env.enableAITextNetwork,
    canAttemptProxy,
    canCallNetwork,
    controlledDisabled: !canCallNetwork,
    sourceLabel: canCallNetwork ? 'staging proxy boundary' : 'local fixture',
    statusLabel: canCallNetwork ? 'staging proxy พร้อมสำหรับ endpoint ในอนาคต' : `ปิด/สำรอง: ${disabledReason}`,
    disabledReason,
    noProviderKeyInFrontend: true,
    noServiceRoleKeyInFrontend: true,
    noDirectProviderCall: true,
  };
}

function buildResponseBase(request: AITextRequest, modeStatus: AITextModeStatus) {
  return {
    id: `ai-text-response-${request.id}`,
    requestId: request.id,
    requestType: request.requestType,
    mode: modeStatus.mode,
    auditPreview: buildAITextAuditPreview(request),
    rateLimitPreview: buildAITextRateLimitPreview(),
    safetyBoundary: aiTextSafetyBoundary,
    lockedOutputSnapshot: request.lockedOutputSnapshot,
    noProviderKeyInFrontend: true as const,
    noServiceRoleKeyInFrontend: true as const,
    noDirectProviderCall: true as const,
    immutableOutputPreserved: true as const,
  };
}

export async function explainAIText(request: AITextRequest, env?: AITextProxyEnv): Promise<AITextResponse> {
  return explainAITextSync(request, env);
}

export function explainAITextSync(request: AITextRequest, env?: AITextProxyEnv): AITextResponse {
  const modeStatus = getAITextModeStatus(env);
  const blockedReasons = detectAITextBlockedActions(request);
  const base = buildResponseBase(request, modeStatus);

  if (blockedReasons.length > 0) {
    return {
      ...base,
      status: 'blocked',
      blockedReasons,
      disabledReason: 'คำขอนี้อยู่นอกขอบเขตความปลอดภัยของ M81',
      networkAttempted: false,
    };
  }

  if (modeStatus.mode === 'local_fixture') {
    return {
      ...base,
      status: 'fixture_response',
      text: buildLocalAITextFixtureText(request),
      blockedReasons: [],
      networkAttempted: false,
    };
  }

  if (modeStatus.mode === 'production_disabled' || modeStatus.mode === 'staging_proxy_disabled') {
    return {
      ...base,
      status: 'proxy_disabled',
      disabledReason: modeStatus.disabledReason ?? 'AI text proxy disabled',
      blockedReasons: [],
      networkAttempted: false,
    };
  }

  if (!modeStatus.canCallNetwork) {
    return {
      ...base,
      status: 'proxy_not_configured',
      disabledReason: modeStatus.disabledReason ?? 'backend proxy endpoint not configured',
      blockedReasons: [],
      networkAttempted: false,
    };
  }

  return {
    ...base,
    status: 'disabled',
    disabledReason: 'M81 ยังไม่ผูก endpoint จริงกับ frontend แม้ flags จะพร้อม',
    blockedReasons: [],
    networkAttempted: false,
  };
}

export function getAITextProxyStatus(env?: AITextProxyEnv): AITextProxyStatus {
  const modeStatus = getAITextModeStatus(env);
  const sampleRequest: Pick<AITextRequest, 'id' | 'requestType'> = {
    id: 'ai-text-status-preview',
    requestType: 'calculator_explanation',
  };

  return {
    ...modeStatus,
    allowedRequestTypes: aiTextAllowedRequestTypes,
    blockedActions: aiTextBlockedActions,
    auditPreview: buildAITextAuditPreview(sampleRequest),
    rateLimitPreview: buildAITextRateLimitPreview(),
    failureModes: aiTextFailureModes,
    fallbackToFixture: !modeStatus.canCallNetwork,
  };
}
