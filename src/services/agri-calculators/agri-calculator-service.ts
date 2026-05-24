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

function asFiniteNumber(value: unknown, fallback = 0) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function asPositiveNumber(value: unknown) {
  const numberValue = asFiniteNumber(value);
  return numberValue > 0 ? numberValue : 0;
}

function clampPercent(value: number, fallback = 0) {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(Math.max(value, 0), 100);
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

function getAreaSquareMeters(value: number, unit: ThaiAreaUnit) {
  return asPositiveNumber(value) * squareMetersPerAreaUnit[unit];
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
  const tankLiters = asPositiveNumber(input.tankLiters);
  const dosageAmount = asPositiveNumber(input.dosageAmount);
  const dosageWaterLiters = asPositiveNumber(input.dosageWaterLiters);
  const warnings: string[] = [];

  if (!tankLiters) warnings.push('กรอกขนาดถังเป็นลิตรก่อนคำนวณ');
  if (!dosageAmount) warnings.push('กรอกปริมาณยาหรือสารตามฉลากก่อนคำนวณ');
  if (!dosageWaterLiters) warnings.push('กรอกปริมาณน้ำอ้างอิงบนฉลากก่อนคำนวณ');

  const requiredAmount = tankLiters && dosageAmount && dosageWaterLiters ? (dosageAmount / dosageWaterLiters) * tankLiters : 0;
  const concentrationPerLiter = tankLiters > 0 ? requiredAmount / tankLiters : 0;
  const concentrationLimit = input.dosageUnit === 'gram' ? 20 : 10;
  const isConcentrationHigh = concentrationPerLiter > concentrationLimit;

  if (isConcentrationHigh) {
    warnings.push('อัตราผสมต่อ 1 ลิตรสูงกว่าค่าที่ควรตรวจซ้ำ กรุณาอ่านฉลากและถามผู้เชี่ยวชาญก่อนใช้');
  }

  if (tankLiters > 200) {
    warnings.push('ขนาดถังใหญ่มาก ควรแบ่งผสมและคนให้เข้ากันตามคำแนะนำบนฉลาก');
  }

  return {
    isValid: tankLiters > 0 && dosageAmount > 0 && dosageWaterLiters > 0,
    tankLiters,
    requiredAmount,
    requiredAmountLabel: `${formatAgriNumber(requiredAmount, 2)} ${mixAmountUnitLabels[input.dosageUnit]}`,
    concentrationPerLiter,
    concentrationLabel: `${formatAgriNumber(concentrationPerLiter, 2)} ${mixAmountUnitLabels[input.dosageUnit]} / ลิตร`,
    isConcentrationHigh,
    warnings,
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
  const areaSquareMeters = getAreaSquareMeters(input.areaValue, input.areaUnit);
  const areaRai = convertThaiArea(areaSquareMeters, 'square_meter', 'rai');
  const fertilizerNPercent = clampPercent(input.fertilizerNPercent);
  const fertilizerPPercent = clampPercent(input.fertilizerPPercent);
  const fertilizerKPercent = clampPercent(input.fertilizerKPercent);
  const normalizedInput = {
    ...input,
    fertilizerNPercent,
    fertilizerPPercent,
    fertilizerKPercent,
  };
  const warnings: string[] = [];

  if (!areaSquareMeters) warnings.push('กรอกพื้นที่ก่อนคำนวณ');
  if (fertilizerNPercent + fertilizerPPercent + fertilizerKPercent <= 0) {
    warnings.push('กรอกสูตรปุ๋ย NPK อย่างน้อยหนึ่งตัว');
  }

  const targetTotalKg: Record<NutrientKey, number> = {
    nitrogen: Math.max(0, input.targetNitrogenKgPerRai) * areaRai,
    phosphorus: Math.max(0, input.targetPhosphorusKgPerRai) * areaRai,
    potassium: Math.max(0, input.targetPotassiumKgPerRai) * areaRai,
  };
  const limitingNutrient = selectFertilizerBaseNutrient(normalizedInput, targetTotalKg);
  const targetForBase = limitingNutrient === 'auto' ? 0 : targetTotalKg[limitingNutrient];
  const percentForBase = percentForNutrient(normalizedInput, limitingNutrient);
  const estimatedFertilizerKg = targetForBase > 0 && percentForBase > 0 ? targetForBase / (percentForBase / 100) : 0;

  if (limitingNutrient !== 'auto' && targetForBase > 0 && percentForBase <= 0) {
    warnings.push(`สูตรปุ๋ยนี้ไม่มี ${nutrientLabels[limitingNutrient]} จึงคำนวณจากธาตุนี้ไม่ได้`);
  }

  if (estimatedFertilizerKg > 0) {
    (Object.keys(targetTotalKg) as NutrientKey[]).forEach((nutrient) => {
      const target = targetTotalKg[nutrient];
      const supplied = estimatedFertilizerKg * (percentForNutrient(normalizedInput, nutrient) / 100);

      if (target > 0 && supplied < target * 0.8) {
        warnings.push(`ปริมาณ ${nutrientLabels[nutrient]} ที่ได้อาจต่ำกว่าเป้าหมาย ควรตรวจสูตรปุ๋ยอีกครั้ง`);
      }
    });
  }

  if (estimatedFertilizerKg > 1000) {
    warnings.push('ตัวเลขปุ๋ยสูงมาก ควรตรวจหน่วยพื้นที่และปรึกษานักวิชาการเกษตร');
  }

  const suppliedTotalKg: Record<NutrientKey, number> = {
    nitrogen: estimatedFertilizerKg * (fertilizerNPercent / 100),
    phosphorus: estimatedFertilizerKg * (fertilizerPPercent / 100),
    potassium: estimatedFertilizerKg * (fertilizerKPercent / 100),
  };

  return {
    isValid: areaSquareMeters > 0 && estimatedFertilizerKg > 0,
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
    warnings,
    disclaimer: fertilizerFoundationDisclaimer,
  };
}

export function calculatePlantSpacing(input: PlantSpacingInput): PlantSpacingResult {
  const landAreaSquareMeters = getAreaSquareMeters(input.landSizeValue, input.landSizeUnit);
  const rowSpacingMeters = asPositiveNumber(input.rowSpacingCm) / 100;
  const plantSpacingMeters = asPositiveNumber(input.plantSpacingCm) / 100;
  const usableAreaPercent = clampPercent(input.usableAreaPercent, 100);
  const seedlingBufferPercent = clampPercent(input.seedlingBufferPercent);
  const usableAreaSquareMeters = landAreaSquareMeters * (usableAreaPercent / 100);
  const areaPerPlant = rowSpacingMeters * plantSpacingMeters;
  const estimatedPlantCount = areaPerPlant > 0 ? Math.floor(usableAreaSquareMeters / areaPerPlant) : 0;
  const estimatedSeedlingCount = Math.ceil(estimatedPlantCount * (1 + seedlingBufferPercent / 100));
  const warnings: string[] = [];

  if (!landAreaSquareMeters) warnings.push('กรอกขนาดพื้นที่ก่อนคำนวณ');
  if (!rowSpacingMeters || !plantSpacingMeters) warnings.push('กรอกระยะห่างระหว่างแถวและระหว่างต้นเป็นเซนติเมตร');
  if (usableAreaPercent < 70) warnings.push('พื้นที่ใช้ปลูกต่ำกว่า 70% ควรตรวจว่าหักทางเดิน/คันนาไว้มากเกินไปหรือไม่');
  if (estimatedPlantCount > 100000) warnings.push('จำนวนต้นสูงมาก ควรตรวจหน่วยระยะปลูกและพื้นที่');

  return {
    isValid: landAreaSquareMeters > 0 && rowSpacingMeters > 0 && plantSpacingMeters > 0,
    landAreaSquareMeters,
    areaLabels: createAreaLabels(landAreaSquareMeters),
    rowSpacingMeters,
    plantSpacingMeters,
    estimatedPlantCount,
    estimatedSeedlingCount,
    plantsPerRai: landAreaSquareMeters > 0 ? estimatedPlantCount / convertThaiArea(landAreaSquareMeters, 'square_meter', 'rai') : 0,
    warnings,
    disclaimer: agricultureSafetyDisclaimer,
  };
}

export function calculateYieldEstimate(input: YieldEstimateInput): YieldEstimateResult {
  const areaSquareMeters = getAreaSquareMeters(input.landSizeValue, input.landSizeUnit);
  const areaRai = convertThaiArea(areaSquareMeters, 'square_meter', 'rai');
  const sampleCount = Math.floor(asPositiveNumber(input.sampleCount));
  const averageWeightKg = asPositiveNumber(input.averageWeightKg);
  const estimatedTotalUnits = Math.floor(asPositiveNumber(input.estimatedTotalUnits));
  const sampleTotalKg = sampleCount * averageWeightKg;
  const estimatedTotalKg = estimatedTotalUnits * averageWeightKg;
  const estimatedTotalTon = estimatedTotalKg / 1000;
  const warnings: string[] = [];

  if (!areaSquareMeters) warnings.push('กรอกพื้นที่ก่อนคำนวณผลผลิตต่อไร่');
  if (!sampleCount) warnings.push('กรอกจำนวนตัวอย่างที่ชั่ง');
  if (!averageWeightKg) warnings.push('กรอกน้ำหนักเฉลี่ยต่อหน่วยเป็นกิโลกรัม');
  if (!estimatedTotalUnits) warnings.push('กรอกจำนวนหน่วยผลผลิตที่คาดว่าจะเก็บเกี่ยวทั้งหมด');
  if (sampleCount > 0 && sampleCount < 5) warnings.push('จำนวนตัวอย่างน้อย ควรเพิ่มตัวอย่างเพื่อให้ประมาณการแม่นขึ้น');

  return {
    isValid: areaSquareMeters > 0 && sampleCount > 0 && averageWeightKg > 0 && estimatedTotalUnits > 0,
    areaRai,
    areaLabels: createAreaLabels(areaSquareMeters),
    sampleTotalKg,
    estimatedTotalKg,
    estimatedTotalTon,
    yieldPerRaiKg: areaRai > 0 ? estimatedTotalKg / areaRai : 0,
    yieldPerRaiTon: areaRai > 0 ? estimatedTotalTon / areaRai : 0,
    warnings,
    disclaimer: agricultureSafetyDisclaimer,
  };
}

export function calculateCostEstimate(input: CostEstimateInput): CostEstimateResult {
  const areaSquareMeters = getAreaSquareMeters(input.landSizeValue, input.landSizeUnit);
  const areaRai = convertThaiArea(areaSquareMeters, 'square_meter', 'rai');
  const costItems: CostEstimateResult['costItems'] = [
    { id: 'fertilizerCost', label: costItemLabels.fertilizerCost, amount: Math.max(0, input.fertilizerCost) },
    { id: 'laborCost', label: costItemLabels.laborCost, amount: Math.max(0, input.laborCost) },
    { id: 'waterCost', label: costItemLabels.waterCost, amount: Math.max(0, input.waterCost) },
    { id: 'machineryCost', label: costItemLabels.machineryCost, amount: Math.max(0, input.machineryCost) },
    { id: 'otherCost', label: costItemLabels.otherCost, amount: Math.max(0, input.otherCost) },
  ];
  const totalCost = costItems.reduce((total, item) => total + item.amount, 0);
  const expectedYieldKg = asPositiveNumber(input.expectedYieldKg);
  const costPerKg = expectedYieldKg > 0 ? totalCost / expectedYieldKg : undefined;
  const warnings: string[] = [];

  if (!areaSquareMeters) warnings.push('กรอกพื้นที่ก่อนคำนวณต้นทุนต่อไร่');
  if (!totalCost) warnings.push('กรอกค่าใช้จ่ายอย่างน้อยหนึ่งรายการ');
  if (totalCost > 0 && areaRai > 0 && totalCost / areaRai > 100000) {
    warnings.push('ต้นทุนต่อไร่สูงมาก ควรตรวจตัวเลขและหน่วยเงินอีกครั้ง');
  }

  return {
    isValid: areaSquareMeters > 0 && totalCost > 0,
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
    warnings,
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
