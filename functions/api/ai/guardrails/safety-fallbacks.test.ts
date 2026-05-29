import { describe, expect, test } from 'vitest';
import { mapGuardrailFailureToResponse } from './safety-fallbacks';

describe('M143 safety fallback mapper', () => {
  test('maps unsafe chemical output to blocked high-risk response', () => {
    const response = mapGuardrailFailureToResponse({
      reasonCodes: ['dangerous_chemical_mixing'],
      requestId: 'ai-farmer-chemical',
      providerMode: 'dry_run',
    });

    expect(response.status).toBe('blocked');
    expect(response.safetyLevel).toBe('high_risk');
    expect(response.provider).toBe('disabled');
    expect(JSON.stringify(response)).not.toContain('API error');
  });

  test('maps fake live data to caution response', () => {
    const response = mapGuardrailFailureToResponse({
      reasonCodes: ['fake_live_data_claim'],
      requestId: 'ai-farmer-live-data',
      providerMode: 'dry_run',
    });

    expect(response.status).toBe('ready');
    expect(response.safetyLevel).toBe('caution');
    expect(response.provider).toBe('mock');
    expect(response.answer).toContain('ยังไม่มีข้อมูลสด');
  });

  test('maps timeout to safe error without provider internals', () => {
    const response = mapGuardrailFailureToResponse({
      reasonCodes: ['provider_timeout'],
      requestId: 'ai-farmer-timeout',
      providerMode: 'dry_run',
    });
    const serialized = JSON.stringify(response);

    expect(response.status).toBe('error');
    expect(response.provider).toBe('disabled');
    expect(serialized).not.toContain('provider_timeout');
    expect(serialized).not.toContain('Gemini');
  });

  test('maps secret-like output to safe error without exposing internals', () => {
    const response = mapGuardrailFailureToResponse({
      reasonCodes: ['secret_like_output'],
      requestId: 'ai-farmer-secret',
      providerMode: 'dry_run',
    });
    const serialized = JSON.stringify(response);

    expect(response.status).toBe('error');
    expect(serialized).not.toContain('GEMINI_API_KEY');
    expect(serialized).not.toContain('stack');
  });
});
