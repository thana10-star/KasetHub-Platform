export type AdminRole = 'owner' | 'admin' | 'editor' | 'moderator' | 'expert_reviewer' | 'support';

export type AdminModuleId =
  | 'content'
  | 'youtube_import'
  | 'community'
  | 'moderation'
  | 'crop_prices'
  | 'crop_watch'
  | 'ai_safety'
  | 'plant_analysis'
  | 'guest_sync'
  | 'auth'
  | 'system_health';

export type AdminHealthStatus = 'healthy' | 'attention' | 'blocked' | 'mock_only';

export type AdminModuleStatus = {
  id: AdminModuleId;
  title: string;
  summary: string;
  status: AdminHealthStatus;
  metricLabel: string;
  metricValue: string | number;
  readinessLabel: string;
  route?: string;
};

export type AdminDashboardSummary = {
  contentItems: number;
  publishedContent: number;
  contentDrafts: number;
  contentInReview: number;
  youtubeImportCandidates: number;
  pendingCommunityReports: number;
  moderationQueueItems: number;
  cropPriceSources: number;
  cropPriceItems: number;
  cropWatchItems: number;
  aiSafetyItems: number;
  systemHealth: AdminHealthStatus;
};

export type AdminTask = {
  id: string;
  moduleId: AdminModuleId;
  title: string;
  description: string;
  status: 'todo' | 'in_review' | 'blocked' | 'done' | 'mock_only';
  priority: 'low' | 'medium' | 'high';
  ownerRole: AdminRole;
};

export type AdminRiskItem = {
  id: string;
  moduleId: AdminModuleId;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  recommendedAction: string;
};

export type AdminAuditLogPreview = {
  id: string;
  actorLabel: string;
  role: AdminRole;
  moduleId: AdminModuleId;
  actionLabel: string;
  targetLabel: string;
  status: 'preview_only' | 'blocked' | 'local_recorded';
  createdAtLabel: string;
};

export type AdminReviewQueueSummary = {
  id: string;
  moduleId: AdminModuleId;
  title: string;
  pending: number;
  inReview: number;
  completed: number;
  total: number;
  note: string;
};

export type AdminDashboardData = {
  rolePreview: AdminRole;
  summary: AdminDashboardSummary;
  modules: AdminModuleStatus[];
  tasks: AdminTask[];
  risks: AdminRiskItem[];
  auditLogs: AdminAuditLogPreview[];
  reviewQueues: AdminReviewQueueSummary[];
  healthCards: AdminModuleStatus[];
  boundaries: string[];
};
