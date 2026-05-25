import type {
  ArticleAutomationBypassAttempt,
  ArticleReleaseAttempt,
  ArticleReleaseAuditReadiness,
  ArticleReleaseBlockedReason,
  ArticleReleaseDiffPreview,
  ArticleReviewerChangeHistory,
} from '@/services/content/offline-agri-release-audit.types';

const blockedReasonLabels: Record<ArticleReleaseBlockedReason, string> = {
  missing_human_approval: 'ยังไม่มี human approval',
  missing_release_reviewer: 'ยังไม่มี release reviewer',
  missing_image_review: 'ภาพยังไม่ผ่าน review',
  missing_freshness_date: 'ยังไม่มี freshness date',
  cms_override_only: 'CMS override อย่างเดียว publish ไม่ได้',
  automation_bypass_blocked: 'automation bypass ถูกบล็อก',
  disclaimer_change_requires_review: 'แก้ disclaimer ต้องรีวิวใหม่',
  no_final_publish_in_m71: 'M71 ยังไม่อนุญาต final publish',
};

export const articleReleaseAttempts: ArticleReleaseAttempt[] = [
  {
    id: 'release-attempt-no-human-approval',
    articleSlug: 'soil-types-before-planting',
    attemptedBy: 'editor_fixture',
    event: 'attempted_publish',
    status: 'blocked',
    blockedReasons: ['missing_human_approval', 'no_final_publish_in_m71'],
    noteTh: 'พยายาม publish โดย metadata พร้อมบางส่วน แต่ไม่มี human approval',
    finalPublishAllowed: false,
  },
  {
    id: 'release-attempt-no-reviewer',
    articleSlug: 'soil-types-before-planting',
    attemptedBy: 'editor_fixture',
    event: 'attempted_publish',
    status: 'blocked',
    blockedReasons: ['missing_release_reviewer', 'no_final_publish_in_m71'],
    noteTh: 'พยายาม publish โดยยังไม่มี release reviewer',
    finalPublishAllowed: false,
  },
  {
    id: 'release-attempt-no-image-review',
    articleSlug: 'soil-types-before-planting',
    attemptedBy: 'editor_fixture',
    event: 'attempted_publish',
    status: 'blocked',
    blockedReasons: ['missing_image_review', 'no_final_publish_in_m71'],
    noteTh: 'พยายาม publish โดยภาพยังเป็น planned-only',
    finalPublishAllowed: false,
  },
  {
    id: 'release-attempt-no-freshness-date',
    articleSlug: 'soil-types-before-planting',
    attemptedBy: 'editor_fixture',
    event: 'attempted_publish',
    status: 'blocked',
    blockedReasons: ['missing_freshness_date', 'no_final_publish_in_m71'],
    noteTh: 'พยายาม publish โดย freshness date ยังเป็น placeholder',
    finalPublishAllowed: false,
  },
  {
    id: 'release-attempt-cms-override-only',
    articleSlug: 'soil-types-before-planting',
    attemptedBy: 'cms_override_fixture',
    event: 'blocked_publish',
    status: 'blocked',
    blockedReasons: ['cms_override_only', 'missing_human_approval', 'no_final_publish_in_m71'],
    noteTh: 'CMS override อย่างเดียวไม่ใช่ release approval',
    finalPublishAllowed: false,
  },
];

export const articleAutomationBypassAttempts: ArticleAutomationBypassAttempt[] = [
  {
    id: 'automation-bypass-publish-script',
    articleSlug: 'soil-types-before-planting',
    attemptedBy: 'automation',
    status: 'blocked',
    reason: 'automation_bypass_blocked',
    noteTh: 'automation พยายามเปลี่ยนสถานะเป็น final แต่ถูก release gate บล็อก',
  },
];

export const articleReviewerChangeHistory: ArticleReviewerChangeHistory[] = [
  {
    id: 'reviewer-change-content-editor',
    articleSlug: 'soil-types-before-planting',
    role: 'content_editor',
    beforeStatus: 'pending',
    afterStatus: 'reviewed_draft_candidate',
    changedByPlaceholder: 'content editor placeholder',
    status: 'simulated_only',
    noteTh: 'จำลองการเปลี่ยนสถานะเพื่อ preview audit เท่านั้น ยังไม่ใช่ sign-off จริง',
  },
];

export const articleReleaseDiffPreview: ArticleReleaseDiffPreview = {
  id: 'soil-types-release-diff-preview-m71',
  articleSlug: 'soil-types-before-planting',
  beforeSummaryTh: 'ร่างบทความยังมี placeholder และ publish gate ปิด',
  afterSummaryTh: 'จำลองว่า metadata บางส่วนถูกเติม แต่ release gate ยังปิด',
  disclaimerChanges: [
    'disclaimer edited: ต้องรีวิวใหม่ก่อน release',
    'baseline safety disclaimer remains required',
  ],
  sourceMetadataChanges: [
    'source placeholder -> simulated source evidence',
    'freshness date remains placeholder for release',
  ],
  reviewerStatusChanges: [
    'content_editor pending -> reviewed_draft_candidate simulation',
  ],
  imageReviewChanges: [
    'cover image remains planned_only',
    'inline image review pending',
  ],
  finalPublishAllowed: false,
};

export function buildArticleReleaseAuditReadiness(articleSlug = 'soil-types-before-planting'): ArticleReleaseAuditReadiness {
  const attempts = articleReleaseAttempts.filter((attempt) => attempt.articleSlug === articleSlug);
  const reviewerHistory = articleReviewerChangeHistory.filter((history) => history.articleSlug === articleSlug);
  const automationBypassAttempts = articleAutomationBypassAttempts.filter((attempt) => attempt.articleSlug === articleSlug);

  return {
    articleSlug,
    status: 'blocked',
    timeline: [
      ...attempts.map((attempt) => ({
        id: attempt.id,
        event: attempt.event,
        status: attempt.status,
        noteTh: attempt.noteTh,
      })),
      ...reviewerHistory.map((history) => ({
        id: history.id,
        event: 'reviewer_change' as const,
        status: history.status,
        noteTh: history.noteTh,
      })),
      {
        id: 'release-diff-preview-event',
        event: 'disclaimer_change',
        status: 'review_pending',
        noteTh: 'disclaimer change tracked and requires review',
      },
      ...automationBypassAttempts.map((attempt) => ({
        id: attempt.id,
        event: 'automation_bypass_attempt' as const,
        status: attempt.status,
        noteTh: attempt.noteTh,
      })),
    ],
    attempts,
    reviewerHistory,
    diffPreview: articleReleaseDiffPreview,
    automationBypassAttempts,
    finalPublishAllowed: false,
    noNetworkRequired: true,
  };
}

export function getArticleReleaseBlockedReasonLabel(reason: ArticleReleaseBlockedReason) {
  return blockedReasonLabels[reason];
}

export function canCmsOrAutomationReleaseArticle(articleSlug = 'soil-types-before-planting') {
  const audit = buildArticleReleaseAuditReadiness(articleSlug);

  return {
    canRelease: false,
    finalPublishAllowed: false,
    blockedReasons: Array.from(new Set(audit.attempts.flatMap((attempt) => attempt.blockedReasons))),
  };
}

export function getArticleReleaseAuditSummary() {
  const audit = buildArticleReleaseAuditReadiness('soil-types-before-planting');

  return {
    articleCount: 1,
    attemptCount: audit.attempts.length,
    blockedAttemptCount: audit.attempts.filter((attempt) => attempt.status === 'blocked').length,
    reviewerHistoryCount: audit.reviewerHistory.length,
    automationBypassBlockedCount: audit.automationBypassAttempts.filter((attempt) => attempt.status === 'blocked').length,
    finalPublishAllowedCount: audit.finalPublishAllowed ? 1 : 0,
    timelineCount: audit.timeline.length,
    audit,
  };
}
