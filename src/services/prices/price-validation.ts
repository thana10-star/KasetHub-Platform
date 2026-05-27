import type {
  CommodityPrice,
  ManualCommodityPriceRow,
  PriceFreshnessPolicy,
  PriceValidationIssue,
  PriceValidationResult,
} from '@/services/prices/price.types';

const HOURS_IN_DAY = 24;

export const PRICE_FRESHNESS_WINDOW_HOURS: Record<PriceFreshnessPolicy, number> = {
  daily_market: 48,
  seasonal_reference: 180 * HOURS_IN_DAY,
  weekly_industry: 10 * HOURS_IN_DAY,
};

type ValidationOptions = {
  now?: Date;
};

function hasText(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function parseTimestamp(value: string | undefined) {
  if (!hasText(value)) return undefined;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;

  return date;
}

function getRowId(row: ManualCommodityPriceRow, index: number) {
  return row.id ?? `manual-price-row-${index + 1}`;
}

function addIssue(errors: PriceValidationIssue[], rowId: string, code: PriceValidationIssue['code'], message: string) {
  errors.push({ code, message, rowId });
}

export function isPriceRowStale(input: { updatedAt: string; now?: Date; freshnessWindowHours: number }) {
  const updatedAt = parseTimestamp(input.updatedAt);
  if (!updatedAt) return true;

  const now = input.now ?? new Date();
  const ageMs = now.getTime() - updatedAt.getTime();
  const freshnessMs = input.freshnessWindowHours * 60 * 60 * 1000;

  return ageMs > freshnessMs;
}

export function validateCommodityPriceRows(
  rows: ManualCommodityPriceRow[],
  options: ValidationOptions = {},
): PriceValidationResult<CommodityPrice> {
  const now = options.now ?? new Date();
  const acceptedRows: CommodityPrice[] = [];
  const errors: PriceValidationIssue[] = [];

  rows.forEach((row, index) => {
    const rowId = getRowId(row, index);
    const rowErrors: PriceValidationIssue[] = [];
    const updatedAt = parseTimestamp(row.updatedAt);
    const fetchedAt = parseTimestamp(row.fetchedAt);
    const commodityNameTh = row.commodityNameTh?.trim() ?? '';
    const marketName = row.marketName?.trim() ?? '';
    const sourceName = row.sourceName?.trim() ?? '';
    const unit = row.unit?.trim() ?? '';

    if (!hasText(commodityNameTh)) {
      addIssue(rowErrors, rowId, 'missing_name', 'Commodity name is required.');
    }

    if (!hasText(marketName)) {
      addIssue(rowErrors, rowId, 'missing_market', 'Market name is required.');
    }

    if (!hasText(unit)) {
      addIssue(rowErrors, rowId, 'missing_unit', 'Unit is required.');
    }

    if (!hasText(sourceName)) {
      addIssue(rowErrors, rowId, 'missing_source', 'Source name is required.');
    }

    if (!hasText(row.updatedAt)) {
      addIssue(rowErrors, rowId, 'missing_updated_at', 'Updated date is required.');
    } else if (!updatedAt) {
      addIssue(rowErrors, rowId, 'invalid_updated_at', 'Updated date must be a valid date.');
    }

    if (!hasText(row.fetchedAt)) {
      addIssue(rowErrors, rowId, 'missing_fetched_at', 'Fetched date is required.');
    } else if (!fetchedAt) {
      addIssue(rowErrors, rowId, 'invalid_fetched_at', 'Fetched date must be a valid date.');
    }

    if (typeof row.price !== 'number' || !Number.isFinite(row.price) || row.price <= 0) {
      addIssue(rowErrors, rowId, 'invalid_price', 'Price must be a number greater than zero.');
    }

    if (row.isEstimated === true) {
      addIssue(rowErrors, rowId, 'estimated_not_allowed', 'Estimated prices are not allowed for V1 display.');
    }

    if (rowErrors.length > 0 || !updatedAt || !fetchedAt || typeof row.price !== 'number') {
      errors.push(...rowErrors);
      return;
    }

    const freshnessPolicy = row.freshnessPolicy ?? 'daily_market';
    const freshnessWindowHours = row.freshnessWindowHours ?? PRICE_FRESHNESS_WINDOW_HOURS[freshnessPolicy];

    acceptedRows.push({
      id: rowId,
      category: row.category ?? 'crop',
      changeAmount: row.changeAmount,
      changePercent: row.changePercent,
      commodityCode: row.commodityCode ?? rowId,
      commodityNameTh,
      currency: row.currency ?? 'THB',
      fetchedAt: fetchedAt.toISOString(),
      freshnessPolicy,
      isEstimated: false,
      isStale: isPriceRowStale({
        freshnessWindowHours,
        now,
        updatedAt: updatedAt.toISOString(),
      }),
      marketName,
      notes: row.notes,
      price: row.price,
      province: row.province,
      sourceAttribution: row.sourceAttribution?.trim() || sourceName,
      sourceName,
      sourceType: row.sourceType ?? 'manual',
      sourceUrl: row.sourceUrl,
      trend: row.trend ?? 'unknown',
      unit,
      updatedAt: updatedAt.toISOString(),
    });
  });

  return {
    acceptedRows,
    errors,
    ok: errors.length === 0,
    rejectedRowCount: rows.length - acceptedRows.length,
  };
}
