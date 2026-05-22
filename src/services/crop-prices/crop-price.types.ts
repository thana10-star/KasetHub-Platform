export type CropPriceReliabilityLevel =
  | 'official'
  | 'market_reference'
  | 'community_unverified'
  | 'demo_sample';

export type CropPriceSourceStatus =
  | 'planned'
  | 'fixture_only'
  | 'manual_review_needed'
  | 'disabled';

export type CropPriceChangeDirection = 'up' | 'down' | 'same';

export type CropPriceSourceType = 'official_agency' | 'market_reference' | 'manual_report' | 'community_report';

export type CropPriceSourceId =
  | 'oae'
  | 'dit'
  | 'talad-thai'
  | 'local-market-manual'
  | 'community-price-report';

export type CropPriceCategory = 'ข้าว' | 'ผลไม้' | 'พืชไร่' | 'ผัก';

export type CropPriceSource = {
  id: CropPriceSourceId;
  label: string;
  shortLabel: string;
  thaiName: string;
  sourceType: CropPriceSourceType;
  reliabilityLevel: CropPriceReliabilityLevel;
  status: CropPriceSourceStatus;
  attributionLabel: string;
  plannedConnectionMethod: 'api' | 'manual_import' | 'admin_entry' | 'community_submission';
  freshnessPolicy: string;
  notes: string;
};

export type CropPriceRegion = {
  id: string;
  label: string;
  scope: 'country' | 'region' | 'province';
  province?: string;
  regionGroup?: string;
};

export type CropPriceMarket = {
  id: string;
  label: string;
  marketType: 'official_reference' | 'wholesale_market' | 'farm_gate' | 'local_buying_point' | 'community_report';
  regionId: string;
};

export type CropPriceUnit = {
  id: string;
  label: string;
  shortLabel: string;
  quantityLabel: string;
};

export type CropPriceQualityGrade = {
  id: string;
  label: string;
  description?: string;
};

export type CropPriceTrendPoint = {
  label: string;
  referencePrice: number;
  priceLabel: string;
  direction: CropPriceChangeDirection;
};

export type CropPriceItem = {
  id: string;
  cropKey: string;
  cropName: string;
  category: CropPriceCategory;
  sourceId: CropPriceSourceId;
  sourceLabel: string;
  sourceStatus: CropPriceSourceStatus;
  reliabilityLevel: CropPriceReliabilityLevel;
  market: CropPriceMarket;
  region: CropPriceRegion;
  unit: CropPriceUnit;
  qualityGrade?: CropPriceQualityGrade;
  referencePrice: number;
  priceLabel: string;
  currency: 'THB';
  capturedAt: string;
  capturedAtLabel: string;
  previousReferencePrice?: number;
  changeAmount: number;
  changePercent: number;
  changeDirection: CropPriceChangeDirection;
  isDemoSample: boolean;
  demoLabel: string;
  summary: string;
  disclaimer: string;
  relatedArticleIds: string[];
  relatedVideoIds: string[];
  recentTrend: CropPriceTrendPoint[];
};

export type CropPriceSnapshot = {
  id: string;
  sourceId: CropPriceSourceId;
  snapshotLabel: string;
  capturedAt: string;
  sourceStatus: CropPriceSourceStatus;
  reliabilityLevel: CropPriceReliabilityLevel;
  items: CropPriceItem[];
  notes: string;
};

export type CropPriceFilter = {
  search?: string;
  category?: CropPriceCategory | 'ทั้งหมด';
  sourceId?: CropPriceSourceId | 'all';
  regionOrMarketId?: string;
};
