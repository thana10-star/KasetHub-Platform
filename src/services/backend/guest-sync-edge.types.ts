import type {
  GuestMemorySyncRequestPayload,
  GuestSyncAuthProviderCandidate,
  GuestSyncRecordCounts,
} from '@/services/backend/guest-sync-endpoint.types';

export type GuestSyncEdgeMode = 'disabled' | 'contract_only' | 'staging_ready' | 'production_disabled';

export type GuestSyncIdempotencyKey = string;

export type GuestSyncAuthContext = {
  userId: string;
  provider: GuestSyncAuthProviderCandidate;
  sessionIssuedAt?: string;
  sessionExpiresAt?: string;
  phoneNumberMasked?: string;
  lineUserId?: string;
  emailMasked?: string;
  isStagingTest: boolean;
};

export type GuestSyncEdgeRequest = {
  endpointVersion: '2026-05-m29';
  endpointName: 'guest-memory-sync';
  method: 'POST';
  idempotencyKey: GuestSyncIdempotencyKey;
  auth: GuestSyncAuthContext;
  payload: GuestMemorySyncRequestPayload;
  requestedAt: string;
  client: {
    appVersion: string;
    route: string;
  };
};

export type GuestSyncValidationResult = {
  valid: boolean;
  errors: string[];
  warnings: string[];
  consentAccepted: boolean;
  ownerVerified: boolean;
  payloadVersionAccepted: boolean;
  recordCount: GuestSyncRecordCounts;
};

export type GuestSyncMergeResult = {
  created: GuestSyncRecordCounts;
  merged: GuestSyncRecordCounts;
  skipped: GuestSyncRecordCounts;
  duplicateSavedItemsMerged: number;
  duplicateLikesMerged: number;
  followedTopicsMerged: number;
  farmRecordsKeptBoth: number;
  aiHistorySkipped: number;
};

export type GuestSyncRollbackPlan = {
  canRollback: boolean;
  strategy: 'manual_cleanup' | 'idempotency_replay_noop' | 'compensating_delete_review';
  steps: string[];
  auditLogRequired: boolean;
};

export type GuestSyncEdgeResponse = {
  success: boolean;
  syncRunId: string;
  idempotencyKey: GuestSyncIdempotencyKey;
  userId: string;
  status: 'completed' | 'partial_success' | 'rejected' | 'failed_retryable';
  validation: GuestSyncValidationResult;
  mergeResult: GuestSyncMergeResult;
  rollbackPlan: GuestSyncRollbackPlan;
  warnings: string[];
  createdAt: string;
};

export type GuestSyncStagingReadinessStatus = 'pass' | 'warn' | 'block';

export type GuestSyncStagingReadinessLevel = 'local_only' | 'contract_ready' | 'staging_blocked';

export type GuestSyncStagingReadinessArea =
  | 'edge_contract'
  | 'auth_session'
  | 'service_role_boundary'
  | 'idempotency'
  | 'merge_rules'
  | 'consent'
  | 'rollback'
  | 'feature_flags'
  | 'schema_rls'
  | 'production_blockers';

export type GuestSyncStagingReadinessItem = {
  id: string;
  area: GuestSyncStagingReadinessArea;
  title: string;
  detail: string;
  status: GuestSyncStagingReadinessStatus;
  evidence: string;
  nextAction?: string;
};

export type GuestSyncStagingReadiness = {
  generatedAt: string;
  score: number;
  level: GuestSyncStagingReadinessLevel;
  levelLabel: string;
  endpointName: 'guest-memory-sync';
  method: 'POST';
  flags: {
    enableSupabase: boolean;
    enableAuth: boolean;
    enableCloudSync: boolean;
    enableGuestSyncBackend: boolean;
    enableGuestSyncEdge: boolean;
    guestSyncMode: string;
    guestSyncEdgeMode: string;
  };
  idempotencyPreview: GuestSyncIdempotencyKey;
  requestShape: Pick<GuestSyncEdgeRequest, 'endpointVersion' | 'endpointName' | 'method'>;
  notices: string[];
  items: GuestSyncStagingReadinessItem[];
  passedItems: GuestSyncStagingReadinessItem[];
  warningItems: GuestSyncStagingReadinessItem[];
  blockerItems: GuestSyncStagingReadinessItem[];
  stagingTestChecklist: string[];
  productionBlockers: string[];
  securityBoundaries: string[];
};
