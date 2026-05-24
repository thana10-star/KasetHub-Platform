import { describe, expect, test } from 'vitest';
import { offlineAgriArticles } from '@/services/content/offline-agri-article-fixtures';
import { offlineAgriArticleBaseSafetyNotes } from '@/services/content/offline-agri-article-taxonomy';
import {
  buildArticleVersionInfo,
  evaluateOfflineAgriArticleQa,
  offlineAgriArticleVersionFixtures,
  runOfflineAgriArticleQa,
} from '@/services/content/offline-agri-article-qa';
import { validateOfflineAgriCmsOverride } from '@/services/content/offline-agri-cms-override';

describe('offline article QA and CMS contract readiness', () => {
  test('M66 every article passes minimum QA without fail status', () => {
    const summary = runOfflineAgriArticleQa();

    expect(summary.totalArticles).toBe(offlineAgriArticles.length);
    expect(summary.failCount).toBe(0);
    expect(summary.articleScores.every((score) => score.score >= 12)).toBe(true);
  });

  test('M66 article QA detects missing required disclaimer', () => {
    const fertilizerArticle = offlineAgriArticles.find((article) => article.category === 'fertilizer');
    expect(fertilizerArticle).toBeTruthy();

    const brokenArticle = {
      ...fertilizerArticle!,
      safetyNotes: [offlineAgriArticleBaseSafetyNotes.general],
    };
    const qa = evaluateOfflineAgriArticleQa(brokenArticle);

    expect(qa.status).toBe('fail');
    expect(qa.safetyChecklist.blockers).toContain('missing_label_disclaimer');
  });

  test('M66 CMS override cannot remove safety disclaimer', () => {
    const article = offlineAgriArticles.find((item) => item.category === 'fertilizer')!;
    const decision = validateOfflineAgriCmsOverride(article, {
      futureCmsKey: article.cmsCompatibility.futureCmsKey,
      cmsVersionId: 'cms-v2',
      cmsPublishedAt: '2026-06-01',
      contentStatus: 'reviewed_draft',
      safetyNotes: [offlineAgriArticleBaseSafetyNotes.general],
    });

    expect(decision.accepted).toBe(false);
    expect(decision.blockers).toContain('cms_removed_label_disclaimer');
    expect(decision.offlineFallbackAvailable).toBe(true);
  });

  test('M66 CMS override cannot replace offline image with external URL in offline mode', () => {
    const article = offlineAgriArticles[0];
    const decision = validateOfflineAgriCmsOverride(article, {
      futureCmsKey: article.cmsCompatibility.futureCmsKey,
      cmsVersionId: 'cms-v2',
      cmsPublishedAt: '2026-06-01',
      contentStatus: 'reviewed_draft',
      coverImage: {
        ...article.coverImage,
        plannedPath: 'https://cdn.example.com/article.webp',
      },
    });

    expect(decision.accepted).toBe(false);
    expect(decision.blockers).toContain('external_image_blocked_in_offline_mode');
  });

  test('M66 finance CMS override requires freshness date', () => {
    const article = offlineAgriArticles.find((item) => item.category === 'farm_finance')!;
    const decision = validateOfflineAgriCmsOverride(article, {
      futureCmsKey: article.cmsCompatibility.futureCmsKey,
      cmsVersionId: 'cms-v2',
      cmsPublishedAt: '2026-06-01',
      contentStatus: 'reviewed_draft',
      contentKind: 'finance',
    });

    expect(decision.accepted).toBe(false);
    expect(decision.blockers).toContain('freshness_date_required_for_fast_changing_content');
  });

  test('M66 article version info exists for every offline article', () => {
    expect(offlineAgriArticleVersionFixtures).toHaveLength(offlineAgriArticles.length);

    offlineAgriArticles.forEach((article) => {
      const version = buildArticleVersionInfo(article);
      expect(version.versionId).toContain(article.cmsCompatibility.futureCmsKey);
      expect(version.editorialOwnerPlaceholder).toBeTruthy();
      expect(version.lastReviewedDatePlaceholder).toBeTruthy();
      expect(version.offlineFallbackAvailable).toBe(true);
    });
  });

  test('M66 offline fallback remains available if CMS override is invalid', () => {
    const article = offlineAgriArticles[0];
    const decision = validateOfflineAgriCmsOverride(article, {
      futureCmsKey: 'wrong:key',
      cmsVersionId: 'cms-v2',
      cmsPublishedAt: '2026-06-01',
      contentStatus: 'reviewed_draft',
    });

    expect(decision.accepted).toBe(false);
    expect(decision.status).toBe('blocked_use_offline_fallback');
    expect(decision.appliedArticle.id).toBe(article.id);
    expect(decision.offlineFallbackAvailable).toBe(true);
  });
});

