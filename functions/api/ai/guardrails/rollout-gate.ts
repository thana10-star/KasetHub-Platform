import type { FarmerAssistantProviderEnv, FarmerAssistantProviderName } from '../providers/provider-types';

export type AIRolloutGateMode = 'disabled' | 'dry_run' | 'live_blocked';

export type AIRolloutGateResult = {
  mode: AIRolloutGateMode;
  providerName: FarmerAssistantProviderName;
  liveEnabled: boolean;
  reasonCode: string;
};

function cleanEnvValue(value?: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function isEnabled(value?: string) {
  return ['true', '1', 'yes', 'on'].includes(cleanEnvValue(value)?.toLowerCase() ?? '');
}

export function evaluateAIRolloutGate(env: FarmerAssistantProviderEnv = {}): AIRolloutGateResult {
  const provider = cleanEnvValue(env.AI_PROVIDER)?.toLowerCase();
  const liveEnabled = isEnabled(env.AI_LIVE_ENABLED);

  if (!provider || provider === 'disabled' || provider === 'off' || provider === 'none') {
    return {
      mode: 'disabled',
      providerName: 'disabled',
      liveEnabled,
      reasonCode: 'provider_not_selected',
    };
  }

  if (provider === 'gemini') {
    return {
      mode: liveEnabled ? 'live_blocked' : 'dry_run',
      providerName: 'gemini',
      liveEnabled,
      reasonCode: liveEnabled ? 'live_execution_not_available_in_m143' : 'gemini_dry_run_allowed',
    };
  }

  return {
    mode: 'disabled',
    providerName: 'disabled',
    liveEnabled,
    reasonCode: 'unknown_provider',
  };
}
