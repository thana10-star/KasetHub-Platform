import { describe, expect, test, vi } from 'vitest';
import {
  GEMINI_FIELD_SHAPE_VERIFICATION_NOTE,
  GEMINI_FARMER_ASSISTANT_SYSTEM_INSTRUCTION,
  buildGeminiFarmerAssistantRequest,
  buildGeminiFarmerAssistantUserParts,
  detectThaiCropFromQuestion,
  detectThaiProblemFromQuestion,
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

describe('M145/M151 Gemini request builder', () => {
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
    expect(plan.body.systemInstruction.parts[0]?.text).toContain('ตรวจใบและตำแหน่งที่เหลือง');
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

  test('keeps the exact farmer question in its own prompt part after a direct task block', () => {
    const plan = buildGeminiFarmerAssistantRequest({
      ...baseRequest,
      question: m150SmokeQuestion,
      crop: undefined,
      province: undefined,
      requestId: 'm150-question-clarity',
    });
    const parts = plan.body.contents[0]?.parts ?? [];
    const directTaskPart = parts[0]?.text ?? '';
    const questionPart = parts[1]?.text ?? '';
    const contextPart = parts[2]?.text ?? '';
    const instructionPart = parts[3]?.text ?? '';

    expect(parts).toHaveLength(4);
    expect(directTaskPart).toContain('Direct task');
    expect(directTaskPart).toContain('ตอบคำถามนี้โดยตรง');
    expect(directTaskPart).toContain('ห้ามตอบว่าคำถามไม่ชัด');
    expect(directTaskPart).toContain('do not answer only with clarification questions');
    expect(directTaskPart).toContain('Detected crop: มันสำปะหลัง');
    expect(directTaskPart).toContain('Detected problem: ใบเหลือง');
    expect(directTaskPart).toContain('Task: ให้คำแนะนำเบื้องต้นว่าใบมันสำปะหลังเหลืองควรเริ่มตรวจอะไร');
    expect(directTaskPart).toContain('Required answer opening: "ใบมันสำปะหลังเหลือง ควรเริ่มตรวจ..."');
    expect(questionPart).toContain('Farmer question');
    expect(questionPart).toContain(m150SmokeQuestion);
    expect(questionPart.length).toBeLessThan(140);
    expect(contextPart).not.toContain(m150SmokeQuestion);
    expect(instructionPart).not.toContain(m150SmokeQuestion);
    expect(instructionPart).toContain('Answer the farmer question directly first');
    expect(instructionPart).toContain('Do not say the question is unclear or missing');
    expect(instructionPart).toContain('Do not answer only with clarification questions');
    expect(instructionPart).toContain('1. ตรวจใบและตำแหน่งที่เหลือง');
    expect(instructionPart).toContain('2. ตรวจน้ำและดิน');
    expect(instructionPart).toContain('3. ตรวจราก/โคนต้น');
    expect(instructionPart).toContain('4. ตรวจแมลงหรือโรค');
    expect(instructionPart).toContain('5. ตรวจธาตุอาหารและอายุพืช');
    expect(instructionPart).toContain('6. ข้อมูลที่ควรถามเพิ่ม');
  });

  test('derives cassava crop and yellow-leaf problem context from the M151 smoke question', () => {
    const plan = buildGeminiFarmerAssistantRequest({
      ...baseRequest,
      question: m150SmokeQuestion,
      crop: undefined,
      province: undefined,
      requestId: 'm150-cassava-detected',
    });
    const contextPart = plan.body.contents[0]?.parts[2]?.text ?? '';

    expect(detectThaiCropFromQuestion(m150SmokeQuestion)).toBe('มันสำปะหลัง');
    expect(detectThaiProblemFromQuestion(m150SmokeQuestion)).toBe('ใบเหลือง');
    expect(contextPart).toContain('topic: plant_problem');
    expect(contextPart).toContain('crop: มันสำปะหลัง');
    expect(contextPart).toContain('cropContextSource: detected_from_question');
    expect(contextPart).toContain('problem: ใบเหลือง');
    expect(contextPart).toContain('problemContextSource: detected_from_question');
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
    const contextPart = parts[2]?.text ?? '';

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
