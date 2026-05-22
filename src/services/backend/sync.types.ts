import type {
  CloudFarmRecord,
  CloudFollowedTopic,
  CloudLike,
  CloudRecentAIQuestion,
  CloudSavedItem,
} from '@/services/backend/backend.types';

export type SyncConflictPolicy = {
  savedItems: 'merge_by_item_type_and_item_id';
  likes: 'or_true_wins';
  followedTopics: 'merge_by_topic_id';
  farmRecords: 'keep_both_unless_same_local_id';
  recentAIQuestions: 'optional_user_consent';
  profile: 'cloud_wins_guest_name_suggested';
};

export type GuestToCloudSyncPlan = {
  guestId: string;
  generatedAt: string;
  savedItemsToCreate: CloudSavedItem[];
  likesToCreate: CloudLike[];
  topicsToFollow: CloudFollowedTopic[];
  farmRecordsToCreate: CloudFarmRecord[];
  recentAIQuestionsToCreate: CloudRecentAIQuestion[];
  estimatedRecords: number;
  warnings: string[];
  conflictPolicy: SyncConflictPolicy;
};
