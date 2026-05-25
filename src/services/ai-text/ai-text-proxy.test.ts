import { describe, expect, test, vi } from 'vitest';
import {
  aiTextBlockedFixtureRequest,
  aiTextCalculatorFixtureRequest,
  aiTextWeatherFixtureRequest,
} from '@/services/ai-text/ai-text-fixtures';
import {
  explainAITextSync,
  findFrontendAITextSecretKeys,
  getAITextModeStatus,
  getAITextProxyStatus,
  isFrontendAITextSecretKeyAllowed,
} from '@/services/ai-text/ai-text-proxy';

describe('M81 real AI text proxy controlled staging', () => {
  test('default mode stays local fixture', () => {
    const status = getAITextModeStatus();
    const response = explainAITextSync(aiTextCalculatorFixtureRequest);

    expect(status.mode).toBe('local_fixture');
    expect(status.canCallNetwork).toBe(false);
    expect(response.status).toBe('fixture_response');
    expect(response.networkAttempted).toBe(false);
  });

  test('no network without flags', () => {
    const fetchSpy = vi.fn();
    const response = explainAITextSync(aiTextWeatherFixtureRequest, {
      aiTextMode: 'staging_proxy_ready',
      enableRealAIText: false,
      enableAITextNetwork: false,
    });

    expect(response.networkAttempted).toBe(false);
    expect(response.status).toBe('proxy_not_configured');
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  test('frontend cannot access provider key or service-role key', () => {
    expect(isFrontendAITextSecretKeyAllowed('VITE_OPENAI_API_KEY')).toBe(false);
    expect(isFrontendAITextSecretKeyAllowed('VITE_SUPABASE_SERVICE_ROLE_KEY')).toBe(false);
    expect(findFrontendAITextSecretKeys({ VITE_OPENAI_API_KEY: 'sk-test', VITE_SAFE_LABEL: 'ok' })).toEqual([
      'VITE_OPENAI_API_KEY',
    ]);
  });

  test('blocked actions are rejected', () => {
    const response = explainAITextSync(aiTextBlockedFixtureRequest);

    expect(response.status).toBe('blocked');
    expect(response.blockedReasons.map((action) => action.id)).toContain('sponsor_product_injection');
    expect(response.blockedReasons.map((action) => action.id)).toContain('guaranteed_yield_profit');
    expect(response.networkAttempted).toBe(false);
  });

  test('immutable calculator result is preserved', () => {
    const response = explainAITextSync(aiTextCalculatorFixtureRequest);

    expect(response.immutableOutputPreserved).toBe(true);
    expect(response.lockedOutputSnapshot?.lockedHash).toBe(aiTextCalculatorFixtureRequest.lockedOutputSnapshot?.lockedHash);
    expect(response.text).toContain('ผลลัพธ์ต้องคงเดิม');
  });

  test('no sponsor or product recommendation is generated', () => {
    const response = explainAITextSync(aiTextCalculatorFixtureRequest);

    expect(response.text ?? '').not.toMatch(/sponsor|affiliate|แนะนำสินค้า|ขายสินค้า/i);
    expect(response.safetyBoundary.noSponsorProduct).toBe(true);
  });

  test('no exact chemical or fertilizer prescription is generated', () => {
    const response = explainAITextSync(aiTextWeatherFixtureRequest);

    expect(response.text ?? '').not.toMatch(/กก\.\/ไร่|กิโลกรัมต่อไร่|ซีซี\/ไร่|dose/i);
    expect(response.safetyBoundary.noExactPrescription).toBe(true);
  });

  test('no guaranteed outcome language is generated', () => {
    const response = explainAITextSync(aiTextCalculatorFixtureRequest);

    expect(response.text ?? '').not.toMatch(/รับประกัน|guarantee|กำไรแน่นอน|ผลผลิตแน่นอน/i);
    expect(response.safetyBoundary.noGuaranteedOutcome).toBe(true);
  });

  test('audit preview is generated', () => {
    const response = explainAITextSync(aiTextCalculatorFixtureRequest);

    expect(response.auditPreview.requestId).toBe(aiTextCalculatorFixtureRequest.id);
    expect(response.auditPreview.wouldWriteAuditLog).toBe(false);
    expect(response.auditPreview.events).toContain('provider_key_frontend_absent');
  });

  test('rate-limit preview is generated', () => {
    const status = getAITextProxyStatus();
    const response = explainAITextSync(aiTextCalculatorFixtureRequest);

    expect(status.rateLimitPreview.rateLimitRequired).toBe(true);
    expect(response.rateLimitPreview.dailyLimit).toBeGreaterThan(0);
    expect(response.rateLimitPreview.wouldWriteRateLimit).toBe(false);
  });
});
