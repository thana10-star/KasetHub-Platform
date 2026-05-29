import { describe, expect, test, vi } from 'vitest';
import {
  buildGeminiGenerateContentUrl,
  createGeminiLiveCapableProvider,
} from './gemini-live-provider';
import type { FarmerAssistantProviderRequest } from './provider-types';

const fakeGeminiKey = 'test-gemini-key-placeholder';
const request: FarmerAssistantProviderRequest = {
  question: 'ใบมันสำปะหลังเหลืองควรเริ่มตรวจอะไร',
  crop: 'มันสำปะหลัง',
  province: 'นครราชสีมา',
  topic: 'plant_problem',
  userMode: 'guest',
  requestId: 'ai-farmer-m147-live-adapter',
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

function normalGeminiBody(answer = 'ควรเริ่มจากตรวจดิน น้ำ ใบ และแมลงก่อน แล้วค่อยสรุปสาเหตุอย่างระมัดระวัง') {
  return {
    candidates: [
      {
        content: {
          parts: [{ text: answer }],
        },
        finishReason: 'STOP',
      },
    ],
  };
}

function createLiveProvider(fetcher: typeof fetch, envOverrides: Record<string, string> = {}) {
  return createGeminiLiveCapableProvider({
    allowLiveExecution: true,
    apiBaseUrl: 'https://gemini-unit-test.example/v1beta',
    env: {
      AI_PROVIDER: 'gemini',
      AI_LIVE_ENABLED: 'true',
      AI_MODEL: 'gemini-test-model',
      AI_MAX_OUTPUT_TOKENS: '512',
      GEMINI_API_KEY: fakeGeminiKey,
      ...envOverrides,
    },
    fetcher,
  });
}

describe('M147 Gemini live-capable provider', () => {
  test('builds a Gemini generateContent URL without embedding the API key', () => {
    const url = buildGeminiGenerateContentUrl('models/gemini-test-model:generateContent', 'https://example.test/v1beta/');

    expect(url).toBe('https://example.test/v1beta/models/gemini-test-model:generateContent');
    expect(url).not.toContain(fakeGeminiKey);
  });

  test('calls only the injected fetcher and builds the planned request shape', async () => {
    const fetcher = vi.fn(async () => jsonResponse(normalGeminiBody()));
    const provider = createLiveProvider(fetcher as unknown as typeof fetch);
    const response = await provider.generateAnswer(request);
    const [url, init] = fetcher.mock.calls[0] as [string, RequestInit];
    const headers = new Headers(init.headers);
    const body = JSON.parse(String(init.body)) as Record<string, unknown>;
    const serializedResponse = JSON.stringify(response);

    expect(provider.providerMode).toBe('live');
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(url).toBe('https://gemini-unit-test.example/v1beta/models/gemini-test-model:generateContent');
    expect(init.method).toBe('POST');
    expect(headers.get('Content-Type')).toBe('application/json');
    expect(headers.get('x-goog-api-key')).toBe(fakeGeminiKey);
    expect(JSON.stringify(body)).toContain(request.question);
    expect(JSON.stringify(body)).toContain('มันสำปะหลัง');
    expect(JSON.stringify(body)).toContain('นครราชสีมา');
    expect((body.generationConfig as { maxOutputTokens?: number }).maxOutputTokens).toBe(512);
    expect(response.status).toBe('ready');
    expect(response.provider).toBe('gemini');
    expect(response.providerMode).toBe('live');
    expect(serializedResponse).not.toContain(fakeGeminiKey);
    expect(serializedResponse).not.toContain('x-goog-api-key');
  });

  test('stays dry-run when live gates are missing and never uses global fetch', async () => {
    const originalFetch = globalThis.fetch;
    const globalFetchSpy = vi.fn(async () => jsonResponse(normalGeminiBody()));
    globalThis.fetch = globalFetchSpy as unknown as typeof fetch;

    try {
      const provider = createGeminiLiveCapableProvider({
        allowLiveExecution: true,
        env: {
          AI_PROVIDER: 'gemini',
          AI_LIVE_ENABLED: 'true',
          GEMINI_API_KEY: fakeGeminiKey,
        },
      });
      const response = await provider.generateAnswer(request);
      const serialized = JSON.stringify(response);

      expect(provider.providerMode).toBe('dry_run');
      expect(provider.getHealth().reasonCode).toBe('fetch_not_injected');
      expect(globalFetchSpy).not.toHaveBeenCalled();
      expect(response.provider).toBe('mock');
      expect(response.providerMode).toBe('dry_run');
      expect(serialized).not.toContain(fakeGeminiKey);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  test('keeps AI_LIVE_ENABLED=false on dry-run path without requiring a key', async () => {
    const fetcher = vi.fn(async () => jsonResponse(normalGeminiBody()));
    const provider = createGeminiLiveCapableProvider({
      allowLiveExecution: true,
      env: {
        AI_PROVIDER: 'gemini',
        AI_LIVE_ENABLED: 'false',
      },
      fetcher: fetcher as unknown as typeof fetch,
    });
    const response = await provider.generateAnswer(request);

    expect(provider.providerMode).toBe('dry_run');
    expect(fetcher).not.toHaveBeenCalled();
    expect(response.provider).toBe('mock');
    expect(response.providerMode).toBe('dry_run');
  });

  test('maps a safety-blocked Gemini-like response to a safe high-risk fallback', async () => {
    const fetcher = vi.fn(async () =>
      jsonResponse({
        promptFeedback: {
          blockReason: 'SAFETY',
          blockReasonMessage: 'provider-only detail',
        },
        candidates: [],
      }),
    );
    const provider = createLiveProvider(fetcher as unknown as typeof fetch);
    const response = await provider.generateAnswer(request);
    const serialized = JSON.stringify(response);

    expect(response.status).toBe('blocked');
    expect(response.safetyLevel).toBe('high_risk');
    expect(response.provider).toBe('disabled');
    expect(serialized).not.toContain('provider-only detail');
    expect(serialized).not.toContain(fakeGeminiKey);
  });

  test('maps malformed Gemini-like responses safely', async () => {
    const fetcher = vi.fn(async () => jsonResponse({ candidates: [{ content: { parts: [] } }] }));
    const provider = createLiveProvider(fetcher as unknown as typeof fetch);
    const response = await provider.generateAnswer(request);
    const serialized = JSON.stringify(response);

    expect(response.status).toBe('error');
    expect(response.provider).toBe('disabled');
    expect(serialized).not.toContain('gemini_missing_text');
    expect(serialized).not.toContain(fakeGeminiKey);
  });

  test.each([
    [401, 'not_configured'],
    [403, 'not_configured'],
    [429, 'rate_limited'],
    [500, 'error'],
  ] as const)('maps provider HTTP %s to a safe %s response', async (status, expectedStatus) => {
    const fetcher = vi.fn(async () =>
      jsonResponse(
        {
          error: {
            message: 'raw provider message',
          },
        },
        status,
      ),
    );
    const provider = createLiveProvider(fetcher as unknown as typeof fetch);
    const response = await provider.generateAnswer(request);
    const serialized = JSON.stringify(response);

    expect(response.status).toBe(expectedStatus);
    expect(response.provider).toBe('disabled');
    expect(serialized).not.toContain('raw provider message');
    expect(serialized).not.toContain(fakeGeminiKey);
  });

  test('maps injected fetch failures without leaking raw errors', async () => {
    const fetcher = vi.fn(async () => {
      throw new Error('socket failure with internal detail');
    });
    const provider = createLiveProvider(fetcher as unknown as typeof fetch);
    const response = await provider.generateAnswer(request);
    const serialized = JSON.stringify(response);

    expect(response.status).toBe('error');
    expect(response.provider).toBe('disabled');
    expect(serialized).not.toContain('socket failure');
    expect(serialized).not.toContain(fakeGeminiKey);
  });
});
