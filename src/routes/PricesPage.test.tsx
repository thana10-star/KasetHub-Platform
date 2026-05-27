import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, test } from 'vitest';
import { PricesPage } from '@/routes/PricesPage';
import { getPriceAdapterSnapshot } from '@/services/prices/price-adapter-service';
import type { ManualCommodityPriceRow } from '@/services/prices/price.types';

const validManualPriceRow: ManualCommodityPriceRow = {
  commodityCode: 'rice',
  commodityNameTh: 'ข้าว',
  fetchedAt: '2026-05-27T01:00:00.000Z',
  id: 'rice-real',
  marketName: 'ตลาดกลางทดสอบ',
  price: 12500,
  sourceName: 'แหล่งข้อมูลเจ้าของระบบ',
  sourceType: 'manual',
  unit: 'บาท/ตัน',
  updatedAt: '2026-05-27T00:00:00.000Z',
};

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

  test('shows real commodity rows only when manual validation passes', () => {
    const priceSnapshot = getPriceAdapterSnapshot({
      commodityRows: [validManualPriceRow],
      now: new Date('2026-05-27T02:00:00.000Z'),
    });
    const html = renderToString(
      <MemoryRouter>
        <PricesPage priceSnapshot={priceSnapshot} />
      </MemoryRouter>,
    );

    expect(html).toContain('ราคาจากแหล่งข้อมูลที่ตรวจสอบแล้ว');
    expect(html).toContain('ข้าว');
    expect(html).toContain('12,500');
    expect(html).toContain('บาท/ตัน');
    expect(html).toContain('แหล่งข้อมูลเจ้าของระบบ');
    expect(html).toContain('อัปเดตแล้ว');
  });

  test('hides invalid manual rows and keeps the source-pending state', () => {
    const priceSnapshot = getPriceAdapterSnapshot({
      commodityRows: [{ ...validManualPriceRow, sourceName: undefined }],
      now: new Date('2026-05-27T02:00:00.000Z'),
    });
    const html = renderToString(
      <MemoryRouter>
        <PricesPage priceSnapshot={priceSnapshot} />
      </MemoryRouter>,
    );

    expect(html).toContain('ยังไม่แสดงราคาจริงจนกว่าจะเชื่อมแหล่งข้อมูล');
    expect(html).not.toContain('ราคาจากแหล่งข้อมูลที่ตรวจสอบแล้ว');
    expect(html).not.toContain('12,500');
    expect(html).not.toContain('แหล่งข้อมูลเจ้าของระบบ');
  });

  test('shows stale label when a validated manual row is older than its freshness window', () => {
    const priceSnapshot = getPriceAdapterSnapshot({
      commodityRows: [
        {
          ...validManualPriceRow,
          fetchedAt: '2026-05-24T01:00:00.000Z',
          updatedAt: '2026-05-24T00:00:00.000Z',
        },
      ],
      now: new Date('2026-05-27T02:00:00.000Z'),
    });
    const html = renderToString(
      <MemoryRouter>
        <PricesPage priceSnapshot={priceSnapshot} />
      </MemoryRouter>,
    );

    expect(html).toContain('ข้อมูลเก่า');
    expect(html).toContain('12,500');
    expect(html).toContain('บาท/ตัน');
  });

  test('keeps fertilizer source-pending without fake values', () => {
    const html = renderToString(
      <MemoryRouter>
        <PricesPage />
      </MemoryRouter>,
    );

    expect(html).toContain('ราคาปุ๋ย');
    expect(html).toContain('ยังไม่แสดงราคา');
    expect(html).toContain('ปุ๋ยยังรอแหล่งข้อมูลที่ตรวจสอบได้');
    expect(html).not.toContain('46-0-0');
    expect(html).not.toContain('15-15-15');
  });
});
