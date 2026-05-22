import type { SupabaseRuntimeStatus } from '@/services/supabase/supabase-status';
import type { AccountLinkingPlan } from '@/services/auth/account-linking.types';
import type { LineAuthAdapterStatus, LineAuthMockSession } from '@/services/auth/line-auth.types';
import type { PhoneAuthAdapterStatus, PhoneAuthMockSession } from '@/services/auth/phone-auth.types';

export type AccountMode =
  | 'guest_local_only'
  | 'guest_supabase_unavailable'
  | 'guest_supabase_configured_auth_disabled'
  | 'guest_supabase_test_ready'
  | 'phone_mock_authenticated'
  | 'authenticated_placeholder';

export type AccountStatus = {
  mode: AccountMode;
  label: string;
  description: string;
  isGuest: boolean;
  canAuthenticate: boolean;
  canCloudSync: boolean;
  localMemoryCount: number;
  supabase: SupabaseRuntimeStatus;
  phoneAuth: PhoneAuthAdapterStatus;
  lineAuth: LineAuthAdapterStatus;
  linkingPlan: AccountLinkingPlan;
  phoneMockSession?: PhoneAuthMockSession;
  lineMockSession?: LineAuthMockSession;
};
