import { publicEnv, type PublicRuntimeEnv } from '@/config/env';
import {
  clearMockSession,
  getMockSession,
  requestOtp as requestLocalMockOtp,
  validateThaiPhoneNumber,
  verifyOtp as verifyLocalMockOtp,
} from '@/services/auth/phone-auth-local-mock';
import type { PhoneAuthActionResult } from '@/services/auth/phone-auth.types';
import {
  getSupabaseClient,
} from '@/services/supabase/supabase-client';
import { checkSupabaseConfig } from '@/services/supabase/supabase-config-check';
import type {
  PhoneAuthStagingActionResult,
  PhoneAuthStagingAdapterEnvOverride,
  PhoneAuthStagingAdapterMode,
  PhoneAuthStagingAdapterStatus,
  PhoneAuthStagingAdapterStatusCode,
  PhoneAuthStagingSessionPreview,
} from '@/services/auth/phone-auth-staging-adapter.types';

const stagingPreviewStorageKey = 'kasethub.phoneAuth.supabaseStagingSessionPreview.v1';

function normalizeMode(value: string): PhoneAuthStagingAdapterMode {
  if (
    value === 'local_mock' ||
    value === 'supabase_staging_disabled' ||
    value === 'supabase_staging_ready' ||
    value === 'production_disabled'
  ) {
    return value;
  }

  return 'local_mock';
}

function readEnv(overrides?: PhoneAuthStagingAdapterEnvOverride): PhoneAuthStagingAdapterStatus['env'] {
  return {
    supabaseUrl: overrides?.supabaseUrl ?? publicEnv.supabaseUrl,
    supabaseAnonKey: overrides?.supabaseAnonKey ?? publicEnv.supabaseAnonKey,
    enableSupabase: overrides?.enableSupabase ?? publicEnv.enableSupabase,
    enableAuth: overrides?.enableAuth ?? publicEnv.enableAuth,
    enablePhoneAuth: overrides?.enablePhoneAuth ?? publicEnv.enablePhoneAuth,
    enablePhoneAuthLocalMock: overrides?.enablePhoneAuthLocalMock ?? publicEnv.enablePhoneAuthLocalMock,
    enableCloudSync: overrides?.enableCloudSync ?? publicEnv.enableCloudSync,
    phoneAuthMode: overrides?.phoneAuthMode ?? publicEnv.phoneAuthMode,
    supabaseAuthRedirectUrl: overrides?.supabaseAuthRedirectUrl ?? publicEnv.supabaseAuthRedirectUrl,
    authStagingLabel: overrides?.authStagingLabel ?? publicEnv.authStagingLabel,
    isProd: overrides?.isProd ?? publicEnv.isProd,
  };
}

function createConfigEnv(env: PhoneAuthStagingAdapterStatus['env']): PublicRuntimeEnv {
  return {
    ...publicEnv,
    supabaseUrl: env.supabaseUrl,
    supabaseAnonKey: env.supabaseAnonKey,
    enableSupabase: env.enableSupabase,
    enableAuth: env.enableAuth,
    enablePhoneAuth: env.enablePhoneAuth,
    enablePhoneAuthLocalMock: env.enablePhoneAuthLocalMock,
    enableCloudSync: env.enableCloudSync,
    phoneAuthMode: env.phoneAuthMode,
    supabaseAuthRedirectUrl: env.supabaseAuthRedirectUrl,
    authStagingLabel: env.authStagingLabel,
    isProd: env.isProd,
  };
}

function decodeJwtPayload(value: string) {
  const [, payload] = value.split('.');

  if (!payload) {
    return '';
  }

  try {
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    return typeof atob === 'function' ? atob(padded) : '';
  } catch {
    return '';
  }
}

function looksLikeServiceRoleKey(value: string) {
  const lower = value.toLowerCase();
  const decodedPayload = decodeJwtPayload(value).toLowerCase();

  return (
    lower.includes('service_role') ||
    lower.includes('service-role') ||
    lower.includes('service role') ||
    decodedPayload.includes('"role":"service_role"') ||
    decodedPayload.includes('service_role')
  );
}

function canUseStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage);
}

function maskUserId(value: string) {
  if (!value) return 'unknown-user';
  if (value.length <= 10) return `${value.slice(0, 3)}...`;
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

function normalizeThaiPhoneToE164(phoneNumber: string) {
  const validation = validateThaiPhoneNumber(phoneNumber);

  if (!validation.isValid) {
    return null;
  }

  return `+66${validation.normalizedPhoneNumber.slice(1)}`;
}

function writeSupabaseSessionPreview(preview: PhoneAuthStagingSessionPreview) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(stagingPreviewStorageKey, JSON.stringify(preview));
  window.dispatchEvent(new CustomEvent('kasethub:phone-auth-session-changed'));
}

export function getSupabasePhoneStagingSessionPreview(): PhoneAuthStagingSessionPreview | null {
  if (!canUseStorage()) return null;

  try {
    const raw = window.localStorage.getItem(stagingPreviewStorageKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PhoneAuthStagingSessionPreview;
    if (parsed.source !== 'supabase_auth') return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearSupabasePhoneStagingSessionPreview() {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(stagingPreviewStorageKey);
  window.dispatchEvent(new CustomEvent('kasethub:phone-auth-session-changed'));
}

export function clearPhoneAuthStagingSessions() {
  clearMockSession();
  clearSupabasePhoneStagingSessionPreview();
}

function modeLabel(mode: PhoneAuthStagingAdapterMode) {
  const labels: Record<PhoneAuthStagingAdapterMode, string> = {
    local_mock: 'Local mock',
    supabase_staging_disabled: 'Supabase staging disabled',
    supabase_staging_ready: 'Supabase staging ready',
    production_disabled: 'Production disabled',
  };

  return labels[mode];
}

function statusLabel(code: PhoneAuthStagingAdapterStatusCode) {
  const labels: Record<PhoneAuthStagingAdapterStatusCode, string> = {
    local_mock_active: 'ใช้ local mock อยู่',
    staging_disabled: 'ปิด Supabase staging OTP',
    staging_ready: 'พร้อมทดสอบ OTP บน staging',
    blocked_missing_flags: 'ยังเปิด flag ไม่ครบ',
    blocked_invalid_supabase: 'Supabase env ยังไม่พร้อม',
    blocked_cloud_sync: 'Cloud sync ต้องปิดก่อน',
    blocked_service_role: 'พบ service-role-like key',
    production_disabled: 'ปิดใน production',
  };

  return labels[code];
}

function buildSmsCostWarnings() {
  return [
    'ทดสอบเฉพาะเบอร์ภายในเท่านั้น',
    'ตั้ง spending limit และ resend cooldown ใน Supabase/SMS provider ก่อนส่ง OTP จริง',
    'อย่ากดส่งซ้ำหลายครั้ง เพราะ SMS OTP อาจมีค่าใช้จ่ายจริง',
  ];
}

function buildRollbackChecklist() {
  return [
    'ตั้ง VITE_ENABLE_PHONE_AUTH=false',
    'ตั้ง VITE_ENABLE_AUTH=false',
    'กลับ VITE_PHONE_AUTH_MODE=local_mock',
    'คง VITE_ENABLE_CLOUD_SYNC=false',
    'ปิด Phone/SMS provider ใน Supabase staging dashboard หากมีปัญหา',
    'ล้าง local staging session preview และไม่ลบ Guest Memory อัตโนมัติ',
  ];
}

function toStagingActionResult(result: PhoneAuthActionResult): PhoneAuthStagingActionResult {
  return {
    status: result.success ? 'success' : 'error',
    success: result.success,
    message: result.message,
    demoOtpCode: result.demoOtpCode,
    sessionPreview: result.session
      ? {
          source: 'local_mock',
          userIdMasked: maskUserId(result.session.mockUserId),
          phoneNumberMasked: result.session.phoneNumberMasked,
          createdAt: result.session.createdAt,
          expiresAt: result.session.expiresAt,
          accessTokenPresent: false,
          refreshTokenPresent: false,
        }
      : undefined,
  };
}

function disabledActionResult(message: string, status: PhoneAuthStagingAdapterStatus): PhoneAuthStagingActionResult {
  return {
    status: 'disabled',
    success: false,
    message,
    disabledReason: status.disabledReasons.join(' | ') || status.statusLabel,
  };
}

export function getPhoneAuthStagingAdapterStatus(
  overrides?: PhoneAuthStagingAdapterEnvOverride,
): PhoneAuthStagingAdapterStatus {
  const env = readEnv(overrides);
  const mode = normalizeMode(env.phoneAuthMode);
  const config = checkSupabaseConfig(createConfigEnv(env));
  const serviceRoleDetected = looksLikeServiceRoleKey(env.supabaseAnonKey);
  const localMockSession = getMockSession();
  const supabaseSessionPreview = getSupabasePhoneStagingSessionPreview();
  const disabledReasons: string[] = [];
  const warnings: string[] = [];

  if (env.phoneAuthMode === 'supabase_ready_mock') {
    warnings.push('โหมด supabase_ready_mock เป็นชื่อเก่า ให้ใช้ supabase_staging_ready ใน M62');
  }

  if (env.isProd && mode === 'supabase_staging_ready') {
    disabledReasons.push('production build ไม่อนุญาตให้เปิด Supabase Phone Auth staging');
  }

  if (mode === 'production_disabled') {
    disabledReasons.push('production mode ถูกปิดไว้ตาม boundary');
  }

  if (mode === 'supabase_staging_disabled') {
    disabledReasons.push('Supabase staging OTP ถูกปิดไว้');
  }

  if (serviceRoleDetected) {
    disabledReasons.push('พบ service-role-like key ใน frontend env');
  }

  if (env.enableCloudSync) {
    disabledReasons.push('VITE_ENABLE_CLOUD_SYNC ต้องเป็น false ก่อนทดสอบ Phone Auth staging');
  }

  if (mode === 'supabase_staging_ready') {
    if (!env.enableSupabase) disabledReasons.push('ต้องเปิด VITE_ENABLE_SUPABASE=true เฉพาะ staging');
    if (!env.enableAuth) disabledReasons.push('ต้องเปิด VITE_ENABLE_AUTH=true เฉพาะ staging');
    if (!env.enablePhoneAuth) disabledReasons.push('ต้องเปิด VITE_ENABLE_PHONE_AUTH=true เฉพาะ staging');
    if (!config.canCreateClient) disabledReasons.push('Supabase URL/anon key ยังไม่พร้อมหรือไม่ปลอดภัย');
  }

  if (!env.supabaseAuthRedirectUrl) {
    warnings.push('ยังไม่กำหนด VITE_SUPABASE_AUTH_REDIRECT_URL สำหรับการตรวจ redirect หลังทดสอบ');
  }

  const canUseLocalMock = mode === 'local_mock' && env.enablePhoneAuthLocalMock;
  const canAttemptSupabaseOtp =
    mode === 'supabase_staging_ready' &&
    !env.isProd &&
    env.enableSupabase &&
    env.enableAuth &&
    env.enablePhoneAuth &&
    !env.enableCloudSync &&
    config.canCreateClient &&
    !serviceRoleDetected &&
    disabledReasons.length === 0;

  let code: PhoneAuthStagingAdapterStatusCode = 'staging_disabled';
  if (canUseLocalMock) code = 'local_mock_active';
  else if (canAttemptSupabaseOtp) code = 'staging_ready';
  else if (mode === 'production_disabled' || (env.isProd && mode === 'supabase_staging_ready')) code = 'production_disabled';
  else if (serviceRoleDetected) code = 'blocked_service_role';
  else if (env.enableCloudSync) code = 'blocked_cloud_sync';
  else if (mode === 'supabase_staging_ready' && !config.canCreateClient) code = 'blocked_invalid_supabase';
  else if (mode === 'supabase_staging_ready') code = 'blocked_missing_flags';

  return {
    mode,
    modeLabel: modeLabel(mode),
    code,
    statusLabel: statusLabel(code),
    env,
    phoneAuthEnabled: env.enablePhoneAuth,
    authEnabled: env.enableAuth,
    supabaseEnabled: env.enableSupabase,
    cloudSyncEnabled: env.enableCloudSync,
    supabaseConfigured: config.canCreateClient,
    redirectUrlPreview: env.supabaseAuthRedirectUrl || 'ยังไม่กำหนด redirect URL',
    canUseLocalMock,
    canAttemptSupabaseOtp,
    canRequestOtp: canUseLocalMock || canAttemptSupabaseOtp,
    canVerifyOtp: canUseLocalMock || canAttemptSupabaseOtp,
    networkCallsEnabled: canAttemptSupabaseOtp,
    serviceRoleAvailableInFrontend: false,
    serviceRoleDetected,
    noAppTableWrites: true,
    noCloudSync: true,
    noProductionAuth: true,
    disabledReasons,
    warnings,
    smsCostWarnings: buildSmsCostWarnings(),
    rollbackChecklist: buildRollbackChecklist(),
    testNumberNotice: 'ทดสอบเฉพาะเบอร์ภายในเท่านั้น',
    localMockSession,
    supabaseSessionPreview,
  };
}

export async function requestPhoneAuthStagingOtp(phoneNumber: string): Promise<PhoneAuthStagingActionResult> {
  const status = getPhoneAuthStagingAdapterStatus();

  if (status.canUseLocalMock) {
    return toStagingActionResult(requestLocalMockOtp(phoneNumber));
  }

  if (!status.canAttemptSupabaseOtp) {
    return disabledActionResult('ยังไม่พร้อมส่ง OTP staging จริง ลองใช้ local mock หรือเปิด checklist ให้ครบก่อน', status);
  }

  const validation = validateThaiPhoneNumber(phoneNumber);
  const phone = normalizeThaiPhoneToE164(phoneNumber);

  if (!validation.isValid || !phone) {
    return {
      status: 'error',
      success: false,
      message: validation.message,
    };
  }

  const client = getSupabaseClient();
  if (!client) {
    return disabledActionResult('Supabase client ยังไม่พร้อมสำหรับ staging OTP', status);
  }

  const { error } = await client.auth.signInWithOtp({
    phone,
    options: {
      shouldCreateUser: true,
    },
  });

  if (error) {
    return {
      status: 'error',
      success: false,
      message: `ส่ง OTP staging ไม่สำเร็จ: ${error.message}`,
      errorCode: error.name,
      maskedPhoneNumber: validation.phoneNumberMasked,
    };
  }

  return {
    status: 'success',
    success: true,
    message: `ส่ง OTP staging ไปที่ ${validation.phoneNumberMasked} แล้ว ใช้เฉพาะเบอร์ทดสอบภายในและอย่าเก็บ OTP ใน log`,
    maskedPhoneNumber: validation.phoneNumberMasked,
  };
}

export async function verifyPhoneAuthStagingOtp(
  phoneNumber: string,
  otpCode: string,
): Promise<PhoneAuthStagingActionResult> {
  const status = getPhoneAuthStagingAdapterStatus();

  if (status.canUseLocalMock) {
    return toStagingActionResult(verifyLocalMockOtp(phoneNumber, otpCode));
  }

  if (!status.canAttemptSupabaseOtp) {
    return disabledActionResult('ยังไม่พร้อมยืนยัน OTP staging จริง', status);
  }

  const validation = validateThaiPhoneNumber(phoneNumber);
  const phone = normalizeThaiPhoneToE164(phoneNumber);

  if (!validation.isValid || !phone) {
    return {
      status: 'error',
      success: false,
      message: validation.message,
    };
  }

  const token = otpCode.trim();
  if (!/^\d{6}$/.test(token)) {
    return {
      status: 'error',
      success: false,
      message: 'กรุณาใส่ OTP 6 หลักจาก SMS staging',
      maskedPhoneNumber: validation.phoneNumberMasked,
    };
  }

  const client = getSupabaseClient();
  if (!client) {
    return disabledActionResult('Supabase client ยังไม่พร้อมสำหรับการยืนยัน OTP', status);
  }

  const { data, error } = await client.auth.verifyOtp({
    phone,
    token,
    type: 'sms',
  });

  if (error || !data.user) {
    return {
      status: 'error',
      success: false,
      message: `ยืนยัน OTP staging ไม่สำเร็จ: ${error?.message ?? 'ไม่พบ user จาก Supabase Auth'}`,
      errorCode: error?.name,
      maskedPhoneNumber: validation.phoneNumberMasked,
    };
  }

  const preview: PhoneAuthStagingSessionPreview = {
    source: 'supabase_auth',
    userIdMasked: maskUserId(data.user.id),
    phoneNumberMasked: validation.phoneNumberMasked,
    createdAt: new Date().toISOString(),
    expiresAt: data.session?.expires_at ? new Date(data.session.expires_at * 1000).toISOString() : undefined,
    accessTokenPresent: Boolean(data.session?.access_token),
    refreshTokenPresent: Boolean(data.session?.refresh_token),
  };

  writeSupabaseSessionPreview(preview);

  return {
    status: 'success',
    success: true,
    message: 'ยืนยัน Supabase Phone Auth staging สำเร็จ แต่ยังไม่ sync Guest Memory และยังไม่เขียน app tables',
    maskedPhoneNumber: validation.phoneNumberMasked,
    sessionPreview: preview,
  };
}
