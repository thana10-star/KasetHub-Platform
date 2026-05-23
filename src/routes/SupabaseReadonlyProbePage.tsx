import {
  AlertTriangle,
  CheckCircle2,
  Database,
  KeyRound,
  Link2,
  ListChecks,
  LockKeyhole,
  ShieldCheck,
  Table2,
  ToggleLeft,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { StatusPill } from '@/components/ui/StatusPill';
import {
  buildSupabaseReadonlyProbePlan,
  runSupabaseReadonlyProbe,
} from '@/services/supabase/supabase-readonly-probe';
import type {
  SupabaseReadonlyProbeResult,
  SupabaseReadonlyProbeTableResult,
  SupabaseReadonlyProbeTableStatus,
} from '@/services/supabase/supabase-readonly-probe.types';

const tableStatusTone: Record<SupabaseReadonlyProbeTableStatus, 'success' | 'warning' | 'danger' | 'info' | 'neutral'> = {
  not_attempted: 'neutral',
  empty_success: 'success',
  read_success: 'success',
  rls_or_policy_blocked: 'danger',
  table_missing: 'warning',
  network_error: 'danger',
  unknown_error: 'danger',
};

function FlagCard({ enabled, label }: { enabled: boolean; label: string }) {
  return (
    <Card className="p-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <ToggleLeft aria-hidden="true" className="h-4 w-4 shrink-0 text-kaset-deep" />
          <p className="truncate text-sm font-extrabold text-kaset-ink">{label}</p>
        </div>
        <Badge tone={enabled ? 'green' : 'neutral'}>{enabled ? 'enabled' : 'disabled'}</Badge>
      </div>
    </Card>
  );
}

function TableResultCard({ result }: { result: SupabaseReadonlyProbeTableResult }) {
  return (
    <Card className="p-4">
      <div className="flex gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
          {result.status === 'read_success' || result.status === 'empty_success' ? (
            <CheckCircle2 aria-hidden="true" className="h-5 w-5" />
          ) : result.status === 'not_attempted' ? (
            <WifiOff aria-hidden="true" className="h-5 w-5" />
          ) : (
            <AlertTriangle aria-hidden="true" className="h-5 w-5" />
          )}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-extrabold text-kaset-ink">{result.label}</h3>
            <StatusPill tone={tableStatusTone[result.status]}>{result.statusLabel}</StatusPill>
          </div>
          <p className="mt-1 text-sm leading-6 text-slate-600">{result.message}</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <p className="rounded-lg bg-kaset-mist p-3 text-xs font-bold leading-5 text-kaset-deep">
              rows returned count: {result.rowsReturned === null ? 'not checked' : result.rowsReturned.toLocaleString('th-TH')}
            </p>
            <p className="rounded-lg bg-kaset-mist p-3 text-xs font-bold leading-5 text-kaset-deep">
              operation: read-only count
            </p>
          </div>
          {result.errorCode || result.safeErrorMessage ? (
            <p className="mt-2 rounded-lg bg-rose-50 p-3 text-xs font-bold leading-5 text-rose-950">
              safe error: {[result.errorCode, result.safeErrorMessage].filter(Boolean).join(' / ')}
            </p>
          ) : null}
        </div>
      </div>
    </Card>
  );
}

export function SupabaseReadonlyProbePage() {
  const plan = useMemo(() => buildSupabaseReadonlyProbePlan(), []);
  const [probe, setProbe] = useState<SupabaseReadonlyProbeResult | null>(null);

  useEffect(() => {
    let cancelled = false;

    runSupabaseReadonlyProbe()
      .then((result) => {
        if (!cancelled) {
          setProbe(result);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setProbe({
            ...plan,
            attempted: true,
            completedAt: new Date().toISOString(),
            status: 'error',
            statusLabel: 'error',
            statusTone: 'danger',
            connectionStatus: 'Read-only probe failed before table checks completed.',
            tableResults: plan.tables.map((table) => ({
              table: table.name,
              label: table.label,
              status: 'network_error',
              statusLabel: 'network error',
              message: 'Network request failed before the table result could be read.',
              rowsReturned: null,
              safeErrorMessage: 'Unexpected route-level probe error; no key material is displayed.',
            })),
            tablesChecked: [],
            totalRowsReturned: 0,
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [plan]);

  const result = probe ?? {
    ...plan,
    attempted: false,
    completedAt: null,
    tableResults: plan.tables.map((table) => ({
      table: table.name,
      label: table.label,
      status: 'not_attempted' as const,
      statusLabel: 'not attempted',
      message: plan.networkEnabled ? 'Waiting for read-only probe result.' : 'Network disabled; no Supabase request was made.',
      rowsReturned: null,
    })),
    tablesChecked: [],
    totalRowsReturned: 0,
  };

  return (
    <div>
      <PageHeader title="Supabase Read-only Probe" subtitle="M43 public table test for kasethub-staging with anon key only" showBack />
      <div className="grid gap-5 px-5 pb-6">
        <Card className="overflow-hidden bg-kaset-deep text-white">
          <div className="relative p-5">
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10" />
            <div className="relative flex gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-white text-kaset-deep">
                <Wifi aria-hidden="true" className="h-7 w-7" />
              </span>
              <div className="min-w-0">
                <Badge className="bg-white/15 text-white" tone="green">
                  M43 no writes
                </Badge>
                <h2 className="mt-3 text-2xl font-extrabold leading-8">{result.statusLabel}</h2>
                <p className="mt-2 text-sm leading-6 text-emerald-50/90">{result.connectionStatus}</p>
              </div>
            </div>
          </div>
        </Card>

        <NoticeBox tone="danger" icon={LockKeyhole} title="No service-role key">
          This page may use only `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. It never needs service-role keys, database passwords, storage secrets, AI keys, or backend secrets.
        </NoticeBox>

        <NoticeBox tone="warning" icon={ShieldCheck} title="ยังไม่เปิด auth/cloud sync">
          M43 keeps auth, phone OTP, cloud sync, uploads, AI proxy, Edge Functions, and backend writes disabled. Empty public tables are OK.
        </NoticeBox>

        <section className="grid grid-cols-2 gap-3">
          <Card className="p-4">
            <Link2 aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <p className="mt-3 text-lg font-extrabold text-kaset-ink">{result.config.hasRequiredEnv ? 'present' : 'missing'}</p>
            <p className="mt-1 text-xs font-bold leading-4 text-slate-500">config status</p>
          </Card>
          <Card className="p-4">
            <Database aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <p className="mt-3 text-lg font-extrabold text-kaset-ink">{result.clientCreated ? 'created' : 'not created'}</p>
            <p className="mt-1 text-xs font-bold leading-4 text-slate-500">anon client</p>
          </Card>
          <Card className="p-4">
            <Wifi aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <p className="mt-3 text-lg font-extrabold text-kaset-ink">{result.attempted ? 'attempted' : 'not attempted'}</p>
            <p className="mt-1 text-xs font-bold leading-4 text-slate-500">network read</p>
          </Card>
          <Card className="p-4">
            <Table2 aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <p className="mt-3 text-lg font-extrabold text-kaset-ink">{result.totalRowsReturned.toLocaleString('th-TH')}</p>
            <p className="mt-1 text-xs font-bold leading-4 text-slate-500">rows returned count</p>
          </Card>
        </section>

        <Card className="p-4">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-extrabold text-kaset-ink">Connection status</h2>
            <StatusPill tone={result.statusTone}>{result.statusLabel}</StatusPill>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600">{result.configSafetyStatus}</p>
          <p className="mt-3 rounded-lg bg-kaset-mist p-3 text-xs font-bold leading-5 text-kaset-deep">
            tables checked: {result.tablesChecked.length > 0 ? result.tablesChecked.join(' / ') : result.tables.map((table) => table.name).join(' / ')}
          </p>
          {result.completedAt ? <p className="mt-2 text-xs font-bold text-slate-500">completed: {result.completedAt}</p> : null}
        </Card>

        <section className="grid gap-3">
          <h2 className="text-lg font-extrabold text-kaset-ink">Config safety</h2>
          <div className="grid grid-cols-2 gap-3">
            <FlagCard enabled={result.flags.enableSupabase} label="VITE_ENABLE_SUPABASE" />
            <FlagCard enabled={result.flags.enableDryRunNetworkCheck} label="VITE_ENABLE_SUPABASE_DRY_RUN_NETWORK_CHECK" />
            <FlagCard enabled={result.flags.enableAuth} label="VITE_ENABLE_AUTH" />
            <FlagCard enabled={result.flags.enableCloudSync} label="VITE_ENABLE_CLOUD_SYNC" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-3">
              <KeyRound aria-hidden="true" className="h-4 w-4 text-kaset-deep" />
              <p className="mt-2 text-sm font-extrabold text-kaset-ink">URL {result.config.hasUrl ? 'present' : 'missing'}</p>
            </Card>
            <Card className="p-3">
              <KeyRound aria-hidden="true" className="h-4 w-4 text-kaset-deep" />
              <p className="mt-2 text-sm font-extrabold text-kaset-ink">anon key {result.config.hasAnonKey ? 'present' : 'missing'}</p>
            </Card>
          </div>
        </section>

        <section className="grid gap-3">
          <div className="flex items-center gap-2">
            <Table2 aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <h2 className="text-lg font-extrabold text-kaset-ink">Read-only table results</h2>
          </div>
          {result.tableResults.map((tableResult) => (
            <TableResultCard key={tableResult.table} result={tableResult} />
          ))}
        </section>

        <section className="grid gap-3">
          <div className="flex items-center gap-2">
            <ListChecks aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <h2 className="text-lg font-extrabold text-kaset-ink">No-write guarantee</h2>
          </div>
          {result.noWriteGuarantees.map((item) => (
            <Card className="p-3" key={item}>
              <p className="text-sm font-bold leading-6 text-kaset-ink">{item}</p>
            </Card>
          ))}
        </section>

        {result.blockers.length > 0 ? (
          <NoticeBox tone="danger" title="Blockers">
            <ul className="grid gap-2">
              {result.blockers.map((blocker) => (
                <li key={blocker}>{blocker}</li>
              ))}
            </ul>
          </NoticeBox>
        ) : null}

        {result.warnings.length > 0 ? (
          <NoticeBox tone="warning" title="Warnings">
            <ul className="grid gap-2">
              {result.warnings.map((warning) => (
                <li key={warning}>{warning}</li>
              ))}
            </ul>
          </NoticeBox>
        ) : null}

        <Card className="p-4">
          <div className="grid gap-2">
            <Link className="inline-flex min-h-11 items-center justify-center rounded-full bg-kaset-deep px-4 text-sm font-extrabold text-white" to="/app/supabase-connection">
              Open Supabase connection
            </Link>
            <Link className="inline-flex min-h-11 items-center justify-center rounded-full bg-kaset-mint px-4 text-sm font-extrabold text-kaset-deep" to="/app/supabase-readiness">
              Open Supabase readiness
            </Link>
            <Link className="inline-flex min-h-11 items-center justify-center rounded-full bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10" to="/app/env-safety">
              Open Env Safety
            </Link>
            <Link className="inline-flex min-h-11 items-center justify-center rounded-full bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10" to="/app/admin">
              Back to Admin
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
