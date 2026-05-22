import { ArrowRight, CheckCircle2, KeyRound, Link2, MessageCircle, Phone, ShieldCheck, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { StatusPill } from '@/components/ui/StatusPill';
import { useGuestMemory } from '@/hooks/useGuestMemory';
import { createAccountLinkingPlan } from '@/services/auth/account-linking-planner';
import { getLineAuthAdapterStatus } from '@/services/auth/line-auth-adapter';
import { getPhoneAuthAdapterStatus } from '@/services/auth/phone-auth-adapter';
import type { AppRoute } from '@/types/kaset';

const authOptions: Array<{
  label: string;
  description: string;
  href: AppRoute;
  icon: typeof Phone;
  primary?: boolean;
}> = [
  {
    label: 'สมัครด้วยเบอร์โทร',
    description: 'เบอร์โทรเหมาะสำหรับผู้ใช้ทั่วไป ไม่ต้องใช้อีเมล',
    href: '/app/auth/phone',
    icon: Phone,
    primary: true,
  },
  {
    label: 'เชื่อมต่อ LINE',
    description: 'LINE เหมาะสำหรับคนที่ใช้ LINE เป็นประจำ',
    href: '/app/auth/line',
    icon: MessageCircle,
  },
  {
    label: 'เชื่อมต่อ Google',
    description: 'Google สำหรับผู้ใช้ที่มีบัญชีอยู่แล้ว',
    href: '/app/auth/google',
    icon: KeyRound,
  },
];

export function AuthPage() {
  const { counts } = useGuestMemory();
  const phoneAuthStatus = getPhoneAuthAdapterStatus();
  const lineAuthStatus = getLineAuthAdapterStatus();
  const linkingPlan = createAccountLinkingPlan({
    phoneSession: phoneAuthStatus.session,
    lineSession: lineAuthStatus.session,
  });
  const localMemoryCount =
    counts.savedItems + counts.likedPosts + counts.followedTopics + counts.farmRecords + counts.recentAIQuestions;

  return (
    <div>
      <PageHeader title="สมัคร/สำรองข้อมูล" subtitle="พรีวิวระบบบัญชี ยังไม่เชื่อมต่อจริง" showBack />
      <div className="grid gap-5 px-5 pb-6">
        <Card className="overflow-hidden bg-kaset-deep text-white">
          <div className="relative p-5">
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10" />
            <div className="relative flex gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-white text-kaset-deep">
                <UserRound aria-hidden="true" className="h-7 w-7" />
              </span>
              <div className="min-w-0">
                <Badge className="bg-white/15 text-white" tone="green">
                  Guest first
                </Badge>
                <h2 className="mt-3 text-xl font-extrabold">ใช้งานต่อได้เลย ไม่ต้องสมัคร</h2>
                <p className="mt-2 text-sm leading-6 text-emerald-50/90">
                  สมัครเพื่อสำรองข้อมูลที่บันทึกไว้ และเตรียมย้ายข้อมูลไปเครื่องอื่นในอนาคต
                </p>
              </div>
            </div>
          </div>
        </Card>

        <NoticeBox tone="success" title="ยังใช้งานต่อได้ ไม่ต้องสมัครตอนนี้">
          สมัครเมื่ออยากสำรองข้อมูลหรือย้ายไปเครื่องอื่น ในเวอร์ชันนี้ยังไม่มี OTP, LINE Login หรือ Google Login จริง
        </NoticeBox>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
              <Phone aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-extrabold text-kaset-ink">Phone Auth mock</h2>
                <StatusPill tone={phoneAuthStatus.session ? 'success' : 'warning'}>
                  {phoneAuthStatus.session ? 'ยืนยันแล้ว' : 'ยังไม่ได้ยืนยัน'}
                </StatusPill>
              </div>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                {phoneAuthStatus.session
                  ? `มี session จำลอง ${phoneAuthStatus.session.phoneNumberMasked} สำหรับทดสอบ sync preview`
                  : 'ยืนยันเบอร์โทรจำลองก่อนทดสอบการสำรองข้อมูลแบบมี ownership gate'}
              </p>
              <Link to="/app/auth/status">
                <span className="mt-3 inline-flex text-sm font-bold text-kaset-deep">ดูสถานะบัญชีทดสอบ</span>
              </Link>
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
                <h2 className="font-extrabold text-kaset-ink">LINE Login mock</h2>
                <StatusPill tone={lineAuthStatus.session ? 'success' : 'warning'}>
                  {lineAuthStatus.session ? 'เชื่อมจำลองแล้ว' : 'ยังไม่เชื่อม'}
                </StatusPill>
              </div>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                {lineAuthStatus.session
                  ? `มี LINE mock session: ${lineAuthStatus.session.displayName}`
                  : 'LINE เป็นช่องทางเสริมสำหรับผู้ใช้ที่ใช้ LINE เป็นประจำ แต่ยังไม่เชื่อมต่อจริง'}
              </p>
              <Link to="/app/auth/linking">
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-kaset-deep">
                  <Link2 aria-hidden="true" className="h-4 w-4" />
                  {linkingPlan.recommendedAction}
                </span>
              </Link>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex gap-3">
            <ShieldCheck aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-kaset-deep" />
            <div>
              <h2 className="font-extrabold text-kaset-ink">ข้อมูลในเครื่องนี้</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                มีข้อมูลที่เตรียมสำรองประมาณ {localMemoryCount} รายการ ระบบยังไม่อัปโหลดจริงในเวอร์ชันนี้
              </p>
            </div>
          </div>
          <Link to="/app/auth/sync-preview">
            <span className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-kaset-mint px-4 text-sm font-bold text-kaset-deep transition hover:bg-emerald-100">
              ดูตัวอย่างข้อมูลที่จะสำรอง
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </span>
          </Link>
        </Card>

        <section className="grid gap-3">
          <h2 className="text-lg font-extrabold text-kaset-ink">เลือกวิธีสมัครในอนาคต</h2>
          {authOptions.map((option) => {
            const Icon = option.icon;

            return (
              <Link key={option.label} to={option.href}>
                <Card className="p-4 transition hover:-translate-y-0.5 hover:shadow-soft">
                  <div className="flex items-center gap-3">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
                      <Icon aria-hidden="true" className="h-6 w-6" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-extrabold text-kaset-ink">{option.label}</h3>
                        {option.primary ? <Badge tone="green">แนะนำ</Badge> : null}
                      </div>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{option.description}</p>
                    </div>
                    <ArrowRight aria-hidden="true" className="h-5 w-5 shrink-0 text-slate-400" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </section>

        <Card className="border-amber-200 bg-amber-50 p-4">
          <div className="flex gap-3">
            <CheckCircle2 aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-amber-800" />
            <p className="text-sm leading-6 text-amber-900">
              หน้านี้เป็นต้นแบบ UX เท่านั้น ยังไม่มี OTP, SDK, redirect, Supabase Auth หรือการส่งข้อมูลออกจากเครื่อง
            </p>
          </div>
        </Card>

        <Button className="w-full" disabled>
          ใช้งานต่อแบบ Guest
        </Button>
      </div>
    </div>
  );
}
