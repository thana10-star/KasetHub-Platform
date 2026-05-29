import { describe, expect, test } from 'vitest';
import { parseProviderTimeoutMs, runProviderWithTimeout } from './provider-timeout';

const safeResponse = {
  status: 'ready' as const,
  answer: 'คำตอบทดสอบที่ปลอดภัย',
  provider: 'mock' as const,
  providerMode: 'dry_run' as const,
  requestId: 'ai-farmer-timeout-test',
};

describe('M143 provider timeout wrapper', () => {
  test('resolves fast provider response', async () => {
    const result = await runProviderWithTimeout(async () => safeResponse, { timeoutMs: 50 });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.response.status).toBe('ready');
    }
  });

  test('times out slow provider response', async () => {
    const result = await runProviderWithTimeout(
      async () =>
        new Promise((resolve) => {
          setTimeout(() => resolve(safeResponse), 30);
        }),
      { timeoutMs: 5 },
    );

    expect(result).toEqual({ ok: false, reasonCode: 'provider_timeout' });
  });

  test('respects configured timeout parsing', () => {
    expect(parseProviderTimeoutMs('12')).toBe(12);
    expect(parseProviderTimeoutMs('0')).toBe(8000);
    expect(parseProviderTimeoutMs('999999')).toBe(30000);
  });

  test('maps thrown provider errors without leaking message', async () => {
    const result = await runProviderWithTimeout(async () => {
      throw new Error('secret provider stack trace');
    });

    expect(result).toEqual({ ok: false, reasonCode: 'provider_error' });
    expect(JSON.stringify(result)).not.toContain('secret provider stack trace');
  });

  test('maps malformed provider responses', async () => {
    const result = await runProviderWithTimeout(async () => ({ answer: 'missing status' }) as typeof safeResponse);

    expect(result).toEqual({ ok: false, reasonCode: 'provider_malformed_response' });
  });
});
