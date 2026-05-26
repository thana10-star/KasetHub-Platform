import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, test } from 'vitest';
import { AIPage } from '@/routes/AIPage';
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
