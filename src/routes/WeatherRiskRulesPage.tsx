import { AlertTriangle, CloudRain, ShieldCheck, Sprout } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { LargeActionButton } from '@/components/ui/LargeActionButton';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { StatusPill } from '@/components/ui/StatusPill';
import {
  getWeatherAgriRiskBoundarySummary,
  weatherAgriRiskCategoryLabels,
  weatherAgriRiskLevelLabels,
  weatherAgriRiskLevelTone,
} from '@/services/weather/weather-agri-risk-boundary';
import { getWeatherAgriRiskFixtureSummary } from '@/services/weather/weather-agri-risk-fixtures';
import { getWeatherAgriRiskRuleSummary } from '@/services/weather/weather-agri-risk-rules';
import { getWeatherRiskExpertReviewSummary } from '@/services/weather/weather-risk-expert-review';
import { getWeatherRiskReleaseAuditSummary } from '@/services/weather/weather-risk-release-audit';
import { getAITextProxyStatus } from '@/services/ai-text/ai-text-proxy';
import { buildAITextEndpointDryRunPlan } from '@/services/ai-text/ai-text-endpoint-dry-run';

export function WeatherRiskRulesPage() {
  const summary = getWeatherAgriRiskRuleSummary();
  const fixtures = getWeatherAgriRiskFixtureSummary();
  const boundary = getWeatherAgriRiskBoundarySummary();
  const expertReview = getWeatherRiskExpertReviewSummary();
  const releaseAudit = getWeatherRiskReleaseAuditSummary();
  const aiTextStatus = getAITextProxyStatus();
  const aiTextEndpointPlan = buildAITextEndpointDryRunPlan();

  return (
    <div>
      <PageHeader title="กฎความเสี่ยงอากาศเบื้องต้น" subtitle="preview สำหรับงานเกษตรทั่วไป ยังไม่ใช่กฎผู้เชี่ยวชาญตรวจทาน" showBack />
      <div className="grid gap-5 px-5 pb-6">
        <Card className="overflow-hidden bg-amber-900 text-white">
          <div className="p-5">
            <div className="flex gap-3">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-white text-amber-900">
                <CloudRain aria-hidden="true" className="h-6 w-6" />
              </span>
              <div className="min-w-0">
                <StatusPill className="bg-white/15 text-white ring-white/20" tone="warning">
                  M78 planning-only
                </StatusPill>
                <StatusPill className="ml-2 bg-white/15 text-white ring-white/20" tone="warning">
                  M79 review pending
                </StatusPill>
                <h2 className="mt-3 text-2xl font-extrabold leading-8">Agriculture weather risk readiness</h2>
                <p className="mt-2 text-sm leading-6 text-amber-50">
                  ใช้ดูฝน ลม ความชื้น ความร้อน และข้อมูลเก่าแบบกว้าง ๆ เท่านั้น ไม่มี AI ไม่มี GPS ไม่มีสินค้าแนะนำ และยังไม่ใช่คำแนะนำผู้เชี่ยวชาญ
                </p>
              </div>
            </div>
          </div>
        </Card>

        <NoticeBox tone="warning" icon={AlertTriangle} title="ยังไม่ใช่กฎ agronomy ที่ตรวจทานแล้ว">
          เกณฑ์ทั้งหมดติดป้าย `เบื้องต้น` และ `planning-only` ต้องมีผู้เชี่ยวชาญตรวจทานก่อนใช้เป็นคำแนะนำจริง · M79 versions {expertReview.versionCount} · M80 audit events {releaseAudit.auditEventCount} · release blocked {String(releaseAudit.releaseBlocked)}
        </NoticeBox>

        <NoticeBox tone="info" title="M81 AI text proxy readiness">
          mode {aiTextStatus.mode} · network {String(aiTextStatus.networkEnabled)} · fallback {String(aiTextStatus.fallbackToFixture)} · M82 fetch {String(aiTextEndpointPlan.fetchWouldRun)} · weather explanations stay proxy-only and non-prescriptive. <Link className="font-extrabold text-kaset-deep" to="/app/ai-text-status">เปิดสถานะ M81</Link> · <Link className="font-extrabold text-kaset-deep" to="/app/ai-text-endpoint-plan">เปิด M82 endpoint plan</Link>
        </NoticeBox>

        <section className="grid grid-cols-2 gap-3">
          {summary.categories.map((category) => (
            <Card className="p-4" key={category}>
              <Sprout aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
              <p className="mt-2 text-lg font-extrabold leading-7 text-kaset-ink">{weatherAgriRiskCategoryLabels[category]}</p>
              <p className="mt-1 text-xs font-bold leading-5 text-slate-500">general caution only</p>
            </Card>
          ))}
        </section>

        <section className="grid gap-3">
          <h2 className="text-lg font-extrabold text-kaset-ink">Threshold planning</h2>
          {summary.rules.map((rule) => (
            <Card className="p-4" key={rule.id}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Badge tone="neutral">{weatherAgriRiskCategoryLabels[rule.category]}</Badge>
                  <h3 className="mt-2 font-extrabold leading-6 text-kaset-ink">{rule.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{rule.thresholdLabel}</p>
                </div>
                <StatusPill tone={weatherAgriRiskLevelTone[rule.level]}>{weatherAgriRiskLevelLabels[rule.level]}</StatusPill>
              </div>
              <p className="mt-3 rounded-lg bg-kaset-mist p-3 text-xs font-bold leading-5 text-kaset-deep">{rule.note}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge tone="gold">planning-only {String(rule.planningOnly)}</Badge>
                <Badge tone="neutral">expertReviewed {String(rule.expertReviewed)}</Badge>
              </div>
            </Card>
          ))}
        </section>

        <section className="grid gap-3">
          <h2 className="text-lg font-extrabold text-kaset-ink">Example assessments</h2>
          {fixtures.assessments.map((assessment) => (
            <Card className="p-4" key={assessment.id + assessment.generatedAt}>
              <div className="flex flex-wrap gap-2">
                <StatusPill tone={weatherAgriRiskLevelTone[assessment.overallLevel]}>
                  {weatherAgriRiskLevelLabels[assessment.overallLevel]}
                </StatusPill>
                <Badge tone="neutral">{assessment.locationLabel}</Badge>
                <Badge tone="gold">planning-only</Badge>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {assessment.cards
                  .filter((card) => card.level !== 'low')
                  .slice(0, 3)
                  .map((card) => `${weatherAgriRiskCategoryLabels[card.category]}: ${weatherAgriRiskLevelLabels[card.level]}`)
                  .join(' · ') || 'ไม่มีสัญญาณเด่น'}
              </p>
            </Card>
          ))}
        </section>

        <section className="grid gap-3">
          <h2 className="text-lg font-extrabold text-kaset-ink">Blocked actions</h2>
          {boundary.blockedActions.map((action) => (
            <Card className="p-4" key={action.id}>
              <div className="flex gap-3">
                <ShieldCheck aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-rose-800" />
                <div className="min-w-0">
                  <h3 className="font-extrabold text-kaset-ink">{action.label}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{action.reason}</p>
                </div>
              </div>
            </Card>
          ))}
        </section>

        <NoticeBox tone="info" title="Required disclaimers">
          <ul className="grid gap-2">
            {boundary.disclaimers.map((disclaimer) => (
              <li key={disclaimer.id}>{disclaimer.text}</li>
            ))}
          </ul>
        </NoticeBox>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-kaset-deep px-4 text-sm font-extrabold text-white" to="/app/weather">
            กลับไปหน้าสภาพอากาศ
          </Link>
          <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-kaset-mist px-4 text-sm font-extrabold text-kaset-deep" to="/app/weather/risk-review">
            เปิด M79 expert review
          </Link>
          <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10" to="/app/weather/risk-audit">
            เปิด M80 release audit
          </Link>
          <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-indigo-900 px-4 text-sm font-extrabold text-white" to="/app/ai-text-endpoint-plan">
            เปิด M82 endpoint
          </Link>
          <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10" to="/app/weather/qa">
            เปิด Weather QA
          </Link>
        </div>

        <LargeActionButton
          description="ตรวจภาพรวม QA รวม และ route coverage โดยยังไม่มี AI, GPS, Supabase write หรือ push notification"
          icon={ShieldCheck}
          label="ไปหน้า QA รวม"
          to="/app/qa"
          variant="white"
        />
      </div>
    </div>
  );
}
