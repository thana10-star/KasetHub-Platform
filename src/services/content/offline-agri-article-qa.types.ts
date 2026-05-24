import type { OfflineAgriArticle, OfflineAgriArticleImageAsset } from '@/services/content/offline-agri-article.types';

export type ArticleQaStatus = 'pass' | 'warn' | 'fail';

export type ArticleContentStatus =
  | 'outline_only'
  | 'starter_content'
  | 'reviewed_draft'
  | 'ready_for_full_publish';

export type ArticleEditorialChecklist = {
  titleExists: boolean;
  summaryExists: boolean;
  categoryExists: boolean;
  outlineSectionsExist: boolean;
  bodyReadinessClear: boolean;
  sourceStatusClear: boolean;
  status: ArticleQaStatus;
  blockers: string[];
  warnings: string[];
};

export type ArticleSafetyChecklist = {
  generalDisclaimerExists: boolean;
  financeDisclaimerRequired: boolean;
  financeDisclaimerExists: boolean;
  labelDisclaimerRequired: boolean;
  labelDisclaimerExists: boolean;
  cmsCannotRemoveRequiredDisclaimers: true;
  status: ArticleQaStatus;
  blockers: string[];
  warnings: string[];
};

export type ArticleImageChecklist = {
  coverMetadataExists: boolean;
  coverPathIsLocal: boolean;
  altTextExists: boolean;
  promptNoteExists: boolean;
  aspectRatioSupported: boolean;
  offlineSizeWarningExists: boolean;
  plannedAssetOnly: boolean;
  status: ArticleQaStatus;
  blockers: string[];
  warnings: string[];
};

export type ArticleCmsOverrideRule = {
  id: string;
  titleTh: string;
  descriptionTh: string;
  severity: 'blocker' | 'warning';
};

export type ArticleVersionInfo = {
  articleId: string;
  slug: string;
  versionId: string;
  contentStatus: ArticleContentStatus;
  editorialOwnerPlaceholder: string;
  lastReviewedDatePlaceholder: string;
  futureCmsKey: string;
  offlineFallbackPriority: 'required' | 'recommended';
  offlineFallbackAvailable: boolean;
};

export type ArticleContentReadinessScore = {
  articleId: string;
  slug: string;
  titleTh: string;
  category: OfflineAgriArticle['category'];
  status: ArticleQaStatus;
  score: number;
  maxScore: number;
  percentage: number;
  editorialChecklist: ArticleEditorialChecklist;
  safetyChecklist: ArticleSafetyChecklist;
  imageChecklist: ArticleImageChecklist;
  versionInfo: ArticleVersionInfo;
  needsFullContent: boolean;
  cmsCompatibilityWarnings: string[];
};

export type OfflineAgriArticleQaSummary = {
  totalArticles: number;
  categoryCount: number;
  passCount: number;
  warnCount: number;
  failCount: number;
  averageScore: number;
  articleScores: ArticleContentReadinessScore[];
  articlesNeedingFullContent: ArticleContentReadinessScore[];
  imageWarnings: Array<{
    articleId: string;
    slug: string;
    titleTh: string;
    image: OfflineAgriArticleImageAsset;
    warning: string;
  }>;
  cmsCompatibilityWarnings: string[];
  disclaimerCoverage: {
    general: number;
    finance: number;
    label: number;
  };
  noNetworkRequired: true;
};

