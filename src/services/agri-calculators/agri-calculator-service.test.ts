import { describe, expect, test } from 'vitest';
import {
  calculateAgriCalculator,
  calculateCostEstimate,
  calculateFertilizerMix,
  calculatePlantSpacing,
  calculateSprayMix,
  calculateYieldEstimate,
  convertThaiArea,
} from '@/services/agri-calculators/agri-calculator-service';
import {
  agriCalculatorEdgeFixtures,
  cropProfileEdgeFixtures,
  runAgriCalculatorEdgeFixture,
  runCropProfileEdgeFixture,
} from '@/services/agri-calculators/agri-calculator-edge-fixtures';
import { runAgriCalculatorTestSuite } from '@/services/agri-calculators/agri-calculator-test-fixtures';
import { agriCalculatorUnitTestPlan } from '@/services/agri-calculators/agri-calculator-unit-test-plan';
import {
  buildCalculatorResultSummary,
  getSavedCalculatorResultSummaries,
} from '@/services/agri-calculators/calculator-result-summary-service';
import {
  buildCalculatorExportTemplate,
  clampCalculatorExportText,
  copyCalculatorExportText,
  prepareCalculatorShareText,
  shareCalculatorExportText,
} from '@/services/agri-calculators/calculator-export-template-service';
import { cropCalculatorProfiles, getCropCalculatorProfile, isCropCalculatorKey } from '@/services/agri-calculators/crop-calculator-profiles';
import type { CalculatorCategory, MixAmountUnit, TankSizeOption, ThaiAreaUnit } from '@/services/agri-calculators/agri-calculator.types';

describe('agriculture calculator deterministic fixtures', () => {
  test('M50 deterministic QA fixtures still pass without drift', () => {
    const suite = runAgriCalculatorTestSuite();

    expect(suite.totalCount).toBe(8);
    expect(suite.failCount).toBe(0);
    expect(suite.warnCount).toBe(0);
    expect(suite.passCount).toBe(suite.totalCount);
  });

  test('M51 formal unit-test plan is implemented by service-level tests', () => {
    expect(agriCalculatorUnitTestPlan.length).toBeGreaterThanOrEqual(7);
    expect(agriCalculatorUnitTestPlan.every((item) => item.status === 'implemented')).toBe(true);
    expect(agriCalculatorUnitTestPlan.every((item) => item.testFile === 'agri-calculator-service.test.ts')).toBe(true);
  });
});

describe('spray mix calculator', () => {
  test('scales label ratio by tank liters', () => {
    expect(
      calculateSprayMix({
        tankLiters: 20,
        tankSizeOption: 20,
        dosageAmount: 20,
        dosageUnit: 'cc',
        dosageWaterLiters: 20,
      }).requiredAmount,
    ).toBeCloseTo(20);

    expect(
      calculateSprayMix({
        tankLiters: 10,
        tankSizeOption: 10,
        dosageAmount: 20,
        dosageUnit: 'cc',
        dosageWaterLiters: 20,
      }).requiredAmount,
    ).toBeCloseTo(10);

    expect(
      calculateSprayMix({
        tankLiters: 200,
        tankSizeOption: 200,
        dosageAmount: 20,
        dosageUnit: 'cc',
        dosageWaterLiters: 20,
      }).requiredAmount,
    ).toBeCloseTo(200);
  });

  test('rejects zero, negative, NaN, empty, and invalid unit inputs', () => {
    const zero = calculateSprayMix({
      tankLiters: 0,
      tankSizeOption: 20,
      dosageAmount: 20,
      dosageUnit: 'cc',
      dosageWaterLiters: 20,
    });
    expect(zero.isValid).toBe(false);
    expect(zero.requiredAmount).toBe(0);

    const negative = calculateSprayMix({
      tankLiters: 20,
      tankSizeOption: 20,
      dosageAmount: -1,
      dosageUnit: 'cc',
      dosageWaterLiters: 20,
    });
    expect(negative.isValid).toBe(false);

    const notNumber = calculateSprayMix({
      tankLiters: Number.NaN,
      tankSizeOption: 20,
      dosageAmount: 20,
      dosageUnit: 'cc',
      dosageWaterLiters: 20,
    });
    expect(notNumber.isValid).toBe(false);

    const emptyAndInvalidUnit = calculateSprayMix({
      tankLiters: '' as unknown as number,
      tankSizeOption: 'broken' as unknown as TankSizeOption,
      dosageAmount: 20,
      dosageUnit: 'bad_unit' as MixAmountUnit,
      dosageWaterLiters: 20,
    });
    expect(emptyAndInvalidUnit.isValid).toBe(false);
    expect(emptyAndInvalidUnit.warnings.join(' ')).toContain('เลือกหน่วยยา/สาร');
  });

  test('warns on extreme spray concentration and huge tanks', () => {
    const result = calculateSprayMix({
      tankLiters: 2500,
      tankSizeOption: 'custom',
      dosageAmount: 500,
      dosageUnit: 'cc',
      dosageWaterLiters: 20,
    });

    expect(result.isValid).toBe(true);
    expect(result.isConcentrationHigh).toBe(true);
    expect(result.warnings.join(' ')).toContain('อัตราผสมต่อ 1 ลิตรสูง');
    expect(result.warnings.join(' ')).toContain('ขนาดถังสูงผิดปกติ');
  });
});

describe('Thai land conversion', () => {
  test('converts stable Thai land units', () => {
    expect(convertThaiArea(1, 'rai', 'square_meter')).toBe(1600);
    expect(convertThaiArea(1, 'ngan', 'square_meter')).toBe(400);
    expect(convertThaiArea(1, 'square_wa', 'square_meter')).toBe(4);
    expect(convertThaiArea(1600, 'square_meter', 'rai')).toBe(1);
  });
});

describe('plant spacing calculator', () => {
  test('calculates known plant density cases', () => {
    const oneRai = calculatePlantSpacing({
      landSizeValue: 1,
      landSizeUnit: 'rai',
      rowSpacingCm: 100,
      plantSpacingCm: 100,
      seedlingBufferPercent: 0,
      usableAreaPercent: 100,
    });
    expect(oneRai.estimatedPlantCount).toBe(1600);
    expect(oneRai.plantsPerRai).toBe(1600);

    const fiveRai = calculatePlantSpacing({
      landSizeValue: 5,
      landSizeUnit: 'rai',
      rowSpacingCm: 100,
      plantSpacingCm: 80,
      seedlingBufferPercent: 0,
      usableAreaPercent: 100,
    });
    expect(fiveRai.estimatedPlantCount).toBe(10000);
  });

  test('handles impossible, tiny, huge, and invalid spacing inputs safely', () => {
    const impossible = calculatePlantSpacing({
      landSizeValue: 1,
      landSizeUnit: 'rai',
      rowSpacingCm: 0,
      plantSpacingCm: 100,
      seedlingBufferPercent: 0,
      usableAreaPercent: 100,
    });
    expect(impossible.isValid).toBe(false);
    expect(impossible.estimatedPlantCount).toBe(0);

    const tiny = calculatePlantSpacing({
      landSizeValue: 1,
      landSizeUnit: 'square_meter',
      rowSpacingCm: 100,
      plantSpacingCm: 100,
      seedlingBufferPercent: 0,
      usableAreaPercent: 100,
    });
    expect(tiny.isValid).toBe(true);
    expect(tiny.warnings.join(' ')).toContain('พื้นที่เล็กมาก');

    const huge = calculatePlantSpacing({
      landSizeValue: 20000,
      landSizeUnit: 'rai',
      rowSpacingCm: 1,
      plantSpacingCm: 1,
      seedlingBufferPercent: 0,
      usableAreaPercent: 100,
    });
    expect(huge.isValid).toBe(true);
    expect(huge.warnings.join(' ')).toContain('พื้นที่ใหญ่มาก');
    expect(huge.warnings.join(' ')).toContain('จำนวนต้นสูงมาก');

    const invalidUnit = calculatePlantSpacing({
      landSizeValue: 1,
      landSizeUnit: undefined as unknown as ThaiAreaUnit,
      rowSpacingCm: 100,
      plantSpacingCm: 100,
      seedlingBufferPercent: 0,
      usableAreaPercent: 100,
    });
    expect(invalidUnit.isValid).toBe(false);
    expect(invalidUnit.warnings.join(' ')).toContain('เลือกหน่วยพื้นที่');
  });
});

describe('fertilizer helper calculator', () => {
  test('calculates N target helper math without crop recommendation', () => {
    const result = calculateFertilizerMix({
      areaValue: 1,
      areaUnit: 'rai',
      targetNitrogenKgPerRai: 4,
      targetPhosphorusKgPerRai: 0,
      targetPotassiumKgPerRai: 0,
      fertilizerNPercent: 46,
      fertilizerPPercent: 0,
      fertilizerKPercent: 0,
      baseNutrient: 'nitrogen',
    });

    expect(result.isValid).toBe(true);
    expect(result.estimatedFertilizerKg).toBeCloseTo(8.69565, 4);
    expect(result.limitingNutrient).toBe('nitrogen');
  });

  test('rejects divide-by-zero fertilizer states and invalid area units', () => {
    const zeroFormula = calculateFertilizerMix({
      areaValue: 1,
      areaUnit: 'rai',
      targetNitrogenKgPerRai: 4,
      targetPhosphorusKgPerRai: 0,
      targetPotassiumKgPerRai: 0,
      fertilizerNPercent: 0,
      fertilizerPPercent: 0,
      fertilizerKPercent: 0,
      baseNutrient: 'nitrogen',
    });
    expect(zeroFormula.isValid).toBe(false);
    expect(zeroFormula.estimatedFertilizerKg).toBe(0);

    const zeroTargets = calculateFertilizerMix({
      areaValue: 1,
      areaUnit: 'rai',
      targetNitrogenKgPerRai: 0,
      targetPhosphorusKgPerRai: 0,
      targetPotassiumKgPerRai: 0,
      fertilizerNPercent: 46,
      fertilizerPPercent: 0,
      fertilizerKPercent: 0,
      baseNutrient: 'nitrogen',
    });
    expect(zeroTargets.isValid).toBe(false);

    const invalidUnit = calculateFertilizerMix({
      areaValue: 1,
      areaUnit: 'hectare' as ThaiAreaUnit,
      targetNitrogenKgPerRai: 4,
      targetPhosphorusKgPerRai: 0,
      targetPotassiumKgPerRai: 0,
      fertilizerNPercent: 46,
      fertilizerPPercent: 0,
      fertilizerKPercent: 0,
      baseNutrient: 'nitrogen',
    });
    expect(invalidUnit.isValid).toBe(false);
    expect(invalidUnit.warnings.join(' ')).toContain('เลือกหน่วยพื้นที่');
  });
});

describe('yield estimate calculator', () => {
  test('calculates total yield, ton, and yield per rai', () => {
    const result = calculateYieldEstimate({
      landSizeValue: 1,
      landSizeUnit: 'rai',
      sampleCount: 10,
      averageWeightKg: 0.5,
      estimatedTotalUnits: 1000,
    });

    expect(result.isValid).toBe(true);
    expect(result.sampleTotalKg).toBe(5);
    expect(result.estimatedTotalKg).toBe(500);
    expect(result.estimatedTotalTon).toBe(0.5);
    expect(result.yieldPerRaiKg).toBe(500);
  });

  test('guards low sample count, unrealistic yield, and zero area', () => {
    const lowSample = calculateYieldEstimate({
      landSizeValue: 1,
      landSizeUnit: 'rai',
      sampleCount: 1,
      averageWeightKg: 0.5,
      estimatedTotalUnits: 1000,
    });
    expect(lowSample.isValid).toBe(true);
    expect(lowSample.warnings.join(' ')).toContain('จำนวนตัวอย่างน้อย');

    const unrealistic = calculateYieldEstimate({
      landSizeValue: 1,
      landSizeUnit: 'rai',
      sampleCount: 10,
      averageWeightKg: 1000,
      estimatedTotalUnits: 2000,
    });
    expect(unrealistic.isValid).toBe(true);
    expect(unrealistic.warnings.join(' ')).toContain('ผลผลิตรวมสูงมาก');

    const zeroArea = calculateYieldEstimate({
      landSizeValue: 0,
      landSizeUnit: 'rai',
      sampleCount: 10,
      averageWeightKg: 0.5,
      estimatedTotalUnits: 1000,
    });
    expect(zeroArea.isValid).toBe(false);
    expect(zeroArea.yieldPerRaiKg).toBe(0);
  });
});

describe('cost estimate calculator', () => {
  test('calculates total, cost per rai, and optional break-even per kg', () => {
    const result = calculateCostEstimate({
      landSizeValue: 2,
      landSizeUnit: 'rai',
      fertilizerCost: 2000,
      laborCost: 1000,
      waterCost: 500,
      machineryCost: 500,
      otherCost: 0,
      expectedYieldKg: 1000,
    });

    expect(result.isValid).toBe(true);
    expect(result.totalCost).toBe(4000);
    expect(result.costPerRai).toBe(2000);
    expect(result.costPerKg).toBe(4);
  });

  test('guards all-zero cost, negative cost, huge cost, and zero expected yield', () => {
    const allZero = calculateCostEstimate({
      landSizeValue: 1,
      landSizeUnit: 'rai',
      fertilizerCost: 0,
      laborCost: 0,
      waterCost: 0,
      machineryCost: 0,
      otherCost: 0,
      expectedYieldKg: 0,
    });
    expect(allZero.isValid).toBe(false);
    expect(allZero.costPerKg).toBeUndefined();

    const negative = calculateCostEstimate({
      landSizeValue: 1,
      landSizeUnit: 'rai',
      fertilizerCost: -100,
      laborCost: 0,
      waterCost: 0,
      machineryCost: 0,
      otherCost: 0,
      expectedYieldKg: 0,
    });
    expect(negative.isValid).toBe(false);
    expect(negative.totalCost).toBe(0);

    const huge = calculateCostEstimate({
      landSizeValue: 1,
      landSizeUnit: 'rai',
      fertilizerCost: Number.MAX_SAFE_INTEGER / 4,
      laborCost: Number.MAX_SAFE_INTEGER / 4,
      waterCost: Number.MAX_SAFE_INTEGER / 4,
      machineryCost: 0,
      otherCost: 0,
      expectedYieldKg: 1,
    });
    expect(huge.isValid).toBe(true);
    expect(Number.isFinite(huge.totalCost)).toBe(true);
    expect(huge.warnings.join(' ')).toContain('ต้นทุนรวมสูงมาก');
  });
});

describe('crop profile example loading', () => {
  test('loads all required crop profiles as planning-only examples', () => {
    const requiredCropKeys = ['rice', 'cassava', 'sugarcane', 'maize', 'durian', 'longan', 'rubber', 'vegetable_mixed'];

    expect(cropCalculatorProfiles.map((profile) => profile.cropKey).sort()).toEqual([...requiredCropKeys].sort());

    cropCalculatorProfiles.forEach((profile) => {
      expect(profile.thaiDisplayName.length).toBeGreaterThan(0);
      expect(profile.commonSpacingExamples.length).toBeGreaterThan(0);
      expect(profile.commonUnitExamples.length).toBeGreaterThan(0);
      expect(profile.yieldEstimateInputExamples.length).toBeGreaterThan(0);
      expect(profile.costCategoriesCommonlyUsed.length).toBeGreaterThan(0);
      expect(profile.safetyDisclaimerNotes.length).toBeGreaterThan(0);
      expect(profile.fertilizerPlanningStatus).toBe('planning_only');
      expect(profile.fertilizerPlanningNote).toContain('ยังไม่แนะนำอัตราปุ๋ย');
    });
  });

  test('rejects invalid crop keys without inventing recommendations', () => {
    expect(isCropCalculatorKey('rice')).toBe(true);
    expect(isCropCalculatorKey('banana_experimental')).toBe(false);
    expect(getCropCalculatorProfile('rice').cropKey).toBe('rice');
  });
});

describe('edge-case fixture regression suite', () => {
  test('edge fixtures classify validation status and warnings as expected', () => {
    agriCalculatorEdgeFixtures.forEach((fixture) => {
      const run = runAgriCalculatorEdgeFixture(fixture);
      expect(run.isMatch, `${run.id}: ${run.warnings.join(' | ')}`).toBe(true);
    });
  });

  test('crop edge fixtures reject invalid crop profile keys', () => {
    cropProfileEdgeFixtures.forEach((fixture) => {
      const run = runCropProfileEdgeFixture(fixture);
      expect(run.isMatch, run.id).toBe(true);
    });
  });
});

describe('calculator result summary service', () => {
  test('builds local share metadata and Thai result recap for valid results', () => {
    const input = {
      tankLiters: 20,
      tankSizeOption: 20 as const,
      dosageAmount: 20,
      dosageUnit: 'cc' as const,
      dosageWaterLiters: 20,
    };
    const result = calculateSprayMix(input);
    const summary = buildCalculatorResultSummary('spray_mix', input, result, {
      createdAt: '2026-05-24T08:00:00.000Z',
      id: 'summary-test',
    });

    expect(summary.id).toBe('summary-test');
    expect(summary.summaryTitle).toContain('สรุปผลคำนวณเบื้องต้น');
    expect(summary.inputRecap.join(' ')).toContain('ถังน้ำ 20 ลิตร');
    expect(summary.resultRecap.join(' ')).toContain('ต้องใช้ยา/สาร');
    expect(summary.safetyDisclaimer).toContain('ควรตรวจสอบฉลาก/ผู้เชี่ยวชาญ');
    expect(summary.shareText).toContain('สรุปผลคำนวณเบื้องต้น');
    expect(summary.shareMetadata.native.source).toBe('native');
    expect(summary.shareMetadata.line.source).toBe('line');
    expect(summary.shareMetadata.facebook.source).toBe('facebook');
    expect(summary.calculatorRoute).toBe('/app/calculators/spray-mix');
  });

  test('returns an empty saved-results state outside browser storage', () => {
    const state = getSavedCalculatorResultSummaries();

    expect(state.version).toBe(1);
    expect(state.savedResults).toEqual([]);
  });
});

describe('calculator export template service', () => {
  function createSummary(category: CalculatorCategory) {
    const input = {
      spray_mix: {
        tankLiters: 20,
        tankSizeOption: 20 as const,
        dosageAmount: 20,
        dosageUnit: 'cc' as const,
        dosageWaterLiters: 20,
      },
      plant_spacing: {
        landSizeValue: 1,
        landSizeUnit: 'rai' as const,
        rowSpacingCm: 100,
        plantSpacingCm: 100,
        seedlingBufferPercent: 0,
        usableAreaPercent: 100,
      },
      fertilizer_mix: {
        areaValue: 1,
        areaUnit: 'rai' as const,
        targetNitrogenKgPerRai: 4,
        targetPhosphorusKgPerRai: 0,
        targetPotassiumKgPerRai: 0,
        fertilizerNPercent: 46,
        fertilizerPPercent: 0,
        fertilizerKPercent: 0,
        baseNutrient: 'nitrogen' as const,
      },
      yield_estimate: {
        landSizeValue: 1,
        landSizeUnit: 'rai' as const,
        sampleCount: 10,
        averageWeightKg: 0.5,
        estimatedTotalUnits: 1000,
      },
      cost_estimate: {
        landSizeValue: 2,
        landSizeUnit: 'rai' as const,
        fertilizerCost: 2000,
        laborCost: 1000,
        waterCost: 500,
        machineryCost: 500,
        otherCost: 0,
        expectedYieldKg: 1000,
      },
    }[category];
    const result = calculateAgriCalculator(category, input);

    return buildCalculatorResultSummary(category, input, result, {
      createdAt: '2026-05-24T08:00:00.000Z',
      id: `template-${category}`,
    });
  }

  test('formats short and long text templates for every calculator category', () => {
    const categories: CalculatorCategory[] = ['spray_mix', 'plant_spacing', 'fertilizer_mix', 'yield_estimate', 'cost_estimate'];

    categories.forEach((category) => {
      const template = buildCalculatorExportTemplate(createSummary(category), {
        cropLabel: category === 'plant_spacing' ? 'ข้าว' : undefined,
        generatedAt: '2026-05-24T08:00:00.000Z',
      });

      expect(template.shortLineText).toContain('สรุปผลคำนวณเบื้องต้น');
      expect(template.shortLineText).toContain('ควรตรวจสอบฉลาก/ผู้เชี่ยวชาญ');
      expect(template.longDetailText).toContain('ข้อมูลที่กรอก');
      expect(template.longDetailText).toContain('ผลคำนวณ');
      expect(template.longDetailText).toContain('KasetHub เครื่องคำนวณเกษตร');
      expect(template.longDetailText).toContain('ไม่มี PDF');
      expect(template.resultRecap.length).toBeGreaterThan(0);
    });
  });

  test('creates LINE-friendly templates and truncates oversized text safely', () => {
    const summary = createSummary('spray_mix');
    const template = buildCalculatorExportTemplate(summary, {
      lineFriendlyMaxChars: 120,
      longDetailMaxChars: 220,
    });

    expect(template.shortLineText.length).toBeLessThanOrEqual(120);
    expect(template.shortLineWasTruncated).toBe(true);
    expect(template.shortLineText).toContain('KasetHub');
    expect(template.longDetailText.length).toBeLessThanOrEqual(220);
    expect(template.longDetailWasTruncated).toBe(true);

    const clamped = clampCalculatorExportText('ก'.repeat(500), 80);
    expect(clamped.wasTruncated).toBe(true);
    expect(clamped.text.length).toBeLessThanOrEqual(80);
  });

  test('protects empty summaries before copy or share', async () => {
    expect(prepareCalculatorShareText('').status).toBe('empty');

    const copyResult = await copyCalculatorExportText('', {
      writeText: async () => undefined,
    });
    expect(copyResult.status).toBe('empty');

    const shareResult = await shareCalculatorExportText({
      title: 'empty',
      text: '   ',
      nativeShare: { share: async () => undefined },
      clipboard: { writeText: async () => undefined },
    });
    expect(shareResult.status).toBe('empty');
  });

  test('copies text through clipboard and reports unsupported clipboard fallback', async () => {
    let copiedText = '';
    const copied = await copyCalculatorExportText('ข้อความทดสอบ', {
      writeText: async (text) => {
        copiedText = text;
      },
    });

    expect(copied.status).toBe('copied');
    expect(copied.message).toBe('คัดลอกข้อความสำเร็จ');
    expect(copiedText).toBe('ข้อความทดสอบ');

    const unsupported = await copyCalculatorExportText('ข้อความทดสอบ');
    expect(unsupported.status).toBe('unsupported');
    expect(unsupported.helperMessage).toBe('ลองคัดลอกข้อความแทน');
  });

  test('falls back from unsupported native share to clipboard text copy', async () => {
    let copiedText = '';
    const result = await shareCalculatorExportText({
      title: 'สรุป',
      text: 'ข้อความสำหรับแชร์',
      nativeShare: {},
      clipboard: {
        writeText: async (text) => {
          copiedText = text;
        },
      },
    });

    expect(result.status).toBe('copied_fallback');
    expect(result.message).toBe('อุปกรณ์นี้ไม่รองรับการแชร์โดยตรง');
    expect(result.helperMessage).toBe('คัดลอกข้อความสำเร็จ');
    expect(copiedText).toBe('ข้อความสำหรับแชร์');
  });
});
