import { AlertTriangle, CheckCircle2, FlaskConical, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { StatusPill } from '@/components/ui/StatusPill';
import { calculatorCards, calculatorLocalOnlyDisclaimer } from '@/services/agri-calculators/agri-calculator-fixtures';
import type { AgriCalculatorTestRun, AgriCalculatorTestStatus } from '@/services/agri-calculators/agri-calculator-test-fixtures';
import { runAgriCalculatorTestSuite } from '@/services/agri-calculators/agri-calculator-test-fixtures';
import { CalculatorBackLink } from '@/routes/calculators/CalculatorUi';
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
  'ยังเป็น test fixtures แบบ deterministic ไม่ใช่ unit test runner แยกจาก build',
  'ยังไม่มี crop-specific fertilizer rule engine หรือ soil test interpretation',
  'ยังไม่มี OCR อ่านฉลากยา/ปุ๋ย และไม่มีฐานข้อมูลสารเคมีจริง',
  'ยังไม่มีโมเดลผลผลิตจริง ราคา real-time หรือระบบ break-even เต็มรูปแบบ',
  'ไม่มี backend sync, Supabase write, AI call, sponsor หรือ affiliate integration',
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

export function CalculatorQAPage() {
  const suite = runAgriCalculatorTestSuite();

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
                  M50 QA hardening
                </Badge>
                <h2 className="mt-3 text-2xl font-extrabold leading-8">ตรวจสูตรหลักก่อนขยายเป็นคำแนะนำขั้นสูง</h2>
                <p className="mt-2 text-sm leading-6 text-emerald-50/90">
                  ชุดตรวจนี้รันใน browser จาก fixtures เดียวกันกับเครื่องคำนวณ ไม่มี network call และไม่มีการเขียน backend
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
