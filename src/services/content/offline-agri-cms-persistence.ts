import type {
  ArticleCmsActor,
  ArticleCmsFallbackPolicy,
  ArticleCmsMigrationChecklist,
  ArticleCmsPersistencePlan,
  ArticleCmsPublishBlocker,
  ArticleCmsPublishContractContext,
  ArticleCmsPublishContractDecision,
  ArticleCmsReadContract,
  ArticleCmsReleaseAuditWriteContract,
  ArticleCmsRole,
  ArticleCmsWriteContract,
} from '@/services/content/offline-agri-cms-persistence.types';

export const articleCmsRoles: ArticleCmsRole[] = [
  'viewer',
  'content_editor',
  'agriculture_expert',
  'safety_reviewer',
  'image_reviewer',
  'release_manager',
  'admin',
];

export const articleCmsFutureTables = [
  'articles',
  'article_versions',
  'article_full_body_versions',
  'article_source_reviews',
  'article_expert_reviews',
  'article_image_assets',
  'article_release_gates',
  'article_release_audit_events',
  'article_release_attempts',
  'article_reviewer_history',
  'article_cms_overrides',
];

export const articleCmsWriteContracts: ArticleCmsWriteContract[] = [
  {
    role: 'viewer',
    canEdit: false,
    canDraft: false,
    canSignAgricultureReview: false,
    canSignSafetyReview: false,
    canSignImageReview: false,
    canRequestRelease: false,
    canFinalPublish: false,
    notesTh: 'ผู้อ่านดูบทความที่เผยแพร่และตรวจทานแล้วเท่านั้น แก้ไขไม่ได้',
    blockers: ['viewer_cannot_edit', 'no_database_write_in_m72'],
  },
  {
    role: 'content_editor',
    canEdit: true,
    canDraft: true,
    canSignAgricultureReview: false,
    canSignSafetyReview: false,
    canSignImageReview: false,
    canRequestRelease: false,
    canFinalPublish: false,
    notesTh: 'content editor ทำร่างและเสนอแก้ไขได้ แต่ final publish ไม่ได้',
    blockers: ['content_editor_draft_only', 'missing_human_release_approval', 'no_database_write_in_m72'],
  },
  {
    role: 'agriculture_expert',
    canEdit: false,
    canDraft: false,
    canSignAgricultureReview: true,
    canSignSafetyReview: false,
    canSignImageReview: false,
    canRequestRelease: false,
    canFinalPublish: false,
    notesTh: 'agriculture expert ลงนามตรวจเนื้อหาเกษตรได้เฉพาะขอบเขตของตน',
    blockers: ['role_scope_limited', 'missing_human_release_approval', 'no_database_write_in_m72'],
  },
  {
    role: 'safety_reviewer',
    canEdit: false,
    canDraft: false,
    canSignAgricultureReview: false,
    canSignSafetyReview: true,
    canSignImageReview: false,
    canRequestRelease: false,
    canFinalPublish: false,
    notesTh: 'safety reviewer ตรวจคำเตือน ความเสี่ยง และ disclaimer ได้ แต่ publish ไม่ได้',
    blockers: ['role_scope_limited', 'missing_human_release_approval', 'no_database_write_in_m72'],
  },
  {
    role: 'image_reviewer',
    canEdit: false,
    canDraft: false,
    canSignAgricultureReview: false,
    canSignSafetyReview: false,
    canSignImageReview: true,
    canRequestRelease: false,
    canFinalPublish: false,
    notesTh: 'image reviewer ตรวจภาพ alt text ขนาด และ offline path ได้เท่านั้น',
    blockers: ['role_scope_limited', 'missing_human_release_approval', 'no_database_write_in_m72'],
  },
  {
    role: 'release_manager',
    canEdit: false,
    canDraft: false,
    canSignAgricultureReview: false,
    canSignSafetyReview: false,
    canSignImageReview: false,
    canRequestRelease: true,
    canFinalPublish: false,
    notesTh: 'release manager ขอ final release ได้ แต่ข้าม blocker หรือ human gate ไม่ได้',
    blockers: ['missing_evidence_packet', 'missing_release_audit_write', 'missing_human_release_approval', 'no_database_write_in_m72'],
  },
  {
    role: 'admin',
    canEdit: true,
    canDraft: true,
    canSignAgricultureReview: false,
    canSignSafetyReview: false,
    canSignImageReview: false,
    canRequestRelease: true,
    canFinalPublish: false,
    notesTh: 'admin จัดการ workflow ได้ แต่ห้าม silent bypass human release gate',
    blockers: ['admin_silent_bypass_forbidden', 'missing_human_release_approval', 'no_database_write_in_m72'],
  },
];

export const articleCmsReadContract: ArticleCmsReadContract = {
  publicRead: 'published_reviewed_only',
  editorRead: 'draft_review_release_records',
  offlineFallbackRead: 'bundled_first_if_cms_invalid',
  noRealCmsFetchInM72: true,
};

export const articleCmsReleaseAuditWriteContract: ArticleCmsReleaseAuditWriteContract = {
  requiredBeforePublish: true,
  plannedEvents: [
    'attempted_publish',
    'blocked_publish',
    'reviewer_change',
    'source_metadata_change',
    'disclaimer_change',
    'image_review_change',
    'release_gate_change',
    'automation_bypass_attempt',
  ],
  writer: 'backend_owned_only',
  noFrontendWrite: true,
  noWriteInM72: true,
};

export const articleCmsMigrationChecklist: ArticleCmsMigrationChecklist[] = [
  { id: 'schema-review', labelTh: 'ตรวจ schema และ RLS owner/editor scope ก่อนสร้างตาราง', status: 'planned', includesRollback: false },
  { id: 'role-policy-review', labelTh: 'ตรวจ role policy ว่า viewer/editor/reviewer/release manager แยกหน้าที่ชัด', status: 'planned', includesRollback: false },
  { id: 'release-audit-write-contract', labelTh: 'กำหนด backend-owned release audit write contract', status: 'planned', includesRollback: false },
  { id: 'offline-fallback-test', labelTh: 'ทดสอบว่า CMS invalid แล้วยัง fallback เป็นบทความ offline ได้', status: 'planned', includesRollback: false },
  { id: 'migration-rollback', labelTh: 'เตรียม rollback script และ rollback checklist ก่อน run migration', status: 'blocked_until_review', includesRollback: true },
];

export const articleCmsFallbackPolicy: ArticleCmsFallbackPolicy = {
  offlineFallbackRequired: true,
  invalidCmsUsesOfflineFallback: true,
  cmsCannotRemoveDisclaimers: true,
  cmsCannotUseExternalOfflineImages: true,
  notesTh: [
    'offline bundled article ต้องยังอ่านได้เมื่อ CMS ล้มเหลวหรือไม่ผ่าน policy',
    'CMS override ห้ามลบ safety disclaimer ที่ offline article ต้องมี',
    'offline mode ห้ามใช้ external image URL เป็นแหล่งภาพหลัก',
  ],
};

const basePublishBlockers: ArticleCmsPublishBlocker[] = [
  'missing_evidence_packet',
  'missing_release_audit_write',
  'missing_human_release_approval',
  'offline_fallback_required',
  'migration_rollback_required',
  'no_database_write_in_m72',
];

export function buildArticleCmsPersistencePlan(): ArticleCmsPersistencePlan {
  return {
    planId: 'm72-offline-article-cms-persistence-contract',
    roles: articleCmsRoles,
    tables: articleCmsFutureTables,
    writeContracts: articleCmsWriteContracts,
    readContract: articleCmsReadContract,
    releaseAuditWriteContract: articleCmsReleaseAuditWriteContract,
    migrationChecklist: articleCmsMigrationChecklist,
    fallbackPolicy: articleCmsFallbackPolicy,
    publishBlockers: basePublishBlockers,
    humanReleaseGateRequired: true,
    offlineFallbackRequired: true,
    noSupabaseWrites: true,
    noMigrationsRun: true,
  };
}

export function getArticleCmsWriteContract(role: ArticleCmsRole) {
  return articleCmsWriteContracts.find((contract) => contract.role === role);
}

export function evaluateArticleCmsPublishContract(
  actor: ArticleCmsActor,
  context: ArticleCmsPublishContractContext = {},
): ArticleCmsPublishContractDecision {
  const contract = actor === 'automation' ? undefined : getArticleCmsWriteContract(actor);
  const blockers = new Set<ArticleCmsPublishBlocker>(basePublishBlockers);

  if (actor === 'viewer') blockers.add('viewer_cannot_edit');
  if (actor === 'content_editor') blockers.add('content_editor_draft_only');
  if (actor === 'automation') blockers.add('automation_final_publish_forbidden');
  if (actor === 'admin' && context.silentBypassAttempt !== false) blockers.add('admin_silent_bypass_forbidden');
  if (actor === 'release_manager' && !context.evidencePacketComplete) blockers.add('missing_evidence_packet');
  if (!context.releaseAuditWritePlanned) blockers.add('missing_release_audit_write');
  if (!context.humanReleaseApprovalPresent) blockers.add('missing_human_release_approval');
  if (context.cmsOverrideValid === false) blockers.add('cms_override_disclaimer_blocked');

  return {
    actor,
    canPublish: false,
    canEdit: contract?.canEdit ?? false,
    blockers: Array.from(blockers),
    offlineFallbackRemainsAvailable: true,
  };
}

export function getArticleCmsPersistenceSummary() {
  const plan = buildArticleCmsPersistencePlan();

  return {
    roleCount: plan.roles.length,
    tableCount: plan.tables.length,
    migrationChecklistCount: plan.migrationChecklist.length,
    rollbackChecklistExists: plan.migrationChecklist.some((item) => item.includesRollback),
    publishAllowedCount: plan.writeContracts.filter((contract) => contract.canFinalPublish).length,
    auditEventsPlanned: plan.releaseAuditWriteContract.plannedEvents.length,
    plan,
  };
}
