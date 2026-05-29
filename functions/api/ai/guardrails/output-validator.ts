import type {
  FarmerAssistantProviderMode,
  FarmerAssistantProviderName,
  FarmerAssistantSafetyLevel,
  FarmerAssistantTopic,
} from '../providers/provider-types';

export type AIOutputValidationReasonCode =
  | 'empty_answer'
  | 'dangerous_chemical_mixing'
  | 'confident_chemical_dosage'
  | 'guaranteed_outcome'
  | 'fake_live_data_claim'
  | 'fake_citation_claim'
  | 'human_medical_emergency_advice'
  | 'raw_provider_error'
  | 'secret_like_output'
  | 'model_id_output'
  | 'mostly_non_thai'
  | 'overlong_high_risk_answer';

export type AIOutputValidationInput = {
  answer: string;
  question: string;
  crop?: string;
  province?: string;
  topic?: FarmerAssistantTopic;
  inputSafetyLevel?: FarmerAssistantSafetyLevel;
  providerName?: FarmerAssistantProviderName;
  providerMode?: FarmerAssistantProviderMode;
  maxHighRiskAnswerChars?: number;
};

export type AIOutputValidationResult = {
  allowed: boolean;
  safetyLevel: FarmerAssistantSafetyLevel;
  reasonCodes: AIOutputValidationReasonCode[];
  sanitizedAnswer?: string;
};

const DEFAULT_HIGH_RISK_MAX_CHARS = 900;
const thaiCharacterPattern = /[\u0E00-\u0E7F]/g;
const letterPattern = /[A-Za-z\u0E00-\u0E7F]/g;

function hasPattern(value: string, pattern: RegExp) {
  return pattern.test(value);
}

function isMostlyNonThai(answer: string) {
  const thaiCharacters = answer.match(thaiCharacterPattern)?.length ?? 0;
  const letters = answer.match(letterPattern)?.length ?? 0;

  if (letters < 20) {
    return thaiCharacters < 4;
  }

  return thaiCharacters / letters < 0.35;
}

function hasConfidentDosageWithoutSource(answer: string) {
  const mentionsChemicalOrFertilizer = hasPattern(
    answer,
    /(ยา|สารเคมี|ยาฆ่า|ยาฆ่าแมลง|ยาฆ่าหญ้า|ยาฆ่าเชื้อรา|ปุ๋ย|pesticide|herbicide|fungicide|insecticide|fertilizer|chemical)/i,
  );
  const mentionsDosage = hasPattern(
    answer,
    /(\d+\s*(ซีซี|cc|มล|ml|กรัม|g|กิโล|kg|ลิตร|liter|litre)|กี่ซีซี|กี่ cc|กี่มล|กี่ ml|อัตรา|โดส|dose|dosage|ช้อนโต๊ะ|ช้อนชา)/i,
  );
  const hasVerifiedSourceCue = hasPattern(answer, /(ฉลาก|แหล่งข้อมูล|เอกสารกำกับ|เจ้าหน้าที่|ผู้เชี่ยวชาญ|label|source)/i);

  return mentionsChemicalOrFertilizer && mentionsDosage && !hasVerifiedSourceCue;
}

export function validateAIOutput(input: AIOutputValidationInput): AIOutputValidationResult {
  const answer = input.answer.trim();
  const reasonCodes: AIOutputValidationReasonCode[] = [];

  if (!answer) {
    reasonCodes.push('empty_answer');
  }

  if (hasPattern(answer, /(ผสม|mix).*(สารเคมี|ยา|ยาฆ่า|กรด|ด่าง|pesticide|chemical|acid|alkaline|bleach|ammonia)/i)) {
    reasonCodes.push('dangerous_chemical_mixing');
  }

  if (hasConfidentDosageWithoutSource(answer)) {
    reasonCodes.push('confident_chemical_dosage');
  }

  if (
    hasPattern(
      answer,
      /(แน่นอน|รับประกัน|ชัวร์|หายขาด|หายแน่|กำไรแน่|กำไร.*แน่นอน|ผลผลิต.*แน่นอน|ขายได้.*แน่นอน|ราคาจะขึ้นแน่|guarantee|guaranteed)/i,
    )
  ) {
    reasonCodes.push('guaranteed_outcome');
  }

  if (
    hasPattern(answer, /(วันนี้|ตอนนี้|ล่าสุด|เรียลไทม์|สด|ขณะนี้|live|real[-\s]?time).*(ราคา|บาท|ตลาด|ฝน|อากาศ|พยากรณ์|weather|price|market)/i)
  ) {
    reasonCodes.push('fake_live_data_claim');
  }

  if (hasPattern(answer, /(อ้างอิงจาก|ตามข้อมูลจาก|ตามรายงานของ|จากเว็บไซต์|จากกรม|จากงานวิจัย|source:|citation:|doi:|https?:\/\/|www\.)/i)) {
    reasonCodes.push('fake_citation_claim');
  }

  if (
    hasPattern(
      answer,
      /(คน|ผู้ใช้|เกษตรกร|เด็ก|ผู้ใหญ่).*(กินยา|ดื่มยา|สารเข้าตา|หายใจไม่ออก|พิษ|ฉุกเฉิน|รักษา|ล้างท้อง|emergency|poison)/i,
    )
  ) {
    reasonCodes.push('human_medical_emergency_advice');
  }

  if (hasPattern(answer, /(API error|provider error|stack trace|SyntaxError|TypeError|ReferenceError|Unhandled|at\s+\w+\s*\(|fetch failed)/i)) {
    reasonCodes.push('raw_provider_error');
  }

  if (hasPattern(answer, /(AIza[0-9A-Za-z_-]{10,}|sk-[A-Za-z0-9_-]{10,}|GEMINI_API_KEY|OPENAI_API_KEY|VITE_GEMINI_API_KEY|VITE_OPENAI_API_KEY|BEGIN PRIVATE KEY)/)) {
    reasonCodes.push('secret_like_output');
  }

  if (hasPattern(answer, /\b(gemini-\d[\w.-]*|gpt-\d[\w.-]*|models\/gemini[\w/.-]*|text-davinci|claude-\d[\w.-]*)\b/i)) {
    reasonCodes.push('model_id_output');
  }

  if (isMostlyNonThai(answer)) {
    reasonCodes.push('mostly_non_thai');
  }

  if (input.inputSafetyLevel === 'high_risk' && answer.length > (input.maxHighRiskAnswerChars ?? DEFAULT_HIGH_RISK_MAX_CHARS)) {
    reasonCodes.push('overlong_high_risk_answer');
  }

  const hasHighRiskReason = reasonCodes.some((reasonCode) =>
    ['dangerous_chemical_mixing', 'confident_chemical_dosage', 'human_medical_emergency_advice', 'secret_like_output'].includes(reasonCode),
  );
  const safetyLevel: FarmerAssistantSafetyLevel = hasHighRiskReason ? 'high_risk' : reasonCodes.length > 0 ? 'caution' : input.inputSafetyLevel ?? 'normal';

  return {
    allowed: reasonCodes.length === 0,
    safetyLevel,
    reasonCodes,
    sanitizedAnswer: reasonCodes.length === 0 ? answer : undefined,
  };
}
