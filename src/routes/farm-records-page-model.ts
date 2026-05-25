import {
  cropCycleStatusIds,
  farmActivityTypeIds,
  farmExpenseCategoryIds,
  farmIncomeCategoryIds,
} from '@/services/farm-records/farm-records-config';
import {
  createFarmRecordsService,
  createMemoryFarmRecordsStorage,
  isValidFarmFinanceCategoryForDirection,
} from '@/services/farm-records/farm-records-service';
import type {
  CropCycle,
  CropCycleStatus,
  FarmActivityRecord,
  FarmActivityType,
  FarmFinanceCategory,
  FarmFinanceDirection,
  FarmFinanceEntry,
  FarmHarvestQuantityUnit,
  FarmHarvestRecord,
  FarmLedgerSummary,
  FarmLedgerSummaryFilters,
  FarmPlot,
  FarmRecordsState,
} from '@/services/farm-records/farm-records.types';

export type FarmRecordsPageFilters = {
  farmPlotId: string;
  cropCycleId: string;
  startDate: string;
  endDate: string;
  activityType: '' | FarmActivityType;
  financeDirection: '' | FarmFinanceDirection;
  financeCategory: '' | FarmFinanceCategory;
};

export type ActivityFormValues = {
  farmPlotId: string;
  cropCycleId: string;
  activityDate: string;
  activityType: FarmActivityType;
  title: string;
  description: string;
  inputName: string;
  inputQuantity: string;
  inputUnit: string;
  tags: string;
};

export type FinanceFormValues = {
  direction: FarmFinanceDirection;
  category: FarmFinanceCategory;
  entryDate: string;
  title: string;
  amount: string;
  farmPlotId: string;
  cropCycleId: string;
  quantity: string;
  unit: string;
  buyerOrVendor: string;
  note: string;
};

export type FarmPlotFormValues = {
  name: string;
  areaRai: string;
  province: string;
  district: string;
  subdistrict: string;
  notes: string;
};

export type CropCycleFormValues = {
  farmPlotId: string;
  cropName: string;
  variety: string;
  seasonLabel: string;
  startDate: string;
  expectedHarvestDate: string;
  status: CropCycleStatus;
};

export type HarvestFormValues = {
  farmPlotId: string;
  cropCycleId: string;
  harvestDate: string;
  cropName: string;
  quantity: string;
  quantityUnit: FarmHarvestQuantityUnit;
  grade: string;
  buyer: string;
  salePricePerKg: string;
  note: string;
};

export type FarmRecordsViewModel = {
  counts: {
    plots: number;
    activeCropCycles: number;
    activityRecords: number;
    financeEntries: number;
    harvestRecords: number;
  };
  plots: FarmPlot[];
  cropCycles: CropCycle[];
  activityRecords: FarmActivityRecord[];
  financeEntries: FarmFinanceEntry[];
  harvestRecords: FarmHarvestRecord[];
  summary: FarmLedgerSummary;
  recentTimeline: FarmRecordsTimelineItem[];
  hasActiveFilters: boolean;
  activeCycleCountByPlot: Record<string, number>;
};

export type FarmRecordsTimelineItem = {
  id: string;
  kind: 'activity' | 'income' | 'expense';
  date: string;
  title: string;
  farmPlotId?: string;
  cropCycleId?: string;
  activityType?: FarmActivityType;
  amount?: number;
  category?: FarmFinanceCategory;
};

export type FormValidationResult = {
  isValid: boolean;
  errors: string[];
};

export const farmRecordsDeleteConfirmationMessage =
  'ลบรายการนี้หรือไม่? ข้อมูลนี้จะถูกลบจากเครื่องนี้เท่านั้น ยังไม่มีข้อมูลบนคลาวด์ให้ลบเพราะยังไม่เปิดซิงก์ และจะกู้คืนไม่ได้หากยังไม่มี export/backup ในอนาคต';

export function createDefaultFarmRecordsFilters(): FarmRecordsPageFilters {
  return {
    farmPlotId: '',
    cropCycleId: '',
    startDate: '',
    endDate: '',
    activityType: '',
    financeDirection: '',
    financeCategory: '',
  };
}

export function createInitialActivityForm(today: string): ActivityFormValues {
  return {
    farmPlotId: '',
    cropCycleId: '',
    activityDate: today,
    activityType: 'planting',
    title: '',
    description: '',
    inputName: '',
    inputQuantity: '',
    inputUnit: '',
    tags: '',
  };
}

export function createInitialFinanceForm(today: string): FinanceFormValues {
  return {
    direction: 'expense',
    category: 'fertilizer',
    entryDate: today,
    title: '',
    amount: '',
    farmPlotId: '',
    cropCycleId: '',
    quantity: '',
    unit: '',
    buyerOrVendor: '',
    note: '',
  };
}

export function createInitialFarmPlotForm(): FarmPlotFormValues {
  return {
    name: '',
    areaRai: '',
    province: '',
    district: '',
    subdistrict: '',
    notes: '',
  };
}

export function createInitialCropCycleForm(today: string): CropCycleFormValues {
  return {
    farmPlotId: '',
    cropName: '',
    variety: '',
    seasonLabel: '',
    startDate: today,
    expectedHarvestDate: '',
    status: 'active',
  };
}

export function createInitialHarvestForm(today: string): HarvestFormValues {
  return {
    farmPlotId: '',
    cropCycleId: '',
    harvestDate: today,
    cropName: '',
    quantity: '',
    quantityUnit: 'kg',
    grade: '',
    buyer: '',
    salePricePerKg: '',
    note: '',
  };
}

export function activityFormFromRecord(record: FarmActivityRecord): ActivityFormValues {
  return {
    farmPlotId: record.farmPlotId,
    cropCycleId: record.cropCycleId ?? '',
    activityDate: record.activityDate,
    activityType: record.activityType,
    title: record.title,
    description: record.description ?? '',
    inputName: record.inputName ?? '',
    inputQuantity: record.inputQuantity === undefined ? '' : String(record.inputQuantity),
    inputUnit: record.inputUnit ?? '',
    tags: record.tags?.join(', ') ?? '',
  };
}

export function financeFormFromEntry(entry: FarmFinanceEntry): FinanceFormValues {
  return {
    direction: entry.direction,
    category: entry.category,
    entryDate: entry.entryDate,
    title: entry.title,
    amount: String(entry.amount),
    farmPlotId: entry.farmPlotId ?? '',
    cropCycleId: entry.cropCycleId ?? '',
    quantity: entry.quantity === undefined ? '' : String(entry.quantity),
    unit: entry.unit ?? '',
    buyerOrVendor: entry.buyerOrVendor ?? '',
    note: entry.note ?? '',
  };
}

function hasValidDate(value: string) {
  return Boolean(value.trim()) && !Number.isNaN(Date.parse(value));
}

function normalizeOptional(value: string) {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function parseOptionalNonNegativeNumber(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return undefined;

  const parsed = Number(trimmed);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

export function parseCommaTags(value: string) {
  const tags = value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  return tags.length > 0 ? tags : undefined;
}

export function toFarmLedgerSummaryFilters(filters: FarmRecordsPageFilters): FarmLedgerSummaryFilters {
  return {
    farmPlotId: normalizeOptional(filters.farmPlotId),
    cropCycleId: normalizeOptional(filters.cropCycleId),
    startDate: normalizeOptional(filters.startDate),
    endDate: normalizeOptional(filters.endDate),
    activityType: filters.activityType || undefined,
    direction: filters.financeDirection || undefined,
    category: filters.financeCategory || undefined,
  };
}

function isWithinDateRange(dateValue: string, filters: FarmRecordsPageFilters) {
  const dateTime = Date.parse(dateValue);
  if (Number.isNaN(dateTime)) return false;
  if (filters.startDate && dateTime < Date.parse(filters.startDate)) return false;
  if (filters.endDate && dateTime > Date.parse(filters.endDate)) return false;
  return true;
}

function matchesActivityFilters(record: FarmActivityRecord, filters: FarmRecordsPageFilters) {
  if (filters.farmPlotId && record.farmPlotId !== filters.farmPlotId) return false;
  if (filters.cropCycleId && record.cropCycleId !== filters.cropCycleId) return false;
  if (filters.activityType && record.activityType !== filters.activityType) return false;
  return isWithinDateRange(record.activityDate, filters);
}

function matchesFinanceFilters(entry: FarmFinanceEntry, filters: FarmRecordsPageFilters) {
  if (filters.farmPlotId && entry.farmPlotId !== filters.farmPlotId) return false;
  if (filters.cropCycleId && entry.cropCycleId !== filters.cropCycleId) return false;
  if (filters.financeDirection && entry.direction !== filters.financeDirection) return false;
  if (filters.financeCategory && entry.category !== filters.financeCategory) return false;
  return isWithinDateRange(entry.entryDate, filters);
}

function matchesHarvestFilters(record: FarmHarvestRecord, filters: FarmRecordsPageFilters) {
  if (filters.farmPlotId && record.farmPlotId !== filters.farmPlotId) return false;
  if (filters.cropCycleId && record.cropCycleId !== filters.cropCycleId) return false;
  return isWithinDateRange(record.harvestDate, filters);
}

function matchesCropCycleFilters(cycle: CropCycle, filters: FarmRecordsPageFilters) {
  if (filters.farmPlotId && cycle.farmPlotId !== filters.farmPlotId) return false;
  if (filters.cropCycleId && cycle.id !== filters.cropCycleId) return false;
  return true;
}

function matchesPlotFilters(plot: FarmPlot, filters: FarmRecordsPageFilters) {
  return filters.farmPlotId ? plot.id === filters.farmPlotId : true;
}

function sortByDateDesc<T>(items: T[], getDate: (item: T) => string) {
  return [...items].sort((a, b) => Date.parse(getDate(b)) - Date.parse(getDate(a)));
}

export function buildRecentFarmTimeline(state: FarmRecordsState, limit = 8): FarmRecordsTimelineItem[] {
  const activityItems: FarmRecordsTimelineItem[] = state.farmActivityRecords.map((record) => ({
    id: `activity-${record.id}`,
    kind: 'activity',
    date: record.activityDate,
    title: record.title,
    farmPlotId: record.farmPlotId,
    cropCycleId: record.cropCycleId,
    activityType: record.activityType,
  }));

  const financeItems: FarmRecordsTimelineItem[] = state.farmFinanceEntries.map((entry) => ({
    id: `finance-${entry.id}`,
    kind: entry.direction,
    date: entry.entryDate,
    title: entry.title,
    farmPlotId: entry.farmPlotId,
    cropCycleId: entry.cropCycleId,
    amount: entry.amount,
    category: entry.category,
  }));

  return [...activityItems, ...financeItems]
    .sort((a, b) => {
      const dateDifference = Date.parse(b.date) - Date.parse(a.date);
      return dateDifference === 0 ? b.id.localeCompare(a.id) : dateDifference;
    })
    .slice(0, limit);
}

export function buildFarmRecordsViewModel(state: FarmRecordsState, filters: FarmRecordsPageFilters): FarmRecordsViewModel {
  const service = createFarmRecordsService(createMemoryFarmRecordsStorage(state));
  const hasActiveFilters = Object.values(filters).some((value) => Boolean(value));
  const activeCycleCountByPlot = state.cropCycles.reduce<Record<string, number>>((counts, cycle) => {
    if (cycle.status === 'active') {
      counts[cycle.farmPlotId] = (counts[cycle.farmPlotId] ?? 0) + 1;
    }

    return counts;
  }, {});

  return {
    counts: {
      plots: state.farmPlots.filter((plot) => !plot.isArchived).length,
      activeCropCycles: state.cropCycles.filter((cycle) => cycle.status === 'active').length,
      activityRecords: state.farmActivityRecords.length,
      financeEntries: state.farmFinanceEntries.length,
      harvestRecords: state.farmHarvestRecords.length,
    },
    plots: state.farmPlots.filter((plot) => matchesPlotFilters(plot, filters)),
    cropCycles: sortByDateDesc(state.cropCycles.filter((cycle) => matchesCropCycleFilters(cycle, filters)), (cycle) => cycle.startDate),
    activityRecords: sortByDateDesc(
      state.farmActivityRecords.filter((record) => matchesActivityFilters(record, filters)),
      (record) => record.activityDate,
    ),
    financeEntries: sortByDateDesc(
      state.farmFinanceEntries.filter((entry) => matchesFinanceFilters(entry, filters)),
      (entry) => entry.entryDate,
    ),
    harvestRecords: sortByDateDesc(
      state.farmHarvestRecords.filter((record) => matchesHarvestFilters(record, filters)),
      (record) => record.harvestDate,
    ),
    summary: service.computeFarmLedgerSummary(toFarmLedgerSummaryFilters(filters)),
    recentTimeline: buildRecentFarmTimeline(state),
    hasActiveFilters,
    activeCycleCountByPlot,
  };
}

export function validateActivityForm(values: ActivityFormValues, availablePlots: FarmPlot[]): FormValidationResult {
  const errors: string[] = [];

  if (!values.farmPlotId || !availablePlots.some((plot) => plot.id === values.farmPlotId)) {
    errors.push('เลือกแปลงปลูกก่อนบันทึกกิจกรรม');
  }

  if (!hasValidDate(values.activityDate)) {
    errors.push('ใส่วันที่กิจกรรมให้ถูกต้อง');
  }

  if (!farmActivityTypeIds.includes(values.activityType)) {
    errors.push('เลือกประเภทกิจกรรมให้ถูกต้อง');
  }

  if (!values.title.trim()) {
    errors.push('ใส่ชื่อกิจกรรม');
  }

  if (values.inputQuantity.trim() && parseOptionalNonNegativeNumber(values.inputQuantity) === undefined) {
    errors.push('ปริมาณปัจจัยการผลิตต้องเป็นตัวเลขไม่ติดลบ');
  }

  return { isValid: errors.length === 0, errors };
}

export function validateFinanceForm(values: FinanceFormValues): FormValidationResult {
  const errors: string[] = [];
  const trimmedAmount = values.amount.trim();
  const amount = Number(trimmedAmount);

  if (!hasValidDate(values.entryDate)) {
    errors.push('ใส่วันที่รายการให้ถูกต้อง');
  }

  if (!values.title.trim()) {
    errors.push('ใส่ชื่อรายการ');
  }

  if (!trimmedAmount || !Number.isFinite(amount) || amount < 0) {
    errors.push('จำนวนเงินต้องเป็นตัวเลขไม่ติดลบ');
  }

  if (!isValidFarmFinanceCategoryForDirection(values.direction, values.category)) {
    errors.push('เลือกหมวดหมู่ให้ตรงกับรายรับหรือรายจ่าย');
  }

  if (values.quantity.trim() && parseOptionalNonNegativeNumber(values.quantity) === undefined) {
    errors.push('จำนวน/ปริมาณต้องเป็นตัวเลขไม่ติดลบ');
  }

  return { isValid: errors.length === 0, errors };
}

export function validateFarmPlotForm(values: FarmPlotFormValues): FormValidationResult {
  const errors: string[] = [];

  if (!values.name.trim()) {
    errors.push('ใส่ชื่อแปลงปลูก');
  }

  if (values.areaRai.trim() && parseOptionalNonNegativeNumber(values.areaRai) === undefined) {
    errors.push('พื้นที่ไร่ต้องเป็นตัวเลขไม่ติดลบ');
  }

  return { isValid: errors.length === 0, errors };
}

export function validateCropCycleForm(values: CropCycleFormValues, availablePlots: FarmPlot[]): FormValidationResult {
  const errors: string[] = [];

  if (!values.farmPlotId || !availablePlots.some((plot) => plot.id === values.farmPlotId)) {
    errors.push('เลือกแปลงปลูกของรอบปลูก');
  }

  if (!values.cropName.trim()) {
    errors.push('ใส่ชื่อพืช');
  }

  if (!hasValidDate(values.startDate)) {
    errors.push('ใส่วันที่เริ่มรอบปลูกให้ถูกต้อง');
  }

  if (values.expectedHarvestDate.trim() && !hasValidDate(values.expectedHarvestDate)) {
    errors.push('วันที่คาดว่าจะเก็บเกี่ยวไม่ถูกต้อง');
  }

  if (!cropCycleStatusIds.includes(values.status)) {
    errors.push('เลือกสถานะรอบปลูกให้ถูกต้อง');
  }

  return { isValid: errors.length === 0, errors };
}

export function validateHarvestForm(values: HarvestFormValues, availablePlots: FarmPlot[]): FormValidationResult {
  const errors: string[] = [];
  const trimmedQuantity = values.quantity.trim();
  const quantity = Number(trimmedQuantity);

  if (!values.farmPlotId || !availablePlots.some((plot) => plot.id === values.farmPlotId)) {
    errors.push('กรุณาเลือกแปลง');
  }

  if (!hasValidDate(values.harvestDate)) {
    errors.push('กรุณาเลือกวันที่เก็บเกี่ยว');
  }

  if (!trimmedQuantity || !Number.isFinite(quantity) || quantity < 0) {
    errors.push(trimmedQuantity ? 'ปริมาณผลผลิตต้องเป็นตัวเลข 0 หรือมากกว่า' : 'กรุณากรอกปริมาณผลผลิต');
  }

  if (values.salePricePerKg.trim() && parseOptionalNonNegativeNumber(values.salePricePerKg) === undefined) {
    errors.push('ราคาขายต่อกก. ต้องเป็นตัวเลข 0 หรือมากกว่า');
  }

  return { isValid: errors.length === 0, errors };
}

export function getDefaultFinanceCategory(direction: FarmFinanceDirection): FarmFinanceCategory {
  return direction === 'income' ? farmIncomeCategoryIds[0] : farmExpenseCategoryIds[0];
}

export function changeFinanceFormDirection(values: FinanceFormValues, direction: FarmFinanceDirection): FinanceFormValues {
  return {
    ...values,
    direction,
    category: isValidFarmFinanceCategoryForDirection(direction, values.category) ? values.category : getDefaultFinanceCategory(direction),
  };
}
