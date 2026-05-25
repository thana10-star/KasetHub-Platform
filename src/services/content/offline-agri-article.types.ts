import type { AppRoute } from '@/types/kaset';

export type OfflineAgriArticleCategory =
  | 'soil'
  | 'water'
  | 'fertilizer'
  | 'rice'
  | 'sugarcane'
  | 'cassava'
  | 'farm_finance';

export type OfflineAgriArticleDifficulty = 'basic' | 'intermediate' | 'advanced';

export type OfflineAgriArticleReadiness = 'outline_only' | 'starter_content';

export type OfflineAgriArticleSourceStatus = 'internal_draft';

export type OfflineAgriArticleImageAspectRatio = '16:9' | '4:3';

export type OfflineAgriArticleImageTone =
  | 'field'
  | 'leaf'
  | 'fruit'
  | 'water'
  | 'soil'
  | 'rice'
  | 'orchard'
  | 'market'
  | 'news'
  | 'tech'
  | 'community';

export type OfflineAgriArticleImageAsset = {
  id: string;
  usage: 'cover' | 'inline';
  plannedPath: string;
  altTextTh: string;
  futurePromptNote: string;
  aspectRatio: OfflineAgriArticleImageAspectRatio;
  status: 'planned_asset';
  offlineSizeWarning: string;
};

export type OfflineAgriArticleSafetyNote = {
  id: string;
  type: 'general' | 'finance' | 'fertilizer_chemical';
  textTh: string;
};

export type OfflineAgriArticleSection = {
  id: string;
  headingTh: string;
  starterSnippetTh: string;
  outlineBulletsTh: string[];
  imageAssetId?: string;
};

export type OfflineAgriArticleCmsCompatibility = {
  futureCmsKey: string;
  schemaVersion: 'offline-agri-article-v1';
  canBeOverriddenByCms: boolean;
  offlineFallbackShouldRemain: boolean;
  seasonalCmsRecommended: boolean;
  notes: string[];
};

export type OfflineAgriArticle = {
  id: string;
  slug: string;
  category: OfflineAgriArticleCategory;
  titleTh: string;
  shortSummaryTh: string;
  difficulty: OfflineAgriArticleDifficulty;
  estimatedReadingMinutes: number;
  offlineAvailable: true;
  bodyReadiness: OfflineAgriArticleReadiness;
  sourceStatus: OfflineAgriArticleSourceStatus;
  coverImage: OfflineAgriArticleImageAsset;
  inlineImages?: OfflineAgriArticleImageAsset[];
  sections: OfflineAgriArticleSection[];
  safetyNotes: OfflineAgriArticleSafetyNote[];
  relatedCalculatorRoute?: AppRoute;
  relatedAppRoute?: AppRoute;
  cmsCompatibility: OfflineAgriArticleCmsCompatibility;
  tagsTh: string[];
  updatedAt: string;
};

export type OfflineAgriArticleCategoryMeta = {
  key: OfflineAgriArticleCategory;
  labelTh: string;
  descriptionTh: string;
  imageTone: OfflineAgriArticleImageTone;
};
