import { AlertTriangle, BrainCircuit, Database, ListChecks, LockKeyhole, Server, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { StatusPill } from '@/components/ui/StatusPill';
import { createSprayMixAIExplanationFixture } from '@/services/agri-calculators/calculator-ai-explanation-fixtures';
import { calculatorAIBlockedActions } from '@/services/agri-calculators/calculator-ai-explanation-policy';
import {
  buildCalculatorAIBackendArchitectureReview,
  calculatorAIPolicyVersions,
  createCalculatorAIExecutionRequestFixture,
} from '@/services/agri-calculators/calculator-ai-backend-review';
import { CalculatorBackLink } from '@/routes/calculators/CalculatorUi';

const architectureFlow = 'Calculator -> Snapshot Lock -> Backend Policy Check -> Prompt Builder -> AI Explanation -> Safety Filter -> Final Display';

export function CalculatorAIArchitecturePage() {
  const source = createSprayMixAIExplanationFixture();
  const review = buildCalculatorAIBackendArchitectureReview(
    createCalculatorAIExecutionRequestFixture({
      summary: source.summary,
      calculatorType: 'spray_mix',
      cropKey: 'rice',
      cropLabel: 'ข้าว (ตัวอย่าง)',
      requestedActions: ['explain_inputs', 'explain_formulas'],
      userQuestion: 'ช่วยอธิบายผลคำนวณนี้แบบเข้าใจง่าย',
    }),
  );

  return (
    <div>
      <PageHeader title="สถาปัตยกรรม AI อธิบายผล" subtitle="รีวิว backend ก่อนเปิด AI จริง" showBack />
      <div className="grid gap-5 px-5 pb-6">
        <Card className="overflow-hidden bg-kaset-deep text-white">
          <div className="relative p-5">
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10" />
            <div className="relative flex gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-white text-kaset-deep">
                <Server aria-hidden="true" className="h-7 w-7" />
              </span>
              <div className="min-w-0">
                <Badge className="bg-white/15 text-white" tone="green">
                  M56 architecture review
                </Badge>
                <h2 className="mt-3 text-2xl font-extrabold leading-8">ล็อกผลคำนวณก่อนให้ AI อธิบาย</h2>
                <p className="mt-2 text-sm leading-6 text-emerald-50/90">
                  หน้านี้ออกแบบ backend prompt execution, policy version, audit log, rate limit และ safety escalation เท่านั้น ยังไม่เรียก AI จริงและยังไม่เขียน backend
                </p>
              </div>
            </div>
          </div>
        </Card>

        <NoticeBox tone="warning" title="ยังไม่เรียก AI จริง">
          M56 เป็น architecture review แบบ local-only: noRealAICall {String(review.noRealAICall)}, backendWritesEnabled{' '}
          {String(review.backendWritesEnabled)}, supabaseWritesEnabled {String(review.supabaseWritesEnabled)}.
        </NoticeBox>

        <Card className="border-indigo-200 bg-indigo-50 p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-white text-indigo-800">
              <BrainCircuit aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-extrabold text-indigo-950">Explanation pipeline</h2>
              <p className="mt-2 rounded-lg bg-white p-3 text-sm font-extrabold leading-6 text-indigo-950">{architectureFlow}</p>
              <div className="mt-3 grid gap-2">
                {review.pipelineSteps.map((step, index) => (
                  <div className="flex min-h-[52px] items-center gap-3 rounded-lg bg-white p-3 ring-1 ring-indigo-900/10" key={step}>
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-indigo-900 text-sm font-extrabold text-white">
                      {index + 1}
                    </span>
                    <p className="font-extrabold text-indigo-950">{step}</p>
                  </div>
                ))}
              </div>
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
                <h2 className="font-extrabold text-kaset-ink">Deterministic snapshot lock</h2>
                <StatusPill tone="success">immutable</StatusPill>
              </div>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Snapshot ID: {review.snapshot.snapshotId}
              </p>
              <div className="mt-3 grid gap-2">
                {review.snapshot.resultValues.map((line) => (
                  <p className="rounded-lg bg-kaset-mist p-3 text-sm leading-6 text-slate-700" key={line}>
                    {line}
                  </p>
                ))}
              </div>
              <div className="mt-3 grid gap-2 text-sm font-bold leading-6 text-kaset-deep">
                <p>AI cannot recompute formulas: {String(review.snapshot.aiCanRecomputeFormulas)}</p>
                <p>AI cannot mutate outputs: {String(review.snapshot.aiCanMutateOutputs)}</p>
                <p>AI must echo locked result values only: {String(review.snapshot.aiMustEchoLockedResultValuesOnly)}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-amber-100 text-amber-800">
              <ShieldCheck aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-extrabold text-kaset-ink">Policy and safety decision</h2>
                <StatusPill tone={review.safetyDecision.status === 'rejected_before_ai' ? 'danger' : 'warning'}>
                  {review.safetyDecision.status}
                </StatusPill>
              </div>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Policy: {review.policyVersion.id} · Prompt: {review.policyVersion.promptTemplateVersionId}
              </p>
              <div className="mt-3 grid gap-2">
                {review.safetyDecision.reasons.map((reason) => (
                  <p className="rounded-lg bg-amber-50 p-3 text-sm leading-6 text-amber-950" key={reason}>
                    {reason}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <section className="grid gap-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-extrabold text-kaset-ink">Blocked actions</h2>
            <StatusPill tone="danger">{calculatorAIBlockedActions.length}</StatusPill>
          </div>
          {calculatorAIBlockedActions.map((action) => (
            <Card className="p-4" key={action.id}>
              <div className="flex gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-rose-50 text-rose-800">
                  <AlertTriangle aria-hidden="true" className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <h3 className="font-extrabold text-kaset-ink">{action.label}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{action.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </section>

        <section className="grid gap-3">
          <h2 className="text-lg font-extrabold text-kaset-ink">Policy version examples</h2>
          {calculatorAIPolicyVersions.map((policy) => (
            <Card className="p-4" key={policy.id}>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-extrabold text-kaset-ink">{policy.id}</h3>
                <Badge tone={policy.status === 'review_ready' ? 'green' : 'neutral'}>{policy.status}</Badge>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">{policy.description}</p>
              <p className="mt-3 rounded-lg bg-kaset-mist p-3 text-xs font-bold leading-5 text-kaset-deep">
                banned: {policy.bannedResponseCategories.join(' · ')}
              </p>
            </Card>
          ))}
        </section>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-sky-100 text-sky-800">
              <Database aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-extrabold text-kaset-ink">Audit and rate-limit plan</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                daily limit {review.rateLimitPlan.dailyExplanationLimit} · max payload {review.rateLimitPlan.maxPromptPayloadChars} chars · retention plan {review.auditLogPlan.retentionDays} days
              </p>
              <div className="mt-3 grid gap-2">
                {review.auditLogPlan.futureTables.map((table) => (
                  <Badge key={table} tone="neutral">
                    {table}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
              <ListChecks aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-extrabold text-kaset-ink">Future backend stages</h2>
              <div className="mt-3 grid gap-2">
                {review.futureBackendStages.map((stage) => (
                  <p className="rounded-lg bg-kaset-mist p-3 text-sm leading-6 text-slate-700" key={stage}>
                    {stage}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <div className="grid gap-2 sm:grid-cols-4">
          <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-kaset-deep px-4 text-sm font-extrabold text-white" to="/app/calculators/ai-explanation-preview">
            AI preview
          </Link>
          <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-indigo-900 px-4 text-sm font-extrabold text-white" to="/app/calculators/ai-adapter-status">
            Adapter status
          </Link>
          <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10" to="/app/calculators/qa">
            Calculator QA
          </Link>
          <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10" to="/app/next-phase">
            Next Phase
          </Link>
        </div>
        <CalculatorBackLink />
      </div>
    </div>
  );
}
