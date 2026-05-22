import type { AIModelTier, AIProviderCandidate } from '@/services/ai/ai-provider.types';
import type { AIBackendEndpoint, AIRequestType, AISafetyLevel } from '@/services/ai/ai-request.types';

export type AIRoutingPolicy = {
  requestType: AIRequestType;
  selectedModelTier: AIModelTier;
  providerCandidate: AIProviderCandidate;
  safetyLevel: AISafetyLevel;
  estimatedBackendEndpoint: AIBackendEndpoint;
  routingNote: string;
  baseDisclaimers: string[];
};

export const aiRoutingPolicies: Record<AIRequestType, AIRoutingPolicy> = {
  normal_text_question: {
    requestType: 'normal_text_question',
    selectedModelTier: 'cheap_text',
    providerCandidate: 'gemini_flash_lite',
    safetyLevel: 'low',
    estimatedBackendEndpoint: '/api/ai/ask',
    routingNote: 'คำถามทั่วไปใช้โมเดลราคาต่ำเพื่อควบคุมต้นทุน',
    baseDisclaimers: ['คำตอบเป็นข้อมูลเบื้องต้น ควรตรวจสอบกับแหล่งความรู้ที่เชื่อถือได้'],
  },
  risky_or_complex_question: {
    requestType: 'risky_or_complex_question',
    selectedModelTier: 'strong_text',
    providerCandidate: 'gemini_flash',
    safetyLevel: 'high',
    estimatedBackendEndpoint: '/api/ai/ask',
    routingNote: 'คำถามเสี่ยงหรือซับซ้อนใช้โมเดลที่ให้เหตุผลละเอียดขึ้น',
    baseDisclaimers: ['คำแนะนำเกี่ยวกับโรคพืช ปุ๋ย หรือสารเคมีควรตรวจสอบกับผู้เชี่ยวชาญก่อนใช้งานจริง'],
  },
  plant_image_analysis: {
    requestType: 'plant_image_analysis',
    selectedModelTier: 'vision',
    providerCandidate: 'future_vision_model',
    safetyLevel: 'high',
    estimatedBackendEndpoint: '/api/ai/analyze-plant-image',
    routingNote: 'ภาพพืชต้องใช้ vision model และมีต้นทุนสูงกว่าคำถามข้อความ',
    baseDisclaimers: ['ผลวิเคราะห์ภาพเป็นข้อมูลเบื้องต้น ไม่ใช่การวินิจฉัยยืนยัน'],
  },
  video_summary: {
    requestType: 'video_summary',
    selectedModelTier: 'summary',
    providerCandidate: 'openai_mini',
    safetyLevel: 'medium',
    estimatedBackendEndpoint: '/api/ai/summarize-video',
    routingNote: 'สรุปวิดีโอใช้โมเดลสรุปข้อความจาก transcript หรือ metadata ที่ backend เตรียมไว้',
    baseDisclaimers: ['สรุปวิดีโออาจตกหล่นรายละเอียด ควรดูวิดีโอต้นฉบับประกอบ'],
  },
  article_summary: {
    requestType: 'article_summary',
    selectedModelTier: 'summary',
    providerCandidate: 'openai_mini',
    safetyLevel: 'low',
    estimatedBackendEndpoint: '/api/ai/summarize-article',
    routingNote: 'สรุปบทความใช้โมเดลสรุปข้อความราคาประหยัด',
    baseDisclaimers: ['สรุปบทความเป็นการย่อความ ควรอ่านเนื้อหาต้นฉบับเมื่อต้องตัดสินใจสำคัญ'],
  },
  price_explanation: {
    requestType: 'price_explanation',
    selectedModelTier: 'cheap_text',
    providerCandidate: 'gemini_flash_lite',
    safetyLevel: 'medium',
    estimatedBackendEndpoint: '/api/ai/ask',
    routingNote: 'คำอธิบายราคาพืชผลใช้โมเดลราคาต่ำและต้องแนบข้อจำกัดของแหล่งข้อมูล',
    baseDisclaimers: ['ราคาเป็นราคาอ้างอิงจากแหล่งข้อมูลที่ระบุ ไม่ใช่คำแนะนำการลงทุนหรือการขายที่รับประกันผล'],
  },
};

export function getAIRoutingPolicy(requestType: AIRequestType) {
  return aiRoutingPolicies[requestType];
}
