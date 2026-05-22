import { getAICreditCost } from '@/services/ai/ai-credit-cost-policy';
import { getAIRoutingPolicy } from '@/services/ai/ai-routing-policy';
import type { AIRequestPlan, AIRequestPlanInput, AIRequestType } from '@/services/ai/ai-request.types';

const riskyKeywords = ['โรค', 'เชื้อรา', 'แมลง', 'ปุ๋ย', 'สารเคมี', 'ยา', 'กำจัด', 'ตาย', 'ไหม้', 'ปลอดภัย'];
const priceKeywords = ['ราคา', 'ตลาด', 'ขาย', 'รับซื้อ', 'บาท'];
const summaryKeywords = ['สรุป', 'ย่อ', 'อ่าน'];

export function inferAIRequestType(prompt = ''): AIRequestType {
  const cleanPrompt = prompt.trim().toLowerCase();

  if (!cleanPrompt) {
    return 'normal_text_question';
  }

  if (priceKeywords.some((keyword) => cleanPrompt.includes(keyword))) {
    return 'price_explanation';
  }

  if (summaryKeywords.some((keyword) => cleanPrompt.includes(keyword))) {
    return 'article_summary';
  }

  if (riskyKeywords.some((keyword) => cleanPrompt.includes(keyword))) {
    return 'risky_or_complex_question';
  }

  return 'normal_text_question';
}

export function buildAIRequestPlan(input: AIRequestPlanInput): AIRequestPlan {
  const requestType = input.requestType ?? inferAIRequestType(input.prompt);
  const policy = getAIRoutingPolicy(requestType);
  const warnings: string[] = [];

  if (!input.prompt && requestType === 'normal_text_question') {
    warnings.push('ยังไม่มีคำถาม ระบบจะแสดงแผนสำหรับคำถามทั่วไป');
  }

  if (policy.safetyLevel === 'high') {
    warnings.push('คำถามนี้อาจมีความเสี่ยง ควรมีคำเตือนและแนะนำให้ตรวจสอบกับผู้เชี่ยวชาญ');
  }

  return {
    requestType,
    selectedModelTier: policy.selectedModelTier,
    providerCandidate: policy.providerCandidate,
    creditCost: getAICreditCost(requestType),
    safetyLevel: policy.safetyLevel,
    disclaimers: policy.baseDisclaimers,
    warnings,
    estimatedBackendEndpoint: policy.estimatedBackendEndpoint,
    canRunLocally: false,
  };
}
