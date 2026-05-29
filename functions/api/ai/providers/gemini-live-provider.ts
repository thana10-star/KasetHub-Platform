import { evaluateAIRolloutGate } from '../guardrails/rollout-gate';
import { mapGuardrailFailureToResponse } from '../guardrails/safety-fallbacks';
import type { FarmerAssistantProviderAdapter } from './ai-provider';
import { mapGeminiProviderError } from './gemini-error-mapper';
import { createGeminiDryRunProvider } from './gemini-provider';
import {
  buildGeminiFarmerAssistantRequest,
  GEMINI_MODEL_TO_VERIFY_BEFORE_LIVE,
} from './gemini-request-builder';
import { parseGeminiFarmerAssistantResponse } from './gemini-response-parser';
import type {
  FarmerAssistantDebugInfo,
  FarmerAssistantProviderEnv,
  FarmerAssistantProviderHealth,
  FarmerAssistantProviderRequest,
  FarmerAssistantResponse,
} from './provider-types';

export const GEMINI_GENERATE_CONTENT_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';

export type GeminiLiveProviderOptions = {
  allowLiveExecution?: boolean;
  apiBaseUrl?: string;
  env?: FarmerAssistantProviderEnv;
  fetcher?: typeof fetch;
};

function cleanEnvValue(value?: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function parsePositiveInteger(value: string | undefined, fallback: number, max: number) {
  const parsed = Number(cleanEnvValue(value));
  return Number.isFinite(parsed) && parsed > 0 ? Math.min(Math.floor(parsed), max) : fallback;
}

export function buildGeminiGenerateContentUrl(endpointPath: string, apiBaseUrl = GEMINI_GENERATE_CONTENT_BASE_URL) {
  return `${apiBaseUrl.replace(/\/+$/, '')}/${endpointPath.replace(/^\/+/, '')}`;
}

function mapGeminiFailure(reasonCode: Parameters<typeof mapGuardrailFailureToResponse>[0]['reasonCodes'][number], requestId: string) {
  return mapGuardrailFailureToResponse({
    reasonCodes: [reasonCode],
    requestId,
    providerMode: 'live',
  });
}

function withInternalDebug(response: FarmerAssistantResponse, debug: FarmerAssistantDebugInfo): FarmerAssistantResponse {
  return Object.defineProperty({ ...response }, 'internalDebug', {
    value: debug,
    enumerable: false,
  });
}

function stageForGeminiFailure(
  reasonCode: Parameters<typeof mapGeminiFailure>[0],
): FarmerAssistantDebugInfo['stage'] {
  if (['gemini_malformed_response', 'gemini_missing_text', 'gemini_empty_candidates', 'gemini_safety_blocked'].includes(reasonCode)) {
    return 'parser';
  }

  return 'provider_error';
}

async function parseJsonSafely(response: Response) {
  try {
    return { ok: true as const, value: await response.json() };
  } catch {
    return { ok: false as const };
  }
}

function createLiveHealth(reasonCode = 'gemini_live_allowed_internal_m147'): FarmerAssistantProviderHealth {
  return {
    providerName: 'gemini',
    providerMode: 'live',
    status: 'live_ready',
    reasonCode,
  };
}

export function createGeminiLiveCapableProvider(options: GeminiLiveProviderOptions = {}): FarmerAssistantProviderAdapter {
  const env = options.env ?? {};
  const apiKey = cleanEnvValue(env.GEMINI_API_KEY);
  const fetcher = options.fetcher;
  const gate = evaluateAIRolloutGate(env, {
    allowLiveExecution: options.allowLiveExecution,
    hasInjectedFetch: Boolean(fetcher),
    hasProviderSecret: Boolean(apiKey),
  });

  if (gate.mode !== 'live' || !fetcher || !apiKey) {
    return createGeminiDryRunProvider({
      liveFlagEnabled: gate.liveEnabled,
      reasonCode: gate.reasonCode,
    });
  }

  return {
    providerName: 'gemini',
    providerMode: 'live',
    getHealth() {
      return createLiveHealth(gate.reasonCode);
    },
    async generateAnswer(request: FarmerAssistantProviderRequest): Promise<FarmerAssistantResponse> {
      const plan = buildGeminiFarmerAssistantRequest(request, {
        model: cleanEnvValue(env.AI_MODEL) ?? GEMINI_MODEL_TO_VERIFY_BEFORE_LIVE,
        maxOutputTokens: parsePositiveInteger(env.AI_MAX_OUTPUT_TOKENS, 700, 2000),
      });
      const baseDebug = {
        providerMode: 'live',
        model: plan.model,
        liveGate: gate.mode,
      } as const;
      let response: Response;
      try {
        response = await fetcher(buildGeminiGenerateContentUrl(plan.endpointPath, options.apiBaseUrl), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': apiKey,
          },
          body: JSON.stringify(plan.body),
        });
      } catch (error) {
        const mapped = mapGeminiProviderError(error);
        return withInternalDebug(mapGeminiFailure(mapped.reasonCode, request.requestId), {
          ...baseDebug,
          stage: stageForGeminiFailure(mapped.reasonCode),
          reasonCodes: [mapped.reasonCode],
          safeSummary: 'Gemini request failed before a safe parsed answer was available.',
        });
      }

      if (!response.ok) {
        const mapped = mapGeminiProviderError({ status: response.status });
        return withInternalDebug(mapGeminiFailure(mapped.reasonCode, request.requestId), {
          ...baseDebug,
          stage: stageForGeminiFailure(mapped.reasonCode),
          reasonCodes: [mapped.reasonCode],
          safeSummary: 'Gemini returned a non-success status that was mapped to a safe response.',
        });
      }

      const parsedJson = await parseJsonSafely(response);
      if (!parsedJson.ok) {
        return withInternalDebug(mapGeminiFailure('gemini_malformed_response', request.requestId), {
          ...baseDebug,
          stage: 'parser',
          reasonCodes: ['gemini_malformed_response'],
          safeSummary: 'Gemini response JSON could not be parsed safely.',
        });
      }

      const parsed = parseGeminiFarmerAssistantResponse(parsedJson.value);
      if (!parsed.ok) {
        return withInternalDebug(mapGeminiFailure(parsed.reasonCode, request.requestId), {
          ...baseDebug,
          stage: 'parser',
          reasonCodes: parsed.reasonCodes,
          safeSummary: 'Gemini response did not contain a usable safe answer.',
        });
      }

      return withInternalDebug(
        {
          ...parsed.response,
          provider: 'gemini',
          providerMode: 'live',
          requestId: request.requestId,
        },
        {
          ...baseDebug,
          stage: 'provider_call',
          reasonCodes: ['gemini_response_parsed'],
          safeSummary: 'Gemini returned parsed text for endpoint validation.',
        },
      );
    },
  };
}
