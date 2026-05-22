import type {
  CropPriceReliabilityLevel,
  CropPriceSource,
  CropPriceSourceId,
  CropPriceSourceStatus,
} from '@/services/crop-prices/crop-price.types';

export const cropPriceDisclaimer = 'ราคาจริงขึ้นกับพื้นที่ เกรดสินค้า ความชื้น ฤดูกาล และผู้รับซื้อ';

export const cropPriceReliabilityLabels: Record<CropPriceReliabilityLevel, string> = {
  official: 'แหล่งทางการ',
  market_reference: 'อ้างอิงตลาด',
  community_unverified: 'ชุมชนยังไม่ยืนยัน',
  demo_sample: 'ตัวอย่างเดโม',
};

export const cropPriceReliabilityDescriptions: Record<CropPriceReliabilityLevel, string> = {
  official: 'ข้อมูลจากหน่วยงานทางการในอนาคต ต้องระบุแหล่งและวันที่ทุกครั้ง',
  market_reference: 'ข้อมูลอ้างอิงจากตลาดหรือรายงานพื้นที่ ยังไม่ใช่ราคาขายยืนยัน',
  community_unverified: 'ข้อมูลจากผู้ใช้หรือชุมชน ต้องผ่านการตรวจทานก่อนใช้จริง',
  demo_sample: 'ข้อมูลตัวอย่างในเครื่อง ใช้ทดสอบหน้าจอเท่านั้น',
};

export const cropPriceSourceStatusLabels: Record<CropPriceSourceStatus, string> = {
  planned: 'แผนเชื่อมต่ออนาคต',
  fixture_only: 'ข้อมูลตัวอย่างในเครื่อง',
  manual_review_needed: 'ต้องตรวจทานก่อนเผยแพร่',
  disabled: 'ยังไม่เปิดใช้',
};

export const cropPriceSources: CropPriceSource[] = [
  {
    id: 'oae',
    label: 'OAE / สำนักงานเศรษฐกิจการเกษตร',
    shortLabel: 'OAE',
    thaiName: 'สำนักงานเศรษฐกิจการเกษตร',
    sourceType: 'official_agency',
    reliabilityLevel: 'official',
    status: 'planned',
    attributionLabel: 'อ้างอิงจาก OAE เมื่อมีการเชื่อมต่อจริง',
    plannedConnectionMethod: 'api',
    freshnessPolicy: 'ตรวจความสดตามรอบเผยแพร่ของแหล่งทางการ และแสดงวันที่ข้อมูลทุกครั้ง',
    notes: 'M21 ยังไม่เรียก API และไม่ใช้ข้อมูลจริงจาก OAE',
  },
  {
    id: 'dit',
    label: 'DIT / กรมการค้าภายใน',
    shortLabel: 'DIT',
    thaiName: 'กรมการค้าภายใน',
    sourceType: 'official_agency',
    reliabilityLevel: 'official',
    status: 'planned',
    attributionLabel: 'อ้างอิงจาก DIT เมื่อมีการเชื่อมต่อจริง',
    plannedConnectionMethod: 'api',
    freshnessPolicy: 'แสดงวันที่ประกาศและไม่อ้างเป็นราคาซื้อขายจริง',
    notes: 'M21 ยังไม่เรียก API และไม่ใช้ข้อมูลจริงจาก DIT',
  },
  {
    id: 'talad-thai',
    label: 'ตลาดไท',
    shortLabel: 'ตลาดไท',
    thaiName: 'ตลาดไท',
    sourceType: 'market_reference',
    reliabilityLevel: 'market_reference',
    status: 'planned',
    attributionLabel: 'อ้างอิงตลาดไทเมื่อได้รับสิทธิ์หรือวิธีนำเข้าที่ถูกต้อง',
    plannedConnectionMethod: 'manual_import',
    freshnessPolicy: 'ต้องระบุรอบตลาด เวลา และหมวดสินค้าให้ชัดเจน',
    notes: 'M21 ไม่ scrape และไม่ดึงข้อมูลจากเว็บไซต์ตลาด',
  },
  {
    id: 'local-market-manual',
    label: 'รายงานตลาดท้องถิ่นโดยผู้ดูแล',
    shortLabel: 'ตลาดท้องถิ่น',
    thaiName: 'รายงานตลาดท้องถิ่น',
    sourceType: 'manual_report',
    reliabilityLevel: 'market_reference',
    status: 'fixture_only',
    attributionLabel: 'รายงานภายในโดยผู้ดูแล KasetHub',
    plannedConnectionMethod: 'admin_entry',
    freshnessPolicy: 'ต้องมีผู้ตรวจทาน ชื่อแหล่ง พื้นที่ และเวลาบันทึกก่อนเผยแพร่',
    notes: 'ใช้เป็นตัวอย่างโครงสร้าง manual import เท่านั้น',
  },
  {
    id: 'community-price-report',
    label: 'รายงานราคาจากชุมชน',
    shortLabel: 'ชุมชน',
    thaiName: 'รายงานราคาจากชุมชน',
    sourceType: 'community_report',
    reliabilityLevel: 'community_unverified',
    status: 'manual_review_needed',
    attributionLabel: 'รายงานโดยสมาชิกชุมชน ต้องรอตรวจทาน',
    plannedConnectionMethod: 'community_submission',
    freshnessPolicy: 'ต้องแสดงสถานะยังไม่ยืนยัน และซ่อนจากคำแนะนำเชิงตัดสินใจจนกว่าจะตรวจทาน',
    notes: 'M21 มีเฉพาะตัวอย่าง ไม่มีระบบส่งรายงานจริง',
  },
];

export function findCropPriceSource(sourceId: CropPriceSourceId) {
  return cropPriceSources.find((source) => source.id === sourceId);
}
