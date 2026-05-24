import type {
  FullArticleBodyTemplate,
  FullArticlePublishReadinessGate,
  FullArticleReadinessSummary,
} from '@/services/content/offline-agri-full-article.types';
import { offlineAgriArticles } from '@/services/content/offline-agri-article-fixtures';
import { offlineAgriArticleBaseSafetyNotes } from '@/services/content/offline-agri-article-taxonomy';
import {
  findOfflineAgriFullArticleTemplateByPilotSlug,
  findOfflineAgriFullArticleTemplateForArticleSlug,
  offlineAgriFullArticleTemplates,
} from '@/services/content/offline-agri-full-article-template';

const localPathPattern = /^public\/assets\/articles\/[a-z_]+\/[a-z0-9-]+-(cover|inline-\d+)\.webp$/;

function hasOfflineFallback(template: FullArticleBodyTemplate) {
  return offlineAgriArticles.some(
    (article) =>
      article.offlineAvailable &&
      (article.slug === template.offlineFallbackArticleSlug || article.slug === template.sourceArticleSlug),
  );
}

function isRiskyTemplate(template: FullArticleBodyTemplate) {
  return (
    template.category === 'fertilizer' ||
    template.category === 'farm_finance' ||
    template.expertEscalationNotes.length > 0 ||
    template.safetyNoteTypes.includes('fertilizer_chemical') ||
    template.safetyNoteTypes.includes('finance')
  );
}

function safetyTextForTemplate(template: FullArticleBodyTemplate) {
  return template.safetyNoteTypes.map((type) => offlineAgriArticleBaseSafetyNotes[type]?.textTh).filter(Boolean);
}

function imageMetadataIsValid(template: FullArticleBodyTemplate) {
  return (
    template.imageRequirements.length > 0 &&
    template.imageRequirements.every(
      (image) =>
        image.required &&
        image.plannedPath.trim().length > 0 &&
        localPathPattern.test(image.plannedPath) &&
        image.altTextTh.trim().length > 0 &&
        image.sizeLimitKb > 0 &&
        (image.aspectRatio === '16:9' || image.aspectRatio === '4:3'),
    )
  );
}

export function evaluateFullArticlePublishReadiness(
  template: FullArticleBodyTemplate,
): FullArticlePublishReadinessGate {
  const blockers: string[] = [];
  const warnings: string[] = [];
  const passedChecks: string[] = [];
  const requiredSources = template.sourcePlaceholders.filter((source) => source.required);
  const filledSources = requiredSources.filter((source) => source.status === 'filled_future');
  const requiredReviews = template.reviewRequirements.filter((review) => review.required);
  const filledReviews = requiredReviews.filter((review) => review.status === 'filled_future');
  const safetyText = safetyTextForTemplate(template);

  if (requiredSources.length === 0) {
    blockers.push('source_placeholders_required');
  } else {
    passedChecks.push('source_placeholders_exist');
  }

  if (filledSources.length < requiredSources.length) {
    blockers.push('source_placeholders_not_filled');
  } else {
    passedChecks.push('source_placeholders_filled');
  }

  if (!template.safetyNoteTypes.includes('general') || safetyText.length === 0) {
    blockers.push('missing_general_disclaimer');
  } else {
    passedChecks.push('general_disclaimer_present');
  }

  if (template.category === 'farm_finance' && !template.safetyNoteTypes.includes('finance')) {
    blockers.push('missing_finance_disclaimer');
  } else if (template.category === 'farm_finance') {
    passedChecks.push('finance_disclaimer_present');
  }

  if (template.category === 'fertilizer' && !template.safetyNoteTypes.includes('fertilizer_chemical')) {
    blockers.push('missing_label_warning');
  } else if (template.category === 'fertilizer') {
    passedChecks.push('label_warning_present');
  }

  if (requiredReviews.length === 0) {
    blockers.push('reviewer_placeholder_required');
  } else {
    passedChecks.push('reviewer_placeholders_exist');
  }

  if (filledReviews.length < requiredReviews.length) {
    blockers.push('review_requirements_not_filled');
  } else {
    passedChecks.push('review_requirements_filled');
  }

  if (!template.lastReviewedDatePlaceholder || template.lastReviewedDatePlaceholder === 'pending_review_date') {
    blockers.push('last_reviewed_date_required');
  } else {
    passedChecks.push('last_reviewed_date_present');
  }

  if (!imageMetadataIsValid(template)) {
    blockers.push('image_metadata_invalid_or_missing');
  } else {
    passedChecks.push('image_metadata_valid');
  }

  if (template.freshnessRequired && (!template.freshnessDatePlaceholder || template.freshnessDatePlaceholder.startsWith('pending_'))) {
    blockers.push('freshness_date_required_for_finance_or_government');
  } else if (template.freshnessRequired) {
    passedChecks.push('freshness_date_present');
  }

  if (isRiskyTemplate(template) && template.expertEscalationNotes.filter((note) => note.required).length === 0) {
    blockers.push('expert_escalation_note_required');
  } else if (isRiskyTemplate(template)) {
    passedChecks.push('expert_escalation_notes_present');
  }

  if (template.draftStatus !== 'ready_for_full_publish') {
    blockers.push('draft_status_not_ready_for_full_publish');
  }

  if (template.sourceArticleSlug !== template.pilotSlug) {
    warnings.push('pilot_slug_uses_existing_offline_fallback_article');
  }

  const fallbackAvailable = hasOfflineFallback(template);
  if (!fallbackAvailable) {
    blockers.push('offline_fallback_missing');
  } else {
    passedChecks.push('offline_fallback_available');
  }

  return {
    templateId: template.id,
    pilotSlug: template.pilotSlug,
    titleTh: template.titleTh,
    draftStatus: template.draftStatus,
    canMarkReadyForFullPublish: false,
    status: 'blocked',
    blockers: Array.from(new Set(blockers)),
    warnings,
    passedChecks: Array.from(new Set(passedChecks)),
    fallbackAvailable,
    sourcePlaceholderCount: requiredSources.length,
    filledSourceCount: filledSources.length,
    imageRequirementCount: template.imageRequirements.length,
    expertEscalationCount: template.expertEscalationNotes.length,
  };
}

export function runFullArticlePublishReadiness(): FullArticleReadinessSummary {
  const gates = offlineAgriFullArticleTemplates.map(evaluateFullArticlePublishReadiness);

  return {
    pilotCount: offlineAgriFullArticleTemplates.length,
    blockedCount: gates.filter((gate) => gate.status === 'blocked').length,
    readyFutureCount: gates.filter((gate) => gate.status === 'ready_future').length,
    gates,
    pilotTemplates: offlineAgriFullArticleTemplates,
    noNetworkRequired: true,
    noOfficialFullArticlePublished: true,
  };
}

export function getFullArticleReadinessByPilotSlug(slug: string) {
  const template = findOfflineAgriFullArticleTemplateByPilotSlug(slug);

  return template ? evaluateFullArticlePublishReadiness(template) : undefined;
}

export function getFullArticleReadinessForArticleSlug(slug: string) {
  const template = findOfflineAgriFullArticleTemplateForArticleSlug(slug);

  return template ? evaluateFullArticlePublishReadiness(template) : undefined;
}
