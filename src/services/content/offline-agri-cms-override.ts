import type { OfflineAgriArticle, OfflineAgriArticleSafetyNote } from '@/services/content/offline-agri-article.types';
import { offlineAgriArticleBaseSafetyNotes } from '@/services/content/offline-agri-article-taxonomy';
import { articleRequiresLabelDisclaimer, isExternalArticleImagePath, offlineAgriArticleCmsOverrideRules } from '@/services/content/offline-agri-article-qa';
import type {
  OfflineAgriCmsOverrideDecision,
  OfflineAgriCmsOverrideMode,
  OfflineAgriCmsOverridePayload,
} from '@/services/content/offline-agri-cms-override.types';

function isNewerCmsVersion(article: OfflineAgriArticle, override: OfflineAgriCmsOverridePayload) {
  return new Date(override.cmsPublishedAt).getTime() > new Date(article.updatedAt).getTime();
}

function hasSafetyNote(notes: OfflineAgriArticleSafetyNote[], requiredText: string) {
  return notes.some((note) => note.textTh === requiredText);
}

function validateSafetyNotes(article: OfflineAgriArticle, override: OfflineAgriCmsOverridePayload) {
  const notes = override.safetyNotes ?? article.safetyNotes;
  const blockers: string[] = [];

  if (!hasSafetyNote(notes, offlineAgriArticleBaseSafetyNotes.general.textTh)) {
    blockers.push('cms_removed_general_disclaimer');
  }

  if (article.category === 'farm_finance' && !hasSafetyNote(notes, offlineAgriArticleBaseSafetyNotes.finance.textTh)) {
    blockers.push('cms_removed_finance_disclaimer');
  }

  if (articleRequiresLabelDisclaimer(article) && !hasSafetyNote(notes, offlineAgriArticleBaseSafetyNotes.fertilizer_chemical.textTh)) {
    blockers.push('cms_removed_label_disclaimer');
  }

  return blockers;
}

export function validateOfflineAgriCmsOverride(
  article: OfflineAgriArticle,
  override: OfflineAgriCmsOverridePayload,
  mode: OfflineAgriCmsOverrideMode = 'offline',
): OfflineAgriCmsOverrideDecision {
  const blockers: string[] = [];
  const warnings: string[] = [];

  if (override.futureCmsKey !== article.cmsCompatibility.futureCmsKey) {
    blockers.push('future_cms_key_mismatch');
  }

  if ((override.titleTh || override.shortSummaryTh) && !isNewerCmsVersion(article, override)) {
    blockers.push('title_summary_update_requires_newer_version');
  }

  blockers.push(...validateSafetyNotes(article, override));

  if (mode === 'offline' && override.coverImage && isExternalArticleImagePath(override.coverImage.plannedPath)) {
    blockers.push('external_image_blocked_in_offline_mode');
  }

  const needsFreshnessDate =
    article.category === 'farm_finance' || override.contentKind === 'finance' || override.contentKind === 'government' || override.contentKind === 'seasonal';
  if (needsFreshnessDate && !override.freshnessDate) {
    blockers.push('freshness_date_required_for_fast_changing_content');
  }

  if (override.sectionCount && override.sectionCount > article.sections.length) {
    warnings.push('cms_extends_body_preview_only');
  }

  if (blockers.length > 0) {
    return {
      accepted: false,
      status: 'blocked_use_offline_fallback',
      appliedArticle: article,
      offlineFallbackArticle: article,
      offlineFallbackAvailable: article.offlineAvailable && article.cmsCompatibility.offlineFallbackShouldRemain,
      blockers,
      warnings,
      rules: offlineAgriArticleCmsOverrideRules,
    };
  }

  return {
    accepted: true,
    status: 'accepted_preview',
    appliedArticle: {
      ...article,
      titleTh: override.titleTh ?? article.titleTh,
      shortSummaryTh: override.shortSummaryTh ?? article.shortSummaryTh,
      safetyNotes: override.safetyNotes ?? article.safetyNotes,
      coverImage: override.coverImage ?? article.coverImage,
      bodyReadiness: override.contentStatus === 'outline_only' || override.contentStatus === 'starter_content' ? override.contentStatus : article.bodyReadiness,
    },
    offlineFallbackArticle: article,
    offlineFallbackAvailable: article.offlineAvailable && article.cmsCompatibility.offlineFallbackShouldRemain,
    blockers,
    warnings,
    rules: offlineAgriArticleCmsOverrideRules,
  };
}

