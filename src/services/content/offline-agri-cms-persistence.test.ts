import { describe, expect, test } from 'vitest';
import { findOfflineAgriArticleBySlug } from '@/services/content/offline-agri-article-service';
import { offlineAgriArticleBaseSafetyNotes } from '@/services/content/offline-agri-article-taxonomy';
import {
  buildArticleCmsPersistencePlan,
  evaluateArticleCmsPublishContract,
  getArticleCmsPersistenceSummary,
  getArticleCmsWriteContract,
} from '@/services/content/offline-agri-cms-persistence';
import { validateOfflineAgriCmsOverride } from '@/services/content/offline-agri-cms-override';

describe('M72 offline article CMS persistence contract', () => {
  test('viewer cannot edit', () => {
    const viewer = getArticleCmsWriteContract('viewer');
    const decision = evaluateArticleCmsPublishContract('viewer');

    expect(viewer?.canEdit).toBe(false);
    expect(viewer?.canDraft).toBe(false);
    expect(decision.blockers).toContain('viewer_cannot_edit');
    expect(decision.canPublish).toBe(false);
  });

  test('automation cannot final publish', () => {
    const decision = evaluateArticleCmsPublishContract('automation', {
      evidencePacketComplete: true,
      releaseAuditWritePlanned: true,
      humanReleaseApprovalPresent: true,
    });

    expect(decision.canPublish).toBe(false);
    expect(decision.blockers).toContain('automation_final_publish_forbidden');
  });

  test('admin cannot silently bypass human release gate', () => {
    const decision = evaluateArticleCmsPublishContract('admin', {
      evidencePacketComplete: true,
      releaseAuditWritePlanned: true,
      humanReleaseApprovalPresent: false,
      silentBypassAttempt: true,
    });

    expect(decision.canPublish).toBe(false);
    expect(decision.blockers).toContain('admin_silent_bypass_forbidden');
    expect(decision.blockers).toContain('missing_human_release_approval');
  });

  test('release manager remains blocked without evidence packet', () => {
    const decision = evaluateArticleCmsPublishContract('release_manager', {
      evidencePacketComplete: false,
      releaseAuditWritePlanned: true,
      humanReleaseApprovalPresent: true,
    });

    expect(decision.canPublish).toBe(false);
    expect(decision.blockers).toContain('missing_evidence_packet');
  });

  test('offline fallback remains available when CMS is invalid', () => {
    const decision = evaluateArticleCmsPublishContract('content_editor', { cmsOverrideValid: false });

    expect(decision.offlineFallbackRemainsAvailable).toBe(true);
    expect(decision.blockers).toContain('cms_override_disclaimer_blocked');
  });

  test('CMS publish contract requires release audit write', () => {
    const plan = buildArticleCmsPersistencePlan();
    const decision = evaluateArticleCmsPublishContract('release_manager', {
      evidencePacketComplete: true,
      humanReleaseApprovalPresent: true,
      releaseAuditWritePlanned: false,
    });

    expect(plan.releaseAuditWriteContract.requiredBeforePublish).toBe(true);
    expect(plan.releaseAuditWriteContract.noFrontendWrite).toBe(true);
    expect(decision.blockers).toContain('missing_release_audit_write');
  });

  test('CMS override cannot remove disclaimers', () => {
    const article = findOfflineAgriArticleBySlug('soil-types-before-planting');
    expect(article).toBeTruthy();

    const decision = validateOfflineAgriCmsOverride(article!, {
      futureCmsKey: article!.cmsCompatibility.futureCmsKey,
      cmsVersionId: 'cms-version-m72-invalid-disclaimer',
      cmsPublishedAt: '2030-01-01',
      contentStatus: 'starter_content',
      safetyNotes: [offlineAgriArticleBaseSafetyNotes.finance],
      contentKind: 'evergreen',
    });

    expect(decision.accepted).toBe(false);
    expect(decision.offlineFallbackAvailable).toBe(true);
    expect(decision.blockers).toContain('cms_removed_general_disclaimer');
  });

  test('migration checklist includes rollback', () => {
    const summary = getArticleCmsPersistenceSummary();

    expect(summary.rollbackChecklistExists).toBe(true);
    expect(summary.plan.noMigrationsRun).toBe(true);
    expect(summary.plan.noSupabaseWrites).toBe(true);
  });
});
