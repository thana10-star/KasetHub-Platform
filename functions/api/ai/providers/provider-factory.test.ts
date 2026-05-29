import { describe, expect, test } from 'vitest';
import { selectFarmerAssistantProvider } from './provider-factory';

describe('M142 AI provider factory', () => {
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
    expect(provider.getHealth().reasonCode).toBe('gemini_live_flag_ignored_in_m142');
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
