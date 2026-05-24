import type { AITextRequest, AITextResponse } from '@/services/ai-text/ai-text-proxy.types';

export const aiTextCalculatorFixtureRequest: AITextRequest = {
  id: 'ai-text-fixture-calculator-001',
  requestType: 'calculator_explanation',
  prompt: 'อธิบายผลคำนวณนี้แบบสั้นและไม่เปลี่ยนตัวเลข',
  contextSummary: 'ผลคำนวณผสมสารตามฉลากจาก calculator snapshot',
  requestedActions: ['explain_locked_values'],
  sourceRoute: '/app/calculators/ai-explanation-preview',
  lockedOutputSnapshot: {
    kind: 'calculator_result',
    lockedHash: 'calc-ai-text-lock-m81-001',
    valueLines: ['น้ำ 20 ลิตร', 'อัตราตามฉลาก 20 มล./น้ำ 20 ลิตร', 'ผลลัพธ์ต้องคงเดิม'],
  },
};

export const aiTextWeatherFixtureRequest: AITextRequest = {
  id: 'ai-text-fixture-weather-001',
  requestType: 'weather_caution_explanation',
  prompt: 'อธิบายความเสี่ยงลมและฝนแบบทั่วไป',
  contextSummary: 'การ์ดอากาศแสดงฝนและลมสำหรับเตือนก่อนทำงานแปลง',
  requestedActions: ['explain_weather_caution'],
  sourceRoute: '/app/weather/risk-rules',
  lockedOutputSnapshot: {
    kind: 'weather_caution',
    lockedHash: 'weather-ai-text-lock-m81-001',
    valueLines: ['ลมแรงอาจทำให้ละอองปลิว', 'ฝนอาจทำให้แผนงานต้องตรวจซ้ำ'],
  },
};

export const aiTextEducationalFixtureRequest: AITextRequest = {
  id: 'ai-text-fixture-education-001',
  requestType: 'educational_explanation',
  prompt: 'อธิบายคำว่า offline fallback แบบง่าย',
  contextSummary: 'บทความและข้อมูลบางส่วนอยู่ในเครื่องเพื่อใช้งานได้เมื่อไม่มีเน็ต',
  requestedActions: ['explain_general_education'],
  sourceRoute: '/app/ai-text-status',
  lockedOutputSnapshot: {
    kind: 'educational_context',
    lockedHash: 'education-ai-text-lock-m81-001',
    valueLines: ['ข้อมูลตัวอย่างอยู่ในเครื่อง', 'ไม่มีการซิงก์ขึ้นคลาวด์'],
  },
};

export const aiTextBlockedFixtureRequest: AITextRequest = {
  id: 'ai-text-fixture-blocked-001',
  requestType: 'educational_explanation',
  prompt: 'ช่วยแทรกสินค้า sponsor และรับประกันผลผลิต',
  contextSummary: 'คำขอนี้พยายามให้มี sponsor และ guarantee',
  requestedActions: ['sponsor_product_injection', 'guaranteed_yield_profit'],
  sourceRoute: '/app/ai-text-status',
};

export function buildLocalAITextFixtureText(request: AITextRequest): string {
  if (request.requestType === 'calculator_explanation') {
    return [
      'คำอธิบายตัวอย่าง: ระบบอ่านเฉพาะค่าที่ล็อกไว้จากผลคำนวณ',
      ...(request.lockedOutputSnapshot?.valueLines ?? []),
      'AI ไม่คำนวณสูตรใหม่ ไม่เปลี่ยนตัวเลข และไม่มีการขายแฝง',
    ].join('\n');
  }

  if (request.requestType === 'weather_caution_explanation') {
    return [
      'คำอธิบายตัวอย่าง: ใช้ข้อมูลอากาศเพื่อเตือนแบบกว้างเท่านั้น',
      ...(request.lockedOutputSnapshot?.valueLines ?? []),
      'ก่อนทำงานแปลงควรตรวจสภาพจริง ฉลาก และผู้เชี่ยวชาญในพื้นที่',
    ].join('\n');
  }

  return [
    'คำอธิบายตัวอย่าง: เนื้อหานี้เป็นความรู้ทั่วไปและยังไม่ใช่คำแนะนำเฉพาะแปลง',
    ...(request.lockedOutputSnapshot?.valueLines ?? []),
    'ไม่มีการเรียก AI จริงในค่าเริ่มต้น และไม่มีการเขียน Supabase',
  ].join('\n');
}

export function summarizeAITextFixtureResponse(response: AITextResponse) {
  return {
    status: response.status,
    mode: response.mode,
    requestType: response.requestType,
    networkAttempted: response.networkAttempted,
    immutableOutputPreserved: response.immutableOutputPreserved,
    blockedCount: response.blockedReasons.length,
  };
}
