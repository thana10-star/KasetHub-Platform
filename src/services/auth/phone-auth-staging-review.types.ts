export type PhoneAuthStagingReviewArea =
  | 'supabase_staging'
  | 'sql_rls'
  | 'public_read_probe'
  | 'auth_flags'
  | 'redirect_url'
  | 'sms_provider'
  | 'test_phone_numbers'
  | 'otp_cost_rate_limit'
  | 'ownership_sync'
  | 'rollback'
  | 'production_safety';

export type PhoneAuthStagingReviewStatus = 'pass' | 'warn' | 'block';

export type PhoneAuthStagingReviewLevel =
  | 'blocked_default'
  | 'staging_checklist_ready'
  | 'staging_flags_need_review'
  | 'blocked_unsafe';

export type PhoneAuthStagingReviewEnv = {
  supabaseUrl: string;
  supabaseAnonKey: string;
  enableSupabase: boolean;
  enableAuth: boolean;
  enablePhoneAuth: boolean;
  enableCloudSync: boolean;
  phoneAuthMode: string;
  supabaseAuthRedirectUrl: string;
  authStagingLabel: string;
};

export type PhoneAuthStagingReviewItem = {
  id: string;
  area: PhoneAuthStagingReviewArea;
  title: string;
  detail: string;
  status: PhoneAuthStagingReviewStatus;
  evidence: string;
  nextAction?: string;
};

export type PhoneAuthStagingReviewAreaSummary = {
  area: PhoneAuthStagingReviewArea;
  label: string;
  total: number;
  passed: number;
  warnings: number;
  blockers: number;
  status: PhoneAuthStagingReviewStatus;
};

export type PhoneAuthStagingReviewChecklistItem = {
  id: string;
  label: string;
  detail: string;
  requiredBeforeRealOtp: boolean;
};

export type PhoneAuthStagingReview = {
  generatedAt: string;
  milestone: 'M61';
  score: number;
  level: PhoneAuthStagingReviewLevel;
  levelLabel: string;
  flags: PhoneAuthStagingReviewEnv;
  serviceRoleKeyAcceptedInFrontend: false;
  serviceRoleKeyDetected: boolean;
  canSendRealOtp: false;
  noRealSms: true;
  noSupabaseWrite: true;
  noCloudSync: true;
  items: PhoneAuthStagingReviewItem[];
  passedItems: PhoneAuthStagingReviewItem[];
  warningItems: PhoneAuthStagingReviewItem[];
  blockerItems: PhoneAuthStagingReviewItem[];
  areaSummaries: PhoneAuthStagingReviewAreaSummary[];
  dashboardSetupChecklist: PhoneAuthStagingReviewChecklistItem[];
  redirectUrlChecklist: PhoneAuthStagingReviewChecklistItem[];
  smsProviderChecklist: PhoneAuthStagingReviewChecklistItem[];
  testPhoneNumberPlan: PhoneAuthStagingReviewChecklistItem[];
  ownershipRequirements: string[];
  rollbackSteps: string[];
  blockers: string[];
  safetyNotices: string[];
};
