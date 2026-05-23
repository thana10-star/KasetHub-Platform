import { createClient } from '@supabase/supabase-js';
import { publicEnv } from '@/config/env';
import { checkSupabaseConfig } from '@/services/supabase/supabase-config-check';
import type {
  SupabaseConnectionDryRunCode,
  SupabaseConnectionDryRunResult,
  SupabaseConnectionHealth,
  SupabasePublicReadProbeResult,
} from '@/services/supabase/supabase-connection.types';

const publicProbeTable = 'public_readiness_checks';

function looksLikeServiceRoleKey(value: string) {
  return value.toLowerCase().includes('service_role');
}

function looksLikePlaceholder(value: string) {
  return /your_|replace_|placeholder|example/i.test(value);
}

function createCode(config = checkSupabaseConfig()): SupabaseConnectionDryRunCode {
  if (looksLikeServiceRoleKey(publicEnv.supabaseAnonKey)) {
    return 'blocked_service_role_like_key';
  }

  if (!publicEnv.enableSupabase) {
    return 'local_only_supabase_disabled';
  }

  if (!config.hasRequiredEnv) {
    return 'local_only_env_missing';
  }

  if (!config.urlLooksValid || !config.anonKeyLooksUsable) {
    return 'blocked_invalid_env';
  }

  if (publicEnv.enableSupabaseDryRunNetworkCheck) {
    return 'network_probe_ready';
  }

  return 'client_ready_no_network';
}

function healthFromCode(code: SupabaseConnectionDryRunCode): SupabaseConnectionHealth {
  if (code === 'blocked_invalid_env' || code === 'blocked_service_role_like_key') {
    return 'blocked';
  }

  if (code === 'network_probe_ready') {
    return 'ready_for_staging_check';
  }

  if (code === 'client_ready_no_network') {
    return 'warning';
  }

  return 'safe_local';
}

function labelFromCode(code: SupabaseConnectionDryRunCode) {
  const labels: Record<SupabaseConnectionDryRunCode, string> = {
    local_only_supabase_disabled: 'โหมด local-only',
    local_only_env_missing: 'รอ staging ENV',
    blocked_service_role_like_key: 'หยุดก่อน: key ไม่ปลอดภัย',
    blocked_invalid_env: 'ตรวจค่า ENV ก่อน',
    client_ready_no_network: 'client พร้อมแบบไม่เรียก network',
    network_probe_ready: 'พร้อมรัน public-read probe แบบจำกัด',
  };

  return labels[code];
}

function descriptionFromCode(code: SupabaseConnectionDryRunCode) {
  const descriptions: Record<SupabaseConnectionDryRunCode, string> = {
    local_only_supabase_disabled:
      'VITE_ENABLE_SUPABASE=false จึงไม่สร้าง client และไม่เชื่อมต่อ Supabase จริง แอปยังใช้ Guest Memory ได้ตามปกติ',
    local_only_env_missing:
      'เปิด Supabase flag แล้วแต่ยังไม่มี URL หรือ anon key ครบ ระบบจึงยังไม่สร้าง client และไม่เรียก network',
    blocked_service_role_like_key:
      'พบค่า anon key ที่มีลักษณะ service_role ต้องลบออกจาก frontend ทันทีและใช้เฉพาะ anon public key',
    blocked_invalid_env:
      'พบ URL หรือ anon key ที่ยังไม่ผ่านเงื่อนไข client-safe จึงไม่ควรทดสอบต่อ',
    client_ready_no_network:
      'Supabase flag และ anon config พร้อมสำหรับ staging dry run แต่ network check ยังปิดอยู่ จึงไม่มีการ query ใด ๆ',
    network_probe_ready:
      'ผ่าน guard ทุกชั้นและเปิด network check แล้ว ระบบจะอนุญาตเฉพาะ public/read-only probe ที่ไม่เขียนข้อมูล',
  };

  return descriptions[code];
}

function buildWarnings(code: SupabaseConnectionDryRunCode, config = checkSupabaseConfig()) {
  const warnings = [...config.warnings];

  if (!publicEnv.enableSupabaseDryRunNetworkCheck) {
    warnings.push('network dry run ปิดอยู่ตามค่าเริ่มต้น จึงไม่มีการเรียก Supabase');
  }

  if (publicEnv.enableAuth) {
    warnings.push('VITE_ENABLE_AUTH=true แต่ M26 ยังไม่เปิด real auth');
  }

  if (publicEnv.enableCloudSync) {
    warnings.push('VITE_ENABLE_CLOUD_SYNC=true แต่ M26 ยังไม่เปิด cloud sync');
  }

  if (code === 'network_probe_ready') {
    warnings.push('network probe ต้องอ่านเฉพาะ public/read-only target และต้องไม่ถือว่า schema missing เป็น app failure');
  }

  return warnings;
}

function buildNextSteps(code: SupabaseConnectionDryRunCode) {
  if (code === 'local_only_supabase_disabled') {
    return [
      'สร้าง Supabase staging project เมื่อพร้อม',
      'ใส่ Project URL และ anon key เฉพาะใน .env.local หรือ staging env',
      'เปิด VITE_ENABLE_SUPABASE=true โดยยังปิด auth และ cloud sync',
    ];
  }

  if (code === 'local_only_env_missing') {
    return ['เติม VITE_SUPABASE_URL และ VITE_SUPABASE_ANON_KEY ของ staging เท่านั้น', 'ตรวจว่าไม่มี service-role key ใน frontend'];
  }

  if (code === 'client_ready_no_network') {
    return [
      'ตรวจ /app/supabase-readiness และ /app/supabase-connection',
      'เปิด network probe เฉพาะเมื่อต้องการทดสอบ public/read-only target',
      'รัน SQL/RLS ด้วยมือบน staging ก่อนทดสอบ schema จริง',
    ];
  }

  if (code === 'network_probe_ready') {
    return [
      'ยืนยันว่า target เป็น public/read-only เท่านั้น',
      'ถ้า schema ยังไม่ applied ให้ถือเป็นสถานะ planning ไม่ใช่ความล้มเหลวของแอป',
      'ปิด flag หลังทดสอบเสร็จ',
    ];
  }

  return ['หยุดใช้ค่าปัจจุบัน', 'ลบ secret ที่ไม่ปลอดภัยออกจาก frontend', 'เริ่มใหม่ด้วย anon public key ของ staging เท่านั้น'];
}

export function runSupabaseConnectionDryRun(): SupabaseConnectionDryRunResult {
  const config = checkSupabaseConfig();
  const code = createCode(config);
  const health = healthFromCode(code);
  const allowedByGuards =
    code === 'network_probe_ready' &&
    publicEnv.enableSupabase &&
    publicEnv.enableSupabaseDryRunNetworkCheck &&
    config.canCreateClient;

  return {
    code,
    health,
    label: labelFromCode(code),
    description: descriptionFromCode(code),
    env: {
      hasUrl: config.hasUrl,
      hasAnonKey: config.hasAnonKey,
      hasRequiredEnv: config.hasRequiredEnv,
      urlLooksValid: config.urlLooksValid,
      anonKeyLooksUsable: config.anonKeyLooksUsable,
      anonKeyLooksPlaceholder: looksLikePlaceholder(publicEnv.supabaseAnonKey),
      serviceRoleLikeKeyDetected: looksLikeServiceRoleKey(publicEnv.supabaseAnonKey),
    },
    flags: {
      enableSupabase: publicEnv.enableSupabase,
      enableAuth: publicEnv.enableAuth,
      enableCloudSync: publicEnv.enableCloudSync,
      enableDryRunNetworkCheck: publicEnv.enableSupabaseDryRunNetworkCheck,
    },
    canCreateClient: config.canCreateClient,
    networkProbe: {
      enabled: publicEnv.enableSupabaseDryRunNetworkCheck,
      allowedByGuards,
      attempted: false,
      targetLabel: `${publicProbeTable} public/read-only table`,
      schemaStatus: 'not_checked',
      message: allowedByGuards
        ? 'network probe เปิดอยู่และผ่าน guard แล้ว แต่จะอ่านเฉพาะ public/read-only target'
        : 'network probe ยังไม่ถูกรัน',
    },
    noWriteGuarantees: [
      'ไม่ insert/update/delete/upsert',
      'ไม่ query private หรือ user-owned tables',
      'ไม่ต้องใช้ auth session',
      'ไม่ upload files',
      'ไม่ใช้ service-role key',
      'ไม่เปิด cloud sync',
    ],
    warnings: buildWarnings(code, config),
    nextSteps: buildNextSteps(code),
  };
}

export async function runSupabasePublicReadProbe(): Promise<SupabasePublicReadProbeResult> {
  const dryRun = runSupabaseConnectionDryRun();

  if (!dryRun.networkProbe.allowedByGuards) {
    return {
      attempted: false,
      schemaStatus: 'not_checked',
      message: 'ไม่ได้รัน network probe เพราะ guard ยังไม่ครบหรือ flag ปิดอยู่',
    };
  }

  const client = createClient(publicEnv.supabaseUrl, publicEnv.supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });

  const { error } = await client.from(publicProbeTable).select('id').limit(1);

  if (!error) {
    return {
      attempted: true,
      schemaStatus: 'public_probe_ok',
      message: 'อ่าน public/read-only probe สำเร็จโดยไม่มีการเขียนข้อมูล',
    };
  }

  const lowerMessage = error.message.toLowerCase();
  const schemaMissing =
    error.code === '42P01' ||
    error.code === 'PGRST205' ||
    lowerMessage.includes('could not find') ||
    lowerMessage.includes('does not exist') ||
    lowerMessage.includes('schema cache');

  return {
    attempted: true,
    schemaStatus: schemaMissing ? 'schema_not_applied_yet' : 'unknown_error',
    message: schemaMissing
      ? 'ยังไม่พบ public/read-only probe table: ถือว่า schema ยังไม่ applied ไม่ใช่ app failure'
      : 'network probe ล้มเหลวแบบไม่คาดคิด แต่ไม่มีการเขียนข้อมูล',
    errorCode: error.code,
  };
}
