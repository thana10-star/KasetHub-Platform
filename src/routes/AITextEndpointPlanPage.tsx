import { BrainCircuit, Clock3, KeyRound, LockKeyhole, ServerOff, ShieldAlert, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { LargeActionButton } from '@/components/ui/LargeActionButton';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { StatusPill } from '@/components/ui/StatusPill';
import { aiTextBlockedFixtureRequest, aiTextCalculatorFixtureRequest } from '@/services/ai-text/ai-text-fixtures';
import { getAITextEndpointContractSummary } from '@/services/ai-text/ai-text-endpoint-contract';
import { buildAITextEndpointDryRunPlan } from '@/services/ai-text/ai-text-endpoint-dry-run';

export function AITextEndpointPlanPage() {
  const plan = buildAITextEndpointDryRunPlan(aiTextCalculatorFixtureRequest);
  const blockedPlan = buildAITextEndpointDryRunPlan(aiTextBlockedFixtureRequest);
  const contract = getAITextEndpointContractSummary();
  const contractPreview = {
    endpointName: contract.endpointName,
    requestType: plan.requestPreview.requestType,
    policyVersion: plan.requestPreview.policyVersion,
    dryRun: plan.requestPreview.dryRun,
    noProviderKeyInFrontend: plan.requestPreview.noProviderKeyInFrontend,
    noServiceRoleKeyInFrontend: plan.requestPreview.noServiceRoleKeyInFrontend,
    immutableHash: plan.requestPreview.lockedOutputSnapshot?.lockedHash,
  };
  const responsePreview = {
    status: plan.responsePreview.status,
    providerCalled: plan.responsePreview.providerCalled,
    networkAttempted: plan.responsePreview.networkAttempted,
    noSupabaseWrite: plan.responsePreview.noSupabaseWrite,
    immutableOutputPreserved: plan.responsePreview.immutableOutputPreserved,
  };

  return (
    <div>
      <PageHeader
        title="AI Text Endpoint Plan"
        subtitle="backend-owned staging proxy contract + Edge dry-run preview"
        showBack
      />
      <div className="grid gap-5 px-5 pb-6">
        <Card className="overflow-hidden bg-indigo-950 text-white">
          <div className="p-5">
            <div className="flex gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-white text-indigo-950">
                <BrainCircuit aria-hidden="true" className="h-7 w-7" />
              </span>
              <div className="min-w-0">
                <StatusPill className="bg-white/15 text-white ring-white/20" tone="warning">
                  M82 dry-run only
                </StatusPill>
                <h2 className="mt-3 text-2xl font-extrabold leading-8">ยังไม่เรียก provider จริง</h2>
                <p className="mt-2 text-sm leading-6 text-indigo-50">
                  หน้านี้แสดง contract สำหรับ backend/Edge proxy ในอนาคตเท่านั้น ค่าเริ่มต้นยังไม่มี network, ไม่มี provider key ใน frontend และไม่มี service-role key
                </p>
              </div>
            </div>
          </div>
        </Card>

        <section className="grid grid-cols-2 gap-3">
          <Card className="p-4">
            <ServerOff aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <p className="mt-3 text-xs font-bold text-slate-500">Endpoint</p>
            <p className="mt-1 break-words text-lg font-extrabold text-kaset-ink">{plan.endpointUrlMasked}</p>
          </Card>
          <Card className="p-4">
            <Clock3 aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <p className="mt-3 text-xs font-bold text-slate-500">Dry-run</p>
            <p className="mt-1 text-lg font-extrabold text-kaset-ink">{String(plan.dryRunEnabled)}</p>
          </Card>
          <Card className="p-4">
            <KeyRound aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <p className="mt-3 text-xs font-bold text-slate-500">Provider key</p>
            <p className="mt-1 text-lg font-extrabold text-kaset-ink">backend only</p>
          </Card>
          <Card className="p-4">
            <LockKeyhole aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <p className="mt-3 text-xs font-bold text-slate-500">Service-role</p>
            <p className="mt-1 text-lg font-extrabold text-kaset-ink">frontend blocked</p>
          </Card>
        </section>

        <NoticeBox tone="warning" icon={ShieldAlert} title="Endpoint gating">
          endpoint URL อย่างเดียวไม่พอ · network flag อย่างเดียวไม่พอ · AI text mode อย่างเดียวไม่พอ · production_disabled ปิดทุกเส้นทาง · M82 dry-run ยังไม่ fetch และไม่เรียก provider
        </NoticeBox>

        <Card className="p-4">
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill tone="warning">canCallEndpoint {String(plan.canCallEndpoint)}</StatusPill>
            <Badge tone="green">fetchWouldRun {String(plan.fetchWouldRun)}</Badge>
            <Badge tone="green">providerWouldRun {String(plan.providerWouldRun)}</Badge>
            <Badge tone="green">noSupabaseWrite {String(plan.noSupabaseWrite)}</Badge>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            mode {plan.mode} · proxy {plan.proxyMode} · realAI {String(plan.realAIEnabled)} · aiTextNetwork {String(plan.aiTextNetworkEnabled)} · endpointNetwork {String(plan.endpointNetworkEnabled)}
          </p>
        </Card>

        <section className="grid gap-3 md:grid-cols-2">
          <Card className="p-4">
            <h2 className="font-extrabold text-kaset-ink">Request contract preview</h2>
            <pre className="mt-3 max-h-[320px] overflow-auto whitespace-pre-wrap rounded-lg bg-kaset-mist p-3 text-xs leading-5 text-slate-700">
              {JSON.stringify(contractPreview, null, 2)}
            </pre>
          </Card>
          <Card className="p-4">
            <h2 className="font-extrabold text-kaset-ink">Response contract preview</h2>
            <pre className="mt-3 max-h-[320px] overflow-auto whitespace-pre-wrap rounded-lg bg-kaset-mist p-3 text-xs leading-5 text-slate-700">
              {JSON.stringify(responsePreview, null, 2)}
            </pre>
          </Card>
        </section>

        <section className="grid gap-3 md:grid-cols-2">
          <Card className="p-4">
            <h2 className="font-extrabold text-kaset-ink">Audit dry-run</h2>
            <div className="mt-3 grid gap-2">
              {plan.auditEvents.map((event) => (
                <p className="rounded-lg bg-white p-3 text-sm leading-6 text-slate-700 ring-1 ring-kaset-deep/10" key={event.id}>
                  {event.eventType} · wouldWriteSupabase {String(event.wouldWriteSupabase)}
                </p>
              ))}
            </div>
          </Card>
          <Card className="p-4">
            <h2 className="font-extrabold text-kaset-ink">Rate-limit / timeout</h2>
            <p className="mt-3 rounded-lg bg-kaset-mist p-3 text-sm leading-6 text-slate-700">
              daily {plan.rateLimitCheck.dailyLimit} · cooldown {plan.rateLimitCheck.cooldownSeconds}s · wouldWriteSupabase {String(plan.rateLimitCheck.wouldWriteSupabase)}
            </p>
            <p className="mt-3 rounded-lg bg-amber-50 p-3 text-sm leading-6 text-amber-950">
              timeout {plan.timeoutPlan.requestTimeoutMs}ms · provider timeout {plan.timeoutPlan.providerTimeoutMs}ms · mutate calculator {String(plan.timeoutPlan.canMutateCalculatorOutput)}
            </p>
          </Card>
        </section>

        <section className="grid gap-3">
          <h2 className="text-lg font-extrabold text-kaset-ink">Production blockers</h2>
          {plan.blockers.map((blocker) => (
            <Card className="border-amber-100 bg-amber-50 p-4" key={`${blocker.id}-${blocker.label}`}>
              <div className="flex gap-3">
                <ShieldAlert aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-amber-800" />
                <div className="min-w-0">
                  <h3 className="font-extrabold text-amber-950">{blocker.label}</h3>
                  <p className="mt-1 text-sm leading-6 text-amber-900">{blocker.reason}</p>
                </div>
              </div>
            </Card>
          ))}
        </section>

        <section className="grid gap-3">
          <h2 className="text-lg font-extrabold text-kaset-ink">Blocked unsafe categories</h2>
          {contract.blockedActions.map((action) => (
            <Card className="border-rose-100 bg-rose-50 p-4" key={action.id}>
              <h3 className="font-extrabold text-rose-950">{action.label}</h3>
              <p className="mt-1 text-sm leading-6 text-rose-900">{action.reason}</p>
            </Card>
          ))}
          <NoticeBox tone="danger" title="Unsafe request dry-run proof">
            {blockedPlan.responsePreview.status} · blocked actions {blockedPlan.blockedActions.length} · providerCalled {String(blockedPlan.responsePreview.providerCalled)}
          </NoticeBox>
        </section>

        <NoticeBox tone="success" icon={ShieldCheck} title="Immutable calculator output proof">
          locked hash {plan.requestPreview.lockedOutputSnapshot?.lockedHash ?? 'none'} · immutableOutputPreserved {String(plan.responsePreview.immutableOutputPreserved)} · timeout cannot mutate calculator output
        </NoticeBox>

        <div className="grid gap-2 sm:grid-cols-4">
          <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-indigo-900 px-4 text-sm font-extrabold text-white" to="/app/ai-text-status">
            AI text status
          </Link>
          <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-kaset-mist px-4 text-sm font-extrabold text-kaset-deep" to="/app/calculators/ai-explanation-preview">
            Calculator preview
          </Link>
          <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-kaset-mist px-4 text-sm font-extrabold text-kaset-deep" to="/app/weather/risk-rules">
            Weather risk
          </Link>
          <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10" to="/app/qa">
            QA
          </Link>
        </div>

        <LargeActionButton
          icon={ShieldCheck}
          label="กลับไป Admin Dashboard"
          description="ดูสถานะ staging, endpoint dry-run และ production blockers รวม"
          to="/app/admin"
          variant="white"
        />
      </div>
    </div>
  );
}
