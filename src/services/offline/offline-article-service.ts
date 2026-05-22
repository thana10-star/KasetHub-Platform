import { articles } from '@/data/mockData';
import {
  createArticleMemoryItem,
  getState,
  isSaved,
  saveItem,
  unsaveItem,
} from '@/services/guest-memory/guest-memory-service';
import type { Article, SavedArticle } from '@/types/kaset';

function articleFromMemoryItem(item: ReturnType<typeof getState>['savedItems'][number]): SavedArticle | undefined {
  const articleFromMetadata = item.metadata.article as Article | SavedArticle | undefined;
  const fallbackArticle = articles.find((article) => article.id === item.itemId);
  const article = articleFromMetadata ?? fallbackArticle;

  if (!article) {
    return undefined;
  }

  return {
    ...article,
    savedAt: item.savedAt,
    offlineReady: Boolean(item.metadata.offlineReady ?? true),
  };
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
  saveItem(createArticleMemoryItem(article));
  return getSavedArticles();
}

export function removeSavedArticle(articleId: string) {
  unsaveItem('article', articleId);
  return getSavedArticles();
}

export function toggleSavedArticle(article: Article) {
  return isArticleSaved(article.id) ? removeSavedArticle(article.id) : saveArticle(article);
}
