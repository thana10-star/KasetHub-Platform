import { describe, expect, test, vi } from 'vitest';
import {
  GEMINI_FIELD_SHAPE_VERIFICATION_NOTE,
  GEMINI_FARMER_ASSISTANT_SYSTEM_INSTRUCTION,
  buildGeminiFarmerAssistantRequest,
} from './gemini-request-builder';

const baseRequest = {
  question: 'ใบมันสำปะหลังเหลืองหลังฝนตกควรเริ่มตรวจอะไร',
  crop: 'มันสำปะหลัง',
  province: 'นครราชสีมา',
  topic: 'plant_problem',
  userMode: 'guest',
  requestId: 'm145-request-builder',
} as const;

describe('M145 Gemini request builder', () => {
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
    expect(plan.body.systemInstruction.parts[0]?.text).toContain('สิ่งที่อาจเกิดขึ้น');
    expect(serialized).toContain(baseRequest.question);
    expect(serialized).toContain(baseRequest.crop);
    expect(serialized).toContain(baseRequest.province);
    expect(serialized).toContain(baseRequest.topic);
    expect(plan.body.generationConfig.maxOutputTokens).toBe(640);
    expect(plan.body.generationConfig.temperature).toBe(0.3);
    expect(plan.body.generationConfig.responseMimeType).toBe('text/plain');
    expect(plan.body.safetySettings.length).toBeGreaterThan(0);
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
