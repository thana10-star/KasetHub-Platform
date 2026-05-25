import type { OfflineAgriArticle, OfflineAgriArticleImageAsset, OfflineAgriArticleSafetyNote } from '@/services/content/offline-agri-article.types';
import type { ArticleCmsOverrideRule, ArticleContentStatus } from '@/services/content/offline-agri-article-qa.types';

export type OfflineAgriCmsOverrideMode = 'offline' | 'online_preview';

export type OfflineAgriCmsOverridePayload = {
  futureCmsKey: string;
  cmsVersionId: string;
  cmsPublishedAt: string;
  contentStatus: ArticleContentStatus;
  titleTh?: string;
  shortSummaryTh?: string;
  sectionCount?: number;
  safetyNotes?: OfflineAgriArticleSafetyNote[];
  coverImage?: OfflineAgriArticleImageAsset;
  freshnessDate?: string;
  contentKind?: 'evergreen' | 'seasonal' | 'finance' | 'government';
};

export type OfflineAgriCmsOverrideDecision = {
  accepted: boolean;
  status: 'accepted_preview' | 'blocked_use_offline_fallback';
  appliedArticle: OfflineAgriArticle;
  offlineFallbackArticle: OfflineAgriArticle;
  offlineFallbackAvailable: boolean;
  blockers: string[];
  warnings: string[];
  rules: ArticleCmsOverrideRule[];
};

