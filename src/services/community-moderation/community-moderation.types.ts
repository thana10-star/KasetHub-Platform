export type CommunityReportReason =
  | 'spam'
  | 'rude_or_harassment'
  | 'dangerous_advice'
  | 'chemical_or_pesticide_risk'
  | 'scam_or_fake_sale'
  | 'off_topic'
  | 'personal_data'
  | 'other';

export type ModerationStatus = 'pending_review' | 'reviewed' | 'action_taken' | 'dismissed';

export type ModerationAction =
  | 'none'
  | 'hide_content'
  | 'show_warning'
  | 'remove_content'
  | 'escalate_to_expert'
  | 'future_admin_review';

export type CommunityRule = {
  id: string;
  title: string;
  summary: string;
  detail: string;
  priority: number;
  tone: 'green' | 'gold' | 'sky' | 'rose' | 'neutral';
};

export type CommunityReport = {
  id: string;
  postId: string;
  reason: CommunityReportReason;
  note: string;
  status: ModerationStatus;
  createdAt: string;
  updatedAt: string;
  sourceRoute: string;
  metadata: Record<string, unknown>;
};

export type HiddenContentRecord = {
  id: string;
  postId: string;
  hiddenAt: string;
  reason: CommunityReportReason | 'user_hidden';
  note: string;
  sourceRoute: string;
  metadata: Record<string, unknown>;
};

export type CommunitySafetyNotice = {
  id: string;
  title: string;
  body: string;
  tone: 'info' | 'success' | 'warning' | 'danger' | 'neutral';
};

export type ModeratorQueueItem = {
  id: string;
  postId: string;
  title: string;
  excerpt: string;
  reason: CommunityReportReason;
  status: ModerationStatus;
  recommendedAction: ModerationAction;
  createdAt: string;
  source: 'fixture' | 'local_report';
  notes: string;
};

export type CommunityModerationState = {
  version: number;
  reports: CommunityReport[];
  hiddenPosts: HiddenContentRecord[];
  migrations: string[];
  updatedAt: string;
};

export type ReportPostInput = {
  postId: string;
  reason: CommunityReportReason;
  note?: string;
  sourceRoute?: string;
  metadata?: Record<string, unknown>;
};
