import type { CommodityPrice, PriceSourceStatus, PriceValidationIssue } from '@/services/prices/price.types';
import { PRICE_FRESHNESS_WINDOW_HOURS } from '@/services/prices/price-validation';

export const MANUAL_PRICE_SOURCE_NAME = 'KasetHub owner-curated manual price source';

export const DEFAULT_MANUAL_PRICE_SOURCE_STATUS: PriceSourceStatus = {
  attribution: 'Owner-curated source with explicit original source names and update dates.',
  freshnessWindowHours: PRICE_FRESHNESS_WINDOW_HOURS.daily_market,
  sourceName: MANUAL_PRICE_SOURCE_NAME,
  status: 'not_connected',
};

type BuildSourceStatusInput = {
  rows: CommodityPrice[];
  errors: PriceValidationIssue[];
};

export function buildManualPriceSourceStatus(input: BuildSourceStatusInput): PriceSourceStatus {
  if (input.rows.length === 0 && input.errors.length === 0) {
    return DEFAULT_MANUAL_PRICE_SOURCE_STATUS;
  }

  if (input.rows.length === 0) {
    return {
      ...DEFAULT_MANUAL_PRICE_SOURCE_STATUS,
      lastErrorAt: new Date().toISOString(),
      status: 'unavailable',
    };
  }

  const lastSuccessAt = input.rows
    .map((row) => row.fetchedAt)
    .sort((left, right) => right.localeCompare(left))[0];
  const hasStaleRows = input.rows.some((row) => row.isStale);
  const status = input.errors.length > 0 ? 'degraded' : hasStaleRows ? 'stale' : 'healthy';

  return {
    ...DEFAULT_MANUAL_PRICE_SOURCE_STATUS,
    lastSuccessAt,
    status,
  };
}
