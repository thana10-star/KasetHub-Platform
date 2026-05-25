import type { PublicRuntimeEnv } from '@/config/env';
import type { PhoneAuthMockSession } from '@/services/auth/phone-auth.types';
import type { PhoneAuthStagingSessionPreview } from '@/services/auth/phone-auth-staging-adapter.types';

export type OwnershipGateCheckStatus = 'pass' | 'warn' | 'block';

export type OwnershipGateStatusCode =
  | 'blocked_no_real_session'
  | 'blocked_mock_session_only'
  | 'blocked_missing_guest_memory'
  | 'blocked_missing_consent'
  | 'blocked_missing_idempotency'
  | 'blocked_missing_audit_plan'
  | 'blocked_service_role_frontend'
  | 'review_ready_but_sync_blocked';

export type OwnershipGateCheck = {
  id: string;
  label: string;
  status: OwnershipGateCheckStatus;
  detail: string;
  evidence: string;
  nextAction: string;
};

export type OwnershipGateBlocker = {
  id: string;
  label: string;
  detail: string;
  severity: 'blocker' | 'warning';
};

export type OwnershipGateConsentRequirement = {
  id: string;
  label: string;
  required: true;
  status: 'missing' | 'planned' | 'ready';
  detail: string;
};

export type OwnershipGateIdempotencyRequirement = {
  id: string;
  label: string;
  required: true;
  status: 'missing' | 'planned' | 'ready';
  detail: string;
};

export type OwnershipGateAuditRequirement = {
  id: string;
  label: string;
  required: true;
  status: 'missing' | 'planned' | 'ready';
  detail: string;
};

export type OwnershipGateRlsExpectation = {
  id: string;
  tableGroup: string;
  expectation: string;
  status: 'planned';
  mustPassBeforeSync: true;
};

export type OwnershipRlsGateInput = {
  env?: Partial<
    Pick<PublicRuntimeEnv, 'enableCloudSync' | 'supabaseAnonKey' | 'isProd'>
  >;
  phoneMockSession?: PhoneAuthMockSession | null;
  supabaseSessionPreview?: PhoneAuthStagingSessionPreview | null;
  guestMemoryRecordCount?: number;
  consentCaptured?: boolean;
  idempotencyKeyReady?: boolean;
  auditPlanReady?: boolean;
};

export type OwnershipGateStatus = {
  milestone: 'M63';
  generatedAt: string;
  statusCode: OwnershipGateStatusCode;
  statusLabel: string;
  syncAllowed: false;
  realSessionDetected: boolean;
  mockSessionDetected: boolean;
  ownershipVerified: boolean;
  expectedOwnerIdMasked: string | null;
  guestMemoryRecordCount: number;
  localDataExists: boolean;
  consentReady: boolean;
  idempotencyReady: boolean;
  auditReady: boolean;
  serviceRoleDetected: boolean;
  serviceRoleFrontendBlocked: true;
  cloudSyncEnabled: boolean;
  checks: OwnershipGateCheck[];
  blockers: OwnershipGateBlocker[];
  consentRequirements: OwnershipGateConsentRequirement[];
  idempotencyRequirements: OwnershipGateIdempotencyRequirement[];
  auditRequirements: OwnershipGateAuditRequirement[];
  rlsExpectations: OwnershipGateRlsExpectation[];
  nextSafeStep: string;
  noGuestMemoryUpload: true;
  noSupabaseAppWrites: true;
  noCloudSync: true;
};
