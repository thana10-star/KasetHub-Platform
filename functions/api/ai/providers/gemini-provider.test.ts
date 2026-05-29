import { describe, expect, test, vi } from 'vitest';
import { createGeminiDryRunProvider } from './gemini-provider';

describe('M142 Gemini dry-run provider adapter', () => {
  test('implements the provider interface in dry-run mode', () => {
    const provider = createGeminiDryRunProvider();
    const health = provider.getHealth();

    expect(provider.providerName).toBe('gemini');
    expect(provider.providerMode).toBe('dry_run');
    expect(health).toMatchObject({
      providerName: 'gemini',
      providerMode: 'dry_run',
      status: 'dry_run_ready',
      reasonCode: 'gemini_dry_run_only',
    });
  });

  test('generates a mock response without network access or key requirements', async () => {
    const originalFetch = globalThis.fetch;
    const fetchSpy = vi.fn(async () => new Response('{}'));
    globalThis.fetch = fetchSpy as typeof fetch;

    try {
      const provider = createGeminiDryRunProvider();
      const response = await provider.generateAnswer({
        question: 'ใบข้าวมีจุดสีน้ำตาลควรดูอะไร',
        crop: 'ข้าว',
        province: 'สุพรรณบุรี',
        topic: 'plant_problem',
        userMode: 'guest',
        requestId: 'ai-farmer-provider-test',
      });
      const serialized = JSON.stringify(response);

      expect(fetchSpy).not.toHaveBeenCalled();
      expect(response.status).toBe('ready');
      expect(response.provider).toBe('mock');
      expect(response.providerMode).toBe('dry_run');
      expect(response.requestId).toBe('ai-farmer-provider-test');
      expect(response.answer).toBe('นี่เป็นคำตอบทดสอบจากระบบ AI เกษตรรุ่นทดลอง ขณะนี้ยังไม่ได้เปิดใช้งาน Gemini จริง');
      expect(serialized).toContain('ไม่ใช่คำตอบจาก Gemini จริง');
      expect(serialized).not.toContain('GEMINI_API_KEY');
      expect(serialized).not.toContain('AIza');
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  test('reports live flag as ignored instead of enabling live Gemini', () => {
    const provider = createGeminiDryRunProvider({ liveFlagEnabled: true });

    expect(provider.providerMode).toBe('dry_run');
    expect(provider.getHealth()).toMatchObject({
      status: 'dry_run_ready',
      reasonCode: 'gemini_live_flag_ignored_in_m142',
    });
  });
});
