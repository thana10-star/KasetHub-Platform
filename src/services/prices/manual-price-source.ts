import { manualCommodityPriceRows, manualFertilizerPriceRows } from '@/services/prices/price-manual-data';
import type { ManualCommodityPriceRow, ManualFertilizerPriceRow } from '@/services/prices/price.types';

export function listManualCommodityPriceRows(rows: ManualCommodityPriceRow[] = manualCommodityPriceRows) {
  return [...rows];
}

export function listManualFertilizerPriceRows(rows: ManualFertilizerPriceRow[] = manualFertilizerPriceRows) {
  return [...rows];
}
