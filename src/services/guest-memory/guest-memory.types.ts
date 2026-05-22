export type SavedItemType =
  | 'article'
  | 'video'
  | 'community_post'
  | 'analysis_result'
  | 'crop_price'
  | 'ai_answer'
  | 'tool'
  | 'future';

export type GuestProfile = {
  guestId: string;
  displayName: string;
  createdAt: string;
  updatedAt: string;
  mode: 'guest';
};

export type SavedItem = {
  id: string;
  itemType: SavedItemType;
  itemId: string;
  title: string;
  summary: string;
  thumbnailUrl?: string;
  sourceRoute: string;
  tags: string[];
  savedAt: string;
  updatedAt: string;
  metadata: Record<string, unknown>;
};

export type LikeItem = {
  id: string;
  itemType: SavedItemType;
  itemId: string;
  title: string;
  sourceRoute: string;
  likedAt: string;
  metadata: Record<string, unknown>;
};

export type FollowedTopic = {
  id: string;
  topicType: 'crop' | 'category' | 'price' | 'community' | 'future';
  title: string;
  sourceRoute: string;
  followedAt: string;
  tags: string[];
  metadata: Record<string, unknown>;
};

export type RecentAIQuestion = {
  id: string;
  question: string;
  topic?: string;
  sourceRoute: string;
  askedAt: string;
  answerSummary?: string;
  metadata: Record<string, unknown>;
};

export type FarmHistoryStatus = 'เฝ้าระวัง' | 'กำลังรักษา' | 'ดีขึ้นแล้ว' | 'บันทึกไว้';

export type FarmHistoryRecord = {
  id: string;
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
  metadata: Record<string, unknown>;
};

export type GuestMemoryState = {
  version: number;
  profile: GuestProfile;
  savedItems: SavedItem[];
  likes: LikeItem[];
  followedTopics: FollowedTopic[];
  recentAIQuestions: RecentAIQuestion[];
  farmRecords: FarmHistoryRecord[];
  migrations: string[];
  updatedAt: string;
};

export type GuestMemoryExport = {
  exportedAt: string;
  app: 'KasetHub Platform';
  state: GuestMemoryState;
};

export type SaveItemInput = Omit<SavedItem, 'id' | 'savedAt' | 'updatedAt'> & {
  id?: string;
  savedAt?: string;
  updatedAt?: string;
};

export type LikeItemInput = Omit<LikeItem, 'id' | 'likedAt'> & {
  id?: string;
  likedAt?: string;
};

export type FollowedTopicInput = Omit<FollowedTopic, 'followedAt'> & {
  followedAt?: string;
};

export type RecentAIQuestionInput = Omit<RecentAIQuestion, 'id' | 'askedAt'> & {
  id?: string;
  askedAt?: string;
};

export type FarmHistoryRecordInput = Omit<FarmHistoryRecord, 'createdAt' | 'updatedAt'> & {
  createdAt?: string;
  updatedAt?: string;
};
