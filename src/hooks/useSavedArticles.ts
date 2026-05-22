import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  getSavedArticles,
  removeSavedArticle,
  saveArticle,
  toggleSavedArticle,
} from '@/services/offline/offline-article-service';
import { subscribeGuestMemory } from '@/services/guest-memory/guest-memory-service';
import type { Article, SavedArticle } from '@/types/kaset';

export function useSavedArticles() {
  const [savedArticles, setSavedArticles] = useState<SavedArticle[]>([]);

  const refresh = useCallback(() => {
    setSavedArticles(getSavedArticles());
  }, []);

  useEffect(() => {
    refresh();
    return subscribeGuestMemory(refresh);
  }, [refresh]);

  const savedArticleIds = useMemo(() => new Set(savedArticles.map((article) => article.id)), [savedArticles]);

  const isSaved = useCallback(
    (articleId: string) => {
      return savedArticleIds.has(articleId);
    },
    [savedArticleIds],
  );

  const save = useCallback((article: Article) => {
    setSavedArticles(saveArticle(article));
  }, []);

  const remove = useCallback((articleId: string) => {
    setSavedArticles(removeSavedArticle(articleId));
  }, []);

  const toggle = useCallback((article: Article) => {
    setSavedArticles(toggleSavedArticle(article));
  }, []);

  return {
    savedArticles,
    savedCount: savedArticles.length,
    isSaved,
    save,
    remove,
    toggle,
  };
}
