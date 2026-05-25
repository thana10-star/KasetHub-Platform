import { createFarmRecordsService, createMemoryFarmRecordsStorage } from '@/services/farm-records/farm-records-service';
import type {
  CropCycle,
  FarmActivityRecord,
  FarmFinanceEntry,
  FarmImageRef,
  FarmLedgerSummary,
  FarmLedgerSummaryFilters,
  FarmPlot,
  FarmRecordsState,
} from '@/services/farm-records/farm-records.types';

export type FarmRecordsExportSource = 'local_device';

export type FarmRecordsJsonBackup = {
  exportVersion: 1;
  exportedAt: string;
  source: FarmRecordsExportSource;
  appFeature: 'farm_records';
  privacyNote: string;
  filtersApplied?: FarmRecordsExportFilters;
  farmPlots: FarmPlot[];
  cropCycles: CropCycle[];
  farmActivityRecords: FarmActivityRecord[];
  farmFinanceEntries: FarmFinanceEntry[];
  summary: FarmLedgerSummary;
};

export type FarmRecordsExportFilters = FarmLedgerSummaryFilters;

export type FarmRecordsExportInput =
  | FarmRecordsState
  | {
      state: FarmRecordsState;
      filters?: FarmRecordsExportFilters;
      exportedAt?: string;
    };

export type FinanceLedgerCsvOptions = {
  farmPlots?: FarmPlot[];
  cropCycles?: CropCycle[];
};

export type FarmRecordsExportPreview = {
  plotCount: number;
  cropCycleCount: number;
  activityRecordCount: number;
  financeEntryCount: number;
  totalIncome: number;
  totalExpense: number;
  netProfit: number;
  jsonEstimatedBytes: number;
  csvEstimatedBytes: number;
  jsonEstimatedSizeLabel: string;
  csvEstimatedSizeLabel: string;
  latestRecordDate?: string;
  warnings: string[];
};

const jsonPrivacyNote =
  'Local device export only. Farm finance and activity records can contain sensitive business information. Cloud sync is not active. Image files are not included; only image metadata placeholders are exported.';

export const farmRecordsExportWarnings = [
  'ข้อมูลส่งออกมาจากเครื่องนี้เท่านั้น',
  'ยังไม่มีการซิงก์ขึ้นคลาวด์',
  'รูปภาพจริงยังไม่ถูกรวมในไฟล์ ส่งออกเฉพาะ metadata เท่านั้น',
  'ไฟล์ที่ดาวน์โหลดควรเก็บอย่างปลอดภัย เพราะอาจมีข้อมูลต้นทุน รายรับ รายจ่าย และรายละเอียดฟาร์ม',
];

const csvHeaders = [
  'entryDate',
  'direction',
  'category',
  'title',
  'amount',
  'currency',
  'farmPlotName',
  'cropCycleName',
  'quantity',
  'unit',
  'buyerOrVendor',
  'note',
];

function normalizeExportInput(input: FarmRecordsExportInput) {
  if ('state' in input) {
    return {
      exportedAt: input.exportedAt ?? new Date().toISOString(),
      filters: input.filters,
      state: input.state,
    };
  }

  return {
    exportedAt: new Date().toISOString(),
    filters: undefined,
    state: input,
  };
}

function sanitizeImageRef(ref: FarmImageRef): FarmImageRef {
  return {
    id: ref.id,
    localUri: ref.localUri?.startsWith('data:') ? undefined : ref.localUri,
    storagePath: ref.storagePath,
    filename: ref.filename,
    caption: ref.caption,
    createdAt: ref.createdAt,
  };
}

function sanitizeFarmPlot(plot: FarmPlot): FarmPlot {
  return {
    id: plot.id,
    name: plot.name,
    displayCode: plot.displayCode,
    areaRai: plot.areaRai,
    areaNgan: plot.areaNgan,
    areaSquareWah: plot.areaSquareWah,
    province: plot.province,
    district: plot.district,
    subdistrict: plot.subdistrict,
    coarseLocationLabel: plot.coarseLocationLabel,
    notes: plot.notes,
    isArchived: plot.isArchived,
    createdAt: plot.createdAt,
    updatedAt: plot.updatedAt,
  };
}

function sanitizeCropCycle(cycle: CropCycle): CropCycle {
  return {
    id: cycle.id,
    farmPlotId: cycle.farmPlotId,
    cropName: cycle.cropName,
    variety: cycle.variety,
    seasonLabel: cycle.seasonLabel,
    startDate: cycle.startDate,
    expectedHarvestDate: cycle.expectedHarvestDate,
    actualHarvestDate: cycle.actualHarvestDate,
    status: cycle.status,
    areaRai: cycle.areaRai,
    notes: cycle.notes,
    createdAt: cycle.createdAt,
    updatedAt: cycle.updatedAt,
  };
}

function sanitizeActivityRecord(record: FarmActivityRecord): FarmActivityRecord {
  return {
    id: record.id,
    farmPlotId: record.farmPlotId,
    cropCycleId: record.cropCycleId,
    activityDate: record.activityDate,
    activityType: record.activityType,
    title: record.title,
    description: record.description,
    inputName: record.inputName,
    inputQuantity: record.inputQuantity,
    inputUnit: record.inputUnit,
    laborCount: record.laborCount,
    laborHours: record.laborHours,
    machineName: record.machineName,
    weatherSummary: record.weatherSummary,
    imageRefs: record.imageRefs?.map(sanitizeImageRef),
    tags: record.tags,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

function sanitizeFinanceEntry(entry: FarmFinanceEntry): FarmFinanceEntry {
  return {
    id: entry.id,
    farmPlotId: entry.farmPlotId,
    cropCycleId: entry.cropCycleId,
    relatedActivityRecordId: entry.relatedActivityRecordId,
    entryDate: entry.entryDate,
    direction: entry.direction,
    category: entry.category,
    title: entry.title,
    amount: entry.amount,
    currency: entry.currency,
    quantity: entry.quantity,
    unit: entry.unit,
    buyerOrVendor: entry.buyerOrVendor,
    paymentMethod: entry.paymentMethod,
    note: entry.note,
    receiptImageRefs: entry.receiptImageRefs?.map(sanitizeImageRef),
    createdAt: entry.createdAt,
    updatedAt: entry.updatedAt,
  };
}

function isInDateRange(value: string, filters?: FarmRecordsExportFilters) {
  if (!filters) return true;
  const dateTime = Date.parse(value);
  if (Number.isNaN(dateTime)) return false;
  if (filters.startDate && dateTime < Date.parse(filters.startDate)) return false;
  if (filters.endDate && dateTime > Date.parse(filters.endDate)) return false;
  return true;
}

function filterActivityRecord(record: FarmActivityRecord, filters?: FarmRecordsExportFilters) {
  if (!filters) return true;
  if (filters.farmPlotId && record.farmPlotId !== filters.farmPlotId) return false;
  if (filters.cropCycleId && record.cropCycleId !== filters.cropCycleId) return false;
  if (filters.activityType && record.activityType !== filters.activityType) return false;
  return isInDateRange(record.activityDate, filters);
}

function filterFinanceEntry(entry: FarmFinanceEntry, filters?: FarmRecordsExportFilters) {
  if (!filters) return true;
  if (filters.farmPlotId && entry.farmPlotId !== filters.farmPlotId) return false;
  if (filters.cropCycleId && entry.cropCycleId !== filters.cropCycleId) return false;
  if (filters.direction && entry.direction !== filters.direction) return false;
  if (filters.category && entry.category !== filters.category) return false;
  return isInDateRange(entry.entryDate, filters);
}

function filterCropCycle(cycle: CropCycle, filters?: FarmRecordsExportFilters) {
  if (!filters) return true;
  if (filters.farmPlotId && cycle.farmPlotId !== filters.farmPlotId) return false;
  if (filters.cropCycleId && cycle.id !== filters.cropCycleId) return false;
  return true;
}

function filterFarmPlot(plot: FarmPlot, filters?: FarmRecordsExportFilters) {
  return filters?.farmPlotId ? plot.id === filters.farmPlotId : true;
}

function createFilteredState(state: FarmRecordsState, filters?: FarmRecordsExportFilters): FarmRecordsState {
  if (!filters) return state;

  return {
    ...state,
    farmPlots: state.farmPlots.filter((plot) => filterFarmPlot(plot, filters)),
    cropCycles: state.cropCycles.filter((cycle) => filterCropCycle(cycle, filters)),
    farmActivityRecords: state.farmActivityRecords.filter((record) => filterActivityRecord(record, filters)),
    farmFinanceEntries: state.farmFinanceEntries.filter((entry) => filterFinanceEntry(entry, filters)),
  };
}

function lookupName<T extends { id: string }>(items: T[], id: string | undefined, getName: (item: T) => string) {
  if (!id) return '';
  return items.find((item) => item.id === id) ? getName(items.find((item) => item.id === id) as T) : '';
}

function getCycleLabel(cycle: CropCycle) {
  return `${cycle.cropName}${cycle.seasonLabel ? ` - ${cycle.seasonLabel}` : ''}`;
}

function escapeCsvCell(value: unknown) {
  const text = value === undefined || value === null ? '' : String(value);
  const escaped = text.replace(/"/g, '""');
  return /[",\r\n]/.test(escaped) ? `"${escaped}"` : escaped;
}

function estimateBytes(value: string) {
  if (typeof TextEncoder === 'undefined') {
    return value.length;
  }

  return new TextEncoder().encode(value).length;
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} bytes`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function latestDate(values: string[]) {
  return values
    .filter(Boolean)
    .sort((a, b) => Date.parse(b) - Date.parse(a))[0];
}

export function buildFinanceLedgerCsv(entries: FarmFinanceEntry[], options: FinanceLedgerCsvOptions = {}) {
  const rows = entries.map((entry) => {
    const farmPlotName = lookupName(options.farmPlots ?? [], entry.farmPlotId, (plot) => plot.name);
    const cropCycleName = lookupName(options.cropCycles ?? [], entry.cropCycleId, getCycleLabel);

    return [
      entry.entryDate,
      entry.direction,
      entry.category,
      entry.title,
      entry.amount,
      entry.currency,
      farmPlotName,
      cropCycleName,
      entry.quantity,
      entry.unit,
      entry.buyerOrVendor,
      entry.note,
    ]
      .map(escapeCsvCell)
      .join(',');
  });

  return [csvHeaders.join(','), ...rows].join('\n');
}

export function buildFarmRecordsJsonBackup(input: FarmRecordsExportInput): FarmRecordsJsonBackup {
  const { exportedAt, filters, state } = normalizeExportInput(input);
  const filteredState = createFilteredState(state, filters);
  const service = createFarmRecordsService(createMemoryFarmRecordsStorage(filteredState));

  return {
    exportVersion: 1,
    exportedAt,
    source: 'local_device',
    appFeature: 'farm_records',
    privacyNote: jsonPrivacyNote,
    filtersApplied: filters,
    farmPlots: filteredState.farmPlots.map(sanitizeFarmPlot),
    cropCycles: filteredState.cropCycles.map(sanitizeCropCycle),
    farmActivityRecords: filteredState.farmActivityRecords.map(sanitizeActivityRecord),
    farmFinanceEntries: filteredState.farmFinanceEntries.map(sanitizeFinanceEntry),
    summary: service.computeFarmLedgerSummary(),
  };
}

export function stringifyFarmRecordsJsonBackup(exportObject: FarmRecordsJsonBackup) {
  return JSON.stringify(exportObject, null, 2);
}

export function getFarmRecordsExportPreview(input: FarmRecordsExportInput): FarmRecordsExportPreview {
  const backup = buildFarmRecordsJsonBackup(input);
  const json = stringifyFarmRecordsJsonBackup(backup);
  const csv = buildFinanceLedgerCsv(backup.farmFinanceEntries, {
    cropCycles: backup.cropCycles,
    farmPlots: backup.farmPlots,
  });
  const jsonEstimatedBytes = estimateBytes(json);
  const csvEstimatedBytes = estimateBytes(csv);
  const latestRecordDate = latestDate([
    ...backup.farmActivityRecords.map((record) => record.activityDate),
    ...backup.farmFinanceEntries.map((entry) => entry.entryDate),
    ...backup.cropCycles.map((cycle) => cycle.updatedAt),
    ...backup.farmPlots.map((plot) => plot.updatedAt),
  ]);

  return {
    plotCount: backup.farmPlots.length,
    cropCycleCount: backup.cropCycles.length,
    activityRecordCount: backup.farmActivityRecords.length,
    financeEntryCount: backup.farmFinanceEntries.length,
    totalIncome: backup.summary.totalIncome,
    totalExpense: backup.summary.totalExpense,
    netProfit: backup.summary.netProfit,
    jsonEstimatedBytes,
    csvEstimatedBytes,
    jsonEstimatedSizeLabel: formatSize(jsonEstimatedBytes),
    csvEstimatedSizeLabel: formatSize(csvEstimatedBytes),
    latestRecordDate,
    warnings: farmRecordsExportWarnings,
  };
}
