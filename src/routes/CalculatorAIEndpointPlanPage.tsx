import { AlertTriangle, CheckCircle2, GitBranch, ListChecks, LockKeyhole, Route, ServerCog, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { StatusPill } from '@/components/ui/StatusPill';
import { buildCalculatorAIEndpointPlan } from '@/services/agri-calculators/calculator-ai-endpoint-plan';
import type { CalculatorAIEndpointCheck } from '@/services/agri-calculators/calculator-ai-endpoint-plan.types';
import { CalculatorBackLink } from '@/routes/calculators/CalculatorUi';

const checkTone: Record<CalculatorAIEndpointCheck['status'], 'success' | 'warning' | 'danger' | 'info'> = {
  required: 'warning',
  planned: 'info',
  blocked: 'danger',
};

function CheckListCard({ title, checks }: { title: string; checks: CalculatorAIEndpointCheck[] }) {
  return (
    <Card className="p-4">
      <div className="flex gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
          <ListChecks aria-hidden="true" className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-extrabold text-kaset-ink">{title}</h2>
          <div className="mt-3 grid gap-2">
            {checks.map((check) => (
              <div className="rounded-lg bg-white p-3 ring-1 ring-kaset-deep/10" key={check.id}>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-extrabold text-kaset-ink">{check.label}</p>
                  <StatusPill tone={checkTone[check.status]}>{check.status}</StatusPill>
                </div>
                <p className="mt-1 text-sm leading-6 text-slate-600">{check.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

export function CalculatorAIEndpointPlanPage() {
  const plan = buildCalculatorAIEndpointPlan();

  return (
    <div>
      <PageHeader title="แผน Endpoint AI เครื่องคำนวณ" subtitle="checklist ก่อนมี live AI network path" showBack />
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
                  M58 endpoint checklist
                </Badge>
                <h2 className="mt-3 text-2xl font-extrabold leading-8">ยังไม่มี endpoint จริง และยังไม่เปิด network</h2>
                <p className="mt-2 text-sm leading-6 text-emerald-50/90">
                  หน้านี้กำหนดสิ่งที่ต้องผ่านก่อนเปิด calculator AI backend ใน staging: lock hash, policy, audit, rate limit, timeout และ sponsor separation
                </p>
              </div>
            </div>
          </div>
        </Card>

        <NoticeBox tone="warning" title="no-real-network notice">
          M58 เป็นแผนและ QA checklist เท่านั้น: noRealNetworkInM58 {String(plan.noRealNetworkInM58)}, backendEndpointExists {String(plan.backendEndpointExists)}, frontendProviderKeysAllowed {String(plan.frontendProviderKeysAllowed)}.
        </NoticeBox>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-sky-100 text-sky-800">
              <Route aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-extrabold text-kaset-ink">Future backend endpoint flow</h2>
                <StatusPill tone="warning">{plan.readiness}</StatusPill>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">{plan.readinessLabel}</p>
              <div className="mt-3 grid gap-2">
                {plan.endpointFlow.map((step, index) => (
                  <div className="flex min-h-[52px] items-center gap-3 rounded-lg bg-kaset-mist p-3" key={step}>
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-kaset-deep text-sm font-extrabold text-white">
                      {index + 1}
                    </span>
                    <p className="font-extrabold text-kaset-ink">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <CheckListCard checks={plan.requiredBackendChecks} title="Required backend checks" />
        <CheckListCard checks={plan.requiredSafetyChecks} title="Required safety checks" />

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-rose-50 text-rose-800">
              <AlertTriangle aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-extrabold text-kaset-ink">Production blockers</h2>
              <div className="mt-3 grid gap-2">
                {plan.blockedProductionConditions.map((item) => (
                  <p className="rounded-lg bg-rose-50 p-3 text-sm leading-6 text-rose-950" key={item}>
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-amber-100 text-amber-800">
              <LockKeyhole aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-extrabold text-kaset-ink">Required staging flags</h2>
              <div className="mt-3 grid gap-2">
                {plan.requiredEnvFlags.map((flag) => (
                  <div className="rounded-lg bg-amber-50 p-3" key={flag.key}>
                    <p className="font-extrabold text-amber-950">{flag.key}={flag.requiredValue}</p>
                    <p className="mt-1 text-sm leading-6 text-amber-950">
                      default: {flag.currentDefault} · {flag.note}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
              <GitBranch aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-extrabold text-kaset-ink">Recommended rollout order</h2>
              <div className="mt-3 grid gap-2">
                {plan.recommendedRolloutOrder.map((item) => (
                  <p className="rounded-lg bg-kaset-mist p-3 text-sm leading-6 text-slate-700" key={item}>
                    <CheckCircle2 aria-hidden="true" className="mr-2 inline h-4 w-4 text-kaset-deep" />
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <div className="grid gap-2 sm:grid-cols-6">
          <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-indigo-900 px-4 text-sm font-extrabold text-white" to="/app/calculators/ai-adapter-status">
            Adapter status
          </Link>
          <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-emerald-800 px-4 text-sm font-extrabold text-white" to="/app/calculators/ai-edge-dry-run">
            Edge dry-run
          </Link>
          <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10" to="/app/calculators/ai-edge-contract">
            Edge contract
          </Link>
          <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-kaset-deep px-4 text-sm font-extrabold text-white" to="/app/calculators/ai-architecture">
            AI architecture
          </Link>
          <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10" to="/app/admin">
            Admin
          </Link>
          <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10" to="/app/qa">
            QA
          </Link>
        </div>

        <NoticeBox tone="info" icon={ShieldCheck} title="Safety boundary">
          endpoint จริงในอนาคตต้องอธิบายเท่านั้น ห้ามเปลี่ยนสูตร ห้ามแทรก sponsor ห้ามแนะนำสารเคมี/สินค้า และต้องเก็บ safety copy ไว้หน้าผู้ใช้เสมอ
        </NoticeBox>

        <CalculatorBackLink />
      </div>
    </div>
  );
}
