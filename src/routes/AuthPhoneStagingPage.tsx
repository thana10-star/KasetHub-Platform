import type { LucideIcon } from 'lucide-react';
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  KeyRound,
  LockKeyhole,
  Phone,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { StatusPill } from '@/components/ui/StatusPill';
import {
  phoneAuthStagingAreaLabels,
  phoneAuthStagingStatusLabels,
  runPhoneAuthStagingReadinessAudit,
} from '@/services/auth/phone-auth-staging-readiness';
import type {
  PhoneAuthStagingReadinessItem,
  PhoneAuthStagingStatus,
} from '@/services/auth/phone-auth-staging.types';

const statusTone: Record<PhoneAuthStagingStatus, 'success' | 'warning' | 'danger'> = {
  pass: 'success',
  warn: 'warning',
  block: 'danger',
};

const badgeTone: Record<PhoneAuthStagingStatus, 'green' | 'gold' | 'rose'> = {
  pass: 'green',
  warn: 'gold',
  block: 'rose',
};

function ChecklistCard({ item }: { item: PhoneAuthStagingReadinessItem }) {
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
            <Badge tone={badgeTone[item.status]}>{phoneAuthStagingStatusLabels[item.status]}</Badge>
            <Badge tone="neutral">{phoneAuthStagingAreaLabels[item.area]}</Badge>
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

function ListSection({
  icon: Icon,
  items,
  title,
}: {
  icon: LucideIcon;
  items: string[];
  title: string;
}) {
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

export function AuthPhoneStagingPage() {
  const audit = useMemo(() => runPhoneAuthStagingReadinessAudit(), []);

  return (
    <div>
      <PageHeader title="Phone OTP Staging Plan" subtitle="เช็กลิสต์ก่อนเปิด Supabase Auth เบอร์โทรจริงบน staging" showBack />
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
                  staging checklist
                </Badge>
                <h2 className="mt-3 text-3xl font-extrabold leading-9">{audit.score}%</h2>
                <p className="mt-1 text-sm font-bold text-emerald-50">{audit.levelLabel}</p>
                <p className="mt-2 text-sm leading-6 text-emerald-50/90">
                  หน้านี้ใช้ตรวจแผน phone OTP เท่านั้น ยังไม่ส่ง OTP จริง ยังไม่เปิด auth จริง ไม่เขียน Supabase และไม่เรียก network
                </p>
              </div>
            </div>
          </div>
        </Card>

        <NoticeBox tone="warning" title="ขอบเขต M28">
          <ul className="grid gap-2">
            {audit.notices.map((notice) => (
              <li key={notice}>{notice}</li>
            ))}
          </ul>
        </NoticeBox>

        <section className="grid grid-cols-3 gap-2">
          <Card className="p-3 text-center">
            <p className="text-xl font-extrabold text-kaset-deep">{audit.passedItems.length}</p>
            <p className="text-[11px] font-bold text-slate-500">ready</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-xl font-extrabold text-amber-800">{audit.warningItems.length}</p>
            <p className="text-[11px] font-bold text-slate-500">warnings</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-xl font-extrabold text-rose-800">{audit.blockerItems.length}</p>
            <p className="text-[11px] font-bold text-slate-500">blockers</p>
          </Card>
        </section>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
              <KeyRound aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-extrabold text-kaset-ink">Flags ที่เห็นตอนนี้</h2>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Badge tone={audit.flags.enableSupabase ? 'gold' : 'neutral'}>Supabase {audit.flags.enableSupabase ? 'on' : 'off'}</Badge>
                <Badge tone={audit.flags.enableAuth ? 'rose' : 'green'}>Auth {audit.flags.enableAuth ? 'on' : 'off'}</Badge>
                <Badge tone={audit.flags.enablePhoneAuth ? 'rose' : 'green'}>Phone {audit.flags.enablePhoneAuth ? 'on' : 'off'}</Badge>
                <Badge tone={audit.flags.enableCloudSync ? 'rose' : 'green'}>Cloud sync {audit.flags.enableCloudSync ? 'on' : 'off'}</Badge>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                mode: {audit.flags.phoneAuthMode} · label: {audit.flags.authStagingLabel} · redirect:{' '}
                {audit.flags.authRedirectUrl || 'ยังไม่กำหนด'}
              </p>
            </div>
          </div>
        </Card>

        <section className="grid gap-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-extrabold text-kaset-ink">Readiness checklist</h2>
            <StatusPill tone={audit.blockerItems.length > 0 ? 'danger' : 'warning'}>{audit.levelLabel}</StatusPill>
          </div>
          {audit.items.map((entry) => (
            <ChecklistCard item={entry} key={entry.id} />
          ))}
        </section>

        <section className="grid gap-3">
          <h2 className="text-lg font-extrabold text-kaset-ink">Checklist sections</h2>
          {audit.areaSummaries.map((summary) => (
            <Card className="p-4" key={summary.area}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-extrabold text-kaset-ink">{summary.label}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    ready {summary.passed} / warn {summary.warnings} / block {summary.blockers}
                  </p>
                </div>
                <StatusPill tone={statusTone[summary.status]}>{phoneAuthStagingStatusLabels[summary.status]}</StatusPill>
              </div>
            </Card>
          ))}
        </section>

        <ListSection icon={ClipboardList} items={audit.stagingSetupSteps} title="ขั้นตอน setup บน staging" />
        <ListSection icon={KeyRound} items={audit.requiredFutureFlags} title="Flags ที่จะใช้ภายหลัง" />
        <ListSection icon={AlertTriangle} items={audit.smsCostWarnings} title="คำเตือนค่า SMS และ rate limit" />
        <ListSection icon={LockKeyhole} items={audit.sessionOwnershipRules} title="Session ownership ก่อน sync" />
        <ListSection icon={RotateCcw} items={audit.rollbackChecklist} title="Rollback checklist" />

        <NoticeBox tone="danger" title="Production ยังถูกบล็อก">
          <ul className="grid gap-2">
            {audit.productionBlockers.map((blocker) => (
              <li key={blocker}>{blocker}</li>
            ))}
          </ul>
        </NoticeBox>

        <Card className="p-4">
          <div className="grid gap-2">
            <Link className="inline-flex min-h-11 items-center justify-center rounded-full bg-kaset-deep px-4 text-sm font-extrabold text-white" to="/app/auth/phone">
              เปิด Phone Auth mock
            </Link>
            <Link className="inline-flex min-h-11 items-center justify-center rounded-full bg-kaset-mint px-4 text-sm font-extrabold text-kaset-deep" to="/app/auth/status">
              เปิด Auth status
            </Link>
            <Link className="inline-flex min-h-11 items-center justify-center rounded-full bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10" to="/app/supabase-readiness">
              เปิด Supabase readiness
            </Link>
            <Link className="inline-flex min-h-11 items-center justify-center rounded-full bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10" to="/app/admin">
              เปิด Admin Dashboard
            </Link>
          </div>
        </Card>

        <NoticeBox tone="info" icon={ShieldCheck} title="ทดสอบแบบไม่เขียนข้อมูล">
          การกดลิงก์ในหน้านี้ไม่เปิด Supabase Auth ไม่ส่ง SMS ไม่สร้าง session จริง และไม่แตะข้อมูลบน server
        </NoticeBox>
      </div>
    </div>
  );
}
