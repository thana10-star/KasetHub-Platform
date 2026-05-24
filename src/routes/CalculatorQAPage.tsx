import { AlertTriangle, BrainCircuit, CheckCircle2, FlaskConical, History, ShieldCheck, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { StatusPill } from '@/components/ui/StatusPill';
import { calculatorCards, calculatorLocalOnlyDisclaimer } from '@/services/agri-calculators/agri-calculator-fixtures';
import type { AgriCalculatorTestRun, AgriCalculatorTestStatus } from '@/services/agri-calculators/agri-calculator-test-fixtures';
import { runAgriCalculatorTestSuite } from '@/services/agri-calculators/agri-calculator-test-fixtures';
import type { AgriCalculatorEdgeRun } from '@/services/agri-calculators/agri-calculator-edge-fixtures';
import { runAgriCalculatorEdgeSuite } from '@/services/agri-calculators/agri-calculator-edge-fixtures';
import { summarizeAgriCalculatorUnitTestPlan } from '@/services/agri-calculators/agri-calculator-unit-test-plan';
import { CalculatorBackLink, CalculatorRewardedAdsPlanningCard } from '@/routes/calculators/CalculatorUi';
import { calculatorIconMap } from '@/routes/calculators/calculator-icons';

const statusLabels: Record<AgriCalculatorTestStatus, string> = {
  pass: 'ผ่าน',
  warn: 'เตือน',
  fail: 'ไม่ผ่าน',
};

const statusTone: Record<AgriCalculatorTestStatus, 'success' | 'warning' | 'danger'> = {
  pass: 'success',
  warn: 'warning',
  fail: 'danger',
};

const statusIcon: Record<AgriCalculatorTestStatus, typeof CheckCircle2> = {
  pass: CheckCircle2,
  warn: AlertTriangle,
  fail: XCircle,
};

const knownLimitations = [
  'Vitest ครอบคลุม pure service tests แล้ว แต่ยังไม่มี browser/component test runner',
  'ยังไม่มี crop-specific fertilizer rule engine หรือ soil test interpretation',
  'ยังไม่มี OCR อ่านฉลากยา/ปุ๋ย และไม่มีฐานข้อมูลสารเคมีจริง',
  'ยังไม่มีโมเดลผลผลิตจริง ราคา real-time หรือระบบ break-even เต็มรูปแบบ',
  'ไม่มี backend sync, Supabase write, AI call, sponsor หรือ affiliate integration',
];

const regressionNotes = [
  'สูตร deterministic ต้องคงผลลัพธ์เดิมเมื่อ input เดิม',
  'ชั้น recommendation ในอนาคตต้องไม่เปลี่ยนผลคำนวณแบบเงียบ ๆ',
  'AI explanation ต้องแยกจาก core formula และต้องบอกสมมติฐาน',
  'ตัวอย่าง crop profile เป็นค่าเริ่มต้นช่วยกรอก ไม่ใช่คำแนะนำทางวิชาการสุดท้าย',
];

function TestCaseCard({ run }: { run: AgriCalculatorTestRun }) {
  const card = calculatorCards.find((item) => item.id === run.category) ?? calculatorCards[0];
  const Icon = calculatorIconMap[card.iconKey];
  const StatusIcon = statusIcon[run.status];

  return (
    <Card className="p-4">
      <div className="flex gap-3">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
          <Icon aria-hidden="true" className="h-6 w-6" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="sky">{card.shortLabel}</Badge>
            <StatusPill tone={statusTone[run.status]}>
              <StatusIcon aria-hidden="true" className="mr-1 h-4 w-4" />
              {statusLabels[run.status]}
            </StatusPill>
          </div>
          <h2 className="mt-2 font-extrabold leading-6 text-kaset-ink">{run.title}</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">{run.detail}</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-lg bg-kaset-mist p-3">
              <p className="text-xs font-bold text-slate-500">ค่าที่คาดไว้</p>
              <p className="mt-1 text-lg font-extrabold text-kaset-deep">{run.expectedLabel}</p>
            </div>
            <div className="rounded-lg bg-white p-3 ring-1 ring-kaset-deep/10">
              <p className="text-xs font-bold text-slate-500">ผลจริง</p>
              <p className="mt-1 text-lg font-extrabold text-kaset-ink">{run.actualLabel}</p>
            </div>
          </div>
          <p className="mt-2 text-xs font-bold leading-5 text-slate-500">ส่วนต่าง: {run.differenceLabel}</p>
          {run.warnings.length > 0 ? (
            <div className="mt-3 rounded-lg bg-amber-50 p-3 text-sm font-bold leading-6 text-amber-950">
              {run.warnings.join(' · ')}
            </div>
          ) : null}
        </div>
      </div>
    </Card>
  );
}

function EdgeCaseCard({ run }: { run: AgriCalculatorEdgeRun }) {
  const StatusIcon = statusIcon[run.actualStatus as AgriCalculatorTestStatus];

  return (
    <Card className="p-4">
      <div className="flex gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-amber-100 text-amber-800">
          <StatusIcon aria-hidden="true" className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="neutral">{run.categoryLabel}</Badge>
            <StatusPill tone={statusTone[run.actualStatus as AgriCalculatorTestStatus]}>
              {statusLabels[run.actualStatus as AgriCalculatorTestStatus]}
            </StatusPill>
            <StatusPill tone={run.isMatch ? 'success' : 'danger'}>{run.isMatch ? 'ตามคาด' : 'ต้องตรวจ'}</StatusPill>
          </div>
          <h3 className="mt-2 font-extrabold leading-6 text-kaset-ink">{run.title}</h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">{run.note}</p>
          <p className="mt-2 text-xs font-bold leading-5 text-slate-500">
            คาดไว้ {statusLabels[run.expectedStatus as AgriCalculatorTestStatus]} · ได้จริง {statusLabels[run.actualStatus as AgriCalculatorTestStatus]}
          </p>
          {run.warnings.length > 0 ? (
            <div className="mt-3 rounded-lg bg-amber-50 p-3 text-sm font-bold leading-6 text-amber-950">
              {run.warnings.join(' · ')}
            </div>
          ) : null}
        </div>
      </div>
    </Card>
  );
}

export function CalculatorQAPage() {
  const suite = runAgriCalculatorTestSuite();
  const edgeSuite = runAgriCalculatorEdgeSuite();
  const unitTestPlan = summarizeAgriCalculatorUnitTestPlan();

  return (
    <div>
      <PageHeader title="QA เครื่องคำนวณ" subtitle="ตรวจค่าที่คาดไว้เทียบกับผลจริงแบบ local-only" showBack />
      <div className="grid gap-5 px-5 pb-6">
        <Card className="overflow-hidden bg-kaset-deep text-white">
          <div className="relative p-5">
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10" />
            <div className="relative flex gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-white text-kaset-deep">
                <FlaskConical aria-hidden="true" className="h-7 w-7" />
              </span>
              <div className="min-w-0">
                <Badge className="bg-white/15 text-white" tone="green">
                  M52 formal tests
                </Badge>
                <h2 className="mt-3 text-2xl font-extrabold leading-8">ตรวจสูตรหลักและ edge cases ก่อนขยายคำแนะนำ</h2>
                <p className="mt-2 text-sm leading-6 text-emerald-50/90">
                  ชุดตรวจนี้เชื่อมกับ Vitest service tests และ fixtures เดียวกับเครื่องคำนวณ ไม่มี network call และไม่มีการเขียน backend
                </p>
              </div>
            </div>
          </div>
        </Card>

        <section className="grid grid-cols-4 gap-2 text-center">
          <Card className="p-3">
            <p className="text-xl font-extrabold text-kaset-deep">{suite.totalCount}</p>
            <p className="text-[11px] font-bold text-slate-500">ทั้งหมด</p>
          </Card>
          <Card className="p-3">
            <p className="text-xl font-extrabold text-kaset-deep">{suite.passCount}</p>
            <p className="text-[11px] font-bold text-slate-500">ผ่าน</p>
          </Card>
          <Card className="p-3">
            <p className="text-xl font-extrabold text-amber-800">{suite.warnCount}</p>
            <p className="text-[11px] font-bold text-slate-500">เตือน</p>
          </Card>
          <Card className="p-3">
            <p className="text-xl font-extrabold text-rose-800">{suite.failCount}</p>
            <p className="text-[11px] font-bold text-slate-500">ไม่ผ่าน</p>
          </Card>
        </section>

        <NoticeBox tone="warning" title="ขอบเขตการตรวจ">
          ผลทดสอบนี้ช่วยจับความคลาดเคลื่อนของสูตรพื้นฐานเท่านั้น ไม่ใช่การรับรองทางเกษตร และไม่แทนฉลากยา/ปุ๋ย นักวิชาการเกษตร หรือข้อมูลรังวัดจริง
        </NoticeBox>

        <Card className="p-4">
          <h2 className="font-extrabold text-kaset-ink">Formal test coverage summary</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Vitest service tests ครอบคลุม {unitTestPlan.implementedCount}/{unitTestPlan.totalCount} กลุ่ม · deterministic fixtures {suite.passCount}/{suite.totalCount} ผ่าน · edge cases {edgeSuite.passCount}/{edgeSuite.totalCount} ตามคาด
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {unitTestPlan.groups.map((group) => (
              <Badge key={group} tone="neutral">
                {group}
              </Badge>
            ))}
          </div>
        </Card>

        <Link className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-amber-900 px-4 text-sm font-extrabold text-white" to="/app/calculators/safety">
          <ShieldCheck aria-hidden="true" className="h-5 w-5" />
          เปิดขอบเขตความปลอดภัย
        </Link>

        <Link className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10" to="/app/calculators/saved-results">
          <History aria-hidden="true" className="h-5 w-5" />
          เปิดผลคำนวณที่บันทึกไว้
        </Link>

        <Link className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10" to="/app/calculators/export-preview">
          <FlaskConical aria-hidden="true" className="h-5 w-5" />
          เปิดตัวอย่าง export
        </Link>

        <Link className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-indigo-900 px-4 text-sm font-extrabold text-white" to="/app/calculators/ai-explanation-preview">
          <BrainCircuit aria-hidden="true" className="h-5 w-5" />
          เปิดแผน AI อธิบายผล
        </Link>

        <Link className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10" to="/app/calculators/ai-architecture">
          <ShieldCheck aria-hidden="true" className="h-5 w-5" />
          เปิด architecture AI backend
        </Link>

        <CalculatorRewardedAdsPlanningCard compact />

        <section className="grid gap-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-extrabold text-kaset-ink">รายการทดสอบ</h2>
            <StatusPill tone={suite.failCount > 0 ? 'danger' : suite.warnCount > 0 ? 'warning' : 'success'}>
              {suite.failCount > 0 ? 'ต้องแก้' : suite.warnCount > 0 ? 'มีคำเตือน' : 'พร้อมใช้'}
            </StatusPill>
          </div>
          {suite.runs.map((run) => (
            <TestCaseCard key={run.id} run={run} />
          ))}
        </section>

        <NoticeBox tone="info" title="หมายเหตุ local-only">
          {calculatorLocalOnlyDisclaimer} หน้านี้อ่าน fixtures และคำนวณในเครื่องเท่านั้น ไม่มีการบันทึกขึ้น Supabase
        </NoticeBox>

        <Card className="p-4">
          <h2 className="font-extrabold text-kaset-ink">Regression-safe calculation notes</h2>
          <div className="mt-3 grid gap-2">
            {regressionNotes.map((note) => (
              <p className="rounded-lg bg-kaset-mist p-3 text-sm leading-6 text-slate-700" key={note}>
                {note}
              </p>
            ))}
          </div>
        </Card>

        <section className="grid gap-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-extrabold text-kaset-ink">Edge-case examples</h2>
            <StatusPill tone={edgeSuite.failCount > 0 ? 'danger' : 'success'}>
              {edgeSuite.passCount}/{edgeSuite.totalCount} ตามคาด
            </StatusPill>
          </div>
          {edgeSuite.runs.map((run) => (
            <EdgeCaseCard key={run.id} run={run} />
          ))}
        </section>

        <Card className="p-4">
          <h2 className="font-extrabold text-kaset-ink">Unit-test readiness plan</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            มีแผน unit test {unitTestPlan.totalCount} รายการ · implemented {unitTestPlan.implementedCount} · high priority {unitTestPlan.highPriorityCount}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {unitTestPlan.groups.map((group) => (
              <Badge key={group} tone="neutral">
                {group}
              </Badge>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="font-extrabold text-kaset-ink">Known limitations</h2>
          <div className="mt-3 grid gap-2">
            {knownLimitations.map((item) => (
              <p className="rounded-lg bg-kaset-mist p-3 text-sm leading-6 text-slate-700" key={item}>
                {item}
              </p>
            ))}
          </div>
        </Card>

        <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-kaset-deep px-4 text-sm font-extrabold text-white" to="/app/qa">
          เปิดหน้า QA รวม
        </Link>
        <CalculatorBackLink />
      </div>
    </div>
  );
}
