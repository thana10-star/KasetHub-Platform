import type { FarmerAssistantProviderAdapter } from './ai-provider';
import { createDisabledProvider } from './disabled-provider';
import { createGeminiDryRunProvider } from './gemini-provider';
import type { FarmerAssistantProviderEnv } from './provider-types';

function cleanEnvValue(value?: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function isEnabled(value?: string) {
  return ['true', '1', 'yes', 'on'].includes(cleanEnvValue(value)?.toLowerCase() ?? '');
}

export function selectFarmerAssistantProvider(env: FarmerAssistantProviderEnv = {}): FarmerAssistantProviderAdapter {
  const provider = cleanEnvValue(env.AI_PROVIDER)?.toLowerCase();

  if (!provider || provider === 'disabled' || provider === 'off' || provider === 'none') {
    return createDisabledProvider('provider_not_selected');
  }

  if (provider === 'gemini') {
    return createGeminiDryRunProvider({ liveFlagEnabled: isEnabled(env.AI_LIVE_ENABLED) });
  }

  return createDisabledProvider('unknown_provider');
}
