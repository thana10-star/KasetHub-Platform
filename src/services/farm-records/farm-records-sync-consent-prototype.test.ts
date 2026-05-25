import { describe, expect, test } from 'vitest';
import { createMemoryFarmRecordsStorage, farmRecordsStorageKey } from '@/services/farm-records/farm-records-service';
import {
  FARM_RECORDS_SYNC_CONSENT_PROTOTYPE_STORAGE_KEY,
  getDefaultSyncConsentPrototypeState,
  getSyncConsentPrototypeReadiness,
  getSyncConsentPrototypeWarnings,
  loadSyncConsentPrototypeState,
  saveSyncConsentPrototypeState,
} from '@/services/farm-records/farm-records-sync-consent-prototype';

describe('M89 farm records sync consent prototype state', () => {
  test('defaults to local-only false consent previews', () => {
    const state = getDefaultSyncConsentPrototypeState();

    expect(state.cloudSyncConsentPreview).toBe(false);
    expect(state.aiAnalysisConsentPreview).toBe(false);
    expect(state.gpsPreciseLocationConsentPreview).toBe(false);
    expect(state.imageReceiptUploadConsentPreview).toBe(false);
    expect(state.acknowledgedSensitiveFinanceData).toBe(false);
    expect(state.acknowledgedLocalOnlyPrototype).toBe(false);
    expect(new Date(state.updatedAt).toString()).not.toBe('Invalid Date');
  });

  test('saves and loads prototype state using only the prototype local key', () => {
    const storage = createMemoryFarmRecordsStorage();
    storage.setItem('kasethub.unrelated', 'keep');

    saveSyncConsentPrototypeState(
      {
        cloudSyncConsentPreview: true,
        acknowledgedLocalOnlyPrototype: true,
      },
      storage,
    );

    const loaded = loadSyncConsentPrototypeState(storage);

    expect(loaded.cloudSyncConsentPreview).toBe(true);
    expect(loaded.acknowledgedLocalOnlyPrototype).toBe(true);
    expect(loaded.aiAnalysisConsentPreview).toBe(false);
    expect(storage.getItem(FARM_RECORDS_SYNC_CONSENT_PROTOTYPE_STORAGE_KEY)).toContain('cloudSyncConsentPreview');
    expect(storage.getItem(farmRecordsStorageKey)).toBeNull();
    expect(storage.getItem('kasethub.unrelated')).toBe('keep');
  });

  test('prototype acknowledgements never unlock cloud sync readiness', () => {
    const storage = createMemoryFarmRecordsStorage();
    saveSyncConsentPrototypeState(
      {
        acknowledgedLocalOnlyPrototype: true,
        acknowledgedSensitiveFinanceData: true,
        aiAnalysisConsentPreview: true,
        cloudSyncConsentPreview: true,
        gpsPreciseLocationConsentPreview: true,
        imageReceiptUploadConsentPreview: true,
      },
      storage,
    );

    const readiness = getSyncConsentPrototypeReadiness();

    expect(readiness.isPrototypeOnly).toBe(true);
    expect(readiness.isLegalConsent).toBe(false);
    expect(readiness.syncEnabled).toBe(false);
    expect(readiness.canEnableCloudSync).toBe(false);
  });

  test('warnings clearly state prototype-only and not legal consent boundaries', () => {
    const warnings = getSyncConsentPrototypeWarnings().join(' ');

    expect(warnings).toContain('local prototype');
    expect(warnings).toContain('not legal consent');
    expect(warnings).toContain('Cloud sync is not available');
    expect(warnings).toContain('no farm records are uploaded');
  });

  test('readiness reports sync disabled with ownership and privacy blockers', () => {
    const readiness = getSyncConsentPrototypeReadiness();

    expect(readiness.storageKey).toBe(FARM_RECORDS_SYNC_CONSENT_PROTOTYPE_STORAGE_KEY);
    expect(readiness.blockers.join(' ')).toContain('RLS');
    expect(readiness.blockers.join(' ')).toContain('ownership');
    expect(readiness.blockers.join(' ')).toContain('privacy review');
  });

  test('malformed prototype local state falls back without throwing', () => {
    const storage = createMemoryFarmRecordsStorage();
    storage.setItem(FARM_RECORDS_SYNC_CONSENT_PROTOTYPE_STORAGE_KEY, '{bad-json');

    const state = loadSyncConsentPrototypeState(storage);

    expect(state.cloudSyncConsentPreview).toBe(false);
    expect(state.acknowledgedLocalOnlyPrototype).toBe(false);
  });
});
