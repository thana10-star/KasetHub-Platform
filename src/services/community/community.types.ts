export const communityPostCategories = [
  'ปัญหาพืช',
  'ดินและปุ๋ย',
  'น้ำและระบบน้ำ',
  'อากาศ',
  'ราคาเกษตร',
  'เครื่องมือ/แอพ',
  'เรื่องเล่าจากฟาร์ม',
  'อื่น ๆ',
] as const;

export type CommunityPostCategory = (typeof communityPostCategories)[number];
export const communityFallbackPostCategory: CommunityPostCategory = 'อื่น ๆ';

export const communityReportReasons = [
  'spam',
  'dangerous_information',
  'personal_information',
  'inappropriate',
  'other',
] as const;

export type CommunityReportReason = (typeof communityReportReasons)[number] | 'inappropriate_content';

export const communityReportReasonLabels: Record<CommunityReportReason, string> = {
  spam: 'สแปม',
  dangerous_information: 'ข้อมูลอันตราย',
  personal_information: 'ข้อมูลส่วนตัว',
  inappropriate_content: 'เนื้อหาไม่เหมาะสม',
  inappropriate: 'เนื้อหาไม่เหมาะสม',
  other: 'อื่น ๆ',
};

export type CommunityPostStatus = 'published' | 'hidden' | 'deleted' | 'reported' | 'pending_review';
export type CommunityCommentStatus = 'published' | 'hidden' | 'deleted' | 'reported';
export type CommunityNotificationType = 'post_liked' | 'post_replied' | 'comment_replied' | 'post_reported_system';

export type CommunityImageMetadata = {
  imagePath: string;
  mimeType: 'image/jpeg' | 'image/png' | 'image/webp';
  sizeBytes: number;
  width?: number;
  height?: number;
};

export type CommunityPost = {
  id: string;
  authorUserId: string;
  authorDisplayName?: string;
  contentText: string;
  category: CommunityPostCategory;
  image?: CommunityImageMetadata;
  status: CommunityPostStatus;
  likeCount: number;
  commentCount: number;
  reportCount: number;
  createdAt: string;
  updatedAt: string;
  likedByCurrentUser?: boolean;
  ownedByCurrentUser?: boolean;
};

export type CommunityComment = {
  id: string;
  postId: string;
  parentCommentId?: string;
  authorUserId: string;
  authorDisplayName?: string;
  contentText: string;
  status: CommunityCommentStatus;
  likeCount?: number;
  replyCount?: number;
  reportCount: number;
  createdAt: string;
  updatedAt: string;
  likedByCurrentUser?: boolean;
  ownedByCurrentUser?: boolean;
};

export type CommunityNotification = {
  id: string;
  recipientUserId: string;
  actorUserId?: string;
  postId?: string;
  commentId?: string;
  type: CommunityNotificationType;
  title: string;
  body?: string;
  readAt?: string;
  createdAt: string;
};

export type CreateCommunityPostInput = {
  contentText: string;
  category: CommunityPostCategory;
  authorDisplayName?: string;
  image?: File;
};

export type CreateCommunityCommentInput = {
  contentText: string;
  parentCommentId?: string;
};

export type ReportCommunityInput = {
  reason: CommunityReportReason;
  note?: string;
};

export type CommunityGateCode =
  | 'auth_not_ready'
  | 'auth_session_required'
  | 'backend_not_verified'
  | 'feature_flag_disabled'
  | 'invalid_input'
  | 'rls_not_applied'
  | 'supabase_not_ready'
  | 'supabase_write_failed'
  | 'storage_not_ready'
  | 'notification_backend_needed'
  | 'notifications_not_ready'
  | 'write_service_disabled';

export type CommunityReadiness = {
  path: 'gated' | 'real';
  canReadPublishedPosts: boolean;
  canWrite: boolean;
  canUploadImage: boolean;
  canCreateNotifications: boolean;
  writesFeatureFlagEnabled: boolean;
  hasAuthenticatedUser: boolean;
  backendServiceReady: boolean;
  writeGateMessage: string;
  imageGateMessage: string;
  blockers: Array<{
    code: CommunityGateCode;
    label: string;
    detail: string;
  }>;
};

export type CommunityActionResult<T = void> =
  | {
      ok: true;
      data: T;
    }
  | {
      ok: false;
      code: CommunityGateCode;
      message: string;
    };

export type CommunityListPostsResult = {
  posts: CommunityPost[];
  readiness: CommunityReadiness;
};

export type CommunityService = {
  getReadiness(): CommunityReadiness;
  listPosts(): Promise<CommunityListPostsResult>;
  createPost(input: CreateCommunityPostInput): Promise<CommunityActionResult<CommunityPost>>;
  hideOwnPost(postId: string): Promise<CommunityActionResult>;
  deleteOwnPost(postId: string): Promise<CommunityActionResult>;
  listComments(postId: string): Promise<CommunityActionResult<CommunityComment[]>>;
  createComment(postId: string, input: CreateCommunityCommentInput): Promise<CommunityActionResult<CommunityComment>>;
  createReply(postId: string, parentCommentId: string, input: CreateCommunityCommentInput): Promise<CommunityActionResult<CommunityComment>>;
  hideOwnComment(commentId: string): Promise<CommunityActionResult>;
  likePost(postId: string): Promise<CommunityActionResult>;
  unlikePost(postId: string): Promise<CommunityActionResult>;
  likeComment(commentId: string): Promise<CommunityActionResult>;
  unlikeComment(commentId: string): Promise<CommunityActionResult>;
  reportPost(postId: string, input: ReportCommunityInput): Promise<CommunityActionResult>;
  reportComment(commentId: string, input: ReportCommunityInput): Promise<CommunityActionResult>;
  listNotifications(): Promise<CommunityActionResult<CommunityNotification[]>>;
  markNotificationRead(notificationId: string): Promise<CommunityActionResult>;
};
