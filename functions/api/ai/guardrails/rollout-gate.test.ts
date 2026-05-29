import { describe, expect, test } from 'vitest';
import { evaluateAIRolloutGate } from './rollout-gate';

describe('M147 rollout gate', () => {
  test('defaults missing provider to disabled safe mode', () => {
    expect(evaluateAIRolloutGate()).toMatchObject({
      mode: 'disabled',
      providerName: 'disabled',
      liveEnabled: false,
      reasonCode: 'provider_not_selected',
    });
  });

  test('allows Gemini dry-run when AI_LIVE_ENABLED is missing or false', () => {
    expect(evaluateAIRolloutGate({ AI_PROVIDER: 'gemini' })).toMatchObject({
      mode: 'dry_run',
      providerName: 'gemini',
      liveEnabled: false,
    });
    expect(evaluateAIRolloutGate({ AI_PROVIDER: 'gemini', AI_LIVE_ENABLED: 'false' })).toMatchObject({
      mode: 'dry_run',
      providerName: 'gemini',
      liveEnabled: false,
    });
  });

  test('blocks live execution by default even when AI_LIVE_ENABLED is true', () => {
    expect(evaluateAIRolloutGate({ AI_PROVIDER: 'gemini', AI_LIVE_ENABLED: 'true' })).toMatchObject({
      mode: 'live_blocked',
      providerName: 'gemini',
      liveEnabled: true,
      reasonCode: 'live_execution_not_available_in_m147',
    });
  });

  test('requires explicit live adapter gates before allowing internal live mode', () => {
    expect(
      evaluateAIRolloutGate(
        { AI_PROVIDER: 'gemini', AI_LIVE_ENABLED: 'true' },
        { allowLiveExecution: true, hasInjectedFetch: true, hasProviderSecret: false },
      ),
    ).toMatchObject({
      mode: 'live_blocked',
      reasonCode: 'gemini_key_missing',
    });

    expect(
      evaluateAIRolloutGate(
        { AI_PROVIDER: 'gemini', AI_LIVE_ENABLED: 'true' },
        { allowLiveExecution: true, hasInjectedFetch: false, hasProviderSecret: true },
      ),
    ).toMatchObject({
      mode: 'live_blocked',
      reasonCode: 'fetch_not_injected',
    });

    expect(
      evaluateAIRolloutGate(
        { AI_PROVIDER: 'gemini', AI_LIVE_ENABLED: 'true' },
        { allowLiveExecution: true, hasInjectedFetch: true, hasProviderSecret: true },
      ),
    ).toMatchObject({
      mode: 'live',
      providerName: 'gemini',
      reasonCode: 'gemini_live_allowed_internal_m147',
    });
  });

  test('keeps unknown providers disabled', () => {
    expect(evaluateAIRolloutGate({ AI_PROVIDER: 'openai', AI_LIVE_ENABLED: 'true' })).toMatchObject({
      mode: 'disabled',
      providerName: 'disabled',
      liveEnabled: true,
      reasonCode: 'unknown_provider',
    });
  });
});
