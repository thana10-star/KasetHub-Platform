import { publicEnv } from '@/config/env';
import { getPhoneAuthAdapterStatus } from '@/services/auth/phone-auth-adapter';
import { runPhoneAuthStagingReadinessAudit } from '@/services/auth/phone-auth-staging-readiness';
import { getGuestSyncAdapterStatus } from '@/services/backend/guest-sync-adapter';
import type {
  GuestSyncIdempotencyKey,
  GuestSyncStagingReadiness,
  GuestSyncStagingReadinessArea,
  GuestSyncStagingReadinessItem,
  GuestSyncStagingReadinessLevel,
  GuestSyncStagingReadinessStatus,
} from '@/services/backend/guest-sync-edge.types';
import { checkSupabaseConfig } from '@/services/supabase/supabase-config-check';
import { validateSupabaseSqlDraft } from '@/services/supabase/supabase-sql-draft-validator';

export const guestSyncEdgeEndpointName = 'guest-memory-sync' as const;

export const guestSyncStagingAreaLabels: Record<GuestSyncStagingReadinessArea, string> = {
  edge_contract: 'Edge Function contract',
  auth_session: 'Auth/session ownership',
  service_role_boundary: 'Service-role boundary',
  idempotency: 'Idempotency',
  merge_rules: 'Merge rules',
  consent: 'Consent',
  rollback: 'Rollback',
  feature_flags: 'Feature flags',
  schema_rls: 'Schema/RLS',
  production_blockers: 'Production blockers',
};

export const guestSyncStagingStatusLabels: Record<GuestSyncStagingReadinessStatus, string> = {
  pass: 'พร้อมตามแผน',
  warn: 'ต้องตรวจต่อ',
  block: 'ห้ามเปิดจริง',
};

function readinessItem(input: GuestSyncStagingReadinessItem): GuestSyncStagingReadinessItem {
  return input;
}

function scoreItems(items: GuestSyncStagingReadinessItem[]) {
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

function levelFromScore(score: number, blockers: number): GuestSyncStagingReadinessLevel {
  if (blockers > 0) {
    return 'staging_blocked';
  }

  if (score >= 65) {
    return 'contract_ready';
  }

  return 'local_only';
}

function levelLabel(level: GuestSyncStagingReadinessLevel) {
  const labels: Record<GuestSyncStagingReadinessLevel, string> = {
    local_only: 'ยังเป็นแผน local-only',
    contract_ready: 'contract พร้อมสำหรับเตรียม staging',
    staging_blocked: 'ยังห้ามเปิด staging จริง',
  };

  return labels[level];
}

function serviceRoleLikeValueDetected(value: string) {
  const normalized = value.toLowerCase();
  return normalized.includes('service_role') || normalized.includes('service-role');
}

export function createGuestSyncIdempotencyKeyPreview(guestId = 'guest-local-preview'): GuestSyncIdempotencyKey {
  const normalizedGuestId = guestId.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 18) || 'guest-preview';
  return `guest-sync-preview-${normalizedGuestId}-YYYYMMDD-HHMM`;
}

export function runGuestSyncStagingReadiness(): GuestSyncStagingReadiness {
  const supabaseConfig = checkSupabaseConfig();
  const guestSyncStatus = getGuestSyncAdapterStatus();
  const phoneStatus = getPhoneAuthAdapterStatus();
  const phoneAuthReadiness = runPhoneAuthStagingReadinessAudit();
  const sqlDraft = validateSupabaseSqlDraft();
  const serviceRoleDetected = serviceRoleLikeValueDetected(publicEnv.supabaseAnonKey);
  const edgeFlagClosed =
    !publicEnv.enableGuestSyncEdge &&
    publicEnv.guestSyncEdgeMode === 'disabled' &&
    !publicEnv.enableCloudSync &&
    !publicEnv.enableAuth;

  const items: GuestSyncStagingReadinessItem[] = [
    readinessItem({
      id: 'edge-contract-drafted',
      area: 'edge_contract',
      title: 'Edge Function contract ถูกกำหนดแล้ว',
      detail: 'เตรียม endpoint guest-memory-sync แบบ POST พร้อม request/response, validation, merge, rollback และ audit strategy ในเอกสาร',
      status: 'pass',
      evidence: 'docs/GUEST_SYNC_EDGE_FUNCTION_CONTRACT.md และ src/services/backend/guest-sync-edge.types.ts',
      nextAction: 'เมื่อพร้อม staging ให้ implement Edge Function ฝั่ง Supabase โดยไม่คัดลอก service-role key เข้า frontend',
    }),
    readinessItem({
      id: 'edge-not-deployed',
      area: 'edge_contract',
      title: 'ยังไม่ได้ deploy Edge Function จริง',
      detail: 'M29 เป็น staging plan เท่านั้น ไม่มี endpoint URL และไม่มีการเรียก network จาก browser',
      status: 'warn',
      evidence: 'VITE_ENABLE_GUEST_SYNC_EDGE=false และ VITE_GUEST_SYNC_EDGE_MODE=disabled',
      nextAction: 'deploy เฉพาะหลัง staging Supabase, SQL/RLS, Auth session, และ rollback checklist ผ่านแล้ว',
    }),
    readinessItem({
      id: 'auth-session-required',
      area: 'auth_session',
      title: 'ต้องมี Supabase user session จริงก่อน sync',
      detail: phoneStatus.session
        ? 'พบ phone mock session สำหรับทดสอบ UX เท่านั้น แต่ยังไม่ใช่ Supabase session จริง'
        : 'ยังไม่มี real Supabase session ซึ่งถูกต้องสำหรับ M29 เพราะ cloud sync ยังต้องปิดไว้',
      status: publicEnv.enableAuth ? 'warn' : 'pass',
      evidence: 'Phone auth adapter และ docs/SUPABASE_AUTH_PHONE_OTP_STAGING_PLAN.md',
      nextAction: 'ทดสอบ auth.uid() ownership บน staging ก่อนเรียก guest-memory-sync',
    }),
    readinessItem({
      id: 'phone-auth-staging-dependency',
      area: 'auth_session',
      title: 'Phone OTP staging เป็น dependency ของ real sync',
      detail: `${phoneAuthReadiness.levelLabel} · score ${phoneAuthReadiness.score}%`,
      status: phoneAuthReadiness.blockerItems.length > 0 ? 'warn' : 'pass',
      evidence: '/app/auth/phone-staging',
      nextAction: 'ทำ phone OTP staging test แบบควบคุมก่อนเปิด Guest Sync Edge Function',
    }),
    readinessItem({
      id: 'service-role-server-only',
      area: 'service_role_boundary',
      title: 'service-role key ต้องอยู่เฉพาะใน Edge Function',
      detail: serviceRoleDetected
        ? 'พบ pattern คล้าย service-role ใน frontend anon key ต้องหยุดทันที'
        : 'ไม่พบ pattern service-role ใน frontend config และ contract ระบุ server-only boundary แล้ว',
      status: serviceRoleDetected ? 'block' : 'pass',
      evidence: 'VITE_SUPABASE_ANON_KEY และ docs/GUEST_SYNC_EDGE_FUNCTION_CONTRACT.md',
      nextAction: serviceRoleDetected
        ? 'ลบ key ออกจาก frontend env และ rotate key ก่อนทำต่อ'
        : 'ตั้ง service-role เป็น Supabase secret เฉพาะ Edge Function ในอนาคต',
    }),
    readinessItem({
      id: 'idempotency-required',
      area: 'idempotency',
      title: 'ทุก request ต้องมี idempotency key',
      detail: 'retry ด้วย key เดิมต้องไม่สร้างแถวซ้ำ และต้องคืนผลเดิมหรือ noop อย่างปลอดภัย',
      status: 'pass',
      evidence: 'GuestSyncIdempotencyKey และ staging test plan',
      nextAction: 'เก็บ sync run ต่อ userId + idempotencyKey ฝั่ง server เมื่อเริ่ม implement จริง',
    }),
    readinessItem({
      id: 'merge-rules-defined',
      area: 'merge_rules',
      title: 'กำหนด merge rules จาก Guest Memory แล้ว',
      detail: 'saved items ใช้ itemType + itemId, likes ใช้ OR wins, followed topics รวมตาม topic id, My Farm เก็บทั้งสองฝั่งเมื่อ local id ไม่ซ้ำ',
      status: 'pass',
      evidence: 'src/services/backend/guest-sync-payload-builder.ts และ docs/GUEST_SYNC_EDGE_FUNCTION_CONTRACT.md',
      nextAction: 'เขียน unit/integration tests ฝั่ง Edge Function เมื่อ implement จริง',
    }),
    readinessItem({
      id: 'consent-validation-required',
      area: 'consent',
      title: 'ต้องตรวจ consent ก่อนเขียน cloud',
      detail: 'saved/farm/AI history ต้องถูกส่งตาม consent เท่านั้น และ AI history เป็น optional consent',
      status: 'pass',
      evidence: 'GuestSyncConsentOptions และ /app/auth/sync-preview',
      nextAction: 'บันทึก consent snapshot ใน sync audit log ฝั่ง server',
    }),
    readinessItem({
      id: 'rollback-manual-plan',
      area: 'rollback',
      title: 'ต้องมี rollback/manual cleanup plan',
      detail: 'หาก partial success ต้องมี sync run id, per-section counts, audit log, และขั้นตอน cleanup เฉพาะ staging',
      status: 'warn',
      evidence: 'docs/GUEST_SYNC_STAGING_TEST_PLAN.md',
      nextAction: 'สร้าง admin/manual cleanup checklist ก่อนเปิด sync กับข้อมูลจริง',
    }),
    readinessItem({
      id: 'guest-sync-edge-flags-closed',
      area: 'feature_flags',
      title: 'Guest Sync Edge flags ยังปิดตามค่าเริ่มต้น',
      detail: `VITE_ENABLE_GUEST_SYNC_EDGE=${publicEnv.enableGuestSyncEdge}, VITE_GUEST_SYNC_EDGE_MODE=${publicEnv.guestSyncEdgeMode}, cloudSync=${publicEnv.enableCloudSync}`,
      status: edgeFlagClosed ? 'pass' : 'warn',
      evidence: '.env.example และ src/config/env.ts',
      nextAction: edgeFlagClosed
        ? 'คงค่า disabled จนกว่าจะมี staging test window'
        : 'ตรวจว่าการเปิด flag เป็น staging ที่ควบคุม ไม่ใช่ production',
    }),
    readinessItem({
      id: 'schema-rls-manual-only',
      area: 'schema_rls',
      title: 'Schema/RLS ยังต้อง verify ด้วยมือบน staging',
      detail: `${sqlDraft.expectedTables.length} expected tables และ ${sqlDraft.expectedPolicies.length} expected RLS policies ถูกระบุใน pack แล้ว แต่ยังไม่ได้รัน SQL จริง`,
      status: supabaseConfig.hasRequiredEnv ? 'warn' : 'pass',
      evidence: 'docs/SUPABASE_MANUAL_VERIFICATION_PACK.md และ /app/supabase-sql-checklist',
      nextAction: 'รัน SQL/RLS บน staging ด้วยมือและตรวจ owner policies ก่อน sync จริง',
    }),
    readinessItem({
      id: 'production-sync-blocked',
      area: 'production_blockers',
      title: 'Production Guest Sync ยังถูกบล็อก',
      detail: 'ยังไม่มี deployed Edge Function, real auth session test, RLS owner verification, rate limit, audit log, rollback drill หรือ cloud sync flag',
      status: 'block',
      evidence: 'M29 scope',
      nextAction: 'ทำ controlled staging implementation milestone ก่อนพิจารณา production',
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
    endpointName: guestSyncEdgeEndpointName,
    method: 'POST',
    flags: {
      enableSupabase: publicEnv.enableSupabase,
      enableAuth: publicEnv.enableAuth,
      enableCloudSync: publicEnv.enableCloudSync,
      enableGuestSyncBackend: publicEnv.enableGuestSyncBackend,
      enableGuestSyncEdge: publicEnv.enableGuestSyncEdge,
      guestSyncMode: publicEnv.guestSyncMode,
      guestSyncEdgeMode: publicEnv.guestSyncEdgeMode,
    },
    idempotencyPreview: createGuestSyncIdempotencyKeyPreview(),
    requestShape: {
      endpointVersion: '2026-05-m29',
      endpointName: guestSyncEdgeEndpointName,
      method: 'POST',
    },
    notices: [
      'ยังไม่ได้ deploy Edge Function จริง',
      'ยังไม่เรียก endpoint จริง',
      'ยังไม่เปิด cloud sync',
      'ยังไม่เปิด auth จริง',
      'Local Guest Memory ยังเป็น source of truth และไม่ถูกลบ',
      'service-role key ต้องอยู่เฉพาะใน Supabase Edge Function เท่านั้น',
      `M16 adapter ปัจจุบัน: ${guestSyncStatus.modeLabel} · network=false`,
    ],
    items,
    passedItems,
    warningItems,
    blockerItems,
    stagingTestChecklist: [
      'ยืนยันว่า Supabase project เป็น staging ไม่ใช่ production',
      'รัน SQL/RLS staging และ verify owner policies แล้ว',
      'เปิด phone OTP staging test และได้ Supabase user session จริงแล้ว',
      'deploy Edge Function guest-memory-sync พร้อม service-role secret เฉพาะฝั่ง server',
      'ทดสอบ saved items only',
      'ทดสอบ saved items + My Farm',
      'ทดสอบ AI history not consented',
      'ทดสอบ duplicate saved item merge',
      'ทดสอบ retry ด้วย idempotency key เดิม',
      'ทดสอบ auth missing และ invalid payload rejection',
      'ตรวจ local Guest Memory ว่ายังอยู่ครบหลัง success/failure',
    ],
    productionBlockers: [
      'ยังไม่มี deployed Edge Function',
      'ยังไม่มี real Supabase Auth session ownership test',
      'ยังไม่ได้เปิด cloud sync และยังไม่ควรเปิด',
      'ยังไม่มี rate limit / abuse monitoring',
      'ยังไม่มี audit log จริงสำหรับ sync events',
      'ยังไม่มี rollback drill หลัง partial success',
      'ยังไม่ผ่าน staging-to-production promotion checklist',
    ],
    securityBoundaries: [
      'Browser ส่งได้เฉพาะ anon-authenticated request พร้อม user session',
      'service-role key ใช้ได้เฉพาะใน Edge Function หรือ backend secret store',
      'Edge Function ต้องตรวจ auth.uid(), consent, payload version, record ownership, และ idempotency key',
      'RLS ยังคงเป็น deny-by-default สำหรับ browser writes',
      'Frontend ไม่มี endpoint URL จริงและไม่มี network call ใน M29',
    ],
  };
}
