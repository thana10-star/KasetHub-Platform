import type { ManualCommodityPriceRow, ManualFertilizerPriceRow } from '@/services/prices/price.types';

export const ownerManualPriceCommodityTargets = [
  { code: 'rice', nameTh: 'ข้าว' },
  { code: 'rubber', nameTh: 'ยางพารา' },
  { code: 'cassava', nameTh: 'มันสำปะหลัง' },
  { code: 'sugarcane', nameTh: 'อ้อย' },
] as const;

// Owner-provided real rows belong here only after source, unit, updatedAt, fetchedAt,
// and original source context are verified. It intentionally stays empty until then
// so sample prices never become live prices by accident.
export const manualCommodityPriceRows: ManualCommodityPriceRow[] = [];

// Fertilizer is guarded for M119 and remains source-pending until a verified source,
// formula, package size, unit, updatedAt, and fetchedAt are approved.
export const manualFertilizerPriceRows: ManualFertilizerPriceRow[] = [];
