import { publicEnv } from '@/config/env';
import type {
  PhoneAuthActionResult,
  PhoneAuthAdapter,
  PhoneAuthAdapterStatus,
  PhoneAuthMode,
} from '@/services/auth/phone-auth.types';
import {
  clearMockSession,
  getMockSession,
  requestOtp as requestLocalMockOtp,
  verifyOtp as verifyLocalMockOtp,
} from '@/services/auth/phone-auth-local-mock';

function normalizeMode(value: string): PhoneAuthMode {
  if (
    value === 'supabase_disabled' ||
    value === 'supabase_ready_mock' ||
    value === 'supabase_staging_disabled' ||
    value === 'supabase_staging_ready' ||
    value === 'production_disabled'
  ) {
    return value;
  }

  return 'local_mock';
}

export function getPhoneAuthMode(): PhoneAuthMode {
  return normalizeMode(publicEnv.phoneAuthMode);
}

function modeLabel(mode: PhoneAuthMode) {
  const labels: Record<PhoneAuthMode, string> = {
    local_mock: 'Local mock',
    supabase_disabled: 'Supabase disabled',
    supabase_ready_mock: 'Supabase ready mock',
    supabase_staging_disabled: 'Supabase staging disabled',
    supabase_staging_ready: 'Supabase staging ready',
    production_disabled: 'Production disabled',
  };

  return labels[mode];
}

function disabledResult(mode: PhoneAuthMode): PhoneAuthActionResult {
  return {
    success: false,
    message:
      mode === 'supabase_ready_mock' || mode === 'supabase_staging_ready'
        ? 'Phone Auth flag ยังไม่เปิดครบ จึงยังไม่ส่ง OTP จริงหรือจำลองผ่าน Supabase'
        : 'Phone Auth ปิดอยู่ในโหมดนี้ ยังไม่มีการส่ง OTP จริง',
  };
}

export function getPhoneAuthAdapterStatus(): PhoneAuthAdapterStatus {
  const mode = getPhoneAuthMode();
  const canUseLocalMock =
    (mode === 'local_mock' && publicEnv.enablePhoneAuthLocalMock) ||
    (mode === 'supabase_ready_mock' && publicEnv.enablePhoneAuth && publicEnv.enablePhoneAuthLocalMock);
  const session = getMockSession();

  return {
    mode,
    modeLabel: modeLabel(mode),
    phoneAuthEnabled: publicEnv.enablePhoneAuth,
    localMockEnabled: publicEnv.enablePhoneAuthLocalMock,
    canUseLocalMock,
    canAttemptSupabaseMock: (mode === 'supabase_ready_mock' || mode === 'supabase_staging_ready') && publicEnv.enablePhoneAuth,
    networkCallsEnabled: false,
    serviceRoleAvailableInFrontend: false,
    currentAdapterPath: canUseLocalMock ? 'local_mock' : 'disabled_response',
    session,
    isSessionActive: Boolean(session),
    readinessLabel: canUseLocalMock
      ? 'ใช้ Phone Auth local mock อยู่ ไม่มี SMS และไม่มี network'
      : mode === 'supabase_ready_mock'
        ? 'เตรียม Supabase mock แต่ยังเปิด flag ไม่ครบ'
        : 'Phone Auth ถูกปิดไว้',
    warnings: [
      'รหัส OTP 123456 เป็นรหัสจำลองเท่านั้น',
      'ยังไม่มี Supabase Auth หรือ SMS จริง',
      'service-role key ต้องไม่อยู่ใน frontend',
    ],
  };
}

export const phoneAuthAdapter: PhoneAuthAdapter = {
  requestOtp(phoneNumber) {
    const status = getPhoneAuthAdapterStatus();
    return status.canUseLocalMock ? requestLocalMockOtp(phoneNumber) : disabledResult(status.mode);
  },

  verifyOtp(phoneNumber, otpCode) {
    const status = getPhoneAuthAdapterStatus();
    return status.canUseLocalMock ? verifyLocalMockOtp(phoneNumber, otpCode) : disabledResult(status.mode);
  },

  getStatus: getPhoneAuthAdapterStatus,
  getMockSession,
  clearMockSession,
};

export const requestPhoneOtp = phoneAuthAdapter.requestOtp;
export const verifyPhoneOtp = phoneAuthAdapter.verifyOtp;
export const clearPhoneMockSession = phoneAuthAdapter.clearMockSession;
