import { publicEnv } from '@/config/env';
import type {
  LineAuthActionResult,
  LineAuthAdapter,
  LineAuthAdapterStatus,
  LineAuthMode,
} from '@/services/auth/line-auth.types';
import {
  clearLineMockSession,
  completeLineLoginMock as completeLocalLineLoginMock,
  getLineMockSession,
  startLineLoginMock as startLocalLineLoginMock,
} from '@/services/auth/line-auth-local-mock';

function normalizeMode(value: string): LineAuthMode {
  if (value === 'line_disabled' || value === 'line_ready_mock' || value === 'production_disabled') {
    return value;
  }

  return 'local_mock';
}

export function getLineAuthMode(): LineAuthMode {
  return normalizeMode(publicEnv.lineAuthMode);
}

function modeLabel(mode: LineAuthMode) {
  const labels: Record<LineAuthMode, string> = {
    local_mock: 'Local mock',
    line_disabled: 'LINE disabled',
    line_ready_mock: 'LINE ready mock',
    production_disabled: 'Production disabled',
  };

  return labels[mode];
}

function disabledResult(mode: LineAuthMode): LineAuthActionResult {
  return {
    success: false,
    message:
      mode === 'line_ready_mock'
        ? 'LINE Auth flag ยังเปิดไม่ครบ จึงยังไม่เริ่ม LINE Login จริงหรือ mock ผ่าน provider'
        : 'LINE Auth ปิดอยู่ในโหมดนี้ ยังไม่มี SDK, redirect หรือ network request',
  };
}

export function getLineAuthAdapterStatus(): LineAuthAdapterStatus {
  const mode = getLineAuthMode();
  const canUseLocalMock =
    (mode === 'local_mock' && publicEnv.enableLineAuthLocalMock) ||
    (mode === 'line_ready_mock' && publicEnv.enableLineAuth && publicEnv.enableLineAuthLocalMock);
  const session = getLineMockSession();

  return {
    mode,
    modeLabel: modeLabel(mode),
    lineAuthEnabled: publicEnv.enableLineAuth,
    localMockEnabled: publicEnv.enableLineAuthLocalMock,
    canUseLocalMock,
    canAttemptLineMock: mode === 'line_ready_mock' && publicEnv.enableLineAuth,
    networkCallsEnabled: false,
    serviceRoleAvailableInFrontend: false,
    currentAdapterPath: canUseLocalMock ? 'local_mock' : 'disabled_response',
    session,
    isSessionActive: Boolean(session),
    readinessLabel: canUseLocalMock
      ? 'ใช้ LINE Login local mock อยู่ ไม่มี SDK ไม่มี redirect และไม่มี network'
      : mode === 'line_ready_mock'
        ? 'เตรียม LINE mock แต่ยังเปิด flag ไม่ครบ'
        : 'LINE Auth ถูกปิดไว้',
    warnings: [
      'LINE Login จำลองเท่านั้น',
      'ยังไม่เชื่อมต่อ LINE จริงและยังไม่มี OAuth token',
      'LINE secret หรือ channel secret ต้องไม่อยู่ใน frontend',
      'service-role key ต้องไม่อยู่ใน frontend',
    ],
  };
}

export const lineAuthAdapter: LineAuthAdapter = {
  startLineLoginMock() {
    const status = getLineAuthAdapterStatus();
    return status.canUseLocalMock ? startLocalLineLoginMock() : disabledResult(status.mode);
  },

  completeLineLoginMock() {
    const status = getLineAuthAdapterStatus();
    return status.canUseLocalMock ? completeLocalLineLoginMock() : disabledResult(status.mode);
  },

  getStatus: getLineAuthAdapterStatus,
  getLineMockSession,
  clearLineMockSession,
};

export const startLineLogin = lineAuthAdapter.startLineLoginMock;
export const completeLineLogin = lineAuthAdapter.completeLineLoginMock;
export const clearLineMockSessionFromAdapter = lineAuthAdapter.clearLineMockSession;
