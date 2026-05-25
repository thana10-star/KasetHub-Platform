import { describe, expect, test } from 'vitest';
import { buildFarmRecordsJsonBackup } from '@/services/farm-records/farm-records-export-service';
import {
  buildPreRestoreSnapshot,
  farmRecordsRestoreSnapshotStorageKey,
  getLastPreRestoreSnapshot,
  getRestoreRiskReview,
  storeLastPreRestoreSnapshot,
  stringifyPreRestoreSnapshot,
} from '@/services/farm-records/farm-records-restore-recovery-service';
import { validateFarmRecordsBackup } from '@/services/farm-records/farm-records-restore-service';
import { createDemoFarmRecordsState } from '@/services/farm-records/farm-records-fixtures';
import { createEmptyFarmRecordsState, createMemoryFarmRecordsStorage } from '@/services/farm-records/farm-records-service';

describe('M88 farm records restore recovery helpers', () => {
  test('builds a JSON.stringify-safe pre-restore snapshot', () => {
    const snapshot = buildPreRestoreSnapshot(createDemoFarmRecordsState(), {
      createdAt: '2026-05-25T10:00:00.000+07:00',
    });
    const json = stringifyPreRestoreSnapshot(snapshot);

    expect(snapshot.snapshotVersion).toBe(1);
    expect(snapshot.reason).toBe('pre_restore_snapshot');
    expect(JSON.parse(json).farmPlots).toHaveLength(2);
    expect(JSON.parse(json).farmHarvestRecords).toHaveLength(1);
    expect(json).toContain('pre_restore_snapshot');
  });

  test('pre-restore snapshot excludes raw data URI image payloads', () => {
    const state = createDemoFarmRecordsState();
    state.farmActivityRecords[0] = {
      ...state.farmActivityRecords[0]!,
      imageRefs: [
        {
          caption: 'raw image should not persist',
          createdAt: '2026-05-25T10:00:00.000+07:00',
          id: 'image-ref-m88',
          localUri: 'data:image/png;base64,raw',
        },
      ],
    };

    const json = stringifyPreRestoreSnapshot(buildPreRestoreSnapshot(state));

    expect(json).not.toContain('data:image');
    expect(json).toContain('raw image should not persist');
  });

  test('pre-restore snapshot excludes GPS/geolocation-like fields', () => {
    const state = createDemoFarmRecordsState();
    (state.farmPlots[0]! as unknown as Record<string, unknown>).latitude = 13.7563;
    (state.farmPlots[0]! as unknown as Record<string, unknown>).longitude = 100.5018;

    const json = stringifyPreRestoreSnapshot(buildPreRestoreSnapshot(state));

    expect(json).not.toContain('latitude');
    expect(json).not.toContain('longitude');
  });

  test('restore risk review compares current and backup counts and returns warnings', () => {
    const currentState = createDemoFarmRecordsState();
    const backupState = createEmptyFarmRecordsState();
    const riskReview = getRestoreRiskReview(currentState, backupState);

    expect(riskReview.willReplaceLocalData).toBe(true);
    expect(riskReview.currentCounts.farmPlotCount).toBe(2);
    expect(riskReview.currentCounts.harvestRecordCount).toBe(1);
    expect(riskReview.backupCounts.farmPlotCount).toBe(0);
    expect(riskReview.backupCounts.harvestRecordCount).toBe(0);
    expect(riskReview.removedCountEstimate.farmPlotCount).toBe(2);
    expect(riskReview.removedCountEstimate.harvestRecordCount).toBe(1);
    expect(riskReview.addedCountEstimate.farmPlotCount).toBe(0);
    expect(riskReview.addedCountEstimate.harvestRecordCount).toBe(0);
    expect(riskReview.changedNetProfitEstimate).toBe(-22100);
    expect(riskReview.warnings.join(' ')).toContain('Restore replaces local Farm Records');
    expect(riskReview.warnings.join(' ')).toContain('Cloud sync is not active');
  });

  test('current local backup before restore uses sanitized export-compatible data', () => {
    const state = createDemoFarmRecordsState();
    state.farmFinanceEntries[0] = {
      ...state.farmFinanceEntries[0]!,
      receiptImageRefs: [
        {
          createdAt: '2026-05-25T10:00:00.000+07:00',
          id: 'receipt-image-m88',
          localUri: 'data:image/png;base64,receipt',
        },
      ],
    };

    const snapshot = buildPreRestoreSnapshot(state);
    const backup = buildFarmRecordsJsonBackup({
      exportedAt: snapshot.createdAt,
      state,
    });

    expect(snapshot.farmHarvestRecords).toHaveLength(1);
    expect(JSON.stringify(snapshot)).not.toContain('data:image');
    expect(JSON.stringify(backup)).not.toContain('data:image');
    expect(validateFarmRecordsBackup(backup).isValid).toBe(true);
  });

  test('persisted snapshot keeps only one latest snapshot and does not touch unrelated storage', () => {
    const storage = createMemoryFarmRecordsStorage();
    storage.setItem('kasethub.unrelated', 'keep-me');
    const firstSnapshot = buildPreRestoreSnapshot(createDemoFarmRecordsState(), {
      createdAt: '2026-05-25T10:00:00.000+07:00',
    });
    const secondSnapshot = buildPreRestoreSnapshot(createEmptyFarmRecordsState(), {
      createdAt: '2026-05-26T10:00:00.000+07:00',
    });

    expect(storeLastPreRestoreSnapshot(firstSnapshot, storage).ok).toBe(true);
    expect(storeLastPreRestoreSnapshot(secondSnapshot, storage).ok).toBe(true);

    const stored = getLastPreRestoreSnapshot(storage);
    expect(stored?.createdAt).toBe('2026-05-26T10:00:00.000+07:00');
    expect(storage.getItem('kasethub.unrelated')).toBe('keep-me');
    expect(storage.getItem(farmRecordsRestoreSnapshotStorageKey)).toContain('pre_restore_snapshot');
  });
});
