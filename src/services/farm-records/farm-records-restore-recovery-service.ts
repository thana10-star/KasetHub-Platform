import { buildFarmRecordsJsonBackup } from '@/services/farm-records/farm-records-export-service';
import {
  createFarmRecordsService,
  createMemoryFarmRecordsStorage,
  type FarmRecordsStorageAdapter,
} from '@/services/farm-records/farm-records-service';
import type {
  CropCycle,
  FarmActivityRecord,
  FarmFinanceEntry,
  FarmHarvestRecord,
  FarmLedgerSummary,
  FarmPlot,
  FarmRecordsState,
} from '@/services/farm-records/farm-records.types';
import type { FarmRecordsDetectedCounts } from '@/services/farm-records/farm-records-restore-service';

export const farmRecordsRestoreSnapshotStorageKey = 'kasethub.farmRecords.restoreSnapshot.v1';

export type FarmRecordsPreRestoreSnapshot = {
  snapshotVersion: 1;
  createdAt: string;
  source: 'local_device';
  reason: 'pre_restore_snapshot';
  privacyNote: string;
  farmPlots: FarmPlot[];
  cropCycles: CropCycle[];
  farmActivityRecords: FarmActivityRecord[];
  farmFinanceEntries: FarmFinanceEntry[];
  farmHarvestRecords: FarmHarvestRecord[];
  summary: FarmLedgerSummary;
};

export type FarmRecordsRestoreCountEstimate = FarmRecordsDetectedCounts;

export type FarmRecordsRestoreRiskReview = {
  willReplaceLocalData: true;
  currentCounts: FarmRecordsDetectedCounts;
  backupCounts: FarmRecordsDetectedCounts;
  differenceCounts: FarmRecordsRestoreCountEstimate;
  removedCountEstimate: FarmRecordsRestoreCountEstimate;
  addedCountEstimate: FarmRecordsRestoreCountEstimate;
  changedNetProfitEstimate: number;
  currentSummary: FarmLedgerSummary;
  backupSummary: FarmLedgerSummary;
  latestCurrentRecordDate?: string;
  latestBackupRecordDate?: string;
  warnings: string[];
};

export type FarmRecordsSnapshotStoreResult =
  | {
      ok: true;
      snapshot: FarmRecordsPreRestoreSnapshot;
    }
  | {
      ok: false;
      error: string;
    };

const preRestorePrivacyNote =
  'Local pre-restore snapshot only. Farm finance and activity records can contain sensitive business information. Cloud sync is not active. Image files are not included; only image metadata placeholders are preserved.';

const restoreRiskWarnings = [
  'Restore replaces local Farm Records on this device.',
  'Export current data first if unsure.',
  'Cloud sync is not active, so there is no cloud backup to recover from.',
  'Restore cannot recover raw image files; only image metadata placeholders are included.',
  'Finance data may include sensitive income, cost, and profit information.',
];

const emptySummary: FarmLedgerSummary = {
  totalIncome: 0,
  totalExpense: 0,
  netProfit: 0,
  expenseByCategory: {},
  incomeByCategory: {},
  entryCount: 0,
  activityCount: 0,
};

function getBrowserStorage(): FarmRecordsStorageAdapter | undefined {
  if (typeof window === 'undefined') return undefined;
  return window.localStorage;
}

function countState(state: FarmRecordsState): FarmRecordsDetectedCounts {
  return {
    farmPlotCount: state.farmPlots.length,
    cropCycleCount: state.cropCycles.length,
    activityRecordCount: state.farmActivityRecords.length,
    financeEntryCount: state.farmFinanceEntries.length,
    harvestRecordCount: state.farmHarvestRecords.length,
  };
}

function computeSummary(state: FarmRecordsState) {
  return createFarmRecordsService(createMemoryFarmRecordsStorage(state)).computeFarmLedgerSummary();
}

function latestDate(values: string[]) {
  return values
    .filter(Boolean)
    .sort((a, b) => Date.parse(b) - Date.parse(a))[0];
}

function latestRecordDate(state: FarmRecordsState) {
  return latestDate([
    ...state.farmActivityRecords.map((record) => record.activityDate),
    ...state.farmFinanceEntries.map((entry) => entry.entryDate),
    ...state.farmHarvestRecords.map((record) => record.harvestDate),
    ...state.cropCycles.map((cycle) => cycle.updatedAt),
    ...state.farmPlots.map((plot) => plot.updatedAt),
  ]);
}

function estimateRemoved(currentValue: number, backupValue: number) {
  return Math.max(currentValue - backupValue, 0);
}

function estimateAdded(currentValue: number, backupValue: number) {
  return Math.max(backupValue - currentValue, 0);
}

export function buildPreRestoreSnapshot(
  currentFarmRecordsState: FarmRecordsState,
  options: { createdAt?: string } = {},
): FarmRecordsPreRestoreSnapshot {
  const createdAt = options.createdAt ?? new Date().toISOString();
  const backup = buildFarmRecordsJsonBackup({
    exportedAt: createdAt,
    state: currentFarmRecordsState,
  });

  return {
    snapshotVersion: 1,
    createdAt,
    source: 'local_device',
    reason: 'pre_restore_snapshot',
    privacyNote: preRestorePrivacyNote,
    farmPlots: backup.farmPlots,
    cropCycles: backup.cropCycles,
    farmActivityRecords: backup.farmActivityRecords,
    farmFinanceEntries: backup.farmFinanceEntries,
    farmHarvestRecords: backup.farmHarvestRecords,
    summary: backup.summary,
  };
}

export function stringifyPreRestoreSnapshot(snapshot: FarmRecordsPreRestoreSnapshot) {
  return JSON.stringify(snapshot, null, 2);
}

export function getRestoreRiskReview(currentState: FarmRecordsState, backupState: FarmRecordsState): FarmRecordsRestoreRiskReview {
  const currentCounts = countState(currentState);
  const backupCounts = countState(backupState);
  const currentSummary = computeSummary(currentState);
  const backupSummary = computeSummary(backupState);

  return {
    willReplaceLocalData: true,
    currentCounts,
    backupCounts,
    differenceCounts: {
      farmPlotCount: backupCounts.farmPlotCount - currentCounts.farmPlotCount,
      cropCycleCount: backupCounts.cropCycleCount - currentCounts.cropCycleCount,
      activityRecordCount: backupCounts.activityRecordCount - currentCounts.activityRecordCount,
      financeEntryCount: backupCounts.financeEntryCount - currentCounts.financeEntryCount,
      harvestRecordCount: backupCounts.harvestRecordCount - currentCounts.harvestRecordCount,
    },
    removedCountEstimate: {
      farmPlotCount: estimateRemoved(currentCounts.farmPlotCount, backupCounts.farmPlotCount),
      cropCycleCount: estimateRemoved(currentCounts.cropCycleCount, backupCounts.cropCycleCount),
      activityRecordCount: estimateRemoved(currentCounts.activityRecordCount, backupCounts.activityRecordCount),
      financeEntryCount: estimateRemoved(currentCounts.financeEntryCount, backupCounts.financeEntryCount),
      harvestRecordCount: estimateRemoved(currentCounts.harvestRecordCount, backupCounts.harvestRecordCount),
    },
    addedCountEstimate: {
      farmPlotCount: estimateAdded(currentCounts.farmPlotCount, backupCounts.farmPlotCount),
      cropCycleCount: estimateAdded(currentCounts.cropCycleCount, backupCounts.cropCycleCount),
      activityRecordCount: estimateAdded(currentCounts.activityRecordCount, backupCounts.activityRecordCount),
      financeEntryCount: estimateAdded(currentCounts.financeEntryCount, backupCounts.financeEntryCount),
      harvestRecordCount: estimateAdded(currentCounts.harvestRecordCount, backupCounts.harvestRecordCount),
    },
    changedNetProfitEstimate: backupSummary.netProfit - currentSummary.netProfit,
    currentSummary,
    backupSummary,
    latestCurrentRecordDate: latestRecordDate(currentState),
    latestBackupRecordDate: latestRecordDate(backupState),
    warnings: restoreRiskWarnings,
  };
}

export function storeLastPreRestoreSnapshot(
  snapshot: FarmRecordsPreRestoreSnapshot,
  storage = getBrowserStorage(),
): FarmRecordsSnapshotStoreResult {
  if (!storage) {
    return {
      ok: false,
      error: 'No browser storage is available for the pre-restore snapshot.',
    };
  }

  storage.setItem(farmRecordsRestoreSnapshotStorageKey, stringifyPreRestoreSnapshot(snapshot));

  return {
    ok: true,
    snapshot,
  };
}

export function getLastPreRestoreSnapshot(storage = getBrowserStorage()): FarmRecordsPreRestoreSnapshot | undefined {
  const raw = storage?.getItem(farmRecordsRestoreSnapshotStorageKey);
  if (!raw) return undefined;

  try {
    const parsed = JSON.parse(raw) as Partial<FarmRecordsPreRestoreSnapshot>;
    if (parsed.snapshotVersion !== 1 || parsed.reason !== 'pre_restore_snapshot' || typeof parsed.createdAt !== 'string') {
      return undefined;
    }

    return {
      snapshotVersion: 1,
      createdAt: parsed.createdAt,
      source: 'local_device',
      reason: 'pre_restore_snapshot',
      privacyNote: typeof parsed.privacyNote === 'string' ? parsed.privacyNote : preRestorePrivacyNote,
      farmPlots: Array.isArray(parsed.farmPlots) ? parsed.farmPlots : [],
      cropCycles: Array.isArray(parsed.cropCycles) ? parsed.cropCycles : [],
      farmActivityRecords: Array.isArray(parsed.farmActivityRecords) ? parsed.farmActivityRecords : [],
      farmFinanceEntries: Array.isArray(parsed.farmFinanceEntries) ? parsed.farmFinanceEntries : [],
      farmHarvestRecords: Array.isArray(parsed.farmHarvestRecords) ? parsed.farmHarvestRecords : [],
      summary: parsed.summary ?? emptySummary,
    };
  } catch {
    return undefined;
  }
}
