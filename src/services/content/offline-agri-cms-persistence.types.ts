export type ArticleCmsRole =
  | 'viewer'
  | 'content_editor'
  | 'agriculture_expert'
  | 'safety_reviewer'
  | 'image_reviewer'
  | 'release_manager'
  | 'admin';

export type ArticleCmsActor = ArticleCmsRole | 'automation';

export type ArticleCmsPublishBlocker =
  | 'viewer_cannot_edit'
  | 'content_editor_draft_only'
  | 'role_scope_limited'
  | 'missing_evidence_packet'
  | 'missing_release_audit_write'
  | 'missing_human_release_approval'
  | 'automation_final_publish_forbidden'
  | 'admin_silent_bypass_forbidden'
  | 'cms_override_disclaimer_blocked'
  | 'offline_fallback_required'
  | 'migration_rollback_required'
  | 'no_database_write_in_m72';

export type ArticleCmsWriteContract = {
  role: ArticleCmsRole;
  canEdit: boolean;
  canDraft: boolean;
  canSignAgricultureReview: boolean;
  canSignSafetyReview: boolean;
  canSignImageReview: boolean;
  canRequestRelease: boolean;
  canFinalPublish: false;
  notesTh: string;
  blockers: ArticleCmsPublishBlocker[];
};

export type ArticleCmsReadContract = {
  publicRead: 'published_reviewed_only';
  editorRead: 'draft_review_release_records';
  offlineFallbackRead: 'bundled_first_if_cms_invalid';
  noRealCmsFetchInM72: true;
};

export type ArticleCmsReleaseAuditWriteContract = {
  requiredBeforePublish: true;
  plannedEvents: string[];
  writer: 'backend_owned_only';
  noFrontendWrite: true;
  noWriteInM72: true;
};

export type ArticleCmsMigrationChecklist = {
  id: string;
  labelTh: string;
  status: 'planned' | 'blocked_until_review';
  includesRollback: boolean;
};

export type ArticleCmsFallbackPolicy = {
  offlineFallbackRequired: true;
  invalidCmsUsesOfflineFallback: true;
  cmsCannotRemoveDisclaimers: true;
  cmsCannotUseExternalOfflineImages: true;
  notesTh: string[];
};

export type ArticleCmsPersistencePlan = {
  planId: string;
  roles: ArticleCmsRole[];
  tables: string[];
  writeContracts: ArticleCmsWriteContract[];
  readContract: ArticleCmsReadContract;
  releaseAuditWriteContract: ArticleCmsReleaseAuditWriteContract;
  migrationChecklist: ArticleCmsMigrationChecklist[];
  fallbackPolicy: ArticleCmsFallbackPolicy;
  publishBlockers: ArticleCmsPublishBlocker[];
  humanReleaseGateRequired: true;
  offlineFallbackRequired: true;
  noSupabaseWrites: true;
  noMigrationsRun: true;
};

export type ArticleCmsPublishContractContext = {
  evidencePacketComplete?: boolean;
  releaseAuditWritePlanned?: boolean;
  humanReleaseApprovalPresent?: boolean;
  cmsOverrideValid?: boolean;
  silentBypassAttempt?: boolean;
};

export type ArticleCmsPublishContractDecision = {
  actor: ArticleCmsActor;
  canPublish: false;
  canEdit: boolean;
  blockers: ArticleCmsPublishBlocker[];
  offlineFallbackRemainsAvailable: true;
};
