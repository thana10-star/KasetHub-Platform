export type ArticleCmsSqlDraftExecutionStatus = 'not_executed';

export type ArticleCmsSqlDraftReviewStatus = 'needs_review';

export type ArticleCmsSqlDraftKind = 'schema' | 'rls' | 'seed' | 'rollback' | 'readme';

export type ArticleCmsSqlDraftArtifact = {
  fileName: string;
  relativePath: string;
  kind: ArticleCmsSqlDraftKind;
  purposeTh: string;
  executionStatus: ArticleCmsSqlDraftExecutionStatus;
  reviewStatus: ArticleCmsSqlDraftReviewStatus;
  planningOnlyWarning: 'PLANNING ONLY';
  doNotRunWarning: 'DO NOT RUN';
  doNotDeployWarning: 'DO NOT DEPLOY';
  reviewRequiredWarning: 'REVIEW REQUIRED';
  riskNotesTh: string[];
  migrationBlocked: true;
  inMigrationsFolder: false;
};

export type ArticleCmsSqlDraftRegistry = {
  registryId: string;
  basePath: 'supabase/drafts/cms';
  artifacts: ArticleCmsSqlDraftArtifact[];
  frontendCanWriteCmsRecords: false;
  finalPublishAllowed: false;
  migrationBlocked: true;
  noSqlExecuted: true;
  rollbackDraftAvailable: boolean;
};
