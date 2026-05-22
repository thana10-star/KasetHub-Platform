import {
  analyzePlantImage,
  askTextQuestion,
  summarizeArticle,
  summarizeVideo,
} from '@/services/ai-proxy/ai-proxy-mock-service';
import type { AIProxyStatus } from '@/services/ai-proxy/ai-proxy.types';
import type {
  MockAIProxyHandlerResult,
  MockAIProxyRequest,
  MockAIProxyResponse,
} from '@/server/ai-proxy/mock-ai-proxy.types';

function getScenarioFromCredit(request: MockAIProxyRequest) {
  if (request.creditSummary.totalAvailable < request.requestedCreditCost) {
    return 'insufficient_credits' as const;
  }

  return request.scenario;
}

function patchServerValidation(response: MockAIProxyResponse, request: MockAIProxyRequest): MockAIProxyResponse {
  const enoughCredits = request.creditSummary.totalAvailable >= request.requestedCreditCost;
  const status: AIProxyStatus = enoughCredits ? response.status : 'insufficient_credits';

  return {
    ...response,
    status,
    creditCost: request.requestedCreditCost,
    creditValidation: {
      ...response.creditValidation,
      requiredCredits: request.requestedCreditCost,
      availableCredits: request.creditSummary.totalAvailable,
      enoughCredits,
      dailyFreeRemaining: request.creditSummary.dailyFreeRemaining,
      rewardedCredits: request.creditSummary.rewardedCredits,
      proCredits: request.creditSummary.proCredits,
      wouldConsumeOnSuccess: enoughCredits && status === 'success',
      message: enoughCredits
        ? `server-shaped validation accepted (${request.requestedCreditCost} เครดิต)`
        : `server-shaped validation rejected: เครดิตไม่พอ ต้องใช้ ${request.requestedCreditCost} เครดิต`,
    },
    logsPreview: {
      ...response.logsPreview,
      networkCalls: false,
      wouldValidateAuth: true,
      wouldValidateCredits: true,
      notes: [
        'M14 local backend boundary handler',
        'no fetch, no provider key, no Supabase write',
        `session mode: ${request.session.mode}`,
        ...(response.logsPreview.notes ?? []),
      ],
    },
    warnings: [
      ...response.warnings,
      'response นี้มาจาก local backend boundary จำลอง ไม่ใช่ AI provider จริง',
    ],
  } as MockAIProxyResponse;
}

function getRejectionReason(response: MockAIProxyResponse): MockAIProxyHandlerResult['rejectionReason'] | undefined {
  if (response.status === 'insufficient_credits') {
    return 'insufficient_credit';
  }

  if (response.status === 'safety_blocked') {
    return 'safety_blocked';
  }

  if (response.status === 'failed') {
    return 'handler_failed';
  }

  return undefined;
}

export function handleMockAIProxyRequest(request: MockAIProxyRequest): MockAIProxyHandlerResult {
  const scenario = getScenarioFromCredit(request);
  let response: MockAIProxyResponse;

  if (request.requestType === 'plant_image_analysis') {
    response = analyzePlantImage({
      creditSummary: request.creditSummary,
      fileName: request.imageMetadata.fileName,
      fileSize: request.imageMetadata.fileSize,
      fileType: request.imageMetadata.fileType,
      scenario,
    });
  } else if (request.requestType === 'article_summary') {
    response = summarizeArticle({
      creditSummary: request.creditSummary,
      description: request.description,
      scenario,
      title: request.title,
    });
  } else if (request.requestType === 'video_summary') {
    response = summarizeVideo({
      creditSummary: request.creditSummary,
      description: request.description,
      scenario,
      title: request.title,
    });
  } else {
    response = askTextQuestion({
      creditSummary: request.creditSummary,
      question: request.question,
      scenario,
    });
  }

  const patchedResponse = patchServerValidation(response, request);
  const rejectionReason = getRejectionReason(patchedResponse);

  return {
    adapterPath: 'local_backend_handler',
    accepted: patchedResponse.status === 'success',
    rejectionReason,
    response: patchedResponse,
  };
}
