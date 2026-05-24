import { aiTextCalculatorFixtureRequest } from '@/services/ai-text/ai-text-fixtures';
import {
  buildAITextEndpointAuditEvents,
  buildAITextEndpointRateLimitCheck,
  buildAITextEndpointRequest,
  buildAITextEndpointResponse,
  buildAITextEndpointTimeoutPlan,
  getAITextEndpointDryRunStatus,
  getAITextEndpointFailureModes,
} from '@/services/ai-text/ai-text-endpoint-contract';
import type {
  AITextEndpointDryRunPlan,
  AITextEndpointEnv,
  AITextEndpointResponse,
} from '@/services/ai-text/ai-text-endpoint-contract.types';
import type { AITextRequest } from '@/services/ai-text/ai-text-proxy.types';

export function buildAITextEndpointDryRunPlan(
  request: AITextRequest = aiTextCalculatorFixtureRequest,
  env?: AITextEndpointEnv,
): AITextEndpointDryRunPlan {
  const status = getAITextEndpointDryRunStatus(env);
  const responsePreview = buildAITextEndpointResponse(request, env);

  return {
    ...status,
    requestPreview: buildAITextEndpointRequest(request),
    responsePreview,
    auditEvents: buildAITextEndpointAuditEvents(request),
    rateLimitCheck: buildAITextEndpointRateLimitCheck(),
    timeoutPlan: buildAITextEndpointTimeoutPlan(),
    failureModes: getAITextEndpointFailureModes(),
    blockedActions: responsePreview.policyCheck.blockedActions,
    defaultNoNetworkProof: true,
  };
}

export function runAITextEndpointDryRun(
  request: AITextRequest,
  env?: AITextEndpointEnv,
): AITextEndpointResponse {
  return buildAITextEndpointResponse(request, env);
}
