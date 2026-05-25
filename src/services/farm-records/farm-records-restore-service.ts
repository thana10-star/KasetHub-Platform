import {
  createFarmRecordsService,
  createMemoryFarmRecordsStorage,
  migrateFarmRecordsState,
  replaceFarmRecordsState,
  type FarmRecordsStorageAdapter,
} from '@/services/farm-records/farm-records-service';
import type { FarmLedgerSummary, FarmRecordsState } from '@/services/farm-records/farm-records.types';

export const farmRecordsRestoreConfirmationPhrase = 'RESTORE FARM RECORDS';

export type FarmRecordsRestoreMode = 'replace_local_farm_records';

export type FarmRecordsBackupParseResult =
  | {
      ok: true;
      parsedBackup: unknown;
    }
  | {
      ok: false;
      error: string;
    };

export type FarmRecordsDetectedCounts = {
  farmPlotCount: number;
  cropCycleCount: number;
  activityRecordCount: number;
  financeEntryCount: number;
  harvestRecordCount: number;
};

export type FarmRecordsBackupValidationResult = {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  normalizedState?: FarmRecordsState;
  detectedCounts: FarmRecordsDetectedCounts;
  detectedSummary: FarmLedgerSummary;
};

export type FarmRecordsRestorePreview = {
  currentCounts: FarmRecordsDetectedCounts;
  backupCounts: FarmRecordsDetectedCounts;
  differenceCounts: FarmRecordsDetectedCounts;
  currentSummary: FarmLedgerSummary;
  backupSummary: FarmLedgerSummary;
  latestBackupRecordDate?: string;
  restoreModeOptions: FarmRecordsRestoreMode[];
};

export type FarmRecordsApplyRestoreOptions = {
  mode: FarmRecordsRestoreMode;
  confirmed: boolean;
  confirmationPhrase?: string;
  storage?: FarmRecordsStorageAdapter;
};

export type FarmRecordsApplyRestoreResult =
  | {
      ok: true;
      restoredState: FarmRecordsState;
      counts: FarmRecordsDetectedCounts;
      summary: FarmLedgerSummary;
    }
  | {
      ok: false;
      errors: string[];
    };

const emptySummary: FarmLedgerSummary = {
  totalIncome: 0,
  totalExpense: 0,
  netProfit: 0,
  expenseByCategory: {},
  incomeByCategory: {},
  entryCount: 0,
  activityCount: 0,
};

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function countState(state?: FarmRecordsState): FarmRecordsDetectedCounts {
  return {
    farmPlotCount: state?.farmPlots.length ?? 0,
    cropCycleCount: state?.cropCycles.length ?? 0,
    activityRecordCount: state?.farmActivityRecords.length ?? 0,
    financeEntryCount: state?.farmFinanceEntries.length ?? 0,
    harvestRecordCount: state?.farmHarvestRecords.length ?? 0,
  };
}

function computeSummary(state?: FarmRecordsState): FarmLedgerSummary {
  if (!state) return emptySummary;
  return createFarmRecordsService(createMemoryFarmRecordsStorage(state)).computeFarmLedgerSummary();
}

function hasValidDate(value: unknown) {
  return typeof value === 'string' && value.trim().length > 0 && !Number.isNaN(Date.parse(value));
}

function walkValues(value: unknown, visitor: (key: string, item: unknown) => void, parentKey = '') {
  if (Array.isArray(value)) {
    value.forEach((item, index) => walkValues(item, visitor, `${parentKey}[${index}]`));
    return;
  }

  if (!isObject(value)) return;

  Object.entries(value).forEach(([key, item]) => {
    visitor(key, item);
    walkValues(item, visitor, key);
  });
}

function hasRawDataUri(value: unknown) {
  let found = false;
  walkValues(value, (_key, item) => {
    if (typeof item === 'string' && item.startsWith('data:')) {
      found = true;
    }
  });
  return found;
}

function hasGpsLikeFields(value: unknown) {
  const gpsKeys = new Set(['gps', 'geolocation', 'latitude', 'longitude', 'lat', 'lng', 'coordinates']);
  let found = false;
  walkValues(value, (key) => {
    if (gpsKeys.has(key.toLowerCase())) {
      found = true;
    }
  });
  return found;
}

function validateStableIds(records: unknown[], sliceName: string, errors: string[]) {
  records.forEach((record, index) => {
    if (!isObject(record) || typeof record.id !== 'string' || record.id.trim().length === 0) {
      errors.push(`${sliceName}[${index}] requires a stable string id.`);
    }
  });
}

function validateRequiredDates(records: unknown[], sliceName: string, dateField: string, errors: string[]) {
  records.forEach((record, index) => {
    if (!isObject(record) || !hasValidDate(record[dateField])) {
      errors.push(`${sliceName}[${index}] requires a valid ${dateField}.`);
    }
  });
}

function validateFinanceAmounts(records: unknown[], errors: string[]) {
  records.forEach((record, index) => {
    if (!isObject(record) || typeof record.amount !== 'number' || !Number.isFinite(record.amount) || record.amount < 0) {
      errors.push(`farmFinanceEntries[${index}] requires a numeric non-negative amount.`);
    }
  });
}

function validateHarvestQuantities(records: unknown[], errors: string[]) {
  records.forEach((record, index) => {
    if (!isObject(record) || typeof record.quantity !== 'number' || !Number.isFinite(record.quantity) || record.quantity < 0) {
      errors.push(`farmHarvestRecords[${index}] requires a numeric non-negative quantity.`);
    }
  });
}

function latestDate(values: string[]) {
  return values
    .filter(Boolean)
    .sort((a, b) => Date.parse(b) - Date.parse(a))[0];
}

export function parseFarmRecordsJsonBackup(rawText: string): FarmRecordsBackupParseResult {
  try {
    return {
      ok: true,
      parsedBackup: JSON.parse(rawText) as unknown,
    };
  } catch {
    return {
      ok: false,
      error: 'Invalid JSON backup. Paste a Farm Records JSON backup exported from this device.',
    };
  }
}

export function validateFarmRecordsBackup(parsedBackup: unknown): FarmRecordsBackupValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!isObject(parsedBackup)) {
    return {
      isValid: false,
      errors: ['Backup must be a JSON object.'],
      warnings,
      detectedCounts: countState(),
      detectedSummary: emptySummary,
    };
  }

  if (parsedBackup.exportVersion === undefined) {
    errors.push('Backup is missing exportVersion.');
  }

  if (parsedBackup.appFeature !== undefined && parsedBackup.appFeature !== 'farm_records') {
    errors.push('Backup appFeature must be farm_records.');
  }

  const requiredSlices = ['farmPlots', 'cropCycles', 'farmActivityRecords', 'farmFinanceEntries'] as const;
  requiredSlices.forEach((slice) => {
    if (!Array.isArray(parsedBackup[slice])) {
      errors.push(`Backup requires ${slice} as an array.`);
    }
  });

  if (parsedBackup.farmHarvestRecords !== undefined && !Array.isArray(parsedBackup.farmHarvestRecords)) {
    errors.push('Backup farmHarvestRecords must be an array when present.');
  }

  if (hasRawDataUri(parsedBackup)) {
    warnings.push('Raw data URI image payloads were found and will be stripped from the restore candidate.');
  }

  if (hasGpsLikeFields(parsedBackup)) {
    warnings.push('GPS/geolocation-like fields were found and will not be preserved in Farm Records restore state.');
  }

  if (errors.length > 0) {
    return {
      isValid: false,
      errors,
      warnings,
      detectedCounts: countState(),
      detectedSummary: emptySummary,
    };
  }

  const farmPlots = parsedBackup.farmPlots as unknown[];
  const cropCycles = parsedBackup.cropCycles as unknown[];
  const farmActivityRecords = parsedBackup.farmActivityRecords as unknown[];
  const farmFinanceEntries = parsedBackup.farmFinanceEntries as unknown[];
  const farmHarvestRecords = Array.isArray(parsedBackup.farmHarvestRecords) ? (parsedBackup.farmHarvestRecords as unknown[]) : [];

  validateStableIds(farmPlots, 'farmPlots', errors);
  validateStableIds(cropCycles, 'cropCycles', errors);
  validateStableIds(farmActivityRecords, 'farmActivityRecords', errors);
  validateStableIds(farmFinanceEntries, 'farmFinanceEntries', errors);
  validateStableIds(farmHarvestRecords, 'farmHarvestRecords', errors);
  validateRequiredDates(cropCycles, 'cropCycles', 'startDate', errors);
  validateRequiredDates(farmActivityRecords, 'farmActivityRecords', 'activityDate', errors);
  validateRequiredDates(farmFinanceEntries, 'farmFinanceEntries', 'entryDate', errors);
  validateRequiredDates(farmHarvestRecords, 'farmHarvestRecords', 'harvestDate', errors);
  validateFinanceAmounts(farmFinanceEntries, errors);
  validateHarvestQuantities(farmHarvestRecords, errors);

  const normalizedState = migrateFarmRecordsState({
    version: 1,
    farmPlots,
    cropCycles,
    farmActivityRecords,
    farmFinanceEntries,
    farmHarvestRecords,
    migrations: ['m87-restore-preview'],
    updatedAt: typeof parsedBackup.exportedAt === 'string' ? parsedBackup.exportedAt : new Date().toISOString(),
  });

  if (farmHarvestRecords.length !== normalizedState.farmHarvestRecords.length) {
    warnings.push(`farmHarvestRecords had ${farmHarvestRecords.length - normalizedState.farmHarvestRecords.length} malformed record(s) removed during validation.`);
  }

  const detectedCounts = countState(normalizedState);
  const detectedSummary = computeSummary(normalizedState);

  requiredSlices.forEach((slice) => {
    const sourceLength = (parsedBackup[slice] as unknown[]).length;
    const normalizedLength =
      slice === 'farmPlots'
        ? normalizedState.farmPlots.length
        : slice === 'cropCycles'
          ? normalizedState.cropCycles.length
          : slice === 'farmActivityRecords'
            ? normalizedState.farmActivityRecords.length
            : normalizedState.farmFinanceEntries.length;

    if (sourceLength !== normalizedLength) {
      warnings.push(`${slice} had ${sourceLength - normalizedLength} malformed record(s) removed during validation.`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    normalizedState: errors.length === 0 ? normalizedState : undefined,
    detectedCounts,
    detectedSummary,
  };
}

export function buildFarmRecordsRestorePreview(currentState: FarmRecordsState, normalizedBackupState: FarmRecordsState): FarmRecordsRestorePreview {
  const currentCounts = countState(currentState);
  const backupCounts = countState(normalizedBackupState);

  return {
    currentCounts,
    backupCounts,
    differenceCounts: {
      farmPlotCount: backupCounts.farmPlotCount - currentCounts.farmPlotCount,
      cropCycleCount: backupCounts.cropCycleCount - currentCounts.cropCycleCount,
      activityRecordCount: backupCounts.activityRecordCount - currentCounts.activityRecordCount,
      financeEntryCount: backupCounts.financeEntryCount - currentCounts.financeEntryCount,
      harvestRecordCount: backupCounts.harvestRecordCount - currentCounts.harvestRecordCount,
    },
    currentSummary: computeSummary(currentState),
    backupSummary: computeSummary(normalizedBackupState),
    latestBackupRecordDate: latestDate([
      ...normalizedBackupState.farmActivityRecords.map((record) => record.activityDate),
      ...normalizedBackupState.farmFinanceEntries.map((entry) => entry.entryDate),
      ...normalizedBackupState.farmHarvestRecords.map((record) => record.harvestDate),
      ...normalizedBackupState.cropCycles.map((cycle) => cycle.updatedAt),
      ...normalizedBackupState.farmPlots.map((plot) => plot.updatedAt),
    ]),
    restoreModeOptions: ['replace_local_farm_records'],
  };
}

export function applyFarmRecordsRestore(
  normalizedBackupState: FarmRecordsState,
  options: FarmRecordsApplyRestoreOptions,
): FarmRecordsApplyRestoreResult {
  const errors: string[] = [];

  if (options.mode !== 'replace_local_farm_records') {
    errors.push('Unsupported restore mode.');
  }

  if (!options.confirmed) {
    errors.push('Restore requires explicit confirmation.');
  }

  if (options.confirmationPhrase !== farmRecordsRestoreConfirmationPhrase) {
    errors.push(`Type ${farmRecordsRestoreConfirmationPhrase} to confirm local restore.`);
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  const restoredState = replaceFarmRecordsState(normalizedBackupState, options.storage);

  return {
    ok: true,
    restoredState,
    counts: countState(restoredState),
    summary: computeSummary(restoredState),
  };
}
