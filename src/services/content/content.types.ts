import type { Article } from '@/types/kaset';

export type ContentStatus = 'draft' | 'review' | 'scheduled' | 'published' | 'archived';
export type ContentSource = 'manual' | 'youtube_import' | 'ai_assisted' | 'community_curated';
export type ContentLanguage = 'th' | 'en';
export type ContentDifficulty = 'beginner' | 'intermediate' | 'advanced';

export type ContentCategory =
  | 'เทคนิคปลูกพืช'
  | 'โรคพืชและแมลง'
  | 'ดินและปุ๋ย'
  | 'เกษตรอินทรีย์'
  | 'ราคาพืชผล'
  | 'เครื่องมือเกษตร'
  | 'ข่าวเกษตร'
  | 'เรื่องน่ารู้จากช่อง YouTube';

export type ContentTag = {
  id: string;
  label: string;
  category: ContentCategory;
};

export type ContentAuthor = {
  id: string;
  displayName: string;
  role: 'editor' | 'agronomist' | 'market_research' | 'video_team' | 'community_team';
  sourceLabel: string;
};

export type ContentItem = {
  id: string;
  kind: 'article' | 'video' | 'knowledge_post';
  title: string;
  excerpt: string;
  category: ContentCategory;
  tags: ContentTag[];
  author: ContentAuthor;
  status: ContentStatus;
  source: ContentSource;
  language: ContentLanguage;
  difficulty: ContentDifficulty;
  publishedAt: string;
  updatedAt: string;
  sourceRoute: string;
};

export type ArticleBodySection = {
  heading: string;
  body: string;
  checklist?: string[];
};

export type ArticleContent = ContentItem & {
  kind: 'article';
  legacyCategory: Article['category'];
  readTime: string;
  readingTimeMinutes: number;
  imageTone: Article['imageTone'];
  bodySections: ArticleBodySection[];
  keyTakeaways: string[];
  safetyNote?: string;
  relatedArticleIds: string[];
  relatedVideoIds: string[];
  offlineCacheVersion: number;
};

export type VideoContent = ContentItem & {
  kind: 'video';
  videoId: string;
  duration: string;
  playlistId?: string;
  importStatus: 'not_imported' | 'planned' | 'imported_mock' | 'needs_review';
  ownershipVerified: boolean;
};

export type KnowledgePost = ContentItem & {
  kind: 'knowledge_post';
  body: string;
  sourceCommunityId?: string;
};

export type OfflineArticleBodyCache = {
  articleId: string;
  bodyCachePreview: string;
  cachedAt: string;
  cacheVersion: number;
  offlineAvailable: boolean;
  sizeBytesEstimate: number;
  sizeWarning?: string;
};
