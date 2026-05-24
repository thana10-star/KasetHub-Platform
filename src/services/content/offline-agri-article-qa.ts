import type { OfflineAgriArticle } from '@/services/content/offline-agri-article.types';
import type {
  ArticleCmsOverrideRule,
  ArticleContentReadinessScore,
  ArticleEditorialChecklist,
  ArticleImageChecklist,
  ArticleQaStatus,
  ArticleSafetyChecklist,
  ArticleVersionInfo,
  OfflineAgriArticleQaSummary,
} from '@/services/content/offline-agri-article-qa.types';
import { offlineAgriArticles } from '@/services/content/offline-agri-article-fixtures';
import { offlineAgriArticleCategories, offlineAgriArticleBaseSafetyNotes } from '@/services/content/offline-agri-article-taxonomy';

const supportedAspectRatios = new Set(['16:9', '4:3']);

export const offlineAgriArticleCmsOverrideRules: ArticleCmsOverrideRule[] = [
  {
    id: 'cms-can-extend-body',
    titleTh: 'CMS เพิ่มเนื้อหาได้',
    descriptionTh: 'CMS ในอนาคตสามารถเพิ่มเนื้อหาเต็มได้ แต่ต้องคงข้อมูลออฟไลน์เป็น fallback',
    severity: 'warning',
  },
  {
    id: 'cms-newer-title-summary-only',
    titleTh: 'แก้หัวข้อ/สรุปได้เมื่อเวอร์ชันใหม่กว่า',
    descriptionTh: 'การเปลี่ยน title/summary ต้องมาจากเวอร์ชัน CMS ที่ใหม่กว่า fixture offline',
    severity: 'blocker',
  },
  {
    id: 'cms-cannot-remove-safety',
    titleTh: 'ห้ามลบคำเตือนบังคับ',
    descriptionTh: 'CMS override ต้องไม่ลบคำเตือนพื้นฐาน คำเตือนสินเชื่อ และคำเตือนอ่านฉลากจริง',
    severity: 'blocker',
  },
  {
    id: 'cms-no-external-image-offline',
    titleTh: 'โหมด offline ห้ามใช้รูปภายนอก',
    descriptionTh: 'offline mode ต้องใช้ asset path ในแอปหรือ fallback เท่านั้น ห้ามใช้ CDN ภายนอก',
    severity: 'blocker',
  },
  {
    id: 'cms-finance-freshness-date',
    titleTh: 'เนื้อหาการเงินต้องมีวันที่ความสดใหม่',
    descriptionTh: 'สินเชื่อ โครงการรัฐ และข้อมูลเปลี่ยนเร็วต้องแสดง freshness date จาก CMS',
    severity: 'blocker',
  },
];

export function isExternalArticleImagePath(path: string) {
  return /^https?:\/\//i.test(path) || /^\/\//.test(path);
}

export function articleRequiresLabelDisclaimer(article: OfflineAgriArticle) {
  const searchableText = [article.slug, article.titleTh, article.shortSummaryTh, ...article.tagsTh].join(' ').toLowerCase();
  return article.category === 'fertilizer' || searchableText.includes('chemical') || searchableText.includes('pest') || article.tagsTh.includes('โรคพืช');
}

export function buildArticleVersionInfo(article: OfflineAgriArticle): ArticleVersionInfo {
  return {
    articleId: article.id,
    slug: article.slug,
    versionId: `${article.cmsCompatibility.futureCmsKey}:offline-v2026-05-m65`,
    contentStatus: article.bodyReadiness,
    editorialOwnerPlaceholder: 'KasetHub editorial review pending',
    lastReviewedDatePlaceholder: 'pending_review',
    futureCmsKey: article.cmsCompatibility.futureCmsKey,
    offlineFallbackPriority: 'required',
    offlineFallbackAvailable: article.offlineAvailable,
  };
}

export const offlineAgriArticleVersionFixtures: ArticleVersionInfo[] = offlineAgriArticles.map(buildArticleVersionInfo);

function mergeStatus(statuses: ArticleQaStatus[]): ArticleQaStatus {
  if (statuses.includes('fail')) {
    return 'fail';
  }

  if (statuses.includes('warn')) {
    return 'warn';
  }

  return 'pass';
}

function scoreBoolean(value: boolean) {
  return value ? 1 : 0;
}

export function buildArticleEditorialChecklist(article: OfflineAgriArticle): ArticleEditorialChecklist {
  const blockers: string[] = [];
  const warnings: string[] = [];
  const titleExists = article.titleTh.trim().length > 0;
  const summaryExists = article.shortSummaryTh.trim().length > 0;
  const categoryExists = offlineAgriArticleCategories.some((category) => category.key === article.category);
  const outlineSectionsExist = article.sections.length > 0 && article.sections.every((section) => section.headingTh && section.outlineBulletsTh.length > 0);
  const bodyReadinessClear = article.bodyReadiness === 'outline_only' || article.bodyReadiness === 'starter_content';
  const sourceStatusClear = article.sourceStatus === 'internal_draft';

  if (!titleExists) blockers.push('missing_title');
  if (!summaryExists) blockers.push('missing_summary');
  if (!categoryExists) blockers.push('missing_category');
  if (!outlineSectionsExist) blockers.push('missing_outline_sections');
  if (!bodyReadinessClear) blockers.push('unclear_body_readiness');
  if (!sourceStatusClear) blockers.push('unclear_source_status');
  if (article.bodyReadiness === 'outline_only') warnings.push('needs_full_content_later');

  return {
    titleExists,
    summaryExists,
    categoryExists,
    outlineSectionsExist,
    bodyReadinessClear,
    sourceStatusClear,
    status: blockers.length > 0 ? 'fail' : warnings.length > 0 ? 'warn' : 'pass',
    blockers,
    warnings,
  };
}

export function buildArticleSafetyChecklist(article: OfflineAgriArticle): ArticleSafetyChecklist {
  const blockers: string[] = [];
  const warnings: string[] = [];
  const safetyText = article.safetyNotes.map((note) => note.textTh);
  const generalDisclaimerExists = safetyText.includes(offlineAgriArticleBaseSafetyNotes.general.textTh);
  const financeDisclaimerRequired = article.category === 'farm_finance';
  const financeDisclaimerExists = safetyText.includes(offlineAgriArticleBaseSafetyNotes.finance.textTh);
  const labelDisclaimerRequired = articleRequiresLabelDisclaimer(article);
  const labelDisclaimerExists = safetyText.includes(offlineAgriArticleBaseSafetyNotes.fertilizer_chemical.textTh);

  if (!generalDisclaimerExists) blockers.push('missing_general_disclaimer');
  if (financeDisclaimerRequired && !financeDisclaimerExists) blockers.push('missing_finance_disclaimer');
  if (labelDisclaimerRequired && !labelDisclaimerExists) blockers.push('missing_label_disclaimer');
  if (!financeDisclaimerRequired && financeDisclaimerExists) warnings.push('finance_disclaimer_not_required_but_safe');

  return {
    generalDisclaimerExists,
    financeDisclaimerRequired,
    financeDisclaimerExists,
    labelDisclaimerRequired,
    labelDisclaimerExists,
    cmsCannotRemoveRequiredDisclaimers: true,
    status: blockers.length > 0 ? 'fail' : warnings.length > 0 ? 'warn' : 'pass',
    blockers,
    warnings,
  };
}

export function buildArticleImageChecklist(article: OfflineAgriArticle): ArticleImageChecklist {
  const blockers: string[] = [];
  const warnings: string[] = [];
  const coverMetadataExists = Boolean(article.coverImage?.plannedPath);
  const coverPathIsLocal = coverMetadataExists && !isExternalArticleImagePath(article.coverImage.plannedPath);
  const altTextExists = article.coverImage.altTextTh.trim().length > 0;
  const promptNoteExists = article.coverImage.futurePromptNote.trim().length > 0;
  const aspectRatioSupported = supportedAspectRatios.has(article.coverImage.aspectRatio);
  const offlineSizeWarningExists = article.coverImage.offlineSizeWarning.trim().length > 0;
  const plannedAssetOnly = article.coverImage.status === 'planned_asset';

  if (!coverMetadataExists) blockers.push('missing_cover_metadata');
  if (!coverPathIsLocal) blockers.push('external_or_invalid_cover_path');
  if (!altTextExists) blockers.push('missing_alt_text_th');
  if (!promptNoteExists) warnings.push('missing_future_prompt_note');
  if (!aspectRatioSupported) blockers.push('unsupported_aspect_ratio');
  if (!offlineSizeWarningExists) warnings.push('missing_offline_size_warning');
  if (plannedAssetOnly) warnings.push('planned_image_asset_not_bundled_yet');

  return {
    coverMetadataExists,
    coverPathIsLocal,
    altTextExists,
    promptNoteExists,
    aspectRatioSupported,
    offlineSizeWarningExists,
    plannedAssetOnly,
    status: blockers.length > 0 ? 'fail' : warnings.length > 0 ? 'warn' : 'pass',
    blockers,
    warnings,
  };
}

export function evaluateOfflineAgriArticleQa(article: OfflineAgriArticle): ArticleContentReadinessScore {
  const editorialChecklist = buildArticleEditorialChecklist(article);
  const safetyChecklist = buildArticleSafetyChecklist(article);
  const imageChecklist = buildArticleImageChecklist(article);
  const versionInfo = buildArticleVersionInfo(article);
  const checks = [
    editorialChecklist.titleExists,
    editorialChecklist.summaryExists,
    editorialChecklist.categoryExists,
    editorialChecklist.outlineSectionsExist,
    editorialChecklist.bodyReadinessClear,
    editorialChecklist.sourceStatusClear,
    safetyChecklist.generalDisclaimerExists,
    !safetyChecklist.financeDisclaimerRequired || safetyChecklist.financeDisclaimerExists,
    !safetyChecklist.labelDisclaimerRequired || safetyChecklist.labelDisclaimerExists,
    imageChecklist.coverMetadataExists,
    imageChecklist.coverPathIsLocal,
    imageChecklist.altTextExists,
    imageChecklist.aspectRatioSupported,
    imageChecklist.offlineSizeWarningExists,
    article.cmsCompatibility.offlineFallbackShouldRemain,
  ];
  const score = checks.reduce((total, item) => total + scoreBoolean(item), 0);
  const maxScore = checks.length;
  const cmsCompatibilityWarnings = article.cmsCompatibility.offlineFallbackShouldRemain
    ? []
    : ['offline_fallback_not_marked_required'];

  return {
    articleId: article.id,
    slug: article.slug,
    titleTh: article.titleTh,
    category: article.category,
    status: mergeStatus([editorialChecklist.status, safetyChecklist.status, imageChecklist.status]),
    score,
    maxScore,
    percentage: Math.round((score / maxScore) * 100),
    editorialChecklist,
    safetyChecklist,
    imageChecklist,
    versionInfo,
    needsFullContent: versionInfo.contentStatus !== 'ready_for_full_publish',
    cmsCompatibilityWarnings,
  };
}

export function runOfflineAgriArticleQa(): OfflineAgriArticleQaSummary {
  const articleScores = offlineAgriArticles.map(evaluateOfflineAgriArticleQa);
  const imageWarnings = articleScores
    .filter((item) => item.imageChecklist.warnings.length > 0)
    .map((item) => {
      const article = offlineAgriArticles.find((candidate) => candidate.id === item.articleId) ?? offlineAgriArticles[0];

      return {
        articleId: article.id,
        slug: article.slug,
        titleTh: article.titleTh,
        image: article.coverImage,
        warning: item.imageChecklist.warnings.join(', '),
      };
    });
  const cmsCompatibilityWarnings = articleScores.flatMap((item) =>
    item.cmsCompatibilityWarnings.map((warning) => `${item.slug}: ${warning}`),
  );

  return {
    totalArticles: articleScores.length,
    categoryCount: offlineAgriArticleCategories.length,
    passCount: articleScores.filter((item) => item.status === 'pass').length,
    warnCount: articleScores.filter((item) => item.status === 'warn').length,
    failCount: articleScores.filter((item) => item.status === 'fail').length,
    averageScore: Math.round(articleScores.reduce((total, item) => total + item.percentage, 0) / articleScores.length),
    articleScores,
    articlesNeedingFullContent: articleScores.filter((item) => item.needsFullContent),
    imageWarnings,
    cmsCompatibilityWarnings,
    disclaimerCoverage: {
      general: articleScores.filter((item) => item.safetyChecklist.generalDisclaimerExists).length,
      finance: articleScores.filter((item) => item.safetyChecklist.financeDisclaimerExists).length,
      label: articleScores.filter((item) => item.safetyChecklist.labelDisclaimerExists).length,
    },
    noNetworkRequired: true,
  };
}

export function getOfflineAgriArticleQaBySlug(slug: string) {
  const article = offlineAgriArticles.find((item) => item.slug === slug);

  return article ? evaluateOfflineAgriArticleQa(article) : undefined;
}

