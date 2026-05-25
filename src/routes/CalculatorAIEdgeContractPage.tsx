import { AlertTriangle, FileCode2, KeyRound, ListChecks, ServerCog, ShieldCheck, TimerReset } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { StatusPill } from '@/components/ui/StatusPill';
import {
  buildCalculatorAIEdgeRequest,
  buildCalculatorAIEdgeResponseContract,
  calculatorAIEdgeContractSecurityRules,
  getCalculatorAIEdgeFunctionContractSummary,
} from '@/services/agri-calculators/calculator-ai-edge-contract';
import { createSprayMixAIExplanationFixture } from '@/services/agri-calculators/calculator-ai-explanation-fixtures';
import { createCalculatorAIExecutionRequestFixture } from '@/services/agri-calculators/calculator-ai-backend-review';
import { CalculatorBackLink } from '@/routes/calculators/CalculatorUi';

export function CalculatorAIEdgeContractPage() {
  const fixture = createSprayMixAIExplanationFixture();
  const request = createCalculatorAIExecutionRequestFixture({
    summary: fixture.summary,
    calculatorType: 'spray_mix',
    requestedActions: ['explain_inputs', 'explain_formulas', 'explain_result_meaning'],
    userQuestion: 'อธิบายผลนี้แบบเข้าใจง่าย โดยไม่เปลี่ยนตัวเลข',
  });
  const edgeRequest = buildCalculatorAIEdgeRequest(request);
  const edgeResponse = buildCalculatorAIEdgeResponseContract(request);
  const summary = getCalculatorAIEdgeFunctionContractSummary(request);

  return (
    <div>
      <PageHeader title="Edge Function Contract AI เครื่องคำนวณ" subtitle="draft สำหรับ calculator-ai-explain โดยยังไม่ deploy และยังไม่เรียก network" showBack />
      <div className="grid gap-5 px-5 pb-6">
        <Card className="overflow-hidden bg-indigo-950 text-white">
          <div className="relative p-5">
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10" />
            <div className="relative flex gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-white text-indigo-950">
                <ServerCog aria-hidden="true" className="h-7 w-7" />
              </span>
              <div className="min-w-0">
                <Badge className="bg-white/15 text-white" tone="green">
                  M59 design stub
                </Badge>
                <h2 className="mt-3 text-2xl font-extrabold leading-8">endpoint name: {summary.endpointName}</h2>
                <p className="mt-2 text-sm leading-6 text-indigo-50/90">
                  หน้านี้แสดง request/response contract, security boundary, audit preview, rate-limit hook และ timeout plan สำหรับ Edge Function ในอนาคตเท่านั้น
                </p>
              </div>
            </div>
          </div>
        </Card>

        <NoticeBox tone="warning" title="ยังไม่เรียก AI จริง">
          M59 ไม่มี deploy Edge Function ไม่มี provider key ไม่มี service-role key ใน frontend ไม่มี Supabase write และไม่มี network call โดยค่าเริ่มต้น
        </NoticeBox>

        <section className="grid grid-cols-2 gap-3">
          <Card className="p-4">
            <p className="text-xs font-bold text-slate-500">method</p>
            <p className="mt-2 text-xl font-extrabold text-kaset-deep">{summary.method}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs font-bold text-slate-500">deployed</p>
            <p className="mt-2 text-xl font-extrabold text-kaset-deep">{String(summary.deployed)}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs font-bold text-slate-500">network default</p>
            <p className="mt-2 text-xl font-extrabold text-kaset-deep">{String(summary.networkEnabledByDefault)}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs font-bold text-slate-500">provider call</p>
            <p className="mt-2 text-xl font-extrabold text-kaset-deep">{String(summary.providerCallAttempted)}</p>
          </Card>
        </section>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
              <FileCode2 aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-extrabold text-kaset-ink">Typed request payload</h2>
                <StatusPill tone="success">{edgeRequest.method}</StatusPill>
              </div>
              <div className="mt-3 grid gap-2 text-sm leading-6 text-slate-700">
                <p className="rounded-lg bg-kaset-mist p-3">requestId: {edgeRequest.requestId}</p>
                <p className="rounded-lg bg-kaset-mist p-3">locked hash: {edgeRequest.lockedSnapshot.lockHash}</p>
                <p className="rounded-lg bg-kaset-mist p-3">expected policy: {edgeRequest.expectedPolicyVersionId}</p>
                <p className="rounded-lg bg-kaset-mist p-3">max payload: {edgeRequest.maxPayloadChars} chars</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-emerald-100 text-emerald-800">
              <ShieldCheck aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-extrabold text-kaset-ink">Response contract preview</h2>
                <StatusPill tone={edgeResponse.status === 'design_stub_ready' ? 'success' : 'warning'}>{edgeResponse.status}</StatusPill>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">{edgeResponse.disabledReason}</p>
              <div className="mt-3 grid gap-2 text-sm font-bold leading-6 text-slate-700">
                <p className="rounded-lg bg-kaset-mist p-3">noRealAICall: {String(edgeResponse.noRealAICall)}</p>
                <p className="rounded-lg bg-kaset-mist p-3">networkCallAttempted: {String(edgeResponse.networkCallAttempted)}</p>
                <p className="rounded-lg bg-kaset-mist p-3">supabaseWriteAttempted: {String(edgeResponse.supabaseWriteAttempted)}</p>
                <p className="rounded-lg bg-kaset-mist p-3">deterministicResultUnchanged: {String(edgeResponse.deterministicResultUnchanged)}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-amber-100 text-amber-800">
              <KeyRound aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-extrabold text-kaset-ink">Server-only key boundary</h2>
              <div className="mt-3 grid gap-2">
                {calculatorAIEdgeContractSecurityRules.map((rule) => (
                  <p className="rounded-lg bg-amber-50 p-3 text-sm leading-6 text-amber-950" key={rule}>
                    {rule}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-sky-100 text-sky-800">
              <ListChecks aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-extrabold text-kaset-ink">Policy, audit และ rate-limit hooks</h2>
              <div className="mt-3 grid gap-2 text-sm leading-6 text-slate-700">
                <p className="rounded-lg bg-kaset-mist p-3">policy status: {edgeResponse.policyCheck.status}</p>
                <p className="rounded-lg bg-kaset-mist p-3">audit events: {edgeResponse.auditEvents.length}</p>
                <p className="rounded-lg bg-kaset-mist p-3">rate-limit status: {edgeResponse.rateLimitCheck.status}</p>
                <p className="rounded-lg bg-kaset-mist p-3">daily limit plan: {edgeResponse.rateLimitCheck.dailyLimit}</p>
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
              <h2 className="font-extrabold text-kaset-ink">Failure modes</h2>
              <div className="mt-3 grid gap-2">
                {edgeResponse.failureModes.map((mode) => (
                  <div className="rounded-lg bg-rose-50 p-3" key={mode.id}>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-extrabold text-rose-950">{mode.label}</p>
                      <StatusPill tone={mode.retryable ? 'warning' : 'danger'}>{mode.responseStatus}</StatusPill>
                    </div>
                    <p className="mt-1 text-sm leading-6 text-rose-950">{mode.userCopy}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <NoticeBox tone="info" icon={TimerReset} title="Timeout plan">
          request timeout {edgeResponse.timeoutPlan.requestTimeoutMs}ms · provider timeout {edgeResponse.timeoutPlan.providerTimeoutMs}ms · retry {edgeResponse.timeoutPlan.retryCount} · timeout ต้องไม่เปลี่ยนผลคำนวณ
        </NoticeBox>

        <div className="grid gap-2 sm:grid-cols-5">
          <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-emerald-800 px-4 text-sm font-extrabold text-white" to="/app/calculators/ai-edge-dry-run">
            Edge dry-run
          </Link>
          <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-indigo-900 px-4 text-sm font-extrabold text-white" to="/app/calculators/ai-endpoint-plan">
            Endpoint plan
          </Link>
          <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-kaset-deep px-4 text-sm font-extrabold text-white" to="/app/calculators/ai-adapter-status">
            Adapter status
          </Link>
          <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10" to="/app/admin">
            Admin
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
