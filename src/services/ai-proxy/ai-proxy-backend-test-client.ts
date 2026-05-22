import { publicEnv } from '@/config/env';
import { getAICreditCost } from '@/services/ai/ai-credit-cost-policy';
import { buildAIRequestPlan } from '@/services/ai/ai-request-planner';
import type { AIRequestType } from '@/services/ai/ai-request.types';
import type { AIProxyMode } from '@/services/ai-proxy/ai-proxy-adapter.types';
import type {
  AIPlantImageProxyResponse,
  AISummaryProxyResponse,
  AITextAnswer,
  AITextProxyResponse,
  AnalyzePlantImageInput,
  AskTextQuestionInput,
  SummarizeContentInput,
} from '@/services/ai-proxy/ai-proxy.types';
import type { AICreditSummary } from '@/services/ai-credits/ai-credit.types';
import { handleMockAIProxyRequest } from '@/server/ai-proxy/mock-ai-proxy-handler';
import type {
  MockAIProxyArticleSummaryRequest,
  MockAIProxyPlantImageRequest,
  MockAIProxyRequest,
  MockAIProxyTextQuestionRequest,
  MockAIProxyVideoSummaryRequest,
} from '@/server/ai-proxy/mock-ai-proxy.types';

export type AIProxyBackendTestStatus = {
  backendProxyEnabled: boolean;
  localHandlerEnabled: boolean;
  canUseLocalHandler: boolean;
  currentAdapterPath: 'local_fixture' | 'local_backend_handler' | 'disabled_response';
  networkCallsEnabled: false;
  providerKeysAvailableInFrontend: false;
  readinessLabel: string;
  warnings: string[];
};

function now() {
  return new Date().toISOString();
}

function createRequestId(prefix: string) {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function getAIProxyBackendTestStatus(mode: AIProxyMode): AIProxyBackendTestStatus {
  const canUseLocalHandler =
    mode === 'backend_test_ready' && publicEnv.enableAIBackendProxy && publicEnv.enableLocalAIProxyHandler;

  return {
    backendProxyEnabled: publicEnv.enableAIBackendProxy,
    localHandlerEnabled: publicEnv.enableLocalAIProxyHandler,
    canUseLocalHandler,
    currentAdapterPath: mode === 'local_fixture' ? 'local_fixture' : canUseLocalHandler ? 'local_backend_handler' : 'disabled_response',
    networkCallsEnabled: false,
    providerKeysAvailableInFrontend: false,
    readinessLabel: canUseLocalHandler
      ? 'local backend handler พร้อมทดสอบแบบ in-process'
      : mode === 'backend_test_ready'
        ? 'backend_test_ready แต่ local handler ยังไม่ครบทุก flag'
        : 'ยังไม่ใช้ backend boundary',
    warnings: [
      'M14 ไม่มี fetch จริง',
      'local handler เป็น in-process test path เท่านั้น',
      'provider keys ต้องอยู่ server-side เท่านั้น',
    ],
  };
}

function disabledAnswer(mode: AIProxyMode): AITextAnswer {
  return {
    title: 'Backend boundary ยังไม่พร้อมใช้งาน',
    answer:
      mode === 'backend_test_ready'
        ? 'ตั้งค่า backend_test_ready แล้ว แต่ต้องเปิด VITE_ENABLE_AI_BACKEND_PROXY=true และ VITE_ENABLE_LOCAL_AI_PROXY_HANDLER=true จึงจะเรียก local handler จำลองได้'
        : 'โหมดนี้ไม่อนุญาตให้เรียก backend boundary จึงส่ง response ปลอดภัยกลับมาแทน',
    bulletPoints: ['ไม่มี network request', 'ไม่มี provider key ใน frontend', 'ไม่มีการหักเครดิตจาก handler'],
    followUpQuestions: ['ต้องการกลับไปใช้ local fixture หรือเปิด local handler สำหรับทดสอบไหม'],
    recommendedActions: ['ใช้ local_fixture เป็นค่าเริ่มต้น', 'เปิด local handler เฉพาะตอนทดสอบ M14'],
  };
}

function createDisabledResponse(
  requestType: AIRequestType,
  prompt: string,
  creditSummary: AICreditSummary,
  mode: AIProxyMode,
): AITextProxyResponse {
  const plan = buildAIRequestPlan({ prompt, requestType });
  const creditCost = getAICreditCost(plan.requestType);

  return {
    requestId: createRequestId('ai-backend-disabled'),
    status: 'failed',
    requestType: plan.requestType,
    creditCost,
    creditValidation: {
      requiredCredits: creditCost,
      availableCredits: creditSummary.totalAvailable,
      enoughCredits: creditSummary.totalAvailable >= creditCost,
      dailyFreeRemaining: creditSummary.dailyFreeRemaining,
      rewardedCredits: creditSummary.rewardedCredits,
      proCredits: creditSummary.proCredits,
      validationSource: 'local_guest_credit_fixture',
      wouldConsumeOnSuccess: false,
      message: 'backend boundary disabled response: ยังไม่ตรวจเครดิตบน server จริง',
    },
    modelPlan: plan,
    answer: disabledAnswer(mode),
    safetyDisclaimers: ['M14 เป็น local backend boundary prototype เท่านั้น ยังไม่เรียก AI จริง'],
    warnings: ['backend boundary ยังไม่เปิดครบทุก flag', 'ไม่มี network request ใน response นี้'],
    logsPreview: {
      endpoint: plan.estimatedBackendEndpoint,
      providerKeyLocation: 'server_only_not_in_frontend',
      networkCalls: false,
      wouldValidateAuth: true,
      wouldValidateCredits: true,
      wouldWriteTables: ['ai_question_logs', 'ai_credit_transactions'],
      notes: ['backend test client returned disabled response'],
    },
    retryable: false,
    createdAt: now(),
  };
}

function sessionFromInput() {
  return {
    mode: 'guest' as const,
    guestId: 'local-guest-preview',
  };
}

function runHandlerOrDisabled(request: MockAIProxyRequest, mode: AIProxyMode) {
  const backendStatus = getAIProxyBackendTestStatus(mode);

  if (!backendStatus.canUseLocalHandler) {
    return undefined;
  }

  return handleMockAIProxyRequest(request).response;
}

export function askTextQuestionViaBackendTest(input: AskTextQuestionInput, mode: AIProxyMode): AITextProxyResponse {
  const plan = buildAIRequestPlan({ prompt: input.question, sourceRoute: '/app/ai' });
  const request: MockAIProxyTextQuestionRequest = {
    requestType:
      plan.requestType === 'price_explanation' || plan.requestType === 'risky_or_complex_question'
        ? plan.requestType
        : 'normal_text_question',
    requestedCreditCost: plan.creditCost,
    creditSummary: input.creditSummary,
    session: sessionFromInput(),
    scenario: input.scenario,
    sourceRoute: '/app/ai',
    question: input.question,
    metadata: {
      adapterMode: mode,
      clientOnly: true,
    },
  };

  return (runHandlerOrDisabled(request, mode) as AITextProxyResponse | undefined) ?? createDisabledResponse(request.requestType, input.question, input.creditSummary, mode);
}

export function analyzePlantImageViaBackendTest(input: AnalyzePlantImageInput, mode: AIProxyMode): AIPlantImageProxyResponse {
  const plan = buildAIRequestPlan({
    prompt: input.fileName ?? 'plant image analysis',
    requestType: 'plant_image_analysis',
    sourceRoute: '/app/analyze',
  });
  const request: MockAIProxyPlantImageRequest = {
    requestType: 'plant_image_analysis',
    requestedCreditCost: plan.creditCost,
    creditSummary: input.creditSummary,
    session: sessionFromInput(),
    scenario: input.scenario,
    sourceRoute: '/app/analyze',
    imageMetadata: {
      fileName: input.fileName,
      fileSize: input.fileSize,
      fileType: input.fileType,
    },
    metadata: {
      adapterMode: mode,
      metadataOnly: true,
    },
  };

  return (runHandlerOrDisabled(request, mode) as AIPlantImageProxyResponse | undefined) ?? {
    ...createDisabledResponse('plant_image_analysis', input.fileName ?? 'plant image', input.creditSummary, mode),
    requestId: createRequestId('ai-backend-image-disabled'),
    requestType: 'plant_image_analysis',
    result: undefined,
  };
}

export function summarizeArticleViaBackendTest(input: SummarizeContentInput, mode: AIProxyMode): AISummaryProxyResponse {
  const request: MockAIProxyArticleSummaryRequest = {
    requestType: 'article_summary',
    requestedCreditCost: 1,
    creditSummary: input.creditSummary,
    session: sessionFromInput(),
    scenario: input.scenario,
    sourceRoute: '/app/articles',
    title: input.title,
    description: input.description,
    metadata: {
      adapterMode: mode,
    },
  };

  return (runHandlerOrDisabled(request, mode) as AISummaryProxyResponse | undefined) ?? createDisabledResponse('article_summary', input.title, input.creditSummary, mode);
}

export function summarizeVideoViaBackendTest(input: SummarizeContentInput, mode: AIProxyMode): AISummaryProxyResponse {
  const request: MockAIProxyVideoSummaryRequest = {
    requestType: 'video_summary',
    requestedCreditCost: 2,
    creditSummary: input.creditSummary,
    session: sessionFromInput(),
    scenario: input.scenario,
    sourceRoute: '/app/youtube',
    title: input.title,
    description: input.description,
    metadata: {
      adapterMode: mode,
    },
  };

  return (runHandlerOrDisabled(request, mode) as AISummaryProxyResponse | undefined) ?? createDisabledResponse('video_summary', input.title, input.creditSummary, mode);
}
