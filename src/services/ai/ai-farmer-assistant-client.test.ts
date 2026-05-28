import { describe, expect, test, vi } from 'vitest';
import {
  askFarmerAssistantViaBackend,
  isAIBackendContractEnabled,
} from '@/services/ai/ai-farmer-assistant-client';

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

describe('M139 AI farmer assistant backend contract client', () => {
  test('posts questions to the backend contract endpoint', async () => {
    const calls: Array<[RequestInfo | URL, RequestInit | undefined]> = [];
    const fetcher = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      calls.push([input, init]);

      return jsonResponse({
        status: 'not_configured',
        answer: 'ระบบ AI กำลังเตรียมเปิดใช้งาน',
        provider: 'disabled',
        requestId: 'ai-farmer-owner-check',
      });
    });

    const response = await askFarmerAssistantViaBackend(
      {
        question: 'ใบมะนาวเหลืองควรตรวจอะไร',
        crop: 'มะนาว',
        province: 'นครปฐม',
        topic: 'plant_problem',
        userMode: 'guest',
        clientRequestId: 'owner-check',
      },
      { fetcher },
    );

    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(calls[0]?.[0]).toBe('/api/ai/farmer-assistant');
    expect(calls[0]?.[1]?.method).toBe('POST');
    expect(JSON.parse(String(calls[0]?.[1]?.body))).toMatchObject({
      question: 'ใบมะนาวเหลืองควรตรวจอะไร',
      topic: 'plant_problem',
      userMode: 'guest',
    });
    expect(response.status).toBe('not_configured');
    expect(response.provider).toBe('disabled');
  });

  test('maps blocked and rate_limited contract responses', async () => {
    const blocked = await askFarmerAssistantViaBackend(
      { question: 'ขออัตราผสมสารเคมี', clientRequestId: 'blocked-check' },
      {
        fetcher: vi.fn(async () =>
          jsonResponse({
            status: 'blocked',
            answer: 'คำถามนี้เสี่ยงต่อความปลอดภัย',
            safetyLevel: 'high_risk',
            provider: 'disabled',
          }),
        ),
      },
    );
    const rateLimited = await askFarmerAssistantViaBackend(
      { question: 'ถามซ้ำเร็วมาก', clientRequestId: 'rate-check' },
      {
        fetcher: vi.fn(async () =>
          jsonResponse(
            {
              status: 'rate_limited',
              answer: 'ถามถี่เกินไป',
              provider: 'disabled',
              retryAfterSeconds: 45,
            },
            429,
          ),
        ),
      },
    );

    expect(blocked.status).toBe('blocked');
    expect(blocked.safetyLevel).toBe('high_risk');
    expect(rateLimited.status).toBe('rate_limited');
    expect(rateLimited.retryAfterSeconds).toBe(45);
  });

  test('handles validation and backend error responses without technical leakage', async () => {
    const validation = await askFarmerAssistantViaBackend(
      { question: '', clientRequestId: 'validation-check' },
      {
        fetcher: vi.fn(async () =>
          jsonResponse(
            {
              status: 'error',
              answer: 'พิมพ์คำถามให้ครบและสั้นลง แล้วลองใหม่',
              provider: 'disabled',
              requestId: 'ai-farmer-validation-check',
            },
            400,
          ),
        ),
      },
    );
    const backendError = await askFarmerAssistantViaBackend(
      { question: 'ดินแข็งควรทำอย่างไร', clientRequestId: 'error-check' },
      {
        fetcher: vi.fn(async () =>
          jsonResponse({
            status: 'error',
            answer: 'ยังตอบคำถามนี้ไม่ได้ ลองใหม่อีกครั้ง',
            provider: 'disabled',
          }),
        ),
      },
    );
    const serialized = JSON.stringify([validation, backendError]);

    expect(validation.status).toBe('error');
    expect(backendError.status).toBe('error');
    expect(serialized).not.toContain('SyntaxError');
    expect(serialized).not.toContain('stack');
    expect(serialized).not.toContain('OPENAI_API_KEY');
  });

  test('handles invalid JSON and network failure with safe fallback', async () => {
    const invalidJson = await askFarmerAssistantViaBackend(
      { question: 'ถามเรื่องน้ำ', clientRequestId: 'bad-json' },
      { fetcher: vi.fn(async () => new Response('{bad-json', { status: 502 })) },
    );
    const networkFailure = await askFarmerAssistantViaBackend(
      { question: 'ถามเรื่องปุ๋ย', clientRequestId: 'network-down' },
      {
        fetcher: vi.fn(async () => {
          throw new Error('provider failed with stack trace');
        }),
      },
    );
    const serialized = JSON.stringify([invalidJson, networkFailure]);

    expect(invalidJson.status).toBe('error');
    expect(networkFailure.status).toBe('error');
    expect(serialized).toContain('ยังเชื่อมต่อผู้ช่วย AI ไม่ได้');
    expect(serialized).not.toContain('provider failed');
    expect(serialized).not.toContain('stack');
  });

  test('does not require or expose provider keys', async () => {
    const fetcher = vi.fn(async () =>
      jsonResponse({
        status: 'not_configured',
        provider: 'disabled',
        requestId: 'ai-farmer-secret-check',
      }),
    );
    const response = await askFarmerAssistantViaBackend(
      { question: 'ช่วยดูอาการใบเหลือง', clientRequestId: 'secret-check' },
      { fetcher },
    );
    const serialized = JSON.stringify(response);

    expect(response.status).toBe('not_configured');
    expect(serialized).not.toContain('VITE_OPENAI_API_KEY');
    expect(serialized).not.toContain('VITE_GEMINI_API_KEY');
    expect(serialized).not.toContain('OPENAI_API_KEY');
  });

  test('reads only the frontend-safe backend contract flag', () => {
    expect(isAIBackendContractEnabled({ aiBackendContractEnabled: true })).toBe(true);
    expect(isAIBackendContractEnabled({ aiBackendContractEnabled: false })).toBe(false);
  });
});
