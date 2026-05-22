import { getFeatureFlagStatuses, getRuntimeFeatureFlags } from '@/config/feature-flags';
import { publicEnv } from '@/config/env';
import { checkSupabaseConfig } from '@/services/supabase/supabase-config-check';

export type SupabaseStatusCode =
  | 'disabled_by_flag'
  | 'missing_env'
  | 'invalid_config'
  | 'configured_auth_disabled'
  | 'test_mode_ready';

export type SupabaseRuntimeStatus = {
  code: SupabaseStatusCode;
  label: string;
  description: string;
  isConfigured: boolean;
  canCreateClient: boolean;
  canUseAuth: boolean;
  canUseCloudSync: boolean;
  flags: ReturnType<typeof getFeatureFlagStatuses>;
  warnings: string[];
};

export function getSupabaseStatus(): SupabaseRuntimeStatus {
  const check = checkSupabaseConfig();
  const runtimeFlags = getRuntimeFeatureFlags(check);
  const flags = getFeatureFlagStatuses(check);

  if (!publicEnv.enableSupabase) {
    return {
      code: 'disabled_by_flag',
      label: 'ยังไม่ได้เชื่อมต่อ Supabase',
      description: 'Guest Memory ยังเป็นระบบหลัก และ feature flag ของ Supabase ปิดไว้ตามค่าเริ่มต้น',
      isConfigured: check.hasRequiredEnv,
      canCreateClient: false,
      canUseAuth: false,
      canUseCloudSync: false,
      flags,
      warnings: check.warnings,
    };
  }

  if (!check.hasRequiredEnv) {
    return {
      code: 'missing_env',
      label: 'พร้อมเชื่อมต่อเมื่อใส่ ENV',
      description: 'เพิ่ม VITE_SUPABASE_URL และ VITE_SUPABASE_ANON_KEY เพื่อให้ scaffold พร้อมสร้าง client ในโหมดทดสอบ',
      isConfigured: false,
      canCreateClient: false,
      canUseAuth: false,
      canUseCloudSync: false,
      flags,
      warnings: check.warnings,
    };
  }

  if (!check.canCreateClient) {
    return {
      code: 'invalid_config',
      label: 'ตรวจค่า Supabase ENV ก่อนใช้งาน',
      description: 'พบค่า ENV ที่ยังไม่พร้อมหรืออาจไม่ปลอดภัย ระบบจึงยังไม่สร้าง client',
      isConfigured: check.hasRequiredEnv,
      canCreateClient: false,
      canUseAuth: false,
      canUseCloudSync: false,
      flags,
      warnings: check.warnings,
    };
  }

  if (!runtimeFlags.auth) {
    return {
      code: 'configured_auth_disabled',
      label: 'โหมดทดสอบเท่านั้น',
      description: 'Supabase client scaffold พร้อมแล้ว แต่ Auth และ Cloud Sync ยังปิดได้ด้วย feature flags',
      isConfigured: true,
      canCreateClient: true,
      canUseAuth: false,
      canUseCloudSync: runtimeFlags.cloudSync,
      flags,
      warnings: check.warnings,
    };
  }

  return {
    code: 'test_mode_ready',
    label: 'โหมดทดสอบเท่านั้น',
    description: 'ENV และ feature flags พร้อมสำหรับการทดสอบในอนาคต แต่ M06 ยังไม่เรียก auth หรือ sync จริง',
    isConfigured: true,
    canCreateClient: true,
    canUseAuth: runtimeFlags.auth,
    canUseCloudSync: runtimeFlags.cloudSync,
    flags,
    warnings: check.warnings,
  };
}
