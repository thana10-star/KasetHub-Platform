import { describe, expect, test } from 'vitest';
import { selectFarmerAssistantProvider } from './provider-factory';

describe('M147 AI provider factory', () => {
  test('selects Gemini dry-run adapter for AI_PROVIDER=gemini', () => {
    const provider = selectFarmerAssistantProvider({
      AI_PROVIDER: ' gemini ',
      AI_LIVE_ENABLED: 'false',
    });

    expect(provider.providerName).toBe('gemini');
    expect(provider.providerMode).toBe('dry_run');
    expect(provider.getHealth()).toMatchObject({
      providerName: 'gemini',
      providerMode: 'dry_run',
      status: 'dry_run_ready',
    });
  });

  test('does not switch to live mode when AI_LIVE_ENABLED=true', () => {
    const provider = selectFarmerAssistantProvider({
      AI_PROVIDER: 'gemini',
      AI_LIVE_ENABLED: 'true',
    });

    expect(provider.providerName).toBe('gemini');
    expect(provider.providerMode).toBe('dry_run');
    expect(provider.getHealth().reasonCode).toBe('live_execution_not_available_in_m147');
  });

  test('selects internal live-capable adapter only when explicit test gates are provided', () => {
    const fetcher = async () => new Response('{}');
    const provider = selectFarmerAssistantProvider(
      {
        AI_PROVIDER: 'gemini',
        AI_LIVE_ENABLED: 'true',
        GEMINI_API_KEY: 'test-gemini-key-placeholder',
      },
      {
        allowLiveExecution: true,
        fetcher,
      },
    );

    expect(provider.providerName).toBe('gemini');
    expect(provider.providerMode).toBe('live');
    expect(provider.getHealth()).toMatchObject({
      providerName: 'gemini',
      providerMode: 'live',
      status: 'live_ready',
      reasonCode: 'gemini_live_allowed_internal_m147',
    });
  });

  test('selects disabled adapter for missing, disabled, or unknown providers', () => {
    const missing = selectFarmerAssistantProvider({});
    const disabled = selectFarmerAssistantProvider({ AI_PROVIDER: 'disabled' });
    const unknown = selectFarmerAssistantProvider({ AI_PROVIDER: 'openai', AI_LIVE_ENABLED: 'true' });

    expect(missing.providerMode).toBe('disabled');
    expect(missing.getHealth().reasonCode).toBe('provider_not_selected');
    expect(disabled.providerMode).toBe('disabled');
    expect(disabled.getHealth().reasonCode).toBe('provider_not_selected');
    expect(unknown.providerMode).toBe('disabled');
    expect(unknown.getHealth().reasonCode).toBe('unknown_provider');
  });
});
