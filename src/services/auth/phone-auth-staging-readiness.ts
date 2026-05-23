import { publicEnv } from '@/config/env';
import { getPhoneAuthAdapterStatus } from '@/services/auth/phone-auth-adapter';
import type {
  PhoneAuthStagingArea,
  PhoneAuthStagingAreaSummary,
  PhoneAuthStagingLevel,
  PhoneAuthStagingReadinessAudit,
  PhoneAuthStagingReadinessItem,
  PhoneAuthStagingStatus,
} from '@/services/auth/phone-auth-staging.types';
import { getGuestSyncAdapterStatus } from '@/services/backend/guest-sync-adapter';
import { checkSupabaseConfig } from '@/services/supabase/supabase-config-check';

export const phoneAuthStagingAreaLabels: Record<PhoneAuthStagingArea, string> = {
  supabase_env: 'Supabase ENV',
  phone_auth_flags: 'Phone Auth flags',
  redirect_urls: 'Redirect URLs',
  sms_provider: 'SMS provider',
  otp_rate_limits: 'OTP rate limits',
  test_phone_numbers: 'Test phone numbers',
  session_ownership: 'Session ownership',
  guest_sync_dependency: 'Guest Sync dependency',
  rollback: 'Rollback',
  production_blockers: 'Production blockers',
};

export const phoneAuthStagingStatusLabels: Record<PhoneAuthStagingStatus, string> = {
  pass: 'พร้อมตามแผน',
  warn: 'ต้องตรวจต่อ',
  block: 'ห้ามเปิดจริง',
};

function item(input: PhoneAuthStagingReadinessItem): PhoneAuthStagingReadinessItem {
  return input;
}

function looksLikeServiceRoleKey(value: string) {
  return value.toLowerCase().includes('service_role');
}

function isValidRedirectUrl(value: string) {
  if (!value) {
    return false;
  }

  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol);
  } catch {
    return false;
  }
}

function statusFromCounts(blockers: number, warnings: number): PhoneAuthStagingStatus {
  if (blockers > 0) {
    return 'block';
  }

  if (warnings > 0) {
    return 'warn';
  }

  return 'pass';
}

function summarizeAreas(items: PhoneAuthStagingReadinessItem[]): PhoneAuthStagingAreaSummary[] {
  return (Object.keys(phoneAuthStagingAreaLabels) as PhoneAuthStagingArea[]).map((area) => {
    const areaItems = items.filter((entry) => entry.area === area);
    const passed = areaItems.filter((entry) => entry.status === 'pass').length;
    const warnings = areaItems.filter((entry) => entry.status === 'warn').length;
    const blockers = areaItems.filter((entry) => entry.status === 'block').length;

    return {
      area,
      label: phoneAuthStagingAreaLabels[area],
      total: areaItems.length,
      passed,
      warnings,
      blockers,
      status: statusFromCounts(blockers, warnings),
    };
  });
}

function scoreItems(items: PhoneAuthStagingReadinessItem[]) {
  const points = items.reduce((total, entry) => {
    if (entry.status === 'pass') {
      return total + 1;
    }

    if (entry.status === 'warn') {
      return total + 0.45;
    }

    return total;
  }, 0);

  return Math.round((points / items.length) * 100);
}

function levelFromScore(score: number, blockers: number): PhoneAuthStagingLevel {
  if (blockers > 0) {
    return 'blocked';
  }

  if (score >= 70) {
    return 'staging_plan_ready';
  }

  return 'local_mock_only';
}

function levelLabel(level: PhoneAuthStagingLevel) {
  const labels: Record<PhoneAuthStagingLevel, string> = {
    local_mock_only: 'ยังอยู่ในโหมด local mock',
    staging_plan_ready: 'พร้อมวางแผนทดสอบ staging',
    blocked: 'ห้ามเปิด phone OTP จริง',
  };

  return labels[level];
}

export function runPhoneAuthStagingReadinessAudit(): PhoneAuthStagingReadinessAudit {
  const supabaseConfig = checkSupabaseConfig();
  const phoneStatus = getPhoneAuthAdapterStatus();
  const guestSyncStatus = getGuestSyncAdapterStatus();
  const redirectUrl = publicEnv.supabaseAuthRedirectUrl;
  const redirectUrlValid = isValidRedirectUrl(redirectUrl);
  const serviceRoleDetected = looksLikeServiceRoleKey(publicEnv.supabaseAnonKey);
  const phoneAuthStillLocal =
    publicEnv.phoneAuthMode === 'local_mock' &&
    !publicEnv.enablePhoneAuth &&
    !publicEnv.enableAuth &&
    !publicEnv.enableCloudSync;

  const items: PhoneAuthStagingReadinessItem[] = [
    item({
      id: 'supabase-env-client-safe',
      area: 'supabase_env',
      title: 'Supabase ENV ต้องเป็น client-safe เท่านั้น',
      detail: serviceRoleDetected
        ? 'พบรูปแบบ service_role ใน anon key ต้องหยุดก่อนเปิด staging'
        : supabaseConfig.hasRequiredEnv
          ? 'พบ Supabase URL และ anon key แล้ว ต้องยืนยันว่าเป็น staging project'
          : 'ยังไม่มี Supabase ENV จริง แอปจึงทำงานแบบ local-only ได้ตามต้องการ',
      status: serviceRoleDetected ? 'block' : supabaseConfig.hasRequiredEnv ? 'warn' : 'pass',
      evidence: 'VITE_SUPABASE_URL และ VITE_SUPABASE_ANON_KEY',
      nextAction: supabaseConfig.hasRequiredEnv
        ? 'ตรวจว่าเป็น staging ไม่ใช่ production และใช้ anon public key เท่านั้น'
        : 'เมื่อเริ่มทดสอบ staging ให้ใส่เฉพาะ Project URL และ anon key ใน .env.local',
    }),
    item({
      id: 'phone-auth-flags-closed',
      area: 'phone_auth_flags',
      title: 'Phone Auth ยังไม่เปิดจริงในแอป',
      detail: `mode=${publicEnv.phoneAuthMode}, VITE_ENABLE_PHONE_AUTH=${publicEnv.enablePhoneAuth}, VITE_ENABLE_AUTH=${publicEnv.enableAuth}`,
      status: phoneAuthStillLocal ? 'pass' : 'warn',
      evidence: 'src/config/env.ts และ src/services/auth/phone-auth-adapter.ts',
      nextAction: phoneAuthStillLocal
        ? 'คงค่า local_mock ต่อไปจนกว่าจะมี staging checklist และ SMS provider พร้อม'
        : 'ปิด real auth flags ก่อน merge หรือ deploy ถ้าไม่ได้อยู่ในรอบ staging ที่ควบคุม',
    }),
    item({
      id: 'redirect-url-plan',
      area: 'redirect_urls',
      title: 'Redirect URL สำหรับ Auth ต้องกำหนดใน staging',
      detail: redirectUrl
        ? `พบ VITE_SUPABASE_AUTH_REDIRECT_URL=${redirectUrl}`
        : 'ยังไม่ได้กำหนด redirect URL ซึ่งถูกต้องสำหรับ local mock แต่ต้องมีแผนก่อนทดสอบจริง',
      status: redirectUrl ? (redirectUrlValid ? 'warn' : 'block') : 'warn',
      evidence: 'VITE_SUPABASE_AUTH_REDIRECT_URL',
      nextAction: 'เพิ่ม local dev, Cloudflare preview, staging, และ production URLs ใน Supabase Auth settings ก่อนเปิดจริง',
    }),
    item({
      id: 'sms-provider-not-configured',
      area: 'sms_provider',
      title: 'SMS provider ยังไม่ได้เชื่อม',
      detail: 'ยังไม่ส่ง OTP จริง ไม่มี provider secret ใน frontend และไม่มีค่าใช้จ่าย SMS เกิดขึ้น',
      status: 'warn',
      evidence: 'ไม่มี SMS provider ENV ใน frontend และ phone adapter network=false',
      nextAction: 'เลือก provider, ตั้ง spending limit, ตั้ง sender/country policy, และเก็บ secret เฉพาะ server/Supabase settings',
    }),
    item({
      id: 'otp-rate-limit-policy',
      area: 'otp_rate_limits',
      title: 'ต้องกำหนด rate limit ก่อนส่ง OTP จริง',
      detail: 'ต้องมี resend cooldown, max attempts, lockout, abuse monitoring, และข้อความไทยที่ไม่ทำให้ผู้ใช้กดซ้ำเร็ว',
      status: 'warn',
      evidence: 'docs/SMS_PROVIDER_COST_AND_RATE_LIMIT_NOTES.md',
      nextAction: 'กำหนด limit ใน Supabase/SMS provider และทดสอบด้วยเบอร์ทดสอบเท่านั้น',
    }),
    item({
      id: 'test-phone-number-plan',
      area: 'test_phone_numbers',
      title: 'ต้องมีแผนเบอร์ทดสอบ',
      detail: 'ยังไม่มีเบอร์จริงใน repo ซึ่งถูกต้อง ต้องเก็บ test numbers ใน Supabase/Auth provider settings หรือเอกสารภายในเท่านั้น',
      status: 'warn',
      evidence: 'ไม่มี test phone numbers ใน source code',
      nextAction: 'จัดทำรายชื่อเบอร์ทดสอบ staging แบบไม่ commit ลง repo',
    }),
    item({
      id: 'session-ownership-required',
      area: 'session_ownership',
      title: 'ต้องมี session ownership ก่อนเขียนข้อมูล',
      detail: 'Guest Sync และข้อมูลผู้ใช้ต้องรอ Supabase session จริงที่ผูกกับ user id แล้วเท่านั้น',
      status: 'pass',
      evidence: `phone session=${phoneStatus.isSessionActive ? 'local mock active' : 'none'}, network=false`,
      nextAction: 'ทดสอบว่า auth.uid() ตรงกับ owner ใน RLS ก่อนเปิด cloud sync',
    }),
    item({
      id: 'guest-sync-dependency-closed',
      area: 'guest_sync_dependency',
      title: 'Guest Sync ยังปิด cloud write',
      detail: `${guestSyncStatus.modeLabel}: ${guestSyncStatus.readinessLabel}`,
      status: guestSyncStatus.networkCallsEnabled || publicEnv.enableCloudSync ? 'block' : 'pass',
      evidence: 'VITE_ENABLE_CLOUD_SYNC และ Guest Sync adapter status',
      nextAction: 'เปิด sync หลัง real session, consent, merge policy, rollback, และ RLS ผ่าน staging แล้วเท่านั้น',
    }),
    item({
      id: 'rollback-ready-plan',
      area: 'rollback',
      title: 'ต้องมี rollback ก่อนเปิด staging OTP',
      detail: 'ต้องรู้วิธีปิด phone provider, ปิด env flags, revoke sessions, และกลับ local mock ได้ทันที',
      status: 'warn',
      evidence: 'docs/SUPABASE_AUTH_PHONE_OTP_STAGING_PLAN.md',
      nextAction: 'ซ้อม rollback ใน staging ก่อน production',
    }),
    item({
      id: 'production-auth-blocked',
      area: 'production_blockers',
      title: 'Production ยังถูกบล็อก',
      detail: 'ยังไม่ได้ทดสอบ SMS provider, redirect URLs, RLS owner checks, abuse limits, session persistence, logout, หรือ account deletion',
      status: 'block',
      evidence: 'M28 เป็น planning/checklist only',
      nextAction: 'ทำ staging phone OTP test แบบควบคุมก่อนพิจารณา production',
    }),
  ];

  const passedItems = items.filter((entry) => entry.status === 'pass');
  const warningItems = items.filter((entry) => entry.status === 'warn');
  const blockerItems = items.filter((entry) => entry.status === 'block');
  const score = scoreItems(items);
  const level = levelFromScore(score, blockerItems.length);

  return {
    generatedAt: new Date().toISOString(),
    score,
    level,
    levelLabel: levelLabel(level),
    flags: {
      enableSupabase: publicEnv.enableSupabase,
      enableAuth: publicEnv.enableAuth,
      enablePhoneAuth: publicEnv.enablePhoneAuth,
      phoneAuthMode: publicEnv.phoneAuthMode,
      enableCloudSync: publicEnv.enableCloudSync,
      authRedirectUrl: redirectUrl,
      authStagingLabel: publicEnv.authStagingLabel,
    },
    notices: [
      'ยังไม่ส่ง OTP จริง',
      'ยังไม่เปิด auth จริง',
      'ยังไม่เขียนข้อมูลลง Supabase',
      'ห้ามใส่ service-role key ใน frontend',
      'Guest Sync ต้องรอ session ownership จริงก่อน',
    ],
    items,
    passedItems,
    warningItems,
    blockerItems,
    areaSummaries: summarizeAreas(items),
    stagingSetupSteps: [
      'ยืนยัน Supabase project เป็น staging ไม่ใช่ production',
      'ใส่เฉพาะ Project URL และ anon key ใน .env.local หรือ staging env',
      'ตั้งค่า Auth Site URL และ Redirect URLs สำหรับ local dev, Cloudflare preview, staging, production',
      'เลือกและตั้งค่า SMS provider ใน Supabase dashboard โดยไม่ใส่ secret ใน frontend',
      'กำหนด OTP resend cooldown, max attempts, lockout, และ spending limit',
      'ทดสอบด้วยเบอร์ staging/test numbers เท่านั้น',
      'ตรวจว่า session ที่ได้จาก OTP ทำให้ auth.uid() ตรงกับ owner ใน RLS',
      'คง VITE_ENABLE_CLOUD_SYNC=false จนกว่า ownership, consent, merge, rollback ผ่านแล้ว',
    ],
    requiredFutureFlags: [
      'VITE_ENABLE_SUPABASE=true',
      'VITE_ENABLE_AUTH=true เฉพาะรอบ staging ที่ควบคุม',
      'VITE_ENABLE_PHONE_AUTH=true เฉพาะหลัง SMS provider และ redirect URLs พร้อม',
      'VITE_PHONE_AUTH_MODE=supabase_ready_mock หรือโหมด real adapter ใน milestone ถัดไป',
      'VITE_SUPABASE_AUTH_REDIRECT_URL=<staging-safe redirect>',
      'VITE_ENABLE_CLOUD_SYNC=false ต่อไปจนกว่า RLS ownership ผ่าน',
    ],
    smsCostWarnings: [
      'SMS OTP มีค่าใช้จ่ายทุกครั้งที่ส่งจริง ต้องมี spending limit',
      'ต้องมี resend cooldown เพื่อกันผู้ใช้กดซ้ำโดยไม่ตั้งใจ',
      'ต้องจำกัดจำนวน OTP ต่อเบอร์ ต่อ IP และต่ออุปกรณ์',
      'ข้อความไทยควรบอกชัดว่าให้รอรหัสก่อนกดส่งใหม่',
      'ห้ามเก็บ SMS provider secret หรือ service-role key ใน frontend',
    ],
    sessionOwnershipRules: [
      'ทุก write ต้องใช้ Supabase session จริง ไม่ใช้เบอร์โทรจาก client เป็น owner เอง',
      'RLS ต้องตรวจ auth.uid() เทียบ user_id/profile owner',
      'Guest Memory sync ต้องมี consent และ idempotency key',
      'ห้าม sync ข้าม account หาก phone/LINE linking ยังไม่ยืนยัน',
      'logout ต้องล้าง session แต่ไม่ควรลบ Guest Memory local ทันที',
    ],
    rollbackChecklist: [
      'ปิด VITE_ENABLE_PHONE_AUTH และ VITE_ENABLE_AUTH',
      'กลับ VITE_PHONE_AUTH_MODE=local_mock',
      'ปิด phone provider หรือ SMS provider ใน Supabase staging dashboard',
      'revoke test sessions หากมีการทดสอบจริงใน staging',
      'ตรวจว่า /app/auth/phone กลับมาเป็น local mock และยังไม่ส่ง SMS',
      'บันทึกเหตุผล rollback และค่าใช้จ่าย SMS ที่เกิดขึ้น',
    ],
    productionBlockers: [
      'ยังไม่มี real OTP staging test ที่ผ่านแล้ว',
      'ยังไม่ได้ยืนยัน Redirect URLs ครบทุก environment',
      'ยังไม่ได้ทดสอบ RLS ด้วย session เจ้าของจริง',
      'ยังไม่ได้กำหนด SMS cost guard และ abuse limits ใน production',
      'ยังไม่ได้ออกแบบ account deletion/recovery ให้ครบ',
      'ยังไม่ได้เปิด cloud sync อย่างปลอดภัยหลัง auth',
    ],
  };
}
