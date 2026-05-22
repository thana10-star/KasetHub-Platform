import { cropPriceItems, cropPriceMarkets, cropPriceRegions, cropPriceSnapshots } from '@/services/crop-prices/crop-price-fixtures';
import { cropPriceSources } from '@/services/crop-prices/crop-price-sources';
import type {
  CropPriceCategory,
  CropPriceFilter,
  CropPriceItem,
  CropPriceMarket,
  CropPriceRegion,
  CropPriceSourceId,
} from '@/services/crop-prices/crop-price.types';

const categoryOrder: CropPriceCategory[] = ['ข้าว', 'ผลไม้', 'พืชไร่', 'ผัก'];
const priceFormatter = new Intl.NumberFormat('th-TH', {
  maximumFractionDigits: 2,
});

function normalizeText(value: string) {
  return value.trim().toLocaleLowerCase('th-TH');
}

function matchesSearch(item: CropPriceItem, search: string) {
  const keyword = normalizeText(search);

  if (!keyword) {
    return true;
  }

  return [
    item.cropName,
    item.category,
    item.sourceLabel,
    item.market.label,
    item.region.label,
    item.qualityGrade?.label ?? '',
  ]
    .map(normalizeText)
    .some((field) => field.includes(keyword));
}

function matchesRegionOrMarket(item: CropPriceItem, regionOrMarketId?: string) {
  if (!regionOrMarketId || regionOrMarketId === 'all') {
    return true;
  }

  if (regionOrMarketId.startsWith('region:')) {
    return item.region.id === regionOrMarketId.replace('region:', '');
  }

  if (regionOrMarketId.startsWith('market:')) {
    return item.market.id === regionOrMarketId.replace('market:', '');
  }

  return true;
}

export function listCropPriceItems(filter: CropPriceFilter = {}) {
  return cropPriceItems.filter((item) => {
    const categoryMatch = !filter.category || filter.category === 'ทั้งหมด' || item.category === filter.category;
    const sourceMatch = !filter.sourceId || filter.sourceId === 'all' || item.sourceId === filter.sourceId;

    return categoryMatch && sourceMatch && matchesRegionOrMarket(item, filter.regionOrMarketId) && matchesSearch(item, filter.search ?? '');
  });
}

export function findCropPriceItem(priceId: string) {
  return cropPriceItems.find((item) => item.id === priceId);
}

export function listCropPriceCategories(): Array<CropPriceCategory | 'ทั้งหมด'> {
  const available = new Set(cropPriceItems.map((item) => item.category));
  return ['ทั้งหมด', ...categoryOrder.filter((category) => available.has(category))];
}

export function listCropPriceSources() {
  return cropPriceSources;
}

export function listCropPriceSourceOptions() {
  const sourceIdsWithItems = new Set<CropPriceSourceId>(cropPriceItems.map((item) => item.sourceId));
  return cropPriceSources.filter((source) => sourceIdsWithItems.has(source.id));
}

export function listCropPriceRegionMarketOptions() {
  const options: Array<{ id: string; label: string; kind: 'region' | 'market' }> = [];
  const seen = new Set<string>();

  cropPriceItems.forEach((item) => {
    const regionId = `region:${item.region.id}`;
    const marketId = `market:${item.market.id}`;

    if (!seen.has(regionId)) {
      options.push({ id: regionId, label: item.region.label, kind: 'region' });
      seen.add(regionId);
    }

    if (!seen.has(marketId)) {
      options.push({ id: marketId, label: item.market.label, kind: 'market' });
      seen.add(marketId);
    }
  });

  return options;
}

export function listCropPriceRegions(): CropPriceRegion[] {
  return cropPriceRegions;
}

export function listCropPriceMarkets(): CropPriceMarket[] {
  return cropPriceMarkets;
}

export function getLatestCropPriceSnapshot() {
  return cropPriceSnapshots[0];
}

export function formatCropReferencePrice(item: CropPriceItem) {
  return `${priceFormatter.format(item.referencePrice)} ${item.unit.label}`;
}
