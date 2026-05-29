import type { FarmerAssistantProviderEnv, FarmerAssistantProviderName } from '../providers/provider-types';

export type AIRolloutGateMode = 'disabled' | 'dry_run' | 'live_blocked' | 'live';

export type AIRolloutGateOptions = {
  allowLiveExecution?: boolean;
  hasInjectedFetch?: boolean;
  hasProviderSecret?: boolean;
};

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

export function evaluateAIRolloutGate(
  env: FarmerAssistantProviderEnv = {},
  options: AIRolloutGateOptions = {},
): AIRolloutGateResult {
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
    if (!liveEnabled) {
      return {
        mode: 'dry_run',
        providerName: 'gemini',
        liveEnabled,
        reasonCode: 'gemini_dry_run_allowed',
      };
    }

    if (!options.allowLiveExecution) {
      return {
        mode: 'live_blocked',
        providerName: 'gemini',
        liveEnabled,
        reasonCode: 'live_execution_not_available_in_m147',
      };
    }

    if (!options.hasProviderSecret) {
      return {
        mode: 'live_blocked',
        providerName: 'gemini',
        liveEnabled,
        reasonCode: 'gemini_key_missing',
      };
    }

    if (!options.hasInjectedFetch) {
      return {
        mode: 'live_blocked',
        providerName: 'gemini',
        liveEnabled,
        reasonCode: 'fetch_not_injected',
      };
    }

    return {
      mode: 'live',
      providerName: 'gemini',
      liveEnabled,
      reasonCode: 'gemini_live_allowed_internal_m147',
    };
  }

  return {
    mode: 'disabled',
    providerName: 'disabled',
    liveEnabled,
    reasonCode: 'unknown_provider',
  };
}
