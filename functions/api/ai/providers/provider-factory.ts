import type { FarmerAssistantProviderAdapter } from './ai-provider';
import { evaluateAIRolloutGate } from '../guardrails/rollout-gate';
import { createDisabledProvider } from './disabled-provider';
import { createGeminiLiveCapableProvider } from './gemini-live-provider';
import type { FarmerAssistantProviderEnv } from './provider-types';

export type FarmerAssistantProviderFactoryOptions = {
  allowLiveExecution?: boolean;
  fetcher?: typeof fetch;
};

function hasValue(value?: string) {
  return Boolean(value?.trim());
}

export function selectFarmerAssistantProvider(
  env: FarmerAssistantProviderEnv = {},
  options: FarmerAssistantProviderFactoryOptions = {},
): FarmerAssistantProviderAdapter {
  const gate = evaluateAIRolloutGate(env, {
    allowLiveExecution: options.allowLiveExecution,
    hasInjectedFetch: Boolean(options.fetcher),
    hasProviderSecret: hasValue(env.GEMINI_API_KEY),
  });

  if (gate.providerName === 'gemini') {
    return createGeminiLiveCapableProvider({
      allowLiveExecution: options.allowLiveExecution,
      env,
      fetcher: options.fetcher,
    });
  }

  return createDisabledProvider(gate.reasonCode === 'unknown_provider' ? 'unknown_provider' : 'provider_not_selected');
}
