import type { AIModelTier, AIProviderCandidate } from '@/services/ai/ai-provider.types';

export type AIRequestType =
  | 'normal_text_question'
  | 'risky_or_complex_question'
  | 'plant_image_analysis'
  | 'video_summary'
  | 'article_summary'
  | 'price_explanation';

export type AISafetyLevel = 'low' | 'medium' | 'high';

export type AIBackendEndpoint =
  | '/api/ai/ask'
  | '/api/ai/analyze-plant-image'
  | '/api/ai/summarize-video'
  | '/api/ai/summarize-article';

export type AIRequestPlanInput = {
  prompt?: string;
  requestType?: AIRequestType;
  sourceRoute?: string;
  metadata?: Record<string, unknown>;
};

export type AIRequestPlan = {
  requestType: AIRequestType;
  selectedModelTier: AIModelTier;
  providerCandidate: AIProviderCandidate;
  creditCost: number;
  safetyLevel: AISafetyLevel;
  disclaimers: string[];
  warnings: string[];
  estimatedBackendEndpoint: AIBackendEndpoint;
  canRunLocally: false;
};
