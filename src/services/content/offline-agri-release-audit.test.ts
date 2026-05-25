import { describe, expect, test } from 'vitest';
import {
  articleReleaseAttempts,
  buildArticleReleaseAuditReadiness,
  canCmsOrAutomationReleaseArticle,
  getArticleReleaseAuditSummary,
} from '@/services/content/offline-agri-release-audit';

describe('M71 offline article release audit readiness', () => {
  test('release attempt is blocked without human approval', () => {
    const attempt = articleReleaseAttempts.find((item) => item.id === 'release-attempt-no-human-approval');

    expect(attempt).toBeTruthy();
    expect(attempt?.status).toBe('blocked');
    expect(attempt?.blockedReasons).toContain('missing_human_approval');
    expect(attempt?.finalPublishAllowed).toBe(false);
  });

  test('automation bypass attempt is blocked', () => {
    const audit = buildArticleReleaseAuditReadiness('soil-types-before-planting');

    expect(audit.automationBypassAttempts.length).toBeGreaterThan(0);
    expect(audit.automationBypassAttempts.every((attempt) => attempt.status === 'blocked')).toBe(true);
    expect(audit.automationBypassAttempts[0].reason).toBe('automation_bypass_blocked');
  });

  test('reviewer history fixtures exist', () => {
    const audit = buildArticleReleaseAuditReadiness('soil-types-before-planting');

    expect(audit.reviewerHistory.length).toBeGreaterThan(0);
    expect(audit.reviewerHistory[0].beforeStatus).toBe('pending');
    expect(audit.reviewerHistory[0].afterStatus).toBe('reviewed_draft_candidate');
  });

  test('release diff preview is generated', () => {
    const audit = buildArticleReleaseAuditReadiness('soil-types-before-planting');

    expect(audit.diffPreview.id).toBe('soil-types-release-diff-preview-m71');
    expect(audit.diffPreview.beforeSummaryTh.length).toBeGreaterThan(0);
    expect(audit.diffPreview.afterSummaryTh.length).toBeGreaterThan(0);
    expect(audit.diffPreview.finalPublishAllowed).toBe(false);
  });

  test('disclaimer change is tracked', () => {
    const audit = buildArticleReleaseAuditReadiness('soil-types-before-planting');

    expect(audit.timeline.some((event) => event.event === 'disclaimer_change')).toBe(true);
    expect(audit.diffPreview.disclaimerChanges.some((change) => change.includes('disclaimer'))).toBe(true);
  });

  test('image review pending blocks publish', () => {
    const attempt = articleReleaseAttempts.find((item) => item.id === 'release-attempt-no-image-review');

    expect(attempt?.status).toBe('blocked');
    expect(attempt?.blockedReasons).toContain('missing_image_review');
    expect(attempt?.finalPublishAllowed).toBe(false);
  });

  test('CMS override alone cannot publish', () => {
    const release = canCmsOrAutomationReleaseArticle('soil-types-before-planting');
    const cmsAttempt = articleReleaseAttempts.find((item) => item.id === 'release-attempt-cms-override-only');

    expect(cmsAttempt?.blockedReasons).toContain('cms_override_only');
    expect(release.canRelease).toBe(false);
    expect(release.blockedReasons).toContain('cms_override_only');
  });

  test('final publish remains false', () => {
    const summary = getArticleReleaseAuditSummary();

    expect(summary.finalPublishAllowedCount).toBe(0);
    expect(summary.blockedAttemptCount).toBe(summary.attemptCount);
    expect(summary.audit.finalPublishAllowed).toBe(false);
    expect(summary.audit.noNetworkRequired).toBe(true);
  });
});
