import type { LineAuthMockSession } from '@/services/auth/line-auth.types';
import type { PhoneAuthMockSession } from '@/services/auth/phone-auth.types';

export type AccountLinkingProvider = 'phone' | 'line' | 'google';

export type AccountLinkingStatus =
  | 'guest_only'
  | 'phone_only'
  | 'line_only'
  | 'phone_line_link_candidate'
  | 'provider_conflict';

export type AccountLinkingPlannerInput = {
  phoneSession?: PhoneAuthMockSession | null;
  lineSession?: LineAuthMockSession | null;
  hasProviderConflict?: boolean;
};

export type AccountLinkingPlan = {
  status: AccountLinkingStatus;
  label: string;
  description: string;
  recommendedAction: string;
  primaryRecoveryProvider: 'phone' | null;
  linkedProvidersPreview: AccountLinkingProvider[];
  canPreviewLink: boolean;
  requiresUserConfirmation: boolean;
  canUseForGuestSyncOwnership: boolean;
  warnings: string[];
};
