import {
  cropCycleStatusIds,
  farmActivityTypeIds,
  farmExpenseCategoryIds,
  farmHarvestQuantityUnitIds,
  farmIncomeCategoryIds,
} from '@/services/farm-records/farm-records-config';
import { createDemoFarmRecordsState } from '@/services/farm-records/farm-records-fixtures';
import type {
  CropCycle,
  CropCycleInput,
  CropCyclePatch,
  CropCycleStatus,
  FarmActivityRecord,
  FarmActivityRecordFilters,
  FarmActivityRecordInput,
  FarmActivityRecordPatch,
  FarmActivityType,
  FarmExpenseCategory,
  FarmFinanceCategory,
  FarmFinanceDirection,
  FarmFinanceEntry,
  FarmFinanceEntryFilters,
  FarmFinanceEntryInput,
  FarmFinanceEntryPatch,
  FarmHarvestQuantityUnit,
  FarmHarvestRecord,
  FarmHarvestRecordFilters,
  FarmHarvestRecordInput,
  FarmHarvestRecordPatch,
  FarmImageRef,
  FarmIncomeCategory,
  FarmLedgerSummary,
  FarmLedgerSummaryFilters,
  FarmPlot,
  FarmPlotInput,
  FarmPlotListOptions,
  FarmPlotPatch,
  FarmRecordsState,
} from '@/services/farm-records/farm-records.types';

export const farmRecordsStorageKey = 'kasethub.farmRecords.v1';
export const farmRecordsChangedEvent = 'kasethub:farm-records-changed';

const currentVersion = 1 as const;

export type FarmRecordsStorageAdapter = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem?: (key: string) => void;
};

function now() {
  return new Date().toISOString();
}

function canUseStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage);
}

function getBrowserStorage(): FarmRecordsStorageAdapter | undefined {
  return canUseStorage() ? window.localStorage : undefined;
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

function createId(prefix: string) {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function createEmptyFarmRecordsState(): FarmRecordsState {
  return {
    version: currentVersion,
    farmPlots: [],
    cropCycles: [],
    farmActivityRecords: [],
    farmFinanceEntries: [],
    farmHarvestRecords: [],
    migrations: [],
    updatedAt: now(),
  };
}

function normalizeString(value: unknown, fallback = '') {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : fallback;
}

function normalizeOptionalString(value: unknown) {
  const normalized = normalizeString(value);
  return normalized || undefined;
}

function normalizeNonNegativeNumber(value: unknown): number | undefined {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
    return undefined;
  }

  return value;
}

function normalizeAmount(value: unknown) {
  return normalizeNonNegativeNumber(value) ?? 0;
}

function normalizeDateString(value: unknown, fallback: string) {
  if (typeof value !== 'string' || !value.trim()) {
    return fallback;
  }

  return Number.isNaN(Date.parse(value)) ? fallback : value.trim();
}

function hasValidDateString(value: unknown) {
  return typeof value === 'string' && value.trim().length > 0 && !Number.isNaN(Date.parse(value));
}

function isFarmActivityType(value: unknown): value is FarmActivityType {
  return typeof value === 'string' && farmActivityTypeIds.includes(value as FarmActivityType);
}

function isCropCycleStatus(value: unknown): value is CropCycleStatus {
  return typeof value === 'string' && cropCycleStatusIds.includes(value as CropCycleStatus);
}

function isExpenseCategory(value: unknown): value is FarmExpenseCategory {
  return typeof value === 'string' && farmExpenseCategoryIds.includes(value as FarmExpenseCategory);
}

function isIncomeCategory(value: unknown): value is FarmIncomeCategory {
  return typeof value === 'string' && farmIncomeCategoryIds.includes(value as FarmIncomeCategory);
}

function isFarmHarvestQuantityUnit(value: unknown): value is FarmHarvestQuantityUnit {
  return typeof value === 'string' && farmHarvestQuantityUnitIds.includes(value as FarmHarvestQuantityUnit);
}

function normalizeTags(value: unknown) {
  if (!Array.isArray(value)) return undefined;

  const tags = value.map((item) => normalizeOptionalString(item)).filter((item): item is string => Boolean(item));
  return tags.length > 0 ? tags : undefined;
}

function normalizeImageRef(input: unknown): FarmImageRef | undefined {
  if (!isObject(input)) return undefined;

  const timestamp = now();
  const localUri = normalizeOptionalString(input.localUri);
  const storagePath = normalizeOptionalString(input.storagePath);
  const filename = normalizeOptionalString(input.filename);
  const caption = normalizeOptionalString(input.caption);
  const safeLocalUri = localUri?.startsWith('data:') ? undefined : localUri;

  if (!safeLocalUri && !storagePath && !filename && !caption && !normalizeOptionalString(input.id)) {
    return undefined;
  }

  return {
    id: normalizeOptionalString(input.id) ?? createId('farm-image-ref'),
    localUri: safeLocalUri,
    storagePath,
    filename,
    caption,
    createdAt: normalizeDateString(input.createdAt, timestamp),
  };
}

function normalizeImageRefs(input: unknown) {
  if (!Array.isArray(input)) return undefined;

  const imageRefs = input.map(normalizeImageRef).filter((item): item is FarmImageRef => Boolean(item));
  return imageRefs.length > 0 ? imageRefs : undefined;
}

function normalizeFarmPlot(input: unknown): FarmPlot | undefined {
  if (!isObject(input)) return undefined;

  const timestamp = now();
  const name = normalizeOptionalString(input.name);
  if (!name) return undefined;

  return {
    id: normalizeOptionalString(input.id) ?? createId('farm-plot'),
    name,
    displayCode: normalizeOptionalString(input.displayCode),
    areaRai: normalizeNonNegativeNumber(input.areaRai),
    areaNgan: normalizeNonNegativeNumber(input.areaNgan),
    areaSquareWah: normalizeNonNegativeNumber(input.areaSquareWah),
    province: normalizeOptionalString(input.province),
    district: normalizeOptionalString(input.district),
    subdistrict: normalizeOptionalString(input.subdistrict),
    coarseLocationLabel: normalizeOptionalString(input.coarseLocationLabel),
    notes: normalizeOptionalString(input.notes),
    isArchived: Boolean(input.isArchived),
    createdAt: normalizeDateString(input.createdAt, timestamp),
    updatedAt: normalizeDateString(input.updatedAt, timestamp),
  };
}

function normalizeCropCycle(input: unknown): CropCycle | undefined {
  if (!isObject(input)) return undefined;

  const timestamp = now();
  const farmPlotId = normalizeOptionalString(input.farmPlotId);
  const cropName = normalizeOptionalString(input.cropName);
  if (!farmPlotId || !cropName) return undefined;

  return {
    id: normalizeOptionalString(input.id) ?? createId('crop-cycle'),
    farmPlotId,
    cropName,
    variety: normalizeOptionalString(input.variety),
    seasonLabel: normalizeOptionalString(input.seasonLabel),
    startDate: normalizeDateString(input.startDate, timestamp.slice(0, 10)),
    expectedHarvestDate: input.expectedHarvestDate ? normalizeDateString(input.expectedHarvestDate, timestamp.slice(0, 10)) : undefined,
    actualHarvestDate: input.actualHarvestDate ? normalizeDateString(input.actualHarvestDate, timestamp.slice(0, 10)) : undefined,
    status: isCropCycleStatus(input.status) ? input.status : 'planned',
    areaRai: normalizeNonNegativeNumber(input.areaRai),
    notes: normalizeOptionalString(input.notes),
    createdAt: normalizeDateString(input.createdAt, timestamp),
    updatedAt: normalizeDateString(input.updatedAt, timestamp),
  };
}

function normalizeActivityRecord(input: unknown): FarmActivityRecord | undefined {
  if (!isObject(input)) return undefined;

  const timestamp = now();
  const farmPlotId = normalizeOptionalString(input.farmPlotId);
  const title = normalizeOptionalString(input.title);
  if (!farmPlotId || !title) return undefined;

  return {
    id: normalizeOptionalString(input.id) ?? createId('farm-activity'),
    farmPlotId,
    cropCycleId: normalizeOptionalString(input.cropCycleId),
    activityDate: normalizeDateString(input.activityDate, timestamp.slice(0, 10)),
    activityType: isFarmActivityType(input.activityType) ? input.activityType : 'other',
    title,
    description: normalizeOptionalString(input.description),
    inputName: normalizeOptionalString(input.inputName),
    inputQuantity: normalizeNonNegativeNumber(input.inputQuantity),
    inputUnit: normalizeOptionalString(input.inputUnit),
    laborCount: normalizeNonNegativeNumber(input.laborCount),
    laborHours: normalizeNonNegativeNumber(input.laborHours),
    machineName: normalizeOptionalString(input.machineName),
    weatherSummary: normalizeOptionalString(input.weatherSummary),
    imageRefs: normalizeImageRefs(input.imageRefs),
    tags: normalizeTags(input.tags),
    createdAt: normalizeDateString(input.createdAt, timestamp),
    updatedAt: normalizeDateString(input.updatedAt, timestamp),
  };
}

function normalizeFinanceDirection(value: unknown): FarmFinanceDirection {
  return value === 'income' ? 'income' : 'expense';
}

function normalizeFinanceCategory(direction: FarmFinanceDirection, value: unknown): FarmFinanceCategory {
  if (direction === 'income') {
    return isIncomeCategory(value) ? value : 'other_income';
  }

  return isExpenseCategory(value) ? value : 'other_expense';
}

function normalizeFinanceEntry(input: unknown): FarmFinanceEntry | undefined {
  if (!isObject(input)) return undefined;

  const timestamp = now();
  const title = normalizeOptionalString(input.title);
  if (!title) return undefined;

  const direction = normalizeFinanceDirection(input.direction);

  return {
    id: normalizeOptionalString(input.id) ?? createId('farm-finance'),
    farmPlotId: normalizeOptionalString(input.farmPlotId),
    cropCycleId: normalizeOptionalString(input.cropCycleId),
    relatedActivityRecordId: normalizeOptionalString(input.relatedActivityRecordId),
    entryDate: normalizeDateString(input.entryDate, timestamp.slice(0, 10)),
    direction,
    category: normalizeFinanceCategory(direction, input.category),
    title,
    amount: normalizeAmount(input.amount),
    currency: normalizeOptionalString(input.currency) ?? 'THB',
    quantity: normalizeNonNegativeNumber(input.quantity),
    unit: normalizeOptionalString(input.unit),
    buyerOrVendor: normalizeOptionalString(input.buyerOrVendor),
    paymentMethod: normalizeOptionalString(input.paymentMethod),
    note: normalizeOptionalString(input.note),
    receiptImageRefs: normalizeImageRefs(input.receiptImageRefs),
    createdAt: normalizeDateString(input.createdAt, timestamp),
    updatedAt: normalizeDateString(input.updatedAt, timestamp),
  };
}

export function normalizeHarvestQuantityToKg(quantity: number, unit: FarmHarvestQuantityUnit): number | undefined {
  if (!Number.isFinite(quantity) || quantity < 0) return undefined;
  if (unit === 'kg') return quantity;
  if (unit === 'ton') return quantity * 1000;
  return undefined;
}

function normalizeHarvestRecord(input: unknown): FarmHarvestRecord | undefined {
  if (!isObject(input)) return undefined;

  const timestamp = now();
  const farmPlotId = normalizeOptionalString(input.farmPlotId);
  const quantity = normalizeNonNegativeNumber(input.quantity);
  if (!farmPlotId || quantity === undefined || !hasValidDateString(input.harvestDate)) return undefined;

  const quantityUnit = isFarmHarvestQuantityUnit(input.quantityUnit) ? input.quantityUnit : 'other';

  return {
    id: normalizeOptionalString(input.id) ?? createId('farm-harvest'),
    farmPlotId,
    cropCycleId: normalizeOptionalString(input.cropCycleId),
    harvestDate: normalizeDateString(input.harvestDate, timestamp.slice(0, 10)),
    cropName: normalizeOptionalString(input.cropName),
    quantity,
    quantityUnit,
    normalizedQuantityKg: normalizeHarvestQuantityToKg(quantity, quantityUnit),
    grade: normalizeOptionalString(input.grade),
    buyer: normalizeOptionalString(input.buyer),
    salePricePerKg: normalizeNonNegativeNumber(input.salePricePerKg),
    grossIncome: normalizeNonNegativeNumber(input.grossIncome),
    note: normalizeOptionalString(input.note),
    createdAt: normalizeDateString(input.createdAt, timestamp),
    updatedAt: normalizeDateString(input.updatedAt, timestamp),
  };
}

export function migrateFarmRecordsState(input: unknown): FarmRecordsState {
  if (!isObject(input)) {
    return createDemoFarmRecordsState();
  }

  const farmPlots = Array.isArray(input.farmPlots)
    ? input.farmPlots.map(normalizeFarmPlot).filter((plot): plot is FarmPlot => Boolean(plot))
    : [];
  const cropCycles = Array.isArray(input.cropCycles)
    ? input.cropCycles.map(normalizeCropCycle).filter((cycle): cycle is CropCycle => Boolean(cycle))
    : [];
  const farmActivityRecords = Array.isArray(input.farmActivityRecords)
    ? input.farmActivityRecords.map(normalizeActivityRecord).filter((record): record is FarmActivityRecord => Boolean(record))
    : [];
  const farmFinanceEntries = Array.isArray(input.farmFinanceEntries)
    ? input.farmFinanceEntries.map(normalizeFinanceEntry).filter((entry): entry is FarmFinanceEntry => Boolean(entry))
    : [];
  const farmHarvestRecords = Array.isArray(input.farmHarvestRecords)
    ? input.farmHarvestRecords.map(normalizeHarvestRecord).filter((record): record is FarmHarvestRecord => Boolean(record))
    : [];

  return {
    version: currentVersion,
    farmPlots,
    cropCycles,
    farmActivityRecords,
    farmFinanceEntries,
    farmHarvestRecords,
    migrations: Array.isArray(input.migrations) ? input.migrations.filter((item): item is string => typeof item === 'string') : [],
    updatedAt: normalizeDateString(input.updatedAt, now()),
  };
}

function notifyFarmRecordsChanged() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(farmRecordsChangedEvent));
  }
}

function readState(storage = getBrowserStorage()): FarmRecordsState {
  if (!storage) {
    return createDemoFarmRecordsState();
  }

  return migrateFarmRecordsState(safeParseJson(storage.getItem(farmRecordsStorageKey)));
}

function persistState(state: FarmRecordsState, storage = getBrowserStorage()): FarmRecordsState {
  const nextState: FarmRecordsState = {
    ...state,
    version: currentVersion,
    updatedAt: now(),
  };

  if (!storage) {
    return nextState;
  }

  try {
    storage.setItem(farmRecordsStorageKey, JSON.stringify(nextState));
    notifyFarmRecordsChanged();
    return nextState;
  } catch {
    return state;
  }
}

function mutateState<T>(
  storage: FarmRecordsStorageAdapter | undefined,
  updater: (state: FarmRecordsState) => { state: FarmRecordsState; result: T },
) {
  const update = updater(readState(storage));
  const state = persistState(update.state, storage);

  return {
    result: update.result,
    state,
  };
}

function getDateMs(value: string) {
  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function isWithinDateRange(dateValue: string, startDate?: string, endDate?: string) {
  const time = getDateMs(dateValue);
  if (startDate && time < getDateMs(startDate)) return false;
  if (endDate && time > getDateMs(endDate)) return false;
  return true;
}

function filterActivityRecords(records: FarmActivityRecord[], filters: FarmActivityRecordFilters = {}) {
  return records.filter((record) => {
    if (filters.farmPlotId && record.farmPlotId !== filters.farmPlotId) return false;
    if (filters.cropCycleId && record.cropCycleId !== filters.cropCycleId) return false;
    if (filters.activityType && record.activityType !== filters.activityType) return false;
    return isWithinDateRange(record.activityDate, filters.startDate, filters.endDate);
  });
}

function filterFinanceEntries(records: FarmFinanceEntry[], filters: FarmFinanceEntryFilters = {}) {
  return records.filter((record) => {
    if (filters.farmPlotId && record.farmPlotId !== filters.farmPlotId) return false;
    if (filters.cropCycleId && record.cropCycleId !== filters.cropCycleId) return false;
    if (filters.direction && record.direction !== filters.direction) return false;
    if (filters.category && record.category !== filters.category) return false;
    return isWithinDateRange(record.entryDate, filters.startDate, filters.endDate);
  });
}

function filterHarvestRecords(records: FarmHarvestRecord[], filters: FarmHarvestRecordFilters = {}) {
  return records.filter((record) => {
    if (filters.farmPlotId && record.farmPlotId !== filters.farmPlotId) return false;
    if (filters.cropCycleId && record.cropCycleId !== filters.cropCycleId) return false;
    if (filters.cropName && record.cropName?.toLowerCase() !== filters.cropName.toLowerCase()) return false;
    return isWithinDateRange(record.harvestDate, filters.startDate, filters.endDate);
  });
}

function getPlotAreaRai(plot: FarmPlot | undefined) {
  if (!plot) return 0;

  return (plot.areaRai ?? 0) + (plot.areaNgan ?? 0) / 4 + (plot.areaSquareWah ?? 0) / 400;
}

function resolveSummaryAreaRai(
  state: FarmRecordsState,
  filters: FarmLedgerSummaryFilters,
  entries: FarmFinanceEntry[],
  activities: FarmActivityRecord[],
) {
  if (filters.cropCycleId) {
    const cycle = state.cropCycles.find((item) => item.id === filters.cropCycleId);
    return cycle?.areaRai ?? getPlotAreaRai(state.farmPlots.find((plot) => plot.id === cycle?.farmPlotId));
  }

  if (filters.farmPlotId) {
    return getPlotAreaRai(state.farmPlots.find((plot) => plot.id === filters.farmPlotId));
  }

  const plotIds = new Set<string>();
  entries.forEach((entry) => {
    if (entry.farmPlotId) plotIds.add(entry.farmPlotId);
  });
  activities.forEach((activity) => plotIds.add(activity.farmPlotId));

  return state.farmPlots
    .filter((plot) => !plot.isArchived && (plotIds.size === 0 || plotIds.has(plot.id)))
    .reduce((total, plot) => total + getPlotAreaRai(plot), 0);
}

function buildLedgerSummary(state: FarmRecordsState, filters: FarmLedgerSummaryFilters = {}): FarmLedgerSummary {
  const financeFilters: FarmFinanceEntryFilters = {
    farmPlotId: filters.farmPlotId,
    cropCycleId: filters.cropCycleId,
    startDate: filters.startDate,
    endDate: filters.endDate,
    direction: filters.direction,
    category: filters.category,
  };
  const activityFilters: FarmActivityRecordFilters = {
    farmPlotId: filters.farmPlotId,
    cropCycleId: filters.cropCycleId,
    startDate: filters.startDate,
    endDate: filters.endDate,
    activityType: filters.activityType,
  };
  const entries = filterFinanceEntries(state.farmFinanceEntries, financeFilters);
  const activities = filterActivityRecords(state.farmActivityRecords, activityFilters);
  const harvestRecords = filterHarvestRecords(state.farmHarvestRecords, {
    farmPlotId: filters.farmPlotId,
    cropCycleId: filters.cropCycleId,
    startDate: filters.startDate,
    endDate: filters.endDate,
  });
  const totalIncome = entries.filter((entry) => entry.direction === 'income').reduce((total, entry) => total + entry.amount, 0);
  const totalExpense = entries.filter((entry) => entry.direction === 'expense').reduce((total, entry) => total + entry.amount, 0);
  const totalHarvestKg = harvestRecords.reduce((total, record) => total + (record.normalizedQuantityKg ?? 0), 0);
  const expenseByCategory = entries.reduce<Partial<Record<FarmExpenseCategory, number>>>((totals, entry) => {
    if (entry.direction === 'expense' && isExpenseCategory(entry.category)) {
      totals[entry.category] = (totals[entry.category] ?? 0) + entry.amount;
    }

    return totals;
  }, {});
  const incomeByCategory = entries.reduce<Partial<Record<FarmIncomeCategory, number>>>((totals, entry) => {
    if (entry.direction === 'income' && isIncomeCategory(entry.category)) {
      totals[entry.category] = (totals[entry.category] ?? 0) + entry.amount;
    }

    return totals;
  }, {});
  const areaRai = resolveSummaryAreaRai(state, filters, entries, activities);

  return {
    totalIncome,
    totalExpense,
    netProfit: totalIncome - totalExpense,
    expenseByCategory,
    incomeByCategory,
    costPerRai: areaRai > 0 ? totalExpense / areaRai : undefined,
    costPerKg: totalHarvestKg > 0 ? totalExpense / totalHarvestKg : undefined,
    entryCount: entries.length,
    activityCount: activities.length,
  };
}

function createFarmPlotWithStorage(storage: FarmRecordsStorageAdapter | undefined, input: FarmPlotInput) {
  const timestamp = now();
  const normalized = normalizeFarmPlot({
    ...input,
    id: input.id ?? createId('farm-plot'),
    isArchived: input.isArchived ?? false,
    createdAt: input.createdAt ?? timestamp,
    updatedAt: input.updatedAt ?? timestamp,
  });

  if (!normalized) {
    throw new Error('Farm plot requires a name.');
  }

  return mutateState(storage, (state) => ({
    result: normalized,
    state: {
      ...state,
      farmPlots: [normalized, ...state.farmPlots.filter((plot) => plot.id !== normalized.id)],
    },
  })).result;
}

function updateFarmPlotWithStorage(storage: FarmRecordsStorageAdapter | undefined, id: string, patch: FarmPlotPatch) {
  let updated: FarmPlot | undefined;

  return mutateState(storage, (state) => {
    const farmPlots = state.farmPlots.map((plot) => {
      if (plot.id !== id) return plot;
      updated = normalizeFarmPlot({
        ...plot,
        ...patch,
        id: plot.id,
        createdAt: plot.createdAt,
        updatedAt: now(),
      });
      return updated ?? plot;
    });

    return {
      result: updated,
      state: { ...state, farmPlots },
    };
  }).result;
}

function createCropCycleWithStorage(storage: FarmRecordsStorageAdapter | undefined, input: CropCycleInput) {
  const timestamp = now();
  const normalized = normalizeCropCycle({
    ...input,
    id: input.id ?? createId('crop-cycle'),
    status: input.status ?? 'planned',
    createdAt: input.createdAt ?? timestamp,
    updatedAt: input.updatedAt ?? timestamp,
  });

  if (!normalized) {
    throw new Error('Crop cycle requires a farmPlotId and cropName.');
  }

  return mutateState(storage, (state) => ({
    result: normalized,
    state: {
      ...state,
      cropCycles: [normalized, ...state.cropCycles.filter((cycle) => cycle.id !== normalized.id)],
    },
  })).result;
}

function updateCropCycleWithStorage(storage: FarmRecordsStorageAdapter | undefined, id: string, patch: CropCyclePatch) {
  let updated: CropCycle | undefined;

  return mutateState(storage, (state) => {
    const cropCycles = state.cropCycles.map((cycle) => {
      if (cycle.id !== id) return cycle;
      updated = normalizeCropCycle({
        ...cycle,
        ...patch,
        id: cycle.id,
        createdAt: cycle.createdAt,
        updatedAt: now(),
      });
      return updated ?? cycle;
    });

    return {
      result: updated,
      state: { ...state, cropCycles },
    };
  }).result;
}

function createActivityRecordWithStorage(storage: FarmRecordsStorageAdapter | undefined, input: FarmActivityRecordInput) {
  const timestamp = now();
  const normalized = normalizeActivityRecord({
    ...input,
    id: input.id ?? createId('farm-activity'),
    createdAt: input.createdAt ?? timestamp,
    updatedAt: input.updatedAt ?? timestamp,
  });

  if (!normalized) {
    throw new Error('Farm activity record requires a farmPlotId and title.');
  }

  return mutateState(storage, (state) => ({
    result: normalized,
    state: {
      ...state,
      farmActivityRecords: [normalized, ...state.farmActivityRecords.filter((record) => record.id !== normalized.id)],
    },
  })).result;
}

function updateActivityRecordWithStorage(
  storage: FarmRecordsStorageAdapter | undefined,
  id: string,
  patch: FarmActivityRecordPatch,
) {
  let updated: FarmActivityRecord | undefined;

  return mutateState(storage, (state) => {
    const farmActivityRecords = state.farmActivityRecords.map((record) => {
      if (record.id !== id) return record;
      updated = normalizeActivityRecord({
        ...record,
        ...patch,
        id: record.id,
        createdAt: record.createdAt,
        updatedAt: now(),
      });
      return updated ?? record;
    });

    return {
      result: updated,
      state: { ...state, farmActivityRecords },
    };
  }).result;
}

function createFinanceEntryWithStorage(storage: FarmRecordsStorageAdapter | undefined, input: FarmFinanceEntryInput) {
  const timestamp = now();
  const normalized = normalizeFinanceEntry({
    ...input,
    id: input.id ?? createId('farm-finance'),
    currency: input.currency ?? 'THB',
    createdAt: input.createdAt ?? timestamp,
    updatedAt: input.updatedAt ?? timestamp,
  });

  if (!normalized) {
    throw new Error('Farm finance entry requires a title.');
  }

  return mutateState(storage, (state) => ({
    result: normalized,
    state: {
      ...state,
      farmFinanceEntries: [normalized, ...state.farmFinanceEntries.filter((entry) => entry.id !== normalized.id)],
    },
  })).result;
}

function updateFinanceEntryWithStorage(storage: FarmRecordsStorageAdapter | undefined, id: string, patch: FarmFinanceEntryPatch) {
  let updated: FarmFinanceEntry | undefined;

  return mutateState(storage, (state) => {
    const farmFinanceEntries = state.farmFinanceEntries.map((entry) => {
      if (entry.id !== id) return entry;
      updated = normalizeFinanceEntry({
        ...entry,
        ...patch,
        id: entry.id,
        createdAt: entry.createdAt,
        updatedAt: now(),
      });
      return updated ?? entry;
    });

    return {
      result: updated,
      state: { ...state, farmFinanceEntries },
    };
  }).result;
}

function createHarvestRecordWithStorage(storage: FarmRecordsStorageAdapter | undefined, input: FarmHarvestRecordInput) {
  const timestamp = now();
  const normalized = normalizeHarvestRecord({
    ...input,
    id: input.id ?? createId('farm-harvest'),
    createdAt: input.createdAt ?? timestamp,
    updatedAt: input.updatedAt ?? timestamp,
  });

  if (!normalized) {
    throw new Error('Farm harvest record requires a farmPlotId, valid harvestDate, and non-negative quantity.');
  }

  return mutateState(storage, (state) => ({
    result: normalized,
    state: {
      ...state,
      farmHarvestRecords: [normalized, ...state.farmHarvestRecords.filter((record) => record.id !== normalized.id)],
    },
  })).result;
}

function updateHarvestRecordWithStorage(storage: FarmRecordsStorageAdapter | undefined, id: string, patch: FarmHarvestRecordPatch) {
  let updated: FarmHarvestRecord | undefined;

  return mutateState(storage, (state) => {
    const farmHarvestRecords = state.farmHarvestRecords.map((record) => {
      if (record.id !== id) return record;
      updated = normalizeHarvestRecord({
        ...record,
        ...patch,
        id: record.id,
        createdAt: record.createdAt,
        updatedAt: now(),
      });
      return updated ?? record;
    });

    return {
      result: updated,
      state: { ...state, farmHarvestRecords },
    };
  }).result;
}

export function getFarmRecordsState(storage?: FarmRecordsStorageAdapter) {
  return readState(storage);
}

export function replaceFarmRecordsState(state: FarmRecordsState, storage = getBrowserStorage()) {
  return persistState(migrateFarmRecordsState(state), storage);
}

export function listFarmPlots(options: FarmPlotListOptions = {}) {
  return createFarmRecordsService().listFarmPlots(options);
}

export function getFarmPlotById(id: string) {
  return createFarmRecordsService().getFarmPlotById(id);
}

export function createFarmPlot(input: FarmPlotInput) {
  return createFarmPlotWithStorage(getBrowserStorage(), input);
}

export function updateFarmPlot(id: string, patch: FarmPlotPatch) {
  return updateFarmPlotWithStorage(getBrowserStorage(), id, patch);
}

export function archiveFarmPlot(id: string) {
  return updateFarmPlot(id, { isArchived: true });
}

export function listCropCycles() {
  return createFarmRecordsService().listCropCycles();
}

export function listCropCyclesByPlot(farmPlotId: string) {
  return createFarmRecordsService().listCropCyclesByPlot(farmPlotId);
}

export function getCropCycleById(id: string) {
  return createFarmRecordsService().getCropCycleById(id);
}

export function createCropCycle(input: CropCycleInput) {
  return createCropCycleWithStorage(getBrowserStorage(), input);
}

export function updateCropCycle(id: string, patch: CropCyclePatch) {
  return updateCropCycleWithStorage(getBrowserStorage(), id, patch);
}

export function closeCropCycle(id: string, status: CropCycleStatus) {
  return updateCropCycle(id, {
    status,
    actualHarvestDate: status === 'harvested' ? now().slice(0, 10) : undefined,
  });
}

export function listActivityRecords(filters: FarmActivityRecordFilters = {}) {
  return createFarmRecordsService().listActivityRecords(filters);
}

export function getActivityRecordById(id: string) {
  return createFarmRecordsService().getActivityRecordById(id);
}

export function createActivityRecord(input: FarmActivityRecordInput) {
  return createActivityRecordWithStorage(getBrowserStorage(), input);
}

export function updateActivityRecord(id: string, patch: FarmActivityRecordPatch) {
  return updateActivityRecordWithStorage(getBrowserStorage(), id, patch);
}

export function deleteActivityRecord(id: string) {
  return createFarmRecordsService().deleteActivityRecord(id);
}

export function listFinanceEntries(filters: FarmFinanceEntryFilters = {}) {
  return createFarmRecordsService().listFinanceEntries(filters);
}

export function getFinanceEntryById(id: string) {
  return createFarmRecordsService().getFinanceEntryById(id);
}

export function createFinanceEntry(input: FarmFinanceEntryInput) {
  return createFinanceEntryWithStorage(getBrowserStorage(), input);
}

export function updateFinanceEntry(id: string, patch: FarmFinanceEntryPatch) {
  return updateFinanceEntryWithStorage(getBrowserStorage(), id, patch);
}

export function deleteFinanceEntry(id: string) {
  return createFarmRecordsService().deleteFinanceEntry(id);
}

export function listHarvestRecords(filters: FarmHarvestRecordFilters = {}) {
  return createFarmRecordsService().listHarvestRecords(filters);
}

export function getHarvestRecordById(id: string) {
  return createFarmRecordsService().getHarvestRecordById(id);
}

export function createHarvestRecord(input: FarmHarvestRecordInput) {
  return createHarvestRecordWithStorage(getBrowserStorage(), input);
}

export function updateHarvestRecord(id: string, patch: FarmHarvestRecordPatch) {
  return updateHarvestRecordWithStorage(getBrowserStorage(), id, patch);
}

export function deleteHarvestRecord(id: string) {
  return createFarmRecordsService().deleteHarvestRecord(id);
}

export function computeFarmLedgerSummary(filters: FarmLedgerSummaryFilters = {}) {
  return createFarmRecordsService().computeFarmLedgerSummary(filters);
}

export function createMemoryFarmRecordsStorage(initialState?: FarmRecordsState | string): FarmRecordsStorageAdapter {
  const values: Record<string, string> = {};

  if (typeof initialState === 'string') {
    values[farmRecordsStorageKey] = initialState;
  } else if (initialState) {
    values[farmRecordsStorageKey] = JSON.stringify(initialState);
  }

  return {
    getItem: (key) => values[key] ?? null,
    setItem: (key, value) => {
      values[key] = value;
    },
    removeItem: (key) => {
      delete values[key];
    },
  };
}

export function createFarmRecordsService(storage = getBrowserStorage()) {
  return {
    getState: () => readState(storage),
    replaceState: (state: FarmRecordsState) => replaceFarmRecordsState(state, storage),
    listFarmPlots: (options: FarmPlotListOptions = {}) =>
      readState(storage).farmPlots.filter((plot) => options.includeArchived || !plot.isArchived),
    getFarmPlotById: (id: string) => readState(storage).farmPlots.find((plot) => plot.id === id),
    createFarmPlot: (input: FarmPlotInput) => createFarmPlotWithStorage(storage, input),
    updateFarmPlot: (id: string, patch: FarmPlotPatch) => updateFarmPlotWithStorage(storage, id, patch),
    archiveFarmPlot: (id: string) => updateFarmPlotWithStorage(storage, id, { isArchived: true }),
    listCropCycles: () => readState(storage).cropCycles,
    listCropCyclesByPlot: (farmPlotId: string) => readState(storage).cropCycles.filter((cycle) => cycle.farmPlotId === farmPlotId),
    getCropCycleById: (id: string) => readState(storage).cropCycles.find((cycle) => cycle.id === id),
    createCropCycle: (input: CropCycleInput) => createCropCycleWithStorage(storage, input),
    updateCropCycle: (id: string, patch: CropCyclePatch) => updateCropCycleWithStorage(storage, id, patch),
    closeCropCycle: (id: string, status: CropCycleStatus) =>
      updateCropCycleWithStorage(storage, id, {
        status,
        actualHarvestDate: status === 'harvested' ? now().slice(0, 10) : undefined,
      }),
    listActivityRecords: (filters: FarmActivityRecordFilters = {}) => filterActivityRecords(readState(storage).farmActivityRecords, filters),
    getActivityRecordById: (id: string) => readState(storage).farmActivityRecords.find((record) => record.id === id),
    createActivityRecord: (input: FarmActivityRecordInput) => createActivityRecordWithStorage(storage, input),
    updateActivityRecord: (id: string, patch: FarmActivityRecordPatch) => updateActivityRecordWithStorage(storage, id, patch),
    deleteActivityRecord: (id: string) =>
      mutateState(storage, (state) => ({
        result: state.farmActivityRecords.some((record) => record.id === id),
        state: {
          ...state,
          farmActivityRecords: state.farmActivityRecords.filter((record) => record.id !== id),
          farmFinanceEntries: state.farmFinanceEntries.map((entry) =>
            entry.relatedActivityRecordId === id ? { ...entry, relatedActivityRecordId: undefined, updatedAt: now() } : entry,
          ),
        },
      })).result,
    listFinanceEntries: (filters: FarmFinanceEntryFilters = {}) => filterFinanceEntries(readState(storage).farmFinanceEntries, filters),
    getFinanceEntryById: (id: string) => readState(storage).farmFinanceEntries.find((entry) => entry.id === id),
    createFinanceEntry: (input: FarmFinanceEntryInput) => createFinanceEntryWithStorage(storage, input),
    updateFinanceEntry: (id: string, patch: FarmFinanceEntryPatch) => updateFinanceEntryWithStorage(storage, id, patch),
    deleteFinanceEntry: (id: string) =>
      mutateState(storage, (state) => ({
        result: state.farmFinanceEntries.some((entry) => entry.id === id),
        state: {
          ...state,
          farmFinanceEntries: state.farmFinanceEntries.filter((entry) => entry.id !== id),
        },
      })).result,
    listHarvestRecords: (filters: FarmHarvestRecordFilters = {}) => filterHarvestRecords(readState(storage).farmHarvestRecords, filters),
    getHarvestRecordById: (id: string) => readState(storage).farmHarvestRecords.find((record) => record.id === id),
    createHarvestRecord: (input: FarmHarvestRecordInput) => createHarvestRecordWithStorage(storage, input),
    updateHarvestRecord: (id: string, patch: FarmHarvestRecordPatch) => updateHarvestRecordWithStorage(storage, id, patch),
    deleteHarvestRecord: (id: string) =>
      mutateState(storage, (state) => ({
        result: state.farmHarvestRecords.some((record) => record.id === id),
        state: {
          ...state,
          farmHarvestRecords: state.farmHarvestRecords.filter((record) => record.id !== id),
        },
      })).result,
    computeFarmLedgerSummary: (filters: FarmLedgerSummaryFilters = {}) => buildLedgerSummary(readState(storage), filters),
  };
}

export function subscribeFarmRecords(listener: () => void) {
  if (typeof window === 'undefined') {
    return () => undefined;
  }

  const storageListener = (event: StorageEvent) => {
    if (event.key === farmRecordsStorageKey) {
      listener();
    }
  };

  window.addEventListener(farmRecordsChangedEvent, listener);
  window.addEventListener('storage', storageListener);

  return () => {
    window.removeEventListener(farmRecordsChangedEvent, listener);
    window.removeEventListener('storage', storageListener);
  };
}

export function isValidFarmFinanceCategoryForDirection(direction: FarmFinanceDirection, category: FarmFinanceCategory) {
  return direction === 'income' ? isIncomeCategory(category) : isExpenseCategory(category);
}
