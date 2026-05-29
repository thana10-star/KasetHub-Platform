import type { FarmerAssistantProviderRequest } from './provider-types';
import {
  buildGeminiSafetySettings,
  type GeminiSafetySetting,
} from './gemini-safety-settings';

export const GEMINI_MODEL_TO_VERIFY_BEFORE_LIVE = 'gemini-model-to-verify-before-live-activation';

export const GEMINI_FIELD_SHAPE_VERIFICATION_NOTE =
  'Verify Gemini generateContent field names, model name, and safety categories against current Gemini documentation before live activation.';

export const GEMINI_FARMER_ASSISTANT_SYSTEM_INSTRUCTION = [
  'คุณคือผู้ช่วยเกษตรของ KasetHub สำหรับเกษตรกรไทย',
  'ตอบเป็นภาษาไทย ใช้ภาษาง่าย เป็นมิตร และปฏิบัติได้จริง',
  'ตอบไม่ยาวเกินไป และแยกคำตอบเป็น 4 ส่วนนี้เสมอ:',
  '1. สิ่งที่อาจเกิดขึ้น',
  '2. สิ่งที่ควรตรวจเช็ก',
  '3. วิธีเริ่มแก้แบบปลอดภัย',
  '4. เมื่อไหร่ควรถามผู้เชี่ยวชาญ',
  'ถ้าข้อมูลยังไม่พอ ให้ถามต่อเรื่องพืช จังหวัด อาการ ระยะเวลาที่พบ และสิ่งที่ลองทำแล้ว',
  'ห้ามให้ความมั่นใจเรื่องอัตราสารเคมีหรือปุ๋ยโดยไม่มีฉลากหรือแหล่งข้อมูลที่ตรวจสอบแล้ว',
  'ห้ามสอนการผสมสารเคมีอันตรายหรือการใช้ที่เสี่ยงต่อคน สัตว์ หรือสิ่งแวดล้อม',
  'ห้ามอ้างราคาสินค้า สภาพอากาศ แหล่งข่าว หรือข้อมูลสด หากระบบไม่ได้ส่งข้อมูลนั้นมาให้โดยตรง',
  'ห้ามแต่งแหล่งอ้างอิง และอย่าอ้างว่าเป็นข้อมูลสดจากอินเทอร์เน็ต',
  'กรณีเสี่ยงสูง ให้แนะนำให้อ่านฉลาก หยุดการทดลองที่เสี่ยง และติดต่อสำนักงานเกษตรหรือผู้เชี่ยวชาญในพื้นที่',
].join('\n');

export type GeminiGenerationConfig = {
  maxOutputTokens: number;
  temperature: number;
  topP: number;
  responseMimeType: 'text/plain';
};

export type GeminiRequestBuilderConfig = {
  model?: string;
  maxOutputTokens?: number;
  temperature?: number;
  topP?: number;
  safetySettings?: GeminiSafetySetting[];
};

export type GeminiGenerateContentPart = {
  text: string;
};

export type GeminiGenerateContent = {
  role: 'user';
  parts: GeminiGenerateContentPart[];
};

export type GeminiGenerateContentRequestBody = {
  systemInstruction: {
    parts: GeminiGenerateContentPart[];
  };
  contents: GeminiGenerateContent[];
  generationConfig: GeminiGenerationConfig;
  safetySettings: GeminiSafetySetting[];
};

export type GeminiFarmerAssistantRequestPlan = {
  model: string;
  endpointPath: string;
  body: GeminiGenerateContentRequestBody;
  verificationNote: typeof GEMINI_FIELD_SHAPE_VERIFICATION_NOTE;
};

function normalizePositiveInteger(value: number | undefined, fallback: number): number {
  if (!Number.isFinite(value) || value === undefined) {
    return fallback;
  }

  return Math.max(1, Math.floor(value));
}

function normalizeTemperature(value: number | undefined): number {
  if (!Number.isFinite(value) || value === undefined) {
    return 0.3;
  }

  return Math.min(1, Math.max(0, value));
}

function normalizeTopP(value: number | undefined): number {
  if (!Number.isFinite(value) || value === undefined) {
    return 0.9;
  }

  return Math.min(1, Math.max(0.1, value));
}

function optionalContextLine(label: string, value?: string) {
  const trimmed = value?.trim();

  if (!trimmed) {
    return undefined;
  }

  return `- ${label}: ${trimmed}`;
}

export function buildGeminiFarmerAssistantUserPrompt(request: FarmerAssistantProviderRequest): string {
  const contextLines = [
    `- หัวข้อ: ${request.topic}`,
    `- โหมดผู้ใช้: ${request.userMode}`,
    optionalContextLine('พืช', request.crop),
    optionalContextLine('จังหวัด', request.province),
  ].filter((line): line is string => Boolean(line));

  return [
    'คำถามจากเกษตรกร:',
    request.question.trim(),
    '',
    'บริบทที่ระบบรู้:',
    ...contextLines,
    '',
    'คำเตือนสำหรับคำตอบ:',
    '- ถ้าเป็นคำถามเรื่องราคาหรืออากาศ ให้บอกว่าไม่มีข้อมูลสด เว้นแต่ระบบส่งข้อมูลสดมาให้',
    '- ถ้าเป็นคำถามเรื่องสารเคมี ให้หลีกเลี่ยงตัวเลขอัตราใช้ที่มั่นใจเกินไป และให้ยึดฉลากหรือผู้เชี่ยวชาญ',
  ].join('\n');
}

export function buildGeminiFarmerAssistantRequest(
  request: FarmerAssistantProviderRequest,
  config: GeminiRequestBuilderConfig = {},
): GeminiFarmerAssistantRequestPlan {
  const model = config.model?.trim() || GEMINI_MODEL_TO_VERIFY_BEFORE_LIVE;
  const maxOutputTokens = normalizePositiveInteger(config.maxOutputTokens, 700);
  const temperature = normalizeTemperature(config.temperature);
  const topP = normalizeTopP(config.topP);
  const safetySettings = config.safetySettings ?? buildGeminiSafetySettings();

  return {
    model,
    endpointPath: `models/${model}:generateContent`,
    verificationNote: GEMINI_FIELD_SHAPE_VERIFICATION_NOTE,
    body: {
      systemInstruction: {
        parts: [
          {
            text: GEMINI_FARMER_ASSISTANT_SYSTEM_INSTRUCTION,
          },
        ],
      },
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: buildGeminiFarmerAssistantUserPrompt(request),
            },
          ],
        },
      ],
      generationConfig: {
        maxOutputTokens,
        temperature,
        topP,
        responseMimeType: 'text/plain',
      },
      safetySettings,
    },
  };
}
