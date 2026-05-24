import type { PhoneAuthMockSession } from '@/services/auth/phone-auth.types';
import type { PhoneAuthStagingSessionPreview } from '@/services/auth/phone-auth-staging-adapter.types';

export type AuthOwnershipSource = 'guest_only' | 'local_mock_phone' | 'supabase_phone_staging';

export type AuthOwnershipStatus = {
  source: AuthOwnershipSource;
  label: string;
  realSupabaseSessionDetected: boolean;
  localMockSessionDetected: boolean;
  ownershipVerified: boolean;
  syncAllowed: false;
  userIdMasked: string | null;
  phoneNumberMasked: string | null;
  sessionCreatedAt: string | null;
  explanation: string;
  nextRequiredMilestone: string;
  warnings: string[];
};

export type AuthOwnershipStatusInput = {
  phoneMockSession?: PhoneAuthMockSession | null;
  supabaseSessionPreview?: PhoneAuthStagingSessionPreview | null;
};
