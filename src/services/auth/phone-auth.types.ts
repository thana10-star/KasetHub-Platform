export type PhoneAuthMode = 'local_mock' | 'supabase_disabled' | 'supabase_ready_mock' | 'production_disabled';

export type PhoneAuthProvider = 'phone';

export type PhoneAuthMockSession = {
  version: 1;
  mockUserId: string;
  phoneNumberMasked: string;
  provider: PhoneAuthProvider;
  createdAt: string;
  expiresAt: string;
};

export type PhoneAuthValidationResult = {
  normalizedPhoneNumber: string;
  phoneNumberMasked: string;
  isValid: boolean;
  message: string;
};

export type PhoneAuthActionResult = {
  success: boolean;
  message: string;
  demoOtpCode?: '123456';
  session?: PhoneAuthMockSession;
};

export type PhoneAuthAdapterStatus = {
  mode: PhoneAuthMode;
  modeLabel: string;
  phoneAuthEnabled: boolean;
  localMockEnabled: boolean;
  canUseLocalMock: boolean;
  canAttemptSupabaseMock: boolean;
  networkCallsEnabled: false;
  serviceRoleAvailableInFrontend: false;
  currentAdapterPath: 'local_mock' | 'disabled_response';
  session: PhoneAuthMockSession | null;
  isSessionActive: boolean;
  readinessLabel: string;
  warnings: string[];
};

export type PhoneAuthAdapter = {
  requestOtp(phoneNumber: string): PhoneAuthActionResult;
  verifyOtp(phoneNumber: string, otpCode: string): PhoneAuthActionResult;
  getStatus(): PhoneAuthAdapterStatus;
  getMockSession(): PhoneAuthMockSession | null;
  clearMockSession(): void;
};
