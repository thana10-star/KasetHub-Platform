import { describe, expect, test } from 'vitest';
import { runPhoneAuthStagingReview } from '@/services/auth/phone-auth-staging-review';

describe('phone auth staging review', () => {
  test('M61 default status is blocked until explicitly configured', () => {
    const review = runPhoneAuthStagingReview({
      supabaseUrl: '',
      supabaseAnonKey: '',
      enableSupabase: false,
      enableAuth: false,
      enablePhoneAuth: false,
      enableCloudSync: false,
      phoneAuthMode: 'local_mock',
      supabaseAuthRedirectUrl: '',
      authStagingLabel: 'local',
    });

    expect(review.milestone).toBe('M61');
    expect(review.level).toBe('blocked_default');
    expect(review.canSendRealOtp).toBe(false);
    expect(review.noRealSms).toBe(true);
    expect(review.blockerItems.map((item) => item.id)).toEqual(
      expect.arrayContaining(['redirect-url-ready', 'sms-provider-setup', 'production-still-blocked']),
    );
  });

  test('M61 auth flags are off by default', () => {
    const review = runPhoneAuthStagingReview({
      enableAuth: false,
      enablePhoneAuth: false,
      enableCloudSync: false,
      phoneAuthMode: 'local_mock',
    });

    expect(review.flags.enableAuth).toBe(false);
    expect(review.flags.enablePhoneAuth).toBe(false);
    expect(review.flags.enableCloudSync).toBe(false);
    expect(review.items.find((item) => item.id === 'auth-flags-default-off')?.status).toBe('pass');
  });

  test('M61 cloud sync is blocked until ownership exists', () => {
    const review = runPhoneAuthStagingReview({
      enableCloudSync: true,
      enableAuth: true,
      enablePhoneAuth: true,
      phoneAuthMode: 'supabase_ready_mock',
      supabaseAuthRedirectUrl: 'http://localhost:5173/app/auth/status',
    });

    expect(review.level).toBe('blocked_unsafe');
    expect(review.items.find((item) => item.id === 'ownership-before-sync')?.status).toBe('block');
    expect(review.noCloudSync).toBe(true);
  });

  test('M61 service-role key is not accepted in frontend', () => {
    const review = runPhoneAuthStagingReview({
      supabaseAnonKey: 'service_role.fake.frontend.key',
    });

    expect(review.serviceRoleKeyAcceptedInFrontend).toBe(false);
    expect(review.serviceRoleKeyDetected).toBe(true);
    expect(review.items.find((item) => item.id === 'client-safe-env')?.status).toBe('block');
  });

  test('M61 rollback steps exist before real OTP', () => {
    const review = runPhoneAuthStagingReview();

    expect(review.rollbackSteps.length).toBeGreaterThanOrEqual(5);
    expect(review.rollbackSteps.join(' ')).toContain('VITE_ENABLE_PHONE_AUTH=false');
    expect(review.items.find((item) => item.id === 'rollback-ready')?.status).toBe('pass');
  });
});
