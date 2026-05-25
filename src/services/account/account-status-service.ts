import type { GuestMemoryState } from '@/services/guest-memory/guest-memory.types';
import type { AccountStatus } from '@/services/account/account-status.types';
import { createAccountLinkingPlan } from '@/services/auth/account-linking-planner';
import { getLineAuthAdapterStatus } from '@/services/auth/line-auth-adapter';
import { getPhoneAuthAdapterStatus } from '@/services/auth/phone-auth-adapter';
import { getSupabaseStatus } from '@/services/supabase/supabase-status';

function countLocalMemory(state?: GuestMemoryState) {
  if (!state) {
    return 0;
  }

  return (
    state.savedItems.length +
    state.likes.length +
    state.followedTopics.length +
    state.farmRecords.length +
    state.recentAIQuestions.length
  );
}

export function getAccountStatus(state?: GuestMemoryState): AccountStatus {
  const supabase = getSupabaseStatus();
  const phoneAuth = getPhoneAuthAdapterStatus();
  const lineAuth = getLineAuthAdapterStatus();
  const linkingPlan = createAccountLinkingPlan({
    phoneSession: phoneAuth.session,
    lineSession: lineAuth.session,
  });
  const localMemoryCount = countLocalMemory(state);

  if (phoneAuth.session) {
    return {
      mode: 'phone_mock_authenticated',
      label: 'บัญชีในเครื่อง',
      description: `มีสถานะเบอร์โทรในเครื่องนี้ (${phoneAuth.session.phoneNumberMasked}) การสำรองขึ้นคลาวด์ยังไม่เปิดใช้งาน`,
      isGuest: false,
      canAuthenticate: false,
      canCloudSync: false,
      localMemoryCount,
      supabase,
      phoneAuth,
      lineAuth,
      linkingPlan,
      phoneMockSession: phoneAuth.session,
      lineMockSession: lineAuth.session ?? undefined,
    };
  }

  if (!supabase.canCreateClient) {
    return {
      mode: supabase.code === 'missing_env' ? 'guest_supabase_unavailable' : 'guest_local_only',
      label: 'Guest mode active',
      description: 'ใช้งานได้ทันทีโดยไม่ต้องสมัคร ข้อมูลยังอยู่ในเครื่องนี้',
      isGuest: true,
      canAuthenticate: false,
      canCloudSync: false,
      localMemoryCount,
      supabase,
      phoneAuth,
      lineAuth,
      linkingPlan,
      lineMockSession: lineAuth.session ?? undefined,
    };
  }

  if (!supabase.canUseAuth) {
    return {
      mode: 'guest_supabase_configured_auth_disabled',
      label: 'ใช้งานได้ทันที',
      description: 'ใช้งานได้ทันทีโดยไม่ต้องสมัคร ข้อมูลยังอยู่ในเครื่องนี้',
      isGuest: true,
      canAuthenticate: false,
      canCloudSync: supabase.canUseCloudSync,
      localMemoryCount,
      supabase,
      phoneAuth,
      lineAuth,
      linkingPlan,
      lineMockSession: lineAuth.session ?? undefined,
    };
  }

  return {
    mode: 'guest_supabase_test_ready',
    label: 'ใช้งานได้ทันที',
    description: 'ใช้งานได้ทันทีโดยไม่ต้องสมัคร ข้อมูลยังอยู่ในเครื่องนี้',
    isGuest: true,
    canAuthenticate: false,
    canCloudSync: supabase.canUseCloudSync,
    localMemoryCount,
    supabase,
    phoneAuth,
    lineAuth,
    linkingPlan,
    lineMockSession: lineAuth.session ?? undefined,
  };
}
