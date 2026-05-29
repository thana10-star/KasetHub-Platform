import { describe, expect, test } from 'vitest';
import { mapGeminiProviderError } from './gemini-error-mapper';

describe('M145 Gemini error mapper', () => {
  test('maps timeout errors safely', () => {
    expect(mapGeminiProviderError({ name: 'AbortError', message: 'request timeout' })).toMatchObject({
      reasonCode: 'gemini_timeout',
      retryable: true,
    });
  });

  test('maps rate limit and quota errors safely', () => {
    expect(mapGeminiProviderError({ status: 429, message: 'too many requests' })).toMatchObject({
      reasonCode: 'gemini_rate_limited',
      retryable: true,
      httpStatus: 429,
    });
    expect(mapGeminiProviderError({ status: 429, message: 'quota limit exceeded' })).toMatchObject({
      reasonCode: 'gemini_quota_exceeded',
      retryable: true,
      httpStatus: 429,
    });
  });

  test('maps auth and key errors without leaking raw messages', () => {
    const mapped = mapGeminiProviderError({
      status: 403,
      message: 'invalid API key AIzaTESTSHOULDNOTLEAK',
    });
    const serialized = JSON.stringify(mapped);

    expect(mapped).toMatchObject({
      reasonCode: 'gemini_auth_error',
      retryable: false,
      httpStatus: 403,
    });
    expect(serialized).not.toContain('AIzaTESTSHOULDNOTLEAK');
    expect(serialized).not.toContain('invalid API key');
  });

  test('maps safety blocks and malformed responses safely', () => {
    expect(mapGeminiProviderError({ message: 'response blocked by safety policy' })).toMatchObject({
      reasonCode: 'gemini_safety_blocked',
      retryable: false,
    });
    expect(mapGeminiProviderError({ message: 'malformed provider response missing text' })).toMatchObject({
      reasonCode: 'gemini_malformed_response',
      retryable: false,
    });
  });

  test('maps unknown provider failures without exposing details', () => {
    const mapped = mapGeminiProviderError({
      status: 500,
      message: 'upstream internal detail',
    });
    const serialized = JSON.stringify(mapped);

    expect(mapped).toMatchObject({
      reasonCode: 'gemini_provider_error',
      retryable: true,
      httpStatus: 500,
    });
    expect(serialized).not.toContain('upstream internal detail');
  });
});
