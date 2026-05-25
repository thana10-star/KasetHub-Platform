import type { FarmRecordsStorageAdapter } from '@/services/farm-records/farm-records-service';

export const FARM_RECORDS_SYNC_CONSENT_PROTOTYPE_STORAGE_KEY = 'kasethub.farmRecords.syncConsentPrototype.v1';

export type FarmRecordsSyncConsentPrototypeState = {
  cloudSyncConsentPreview: boolean;
  aiAnalysisConsentPreview: boolean;
  gpsPreciseLocationConsentPreview: boolean;
  imageReceiptUploadConsentPreview: boolean;
  acknowledgedSensitiveFinanceData: boolean;
  acknowledgedLocalOnlyPrototype: boolean;
  updatedAt: string;
};

export type FarmRecordsSyncConsentPrototypeReadiness = {
  storageKey: typeof FARM_RECORDS_SYNC_CONSENT_PROTOTYPE_STORAGE_KEY;
  isPrototypeOnly: true;
  isLegalConsent: false;
  syncEnabled: false;
  canEnableCloudSync: false;
  blockers: string[];
};

export const farmRecordsSyncPrototypeIncludedData = [
  'Farm plots',
  'Crop cycles',
  'Activity records',
  'Finance ledger entries',
  'Harvest/yield records',
  'Image metadata only',
  'Restore/export metadata',
];

export const farmRecordsSyncPrototypeExcludedData = [
  'Raw image files',
  'GPS or precise coordinates',
  'AI analysis history',
  'Device unrelated local storage',
  'Other app data unrelated to Farm Records',
];

export const farmRecordsSyncPrototypeConsentCategories = [
  {
    id: 'cloudSyncConsentPreview',
    label: 'Cloud sync consent',
    detail: 'Future permission for Farm Records to leave this device and copy to a user-owned cloud account.',
  },
  {
    id: 'aiAnalysisConsentPreview',
    label: 'AI analysis consent',
    detail: 'Separate future gate. Cloud sync consent must not allow AI to read Farm Records.',
  },
  {
    id: 'gpsPreciseLocationConsentPreview',
    label: 'GPS/precise location consent',
    detail: 'Separate future gate. Precise location is not used by Farm Records today.',
  },
  {
    id: 'imageReceiptUploadConsentPreview',
    label: 'Image/receipt upload consent',
    detail: 'Separate future gate. Current exports and restore use metadata placeholders only.',
  },
] as const;

const prototypeWarnings = [
  'This is local prototype UI state only and is not legal consent.',
  'Cloud sync is not available and no farm records are uploaded.',
  'Supabase RLS, ownership tests, cloud export/delete, and privacy review are required before sync.',
  'AI, GPS, and image/receipt upload consent must remain separate future gates.',
];

function getBrowserStorage(): FarmRecordsStorageAdapter | undefined {
  if (typeof window === 'undefined') return undefined;
  return window.localStorage;
}

function normalizeBoolean(value: unknown) {
  return value === true;
}

function normalizeState(input: Partial<FarmRecordsSyncConsentPrototypeState> | undefined): FarmRecordsSyncConsentPrototypeState {
  return {
    cloudSyncConsentPreview: normalizeBoolean(input?.cloudSyncConsentPreview),
    aiAnalysisConsentPreview: normalizeBoolean(input?.aiAnalysisConsentPreview),
    gpsPreciseLocationConsentPreview: normalizeBoolean(input?.gpsPreciseLocationConsentPreview),
    imageReceiptUploadConsentPreview: normalizeBoolean(input?.imageReceiptUploadConsentPreview),
    acknowledgedSensitiveFinanceData: normalizeBoolean(input?.acknowledgedSensitiveFinanceData),
    acknowledgedLocalOnlyPrototype: normalizeBoolean(input?.acknowledgedLocalOnlyPrototype),
    updatedAt: typeof input?.updatedAt === 'string' ? input.updatedAt : new Date().toISOString(),
  };
}

export function getDefaultSyncConsentPrototypeState(): FarmRecordsSyncConsentPrototypeState {
  return normalizeState(undefined);
}

export function loadSyncConsentPrototypeState(storage = getBrowserStorage()): FarmRecordsSyncConsentPrototypeState {
  const raw = storage?.getItem(FARM_RECORDS_SYNC_CONSENT_PROTOTYPE_STORAGE_KEY);
  if (!raw) return getDefaultSyncConsentPrototypeState();

  try {
    return normalizeState(JSON.parse(raw) as Partial<FarmRecordsSyncConsentPrototypeState>);
  } catch {
    return getDefaultSyncConsentPrototypeState();
  }
}

export function saveSyncConsentPrototypeState(
  state: Partial<FarmRecordsSyncConsentPrototypeState>,
  storage = getBrowserStorage(),
): FarmRecordsSyncConsentPrototypeState {
  const normalizedState = normalizeState({
    ...state,
    updatedAt: new Date().toISOString(),
  });

  storage?.setItem(FARM_RECORDS_SYNC_CONSENT_PROTOTYPE_STORAGE_KEY, JSON.stringify(normalizedState));
  return normalizedState;
}

export function getSyncConsentPrototypeWarnings() {
  return prototypeWarnings;
}

export function getSyncConsentPrototypeReadiness(): FarmRecordsSyncConsentPrototypeReadiness {
  return {
    storageKey: FARM_RECORDS_SYNC_CONSENT_PROTOTYPE_STORAGE_KEY,
    isPrototypeOnly: true,
    isLegalConsent: false,
    syncEnabled: false,
    canEnableCloudSync: false,
    blockers: [
      'Supabase owner-only RLS is not implemented.',
      'Authenticated ownership tests are not implemented.',
      'Sync queue and idempotency are not implemented.',
      'Cloud export/delete and privacy review are not complete.',
    ],
  };
}
