import type {
  FarmAreaAccuracyLevel,
  FarmAreaMeasurementMethod,
  FarmAreaShape,
  FarmAreaUnit,
  FarmPlotRecord,
} from '@/services/farm-area/farm-area.types';

export const farmAreaStorageKey = 'kasethub.farmArea.v1';

export const farmAreaDisclaimer = 'เป็นการคำนวณประมาณการ ไม่ใช่การรังวัดที่ดินอย่างเป็นทางการ';

export const farmAreaUnitLabels: Record<FarmAreaUnit, { label: string; shortLabel: string }> = {
  square_meter: { label: 'ตารางเมตร', shortLabel: 'ตร.ม.' },
  square_wa: { label: 'ตารางวา', shortLabel: 'ตร.ว.' },
  ngan: { label: 'งาน', shortLabel: 'งาน' },
  rai: { label: 'ไร่', shortLabel: 'ไร่' },
  hectare: { label: 'เฮกตาร์', shortLabel: 'ha' },
  acre: { label: 'เอเคอร์', shortLabel: 'acre' },
};

export const farmAreaShapeLabels: Record<FarmAreaShape, { label: string; hint: string }> = {
  rectangle: { label: 'สี่เหลี่ยมผืนผ้า', hint: 'กว้าง x ยาว' },
  square: { label: 'สี่เหลี่ยมจัตุรัส', hint: 'ด้าน x ด้าน' },
  triangle: { label: 'สามเหลี่ยม', hint: 'ฐาน x สูง / 2' },
  custom_polygon_mock: { label: 'รูปหลายเหลี่ยมตัวอย่าง', hint: 'ใส่พื้นที่ประมาณเอง ยังไม่มีแผนที่' },
};

export const farmAreaMethodLabels: Record<FarmAreaMeasurementMethod, string> = {
  manual_tape: 'วัดเองด้วยสายวัด',
  manual_estimate: 'ประมาณด้วยตัวเลขที่ทราบ',
  gps_walk_future: 'เดินขอบแปลงด้วย GPS ในอนาคต',
  map_polygon_future: 'วาดแปลงบนแผนที่ในอนาคต',
  satellite_provider_future: 'ภาพถ่าย/แผนที่ผู้ให้บริการในอนาคต',
};

export const farmAreaAccuracyLabels: Record<FarmAreaAccuracyLevel, string> = {
  rough_estimate: 'ประมาณคร่าว ๆ',
  field_estimate: 'ประมาณจากการวัดในแปลง',
  gps_mock_planned: 'แผน GPS ในอนาคต',
  official_survey_required: 'ต้องรังวัดทางการ',
};

export const thaiLandUnitRules = [
  '1 ตารางวา = 4 ตารางเมตร',
  '1 งาน = 100 ตารางวา = 400 ตารางเมตร',
  '1 ไร่ = 4 งาน = 1,600 ตารางเมตร',
];

export const farmAreaFixturePlots: FarmPlotRecord[] = [
  {
    id: 'farm-area-demo-rice-plot',
    name: 'แปลงข้าวตัวอย่าง',
    shape: 'rectangle',
    method: 'manual_estimate',
    accuracyLevel: 'rough_estimate',
    plannerStatus: 'local_demo',
    areaSquareMeters: 3200,
    areaLabels: {
      square_meter: '3,200 ตร.ม.',
      square_wa: '800 ตร.ว.',
      ngan: '8 งาน',
      rai: '2 ไร่',
      hectare: '0.32 ha',
      acre: '0.79 acre',
    },
    dimensionsLabel: 'กว้าง 40 ม. x ยาว 80 ม.',
    createdAt: '2026-05-23T00:00:00+07:00',
    createdAtLabel: 'ตัวอย่างในเครื่อง',
    disclaimer: farmAreaDisclaimer,
  },
];
