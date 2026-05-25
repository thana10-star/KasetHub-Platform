import type { Article } from '@/types/kaset';
import type {
  OfflineAgriArticle,
  OfflineAgriArticleCategory,
  OfflineAgriArticleDifficulty,
} from '@/services/content/offline-agri-article.types';
import { offlineAgriArticles } from '@/services/content/offline-agri-article-fixtures';
import {
  getOfflineAgriArticleCategoryMeta,
  offlineAgriArticleCategories,
  offlineAgriArticleDifficultyLabels,
} from '@/services/content/offline-agri-article-taxonomy';

function toArticleImageTone(tone: ReturnType<typeof getOfflineAgriArticleCategoryMeta>['imageTone']): Article['imageTone'] {
  if (tone === 'news' || tone === 'tech' || tone === 'soil' || tone === 'market' || tone === 'community') {
    return tone;
  }

  if (tone === 'water') {
    return 'news';
  }

  if (tone === 'field' || tone === 'leaf' || tone === 'fruit' || tone === 'rice' || tone === 'orchard') {
    return 'soil';
  }

  return 'community';
}

export type OfflineAgriArticleFilter = {
  category?: OfflineAgriArticleCategory | 'all';
  difficulty?: OfflineAgriArticleDifficulty | 'all';
  searchQuery?: string;
};

export function getOfflineAgriArticles() {
  return offlineAgriArticles;
}

export function findOfflineAgriArticleBySlug(slug: string) {
  return offlineAgriArticles.find((article) => article.slug === slug);
}

export function filterOfflineAgriArticles(filter: OfflineAgriArticleFilter = {}) {
  const normalizedQuery = filter.searchQuery?.trim().toLowerCase() ?? '';

  return offlineAgriArticles.filter((article) => {
    const matchesCategory = !filter.category || filter.category === 'all' || article.category === filter.category;
    const matchesDifficulty = !filter.difficulty || filter.difficulty === 'all' || article.difficulty === filter.difficulty;
    const searchableText = [
      article.titleTh,
      article.shortSummaryTh,
      getOfflineAgriArticleCategoryMeta(article.category).labelTh,
      ...article.tagsTh,
      ...article.sections.flatMap((section) => [section.headingTh, section.starterSnippetTh, ...section.outlineBulletsTh]),
    ]
      .join(' ')
      .toLowerCase();
    const matchesSearch = normalizedQuery ? searchableText.includes(normalizedQuery) : true;

    return matchesCategory && matchesDifficulty && matchesSearch;
  });
}

export function getOfflineAgriArticleCategoryCounts() {
  return offlineAgriArticleCategories.map((category) => ({
    ...category,
    count: offlineAgriArticles.filter((article) => article.category === category.key).length,
  }));
}

export function offlineAgriArticleToArticle(article: OfflineAgriArticle): Article {
  const category = getOfflineAgriArticleCategoryMeta(article.category);

  return {
    id: article.id,
    title: article.titleTh,
    category: 'องค์ความรู้',
    excerpt: article.shortSummaryTh,
    author: 'KasetHub Offline Library',
    readTime: `อ่าน ${article.estimatedReadingMinutes} นาที`,
    publishedAt: 'ชุดความรู้ออฟไลน์',
    imageTone: toArticleImageTone(category.imageTone),
  };
}

export function getOfflineAgriArticleReadinessSummary() {
  const starterContent = offlineAgriArticles.filter((article) => article.bodyReadiness === 'starter_content').length;
  const outlineOnly = offlineAgriArticles.filter((article) => article.bodyReadiness === 'outline_only').length;

  return {
    total: offlineAgriArticles.length,
    starterContent,
    outlineOnly,
    offlineAvailable: offlineAgriArticles.filter((article) => article.offlineAvailable).length,
    difficultyLabels: offlineAgriArticleDifficultyLabels,
  };
}
