export type PhoneAuthStagingArea =
  | 'supabase_env'
  | 'phone_auth_flags'
  | 'redirect_urls'
  | 'sms_provider'
  | 'otp_rate_limits'
  | 'test_phone_numbers'
  | 'session_ownership'
  | 'guest_sync_dependency'
  | 'rollback'
  | 'production_blockers';

export type PhoneAuthStagingStatus = 'pass' | 'warn' | 'block';

export type PhoneAuthStagingLevel = 'local_mock_only' | 'staging_plan_ready' | 'blocked';

export type PhoneAuthStagingReadinessItem = {
  id: string;
  area: PhoneAuthStagingArea;
  title: string;
  detail: string;
  status: PhoneAuthStagingStatus;
  evidence: string;
  nextAction?: string;
};

export type PhoneAuthStagingAreaSummary = {
  area: PhoneAuthStagingArea;
  label: string;
  total: number;
  passed: number;
  warnings: number;
  blockers: number;
  status: PhoneAuthStagingStatus;
};

export type PhoneAuthStagingFlagSnapshot = {
  enableSupabase: boolean;
  enableAuth: boolean;
  enablePhoneAuth: boolean;
  phoneAuthMode: string;
  enableCloudSync: boolean;
  authRedirectUrl: string;
  authStagingLabel: string;
};

export type PhoneAuthStagingReadinessAudit = {
  generatedAt: string;
  score: number;
  level: PhoneAuthStagingLevel;
  levelLabel: string;
  flags: PhoneAuthStagingFlagSnapshot;
  notices: string[];
  items: PhoneAuthStagingReadinessItem[];
  passedItems: PhoneAuthStagingReadinessItem[];
  warningItems: PhoneAuthStagingReadinessItem[];
  blockerItems: PhoneAuthStagingReadinessItem[];
  areaSummaries: PhoneAuthStagingAreaSummary[];
  stagingSetupSteps: string[];
  requiredFutureFlags: string[];
  smsCostWarnings: string[];
  sessionOwnershipRules: string[];
  rollbackChecklist: string[];
  productionBlockers: string[];
};
