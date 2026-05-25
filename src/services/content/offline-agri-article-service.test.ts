import { describe, expect, test } from 'vitest';
import {
  offlineAgriArticleExpectedSlugs,
  offlineAgriArticles,
} from '@/services/content/offline-agri-article-fixtures';
import { offlineAgriArticleCategories } from '@/services/content/offline-agri-article-taxonomy';
import {
  findOfflineAgriArticleBySlug,
  getOfflineAgriArticleCategoryCounts,
} from '@/services/content/offline-agri-article-service';

const financeDisclaimer = 'เงื่อนไขสินเชื่อ/โครงการรัฐเปลี่ยนได้ ควรตรวจสอบกับหน่วยงานจริง';
const labelSafetyDisclaimer = 'อ่านฉลากจริงก่อนใช้เสมอ';

describe('offline agriculture article library', () => {
  test('M65 article count matches expected topic list', () => {
    expect(offlineAgriArticles).toHaveLength(offlineAgriArticleExpectedSlugs.length);
    expect(offlineAgriArticleExpectedSlugs).toHaveLength(14);
  });

  test('M65 all articles have slug category title and summary', () => {
    offlineAgriArticles.forEach((article) => {
      expect(article.slug).toMatch(/^[a-z0-9-]+$/);
      expect(article.category).toBeTruthy();
      expect(article.titleTh.length).toBeGreaterThan(4);
      expect(article.shortSummaryTh.length).toBeGreaterThan(10);
      expect(article.cmsCompatibility.futureCmsKey).toContain(article.slug);
    });
  });

  test('M65 all articles are offline available', () => {
    expect(offlineAgriArticles.every((article) => article.offlineAvailable)).toBe(true);
  });

  test('M65 all article categories exist and have at least one article', () => {
    const categoryKeys = offlineAgriArticleCategories.map((category) => category.key);
    const counts = getOfflineAgriArticleCategoryCounts();

    offlineAgriArticles.forEach((article) => {
      expect(categoryKeys).toContain(article.category);
    });
    expect(counts.every((category) => category.count > 0)).toBe(true);
  });

  test('M65 every article has planned cover image metadata', () => {
    offlineAgriArticles.forEach((article) => {
      expect(article.coverImage.status).toBe('planned_asset');
      expect(article.coverImage.usage).toBe('cover');
      expect(article.coverImage.plannedPath).toMatch(/^public\/assets\/articles\/.+\.webp$/);
      expect(article.coverImage.altTextTh.length).toBeGreaterThan(5);
      expect(article.coverImage.futurePromptNote.length).toBeGreaterThan(10);
      expect(['16:9', '4:3']).toContain(article.coverImage.aspectRatio);
    });
  });

  test('M65 finance articles include finance disclaimer', () => {
    const financeArticles = offlineAgriArticles.filter((article) => article.category === 'farm_finance');

    expect(financeArticles.length).toBeGreaterThan(0);
    financeArticles.forEach((article) => {
      expect(article.safetyNotes.map((note) => note.textTh)).toContain(financeDisclaimer);
    });
  });

  test('M65 fertilizer and chemical related articles include label safety disclaimer', () => {
    const safetyArticles = offlineAgriArticles.filter(
      (article) => article.category === 'fertilizer' || article.slug === 'rice-pest-monitoring-basics',
    );

    expect(safetyArticles.length).toBeGreaterThan(0);
    safetyArticles.forEach((article) => {
      expect(article.safetyNotes.map((note) => note.textTh)).toContain(labelSafetyDisclaimer);
    });
  });

  test('M65 offline article service can find by slug', () => {
    const article = findOfflineAgriArticleBySlug('soil-types-before-planting');

    expect(article?.titleTh).toContain('ดิน');
    expect(article?.offlineAvailable).toBe(true);
  });

  test('M65 no article uses external network image URL', () => {
    offlineAgriArticles.forEach((article) => {
      const paths = [article.coverImage, ...(article.inlineImages ?? [])].map((image) => image.plannedPath);

      paths.forEach((path) => {
        expect(path).not.toMatch(/^https?:\/\//);
        expect(path).not.toMatch(/^\/\//);
      });
    });
  });
});
