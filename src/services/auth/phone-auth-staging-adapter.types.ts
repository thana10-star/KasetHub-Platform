import type { PhoneAuthMockSession } from '@/services/auth/phone-auth.types';
import type { PublicRuntimeEnv } from '@/config/env';

export type PhoneAuthStagingAdapterMode =
  | 'local_mock'
  | 'supabase_staging_disabled'
  | 'supabase_staging_ready'
  | 'production_disabled';

export type PhoneAuthStagingAdapterStatusCode =
  | 'local_mock_active'
  | 'staging_disabled'
  | 'staging_ready'
  | 'blocked_missing_flags'
  | 'blocked_invalid_supabase'
  | 'blocked_cloud_sync'
  | 'blocked_service_role'
  | 'production_disabled';

export type PhoneAuthStagingActionStatus = 'success' | 'disabled' | 'error';

export type PhoneAuthStagingSessionSource = 'local_mock' | 'supabase_auth';

export type PhoneAuthStagingSessionPreview = {
  source: PhoneAuthStagingSessionSource;
  userIdMasked: string;
  phoneNumberMasked: string;
  createdAt: string;
  expiresAt?: string;
  accessTokenPresent: boolean;
  refreshTokenPresent: boolean;
};

export type PhoneAuthStagingActionResult = {
  status: PhoneAuthStagingActionStatus;
  success: boolean;
  message: string;
  maskedPhoneNumber?: string;
  demoOtpCode?: '123456';
  disabledReason?: string;
  errorCode?: string;
  sessionPreview?: PhoneAuthStagingSessionPreview;
};

export type PhoneAuthStagingAdapterStatus = {
  mode: PhoneAuthStagingAdapterMode;
  modeLabel: string;
  code: PhoneAuthStagingAdapterStatusCode;
  statusLabel: string;
  env: Pick<
    PublicRuntimeEnv,
    | 'supabaseUrl'
    | 'supabaseAnonKey'
    | 'enableSupabase'
    | 'enableAuth'
    | 'enablePhoneAuth'
    | 'enablePhoneAuthLocalMock'
    | 'enableCloudSync'
    | 'phoneAuthMode'
    | 'supabaseAuthRedirectUrl'
    | 'authStagingLabel'
    | 'isProd'
  >;
  phoneAuthEnabled: boolean;
  authEnabled: boolean;
  supabaseEnabled: boolean;
  cloudSyncEnabled: boolean;
  supabaseConfigured: boolean;
  redirectUrlPreview: string;
  canUseLocalMock: boolean;
  canAttemptSupabaseOtp: boolean;
  canRequestOtp: boolean;
  canVerifyOtp: boolean;
  networkCallsEnabled: boolean;
  serviceRoleAvailableInFrontend: false;
  serviceRoleDetected: boolean;
  noAppTableWrites: true;
  noCloudSync: true;
  noProductionAuth: true;
  disabledReasons: string[];
  warnings: string[];
  smsCostWarnings: string[];
  rollbackChecklist: string[];
  testNumberNotice: string;
  localMockSession: PhoneAuthMockSession | null;
  supabaseSessionPreview: PhoneAuthStagingSessionPreview | null;
};

export type PhoneAuthStagingAdapterEnvOverride = Partial<PhoneAuthStagingAdapterStatus['env']>;
