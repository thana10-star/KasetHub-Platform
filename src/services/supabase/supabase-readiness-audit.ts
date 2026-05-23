import { publicEnv } from '@/config/env';
import { getFeatureFlagStatuses } from '@/config/feature-flags';
import { getAIProxyAdapterStatus } from '@/services/ai-proxy/ai-proxy-adapter';
import { getLineAuthAdapterStatus } from '@/services/auth/line-auth-adapter';
import { getPhoneAuthAdapterStatus } from '@/services/auth/phone-auth-adapter';
import { getGuestSyncAdapterStatus } from '@/services/backend/guest-sync-adapter';
import { runGuestSyncStagingReadiness } from '@/services/backend/guest-sync-staging-readiness';
import { checkSupabaseConfig } from '@/services/supabase/supabase-config-check';
import type {
  SupabaseProductionBlocker,
  SupabaseReadinessAction,
  SupabaseReadinessArea,
  SupabaseReadinessAreaSummary,
  SupabaseReadinessAudit,
  SupabaseReadinessItem,
  SupabaseReadinessLevel,
  SupabaseReadinessStatus,
} from '@/services/supabase/supabase-readiness.types';

export const supabaseReadinessAreaLabels: Record<SupabaseReadinessArea, string> = {
  env_readiness: 'ENV และ secrets',
  feature_flags: 'Feature flags',
  sql_migration_draft: 'SQL migration draft',
  rls_policy_draft: 'RLS policy draft',
  schema_docs: 'Schema docs',
  auth_boundary: 'Auth boundary',
  guest_sync_boundary: 'Guest sync boundary',
  storage_image_analysis: 'Storage และ image analysis',
  ai_proxy_backend: 'AI proxy backend',
  admin_role_planning: 'Admin role planning',
  crop_price_schema: 'Crop price schema',
  community_moderation_schema: 'Community moderation schema',
};

export const supabaseReadinessStatusLabels: Record<SupabaseReadinessStatus, string> = {
  pass: 'พร้อมตามแผน',
  warn: 'ต้องตรวจต่อ',
  block: 'ห้ามเปิดจริง',
};

function item(input: SupabaseReadinessItem): SupabaseReadinessItem {
  return input;
}

function hasServiceRoleLikeKey(value: string) {
  return value.toLowerCase().includes('service_role');
}

function statusFromCounts(blockers: number, warnings: number): SupabaseReadinessStatus {
  if (blockers > 0) {
    return 'block';
  }

  if (warnings > 0) {
    return 'warn';
  }

  return 'pass';
}

function levelFromScore(score: number, blockers: number): SupabaseReadinessLevel {
  if (blockers > 0 || score < 55) {
    return 'not_ready';
  }

  if (score < 82) {
    return 'staging_planning';
  }

  return 'limited_staging_ready';
}

function levelLabel(level: SupabaseReadinessLevel) {
  const labels: Record<SupabaseReadinessLevel, string> = {
    not_ready: 'ยังไม่พร้อมเปิด staging',
    staging_planning: 'พร้อมวางแผน staging',
    limited_staging_ready: 'พร้อมทดสอบ staging แบบจำกัด',
  };

  return labels[level];
}

function summarizeAreas(items: SupabaseReadinessItem[]): SupabaseReadinessAreaSummary[] {
  return (Object.keys(supabaseReadinessAreaLabels) as SupabaseReadinessArea[]).map((area) => {
    const areaItems = items.filter((entry) => entry.area === area);
    const passed = areaItems.filter((entry) => entry.status === 'pass').length;
    const warnings = areaItems.filter((entry) => entry.status === 'warn').length;
    const blockers = areaItems.filter((entry) => entry.status === 'block').length;

    return {
      area,
      label: supabaseReadinessAreaLabels[area],
      total: areaItems.length,
      passed,
      warnings,
      blockers,
      status: statusFromCounts(blockers, warnings),
    };
  });
}

function scoreItems(items: SupabaseReadinessItem[]) {
  if (items.length === 0) {
    return 0;
  }

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

function buildRecommendedNextActions(): SupabaseReadinessAction[] {
  return [
    {
      id: 'create-staging-project',
      priority: 'now',
      title: 'สร้าง Supabase staging project',
      detail: 'คัดลอกเฉพาะ Project URL และ anon key ไปใส่ .env.local ในเครื่อง developer เท่านั้น',
    },
    {
      id: 'keep-flags-closed',
      priority: 'now',
      title: 'เปิด flag ทีละชั้น',
      detail: 'เริ่มจาก VITE_ENABLE_SUPABASE=true แต่ให้ VITE_ENABLE_AUTH=false และ VITE_ENABLE_CLOUD_SYNC=false ก่อน',
    },
    {
      id: 'manual-sql-staging',
      priority: 'next',
      title: 'รัน SQL migration และ RLS บน staging ด้วยมือ',
      detail: 'ตรวจตาราง public read และ user-owned table หลังเปิด auth ในรอบถัดไป ห้ามรันบน production ก่อนผ่าน staging',
    },
    {
      id: 'verify-service-role-boundary',
      priority: 'next',
      title: 'ยืนยัน service-role boundary',
      detail: 'service-role key ต้องอยู่เฉพาะ Edge Function/backend/admin secret store ไม่อยู่ใน Vite, browser, หรือ Cloudflare public env',
    },
    {
      id: 'promotion-checklist',
      priority: 'later',
      title: 'ทำ checklist ก่อนเลื่อนจาก staging ไป production',
      detail: 'รวม backup, rollback, RLS test, cost guard, rate limit, admin role, และ audit log ก่อนเปิดข้อมูลจริง',
    },
  ];
}

function buildProductionBlockers(): SupabaseProductionBlocker[] {
  return [
    {
      id: 'no-production-migration-run',
      area: 'sql_migration_draft',
      title: 'ยังไม่ได้รัน migration บน staging',
      detail: 'ต้องรันและตรวจ schema บน staging ก่อนแตะ production',
    },
    {
      id: 'rls-not-tested-with-real-auth',
      area: 'rls_policy_draft',
      title: 'ยังไม่ได้ทดสอบ RLS กับ session จริง',
      detail: 'ต้องทดสอบ public read, owner write, admin review, และ deny-by-default ด้วย user จริงบน staging',
    },
    {
      id: 'auth-disabled',
      area: 'auth_boundary',
      title: 'ยังไม่เปิด real auth',
      detail: 'Phone OTP, LINE, และ cloud sync ยังเป็น boundary/mock จึงยังห้ามรับข้อมูลผู้ใช้จริง',
    },
    {
      id: 'service-role-server-only',
      area: 'env_readiness',
      title: 'ยังไม่มี service-role deployment boundary',
      detail: 'งานที่ต้องใช้ service-role ต้องไป Edge Function/backend เท่านั้น ไม่ใส่ frontend เด็ดขาด',
    },
    {
      id: 'admin-roles-not-enforced',
      area: 'admin_role_planning',
      title: 'Admin role ยังเป็นแผน',
      detail: 'M24 มี dashboard mock แต่ยังไม่มี auth, role assignment, permission enforcement, หรือ audit log จริง',
    },
  ];
}

export function runSupabaseReadinessAudit(): SupabaseReadinessAudit {
  const config = checkSupabaseConfig();
  const flags = getFeatureFlagStatuses(config);
  const guestSyncStatus = getGuestSyncAdapterStatus();
  const guestSyncEdge = runGuestSyncStagingReadiness();
  const phoneStatus = getPhoneAuthAdapterStatus();
  const lineStatus = getLineAuthAdapterStatus();
  const aiProxyStatus = getAIProxyAdapterStatus();
  const serviceRoleDetected = hasServiceRoleLikeKey(publicEnv.supabaseAnonKey);

  const items: SupabaseReadinessItem[] = [
    item({
      id: 'env-no-service-role',
      area: 'env_readiness',
      title: 'Frontend ไม่มี service-role key',
      detail: serviceRoleDetected
        ? 'พบลักษณะ service_role ใน VITE_SUPABASE_ANON_KEY ต้องหยุดก่อนใช้งาน'
        : 'ตรวจค่าที่ frontend อ่านได้แล้วไม่พบ service-role pattern',
      status: serviceRoleDetected ? 'block' : 'pass',
      evidence: 'src/services/supabase/supabase-config-check.ts',
      nextAction: serviceRoleDetected ? 'ลบ key ออกทันทีและใช้ anon key เท่านั้น' : undefined,
    }),
    item({
      id: 'env-staging-placeholders',
      area: 'env_readiness',
      title: 'ยังไม่ใส่ Supabase staging ENV จริง',
      detail: config.hasRequiredEnv
        ? 'พบ URL และ anon key สำหรับโหมดทดสอบแล้ว แต่ยังต้องตรวจว่าเป็น staging project'
        : 'ค่าเริ่มต้นยังไม่เชื่อมต่อ Supabase จริง เหมาะสำหรับ milestone นี้',
      status: config.hasRequiredEnv ? 'warn' : 'pass',
      evidence: '.env.example และ src/config/env.ts',
      nextAction: config.hasRequiredEnv ? 'ยืนยันว่า ENV เป็น staging ไม่ใช่ production' : 'สร้าง .env.local ในเครื่องเมื่อเริ่ม staging เท่านั้น',
    }),
    item({
      id: 'feature-flags-safe-default',
      area: 'feature_flags',
      title: 'Feature flags ปิด auth/cloud sync เป็นค่าเริ่มต้น',
      detail: flags
        .map((flag) => `${flag.label}: ${flag.requestedEnabled ? 'requested' : 'off'} / ${flag.isActive ? 'active' : 'inactive'}`)
        .join(' | '),
      status: publicEnv.enableAuth || publicEnv.enableCloudSync ? 'warn' : 'pass',
      evidence: 'VITE_ENABLE_SUPABASE, VITE_ENABLE_AUTH, VITE_ENABLE_CLOUD_SYNC',
      nextAction: publicEnv.enableAuth || publicEnv.enableCloudSync ? 'ปิด auth/cloud sync จนกว่า RLS ผ่าน staging' : undefined,
    }),
    item({
      id: 'sql-migration-draft-present',
      area: 'sql_migration_draft',
      title: 'มี SQL migration draft',
      detail: 'มีร่าง migration หลักสำหรับ core schema แล้ว แต่ milestone นี้ไม่ได้รัน migration',
      status: 'pass',
      evidence: 'supabase/migrations/0001_kasethub_core_schema.sql',
      nextAction: 'รันด้วยมือบน Supabase staging หลัง backup/rollback plan พร้อม',
    }),
    item({
      id: 'rls-policy-draft-present',
      area: 'rls_policy_draft',
      title: 'มี RLS policy draft',
      detail: 'มีร่าง policy สำหรับ review แต่ยังไม่ได้ทดสอบกับ user session จริง',
      status: 'warn',
      evidence: 'supabase/policies/0001_kasethub_rls_policies.sql',
      nextAction: 'ทดสอบ deny-by-default, public read, owner write, และ admin review บน staging',
    }),
    item({
      id: 'schema-docs-present',
      area: 'schema_docs',
      title: 'Schema docs ครอบคลุมโมดูลหลัก',
      detail: 'มี schema draft, type mapping, migration checklist, และ staging readiness docs สำหรับตรวจข้ามทีม',
      status: 'pass',
      evidence: 'docs/SUPABASE_SCHEMA_DRAFT.md, docs/SUPABASE_TYPE_MAPPING.md, docs/SUPABASE_MIGRATION_CHECKLIST.md',
    }),
    item({
      id: 'auth-boundary-local',
      area: 'auth_boundary',
      title: 'Auth ยังเป็น local/mock boundary',
      detail: `Phone: ${phoneStatus.modeLabel}, LINE: ${lineStatus.modeLabel}, network=false`,
      status: phoneStatus.networkCallsEnabled || lineStatus.networkCallsEnabled ? 'block' : 'pass',
      evidence: 'src/services/auth/phone-auth-adapter.ts และ src/services/auth/line-auth-adapter.ts',
      nextAction: 'เปิด real auth เฉพาะหลัง staging RLS ผ่านแล้ว',
    }),
    item({
      id: 'guest-sync-boundary-local',
      area: 'guest_sync_boundary',
      title: 'Guest Sync ยังไม่เขียน backend',
      detail: `${guestSyncStatus.modeLabel}: ${guestSyncStatus.readinessLabel}`,
      status: guestSyncStatus.networkCallsEnabled || guestSyncStatus.serviceRoleAvailableInFrontend ? 'block' : 'pass',
      evidence: 'src/services/backend/guest-sync-adapter.ts',
      nextAction: 'คง dry run/local fixture จนกว่า auth และ RLS พร้อม',
    }),
    item({
      id: 'guest-sync-edge-contract-ready',
      area: 'guest_sync_boundary',
      title: 'Guest Sync Edge Function ยังเป็น contract/staging plan',
      detail: `${guestSyncEdge.endpointName}: ${guestSyncEdge.levelLabel} · edge flag ${guestSyncEdge.flags.enableGuestSyncEdge ? 'เปิด' : 'ปิด'}`,
      status: guestSyncEdge.flags.enableGuestSyncEdge || publicEnv.enableCloudSync ? 'warn' : 'pass',
      evidence: 'src/services/backend/guest-sync-staging-readiness.ts และ /app/guest-sync-edge',
      nextAction: 'deploy และเรียก endpoint เฉพาะหลัง auth session, RLS, idempotency, audit log, และ rollback test ผ่าน staging',
    }),
    item({
      id: 'storage-image-analysis-ready-to-plan',
      area: 'storage_image_analysis',
      title: 'Storage/image analysis ยังเป็นแผน staging',
      detail: 'มี schema doc สำหรับภาพวิเคราะห์โรคพืช แต่ยังไม่มี bucket จริงหรือ upload จริง',
      status: 'warn',
      evidence: 'docs/SUPABASE_STORAGE_IMAGE_ANALYSIS_SCHEMA.md',
      nextAction: 'สร้าง bucket policy บน staging และทดสอบ metadata-only ก่อนเปิด upload จริง',
    }),
    item({
      id: 'ai-proxy-server-boundary',
      area: 'ai_proxy_backend',
      title: 'AI proxy ยังไม่เรียก provider จริง',
      detail: `${aiProxyStatus.modeLabel}: ${aiProxyStatus.readinessLabel}, network=false, provider keys frontend=false`,
      status: aiProxyStatus.networkCallsEnabled || aiProxyStatus.providerKeysAvailableInFrontend ? 'block' : 'pass',
      evidence: 'src/services/ai-proxy/ai-proxy-adapter.ts',
      nextAction: 'เมื่อเปิด backend จริง ให้ใช้ server-side provider key และบันทึก safety logs หลัง consent',
    }),
    item({
      id: 'admin-role-plan-ready',
      area: 'admin_role_planning',
      title: 'Admin role planning มีแล้ว',
      detail: 'M24 เตรียม owner/admin/editor/moderator/expert/support roles แบบ mock/local',
      status: 'warn',
      evidence: 'docs/ADMIN_ROLES_AND_PERMISSIONS_PLAN.md และ /app/admin',
      nextAction: 'สร้างตาราง role และ audit log บน staging ก่อนให้สิทธิ์จริง',
    }),
    item({
      id: 'crop-price-schema-planned',
      area: 'crop_price_schema',
      title: 'Crop price schema อยู่ใน draft',
      detail: 'มี crop_price_sources, crop_price_snapshots, import jobs, review tasks และ disclaimer rules ใน docs',
      status: 'warn',
      evidence: 'docs/CROP_PRICE_DATA_SOURCE_FOUNDATION.md และ docs/SUPABASE_SCHEMA_DRAFT.md',
      nextAction: 'ทดสอบ import/review workflow บน staging ด้วย sample rows เท่านั้น',
    }),
    item({
      id: 'community-moderation-schema-planned',
      area: 'community_moderation_schema',
      title: 'Community moderation schema อยู่ใน draft',
      detail: 'มี community_reports, hidden_content, moderation_actions, moderator_queue, และ rules planning',
      status: 'warn',
      evidence: 'docs/COMMUNITY_MODERATION_FOUNDATION.md และ docs/SUPABASE_TYPE_MAPPING.md',
      nextAction: 'ตรวจ RLS สำหรับ report creation, moderator-only queue, และ audit history',
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
    notices: [
      'ยังไม่ได้เชื่อมต่อ Supabase จริง',
      'ห้ามใส่ service-role key ใน frontend',
      'ต้องทดสอบบน staging ก่อน production',
    ],
    items,
    passedItems,
    warningItems,
    blockerItems,
    areaSummaries: summarizeAreas(items),
    recommendedNextActions: buildRecommendedNextActions(),
    productionBlockers: buildProductionBlockers(),
  };
}
