import type {
  ArticleCmsSqlDraftArtifact,
  ArticleCmsSqlDraftRegistry,
} from '@/services/content/offline-agri-cms-sql-draft.types';

const baseWarnings = {
  planningOnlyWarning: 'PLANNING ONLY',
  doNotRunWarning: 'DO NOT RUN',
  doNotDeployWarning: 'DO NOT DEPLOY',
  reviewRequiredWarning: 'REVIEW REQUIRED',
} as const;

export const articleCmsSqlDraftArtifacts: ArticleCmsSqlDraftArtifact[] = [
  {
    fileName: '0002_cms_articles_schema_draft.sql',
    relativePath: 'supabase/drafts/cms/0002_cms_articles_schema_draft.sql',
    kind: 'schema',
    purposeTh: 'ร่าง DDL สำหรับตาราง article CMS ในอนาคต',
    executionStatus: 'not_executed',
    reviewStatus: 'needs_review',
    ...baseWarnings,
    riskNotesTh: ['ยังไม่ใช่ migration', 'ต้อง review schema/RLS/rollback ก่อนใช้งานจริง'],
    migrationBlocked: true,
    inMigrationsFolder: false,
  },
  {
    fileName: '0002_cms_articles_rls_draft.sql',
    relativePath: 'supabase/drafts/cms/0002_cms_articles_rls_draft.sql',
    kind: 'rls',
    purposeTh: 'ร่าง policy สำหรับ public read, editor draft, reviewer scope และ release gate',
    executionStatus: 'not_executed',
    reviewStatus: 'needs_review',
    ...baseWarnings,
    riskNotesTh: ['RLS ยังไม่ผ่าน staging review', 'service role ต้องอยู่ backend เท่านั้น'],
    migrationBlocked: true,
    inMigrationsFolder: false,
  },
  {
    fileName: '0002_cms_articles_seed_draft.sql',
    relativePath: 'supabase/drafts/cms/0002_cms_articles_seed_draft.sql',
    kind: 'seed',
    purposeTh: 'ร่างแนวคิด seed fixture สำหรับบทความ offline, category, review และ release gate',
    executionStatus: 'not_executed',
    reviewStatus: 'needs_review',
    ...baseWarnings,
    riskNotesTh: ['ไม่มี insert จริง', 'ห้าม seed official claim หรือ final publish'],
    migrationBlocked: true,
    inMigrationsFolder: false,
  },
  {
    fileName: '0002_cms_articles_rollback_draft.sql',
    relativePath: 'supabase/drafts/cms/0002_cms_articles_rollback_draft.sql',
    kind: 'rollback',
    purposeTh: 'ร่าง rollback dependency order สำหรับตาราง CMS draft',
    executionStatus: 'not_executed',
    reviewStatus: 'needs_review',
    ...baseWarnings,
    riskNotesTh: ['ห้าม run โดยไม่มี backup', 'ต้องรักษา offline fallback'],
    migrationBlocked: true,
    inMigrationsFolder: false,
  },
  {
    fileName: 'README.md',
    relativePath: 'supabase/drafts/cms/README.md',
    kind: 'readme',
    purposeTh: 'อธิบายขอบเขต draft-only และตำแหน่งไฟล์ที่ไม่ใช่ migrations',
    executionStatus: 'not_executed',
    reviewStatus: 'needs_review',
    ...baseWarnings,
    riskNotesTh: ['ใช้ประกอบการ review เท่านั้น', 'ไม่ใช่คำสั่ง migration'],
    migrationBlocked: true,
    inMigrationsFolder: false,
  },
];

export function getArticleCmsSqlDraftRegistry(): ArticleCmsSqlDraftRegistry {
  return {
    registryId: 'm74-cms-sql-draft-artifacts',
    basePath: 'supabase/drafts/cms',
    artifacts: articleCmsSqlDraftArtifacts,
    frontendCanWriteCmsRecords: false,
    finalPublishAllowed: false,
    migrationBlocked: true,
    noSqlExecuted: true,
    rollbackDraftAvailable: articleCmsSqlDraftArtifacts.some((artifact) => artifact.kind === 'rollback'),
  };
}

export function getArticleCmsSqlDraftSummary() {
  const registry = getArticleCmsSqlDraftRegistry();

  return {
    draftCount: registry.artifacts.length,
    sqlDraftCount: registry.artifacts.filter((artifact) => artifact.fileName.endsWith('.sql')).length,
    notExecutedCount: registry.artifacts.filter((artifact) => artifact.executionStatus === 'not_executed').length,
    needsReviewCount: registry.artifacts.filter((artifact) => artifact.reviewStatus === 'needs_review').length,
    migrationBlockedCount: registry.artifacts.filter((artifact) => artifact.migrationBlocked).length,
    rollbackDraftAvailable: registry.rollbackDraftAvailable,
    frontendCanWriteCmsRecords: registry.frontendCanWriteCmsRecords,
    finalPublishAllowed: registry.finalPublishAllowed,
    registry,
  };
}
