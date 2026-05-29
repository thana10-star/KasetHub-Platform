import type { FarmerAssistantProviderAdapter } from './ai-provider';
import { evaluateAIRolloutGate } from '../guardrails/rollout-gate';
import { createDisabledProvider } from './disabled-provider';
import { createGeminiDryRunProvider } from './gemini-provider';
import type { FarmerAssistantProviderEnv } from './provider-types';

export function selectFarmerAssistantProvider(env: FarmerAssistantProviderEnv = {}): FarmerAssistantProviderAdapter {
  const gate = evaluateAIRolloutGate(env);

  if (gate.providerName === 'gemini') {
    return createGeminiDryRunProvider({
      liveFlagEnabled: gate.liveEnabled,
      reasonCode: gate.reasonCode,
    });
  }

  return createDisabledProvider(gate.reasonCode === 'unknown_provider' ? 'unknown_provider' : 'provider_not_selected');
}
