import { FileText, MessageCircle, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { StatusPill } from '@/components/ui/StatusPill';
import { calculatorCards } from '@/services/agri-calculators/agri-calculator-fixtures';
import {
  buildCalculatorExportTemplate,
  calculatorExportSourceLabel,
} from '@/services/agri-calculators/calculator-export-template-service';
import {
  buildCalculatorResultSummary,
} from '@/services/agri-calculators/calculator-result-summary-service';
import {
  calculateAgriCalculator,
  getDefaultInput,
} from '@/services/agri-calculators/agri-calculator-service';
import type { CalculatorCategory } from '@/services/agri-calculators/agri-calculator.types';
import { CalculatorBackLink } from '@/routes/calculators/CalculatorUi';

function createPreviewTemplate(category: CalculatorCategory) {
  const input = getDefaultInput(category);
  const result = calculateAgriCalculator(category, input);
  const summary = buildCalculatorResultSummary(category, input, result, {
    createdAt: '2026-05-24T08:00:00.000Z',
    id: `preview-${category}`,
  });

  return buildCalculatorExportTemplate(summary, {
    cropLabel: category === 'plant_spacing' ? 'ข้าว (ตัวอย่าง)' : undefined,
    generatedAt: '2026-05-24T08:00:00.000Z',
  });
}

export function CalculatorExportPreviewPage() {
  const templates = calculatorCards.map((card) => createPreviewTemplate(card.id));
  const featuredTemplate = templates[0];

  return (
    <div>
      <PageHeader title="ตัวอย่างข้อความ export" subtitle="ดูรูปแบบสรุปสำหรับ LINE และข้อความละเอียด" showBack />
      <div className="grid gap-5 px-5 pb-6">
        <Card className="overflow-hidden bg-kaset-deep text-white">
          <div className="relative p-5">
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10" />
            <div className="relative flex gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-white text-kaset-deep">
                <FileText aria-hidden="true" className="h-7 w-7" />
              </span>
              <div className="min-w-0">
                <Badge className="bg-white/15 text-white" tone="green">
                  M54 text templates
                </Badge>
                <h2 className="mt-3 text-2xl font-extrabold leading-8">ข้อความ export อ่านง่าย ไม่ใช่ PDF และไม่ส่งขึ้นระบบ</h2>
                <p className="mt-2 text-sm leading-6 text-emerald-50/90">
                  ใช้ดูตัวอย่างสรุปสั้นสำหรับ LINE และสรุปรายละเอียดก่อนเพิ่ม AI explanation หรือ monetization unlock ในอนาคต
                </p>
              </div>
            </div>
          </div>
        </Card>

        <NoticeBox tone="warning" title="ขอบเขต export">
          ไม่มี PDF ไม่มี backend save ไม่มี Supabase write และไม่มี AI recommendation ข้อความนี้เป็นผลคำนวณเบื้องต้นจากสูตร deterministic เท่านั้น
        </NoticeBox>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
              <MessageCircle aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-extrabold text-kaset-ink">รูปแบบข้อความสำหรับส่งต่อ</h2>
                <StatusPill tone="success">short</StatusPill>
              </div>
              <p className="mt-1 text-sm leading-6 text-slate-600">ออกแบบให้เป็นบรรทัดสั้น อ่านง่าย และคงคำเตือนสำคัญไว้เสมอ</p>
              <pre className="mt-3 whitespace-pre-wrap rounded-lg bg-kaset-mist p-3 text-sm leading-6 text-slate-700">
                {featuredTemplate.shortLineText}
              </pre>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-white text-kaset-deep ring-1 ring-kaset-deep/10">
              <FileText aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-extrabold text-kaset-ink">Long detail version</h2>
                <StatusPill tone="info">text only</StatusPill>
              </div>
              <p className="mt-1 text-sm leading-6 text-slate-600">มีข้อมูลที่กรอก ผลคำนวณ คำเตือน เวลา และที่มา: {calculatorExportSourceLabel}</p>
              <pre className="mt-3 max-h-[360px] overflow-auto whitespace-pre-wrap rounded-lg bg-kaset-mist p-3 text-sm leading-6 text-slate-700">
                {featuredTemplate.longDetailText}
              </pre>
            </div>
          </div>
        </Card>

        <section className="grid gap-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-extrabold text-kaset-ink">Template coverage</h2>
            <StatusPill tone="success">{templates.length} calculators</StatusPill>
          </div>
          {templates.map((template) => (
            <Card className="p-4" key={template.id}>
              <div className="flex gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
                  <ShieldCheck aria-hidden="true" className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-extrabold text-kaset-ink">{template.calculatorTitle}</h3>
                    <Badge tone={template.shortLineWasTruncated || template.longDetailWasTruncated ? 'gold' : 'neutral'}>
                      {template.shortLineWasTruncated || template.longDetailWasTruncated ? 'ย่อข้อความ' : 'ไม่ย่อ'}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{template.disclaimer}</p>
                  <p className="mt-2 rounded-lg bg-kaset-mist p-3 text-sm leading-6 text-slate-700">
                    {template.resultRecap.slice(0, 2).join(' · ')}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </section>

        <div className="grid grid-cols-2 gap-2">
          <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-kaset-deep px-4 text-sm font-extrabold text-white" to="/app/calculators/saved-results">
            ผลที่บันทึก
          </Link>
          <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10" to="/app/calculators/qa">
            QA
          </Link>
        </div>
        <CalculatorBackLink />
      </div>
    </div>
  );
}
