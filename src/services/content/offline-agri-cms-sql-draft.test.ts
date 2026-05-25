import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';
import {
  getArticleCmsSqlDraftRegistry,
  getArticleCmsSqlDraftSummary,
} from '@/services/content/offline-agri-cms-sql-draft';

describe('M74 CMS SQL draft artifacts', () => {
  test('SQL drafts are registered', () => {
    const summary = getArticleCmsSqlDraftSummary();

    expect(summary.draftCount).toBe(5);
    expect(summary.sqlDraftCount).toBe(4);
    expect(summary.registry.artifacts.map((artifact) => artifact.fileName)).toContain('0002_cms_articles_schema_draft.sql');
  });

  test('every draft has planning-only warning', () => {
    const registry = getArticleCmsSqlDraftRegistry();

    registry.artifacts.forEach((artifact) => {
      const file = readFileSync(join(process.cwd(), artifact.relativePath), 'utf8');
      expect(file).toContain('PLANNING ONLY');
      expect(file).toContain('DO NOT RUN');
      expect(file).toContain('DO NOT DEPLOY');
      expect(file).toContain('REVIEW REQUIRED');
    });
  });

  test('drafts are not under supabase migrations', () => {
    const registry = getArticleCmsSqlDraftRegistry();

    expect(registry.basePath).toBe('supabase/drafts/cms');
    expect(registry.artifacts.every((artifact) => !artifact.relativePath.includes('supabase/migrations'))).toBe(true);
    expect(registry.artifacts.every((artifact) => artifact.inMigrationsFolder === false)).toBe(true);
  });

  test('execution status is not executed', () => {
    const summary = getArticleCmsSqlDraftSummary();

    expect(summary.notExecutedCount).toBe(summary.draftCount);
    expect(summary.registry.noSqlExecuted).toBe(true);
  });

  test('migration is blocked', () => {
    const summary = getArticleCmsSqlDraftSummary();

    expect(summary.migrationBlockedCount).toBe(summary.draftCount);
    expect(summary.registry.migrationBlocked).toBe(true);
  });

  test('frontend cannot write CMS records', () => {
    const registry = getArticleCmsSqlDraftRegistry();

    expect(registry.frontendCanWriteCmsRecords).toBe(false);
  });

  test('final publish remains blocked', () => {
    const registry = getArticleCmsSqlDraftRegistry();

    expect(registry.finalPublishAllowed).toBe(false);
  });

  test('rollback draft exists', () => {
    const summary = getArticleCmsSqlDraftSummary();

    expect(summary.rollbackDraftAvailable).toBe(true);
    expect(summary.registry.artifacts.some((artifact) => artifact.fileName === '0002_cms_articles_rollback_draft.sql')).toBe(true);
  });
});
