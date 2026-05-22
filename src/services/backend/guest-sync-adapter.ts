import { publicEnv } from '@/config/env';
import type { GuestSyncRecordCounts } from '@/services/backend/guest-sync-endpoint.types';
import type {
  GuestSyncAdapter,
  GuestSyncAdapterStatus,
  GuestSyncMode,
  RunGuestSyncInput,
} from '@/services/backend/guest-sync-adapter.types';
import { handleMockGuestSyncRequest } from '@/server/guest-sync/mock-guest-sync-handler';
import type { MockGuestSyncResponse } from '@/server/guest-sync/mock-guest-sync.types';

const guestSyncStatusStorageKey = 'kasethub.guestSync.lastStatus.v1';

const supportedProviders: GuestSyncAdapterStatus['supportedProviders'] = ['phone', 'line', 'google'];
const supportedRecordTypes = ['saved_items', 'likes', 'followed_topics', 'farm_records', 'recent_ai_questions'];

function normalizeMode(value: string): GuestSyncMode {
  if (value === 'backend_test_disabled' || value === 'backend_test_ready' || value === 'production_disabled') {
    return value;
  }

  return 'local_fixture';
}

export function getGuestSyncMode(): GuestSyncMode {
  return normalizeMode(publicEnv.guestSyncMode);
}

function canUseStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage);
}

function readLastSyncStatus(): GuestSyncAdapterStatus['lastSyncStatus'] {
  if (!canUseStorage()) {
    return undefined;
  }

  try {
    const raw = window.localStorage.getItem(guestSyncStatusStorageKey);
    return raw ? (JSON.parse(raw) as GuestSyncAdapterStatus['lastSyncStatus']) : undefined;
  } catch {
    return undefined;
  }
}

function recordLastSyncStatus(response: MockGuestSyncResponse, mode: GuestSyncMode) {
  if (!canUseStorage()) {
    return;
  }

  try {
    window.localStorage.setItem(
      guestSyncStatusStorageKey,
      JSON.stringify({
        syncRequestId: response.syncRequestId,
        status: response.status,
        mode,
        createdAt: response.createdAt,
      }),
    );
  } catch {
    // Helpful for status UI, but never required for local data safety.
  }
}

function getModeLabel(mode: GuestSyncMode) {
  const labels: Record<GuestSyncMode, string> = {
    local_fixture: 'Local fixture',
    backend_test_disabled: 'Backend test disabled',
    backend_test_ready: 'Backend test ready',
    production_disabled: 'Production disabled',
  };

  return labels[mode];
}

function getAdapterPath(mode: GuestSyncMode): GuestSyncAdapterStatus['currentAdapterPath'] {
  if (mode === 'local_fixture') {
    return 'local_fixture';
  }

  if (mode === 'backend_test_ready' && publicEnv.enableGuestSyncBackend && publicEnv.enableLocalGuestSyncHandler) {
    return 'local_backend_handler';
  }

  return 'disabled_response';
}

export function getGuestSyncAdapterStatus(): GuestSyncAdapterStatus {
  const mode = getGuestSyncMode();
  const currentAdapterPath = getAdapterPath(mode);
  const canUseLocalHandler = currentAdapterPath === 'local_backend_handler';
  const environmentReadiness: GuestSyncAdapterStatus['environmentReadiness'] =
    mode === 'local_fixture'
      ? 'local_fixture_active'
      : mode === 'production_disabled'
        ? 'production_disabled'
        : canUseLocalHandler
          ? 'backend_test_ready_local_handler'
          : mode === 'backend_test_ready'
            ? 'backend_test_ready_no_fetch'
            : 'backend_disabled';

  const readinessLabel: Record<GuestSyncAdapterStatus['environmentReadiness'], string> = {
    local_fixture_active: 'ใช้ sync fixture ในเครื่องอยู่',
    backend_disabled: 'guest sync backend ยังปิดอยู่',
    backend_test_ready_no_fetch: 'backend_test_ready แต่ยังไม่เปิด local handler ครบทุก flag',
    backend_test_ready_local_handler: 'ใช้ local guest sync handler จำลองแบบ in-process',
    production_disabled: 'ปิด production sync',
  };

  return {
    mode,
    modeLabel: getModeLabel(mode),
    backendSyncEnabled: publicEnv.enableGuestSyncBackend,
    localHandlerEnabled: publicEnv.enableLocalGuestSyncHandler,
    canUseLocalFixture: mode === 'local_fixture',
    canAttemptBackend: mode === 'backend_test_ready' && publicEnv.enableGuestSyncBackend,
    canUseLocalHandler,
    serviceRoleAvailableInFrontend: false,
    networkCallsEnabled: false,
    currentAdapterPath,
    environmentReadiness,
    readinessLabel: readinessLabel[environmentReadiness],
    supportedProviders,
    supportedRecordTypes,
    lastSyncStatus: readLastSyncStatus(),
    warnings: [
      'M16 ไม่มี network request จริง',
      'Guest Memory ในเครื่องนี้ยังเป็น source of truth',
      'service-role key ต้องอยู่ backend/edge function เท่านั้น',
    ],
  };
}

function createRequestId(prefix: string) {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function emptyCounts(): GuestSyncRecordCounts {
  return {
    savedItems: 0,
    likes: 0,
    followedTopics: 0,
    farmRecords: 0,
    recentAIQuestions: 0,
    estimatedTotal: 0,
  };
}

function createDisabledResponse(input: RunGuestSyncInput, mode: GuestSyncMode): MockGuestSyncResponse {
  const createdAt = new Date().toISOString();

  return {
    syncRequestId: createRequestId('guest-sync-disabled'),
    status: 'failed',
    dryRun: true,
    authProviderCandidate: input.payload.authProviderCandidate,
    mergeSummary: {
      totalReceived: input.payload.records.savedItems.length + input.payload.records.likes.length,
      recordsToCreate: emptyCounts(),
      recordsToMerge: emptyCounts(),
      recordsSkipped: emptyCounts(),
      wouldWriteTables: [],
    },
    skippedRecords: [],
    conflictSummary: {
      duplicateSavedItemsMerged: 0,
      duplicateLikesMerged: 0,
      followedTopicsMerged: 0,
      farmRecordsKeptBoth: 0,
      aiHistorySkipped: 0,
      profileResolution: 'blocked_until_consent',
    },
    warnings: [
      mode === 'backend_test_ready'
        ? 'backend_test_ready แล้ว แต่ยังต้องเปิด VITE_ENABLE_GUEST_SYNC_BACKEND=true และ VITE_ENABLE_LOCAL_GUEST_SYNC_HANDLER=true'
        : 'guest sync backend ถูกปิดในโหมดนี้',
      'ไม่มี fetch และไม่มีการเขียนข้อมูลจริง',
      'Guest Memory ในเครื่องนี้ไม่ถูกลบ',
    ],
    retryable: mode === 'backend_test_ready',
    createdAt,
  };
}

function countsFromPayload(input: RunGuestSyncInput): GuestSyncRecordCounts {
  const { records } = input.payload;

  return {
    savedItems: records.savedItems.length,
    likes: records.likes.length,
    followedTopics: records.followedTopics.length,
    farmRecords: records.farmRecords.length,
    recentAIQuestions: records.recentAIQuestions.length,
    estimatedTotal:
      records.savedItems.length +
      records.likes.length +
      records.followedTopics.length +
      records.farmRecords.length +
      records.recentAIQuestions.length,
  };
}

export const guestSyncAdapter: GuestSyncAdapter = {
  runDryRun(input) {
    const mode = getGuestSyncMode();
    const currentAdapterPath = getAdapterPath(mode);

    if (mode !== 'local_fixture' && currentAdapterPath !== 'local_backend_handler') {
      const response = createDisabledResponse(input, mode);
      recordLastSyncStatus(response, mode);
      return response;
    }

    const result = handleMockGuestSyncRequest({
      payload: input.payload,
      authProviderCandidate: input.payload.authProviderCandidate,
      dryRun: true,
      consent: input.payload.consent,
      localRecordCounts: countsFromPayload(input),
      scenario: input.scenario,
      metadata: {
        adapterPath: currentAdapterPath,
      },
    });

    recordLastSyncStatus(result.response, mode);
    return result.response;
  },

  getStatus: getGuestSyncAdapterStatus,
};

export const runGuestMemorySyncDryRun = guestSyncAdapter.runDryRun;
