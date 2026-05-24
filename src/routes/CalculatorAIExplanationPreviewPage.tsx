import { BrainCircuit, CheckCircle2, ShieldAlert, ShieldCheck, XCircle } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { StatusPill } from '@/components/ui/StatusPill';
import {
  createFertilizerAIExplanationFixture,
  createSprayMixAIExplanationFixture,
} from '@/services/agri-calculators/calculator-ai-explanation-fixtures';
import {
  buildCalculatorAIExplanationPlan,
  summarizeCalculatorAIExplanationPolicy,
} from '@/services/agri-calculators/calculator-ai-explanation-planner';
import { calculatorAIBlockedActions } from '@/services/agri-calculators/calculator-ai-explanation-policy';
import {
  explainCalculatorResult,
  getCalculatorAIAdapterStatus,
} from '@/services/agri-calculators/calculator-ai-adapter';
import { createCalculatorAIExecutionRequestFixture } from '@/services/agri-calculators/calculator-ai-backend-review';
import { CalculatorBackLink } from '@/routes/calculators/CalculatorUi';

type PreviewScenario = 'spray_mix' | 'fertilizer_mix';

export function CalculatorAIExplanationPreviewPage() {
  const [scenario, setScenario] = useState<PreviewScenario>('spray_mix');
  const request = useMemo(
    () => (scenario === 'spray_mix' ? createSprayMixAIExplanationFixture() : createFertilizerAIExplanationFixture()),
    [scenario],
  );
  const plan = useMemo(() => buildCalculatorAIExplanationPlan(request), [request]);
  const adapterRequest = useMemo(
    () =>
      createCalculatorAIExecutionRequestFixture({
        summary: request.summary,
        calculatorType: request.calculatorType,
        cropLabel: request.cropLabel,
        requestedActions: request.requestedActions,
        userQuestion: request.userQuestion,
      }),
    [request],
  );
  const adapterStatus = useMemo(() => getCalculatorAIAdapterStatus(), []);
  const adapterResponse = useMemo(() => explainCalculatorResult(adapterRequest), [adapterRequest]);
  const policySummary = summarizeCalculatorAIExplanationPolicy();

  return (
    <div>
      <PageHeader title="แผน AI อธิบายผลคำนวณ" subtitle="preview boundary เท่านั้น ยังไม่เรียก AI จริง" showBack />
      <div className="grid gap-5 px-5 pb-6">
        <Card className="overflow-hidden bg-kaset-deep text-white">
          <div className="relative p-5">
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10" />
            <div className="relative flex gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-white text-kaset-deep">
                <BrainCircuit aria-hidden="true" className="h-7 w-7" />
              </span>
              <div className="min-w-0">
                <Badge className="bg-white/15 text-white" tone="green">
                  M55 no real AI call
                </Badge>
                <h2 className="mt-3 text-2xl font-extrabold leading-8">AI อธิบายได้ แต่ห้ามเปลี่ยนผลคำนวณ</h2>
                <p className="mt-2 text-sm leading-6 text-emerald-50/90">
                  หน้านี้แสดงแผน prompt และ policy สำหรับอนาคตเท่านั้น ไม่มี network call ไม่มี sponsor และไม่มีคำแนะนำแฝง
                </p>
              </div>
            </div>
          </div>
        </Card>

        <NoticeBox tone="warning" title="ยังไม่เรียก AI จริง">
          แผนนี้เป็น local preview สำหรับกำหนดขอบเขตเท่านั้น ผลคำนวณ deterministic ต้องคงเดิม และ AI ห้ามแนะนำสินค้าเคมี ปุ๋ยนอกสูตร sponsor หรือรับประกันผลผลิต/กำไร
        </NoticeBox>

        <Card className="border-indigo-200 bg-indigo-50 p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-white text-indigo-800">
              <BrainCircuit aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-extrabold text-indigo-950">M57 adapter contract preview</h2>
                <StatusPill tone="info">mode: {adapterStatus.mode}</StatusPill>
                <StatusPill tone={adapterResponse.status === 'fixture_explained' ? 'success' : 'warning'}>
                  {adapterResponse.status}
                </StatusPill>
              </div>
              <p className="mt-2 text-sm leading-6 text-indigo-900">
                local fixture result สร้างจาก locked snapshot เท่านั้น · noRealAICall {String(adapterResponse.noRealAICall)} · network {String(adapterResponse.networkCallAttempted)}
              </p>
              <p className="mt-3 rounded-lg bg-white p-3 text-sm font-bold leading-6 text-indigo-950">
                lockedResultHash: {adapterResponse.lockedResultHash}
              </p>
              <pre className="mt-3 max-h-[240px] overflow-auto whitespace-pre-wrap rounded-lg bg-white p-3 text-sm leading-6 text-slate-700 ring-1 ring-indigo-900/10">
                {adapterResponse.explanationText ?? adapterResponse.disabledReason}
              </pre>
              <Link className="mt-3 inline-flex min-h-11 items-center justify-center rounded-full bg-indigo-900 px-4 text-sm font-extrabold text-white" to="/app/calculators/ai-adapter-status">
                เปิด adapter status
              </Link>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex flex-wrap gap-2">
            <button
              className={
                scenario === 'spray_mix'
                  ? 'min-h-11 rounded-full bg-kaset-deep px-4 text-sm font-extrabold text-white'
                  : 'min-h-11 rounded-full bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10'
              }
              onClick={() => setScenario('spray_mix')}
              type="button"
            >
              ตัวอย่างผสมยา
            </button>
            <button
              className={
                scenario === 'fertilizer_mix'
                  ? 'min-h-11 rounded-full bg-kaset-deep px-4 text-sm font-extrabold text-white'
                  : 'min-h-11 rounded-full bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10'
              }
              onClick={() => setScenario('fertilizer_mix')}
              type="button"
            >
              ตัวอย่างปุ๋ย
            </button>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
              <CheckCircle2 aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-extrabold text-kaset-ink">Example calculator result</h2>
                <StatusPill tone="info">{request.summary.calculatorShortLabel}</StatusPill>
                <StatusPill tone={plan.riskLevel === 'high' ? 'warning' : plan.riskLevel === 'medium' ? 'info' : 'success'}>
                  risk: {plan.riskLevel}
                </StatusPill>
              </div>
              <div className="mt-3 grid gap-2">
                {plan.resultValueSnapshot.map((line) => (
                  <p className="rounded-lg bg-kaset-mist p-3 text-sm leading-6 text-slate-700" key={line}>
                    {line}
                  </p>
                ))}
              </div>
              <p className="mt-3 text-sm font-bold leading-6 text-kaset-deep">
                deterministicResultUnchanged: {String(plan.formulaIntegrity.deterministicResultUnchanged)} · noRealAICall: {String(plan.noRealAICall)}
              </p>
            </div>
          </div>
        </Card>

        <section className="grid gap-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-extrabold text-kaset-ink">Allowed actions</h2>
            <StatusPill tone="success">{policySummary.allowedCount}</StatusPill>
          </div>
          {plan.allowedSections.map((section) => (
            <Card className="p-4" key={section.id}>
              <div className="flex gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
                  <CheckCircle2 aria-hidden="true" className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-extrabold text-kaset-ink">{section.title}</h3>
                  <div className="mt-2 grid gap-2">
                    {section.bullets.map((bullet) => (
                      <p className="rounded-lg bg-white p-3 text-sm leading-6 text-slate-700 ring-1 ring-kaset-deep/5" key={bullet}>
                        {bullet}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </section>

        <section className="grid gap-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-extrabold text-kaset-ink">Blocked actions</h2>
            <StatusPill tone="danger">{policySummary.blockedCount}</StatusPill>
          </div>
          {plan.blockedSections.map((section) => (
            <Card className="p-4" key={section.id}>
              <div className="flex gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-rose-50 text-rose-800">
                  <XCircle aria-hidden="true" className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-extrabold text-kaset-ink">{section.title}</h3>
                    {plan.blockedRequestedActions.includes(section.id) ? <Badge tone="rose">blocked in request</Badge> : null}
                  </div>
                  <p className="mt-2 rounded-lg bg-rose-50 p-3 text-sm leading-6 text-rose-950">{section.reason}</p>
                </div>
              </div>
            </Card>
          ))}
        </section>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-amber-100 text-amber-800">
              <ShieldAlert aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-extrabold text-kaset-ink">Prompt scaffold preview</h2>
              <pre className="mt-3 max-h-[420px] overflow-auto whitespace-pre-wrap rounded-lg bg-kaset-mist p-3 text-sm leading-6 text-slate-700">
                {plan.promptScaffoldPreview}
              </pre>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
              <ShieldCheck aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-extrabold text-kaset-ink">Safety notes</h2>
              <div className="mt-3 grid gap-2">
                {plan.safetyDisclaimers.map((note) => (
                  <p className="rounded-lg bg-white p-3 text-sm leading-6 text-slate-700 ring-1 ring-kaset-deep/5" key={note}>
                    {note}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <NoticeBox tone="info" title="Policy summary">
          Allowed {policySummary.allowedCount} actions · blocked {calculatorAIBlockedActions.length} actions · noRealAICall true · deterministic output stays unchanged.
        </NoticeBox>

        <div className="grid gap-2 sm:grid-cols-4">
          <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-kaset-deep px-4 text-sm font-extrabold text-white" to="/app/calculators/qa">
            Calculator QA
          </Link>
          <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-indigo-900 px-4 text-sm font-extrabold text-white" to="/app/calculators/ai-architecture">
            AI architecture
          </Link>
          <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10" to="/app/calculators/saved-results">
            Saved results
          </Link>
          <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10" to="/app/calculators/ai-adapter-status">
            Adapter status
          </Link>
        </div>
        <CalculatorBackLink />
      </div>
    </div>
  );
}
