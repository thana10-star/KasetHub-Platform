import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, test } from 'vitest';
import { AIPage, FarmerAssistantContractResponseCard } from '@/routes/AIPage';
import { AI_FARMER_ASSISTANT_SAFETY_NOTE } from '@/services/ai/ai-farmer-assistant-copy';

describe('M101 AI-first farmer assistant UX', () => {
  test('renders farmer-facing AI page copy, prompt input, examples, and safety note', () => {
    const html = renderToString(
      <MemoryRouter>
        <AIPage />
      </MemoryRouter>,
    );

    expect(html).toContain('ถาม AI เกษตร');
    expect(html).toContain('ถามเรื่องพืช ดิน ปุ๋ย โรค แมลง อากาศ และการจัดการฟาร์ม');
    expect(html).toContain('พิมพ์คำถาม เช่น ใบมะนาวเหลืองเกิดจากอะไร');
    expect(html).toContain('ถาม AI');
    expect(html).toContain('ระบบ AI กำลังเตรียมเปิดใช้งาน');
    expect(html).toContain('ใบเหลืองเกิดจากอะไร');
    expect(html).toContain('ดินแข็งควรปรับปรุงยังไง');
    expect(html).toContain('ฝนตกหลายวันต้องระวังอะไร');
    expect(html).toContain(AI_FARMER_ASSISTANT_SAFETY_NOTE);
  });

  test('keeps certainty claims and internal controls out of the AI page', () => {
    const html = renderToString(
      <MemoryRouter>
        <AIPage />
      </MemoryRouter>,
    );
    const lowerHtml = html.toLowerCase();

    expect(html).not.toContain('ตอบถูกทุกเรื่อง');
    expect(html).not.toContain('คำแนะนำแน่นอน');
    expect(html).not.toContain('ใช้แทนผู้เชี่ยวชาญ');
    expect(html).not.toContain('วิเคราะห์โรคได้ชัวร์');
    expect(html).not.toContain('/app/ai-proxy-status');
    expect(html).not.toContain('ตัวเลือกคำตอบสำหรับทีมงาน');
    expect(html).not.toContain('QA');
    expect(lowerHtml).not.toContain('readiness');
    expect(lowerHtml).not.toContain('prototype');
    expect(lowerHtml).not.toContain('debug');
  });
});

describe('M139 AI frontend backend contract states', () => {
  test('renders friendly not_configured copy from the backend contract state', () => {
    const html = renderToString(
      <MemoryRouter>
        <FarmerAssistantContractResponseCard
          onRetry={() => undefined}
          response={{
            status: 'not_configured',
            answer: 'ระบบ AI กำลังเตรียมเปิดใช้งาน',
            provider: 'disabled',
            requestId: 'ai-farmer-not-configured',
          }}
        />
      </MemoryRouter>,
    );

    expect(html).toContain('ตอนนี้ผู้ช่วย AI เกษตรยังไม่ได้เปิดใช้งานเต็มรูปแบบ');
    expect(html).not.toContain('API key');
    expect(html).not.toContain('OPENAI_API_KEY');
  });

  test('renders blocked high-risk response without chemical dosage advice', () => {
    const html = renderToString(
      <MemoryRouter>
        <FarmerAssistantContractResponseCard
          onRetry={() => undefined}
          response={{
            status: 'blocked',
            answer: 'คำถามนี้เสี่ยงต่อความปลอดภัย แอพจึงไม่ให้คำแนะนำเรื่องอัตราใช้หรือการผสมสารเคมี',
            safetyLevel: 'high_risk',
            provider: 'disabled',
            requestId: 'ai-farmer-blocked',
          }}
        />
      </MemoryRouter>,
    );

    expect(html).toContain('คำถามนี้เสี่ยงต่อความปลอดภัย');
    expect(html).toContain('ต้องระวังความปลอดภัย');
    expect(html).not.toMatch(/ซีซีต่อถัง\s*\d/);
  });

  test('renders rate-limited retry guidance', () => {
    const response = {
      status: 'rate_limited' as const,
      answer: 'ถามถี่เกินไป',
      provider: 'disabled' as const,
      retryAfterSeconds: 45,
      requestId: 'ai-farmer-rate-limited',
    };
    const html = renderToString(
      <MemoryRouter>
        <FarmerAssistantContractResponseCard onRetry={() => undefined} response={response} />
      </MemoryRouter>,
    );

    expect(html).toContain('ถามถี่เกินไป ลองใหม่อีกครั้งในอีก 45 วินาที');
    expect(html).toContain('ลองส่งอีกครั้ง');
  });

  test('keeps backend errors user-facing and non-technical', () => {
    const html = renderToString(
      <MemoryRouter>
        <FarmerAssistantContractResponseCard
          onRetry={() => undefined}
          response={{
            status: 'error',
            answer: 'ยังตอบคำถามนี้ไม่ได้ ลองใหม่อีกครั้ง',
            provider: 'disabled',
            requestId: 'ai-farmer-error',
          }}
        />
      </MemoryRouter>,
    );
    const lowerHtml = html.toLowerCase();

    expect(html).toContain('ยังตอบคำถามนี้ไม่ได้');
    expect(lowerHtml).not.toContain('api error');
    expect(lowerHtml).not.toContain('provider failed');
    expect(lowerHtml).not.toContain('undefined');
    expect(lowerHtml).not.toContain('null');
  });

  test('labels ready mock responses as test preview only', () => {
    const html = renderToString(
      <MemoryRouter>
        <FarmerAssistantContractResponseCard
          onRetry={() => undefined}
          response={{
            status: 'ready',
            answer: 'ตัวอย่างคำตอบสำหรับทดสอบเท่านั้น',
            provider: 'mock',
            requestId: 'ai-farmer-ready-mock',
          }}
        />
      </MemoryRouter>,
    );

    expect(html).toContain('ตัวอย่างสำหรับทดสอบระบบเท่านั้น');
    expect(html).toContain('ยังไม่ใช่คำตอบจาก AI จริง');
  });

  test('keeps local fixture fallback available by default', () => {
    const html = renderToString(
      <MemoryRouter>
        <AIPage />
      </MemoryRouter>,
    );

    expect(html).toContain('ระบบ AI กำลังเตรียมเปิดใช้งาน');
    expect(html).toContain('ถาม AI');
    expect(html).not.toContain('VITE_OPENAI_API_KEY');
    expect(html).not.toContain('VITE_GEMINI_API_KEY');
  });
});
