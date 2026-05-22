export type LineAuthMode = 'local_mock' | 'line_disabled' | 'line_ready_mock' | 'production_disabled';

export type LineAuthProvider = 'line';

export type LineAuthMockSession = {
  version: 1;
  mockLineUserId: string;
  displayName: string;
  pictureUrl?: string;
  provider: LineAuthProvider;
  createdAt: string;
  expiresAt: string;
};

export type LineAuthActionResult = {
  success: boolean;
  message: string;
  session?: LineAuthMockSession;
};

export type LineAuthAdapterStatus = {
  mode: LineAuthMode;
  modeLabel: string;
  lineAuthEnabled: boolean;
  localMockEnabled: boolean;
  canUseLocalMock: boolean;
  canAttemptLineMock: boolean;
  networkCallsEnabled: false;
  serviceRoleAvailableInFrontend: false;
  currentAdapterPath: 'local_mock' | 'disabled_response';
  session: LineAuthMockSession | null;
  isSessionActive: boolean;
  readinessLabel: string;
  warnings: string[];
};

export type LineAuthAdapter = {
  startLineLoginMock(): LineAuthActionResult;
  completeLineLoginMock(): LineAuthActionResult;
  getStatus(): LineAuthAdapterStatus;
  getLineMockSession(): LineAuthMockSession | null;
  clearLineMockSession(): void;
};
