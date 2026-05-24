import { BrainCircuit, ClipboardCheck, Scale, ShieldCheck, Sprout } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { StatusPill } from '@/components/ui/StatusPill';
import {
  calculatorSafetyBoundarySections,
  deterministicCalculatorBoundary,
} from '@/services/agri-calculators/crop-calculator-boundaries';
import { cropCalculatorProfiles } from '@/services/agri-calculators/crop-calculator-profiles';
import { summarizeAgriCalculatorUnitTestPlan } from '@/services/agri-calculators/agri-calculator-unit-test-plan';
import { CalculatorBackLink } from '@/routes/calculators/CalculatorUi';

const confirmationReasons = [
  'ฉลากจริงเป็นแหล่งข้อมูลหลักสำหรับยา/สารเคมี เพราะมีอัตราใช้ คำเตือน และข้อกฎหมาย',
  'ผลตรวจดินและสภาพแปลงจริงช่วยลดความเสี่ยงจากการใส่ปุ๋ยผิดหรือเกินจำเป็น',
  'ผู้เชี่ยวชาญหรือเจ้าหน้าที่เกษตรช่วยดูบริบทที่สูตรเลขพื้นฐานยังไม่รู้',
  'ตัวเลขต้นทุนและผลผลิตอาจเปลี่ยนตามฤดู ราคา แรงงาน โรคพืช และสภาพอากาศ',
];

export function CalculatorSafetyPage() {
  const unitTestPlan = summarizeAgriCalculatorUnitTestPlan();

  return (
    <div>
      <PageHeader title="ความปลอดภัยเครื่องคำนวณ" subtitle="ขอบเขตสูตร ตัวอย่างพืช และคำแนะนำในอนาคต" showBack />
      <div className="grid gap-5 px-5 pb-6">
        <Card className="overflow-hidden bg-kaset-deep text-white">
          <div className="relative p-5">
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10" />
            <div className="relative flex gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-white text-kaset-deep">
                <ShieldCheck aria-hidden="true" className="h-7 w-7" />
              </span>
              <div className="min-w-0">
                <Badge className="bg-white/15 text-white" tone="green">
                  M51 safety boundary
                </Badge>
                <h2 className="mt-3 text-2xl font-extrabold leading-8">ช่วยคิดเลขได้ แต่ยังไม่ใช่คำแนะนำทางวิชาการสุดท้าย</h2>
                <p className="mt-2 text-sm leading-6 text-emerald-50/90">
                  หน้า safety นี้แยกสูตร deterministic ออกจาก AI คำแนะนำผู้เชี่ยวชาญ โฆษณา และผลิตภัณฑ์ที่มีความเสี่ยง
                </p>
              </div>
            </div>
          </div>
        </Card>

        <NoticeBox tone="warning" title="หลักสำคัญ">
          {deterministicCalculatorBoundary} ตัวอย่างพืชเป็นค่าเริ่มต้นเพื่อช่วยกรอก ไม่ใช่คำแนะนำทางวิชาการสุดท้าย
        </NoticeBox>

        <section className="grid gap-3">
          {calculatorSafetyBoundarySections.map((section) => (
            <Card className="p-4" key={section.id}>
              <div className="flex gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
                  <Scale aria-hidden="true" className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="font-extrabold text-kaset-ink">{section.title}</h2>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{section.summary}</p>
                  <ul className="mt-3 grid gap-2 text-sm leading-6 text-slate-700">
                    {section.bullets.map((bullet) => (
                      <li className="rounded-lg bg-kaset-mist p-3" key={bullet}>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          ))}
        </section>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-amber-100 text-amber-800">
              <ClipboardCheck aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-extrabold text-kaset-ink">ทำไมต้องตรวจฉลาก/ดิน/ผู้เชี่ยวชาญ</h2>
              <div className="mt-3 grid gap-2">
                {confirmationReasons.map((reason) => (
                  <p className="rounded-lg bg-amber-50 p-3 text-sm leading-6 text-amber-950" key={reason}>
                    {reason}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
              <Sprout aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-extrabold text-kaset-ink">Crop profiles planning</h2>
                <StatusPill tone="info">{cropCalculatorProfiles.length} crops</StatusPill>
              </div>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                ทุก crop profile มีสถานะปุ๋ยเป็น planning_only และไม่มี pesticide/product recommendation
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {cropCalculatorProfiles.map((profile) => (
                  <Badge key={profile.cropKey} tone="neutral">
                    {profile.thaiDisplayName}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-sky-100 text-sky-800">
              <BrainCircuit aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-extrabold text-kaset-ink">Unit-test readiness</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                แผน unit test มี {unitTestPlan.totalCount} รายการ · high priority {unitTestPlan.highPriorityCount} · ยังไม่เพิ่ม test runner
              </p>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-2">
          <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-kaset-deep px-4 text-sm font-extrabold text-white" to="/app/calculators/qa">
            เปิด QA
          </Link>
          <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10" to="/app/profile">
            โปรไฟล์
          </Link>
        </div>
        <CalculatorBackLink />
      </div>
    </div>
  );
}
