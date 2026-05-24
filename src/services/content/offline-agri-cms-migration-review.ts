import { articleCmsFutureTables } from '@/services/content/offline-agri-cms-persistence';
import type {
  CmsMigrationBlocker,
  CmsMigrationDryRunReview,
  CmsMigrationPublishSafetyGate,
  CmsMigrationRollbackPlan,
  CmsMigrationRlsReview,
  CmsMigrationSeedFixturePlan,
  CmsMigrationTableReview,
} from '@/services/content/offline-agri-cms-migration-review.types';

const tableReadScope: Record<string, CmsMigrationTableReview['readScope']> = {
  articles: 'public_reviewed_only',
  article_versions: 'editor_only',
  article_full_body_versions: 'editor_only',
  article_source_reviews: 'editor_only',
  article_expert_reviews: 'editor_only',
  article_image_assets: 'public_reviewed_only',
  article_release_gates: 'release_admin_only',
  article_release_audit_events: 'release_admin_only',
  article_release_attempts: 'release_admin_only',
  article_reviewer_history: 'editor_only',
  article_cms_overrides: 'editor_only',
};

const tableOwner: Record<string, CmsMigrationTableReview['owner']> = {
  articles: 'cms_backend',
  article_versions: 'cms_backend',
  article_full_body_versions: 'cms_backend',
  article_source_reviews: 'editorial_backend',
  article_expert_reviews: 'editorial_backend',
  article_image_assets: 'cms_backend',
  article_release_gates: 'release_backend',
  article_release_audit_events: 'release_backend',
  article_release_attempts: 'release_backend',
  article_reviewer_history: 'editorial_backend',
  article_cms_overrides: 'cms_backend',
};

const tableWriteSource: Record<string, CmsMigrationTableReview['writeSource']> = {
  articles: 'backend_only',
  article_versions: 'backend_only',
  article_full_body_versions: 'backend_only',
  article_source_reviews: 'review_workflow_only',
  article_expert_reviews: 'review_workflow_only',
  article_image_assets: 'backend_only',
  article_release_gates: 'review_workflow_only',
  article_release_audit_events: 'backend_only',
  article_release_attempts: 'backend_only',
  article_reviewer_history: 'review_workflow_only',
  article_cms_overrides: 'backend_only',
};

const defaultBlockers: CmsMigrationBlocker[] = [
  'no_migration_execution_in_m73',
  'no_supabase_write',
  'frontend_cms_write_forbidden',
  'rollback_required',
];

function buildTableReview(tableName: string): CmsMigrationTableReview {
  const readScope = tableReadScope[tableName] ?? 'editor_only';
  const releaseTable = tableName.includes('release');

  return {
    tableName,
    owner: tableOwner[tableName] ?? 'cms_backend',
    writeSource: tableWriteSource[tableName] ?? 'backend_only',
    readScope,
    rlsExpectation:
      readScope === 'public_reviewed_only'
        ? 'public can read approved published rows only; writes are backend/editor scoped'
        : 'draft/review/release rows are blocked from anon/public and require scoped editor or backend access',
    rollbackNote: `rollback must drop or revert ${tableName} only after dependent release/audit checks are reviewed`,
    seedStrategy: tableName === 'articles' ? 'seed reviewed offline starter article references only in a future dry run' : 'seed planning fixtures only; no real insert in M73',
    auditRequirement: releaseTable ? 'release/audit writes must create backend-owned audit event previews' : 'writes must be traceable to editor/reviewer workflow in future backend',
    status: 'blocked',
    blockers: releaseTable ? [...defaultBlockers, 'release_audit_required', 'human_release_required'] : defaultBlockers,
  };
}

export const cmsMigrationTableReviews: CmsMigrationTableReview[] = articleCmsFutureTables.map(buildTableReview);

export const cmsMigrationRlsReviews: CmsMigrationRlsReview[] = [
  {
    id: 'viewer-cannot-write',
    ruleTh: 'viewer และ public/anon เขียน CMS rows ไม่ได้',
    status: 'blocked',
    blockers: ['public_write_forbidden', 'frontend_cms_write_forbidden'],
  },
  {
    id: 'editor-cannot-bypass-release',
    ruleTh: 'editor แก้ draft ได้ แต่ bypass release gate ไม่ได้',
    status: 'blocked',
    blockers: ['release_gate_required', 'human_release_required'],
  },
  {
    id: 'release-manager-needs-audit',
    ruleTh: 'release manager ขอ release ได้ แต่ต้องมี release audit write requirement',
    status: 'blocked',
    blockers: ['release_audit_required', 'human_release_required'],
  },
  {
    id: 'automation-no-final-publish',
    ruleTh: 'automation/service accounts final publish โดยตรงไม่ได้',
    status: 'blocked',
    blockers: ['automation_publish_forbidden', 'human_release_required'],
  },
  {
    id: 'public-read-approved-only',
    ruleTh: 'public อ่านได้เฉพาะบทความที่ approved และ published แล้ว',
    status: 'planned',
    blockers: ['draft_public_read_blocked'],
  },
  {
    id: 'drafts-blocked-from-public',
    ruleTh: 'unpublished drafts ต้องถูก block จาก anon/public',
    status: 'planned',
    blockers: ['draft_public_read_blocked'],
  },
];

export const cmsMigrationRollbackPlan: CmsMigrationRollbackPlan = {
  id: 'm73-cms-migration-rollback-plan',
  hasRollback: true,
  status: 'blocked',
  stepsTh: [
    'บันทึก migration id และ dependency order ก่อน run จริง',
    'เตรียม rollback SQL แยกตาราง article/release/audit',
    'ตรวจว่า rollback ไม่ลบ bundled offline fallback',
    'ยืนยันว่าไม่มี frontend path เขียน CMS rows',
  ],
  blockers: ['rollback_required', 'no_migration_execution_in_m73'],
};

export const cmsMigrationSeedFixturePlans: CmsMigrationSeedFixturePlan[] = [
  {
    id: 'starter-offline-article-import',
    fixtureName: 'starter offline article import',
    targetTables: ['articles', 'article_versions', 'article_full_body_versions'],
    strategyTh: 'เตรียม seed จาก bundled offline article metadata เฉพาะหลัง review แล้ว',
    noRealInsert: true,
    status: 'planned',
  },
  {
    id: 'article-categories',
    fixtureName: 'article categories',
    targetTables: ['articles'],
    strategyTh: 'map category key เดิมเข้ากับ CMS category metadata ในอนาคต',
    noRealInsert: true,
    status: 'planned',
  },
  {
    id: 'article-review-fixtures',
    fixtureName: 'article review fixtures',
    targetTables: ['article_source_reviews', 'article_expert_reviews', 'article_reviewer_history'],
    strategyTh: 'เก็บ review placeholders เป็น seed plan เท่านั้น ยังไม่ insert',
    noRealInsert: true,
    status: 'planned',
  },
  {
    id: 'release-gate-fixtures',
    fixtureName: 'release gate fixtures',
    targetTables: ['article_release_gates', 'article_release_audit_events', 'article_release_attempts'],
    strategyTh: 'เตรียม gate และ audit fixture ที่พิสูจน์ว่ายัง publish ไม่ได้',
    noRealInsert: true,
    status: 'blocked',
  },
  {
    id: 'fallback-article-fixtures',
    fixtureName: 'fallback article fixtures',
    targetTables: ['articles', 'article_cms_overrides'],
    strategyTh: 'เตรียมกรณี CMS invalid แล้ว fallback เป็น bundled offline article',
    noRealInsert: true,
    status: 'planned',
  },
];

export const cmsMigrationPublishSafetyGate: CmsMigrationPublishSafetyGate = {
  frontendCanWriteCmsRows: false,
  publicCanWrite: false,
  automationCanFinalPublish: false,
  publishAllowed: false,
  humanReleaseGateRequired: true,
  releaseAuditRequired: true,
  blockers: [
    'frontend_cms_write_forbidden',
    'public_write_forbidden',
    'release_gate_required',
    'release_audit_required',
    'automation_publish_forbidden',
    'human_release_required',
    'no_migration_execution_in_m73',
  ],
};

export function buildCmsMigrationDryRunReview(): CmsMigrationDryRunReview {
  return {
    reviewId: 'm73-cms-migration-dry-run-review',
    status: 'blocked',
    tableReviews: cmsMigrationTableReviews,
    rlsReviews: cmsMigrationRlsReviews,
    rollbackPlan: cmsMigrationRollbackPlan,
    seedFixturePlans: cmsMigrationSeedFixturePlans,
    publishSafetyGate: cmsMigrationPublishSafetyGate,
    noMigrationRun: true,
    noSupabaseWrite: true,
    noBackendCmsWrite: true,
  };
}

export function getCmsMigrationReviewSummary() {
  const review = buildCmsMigrationDryRunReview();

  return {
    tableCount: review.tableReviews.length,
    rlsRuleCount: review.rlsReviews.length,
    seedFixtureCount: review.seedFixturePlans.length,
    rollbackReady: review.rollbackPlan.hasRollback,
    blockedTableCount: review.tableReviews.filter((table) => table.status === 'blocked').length,
    publishAllowed: review.publishSafetyGate.publishAllowed,
    frontendCanWriteCmsRows: review.publishSafetyGate.frontendCanWriteCmsRows,
    review,
  };
}
