import type { AICreditSummary } from '@/services/ai-credits/ai-credit.types';
import type { AIRequestType } from '@/services/ai/ai-request.types';
import type {
  AIPlantImageProxyResponse,
  AISummaryProxyResponse,
  AITextProxyResponse,
  AIMockScenario,
} from '@/services/ai-proxy/ai-proxy.types';

export type MockAIProxySessionMode = 'guest' | 'authenticated' | 'unknown';

export type MockAIProxySession = {
  mode: MockAIProxySessionMode;
  guestId?: string;
  userId?: string;
};

export type MockAIProxyBaseRequest = {
  requestType: AIRequestType;
  requestedCreditCost: number;
  creditSummary: AICreditSummary;
  session: MockAIProxySession;
  scenario?: AIMockScenario;
  sourceRoute?: string;
  metadata?: Record<string, unknown>;
};

export type MockAIProxyTextQuestionRequest = MockAIProxyBaseRequest & {
  requestType: 'normal_text_question' | 'risky_or_complex_question' | 'price_explanation';
  question: string;
};

export type MockAIProxyPlantImageRequest = MockAIProxyBaseRequest & {
  requestType: 'plant_image_analysis';
  imageMetadata: {
    fileName?: string;
    fileType?: string;
    fileSize?: number;
    mediaObjectId?: string;
    imageAssetId?: string;
  };
};

export type MockAIProxyArticleSummaryRequest = MockAIProxyBaseRequest & {
  requestType: 'article_summary';
  title: string;
  description?: string;
  articleId?: string;
};

export type MockAIProxyVideoSummaryRequest = MockAIProxyBaseRequest & {
  requestType: 'video_summary';
  title: string;
  description?: string;
  videoId?: string;
};

export type MockAIProxyRequest =
  | MockAIProxyTextQuestionRequest
  | MockAIProxyPlantImageRequest
  | MockAIProxyArticleSummaryRequest
  | MockAIProxyVideoSummaryRequest;

export type MockAIProxyResponse = AITextProxyResponse | AIPlantImageProxyResponse | AISummaryProxyResponse;

export type MockAIProxyHandlerResult = {
  adapterPath: 'local_backend_handler';
  accepted: boolean;
  rejectionReason?: 'insufficient_credit' | 'safety_blocked' | 'handler_failed';
  response: MockAIProxyResponse;
};
