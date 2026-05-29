export type GeminiProviderErrorReasonCode =
  | 'gemini_timeout'
  | 'gemini_rate_limited'
  | 'gemini_auth_error'
  | 'gemini_quota_exceeded'
  | 'gemini_safety_blocked'
  | 'gemini_malformed_response'
  | 'gemini_provider_error';

export type GeminiMappedProviderError = {
  reasonCode: GeminiProviderErrorReasonCode;
  retryable: boolean;
  safeLogCode: GeminiProviderErrorReasonCode;
  httpStatus?: number;
};

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readNumber(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function readString(value: unknown) {
  return typeof value === 'string' ? value : undefined;
}

function readStatus(input: unknown) {
  if (input instanceof Response) {
    return input.status;
  }

  if (!isRecord(input)) {
    return undefined;
  }

  return readNumber(input.status) ?? readNumber(input.code);
}

function collectErrorHints(input: unknown) {
  if (!isRecord(input)) {
    return '';
  }

  return [readString(input.name), readString(input.message), readString(input.reason), readString(input.code)]
    .filter((value): value is string => Boolean(value))
    .join(' ')
    .toLowerCase();
}

function makeMappedError(
  reasonCode: GeminiProviderErrorReasonCode,
  retryable: boolean,
  httpStatus?: number,
): GeminiMappedProviderError {
  return {
    reasonCode,
    retryable,
    safeLogCode: reasonCode,
    httpStatus,
  };
}

export function mapGeminiProviderError(input: unknown): GeminiMappedProviderError {
  const status = readStatus(input);
  const hints = collectErrorHints(input);

  if (status === 408 || status === 504 || /\b(abort|timeout|timed out)\b/.test(hints)) {
    return makeMappedError('gemini_timeout', true, status);
  }

  if (/\b(safety|blocked|blocklist|prohibited)\b/.test(hints)) {
    return makeMappedError('gemini_safety_blocked', false, status);
  }

  if (status === 401 || status === 403 || /\b(auth|unauthorized|permission|api key|apikey|credential)\b/.test(hints)) {
    return makeMappedError('gemini_auth_error', false, status);
  }

  if (status === 429 && /\b(quota|billing|limit exceeded)\b/.test(hints)) {
    return makeMappedError('gemini_quota_exceeded', true, status);
  }

  if (status === 429 || /\b(rate limit|rate_limited|too many requests)\b/.test(hints)) {
    return makeMappedError('gemini_rate_limited', true, status);
  }

  if (/\b(quota|billing|limit exceeded)\b/.test(hints)) {
    return makeMappedError('gemini_quota_exceeded', true, status);
  }

  if (/\b(malformed|invalid json|parse|missing text|empty candidates)\b/.test(hints)) {
    return makeMappedError('gemini_malformed_response', false, status);
  }

  return makeMappedError('gemini_provider_error', Boolean(status && status >= 500), status);
}
