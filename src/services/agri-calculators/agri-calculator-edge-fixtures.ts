import type {
  AgriCalculatorInputByCategory,
  CalculatorCategory,
} from '@/services/agri-calculators/agri-calculator.types';
import { calculateAgriCalculator } from '@/services/agri-calculators/agri-calculator-service';
import { isCropCalculatorKey } from '@/services/agri-calculators/crop-calculator-profiles';

export type AgriCalculatorEdgeStatus = 'pass' | 'warn' | 'fail';

export type AgriCalculatorEdgeFixture<C extends CalculatorCategory = CalculatorCategory> = {
  id: string;
  category: C;
  title: string;
  input: AgriCalculatorInputByCategory[C];
  expectedStatus: AgriCalculatorEdgeStatus;
  expectedWarningIncludes: string;
  note: string;
};

export type CropProfileEdgeFixture = {
  id: string;
  title: string;
  cropKeyCandidate: string;
  expectedIsValidCropKey: boolean;
  expectedStatus: AgriCalculatorEdgeStatus;
  note: string;
};

export type AgriCalculatorEdgeRun = {
  id: string;
  title: string;
  categoryLabel: string;
  expectedStatus: AgriCalculatorEdgeStatus;
  actualStatus: AgriCalculatorEdgeStatus;
  isMatch: boolean;
  warnings: string[];
  note: string;
};

export const agriCalculatorEdgeFixtures: AgriCalculatorEdgeFixture[] = [
  {
    id: 'edge-spray-extreme-concentration',
    category: 'spray_mix',
    title: 'ความเข้มข้นผสมยาสูงผิดปกติ',
    expectedStatus: 'warn',
    expectedWarningIncludes: 'อัตราผสมต่อ 1 ลิตรสูง',
    note: 'ต้องเตือนให้กลับไปอ่านฉลากจริงก่อนใช้',
    input: {
      tankLiters: 20,
      tankSizeOption: 20,
      dosageAmount: 500,
      dosageUnit: 'cc',
      dosageWaterLiters: 20,
    },
  },
  {
    id: 'edge-area-extremely-small',
    category: 'plant_spacing',
    title: 'พื้นที่เล็กมาก',
    expectedStatus: 'warn',
    expectedWarningIncludes: 'พื้นที่เล็กมาก',
    note: 'ควรเตือนผู้ใช้ให้ตรวจหน่วยพื้นที่',
    input: {
      landSizeValue: 1,
      landSizeUnit: 'square_meter',
      rowSpacingCm: 100,
      plantSpacingCm: 100,
      seedlingBufferPercent: 0,
      usableAreaPercent: 100,
    },
  },
  {
    id: 'edge-area-huge',
    category: 'plant_spacing',
    title: 'พื้นที่ใหญ่มาก',
    expectedStatus: 'warn',
    expectedWarningIncludes: 'พื้นที่ใหญ่มาก',
    note: 'พื้นที่ระดับใหญ่ผิดปกติต้องเตือนก่อนใช้ผลลัพธ์',
    input: {
      landSizeValue: 20000,
      landSizeUnit: 'rai',
      rowSpacingCm: 100,
      plantSpacingCm: 100,
      seedlingBufferPercent: 0,
      usableAreaPercent: 100,
    },
  },
  {
    id: 'edge-spacing-impossible-zero',
    category: 'plant_spacing',
    title: 'ระยะปลูกเป็นศูนย์',
    expectedStatus: 'fail',
    expectedWarningIncludes: 'มากกว่า 0',
    note: 'ต้องกัน divide-by-zero',
    input: {
      landSizeValue: 1,
      landSizeUnit: 'rai',
      rowSpacingCm: 0,
      plantSpacingCm: 100,
      seedlingBufferPercent: 0,
      usableAreaPercent: 100,
    },
  },
  {
    id: 'edge-yield-unrealistic-high',
    category: 'yield_estimate',
    title: 'ผลผลิตสูงผิดปกติ',
    expectedStatus: 'warn',
    expectedWarningIncludes: 'ผลผลิตรวมสูงมาก',
    note: 'ผลผลิตรวมสูงมากควรมี warning แต่ยังคงเป็นเลขคำนวณ',
    input: {
      landSizeValue: 1,
      landSizeUnit: 'rai',
      sampleCount: 10,
      averageWeightKg: 1000,
      estimatedTotalUnits: 2000,
    },
  },
  {
    id: 'edge-cost-negative',
    category: 'cost_estimate',
    title: 'ต้นทุนติดลบ',
    expectedStatus: 'fail',
    expectedWarningIncludes: 'ติดลบไม่ได้',
    note: 'ค่าใช้จ่ายติดลบต้องเป็น invalid result',
    input: {
      landSizeValue: 1,
      landSizeUnit: 'rai',
      fertilizerCost: -100,
      laborCost: 0,
      waterCost: 0,
      machineryCost: 0,
      otherCost: 0,
      expectedYieldKg: 0,
    },
  },
  {
    id: 'edge-fertilizer-invalid-unit',
    category: 'fertilizer_mix',
    title: 'หน่วยพื้นที่เสียหายจาก local state',
    expectedStatus: 'fail',
    expectedWarningIncludes: 'เลือกหน่วยพื้นที่',
    note: 'ต้องไม่เชื่อ localStorage ที่มี unit เสียหาย',
    input: {
      areaValue: 1,
      areaUnit: 'invalid_unit' as AgriCalculatorInputByCategory['fertilizer_mix']['areaUnit'],
      targetNitrogenKgPerRai: 4,
      targetPhosphorusKgPerRai: 0,
      targetPotassiumKgPerRai: 0,
      fertilizerNPercent: 46,
      fertilizerPPercent: 0,
      fertilizerKPercent: 0,
      baseNutrient: 'nitrogen',
    },
  },
  {
    id: 'edge-cost-overflow-ish',
    category: 'cost_estimate',
    title: 'ต้นทุนสูงมากแต่ยัง finite',
    expectedStatus: 'warn',
    expectedWarningIncludes: 'ต้นทุนรวมสูงมาก',
    note: 'เลขขนาดใหญ่มากควรเตือนและต้องไม่กลายเป็น Infinity',
    input: {
      landSizeValue: 1,
      landSizeUnit: 'rai',
      fertilizerCost: Number.MAX_SAFE_INTEGER / 4,
      laborCost: Number.MAX_SAFE_INTEGER / 4,
      waterCost: Number.MAX_SAFE_INTEGER / 4,
      machineryCost: 0,
      otherCost: 0,
      expectedYieldKg: 1,
    },
  },
];

export const cropProfileEdgeFixtures: CropProfileEdgeFixture[] = [
  {
    id: 'edge-invalid-crop-key',
    title: 'crop key ไม่อยู่ในรายการ',
    cropKeyCandidate: 'banana_experimental',
    expectedIsValidCropKey: false,
    expectedStatus: 'pass',
    note: 'invalid crop key ต้องถูกปฏิเสธและไม่ควรสร้างคำแนะนำเอง',
  },
];

function classifyResult(isValid: boolean, warnings: string[]): AgriCalculatorEdgeStatus {
  if (!isValid) return 'fail';
  if (warnings.length > 0) return 'warn';
  return 'pass';
}

export function runAgriCalculatorEdgeFixture(fixture: AgriCalculatorEdgeFixture): AgriCalculatorEdgeRun {
  const result = calculateAgriCalculator(fixture.category, fixture.input);
  const actualStatus = classifyResult(result.isValid, result.warnings);
  const hasExpectedWarning = fixture.expectedWarningIncludes
    ? result.warnings.some((warning) => warning.includes(fixture.expectedWarningIncludes))
    : true;

  return {
    id: fixture.id,
    title: fixture.title,
    categoryLabel: fixture.category,
    expectedStatus: fixture.expectedStatus,
    actualStatus,
    isMatch: actualStatus === fixture.expectedStatus && hasExpectedWarning,
    warnings: result.warnings,
    note: fixture.note,
  };
}

export function runCropProfileEdgeFixture(fixture: CropProfileEdgeFixture): AgriCalculatorEdgeRun {
  const isValid = isCropCalculatorKey(fixture.cropKeyCandidate);
  const actualStatus: AgriCalculatorEdgeStatus = isValid === fixture.expectedIsValidCropKey ? 'pass' : 'fail';

  return {
    id: fixture.id,
    title: fixture.title,
    categoryLabel: 'crop_profile_examples',
    expectedStatus: fixture.expectedStatus,
    actualStatus,
    isMatch: actualStatus === fixture.expectedStatus,
    warnings: isValid ? [] : ['ไม่พบ crop key นี้ในรายการตัวอย่างพืช'],
    note: fixture.note,
  };
}

export function runAgriCalculatorEdgeSuite() {
  const runs = [
    ...agriCalculatorEdgeFixtures.map((fixture) => runAgriCalculatorEdgeFixture(fixture)),
    ...cropProfileEdgeFixtures.map((fixture) => runCropProfileEdgeFixture(fixture)),
  ];

  return {
    runs,
    totalCount: runs.length,
    passCount: runs.filter((run) => run.isMatch).length,
    warnCount: runs.filter((run) => run.actualStatus === 'warn').length,
    failCount: runs.filter((run) => !run.isMatch).length,
  };
}
