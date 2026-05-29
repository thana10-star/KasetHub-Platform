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
        return mapGeminiFailure(mapped.reasonCode, request.requestId);
      }

      if (!response.ok) {
        const mapped = mapGeminiProviderError({ status: response.status });
        return mapGeminiFailure(mapped.reasonCode, request.requestId);
      }

      const parsedJson = await parseJsonSafely(response);
      if (!parsedJson.ok) {
        return mapGeminiFailure('gemini_malformed_response', request.requestId);
      }

      const parsed = parseGeminiFarmerAssistantResponse(parsedJson.value);
      if (!parsed.ok) {
        return mapGeminiFailure(parsed.reasonCode, request.requestId);
      }

      return {
        ...parsed.response,
        provider: 'gemini',
        providerMode: 'live',
        requestId: request.requestId,
      };
    },
  };
}
