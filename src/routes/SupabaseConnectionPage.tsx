import {
  AlertTriangle,
  CheckCircle2,
  CloudUpload,
  Database,
  KeyRound,
  ListChecks,
  LockKeyhole,
  Phone,
  ShieldCheck,
  ToggleLeft,
  WifiOff,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { StatusPill } from '@/components/ui/StatusPill';
import { runPhoneAuthStagingReadinessAudit } from '@/services/auth/phone-auth-staging-readiness';
import { runGuestSyncStagingReadiness } from '@/services/backend/guest-sync-staging-readiness';
import {
  runSupabaseConnectionDryRun,
  runSupabasePublicReadProbe,
} from '@/services/supabase/supabase-connection-dry-run';
import type {
  SupabaseConnectionHealth,
  SupabasePublicReadProbeResult,
} from '@/services/supabase/supabase-connection.types';

const healthTone: Record<SupabaseConnectionHealth, 'success' | 'warning' | 'danger' | 'info'> = {
  safe_local: 'info',
  ready_for_staging_check: 'success',
  warning: 'warning',
  blocked: 'danger',
};

const booleanLabel = {
  yes: 'พบ',
  no: 'ไม่พบ',
};

function FlagRow({ enabled, label, note }: { enabled: boolean; label: string; note: string }) {
  return (
    <Card className="p-3">
      <div className="flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
          <ToggleLeft aria-hidden="true" className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <p className="font-extrabold text-kaset-ink">{label}</p>
            <Badge tone={enabled ? 'green' : 'neutral'}>{enabled ? 'เปิด' : 'ปิด'}</Badge>
          </div>
          <p className="mt-1 text-sm leading-6 text-slate-600">{note}</p>
        </div>
      </div>
    </Card>
  );
}

function ProbeStatusCard({ probe }: { probe: SupabasePublicReadProbeResult | null }) {
  if (!probe) {
    return (
      <Card className="p-4">
        <div className="flex gap-3">
          <WifiOff aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-kaset-deep" />
          <div>
            <h2 className="font-extrabold text-kaset-ink">Network probe</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              ยังไม่ได้รัน network check ค่าเริ่มต้นคือปิด เพื่อให้แอปทำงานได้แม้ไม่มี `.env.local`
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="flex gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
          {probe.schemaStatus === 'public_probe_ok' ? (
            <CheckCircle2 aria-hidden="true" className="h-5 w-5" />
          ) : (
            <AlertTriangle aria-hidden="true" className="h-5 w-5" />
          )}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-extrabold text-kaset-ink">Network probe result</h2>
            <Badge tone={probe.schemaStatus === 'public_probe_ok' ? 'green' : 'gold'}>{probe.schemaStatus}</Badge>
          </div>
          <p className="mt-1 text-sm leading-6 text-slate-600">{probe.message}</p>
          {probe.errorCode ? <p className="mt-2 text-xs font-bold text-slate-500">error code: {probe.errorCode}</p> : null}
        </div>
      </div>
    </Card>
  );
}

export function SupabaseConnectionPage() {
  const dryRun = useMemo(() => runSupabaseConnectionDryRun(), []);
  const phoneAuthStaging = useMemo(() => runPhoneAuthStagingReadinessAudit(), []);
  const guestSyncEdge = useMemo(() => runGuestSyncStagingReadiness(), []);
  const [probeResult, setProbeResult] = useState<SupabasePublicReadProbeResult | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (!dryRun.networkProbe.allowedByGuards) {
      return;
    }

    runSupabasePublicReadProbe()
      .then((result) => {
        if (!cancelled) {
          setProbeResult(result);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setProbeResult({
            attempted: true,
            schemaStatus: 'unknown_error',
            message: 'network probe เกิดข้อผิดพลาด แต่ไม่มีการเขียนข้อมูล',
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [dryRun.networkProbe.allowedByGuards]);

  return (
    <div>
      <PageHeader title="Supabase Connection Dry Run" subtitle="ทดสอบขอบเขต staging แบบไม่เขียนข้อมูล" showBack />
      <div className="grid gap-5 px-5 pb-6">
        <Card className="overflow-hidden bg-kaset-deep text-white">
          <div className="relative p-5">
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10" />
            <div className="relative flex gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-white text-kaset-deep">
                <Database aria-hidden="true" className="h-7 w-7" />
              </span>
              <div className="min-w-0">
                <Badge className="bg-white/15 text-white" tone="green">
                  no-write dry run
                </Badge>
                <h2 className="mt-3 text-2xl font-extrabold leading-8">{dryRun.label}</h2>
                <p className="mt-2 text-sm leading-6 text-emerald-50/90">{dryRun.description}</p>
              </div>
            </div>
          </div>
        </Card>

        <NoticeBox tone="warning" title="ทดสอบแบบไม่เขียนข้อมูล">
          หน้านี้ใช้เฉพาะ anon-key/client-safe checks ไม่มี service-role key ไม่มี auth ไม่มี cloud sync ไม่มี upload และไม่มี insert/update/delete
        </NoticeBox>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
              <ShieldCheck aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-extrabold text-kaset-ink">Dry-run result</h2>
                <StatusPill tone={healthTone[dryRun.health]}>{dryRun.code}</StatusPill>
              </div>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                schema applied: {dryRun.networkProbe.schemaStatus === 'not_checked' ? 'unknown/not checked' : dryRun.networkProbe.schemaStatus}
              </p>
              <p className="mt-2 text-xs font-bold text-slate-500">
                network check: {dryRun.networkProbe.enabled ? 'เปิดด้วย flag' : 'ปิดตามค่าเริ่มต้น'} · target: {dryRun.networkProbe.targetLabel}
              </p>
            </div>
          </div>
        </Card>

        <section className="grid grid-cols-2 gap-3">
          <Card className="p-3 text-center">
            <KeyRound aria-hidden="true" className="mx-auto h-5 w-5 text-kaset-deep" />
            <p className="mt-2 text-lg font-extrabold text-kaset-ink">{dryRun.env.hasUrl ? booleanLabel.yes : booleanLabel.no}</p>
            <p className="text-[11px] font-bold text-slate-500">Supabase URL</p>
          </Card>
          <Card className="p-3 text-center">
            <KeyRound aria-hidden="true" className="mx-auto h-5 w-5 text-kaset-deep" />
            <p className="mt-2 text-lg font-extrabold text-kaset-ink">{dryRun.env.hasAnonKey ? booleanLabel.yes : booleanLabel.no}</p>
            <p className="text-[11px] font-bold text-slate-500">anon key</p>
          </Card>
          <Card className="p-3 text-center">
            <LockKeyhole aria-hidden="true" className="mx-auto h-5 w-5 text-kaset-deep" />
            <p className="mt-2 text-lg font-extrabold text-kaset-ink">{dryRun.env.serviceRoleLikeKeyDetected ? 'พบ' : 'ไม่พบ'}</p>
            <p className="text-[11px] font-bold text-slate-500">service-role pattern</p>
          </Card>
          <Card className="p-3 text-center">
            <WifiOff aria-hidden="true" className="mx-auto h-5 w-5 text-kaset-deep" />
            <p className="mt-2 text-lg font-extrabold text-kaset-ink">{dryRun.networkProbe.enabled ? 'เปิด' : 'ปิด'}</p>
            <p className="text-[11px] font-bold text-slate-500">network check</p>
          </Card>
        </section>

        <section className="grid gap-3">
          <h2 className="text-lg font-extrabold text-kaset-ink">Current feature flags</h2>
          <FlagRow enabled={dryRun.flags.enableSupabase} label="VITE_ENABLE_SUPABASE" note="เปิดได้เฉพาะตอน staging พร้อม และยังไม่แปลว่า auth/cloud sync พร้อม" />
          <FlagRow enabled={dryRun.flags.enableAuth} label="VITE_ENABLE_AUTH" note="M26 ยังต้องปิด real auth ไว้ก่อน" />
          <FlagRow enabled={dryRun.flags.enableCloudSync} label="VITE_ENABLE_CLOUD_SYNC" note="M26 ยังต้องปิด cloud sync และไม่ upload Guest Memory" />
          <FlagRow enabled={dryRun.flags.enableDryRunNetworkCheck} label="VITE_ENABLE_SUPABASE_DRY_RUN_NETWORK_CHECK" note="ค่าเริ่มต้นปิด ถ้าเปิดต้องอ่านเฉพาะ public/read-only target" />
          <FlagRow enabled={guestSyncEdge.flags.enableGuestSyncEdge} label="VITE_ENABLE_GUEST_SYNC_EDGE" note="M29 ยังต้องปิดไว้ ไม่มี Edge Function endpoint call และไม่มี cloud write" />
        </section>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
              <Phone aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-extrabold text-kaset-ink">Phone OTP staging plan</h2>
                <StatusPill tone={phoneAuthStaging.blockerItems.length > 0 ? 'danger' : 'warning'}>
                  {phoneAuthStaging.levelLabel}
                </StatusPill>
              </div>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                connection dry run ยังไม่เปิด auth และยังไม่ส่ง OTP จริง ต้องผ่าน staging setup ก่อน
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
                <h2 className="font-extrabold text-kaset-ink">Guest Sync Edge Function plan</h2>
                <StatusPill tone={guestSyncEdge.blockerItems.length > 0 ? 'danger' : 'warning'}>
                  {guestSyncEdge.levelLabel}
                </StatusPill>
              </div>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                connection dry run ยังไม่เรียก {guestSyncEdge.endpointName} และยังไม่เปิด cloud sync ต้องรอ session ownership และ RLS verification
              </p>
              <Link className="mt-3 inline-flex text-sm font-extrabold text-kaset-deep" to="/app/guest-sync-edge">
                เปิด Guest Sync Edge staging plan
              </Link>
            </div>
          </div>
        </Card>

        <ProbeStatusCard probe={probeResult} />

        <section className="grid gap-3">
          <div className="flex items-center gap-2">
            <ListChecks aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <h2 className="text-lg font-extrabold text-kaset-ink">No-write guarantee</h2>
          </div>
          {dryRun.noWriteGuarantees.map((guarantee) => (
            <Card className="p-3" key={guarantee}>
              <p className="text-sm font-bold leading-6 text-kaset-ink">{guarantee}</p>
            </Card>
          ))}
        </section>

        {dryRun.warnings.length > 0 ? (
          <NoticeBox tone={dryRun.health === 'blocked' ? 'danger' : 'warning'} title="Warnings">
            <ul className="grid gap-2">
              {dryRun.warnings.map((warning) => (
                <li key={warning}>{warning}</li>
              ))}
            </ul>
          </NoticeBox>
        ) : null}

        <section className="grid gap-3">
          <h2 className="text-lg font-extrabold text-kaset-ink">Manual staging checklist</h2>
          {dryRun.nextSteps.map((step) => (
            <Card className="p-3" key={step}>
              <p className="text-sm font-bold leading-6 text-kaset-ink">{step}</p>
            </Card>
          ))}
          <Card className="p-4">
            <p className="text-sm leading-6 text-slate-600">
              ถ้า schema ยังไม่ applied ให้แสดงเป็น “schema not applied yet” และกลับไปใช้ `docs/SUPABASE_STAGING_SETUP_GUIDE.md` เพื่อรัน SQL/RLS บน staging ด้วยมือ
            </p>
          </Card>
        </section>

        <Card className="p-4">
          <div className="grid gap-2">
            <Link className="inline-flex min-h-11 items-center justify-center rounded-full bg-kaset-deep px-4 text-sm font-extrabold text-white" to="/app/supabase-readiness">
              เปิด Supabase readiness
            </Link>
            <Link className="inline-flex min-h-11 items-center justify-center rounded-full bg-kaset-mint px-4 text-sm font-extrabold text-kaset-deep" to="/app/admin">
              กลับ Admin Dashboard
            </Link>
            <Link className="inline-flex min-h-11 items-center justify-center rounded-full bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10" to="/app/supabase-sql-checklist">
              เปิด SQL staging checklist
            </Link>
            <Link className="inline-flex min-h-11 items-center justify-center rounded-full bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10" to="/app/auth/phone-staging">
              เปิด Phone OTP staging checklist
            </Link>
            <Link className="inline-flex min-h-11 items-center justify-center rounded-full bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10" to="/app/guest-sync-edge">
              เปิด Guest Sync Edge plan
            </Link>
            <Link className="inline-flex min-h-11 items-center justify-center rounded-full bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10" to="/app/account-preview">
              เปิด Account Preview
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
