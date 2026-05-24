import { describe, expect, test } from 'vitest';
import { offlineAgriArticles } from '@/services/content/offline-agri-article-fixtures';
import {
  findOfflineAgriPilotArticleDraftBySlug,
  getOfflineAgriPilotArticleDrafts,
  getPilotArticleDraftPublishGate,
  runPilotArticleDraftWorkflowReview,
} from '@/services/content/offline-agri-pilot-article-drafts';

describe('M68 offline pilot article draft workflow', () => {
  test('pilot draft exists for soil-types-before-planting', () => {
    const draft = findOfflineAgriPilotArticleDraftBySlug('soil-types-before-planting');

    expect(draft).toBeTruthy();
    expect(draft?.titleTh).toBe('ดิน 6 ชนิด รู้จักก่อนปลูก');
    expect(draft?.status).toBe('reviewed_draft_candidate');
  });

  test('pilot draft has required content sections', () => {
    const draft = findOfflineAgriPilotArticleDraftBySlug('soil-types-before-planting')!;
    const kinds = draft.sections.map((section) => section.kind);

    expect(kinds).toEqual([
      'intro',
      'comparison_table',
      'observe_by_touch_water',
      'broad_use_cases',
      'basic_improvement_ideas',
      'mistakes_to_avoid',
      'ask_expert',
      'related_tools',
      'summary',
    ]);
    expect(draft.comparisonRows).toHaveLength(6);
  });

  test('pilot draft keeps safety disclaimer', () => {
    const draft = findOfflineAgriPilotArticleDraftBySlug('soil-types-before-planting')!;

    expect(draft.review.safetyDisclaimersTh.some((disclaimer) => disclaimer.includes('ความรู้เบื้องต้น'))).toBe(true);
    expect(draft.review.safetyDisclaimersTh.some((disclaimer) => disclaimer.includes('ผู้เชี่ยวชาญ'))).toBe(true);
  });

  test('pilot draft does not mark final publish', () => {
    const summary = runPilotArticleDraftWorkflowReview();
    const draft = summary.drafts[0];

    expect(summary.finalPublishAllowedCount).toBe(0);
    expect(summary.blockedCount).toBe(2);
    expect(draft.isFinalOfficialArticle).toBe(false);
    expect(draft.fullPublishAllowed).toBe(false);
  });

  test('pilot draft has source placeholders', () => {
    const draft = findOfflineAgriPilotArticleDraftBySlug('soil-types-before-planting')!;

    expect(draft.review.sourcePlaceholders).toHaveLength(3);
    expect(draft.review.sourcePlaceholders.every((source) => source.status === 'placeholder_only')).toBe(true);
  });

  test('pilot draft has image requirements', () => {
    const draft = findOfflineAgriPilotArticleDraftBySlug('soil-types-before-planting')!;

    expect(draft.review.imageRequirements).toHaveLength(2);
    expect(draft.review.imageRequirements.every((image) => image.plannedPath.startsWith('public/assets/articles/soil/'))).toBe(true);
    expect(draft.review.imageRequirements.every((image) => !image.plannedPath.startsWith('http'))).toBe(true);
  });

  test('pilot publish gate remains blocked', () => {
    const gate = getPilotArticleDraftPublishGate('soil-types-before-planting');

    expect(gate?.fullPublishAllowed).toBe(false);
    expect(gate?.blockers).toContain('publish_gate_must_remain_blocked_in_m68');
    expect(gate?.blockers).toContain('source_placeholders_not_filled');
  });

  test('non-pilot articles remain unchanged', () => {
    const drafts = getOfflineAgriPilotArticleDrafts();
    const draftSlugs = new Set(drafts.map((draft) => draft.slug));
    const nonPilotArticles = offlineAgriArticles.filter((article) => !draftSlugs.has(article.slug));

    expect(drafts).toHaveLength(2);
    expect(nonPilotArticles.length).toBe(offlineAgriArticles.length - 1);
    expect(nonPilotArticles.every((article) => article.bodyReadiness === 'outline_only' || article.bodyReadiness === 'starter_content')).toBe(true);
  });

  test('M69 second low risk pilot draft template exists without final publish', () => {
    const draft = findOfflineAgriPilotArticleDraftBySlug('soil-ph-reading-yourself');

    expect(draft).toBeTruthy();
    expect(draft?.status).toBe('draft_template');
    expect(draft?.offlineFallbackArticleSlug).toBe('soil-types-before-planting');
    expect(draft?.fullPublishAllowed).toBe(false);
    expect(draft?.review.publishBlockers).toContain('second_pilot_is_draft_template_only');
  });
});
