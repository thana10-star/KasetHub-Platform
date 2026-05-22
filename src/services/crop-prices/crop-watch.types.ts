import type { CropPriceCategory, CropPriceItem, CropPriceReliabilityLevel } from '@/services/crop-prices/crop-price.types';

export type CropWatchAlertType = 'price_up' | 'price_down' | 'target_price' | 'weekly_summary';

export type CropWatchAlertPreference = {
  id: string;
  alertType: CropWatchAlertType;
  enabled: boolean;
  targetPrice?: number;
  createdAt: string;
  updatedAt: string;
};

export type CropWatch = {
  id: string;
  cropKey: string;
  cropName: string;
  category: CropPriceCategory;
  priceId: string;
  preferredMarketId: string;
  preferredMarketLabel: string;
  preferredRegionId: string;
  preferredRegionLabel: string;
  sourceLabel: string;
  unitLabel: string;
  latestReferencePrice: number;
  latestPriceLabel: string;
  reliabilityLevel: CropPriceReliabilityLevel;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
  alertPreferences: CropWatchAlertPreference[];
  metadata: Record<string, unknown>;
};

export type CropWatchState = {
  version: number;
  watches: CropWatch[];
  migrations: string[];
  updatedAt: string;
};

export type CropWatchInput = {
  price: CropPriceItem;
  enabled?: boolean;
  alertTypes?: CropWatchAlertType[];
  targetPrice?: number;
  metadata?: Record<string, unknown>;
};

export type CropWatchAlertInput = {
  price: CropPriceItem;
  alertType: CropWatchAlertType;
  enabled: boolean;
  targetPrice?: number;
};
