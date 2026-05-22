import type {
  GuestSyncAuthProviderCandidate,
  GuestSyncConsentOptions,
  GuestSyncPayloadPreview,
  GuestSyncRecordCounts,
} from '@/services/backend/guest-sync-endpoint.types';
import type { SyncConflictPolicy } from '@/services/backend/sync.types';
import type { GuestMemoryState } from '@/services/guest-memory/guest-memory.types';

const conflictPolicy: SyncConflictPolicy = {
  savedItems: 'merge_by_item_type_and_item_id',
  likes: 'or_true_wins',
  followedTopics: 'merge_by_topic_id',
  farmRecords: 'keep_both_unless_same_local_id',
  recentAIQuestions: 'optional_user_consent',
  profile: 'cloud_wins_guest_name_suggested',
};

function createCounts(input: Omit<GuestSyncRecordCounts, 'estimatedTotal'>): GuestSyncRecordCounts {
  return {
    ...input,
    estimatedTotal:
      input.savedItems + input.likes + input.followedTopics + input.farmRecords + input.recentAIQuestions,
  };
}

export function buildGuestSyncPayloadPreview(
  guestMemory: GuestMemoryState,
  consent: GuestSyncConsentOptions,
  authProviderCandidate: GuestSyncAuthProviderCandidate,
): GuestSyncPayloadPreview {
  const warnings: string[] = [];
  const blockedReasons: string[] = [];
  const hasSavedMemory =
    guestMemory.savedItems.length > 0 || guestMemory.likes.length > 0 || guestMemory.followedTopics.length > 0;

  if (hasSavedMemory && !consent.savedItems) {
    blockedReasons.push('ต้องยอมรับให้สำรองข้อมูลที่บันทึกไว้ก่อนเริ่มซิงก์');
  }

  if (guestMemory.farmRecords.length > 0 && !consent.farmRecords) {
    blockedReasons.push('ต้องยอมรับให้ซิงก์ประวัติฟาร์มก่อนเริ่มซิงก์');
  }

  if (guestMemory.recentAIQuestions.length > 0 && !consent.recentAIQuestions) {
    warnings.push('ประวัติคำถาม AI จะไม่ถูกซิงก์ เพราะเป็นข้อมูลที่เลือกได้');
  }

  if (!hasSavedMemory && guestMemory.farmRecords.length === 0 && guestMemory.recentAIQuestions.length === 0) {
    warnings.push('ยังไม่มีข้อมูล Guest Memory สำหรับสำรอง');
  }

  const records = {
    savedItems: consent.savedItems ? guestMemory.savedItems : [],
    likes: consent.savedItems ? guestMemory.likes : [],
    followedTopics: consent.savedItems ? guestMemory.followedTopics : [],
    farmRecords: consent.farmRecords ? guestMemory.farmRecords : [],
    recentAIQuestions: consent.recentAIQuestions ? guestMemory.recentAIQuestions : [],
  };

  const counts = createCounts({
    savedItems: records.savedItems.length,
    likes: records.likes.length,
    followedTopics: records.followedTopics.length,
    farmRecords: records.farmRecords.length,
    recentAIQuestions: records.recentAIQuestions.length,
  });

  return {
    payload: {
      endpointVersion: '2026-05-m07',
      dryRun: true,
      guestId: guestMemory.profile.guestId,
      authProviderCandidate,
      consent,
      localState: {
        version: guestMemory.version,
        updatedAt: guestMemory.updatedAt,
      },
      records,
      conflictPolicy,
    },
    estimatedRecordCount: counts.estimatedTotal,
    counts,
    warnings,
    blockedReasons,
    canSubmit: blockedReasons.length === 0 && counts.estimatedTotal > 0,
  };
}
