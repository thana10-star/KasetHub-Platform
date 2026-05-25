export type ArticleReleaseAuditStatus = 'blocked' | 'review_pending' | 'simulated_only';

export type ArticleReleaseBlockedReason =
  | 'missing_human_approval'
  | 'missing_release_reviewer'
  | 'missing_image_review'
  | 'missing_freshness_date'
  | 'cms_override_only'
  | 'automation_bypass_blocked'
  | 'disclaimer_change_requires_review'
  | 'no_final_publish_in_m71';

export type ArticleReleaseAuditEvent =
  | 'attempted_publish'
  | 'blocked_publish'
  | 'reviewer_change'
  | 'source_metadata_change'
  | 'disclaimer_change'
  | 'image_review_change'
  | 'release_gate_change'
  | 'automation_bypass_attempt';

export type ArticleReleaseAttempt = {
  id: string;
  articleSlug: string;
  attemptedBy: 'editor_fixture' | 'cms_override_fixture' | 'automation_fixture';
  event: Extract<ArticleReleaseAuditEvent, 'attempted_publish' | 'blocked_publish' | 'automation_bypass_attempt'>;
  status: ArticleReleaseAuditStatus;
  blockedReasons: ArticleReleaseBlockedReason[];
  noteTh: string;
  finalPublishAllowed: false;
};

export type ArticleReviewerChangeHistory = {
  id: string;
  articleSlug: string;
  role: 'content_editor' | 'agriculture_expert' | 'safety_reviewer' | 'image_reviewer';
  beforeStatus: string;
  afterStatus: string;
  changedByPlaceholder: string;
  status: ArticleReleaseAuditStatus;
  noteTh: string;
};

export type ArticleReleaseDiffPreview = {
  id: string;
  articleSlug: string;
  beforeSummaryTh: string;
  afterSummaryTh: string;
  disclaimerChanges: string[];
  sourceMetadataChanges: string[];
  reviewerStatusChanges: string[];
  imageReviewChanges: string[];
  finalPublishAllowed: false;
};

export type ArticleAutomationBypassAttempt = {
  id: string;
  articleSlug: string;
  attemptedBy: 'cms_override' | 'automation' | 'script_fixture';
  status: 'blocked';
  reason: ArticleReleaseBlockedReason;
  noteTh: string;
};

export type ArticleReleaseAuditReadiness = {
  articleSlug: string;
  status: ArticleReleaseAuditStatus;
  timeline: Array<{
    id: string;
    event: ArticleReleaseAuditEvent;
    status: ArticleReleaseAuditStatus;
    noteTh: string;
  }>;
  attempts: ArticleReleaseAttempt[];
  reviewerHistory: ArticleReviewerChangeHistory[];
  diffPreview: ArticleReleaseDiffPreview;
  automationBypassAttempts: ArticleAutomationBypassAttempt[];
  finalPublishAllowed: false;
  noNetworkRequired: true;
};
