import { articles } from '@/data/mockData';
import { createOfflineArticleCachePreview } from '@/services/content/content-fixtures';
import {
  createArticleMemoryItem,
  getState,
  isSaved,
  saveItem,
  unsaveItem,
} from '@/services/guest-memory/guest-memory-service';
import type { Article, SavedArticle } from '@/types/kaset';

function articleWithOfflineCache(article: Article | SavedArticle, cachedAt = new Date().toISOString()): SavedArticle {
  const cache = createOfflineArticleCachePreview(article.id, cachedAt);
  const existingSavedAt = 'savedAt' in article ? article.savedAt : cachedAt;

  return {
    ...article,
    savedAt: existingSavedAt,
    offlineReady: cache?.offlineAvailable ?? ('offlineReady' in article ? article.offlineReady : true),
    offlineAvailable: cache?.offlineAvailable ?? ('offlineAvailable' in article ? article.offlineAvailable : undefined),
    cachedAt: cache?.cachedAt ?? ('cachedAt' in article ? article.cachedAt : undefined),
    cacheVersion: cache?.cacheVersion ?? ('cacheVersion' in article ? article.cacheVersion : undefined),
    bodyCachePreview: cache?.bodyCachePreview ?? ('bodyCachePreview' in article ? article.bodyCachePreview : undefined),
    cacheSizeWarning: cache?.sizeWarning ?? ('cacheSizeWarning' in article ? article.cacheSizeWarning : undefined),
  };
}

function articleFromMemoryItem(item: ReturnType<typeof getState>['savedItems'][number]): SavedArticle | undefined {
  const articleFromMetadata = item.metadata.article as Article | SavedArticle | undefined;
  const fallbackArticle = articles.find((article) => article.id === item.itemId);
  const article = articleFromMetadata ?? fallbackArticle;

  if (!article) {
    return undefined;
  }

  const cachedAt = 'cachedAt' in article && typeof article.cachedAt === 'string' ? article.cachedAt : item.savedAt;
  const articleWithSavedAt = {
    ...article,
    savedAt: item.savedAt,
    offlineReady: Boolean(item.metadata.offlineReady ?? true),
  };

  return articleWithOfflineCache(articleWithSavedAt, cachedAt);
}

export function getSavedArticles() {
  return getState()
    .savedItems.filter((item) => item.itemType === 'article')
    .map(articleFromMemoryItem)
    .filter((article): article is SavedArticle => Boolean(article));
}

export function isArticleSaved(articleId: string) {
  return isSaved('article', articleId);
}

export function saveArticle(article: Article) {
  saveItem(createArticleMemoryItem(articleWithOfflineCache(article)));
  return getSavedArticles();
}

export function removeSavedArticle(articleId: string) {
  unsaveItem('article', articleId);
  return getSavedArticles();
}

export function toggleSavedArticle(article: Article) {
  return isArticleSaved(article.id) ? removeSavedArticle(article.id) : saveArticle(article);
}
