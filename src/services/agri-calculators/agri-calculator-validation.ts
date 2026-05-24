import type {
  MixAmountUnit,
  TankSizeOption,
  ThaiAreaUnit,
} from '@/services/agri-calculators/agri-calculator.types';

export type CalculatorValidationSeverity = 'error' | 'warning';

export type CalculatorValidationMessage = {
  id: string;
  severity: CalculatorValidationSeverity;
  message: string;
};

export type NormalizedNumber = {
  value: number;
  messages: CalculatorValidationMessage[];
};

export type NormalizedUnit<T extends string | number> = {
  value: T;
  messages: CalculatorValidationMessage[];
};

export const thaiAreaUnits: ThaiAreaUnit[] = ['rai', 'ngan', 'square_wa', 'square_meter'];
export const mixAmountUnits: MixAmountUnit[] = ['cc', 'ml', 'gram'];
export const tankSizeOptions: TankSizeOption[] = [10, 15, 20, 200, 'custom'];

export const calculatorValidationLimits = {
  tinyAreaSquareMeters: 4,
  largeAreaSquareMeters: 1_600_000,
  hugeAreaSquareMeters: 16_000_000,
  highSprayCcOrMlPerLiter: 10,
  highSprayGramPerLiter: 20,
  largeSprayTankLiters: 200,
  hugeSprayTankLiters: 2_000,
  tinySpacingCm: 5,
  hugeSpacingCm: 1_000,
  highPlantCount: 100_000,
  highFertilizerKg: 1_000,
  highYieldKg: 1_000_000,
  highTotalCost: 100_000_000,
  highCostPerRai: 100_000,
};

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

export function normalizePositiveNumber(
  value: unknown,
  label: string,
  options?: {
    id?: string;
    maxWarning?: number;
    maxWarningMessage?: string;
    minWarning?: number;
    minWarningMessage?: string;
  },
): NormalizedNumber {
  const id = options?.id ?? label;
  const messages: CalculatorValidationMessage[] = [];

  if (!isFiniteNumber(value)) {
    messages.push({
      id: `${id}:not-number`,
      severity: 'error',
      message: `กรอก${label}เป็นตัวเลขก่อนคำนวณ`,
    });
    return { value: 0, messages };
  }

  if (value < 0) {
    messages.push({
      id: `${id}:negative`,
      severity: 'error',
      message: `${label}ติดลบไม่ได้ กรุณาตรวจตัวเลขอีกครั้ง`,
    });
    return { value: 0, messages };
  }

  if (value === 0) {
    messages.push({
      id: `${id}:zero`,
      severity: 'error',
      message: `กรอก${label}มากกว่า 0 ก่อนคำนวณ`,
    });
    return { value: 0, messages };
  }

  if (options?.minWarning && value < options.minWarning) {
    messages.push({
      id: `${id}:small`,
      severity: 'warning',
      message: options.minWarningMessage ?? `${label}ต่ำมาก ควรตรวจหน่วยอีกครั้ง`,
    });
  }

  if (options?.maxWarning && value > options.maxWarning) {
    messages.push({
      id: `${id}:large`,
      severity: 'warning',
      message: options.maxWarningMessage ?? `${label}สูงมาก ควรตรวจหน่วยอีกครั้ง`,
    });
  }

  return { value, messages };
}

export function normalizeNonNegativeNumber(
  value: unknown,
  label: string,
  options?: {
    id?: string;
    maxWarning?: number;
    maxWarningMessage?: string;
  },
): NormalizedNumber {
  const id = options?.id ?? label;
  const messages: CalculatorValidationMessage[] = [];

  if (!isFiniteNumber(value)) {
    messages.push({
      id: `${id}:not-number`,
      severity: 'error',
      message: `กรอก${label}เป็นตัวเลข หากไม่มีให้ใส่ 0`,
    });
    return { value: 0, messages };
  }

  if (value < 0) {
    messages.push({
      id: `${id}:negative`,
      severity: 'error',
      message: `${label}ติดลบไม่ได้ หากไม่มีค่าใช้จ่ายให้ใส่ 0`,
    });
    return { value: 0, messages };
  }

  if (options?.maxWarning && value > options.maxWarning) {
    messages.push({
      id: `${id}:large`,
      severity: 'warning',
      message: options.maxWarningMessage ?? `${label}สูงมาก ควรตรวจตัวเลขอีกครั้ง`,
    });
  }

  return { value, messages };
}

export function normalizePercent(value: unknown, label: string, options?: { id?: string }): NormalizedNumber {
  const id = options?.id ?? label;
  const messages: CalculatorValidationMessage[] = [];

  if (!isFiniteNumber(value)) {
    messages.push({
      id: `${id}:not-number`,
      severity: 'error',
      message: `กรอก${label}เป็นตัวเลข 0-100`,
    });
    return { value: 0, messages };
  }

  if (value < 0) {
    messages.push({
      id: `${id}:negative`,
      severity: 'error',
      message: `${label}ติดลบไม่ได้ ระบบจะคิดเป็น 0`,
    });
    return { value: 0, messages };
  }

  if (value > 100) {
    messages.push({
      id: `${id}:over-100`,
      severity: 'warning',
      message: `${label}เกิน 100% ระบบจะคิดสูงสุดที่ 100%`,
    });
    return { value: 100, messages };
  }

  return { value, messages };
}

export function normalizeThaiAreaUnit(value: unknown, fallback: ThaiAreaUnit = 'rai'): NormalizedUnit<ThaiAreaUnit> {
  if (typeof value === 'string' && thaiAreaUnits.includes(value as ThaiAreaUnit)) {
    return { value: value as ThaiAreaUnit, messages: [] };
  }

  return {
    value: fallback,
    messages: [
      {
        id: 'area-unit:missing',
        severity: 'error',
        message: 'เลือกหน่วยพื้นที่ก่อนคำนวณ',
      },
    ],
  };
}

export function normalizeMixAmountUnit(value: unknown, fallback: MixAmountUnit = 'cc'): NormalizedUnit<MixAmountUnit> {
  if (typeof value === 'string' && mixAmountUnits.includes(value as MixAmountUnit)) {
    return { value: value as MixAmountUnit, messages: [] };
  }

  return {
    value: fallback,
    messages: [
      {
        id: 'mix-unit:missing',
        severity: 'error',
        message: 'เลือกหน่วยยา/สารก่อนคำนวณ',
      },
    ],
  };
}

export function normalizeTankSizeOption(value: unknown, fallback: TankSizeOption = 'custom'): NormalizedUnit<TankSizeOption> {
  if ((typeof value === 'number' || typeof value === 'string') && tankSizeOptions.includes(value as TankSizeOption)) {
    return { value: value as TankSizeOption, messages: [] };
  }

  return {
    value: fallback,
    messages: [
      {
        id: 'tank-size:missing',
        severity: 'warning',
        message: 'ไม่พบขนาดถังที่เลือก ระบบจะใช้ค่าลิตรที่กรอกเอง',
      },
    ],
  };
}

export function validationMessagesToWarnings(messages: CalculatorValidationMessage[]) {
  return Array.from(new Set(messages.map((item) => item.message)));
}

export function hasValidationErrors(messages: CalculatorValidationMessage[]) {
  return messages.some((message) => message.severity === 'error');
}
