import type { SupabaseReadonlyProbeTableName } from '@/services/supabase/supabase-readonly-probe.types';

export type SupabasePublicReadReviewStatus = 'pending' | 'success' | 'needs_policy_fix' | 'blocked';

export type SupabasePublicReadTableReviewStatus =
  | 'pending_result'
  | 'empty_table_ok'
  | 'read_ok'
  | 'rls_or_policy_blocked'
  | 'table_missing'
  | 'needs_review';

export type SupabasePublicReadTableReview = {
  table: SupabaseReadonlyProbeTableName;
  status: SupabasePublicReadTableReviewStatus;
  statusLabel: string;
  expectedAccess: string;
  observedResult: string;
  reviewNote: string;
};

export type SupabasePublicReadRlsChecklistItem = {
  id: string;
  label: string;
  status: 'pending' | 'pass' | 'needs_review' | 'blocked';
  evidenceNeeded: string;
};

export type SupabasePublicReadReview = {
  milestone: 'M44';
  status: SupabasePublicReadReviewStatus;
  statusLabel: string;
  statusTone: 'success' | 'warning' | 'danger' | 'info';
  publicReadVerificationStatus: string;
  rlsReviewStatus: string;
  noUnsafeBehaviorStatus: string;
  summary: string;
  operatorInstructions: string[];
  tableReviews: SupabasePublicReadTableReview[];
  rlsChecklist: SupabasePublicReadRlsChecklistItem[];
  blockers: string[];
  safetyNotes: string[];
  nextSafeStep: string;
  docs: string[];
};
