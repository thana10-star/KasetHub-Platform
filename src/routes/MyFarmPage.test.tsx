import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, test } from 'vitest';
import { MyFarmPage } from '@/routes/MyFarmPage';

describe('M90 My Farm cost summary entry', () => {
  test('renders Farm Records restore/sync entry point', () => {
    const html = renderToString(
      <MemoryRouter>
        <MyFarmPage />
      </MemoryRouter>,
    );

    expect(html).toContain('/app/farm-records#farm-cost-dashboard');
    expect(html).toContain('ฟาร์มของฉัน');
    expect(html).toContain('เริ่มจากเพิ่มแปลง แล้วบันทึกรายรับรายจ่ายหรือผลผลิต');
    expect(html).toContain('เพิ่มแปลง');
    expect(html).toContain('บันทึกรายรับ/รายจ่าย');
    expect(html).toContain('บันทึกผลผลิต');
    expect(html).toContain('/app/help');
    expect(html).toContain('data-testid="my-farm-primary-area"');
    expect(html).toContain('บันทึกในเครื่องนี้');
    expect(html).toContain('สำรอง/กู้คืนได้');
    expect(html).toContain('ซิงก์บัญชีปิดอยู่');
    expect(html).toContain('สมุดฟาร์มของฉัน');
    expect(html).toContain('ต้นทุนต่อไร่');
    expect(html).toContain('หมวดรายจ่ายสูงสุด');
    expect(html).toContain('kg');
    expect(html).toContain('2026-09-02');

    const primaryAreaStart = html.indexOf('data-testid="my-farm-primary-area"');
    const primaryAreaEnd = html.indexOf('ข้อมูลฟาร์มยังอยู่ในเครื่องนี้');
    const primaryAreaHtml = html.slice(primaryAreaStart, primaryAreaEnd);

    expect(primaryAreaStart).toBeGreaterThan(-1);
    expect(primaryAreaEnd).toBeGreaterThan(primaryAreaStart);
    expect(primaryAreaHtml.toLowerCase()).not.toContain('prototype');
    expect(primaryAreaHtml.toLowerCase()).not.toContain('debug');
    expect(primaryAreaHtml.toLowerCase()).not.toContain('local-only');
  });
});
