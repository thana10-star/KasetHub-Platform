export type FarmRecordsSyncRequirementStatus = 'blocked' | 'ready_local' | 'future_required';
export type FarmRecordsSyncChecklistStatus = 'ready' | 'prototype_only' | 'documented_only' | 'not_implemented' | 'separate_future_gate';

export type FarmRecordsSyncRequirement = {
  id: string;
  label: string;
  detail: string;
  status: FarmRecordsSyncRequirementStatus;
};

export type FarmRecordsSyncReadiness = {
  mode: 'local_only';
  cloudSyncEnabled: false;
  supabaseWritesEnabled: false;
  gpsUsed: false;
  aiAccessEnabled: false;
  exportRestoreAvailableLocally: true;
  canSync: false;
  readinessChecklist: FarmRecordsSyncChecklistItem[];
  requirements: FarmRecordsSyncRequirement[];
};

export type FarmRecordsSyncChecklistItem = {
  id: string;
  label: string;
  detail: string;
  status: FarmRecordsSyncChecklistStatus;
};

export const FARM_RECORDS_SYNC_REQUIREMENTS: FarmRecordsSyncRequirement[] = [
  {
    id: 'explicit-consent',
    label: 'Explicit user consent',
    detail: 'Farm records must not leave the device until the user opts in with clear sync copy.',
    status: 'future_required',
  },
  {
    id: 'authenticated-ownership',
    label: 'Authenticated ownership',
    detail: 'A real authenticated user owner must exist before cloud records are created.',
    status: 'future_required',
  },
  {
    id: 'owner-only-rls',
    label: 'Owner-only Supabase RLS',
    detail: 'Supabase RLS must enforce owner-only access for plots, cycles, activities, finance entries, sync status, and audit rows.',
    status: 'future_required',
  },
  {
    id: 'export-delete-tools',
    label: 'Export/delete tools',
    detail: 'Local export and restore tools exist, but cloud export/delete behavior still needs review before sync.',
    status: 'ready_local',
  },
  {
    id: 'audit-idempotency',
    label: 'Audit and idempotency plan',
    detail: 'Sync needs idempotency keys, audit logs, conflict handling, rollback, and recovery planning.',
    status: 'future_required',
  },
  {
    id: 'retention-policy',
    label: 'Data retention policy',
    detail: 'Production sync needs retention, delete, and recovery rules reviewed before release.',
    status: 'future_required',
  },
  {
    id: 'separate-ai-consent',
    label: 'Separate AI consent',
    detail: 'AI analysis of farm records must require a separate consent boundary from cloud sync consent.',
    status: 'blocked',
  },
  {
    id: 'separate-gps-consent',
    label: 'Separate GPS consent',
    detail: 'Precise GPS/geolocation is not used and must require separate review and consent if ever added.',
    status: 'blocked',
  },
];

export const FARM_RECORDS_SYNC_READINESS_CHECKLIST: FarmRecordsSyncChecklistItem[] = [
  {
    id: 'local-farm-records',
    label: 'Local Farm Records',
    detail: 'Local plot, cycle, activity, and finance ledger state exists under kasethub.farmRecords.v1.',
    status: 'ready',
  },
  {
    id: 'local-export',
    label: 'Local export',
    detail: 'JSON backup and finance CSV export helpers are available for local device data.',
    status: 'ready',
  },
  {
    id: 'local-restore',
    label: 'Local restore',
    detail: 'JSON backup parse, validate, preview, and confirmed local restore are available.',
    status: 'ready',
  },
  {
    id: 'restore-recovery-guidance',
    label: 'Restore recovery guidance',
    detail: 'Risk review and pre-restore local snapshot/download guidance are available before replacement.',
    status: 'ready',
  },
  {
    id: 'user-cloud-consent',
    label: 'Sync consent UX',
    detail: 'Local consent copy is available for planning. It is not legal consent and cannot enable sync.',
    status: 'prototype_only',
  },
  {
    id: 'owner-rls-design',
    label: 'Owner/RLS design',
    detail: 'Owner/RLS architecture and future verification steps are documented only.',
    status: 'documented_only',
  },
  {
    id: 'supabase-rls',
    label: 'Supabase RLS',
    detail: 'Owner-only RLS policies and verification checks are not implemented for Farm Records tables.',
    status: 'not_implemented',
  },
  {
    id: 'sync-queue',
    label: 'Sync queue',
    detail: 'No local operation queue, retry state, or idempotency key store exists yet.',
    status: 'not_implemented',
  },
  {
    id: 'conflict-handling',
    label: 'Conflict handling',
    detail: 'User-visible conflict review for edits/deletes and finance records is not implemented.',
    status: 'not_implemented',
  },
  {
    id: 'cloud-delete-export',
    label: 'Cloud delete/export',
    detail: 'Cloud export and cloud delete behavior are not designed or implemented.',
    status: 'not_implemented',
  },
  {
    id: 'production-privacy-policy',
    label: 'Production privacy policy',
    detail: 'Legal-final PDPA/privacy policy copy is not implemented.',
    status: 'not_implemented',
  },
  {
    id: 'ai-consent',
    label: 'AI consent',
    detail: 'Farm-record AI analysis must stay behind a separate future consent gate.',
    status: 'separate_future_gate',
  },
];

export function getFarmRecordsSyncReadiness(): FarmRecordsSyncReadiness {
  return {
    mode: 'local_only',
    cloudSyncEnabled: false,
    supabaseWritesEnabled: false,
    gpsUsed: false,
    aiAccessEnabled: false,
    exportRestoreAvailableLocally: true,
    canSync: false,
    readinessChecklist: FARM_RECORDS_SYNC_READINESS_CHECKLIST,
    requirements: FARM_RECORDS_SYNC_REQUIREMENTS,
  };
}
