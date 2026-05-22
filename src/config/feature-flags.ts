import { publicEnv } from '@/config/env';
import type { SupabaseConfigCheck } from '@/services/supabase/supabase-config-check';
import { checkSupabaseConfig } from '@/services/supabase/supabase-config-check';

export type FeatureFlagKey = 'supabase' | 'auth' | 'cloudSync';

export type FeatureFlagStatus = {
  key: FeatureFlagKey;
  label: string;
  requestedEnabled: boolean;
  isActive: boolean;
  statusLabel: string;
  description: string;
};

export type RuntimeFeatureFlags = {
  supabase: boolean;
  auth: boolean;
  cloudSync: boolean;
};

function inactiveReason(check: SupabaseConfigCheck) {
  if (!publicEnv.enableSupabase) {
    return 'ปิดไว้ตามค่าเริ่มต้น';
  }

  if (!check.hasRequiredEnv) {
    return 'รอ ENV';
  }

  if (!check.urlLooksValid || !check.anonKeyLooksUsable) {
    return 'ตรวจค่า ENV';
  }

  return 'ยังไม่เปิดใช้งาน';
}

export function getRuntimeFeatureFlags(check: SupabaseConfigCheck = checkSupabaseConfig()): RuntimeFeatureFlags {
  const supabase = publicEnv.enableSupabase && check.canCreateClient;

  return {
    supabase,
    auth: supabase && publicEnv.enableAuth,
    cloudSync: supabase && publicEnv.enableCloudSync,
  };
}

export function getFeatureFlagStatuses(check: SupabaseConfigCheck = checkSupabaseConfig()): FeatureFlagStatus[] {
  const flags = getRuntimeFeatureFlags(check);
  const reason = inactiveReason(check);

  return [
    {
      key: 'supabase',
      label: 'Supabase',
      requestedEnabled: publicEnv.enableSupabase,
      isActive: flags.supabase,
      statusLabel: flags.supabase ? 'เปิดโหมดทดสอบ' : reason,
      description: 'เปิดใช้ client scaffold เมื่อมี URL, anon key และ flag พร้อมกัน',
    },
    {
      key: 'auth',
      label: 'Auth',
      requestedEnabled: publicEnv.enableAuth,
      isActive: flags.auth,
      statusLabel: flags.auth ? 'พร้อมสำหรับทดสอบในอนาคต' : publicEnv.enableAuth ? reason : 'ปิดไว้ตามค่าเริ่มต้น',
      description: 'เตรียมไว้สำหรับ phone OTP, LINE Login และ Google ภายหลัง',
    },
    {
      key: 'cloudSync',
      label: 'Cloud Sync',
      requestedEnabled: publicEnv.enableCloudSync,
      isActive: flags.cloudSync,
      statusLabel: flags.cloudSync ? 'พร้อมสำหรับทดสอบในอนาคต' : publicEnv.enableCloudSync ? reason : 'ปิดไว้ตามค่าเริ่มต้น',
      description: 'เตรียมไว้สำหรับอัปโหลด Guest Memory หลังผู้ใช้ยินยอม',
    },
  ];
}
