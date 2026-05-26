import type { Session, SupabaseClient, User } from '@supabase/supabase-js';
import { getSupabaseClient } from '@/services/supabase/supabase-client';
import { getSupabaseStatus } from '@/services/supabase/supabase-status';

const sessionPreviewStorageKey = 'kasethub.auth.supabaseSessionPreview.v1';

export type SupabaseAuthSessionSnapshot = {
  isConfigured: boolean;
  canUseAuth: boolean;
  isSignedIn: boolean;
  userId?: string;
  userIdMasked?: string;
  email?: string;
  message: string;
};

export type SupabaseAuthActionResult =
  | {
      ok: true;
      session: SupabaseAuthSessionSnapshot;
    }
  | {
      ok: false;
      code: 'auth_disabled' | 'invalid_input' | 'supabase_not_ready' | 'supabase_auth_failed';
      message: string;
    };

function canUseStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage);
}

function maskUserId(value: string) {
  if (value.length <= 10) return `${value.slice(0, 3)}...`;
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

function snapshotFromUser(user: User): SupabaseAuthSessionSnapshot {
  return {
    isConfigured: true,
    canUseAuth: true,
    isSignedIn: true,
    userId: user.id,
    userIdMasked: maskUserId(user.id),
    email: user.email ?? undefined,
    message: user.email ? `เข้าสู่ระบบแล้ว: ${user.email}` : 'เข้าสู่ระบบแล้ว',
  };
}

function signedOutSnapshot(message = 'ยังไม่ได้เข้าสู่ระบบ'): SupabaseAuthSessionSnapshot {
  const status = getSupabaseStatus();
  return {
    isConfigured: status.canCreateClient,
    canUseAuth: status.canUseAuth,
    isSignedIn: false,
    message,
  };
}

function writePreview(snapshot: SupabaseAuthSessionSnapshot) {
  if (!canUseStorage() || !snapshot.isSignedIn) return;
  const preview = {
    userId: snapshot.userId,
    userIdMasked: snapshot.userIdMasked,
    email: snapshot.email,
    createdAt: new Date().toISOString(),
  };
  window.localStorage.setItem(sessionPreviewStorageKey, JSON.stringify(preview));
  window.dispatchEvent(new CustomEvent('kasethub:supabase-auth-session-changed'));
}

function clearPreview() {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(sessionPreviewStorageKey);
  window.dispatchEvent(new CustomEvent('kasethub:supabase-auth-session-changed'));
}

export function getCachedSupabaseAuthSessionSnapshot(): SupabaseAuthSessionSnapshot {
  if (!canUseStorage()) {
    return signedOutSnapshot();
  }

  try {
    const raw = window.localStorage.getItem(sessionPreviewStorageKey);
    if (!raw) return signedOutSnapshot();
    const parsed = JSON.parse(raw) as {
      userId?: string;
      userIdMasked?: string;
      email?: string;
    };
    if (!parsed.userId) return signedOutSnapshot();

    return {
      isConfigured: true,
      canUseAuth: true,
      isSignedIn: true,
      userId: parsed.userId,
      userIdMasked: parsed.userIdMasked ?? maskUserId(parsed.userId),
      email: parsed.email,
      message: parsed.email ? `เข้าสู่ระบบแล้ว: ${parsed.email}` : 'เข้าสู่ระบบแล้ว',
    };
  } catch {
    return signedOutSnapshot();
  }
}

function unavailableAuthResult(client: SupabaseClient | null): SupabaseAuthSessionSnapshot {
  const status = getSupabaseStatus();
  if (!client || !status.canCreateClient) {
    return signedOutSnapshot('ยังเชื่อมต่อ Supabase staging ไม่ได้');
  }

  if (!status.canUseAuth) {
    return signedOutSnapshot('ยังไม่ได้เปิดการเข้าสู่ระบบสำหรับ staging');
  }

  return signedOutSnapshot();
}

export async function getCurrentSupabaseAuthSession(): Promise<SupabaseAuthSessionSnapshot> {
  const client = getSupabaseClient();
  const unavailable = unavailableAuthResult(client);
  if (!client || !unavailable.canUseAuth) {
    clearPreview();
    return unavailable;
  }

  const { data, error } = await client.auth.getUser();
  if (error || !data.user) {
    clearPreview();
    return signedOutSnapshot();
  }

  const snapshot = snapshotFromUser(data.user);
  writePreview(snapshot);
  return snapshot;
}

export async function signInWithEmailPassword(email: string, password: string): Promise<SupabaseAuthActionResult> {
  const trimmedEmail = email.trim();
  if (!trimmedEmail || !password) {
    return {
      ok: false,
      code: 'invalid_input',
      message: 'กรุณาใส่อีเมลและรหัสผ่าน',
    };
  }

  const client = getSupabaseClient();
  const unavailable = unavailableAuthResult(client);
  if (!client || !unavailable.isConfigured) {
    return {
      ok: false,
      code: 'supabase_not_ready',
      message: unavailable.message,
    };
  }

  if (!unavailable.canUseAuth) {
    return {
      ok: false,
      code: 'auth_disabled',
      message: unavailable.message,
    };
  }

  const { data, error } = await client.auth.signInWithPassword({
    email: trimmedEmail,
    password,
  });

  if (error || !data.user) {
    clearPreview();
    return {
      ok: false,
      code: 'supabase_auth_failed',
      message: `เข้าสู่ระบบไม่สำเร็จ: ${error?.message ?? 'ไม่พบบัญชีทดสอบ'}`,
    };
  }

  const snapshot = snapshotFromUser(data.user);
  writePreview(snapshot);
  return {
    ok: true,
    session: snapshot,
  };
}

export async function signOutSupabaseAuth(): Promise<SupabaseAuthActionResult> {
  const client = getSupabaseClient();
  if (client) {
    const { error } = await client.auth.signOut();
    if (error) {
      return {
        ok: false,
        code: 'supabase_auth_failed',
        message: `ออกจากระบบไม่สำเร็จ: ${error.message}`,
      };
    }
  }

  clearPreview();
  return {
    ok: true,
    session: signedOutSnapshot('ออกจากระบบแล้ว'),
  };
}

export function subscribeToSupabaseAuthSession(
  callback: (session: SupabaseAuthSessionSnapshot) => void,
): () => void {
  const client = getSupabaseClient();
  if (!client || !getSupabaseStatus().canUseAuth) {
    return () => undefined;
  }

  const { data } = client.auth.onAuthStateChange((_event: string, session: Session | null) => {
    if (session?.user) {
      const snapshot = snapshotFromUser(session.user);
      writePreview(snapshot);
      callback(snapshot);
      return;
    }

    clearPreview();
    callback(signedOutSnapshot());
  });

  return () => data.subscription.unsubscribe();
}
