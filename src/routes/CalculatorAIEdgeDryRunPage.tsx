import { AlertTriangle, CheckCircle2, KeyRound, Link2Off, ListChecks, ServerCog, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { StatusPill } from '@/components/ui/StatusPill';
import { buildCalculatorAIEdgeDryRunPlan } from '@/services/agri-calculators/calculator-ai-edge-dry-run-plan';
import type { CalculatorAIEdgeDryRunValidationCase } from '@/services/agri-calculators/calculator-ai-edge-dry-run.types';
import { CalculatorBackLink } from '@/routes/calculators/CalculatorUi';

const severityTone: Record<CalculatorAIEdgeDryRunValidationCase['severity'], 'info' | 'warning' | 'danger'> = {
  info: 'info',
  warning: 'warning',
  danger: 'danger',
};

export function CalculatorAIEdgeDryRunPage() {
  const plan = buildCalculatorAIEdgeDryRunPlan();

  return (
    <div>
      <PageHeader title="Dry-run Edge AI เครื่องคำนวณ" subtitle="แผน staging-only สำหรับ calculator-ai-explain โดยยังไม่เรียก endpoint จริง" showBack />
      <div className="grid gap-5 px-5 pb-6">
        <Card className="overflow-hidden bg-kaset-deep text-white">
          <div className="relative p-5">
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10" />
            <div className="relative flex gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-white text-kaset-deep">
                <ServerCog aria-hidden="true" className="h-7 w-7" />
              </span>
              <div className="min-w-0">
                <Badge className="bg-white/15 text-white" tone="green">
                  M60 dry-run plan
                </Badge>
                <h2 className="mt-3 text-2xl font-extrabold leading-8">ยังไม่เรียก endpoint จริง</h2>
                <p className="mt-2 text-sm leading-6 text-emerald-50/90">
                  ตรวจ readiness, endpoint URL แบบซ่อนค่า, secret checklist, validation fixtures, audit/rate-limit preview และ production blockers ก่อนมี Edge Function จริง
                </p>
              </div>
            </div>
          </div>
        </Card>

        <NoticeBox tone="warning" title="no endpoint call">
          M60 เป็น dry-run implementation plan เท่านั้น: canCallEndpoint {String(plan.canCallEndpoint)}, fetchWouldRun {String(plan.fetchWouldRun)}, noRealEndpointCall {String(plan.noRealEndpointCall)}.
        </NoticeBox>

        <section className="grid grid-cols-2 gap-3">
          <Card className="p-4">
            <p className="text-xs font-bold text-slate-500">Dry-run mode</p>
            <p className="mt-2 break-words text-xl font-extrabold text-kaset-deep">{plan.mode}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs font-bold text-slate-500">Readiness</p>
            <p className="mt-2 break-words text-xl font-extrabold text-kaset-deep">{plan.readiness}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs font-bold text-slate-500">Dry-run flag</p>
            <p className="mt-2 text-xl font-extrabold text-kaset-deep">{String(plan.dryRunFlagEnabled)}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs font-bold text-slate-500">Edge network flag</p>
            <p className="mt-2 text-xl font-extrabold text-kaset-deep">{String(plan.edgeNetworkFlagEnabled)}</p>
          </Card>
        </section>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-sky-100 text-sky-800">
              <Link2Off aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-extrabold text-kaset-ink">Endpoint URL status</h2>
                <StatusPill tone={plan.endpointUrlConfigured ? 'warning' : 'success'}>
                  {plan.endpointUrlConfigured ? 'configured' : 'empty default'}
                </StatusPill>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">{plan.readinessLabel}</p>
              <p className="mt-3 rounded-lg bg-kaset-mist p-3 text-sm font-bold leading-6 text-kaset-deep">
                {plan.endpointUrlMasked}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-amber-100 text-amber-800">
              <KeyRound aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-extrabold text-kaset-ink">Secret checklist</h2>
              <div className="mt-3 grid gap-2">
                {plan.secretChecklist.map((item) => (
                  <div className="rounded-lg bg-amber-50 p-3" key={item.id}>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-extrabold text-amber-950">{item.label}</p>
                      <StatusPill tone={item.passed ? 'success' : item.severity}>{item.passed ? 'pass' : 'block'}</StatusPill>
                    </div>
                    <p className="mt-1 text-sm leading-6 text-amber-950">
                      required: {item.requiredState} · current: {item.currentState}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <section className="grid gap-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-extrabold text-kaset-ink">Validation fixture cases</h2>
            <StatusPill tone={plan.validationCases.every((item) => item.passed) ? 'success' : 'danger'}>
              {plan.validationCases.filter((item) => item.passed).length}/{plan.validationCases.length}
            </StatusPill>
          </div>
          {plan.validationCases.map((item) => (
            <Card className="p-4" key={item.id}>
              <div className="flex gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
                  <CheckCircle2 aria-hidden="true" className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-extrabold text-kaset-ink">{item.label}</h3>
                    <StatusPill tone={item.passed ? 'success' : severityTone[item.severity]}>
                      {item.actualStatus}
                    </StatusPill>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{item.scenario}</p>
                  <p className="mt-2 rounded-lg bg-kaset-mist p-2 text-xs font-bold text-slate-600">
                    expected: {item.expectedStatus} · no fetch: {String(item.noFetch)}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </section>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-indigo-100 text-indigo-800">
              <ListChecks aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-extrabold text-kaset-ink">Audit / rate-limit dry-run preview</h2>
              <div className="mt-3 grid gap-2 text-sm leading-6 text-slate-700">
                <p className="rounded-lg bg-kaset-mist p-3">wouldWriteSupabase: {String(plan.auditPreview.wouldWriteSupabase)}</p>
                <p className="rounded-lg bg-kaset-mist p-3">audit events: {plan.auditPreview.events.length}</p>
                <p className="rounded-lg bg-kaset-mist p-3">daily limit preview: {plan.rateLimitPreview.dailyLimit}</p>
                <p className="rounded-lg bg-kaset-mist p-3">would enforce now: {String(plan.rateLimitPreview.wouldEnforceNow)}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-rose-50 text-rose-800">
              <AlertTriangle aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-extrabold text-kaset-ink">Production blockers</h2>
              <div className="mt-3 grid gap-2">
                {plan.productionBlockers.map((blocker) => (
                  <div className="rounded-lg bg-rose-50 p-3" key={blocker.id}>
                    <p className="font-extrabold text-rose-950">{blocker.label}</p>
                    <p className="mt-1 text-sm leading-6 text-rose-950">{blocker.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <NoticeBox tone="info" icon={ShieldCheck} title="Frontend proof">
          endpoint URL อย่างเดียวไม่พอ, network flag อย่างเดียวไม่พอ, dry-run flag + network flag ก็ยังไม่ fetch ใน M60 และ production/default frontend build ยังเรียก endpoint ไม่ได้
        </NoticeBox>

        <div className="grid gap-2 sm:grid-cols-5">
          <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-indigo-900 px-4 text-sm font-extrabold text-white" to="/app/calculators/ai-edge-contract">
            Edge contract
          </Link>
          <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-kaset-deep px-4 text-sm font-extrabold text-white" to="/app/calculators/ai-endpoint-plan">
            Endpoint plan
          </Link>
          <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10" to="/app/admin">
            Admin
          </Link>
          <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10" to="/app/next-phase">
            Next Phase
          </Link>
          <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10" to="/app/qa">
            QA
          </Link>
        </div>

        <CalculatorBackLink />
      </div>
    </div>
  );
}
