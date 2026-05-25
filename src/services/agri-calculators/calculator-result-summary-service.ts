import {
  calculatorCards,
  calculatorLocalOnlyDisclaimer,
  mixAmountUnitLabels,
  thaiAreaUnitLabels,
} from '@/services/agri-calculators/agri-calculator-fixtures';
import {
  createCalculatorShareSummary,
  formatAgriCurrency,
  formatAgriNumber,
} from '@/services/agri-calculators/agri-calculator-service';
import type {
  AgriCalculatorInputByCategory,
  AgriCalculatorResultByCategory,
  CalculatorCategory,
  CostEstimateInput,
  CostEstimateResult,
  FertilizerMixInput,
  FertilizerMixResult,
  PlantSpacingInput,
  PlantSpacingResult,
  SprayMixInput,
  SprayMixResult,
  ThaiAreaUnit,
  YieldEstimateInput,
  YieldEstimateResult,
} from '@/services/agri-calculators/agri-calculator.types';
import type {
  CalculatorResultSummary,
  CalculatorSavedResultsState,
} from '@/services/agri-calculators/calculator-result-summary.types';

export const calculatorResultSummaryStorageKey = 'kasethub.calculatorResultSummaries.v1';
export const calculatorResultSummaryChangedEvent = 'kasethub:calculator-result-summaries-changed';

const currentVersion = 1 as const;
const maxSavedSummaries = 30;
const fallbackRoute = '/app/calculators' as const;
const summarySafetyDisclaimer =
  'ผลคำนวณเบื้องต้น ควรตรวจสอบฉลาก/ผู้เชี่ยวชาญก่อนใช้งานจริง และไม่รับประกันผลในแปลงจริง';
const localOnlyNote = `${calculatorLocalOnlyDisclaimer} สรุปนี้เป็น local-only ไม่มี PDF ไม่มี backend save และไม่มี cloud sync`;

function now() {
  return new Date().toISOString();
}

function canUseStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage);
}

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function safeParseJson(rawValue: string | null): unknown {
  if (!rawValue) return undefined;

  try {
    return JSON.parse(rawValue) as unknown;
  } catch {
    return undefined;
  }
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

function isCalculatorCategory(value: unknown): value is CalculatorCategory {
  return typeof value === 'string' && calculatorCards.some((card) => card.id === value);
}

function createLocalSummaryId(category: CalculatorCategory) {
  const randomValue =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.round(Math.random() * 100000)}`;

  return `calculator-summary:${category}:${randomValue}`;
}

function formatAreaInput(value: number, unit: ThaiAreaUnit) {
  return `${formatAgriNumber(value, 2)} ${thaiAreaUnitLabels[unit]?.shortLabel ?? unit}`;
}

function createEmptyState(): CalculatorSavedResultsState {
  return {
    version: currentVersion,
    savedResults: [],
    updatedAt: now(),
  };
}

function createSummaryRecaps<C extends CalculatorCategory>(
  category: C,
  input: AgriCalculatorInputByCategory[C],
  result: AgriCalculatorResultByCategory[C],
) {
  if (category === 'spray_mix') {
    const sprayInput = input as SprayMixInput;
    const sprayResult = result as SprayMixResult;

    return {
      inputRecap: [
        `ถังน้ำ ${formatAgriNumber(sprayResult.tankLiters, 0)} ลิตร`,
        `อัตราฉลาก ${formatAgriNumber(sprayInput.dosageAmount, 2)} ${mixAmountUnitLabels[sprayInput.dosageUnit]} / น้ำ ${formatAgriNumber(sprayInput.dosageWaterLiters, 0)} ลิตร`,
      ],
      resultRecap: [`ต้องใช้ยา/สาร ${sprayResult.requiredAmountLabel}`, `ความเข้มข้น ${sprayResult.concentrationLabel}`],
      warningRecap: sprayResult.warnings,
    };
  }

  if (category === 'plant_spacing') {
    const spacingInput = input as PlantSpacingInput;
    const spacingResult = result as PlantSpacingResult;

    return {
      inputRecap: [
        `พื้นที่ ${formatAreaInput(spacingInput.landSizeValue, spacingInput.landSizeUnit)}`,
        `ระยะปลูก ${formatAgriNumber(spacingInput.rowSpacingCm, 0)} x ${formatAgriNumber(spacingInput.plantSpacingCm, 0)} ซม.`,
        `พื้นที่ใช้ปลูกจริง ${formatAgriNumber(spacingInput.usableAreaPercent, 0)}%`,
      ],
      resultRecap: [
        `จำนวนต้นประมาณ ${formatAgriNumber(spacingResult.estimatedPlantCount, 0)} ต้น`,
        `ต้นกล้าที่ควรเตรียม ${formatAgriNumber(spacingResult.estimatedSeedlingCount, 0)} ต้น`,
        `คิดเป็น ${spacingResult.areaLabels.rai}`,
      ],
      warningRecap: spacingResult.warnings,
    };
  }

  if (category === 'fertilizer_mix') {
    const fertilizerInput = input as FertilizerMixInput;
    const fertilizerResult = result as FertilizerMixResult;

    return {
      inputRecap: [
        `พื้นที่ ${formatAreaInput(fertilizerInput.areaValue, fertilizerInput.areaUnit)}`,
        `สูตรปุ๋ย ${formatAgriNumber(fertilizerInput.fertilizerNPercent, 0)}-${formatAgriNumber(fertilizerInput.fertilizerPPercent, 0)}-${formatAgriNumber(fertilizerInput.fertilizerKPercent, 0)}`,
        `เป้าหมาย NPK ต่อไร่ ${formatAgriNumber(fertilizerInput.targetNitrogenKgPerRai, 2)}-${formatAgriNumber(fertilizerInput.targetPhosphorusKgPerRai, 2)}-${formatAgriNumber(fertilizerInput.targetPotassiumKgPerRai, 2)} กก.`,
      ],
      resultRecap: [
        `ปริมาณปุ๋ยประมาณ ${fertilizerResult.estimatedFertilizerLabel}`,
        `เทียบกระสอบ 50 กก. ${fertilizerResult.estimatedBags50KgLabel}`,
        'ยังไม่ใช่คำแนะนำปุ๋ยจริง',
      ],
      warningRecap: fertilizerResult.warnings,
    };
  }

  if (category === 'yield_estimate') {
    const yieldInput = input as YieldEstimateInput;
    const yieldResult = result as YieldEstimateResult;

    return {
      inputRecap: [
        `พื้นที่ ${formatAreaInput(yieldInput.landSizeValue, yieldInput.landSizeUnit)}`,
        `ตัวอย่าง ${formatAgriNumber(yieldInput.sampleCount, 0)} หน่วย`,
        `น้ำหนักเฉลี่ย ${formatAgriNumber(yieldInput.averageWeightKg, 2)} กก.`,
      ],
      resultRecap: [
        `ผลผลิตรวมประมาณ ${formatAgriNumber(yieldResult.estimatedTotalKg, 2)} กก.`,
        `เทียบเป็น ${formatAgriNumber(yieldResult.estimatedTotalTon, 3)} ตัน`,
        `ผลผลิตต่อไร่ ${formatAgriNumber(yieldResult.yieldPerRaiKg, 2)} กก./ไร่`,
      ],
      warningRecap: yieldResult.warnings,
    };
  }

  const costInput = input as CostEstimateInput;
  const costResult = result as CostEstimateResult;

  return {
    inputRecap: [
      `พื้นที่ ${formatAreaInput(costInput.landSizeValue, costInput.landSizeUnit)}`,
      `ค่าปุ๋ย/ยา ${formatAgriCurrency(costInput.fertilizerCost)}`,
      `ค่าแรง ${formatAgriCurrency(costInput.laborCost)}`,
      `ค่าอื่นรวม ${formatAgriCurrency(costInput.waterCost + costInput.machineryCost + costInput.otherCost)}`,
    ],
    resultRecap: [
      `ต้นทุนรวม ${costResult.totalCostLabel}`,
      `ต้นทุนต่อไร่ ${costResult.costPerRaiLabel}`,
      `จุดคุ้มทุนเบื้องต้น ${costResult.costPerKgLabel ?? 'รอข้อมูลผลผลิต'}`,
    ],
    warningRecap: costResult.warnings,
  };
}

function normalizeSummary(input: unknown): CalculatorResultSummary | undefined {
  if (!isObject(input) || typeof input.id !== 'string' || !isCalculatorCategory(input.category)) {
    return undefined;
  }

  const card = calculatorCards.find((item) => item.id === input.category);
  const createdAt = typeof input.createdAt === 'string' ? input.createdAt : now();
  const calculatorRoute = card?.route ?? fallbackRoute;
  const summaryTitle =
    typeof input.summaryTitle === 'string' ? input.summaryTitle : `สรุปผลคำนวณเบื้องต้น: ${card?.shortLabel ?? 'เครื่องคำนวณ'}`;
  const shareText = typeof input.shareText === 'string' ? input.shareText : summaryTitle;

  return {
    id: input.id,
    category: input.category,
    calculatorLabel: typeof input.calculatorLabel === 'string' ? input.calculatorLabel : card?.label ?? 'เครื่องคำนวณเกษตร',
    calculatorShortLabel: typeof input.calculatorShortLabel === 'string' ? input.calculatorShortLabel : card?.shortLabel ?? 'เครื่องคำนวณ',
    summaryTitle,
    inputRecap: Array.isArray(input.inputRecap) ? input.inputRecap.filter((item): item is string => typeof item === 'string') : [],
    resultRecap: Array.isArray(input.resultRecap) ? input.resultRecap.filter((item): item is string => typeof item === 'string') : [],
    warningRecap: Array.isArray(input.warningRecap) ? input.warningRecap.filter((item): item is string => typeof item === 'string') : [],
    safetyDisclaimer: typeof input.safetyDisclaimer === 'string' ? input.safetyDisclaimer : summarySafetyDisclaimer,
    calculatorRoute,
    shareText,
    shareMetadata: {
      native: { title: summaryTitle, description: shareText, url: calculatorRoute, source: 'native' },
      line: { title: summaryTitle, description: shareText, url: calculatorRoute, source: 'line' },
      facebook: { title: summaryTitle, description: shareText, url: calculatorRoute, source: 'facebook' },
    },
    createdAt,
    createdAtLabel: typeof input.createdAtLabel === 'string' ? input.createdAtLabel : formatThaiDateTime(createdAt),
    localOnlyNote: typeof input.localOnlyNote === 'string' ? input.localOnlyNote : localOnlyNote,
  };
}

function normalizeState(input: unknown): CalculatorSavedResultsState {
  const fallback = createEmptyState();

  if (!isObject(input)) {
    return fallback;
  }

  return {
    version: currentVersion,
    savedResults: Array.isArray(input.savedResults)
      ? input.savedResults
          .map((item) => normalizeSummary(item))
          .filter((item): item is CalculatorResultSummary => Boolean(item))
          .slice(0, maxSavedSummaries)
      : [],
    updatedAt: typeof input.updatedAt === 'string' ? input.updatedAt : now(),
  };
}

function notifyChanged() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(calculatorResultSummaryChangedEvent));
  }
}

function persistState(state: CalculatorSavedResultsState) {
  const nextState: CalculatorSavedResultsState = {
    ...state,
    version: currentVersion,
    updatedAt: now(),
  };

  if (!canUseStorage()) {
    return nextState;
  }

  try {
    window.localStorage.setItem(calculatorResultSummaryStorageKey, JSON.stringify(nextState));
    notifyChanged();
    return nextState;
  } catch {
    return state;
  }
}

export function buildCalculatorResultSummary<C extends CalculatorCategory>(
  category: C,
  input: AgriCalculatorInputByCategory[C],
  result: AgriCalculatorResultByCategory[C],
  options: { createdAt?: string; id?: string } = {},
): CalculatorResultSummary {
  const card = calculatorCards.find((item) => item.id === category);
  const createdAt = options.createdAt ?? now();
  const calculatorRoute = card?.route ?? fallbackRoute;
  const summaryTitle = `สรุปผลคำนวณเบื้องต้น: ${card?.shortLabel ?? 'เครื่องคำนวณ'}`;
  const recaps = createSummaryRecaps(category, input, result);
  const shareText = createCalculatorShareSummary(category, input, result);

  return {
    id: options.id ?? createLocalSummaryId(category),
    category,
    calculatorLabel: card?.label ?? 'เครื่องคำนวณเกษตร',
    calculatorShortLabel: card?.shortLabel ?? 'เครื่องคำนวณ',
    summaryTitle,
    inputRecap: recaps.inputRecap,
    resultRecap: recaps.resultRecap,
    warningRecap: recaps.warningRecap,
    safetyDisclaimer: summarySafetyDisclaimer,
    calculatorRoute,
    shareText,
    shareMetadata: {
      native: { title: summaryTitle, description: shareText, url: calculatorRoute, source: 'native' },
      line: { title: summaryTitle, description: shareText, url: calculatorRoute, source: 'line' },
      facebook: { title: summaryTitle, description: shareText, url: calculatorRoute, source: 'facebook' },
    },
    createdAt,
    createdAtLabel: formatThaiDateTime(createdAt),
    localOnlyNote,
  };
}

export function getSavedCalculatorResultSummaries() {
  if (!canUseStorage()) return createEmptyState();
  return normalizeState(safeParseJson(window.localStorage.getItem(calculatorResultSummaryStorageKey)));
}

export function saveCalculatorResultSummary(summary: CalculatorResultSummary) {
  const state = getSavedCalculatorResultSummaries();
  const savedResults = [summary, ...state.savedResults.filter((item) => item.id !== summary.id)].slice(0, maxSavedSummaries);

  return persistState({
    ...state,
    savedResults,
  });
}

export function deleteCalculatorResultSummary(id: string) {
  const state = getSavedCalculatorResultSummaries();

  return persistState({
    ...state,
    savedResults: state.savedResults.filter((item) => item.id !== id),
  });
}

export function clearCalculatorResultSummaries() {
  const state = getSavedCalculatorResultSummaries();

  return persistState({
    ...state,
    savedResults: [],
  });
}

export function subscribeCalculatorResultSummaries(listener: () => void) {
  if (typeof window === 'undefined') {
    return () => undefined;
  }

  const storageListener = (event: StorageEvent) => {
    if (event.key === calculatorResultSummaryStorageKey) {
      listener();
    }
  };

  window.addEventListener(calculatorResultSummaryChangedEvent, listener);
  window.addEventListener('storage', storageListener);

  return () => {
    window.removeEventListener(calculatorResultSummaryChangedEvent, listener);
    window.removeEventListener('storage', storageListener);
  };
}
