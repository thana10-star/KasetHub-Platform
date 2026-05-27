import type { ManualCommodityPriceRow, ManualFertilizerPriceRow } from '@/services/prices/price.types';

// Owner-provided real rows belong here after source, unit, updatedAt, and fetchedAt are verified.
// It intentionally starts empty so sample prices never become live prices by accident.
export const manualCommodityPriceRows: ManualCommodityPriceRow[] = [];

// Fertilizer is guarded for M118 and remains source-pending until a verified source is approved.
export const manualFertilizerPriceRows: ManualFertilizerPriceRow[] = [];
