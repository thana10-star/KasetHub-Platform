import type {
  FarmHistoryStatus,
  FollowedTopic,
  LikeItem,
  RecentAIQuestion,
  SavedItem,
  SavedItemType,
} from '@/services/guest-memory/guest-memory.types';
import type { ArticleCategory } from '@/types/kaset';
import type { VideoCategory, VideoSourceStatus } from '@/types/youtube';

export type AuthProviderType = 'guest' | 'phone' | 'line' | 'google' | 'email';

export type CloudRecordStatus = 'active' | 'archived' | 'deleted';

export type ModerationStatus = 'visible' | 'pending_review' | 'hidden' | 'removed';

export type UserProfile = {
  id: string;
  displayName: string;
  phoneNumber?: string;
  lineUserId?: string;
  googleUserId?: string;
  email?: string;
  avatarUrl?: string;
  province?: string;
  cropFocus: string[];
  authProviders: AuthProviderType[];
  isGuestLinked: boolean;
  createdAt: string;
  updatedAt: string;
  lastSeenAt?: string;
  metadata: Record<string, unknown>;
};

export type CloudSavedItem = SavedItem & {
  cloudId: string;
  userId: string;
  localId?: string;
  syncSource: 'guest_memory' | 'cloud' | 'admin_import';
  status: CloudRecordStatus;
  syncedAt: string;
};

export type CloudLike = LikeItem & {
  cloudId: string;
  userId: string;
  localId?: string;
  status: CloudRecordStatus;
  syncedAt: string;
};

export type CloudFollowedTopic = FollowedTopic & {
  cloudId: string;
  userId: string;
  localId?: string;
  status: CloudRecordStatus;
  syncedAt: string;
};

export type CloudFarmRecord = {
  cloudId: string;
  userId: string;
  localId?: string;
  cropName: string;
  diseaseName: string;
  date: string;
  confidence?: number;
  symptomsSummary: string;
  treatmentSummary: string;
  status: FarmHistoryStatus;
  sourceRoute: string;
  createdAt: string;
  updatedAt: string;
  syncedAt: string;
  metadata: Record<string, unknown>;
};

export type CloudRecentAIQuestion = RecentAIQuestion & {
  cloudId: string;
  userId: string;
  localId?: string;
  syncedAt: string;
  consentToSync: boolean;
};

export type CloudShareEvent = {
  id: string;
  userId?: string;
  guestId?: string;
  source: 'line' | 'facebook' | 'native' | 'copy';
  itemType: SavedItemType;
  itemId: string;
  sourceRoute: string;
  refParam: string;
  createdAt: string;
  metadata: Record<string, unknown>;
};

export type CloudAIUsageCredit = {
  id: string;
  userId: string;
  balance: number;
  source: 'signup_bonus' | 'ad_reward' | 'admin_grant' | 'purchase_future' | 'migration';
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
  metadata: Record<string, unknown>;
};

export type CloudNotification = {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: 'ai' | 'price' | 'community' | 'content' | 'system';
  readAt?: string;
  createdAt: string;
  metadata: Record<string, unknown>;
};

export type CloudCommunityPost = {
  id: string;
  authorId: string;
  body: string;
  topic: string;
  province?: string;
  imageUrls: string[];
  likeCount: number;
  commentCount: number;
  moderationStatus: ModerationStatus;
  createdAt: string;
  updatedAt: string;
  metadata: Record<string, unknown>;
};

export type CloudArticle = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body?: string;
  category: ArticleCategory;
  authorId?: string;
  coverImageUrl?: string;
  publishedAt?: string;
  moderationStatus: ModerationStatus;
  createdAt: string;
  updatedAt: string;
  metadata: Record<string, unknown>;
};

export type CloudVideo = {
  id: string;
  videoId: string;
  channelId: string;
  playlistId?: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  duration: string;
  publishedAt: string;
  viewCount: number;
  category: VideoCategory;
  tags: string[];
  isShort: boolean;
  sourceStatus: VideoSourceStatus;
  shareUrl: string;
  createdAt: string;
  updatedAt: string;
  metadata: Record<string, unknown>;
};

export type CloudCropPriceWatch = {
  id: string;
  userId: string;
  cropName: string;
  category: string;
  province?: string;
  market?: string;
  thresholdAbove?: number;
  thresholdBelow?: number;
  createdAt: string;
  updatedAt: string;
  metadata: Record<string, unknown>;
};
