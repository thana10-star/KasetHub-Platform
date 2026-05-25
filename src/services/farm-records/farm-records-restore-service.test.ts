import { describe, expect, test } from 'vitest';
import {
  buildFarmRecordsJsonBackup,
  stringifyFarmRecordsJsonBackup,
} from '@/services/farm-records/farm-records-export-service';
import {
  applyFarmRecordsRestore,
  buildFarmRecordsRestorePreview,
  farmRecordsRestoreConfirmationPhrase,
  parseFarmRecordsJsonBackup,
  validateFarmRecordsBackup,
} from '@/services/farm-records/farm-records-restore-service';
import { getFarmRecordsSyncReadiness } from '@/services/farm-records/farm-records-sync-consent-gate';
import { createDemoFarmRecordsState } from '@/services/farm-records/farm-records-fixtures';
import {
  createEmptyFarmRecordsState,
  createFarmRecordsService,
  createMemoryFarmRecordsStorage,
  farmRecordsStorageKey,
} from '@/services/farm-records/farm-records-service';

describe('M87 farm records local restore helpers', () => {
  test('returns parse failure for invalid JSON without throwing', () => {
    const parsed = parseFarmRecordsJsonBackup('{not-json');

    expect(parsed.ok).toBe(false);
    if (!parsed.ok) {
      expect(parsed.error).toContain('Invalid JSON backup');
    }
  });

  test('fails validation for non-farm-records JSON', () => {
    const validation = validateFarmRecordsBackup({
      appFeature: 'other_feature',
      exportVersion: 1,
      farmPlots: [],
      cropCycles: [],
      farmActivityRecords: [],
      farmFinanceEntries: [],
    });

    expect(validation.isValid).toBe(false);
    expect(validation.errors).toContain('Backup appFeature must be farm_records.');
  });

  test('validates an M86 JSON backup and builds restore preview counts', () => {
    const currentState = createEmptyFarmRecordsState();
    const backup = buildFarmRecordsJsonBackup({
      state: createDemoFarmRecordsState(),
      exportedAt: '2026-05-25T10:00:00.000+07:00',
    });
    const parsed = parseFarmRecordsJsonBackup(stringifyFarmRecordsJsonBackup(backup));

    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;

    const validation = validateFarmRecordsBackup(parsed.parsedBackup);
    expect(validation.isValid).toBe(true);
    expect(validation.detectedCounts.farmPlotCount).toBe(2);
    expect(validation.detectedSummary.netProfit).toBe(22100);

    const preview = buildFarmRecordsRestorePreview(currentState, validation.normalizedState!);
    expect(preview.currentCounts.farmPlotCount).toBe(0);
    expect(preview.backupCounts.financeEntryCount).toBeGreaterThan(0);
    expect(preview.differenceCounts.activityRecordCount).toBeGreaterThan(0);
    expect(preview.restoreModeOptions).toEqual(['replace_local_farm_records']);
  });

  test('strips raw data URI image payloads from restore candidates', () => {
    const backup = buildFarmRecordsJsonBackup({ state: createDemoFarmRecordsState() });
    backup.farmActivityRecords[0] = {
      ...backup.farmActivityRecords[0]!,
      imageRefs: [
        {
          caption: 'metadata only',
          createdAt: '2026-05-25T10:00:00.000+07:00',
          id: 'restore-image-demo',
          localUri: 'data:image/png;base64,raw',
        },
      ],
    };

    const validation = validateFarmRecordsBackup(backup);
    expect(validation.isValid).toBe(true);
    expect(validation.warnings.join(' ')).toContain('Raw data URI');
    expect(JSON.stringify(validation.normalizedState)).not.toContain('data:image');
    expect(validation.normalizedState?.farmActivityRecords[0].imageRefs?.[0].caption).toBe('metadata only');
  });

  test('does not preserve GPS or geolocation-like fields', () => {
    const backup = buildFarmRecordsJsonBackup({ state: createDemoFarmRecordsState() });
    (backup.farmPlots[0]! as unknown as Record<string, unknown>).latitude = 13.7563;
    (backup.farmPlots[0]! as unknown as Record<string, unknown>).longitude = 100.5018;

    const validation = validateFarmRecordsBackup(backup);

    expect(validation.isValid).toBe(true);
    expect(validation.warnings.join(' ')).toContain('GPS/geolocation-like fields');
    expect(JSON.stringify(validation.normalizedState)).not.toContain('latitude');
    expect(JSON.stringify(validation.normalizedState)).not.toContain('longitude');
  });

  test('fails validation for negative finance amounts', () => {
    const backup = buildFarmRecordsJsonBackup({ state: createDemoFarmRecordsState() });
    backup.farmFinanceEntries[0] = {
      ...backup.farmFinanceEntries[0]!,
      amount: -1,
    };

    const validation = validateFarmRecordsBackup(backup);

    expect(validation.isValid).toBe(false);
    expect(validation.errors).toContain('farmFinanceEntries[0] requires a numeric non-negative amount.');
  });

  test('requires explicit confirmation and phrase before local restore', () => {
    const validation = validateFarmRecordsBackup(buildFarmRecordsJsonBackup({ state: createDemoFarmRecordsState() }));

    expect(validation.normalizedState).toBeDefined();
    expect(
      applyFarmRecordsRestore(validation.normalizedState!, {
        mode: 'replace_local_farm_records',
        confirmed: false,
        confirmationPhrase: farmRecordsRestoreConfirmationPhrase,
      }).ok,
    ).toBe(false);

    expect(
      applyFarmRecordsRestore(validation.normalizedState!, {
        mode: 'replace_local_farm_records',
        confirmed: true,
        confirmationPhrase: 'wrong phrase',
      }).ok,
    ).toBe(false);
  });

  test('applies confirmed local restore without touching unrelated local storage keys', () => {
    const validation = validateFarmRecordsBackup(buildFarmRecordsJsonBackup({ state: createDemoFarmRecordsState() }));
    const storage = createMemoryFarmRecordsStorage(createEmptyFarmRecordsState());
    storage.setItem('kasethub.unrelated', 'keep-me');

    const result = applyFarmRecordsRestore(validation.normalizedState!, {
      mode: 'replace_local_farm_records',
      confirmed: true,
      confirmationPhrase: farmRecordsRestoreConfirmationPhrase,
      storage,
    });

    expect(result.ok).toBe(true);
    expect(storage.getItem('kasethub.unrelated')).toBe('keep-me');
    expect(storage.getItem(farmRecordsStorageKey)).toContain('farmPlots');

    const service = createFarmRecordsService(storage);
    expect(service.getState().farmPlots).toHaveLength(2);
    if (result.ok) {
      expect(buildFarmRecordsJsonBackup({ state: result.restoredState }).summary.netProfit).toBe(22100);
    }
  });

  test('sync consent gate remains disabled and future-facing', () => {
    const readiness = getFarmRecordsSyncReadiness();

    expect(readiness.canSync).toBe(false);
    expect(readiness.cloudSyncEnabled).toBe(false);
    expect(readiness.supabaseWritesEnabled).toBe(false);
    expect(readiness.gpsUsed).toBe(false);
    expect(readiness.aiAccessEnabled).toBe(false);
    expect(readiness.readinessChecklist.find((item) => item.id === 'local-export')?.status).toBe('ready');
    expect(readiness.readinessChecklist.find((item) => item.id === 'user-cloud-consent')?.status).toBe('prototype_only');
    expect(readiness.readinessChecklist.find((item) => item.id === 'owner-rls-design')?.status).toBe('documented_only');
    expect(readiness.readinessChecklist.find((item) => item.id === 'sync-queue')?.status).toBe('not_implemented');
    expect(readiness.readinessChecklist.find((item) => item.id === 'production-privacy-policy')?.status).toBe('not_implemented');
    expect(readiness.readinessChecklist.find((item) => item.id === 'ai-consent')?.status).toBe('separate_future_gate');
    expect(readiness.requirements.some((requirement) => requirement.id === 'owner-only-rls')).toBe(true);
    expect(readiness.requirements.some((requirement) => requirement.id === 'separate-ai-consent')).toBe(true);
  });
});
