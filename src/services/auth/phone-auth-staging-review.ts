import { publicEnv } from '@/config/env';
import { getPhoneAuthAdapterStatus } from '@/services/auth/phone-auth-adapter';
import type {
  PhoneAuthStagingReview,
  PhoneAuthStagingReviewArea,
  PhoneAuthStagingReviewAreaSummary,
  PhoneAuthStagingReviewChecklistItem,
  PhoneAuthStagingReviewEnv,
  PhoneAuthStagingReviewItem,
  PhoneAuthStagingReviewLevel,
  PhoneAuthStagingReviewStatus,
} from '@/services/auth/phone-auth-staging-review.types';
import { getGuestSyncAdapterStatus } from '@/services/backend/guest-sync-adapter';
import { buildSupabaseManualExecutionReview } from '@/services/supabase/supabase-manual-execution-review';
import { buildSupabasePublicReadReview } from '@/services/supabase/supabase-public-read-review';
import { checkSupabaseConfig } from '@/services/supabase/supabase-config-check';

export const phoneAuthStagingReviewAreaLabels: Record<PhoneAuthStagingReviewArea, string> = {
  supabase_staging: 'Supabase staging project',
  sql_rls: 'SQL / RLS',
  public_read_probe: 'Public read probe',
  auth_flags: 'Auth flags',
  redirect_url: 'Redirect URL',
  sms_provider: 'SMS provider',
  test_phone_numbers: 'Test phone numbers',
  otp_cost_rate_limit: 'OTP cost / rate limit',
  ownership_sync: 'Ownership / sync',
  rollback: 'Rollback',
  production_safety: 'Production safety',
};

export const phoneAuthStagingReviewStatusLabels: Record<PhoneAuthStagingReviewStatus, string> = {
  pass: 'พร้อมตามแผน',
  warn: 'ต้องตรวจต่อ',
  block: 'ห้ามเปิดจริง',
};

function readReviewEnv(overrides?: Partial<PhoneAuthStagingReviewEnv>): PhoneAuthStagingReviewEnv {
  return {
    supabaseUrl: overrides?.supabaseUrl ?? publicEnv.supabaseUrl,
    supabaseAnonKey: overrides?.supabaseAnonKey ?? publicEnv.supabaseAnonKey,
    enableSupabase: overrides?.enableSupabase ?? publicEnv.enableSupabase,
    enableAuth: overrides?.enableAuth ?? publicEnv.enableAuth,
    enablePhoneAuth: overrides?.enablePhoneAuth ?? publicEnv.enablePhoneAuth,
    enableCloudSync: overrides?.enableCloudSync ?? publicEnv.enableCloudSync,
    phoneAuthMode: overrides?.phoneAuthMode ?? publicEnv.phoneAuthMode,
    supabaseAuthRedirectUrl: overrides?.supabaseAuthRedirectUrl ?? publicEnv.supabaseAuthRedirectUrl,
    authStagingLabel: overrides?.authStagingLabel ?? publicEnv.authStagingLabel,
  };
}

function item(input: PhoneAuthStagingReviewItem): PhoneAuthStagingReviewItem {
  return input;
}

function looksLikeServiceRoleKey(value: string) {
  const lower = value.toLowerCase();
  return lower.includes('service_role') || lower.includes('service-role') || lower.includes('service role');
}

function isValidRedirectUrl(value: string) {
  if (!value.trim()) return false;

  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol);
  } catch {
    return false;
  }
}

function statusFromCounts(blockers: number, warnings: number): PhoneAuthStagingReviewStatus {
  if (blockers > 0) return 'block';
  if (warnings > 0) return 'warn';
  return 'pass';
}

function summarizeAreas(items: PhoneAuthStagingReviewItem[]): PhoneAuthStagingReviewAreaSummary[] {
  return (Object.keys(phoneAuthStagingReviewAreaLabels) as PhoneAuthStagingReviewArea[]).map((area) => {
    const areaItems = items.filter((entry) => entry.area === area);
    const passed = areaItems.filter((entry) => entry.status === 'pass').length;
    const warnings = areaItems.filter((entry) => entry.status === 'warn').length;
    const blockers = areaItems.filter((entry) => entry.status === 'block').length;

    return {
      area,
      label: phoneAuthStagingReviewAreaLabels[area],
      total: areaItems.length,
      passed,
      warnings,
      blockers,
      status: statusFromCounts(blockers, warnings),
    };
  });
}

function scoreItems(items: PhoneAuthStagingReviewItem[]) {
  const points = items.reduce((total, entry) => {
    if (entry.status === 'pass') return total + 1;
    if (entry.status === 'warn') return total + 0.45;
    return total;
  }, 0);

  return Math.round((points / items.length) * 100);
}

function levelFromState(
  env: PhoneAuthStagingReviewEnv,
  blockers: number,
  redirectReady: boolean,
  serviceRoleDetected: boolean,
): PhoneAuthStagingReviewLevel {
  if (serviceRoleDetected || env.enableCloudSync) return 'blocked_unsafe';
  if (!env.enableSupabase && !env.enableAuth && !env.enablePhoneAuth) return 'blocked_default';
  if (blockers > 0) return 'staging_flags_need_review';
  if (env.enableSupabase && env.enableAuth && env.enablePhoneAuth && redirectReady) return 'staging_checklist_ready';
  return 'staging_flags_need_review';
}

function levelLabel(level: PhoneAuthStagingReviewLevel) {
  const labels: Record<PhoneAuthStagingReviewLevel, string> = {
    blocked_default: 'ค่าเริ่มต้นยังปิด real Phone Auth',
    staging_checklist_ready: 'พร้อมรีวิวรอบ staging แต่ยังไม่ส่ง OTP จากแอป',
    staging_flags_need_review: 'เปิดบาง flag แล้ว ต้องตรวจ checklist ก่อน',
    blocked_unsafe: 'มีเงื่อนไขไม่ปลอดภัย ต้องหยุดก่อน',
  };

  return labels[level];
}

function checklist(id: string, label: string, detail: string, requiredBeforeRealOtp = true): PhoneAuthStagingReviewChecklistItem {
  return { id, label, detail, requiredBeforeRealOtp };
}

function buildDashboardSetupChecklist(): PhoneAuthStagingReviewChecklistItem[] {
  return [
    checklist('project-confirmed', 'ยืนยัน kasethub-staging', 'ใช้เฉพาะ staging project ไม่ใช้ production project ในรอบทดสอบแรก'),
    checklist('auth-provider-phone', 'เปิด Phone provider ใน Supabase Auth', 'ตั้งค่าเฉพาะบน Supabase dashboard/secret store ไม่ใส่ SMS secret ใน frontend'),
    checklist('site-url', 'ตั้งค่า Site URL', 'ใส่ local dev, preview/staging และ production URL ในรายการที่ถูกต้อง'),
    checklist('sms-spend-limit', 'ตั้ง spending limit', 'กำหนดงบ SMS OTP และตรวจยอดหลังทดสอบทุกครั้ง'),
    checklist('disable-after-test', 'มีขั้นตอนปิดหลังทดสอบ', 'ปิด provider/flags ได้ทันทีหาก OTP ล้มเหลวหรือค่าใช้จ่ายผิดปกติ'),
  ];
}

function buildRedirectChecklist(): PhoneAuthStagingReviewChecklistItem[] {
  return [
    checklist('local-redirect', 'Local dev redirect', 'เช่น http://localhost:5173/app/auth/status หรือ URL ที่ทีมใช้ทดสอบ'),
    checklist('preview-redirect', 'Preview/Staging redirect', 'เพิ่ม URL ของ staging preview ให้ตรงกับ Supabase dashboard'),
    checklist('production-redirect-parked', 'Production URL parked', 'เตรียมรายการ production แต่ยังไม่เปิด production auth'),
    checklist('redirect-no-secrets', 'Redirect ไม่มี secret', 'ห้ามใส่ token, service-role key, provider secret หรือเบอร์ทดสอบใน URL'),
  ];
}

function buildSmsChecklist(): PhoneAuthStagingReviewChecklistItem[] {
  return [
    checklist('provider-selected', 'เลือก SMS provider', 'ตั้งค่า sender/country policy และตรวจว่าใช้ได้ในประเทศไทย'),
    checklist('provider-secret-server-only', 'SMS secret server-only', 'secret อยู่ใน Supabase/Auth provider settings เท่านั้น ไม่อยู่ใน Vite env'),
    checklist('cooldown', 'ตั้ง resend cooldown', 'ลดการกดซ้ำและลดค่าใช้จ่าย OTP'),
    checklist('attempt-limit', 'ตั้ง max attempts / lockout', 'จำกัดจำนวน OTP ต่อเบอร์ ต่อ IP หรือต่อ session ตามที่ provider รองรับ'),
  ];
}

function buildTestPhoneNumberPlan(): PhoneAuthStagingReviewChecklistItem[] {
  return [
    checklist('internal-test-numbers', 'เก็บเบอร์ทดสอบนอก repo', 'ใช้รายการภายในทีม ห้าม commit เบอร์จริงลง source code'),
    checklist('owner-consent', 'เจ้าของเบอร์ยินยอม', 'ผู้ทดสอบต้องรู้ว่า OTP จริงอาจมีค่าใช้จ่ายและอาจเกิด SMS จริง'),
    checklist('small-batch', 'ทดสอบจำนวนน้อยก่อน', 'เริ่มจาก 1-2 เบอร์และบันทึกผลก่อนขยายการทดสอบ'),
    checklist('remove-after-test', 'ลบ/ปิดรายการทดสอบเมื่อเสร็จ', 'ลดความเสี่ยงการส่ง OTP ผิดรอบหรือผิดเบอร์'),
  ];
}

function buildOwnershipRequirements(): string[] {
  return [
    'Guest Memory sync ต้องรอ Supabase session จริง ไม่ใช้ phone mock session เป็น owner',
    'RLS ต้องตรวจ `auth.uid()` เทียบกับ `user_id` หรือ owner field ทุกตารางที่เขียน',
    'ต้องขอ consent ก่อนอัปโหลด Guest Memory จากเครื่องขึ้น cloud',
    'ต้องมี idempotency key เพื่อ retry แล้วไม่สร้างข้อมูลซ้ำ',
    'หลัง backend ยืนยันสำเร็จเท่านั้นจึงค่อยทำเครื่องหมาย local ว่าซิงก์แล้ว',
  ];
}

function buildRollbackSteps(): string[] {
  return [
    'ตั้ง `VITE_ENABLE_PHONE_AUTH=false` และ `VITE_ENABLE_AUTH=false`',
    'กลับ `VITE_PHONE_AUTH_MODE=local_mock`',
    'ปิด Phone provider หรือ SMS provider ใน Supabase staging dashboard',
    'revoke test sessions ที่เกิดจากการทดสอบ staging ถ้ามี',
    'คง `VITE_ENABLE_CLOUD_SYNC=false` จนกว่า ownership/RLS จะผ่าน',
    'บันทึกเหตุผล rollback, error, และค่า SMS ที่เกิดขึ้น',
  ];
}

export function runPhoneAuthStagingReview(
  overrides?: Partial<PhoneAuthStagingReviewEnv>,
): PhoneAuthStagingReview {
  const env = readReviewEnv(overrides);
  const supabaseConfig = checkSupabaseConfig({
    ...publicEnv,
    supabaseUrl: env.supabaseUrl,
    supabaseAnonKey: env.supabaseAnonKey,
    enableSupabase: env.enableSupabase,
    enableAuth: env.enableAuth,
    enableCloudSync: env.enableCloudSync,
  });
  const phoneStatus = getPhoneAuthAdapterStatus();
  const guestSyncStatus = getGuestSyncAdapterStatus();
  const manualReview = buildSupabaseManualExecutionReview();
  const publicReadReview = buildSupabasePublicReadReview();
  const serviceRoleDetected = looksLikeServiceRoleKey(env.supabaseAnonKey);
  const redirectReady = isValidRedirectUrl(env.supabaseAuthRedirectUrl);
  const authFlagsDefaultOff =
    env.phoneAuthMode === 'local_mock' && !env.enableAuth && !env.enablePhoneAuth && !env.enableCloudSync;
  const stagingFlagsExplicit =
    env.enableSupabase &&
    env.enableAuth &&
    env.enablePhoneAuth &&
    (env.phoneAuthMode === 'supabase_ready_mock' || env.phoneAuthMode === 'supabase_staging_ready');

  const items: PhoneAuthStagingReviewItem[] = [
    item({
      id: 'staging-project-exists',
      area: 'supabase_staging',
      title: 'Supabase staging project exists',
      detail: manualReview.status === 'success'
        ? 'M42 ยืนยันว่า kasethub-staging ถูกสร้างและตรวจด้วยมือแล้ว'
        : 'ยังไม่มีหลักฐาน staging project ที่ผ่าน review',
      status: manualReview.status === 'success' ? 'pass' : 'block',
      evidence: manualReview.statusDetail,
      nextAction: manualReview.status === 'success' ? undefined : 'สร้างหรือยืนยัน staging project ก่อนทดสอบ OTP',
    }),
    item({
      id: 'sql-rls-success',
      area: 'sql_rls',
      title: 'SQL/RLS success evidence',
      detail: manualReview.blockers.length === 0
        ? 'M42 รายงาน schema SQL และ RLS SQL สำเร็จแล้วบน staging'
        : 'ยังมี blocker จาก manual SQL/RLS review',
      status: manualReview.blockers.length === 0 ? 'pass' : 'block',
      evidence: manualReview.verifiedResults.join(' | '),
      nextAction: manualReview.blockers.length === 0 ? undefined : 'แก้ blocker SQL/RLS ก่อนเปิด auth',
    }),
    item({
      id: 'public-read-probe-success',
      area: 'public_read_probe',
      title: 'Public read/RLS probe success',
      detail: publicReadReview.status === 'success'
        ? 'M44 ยืนยัน public read-safe tables และ RLS review ผ่านแล้ว'
        : 'public read/RLS review ยังไม่ผ่าน',
      status: publicReadReview.status === 'success' ? 'pass' : 'block',
      evidence: publicReadReview.publicReadVerificationStatus,
      nextAction: publicReadReview.status === 'success' ? undefined : 'ทบทวน public read/RLS ก่อนเปิด auth',
    }),
    item({
      id: 'client-safe-env',
      area: 'supabase_staging',
      title: 'Frontend ENV ต้องเป็น client-safe',
      detail: serviceRoleDetected
        ? 'พบ pattern service-role ใน anon key ต้องลบออกทันที'
        : supabaseConfig.hasRequiredEnv
          ? 'พบ staging URL/anon key shape แล้ว ต้องยืนยันว่าไม่ใช่ production'
          : 'ค่าเริ่มต้นไม่มี Supabase URL/anon key จริง เหมาะกับ local safe default',
      status: serviceRoleDetected ? 'block' : supabaseConfig.hasRequiredEnv ? 'warn' : 'pass',
      evidence: 'VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY',
      nextAction: serviceRoleDetected ? 'ใช้ anon key เท่านั้นและเก็บ service-role บน server' : undefined,
    }),
    item({
      id: 'auth-flags-default-off',
      area: 'auth_flags',
      title: 'Auth flags off by default',
      detail: `mode=${env.phoneAuthMode}, auth=${env.enableAuth}, phone=${env.enablePhoneAuth}, cloudSync=${env.enableCloudSync}`,
      status: authFlagsDefaultOff ? 'pass' : stagingFlagsExplicit ? 'warn' : 'block',
      evidence: '.env.example และ src/config/env.ts',
      nextAction: authFlagsDefaultOff
        ? 'คงค่า default จนถึงรอบทดสอบ staging ที่ควบคุมได้'
        : 'ตรวจว่า flags เปิดเฉพาะ staging และปิด cloud sync อยู่',
    }),
    item({
      id: 'redirect-url-ready',
      area: 'redirect_url',
      title: 'Redirect URL readiness',
      detail: env.supabaseAuthRedirectUrl
        ? `พบ redirect URL: ${env.supabaseAuthRedirectUrl}`
        : 'ยังไม่มี redirect URL ซึ่งปลอดภัยสำหรับ default แต่ยังไม่พร้อมส่ง OTP staging',
      status: redirectReady ? 'warn' : 'block',
      evidence: 'VITE_SUPABASE_AUTH_REDIRECT_URL',
      nextAction: 'เพิ่ม local/staging redirect URLs ใน Supabase dashboard ก่อนทดสอบ OTP จริง',
    }),
    item({
      id: 'sms-provider-setup',
      area: 'sms_provider',
      title: 'SMS provider setup status',
      detail: 'M61 ยังไม่ตั้ง SMS provider ใน frontend และยังไม่ส่ง SMS จริง',
      status: 'block',
      evidence: 'ไม่มี SMS provider secret ใน Vite env และ adapter network=false',
      nextAction: 'ตั้ง provider, sender/country policy, spending limit และ secrets ใน Supabase dashboard เท่านั้น',
    }),
    item({
      id: 'test-phone-number-plan',
      area: 'test_phone_numbers',
      title: 'Test phone number plan',
      detail: 'มีแผนใช้เบอร์ทดสอบนอก repo เท่านั้น ยังไม่มีเบอร์จริงใน source code',
      status: 'warn',
      evidence: 'docs/M61_PHONE_AUTH_STAGING_TEST_PLAN.md',
      nextAction: 'เตรียมรายชื่อเบอร์ทดสอบภายในทีมและขอ consent ก่อนส่ง OTP จริง',
    }),
    item({
      id: 'otp-cost-rate-limit-warning',
      area: 'otp_cost_rate_limit',
      title: 'OTP cost and rate-limit warning',
      detail: 'ต้องมี spending limit, resend cooldown, max attempts, lockout และ abuse monitoring ก่อนส่งจริง',
      status: 'warn',
      evidence: 'docs/SMS_PROVIDER_COST_AND_RATE_LIMIT_NOTES.md',
      nextAction: 'กำหนดค่าใน Supabase/SMS provider ก่อนเริ่ม staging test',
    }),
    item({
      id: 'ownership-before-sync',
      area: 'ownership_sync',
      title: 'Ownership required before cloud sync',
      detail: env.enableCloudSync
        ? 'Cloud sync เปิดอยู่ก่อนพิสูจน์ owner ต้อง block'
        : `Cloud sync ยังปิด · Guest Sync ${guestSyncStatus.modeLabel} · Phone ${phoneStatus.modeLabel}`,
      status: env.enableCloudSync || guestSyncStatus.networkCallsEnabled ? 'block' : 'pass',
      evidence: 'VITE_ENABLE_CLOUD_SYNC และ Guest Sync adapter',
      nextAction: 'ทดสอบ auth.uid() กับ RLS owner ก่อนเปิด sync',
    }),
    item({
      id: 'rollback-ready',
      area: 'rollback',
      title: 'Rollback readiness',
      detail: 'มีขั้นตอนปิด flags, กลับ local mock, ปิด provider, revoke sessions และบันทึกค่า SMS',
      status: 'pass',
      evidence: 'docs/M61_PHONE_AUTH_ROLLBACK_PLAN.md',
    }),
    item({
      id: 'production-still-blocked',
      area: 'production_safety',
      title: 'Production remains blocked',
      detail: 'ยังไม่มี live OTP test, auth ownership proof, cloud sync proof, SMS cost guard production หรือ account deletion/recovery review',
      status: 'block',
      evidence: 'M61 planning route only',
      nextAction: 'ทดสอบ staging แบบ manual ก่อนพิจารณา production',
    }),
  ];

  const passedItems = items.filter((entry) => entry.status === 'pass');
  const warningItems = items.filter((entry) => entry.status === 'warn');
  const blockerItems = items.filter((entry) => entry.status === 'block');
  const score = scoreItems(items);
  const level = levelFromState(env, blockerItems.length, redirectReady, serviceRoleDetected);

  return {
    generatedAt: new Date().toISOString(),
    milestone: 'M61',
    score,
    level,
    levelLabel: levelLabel(level),
    flags: env,
    serviceRoleKeyAcceptedInFrontend: false,
    serviceRoleKeyDetected: serviceRoleDetected,
    canSendRealOtp: false,
    noRealSms: true,
    noSupabaseWrite: true,
    noCloudSync: true,
    items,
    passedItems,
    warningItems,
    blockerItems,
    areaSummaries: summarizeAreas(items),
    dashboardSetupChecklist: buildDashboardSetupChecklist(),
    redirectUrlChecklist: buildRedirectChecklist(),
    smsProviderChecklist: buildSmsChecklist(),
    testPhoneNumberPlan: buildTestPhoneNumberPlan(),
    ownershipRequirements: buildOwnershipRequirements(),
    rollbackSteps: buildRollbackSteps(),
    blockers: blockerItems.map((entry) => entry.title),
    safetyNotices: [
      'ยังไม่ส่ง OTP จริง',
      'ยังไม่ส่ง SMS จริงโดยอัตโนมัติ',
      'ยังไม่เปิด Phone Auth ใน production',
      'ห้าม commit .env.local หรือ real keys',
      'ห้ามใส่ service-role key ใน frontend',
      'Guest Memory sync ต้องรอ session ownership จริงก่อน',
    ],
  };
}
