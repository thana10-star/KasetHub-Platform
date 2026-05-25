import { describe, expect, test } from 'vitest';
import { buildOwnershipRlsGateStatus, ownershipGateRlsExpectations } from '@/services/backend/ownership-rls-gate';
import type { PhoneAuthMockSession } from '@/services/auth/phone-auth.types';
import type { PhoneAuthStagingSessionPreview } from '@/services/auth/phone-auth-staging-adapter.types';

const mockSession: PhoneAuthMockSession = {
  version: 1,
  mockUserId: 'phone-mock-user-1234567890',
  phoneNumberMasked: '081-xxx-7890',
  provider: 'phone',
  createdAt: '2026-05-24T00:00:00.000Z',
  expiresAt: '2026-05-25T00:00:00.000Z',
};

const realSession: PhoneAuthStagingSessionPreview = {
  source: 'supabase_auth',
  userIdMasked: 'abc123...7890',
  phoneNumberMasked: '081-xxx-7890',
  createdAt: '2026-05-24T00:00:00.000Z',
  accessTokenPresent: true,
  refreshTokenPresent: true,
};

describe('ownership RLS sync gate', () => {
  test('M63 mock phone session does not pass ownership gate', () => {
    const gate = buildOwnershipRlsGateStatus({
      phoneMockSession: mockSession,
      supabaseSessionPreview: null,
      guestMemoryRecordCount: 3,
      consentCaptured: true,
      idempotencyKeyReady: true,
      auditPlanReady: true,
    });

    expect(gate.realSessionDetected).toBe(false);
    expect(gate.mockSessionDetected).toBe(true);
    expect(gate.statusCode).toBe('blocked_mock_session_only');
    expect(gate.checks.find((check) => check.id === 'mock-session')?.status).toBe('block');
    expect(gate.syncAllowed).toBe(false);
  });

  test('M63 missing real session blocks sync', () => {
    const gate = buildOwnershipRlsGateStatus({
      phoneMockSession: null,
      supabaseSessionPreview: null,
      guestMemoryRecordCount: 4,
      consentCaptured: true,
      idempotencyKeyReady: true,
      auditPlanReady: true,
    });

    expect(gate.statusCode).toBe('blocked_no_real_session');
    expect(gate.blockers.map((blocker) => blocker.id)).toContain('real-session');
    expect(gate.syncAllowed).toBe(false);
  });

  test('M63 missing consent blocks sync', () => {
    const gate = buildOwnershipRlsGateStatus({
      phoneMockSession: null,
      supabaseSessionPreview: realSession,
      guestMemoryRecordCount: 4,
      consentCaptured: false,
      idempotencyKeyReady: true,
      auditPlanReady: true,
    });

    expect(gate.statusCode).toBe('blocked_missing_consent');
    expect(gate.consentRequirements.find((item) => item.id === 'explicit-sync-consent')?.status).toBe('missing');
    expect(gate.syncAllowed).toBe(false);
  });

  test('M63 missing idempotency blocks sync', () => {
    const gate = buildOwnershipRlsGateStatus({
      phoneMockSession: null,
      supabaseSessionPreview: realSession,
      guestMemoryRecordCount: 4,
      consentCaptured: true,
      idempotencyKeyReady: false,
      auditPlanReady: true,
    });

    expect(gate.statusCode).toBe('blocked_missing_idempotency');
    expect(gate.idempotencyRequirements.find((item) => item.id === 'sync-idempotency-key')?.status).toBe('missing');
    expect(gate.syncAllowed).toBe(false);
  });

  test('M63 missing audit plan blocks sync', () => {
    const gate = buildOwnershipRlsGateStatus({
      phoneMockSession: null,
      supabaseSessionPreview: realSession,
      guestMemoryRecordCount: 4,
      consentCaptured: true,
      idempotencyKeyReady: true,
      auditPlanReady: false,
    });

    expect(gate.statusCode).toBe('blocked_missing_audit_plan');
    expect(gate.auditRequirements.find((item) => item.id === 'sync-audit-log')?.status).toBe('missing');
    expect(gate.syncAllowed).toBe(false);
  });

  test('M63 service-role-like frontend env blocks sync', () => {
    const gate = buildOwnershipRlsGateStatus({
      env: { supabaseAnonKey: 'service_role.fake.frontend.key', enableCloudSync: false, isProd: false },
      phoneMockSession: null,
      supabaseSessionPreview: realSession,
      guestMemoryRecordCount: 4,
      consentCaptured: true,
      idempotencyKeyReady: true,
      auditPlanReady: true,
    });

    expect(gate.serviceRoleDetected).toBe(true);
    expect(gate.statusCode).toBe('blocked_service_role_frontend');
    expect(gate.serviceRoleFrontendBlocked).toBe(true);
    expect(gate.syncAllowed).toBe(false);
  });

  test('M63 always returns syncAllowed false even when review inputs are ready', () => {
    const gate = buildOwnershipRlsGateStatus({
      env: { supabaseAnonKey: 'anon.jwt.value', enableCloudSync: false, isProd: false },
      phoneMockSession: null,
      supabaseSessionPreview: realSession,
      guestMemoryRecordCount: 4,
      consentCaptured: true,
      idempotencyKeyReady: true,
      auditPlanReady: true,
    });

    expect(gate.statusCode).toBe('review_ready_but_sync_blocked');
    expect(gate.syncAllowed).toBe(false);
    expect(gate.noGuestMemoryUpload).toBe(true);
    expect(gate.noSupabaseAppWrites).toBe(true);
  });

  test('M63 RLS expectations list includes own-only rules', () => {
    const expectations = ownershipGateRlsExpectations.map((item) => item.expectation).join(' ');

    expect(expectations).toContain('read own rows');
    expect(expectations).toContain('cannot read other users rows');
    expect(expectations).toContain('anon cannot read user-owned rows');
    expect(expectations).toContain('owner_id = auth.uid()');
    expect(expectations).toContain('update/delete own rows only');
  });
});
