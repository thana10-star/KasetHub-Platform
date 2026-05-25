import type { CalculatorResultSummary } from '@/services/agri-calculators/calculator-result-summary.types';
import type { CropWatch } from '@/services/crop-prices/crop-watch.types';
import type {
  FarmHistoryRecord,
  FollowedTopic,
  GuestMemoryState,
  LikeItem,
  RecentAIQuestion,
  SavedItem,
} from '@/services/guest-memory/guest-memory.types';
import type { PhoneAuthMockSession } from '@/services/auth/phone-auth.types';
import type { PhoneAuthStagingSessionPreview } from '@/services/auth/phone-auth-staging-adapter.types';

export type GuestSyncDryRunRecordGroupKey =
  | 'savedItems'
  | 'farmRecords'
  | 'recentAiQuestions'
  | 'cropWatches'
  | 'calculatorSavedResults'
  | 'followedTopics'
  | 'likes';

export type GuestSyncDryRunConsentInput = Record<GuestSyncDryRunRecordGroupKey, boolean>;

export type GuestSyncDryRunRecordPreview = {
  localId: string;
  title: string;
  sourceRoute: string;
  createdAt: string;
  safeSummary: string;
  metadataPreview: Record<string, unknown>;
};

export type GuestSyncDryRunRecordGroup = {
  key: GuestSyncDryRunRecordGroupKey;
  label: string;
  count: number;
  consentRequired: boolean;
  consentGranted: boolean;
  includedInPayload: boolean;
  conflictPolicy: string;
  records: GuestSyncDryRunRecordPreview[];
};

export type GuestSyncDryRunConsentPreview = {
  accepted: boolean;
  acceptedAtPreview: string | null;
  checklist: Array<{
    id: string;
    label: string;
    status: 'ready' | 'missing' | 'planned';
    detail: string;
  }>;
  localOnlyWarning: string;
};

export type GuestSyncDryRunIdempotencyPreview = {
  syncRequestId: string;
  idempotencyKey: string;
  duplicateHandlingPreview: string[];
  keyScope: 'guest_plus_owner_preview';
  ready: true;
};

export type GuestSyncDryRunAuditPreview = {
  auditEventId: string;
  wouldWriteAuditLog: false;
  eventTypes: string[];
  maskedOwnerId: string | null;
  recordCount: number;
  generatedAt: string;
};

export type GuestSyncDryRunConflictPreview = {
  policies: Array<{
    groupKey: GuestSyncDryRunRecordGroupKey;
    policy: string;
    duplicateKey: string;
  }>;
  warnings: string[];
};

export type GuestSyncDryRunOwnerScope = {
  realSessionDetected: boolean;
  mockSessionDetected: boolean;
  ownerVerifiedForUpload: false;
  maskedOwnerId: string | null;
  authUidExpectation: string;
  syncAllowedByOwnershipGate: false;
};

export type GuestSyncDryRunBlocker = {
  id: string;
  label: string;
  detail: string;
};

export type GuestSyncDryRunPayload = {
  version: '2026-05-m64';
  generatedAt: string;
  dryRun: true;
  uploadAllowed: false;
  noSupabaseWrite: true;
  noCloudSync: true;
  noRawPhotos: true;
  guestId: string;
  ownerScope: GuestSyncDryRunOwnerScope;
  consentPreview: GuestSyncDryRunConsentPreview;
  idempotencyPreview: GuestSyncDryRunIdempotencyPreview;
  auditPreview: GuestSyncDryRunAuditPreview;
  conflictPreview: GuestSyncDryRunConflictPreview;
  groups: Record<GuestSyncDryRunRecordGroupKey, GuestSyncDryRunRecordGroup>;
  blockers: GuestSyncDryRunBlocker[];
  privacyFilterNotes: string[];
  excludedSensitiveFields: string[];
  totalLocalRecords: number;
  totalIncludedRecords: number;
  nextSafeStep: string;
};

export type BuildGuestSyncDryRunPayloadInput = {
  guestMemory: GuestMemoryState;
  cropWatches?: CropWatch[];
  calculatorSavedResults?: CalculatorResultSummary[];
  consent?: Partial<GuestSyncDryRunConsentInput>;
  phoneMockSession?: PhoneAuthMockSession | null;
  supabaseSessionPreview?: PhoneAuthStagingSessionPreview | null;
  generatedAt?: string;
};

export type GuestSyncDryRunSensitiveValueInput =
  | SavedItem
  | FarmHistoryRecord
  | RecentAIQuestion
  | CropWatch
  | CalculatorResultSummary
  | FollowedTopic
  | LikeItem
  | Record<string, unknown>;
