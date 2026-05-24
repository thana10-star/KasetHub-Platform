export type CmsMigrationReviewStatus = 'planned' | 'blocked' | 'ready_for_review';

export type CmsMigrationBlocker =
  | 'no_migration_execution_in_m73'
  | 'no_supabase_write'
  | 'frontend_cms_write_forbidden'
  | 'public_write_forbidden'
  | 'draft_public_read_blocked'
  | 'release_gate_required'
  | 'release_audit_required'
  | 'automation_publish_forbidden'
  | 'rollback_required'
  | 'seed_fixture_review_required'
  | 'human_release_required';

export type CmsMigrationTableReview = {
  tableName: string;
  owner: 'cms_backend' | 'editorial_backend' | 'release_backend';
  writeSource: 'backend_only' | 'migration_seed_only' | 'review_workflow_only';
  readScope: 'public_reviewed_only' | 'editor_only' | 'release_admin_only';
  rlsExpectation: string;
  rollbackNote: string;
  seedStrategy: string;
  auditRequirement: string;
  status: CmsMigrationReviewStatus;
  blockers: CmsMigrationBlocker[];
};

export type CmsMigrationRlsReview = {
  id: string;
  ruleTh: string;
  status: CmsMigrationReviewStatus;
  blockers: CmsMigrationBlocker[];
};

export type CmsMigrationRollbackPlan = {
  id: string;
  hasRollback: true;
  status: CmsMigrationReviewStatus;
  stepsTh: string[];
  blockers: CmsMigrationBlocker[];
};

export type CmsMigrationSeedFixturePlan = {
  id: string;
  fixtureName: string;
  targetTables: string[];
  strategyTh: string;
  noRealInsert: true;
  status: CmsMigrationReviewStatus;
};

export type CmsMigrationPublishSafetyGate = {
  frontendCanWriteCmsRows: false;
  publicCanWrite: false;
  automationCanFinalPublish: false;
  publishAllowed: false;
  humanReleaseGateRequired: true;
  releaseAuditRequired: true;
  blockers: CmsMigrationBlocker[];
};

export type CmsMigrationDryRunReview = {
  reviewId: string;
  status: CmsMigrationReviewStatus;
  tableReviews: CmsMigrationTableReview[];
  rlsReviews: CmsMigrationRlsReview[];
  rollbackPlan: CmsMigrationRollbackPlan;
  seedFixturePlans: CmsMigrationSeedFixturePlan[];
  publishSafetyGate: CmsMigrationPublishSafetyGate;
  noMigrationRun: true;
  noSupabaseWrite: true;
  noBackendCmsWrite: true;
};
