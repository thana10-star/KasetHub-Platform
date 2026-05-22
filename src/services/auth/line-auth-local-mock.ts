import type { LineAuthActionResult, LineAuthMockSession } from '@/services/auth/line-auth.types';

const storageKey = 'kasethub.lineAuth.mockSession.v1';
const sessionVersion = 1;
const sessionTtlMs = 24 * 60 * 60 * 1000;

function now() {
  return new Date();
}

function createId(prefix: string) {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function canUseStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage);
}

function writeMockSession(session: LineAuthMockSession) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(storageKey, JSON.stringify(session));
  window.dispatchEvent(new CustomEvent('kasethub:line-auth-session-changed'));
}

export function getLineMockSession(): LineAuthMockSession | null {
  if (!canUseStorage()) {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as LineAuthMockSession;
    if (parsed.version !== sessionVersion || parsed.provider !== 'line') {
      return null;
    }

    if (new Date(parsed.expiresAt).getTime() <= Date.now()) {
      clearLineMockSession();
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function clearLineMockSession() {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(storageKey);
  window.dispatchEvent(new CustomEvent('kasethub:line-auth-session-changed'));
}

export function startLineLoginMock(): LineAuthActionResult {
  return {
    success: true,
    message: 'เริ่ม LINE Login จำลองแล้ว ไม่มี redirect ไม่มี SDK และไม่มี network request',
  };
}

export function completeLineLoginMock(): LineAuthActionResult {
  const createdAt = now();
  const expiresAt = new Date(createdAt.getTime() + sessionTtlMs);
  const session: LineAuthMockSession = {
    version: sessionVersion,
    mockLineUserId: createId('line-mock-user'),
    displayName: 'เกษตรกร LINE Demo',
    pictureUrl: undefined,
    provider: 'line',
    createdAt: createdAt.toISOString(),
    expiresAt: expiresAt.toISOString(),
  };

  writeMockSession(session);

  return {
    success: true,
    message: 'LINE Login จำลองสำเร็จ ยังไม่เชื่อมต่อ LINE จริง',
    session,
  };
}
