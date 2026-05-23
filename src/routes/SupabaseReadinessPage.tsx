import {
  AlertTriangle,
  CheckCircle2,
  CloudUpload,
  ClipboardList,
  Database,
  FileText,
  GitBranch,
  LockKeyhole,
  Phone,
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
import { runPhoneAuthStagingReadinessAudit } from '@/services/auth/phone-auth-staging-readiness';
import { runGuestSyncStagingReadiness } from '@/services/backend/guest-sync-staging-readiness';
import { runEnvSafetyCheck } from '@/services/config/env-safety-check';
import {
  runSupabaseConnectionDryRun,
} from '@/services/supabase/supabase-connection-dry-run';
import {
  runSupabaseReadinessAudit,
  supabaseReadinessAreaLabels,
  supabaseReadinessStatusLabels,
} from '@/services/supabase/supabase-readiness-audit';
import { validateSupabaseSqlDraft } from '@/services/supabase/supabase-sql-draft-validator';
import type {
  SupabaseReadinessItem,
  SupabaseReadinessStatus,
} from '@/services/supabase/supabase-readiness.types';

const statusTone: Record<SupabaseReadinessStatus, 'success' | 'warning' | 'danger'> = {
  pass: 'success',
  warn: 'warning',
  block: 'danger',
};

const badgeTone: Record<SupabaseReadinessStatus, 'green' | 'gold' | 'rose'> = {
  pass: 'green',
  warn: 'gold',
  block: 'rose',
};

function formatAuditTime(value: string) {
  return new Intl.DateTimeFormat('th-TH', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function ReadinessItemCard({ item }: { item: SupabaseReadinessItem }) {
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
            <Badge tone={badgeTone[item.status]}>{supabaseReadinessStatusLabels[item.status]}</Badge>
            <Badge tone="neutral">{supabaseReadinessAreaLabels[item.area]}</Badge>
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

export function SupabaseReadinessPage() {
  const audit = useMemo(() => runSupabaseReadinessAudit(), []);
  const connectionDryRun = useMemo(() => runSupabaseConnectionDryRun(), []);
  const envSafety = useMemo(() => runEnvSafetyCheck(), []);
  const sqlDraft = useMemo(() => validateSupabaseSqlDraft(), []);
  const phoneAuthStaging = useMemo(() => runPhoneAuthStagingReadinessAudit(), []);
  const guestSyncEdge = useMemo(() => runGuestSyncStagingReadiness(), []);

  return (
    <div>
      <PageHeader title="Supabase Staging Readiness" subtitle="เช็กลิสต์ก่อนเชื่อม staging จริงแบบไม่เรียก backend" showBack />
      <div className="grid gap-5 px-5 pb-6">
        <Card className="overflow-hidden bg-kaset-deep text-white">
          <div className="relative p-5">
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10" />
            <div className="relative flex gap-4">
              <span className="grid h-16 w-16 shrink-0 place-items-center rounded-lg bg-white text-kaset-deep">
                <Database aria-hidden="true" className="h-8 w-8" />
              </span>
              <div className="min-w-0 flex-1">
                <Badge className="bg-white/15 text-white" tone="green">
                  local audit
                </Badge>
                <h2 className="mt-3 text-3xl font-extrabold leading-9">{audit.score}%</h2>
                <p className="mt-1 text-sm font-bold text-emerald-50">{audit.levelLabel}</p>
                <p className="mt-2 text-sm leading-6 text-emerald-50/90">
                  Audit นี้อ่านจาก config, feature flags, fixtures, และเอกสารใน repo เท่านั้น ไม่มี network call และยังไม่สร้าง Supabase client จริง
                </p>
              </div>
            </div>
          </div>
        </Card>

        <NoticeBox tone="warning" title="ขอบเขต staging readiness">
          <ul className="grid gap-2">
            {audit.notices.map((notice) => (
              <li key={notice}>{notice}</li>
            ))}
          </ul>
        </NoticeBox>

        <Card className="border-sky-200 bg-sky-50 p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-white text-sky-800">
              <GitBranch aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-extrabold text-sky-950">Supabase staging branch mode</h2>
                <Badge tone="sky">staging/supabase</Badge>
              </div>
              <p className="mt-1 text-sm leading-6 text-sky-900">
                Recommended current branch: `staging/supabase` · current work mode: Supabase staging experiment · no real secrets in repo
              </p>
              <p className="mt-2 rounded-lg bg-white p-3 text-xs font-bold leading-5 text-sky-950">
                Next milestone: M39 Supabase Staging Env Local Setup. ห้ามใส่ service-role key, ห้าม commit `.env.local`, และห้ามใช้ production project
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
              <LockKeyhole aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-extrabold text-kaset-ink">M39 Env Safety</h2>
                <StatusPill tone={envSafety.blockers.length > 0 ? 'danger' : envSafety.warnings.length > 0 ? 'warning' : 'success'}>
                  {envSafety.statusLabel}
                </StatusPill>
              </div>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                ตรวจ `.env.local` เฉพาะในเครื่อง ไม่แสดงค่า secret เต็ม และย้ำว่า Supabase readiness ยังไม่เรียก network โดยค่าเริ่มต้น
              </p>
              <Link className="mt-3 inline-flex text-sm font-extrabold text-kaset-deep" to="/app/env-safety">
                เปิด Env Safety
              </Link>
            </div>
          </div>
        </Card>

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
              <LockKeyhole aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-extrabold text-kaset-ink">ข้อห้ามก่อนเปิด staging</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                ห้ามใส่ service-role key ใน frontend, ห้ามเปิด auth/cloud sync ก่อน RLS ผ่าน staging, และห้ามรัน migration บน production ก่อนมี rollback
              </p>
              <p className="mt-2 text-xs font-bold text-slate-500">ตรวจล่าสุด: {formatAuditTime(audit.generatedAt)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-sky-100 text-sky-800">
              <Database aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-extrabold text-kaset-ink">Staging connection dry run</h2>
                <StatusPill tone={connectionDryRun.health === 'blocked' ? 'danger' : connectionDryRun.health === 'ready_for_staging_check' ? 'success' : 'warning'}>
                  {connectionDryRun.label}
                </StatusPill>
              </div>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                env: {connectionDryRun.env.hasRequiredEnv ? 'detected' : 'missing'} · anon key: {connectionDryRun.env.hasAnonKey ? 'detected' : 'not detected'} · network check: {connectionDryRun.networkProbe.enabled ? 'enabled' : 'disabled'}
              </p>
              <p className="mt-2 rounded-lg bg-kaset-mist p-3 text-xs font-bold leading-5 text-kaset-deep">
                schema applied: {connectionDryRun.networkProbe.schemaStatus === 'not_checked' ? 'unknown/not checked' : connectionDryRun.networkProbe.schemaStatus} · no-write guarantee active
              </p>
              <Link className="mt-3 inline-flex text-sm font-extrabold text-kaset-deep" to="/app/supabase-connection">
                เปิด connection dry run
              </Link>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
              <ClipboardList aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-extrabold text-kaset-ink">SQL staging checklist</h2>
                <StatusPill tone="info">{sqlDraft.expectedTables.length} tables</StatusPill>
              </div>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Execution order: schema SQL first, RLS policy SQL second, then manual verification. ยังไม่ได้รัน SQL จริง
              </p>
              <Link className="mt-3 inline-flex text-sm font-extrabold text-kaset-deep" to="/app/supabase-sql-checklist">
                เปิด SQL staging checklist
              </Link>
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
                <h2 className="font-extrabold text-kaset-ink">Phone OTP staging readiness</h2>
                <StatusPill tone={phoneAuthStaging.blockerItems.length > 0 ? 'danger' : 'warning'}>
                  {phoneAuthStaging.levelLabel}
                </StatusPill>
              </div>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                ยังไม่ส่ง OTP จริง · ยังไม่เปิด auth จริง · score {phoneAuthStaging.score}% · {phoneAuthStaging.warningItems.length} warnings
              </p>
              <Link className="mt-3 inline-flex text-sm font-extrabold text-kaset-deep" to="/app/auth/phone-staging">
                เปิด Phone OTP staging checklist
              </Link>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-sky-100 text-sky-800">
              <CloudUpload aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-extrabold text-kaset-ink">Guest Sync Edge Function readiness</h2>
                <StatusPill tone={guestSyncEdge.blockerItems.length > 0 ? 'danger' : 'warning'}>
                  {guestSyncEdge.levelLabel}
                </StatusPill>
              </div>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                endpoint {guestSyncEdge.endpointName} · edge flag {guestSyncEdge.flags.enableGuestSyncEdge ? 'เปิด' : 'ปิด'} · no endpoint call
              </p>
              <Link className="mt-3 inline-flex text-sm font-extrabold text-kaset-deep" to="/app/guest-sync-edge">
                เปิด Guest Sync Edge staging plan
              </Link>
            </div>
          </div>
        </Card>

        <section className="grid gap-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-extrabold text-kaset-ink">Checklist sections</h2>
            <StatusPill tone={audit.blockerItems.length > 0 ? 'danger' : 'warning'}>{audit.levelLabel}</StatusPill>
          </div>
          {audit.areaSummaries.map((summary) => (
            <Card className="p-4" key={summary.area}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-extrabold text-kaset-ink">{summary.label}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    ready {summary.passed} / warning {summary.warnings} / blocker {summary.blockers}
                  </p>
                </div>
                <StatusPill tone={statusTone[summary.status]}>{supabaseReadinessStatusLabels[summary.status]}</StatusPill>
              </div>
            </Card>
          ))}
        </section>

        {audit.blockerItems.length > 0 ? (
          <section className="grid gap-3">
            <h2 className="text-lg font-extrabold text-kaset-ink">Blockers</h2>
            {audit.blockerItems.map((entry) => (
              <ReadinessItemCard item={entry} key={entry.id} />
            ))}
          </section>
        ) : null}

        <section className="grid gap-3">
          <h2 className="text-lg font-extrabold text-kaset-ink">Warnings</h2>
          {audit.warningItems.map((entry) => (
            <ReadinessItemCard item={entry} key={entry.id} />
          ))}
        </section>

        <section className="grid gap-3">
          <h2 className="text-lg font-extrabold text-kaset-ink">Ready items</h2>
          {audit.passedItems.map((entry) => (
            <ReadinessItemCard item={entry} key={entry.id} />
          ))}
        </section>

        <section className="grid gap-3">
          <div className="flex items-center gap-2">
            <ClipboardList aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <h2 className="text-lg font-extrabold text-kaset-ink">Next safe steps</h2>
          </div>
          {audit.recommendedNextActions.map((action) => (
            <Card className="p-4" key={action.id}>
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone={action.priority === 'now' ? 'rose' : action.priority === 'next' ? 'gold' : 'neutral'}>
                  {action.priority}
                </Badge>
                <h3 className="font-extrabold text-kaset-ink">{action.title}</h3>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">{action.detail}</p>
            </Card>
          ))}
        </section>

        <section className="grid gap-3">
          <div className="flex items-center gap-2">
            <ShieldAlert aria-hidden="true" className="h-5 w-5 text-rose-700" />
            <h2 className="text-lg font-extrabold text-kaset-ink">Production blockers</h2>
          </div>
          {audit.productionBlockers.map((blocker) => (
            <Card className="border-rose-200 bg-rose-50 p-4" key={blocker.id}>
              <Badge tone="rose">{supabaseReadinessAreaLabels[blocker.area]}</Badge>
              <h3 className="mt-2 font-extrabold text-rose-950">{blocker.title}</h3>
              <p className="mt-1 text-sm leading-6 text-rose-900">{blocker.detail}</p>
            </Card>
          ))}
        </section>

        <Card className="p-4">
          <div className="flex gap-3">
            <FileText aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-kaset-deep" />
            <div className="min-w-0 flex-1">
              <h2 className="font-extrabold text-kaset-ink">เส้นทางที่เกี่ยวข้อง</h2>
              <div className="mt-3 grid gap-2">
                <Link className="inline-flex min-h-11 items-center justify-center rounded-full bg-kaset-deep px-4 text-sm font-extrabold text-white" to="/app/admin">
                  เปิด Admin Dashboard
                </Link>
                <Link className="inline-flex min-h-11 items-center justify-center rounded-full bg-kaset-mint px-4 text-sm font-extrabold text-kaset-deep" to="/app/account-preview">
                  เปิด Account Preview
                </Link>
                <Link className="inline-flex min-h-11 items-center justify-center rounded-full bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10" to="/app/guest-sync-edge">
                  เปิด Guest Sync Edge plan
                </Link>
                <Link className="inline-flex min-h-11 items-center justify-center rounded-full bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10" to="/app/qa">
                  เปิด QA Checklist
                </Link>
              </div>
            </div>
          </div>
        </Card>

        <NoticeBox tone="info" icon={ShieldCheck} title="ไม่มีการเชื่อมต่อจริงในหน้านี้">
          หน้านี้เป็น readiness audit ฝั่ง frontend เท่านั้น ไม่เรียก Supabase API, ไม่ fetch schema, ไม่เขียนข้อมูล, ไม่เปิด auth, และไม่เพิ่ม secret ใด ๆ
        </NoticeBox>
      </div>
    </div>
  );
}
