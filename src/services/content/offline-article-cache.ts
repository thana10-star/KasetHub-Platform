import type { ArticleContent } from '@/services/content/content.types';
import { articleContents, createOfflineArticleCachePreview } from '@/services/content/content-fixtures';

export type OfflineArticleCacheStatus = {
  articleId: string;
  title: string;
  cacheVersion: number;
  offlineAvailable: boolean;
  bodySectionCount: number;
  sizeBytesEstimate: number;
  sizeWarning?: string;
};

export type OfflineArticleCachePlan = {
  storageMode: 'guest_memory_metadata';
  cacheVersion: number;
  totalArticles: number;
  offlineReadyArticles: number;
  estimatedTotalBytes: number;
  maxArticleBytes: number;
  statuses: OfflineArticleCacheStatus[];
  boundaries: string[];
};

export function buildOfflineArticleCacheStatus(article: ArticleContent): OfflineArticleCacheStatus {
  const cache = createOfflineArticleCachePreview(article.id);

  return {
    articleId: article.id,
    title: article.title,
    cacheVersion: article.offlineCacheVersion,
    offlineAvailable: Boolean(cache?.offlineAvailable),
    bodySectionCount: article.bodySections.length,
    sizeBytesEstimate: cache?.sizeBytesEstimate ?? 0,
    sizeWarning: cache?.sizeWarning,
  };
}

export function buildOfflineArticleCachePlan(articles: ArticleContent[] = articleContents): OfflineArticleCachePlan {
  const statuses = articles.map(buildOfflineArticleCacheStatus);
  const estimatedTotalBytes = statuses.reduce((total, item) => total + item.sizeBytesEstimate, 0);
  const maxArticleBytes = statuses.reduce((max, item) => Math.max(max, item.sizeBytesEstimate), 0);

  return {
    storageMode: 'guest_memory_metadata',
    cacheVersion: articles.length > 0 ? Math.max(...articles.map((article) => article.offlineCacheVersion)) : 1,
    totalArticles: articles.length,
    offlineReadyArticles: statuses.filter((item) => item.offlineAvailable).length,
    estimatedTotalBytes,
    maxArticleBytes,
    statuses,
    boundaries: [
      'Article body cache is created from local fixtures only.',
      'Saved/offline article actions write through Guest Memory metadata.',
      'No service worker, Cache API, backend write, CMS sync, or network request is enabled in M20.',
    ],
  };
}
