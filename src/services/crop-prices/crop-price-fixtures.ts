import type {
  CropPriceChangeDirection,
  CropPriceItem,
  CropPriceMarket,
  CropPriceQualityGrade,
  CropPriceRegion,
  CropPriceSnapshot,
  CropPriceSourceId,
  CropPriceUnit,
} from '@/services/crop-prices/crop-price.types';
import { cropPriceDisclaimer, findCropPriceSource } from '@/services/crop-prices/crop-price-sources';

export const cropPriceUnits: CropPriceUnit[] = [
  { id: 'thb-per-kg', label: 'บาท/กก.', shortLabel: 'กก.', quantityLabel: 'ต่อกิโลกรัม' },
  { id: 'thb-per-ton', label: 'บาท/ตัน', shortLabel: 'ตัน', quantityLabel: 'ต่อตัน' },
];

export const cropPriceRegions: CropPriceRegion[] = [
  { id: 'th-country', label: 'ประเทศไทย', scope: 'country' },
  { id: 'yasothon', label: 'ยโสธร', scope: 'province', province: 'ยโสธร', regionGroup: 'ตะวันออกเฉียงเหนือ' },
  { id: 'nakhon-ratchasima', label: 'นครราชสีมา', scope: 'province', province: 'นครราชสีมา', regionGroup: 'ตะวันออกเฉียงเหนือ' },
  { id: 'chanthaburi', label: 'จันทบุรี', scope: 'province', province: 'จันทบุรี', regionGroup: 'ตะวันออก' },
  { id: 'ratchaburi', label: 'ราชบุรี', scope: 'province', province: 'ราชบุรี', regionGroup: 'ตะวันตก' },
  { id: 'phetchabun', label: 'เพชรบูรณ์', scope: 'province', province: 'เพชรบูรณ์', regionGroup: 'เหนือ' },
  { id: 'pathum-thani', label: 'ปทุมธานี', scope: 'province', province: 'ปทุมธานี', regionGroup: 'กลาง' },
];

export const cropPriceMarkets: CropPriceMarket[] = [
  { id: 'oae-reference', label: 'ราคาอ้างอิงทางการตัวอย่าง', marketType: 'official_reference', regionId: 'th-country' },
  { id: 'dit-reference', label: 'ราคากลางตัวอย่าง', marketType: 'official_reference', regionId: 'th-country' },
  { id: 'talad-thai-demo', label: 'ตลาดไทตัวอย่าง', marketType: 'wholesale_market', regionId: 'pathum-thani' },
  { id: 'yasothon-demo-market', label: 'ตลาดกลางตัวอย่างยโสธร', marketType: 'farm_gate', regionId: 'yasothon' },
  { id: 'korat-cassava-yard', label: 'ลานมันตัวอย่าง', marketType: 'local_buying_point', regionId: 'nakhon-ratchasima' },
  { id: 'chan-fruit-demo', label: 'ตลาดผลไม้ตัวอย่าง', marketType: 'wholesale_market', regionId: 'chanthaburi' },
  { id: 'ratchaburi-veg-demo', label: 'ตลาดค้าส่งตัวอย่าง', marketType: 'wholesale_market', regionId: 'ratchaburi' },
  { id: 'phetchabun-feed-corn-demo', label: 'จุดรับซื้ออย่างย่อ', marketType: 'local_buying_point', regionId: 'phetchabun' },
  { id: 'community-demo-report', label: 'รายงานชุมชนตัวอย่าง', marketType: 'community_report', regionId: 'chanthaburi' },
];

export const cropPriceQualityGrades: CropPriceQualityGrade[] = [
  { id: 'rice-jasmine-standard', label: 'ข้าวเปลือกหอมมะลิมาตรฐาน', description: 'ตัวอย่างเกรดอ้างอิง ยังไม่ใช่ข้อกำหนดซื้อขายจริง' },
  { id: 'cassava-fresh-25', label: 'หัวมันสด 25% แป้ง', description: 'ตัวอย่างเกรดอ้างอิงสำหรับทดสอบหน้าจอ' },
  { id: 'durian-export-a', label: 'เกรดคัด A', description: 'ตัวอย่างเกรดตลาด ไม่ใช่ราคาประกัน' },
  { id: 'chili-mixed', label: 'คละเกรด', description: 'ตัวอย่างราคาคละเกรดสำหรับ UI' },
  { id: 'corn-moisture-14', label: 'ความชื้นไม่เกิน 14.5%', description: 'ตัวอย่างเกรดรับซื้อ' },
];

const numberFormatter = new Intl.NumberFormat('th-TH', {
  maximumFractionDigits: 2,
});

function findById<T extends { id: string }>(items: T[], id: string) {
  const item = items.find((candidate) => candidate.id === id);

  if (!item) {
    throw new Error(`Missing crop price fixture id: ${id}`);
  }

  return item;
}

function createTrendPoint(
  label: string,
  referencePrice: number,
  unit: CropPriceUnit,
  direction: CropPriceChangeDirection,
) {
  return {
    label,
    referencePrice,
    priceLabel: `${numberFormatter.format(referencePrice)} ${unit.label}`,
    direction,
  };
}

function createCropPriceItem(input: {
  id: string;
  cropKey: string;
  cropName: string;
  category: CropPriceItem['category'];
  sourceId: CropPriceSourceId;
  marketId: string;
  unitId: string;
  gradeId?: string;
  referencePrice: number;
  previousReferencePrice?: number;
  capturedAt: string;
  capturedAtLabel: string;
  reliabilityLevel?: CropPriceItem['reliabilityLevel'];
  summary: string;
  relatedArticleIds: string[];
  relatedVideoIds: string[];
  trendValues: Array<[string, number, CropPriceChangeDirection]>;
}): CropPriceItem {
  const source = findCropPriceSource(input.sourceId);
  const market = findById(cropPriceMarkets, input.marketId);
  const region = findById(cropPriceRegions, market.regionId);
  const unit = findById(cropPriceUnits, input.unitId);
  const qualityGrade = input.gradeId ? findById(cropPriceQualityGrades, input.gradeId) : undefined;
  const previousReferencePrice = input.previousReferencePrice ?? input.referencePrice;
  const changeAmount = input.referencePrice - previousReferencePrice;
  const changePercent = previousReferencePrice === 0 ? 0 : (changeAmount / previousReferencePrice) * 100;

  if (!source) {
    throw new Error(`Missing crop price source fixture: ${input.sourceId}`);
  }

  return {
    id: input.id,
    cropKey: input.cropKey,
    cropName: input.cropName,
    category: input.category,
    sourceId: input.sourceId,
    sourceLabel: source.label,
    sourceStatus: source.status,
    reliabilityLevel: input.reliabilityLevel ?? source.reliabilityLevel,
    market,
    region,
    unit,
    qualityGrade,
    referencePrice: input.referencePrice,
    priceLabel: `${numberFormatter.format(input.referencePrice)} ${unit.label}`,
    currency: 'THB',
    capturedAt: input.capturedAt,
    capturedAtLabel: input.capturedAtLabel,
    previousReferencePrice,
    changeAmount,
    changePercent,
    changeDirection: changeAmount > 0 ? 'up' : changeAmount < 0 ? 'down' : 'same',
    isDemoSample: true,
    demoLabel: 'ข้อมูลตัวอย่างในเครื่อง ไม่ใช่ราคาตลาดจริง',
    summary: input.summary,
    disclaimer: cropPriceDisclaimer,
    relatedArticleIds: input.relatedArticleIds,
    relatedVideoIds: input.relatedVideoIds,
    recentTrend: input.trendValues.map(([label, referencePrice, direction]) =>
      createTrendPoint(label, referencePrice, unit, direction),
    ),
  };
}

export const cropPriceItems: CropPriceItem[] = [
  createCropPriceItem({
    id: 'price-rice-jasmine-105-yasothon-demo',
    cropKey: 'rice-jasmine-105',
    cropName: 'ข้าวหอมมะลิ 105',
    category: 'ข้าว',
    sourceId: 'oae',
    marketId: 'yasothon-demo-market',
    unitId: 'thb-per-ton',
    gradeId: 'rice-jasmine-standard',
    referencePrice: 15150,
    previousReferencePrice: 14880,
    capturedAt: '2026-05-23T09:00:00+07:00',
    capturedAtLabel: 'ข้อมูลตัวอย่าง 23 พ.ค. 2569 09:00',
    summary: 'ราคาอ้างอิงตัวอย่างสำหรับข้าวหอมมะลิในพื้นที่ยโสธร',
    relatedArticleIds: ['article-001', 'article-002'],
    relatedVideoIds: ['sample-video-id'],
    trendValues: [
      ['20 พ.ค.', 14820, 'same'],
      ['21 พ.ค.', 14880, 'up'],
      ['22 พ.ค.', 15040, 'up'],
      ['23 พ.ค.', 15150, 'up'],
    ],
  }),
  createCropPriceItem({
    id: 'price-cassava-fresh-korat-demo',
    cropKey: 'cassava-fresh',
    cropName: 'มันสำปะหลังสด',
    category: 'พืชไร่',
    sourceId: 'local-market-manual',
    marketId: 'korat-cassava-yard',
    unitId: 'thb-per-kg',
    gradeId: 'cassava-fresh-25',
    referencePrice: 3.15,
    previousReferencePrice: 3.17,
    capturedAt: '2026-05-23T09:00:00+07:00',
    capturedAtLabel: 'ข้อมูลตัวอย่าง 23 พ.ค. 2569 09:00',
    summary: 'ราคาอ้างอิงตัวอย่างจากรายงานตลาดท้องถิ่นจำลอง',
    relatedArticleIds: ['article-002'],
    relatedVideoIds: ['cassava-market-plan'],
    trendValues: [
      ['20 พ.ค.', 3.2, 'down'],
      ['21 พ.ค.', 3.18, 'down'],
      ['22 พ.ค.', 3.17, 'same'],
      ['23 พ.ค.', 3.15, 'down'],
    ],
  }),
  createCropPriceItem({
    id: 'price-durian-monthong-chan-demo',
    cropKey: 'durian-monthong',
    cropName: 'ทุเรียนหมอนทอง',
    category: 'ผลไม้',
    sourceId: 'talad-thai',
    marketId: 'chan-fruit-demo',
    unitId: 'thb-per-kg',
    gradeId: 'durian-export-a',
    referencePrice: 128,
    previousReferencePrice: 125,
    capturedAt: '2026-05-23T09:00:00+07:00',
    capturedAtLabel: 'ข้อมูลตัวอย่าง 23 พ.ค. 2569 09:00',
    summary: 'ราคาอ้างอิงตัวอย่างสำหรับผลไม้ภาคตะวันออก',
    relatedArticleIds: ['article-002'],
    relatedVideoIds: ['durian-flower-care'],
    trendValues: [
      ['20 พ.ค.', 122, 'same'],
      ['21 พ.ค.', 124, 'up'],
      ['22 พ.ค.', 125, 'up'],
      ['23 พ.ค.', 128, 'up'],
    ],
  }),
  createCropPriceItem({
    id: 'price-red-chili-ratchaburi-demo',
    cropKey: 'red-chili-jinda',
    cropName: 'พริกแดงจินดา',
    category: 'ผัก',
    sourceId: 'dit',
    marketId: 'ratchaburi-veg-demo',
    unitId: 'thb-per-kg',
    gradeId: 'chili-mixed',
    referencePrice: 64,
    previousReferencePrice: 64,
    capturedAt: '2026-05-23T09:00:00+07:00',
    capturedAtLabel: 'ข้อมูลตัวอย่าง 23 พ.ค. 2569 09:00',
    summary: 'ราคาอ้างอิงตัวอย่างสำหรับผักตลาดค้าส่ง',
    relatedArticleIds: ['article-001'],
    relatedVideoIds: ['organic-compost-short'],
    trendValues: [
      ['20 พ.ค.', 63, 'up'],
      ['21 พ.ค.', 64, 'up'],
      ['22 พ.ค.', 64, 'same'],
      ['23 พ.ค.', 64, 'same'],
    ],
  }),
  createCropPriceItem({
    id: 'price-feed-corn-phetchabun-demo',
    cropKey: 'feed-corn',
    cropName: 'ข้าวโพดเลี้ยงสัตว์',
    category: 'พืชไร่',
    sourceId: 'local-market-manual',
    marketId: 'phetchabun-feed-corn-demo',
    unitId: 'thb-per-kg',
    gradeId: 'corn-moisture-14',
    referencePrice: 8.75,
    previousReferencePrice: 8.7,
    capturedAt: '2026-05-23T09:00:00+07:00',
    capturedAtLabel: 'ข้อมูลตัวอย่าง 23 พ.ค. 2569 09:00',
    summary: 'ราคาอ้างอิงตัวอย่างสำหรับจุดรับซื้อท้องถิ่น',
    relatedArticleIds: ['article-002'],
    relatedVideoIds: ['cassava-market-plan'],
    trendValues: [
      ['20 พ.ค.', 8.6, 'same'],
      ['21 พ.ค.', 8.65, 'up'],
      ['22 พ.ค.', 8.7, 'up'],
      ['23 พ.ค.', 8.75, 'up'],
    ],
  }),
  createCropPriceItem({
    id: 'price-mango-namdokmai-community-demo',
    cropKey: 'mango-namdokmai',
    cropName: 'มะม่วงน้ำดอกไม้',
    category: 'ผลไม้',
    sourceId: 'community-price-report',
    marketId: 'community-demo-report',
    unitId: 'thb-per-kg',
    referencePrice: 42,
    previousReferencePrice: 44,
    capturedAt: '2026-05-23T08:30:00+07:00',
    capturedAtLabel: 'ข้อมูลตัวอย่าง 23 พ.ค. 2569 08:30',
    summary: 'รายงานชุมชนตัวอย่างที่ยังไม่ผ่านการยืนยัน ใช้ทดสอบระบบอนาคตเท่านั้น',
    relatedArticleIds: ['article-004', 'article-002'],
    relatedVideoIds: ['durian-flower-care'],
    trendValues: [
      ['20 พ.ค.', 45, 'same'],
      ['21 พ.ค.', 44, 'down'],
      ['22 พ.ค.', 44, 'same'],
      ['23 พ.ค.', 42, 'down'],
    ],
  }),
  createCropPriceItem({
    id: 'price-rice-gor-khor-43-demo',
    cropKey: 'rice-gor-khor-43',
    cropName: 'ข้าว กข43',
    category: 'ข้าว',
    sourceId: 'local-market-manual',
    marketId: 'oae-reference',
    unitId: 'thb-per-ton',
    referencePrice: 12200,
    previousReferencePrice: 12200,
    capturedAt: '2026-05-23T09:00:00+07:00',
    capturedAtLabel: 'ข้อมูลตัวอย่าง 23 พ.ค. 2569 09:00',
    reliabilityLevel: 'demo_sample',
    summary: 'ราคาอ้างอิงตัวอย่างเต็มรูปแบบสำหรับทดสอบสถานะ demo_sample',
    relatedArticleIds: ['article-001'],
    relatedVideoIds: ['sample-video-id'],
    trendValues: [
      ['20 พ.ค.', 12180, 'up'],
      ['21 พ.ค.', 12200, 'up'],
      ['22 พ.ค.', 12200, 'same'],
      ['23 พ.ค.', 12200, 'same'],
    ],
  }),
];

export const cropPriceSnapshots: CropPriceSnapshot[] = [
  {
    id: 'crop-price-snapshot-2026-05-23-demo',
    sourceId: 'local-market-manual',
    snapshotLabel: 'ชุดข้อมูลราคาอ้างอิงตัวอย่าง 23 พ.ค. 2569',
    capturedAt: '2026-05-23T09:00:00+07:00',
    sourceStatus: 'fixture_only',
    reliabilityLevel: 'demo_sample',
    items: cropPriceItems,
    notes: 'Fixture local-only สำหรับ M21 ไม่มี API, scraping, network call, backend write หรือ Supabase write',
  },
];
