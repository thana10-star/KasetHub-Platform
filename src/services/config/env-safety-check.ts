import { publicEnv, type PublicRuntimeEnv } from '@/config/env';
import type {
  EnvSafetyCheckResult,
  EnvSafetyItem,
  EnvSafetySeverity,
  EnvSafetyStatus,
} from '@/services/config/env-safety.types';

function looksLikePlaceholder(value: string) {
  return /your-|your_|replace|placeholder|example|demo/i.test(value);
}

function looksLikeSupabaseUrl(value: string) {
  if (!value) {
    return false;
  }

  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname.endsWith('.supabase.co');
  } catch {
    return false;
  }
}

function decodeJwtPayload(value: string) {
  const [, payload] = value.split('.');

  if (!payload) {
    return '';
  }

  try {
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    return atob(padded);
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

function looksLikeAnonKey(value: string) {
  if (!value || looksLikePlaceholder(value) || looksLikeServiceRoleKey(value)) {
    return false;
  }

  const jwtLike = /^eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+$/.test(value);
  return jwtLike || value.length > 80;
}

function maskValue(value: string, visiblePrefix = 8, visibleSuffix = 4) {
  if (!value) {
    return 'ไม่ได้ตั้งค่า';
  }

  if (value.length <= visiblePrefix + visibleSuffix + 3) {
    return `${value.slice(0, 2)}...`;
  }

  return `${value.slice(0, visiblePrefix)}...${value.slice(-visibleSuffix)}`;
}

function maskUrl(value: string) {
  if (!value) {
    return 'ไม่ได้ตั้งค่า';
  }

  try {
    const url = new URL(value);
    return `${url.protocol}//${url.hostname}`;
  } catch {
    return maskValue(value, 10, 4);
  }
}

function item(
  id: string,
  severity: EnvSafetySeverity,
  title: string,
  detail: string,
  recommendation: string,
): EnvSafetyItem {
  return { id, severity, title, detail, recommendation };
}

function statusFrom(blockers: EnvSafetyItem[], warnings: EnvSafetyItem[], env: PublicRuntimeEnv): EnvSafetyStatus {
  if (blockers.length > 0) {
    return 'blocked';
  }

  if (warnings.length > 0) {
    return 'needs_attention';
  }

  if (env.enableSupabase) {
    return 'ready_for_local_staging_env';
  }

  return 'mock_only_safe';
}

function labelFromStatus(status: EnvSafetyStatus) {
  const labels: Record<EnvSafetyStatus, string> = {
    mock_only_safe: 'ปลอดภัยแบบ mock-only',
    ready_for_local_staging_env: 'พร้อมตรวจ staging env แบบไม่เรียก network',
    needs_attention: 'ต้องตรวจค่า env',
    blocked: 'หยุดก่อน: env ไม่ปลอดภัย',
  };

  return labels[status];
}

export function runEnvSafetyCheck(env: PublicRuntimeEnv = publicEnv): EnvSafetyCheckResult {
  const blockers: EnvSafetyItem[] = [];
  const warnings: EnvSafetyItem[] = [];
  const readyItems: EnvSafetyItem[] = [];
  const notes: EnvSafetyItem[] = [];
  const hasSupabaseUrl = Boolean(env.supabaseUrl);
  const hasSupabaseAnonKey = Boolean(env.supabaseAnonKey);
  const supabaseUrlLooksPlaceholder = hasSupabaseUrl && looksLikePlaceholder(env.supabaseUrl);
  const supabaseAnonKeyLooksPlaceholder = hasSupabaseAnonKey && looksLikePlaceholder(env.supabaseAnonKey);
  const supabaseUrlLooksValid = hasSupabaseUrl && looksLikeSupabaseUrl(env.supabaseUrl);
  const anonKeyLooksFormatish = hasSupabaseAnonKey && looksLikeAnonKey(env.supabaseAnonKey);
  const serviceRoleLikeKeyDetected = hasSupabaseAnonKey && looksLikeServiceRoleKey(env.supabaseAnonKey);

  if (!hasSupabaseUrl || !hasSupabaseAnonKey) {
    notes.push(
      item(
        'missing-supabase-env',
        'info',
        'ยังไม่มี Supabase env',
        'นี่เป็นสถานะที่ปลอดภัยสำหรับ mock-only และ app ต้องยังเปิดได้โดยไม่มี .env.local',
        'เมื่อพร้อมทำ staging ให้ใส่ URL และ anon key เฉพาะใน .env.local บนเครื่องนี้เท่านั้น',
      ),
    );
  }

  if (env.enableSupabase && (!hasSupabaseUrl || !hasSupabaseAnonKey)) {
    blockers.push(
      item(
        'supabase-enabled-without-env',
        'blocker',
        'เปิด Supabase แต่ค่า env ไม่ครบ',
        'VITE_ENABLE_SUPABASE=true ต้องมี VITE_SUPABASE_URL และ VITE_SUPABASE_ANON_KEY ของ staging',
        'เติมค่าลง .env.local หรือกลับเป็น VITE_ENABLE_SUPABASE=false',
      ),
    );
  }

  if (hasSupabaseUrl && !supabaseUrlLooksValid) {
    warnings.push(
      item(
        'supabase-url-format',
        'warning',
        'รูปแบบ Supabase URL ยังไม่น่าใช่ staging project',
        'URL ที่ปลอดภัยควรเป็น https://<project-ref>.supabase.co ของ staging',
        'ตรวจว่าไม่ได้ใช้ production project และไม่ได้ใส่ placeholder',
      ),
    );
  }

  if (supabaseUrlLooksPlaceholder || supabaseAnonKeyLooksPlaceholder) {
    warnings.push(
      item(
        'placeholder-env',
        'warning',
        'พบค่า placeholder',
        'ค่า placeholder เหมาะกับเอกสารหรือ .env.example แต่ไม่ใช่ .env.local สำหรับ staging จริง',
        'ใช้ Project URL และ anon key ของ staging เท่านั้นเมื่อพร้อม',
      ),
    );
  }

  if (serviceRoleLikeKeyDetected) {
    blockers.push(
      item(
        'service-role-like-key',
        'blocker',
        'พบ key ที่คล้าย service-role',
        'ห้ามใส่ service-role key ใน frontend, Vite env, README, docs, หรือ Cloudflare Pages public env',
        'ลบค่านี้ทันที ใช้ anon public key เท่านั้น และ rotate key หากสงสัยว่าเคยเผยแพร่',
      ),
    );
  }

  if (hasSupabaseAnonKey && !anonKeyLooksFormatish && !serviceRoleLikeKeyDetected) {
    warnings.push(
      item(
        'anon-key-format',
        'warning',
        'anon key ยังไม่ผ่านรูปแบบเบื้องต้น',
        'Supabase anon key มักเป็น JWT-like string หรือ string ยาวพอสมควร',
        'ตรวจว่าค่านี้เป็น anon public key ของ staging ไม่ใช่ placeholder',
      ),
    );
  }

  if (env.enableAuth) {
    blockers.push(
      item(
        'auth-enabled',
        'blocker',
        'เปิด auth เร็วเกินไป',
        'M39 ยังไม่เปิด Supabase Auth หรือ phone OTP จริง',
        'ตั้ง VITE_ENABLE_AUTH=false และทำ M40/M41 auth staging checklist ก่อน',
      ),
    );
  }

  if (env.enableCloudSync || env.enableGuestSyncBackend || env.enableGuestSyncEdge) {
    blockers.push(
      item(
        'cloud-sync-enabled',
        'blocker',
        'เปิด cloud sync หรือ Guest Sync backend เร็วเกินไป',
        'M39 ยังไม่เปิด cloud sync, Edge Function call, หรือ backend writes',
        'ตั้ง sync flags ทั้งหมดเป็น false/disabled จนกว่าจะมี session ownership และ RLS ผ่าน',
      ),
    );
  }

  if (env.enablePhoneAuth || env.enableLineAuth) {
    blockers.push(
      item(
        'real-auth-provider-enabled',
        'blocker',
        'เปิด auth provider จริงเร็วเกินไป',
        'M39 ยังไม่ส่ง OTP, LINE Login, หรือ OAuth จริง',
        'ตั้ง VITE_ENABLE_PHONE_AUTH=false และ VITE_ENABLE_LINE_AUTH=false',
      ),
    );
  }

  if (env.enableSupabaseDryRunNetworkCheck) {
    warnings.push(
      item(
        'network-check-enabled',
        'warning',
        'เปิด dry-run network check',
        'ค่าเริ่มต้นของ M39 ต้องปิด network check เพื่อให้ app รันได้โดยไม่เรียก Supabase',
        'ใช้ VITE_ENABLE_SUPABASE_DRY_RUN_NETWORK_CHECK=false จนกว่าจะตั้งใจทดสอบ public/read-only probe',
      ),
    );
  }

  if (env.enableSupabase && hasSupabaseUrl && hasSupabaseAnonKey && !serviceRoleLikeKeyDetected) {
    readyItems.push(
      item(
        'supabase-ready-no-network',
        'safe',
        'Supabase env พร้อมสำหรับ local staging readiness',
        'มี URL และ anon key พร้อม flag Supabase โดย network check ยังควรปิด',
        'เปิดดู /app/supabase-connection และตรวจว่า auth/cloud sync ยัง false',
      ),
    );
  }

  if (!env.enableAuth && !env.enableCloudSync && !env.enableGuestSyncBackend && !env.enableGuestSyncEdge) {
    readyItems.push(
      item(
        'dangerous-flags-disabled',
        'safe',
        'auth/cloud sync ยังปิดอยู่',
        'เหมาะกับ M39 เพราะยังไม่มี session ownership, RLS verification, หรือ backend write',
        'คงค่าเหล่านี้เป็น false จนถึง milestone ที่เกี่ยวข้อง',
      ),
    );
  }

  if (!env.enableSupabaseDryRunNetworkCheck) {
    readyItems.push(
      item(
        'network-check-disabled',
        'safe',
        'network check ปิดอยู่',
        'ค่าเริ่มต้นปลอดภัยและไม่เรียก Supabase',
        'เปิดเฉพาะเมื่อพร้อมทดสอบ public/read-only probe ในอนาคต',
      ),
    );
  }

  const status = statusFrom(blockers, warnings, env);

  return {
    status,
    statusLabel: labelFromStatus(status),
    summary:
      status === 'mock_only_safe'
        ? 'ยังเป็น mock-only/local และปลอดภัยสำหรับการรันโดยไม่มี .env.local'
        : status === 'ready_for_local_staging_env'
          ? 'พร้อมตรวจ staging env ในเครื่องแบบไม่เรียก network โดยค่าเริ่มต้น'
          : status === 'needs_attention'
            ? 'มีคำเตือนที่ควรตรวจ ก่อนใช้ staging env จริง'
            : 'มี blocker ด้าน env safety ต้องหยุดก่อน',
    values: {
      hasSupabaseUrl,
      hasSupabaseAnonKey,
      maskedSupabaseUrl: maskUrl(env.supabaseUrl),
      maskedAnonKey: maskValue(env.supabaseAnonKey),
      supabaseUrlLooksPlaceholder,
      supabaseAnonKeyLooksPlaceholder,
      supabaseUrlLooksValid,
      anonKeyLooksFormatish,
      serviceRoleLikeKeyDetected,
    },
    flags: {
      enableSupabase: env.enableSupabase,
      enableAuth: env.enableAuth,
      enableCloudSync: env.enableCloudSync,
      enableDryRunNetworkCheck: env.enableSupabaseDryRunNetworkCheck,
      enableGuestSyncBackend: env.enableGuestSyncBackend,
      enableGuestSyncEdge: env.enableGuestSyncEdge,
      enablePhoneAuth: env.enablePhoneAuth,
      enableLineAuth: env.enableLineAuth,
    },
    safeRecommendedValues: [
      'VITE_ENABLE_SUPABASE=true เมื่อตั้ง staging URL + anon key ใน .env.local แล้วเท่านั้น',
      'VITE_ENABLE_SUPABASE_DRY_RUN_NETWORK_CHECK=false',
      'VITE_ENABLE_AUTH=false',
      'VITE_ENABLE_CLOUD_SYNC=false',
      'VITE_ENABLE_GUEST_SYNC_BACKEND=false',
      'VITE_ENABLE_GUEST_SYNC_EDGE=false',
      'VITE_ENABLE_PHONE_AUTH=false',
      'VITE_ENABLE_LINE_AUTH=false',
    ],
    blockers,
    warnings,
    readyItems,
    notes,
  };
}
