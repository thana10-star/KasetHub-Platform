import type {
  PhoneAuthActionResult,
  PhoneAuthMockSession,
  PhoneAuthValidationResult,
} from '@/services/auth/phone-auth.types';

const storageKey = 'kasethub.phoneAuth.mockSession.v1';
const sessionVersion = 1;
const demoOtpCode = '123456';
const sessionTtlMs = 24 * 60 * 60 * 1000;

function now() {
  return new Date();
}

function createId(prefix: string) {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function canUseStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage);
}

function normalizePhoneNumber(input: string) {
  const trimmed = input.trim().replace(/[\s\-().]/g, '');

  if (trimmed.startsWith('+66')) {
    return `0${trimmed.slice(3)}`;
  }

  if (trimmed.startsWith('66') && trimmed.length === 11) {
    return `0${trimmed.slice(2)}`;
  }

  return trimmed;
}

export function maskThaiPhoneNumber(phoneNumber: string) {
  const normalized = normalizePhoneNumber(phoneNumber);

  if (normalized.length < 10) {
    return normalized;
  }

  return `${normalized.slice(0, 3)}-xxx-${normalized.slice(-4)}`;
}

export function validateThaiPhoneNumber(phoneNumber: string): PhoneAuthValidationResult {
  const normalizedPhoneNumber = normalizePhoneNumber(phoneNumber);
  const isValid = /^0[689]\d{8}$/.test(normalizedPhoneNumber);

  return {
    normalizedPhoneNumber,
    phoneNumberMasked: maskThaiPhoneNumber(normalizedPhoneNumber),
    isValid,
    message: isValid
      ? 'ใช้เบอร์นี้สำหรับทดสอบ OTP จำลองได้'
      : 'กรุณาใส่เบอร์มือถือไทย 10 หลัก เช่น 0812345678',
  };
}

function writeMockSession(session: PhoneAuthMockSession) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(storageKey, JSON.stringify(session));
  window.dispatchEvent(new CustomEvent('kasethub:phone-auth-session-changed'));
}

export function getMockSession(): PhoneAuthMockSession | null {
  if (!canUseStorage()) {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as PhoneAuthMockSession;
    if (parsed.version !== sessionVersion || parsed.provider !== 'phone') {
      return null;
    }

    if (new Date(parsed.expiresAt).getTime() <= Date.now()) {
      clearMockSession();
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function clearMockSession() {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(storageKey);
  window.dispatchEvent(new CustomEvent('kasethub:phone-auth-session-changed'));
}

export function requestOtp(phoneNumber: string): PhoneAuthActionResult {
  const validation = validateThaiPhoneNumber(phoneNumber);

  if (!validation.isValid) {
    return {
      success: false,
      message: validation.message,
    };
  }

  return {
    success: true,
    message: `ส่งรหัสจำลองให้ ${validation.phoneNumberMasked} แล้ว ใช้รหัส 123456 สำหรับทดสอบ`,
    demoOtpCode,
  };
}

export function verifyOtp(phoneNumber: string, otpCode: string): PhoneAuthActionResult {
  const validation = validateThaiPhoneNumber(phoneNumber);

  if (!validation.isValid) {
    return {
      success: false,
      message: validation.message,
    };
  }

  if (otpCode.trim() !== demoOtpCode) {
    return {
      success: false,
      message: 'รหัสจำลองไม่ถูกต้อง ใช้รหัส 123456 สำหรับทดสอบ',
    };
  }

  const createdAt = now();
  const expiresAt = new Date(createdAt.getTime() + sessionTtlMs);
  const session: PhoneAuthMockSession = {
    version: sessionVersion,
    mockUserId: createId('phone-mock-user'),
    phoneNumberMasked: validation.phoneNumberMasked,
    provider: 'phone',
    createdAt: createdAt.toISOString(),
    expiresAt: expiresAt.toISOString(),
  };

  writeMockSession(session);

  return {
    success: true,
    message: 'ยืนยันเบอร์โทรจำลองสำเร็จ ยังเป็นโหมดทดสอบ ไม่ใช่บัญชีจริง',
    session,
  };
}
