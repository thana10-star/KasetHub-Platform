import type {
  AgriCalculatorInputByCategory,
  AgriCalculatorResultByCategory,
  CalculatorCategory,
} from '@/services/agri-calculators/agri-calculator.types';
import { calculateAgriCalculator, formatAgriCurrency, formatAgriNumber } from '@/services/agri-calculators/agri-calculator-service';

export type AgriCalculatorTestStatus = 'pass' | 'warn' | 'fail';

export type AgriCalculatorTestMetric =
  | 'spray.requiredAmount'
  | 'plant.estimatedPlantCount'
  | 'plant.estimatedSeedlingCount'
  | 'fertilizer.estimatedFertilizerKg'
  | 'yield.estimatedTotalKg'
  | 'yield.yieldPerRaiKg'
  | 'cost.totalCost'
  | 'cost.costPerRai';

export type AgriCalculatorTestCase<C extends CalculatorCategory = CalculatorCategory> = {
  id: string;
  category: C;
  title: string;
  detail: string;
  input: AgriCalculatorInputByCategory[C];
  metric: AgriCalculatorTestMetric;
  expectedValue: number;
  tolerance: number;
  expectedLabel: string;
  allowWarnings?: boolean;
};

export type AgriCalculatorTestRun = {
  id: string;
  category: CalculatorCategory;
  title: string;
  detail: string;
  expectedLabel: string;
  actualLabel: string;
  differenceLabel: string;
  status: AgriCalculatorTestStatus;
  warnings: string[];
};

export const agriCalculatorTestCases: AgriCalculatorTestCase[] = [
  {
    id: 'spray-20l-20cc-per-20l',
    category: 'spray_mix',
    title: 'ผสมยา 20 ลิตร จาก 20 ซีซี / 20 ลิตร',
    detail: 'ควรได้สาร 20 ซีซี',
    input: {
      tankLiters: 20,
      tankSizeOption: 20,
      dosageAmount: 20,
      dosageUnit: 'cc',
      dosageWaterLiters: 20,
    },
    metric: 'spray.requiredAmount',
    expectedValue: 20,
    tolerance: 0.001,
    expectedLabel: '20 ซีซี',
  },
  {
    id: 'spray-10l-20cc-per-20l',
    category: 'spray_mix',
    title: 'ผสมยา 10 ลิตร จาก 20 ซีซี / 20 ลิตร',
    detail: 'ควรได้สาร 10 ซีซี',
    input: {
      tankLiters: 10,
      tankSizeOption: 10,
      dosageAmount: 20,
      dosageUnit: 'cc',
      dosageWaterLiters: 20,
    },
    metric: 'spray.requiredAmount',
    expectedValue: 10,
    tolerance: 0.001,
    expectedLabel: '10 ซีซี',
  },
  {
    id: 'spray-200l-20cc-per-20l',
    category: 'spray_mix',
    title: 'ผสมยา 200 ลิตร จาก 20 ซีซี / 20 ลิตร',
    detail: 'ควรได้สาร 200 ซีซี',
    input: {
      tankLiters: 200,
      tankSizeOption: 200,
      dosageAmount: 20,
      dosageUnit: 'cc',
      dosageWaterLiters: 20,
    },
    metric: 'spray.requiredAmount',
    expectedValue: 200,
    tolerance: 0.001,
    expectedLabel: '200 ซีซี',
  },
  {
    id: 'spacing-1rai-1m-by-1m',
    category: 'plant_spacing',
    title: 'ระยะปลูก 1 ไร่ ที่ 1 ม. x 1 ม.',
    detail: 'พื้นที่ 1,600 ตร.ม. ควรได้ประมาณ 1,600 ต้น',
    input: {
      landSizeValue: 1,
      landSizeUnit: 'rai',
      rowSpacingCm: 100,
      plantSpacingCm: 100,
      seedlingBufferPercent: 0,
      usableAreaPercent: 100,
    },
    metric: 'plant.estimatedPlantCount',
    expectedValue: 1600,
    tolerance: 0,
    expectedLabel: '1,600 ต้น',
  },
  {
    id: 'spacing-5rai-1m-by-08m',
    category: 'plant_spacing',
    title: 'ระยะปลูก 5 ไร่ ที่ 1 ม. x 0.8 ม.',
    detail: 'พื้นที่ 8,000 ตร.ม. หาร 0.8 ตร.ม. ควรได้ 10,000 ต้น',
    input: {
      landSizeValue: 5,
      landSizeUnit: 'rai',
      rowSpacingCm: 100,
      plantSpacingCm: 80,
      seedlingBufferPercent: 0,
      usableAreaPercent: 100,
    },
    metric: 'plant.estimatedPlantCount',
    expectedValue: 10000,
    tolerance: 0,
    expectedLabel: '10,000 ต้น',
  },
  {
    id: 'fertilizer-n-target-46-0-0',
    category: 'fertilizer_mix',
    title: 'ปุ๋ย N เป้าหมาย 4 กก./ไร่ ด้วย 46-0-0',
    detail: '4 / 0.46 ควรได้ประมาณ 8.70 กก.',
    input: {
      areaValue: 1,
      areaUnit: 'rai',
      targetNitrogenKgPerRai: 4,
      targetPhosphorusKgPerRai: 0,
      targetPotassiumKgPerRai: 0,
      fertilizerNPercent: 46,
      fertilizerPPercent: 0,
      fertilizerKPercent: 0,
      baseNutrient: 'nitrogen',
    },
    metric: 'fertilizer.estimatedFertilizerKg',
    expectedValue: 8.6956521739,
    tolerance: 0.01,
    expectedLabel: '8.70 กก.',
  },
  {
    id: 'yield-1rai-1000-units-05kg',
    category: 'yield_estimate',
    title: 'ผลผลิต 1 ไร่ 1,000 หน่วย เฉลี่ย 0.5 กก.',
    detail: 'ควรได้ผลผลิตรวม 500 กก. และ 500 กก./ไร่',
    input: {
      landSizeValue: 1,
      landSizeUnit: 'rai',
      sampleCount: 10,
      averageWeightKg: 0.5,
      estimatedTotalUnits: 1000,
    },
    metric: 'yield.estimatedTotalKg',
    expectedValue: 500,
    tolerance: 0.001,
    expectedLabel: '500 กก.',
  },
  {
    id: 'cost-2rai-4000-total',
    category: 'cost_estimate',
    title: 'ต้นทุน 2 ไร่ รวม 4,000 บาท',
    detail: 'ควรได้ต้นทุนต่อไร่ 2,000 บาท',
    input: {
      landSizeValue: 2,
      landSizeUnit: 'rai',
      fertilizerCost: 2000,
      laborCost: 1000,
      waterCost: 500,
      machineryCost: 500,
      otherCost: 0,
      expectedYieldKg: 1000,
    },
    metric: 'cost.costPerRai',
    expectedValue: 2000,
    tolerance: 0.001,
    expectedLabel: '฿2,000 / ไร่',
  },
];

function getMetricValue(metric: AgriCalculatorTestMetric, result: AgriCalculatorResultByCategory[CalculatorCategory]) {
  if (metric === 'spray.requiredAmount') return (result as AgriCalculatorResultByCategory['spray_mix']).requiredAmount;
  if (metric === 'plant.estimatedPlantCount') return (result as AgriCalculatorResultByCategory['plant_spacing']).estimatedPlantCount;
  if (metric === 'plant.estimatedSeedlingCount') return (result as AgriCalculatorResultByCategory['plant_spacing']).estimatedSeedlingCount;
  if (metric === 'fertilizer.estimatedFertilizerKg') return (result as AgriCalculatorResultByCategory['fertilizer_mix']).estimatedFertilizerKg;
  if (metric === 'yield.estimatedTotalKg') return (result as AgriCalculatorResultByCategory['yield_estimate']).estimatedTotalKg;
  if (metric === 'yield.yieldPerRaiKg') return (result as AgriCalculatorResultByCategory['yield_estimate']).yieldPerRaiKg;
  if (metric === 'cost.totalCost') return (result as AgriCalculatorResultByCategory['cost_estimate']).totalCost;
  return (result as AgriCalculatorResultByCategory['cost_estimate']).costPerRai;
}

function formatMetricValue(metric: AgriCalculatorTestMetric, value: number) {
  if (metric.startsWith('spray.')) return `${formatAgriNumber(value, 2)} ซีซี`;
  if (metric.startsWith('plant.')) return `${formatAgriNumber(value, 0)} ต้น`;
  if (metric.startsWith('fertilizer.')) return `${formatAgriNumber(value, 2)} กก.`;
  if (metric.startsWith('yield.')) return `${formatAgriNumber(value, 2)} กก.`;
  if (metric === 'cost.costPerRai') return `${formatAgriCurrency(value)} / ไร่`;
  return formatAgriCurrency(value);
}

export function runAgriCalculatorTestCase(testCase: AgriCalculatorTestCase): AgriCalculatorTestRun {
  const result = calculateAgriCalculator(testCase.category, testCase.input);
  const actualValue = getMetricValue(testCase.metric, result);
  const difference = Math.abs(actualValue - testCase.expectedValue);
  const matchesExpected = difference <= testCase.tolerance;
  const status: AgriCalculatorTestStatus = !result.isValid || !matchesExpected ? 'fail' : result.warnings.length > 0 && !testCase.allowWarnings ? 'warn' : 'pass';

  return {
    id: testCase.id,
    category: testCase.category,
    title: testCase.title,
    detail: testCase.detail,
    expectedLabel: testCase.expectedLabel,
    actualLabel: formatMetricValue(testCase.metric, actualValue),
    differenceLabel: formatMetricValue(testCase.metric, difference),
    status,
    warnings: result.warnings,
  };
}

export function runAgriCalculatorTestSuite() {
  const runs = agriCalculatorTestCases.map((testCase) => runAgriCalculatorTestCase(testCase));

  return {
    runs,
    totalCount: runs.length,
    passCount: runs.filter((run) => run.status === 'pass').length,
    warnCount: runs.filter((run) => run.status === 'warn').length,
    failCount: runs.filter((run) => run.status === 'fail').length,
  };
}
