import type { LucideIcon } from 'lucide-react';
import type { CropPriceItem } from '@/services/crop-prices/crop-price.types';

export type AppRoute =
  | '/app'
  | '/app/admin'
  | '/app/supabase-readiness'
  | '/app/supabase-connection'
  | '/app/supabase-readonly-probe'
  | '/app/supabase-setup-guide'
  | '/app/supabase-sql-checklist'
  | '/app/env-safety'
  | '/app/youtube'
  | '/app/ai'
  | '/app/ai-proxy-status'
  | '/app/ai-credits'
  | '/app/qa'
  | '/app/mvp-snapshot'
  | '/app/next-phase'
  | '/app/weather'
  | '/app/farm-area'
  | '/app/farm-area-guide'
  | '/app/analyze'
  | '/app/analysis-history'
  | '/app/image-privacy'
  | '/app/image-preflight'
  | '/app/community'
  | '/app/community-rules'
  | '/app/moderation-center'
  | '/app/prices'
  | '/app/crop-watch'
  | '/app/articles'
  | '/app/content-admin-preview'
  | '/app/notifications'
  | '/app/notification-settings'
  | '/app/profile'
  | '/app/account-preview'
  | '/app/guest-sync-edge'
  | '/app/guest-sync-status'
  | '/app/auth'
  | '/app/auth/status'
  | '/app/auth/linking'
  | '/app/auth/phone'
  | '/app/auth/phone-staging'
  | '/app/auth/line'
  | '/app/auth/google'
  | '/app/auth/sync-preview'
  | '/app/memory'
  | '/app/my-farm'
  | '/app/my-farm/settings'
  | '/app/saved-articles'
  | '/app/saved-videos';

export type QuickAction = {
  label: string;
  description: string;
  href: AppRoute;
  icon: LucideIcon;
  accent: 'green' | 'gold' | 'sky' | 'rose' | 'earth';
};

export type VideoCategory = 'ทั้งหมด' | 'ข้าว' | 'ทุเรียน' | 'ดินและปุ๋ย' | 'ตลาด' | 'โรคพืช';

export type KasetVideo = {
  id: string;
  title: string;
  channel: string;
  category: VideoCategory;
  duration: string;
  views: string;
  publishedAt: string;
  summary: string;
  tone: 'rice' | 'orchard' | 'soil' | 'market' | 'disease';
  isFeatured?: boolean;
};

export type CommunityPost = {
  id: string;
  author: string;
  province: string;
  role: string;
  postedAt: string;
  body: string;
  topic: string;
  imageTone: 'field' | 'leaf' | 'fruit' | 'water' | 'soil';
  likes: number;
  comments: number;
};

export type CropPrice = CropPriceItem;

export type ArticleCategory = 'ข่าวเกษตร' | 'องค์ความรู้' | 'เทคโนโลยี' | 'ตลาด' | 'ชุมชน';

export type Article = {
  id: string;
  title: string;
  category: ArticleCategory;
  excerpt: string;
  author: string;
  readTime: string;
  publishedAt: string;
  imageTone: 'news' | 'tech' | 'soil' | 'market' | 'community';
};

export type SavedArticle = Article & {
  savedAt: string;
  offlineReady: boolean;
  offlineAvailable?: boolean;
  cachedAt?: string;
  cacheVersion?: number;
  bodyCachePreview?: string;
  cacheSizeWarning?: string;
};

export type NotificationItem = {
  id: string;
  title: string;
  body: string;
  time: string;
  type: 'ai' | 'price' | 'community' | 'content' | 'weather';
  unread?: boolean;
};

export type AiCreditState = {
  remainingQuestions: number;
  unlockCopy: string;
  disclaimer: string;
};

export type DiseaseAnalysisResult = {
  diseaseName: string;
  confidence: number;
  crop: string;
  symptoms: string[];
  treatments: string[];
  disclaimer: string;
};

export type FarmAnalysisStatus = 'เฝ้าระวัง' | 'กำลังรักษา' | 'ดีขึ้นแล้ว';

export type FarmAnalysisRecord = {
  id: string;
  cropName: string;
  diseaseName: string;
  date: string;
  confidence: number;
  symptomsSummary: string;
  treatmentSummary: string;
  status: FarmAnalysisStatus;
};
