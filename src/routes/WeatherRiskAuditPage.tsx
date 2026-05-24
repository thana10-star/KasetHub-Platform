import { AlertTriangle, ClipboardList, GitCompare, History, ShieldCheck, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { LargeActionButton } from '@/components/ui/LargeActionButton';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { StatusPill } from '@/components/ui/StatusPill';
import { getWeatherRiskDiffPreviewSummary } from '@/services/weather/weather-risk-diff-preview';
import { getWeatherRiskReleaseAuditSummary } from '@/services/weather/weather-risk-release-audit';
import { getWeatherRiskReviewerHistorySummary } from '@/services/weather/weather-risk-review-history';
import { getAITextProxyStatus } from '@/services/ai-text/ai-text-proxy';
import { buildAITextEndpointDryRunPlan } from '@/services/ai-text/ai-text-endpoint-dry-run';

const auditTone = {
  planning_only: 'info',
  blocked: 'danger',
  stale_warning: 'warning',
  review_placeholder: 'neutral',
} as const;

export function WeatherRiskAuditPage() {
  const audit = getWeatherRiskReleaseAuditSummary();
  const history = getWeatherRiskReviewerHistorySummary();
  const diff = getWeatherRiskDiffPreviewSummary();
  const aiTextStatus = getAITextProxyStatus();
  const aiTextEndpointPlan = buildAITextEndpointDryRunPlan();

  return (
    <div>
      <PageHeader title="Weather Risk Release Audit" subtitle="M80 governance QA: ยังไม่ใช่ระบบคำแนะนำจริง" showBack />
      <div className="grid gap-5 px-5 pb-6">
        <Card className="overflow-hidden bg-emerald-950 text-white">
          <div className="p-5">
            <div className="flex gap-3">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-white text-emerald-950">
                <ShieldCheck aria-hidden="true" className="h-6 w-6" />
              </span>
              <div className="min-w-0">
                <StatusPill className="bg-white/15 text-white ring-white/20" tone="warning">
                  {audit.planningOnlyBadge}
                </StatusPill>
                <h2 className="mt-3 text-2xl font-extrabold leading-8">Release audit readiness</h2>
                <p className="mt-2 text-sm leading-6 text-emerald-50">
                  แสดง audit timeline, reviewer history, diff preview และ human release gate เพื่อยืนยันว่า automation/CMS ยังเปิดคำแนะนำเชิงสั่งการไม่ได้
                </p>
              </div>
            </div>
          </div>
        </Card>

        <NoticeBox tone="warning" icon={AlertTriangle} title="ยังไม่ใช่ระบบคำแนะนำจริง">
          ทุกข้อมูลในหน้านี้เป็น local-only fixture ไม่มี Supabase write ไม่มี backend write ไม่มี GPS และยังไม่อนุญาตให้ rule ใดเป็น prescriptive
        </NoticeBox>

        <NoticeBox tone="info" title="M81 AI text proxy governance">
          AI text mode {aiTextStatus.mode} · M82 fetch {String(aiTextEndpointPlan.fetchWouldRun)} · automation cannot bypass the weather risk human gate · proxy remains fixture/disabled by default. <Link className="font-extrabold text-kaset-deep" to="/app/ai-text-status">เปิด M81 AI text status</Link> · <Link className="font-extrabold text-kaset-deep" to="/app/ai-text-endpoint-plan">เปิด M82 endpoint plan</Link>
        </NoticeBox>

        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Card className="p-4">
            <ClipboardList aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <p className="mt-2 text-2xl font-extrabold text-kaset-ink">{audit.auditEventCount}</p>
            <p className="text-xs font-bold text-slate-500">audit events</p>
          </Card>
          <Card className="p-4">
            <History aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <p className="mt-2 text-2xl font-extrabold text-kaset-ink">{history.historyCount}</p>
            <p className="text-xs font-bold text-slate-500">reviewer history</p>
          </Card>
          <Card className="p-4">
            <GitCompare aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <p className="mt-2 text-2xl font-extrabold text-kaset-ink">{diff.previewCount}</p>
            <p className="text-xs font-bold text-slate-500">diff previews</p>
          </Card>
          <Card className="p-4">
            <UserCheck aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <p className="mt-2 text-2xl font-extrabold text-kaset-ink">{String(audit.releaseBlocked)}</p>
            <p className="text-xs font-bold text-slate-500">release blocked</p>
          </Card>
        </section>

        <section className="grid gap-3">
          <h2 className="text-lg font-extrabold text-kaset-ink">Reviewed-source simulations</h2>
          {audit.sourceSimulations.map((source) => (
            <Card className="p-4" key={source.id}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-extrabold text-kaset-ink">{source.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{source.note}</p>
                </div>
                <StatusPill tone={auditTone[source.status]}>{source.status}</StatusPill>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge tone="gold">officialApproval {String(source.officialApproval)}</Badge>
                <Badge tone="neutral">productionReviewed {String(source.productionReviewed)}</Badge>
              </div>
            </Card>
          ))}
        </section>

        <section className="grid gap-3">
          <h2 className="text-lg font-extrabold text-kaset-ink">Reviewer change history</h2>
          {history.histories.map((item) => (
            <Card className="p-4" key={item.id}>
              <div className="flex items-start gap-3">
                <History aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-kaset-deep" />
                <div className="min-w-0">
                  <div className="flex flex-wrap gap-2">
                    <Badge tone="neutral">{item.eventType}</Badge>
                    {item.staleReviewWarning ? <Badge tone="gold">stale review warning</Badge> : null}
                  </div>
                  <p className="mt-2 text-sm font-extrabold leading-6 text-kaset-ink">{item.note}</p>
                  <p className="mt-1 text-xs font-bold leading-5 text-slate-500">{item.changedAt}</p>
                </div>
              </div>
            </Card>
          ))}
        </section>

        <section className="grid gap-3">
          <h2 className="text-lg font-extrabold text-kaset-ink">Risk-rule diff preview</h2>
          {diff.previews.slice(0, 3).map((preview) => (
            <Card className="p-4" key={preview.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-extrabold text-kaset-ink">{preview.title}</h3>
                  <p className="mt-1 text-xs font-bold leading-5 text-slate-500">{preview.versionId}</p>
                </div>
                <Badge tone="gold">reviewed {String(preview.reviewed)}</Badge>
              </div>
              <div className="mt-3 grid gap-2">
                {preview.changes.map((change) => (
                  <div className="rounded-lg bg-slate-50 p-3" key={change.kind}>
                    <Badge tone="neutral">{change.kind}</Badge>
                    <p className="mt-2 text-xs font-bold leading-5 text-slate-600">{change.riskNote}</p>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </section>

        <section className="grid gap-3">
          <h2 className="text-lg font-extrabold text-kaset-ink">Human approval gates</h2>
          {audit.gates.slice(0, 3).map((gate) => (
            <Card className="p-4" key={gate.id}>
              <div className="flex flex-wrap gap-2">
                <StatusPill tone="danger">finalPrescriptiveAllowed {String(gate.finalPrescriptiveAllowed)}</StatusPill>
                <Badge tone="gold">automation bypass {String(gate.automationBypassAllowed)}</Badge>
                <Badge tone="gold">CMS bypass {String(gate.cmsBypassAllowed)}</Badge>
              </div>
              <div className="mt-3 grid gap-2">
                {gate.blockers.map((blocker) => (
                  <p className="rounded-lg bg-rose-50 p-3 text-xs font-bold leading-5 text-rose-900" key={blocker.id}>
                    {blocker.label}: {blocker.reason}
                  </p>
                ))}
              </div>
            </Card>
          ))}
        </section>

        <div className="grid gap-3 sm:grid-cols-2">
          <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-kaset-deep px-4 text-sm font-extrabold text-white" to="/app/weather/risk-review">
            กลับไป Expert Review
          </Link>
          <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10" to="/app/weather/qa">
            เปิด Weather QA
          </Link>
        </div>

        <LargeActionButton
          description="QA รวมยังคงยืนยันว่าไม่มี AI, GPS, Supabase write, push จริง หรือ prescriptive rule"
          icon={ShieldCheck}
          label="ไปหน้า QA รวม"
          to="/app/qa"
          variant="white"
        />
      </div>
    </div>
  );
}
