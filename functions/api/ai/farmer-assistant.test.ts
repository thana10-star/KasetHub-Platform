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

function debugFrom(payload: Record<string, unknown>) {
  return payload.debug as Record<string, unknown>;
}

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

  test('does not include debug metadata by default', async () => {
    const response = await handleFarmerAssistantRequest({
      request: request({
        question: 'à¹ƒà¸šà¸¡à¸°à¸™à¸²à¸§à¹€à¸«à¸¥à¸·à¸­à¸‡à¸„à¸§à¸£à¸•à¸£à¸§à¸ˆà¸­à¸°à¹„à¸£',
        topic: 'plant_problem',
        clientRequestId: 'debug-default-off',
      }),
      env: {
        AI_PROVIDER: 'gemini',
        AI_LIVE_ENABLED: 'false',
      },
    });
    const payload = await jsonResponse(response);

    expect(payload.status).toBe('ready');
    expect(payload.debug).toBeUndefined();
    expect(JSON.stringify(payload)).not.toContain('internalDebug');
  });

  test('includes safe validation debug metadata only when enabled', async () => {
    const response = await handleFarmerAssistantRequest({
      request: request({ question: '' }),
      env: {
        AI_DEBUG_RESPONSE: 'true',
        AI_MODEL: 'gemini-test-model',
      },
    });
    const payload = await jsonResponse(response);
    const debug = debugFrom(payload);
    const serialized = JSON.stringify(payload);

    expect(response.status).toBe(400);
    expect(payload.status).toBe('error');
    expect(debug.stage).toBe('validation');
    expect(debug.reasonCodes).toEqual(['validation_error']);
    expect(debug.liveGate).toBe('disabled');
    expect(debug.model).toBe('gemini-test-model');
    expect(serialized).not.toContain(fakeGeminiKey);
    expect(serialized).not.toContain('internalDebug');
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

  test('debug shows live key missing without exposing frontend or backend secrets', async () => {
    const fetchSpy = vi.fn(async () => geminiTextResponse());
    const response = await handleFarmerAssistantRequest({
      request: request({ question: 'à¹ƒà¸šà¸¡à¸±à¸™à¸ªà¸³à¸›à¸°à¸«à¸¥à¸±à¸‡à¹€à¸«à¸¥à¸·à¸­à¸‡à¸„à¸§à¸£à¹€à¸£à¸´à¹ˆà¸¡à¸•à¸£à¸§à¸ˆà¸­à¸°à¹„à¸£', clientRequestId: 'debug-missing-gemini-key' }),
      env: {
        AI_PROVIDER: 'gemini',
        AI_LIVE_ENABLED: 'true',
        AI_ALLOW_LIVE_EXECUTION: 'true',
        AI_MODEL: 'gemini-2.5-flash',
        AI_DEBUG_RESPONSE: 'true',
      },
      providerFetch: fetchSpy as unknown as typeof fetch,
    });
    const payload = await jsonResponse(response);
    const debug = debugFrom(payload);
    const serialized = JSON.stringify(payload);

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(payload.status).toBe('not_configured');
    expect(debug.stage).toBe('provider_select');
    expect(debug.reasonCodes).toEqual(['live_key_missing']);
    expect(debug.providerMode).toBe('live_blocked');
    expect(debug.liveGate).toBe('live_blocked');
    expect(debug.model).toBe('gemini-2.5-flash');
    expect(serialized).not.toContain('GEMINI_API_KEY');
    expect(serialized).not.toContain('x-goog-api-key');
    expect(serialized).not.toContain(fakeGeminiKey);
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

  test('debug marks successful mocked live response after output validation', async () => {
    const fetchSpy = vi.fn(async () => geminiTextResponse());
    const response = await handleFarmerAssistantRequest({
      request: request({
        question: 'à¹ƒà¸šà¸¡à¸±à¸™à¸ªà¸³à¸›à¸°à¸«à¸¥à¸±à¸‡à¹€à¸«à¸¥à¸·à¸­à¸‡à¸„à¸§à¸£à¹€à¸£à¸´à¹ˆà¸¡à¸•à¸£à¸§à¸ˆà¸­à¸°à¹„à¸£',
        topic: 'plant_problem',
        clientRequestId: 'm152-debug-live-success',
      }),
      env: {
        AI_PROVIDER: 'gemini',
        AI_LIVE_ENABLED: 'true',
        AI_ALLOW_LIVE_EXECUTION: 'true',
        AI_MODEL: 'gemini-2.5-flash',
        AI_DEBUG_RESPONSE: 'true',
        GEMINI_API_KEY: fakeGeminiKey,
      },
      providerFetch: fetchSpy as unknown as typeof fetch,
    });
    const payload = await jsonResponse(response);
    const debug = debugFrom(payload);
    const serialized = JSON.stringify(payload);

    expect(payload.status).toBe('ready');
    expect(payload.provider).toBe('gemini');
    expect(payload.providerMode).toBe('live');
    expect(debug.stage).toBe('success');
    expect(debug.reasonCodes).toEqual(['success_live_validated']);
    expect(debug.providerMode).toBe('live');
    expect(debug.liveGate).toBe('live');
    expect(debug.model).toBe('gemini-2.5-flash');
    expect(serialized).not.toContain(fakeGeminiKey);
    expect(serialized).not.toContain('https://gemini');
    expect(serialized).not.toContain('x-goog-api-key');
    expect(serialized).not.toContain('internalDebug');
  });

  test('sends M151 cassava question with crop/problem direct-answer context in mocked live endpoint request body', async () => {
    const question = 'ใบมันสำปะหลังเหลืองควรเริ่มตรวจอะไร';
    const fetchSpy = vi.fn(async () =>
      geminiTextResponse(
        '1. สิ่งที่ควรตรวจเช็กก่อน\nดูว่าใบเหลืองที่ใบล่างหรือใบอ่อน ดินแฉะหรือน้ำขังไหม และมีรากหรือโคนเน่าหรือไม่\n2. สาเหตุที่พบบ่อย\nน้ำมาก ดินแน่น ขาดธาตุอาหาร โรคหรือแมลง\n3. วิธีเริ่มแก้แบบปลอดภัย\nถ่ายรูปอาการ ตรวจดินและน้ำก่อน ยังไม่ควรใช้สารเคมีแบบเดาสาเหตุ\n4. ข้อมูลที่ควรถามเพิ่ม\nอายุพืช จังหวัด และเริ่มเหลืองมากี่วัน',
      ),
    );
    const response = await handleFarmerAssistantRequest({
      request: request({
        question,
        topic: 'plant_problem',
        userMode: 'guest',
        clientRequestId: 'm150-cassava-live-body',
      }),
      env: {
        AI_PROVIDER: 'gemini',
        AI_LIVE_ENABLED: 'true',
        AI_ALLOW_LIVE_EXECUTION: 'true',
        AI_MODEL: 'gemini-test-model',
        GEMINI_API_KEY: fakeGeminiKey,
      },
      providerFetch: fetchSpy as unknown as typeof fetch,
    });
    const payload = await jsonResponse(response);
    const [, init] = fetchSpy.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(String(init.body)) as {
      contents?: Array<{ parts?: Array<{ text?: string }> }>;
    };
    const parts = body.contents?.[0]?.parts ?? [];
    const serializedPayload = JSON.stringify(payload);
    const directTaskPart = parts[0]?.text ?? '';
    const questionPart = parts[1]?.text ?? '';
    const contextPart = parts[2]?.text ?? '';
    const instructionPart = parts[3]?.text ?? '';

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(parts).toHaveLength(4);
    expect(directTaskPart).toContain('Direct task');
    expect(directTaskPart).toContain('ตอบคำถามนี้โดยตรง');
    expect(directTaskPart).toContain('Detected crop: มันสำปะหลัง');
    expect(directTaskPart).toContain('Detected problem: ใบเหลือง');
    expect(directTaskPart).toContain('Task: ให้คำแนะนำเบื้องต้นว่าใบมันสำปะหลังเหลืองควรเริ่มตรวจอะไร');
    expect(directTaskPart).toContain('Required answer opening: "ใบมันสำปะหลังเหลือง ควรเริ่มตรวจ..."');
    expect(directTaskPart).toContain('do not answer only with clarification questions');
    expect(questionPart).toContain('Farmer question');
    expect(questionPart).toContain(question);
    expect(contextPart).toContain('topic: plant_problem');
    expect(contextPart).toContain('crop: มันสำปะหลัง');
    expect(contextPart).toContain('cropContextSource: detected_from_question');
    expect(contextPart).toContain('problem: ใบเหลือง');
    expect(contextPart).toContain('problemContextSource: detected_from_question');
    expect(contextPart).toContain('province: not provided');
    expect(instructionPart).toContain('Answer the farmer question directly first');
    expect(instructionPart).toContain('Do not say the question is unclear or missing');
    expect(instructionPart).toContain('Do not answer only with clarification questions');
    expect(instructionPart).toContain('1. ตรวจใบและตำแหน่งที่เหลือง');
    expect(instructionPart).toContain('6. ข้อมูลที่ควรถามเพิ่ม');
    expect(payload.status).toBe('ready');
    expect(payload.provider).toBe('gemini');
    expect(payload.providerMode).toBe('live');
    expect(String(payload.answer)).toContain('สิ่งที่ควรตรวจเช็กก่อน');
    expect(serializedPayload).not.toContain(fakeGeminiKey);
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

  test('debug marks high-risk input block before mocked live provider fetch', async () => {
    const fetchSpy = vi.fn(async () => geminiTextResponse());
    const response = await handleFarmerAssistantRequest({
      request: request({
        question: 'mix pesticide chemical acid for insects',
        topic: 'plant_problem',
        clientRequestId: 'm152-debug-high-risk',
      }),
      env: {
        AI_PROVIDER: 'gemini',
        AI_LIVE_ENABLED: 'true',
        AI_ALLOW_LIVE_EXECUTION: 'true',
        AI_DEBUG_RESPONSE: 'true',
        GEMINI_API_KEY: fakeGeminiKey,
      },
      providerFetch: fetchSpy as unknown as typeof fetch,
    });
    const payload = await jsonResponse(response);
    const debug = debugFrom(payload);
    const serialized = JSON.stringify(payload);

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(payload.status).toBe('blocked');
    expect(debug.stage).toBe('input_safety_block');
    expect(debug.reasonCodes).toEqual(['input_high_risk_blocked']);
    expect(serialized).not.toContain(fakeGeminiKey);
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

  test('debug marks unsafe mocked live Gemini output as output validator fallback', async () => {
    const fetchSpy = vi.fn(async () => geminiTextResponse('mix pesticide chemical acid to kill insects faster'));
    const response = await handleFarmerAssistantRequest({
      request: request({ question: 'à¸Šà¹ˆà¸§à¸¢à¸”à¸¹à¹à¸¡à¸¥à¸‡à¹ƒà¸™à¹à¸›à¸¥à¸‡à¸œà¸±à¸', clientRequestId: 'm152-debug-unsafe-live-output' }),
      env: {
        AI_PROVIDER: 'gemini',
        AI_LIVE_ENABLED: 'true',
        AI_ALLOW_LIVE_EXECUTION: 'true',
        AI_DEBUG_RESPONSE: 'true',
        GEMINI_API_KEY: fakeGeminiKey,
      },
      providerFetch: fetchSpy as unknown as typeof fetch,
    });
    const payload = await jsonResponse(response);
    const debug = debugFrom(payload);
    const serialized = JSON.stringify(payload);

    expect(payload.status).toBe('blocked');
    expect(debug.stage).toBe('output_validator');
    expect(debug.reasonCodes).toContain('dangerous_chemical_mixing');
    expect(debug.providerMode).toBe('live');
    expect(serialized).not.toContain('chemical acid');
    expect(serialized).not.toContain(fakeGeminiKey);
  });

  test('debug marks parser failures without leaking raw Gemini response', async () => {
    const fetchSpy = vi.fn(async () =>
      new Response(JSON.stringify({ candidates: [{ content: { parts: [] }, finishReason: 'STOP' }] }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    );
    const response = await handleFarmerAssistantRequest({
      request: request({ question: 'à¹ƒà¸šà¸¡à¸±à¸™à¸ªà¸³à¸›à¸°à¸«à¸¥à¸±à¸‡à¹€à¸«à¸¥à¸·à¸­à¸‡à¸„à¸§à¸£à¹€à¸£à¸´à¹ˆà¸¡à¸•à¸£à¸§à¸ˆà¸­à¸°à¹„à¸£', clientRequestId: 'm152-debug-parser' }),
      env: {
        AI_PROVIDER: 'gemini',
        AI_LIVE_ENABLED: 'true',
        AI_ALLOW_LIVE_EXECUTION: 'true',
        AI_MODEL: 'gemini-2.5-pro',
        AI_DEBUG_RESPONSE: 'true',
        GEMINI_API_KEY: fakeGeminiKey,
      },
      providerFetch: fetchSpy as unknown as typeof fetch,
    });
    const payload = await jsonResponse(response);
    const debug = debugFrom(payload);
    const serialized = JSON.stringify(payload);

    expect(payload.status).toBe('error');
    expect(payload.provider).toBe('disabled');
    expect(debug.stage).toBe('parser');
    expect(debug.reasonCodes).toEqual(['gemini_missing_text']);
    expect(debug.model).toBe('gemini-2.5-pro');
    expect(serialized).not.toContain('parts');
    expect(serialized).not.toContain('finishReason');
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

  test('debug marks provider timeout without leaking slow provider output', async () => {
    const response = await handleFarmerAssistantRequest({
      request: request({ question: 'à¸Šà¹ˆà¸§à¸¢à¹à¸™à¸°à¸™à¸³à¸à¸²à¸£à¹ƒà¸«à¹‰à¸™à¹‰à¸³à¸œà¸±à¸', clientRequestId: 'm152-debug-timeout' }),
      env: {
        AI_PROVIDER: 'gemini',
        AI_PROVIDER_TIMEOUT_MS: '5',
        AI_DEBUG_RESPONSE: 'true',
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
            answer: 'à¸„à¸³à¸•à¸­à¸šà¸Šà¹‰à¸²',
            safetyLevel: 'normal',
            provider: 'mock',
            providerMode: 'dry_run',
            requestId: providerRequest.requestId,
          };
        },
      },
    });
    const payload = await jsonResponse(response);
    const debug = debugFrom(payload);
    const serialized = JSON.stringify(payload);

    expect(response.status).toBe(504);
    expect(payload.status).toBe('error');
    expect(debug.stage).toBe('provider_timeout');
    expect(debug.reasonCodes).toEqual(['provider_timeout']);
    expect(serialized).not.toContain('à¸„à¸³à¸•à¸­à¸šà¸Šà¹‰à¸²');
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
