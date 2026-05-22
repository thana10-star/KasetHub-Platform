import type { AIRequestPlan, AIRequestType } from '@/services/ai/ai-request.types';
import type {
  AIPlantImageAnalysisResult,
  AIProxyCreditValidation,
  AIProxyLogsPreview,
  AIProxyStatus,
  AITextAnswer,
} from '@/services/ai-proxy/ai-proxy.types';

export type AIProxyContractStatus = AIProxyStatus;

export type AIProxyContractBaseResponse = {
  requestId: string;
  status: AIProxyContractStatus;
  requestType: AIRequestType;
  creditCost: number;
  creditValidation: AIProxyCreditValidation;
  modelPlan: AIRequestPlan;
  safetyDisclaimers: string[];
  warnings: string[];
  logsPreview: AIProxyLogsPreview;
  retryable: boolean;
  createdAt: string;
};

export type AIProxyAskTextRequest = {
  requestType: 'normal_text_question' | 'risky_or_complex_question' | 'price_explanation';
  question: string;
  guestId?: string;
  userId?: string;
  clientCreditPreview: number;
  metadata: Record<string, unknown>;
};

export type AIProxyTextResponse = AIProxyContractBaseResponse & {
  answer?: AITextAnswer;
};

export type AIProxyAnalyzePlantImageRequest = {
  requestType: 'plant_image_analysis';
  mediaObjectId?: string;
  imageAssetId?: string;
  crop?: string;
  symptoms?: string;
  guestId?: string;
  userId?: string;
  clientCreditPreview: number;
  consent: {
    allowImageProcessing: boolean;
    allowSaveToMyFarm?: boolean;
  };
  metadata: Record<string, unknown>;
};

export type AIProxyPlantImageResponse = AIProxyContractBaseResponse & {
  result?: AIPlantImageAnalysisResult;
};

export type AIProxySummarizeArticleRequest = {
  requestType: 'article_summary';
  articleId?: string;
  title: string;
  summaryGoal?: string;
  guestId?: string;
  userId?: string;
  clientCreditPreview: number;
  metadata: Record<string, unknown>;
};

export type AIProxySummarizeVideoRequest = {
  requestType: 'video_summary';
  videoId?: string;
  title: string;
  summaryGoal?: string;
  guestId?: string;
  userId?: string;
  clientCreditPreview: number;
  metadata: Record<string, unknown>;
};

export type AIProxySummaryResponse = AIProxyContractBaseResponse & {
  answer?: AITextAnswer;
};
