import {
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  Database,
  KeyRound,
  LockKeyhole,
  ShieldAlert,
  ShieldCheck,
  ToggleLeft,
} from 'lucide-react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { StatusPill } from '@/components/ui/StatusPill';
import { runEnvSafetyCheck } from '@/services/config/env-safety-check';
import type { EnvSafetyItem, EnvSafetySeverity, EnvSafetyStatus } from '@/services/config/env-safety.types';
import { buildSupabaseStagingProjectChecklist } from '@/services/supabase/supabase-staging-project-checklist';

const statusTone: Record<EnvSafetyStatus, 'success' | 'warning' | 'danger' | 'info' | 'neutral'> = {
  mock_only_safe: 'info',
  ready_for_local_staging_env: 'success',
  needs_attention: 'warning',
  blocked: 'danger',
};

const severityTone: Record<EnvSafetySeverity, 'green' | 'gold' | 'rose' | 'sky' | 'neutral'> = {
  safe: 'green',
  info: 'sky',
  warning: 'gold',
  blocker: 'rose',
};

const severityIcon: Record<EnvSafetySeverity, typeof CheckCircle2> = {
  safe: CheckCircle2,
  info: ShieldCheck,
  warning: AlertTriangle,
  blocker: ShieldAlert,
};

function SafetyItemCard({ item }: { item: EnvSafetyItem }) {
  const Icon = severityIcon[item.severity];

  return (
    <Card className="p-4">
      <div className="flex gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
          <Icon aria-hidden="true" className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={severityTone[item.severity]}>{item.severity}</Badge>
            <h3 className="font-extrabold text-kaset-ink">{item.title}</h3>
          </div>
          <p className="mt-1 text-sm leading-6 text-slate-600">{item.detail}</p>
          <p className="mt-2 rounded-lg bg-kaset-mist p-3 text-xs font-bold leading-5 text-kaset-deep">{item.recommendation}</p>
        </div>
      </div>
    </Card>
  );
}

function FlagCard({ enabled, label }: { enabled: boolean; label: string }) {
  return (
    <Card className="p-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <ToggleLeft aria-hidden="true" className="h-4 w-4 shrink-0 text-kaset-deep" />
          <p className="truncate text-sm font-extrabold text-kaset-ink">{label}</p>
        </div>
        <Badge tone={enabled ? 'gold' : 'neutral'}>{enabled ? 'เปิด' : 'ปิด'}</Badge>
      </div>
    </Card>
  );
}

export function EnvSafetyPage() {
  const safety = useMemo(() => runEnvSafetyCheck(), []);
  const m40Checklist = useMemo(() => buildSupabaseStagingProjectChecklist(), []);

  return (
    <div>
      <PageHeader title="Env Safety" subtitle="ตรวจค่า staging env ในเครื่องแบบไม่เรียก network" showBack />
      <div className="grid gap-5 px-5 pb-6">
        <Card className="overflow-hidden bg-kaset-deep text-white">
          <div className="relative p-5">
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10" />
            <div className="relative flex gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-white text-kaset-deep">
                <LockKeyhole aria-hidden="true" className="h-7 w-7" />
              </span>
              <div className="min-w-0">
                <Badge className="bg-white/15 text-white" tone="green">
                  M39 local setup
                </Badge>
                <h2 className="mt-3 text-2xl font-extrabold leading-8">{safety.statusLabel}</h2>
                <p className="mt-2 text-sm leading-6 text-emerald-50/90">{safety.summary}</p>
              </div>
            </div>
          </div>
        </Card>

        <NoticeBox tone="danger" icon={ShieldAlert} title="ห้ามใส่ service-role key ใน frontend">
          หน้านี้ไม่แสดงค่า secret เต็ม และใช้เฉพาะค่า Vite public env ที่ frontend มองเห็นอยู่แล้ว ห้ามใส่ service-role key,
          SMS provider secret, AI provider key, หรือ production secret ใน `.env.local`, `.env.example`, docs, หรือ Cloudflare public env
        </NoticeBox>

        <Card className="border-amber-200 bg-amber-50 p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-white text-amber-800">
              <ClipboardList aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-extrabold text-amber-950">M40 manual project + SQL prep</h2>
                <StatusPill tone="warning">คู่มือเท่านั้น</StatusPill>
              </div>
              <p className="mt-1 text-sm leading-6 text-amber-900">
                ขั้นตอนนี้ยังเป็นคู่มือ ยังไม่ได้เชื่อมต่อจริง ใช้ project {m40Checklist.recommendedProjectName} และรัน SQL เฉพาะ staging เท่านั้น
              </p>
              <p className="mt-2 rounded-lg bg-white p-3 text-xs font-bold leading-5 text-amber-950">
                อ่าน {m40Checklist.docLinks[0].path} และ {m40Checklist.docLinks[1].path} ก่อนนำค่า Supabase มาใส่ใน `.env.local`
              </p>
              <Link className="mt-3 inline-flex text-sm font-extrabold text-amber-950" to="/app/supabase-sql-checklist">
                เปิด SQL run prep checklist
              </Link>
            </div>
          </div>
        </Card>

        <section className="grid grid-cols-2 gap-3">
          <Card className="p-4">
            <Database aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <p className="mt-3 text-lg font-extrabold text-kaset-ink">{safety.values.hasSupabaseUrl ? 'พบ' : 'ไม่พบ'}</p>
            <p className="mt-1 text-xs font-bold leading-4 text-slate-500">Supabase URL</p>
          </Card>
          <Card className="p-4">
            <KeyRound aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <p className="mt-3 text-lg font-extrabold text-kaset-ink">{safety.values.hasSupabaseAnonKey ? 'พบ' : 'ไม่พบ'}</p>
            <p className="mt-1 text-xs font-bold leading-4 text-slate-500">anon key</p>
          </Card>
          <Card className="p-4">
            <ShieldAlert aria-hidden="true" className="h-5 w-5 text-rose-700" />
            <p className="mt-3 text-lg font-extrabold text-kaset-ink">{safety.values.serviceRoleLikeKeyDetected ? 'พบ' : 'ไม่พบ'}</p>
            <p className="mt-1 text-xs font-bold leading-4 text-slate-500">service-role pattern</p>
          </Card>
          <Card className="p-4">
            <AlertTriangle aria-hidden="true" className="h-5 w-5 text-amber-800" />
            <p className="mt-3 text-lg font-extrabold text-kaset-ink">{safety.flags.enableDryRunNetworkCheck ? 'เปิด' : 'ปิด'}</p>
            <p className="mt-1 text-xs font-bold leading-4 text-slate-500">network check</p>
          </Card>
        </section>

        <Card className="p-4">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-extrabold text-kaset-ink">Masked env preview</h2>
            <StatusPill tone={statusTone[safety.status]}>{safety.statusLabel}</StatusPill>
          </div>
          <div className="mt-3 grid gap-2">
            <p className="rounded-lg bg-kaset-mist p-3 text-sm font-bold leading-6 text-slate-700">
              VITE_SUPABASE_URL: {safety.values.maskedSupabaseUrl}
            </p>
            <p className="rounded-lg bg-kaset-mist p-3 text-sm font-bold leading-6 text-slate-700">
              VITE_SUPABASE_ANON_KEY: {safety.values.maskedAnonKey}
            </p>
          </div>
          <p className="mt-3 text-xs font-bold leading-5 text-slate-500">ไม่แสดงค่า secret เต็ม และไม่ควรใส่ค่า privileged secret ใน frontend</p>
        </Card>

        <section className="grid gap-3">
          <h2 className="text-lg font-extrabold text-kaset-ink">Feature flags</h2>
          <div className="grid gap-2">
            <FlagCard enabled={safety.flags.enableSupabase} label="VITE_ENABLE_SUPABASE" />
            <FlagCard enabled={safety.flags.enableAuth} label="VITE_ENABLE_AUTH" />
            <FlagCard enabled={safety.flags.enableCloudSync} label="VITE_ENABLE_CLOUD_SYNC" />
            <FlagCard enabled={safety.flags.enableDryRunNetworkCheck} label="VITE_ENABLE_SUPABASE_DRY_RUN_NETWORK_CHECK" />
            <FlagCard enabled={safety.flags.enableGuestSyncBackend} label="VITE_ENABLE_GUEST_SYNC_BACKEND" />
            <FlagCard enabled={safety.flags.enableGuestSyncEdge} label="VITE_ENABLE_GUEST_SYNC_EDGE" />
            <FlagCard enabled={safety.flags.enablePhoneAuth} label="VITE_ENABLE_PHONE_AUTH" />
            <FlagCard enabled={safety.flags.enableLineAuth} label="VITE_ENABLE_LINE_AUTH" />
          </div>
        </section>

        <Card className="p-4">
          <h2 className="font-extrabold text-kaset-ink">Recommended safe values for M39</h2>
          <div className="mt-3 grid gap-2">
            {safety.safeRecommendedValues.map((value) => (
              <p className="rounded-lg bg-kaset-mist p-3 text-sm font-bold leading-6 text-slate-700" key={value}>
                {value}
              </p>
            ))}
          </div>
        </Card>

        {safety.blockers.length > 0 ? (
          <section className="grid gap-3">
            <h2 className="text-lg font-extrabold text-rose-900">Blockers</h2>
            {safety.blockers.map((entry) => (
              <SafetyItemCard item={entry} key={entry.id} />
            ))}
          </section>
        ) : null}

        {safety.warnings.length > 0 ? (
          <section className="grid gap-3">
            <h2 className="text-lg font-extrabold text-amber-900">Warnings</h2>
            {safety.warnings.map((entry) => (
              <SafetyItemCard item={entry} key={entry.id} />
            ))}
          </section>
        ) : null}

        <section className="grid gap-3">
          <h2 className="text-lg font-extrabold text-kaset-ink">Ready / notes</h2>
          {[...safety.readyItems, ...safety.notes].map((entry) => (
            <SafetyItemCard item={entry} key={entry.id} />
          ))}
        </section>

        <Card className="p-4">
          <div className="grid gap-2">
            <Link className="inline-flex min-h-11 items-center justify-center rounded-full bg-kaset-deep px-4 text-sm font-extrabold text-white" to="/app/supabase-connection">
              เปิด Supabase connection
            </Link>
            <Link className="inline-flex min-h-11 items-center justify-center rounded-full bg-kaset-mint px-4 text-sm font-extrabold text-kaset-deep" to="/app/supabase-readiness">
              เปิด Supabase readiness
            </Link>
            <Link className="inline-flex min-h-11 items-center justify-center rounded-full bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10" to="/app/admin">
              กลับ Admin
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
