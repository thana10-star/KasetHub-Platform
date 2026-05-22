import type {
  GuestMemorySyncRequestPayload,
  GuestSyncAuthProviderCandidate,
  GuestSyncConsentOptions,
  GuestSyncRecordCounts,
} from '@/services/backend/guest-sync-endpoint.types';

export type GuestSyncMockScenario =
  | 'success'
  | 'partial_success'
  | 'duplicate_merge'
  | 'missing_consent'
  | 'failed_retryable';

export type GuestSyncStatus = 'success' | 'partial_success' | 'rejected' | 'failed';

export type GuestSyncRecordType =
  | 'saved_items'
  | 'likes'
  | 'followed_topics'
  | 'farm_records'
  | 'recent_ai_questions';

export type MockGuestSyncRequest = {
  payload: GuestMemorySyncRequestPayload;
  authProviderCandidate: GuestSyncAuthProviderCandidate;
  dryRun: boolean;
  consent: GuestSyncConsentOptions;
  localRecordCounts: GuestSyncRecordCounts;
  scenario?: GuestSyncMockScenario;
  metadata?: Record<string, unknown>;
};

export type GuestSyncProfilePreview = {
  userId: string;
  displayName: string;
  authProvider: GuestSyncAuthProviderCandidate;
  linkedGuestId: string;
  isNewProfile: boolean;
};

export type GuestSyncMergeSummary = {
  totalReceived: number;
  recordsToCreate: GuestSyncRecordCounts;
  recordsToMerge: GuestSyncRecordCounts;
  recordsSkipped: GuestSyncRecordCounts;
  wouldWriteTables: string[];
};

export type GuestSyncSkippedRecord = {
  recordType: GuestSyncRecordType;
  count: number;
  reason: string;
};

export type GuestSyncConflictSummary = {
  duplicateSavedItemsMerged: number;
  duplicateLikesMerged: number;
  followedTopicsMerged: number;
  farmRecordsKeptBoth: number;
  aiHistorySkipped: number;
  profileResolution: 'cloud_wins_guest_name_suggested' | 'new_profile_preview' | 'blocked_until_consent';
};

export type MockGuestSyncResponse = {
  syncRequestId: string;
  status: GuestSyncStatus;
  dryRun: boolean;
  authProviderCandidate: GuestSyncAuthProviderCandidate;
  createdProfilePreview?: GuestSyncProfilePreview;
  mergeSummary: GuestSyncMergeSummary;
  skippedRecords: GuestSyncSkippedRecord[];
  conflictSummary: GuestSyncConflictSummary;
  warnings: string[];
  retryable: boolean;
  createdAt: string;
};

export type MockGuestSyncHandlerResult = {
  adapterPath: 'local_fixture' | 'local_backend_handler' | 'disabled_response';
  accepted: boolean;
  response: MockGuestSyncResponse;
};
