import { KeyRound, LogIn, LogOut, Mail, ShieldCheck, UsersRound } from 'lucide-react';
import type { FormEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import {
  getCachedSupabaseAuthSessionSnapshot,
  getCurrentSupabaseAuthSession,
  signInWithEmailPassword,
  signOutSupabaseAuth,
  subscribeToSupabaseAuthSession,
  type SupabaseAuthSessionSnapshot,
} from '@/services/auth/supabase-auth-session';

type LoginPageProps = {
  sessionOverride?: SupabaseAuthSessionSnapshot;
};

function normalizeNext(value: string | null) {
  return value?.startsWith('/app') ? value : '/app/community';
}

export function LoginPage({ sessionOverride }: LoginPageProps = {}) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const nextPath = useMemo(() => normalizeNext(searchParams.get('next')), [searchParams]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [session, setSession] = useState<SupabaseAuthSessionSnapshot>(
    () => sessionOverride ?? getCachedSupabaseAuthSessionSnapshot(),
  );

  useEffect(() => {
    if (sessionOverride) {
      setSession(sessionOverride);
      return undefined;
    }

    let active = true;
    void getCurrentSupabaseAuthSession().then((snapshot) => {
      if (active) setSession(snapshot);
    });
    const unsubscribe = subscribeToSupabaseAuthSession((snapshot) => {
      if (active) setSession(snapshot);
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [sessionOverride]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    const result = await signInWithEmailPassword(email, password);
    setIsSubmitting(false);

    if (!result.ok) {
      setStatusMessage(result.message);
      return;
    }

    setSession(result.session);
    setStatusMessage('เข้าสู่ระบบแล้ว');
    navigate(nextPath);
  }

  async function handleSignOut() {
    const result = await signOutSupabaseAuth();
    if (result.ok) {
      setSession(result.session);
      setStatusMessage('ออกจากระบบแล้ว');
      return;
    }

    setStatusMessage(result.message);
  }

  return (
    <div>
      <PageHeader
        title="เข้าสู่ระบบ"
        subtitle="ใช้บัญชีทดสอบเพื่อโพสต์ คอมเมนต์ หรือกดไลก์ในชุมชน"
        showBack
      />

      <div className="grid gap-5 px-5 pb-24">
        <NoticeBox tone="info" title="สำหรับทดสอบระบบชุมชน">
          ใช้บัญชีที่ทีมงานเตรียมไว้สำหรับ staging เท่านั้น
        </NoticeBox>

        {session.isSignedIn ? (
          <Card className="p-4" aria-labelledby="login-signed-in-title">
            <div className="flex gap-3">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
                <ShieldCheck aria-hidden="true" className="h-6 w-6" />
              </span>
              <div className="min-w-0 flex-1">
                <Badge tone="green">เข้าสู่ระบบแล้ว</Badge>
                <h2 id="login-signed-in-title" className="mt-2 text-lg font-extrabold text-kaset-ink">
                  พร้อมทดสอบชุมชน
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  {session.email ?? 'เข้าสู่ระบบแล้ว'}
                </p>
                {session.userIdMasked ? (
                  <p className="mt-1 text-xs font-semibold text-slate-500">user {session.userIdMasked}</p>
                ) : null}
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <Link
                    className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full bg-kaset-deep px-5 text-[15px] font-bold leading-5 text-white"
                    to={nextPath}
                  >
                    <UsersRound aria-hidden="true" className="h-4 w-4" />
                    กลับไปชุมชน
                  </Link>
                  <Button onClick={handleSignOut} variant="secondary">
                    <LogOut aria-hidden="true" className="h-4 w-4" />
                    ออกจากระบบ
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="p-4" aria-labelledby="login-form-title">
            <div className="flex gap-3">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
                <LogIn aria-hidden="true" className="h-6 w-6" />
              </span>
              <div className="min-w-0 flex-1">
                <h2 id="login-form-title" className="text-lg font-extrabold text-kaset-ink">
                  เข้าสู่ระบบชุมชน
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  ใช้อีเมลและรหัสผ่านของบัญชีทดสอบ staging
                </p>
              </div>
            </div>

            <form className="mt-4 grid gap-4" onSubmit={handleSubmit}>
              <label className="grid gap-2 text-sm font-extrabold text-kaset-ink" htmlFor="login-email">
                อีเมล
                <span className="flex items-center gap-2 rounded-lg border border-kaset-deep/10 bg-slate-50 px-3">
                  <Mail aria-hidden="true" className="h-4 w-4 shrink-0 text-slate-500" />
                  <input
                    autoComplete="email"
                    className="min-h-12 w-full bg-transparent text-sm font-semibold text-kaset-ink outline-none"
                    id="login-email"
                    inputMode="email"
                    onChange={(event) => setEmail(event.currentTarget.value)}
                    placeholder="name@example.com"
                    type="email"
                    value={email}
                  />
                </span>
              </label>

              <label className="grid gap-2 text-sm font-extrabold text-kaset-ink" htmlFor="login-password">
                รหัสผ่าน
                <span className="flex items-center gap-2 rounded-lg border border-kaset-deep/10 bg-slate-50 px-3">
                  <KeyRound aria-hidden="true" className="h-4 w-4 shrink-0 text-slate-500" />
                  <input
                    autoComplete="current-password"
                    className="min-h-12 w-full bg-transparent text-sm font-semibold text-kaset-ink outline-none"
                    id="login-password"
                    onChange={(event) => setPassword(event.currentTarget.value)}
                    placeholder="รหัสผ่าน"
                    type="password"
                    value={password}
                  />
                </span>
              </label>

              <Button disabled={isSubmitting} type="submit">
                <LogIn aria-hidden="true" className="h-4 w-4" />
                {isSubmitting ? 'กำลังเข้าสู่ระบบ' : 'เข้าสู่ระบบ'}
              </Button>
            </form>
          </Card>
        )}

        {statusMessage ? (
          <p className="rounded-lg bg-kaset-mist p-3 text-sm font-semibold leading-6 text-kaset-ink">
            {statusMessage}
          </p>
        ) : null}

        <Card className="p-4">
          <h2 className="font-extrabold text-kaset-ink">ขอบเขตความปลอดภัย</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            การเข้าสู่ระบบนี้มีไว้เพื่อทดสอบ Community staging เท่านั้น การเปิดเขียนโพสต์จริงยังต้องผ่านการตั้งค่าความปลอดภัยและสิทธิ์บัญชี
          </p>
        </Card>
      </div>
    </div>
  );
}
