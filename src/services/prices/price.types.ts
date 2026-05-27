export type PriceTrend = 'up' | 'down' | 'flat' | 'unknown';

export type PriceSourceType = 'api' | 'csv' | 'webpage' | 'pdf' | 'manual' | 'unknown';

export type PriceFreshnessPolicy = 'daily_market' | 'weekly_industry' | 'seasonal_reference';

export type CommodityPriceCategory =
  | 'crop'
  | 'rubber'
  | 'sugarcane'
  | 'palm'
  | 'corn'
  | 'fruit'
  | 'vegetable'
  | 'other';

export type PriceSourceStatusValue = 'healthy' | 'stale' | 'degraded' | 'unavailable' | 'not_connected';

export type CommodityPrice = {
  id: string;
  commodityCode: string;
  commodityNameTh: string;
  category: CommodityPriceCategory;
  marketName: string;
  province?: string;
  unit: string;
  price: number;
  priceMax?: number;
  currency: 'THB';
  changeAmount?: number;
  changePercent?: number;
  trend: PriceTrend;
  sourceName: string;
  sourceDisplayName: string;
  sourceUrl?: string;
  sourceType: PriceSourceType;
  sourceAttribution: string;
  updatedAt: string;
  fetchedAt: string;
  freshnessPolicy: PriceFreshnessPolicy;
  showOnHome: boolean;
  isStale: boolean;
  isEstimated: false;
  notes?: string;
};

export type FertilizerPrice = {
  id: string;
  fertilizerCode: string;
  fertilizerNameTh: string;
  formula: string;
  packageSize: string;
  unit: string;
  price: number;
  currency: 'THB';
  region?: string;
  province?: string;
  sourceName: string;
  sourceUrl?: string;
  sourceType: PriceSourceType;
  sourceAttribution: string;
  updatedAt: string;
  fetchedAt: string;
  isStale: boolean;
  notes?: string;
};

export type PriceSourceStatus = {
  sourceName: string;
  status: PriceSourceStatusValue;
  lastSuccessAt?: string;
  lastErrorAt?: string;
  freshnessWindowHours: number;
  attribution: string;
};

export type ManualCommodityPriceRow = {
  id?: string;
  commodityCode?: string;
  commodityNameTh?: string;
  category?: CommodityPriceCategory;
  marketName?: string;
  province?: string;
  unit?: string;
  price?: number | null;
  priceMax?: number | null;
  currency?: 'THB';
  changeAmount?: number;
  changePercent?: number;
  trend?: PriceTrend;
  sourceName?: string;
  sourceDisplayName?: string;
  sourceUrl?: string;
  sourceType?: PriceSourceType;
  sourceAttribution?: string;
  updatedAt?: string;
  fetchedAt?: string;
  freshnessPolicy?: PriceFreshnessPolicy;
  freshnessWindowHours?: number;
  showOnHome?: boolean;
  isEstimated?: boolean;
  notes?: string;
};

export type ManualFertilizerPriceRow = {
  id?: string;
  fertilizerCode?: string;
  fertilizerNameTh?: string;
  formula?: string;
  packageSize?: string;
  unit?: string;
  price?: number | null;
  currency?: 'THB';
  region?: string;
  province?: string;
  sourceName?: string;
  sourceUrl?: string;
  sourceType?: PriceSourceType;
  sourceAttribution?: string;
  updatedAt?: string;
  fetchedAt?: string;
  isEstimated?: boolean;
  notes?: string;
};

export type PriceValidationErrorCode =
  | 'missing_source'
  | 'missing_updated_at'
  | 'missing_fetched_at'
  | 'missing_unit'
  | 'missing_name'
  | 'missing_market'
  | 'invalid_price'
  | 'invalid_price_range'
  | 'invalid_updated_at'
  | 'invalid_fetched_at'
  | 'estimated_not_allowed';

export type PriceValidationIssue = {
  code: PriceValidationErrorCode;
  message: string;
  rowId?: string;
};

export type PriceValidationResult<TPrice> = {
  ok: boolean;
  acceptedRows: TPrice[];
  rejectedRowCount: number;
  errors: PriceValidationIssue[];
};
