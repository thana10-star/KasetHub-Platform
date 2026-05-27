import { listManualCommodityPriceRows } from '@/services/prices/manual-price-source';
import { buildManualPriceSourceStatus } from '@/services/prices/price-source-status';
import type {
  CommodityPrice,
  FertilizerPrice,
  ManualCommodityPriceRow,
  PriceSourceStatus,
  PriceValidationIssue,
} from '@/services/prices/price.types';
import { validateCommodityPriceRows } from '@/services/prices/price-validation';

const HOME_COMMODITY_ORDER = ['rice', 'rubber', 'cassava', 'sugarcane'];

export type PriceAdapterSnapshot = {
  commodityPrices: CommodityPrice[];
  fertilizerPrices: FertilizerPrice[];
  rejectedCommodityRows: PriceValidationIssue[];
  sourceStatus: PriceSourceStatus;
  hasValidatedCommodityPrices: boolean;
  hasValidatedFertilizerPrices: boolean;
};

type PriceAdapterSnapshotOptions = {
  commodityRows?: ManualCommodityPriceRow[];
  now?: Date;
};

function sortCommodityPricesForHome(rows: CommodityPrice[]) {
  return [...rows].sort((left, right) => {
    const leftIndex = HOME_COMMODITY_ORDER.indexOf(left.commodityCode);
    const rightIndex = HOME_COMMODITY_ORDER.indexOf(right.commodityCode);
    const normalizedLeft = leftIndex === -1 ? HOME_COMMODITY_ORDER.length : leftIndex;
    const normalizedRight = rightIndex === -1 ? HOME_COMMODITY_ORDER.length : rightIndex;

    return normalizedLeft - normalizedRight || left.commodityNameTh.localeCompare(right.commodityNameTh, 'th');
  });
}

export function getPriceAdapterSnapshot(options: PriceAdapterSnapshotOptions = {}): PriceAdapterSnapshot {
  const commodityRows = listManualCommodityPriceRows(options.commodityRows);
  const commodityValidation = validateCommodityPriceRows(commodityRows, { now: options.now });

  return {
    commodityPrices: commodityValidation.acceptedRows,
    fertilizerPrices: [],
    hasValidatedCommodityPrices: commodityValidation.acceptedRows.length > 0,
    hasValidatedFertilizerPrices: false,
    rejectedCommodityRows: commodityValidation.errors,
    sourceStatus: buildManualPriceSourceStatus({
      errors: commodityValidation.errors,
      rows: commodityValidation.acceptedRows,
    }),
  };
}

export function getHomeCommodityPrices(snapshot: PriceAdapterSnapshot = getPriceAdapterSnapshot()) {
  return sortCommodityPricesForHome(
    snapshot.commodityPrices.filter((row) => row.showOnHome && !row.isStale),
  ).slice(0, 4);
}
