import {
  agriCalculatorChangedEvent,
  agriCalculatorStorageKey,
  agricultureSafetyDisclaimer,
  calculatorCards,
  calculatorLocalOnlyDisclaimer,
  defaultCostEstimateInput,
  defaultFertilizerMixInput,
  defaultPlantSpacingInput,
  defaultSprayMixInput,
  defaultYieldEstimateInput,
  fertilizerFoundationDisclaimer,
  mixAmountUnitLabels,
  sprayMixSafetyDisclaimer,
  thaiAreaUnitLabels,
} from '@/services/agri-calculators/agri-calculator-fixtures';
import type {
  AgriCalculatorInputByCategory,
  AgriCalculatorResultByCategory,
  AgriCalculatorState,
  AreaLabels,
  CalculatorCategory,
  CalculatorHistoryRecord,
  CostEstimateInput,
  CostEstimateResult,
  FertilizerBaseNutrient,
  FertilizerMixInput,
  FertilizerMixResult,
  NutrientKey,
  PlantSpacingInput,
  PlantSpacingResult,
  SprayMixInput,
  SprayMixResult,
  ThaiAreaUnit,
  YieldEstimateInput,
  YieldEstimateResult,
} from '@/services/agri-calculators/agri-calculator.types';
import {
  calculatorValidationLimits,
  hasValidationErrors,
  normalizeMixAmountUnit,
  normalizeNonNegativeNumber,
  normalizePercent,
  normalizePositiveNumber,
  normalizeTankSizeOption,
  normalizeThaiAreaUnit,
  validationMessagesToWarnings,
} from '@/services/agri-calculators/agri-calculator-validation';

const currentVersion = 1 as const;
const maxHistoryRecords = 20;

const squareMetersPerAreaUnit: Record<ThaiAreaUnit, number> = {
  rai: 1600,
  ngan: 400,
  square_wa: 4,
  square_meter: 1,
};

const nutrientLabels: Record<NutrientKey, string> = {
  nitrogen: 'N',
  phosphorus: 'P',
  potassium: 'K',
};

const costItemLabels: Record<CostEstimateResult['costItems'][number]['id'], string> = {
  fertilizerCost: 'ค่าปุ๋ย/ยา',
  laborCost: 'ค่าแรง',
  waterCost: 'ค่าน้ำ',
  machineryCost: 'ค่าเครื่องจักร',
  otherCost: 'ค่าอื่น ๆ',
};

const categoryIds = calculatorCards.map((card) => card.id);

function now() {
  return new Date().toISOString();
}

function canUseStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage);
}

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function isCalculatorCategory(value: unknown): value is CalculatorCategory {
  return typeof value === 'string' && categoryIds.includes(value as CalculatorCategory);
}

function round(value: number, decimals = 2) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

export function formatAgriNumber(value: number, decimals = 2) {
  return new Intl.NumberFormat('th-TH', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: value > 0 && value < 1 ? Math.min(decimals, 2) : 0,
  }).format(round(value, decimals));
}

export function formatAgriCurrency(value: number) {
  return new Intl.NumberFormat('th-TH', {
    maximumFractionDigits: 0,
    style: 'currency',
    currency: 'THB',
  }).format(Math.round(value));
}

function formatThaiDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'ไม่ทราบเวลา';
  }

  return date.toLocaleString('th-TH', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function convertThaiArea(value: number, fromUnit: ThaiAreaUnit, toUnit: ThaiAreaUnit) {
  const squareMeters = value * squareMetersPerAreaUnit[fromUnit];
  return squareMeters / squareMetersPerAreaUnit[toUnit];
}

export function createAreaLabels(squareMeters: number): AreaLabels {
  return {
    rai: `${formatAgriNumber(convertThaiArea(squareMeters, 'square_meter', 'rai'), 2)} ไร่`,
    ngan: `${formatAgriNumber(convertThaiArea(squareMeters, 'square_meter', 'ngan'), 2)} งาน`,
    squareWa: `${formatAgriNumber(convertThaiArea(squareMeters, 'square_meter', 'square_wa'), 2)} ตร.วา`,
    squareMeters: `${formatAgriNumber(squareMeters, 2)} ตร.ม.`,
  };
}

function normalizeArea(value: unknown, unit: unknown, label = 'พื้นที่') {
  const areaUnit = normalizeThaiAreaUnit(unit);
  const areaValue = normalizePositiveNumber(value, label, {
    id: 'area-value',
  });
  const squareMeters = areaValue.value * squareMetersPerAreaUnit[areaUnit.value];
  const messages = [...areaUnit.messages, ...areaValue.messages];

  if (squareMeters > 0 && squareMeters < calculatorValidationLimits.tinyAreaSquareMeters) {
    messages.push({
      id: 'area:tiny',
      severity: 'warning',
      message: 'พื้นที่เล็กมาก ควรตรวจหน่วยพื้นที่อีกครั้ง',
    });
  }

  if (squareMeters > calculatorValidationLimits.largeAreaSquareMeters) {
    messages.push({
      id: 'area:large',
      severity: 'warning',
      message: 'พื้นที่ใหญ่มาก ควรตรวจหน่วยพื้นที่และตัวเลขอีกครั้ง',
    });
  }

  if (squareMeters > calculatorValidationLimits.hugeAreaSquareMeters) {
    messages.push({
      id: 'area:huge',
      severity: 'warning',
      message: 'พื้นที่สูงผิดปกติมาก ควรแยกแปลงหรือใช้ข้อมูลรังวัด/บัญชีฟาร์มที่ตรวจแล้ว',
    });
  }

  return {
    squareMeters,
    rai: convertThaiArea(squareMeters, 'square_meter', 'rai'),
    unit: areaUnit.value,
    messages,
  };
}

function createEmptyState(): AgriCalculatorState {
  return {
    version: currentVersion,
    recentCalculations: [],
    favoriteCalculatorIds: ['plant_spacing', 'spray_mix'],
    lastInputs: {},
    updatedAt: now(),
  };
}

function safeParseJson(rawValue: string | null): unknown {
  if (!rawValue) return undefined;

  try {
    return JSON.parse(rawValue) as unknown;
  } catch {
    return undefined;
  }
}

function normalizeHistoryRecord(input: unknown): CalculatorHistoryRecord | undefined {
  if (!isObject(input) || !isCalculatorCategory(input.category) || typeof input.id !== 'string') {
    return undefined;
  }

  const title = typeof input.title === 'string' ? input.title : calculatorCards.find((card) => card.id === input.category)?.label ?? 'เครื่องคำนวณ';
  const createdAt = typeof input.createdAt === 'string' ? input.createdAt : now();

  return {
    id: input.id,
    category: input.category,
    title,
    summary: typeof input.summary === 'string' ? input.summary : '',
    resultLabel: typeof input.resultLabel === 'string' ? input.resultLabel : '',
    createdAt,
    createdAtLabel: typeof input.createdAtLabel === 'string' ? input.createdAtLabel : formatThaiDateTime(createdAt),
    input: isObject(input.input) ? (input.input as AgriCalculatorInputByCategory[CalculatorCategory]) : defaultSprayMixInput,
    result: isObject(input.result) ? (input.result as AgriCalculatorResultByCategory[CalculatorCategory]) : calculateSprayMix(defaultSprayMixInput),
    disclaimer: typeof input.disclaimer === 'string' ? input.disclaimer : calculatorLocalOnlyDisclaimer,
  };
}

function normalizeLastInputs(input: unknown): Partial<AgriCalculatorInputByCategory> {
  const lastInputs: Partial<AgriCalculatorInputByCategory> = {};

  if (!isObject(input)) {
    return lastInputs;
  }

  if (isObject(input.spray_mix)) lastInputs.spray_mix = input.spray_mix as SprayMixInput;
  if (isObject(input.fertilizer_mix)) lastInputs.fertilizer_mix = input.fertilizer_mix as FertilizerMixInput;
  if (isObject(input.plant_spacing)) lastInputs.plant_spacing = input.plant_spacing as PlantSpacingInput;
  if (isObject(input.yield_estimate)) lastInputs.yield_estimate = input.yield_estimate as YieldEstimateInput;
  if (isObject(input.cost_estimate)) lastInputs.cost_estimate = input.cost_estimate as CostEstimateInput;

  return lastInputs;
}

function normalizeState(input: unknown): AgriCalculatorState {
  const fallback = createEmptyState();

  if (!isObject(input)) {
    return fallback;
  }

  const favoriteCalculatorIds = Array.isArray(input.favoriteCalculatorIds)
    ? input.favoriteCalculatorIds.filter(isCalculatorCategory)
    : fallback.favoriteCalculatorIds;
  const recentCalculations = Array.isArray(input.recentCalculations)
    ? input.recentCalculations
        .map((record) => normalizeHistoryRecord(record))
        .filter((record): record is CalculatorHistoryRecord => Boolean(record))
        .slice(0, maxHistoryRecords)
    : fallback.recentCalculations;

  return {
    version: currentVersion,
    recentCalculations,
    favoriteCalculatorIds,
    lastInputs: normalizeLastInputs(input.lastInputs),
    updatedAt: typeof input.updatedAt === 'string' ? input.updatedAt : now(),
  };
}

function notifyChanged() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(agriCalculatorChangedEvent));
  }
}

function persistState(state: AgriCalculatorState) {
  const nextState: AgriCalculatorState = {
    ...state,
    version: currentVersion,
    updatedAt: now(),
  };

  if (!canUseStorage()) {
    return nextState;
  }

  try {
    window.localStorage.setItem(agriCalculatorStorageKey, JSON.stringify(nextState));
    notifyChanged();
    return nextState;
  } catch {
    return state;
  }
}

export function calculateSprayMix(input: SprayMixInput): SprayMixResult {
  const tankSizeOption = normalizeTankSizeOption(input.tankSizeOption);
  const dosageUnit = normalizeMixAmountUnit(input.dosageUnit);
  const tank = normalizePositiveNumber(input.tankLiters, 'น้ำในถัง', {
    id: 'spray-tank-liters',
    maxWarning: calculatorValidationLimits.hugeSprayTankLiters,
    maxWarningMessage: 'ขนาดถังสูงผิดปกติ ควรแบ่งรอบผสมและตรวจตัวเลขลิตรอีกครั้ง',
  });
  const dosage = normalizePositiveNumber(input.dosageAmount, 'ปริมาณยา/สารตามฉลาก', {
    id: 'spray-dosage-amount',
  });
  const dosageWater = normalizePositiveNumber(input.dosageWaterLiters, 'น้ำอ้างอิงบนฉลาก', {
    id: 'spray-dosage-water',
  });
  const messages = [...tankSizeOption.messages, ...dosageUnit.messages, ...tank.messages, ...dosage.messages, ...dosageWater.messages];
  const tankLiters = tank.value;
  const dosageAmount = dosage.value;
  const dosageWaterLiters = dosageWater.value;

  const requiredAmount = tankLiters > 0 && dosageAmount > 0 && dosageWaterLiters > 0 ? (dosageAmount / dosageWaterLiters) * tankLiters : 0;
  const concentrationPerLiter = tankLiters > 0 ? requiredAmount / tankLiters : 0;
  const concentrationLimit =
    dosageUnit.value === 'gram' ? calculatorValidationLimits.highSprayGramPerLiter : calculatorValidationLimits.highSprayCcOrMlPerLiter;
  const isConcentrationHigh = concentrationPerLiter > concentrationLimit;

  if (isConcentrationHigh) {
    messages.push({
      id: 'spray-concentration:high',
      severity: 'warning',
      message: 'อัตราผสมต่อ 1 ลิตรสูงกว่าค่าที่ควรตรวจซ้ำ กรุณาอ่านฉลากและถามผู้เชี่ยวชาญก่อนใช้',
    });
  }

  if (tankLiters > calculatorValidationLimits.largeSprayTankLiters) {
    messages.push({
      id: 'spray-tank:large',
      severity: 'warning',
      message: 'ขนาดถังใหญ่มาก ควรแบ่งผสมและคนให้เข้ากันตามคำแนะนำบนฉลาก',
    });
  }

  return {
    isValid: tankLiters > 0 && dosageAmount > 0 && dosageWaterLiters > 0 && !hasValidationErrors(messages),
    tankLiters,
    requiredAmount,
    requiredAmountLabel: `${formatAgriNumber(requiredAmount, 2)} ${mixAmountUnitLabels[dosageUnit.value]}`,
    concentrationPerLiter,
    concentrationLabel: `${formatAgriNumber(concentrationPerLiter, 2)} ${mixAmountUnitLabels[dosageUnit.value]} / ลิตร`,
    isConcentrationHigh,
    warnings: validationMessagesToWarnings(messages),
    disclaimer: sprayMixSafetyDisclaimer,
    safetyNotes: [
      'ควรอ่านฉลากจริงก่อนใช้',
      'สวมอุปกรณ์ป้องกันและผสมในที่อากาศถ่ายเท',
      'ห้ามใช้ผลลัพธ์นี้แทนคำแนะนำจากฉลากหรือเจ้าหน้าที่เกษตร',
      calculatorLocalOnlyDisclaimer,
    ],
  };
}

function selectFertilizerBaseNutrient(
  input: FertilizerMixInput,
  targets: Record<NutrientKey, number>,
): FertilizerBaseNutrient {
  if (input.baseNutrient !== 'auto') {
    return input.baseNutrient;
  }

  const nutrientCandidates: Array<{ key: NutrientKey; amountKg: number }> = [
    {
      key: 'nitrogen',
      amountKg: input.fertilizerNPercent > 0 ? targets.nitrogen / (input.fertilizerNPercent / 100) : 0,
    },
    {
      key: 'phosphorus',
      amountKg: input.fertilizerPPercent > 0 ? targets.phosphorus / (input.fertilizerPPercent / 100) : 0,
    },
    {
      key: 'potassium',
      amountKg: input.fertilizerKPercent > 0 ? targets.potassium / (input.fertilizerKPercent / 100) : 0,
    },
  ];

  return nutrientCandidates.sort((a, b) => b.amountKg - a.amountKg)[0]?.key ?? 'auto';
}

function percentForNutrient(input: FertilizerMixInput, nutrient: FertilizerBaseNutrient) {
  if (nutrient === 'nitrogen') return input.fertilizerNPercent;
  if (nutrient === 'phosphorus') return input.fertilizerPPercent;
  if (nutrient === 'potassium') return input.fertilizerKPercent;
  return 0;
}

export function calculateFertilizerMix(input: FertilizerMixInput): FertilizerMixResult {
  const area = normalizeArea(input.areaValue, input.areaUnit, 'พื้นที่');
  const targetNitrogen = normalizeNonNegativeNumber(input.targetNitrogenKgPerRai, 'เป้าหมาย N ต่อไร่', {
    id: 'fertilizer-target-n',
  });
  const targetPhosphorus = normalizeNonNegativeNumber(input.targetPhosphorusKgPerRai, 'เป้าหมาย P ต่อไร่', {
    id: 'fertilizer-target-p',
  });
  const targetPotassium = normalizeNonNegativeNumber(input.targetPotassiumKgPerRai, 'เป้าหมาย K ต่อไร่', {
    id: 'fertilizer-target-k',
  });
  const fertilizerN = normalizePercent(input.fertilizerNPercent, 'เปอร์เซ็นต์ N', { id: 'fertilizer-n-percent' });
  const fertilizerP = normalizePercent(input.fertilizerPPercent, 'เปอร์เซ็นต์ P', { id: 'fertilizer-p-percent' });
  const fertilizerK = normalizePercent(input.fertilizerKPercent, 'เปอร์เซ็นต์ K', { id: 'fertilizer-k-percent' });
  const baseNutrient: FertilizerBaseNutrient =
    input.baseNutrient === 'nitrogen' || input.baseNutrient === 'phosphorus' || input.baseNutrient === 'potassium' || input.baseNutrient === 'auto'
      ? input.baseNutrient
      : 'auto';
  const messages = [
    ...area.messages,
    ...targetNitrogen.messages,
    ...targetPhosphorus.messages,
    ...targetPotassium.messages,
    ...fertilizerN.messages,
    ...fertilizerP.messages,
    ...fertilizerK.messages,
  ];
  const areaSquareMeters = area.squareMeters;
  const areaRai = area.rai;
  const fertilizerNPercent = fertilizerN.value;
  const fertilizerPPercent = fertilizerP.value;
  const fertilizerKPercent = fertilizerK.value;
  const normalizedInput = {
    ...input,
    fertilizerNPercent,
    fertilizerPPercent,
    fertilizerKPercent,
    baseNutrient,
  };

  if (fertilizerNPercent + fertilizerPPercent + fertilizerKPercent <= 0) {
    messages.push({
      id: 'fertilizer-npk:missing',
      severity: 'error',
      message: 'กรอกสูตรปุ๋ย NPK อย่างน้อยหนึ่งตัว',
    });
  }

  const targetTotalKg: Record<NutrientKey, number> = {
    nitrogen: targetNitrogen.value * areaRai,
    phosphorus: targetPhosphorus.value * areaRai,
    potassium: targetPotassium.value * areaRai,
  };

  if (targetTotalKg.nitrogen + targetTotalKg.phosphorus + targetTotalKg.potassium <= 0) {
    messages.push({
      id: 'fertilizer-target:missing',
      severity: 'error',
      message: 'กรอกเป้าหมาย N, P หรือ K อย่างน้อยหนึ่งรายการ',
    });
  }

  const limitingNutrient = selectFertilizerBaseNutrient(normalizedInput, targetTotalKg);
  const targetForBase = limitingNutrient === 'auto' ? 0 : targetTotalKg[limitingNutrient];
  const percentForBase = percentForNutrient(normalizedInput, limitingNutrient);
  const estimatedFertilizerKg = targetForBase > 0 && percentForBase > 0 ? targetForBase / (percentForBase / 100) : 0;

  if (limitingNutrient !== 'auto' && targetForBase > 0 && percentForBase <= 0) {
    messages.push({
      id: `fertilizer-base:${limitingNutrient}:missing`,
      severity: 'error',
      message: `สูตรปุ๋ยนี้ไม่มี ${nutrientLabels[limitingNutrient]} จึงคำนวณจากธาตุนี้ไม่ได้`,
    });
  }

  if (estimatedFertilizerKg > 0) {
    (Object.keys(targetTotalKg) as NutrientKey[]).forEach((nutrient) => {
      const target = targetTotalKg[nutrient];
      const supplied = estimatedFertilizerKg * (percentForNutrient(normalizedInput, nutrient) / 100);

      if (target > 0 && supplied < target * 0.8) {
        messages.push({
          id: `fertilizer-supplied:${nutrient}:low`,
          severity: 'warning',
          message: `ปริมาณ ${nutrientLabels[nutrient]} ที่ได้อาจต่ำกว่าเป้าหมาย ควรตรวจสูตรปุ๋ยอีกครั้ง`,
        });
      }
    });
  }

  if (estimatedFertilizerKg > calculatorValidationLimits.highFertilizerKg) {
    messages.push({
      id: 'fertilizer-estimate:large',
      severity: 'warning',
      message: 'ตัวเลขปุ๋ยสูงมาก ควรตรวจหน่วยพื้นที่และปรึกษานักวิชาการเกษตร',
    });
  }

  const suppliedTotalKg: Record<NutrientKey, number> = {
    nitrogen: estimatedFertilizerKg * (fertilizerNPercent / 100),
    phosphorus: estimatedFertilizerKg * (fertilizerPPercent / 100),
    potassium: estimatedFertilizerKg * (fertilizerKPercent / 100),
  };

  return {
    isValid: areaSquareMeters > 0 && estimatedFertilizerKg > 0 && !hasValidationErrors(messages),
    areaSquareMeters,
    areaRai,
    areaLabels: createAreaLabels(areaSquareMeters),
    estimatedFertilizerKg,
    estimatedFertilizerLabel: `${formatAgriNumber(estimatedFertilizerKg, 2)} กก.`,
    estimatedBags50Kg: estimatedFertilizerKg / 50,
    estimatedBags50KgLabel: `${formatAgriNumber(estimatedFertilizerKg / 50, 2)} กระสอบ 50 กก.`,
    targetTotalKg,
    suppliedTotalKg,
    limitingNutrient,
    warnings: validationMessagesToWarnings(messages),
    disclaimer: fertilizerFoundationDisclaimer,
  };
}

export function calculatePlantSpacing(input: PlantSpacingInput): PlantSpacingResult {
  const area = normalizeArea(input.landSizeValue, input.landSizeUnit, 'ขนาดพื้นที่');
  const rowSpacing = normalizePositiveNumber(input.rowSpacingCm, 'ระยะห่างระหว่างแถว', {
    id: 'spacing-row-cm',
    minWarning: calculatorValidationLimits.tinySpacingCm,
    minWarningMessage: 'ระยะห่างระหว่างแถวน้อยมาก ควรตรวจหน่วยเซนติเมตรอีกครั้ง',
    maxWarning: calculatorValidationLimits.hugeSpacingCm,
    maxWarningMessage: 'ระยะห่างระหว่างแถวสูงผิดปกติ ควรตรวจหน่วยเซนติเมตรอีกครั้ง',
  });
  const plantSpacing = normalizePositiveNumber(input.plantSpacingCm, 'ระยะห่างระหว่างต้น', {
    id: 'spacing-plant-cm',
    minWarning: calculatorValidationLimits.tinySpacingCm,
    minWarningMessage: 'ระยะห่างระหว่างต้นน้อยมาก ควรตรวจหน่วยเซนติเมตรอีกครั้ง',
    maxWarning: calculatorValidationLimits.hugeSpacingCm,
    maxWarningMessage: 'ระยะห่างระหว่างต้นสูงผิดปกติ ควรตรวจหน่วยเซนติเมตรอีกครั้ง',
  });
  const usableArea = normalizePercent(input.usableAreaPercent, 'พื้นที่ใช้ปลูกจริง', { id: 'spacing-usable-area' });
  const seedlingBuffer = normalizePercent(input.seedlingBufferPercent, 'เผื่อต้นกล้าเพิ่ม', { id: 'spacing-seedling-buffer' });
  const messages = [...area.messages, ...rowSpacing.messages, ...plantSpacing.messages, ...usableArea.messages, ...seedlingBuffer.messages];
  const landAreaSquareMeters = area.squareMeters;
  const rowSpacingMeters = rowSpacing.value / 100;
  const plantSpacingMeters = plantSpacing.value / 100;
  const usableAreaPercent = usableArea.value;
  const seedlingBufferPercent = seedlingBuffer.value;
  const usableAreaSquareMeters = landAreaSquareMeters * (usableAreaPercent / 100);
  const areaPerPlant = rowSpacingMeters * plantSpacingMeters;
  const estimatedPlantCount = areaPerPlant > 0 ? Math.floor(usableAreaSquareMeters / areaPerPlant) : 0;
  const estimatedSeedlingCount = Math.ceil(estimatedPlantCount * (1 + seedlingBufferPercent / 100));

  if (usableAreaPercent < 70) {
    messages.push({
      id: 'spacing-usable-area:low',
      severity: 'warning',
      message: 'พื้นที่ใช้ปลูกต่ำกว่า 70% ควรตรวจว่าหักทางเดิน/คันนาไว้มากเกินไปหรือไม่',
    });
  }
  if (estimatedPlantCount > calculatorValidationLimits.highPlantCount) {
    messages.push({
      id: 'spacing-plant-count:high',
      severity: 'warning',
      message: 'จำนวนต้นสูงมาก ควรตรวจหน่วยระยะปลูกและพื้นที่',
    });
  }

  return {
    isValid: landAreaSquareMeters > 0 && rowSpacingMeters > 0 && plantSpacingMeters > 0 && !hasValidationErrors(messages),
    landAreaSquareMeters,
    areaLabels: createAreaLabels(landAreaSquareMeters),
    rowSpacingMeters,
    plantSpacingMeters,
    estimatedPlantCount,
    estimatedSeedlingCount,
    plantsPerRai: landAreaSquareMeters > 0 ? estimatedPlantCount / convertThaiArea(landAreaSquareMeters, 'square_meter', 'rai') : 0,
    warnings: validationMessagesToWarnings(messages),
    disclaimer: agricultureSafetyDisclaimer,
  };
}

export function calculateYieldEstimate(input: YieldEstimateInput): YieldEstimateResult {
  const area = normalizeArea(input.landSizeValue, input.landSizeUnit, 'พื้นที่');
  const sample = normalizePositiveNumber(input.sampleCount, 'จำนวนตัวอย่าง', { id: 'yield-sample-count' });
  const averageWeight = normalizePositiveNumber(input.averageWeightKg, 'น้ำหนักเฉลี่ยต่อหน่วย', {
    id: 'yield-average-weight',
  });
  const totalUnits = normalizePositiveNumber(input.estimatedTotalUnits, 'จำนวนรวมที่คาดไว้', {
    id: 'yield-total-units',
  });
  const messages = [...area.messages, ...sample.messages, ...averageWeight.messages, ...totalUnits.messages];
  const areaSquareMeters = area.squareMeters;
  const areaRai = area.rai;
  const sampleCount = Math.floor(sample.value);
  const averageWeightKg = averageWeight.value;
  const estimatedTotalUnits = Math.floor(totalUnits.value);
  const sampleTotalKg = sampleCount * averageWeightKg;
  const estimatedTotalKg = estimatedTotalUnits * averageWeightKg;
  const estimatedTotalTon = estimatedTotalKg / 1000;

  if (sampleCount > 0 && sampleCount < 5) {
    messages.push({
      id: 'yield-sample-count:low',
      severity: 'warning',
      message: 'จำนวนตัวอย่างน้อย ควรเพิ่มตัวอย่างเพื่อให้ประมาณการแม่นขึ้น',
    });
  }

  if (estimatedTotalKg > calculatorValidationLimits.highYieldKg) {
    messages.push({
      id: 'yield-total:high',
      severity: 'warning',
      message: 'ผลผลิตรวมสูงมาก ควรตรวจจำนวนรวมและน้ำหนักเฉลี่ยอีกครั้ง',
    });
  }

  return {
    isValid: areaSquareMeters > 0 && sampleCount > 0 && averageWeightKg > 0 && estimatedTotalUnits > 0 && !hasValidationErrors(messages),
    areaRai,
    areaLabels: createAreaLabels(areaSquareMeters),
    sampleTotalKg,
    estimatedTotalKg,
    estimatedTotalTon,
    yieldPerRaiKg: areaRai > 0 ? estimatedTotalKg / areaRai : 0,
    yieldPerRaiTon: areaRai > 0 ? estimatedTotalTon / areaRai : 0,
    warnings: validationMessagesToWarnings(messages),
    disclaimer: agricultureSafetyDisclaimer,
  };
}

export function calculateCostEstimate(input: CostEstimateInput): CostEstimateResult {
  const area = normalizeArea(input.landSizeValue, input.landSizeUnit, 'พื้นที่');
  const fertilizerCost = normalizeNonNegativeNumber(input.fertilizerCost, 'ค่าปุ๋ย/ยา', {
    id: 'cost-fertilizer',
    maxWarning: calculatorValidationLimits.highTotalCost,
  });
  const laborCost = normalizeNonNegativeNumber(input.laborCost, 'ค่าแรง', {
    id: 'cost-labor',
    maxWarning: calculatorValidationLimits.highTotalCost,
  });
  const waterCost = normalizeNonNegativeNumber(input.waterCost, 'ค่าน้ำ', {
    id: 'cost-water',
    maxWarning: calculatorValidationLimits.highTotalCost,
  });
  const machineryCost = normalizeNonNegativeNumber(input.machineryCost, 'ค่าเครื่องจักร', {
    id: 'cost-machinery',
    maxWarning: calculatorValidationLimits.highTotalCost,
  });
  const otherCost = normalizeNonNegativeNumber(input.otherCost, 'ค่าอื่น ๆ', {
    id: 'cost-other',
    maxWarning: calculatorValidationLimits.highTotalCost,
  });
  const expectedYield = normalizeNonNegativeNumber(input.expectedYieldKg ?? 0, 'ผลผลิตที่คาดไว้', {
    id: 'cost-expected-yield',
  });
  const messages = [
    ...area.messages,
    ...fertilizerCost.messages,
    ...laborCost.messages,
    ...waterCost.messages,
    ...machineryCost.messages,
    ...otherCost.messages,
    ...expectedYield.messages,
  ];
  const areaSquareMeters = area.squareMeters;
  const areaRai = area.rai;
  const costItems: CostEstimateResult['costItems'] = [
    { id: 'fertilizerCost', label: costItemLabels.fertilizerCost, amount: fertilizerCost.value },
    { id: 'laborCost', label: costItemLabels.laborCost, amount: laborCost.value },
    { id: 'waterCost', label: costItemLabels.waterCost, amount: waterCost.value },
    { id: 'machineryCost', label: costItemLabels.machineryCost, amount: machineryCost.value },
    { id: 'otherCost', label: costItemLabels.otherCost, amount: otherCost.value },
  ];
  const totalCost = costItems.reduce((total, item) => total + item.amount, 0);
  const expectedYieldKg = expectedYield.value;
  const costPerKg = expectedYieldKg > 0 ? totalCost / expectedYieldKg : undefined;

  if (!totalCost) {
    messages.push({
      id: 'cost-total:zero',
      severity: 'error',
      message: 'กรอกค่าใช้จ่ายอย่างน้อยหนึ่งรายการ',
    });
  }

  if (totalCost > calculatorValidationLimits.highTotalCost) {
    messages.push({
      id: 'cost-total:high',
      severity: 'warning',
      message: 'ต้นทุนรวมสูงมาก ควรตรวจตัวเลขค่าใช้จ่ายอีกครั้ง',
    });
  }

  if (totalCost > 0 && areaRai > 0 && totalCost / areaRai > calculatorValidationLimits.highCostPerRai) {
    messages.push({
      id: 'cost-per-rai:high',
      severity: 'warning',
      message: 'ต้นทุนต่อไร่สูงมาก ควรตรวจตัวเลขและหน่วยเงินอีกครั้ง',
    });
  }

  return {
    isValid: areaSquareMeters > 0 && totalCost > 0 && !hasValidationErrors(messages),
    areaRai,
    areaLabels: createAreaLabels(areaSquareMeters),
    totalCost,
    totalCostLabel: formatAgriCurrency(totalCost),
    costPerRai: areaRai > 0 ? totalCost / areaRai : 0,
    costPerRaiLabel: areaRai > 0 ? `${formatAgriCurrency(totalCost / areaRai)} / ไร่` : 'ยังคำนวณไม่ได้',
    costPerKg,
    costPerKgLabel: costPerKg ? `${formatAgriCurrency(costPerKg)} / กก.` : undefined,
    breakEvenEstimateLabel: costPerKg
      ? `จุดคุ้มทุนเบื้องต้นประมาณ ${formatAgriCurrency(costPerKg)} ต่อกิโลกรัม`
      : 'จุดคุ้มทุนจะคำนวณละเอียดเมื่อเพิ่มราคาขายและผลผลิตจริงในอนาคต',
    costItems,
    warnings: validationMessagesToWarnings(messages),
    disclaimer: agricultureSafetyDisclaimer,
  };
}

export function getDefaultInput<C extends CalculatorCategory>(category: C): AgriCalculatorInputByCategory[C] {
  const defaults: AgriCalculatorInputByCategory = {
    spray_mix: defaultSprayMixInput,
    fertilizer_mix: defaultFertilizerMixInput,
    plant_spacing: defaultPlantSpacingInput,
    yield_estimate: defaultYieldEstimateInput,
    cost_estimate: defaultCostEstimateInput,
  };

  return defaults[category];
}

export function calculateAgriCalculator<C extends CalculatorCategory>(
  category: C,
  input: AgriCalculatorInputByCategory[C],
): AgriCalculatorResultByCategory[C] {
  if (category === 'spray_mix') return calculateSprayMix(input as SprayMixInput) as AgriCalculatorResultByCategory[C];
  if (category === 'fertilizer_mix') return calculateFertilizerMix(input as FertilizerMixInput) as AgriCalculatorResultByCategory[C];
  if (category === 'plant_spacing') return calculatePlantSpacing(input as PlantSpacingInput) as AgriCalculatorResultByCategory[C];
  if (category === 'yield_estimate') return calculateYieldEstimate(input as YieldEstimateInput) as AgriCalculatorResultByCategory[C];
  return calculateCostEstimate(input as CostEstimateInput) as AgriCalculatorResultByCategory[C];
}

function createSummaryLines(baseLines: string[], warnings: string[]) {
  return [
    'สรุปผลคำนวณเบื้องต้น',
    ...baseLines,
    warnings.length > 0 ? `ข้อควรตรวจซ้ำ: ${warnings.join(' · ')}` : 'ยังไม่พบคำเตือนจากสูตรคำนวณ',
    'ควรตรวจสอบฉลาก/ผู้เชี่ยวชาญก่อนใช้งานจริง',
    'ผลลัพธ์นี้ไม่รับประกันผลในแปลงจริง และบันทึก/แชร์จากเครื่องนี้เท่านั้น',
  ].join('\n');
}

function formatAreaInput(value: number, unit: ThaiAreaUnit) {
  return `${formatAgriNumber(value, 2)} ${thaiAreaUnitLabels[unit]?.shortLabel ?? unit}`;
}

export function createCalculatorShareSummary<C extends CalculatorCategory>(
  category: C,
  input: AgriCalculatorInputByCategory[C],
  result: AgriCalculatorResultByCategory[C],
) {
  const card = calculatorCards.find((item) => item.id === category);
  const title = card?.label ?? 'เครื่องคำนวณเกษตร';

  if (category === 'spray_mix') {
    const sprayInput = input as SprayMixInput;
    const sprayResult = result as SprayMixResult;

    return createSummaryLines(
      [
        title,
        `ถังน้ำ: ${formatAgriNumber(sprayResult.tankLiters, 0)} ลิตร`,
        `อัตราฉลากที่กรอก: ${formatAgriNumber(sprayInput.dosageAmount, 2)} ${mixAmountUnitLabels[sprayInput.dosageUnit]} / น้ำ ${formatAgriNumber(sprayInput.dosageWaterLiters, 0)} ลิตร`,
        `ต้องใช้ยา/สาร: ${sprayResult.requiredAmountLabel}`,
        `ความเข้มข้น: ${sprayResult.concentrationLabel}`,
      ],
      sprayResult.warnings,
    );
  }

  if (category === 'plant_spacing') {
    const spacingInput = input as PlantSpacingInput;
    const spacingResult = result as PlantSpacingResult;

    return createSummaryLines(
      [
        title,
        `พื้นที่: ${formatAreaInput(spacingInput.landSizeValue, spacingInput.landSizeUnit)}`,
        `ระยะปลูก: ${formatAgriNumber(spacingInput.rowSpacingCm, 0)} x ${formatAgriNumber(spacingInput.plantSpacingCm, 0)} ซม.`,
        `จำนวนต้นประมาณ: ${formatAgriNumber(spacingResult.estimatedPlantCount, 0)} ต้น`,
        `ต้นกล้าที่ควรเตรียม: ${formatAgriNumber(spacingResult.estimatedSeedlingCount, 0)} ต้น`,
        `พื้นที่คิดเป็น: ${spacingResult.areaLabels.rai} · ${spacingResult.areaLabels.squareMeters}`,
      ],
      spacingResult.warnings,
    );
  }

  if (category === 'fertilizer_mix') {
    const fertilizerInput = input as FertilizerMixInput;
    const fertilizerResult = result as FertilizerMixResult;

    return createSummaryLines(
      [
        title,
        `พื้นที่: ${formatAreaInput(fertilizerInput.areaValue, fertilizerInput.areaUnit)}`,
        `สูตรปุ๋ยที่กรอก: ${formatAgriNumber(fertilizerInput.fertilizerNPercent, 0)}-${formatAgriNumber(fertilizerInput.fertilizerPPercent, 0)}-${formatAgriNumber(fertilizerInput.fertilizerKPercent, 0)}`,
        `ปริมาณปุ๋ยประมาณ: ${fertilizerResult.estimatedFertilizerLabel}`,
        `เทียบกระสอบ 50 กก.: ${fertilizerResult.estimatedBags50KgLabel}`,
        'หมายเหตุ: เป็นการคำนวณเบื้องต้น ยังไม่ใช่คำแนะนำปุ๋ยจริง',
      ],
      fertilizerResult.warnings,
    );
  }

  if (category === 'yield_estimate') {
    const yieldInput = input as YieldEstimateInput;
    const yieldResult = result as YieldEstimateResult;

    return createSummaryLines(
      [
        title,
        `พื้นที่: ${formatAreaInput(yieldInput.landSizeValue, yieldInput.landSizeUnit)}`,
        `ตัวอย่าง: ${formatAgriNumber(yieldInput.sampleCount, 0)} หน่วย · เฉลี่ย ${formatAgriNumber(yieldInput.averageWeightKg, 2)} กก.`,
        `ผลผลิตรวมประมาณ: ${formatAgriNumber(yieldResult.estimatedTotalKg, 2)} กก.`,
        `เทียบเป็นตัน: ${formatAgriNumber(yieldResult.estimatedTotalTon, 3)} ตัน`,
        `ผลผลิตต่อไร่: ${formatAgriNumber(yieldResult.yieldPerRaiKg, 2)} กก./ไร่`,
      ],
      yieldResult.warnings,
    );
  }

  const costInput = input as CostEstimateInput;
  const costResult = result as CostEstimateResult;

  return createSummaryLines(
    [
      title,
      `พื้นที่: ${formatAreaInput(costInput.landSizeValue, costInput.landSizeUnit)}`,
      `ต้นทุนรวม: ${costResult.totalCostLabel}`,
      `ต้นทุนต่อไร่: ${costResult.costPerRaiLabel}`,
      `จุดคุ้มทุนเบื้องต้น: ${costResult.costPerKgLabel ?? 'รอข้อมูลผลผลิต'}`,
      'หมายเหตุ: break-even ยังเป็น placeholder และยังไม่รวมราคาขายจริง',
    ],
    costResult.warnings,
  );
}

function createRecordId(category: CalculatorCategory) {
  return `agri-calculator:${category}:${Date.now()}:${Math.round(Math.random() * 10000)}`;
}

function createHistoryRecord<C extends CalculatorCategory>(
  category: C,
  input: AgriCalculatorInputByCategory[C],
  result: AgriCalculatorResultByCategory[C],
): CalculatorHistoryRecord {
  const createdAt = now();
  const card = calculatorCards.find((item) => item.id === category);

  return {
    id: createRecordId(category),
    category,
    title: card?.label ?? 'เครื่องคำนวณเกษตร',
    summary: createHistorySummary(category, input),
    resultLabel: createHistoryResultLabel(category, result),
    createdAt,
    createdAtLabel: formatThaiDateTime(createdAt),
    input: input as AgriCalculatorInputByCategory[CalculatorCategory],
    result: result as AgriCalculatorResultByCategory[CalculatorCategory],
    disclaimer: card?.disclaimer ?? calculatorLocalOnlyDisclaimer,
  };
}

function createHistorySummary<C extends CalculatorCategory>(category: C, input: AgriCalculatorInputByCategory[C]) {
  if (category === 'spray_mix') {
    const sprayInput = input as SprayMixInput;
    return `ถัง ${formatAgriNumber(sprayInput.tankLiters, 0)} ลิตร · ฉลาก ${formatAgriNumber(sprayInput.dosageAmount, 2)} ${mixAmountUnitLabels[sprayInput.dosageUnit]}`;
  }

  if (category === 'plant_spacing') {
    const spacingInput = input as PlantSpacingInput;
    return `${formatAgriNumber(spacingInput.landSizeValue, 2)} ${spacingInput.landSizeUnit} · ${formatAgriNumber(spacingInput.rowSpacingCm, 0)}x${formatAgriNumber(spacingInput.plantSpacingCm, 0)} ซม.`;
  }

  if (category === 'fertilizer_mix') {
    const fertilizerInput = input as FertilizerMixInput;
    return `${formatAgriNumber(fertilizerInput.areaValue, 2)} ${fertilizerInput.areaUnit} · ${fertilizerInput.fertilizerNPercent}-${fertilizerInput.fertilizerPPercent}-${fertilizerInput.fertilizerKPercent}`;
  }

  if (category === 'yield_estimate') {
    const yieldInput = input as YieldEstimateInput;
    return `${formatAgriNumber(yieldInput.sampleCount, 0)} ตัวอย่าง · เฉลี่ย ${formatAgriNumber(yieldInput.averageWeightKg, 2)} กก.`;
  }

  const costInput = input as CostEstimateInput;
  return `${formatAgriNumber(costInput.landSizeValue, 2)} ${costInput.landSizeUnit} · ต้นทุนหลัก ${formatAgriCurrency(costInput.fertilizerCost + costInput.laborCost)}`;
}

function createHistoryResultLabel<C extends CalculatorCategory>(category: C, result: AgriCalculatorResultByCategory[C]) {
  if (category === 'spray_mix') return (result as SprayMixResult).requiredAmountLabel;
  if (category === 'plant_spacing') return `${formatAgriNumber((result as PlantSpacingResult).estimatedPlantCount, 0)} ต้น`;
  if (category === 'fertilizer_mix') return (result as FertilizerMixResult).estimatedFertilizerLabel;
  if (category === 'yield_estimate') return `${formatAgriNumber((result as YieldEstimateResult).estimatedTotalKg, 2)} กก.`;
  return (result as CostEstimateResult).totalCostLabel;
}

function mergeLastInput<C extends CalculatorCategory>(
  lastInputs: Partial<AgriCalculatorInputByCategory>,
  category: C,
  input: AgriCalculatorInputByCategory[C],
) {
  return {
    ...lastInputs,
    [category]: input,
  } as Partial<AgriCalculatorInputByCategory>;
}

export function getAgriCalculatorState(): AgriCalculatorState {
  if (!canUseStorage()) return createEmptyState();
  return normalizeState(safeParseJson(window.localStorage.getItem(agriCalculatorStorageKey)));
}

export function saveCalculatorResult<C extends CalculatorCategory>(
  category: C,
  input: AgriCalculatorInputByCategory[C],
  result: AgriCalculatorResultByCategory[C],
) {
  const state = getAgriCalculatorState();
  const record = createHistoryRecord(category, input, result);

  return persistState({
    ...state,
    recentCalculations: [record, ...state.recentCalculations].slice(0, maxHistoryRecords),
    lastInputs: mergeLastInput(state.lastInputs, category, input),
  });
}

export function calculateAndSaveAgriCalculator<C extends CalculatorCategory>(
  category: C,
  input: AgriCalculatorInputByCategory[C],
) {
  const result = calculateAgriCalculator(category, input);
  const state = saveCalculatorResult(category, input, result);

  return {
    result,
    state,
  };
}

export function toggleFavoriteCalculator(category: CalculatorCategory) {
  const state = getAgriCalculatorState();
  const favoriteCalculatorIds = state.favoriteCalculatorIds.includes(category)
    ? state.favoriteCalculatorIds.filter((id) => id !== category)
    : [category, ...state.favoriteCalculatorIds];

  return persistState({
    ...state,
    favoriteCalculatorIds,
  });
}

export function clearCalculatorHistory() {
  const state = getAgriCalculatorState();

  return persistState({
    ...state,
    recentCalculations: [],
  });
}

export function getLastCalculatorInput<C extends CalculatorCategory>(
  state: AgriCalculatorState,
  category: C,
): AgriCalculatorInputByCategory[C] {
  return (state.lastInputs[category] ?? getDefaultInput(category)) as AgriCalculatorInputByCategory[C];
}

export function subscribeAgriCalculators(listener: () => void) {
  if (typeof window === 'undefined') {
    return () => undefined;
  }

  const storageListener = (event: StorageEvent) => {
    if (event.key === agriCalculatorStorageKey) {
      listener();
    }
  };

  window.addEventListener(agriCalculatorChangedEvent, listener);
  window.addEventListener('storage', storageListener);

  return () => {
    window.removeEventListener(agriCalculatorChangedEvent, listener);
    window.removeEventListener('storage', storageListener);
  };
}

export function getCalculatorCard(category: CalculatorCategory) {
  return calculatorCards.find((card) => card.id === category);
}
