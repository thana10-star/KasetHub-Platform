import { BrainCircuit, CheckCircle2, ListChecks, ServerOff, ShieldCheck, ToggleLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { StatusPill } from '@/components/ui/StatusPill';
import { createSprayMixAIExplanationFixture } from '@/services/agri-calculators/calculator-ai-explanation-fixtures';
import {
  explainCalculatorResult,
  getCalculatorAIAdapterStatus,
} from '@/services/agri-calculators/calculator-ai-adapter';
import { createCalculatorAIExecutionRequestFixture } from '@/services/agri-calculators/calculator-ai-backend-review';
import { CalculatorBackLink } from '@/routes/calculators/CalculatorUi';

const stagingChecklist = [
  'มี backend endpoint ที่เจ้าของระบบควบคุม prompt และ provider key',
  'ล็อก calculator snapshot และตรวจ lock hash ก่อนสร้าง prompt',
  'บันทึก policy version, prompt template version และ safety decision แบบ audit-ready',
  'เปิด VITE_ENABLE_CALCULATOR_AI_BACKEND=true เฉพาะ staging ที่ตรวจแล้ว',
  'เปิด VITE_ENABLE_CALCULATOR_AI_NETWORK=true เฉพาะเมื่อมี endpoint จริงและ rate limit',
  'ทดสอบว่า AI ไม่เปลี่ยนผลคำนวณ ไม่แทรก sponsor และไม่แนะนำสารเคมี/สินค้า',
];

export function CalculatorAIAdapterStatusPage() {
  const adapterStatus = getCalculatorAIAdapterStatus();
  const source = createSprayMixAIExplanationFixture();
  const sampleRequest = createCalculatorAIExecutionRequestFixture({
    summary: source.summary,
    calculatorType: 'spray_mix',
    requestedActions: ['explain_inputs', 'explain_formulas'],
    userQuestion: 'อธิบายผลนี้แบบง่ายและไม่เปลี่ยนตัวเลข',
  });
  const sampleResponse = explainCalculatorResult(sampleRequest);

  return (
    <div>
      <PageHeader title="สถานะ Adapter AI เครื่องคำนวณ" subtitle="contract สำหรับอนาคต ยังไม่เรียก AI จริง" showBack />
      <div className="grid gap-5 px-5 pb-6">
        <Card className="overflow-hidden bg-kaset-deep text-white">
          <div className="relative p-5">
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10" />
            <div className="relative flex gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-white text-kaset-deep">
                <ToggleLeft aria-hidden="true" className="h-7 w-7" />
              </span>
              <div className="min-w-0">
                <Badge className="bg-white/15 text-white" tone="green">
                  M57 adapter contract
                </Badge>
                <h2 className="mt-3 text-2xl font-extrabold leading-8">ค่าเริ่มต้นคือ local_fixture และไม่มี network</h2>
                <p className="mt-2 text-sm leading-6 text-emerald-50/90">
                  หน้านี้แสดง feature flags, adapter path, locked hash และข้อจำกัดก่อนเปิด backend AI จริงในอนาคต
                </p>
              </div>
            </div>
          </div>
        </Card>

        <NoticeBox tone="warning" title="ยังไม่เรียก AI จริง">
          M57 เป็น contract และ local fixture เท่านั้น ไม่มี fetch ไม่มี endpoint ไม่มี provider key ไม่มี Supabase write และไม่ส่งข้อมูลออกจากเครื่องโดยค่าเริ่มต้น
        </NoticeBox>

        <section className="grid grid-cols-2 gap-3">
          <Card className="p-4">
            <p className="text-xs font-bold text-slate-500">VITE_CALCULATOR_AI_MODE</p>
            <p className="mt-2 break-words text-xl font-extrabold text-kaset-deep">{adapterStatus.mode}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs font-bold text-slate-500">Adapter path</p>
            <p className="mt-2 break-words text-xl font-extrabold text-kaset-deep">{adapterStatus.currentAdapterPath}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs font-bold text-slate-500">Backend flag</p>
            <p className="mt-2 text-xl font-extrabold text-kaset-deep">{String(adapterStatus.backendEnabled)}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs font-bold text-slate-500">Network flag</p>
            <p className="mt-2 text-xl font-extrabold text-kaset-deep">{String(adapterStatus.networkEnabled)}</p>
          </Card>
        </section>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
              <ShieldCheck aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-extrabold text-kaset-ink">Current safety status</h2>
                <StatusPill tone={adapterStatus.canCallNetwork ? 'warning' : 'success'}>{adapterStatus.safetyStatus}</StatusPill>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">{adapterStatus.readinessLabel}</p>
              <div className="mt-3 grid gap-2">
                {adapterStatus.warnings.map((warning) => (
                  <p className="rounded-lg bg-kaset-mist p-3 text-sm leading-6 text-slate-700" key={warning}>
                    {warning}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-indigo-100 text-indigo-800">
              <BrainCircuit aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-extrabold text-kaset-ink">Local fixture result</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                <StatusPill tone={sampleResponse.status === 'fixture_explained' ? 'success' : 'warning'}>
                  {sampleResponse.status}
                </StatusPill>
                <StatusPill tone="info">noRealAICall: {String(sampleResponse.noRealAICall)}</StatusPill>
                <StatusPill tone="success">network: {String(sampleResponse.networkCallAttempted)}</StatusPill>
              </div>
              <p className="mt-3 rounded-lg bg-kaset-mist p-3 text-sm font-bold leading-6 text-kaset-deep">
                lockedResultHash: {sampleResponse.lockedResultHash}
              </p>
              <pre className="mt-3 max-h-[260px] overflow-auto whitespace-pre-wrap rounded-lg bg-white p-3 text-sm leading-6 text-slate-700 ring-1 ring-kaset-deep/10">
                {sampleResponse.explanationText ?? sampleResponse.disabledReason}
              </pre>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-sky-100 text-sky-800">
              <ServerOff aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-extrabold text-kaset-ink">Supported request types</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {adapterStatus.supportedRequestTypes.map((type) => (
                  <Badge key={type} tone="neutral">
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-amber-100 text-amber-800">
              <ListChecks aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-extrabold text-kaset-ink">Future staging checklist</h2>
              <div className="mt-3 grid gap-2">
                {stagingChecklist.map((item) => (
                  <p className="rounded-lg bg-amber-50 p-3 text-sm leading-6 text-amber-950" key={item}>
                    <CheckCircle2 aria-hidden="true" className="mr-2 inline h-4 w-4" />
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <div className="grid gap-2 sm:grid-cols-3">
          <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-indigo-900 px-4 text-sm font-extrabold text-white" to="/app/calculators/ai-architecture">
            AI architecture
          </Link>
          <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-kaset-deep px-4 text-sm font-extrabold text-white" to="/app/admin">
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
