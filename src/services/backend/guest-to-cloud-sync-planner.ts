import type {
  CloudFarmRecord,
  CloudFollowedTopic,
  CloudLike,
  CloudRecentAIQuestion,
  CloudSavedItem,
} from '@/services/backend/backend.types';
import type { GuestToCloudSyncPlan, SyncConflictPolicy } from '@/services/backend/sync.types';
import type { GuestMemoryState } from '@/services/guest-memory/guest-memory.types';

const conflictPolicy: SyncConflictPolicy = {
  savedItems: 'merge_by_item_type_and_item_id',
  likes: 'or_true_wins',
  followedTopics: 'merge_by_topic_id',
  farmRecords: 'keep_both_unless_same_local_id',
  recentAIQuestions: 'optional_user_consent',
  profile: 'cloud_wins_guest_name_suggested',
};

function now() {
  return new Date().toISOString();
}

function createCloudId(prefix: string, localId: string) {
  return `${prefix}_${localId.replace(/[^a-zA-Z0-9_-]/g, '_')}`;
}

export function createGuestToCloudSyncPlan(guestMemory: GuestMemoryState): GuestToCloudSyncPlan {
  const generatedAt = now();
  const guestId = guestMemory.profile.guestId;
  const warnings: string[] = [];

  if (guestMemory.recentAIQuestions.length > 0) {
    warnings.push('ประวัติคำถาม AI ควรซิงก์เฉพาะเมื่อผู้ใช้ยินยอม');
  }

  if (guestMemory.savedItems.length === 0 && guestMemory.likes.length === 0 && guestMemory.followedTopics.length === 0) {
    warnings.push('ยังไม่มีข้อมูล guest memory สำคัญสำหรับซิงก์');
  }

  const savedItemsToCreate: CloudSavedItem[] = guestMemory.savedItems.map((item) => ({
    ...item,
    cloudId: createCloudId('saved', item.id),
    userId: 'future-user-id',
    localId: item.id,
    syncSource: 'guest_memory',
    status: 'active',
    syncedAt: generatedAt,
  }));

  const likesToCreate: CloudLike[] = guestMemory.likes.map((item) => ({
    ...item,
    cloudId: createCloudId('like', item.id),
    userId: 'future-user-id',
    localId: item.id,
    status: 'active',
    syncedAt: generatedAt,
  }));

  const topicsToFollow: CloudFollowedTopic[] = guestMemory.followedTopics.map((topic) => ({
    ...topic,
    cloudId: createCloudId('topic', topic.id),
    userId: 'future-user-id',
    localId: topic.id,
    status: 'active',
    syncedAt: generatedAt,
  }));

  const farmRecordsToCreate: CloudFarmRecord[] = guestMemory.farmRecords.map((record) => ({
    cloudId: createCloudId('farm', record.id),
    userId: 'future-user-id',
    localId: record.id,
    cropName: record.cropName,
    diseaseName: record.diseaseName,
    date: record.date,
    confidence: record.confidence,
    symptomsSummary: record.symptomsSummary,
    treatmentSummary: record.treatmentSummary,
    status: record.status,
    sourceRoute: record.sourceRoute,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    syncedAt: generatedAt,
    metadata: record.metadata,
  }));

  const recentAIQuestionsToCreate: CloudRecentAIQuestion[] = guestMemory.recentAIQuestions.map((question) => ({
    ...question,
    cloudId: createCloudId('ai_question', question.id),
    userId: 'future-user-id',
    localId: question.id,
    syncedAt: generatedAt,
    consentToSync: false,
  }));

  const estimatedRecords =
    savedItemsToCreate.length +
    likesToCreate.length +
    topicsToFollow.length +
    farmRecordsToCreate.length +
    recentAIQuestionsToCreate.length;

  return {
    guestId,
    generatedAt,
    savedItemsToCreate,
    likesToCreate,
    topicsToFollow,
    farmRecordsToCreate,
    recentAIQuestionsToCreate,
    estimatedRecords,
    warnings,
    conflictPolicy,
  };
}
