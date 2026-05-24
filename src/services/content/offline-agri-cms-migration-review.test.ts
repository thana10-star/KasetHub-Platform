import { describe, expect, test } from 'vitest';
import {
  buildCmsMigrationDryRunReview,
  getCmsMigrationReviewSummary,
} from '@/services/content/offline-agri-cms-migration-review';

describe('M73 CMS migration dry-run review pack', () => {
  test('migration review includes rollback', () => {
    const review = buildCmsMigrationDryRunReview();

    expect(review.rollbackPlan.hasRollback).toBe(true);
    expect(review.rollbackPlan.blockers).toContain('rollback_required');
    expect(review.noMigrationRun).toBe(true);
  });

  test('migration review includes RLS notes', () => {
    const review = buildCmsMigrationDryRunReview();

    expect(review.rlsReviews.length).toBeGreaterThan(0);
    expect(review.rlsReviews.map((item) => item.id)).toContain('viewer-cannot-write');
    expect(review.rlsReviews.map((item) => item.id)).toContain('public-read-approved-only');
  });

  test('public content remains read-only', () => {
    const review = buildCmsMigrationDryRunReview();
    const articles = review.tableReviews.find((table) => table.tableName === 'articles');

    expect(articles?.readScope).toBe('public_reviewed_only');
    expect(review.publishSafetyGate.publicCanWrite).toBe(false);
  });

  test('drafts remain blocked from public', () => {
    const review = buildCmsMigrationDryRunReview();

    expect(review.rlsReviews.find((item) => item.id === 'drafts-blocked-from-public')?.blockers).toContain('draft_public_read_blocked');
  });

  test('frontend cannot write CMS rows', () => {
    const summary = getCmsMigrationReviewSummary();

    expect(summary.frontendCanWriteCmsRows).toBe(false);
    expect(summary.review.publishSafetyGate.blockers).toContain('frontend_cms_write_forbidden');
  });

  test('automation cannot final publish', () => {
    const review = buildCmsMigrationDryRunReview();

    expect(review.publishSafetyGate.automationCanFinalPublish).toBe(false);
    expect(review.publishSafetyGate.blockers).toContain('automation_publish_forbidden');
  });

  test('seed fixture plan exists', () => {
    const review = buildCmsMigrationDryRunReview();

    expect(review.seedFixturePlans.length).toBeGreaterThanOrEqual(5);
    expect(review.seedFixturePlans.every((fixture) => fixture.noRealInsert)).toBe(true);
    expect(review.seedFixturePlans.map((fixture) => fixture.fixtureName)).toContain('starter offline article import');
  });

  test('publish safety gate still blocks incomplete content', () => {
    const summary = getCmsMigrationReviewSummary();

    expect(summary.publishAllowed).toBe(false);
    expect(summary.review.publishSafetyGate.humanReleaseGateRequired).toBe(true);
    expect(summary.review.publishSafetyGate.releaseAuditRequired).toBe(true);
  });
});
