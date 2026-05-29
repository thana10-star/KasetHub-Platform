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

export const COMMON_THAI_PROBLEM_TERMS = [
  'ใบเหลือง',
  'ใบไหม้',
  'ใบร่วง',
  'ต้นแคระ',
  'รากเน่า',
  'โคนเน่า',
  'เชื้อรา',
  'น้ำขัง',
  'ดินแฉะ',
  'ขาดปุ๋ย',
  'เพลี้ย',
  'แมลง',
] as const;

type ResolvedPromptContext = {
  value: string;
  source: 'provided_by_client' | 'detected_from_question' | 'not_provided';
};

export const GEMINI_FARMER_ASSISTANT_SYSTEM_INSTRUCTION = [
  'คุณคือผู้ช่วยเกษตรของ KasetHub สำหรับเกษตรกรไทย',
  'ตอบเป็นภาษาไทย ใช้ภาษาง่าย เป็นมิตร และปฏิบัติได้จริง',
  'ตอบสั้นพอดี ไม่ยาวเกินไป และเน้นสิ่งที่เกษตรกรเริ่มตรวจได้ทันที',
  'หน้าที่หลักคือช่วยตอบคำถามที่ผู้ใช้ส่งมา ไม่ใช่เริ่มจากการทักทายทั่วไป',
  'ห้ามเริ่มคำตอบด้วยคำทักทายทั่วไป เช่น "สวัสดีครับ" หรือ "KasetHub ยินดีช่วยเหลือ" เมื่อมีคำถามเกษตรชัดเจน',
  'ตอบคำถามของเกษตรกรโดยตรงก่อนเสมอ ถ้าข้อความคำถามไม่ว่าง ห้ามตอบว่าคำถามไม่ชัดหรือยังไม่ได้รับคำถาม',
  'ถ้าระบบตรวจพบพืชหรือปัญหาจากคำถาม ให้ใช้ข้อมูลนั้นเป็นบริบทและให้คำแนะนำตรวจเช็กเบื้องต้นทันที',
  'ถ้ารายละเอียดบางอย่างยังขาด ให้ตอบด้วยขั้นตอนตรวจเช็กเบื้องต้นที่ปลอดภัยก่อน แล้วค่อยถามข้อมูลเพิ่มท้ายคำตอบ',
  'ถ้าผู้ใช้ถามเรื่องมันสำปะหลังใบเหลือง ให้เริ่มคำตอบด้วยแนวทางประมาณ "ใบมันสำปะหลังเหลือง ควรเริ่มตรวจ..."',
  'ใช้รูปแบบ 6 ส่วนนี้สำหรับปัญหาพืช:',
  '1. ตรวจใบและตำแหน่งที่เหลือง',
  '2. ตรวจน้ำและดิน',
  '3. ตรวจราก/โคนต้น',
  '4. ตรวจแมลงหรือโรค',
  '5. ตรวจธาตุอาหารและอายุพืช',
  '6. ข้อมูลที่ควรถามเพิ่ม',
  'สำหรับปัญหาใบเหลือง ให้เริ่มจากการตรวจว่าเหลืองทั้งต้นหรือเฉพาะใบล่าง/ใบอ่อน ดินแฉะหรือน้ำขังหรือไม่ รากหรือโคนเน่าหรือไม่ มีแมลงหรือโรคหรือไม่ อายุพืชเท่าไร และช่วงนี้ฝนหรือแล้งผิดปกติหรือไม่',
  'ห้ามตอบเฉพาะคำถามกลับหรือขอข้อมูลเพิ่มอย่างเดียว หากคำถามมีเบาะแสพืชหรือปัญหาแล้ว',
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

export function detectThaiProblemFromQuestion(question: string) {
  const normalizedQuestion = normalizeThaiSearchText(question);
  const directProblem = COMMON_THAI_PROBLEM_TERMS.find((problem) => normalizedQuestion.includes(normalizeThaiSearchText(problem)));

  if (directProblem) {
    return directProblem;
  }

  if (normalizedQuestion.includes('ใบ') && normalizedQuestion.includes('เหลือง')) {
    return 'ใบเหลือง';
  }

  if (normalizedQuestion.includes('ใบ') && normalizedQuestion.includes('ไหม้')) {
    return 'ใบไหม้';
  }

  if (normalizedQuestion.includes('ใบ') && normalizedQuestion.includes('ร่วง')) {
    return 'ใบร่วง';
  }

  return undefined;
}

function cleanOptionalText(value?: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function resolveCropContext(request: FarmerAssistantProviderRequest): ResolvedPromptContext {
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

function resolveProblemContext(request: FarmerAssistantProviderRequest): ResolvedPromptContext {
  const detectedProblem = detectThaiProblemFromQuestion(request.question);

  if (detectedProblem) {
    return {
      value: detectedProblem,
      source: 'detected_from_question',
    };
  }

  return {
    value: 'not provided',
    source: 'not_provided',
  };
}

function hasDetectedValue(context: ResolvedPromptContext) {
  return context.source !== 'not_provided';
}

function buildRequiredOpening(crop: ResolvedPromptContext, problem: ResolvedPromptContext) {
  if (hasDetectedValue(crop) && problem.value === 'ใบเหลือง') {
    return `ใบ${crop.value}เหลือง ควรเริ่มตรวจ...`;
  }

  if (hasDetectedValue(crop) && hasDetectedValue(problem)) {
    return `${crop.value}มีอาการ${problem.value} ควรเริ่มตรวจ...`;
  }

  if (hasDetectedValue(problem)) {
    return `อาการ${problem.value} ควรเริ่มตรวจ...`;
  }

  return 'ควรเริ่มตรวจ...';
}

function buildTaskSummary(crop: ResolvedPromptContext, problem: ResolvedPromptContext) {
  if (hasDetectedValue(crop) && problem.value === 'ใบเหลือง') {
    return `ให้คำแนะนำเบื้องต้นว่าใบ${crop.value}เหลืองควรเริ่มตรวจอะไร`;
  }

  if (hasDetectedValue(crop) && hasDetectedValue(problem)) {
    return `ให้คำแนะนำเบื้องต้นสำหรับ${crop.value}ที่มีอาการ${problem.value}`;
  }

  return 'ให้คำแนะนำเบื้องต้นตามคำถามของเกษตรกร';
}

function buildDirectTaskPrompt(request: FarmerAssistantProviderRequest) {
  const crop = resolveCropContext(request);
  const problem = resolveProblemContext(request);

  return [
    'Direct task / งานที่ต้องทำทันที:',
    'ตอบคำถามนี้โดยตรง ห้ามตอบว่าคำถามไม่ชัด ถ้ามีคำถามอยู่แล้ว ให้เริ่มด้วยคำแนะนำตรวจเช็กเบื้องต้นทันที',
    'If the user provided a concrete crop/problem clue, do not answer only with clarification questions.',
    'ห้ามเริ่มด้วยคำทักทายทั่วไป ให้เริ่มด้วยคำตอบของปัญหาโดยตรง',
    `Detected crop: ${crop.value}`,
    `Detected crop source: ${crop.source}`,
    `Detected problem: ${problem.value}`,
    `Detected problem source: ${problem.source}`,
    `Task: ${buildTaskSummary(crop, problem)}`,
    `Required answer opening: "${buildRequiredOpening(crop, problem)}"`,
  ].join('\n');
}

function buildDetectedContextPrompt(request: FarmerAssistantProviderRequest) {
  const crop = resolveCropContext(request);
  const problem = resolveProblemContext(request);
  const province = cleanOptionalText(request.province) ?? 'not provided';

  return [
    'Detected context / บริบทที่ระบบรู้:',
    `- topic: ${request.topic}`,
    `- crop: ${crop.value}`,
    `- cropContextSource: ${crop.source}`,
    `- problem: ${problem.value}`,
    `- problemContextSource: ${problem.source}`,
    `- province: ${province}`,
    `- userMode: ${request.userMode}`,
  ].join('\n');
}

function buildAnswerInstructionPrompt() {
  return [
    'Answer instruction / วิธีตอบ:',
    '- Start with the required answer opening when it is specific.',
    '- Answer the farmer question directly first.',
    '- Do not say the question is unclear or missing when Farmer question has text.',
    '- Do not answer only with clarification questions.',
    '- If crop, province, age, or symptom details are missing, still provide safe first-check steps first, then ask follow-up questions.',
    '- Use exactly these sections for plant-problem questions:',
    '1. ตรวจใบและตำแหน่งที่เหลือง',
    '2. ตรวจน้ำและดิน',
    '3. ตรวจราก/โคนต้น',
    '4. ตรวจแมลงหรือโรค',
    '5. ตรวจธาตุอาหารและอายุพืช',
    '6. ข้อมูลที่ควรถามเพิ่ม',
    '- For cassava yellow leaves, mention safe checks such as leaf position, waterlogging/wet soil, nutrient stress, root/stem rot, insect/disease signs, crop age, and recent rain/dry conditions.',
    '- Do not give chemical dosage certainty, dangerous mixing instructions, fake citations, fake live weather, fake price, or fake source claims.',
  ].join('\n');
}

export function buildGeminiFarmerAssistantUserParts(request: FarmerAssistantProviderRequest): GeminiGenerateContentPart[] {
  return [
    {
      text: buildDirectTaskPrompt(request),
    },
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
