import { publicEnv } from '@/config/env';
import type { SupabaseAuthSessionSnapshot } from '@/services/auth/supabase-auth-session';

export const communityModerationLoginRequiredMessage = 'เข้าสู่ระบบก่อนดูรายงานชุมชน';
export const communityModerationNoAccessMessage = 'ไม่มีสิทธิ์เข้าถึงหน้านี้';

export type CommunityModerationAccessStatus =
  | {
      state: 'signed_out';
      isAdmin: false;
      message: string;
    }
  | {
      state: 'forbidden';
      isAdmin: false;
      message: string;
    }
  | {
      state: 'admin';
      isAdmin: true;
      message: string;
    };

export function normalizeCommunityAdminEmail(email: string | null | undefined) {
  return email?.trim().toLowerCase() ?? '';
}

export function isCommunityModerationAdminEmail(
  email: string | null | undefined,
  adminEmails: string[] = publicEnv.adminEmails,
) {
  const normalizedEmail = normalizeCommunityAdminEmail(email);
  if (!normalizedEmail) return false;

  return adminEmails.map(normalizeCommunityAdminEmail).includes(normalizedEmail);
}

export function getCommunityModerationAccessStatus(
  session: SupabaseAuthSessionSnapshot,
  adminEmails: string[] = publicEnv.adminEmails,
): CommunityModerationAccessStatus {
  if (!session.isSignedIn) {
    return {
      state: 'signed_out',
      isAdmin: false,
      message: communityModerationLoginRequiredMessage,
    };
  }

  if (!isCommunityModerationAdminEmail(session.email, adminEmails)) {
    return {
      state: 'forbidden',
      isAdmin: false,
      message: communityModerationNoAccessMessage,
    };
  }

  return {
    state: 'admin',
    isAdmin: true,
    message: 'บัญชีทีมงานพร้อมตรวจรายงาน',
  };
}
