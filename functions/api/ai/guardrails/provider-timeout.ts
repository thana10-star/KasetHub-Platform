import type { FarmerAssistantResponse } from '../providers/provider-types';

export type ProviderGuardrailFailureReason = 'provider_timeout' | 'provider_error' | 'provider_malformed_response';

export type ProviderExecutionResult =
  | { ok: true; response: FarmerAssistantResponse }
  | { ok: false; reasonCode: ProviderGuardrailFailureReason };

const DEFAULT_PROVIDER_TIMEOUT_MS = 8000;
const MAX_PROVIDER_TIMEOUT_MS = 30000;
const responseStatuses = new Set(['ready', 'not_configured', 'rate_limited', 'blocked', 'error']);

export function parseProviderTimeoutMs(value: string | undefined, fallback = DEFAULT_PROVIDER_TIMEOUT_MS) {
  const parsed = Number(value?.trim());
  return Number.isFinite(parsed) && parsed > 0 ? Math.min(Math.floor(parsed), MAX_PROVIDER_TIMEOUT_MS) : fallback;
}

function isValidProviderResponse(value: unknown): value is FarmerAssistantResponse {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }

  const status = (value as { status?: unknown }).status;
  return typeof status === 'string' && responseStatuses.has(status);
}

export async function runProviderWithTimeout(
  providerCall: () => Promise<FarmerAssistantResponse>,
  options: { timeoutMs?: number } = {},
): Promise<ProviderExecutionResult> {
  const timeoutMs = parseProviderTimeoutMs(String(options.timeoutMs ?? DEFAULT_PROVIDER_TIMEOUT_MS));
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const guardedProviderCall: Promise<ProviderExecutionResult> = providerCall()
    .then((response) => (isValidProviderResponse(response) ? { ok: true as const, response } : { ok: false as const, reasonCode: 'provider_malformed_response' as const }))
    .catch(() => ({ ok: false as const, reasonCode: 'provider_error' as const }));

  const timeout = new Promise<ProviderExecutionResult>((resolve) => {
    timeoutId = setTimeout(() => resolve({ ok: false, reasonCode: 'provider_timeout' }), timeoutMs);
  });

  try {
    return await Promise.race([guardedProviderCall, timeout]);
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}
