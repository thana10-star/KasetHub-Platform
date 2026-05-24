import { describe, expect, test } from 'vitest';
import { getAuthOwnershipStatus } from '@/services/auth/auth-ownership-status';
import { getPhoneAuthStagingAdapterStatus } from '@/services/auth/phone-auth-staging-adapter';
import type { PhoneAuthMockSession } from '@/services/auth/phone-auth.types';
import type { PhoneAuthStagingSessionPreview } from '@/services/auth/phone-auth-staging-adapter.types';

const validStagingEnv = {
  supabaseUrl: 'https://kasethub-staging.supabase.co',
  supabaseAnonKey: 'anon.jwt.value',
  enableSupabase: true,
  enableAuth: true,
  enablePhoneAuth: true,
  enablePhoneAuthLocalMock: true,
  enableCloudSync: false,
  phoneAuthMode: 'supabase_staging_ready',
  supabaseAuthRedirectUrl: 'http://localhost:5173/app/auth/status',
  authStagingLabel: 'staging',
  isProd: false,
};

describe('phone auth staging adapter', () => {
  test('M62 default mode remains local mock', () => {
    const status = getPhoneAuthStagingAdapterStatus({
      phoneAuthMode: 'local_mock',
      enablePhoneAuth: false,
      enablePhoneAuthLocalMock: true,
      enableCloudSync: false,
      isProd: false,
    });

    expect(status.mode).toBe('local_mock');
    expect(status.canUseLocalMock).toBe(true);
    expect(status.canAttemptSupabaseOtp).toBe(false);
    expect(status.networkCallsEnabled).toBe(false);
  });

  test('M62 staging mode requires all flags', () => {
    const status = getPhoneAuthStagingAdapterStatus({
      ...validStagingEnv,
      enablePhoneAuth: false,
    });

    expect(status.mode).toBe('supabase_staging_ready');
    expect(status.canAttemptSupabaseOtp).toBe(false);
    expect(status.code).toBe('blocked_missing_flags');
    expect(status.disabledReasons.join(' ')).toContain('VITE_ENABLE_PHONE_AUTH=true');
  });

  test('M62 staging mode is ready only with explicit local staging flags', () => {
    const status = getPhoneAuthStagingAdapterStatus(validStagingEnv);

    expect(status.canAttemptSupabaseOtp).toBe(true);
    expect(status.networkCallsEnabled).toBe(true);
    expect(status.noAppTableWrites).toBe(true);
    expect(status.noCloudSync).toBe(true);
  });

  test('M62 cloud sync true blocks phone auth staging', () => {
    const status = getPhoneAuthStagingAdapterStatus({
      ...validStagingEnv,
      enableCloudSync: true,
    });

    expect(status.canAttemptSupabaseOtp).toBe(false);
    expect(status.code).toBe('blocked_cloud_sync');
    expect(status.disabledReasons.join(' ')).toContain('VITE_ENABLE_CLOUD_SYNC');
  });

  test('M62 service-role-like key blocks phone auth staging', () => {
    const status = getPhoneAuthStagingAdapterStatus({
      ...validStagingEnv,
      supabaseAnonKey: 'service_role.fake.frontend.key',
    });

    expect(status.canAttemptSupabaseOtp).toBe(false);
    expect(status.serviceRoleDetected).toBe(true);
    expect(status.code).toBe('blocked_service_role');
  });
});

describe('auth ownership status', () => {
  test('M62 ownership status does not allow sync yet', () => {
    const status = getAuthOwnershipStatus();

    expect(status.syncAllowed).toBe(false);
    expect(status.ownershipVerified).toBe(false);
  });

  test('M62 mock session does not count as real ownership', () => {
    const mockSession: PhoneAuthMockSession = {
      version: 1,
      mockUserId: 'phone-mock-user-1234567890',
      phoneNumberMasked: '081-xxx-7890',
      provider: 'phone',
      createdAt: '2026-05-24T00:00:00.000Z',
      expiresAt: '2026-05-25T00:00:00.000Z',
    };
    const status = getAuthOwnershipStatus({ phoneMockSession: mockSession, supabaseSessionPreview: null });

    expect(status.source).toBe('local_mock_phone');
    expect(status.realSupabaseSessionDetected).toBe(false);
    expect(status.ownershipVerified).toBe(false);
    expect(status.syncAllowed).toBe(false);
  });

  test('M62 real session status is represented without exposing full user id', () => {
    const preview: PhoneAuthStagingSessionPreview = {
      source: 'supabase_auth',
      userIdMasked: 'abc123...7890',
      phoneNumberMasked: '081-xxx-7890',
      createdAt: '2026-05-24T00:00:00.000Z',
      accessTokenPresent: true,
      refreshTokenPresent: true,
    };
    const status = getAuthOwnershipStatus({ phoneMockSession: null, supabaseSessionPreview: preview });

    expect(status.source).toBe('supabase_phone_staging');
    expect(status.realSupabaseSessionDetected).toBe(true);
    expect(status.ownershipVerified).toBe(true);
    expect(status.syncAllowed).toBe(false);
    expect(status.userIdMasked).toBe('abc123...7890');
    expect(status.userIdMasked).not.toContain('00000000-0000');
  });
});
