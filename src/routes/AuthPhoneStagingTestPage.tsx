import type { LucideIcon } from 'lucide-react';
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  KeyRound,
  Link2,
  Phone,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { StatusPill } from '@/components/ui/StatusPill';
import {
  phoneAuthStagingReviewAreaLabels,
  phoneAuthStagingReviewStatusLabels,
  runPhoneAuthStagingReview,
} from '@/services/auth/phone-auth-staging-review';
import type {
  PhoneAuthStagingReviewChecklistItem,
  PhoneAuthStagingReviewItem,
  PhoneAuthStagingReviewStatus,
} from '@/services/auth/phone-auth-staging-review.types';

const statusTone: Record<PhoneAuthStagingReviewStatus, 'success' | 'warning' | 'danger'> = {
  pass: 'success',
  warn: 'warning',
  block: 'danger',
};

const badgeTone: Record<PhoneAuthStagingReviewStatus, 'green' | 'gold' | 'rose'> = {
  pass: 'green',
  warn: 'gold',
  block: 'rose',
};

function ReviewItemCard({ item }: { item: PhoneAuthStagingReviewItem }) {
  return (
    <Card className="p-4">
      <div className="flex gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
          {item.status === 'pass' ? (
            <CheckCircle2 aria-hidden="true" className="h-5 w-5" />
          ) : item.status === 'warn' ? (
            <AlertTriangle aria-hidden="true" className="h-5 w-5" />
          ) : (
            <ShieldAlert aria-hidden="true" className="h-5 w-5" />
          )}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={badgeTone[item.status]}>{phoneAuthStagingReviewStatusLabels[item.status]}</Badge>
            <Badge tone="neutral">{phoneAuthStagingReviewAreaLabels[item.area]}</Badge>
          </div>
          <h3 className="mt-2 font-extrabold leading-6 text-kaset-ink">{item.title}</h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">{item.detail}</p>
          <p className="mt-2 rounded-lg bg-kaset-mist p-3 text-xs font-bold leading-5 text-kaset-deep">
            หลักฐาน: {item.evidence}
          </p>
          {item.nextAction ? <p className="mt-2 text-xs leading-5 text-slate-500">ขั้นต่อไป: {item.nextAction}</p> : null}
        </div>
      </div>
    </Card>
  );
}

function ChecklistSection({
  icon: Icon,
  items,
  title,
}: {
  icon: LucideIcon;
  items: PhoneAuthStagingReviewChecklistItem[];
  title: string;
}) {
  return (
    <section className="grid gap-3">
      <div className="flex items-center gap-2">
        <Icon aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
        <h2 className="text-lg font-extrabold text-kaset-ink">{title}</h2>
      </div>
      {items.map((entry) => (
        <Card className="p-4" key={entry.id}>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-extrabold text-kaset-ink">{entry.label}</h3>
            <StatusPill tone={entry.requiredBeforeRealOtp ? 'warning' : 'info'}>{entry.requiredBeforeRealOtp ? 'required' : 'optional'}</StatusPill>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600">{entry.detail}</p>
        </Card>
      ))}
    </section>
  );
}

function TextListSection({ icon: Icon, items, title }: { icon: LucideIcon; items: string[]; title: string }) {
  return (
    <section className="grid gap-3">
      <div className="flex items-center gap-2">
        <Icon aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
        <h2 className="text-lg font-extrabold text-kaset-ink">{title}</h2>
      </div>
      {items.map((entry) => (
        <Card className="p-3" key={entry}>
          <p className="text-sm font-bold leading-6 text-kaset-ink">{entry}</p>
        </Card>
      ))}
    </section>
  );
}

export function AuthPhoneStagingTestPage() {
  const review = useMemo(() => runPhoneAuthStagingReview(), []);

  return (
    <div>
      <PageHeader title="Phone Auth staging test" subtitle="M61 review ก่อนทดสอบ Supabase Phone OTP จริงบน staging" showBack />
      <div className="grid gap-5 px-5 pb-6">
        <Card className="overflow-hidden bg-kaset-deep text-white">
          <div className="relative p-5">
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10" />
            <div className="relative flex gap-4">
              <span className="grid h-16 w-16 shrink-0 place-items-center rounded-lg bg-white text-kaset-deep">
                <Phone aria-hidden="true" className="h-8 w-8" />
              </span>
              <div className="min-w-0 flex-1">
                <Badge className="bg-white/15 text-white" tone="green">
                  M61 staging review
                </Badge>
                <h2 className="mt-3 text-3xl font-extrabold leading-9">{review.score}%</h2>
                <p className="mt-1 text-sm font-bold text-emerald-50">{review.levelLabel}</p>
                <p className="mt-2 text-sm leading-6 text-emerald-50/90">
                  แผนนี้ตรวจ staging project, SQL/RLS, public read probe, redirect URL, SMS provider, test phone numbers, ownership และ rollback โดยยังไม่ส่ง OTP จริง
                </p>
              </div>
            </div>
          </div>
        </Card>

        <NoticeBox tone="warning" title="ยังไม่ส่ง OTP จริง">
          canSendRealOtp {String(review.canSendRealOtp)} · noRealSms {String(review.noRealSms)} · noSupabaseWrite {String(review.noSupabaseWrite)} · noCloudSync {String(review.noCloudSync)}
        </NoticeBox>

        <section className="grid grid-cols-3 gap-2">
          <Card className="p-3 text-center">
            <p className="text-xl font-extrabold text-kaset-deep">{review.passedItems.length}</p>
            <p className="text-[11px] font-bold text-slate-500">ready</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-xl font-extrabold text-amber-800">{review.warningItems.length}</p>
            <p className="text-[11px] font-bold text-slate-500">warnings</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-xl font-extrabold text-rose-800">{review.blockerItems.length}</p>
            <p className="text-[11px] font-bold text-slate-500">blockers</p>
          </Card>
        </section>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
              <KeyRound aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-extrabold text-kaset-ink">Current env flag status</h2>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Badge tone={review.flags.enableSupabase ? 'gold' : 'neutral'}>Supabase {review.flags.enableSupabase ? 'on' : 'off'}</Badge>
                <Badge tone={review.flags.enableAuth ? 'rose' : 'green'}>Auth {review.flags.enableAuth ? 'on' : 'off'}</Badge>
                <Badge tone={review.flags.enablePhoneAuth ? 'rose' : 'green'}>Phone {review.flags.enablePhoneAuth ? 'on' : 'off'}</Badge>
                <Badge tone={review.flags.enableCloudSync ? 'rose' : 'green'}>Cloud sync {review.flags.enableCloudSync ? 'on' : 'off'}</Badge>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                mode: {review.flags.phoneAuthMode} · staging label: {review.flags.authStagingLabel} · redirect:{' '}
                {review.flags.supabaseAuthRedirectUrl || 'ยังไม่กำหนด'}
              </p>
              <p className="mt-2 rounded-lg bg-kaset-mist p-3 text-xs font-bold leading-5 text-kaset-deep">
                service-role accepted in frontend: {String(review.serviceRoleKeyAcceptedInFrontend)} · detected:{' '}
                {String(review.serviceRoleKeyDetected)}
              </p>
            </div>
          </div>
        </Card>

        <section className="grid gap-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-extrabold text-kaset-ink">Staging phone auth checklist</h2>
            <StatusPill tone={review.blockerItems.length > 0 ? 'danger' : 'warning'}>{review.levelLabel}</StatusPill>
          </div>
          {review.items.map((entry) => (
            <ReviewItemCard item={entry} key={entry.id} />
          ))}
        </section>

        <section className="grid gap-3">
          <h2 className="text-lg font-extrabold text-kaset-ink">Checklist sections</h2>
          {review.areaSummaries.map((summary) => (
            <Card className="p-4" key={summary.area}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-extrabold text-kaset-ink">{summary.label}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    ready {summary.passed} / warn {summary.warnings} / block {summary.blockers}
                  </p>
                </div>
                <StatusPill tone={statusTone[summary.status]}>{phoneAuthStagingReviewStatusLabels[summary.status]}</StatusPill>
              </div>
            </Card>
          ))}
        </section>

        <ChecklistSection icon={ClipboardList} items={review.dashboardSetupChecklist} title="Required Supabase dashboard setup" />
        <ChecklistSection icon={Link2} items={review.redirectUrlChecklist} title="Redirect URL checklist" />
        <ChecklistSection icon={Smartphone} items={review.smsProviderChecklist} title="SMS provider checklist" />
        <ChecklistSection icon={Phone} items={review.testPhoneNumberPlan} title="Test phone number plan" />
        <TextListSection icon={ShieldCheck} items={review.ownershipRequirements} title="Ownership requirements before sync" />
        <TextListSection icon={RotateCcw} items={review.rollbackSteps} title="Rollback / disable steps" />

        <NoticeBox tone="danger" title="Production ยังถูก block">
          <ul className="grid gap-2">
            {review.blockers.map((blocker) => (
              <li key={blocker}>{blocker}</li>
            ))}
          </ul>
        </NoticeBox>

        <NoticeBox tone="info" icon={ShieldCheck} title="Safety notices">
          <ul className="grid gap-2">
            {review.safetyNotices.map((notice) => (
              <li key={notice}>{notice}</li>
            ))}
          </ul>
        </NoticeBox>

        <div className="grid gap-2 sm:grid-cols-3">
          <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-kaset-deep px-4 text-sm font-extrabold text-white" to="/app/auth/status">
            Auth status
          </Link>
          <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-kaset-mint px-4 text-sm font-extrabold text-kaset-deep" to="/app/auth/phone">
            Phone mock
          </Link>
          <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10" to="/app/supabase-readiness">
            Supabase readiness
          </Link>
        </div>
      </div>
    </div>
  );
}
