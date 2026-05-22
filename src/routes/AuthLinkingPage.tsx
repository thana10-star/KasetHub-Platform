import { AlertTriangle, Link2, MessageCircle, Phone, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { StatusPill } from '@/components/ui/StatusPill';
import { createAccountLinkingPlan } from '@/services/auth/account-linking-planner';
import { getLineAuthAdapterStatus } from '@/services/auth/line-auth-adapter';
import { getPhoneAuthAdapterStatus } from '@/services/auth/phone-auth-adapter';

const statusTone = {
  guest_only: 'warning',
  phone_only: 'success',
  line_only: 'warning',
  phone_line_link_candidate: 'success',
  provider_conflict: 'danger',
} as const;

export function AuthLinkingPage() {
  const phoneStatus = getPhoneAuthAdapterStatus();
  const lineStatus = getLineAuthAdapterStatus();
  const plan = createAccountLinkingPlan({
    phoneSession: phoneStatus.session,
    lineSession: lineStatus.session,
  });

  return (
    <div>
      <PageHeader title="กติกาเชื่อมบัญชี" subtitle="Phone + LINE linking preview เท่านั้น" showBack />
      <div className="grid gap-5 px-5 pb-6">
        <Card className="overflow-hidden bg-kaset-deep text-white">
          <div className="relative p-5">
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10" />
            <div className="relative flex gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-white text-kaset-deep">
                <Link2 aria-hidden="true" className="h-7 w-7" />
              </span>
              <div className="min-w-0">
                <StatusPill className="bg-white/15 text-white ring-white/20" tone={statusTone[plan.status]}>
                  {plan.status}
                </StatusPill>
                <h2 className="mt-3 text-xl font-extrabold leading-7">{plan.label}</h2>
                <p className="mt-2 text-sm leading-6 text-emerald-50/90">{plan.description}</p>
              </div>
            </div>
          </div>
        </Card>

        <NoticeBox tone="info" title="ยังไม่เชื่อมบัญชีจริงในเวอร์ชันนี้">
          หน้านี้แสดงกติกาและคำแนะนำเท่านั้น ไม่มี Supabase write ไม่มี LINE redirect และไม่มี network request
        </NoticeBox>

        <section className="grid gap-3">
          <Card className="p-4">
            <div className="flex gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
                <Phone aria-hidden="true" className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-extrabold text-kaset-ink">เบอร์โทร</h2>
                  <StatusPill tone={phoneStatus.session ? 'success' : 'warning'}>
                    {phoneStatus.session ? 'มี mock session' : 'ยังไม่มี'}
                  </StatusPill>
                </div>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  {phoneStatus.session
                    ? `${phoneStatus.session.phoneNumberMasked} เป็นทางกู้คืนหลักแบบจำลอง`
                    : 'แนะนำให้ยืนยันเบอร์โทรเป็นทางกู้คืนหลักก่อนซิงก์ข้อมูลจริง'}
                </p>
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
                  <h2 className="font-extrabold text-kaset-ink">LINE</h2>
                  <StatusPill tone={lineStatus.session ? 'success' : 'warning'}>
                    {lineStatus.session ? 'มี LINE mock' : 'ยังไม่มี'}
                  </StatusPill>
                </div>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  {lineStatus.session
                    ? `${lineStatus.session.displayName} พร้อมเป็น provider เสริมแบบจำลอง`
                    : 'LINE เป็นช่องทางเสริมที่เหมาะกับผู้ใช้ที่ใช้ LINE เป็นประจำ'}
                </p>
              </div>
            </div>
          </Card>
        </section>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
              <ShieldCheck aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-extrabold text-kaset-ink">คำแนะนำตอนนี้</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">{plan.recommendedAction}</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-kaset-mist p-3">
                  <p className="text-xs font-bold text-slate-500">Recovery</p>
                  <p className="text-base font-extrabold text-kaset-deep">{plan.primaryRecoveryProvider ?? 'ยังไม่มี'}</p>
                </div>
                <div className="rounded-lg bg-kaset-mist p-3">
                  <p className="text-xs font-bold text-slate-500">Sync owner</p>
                  <p className="text-base font-extrabold text-kaset-deep">
                    {plan.canUseForGuestSyncOwnership ? 'พร้อมจำลอง' : 'ยังไม่พร้อม'}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Providers preview: {plan.linkedProvidersPreview.join(', ') || 'ยังไม่มี'}
              </p>
            </div>
          </div>
        </Card>

        {plan.warnings.length > 0 ? (
          <NoticeBox tone={plan.status === 'provider_conflict' ? 'danger' : 'warning'} icon={AlertTriangle} title="ข้อควรระวัง">
            <ul className="grid gap-1">
              {plan.warnings.map((warning) => (
                <li key={warning}>{warning}</li>
              ))}
            </ul>
          </NoticeBox>
        ) : null}

        <div className="grid gap-2">
          <Link to="/app/auth/phone">
            <span className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-kaset-deep px-4 text-sm font-bold text-white transition hover:bg-kaset-ink">
              ยืนยันเบอร์โทรจำลอง
            </span>
          </Link>
          <Link to="/app/auth/line">
            <span className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#06C755] px-4 text-sm font-bold text-white transition hover:bg-[#05b64d]">
              เชื่อม LINE จำลอง
            </span>
          </Link>
          <Button className="w-full" disabled variant="soft">
            เชื่อมบัญชีจริงยังไม่เปิดในเวอร์ชันนี้
          </Button>
        </div>
      </div>
    </div>
  );
}
