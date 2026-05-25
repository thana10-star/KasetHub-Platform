import { describe, expect, test } from 'vitest';
import { findOfflineAgriArticleBySlug } from '@/services/content/offline-agri-article-service';
import {
  canArticlePassFinalEditorialApproval,
  getArticleEditorialApprovalStateBySlug,
  getArticleEditorialReviewSummary,
  validateArticleImageAssetReview,
} from '@/services/content/offline-agri-editorial-review';

describe('M69 offline article editorial review workflow', () => {
  test('pilot signoff fixtures exist for soil article', () => {
    const state = getArticleEditorialApprovalStateBySlug('soil-types-before-planting');

    expect(state).toBeTruthy();
    expect(state?.signoffs.map((signoff) => signoff.role)).toEqual([
      'content_editor',
      'agriculture_expert',
      'safety_reviewer',
      'image_reviewer',
    ]);
  });

  test('all signoffs remain pending', () => {
    const summary = getArticleEditorialReviewSummary();

    expect(summary.articleCount).toBe(2);
    expect(summary.pendingSignoffCount).toBe(8);
    expect(summary.states.every((state) => state.signoffs.every((signoff) => signoff.status === 'pending'))).toBe(true);
  });

  test('final publish remains blocked for every editorial state', () => {
    const summary = getArticleEditorialReviewSummary();

    expect(summary.finalPublishAllowedCount).toBe(0);
    summary.states.forEach((state) => {
      expect(state.finalPublishAllowed).toBe(false);
      expect(state.isFinalOfficialArticle).toBe(false);
      expect(canArticlePassFinalEditorialApproval(state.articleSlug).canPublish).toBe(false);
      expect(state.blockers).toContain('no_official_publish_in_m69');
    });
  });

  test('source metadata shape exists', () => {
    const state = getArticleEditorialApprovalStateBySlug('soil-types-before-planting')!;
    const source = state.sourceMetadata[0];

    expect(source.sourceTitle).toBeTruthy();
    expect(source.sourceOwnerOrganization).toBeTruthy();
    expect(source.reviewedDate).toBe('pending');
    expect(source.freshnessStatus).toBe('placeholder');
    expect(source.sourceConfidence).toBe('placeholder');
    expect(source.citationPlaceholder).toContain('pending');
    expect(source.fieldApplicabilityNoteTh.length).toBeGreaterThan(10);
  });

  test('image review checklist blocks when image is not reviewed', () => {
    const state = getArticleEditorialApprovalStateBySlug('soil-types-before-planting')!;
    const result = validateArticleImageAssetReview(state.imageReviews[0]);

    expect(state.imageReviews[0].assetKind).toBe('cover');
    expect(state.imageReviews[0].plannedPath).toMatch(/^public\/assets\/articles\/soil\/.+\.webp$/);
    expect(result.validForFuturePublish).toBe(false);
    expect(result.blockers).toContain('image_review_pending');
  });

  test('second pilot draft exists as draft template', () => {
    const state = getArticleEditorialApprovalStateBySlug('soil-ph-reading-yourself');

    expect(state).toBeTruthy();
    expect(state?.editorialStatus).toBe('draft_template');
    expect(state?.offlineFallbackArticleSlug).toBe('soil-types-before-planting');
    expect(state?.blockers).toContain('second_pilot_draft_template_only');
  });

  test('no article is marked final publish', () => {
    const summary = getArticleEditorialReviewSummary();

    expect(summary.states.every((state) => state.isFinalOfficialArticle === false)).toBe(true);
    expect(summary.states.every((state) => state.finalPublishAllowed === false)).toBe(true);
  });

  test('detail route data still has safety disclaimers', () => {
    const article = findOfflineAgriArticleBySlug('soil-types-before-planting');
    const state = getArticleEditorialApprovalStateBySlug('soil-types-before-planting');

    expect(article?.safetyNotes.length).toBeGreaterThan(0);
    expect(state?.safetyDisclaimersTh.length).toBeGreaterThan(0);
    expect(state?.safetyDisclaimersTh.every((disclaimer) => disclaimer.length > 8)).toBe(true);
  });
});
