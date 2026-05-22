import { KeyRound, Link2, Lock, MessageCircle, Phone, RotateCcw, ShieldCheck, Smartphone } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { StatusPill } from '@/components/ui/StatusPill';
import { createAccountLinkingPlan } from '@/services/auth/account-linking-planner';
import { clearLineMockSessionFromAdapter, getLineAuthAdapterStatus } from '@/services/auth/line-auth-adapter';
import { clearPhoneMockSession, getPhoneAuthAdapterStatus } from '@/services/auth/phone-auth-adapter';
import { useGuestMemory } from '@/hooks/useGuestMemory';
import { getAccountStatus } from '@/services/account/account-status-service';

export function AuthStatusPage() {
  const { state } = useGuestMemory();
  const [refreshKey, setRefreshKey] = useState(0);
  const phoneStatus = getPhoneAuthAdapterStatus();
  const lineStatus = getLineAuthAdapterStatus();
  const accountStatus = getAccountStatus(state);
  const phoneSession = phoneStatus.session;
  const lineSession = lineStatus.session;
  const linkingPlan = createAccountLinkingPlan({
    phoneSession,
    lineSession,
  });

  function handleClearPhoneSession() {
    clearPhoneMockSession();
    setRefreshKey((current) => current + 1);
  }

  function handleClearLineSession() {
    clearLineMockSessionFromAdapter();
    setRefreshKey((current) => current + 1);
  }

  void refreshKey;

  return (
    <div>
      <PageHeader title="สถานะบัญชีทดสอบ" subtitle="Phone + LINE mock เท่านั้น ยังไม่มี login จริง" showBack />
      <div className="grid gap-5 px-5 pb-6">
        <Card className="overflow-hidden bg-kaset-deep text-white">
          <div className="relative p-5">
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10" />
            <div className="relative flex gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-white text-kaset-deep">
                <ShieldCheck aria-hidden="true" className="h-7 w-7" />
              </span>
              <div className="min-w-0">
                <StatusPill className="bg-white/15 text-white ring-white/20" tone={phoneSession ? 'success' : 'warning'}>
                  {phoneSession ? 'phone mock' : 'guest'}
                </StatusPill>
                <h2 className="mt-3 text-xl font-extrabold leading-7">
                  {phoneSession ? 'มีเจ้าของบัญชีจำลอง' : 'ยังใช้งานแบบ Guest'}
                </h2>
                <p className="mt-2 text-sm leading-6 text-emerald-50/90">
                  สถานะนี้ใช้ทดสอบ boundary เท่านั้น ยังไม่ใช่บัญชีจริง ไม่เชื่อม Supabase Auth และไม่ส่งข้อมูลออกจากเครื่อง
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
              <Phone aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-extrabold text-kaset-ink">Phone Auth mode</h2>
                <StatusPill tone={phoneStatus.canUseLocalMock ? 'success' : 'warning'}>{phoneStatus.modeLabel}</StatusPill>
              </div>
              <p className="mt-1 text-sm leading-6 text-slate-600">{phoneStatus.readinessLabel}</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-kaset-mist p-3">
                  <p className="text-xs font-bold text-slate-500">Phone Auth</p>
                  <p className="text-base font-extrabold text-kaset-deep">{phoneStatus.phoneAuthEnabled ? 'เปิด' : 'ปิด'}</p>
                </div>
                <div className="rounded-lg bg-kaset-mist p-3">
                  <p className="text-xs font-bold text-slate-500">Local mock</p>
                  <p className="text-base font-extrabold text-kaset-deep">{phoneStatus.localMockEnabled ? 'เปิด' : 'ปิด'}</p>
                </div>
                <div className="rounded-lg bg-kaset-mist p-3">
                  <p className="text-xs font-bold text-slate-500">Network</p>
                  <p className="text-base font-extrabold text-kaset-deep">{phoneStatus.networkCallsEnabled ? 'เปิด' : 'ปิด'}</p>
                </div>
                <div className="rounded-lg bg-kaset-mist p-3">
                  <p className="text-xs font-bold text-slate-500">Service role</p>
                  <p className="text-base font-extrabold text-kaset-deep">
                    {phoneStatus.serviceRoleAvailableInFrontend ? 'พบ' : 'ไม่มี'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
              <MessageCircle aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-extrabold text-kaset-ink">LINE Auth mode</h2>
                <StatusPill tone={lineStatus.canUseLocalMock ? 'success' : 'warning'}>{lineStatus.modeLabel}</StatusPill>
              </div>
              <p className="mt-1 text-sm leading-6 text-slate-600">{lineStatus.readinessLabel}</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-kaset-mist p-3">
                  <p className="text-xs font-bold text-slate-500">LINE Auth</p>
                  <p className="text-base font-extrabold text-kaset-deep">{lineStatus.lineAuthEnabled ? 'เปิด' : 'ปิด'}</p>
                </div>
                <div className="rounded-lg bg-kaset-mist p-3">
                  <p className="text-xs font-bold text-slate-500">Local mock</p>
                  <p className="text-base font-extrabold text-kaset-deep">{lineStatus.localMockEnabled ? 'เปิด' : 'ปิด'}</p>
                </div>
                <div className="rounded-lg bg-kaset-mist p-3">
                  <p className="text-xs font-bold text-slate-500">Network</p>
                  <p className="text-base font-extrabold text-kaset-deep">{lineStatus.networkCallsEnabled ? 'เปิด' : 'ปิด'}</p>
                </div>
                <div className="rounded-lg bg-kaset-mist p-3">
                  <p className="text-xs font-bold text-slate-500">LINE secret</p>
                  <p className="text-base font-extrabold text-kaset-deep">ไม่มี</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
              <Smartphone aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-extrabold text-kaset-ink">Account status</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">{accountStatus.description}</p>
              <p className="mt-2 text-sm font-bold text-kaset-deep">ข้อมูลในเครื่อง: {accountStatus.localMemoryCount} รายการ</p>
            </div>
          </div>
        </Card>

        {phoneSession ? (
          <Card className="p-4">
            <div className="flex gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
                <KeyRound aria-hidden="true" className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="font-extrabold text-kaset-ink">Phone mock session</h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">{phoneSession.phoneNumberMasked}</p>
                <p className="text-sm leading-6 text-slate-600">หมดอายุ {new Date(phoneSession.expiresAt).toLocaleString('th-TH')}</p>
                <p className="mt-1 break-all text-xs leading-5 text-slate-500">{phoneSession.mockUserId}</p>
                <Button className="mt-4 w-full" onClick={handleClearPhoneSession} variant="secondary">
                  <RotateCcw aria-hidden="true" className="h-4 w-4" />
                  ล้าง phone mock session
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <NoticeBox tone="warning" title="ยังไม่มี phone mock session">
            ไปที่หน้าสมัครด้วยเบอร์โทรแล้วใช้รหัส 123456 เพื่อสร้างเจ้าของบัญชีจำลองสำหรับทดสอบ sync ownership gate
          </NoticeBox>
        )}

        {lineSession ? (
          <Card className="p-4">
            <div className="flex gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
                <MessageCircle aria-hidden="true" className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="font-extrabold text-kaset-ink">LINE mock session</h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">{lineSession.displayName}</p>
                <p className="text-sm leading-6 text-slate-600">หมดอายุ {new Date(lineSession.expiresAt).toLocaleString('th-TH')}</p>
                <p className="mt-1 break-all text-xs leading-5 text-slate-500">{lineSession.mockLineUserId}</p>
                <Button className="mt-4 w-full" onClick={handleClearLineSession} variant="secondary">
                  <RotateCcw aria-hidden="true" className="h-4 w-4" />
                  ล้าง LINE mock session
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <NoticeBox tone="warning" title="ยังไม่มี LINE mock session">
            ไปที่หน้า LINE Login จำลองเพื่อสร้าง session เสริมสำหรับทดสอบ account linking
          </NoticeBox>
        )}

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
              <Link2 aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-extrabold text-kaset-ink">Account linking</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">{linkingPlan.description}</p>
              <p className="mt-2 text-sm font-bold text-kaset-deep">{linkingPlan.recommendedAction}</p>
              <Link to="/app/auth/linking">
                <span className="mt-3 inline-flex text-sm font-bold text-kaset-deep">ดูกติกาเชื่อมบัญชี</span>
              </Link>
            </div>
          </div>
        </Card>

        <NoticeBox tone="info" icon={Lock} title="ยังเป็นโหมดทดสอบ">
          ไม่มี SMS จริง ไม่มี LINE SDK ไม่มี Supabase Auth ไม่มี network request และไม่มี service-role key ใน frontend
        </NoticeBox>
      </div>
    </div>
  );
}
