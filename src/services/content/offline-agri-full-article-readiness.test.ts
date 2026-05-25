import { describe, expect, test } from 'vitest';
import { offlineAgriArticles } from '@/services/content/offline-agri-article-fixtures';
import {
  evaluateFullArticlePublishReadiness,
  runFullArticlePublishReadiness,
} from '@/services/content/offline-agri-full-article-readiness';
import {
  findOfflineAgriFullArticleTemplateByPilotSlug,
  fullArticlePilotSlugs,
  offlineAgriFullArticleTemplates,
} from '@/services/content/offline-agri-full-article-template';

describe('offline full article drafting readiness', () => {
  test('M67 pilot templates exist for requested article slugs', () => {
    const summary = runFullArticlePublishReadiness();

    expect(summary.pilotCount).toBe(fullArticlePilotSlugs.length);
    expect(offlineAgriFullArticleTemplates.map((template) => template.pilotSlug)).toEqual([...fullArticlePilotSlugs]);
    expect(summary.noOfficialFullArticlePublished).toBe(true);
  });

  test('M67 full article cannot publish without filled source placeholders', () => {
    const template = findOfflineAgriFullArticleTemplateByPilotSlug('soil-types-before-planting')!;
    const gate = evaluateFullArticlePublishReadiness(template);

    expect(gate.canMarkReadyForFullPublish).toBe(false);
    expect(gate.blockers).toContain('source_placeholders_not_filled');
  });

  test('M67 finance article cannot publish without freshness date', () => {
    const template = findOfflineAgriFullArticleTemplateByPilotSlug('farm-break-even-price')!;
    const gate = evaluateFullArticlePublishReadiness(template);

    expect(template.freshnessRequired).toBe(true);
    expect(gate.blockers).toContain('freshness_date_required_for_finance_or_government');
  });

  test('M67 fertilizer article cannot publish without label warning', () => {
    const template = findOfflineAgriFullArticleTemplateByPilotSlug('npk-label-basics')!;
    const brokenTemplate = {
      ...template,
      safetyNoteTypes: template.safetyNoteTypes.filter((type) => type !== 'fertilizer_chemical'),
    };
    const gate = evaluateFullArticlePublishReadiness(brokenTemplate);

    expect(gate.blockers).toContain('missing_label_warning');
  });

  test('M67 expert escalation note is required for risky topics', () => {
    const template = findOfflineAgriFullArticleTemplateByPilotSlug('rice-cost-profit-per-rai')!;
    const brokenTemplate = {
      ...template,
      expertEscalationNotes: [],
    };
    const gate = evaluateFullArticlePublishReadiness(brokenTemplate);

    expect(gate.blockers).toContain('expert_escalation_note_required');
  });

  test('M67 image requirements must exist', () => {
    const template = findOfflineAgriFullArticleTemplateByPilotSlug('cassava-plant-spacing-per-rai')!;
    const brokenTemplate = {
      ...template,
      imageRequirements: [],
    };
    const gate = evaluateFullArticlePublishReadiness(brokenTemplate);

    expect(gate.blockers).toContain('image_metadata_invalid_or_missing');
  });

  test('M67 offline article fallback remains available for every pilot template', () => {
    const summary = runFullArticlePublishReadiness();

    expect(summary.gates.every((gate) => gate.fallbackAvailable)).toBe(true);
    expect(summary.gates.every((gate) => gate.blockers.includes('draft_status_not_ready_for_full_publish'))).toBe(true);
  });

  test('M67 non-pilot offline articles remain outline or starter content', () => {
    const pilotSourceSlugs = new Set(offlineAgriFullArticleTemplates.map((template) => template.sourceArticleSlug));
    const nonPilotArticles = offlineAgriArticles.filter((article) => !pilotSourceSlugs.has(article.slug));

    expect(nonPilotArticles.length).toBeGreaterThan(0);
    expect(nonPilotArticles.every((article) => article.bodyReadiness === 'outline_only' || article.bodyReadiness === 'starter_content')).toBe(true);
    expect(offlineAgriFullArticleTemplates).toHaveLength(5);
  });
});
