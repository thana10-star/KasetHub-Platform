import type {
  AITextBlockedAction,
  AITextBlockedActionId,
  AITextRequest,
  AITextRequestType,
  AITextSafetyBoundary,
} from '@/services/ai-text/ai-text-proxy.types';

export const AI_TEXT_POLICY_VERSION = 'ai-text-policy-v2026-05-m81';

export const aiTextAllowedRequestTypes: AITextRequestType[] = [
  'calculator_explanation',
  'weather_caution_explanation',
  'educational_explanation',
];

export const aiTextBlockedActions: AITextBlockedAction[] = [
  {
    id: 'exact_pesticide_recommendation',
    label: 'ห้ามแนะนำสารกำจัดศัตรูพืชแบบเจาะจง',
    reason: 'ต้องอ้างอิงฉลากจริง ผู้เชี่ยวชาญ และบริบทพื้นที่ก่อนเสมอ',
    blocked: true,
  },
  {
    id: 'exact_fertilizer_dose',
    label: 'ห้ามให้ปริมาณปุ๋ยแบบสั่งการ',
    reason: 'ผลดิน พันธุ์พืช และสภาพแปลงต้องผ่านการตรวจทานก่อน',
    blocked: true,
  },
  {
    id: 'guaranteed_yield_profit',
    label: 'ห้ามรับประกันผลผลิตหรือกำไร',
    reason: 'ผลผลิตและรายได้มีความไม่แน่นอนจากราคา อากาศ โรค และต้นทุน',
    blocked: true,
  },
  {
    id: 'legal_financial_certainty',
    label: 'ห้ามให้ความแน่นอนทางกฎหมายหรือการเงิน',
    reason: 'สินเชื่อ โครงการรัฐ และข้อกฎหมายต้องตรวจสอบจากหน่วยงานจริง',
    blocked: true,
  },
  {
    id: 'sponsor_product_injection',
    label: 'ห้ามแทรกสินค้า สปอนเซอร์ หรือ affiliate',
    reason: 'คำอธิบายต้องไม่แฝงการขายหรือผลประโยชน์ทางการค้า',
    blocked: true,
  },
  {
    id: 'autonomous_diagnosis',
    label: 'ห้ามวินิจฉัยโรค/ปัญหาแบบยืนยันเอง',
    reason: 'การวินิจฉัยต้องใช้หลักฐานภาคสนามและผู้เชี่ยวชาญ',
    blocked: true,
  },
  {
    id: 'unsafe_medical_chemical_advice',
    label: 'ห้ามคำแนะนำสารเคมีหรือสุขภาพที่เสี่ยง',
    reason: 'ต้องไม่แทนฉลาก แพทย์ ผู้เชี่ยวชาญ หรือหน่วยงานพื้นที่',
    blocked: true,
  },
  {
    id: 'unsupported_request_type',
    label: 'ชนิดคำขอไม่อยู่ในขอบเขต M81',
    reason: 'M81 อนุญาตเฉพาะคำอธิบายผลคำนวณ คำอธิบายความเสี่ยงอากาศ และความรู้ทั่วไป',
    blocked: true,
  },
];

const blockedActionMap = new Map<AITextBlockedActionId, AITextBlockedAction>(
  aiTextBlockedActions.map((action) => [action.id, action]),
);

export const aiTextSafetyBoundary: AITextSafetyBoundary = {
  allowedRequestTypes: aiTextAllowedRequestTypes,
  blockedActions: aiTextBlockedActions,
  noUnrestrictedChat: true,
  noExactPrescription: true,
  noSponsorProduct: true,
  noDiagnosis: true,
  noGuaranteedOutcome: true,
  immutableCalculatorOutput: true,
};

const promptPatterns: Array<{ id: AITextBlockedActionId; pattern: RegExp }> = [
  { id: 'exact_pesticide_recommendation', pattern: /(pesticide|ยาฆ่า|สารกำจัด|ยี่ห้อ.*ยา|แนะนำยา)/i },
  { id: 'exact_fertilizer_dose', pattern: /(fertilizer dose|ปุ๋ย.*กิโล|กก\.\/ไร่|กิโลกรัมต่อไร่|สูตรปุ๋ย.*แน่นอน)/i },
  { id: 'guaranteed_yield_profit', pattern: /(guarantee|รับประกัน|กำไรแน่นอน|ผลผลิตแน่นอน|ได้ผลแน่นอน)/i },
  { id: 'legal_financial_certainty', pattern: /(legal|กฎหมาย|สินเชื่อ.*แน่นอน|ดอกเบี้ย.*แน่นอน|โครงการรัฐ.*แน่นอน)/i },
  { id: 'sponsor_product_injection', pattern: /(sponsor|affiliate|แทรกสินค้า|ขายสินค้า|แนะนำสินค้า|product recommendation)/i },
  { id: 'autonomous_diagnosis', pattern: /(diagnose|วินิจฉัยให้แน่|โรคอะไรแน่นอน|ยืนยันโรค)/i },
  { id: 'unsafe_medical_chemical_advice', pattern: /(กินยา|ผสมสารเคมี.*เอง|ไม่ต้องอ่านฉลาก|ข้ามฉลาก|override label)/i },
];

export function getAITextBlockedAction(id: AITextBlockedActionId): AITextBlockedAction {
  return blockedActionMap.get(id) ?? blockedActionMap.get('unsupported_request_type')!;
}

export function isAITextRequestTypeAllowed(requestType: string): requestType is AITextRequestType {
  return aiTextAllowedRequestTypes.includes(requestType as AITextRequestType);
}

export function detectAITextBlockedActions(request: AITextRequest): AITextBlockedAction[] {
  const ids = new Set<AITextBlockedActionId>();
  const requestedActionText = request.requestedActions.join(' ').toLowerCase();
  const promptText = `${request.prompt} ${request.contextSummary} ${requestedActionText}`;

  if (!isAITextRequestTypeAllowed(request.requestType)) {
    ids.add('unsupported_request_type');
  }

  request.requestedActions.forEach((action) => {
    if (blockedActionMap.has(action as AITextBlockedActionId)) {
      ids.add(action as AITextBlockedActionId);
    }
  });

  promptPatterns.forEach(({ id, pattern }) => {
    if (pattern.test(promptText)) {
      ids.add(id);
    }
  });

  return [...ids].map(getAITextBlockedAction);
}

export function getAITextPolicySummary() {
  return {
    policyVersion: AI_TEXT_POLICY_VERSION,
    allowedRequestTypes: aiTextAllowedRequestTypes,
    blockedActions: aiTextBlockedActions,
    blockedCount: aiTextBlockedActions.length,
    noUnrestrictedChat: true,
    noExactPrescription: true,
    noSponsorProduct: true,
    noGuaranteedOutcome: true,
  };
}
