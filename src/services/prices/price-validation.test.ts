import { describe, expect, test } from 'vitest';
import type { ManualCommodityPriceRow } from '@/services/prices/price.types';
import { validateCommodityPriceRows } from '@/services/prices/price-validation';

const validManualRow: ManualCommodityPriceRow = {
  commodityCode: 'rice',
  commodityNameTh: 'ข้าว',
  fetchedAt: '2026-05-27T01:00:00.000Z',
  id: 'rice-bangkok',
  marketName: 'ตลาดกลางทดสอบ',
  price: 12500,
  sourceName: 'แหล่งข้อมูลเจ้าของระบบ',
  sourceType: 'manual',
  unit: 'บาท/ตัน',
  updatedAt: '2026-05-27T00:00:00.000Z',
};

describe('price validation', () => {
  test('rejects rows without source', () => {
    const result = validateCommodityPriceRows([{ ...validManualRow, sourceName: undefined }], {
      now: new Date('2026-05-27T02:00:00.000Z'),
    });

    expect(result.acceptedRows).toHaveLength(0);
    expect(result.errors).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: 'missing_source', rowId: 'rice-bangkok' })]),
    );
  });

  test('rejects rows without updatedAt', () => {
    const result = validateCommodityPriceRows([{ ...validManualRow, updatedAt: undefined }], {
      now: new Date('2026-05-27T02:00:00.000Z'),
    });

    expect(result.acceptedRows).toHaveLength(0);
    expect(result.errors).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: 'missing_updated_at', rowId: 'rice-bangkok' })]),
    );
  });

  test('rejects price less than or equal to zero', () => {
    const result = validateCommodityPriceRows([{ ...validManualRow, price: 0 }], {
      now: new Date('2026-05-27T02:00:00.000Z'),
    });

    expect(result.acceptedRows).toHaveLength(0);
    expect(result.errors).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: 'invalid_price', rowId: 'rice-bangkok' })]),
    );
  });

  test('marks stale rows using the freshness window', () => {
    const result = validateCommodityPriceRows(
      [
        {
          ...validManualRow,
          fetchedAt: '2026-05-24T00:00:00.000Z',
          updatedAt: '2026-05-24T00:00:00.000Z',
        },
      ],
      { now: new Date('2026-05-27T02:00:00.000Z') },
    );

    expect(result.acceptedRows).toHaveLength(1);
    expect(result.acceptedRows[0].isStale).toBe(true);
  });

  test('normalizes valid manual rows with explicit non-estimated status', () => {
    const result = validateCommodityPriceRows([validManualRow], {
      now: new Date('2026-05-27T02:00:00.000Z'),
    });

    expect(result.ok).toBe(true);
    expect(result.acceptedRows).toEqual([
      expect.objectContaining({
        commodityCode: 'rice',
        commodityNameTh: 'ข้าว',
        currency: 'THB',
        isEstimated: false,
        isStale: false,
        price: 12500,
        sourceName: 'แหล่งข้อมูลเจ้าของระบบ',
      }),
    ]);
  });
});
