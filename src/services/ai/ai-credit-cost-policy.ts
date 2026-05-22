import type { AIRequestType } from '@/services/ai/ai-request.types';

export const aiCreditCostByRequestType: Record<AIRequestType, number> = {
  normal_text_question: 1,
  risky_or_complex_question: 2,
  plant_image_analysis: 3,
  video_summary: 2,
  article_summary: 1,
  price_explanation: 1,
};

export const aiCreditCostLabels: Array<{ label: string; requestType: AIRequestType; cost: number }> = [
  { label: 'คำถามทั่วไป', requestType: 'normal_text_question', cost: aiCreditCostByRequestType.normal_text_question },
  { label: 'คำถามซับซ้อน', requestType: 'risky_or_complex_question', cost: aiCreditCostByRequestType.risky_or_complex_question },
  { label: 'วิเคราะห์รูปโรคพืช', requestType: 'plant_image_analysis', cost: aiCreditCostByRequestType.plant_image_analysis },
  { label: 'สรุปวิดีโอ', requestType: 'video_summary', cost: aiCreditCostByRequestType.video_summary },
  { label: 'สรุปบทความ', requestType: 'article_summary', cost: aiCreditCostByRequestType.article_summary },
  { label: 'อธิบายราคาพืชผล', requestType: 'price_explanation', cost: aiCreditCostByRequestType.price_explanation },
];

export function getAICreditCost(requestType: AIRequestType) {
  return aiCreditCostByRequestType[requestType];
}
