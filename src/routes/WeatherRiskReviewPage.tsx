import { AlertTriangle, ClipboardList, FileText, GitBranch, ShieldCheck, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { LargeActionButton } from '@/components/ui/LargeActionButton';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { StatusPill } from '@/components/ui/StatusPill';
import { weatherAgriRiskCategoryLabels } from '@/services/weather/weather-agri-risk-boundary';
import { getWeatherRiskExpertReviewSummary } from '@/services/weather/weather-risk-expert-review';
import { weatherRiskReviewerRoleLabels } from '@/services/weather/weather-risk-review-fixtures';

const reviewTone = {
  pending: 'warning',
  changes_requested: 'danger',
  approved: 'success',
} as const;

export function WeatherRiskReviewPage() {
  const summary = getWeatherRiskExpertReviewSummary();

  return (
    <div>
      <PageHeader title="ตรวจพร้อม Expert Review กฎอากาศเกษตร" subtitle="M79 readiness: ยังไม่ใช่คำแนะนำเชิงสั่งการ" showBack />
      <div className="grid gap-5 px-5 pb-6">
        <Card className="overflow-hidden bg-slate-950 text-white">
          <div className="p-5">
            <div className="flex gap-3">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-white text-slate-950">
                <UserCheck aria-hidden="true" className="h-6 w-6" />
              </span>
              <div className="min-w-0">
                <StatusPill className="bg-white/15 text-white ring-white/20" tone="warning">
                  prescriptive blocked
                </StatusPill>
                <h2 className="mt-3 text-2xl font-extrabold leading-8">Expert-review readiness</h2>
                <p className="mt-2 text-sm leading-6 text-slate-200">
                  เก็บเวอร์ชันกฎ แหล่งอ้างอิง placeholder ผู้ตรวจทาน pending และตัวอย่าง false positive/false negative
                  เพื่อพิสูจน์ว่ากฎยังให้ได้แค่คำเตือนทั่วไป
                </p>
              </div>
            </div>
          </div>
        </Card>

        <NoticeBox tone="warning" icon={AlertTriangle} title="ยังไม่ใช่คำแนะนำเชิงสั่งการ">
          M79 ยังไม่อนุญาตให้กฎอากาศสั่งให้พ่นยา ให้น้ำ ใส่ปุ๋ย เลื่อนเก็บเกี่ยว หรือใช้สินค้าใด ๆ แบบเฉพาะเจาะจง
        </NoticeBox>

        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Card className="p-4">
            <GitBranch aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <p className="mt-2 text-2xl font-extrabold text-kaset-ink">{summary.versionCount}</p>
            <p className="text-xs font-bold text-slate-500">rule versions</p>
          </Card>
          <Card className="p-4">
            <FileText aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <p className="mt-2 text-2xl font-extrabold text-kaset-ink">{summary.sourcePlaceholderCount}</p>
            <p className="text-xs font-bold text-slate-500">source placeholders</p>
          </Card>
          <Card className="p-4">
            <UserCheck aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <p className="mt-2 text-2xl font-extrabold text-kaset-ink">{summary.pendingSignoffCount}</p>
            <p className="text-xs font-bold text-slate-500">pending signoffs</p>
          </Card>
          <Card className="p-4">
            <ShieldCheck aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <p className="mt-2 text-2xl font-extrabold text-kaset-ink">{String(summary.allPrescriptiveBlocked)}</p>
            <p className="text-xs font-bold text-slate-500">prescriptive blocked</p>
          </Card>
        </section>

        <section className="grid gap-4">
          {summary.versions.map((version) => {
            const gate = summary.gates.find((item) => item.versionId === version.versionId);

            return (
              <Card className="p-4" key={version.versionId}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Badge tone="neutral">{weatherAgriRiskCategoryLabels[version.category]}</Badge>
                    <h3 className="mt-2 font-extrabold leading-6 text-kaset-ink">{version.title}</h3>
                    <p className="mt-1 text-xs font-bold leading-5 text-slate-500">{version.versionId}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <StatusPill tone="warning">{version.status}</StatusPill>
                    <Badge tone="gold">prescriptive {String(version.prescriptiveAllowed)}</Badge>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 lg:grid-cols-3">
                  <div className="rounded-lg bg-kaset-mist p-3">
                    <h4 className="flex items-center gap-2 text-sm font-extrabold text-kaset-ink">
                      <FileText aria-hidden="true" className="h-4 w-4" />
                      Source metadata
                    </h4>
                    <div className="mt-2 grid gap-2">
                      {version.sourceMetadata.map((source) => (
                        <p className="text-xs font-bold leading-5 text-kaset-deep" key={source.id}>
                          {source.title}: {source.ownerPlaceholder}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-lg bg-white p-3 ring-1 ring-slate-100">
                    <h4 className="flex items-center gap-2 text-sm font-extrabold text-kaset-ink">
                      <UserCheck aria-hidden="true" className="h-4 w-4" />
                      Reviewer signoff
                    </h4>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {version.reviewerSignoffs.map((signoff) => (
                        <StatusPill key={signoff.id} tone={reviewTone[signoff.status]}>
                          {weatherRiskReviewerRoleLabels[signoff.role]}: {signoff.status}
                        </StatusPill>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-lg bg-amber-50 p-3">
                    <h4 className="flex items-center gap-2 text-sm font-extrabold text-amber-950">
                      <ClipboardList aria-hidden="true" className="h-4 w-4" />
                      Prescriptive blockers
                    </h4>
                    <div className="mt-2 grid gap-2">
                      {(gate?.blockers ?? []).slice(0, 4).map((blocker) => (
                        <p className="text-xs font-bold leading-5 text-amber-900" key={blocker.id}>
                          {blocker.label}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 lg:grid-cols-2">
                  {version.falsePositiveExamples.map((example) => (
                    <div className="rounded-lg bg-slate-50 p-3" key={example.id}>
                      <Badge tone="neutral">false positive</Badge>
                      <p className="mt-2 text-sm font-extrabold leading-6 text-kaset-ink">{example.scenario}</p>
                      <p className="mt-1 text-xs font-bold leading-5 text-slate-600">{example.mitigationNote}</p>
                    </div>
                  ))}
                  {version.falseNegativeExamples.map((example) => (
                    <div className="rounded-lg bg-slate-50 p-3" key={example.id}>
                      <Badge tone="neutral">false negative</Badge>
                      <p className="mt-2 text-sm font-extrabold leading-6 text-kaset-ink">{example.scenario}</p>
                      <p className="mt-1 text-xs font-bold leading-5 text-slate-600">{example.mitigationNote}</p>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </section>

        <div className="grid gap-3 sm:grid-cols-2">
          <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-kaset-deep px-4 text-sm font-extrabold text-white" to="/app/weather/risk-rules">
            กลับไปกฎความเสี่ยง
          </Link>
          <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10" to="/app/weather/qa">
            เปิด Weather QA
          </Link>
        </div>

        <LargeActionButton
          description="QA รวมแสดง route coverage และยืนยันว่า weather risk ยังเป็น general caution เท่านั้น"
          icon={ShieldCheck}
          label="ไปหน้า QA รวม"
          to="/app/qa"
          variant="white"
        />
      </div>
    </div>
  );
}
