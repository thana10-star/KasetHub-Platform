import { describe, expect, test, vi } from 'vitest';
import {
  GEMINI_FIELD_SHAPE_VERIFICATION_NOTE,
  GEMINI_FARMER_ASSISTANT_SYSTEM_INSTRUCTION,
  buildGeminiFarmerAssistantRequest,
  buildGeminiFarmerAssistantUserParts,
  detectThaiCropFromQuestion,
} from './gemini-request-builder';

const baseRequest = {
  question: 'ใบมันสำปะหลังเหลืองหลังฝนตกควรเริ่มตรวจอะไร',
  crop: 'มันสำปะหลัง',
  province: 'นครราชสีมา',
  topic: 'plant_problem',
  userMode: 'guest',
  requestId: 'm145-request-builder',
} as const;

const m150SmokeQuestion = 'ใบมันสำปะหลังเหลืองควรเริ่มตรวจอะไร';

describe('M145/M150 Gemini request builder', () => {
  test('builds a planned Gemini generateContent request with Thai farmer assistant instructions', () => {
    const plan = buildGeminiFarmerAssistantRequest(baseRequest, {
      model: 'gemini-model-under-test',
      maxOutputTokens: 640,
    });
    const serialized = JSON.stringify(plan);

    expect(plan.model).toBe('gemini-model-under-test');
    expect(plan.endpointPath).toBe('models/gemini-model-under-test:generateContent');
    expect(plan.verificationNote).toBe(GEMINI_FIELD_SHAPE_VERIFICATION_NOTE);
    expect(plan.body.systemInstruction.parts[0]?.text).toBe(GEMINI_FARMER_ASSISTANT_SYSTEM_INSTRUCTION);
    expect(plan.body.systemInstruction.parts[0]?.text).toMatch(/[\u0E00-\u0E7F]/);
    expect(plan.body.systemInstruction.parts[0]?.text).toContain('สิ่งที่ควรตรวจเช็กก่อน');
    expect(plan.body.systemInstruction.parts[0]?.text).toContain('ตอบคำถามของเกษตรกรโดยตรงก่อนเสมอ');
    expect(serialized).toContain(baseRequest.question);
    expect(serialized).toContain(baseRequest.crop);
    expect(serialized).toContain(baseRequest.province);
    expect(serialized).toContain(baseRequest.topic);
    expect(plan.body.generationConfig.maxOutputTokens).toBe(640);
    expect(plan.body.generationConfig.temperature).toBe(0.3);
    expect(plan.body.generationConfig.responseMimeType).toBe('text/plain');
    expect(plan.body.safetySettings.length).toBeGreaterThan(0);
  });

  test('keeps the exact farmer question in its own prompt part', () => {
    const plan = buildGeminiFarmerAssistantRequest({
      ...baseRequest,
      question: m150SmokeQuestion,
      crop: undefined,
      province: undefined,
      requestId: 'm150-question-clarity',
    });
    const parts = plan.body.contents[0]?.parts ?? [];
    const questionPart = parts[0]?.text ?? '';
    const contextPart = parts[1]?.text ?? '';
    const instructionPart = parts[2]?.text ?? '';

    expect(parts).toHaveLength(3);
    expect(questionPart).toContain('Farmer question');
    expect(questionPart).toContain(m150SmokeQuestion);
    expect(questionPart.length).toBeLessThan(140);
    expect(contextPart).not.toContain(m150SmokeQuestion);
    expect(instructionPart).not.toContain(m150SmokeQuestion);
    expect(instructionPart).toContain('Answer the farmer question directly first');
    expect(instructionPart).toContain('Do not say the question is unclear or missing');
  });

  test('derives cassava crop context from the M150 smoke question', () => {
    const plan = buildGeminiFarmerAssistantRequest({
      ...baseRequest,
      question: m150SmokeQuestion,
      crop: undefined,
      province: undefined,
      requestId: 'm150-cassava-detected',
    });
    const contextPart = plan.body.contents[0]?.parts[1]?.text ?? '';

    expect(detectThaiCropFromQuestion(m150SmokeQuestion)).toBe('มันสำปะหลัง');
    expect(contextPart).toContain('topic: plant_problem');
    expect(contextPart).toContain('crop: มันสำปะหลัง');
    expect(contextPart).toContain('cropContextSource: detected_from_question');
    expect(contextPart).toContain('province: not provided');
    expect(contextPart).toContain('userMode: guest');
  });

  test('uses provided crop over detected crop context', () => {
    const parts = buildGeminiFarmerAssistantUserParts({
      ...baseRequest,
      question: 'ใบมันสำปะหลังเหลืองในแปลงทดลอง',
      crop: 'ข้าว',
      requestId: 'provided-crop-wins',
    });
    const contextPart = parts[1]?.text ?? '';

    expect(contextPart).toContain('crop: ข้าว');
    expect(contextPart).toContain('cropContextSource: provided_by_client');
  });

  test('uses conservative generation defaults and clamps unsafe numeric config', () => {
    const plan = buildGeminiFarmerAssistantRequest(baseRequest, {
      maxOutputTokens: -5,
      temperature: 2,
      topP: 4,
    });

    expect(plan.body.generationConfig.maxOutputTokens).toBe(1);
    expect(plan.body.generationConfig.temperature).toBe(1);
    expect(plan.body.generationConfig.topP).toBe(1);
  });

  test('does not include secret fields or call fetch', () => {
    const originalFetch = globalThis.fetch;
    const fetchSpy = vi.fn(async () => new Response('{}'));
    globalThis.fetch = fetchSpy as typeof fetch;

    try {
      const plan = buildGeminiFarmerAssistantRequest(baseRequest);
      const serialized = JSON.stringify(plan);

      expect(fetchSpy).not.toHaveBeenCalled();
      expect(serialized).not.toContain('GEMINI_API_KEY');
      expect(serialized).not.toContain('OPENAI_API_KEY');
      expect(serialized).not.toContain('VITE_GEMINI_API_KEY');
      expect(serialized).not.toContain('AIza');
      expect(serialized).not.toContain('apiKey');
      expect(serialized).not.toContain('Authorization');
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});
