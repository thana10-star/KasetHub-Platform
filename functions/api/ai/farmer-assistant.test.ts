import { describe, expect, test, vi } from 'vitest';
import {
  buildFarmerAssistantFixtureResponse,
  handleFarmerAssistantRequest,
  onRequest,
} from './farmer-assistant';

function request(body: unknown, init?: RequestInit) {
  return new Request('https://kasethub.example/api/ai/farmer-assistant', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
    ...init,
  });
}

function invalidJsonRequest() {
  return new Request('https://kasethub.example/api/ai/farmer-assistant', {
    method: 'POST',
    body: '{not-json',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

async function jsonResponse(response: Response) {
  return response.json() as Promise<Record<string, unknown>>;
}

const fakeGeminiKey = 'test-gemini-key-placeholder';

function geminiTextResponse(
  answer = 'ควรเริ่มจากตรวจดิน น้ำ ใบ และแมลงก่อน แล้วค่อยสรุปสาเหตุอย่างระมัดระวัง',
) {
  return new Response(
    JSON.stringify({
      candidates: [
        {
          content: {
            parts: [{ text: answer }],
          },
          finishReason: 'STOP',
        },
      ],
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
}

function geminiErrorResponse(status: number) {
  return new Response(
    JSON.stringify({
      error: {
        message: 'raw provider message',
      },
    }),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
}

describe('M138 AI farmer assistant Cloudflare Function stub', () => {
  test('returns 405 for non-POST methods', async () => {
    const response = await onRequest({
      request: new Request('https://kasethub.example/api/ai/farmer-assistant', { method: 'GET' }),
    });
    const payload = await jsonResponse(response);

    expect(response.status).toBe(405);
    expect(payload.status).toBe('error');
    expect(payload.provider).toBe('disabled');
  });

  test('rejects invalid JSON safely', async () => {
    const response = await handleFarmerAssistantRequest({ request: invalidJsonRequest() });
    const payload = await jsonResponse(response);
    const serialized = JSON.stringify(payload);

    expect(response.status).toBe(400);
    expect(payload.status).toBe('error');
    expect(serialized).not.toContain('SyntaxError');
    expect(serialized).not.toContain('stack');
  });

  test('rejects missing and empty questions', async () => {
    const missingResponse = await handleFarmerAssistantRequest({ request: request({ crop: 'rice' }) });
    const emptyResponse = await handleFarmerAssistantRequest({ request: request({ question: '   ' }) });

    expect(missingResponse.status).toBe(400);
    expect((await jsonResponse(missingResponse)).status).toBe('error');
    expect(emptyResponse.status).toBe(400);
    expect((await jsonResponse(emptyResponse)).status).toBe('error');
  });

  test('rejects too-long questions with the default 1200 character limit', async () => {
    const response = await handleFarmerAssistantRequest({
      request: request({ question: 'ก'.repeat(1201) }),
    });
    const payload = await jsonResponse(response);

    expect(response.status).toBe(400);
    expect(payload.status).toBe('error');
    expect(payload.answer).toBe('พิมพ์คำถามให้ครบและสั้นลง แล้วลองใหม่');
  });

  test('supports server-side max question length override without exposing env values', async () => {
    const response = await handleFarmerAssistantRequest({
      request: request({ question: 'คำถามยาวเกิน' }),
      env: {
        AI_MAX_INPUT_CHARS: '5',
      },
    });
    const payload = await jsonResponse(response);

    expect(response.status).toBe(400);
    expect(payload.status).toBe('error');
    expect(JSON.stringify(payload)).not.toContain('AI_MAX_INPUT_CHARS');
  });

  test('rejects invalid topic and userMode values', async () => {
    const invalidTopicResponse = await handleFarmerAssistantRequest({
      request: request({ question: 'ถามเรื่องดิน', topic: 'unsupported' }),
    });
    const invalidUserModeResponse = await handleFarmerAssistantRequest({
      request: request({ question: 'ถามเรื่องดิน', userMode: 'admin' }),
    });

    expect(invalidTopicResponse.status).toBe(400);
    expect((await jsonResponse(invalidTopicResponse)).status).toBe('error');
    expect(invalidUserModeResponse.status).toBe(400);
    expect((await jsonResponse(invalidUserModeResponse)).status).toBe('error');
  });

  test('returns not_configured for a valid question when provider is not enabled', async () => {
    const response = await handleFarmerAssistantRequest({
      request: request({
        question: 'ใบมะนาวเหลืองหลังฝนตกควรตรวจอะไร',
        crop: 'มะนาว',
        province: 'นครปฐม',
        topic: 'plant_problem',
        userMode: 'guest',
        clientRequestId: 'owner-check-001',
      }),
    });
    const payload = await jsonResponse(response);

    expect(response.status).toBe(200);
    expect(payload.status).toBe('not_configured');
    expect(payload.provider).toBe('disabled');
    expect(payload.requestId).toBe('ai-farmer-owner-check-001');
    expect(payload.answer).toBe('ระบบ AI กำลังเตรียมเปิดใช้งาน ตอนนี้ยังไม่มีการเรียกผู้ให้บริการ AI จริง');
  });

  test('returns Gemini dry-run response without requiring GEMINI_API_KEY', async () => {
    const originalFetch = globalThis.fetch;
    const fetchSpy = vi.fn(async () => new Response('{}'));
    globalThis.fetch = fetchSpy as typeof fetch;

    try {
      const response = await handleFarmerAssistantRequest({
        request: request({
          question: 'ใบมะนาวเหลืองหลังฝนตกควรตรวจอะไร',
          crop: 'มะนาว',
          province: 'นครปฐม',
          topic: 'plant_problem',
          clientRequestId: 'gemini-dry-run',
        }),
        env: {
          AI_PROVIDER: 'gemini',
          AI_LIVE_ENABLED: 'false',
        },
      });
      const payload = await jsonResponse(response);
      const serialized = JSON.stringify(payload);

      expect(response.status).toBe(200);
      expect(fetchSpy).not.toHaveBeenCalled();
      expect(payload.status).toBe('ready');
      expect(payload.provider).toBe('mock');
      expect(payload.providerMode).toBe('dry_run');
      expect(payload.requestId).toBe('ai-farmer-gemini-dry-run');
      expect(payload.answer).toBe('นี่เป็นคำตอบทดสอบจากระบบ AI เกษตรรุ่นทดลอง ขณะนี้ยังไม่ได้เปิดใช้งาน Gemini จริง');
      expect(serialized).toContain('dry-run');
      expect(serialized).not.toContain('GEMINI_API_KEY');
      expect(serialized).not.toContain('AIza');
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  test('keeps Gemini in dry-run mode even when AI_LIVE_ENABLED is true in M147', async () => {
    const originalFetch = globalThis.fetch;
    const fetchSpy = vi.fn(async () => new Response('{}'));
    globalThis.fetch = fetchSpy as typeof fetch;

    try {
      const response = await handleFarmerAssistantRequest({
        request: request({ question: 'ช่วยแนะนำการเตรียมดินก่อนปลูกผัก', clientRequestId: 'live-flag-check' }),
        env: {
          AI_PROVIDER: 'gemini',
          AI_LIVE_ENABLED: 'true',
        },
      });
      const payload = await jsonResponse(response);
      const serialized = JSON.stringify(payload);

      expect(fetchSpy).not.toHaveBeenCalled();
      expect(payload.status).toBe('ready');
      expect(payload.provider).toBe('mock');
      expect(payload.providerMode).toBe('dry_run');
      expect(serialized).not.toContain('GEMINI_API_KEY');
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  test('does not live-call Gemini from the endpoint even when a server-side placeholder key is present', async () => {
    const originalFetch = globalThis.fetch;
    const fetchSpy = vi.fn(async () => new Response('{}'));
    globalThis.fetch = fetchSpy as typeof fetch;

    try {
      const response = await handleFarmerAssistantRequest({
        request: request({ question: 'ช่วยแนะนำการตรวจใบมันสำปะหลังเหลือง', clientRequestId: 'gemini-secret-live-blocked' }),
        env: {
          AI_PROVIDER: 'gemini',
          AI_LIVE_ENABLED: 'true',
          AI_MODEL: 'gemini-test-model',
          GEMINI_API_KEY: 'test-gemini-key-placeholder',
        },
      });
      const payload = await jsonResponse(response);
      const serialized = JSON.stringify(payload);

      expect(fetchSpy).not.toHaveBeenCalled();
      expect(payload.status).toBe('ready');
      expect(payload.provider).toBe('mock');
      expect(payload.providerMode).toBe('dry_run');
      expect(serialized).not.toContain('test-gemini-key-placeholder');
      expect(serialized).not.toContain('x-goog-api-key');
      expect(serialized).not.toContain('GEMINI_API_KEY');
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  test('keeps Gemini dry-run when only AI_ALLOW_LIVE_EXECUTION is true', async () => {
    const originalFetch = globalThis.fetch;
    const fetchSpy = vi.fn(async () => geminiTextResponse());
    globalThis.fetch = fetchSpy as typeof fetch;

    try {
      const response = await handleFarmerAssistantRequest({
        request: request({ question: 'ช่วยแนะนำการเตรียมดินก่อนปลูกผัก', clientRequestId: 'allow-only-check' }),
        env: {
          AI_PROVIDER: 'gemini',
          AI_ALLOW_LIVE_EXECUTION: 'true',
        },
      });
      const payload = await jsonResponse(response);

      expect(fetchSpy).not.toHaveBeenCalled();
      expect(payload.status).toBe('ready');
      expect(payload.provider).toBe('mock');
      expect(payload.providerMode).toBe('dry_run');
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  test('returns a safe not_configured response when live gates are true but GEMINI_API_KEY is missing', async () => {
    const fetchSpy = vi.fn(async () => geminiTextResponse());
    const response = await handleFarmerAssistantRequest({
      request: request({ question: 'ใบมันสำปะหลังเหลืองควรเริ่มตรวจอะไร', clientRequestId: 'missing-gemini-key' }),
      env: {
        AI_PROVIDER: 'gemini',
        AI_LIVE_ENABLED: 'true',
        AI_ALLOW_LIVE_EXECUTION: 'true',
      },
      providerFetch: fetchSpy as unknown as typeof fetch,
    });
    const payload = await jsonResponse(response);
    const serialized = JSON.stringify(payload);

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(payload.status).toBe('not_configured');
    expect(payload.provider).toBe('disabled');
    expect(payload.providerMode).toBe('disabled');
    expect(serialized).not.toContain('GEMINI_API_KEY');
    expect(serialized).not.toContain('x-goog-api-key');
  });

  test('ignores frontend Gemini key env names and never uses them for live execution', async () => {
    const fetchSpy = vi.fn(async () => geminiTextResponse());
    const envWithFrontendKey: Record<string, string> = {
      AI_PROVIDER: 'gemini',
      AI_LIVE_ENABLED: 'true',
      AI_ALLOW_LIVE_EXECUTION: 'true',
      VITE_GEMINI_API_KEY: 'frontend-key-placeholder',
    };

    const response = await handleFarmerAssistantRequest({
      request: request({ question: 'ช่วยดูอาการใบเหลือง', clientRequestId: 'frontend-key-ignored' }),
      env: envWithFrontendKey,
      providerFetch: fetchSpy as unknown as typeof fetch,
    });
    const payload = await jsonResponse(response);
    const serialized = JSON.stringify(payload);

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(payload.status).toBe('not_configured');
    expect(payload.provider).toBe('disabled');
    expect(serialized).not.toContain('frontend-key-placeholder');
    expect(serialized).not.toContain('VITE_GEMINI_API_KEY');
  });

  test('uses mocked Gemini live path only when all M149 backend gates are true', async () => {
    const fetchSpy = vi.fn(async () => geminiTextResponse());
    const response = await handleFarmerAssistantRequest({
      request: request({
        question: 'ใบมันสำปะหลังเหลือง ควรเริ่มตรวจอะไร',
        crop: 'มันสำปะหลัง',
        province: 'นครราชสีมา',
        topic: 'plant_problem',
        clientRequestId: 'm149-live-mocked',
      }),
      env: {
        AI_PROVIDER: 'gemini',
        AI_LIVE_ENABLED: 'true',
        AI_ALLOW_LIVE_EXECUTION: 'true',
        AI_MODEL: 'gemini-test-model',
        AI_MAX_OUTPUT_TOKENS: '512',
        GEMINI_API_KEY: fakeGeminiKey,
      },
      providerFetch: fetchSpy as unknown as typeof fetch,
    });
    const payload = await jsonResponse(response);
    const [url, init] = fetchSpy.mock.calls[0] as [string, RequestInit];
    const headers = new Headers(init.headers);
    const body = JSON.parse(String(init.body)) as Record<string, unknown>;
    const serializedPayload = JSON.stringify(payload);
    const serializedBody = JSON.stringify(body);

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(url).toContain('/models/gemini-test-model:generateContent');
    expect(init.method).toBe('POST');
    expect(headers.get('x-goog-api-key')).toBe(fakeGeminiKey);
    expect(serializedBody).toContain('ใบมันสำปะหลังเหลือง');
    expect(serializedBody).toContain('มันสำปะหลัง');
    expect(serializedBody).toContain('นครราชสีมา');
    expect((body.generationConfig as { maxOutputTokens?: number }).maxOutputTokens).toBe(512);
    expect(payload.status).toBe('ready');
    expect(payload.provider).toBe('gemini');
    expect(payload.providerMode).toBe('live');
    expect(payload.answer).toContain('ควรเริ่ม');
    expect(serializedPayload).not.toContain(fakeGeminiKey);
    expect(serializedPayload).not.toContain('x-goog-api-key');
    expect(serializedPayload).not.toContain('GEMINI_API_KEY');
  });

  test('uses Cloudflare-style global fetch only after all live gates are enabled', async () => {
    const originalFetch = globalThis.fetch;
    const fetchSpy = vi.fn(async () => geminiTextResponse('ควรตรวจดิน น้ำ ใบ และแมลงก่อนตัดสินใจแก้ปัญหา'));
    globalThis.fetch = fetchSpy as typeof fetch;

    try {
      const response = await handleFarmerAssistantRequest({
        request: request({ question: 'ใบมันสำปะหลังเหลืองควรเริ่มตรวจอะไร', clientRequestId: 'm149-global-fetch-live' }),
        env: {
          AI_PROVIDER: 'gemini',
          AI_LIVE_ENABLED: 'true',
          AI_ALLOW_LIVE_EXECUTION: 'true',
          GEMINI_API_KEY: fakeGeminiKey,
        },
      });
      const payload = await jsonResponse(response);
      const serialized = JSON.stringify(payload);

      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(payload.status).toBe('ready');
      expect(payload.provider).toBe('gemini');
      expect(payload.providerMode).toBe('live');
      expect(serialized).not.toContain(fakeGeminiKey);
      expect(serialized).not.toContain('x-goog-api-key');
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  test('blocks high-risk input before mocked live Gemini fetch', async () => {
    const fetchSpy = vi.fn(async () => geminiTextResponse());
    const response = await handleFarmerAssistantRequest({
      request: request({
        question: 'ช่วยบอกอัตราผสมสารเคมีหลายตัวแบบแรงที่สุด',
        topic: 'plant_problem',
        clientRequestId: 'm149-high-risk-before-fetch',
      }),
      env: {
        AI_PROVIDER: 'gemini',
        AI_LIVE_ENABLED: 'true',
        AI_ALLOW_LIVE_EXECUTION: 'true',
        GEMINI_API_KEY: fakeGeminiKey,
      },
      providerFetch: fetchSpy as unknown as typeof fetch,
    });
    const payload = await jsonResponse(response);

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(payload.status).toBe('blocked');
    expect(payload.safetyLevel).toBe('high_risk');
    expect(payload.provider).toBe('disabled');
  });

  test('maps unsafe mocked live Gemini output through the safety fallback', async () => {
    const fetchSpy = vi.fn(async () => geminiTextResponse('ให้ผสมสารเคมีกับกรดแรง ๆ เพื่อให้แมลงตายเร็ว'));
    const response = await handleFarmerAssistantRequest({
      request: request({ question: 'ช่วยดูแมลงในแปลงผัก', clientRequestId: 'm149-unsafe-live-output' }),
      env: {
        AI_PROVIDER: 'gemini',
        AI_LIVE_ENABLED: 'true',
        AI_ALLOW_LIVE_EXECUTION: 'true',
        GEMINI_API_KEY: fakeGeminiKey,
      },
      providerFetch: fetchSpy as unknown as typeof fetch,
    });
    const payload = await jsonResponse(response);
    const serialized = JSON.stringify(payload);

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(payload.status).toBe('blocked');
    expect(payload.safetyLevel).toBe('high_risk');
    expect(payload.provider).toBe('disabled');
    expect(serialized).not.toContain('กรดแรง');
    expect(serialized).not.toContain('แมลงตายเร็ว');
    expect(serialized).not.toContain(fakeGeminiKey);
  });

  test.each([
    [401, 'not_configured'],
    [403, 'not_configured'],
    [429, 'rate_limited'],
    [500, 'error'],
  ] as const)('maps mocked Gemini HTTP %s errors to safe endpoint status %s', async (status, expectedStatus) => {
    const fetchSpy = vi.fn(async () => geminiErrorResponse(status));
    const response = await handleFarmerAssistantRequest({
      request: request({ question: 'ช่วยแนะนำการตรวจใบเหลือง', clientRequestId: `m149-http-${status}` }),
      env: {
        AI_PROVIDER: 'gemini',
        AI_LIVE_ENABLED: 'true',
        AI_ALLOW_LIVE_EXECUTION: 'true',
        GEMINI_API_KEY: fakeGeminiKey,
      },
      providerFetch: fetchSpy as unknown as typeof fetch,
    });
    const payload = await jsonResponse(response);
    const serialized = JSON.stringify(payload);

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(payload.status).toBe(expectedStatus);
    expect(payload.provider).toBe('disabled');
    expect(serialized).not.toContain('raw provider message');
    expect(serialized).not.toContain(fakeGeminiKey);
    expect(serialized).not.toContain('stack');
  });

  test('maps unsafe mocked provider output to safe fallback', async () => {
    const response = await handleFarmerAssistantRequest({
      request: request({ question: 'ช่วยดูแมลงในแปลงผัก', clientRequestId: 'unsafe-provider-output' }),
      env: {
        AI_PROVIDER: 'gemini',
        AI_LIVE_ENABLED: 'false',
      },
      providerOverride: {
        providerName: 'gemini',
        providerMode: 'dry_run',
        getHealth: () => ({
          providerName: 'gemini',
          providerMode: 'dry_run',
          status: 'dry_run_ready',
          reasonCode: 'test_unsafe_output',
        }),
        async generateAnswer(providerRequest) {
          return {
            status: 'ready',
            answer: 'ให้ผสมสารเคมีกับกรดแรง ๆ เพื่อให้แมลงตายเร็ว',
            safetyLevel: 'normal',
            provider: 'mock',
            providerMode: 'dry_run',
            requestId: providerRequest.requestId,
          };
        },
      },
    });
    const payload = await jsonResponse(response);
    const serialized = JSON.stringify(payload);

    expect(response.status).toBe(200);
    expect(payload.status).toBe('blocked');
    expect(payload.safetyLevel).toBe('high_risk');
    expect(payload.provider).toBe('disabled');
    expect(serialized).not.toContain('กรดแรง');
    expect(serialized).not.toContain('แมลงตายเร็ว');
  });

  test('maps slow mocked provider output to timeout fallback', async () => {
    const response = await handleFarmerAssistantRequest({
      request: request({ question: 'ช่วยแนะนำการให้น้ำผัก', clientRequestId: 'timeout-provider' }),
      env: {
        AI_PROVIDER: 'gemini',
        AI_PROVIDER_TIMEOUT_MS: '5',
      },
      providerOverride: {
        providerName: 'gemini',
        providerMode: 'dry_run',
        getHealth: () => ({
          providerName: 'gemini',
          providerMode: 'dry_run',
          status: 'dry_run_ready',
          reasonCode: 'test_timeout',
        }),
        async generateAnswer(providerRequest) {
          await new Promise((resolve) => {
            setTimeout(resolve, 30);
          });

          return {
            status: 'ready',
            answer: 'คำตอบช้า',
            safetyLevel: 'normal',
            provider: 'mock',
            providerMode: 'dry_run',
            requestId: providerRequest.requestId,
          };
        },
      },
    });
    const payload = await jsonResponse(response);
    const serialized = JSON.stringify(payload);

    expect(response.status).toBe(504);
    expect(payload.status).toBe('error');
    expect(payload.provider).toBe('disabled');
    expect(serialized).not.toContain('provider_timeout');
    expect(serialized).not.toContain('คำตอบช้า');
  });

  test('returns disabled state for unknown providers', async () => {
    const response = await handleFarmerAssistantRequest({
      request: request({ question: 'ช่วยดูอาการใบเหลือง', clientRequestId: 'unknown-provider' }),
      env: {
        AI_PROVIDER: 'unknown-provider',
        AI_LIVE_ENABLED: 'true',
      },
    });
    const payload = await jsonResponse(response);

    expect(response.status).toBe(200);
    expect(payload.status).toBe('not_configured');
    expect(payload.provider).toBe('disabled');
    expect(payload.providerMode).toBe('disabled');
  });

  test('does not attempt a provider call even when server-side OpenAI env is present', async () => {
    const originalFetch = globalThis.fetch;
    const fetchSpy = vi.fn(async () => new Response('{}'));
    globalThis.fetch = fetchSpy as typeof fetch;

    try {
      const response = await handleFarmerAssistantRequest({
        request: request({ question: 'ช่วยแนะนำการเตรียมดิน', clientRequestId: 'secret-check' }),
        env: {
          AI_PROVIDER: 'openai',
          OPENAI_API_KEY: 'local-test-provider-key',
        },
      });
      const payload = await jsonResponse(response);
      const serialized = JSON.stringify(payload);

      expect(fetchSpy).not.toHaveBeenCalled();
      expect(payload.status).toBe('not_configured');
      expect(payload.provider).toBe('disabled');
      expect(serialized).not.toContain('local-test-provider-key');
      expect(serialized).not.toContain('OPENAI_API_KEY');
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  test('blocks obvious high-risk chemical dosage and mixing requests', async () => {
    const dosageResponse = await handleFarmerAssistantRequest({
      request: request({ question: 'ยาฆ่าแมลงตัวนี้ต้องใช้กี่ซีซีต่อถังถึงจะหายแน่นอน' }),
    });
    const mixingResponse = await handleFarmerAssistantRequest({
      request: request({ question: 'ผสมสารเคมีกับกรดแรง ๆ ได้ไหมให้แมลงตายเร็ว' }),
    });
    const dosagePayload = await jsonResponse(dosageResponse);
    const mixingPayload = await jsonResponse(mixingResponse);

    expect(dosagePayload.status).toBe('blocked');
    expect(dosagePayload.safetyLevel).toBe('high_risk');
    expect(dosagePayload.provider).toBe('disabled');
    expect(JSON.stringify(dosagePayload)).not.toMatch(/กี่ซีซีต่อถัง\s*\d/);
    expect(mixingPayload.status).toBe('blocked');
    expect(mixingPayload.safetyLevel).toBe('high_risk');
  });

  test('rate-limits obvious spam with safe retry guidance', async () => {
    const response = await handleFarmerAssistantRequest({
      request: request({ question: 'ก'.repeat(80) }),
      env: {
        AI_COOLDOWN_SECONDS: '45',
      },
    });
    const payload = await jsonResponse(response);

    expect(response.status).toBe(429);
    expect(payload.status).toBe('rate_limited');
    expect(payload.retryAfterSeconds).toBe(45);
    expect(payload.provider).toBe('disabled');
  });

  test('fixture helpers cover all M138 states without live-provider claims', () => {
    const states = [
      'ready_mock',
      'not_configured',
      'rate_limited',
      'blocked_high_risk',
      'provider_error',
      'timeout',
      'validation_error',
    ] as const;

    states.forEach((state) => {
      const fixture = buildFarmerAssistantFixtureResponse(state, `fixture-${state}`, 30);
      const serialized = JSON.stringify(fixture);

      expect(fixture.requestId).toBe(`fixture-${state}`);
      expect(['mock', 'disabled']).toContain(fixture.provider);
      expect(serialized).not.toContain('OPENAI_API_KEY');
      expect(serialized).not.toContain('VITE_OPENAI_API_KEY');
      expect(serialized).not.toContain('AIza');
      expect(serialized).not.toContain('API error');
      expect(serialized).not.toContain('undefined');
      expect(serialized).not.toContain('null');
    });
  });
});
