import type { FarmerAssistantProviderRequest } from './provider-types';
import {
  buildGeminiSafetySettings,
  type GeminiSafetySetting,
} from './gemini-safety-settings';

export const GEMINI_MODEL_TO_VERIFY_BEFORE_LIVE = 'gemini-model-to-verify-before-live-activation';

export const GEMINI_FIELD_SHAPE_VERIFICATION_NOTE =
  'Verify Gemini generateContent field names, model name, and safety categories against current Gemini documentation before live activation.';

export const COMMON_THAI_CROP_NAMES = [
  'มันสำปะหลัง',
  'ข้าวโพด',
  'ยางพารา',
  'ทุเรียน',
  'มะม่วง',
  'พริก',
  'อ้อย',
  'ข้าว',
] as const;

export const GEMINI_FARMER_ASSISTANT_SYSTEM_INSTRUCTION = [
  'คุณคือผู้ช่วยเกษตรของ KasetHub สำหรับเกษตรกรไทย',
  'ตอบเป็นภาษาไทย ใช้ภาษาง่าย เป็นมิตร และปฏิบัติได้จริง',
  'ตอบสั้นพอดี ไม่ยาวเกินไป และเน้นสิ่งที่เกษตรกรเริ่มตรวจได้ทันที',
  'ตอบคำถามของเกษตรกรโดยตรงก่อนเสมอ ถ้าข้อความคำถามไม่ว่าง ห้ามตอบว่าไม่ได้รับคำถามที่ชัดเจน',
  'ถ้ารายละเอียดบางอย่างยังขาด ให้ตอบด้วยขั้นตอนตรวจเช็กเบื้องต้นที่ปลอดภัยก่อน แล้วค่อยถามข้อมูลเพิ่มท้ายคำตอบ',
  'ใช้รูปแบบ 4 ส่วนนี้เสมอ:',
  '1. สิ่งที่ควรตรวจเช็กก่อน',
  '2. สาเหตุที่พบบ่อย',
  '3. วิธีเริ่มแก้แบบปลอดภัย',
  '4. ข้อมูลที่ควรถามเพิ่ม',
  'สำหรับปัญหาใบเหลือง ให้เริ่มจากการตรวจว่าเหลืองทั้งต้นหรือเฉพาะใบล่าง/ใบอ่อน ดินแฉะหรือน้ำขังหรือไม่ รากหรือโคนเน่าหรือไม่ มีแมลงหรือโรคหรือไม่ อายุพืชเท่าไร และช่วงนี้ฝนหรือแล้งผิดปกติหรือไม่',
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

function normalizeThaiSearchText(value: string) {
  return value.replace(/\s+/g, '').trim();
}

export function detectThaiCropFromQuestion(question: string) {
  const normalizedQuestion = normalizeThaiSearchText(question);

  return COMMON_THAI_CROP_NAMES.find((crop) => normalizedQuestion.includes(normalizeThaiSearchText(crop)));
}

function cleanOptionalText(value?: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function resolveCropContext(request: FarmerAssistantProviderRequest) {
  const providedCrop = cleanOptionalText(request.crop);

  if (providedCrop) {
    return {
      value: providedCrop,
      source: 'provided_by_client',
    };
  }

  const detectedCrop = detectThaiCropFromQuestion(request.question);

  if (detectedCrop) {
    return {
      value: detectedCrop,
      source: 'detected_from_question',
    };
  }

  return {
    value: 'not provided',
    source: 'not_provided',
  };
}

function buildDetectedContextPrompt(request: FarmerAssistantProviderRequest) {
  const crop = resolveCropContext(request);
  const province = cleanOptionalText(request.province) ?? 'not provided';

  return [
    'Detected context / บริบทที่ระบบรู้:',
    `- topic: ${request.topic}`,
    `- crop: ${crop.value}`,
    `- cropContextSource: ${crop.source}`,
    `- province: ${province}`,
    `- userMode: ${request.userMode}`,
  ].join('\n');
}

function buildAnswerInstructionPrompt() {
  return [
    'Answer instruction / วิธีตอบ:',
    '- Answer the farmer question directly first.',
    '- Do not say the question is unclear or missing when Farmer question has text.',
    '- If crop, province, age, or symptom details are missing, still provide safe first-check steps first, then ask follow-up questions.',
    '- Use exactly these sections:',
    '1. สิ่งที่ควรตรวจเช็กก่อน',
    '2. สาเหตุที่พบบ่อย',
    '3. วิธีเริ่มแก้แบบปลอดภัย',
    '4. ข้อมูลที่ควรถามเพิ่ม',
    '- For cassava yellow leaves, mention safe checks such as leaf position, waterlogging/wet soil, nutrient stress, root/stem rot, insect/disease signs, crop age, and recent rain/dry conditions.',
    '- Do not give chemical dosage certainty, dangerous mixing instructions, fake citations, fake live weather, fake price, or fake source claims.',
  ].join('\n');
}

export function buildGeminiFarmerAssistantUserParts(request: FarmerAssistantProviderRequest): GeminiGenerateContentPart[] {
  return [
    {
      text: ['Farmer question / คำถามเกษตรกรที่ต้องตอบโดยตรง:', request.question.trim()].join('\n'),
    },
    {
      text: buildDetectedContextPrompt(request),
    },
    {
      text: buildAnswerInstructionPrompt(),
    },
  ];
}

export function buildGeminiFarmerAssistantUserPrompt(request: FarmerAssistantProviderRequest): string {
  return buildGeminiFarmerAssistantUserParts(request)
    .map((part) => part.text)
    .join('\n\n');
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
          parts: buildGeminiFarmerAssistantUserParts(request),
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
