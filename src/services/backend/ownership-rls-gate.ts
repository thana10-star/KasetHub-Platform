import { publicEnv } from '@/config/env';
import { getAuthOwnershipStatus } from '@/services/auth/auth-ownership-status';
import type {
  OwnershipGateAuditRequirement,
  OwnershipGateBlocker,
  OwnershipGateCheck,
  OwnershipGateConsentRequirement,
  OwnershipGateIdempotencyRequirement,
  OwnershipGateRlsExpectation,
  OwnershipGateStatus,
  OwnershipGateStatusCode,
  OwnershipRlsGateInput,
} from '@/services/backend/ownership-rls-gate.types';

function looksLikeServiceRoleKey(value = '') {
  const normalized = value.toLowerCase();
  return normalized.includes('service_role') || normalized.includes('service-role') || normalized.includes('supabase_service_role');
}

function countLocalRecords(value: number | undefined) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.floor(value ?? 0));
}

export const ownershipGateRlsExpectations: OwnershipGateRlsExpectation[] = [
  {
    id: 'read-own-rows',
    tableGroup: 'user_owned_rows',
    expectation: 'authenticated user can read own rows where owner_id = auth.uid()',
    status: 'planned',
    mustPassBeforeSync: true,
  },
  {
    id: 'block-other-users',
    tableGroup: 'user_owned_rows',
    expectation: 'authenticated user cannot read other users rows',
    status: 'planned',
    mustPassBeforeSync: true,
  },
  {
    id: 'block-anon-owned-data',
    tableGroup: 'user_owned_rows',
    expectation: 'anon cannot read user-owned rows',
    status: 'planned',
    mustPassBeforeSync: true,
  },
  {
    id: 'insert-owner-matches-auth',
    tableGroup: 'guest_memory_imports',
    expectation: 'insert requires owner_id = auth.uid()',
    status: 'planned',
    mustPassBeforeSync: true,
  },
  {
    id: 'update-delete-own-only',
    tableGroup: 'user_owned_rows',
    expectation: 'update/delete own rows only',
    status: 'planned',
    mustPassBeforeSync: true,
  },
  {
    id: 'service-role-backend-only',
    tableGroup: 'backend_sync',
    expectation: 'service-role is reserved for backend sync only and never appears in frontend',
    status: 'planned',
    mustPassBeforeSync: true,
  },
];

function buildConsentRequirements(consentCaptured: boolean): OwnershipGateConsentRequirement[] {
  return [
    {
      id: 'explicit-sync-consent',
      label: 'ขอความยินยอมก่อนอัปโหลด',
      required: true,
      status: consentCaptured ? 'ready' : 'missing',
      detail: 'ผู้ใช้ต้องเลือกข้อมูลที่จะย้ายและยืนยันก่อนเริ่ม Guest Memory upload จริง',
    },
    {
      id: 'consent-copy-review',
      label: 'ข้อความ consent อ่านง่าย',
      required: true,
      status: 'planned',
      detail: 'ข้อความต้องบอกว่าอัปโหลดอะไร ไปที่บัญชีใด และยังไม่ลบข้อมูล local จน backend ยืนยันสำเร็จ',
    },
  ];
}

function buildIdempotencyRequirements(idempotencyKeyReady: boolean): OwnershipGateIdempotencyRequirement[] {
  return [
    {
      id: 'sync-idempotency-key',
      label: 'idempotency key ต่อคำขอ sync',
      required: true,
      status: idempotencyKeyReady ? 'ready' : 'missing',
      detail: 'retry เดิมต้องไม่สร้างข้อมูลซ้ำ และ key ต้องผูกกับ owner id ฝั่ง backend',
    },
    {
      id: 'duplicate-merge-policy',
      label: 'กติกา merge รายการซ้ำ',
      required: true,
      status: 'planned',
      detail: 'saved items, likes, follows, farm records และ AI history ต้องมี key สำหรับรวม/ข้ามรายการซ้ำ',
    },
  ];
}

function buildAuditRequirements(auditPlanReady: boolean): OwnershipGateAuditRequirement[] {
  return [
    {
      id: 'sync-audit-log',
      label: 'audit log สำหรับ sync',
      required: true,
      status: auditPlanReady ? 'ready' : 'missing',
      detail: 'ต้องบันทึก request id, owner id, จำนวนรายการ, ผลลัพธ์ และ error แบบไม่เก็บข้อมูลส่วนตัวเกินจำเป็น',
    },
    {
      id: 'rollback-audit-trail',
      label: 'บันทึก rollback/failure',
      required: true,
      status: 'planned',
      detail: 'หาก sync ล้มเหลวต้องรู้ว่าล้มเหลวตรงไหน โดยข้อมูลในเครื่องยังไม่ถูกลบ',
    },
  ];
}

function createCheck(
  id: string,
  label: string,
  status: OwnershipGateCheck['status'],
  detail: string,
  evidence: string,
  nextAction: string,
): OwnershipGateCheck {
  return { id, label, status, detail, evidence, nextAction };
}

function createBlocker(id: string, label: string, detail: string, severity: OwnershipGateBlocker['severity'] = 'blocker') {
  return { id, label, detail, severity };
}

function pickStatusCode(checks: OwnershipGateCheck[]): OwnershipGateStatusCode {
  const blockIds = checks.filter((check) => check.status === 'block').map((check) => check.id);

  if (blockIds.includes('service-role-frontend')) return 'blocked_service_role_frontend';
  if (blockIds.includes('mock-session')) return 'blocked_mock_session_only';
  if (blockIds.includes('real-session')) return 'blocked_no_real_session';
  if (blockIds.includes('guest-memory-local-data')) return 'blocked_missing_guest_memory';
  if (blockIds.includes('consent-required')) return 'blocked_missing_consent';
  if (blockIds.includes('idempotency-required')) return 'blocked_missing_idempotency';
  if (blockIds.includes('audit-required')) return 'blocked_missing_audit_plan';

  return 'review_ready_but_sync_blocked';
}

function statusLabelFor(code: OwnershipGateStatusCode) {
  const labels: Record<OwnershipGateStatusCode, string> = {
    blocked_no_real_session: 'Blocked: no real Supabase Auth session',
    blocked_mock_session_only: 'Blocked: mock session is not ownership',
    blocked_missing_guest_memory: 'Blocked: no local Guest Memory to upload',
    blocked_missing_consent: 'Blocked: consent not ready',
    blocked_missing_idempotency: 'Blocked: idempotency not ready',
    blocked_missing_audit_plan: 'Blocked: audit plan not ready',
    blocked_service_role_frontend: 'Blocked: service-role-like key in frontend',
    review_ready_but_sync_blocked: 'Review ready, sync still blocked in M63',
  };

  return labels[code];
}

export function buildOwnershipRlsGateStatus(input: OwnershipRlsGateInput = {}): OwnershipGateStatus {
  const env = {
    enableCloudSync: input.env?.enableCloudSync ?? publicEnv.enableCloudSync,
    supabaseAnonKey: input.env?.supabaseAnonKey ?? publicEnv.supabaseAnonKey,
    isProd: input.env?.isProd ?? publicEnv.isProd,
  };
  const guestMemoryRecordCount = countLocalRecords(input.guestMemoryRecordCount);
  const consentReady = Boolean(input.consentCaptured);
  const idempotencyReady = Boolean(input.idempotencyKeyReady);
  const auditReady = Boolean(input.auditPlanReady);
  const authOwnership = getAuthOwnershipStatus({
    phoneMockSession: input.phoneMockSession,
    supabaseSessionPreview: input.supabaseSessionPreview,
  });
  const serviceRoleDetected = looksLikeServiceRoleKey(env.supabaseAnonKey);
  const localDataExists = guestMemoryRecordCount > 0;

  const checks: OwnershipGateCheck[] = [
    createCheck(
      'real-session',
      'Real Supabase Auth session',
      authOwnership.realSupabaseSessionDetected ? 'pass' : 'block',
      'ต้องมี session จาก Supabase Phone Auth staging จริงก่อนเชื่อ owner id',
      authOwnership.userIdMasked ? `masked owner ${authOwnership.userIdMasked}` : 'no real session',
      'ทดสอบ Phone Auth staging ให้ผ่านก่อน',
    ),
    createCheck(
      'mock-session',
      'Mock session is not ownership',
      authOwnership.localMockSessionDetected && !authOwnership.realSupabaseSessionDetected ? 'block' : 'pass',
      'Phone mock ใช้ทดสอบ UX เท่านั้น ไม่ใช่ auth.uid() จริง',
      authOwnership.localMockSessionDetected ? 'mock session detected' : 'no mock-only ownership',
      'ใช้ Supabase session จริงเท่านั้นสำหรับ sync',
    ),
    createCheck(
      'auth-uid-owner',
      'auth.uid() owner mapping',
      authOwnership.realSupabaseSessionDetected ? 'warn' : 'block',
      'backend ต้องตรวจว่า owner_id ใน payload ตรงกับ auth.uid()',
      authOwnership.userIdMasked ? `expected auth.uid() ${authOwnership.userIdMasked}` : 'owner id unavailable',
      'เพิ่ม owner-scoped RLS dry-run ใน milestone ถัดไป',
    ),
    createCheck(
      'guest-memory-local-data',
      'Guest Memory local data exists',
      localDataExists ? 'pass' : 'block',
      'ต้องมีข้อมูล local ที่จะย้ายจริง จึงจะเริ่ม review sync ได้',
      `${guestMemoryRecordCount} local records`,
      'เก็บรายการตัวอย่างในเครื่อง หรือทดสอบด้วย fixture ที่ปลอดภัย',
    ),
    createCheck(
      'consent-required',
      'Consent required before upload',
      consentReady ? 'pass' : 'block',
      'ผู้ใช้ต้องยืนยันก่อนส่งข้อมูลจากเครื่องไปบัญชี',
      consentReady ? 'consent marked ready in review input' : 'consent missing',
      'ออกแบบ consent capture และข้อความยืนยัน',
    ),
    createCheck(
      'idempotency-required',
      'Idempotency key required',
      idempotencyReady ? 'pass' : 'block',
      'ทุกคำขอ sync ต้องมี key กันข้อมูลซ้ำและ retry ซ้ำ',
      idempotencyReady ? 'idempotency marked ready in review input' : 'idempotency key missing',
      'ผูก idempotency key กับ owner id ฝั่ง backend',
    ),
    createCheck(
      'audit-required',
      'Audit log required',
      auditReady ? 'pass' : 'block',
      'ต้องมี audit plan ก่อน sync จริงเพื่อ rollback และตรวจสอบปัญหา',
      auditReady ? 'audit plan marked ready in review input' : 'audit plan missing',
      'เตรียม audit table/Edge Function logging ใน milestone ถัดไป',
    ),
    createCheck(
      'rls-owner-policies',
      'RLS owner policies expected',
      'warn',
      'ต้อง dry-run กติกา own-only ก่อนเขียนข้อมูลจริง',
      `${ownershipGateRlsExpectations.length} planned RLS expectations`,
      'รัน owner-scoped RLS verification แบบปลอดภัยใน staging',
    ),
    createCheck(
      'service-role-frontend',
      'No service-role key in frontend',
      serviceRoleDetected ? 'block' : 'pass',
      'service-role key ต้องอยู่ backend/Edge Function เท่านั้น',
      serviceRoleDetected ? 'service-role-like key detected' : 'no service-role-like key detected',
      'ลบ key ออกจาก frontend env และ rotate key ถ้าหลุด',
    ),
    createCheck(
      'm63-sync-block',
      'M63 sync remains blocked',
      'block',
      'M63 เป็น review gate เท่านั้น ยังไม่อัปโหลดข้อมูลจริง',
      'syncAllowed false by design',
      'รอ milestone owner/RLS dry-run และ consent implementation',
    ),
  ];

  const blockers: OwnershipGateBlocker[] = checks
    .filter((check) => check.status === 'block')
    .map((check) => createBlocker(check.id, check.label, check.detail));

  if (env.enableCloudSync) {
    blockers.push(
      createBlocker(
        'cloud-sync-flag',
        'Cloud sync flag is enabled',
        'VITE_ENABLE_CLOUD_SYNC must stay false until ownership/RLS gate passes',
      ),
    );
  }

  if (env.isProd) {
    blockers.push(
      createBlocker(
        'production-build',
        'Production build is not allowed for this gate',
        'M63 review is staging/planning only and must not enable production sync',
      ),
    );
  }

  const statusCode = pickStatusCode(checks);

  return {
    milestone: 'M63',
    generatedAt: new Date().toISOString(),
    statusCode,
    statusLabel: statusLabelFor(statusCode),
    syncAllowed: false,
    realSessionDetected: authOwnership.realSupabaseSessionDetected,
    mockSessionDetected: authOwnership.localMockSessionDetected,
    ownershipVerified: authOwnership.ownershipVerified && authOwnership.realSupabaseSessionDetected,
    expectedOwnerIdMasked: authOwnership.userIdMasked,
    guestMemoryRecordCount,
    localDataExists,
    consentReady,
    idempotencyReady,
    auditReady,
    serviceRoleDetected,
    serviceRoleFrontendBlocked: true,
    cloudSyncEnabled: Boolean(env.enableCloudSync),
    checks,
    blockers,
    consentRequirements: buildConsentRequirements(consentReady),
    idempotencyRequirements: buildIdempotencyRequirements(idempotencyReady),
    auditRequirements: buildAuditRequirements(auditReady),
    rlsExpectations: ownershipGateRlsExpectations,
    nextSafeStep:
      'Verify owner-scoped RLS dry-run, capture consent, add idempotency/audit hooks, then review before any Guest Memory upload.',
    noGuestMemoryUpload: true,
    noSupabaseAppWrites: true,
    noCloudSync: true,
  };
}
