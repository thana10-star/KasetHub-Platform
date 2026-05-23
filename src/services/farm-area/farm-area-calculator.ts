import {
  farmAreaDisclaimer,
  farmAreaFixturePlots,
  farmAreaMethodLabels,
  farmAreaStorageKey,
  farmAreaUnitLabels,
} from '@/services/farm-area/farm-area-fixtures';
import type {
  FarmAreaAccuracyLevel,
  FarmAreaCalculationInput,
  FarmAreaCalculationResult,
  FarmAreaShape,
  FarmAreaState,
  FarmAreaUnit,
  FarmPlotRecord,
} from '@/services/farm-area/farm-area.types';

const farmAreaVersion = 1 as const;

const squareMetersPerUnit: Record<FarmAreaUnit, number> = {
  square_meter: 1,
  square_wa: 4,
  ngan: 400,
  rai: 1600,
  hectare: 10000,
  acre: 4046.8564224,
};

const emptyState: FarmAreaState = {
  version: farmAreaVersion,
  plots: farmAreaFixturePlots,
};

const listeners = new Set<() => void>();

const isBrowser = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const notify = () => {
  listeners.forEach((listener) => listener());
};

const asPositiveNumber = (value: unknown) => {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
    return 0;
  }

  return value;
};

const round = (value: number, decimals = 2) => {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
};

const formatNumber = (value: number, decimals = 2) =>
  new Intl.NumberFormat('th-TH', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: value > 0 && value < 1 ? 2 : 0,
  }).format(round(value, decimals));

const createAreaLabels = (squareMeters: number): Record<FarmAreaUnit, string> => ({
  square_meter: `${formatNumber(squareMeters, 2)} ${farmAreaUnitLabels.square_meter.shortLabel}`,
  square_wa: `${formatNumber(convertArea(squareMeters, 'square_meter', 'square_wa'), 2)} ${farmAreaUnitLabels.square_wa.shortLabel}`,
  ngan: `${formatNumber(convertArea(squareMeters, 'square_meter', 'ngan'), 2)} ${farmAreaUnitLabels.ngan.shortLabel}`,
  rai: `${formatNumber(convertArea(squareMeters, 'square_meter', 'rai'), 2)} ${farmAreaUnitLabels.rai.shortLabel}`,
  hectare: `${formatNumber(convertArea(squareMeters, 'square_meter', 'hectare'), 3)} ${farmAreaUnitLabels.hectare.shortLabel}`,
  acre: `${formatNumber(convertArea(squareMeters, 'square_meter', 'acre'), 3)} ${farmAreaUnitLabels.acre.shortLabel}`,
});

const shapeFormulaLabel: Record<FarmAreaShape, string> = {
  rectangle: 'กว้าง x ยาว',
  square: 'ด้าน x ด้าน',
  triangle: 'ฐาน x สูง / 2',
  custom_polygon_mock: 'พื้นที่ประมาณที่กรอกเอง',
};

const dimensionsLabelFor = (input: FarmAreaCalculationInput) => {
  if (input.shape === 'rectangle') {
    return `กว้าง ${formatNumber(asPositiveNumber(input.widthMeters), 2)} ม. x ยาว ${formatNumber(asPositiveNumber(input.lengthMeters), 2)} ม.`;
  }

  if (input.shape === 'square') {
    return `ด้านละ ${formatNumber(asPositiveNumber(input.sideMeters), 2)} ม.`;
  }

  if (input.shape === 'triangle') {
    return `ฐาน ${formatNumber(asPositiveNumber(input.baseMeters), 2)} ม. x สูง ${formatNumber(asPositiveNumber(input.heightMeters), 2)} ม. / 2`;
  }

  return `พื้นที่ประมาณ ${formatNumber(asPositiveNumber(input.estimatedAreaSquareMeters), 2)} ตร.ม.`;
};

const getAccuracyLevel = (input: FarmAreaCalculationInput): FarmAreaAccuracyLevel => {
  if (input.method === 'manual_tape') return 'field_estimate';
  if (input.method === 'gps_walk_future' || input.method === 'map_polygon_future') return 'gps_mock_planned';
  if (input.method === 'satellite_provider_future') return 'official_survey_required';
  return 'rough_estimate';
};

const safeParseState = (raw: string | null): FarmAreaState => {
  if (!raw) return emptyState;

  try {
    const parsed = JSON.parse(raw) as Partial<FarmAreaState>;
    if (parsed.version !== farmAreaVersion || !Array.isArray(parsed.plots)) {
      return emptyState;
    }

    return {
      version: farmAreaVersion,
      plots: parsed.plots.filter((plot): plot is FarmPlotRecord => Boolean(plot?.id && plot.name)),
    };
  } catch {
    return emptyState;
  }
};

const persistState = (state: FarmAreaState) => {
  if (!isBrowser()) return state;
  window.localStorage.setItem(farmAreaStorageKey, JSON.stringify(state));
  notify();
  return state;
};

export function convertArea(value: number, fromUnit: FarmAreaUnit, toUnit: FarmAreaUnit) {
  const squareMeters = value * squareMetersPerUnit[fromUnit];
  return squareMeters / squareMetersPerUnit[toUnit];
}

export function calculateFarmArea(input: FarmAreaCalculationInput): FarmAreaCalculationResult {
  const warnings: string[] = [];
  let squareMeters = 0;

  if (input.shape === 'rectangle') {
    const width = asPositiveNumber(input.widthMeters);
    const length = asPositiveNumber(input.lengthMeters);
    squareMeters = width * length;
    if (!width || !length) warnings.push('กรอกความกว้างและความยาวเป็นเมตรก่อนคำนวณ');
  }

  if (input.shape === 'square') {
    const side = asPositiveNumber(input.sideMeters);
    squareMeters = side * side;
    if (!side) warnings.push('กรอกความยาวด้านเป็นเมตรก่อนคำนวณ');
  }

  if (input.shape === 'triangle') {
    const base = asPositiveNumber(input.baseMeters);
    const height = asPositiveNumber(input.heightMeters);
    squareMeters = (base * height) / 2;
    if (!base || !height) warnings.push('กรอกฐานและความสูงเป็นเมตรก่อนคำนวณ');
  }

  if (input.shape === 'custom_polygon_mock') {
    squareMeters = asPositiveNumber(input.estimatedAreaSquareMeters);
    warnings.push('รูปหลายเหลี่ยมยังเป็น mock ไม่มีการวาดแผนที่หรือ GPS จริง');
    if (!squareMeters) warnings.push('กรอกพื้นที่ประมาณเป็นตารางเมตรก่อนบันทึก');
  }

  if (squareMeters > 0 && squareMeters < 4) {
    warnings.push('พื้นที่เล็กมาก กรุณาตรวจหน่วยวัดอีกครั้ง');
  }

  if (squareMeters > 1600000) {
    warnings.push('พื้นที่ใหญ่มาก ควรตรวจตัวเลขและใช้การรังวัดที่ดินทางการ');
  }

  const accuracyLevel = getAccuracyLevel(input);

  return {
    input,
    isValid: squareMeters > 0,
    squareMeters,
    squareWa: convertArea(squareMeters, 'square_meter', 'square_wa'),
    ngan: convertArea(squareMeters, 'square_meter', 'ngan'),
    rai: convertArea(squareMeters, 'square_meter', 'rai'),
    hectare: convertArea(squareMeters, 'square_meter', 'hectare'),
    acre: convertArea(squareMeters, 'square_meter', 'acre'),
    formulaLabel: shapeFormulaLabel[input.shape],
    areaLabels: createAreaLabels(squareMeters),
    accuracyLevel,
    plannerStatus: 'ready_for_manual_estimate',
    warnings,
    disclaimer: farmAreaDisclaimer,
  };
}

export function createFarmPlotRecord(
  input: FarmAreaCalculationInput,
  result: FarmAreaCalculationResult,
  name: string,
): FarmPlotRecord {
  const createdAt = new Date().toISOString();

  return {
    id: `farm-area-${Date.now()}`,
    name: name.trim() || `แปลงประมาณการ ${formatNumber(result.rai, 2)} ไร่`,
    shape: input.shape,
    method: input.method,
    accuracyLevel: result.accuracyLevel,
    plannerStatus: result.plannerStatus,
    areaSquareMeters: result.squareMeters,
    areaLabels: result.areaLabels,
    dimensionsLabel: dimensionsLabelFor(input),
    createdAt,
    createdAtLabel: 'บันทึกในเครื่องนี้',
    disclaimer: result.disclaimer,
  };
}

export function getFarmAreaState(): FarmAreaState {
  if (!isBrowser()) return emptyState;
  return safeParseState(window.localStorage.getItem(farmAreaStorageKey));
}

export function saveFarmPlot(input: FarmAreaCalculationInput, name: string): FarmAreaState {
  const result = calculateFarmArea(input);
  if (!result.isValid) return getFarmAreaState();

  const state = getFarmAreaState();
  const record = createFarmPlotRecord(input, result, name);
  return persistState({
    version: farmAreaVersion,
    plots: [record, ...state.plots],
  });
}

export function removeFarmPlot(plotId: string): FarmAreaState {
  const state = getFarmAreaState();
  return persistState({
    version: farmAreaVersion,
    plots: state.plots.filter((plot) => plot.id !== plotId),
  });
}

export function clearFarmAreaDemo(): FarmAreaState {
  const nextState: FarmAreaState = {
    version: farmAreaVersion,
    plots: [],
  };
  return persistState(nextState);
}

export function subscribeFarmArea(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getFarmAreaMethodLabel(method: FarmAreaCalculationInput['method']) {
  return farmAreaMethodLabels[method];
}
