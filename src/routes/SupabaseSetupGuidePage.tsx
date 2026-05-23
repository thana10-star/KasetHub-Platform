import type { LucideIcon } from 'lucide-react';
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  Database,
  FileText,
  KeyRound,
  ListChecks,
  LockKeyhole,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Table2,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { StatusPill } from '@/components/ui/StatusPill';
import { buildSupabaseManualExecutionReview } from '@/services/supabase/supabase-manual-execution-review';
import {
  readSupabaseSetupProgress,
  resetSupabaseSetupProgress,
  setSupabaseSetupProgressStep,
  summarizeSupabaseSetupProgress,
} from '@/services/supabase/supabase-setup-progress';
import type {
  SupabaseSetupProgressStep,
  SupabaseSetupProgressStepId,
} from '@/services/supabase/supabase-setup-progress.types';

const stepIcons: Record<SupabaseSetupProgressStepId, LucideIcon> = {
  projectCreated: Database,
  envAdded: KeyRound,
  schemaSqlRun: FileText,
  rlsSqlRun: ShieldCheck,
  tablesVerified: Table2,
  stagingVerified: CheckCircle2,
};

const sqlOrder = [
  '1. supabase/migrations/0001_kasethub_core_schema.sql',
  '2. supabase/policies/0001_kasethub_rls_policies.sql',
];

function formatUpdatedAt(value: string | null) {
  if (!value) {
    return 'ยังไม่บันทึก progress';
  }

  return new Intl.DateTimeFormat('th-TH', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function ProgressStepCard({
  checked,
  onChange,
  step,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  step: SupabaseSetupProgressStep;
}) {
  const Icon = stepIcons[step.id];

  return (
    <Card className="p-4">
      <label className="flex cursor-pointer items-start gap-3">
        <input
          checked={checked}
          className="mt-1 h-5 w-5 shrink-0 accent-kaset-deep"
          onChange={(event) => onChange(event.target.checked)}
          type="checkbox"
        />
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
          <Icon aria-hidden="true" className="h-5 w-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span className="font-extrabold text-kaset-ink">{step.label}</span>
            <StatusPill tone={checked ? 'success' : 'warning'}>{checked ? 'done' : 'pending'}</StatusPill>
          </span>
          <span className="mt-1 block text-sm leading-6 text-slate-600">{step.detail}</span>
        </span>
      </label>
    </Card>
  );
}

export function SupabaseSetupGuidePage() {
  const [progress, setProgress] = useState(() => readSupabaseSetupProgress());
  const summary = useMemo(() => summarizeSupabaseSetupProgress(progress), [progress]);
  const executionReview = useMemo(() => buildSupabaseManualExecutionReview(progress), [progress]);

  return (
    <div>
      <PageHeader title="Supabase Setup Guide" subtitle="M41 real staging setup walkthrough แบบ manual และ local-only" showBack />
      <div className="grid gap-5 px-5 pb-6">
        <Card className="overflow-hidden bg-kaset-deep text-white">
          <div className="relative p-5">
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10" />
            <div className="relative flex gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-white text-kaset-deep">
                <Database aria-hidden="true" className="h-7 w-7" />
              </span>
              <div className="min-w-0 flex-1">
                <Badge className="bg-white/15 text-white" tone="green">
                  M41 staging only
                </Badge>
                <h2 className="mt-3 text-2xl font-extrabold leading-8">ตั้งค่า Supabase staging แบบคุมความเสี่ยง</h2>
                <p className="mt-2 text-sm leading-6 text-emerald-50/90">
                  หน้านี้เป็นคู่มือและ checklist ในเครื่องเท่านั้น ไม่รัน SQL อัตโนมัติ ไม่เปิด auth ไม่เปิด cloud sync และไม่เขียน backend
                </p>
              </div>
            </div>
          </div>
        </Card>

        <NoticeBox tone="danger" icon={ShieldAlert} title="ห้ามใช้ service-role key">
          ใช้เฉพาะ Project URL และ anon/public key ใน frontend เท่านั้น ห้ามใส่ service-role key ใน `.env.local`, docs, README, public env, หรือ source code
        </NoticeBox>

        <NoticeBox tone="warning" icon={AlertTriangle} title="ใช้ staging เท่านั้น">
          สร้าง project ใหม่ชื่อ `kasethub-staging` หรือชื่อที่ระบุชัดว่าเป็น staging หยุดทันทีถ้าเห็น production data หรือไม่แน่ใจว่า project ถูกต้อง
        </NoticeBox>

        <Card className="border-sky-200 bg-sky-50 p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-white text-sky-800">
              <ClipboardList aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-extrabold text-sky-950">M42 manual execution review</h2>
                <StatusPill tone={executionReview.statusTone}>{executionReview.statusLabel}</StatusPill>
              </div>
              <p className="mt-1 text-sm leading-6 text-sky-900">{executionReview.statusDetail}</p>
              <p className="mt-2 rounded-lg bg-white p-3 text-xs font-bold leading-5 text-sky-950">
                Next safe step: {executionReview.nextSafeStep}
              </p>
              <p className="mt-2 rounded-lg bg-white/70 p-3 text-xs font-bold leading-5 text-sky-950">
                Status choices: {executionReview.statusOptions.map((option) => option.label).join(' / ')}
              </p>
            </div>
          </div>
        </Card>

        <section className="grid grid-cols-3 gap-3">
          <Card className="p-3 text-center">
            <p className="text-2xl font-extrabold text-kaset-deep">{summary.completedCount}/{summary.totalCount}</p>
            <p className="text-[11px] font-bold text-slate-500">steps done</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-2xl font-extrabold text-kaset-deep">{summary.completionPercent}%</p>
            <p className="text-[11px] font-bold text-slate-500">local progress</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-sm font-extrabold leading-5 text-kaset-ink">{formatUpdatedAt(progress.updatedAt)}</p>
            <p className="mt-1 text-[11px] font-bold text-slate-500">last update</p>
          </Card>
        </section>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
              <ListChecks aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-extrabold text-kaset-ink">Next safe step</h2>
                <StatusPill tone={summary.nextStep ? 'warning' : 'success'}>
                  {summary.nextStep ? 'continue manual setup' : 'stop point reached'}
                </StatusPill>
              </div>
              <p className="mt-1 text-sm leading-6 text-slate-600">{summary.nextSafeStep}</p>
              <p className="mt-2 rounded-lg bg-amber-50 p-3 text-xs font-bold leading-5 text-amber-950">
                ยังไม่เปิด auth · ยังไม่เปิด cloud sync · หยุดก่อนเปิด uploads หรือ AI proxy
              </p>
            </div>
          </div>
        </Card>

        <section className="grid gap-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-extrabold text-kaset-ink">Setup progress checklist</h2>
            <Button
              className="min-h-10 px-3 text-xs"
              onClick={() => setProgress(resetSupabaseSetupProgress())}
              variant="secondary"
            >
              <RotateCcw aria-hidden="true" className="h-4 w-4" />
              Reset local
            </Button>
          </div>
          {summary.steps.map((step) => (
            <ProgressStepCard
              checked={progress[step.id]}
              key={step.id}
              onChange={(checked) => setProgress(setSupabaseSetupProgressStep(step.id, checked))}
              step={step}
            />
          ))}
        </section>

        {summary.blockers.length > 0 ? (
          <NoticeBox tone="warning" title="Current blockers">
            <ul className="grid gap-2">
              {summary.blockers.map((blocker) => (
                <li key={blocker}>{blocker}</li>
              ))}
            </ul>
          </NoticeBox>
        ) : null}

        <section className="grid gap-3">
          <div className="flex items-center gap-2">
            <ClipboardList aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <h2 className="text-lg font-extrabold text-kaset-ink">SQL execution order</h2>
          </div>
          {sqlOrder.map((item) => (
            <Card className="p-4" key={item}>
              <p className="break-words text-sm font-extrabold leading-6 text-kaset-ink">{item}</p>
            </Card>
          ))}
          <NoticeBox tone="danger" title="หยุดถ้า SQL Editor error">
            อย่ารันซ้ำแบบเดาสุ่ม ให้เก็บ screenshot/error message แล้วตรวจ SQL draft หรือ rollback plan ก่อนทำต่อ
          </NoticeBox>
        </section>

        <Card className="p-4">
          <div className="flex gap-3">
            <LockKeyhole aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-kaset-deep" />
            <div className="min-w-0 flex-1">
              <h2 className="font-extrabold text-kaset-ink">Safe local .env.local</h2>
              <div className="mt-3 grid gap-2 text-sm font-bold leading-6 text-slate-700">
                <p className="rounded-lg bg-kaset-mist p-3">VITE_SUPABASE_URL=...</p>
                <p className="rounded-lg bg-kaset-mist p-3">VITE_SUPABASE_ANON_KEY=...</p>
                <p className="rounded-lg bg-kaset-mist p-3">VITE_ENABLE_SUPABASE=true</p>
                <p className="rounded-lg bg-kaset-mist p-3">VITE_ENABLE_SUPABASE_DRY_RUN_NETWORK_CHECK=false</p>
                <p className="rounded-lg bg-kaset-mist p-3">VITE_ENABLE_AUTH=false</p>
                <p className="rounded-lg bg-kaset-mist p-3">VITE_ENABLE_CLOUD_SYNC=false</p>
              </div>
            </div>
          </div>
        </Card>

        <section className="grid gap-3">
          <h2 className="text-lg font-extrabold text-kaset-ink">Manual verification</h2>
          {[
            'tables exist in Table Editor',
            'RLS enabled on sensitive/user-owned tables',
            'indexes, triggers, constraints, and foreign keys exist',
            'no public insert/update/delete policy exists',
            'auth, cloud sync, uploads, and AI proxy remain disabled',
          ].map((item) => (
            <Card className="p-3" key={item}>
              <p className="text-sm font-bold leading-6 text-kaset-ink">{item}</p>
            </Card>
          ))}
        </section>

        <NoticeBox tone="danger" title="หยุดก่อนเปิด auth/cloud sync">
          STOP POINT: หยุดหลัง verification รอบนี้ ห้ามเปิด auth, cloud sync, uploads, AI proxy, Edge Functions หรือ backend writes จนกว่าจะมี milestone ถัดไป
        </NoticeBox>

        <section className="grid gap-3">
          <div className="flex items-center gap-2">
            <ClipboardList aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <h2 className="text-lg font-extrabold text-kaset-ink">M42 evidence needed</h2>
          </div>
          {executionReview.requestedEvidence.map((item) => (
            <Card className="p-3" key={item}>
              <p className="text-sm font-bold leading-6 text-kaset-ink">{item}</p>
            </Card>
          ))}
        </section>

        <section className="grid gap-3">
          <div className="flex items-center gap-2">
            <ListChecks aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <h2 className="text-lg font-extrabold text-kaset-ink">M42 review status meanings</h2>
          </div>
          {executionReview.statusOptions.map((option) => (
            <Card className="p-3" key={option.status}>
              <div className="flex flex-wrap items-center gap-2">
                <StatusPill tone={option.status === 'success' ? 'success' : option.status === 'blocked' ? 'danger' : 'warning'}>
                  {option.label}
                </StatusPill>
                <p className="text-sm font-bold leading-6 text-kaset-ink">{option.detail}</p>
              </div>
            </Card>
          ))}
        </section>

        <Card className="p-4">
          <div className="grid gap-2">
            <Link className="inline-flex min-h-11 items-center justify-center rounded-full bg-kaset-deep px-4 text-sm font-extrabold text-white" to="/app/supabase-readiness">
              เปิด Supabase readiness
            </Link>
            <Link className="inline-flex min-h-11 items-center justify-center rounded-full bg-kaset-mint px-4 text-sm font-extrabold text-kaset-deep" to="/app/supabase-connection">
              เปิด connection dry run
            </Link>
            <Link className="inline-flex min-h-11 items-center justify-center rounded-full bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10" to="/app/supabase-sql-checklist">
              เปิด SQL checklist
            </Link>
            <Link className="inline-flex min-h-11 items-center justify-center rounded-full bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10" to="/app/env-safety">
              เปิด Env Safety
            </Link>
            <Link className="inline-flex min-h-11 items-center justify-center rounded-full bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10" to="/app/admin">
              กลับ Admin Dashboard
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
