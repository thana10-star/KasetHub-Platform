export type SupabaseManualExecutionReviewStatus = 'pending' | 'success' | 'needs_sql_fix' | 'blocked';

export type SupabaseManualExecutionReviewStatusOption = {
  status: SupabaseManualExecutionReviewStatus;
  label: string;
  detail: string;
};

export type SupabaseManualExecutionReview = {
  milestone: 'M42';
  status: SupabaseManualExecutionReviewStatus;
  statusLabel: string;
  statusTone: 'success' | 'warning' | 'danger' | 'info';
  statusDetail: string;
  nextSafeStep: string;
  requestedEvidence: string[];
  blockers: string[];
  sqlErrorNotes: string[];
  proposedFixNotes: string[];
  safetyNotes: string[];
  statusOptions: SupabaseManualExecutionReviewStatusOption[];
  docPath: string;
  reportPath: string;
};
