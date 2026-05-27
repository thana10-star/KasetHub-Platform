import { describe, expect, test } from 'vitest';
import { getHomeCommodityPrices, getPriceAdapterSnapshot } from '@/services/prices/price-adapter-service';
import type { ManualCommodityPriceRow } from '@/services/prices/price.types';

const validRows: ManualCommodityPriceRow[] = [
  {
    commodityCode: 'cassava',
    commodityNameTh: 'มันสำปะหลัง',
    fetchedAt: '2026-05-27T01:00:00.000Z',
    id: 'cassava',
    marketName: 'ตลาดกลางทดสอบ',
    price: 3.2,
    sourceName: 'แหล่งข้อมูลเจ้าของระบบ',
    unit: 'บาท/กก.',
    updatedAt: '2026-05-27T00:00:00.000Z',
  },
  {
    commodityCode: 'rice',
    commodityNameTh: 'ข้าว',
    fetchedAt: '2026-05-27T01:00:00.000Z',
    id: 'rice',
    marketName: 'ตลาดกลางทดสอบ',
    price: 12500,
    sourceName: 'แหล่งข้อมูลเจ้าของระบบ',
    unit: 'บาท/ตัน',
    updatedAt: '2026-05-27T00:00:00.000Z',
  },
];

describe('price adapter service', () => {
  test('returns source-pending snapshot when manual rows are empty', () => {
    const snapshot = getPriceAdapterSnapshot({ commodityRows: [] });

    expect(snapshot.hasValidatedCommodityPrices).toBe(false);
    expect(snapshot.commodityPrices).toHaveLength(0);
    expect(snapshot.sourceStatus.status).toBe('not_connected');
    expect(snapshot.hasValidatedFertilizerPrices).toBe(false);
  });

  test('returns only validated manual commodity rows', () => {
    const snapshot = getPriceAdapterSnapshot({
      commodityRows: [...validRows, { ...validRows[0], id: 'bad-row', sourceName: undefined }],
      now: new Date('2026-05-27T02:00:00.000Z'),
    });

    expect(snapshot.hasValidatedCommodityPrices).toBe(true);
    expect(snapshot.commodityPrices).toHaveLength(2);
    expect(snapshot.rejectedCommodityRows).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: 'missing_source', rowId: 'bad-row' })]),
    );
    expect(snapshot.sourceStatus.status).toBe('degraded');
  });

  test('orders home prices by V1 priority and never returns sample rows', () => {
    const snapshot = getPriceAdapterSnapshot({
      commodityRows: validRows,
      now: new Date('2026-05-27T02:00:00.000Z'),
    });

    const homeRows = getHomeCommodityPrices(snapshot);

    expect(homeRows.map((row) => row.commodityCode)).toEqual(['rice', 'cassava']);
    expect(homeRows.every((row) => row.sourceType === 'manual')).toBe(true);
  });
});
