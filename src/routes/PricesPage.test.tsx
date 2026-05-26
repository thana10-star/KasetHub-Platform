import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, test } from 'vitest';
import { PricesPage } from '@/routes/PricesPage';

describe('M108.2 production agriculture price hub', () => {
  test('renders the price hub with source-pending commodity categories', () => {
    const html = renderToString(
      <MemoryRouter>
        <PricesPage />
      </MemoryRouter>,
    );

    expect(html).toContain('ราคาเกษตร');
    expect(html).toContain('เช็กราคาสินค้าเกษตรและแนวโน้มเบื้องต้น');
    expect(html).toContain('ยังไม่แสดงราคาจริงจนกว่าจะเชื่อมแหล่งข้อมูล');
    expect(html).toContain('เตรียมเชื่อมแหล่งข้อมูลราคา');
    expect(html).toContain('ข้าว');
    expect(html).toContain('ข้าวโพด');
    expect(html).toContain('มันสำปะหลัง');
    expect(html).toContain('อ้อย');
    expect(html).toContain('ยางพารา');
    expect(html).toContain('ปาล์มน้ำมัน');
    expect(html).toContain('พริก');
    expect(html).toContain('ผัก/ผลไม้');
  });

  test('does not render fake numeric commodity prices while the source is pending', () => {
    const html = renderToString(
      <MemoryRouter>
        <PricesPage />
      </MemoryRouter>,
    );

    expect(html).not.toMatch(/\d[\d,.]*\s*(บาท|฿)/);
    expect(html).not.toContain('15,150');
    expect(html).not.toContain('3.15');
    expect(html).not.toContain('ราคาอ้างอิง');
    expect(html.toLowerCase()).not.toContain('mock');
    expect(html.toLowerCase()).not.toContain('demo');
  });
});
