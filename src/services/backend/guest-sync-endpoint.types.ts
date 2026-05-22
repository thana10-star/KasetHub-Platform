import type { AuthProviderType } from '@/services/backend/backend.types';
import type { SyncConflictPolicy } from '@/services/backend/sync.types';
import type {
  FarmHistoryRecord,
  FollowedTopic,
  LikeItem,
  RecentAIQuestion,
  SavedItem,
} from '@/services/guest-memory/guest-memory.types';

export type GuestSyncAuthProviderCandidate = Extract<AuthProviderType, 'phone' | 'line' | 'google'>;

export type GuestSyncConsentOptions = {
  savedItems: boolean;
  farmRecords: boolean;
  recentAIQuestions: boolean;
};

export type GuestSyncRecordCounts = {
  savedItems: number;
  likes: number;
  followedTopics: number;
  farmRecords: number;
  recentAIQuestions: number;
  estimatedTotal: number;
};

export type GuestMemorySyncRequestPayload = {
  endpointVersion: '2026-05-m07';
  dryRun: boolean;
  guestId: string;
  authProviderCandidate: GuestSyncAuthProviderCandidate;
  consent: GuestSyncConsentOptions;
  localState: {
    version: number;
    updatedAt: string;
  };
  records: {
    savedItems: SavedItem[];
    likes: LikeItem[];
    followedTopics: FollowedTopic[];
    farmRecords: FarmHistoryRecord[];
    recentAIQuestions: RecentAIQuestion[];
  };
  conflictPolicy: SyncConflictPolicy;
};

export type GuestMemorySyncResponsePayload = {
  success: boolean;
  syncRunId: string;
  dryRun: boolean;
  userId?: string;
  linkedGuestId: string;
  created: GuestSyncRecordCounts;
  merged: GuestSyncRecordCounts;
  skipped: GuestSyncRecordCounts;
  warnings: string[];
  nextAction: 'continue_guest' | 'complete_auth' | 'retry_sync' | 'sync_complete';
};

export type GuestSyncPayloadPreview = {
  payload: GuestMemorySyncRequestPayload;
  estimatedRecordCount: number;
  counts: GuestSyncRecordCounts;
  warnings: string[];
  blockedReasons: string[];
  canSubmit: boolean;
};
