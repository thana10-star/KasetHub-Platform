import {
  AlertTriangle,
  CheckCircle2,
  ClipboardCheck,
  Database,
  ExternalLink,
  GitBranch,
  ListChecks,
  Route,
  ShieldAlert,
} from 'lucide-react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { StatusPill } from '@/components/ui/StatusPill';
import { runPhaseDecisionPlan } from '@/services/phase-planning/phase-decision-service';
import { runMvpReadinessAudit } from '@/services/qa/mvp-readiness-audit';
import type { MvpReadinessStatus, MvpRiskLevel } from '@/services/qa/mvp-readiness.types';

const statusTone: Record<MvpReadinessStatus, 'success' | 'warning' | 'danger' | 'info' | 'neutral'> = {
  ready_mock: 'success',
  needs_backend: 'warning',
  needs_real_api: 'warning',
  blocked: 'danger',
  documentation_only: 'info',
};

const statusLabel: Record<MvpReadinessStatus, string> = {
  ready_mock: 'พร้อมแบบ mock',
  needs_backend: 'ต้องมี backend',
  needs_real_api: 'ต้องมี API จริง',
  blocked: 'ยังถูกบล็อก',
  documentation_only: 'เอกสาร/แผนเท่านั้น',
};

const riskTone: Record<MvpRiskLevel, 'success' | 'warning' | 'danger' | 'info' | 'neutral'> = {
  low: 'success',
  medium: 'info',
  high: 'warning',
  critical: 'danger',
};

const riskLabel: Record<MvpRiskLevel, string> = {
  low: 'เสี่ยงต่ำ',
  medium: 'เสี่ยงกลาง',
  high: 'เสี่ยงสูง',
  critical: 'เสี่ยงวิกฤต',
};

export function MvpSnapshotPage() {
  const audit = useMemo(() => runMvpReadinessAudit(), []);
  const phaseDecision = useMemo(() => runPhaseDecisionPlan(), []);

  return (
    <div>
      <PageHeader title="Internal MVP Snapshot" subtitle="สรุปสถานะ prototype หลัง M01-M35" showBack />
      <div className="grid gap-5 px-5 pb-6">
        <Card className="overflow-hidden bg-kaset-deep text-white">
          <div className="relative p-5">
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10" />
            <div className="relative flex gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-white text-kaset-deep">
                <ClipboardCheck aria-hidden="true" className="h-7 w-7" />
              </span>
              <div className="min-w-0">
                <Badge className="bg-white/15 text-white" tone="green">
                  M30 QA snapshot
                </Badge>
                <h2 className="mt-3 text-2xl font-extrabold leading-8">ยังเป็น Internal MVP / Prototype</h2>
                <p className="mt-2 text-sm leading-6 text-emerald-50/90">
                  {audit.overallLabel} · {audit.routeCount} routes · {audit.modules.length} module groups
                </p>
              </div>
            </div>
          </div>
        </Card>

        <NoticeBox tone="danger" title="ยังไม่ใช่ Production App">
          หน้านี้เป็น snapshot สำหรับทีมภายในเท่านั้น ยังไม่มี backend จริง, auth จริง, Supabase write, AI provider, upload, cloud sync หรือระบบผู้ดูแลจริง
        </NoticeBox>

        <section className="grid grid-cols-2 gap-3">
          <Card className="p-4">
            <ListChecks aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <p className="mt-3 text-2xl font-extrabold text-kaset-ink">{audit.routeCount}</p>
            <p className="mt-1 text-xs font-bold leading-4 text-slate-500">routes in registry</p>
          </Card>
          <Card className="p-4">
            <AlertTriangle aria-hidden="true" className="h-5 w-5 text-amber-800" />
            <p className="mt-3 text-2xl font-extrabold text-kaset-ink">{audit.highRiskCount}</p>
            <p className="mt-1 text-xs font-bold leading-4 text-slate-500">high/critical modules</p>
          </Card>
          <Card className="p-4">
            <CheckCircle2 aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <p className="mt-3 text-2xl font-extrabold text-kaset-ink">{audit.statusCounts.ready_mock}</p>
            <p className="mt-1 text-xs font-bold leading-4 text-slate-500">ready mock modules</p>
          </Card>
          <Card className="p-4">
            <Database aria-hidden="true" className="h-5 w-5 text-sky-800" />
            <p className="mt-3 text-2xl font-extrabold text-kaset-ink">{audit.statusCounts.documentation_only}</p>
            <p className="mt-1 text-xs font-bold leading-4 text-slate-500">documentation-only modules</p>
          </Card>
        </section>

        <NoticeBox tone="info" title="Storage mode">
          {audit.storageMode}
        </NoticeBox>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-sky-100 text-sky-800">
              <GitBranch aria-hidden="true" className="h-6 w-6" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-extrabold text-kaset-ink">M36 Real Backend Phase Decision</h2>
                <StatusPill tone="warning">planning only</StatusPill>
              </div>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                {phaseDecision.recommendation.title} · {phaseDecision.overallReadiness.score}% readiness · ยังไม่เปิด backend/API/auth จริง
              </p>
              <Link className="mt-3 inline-flex text-sm font-extrabold text-kaset-deep" to="/app/next-phase">
                เปิด Next Phase Decision
              </Link>
            </div>
          </div>
        </Card>

        <section className="grid gap-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-extrabold text-kaset-ink">Module readiness</h2>
            <StatusPill tone="warning">prototype only</StatusPill>
          </div>
          {audit.modules.map((module) => (
            <Card className="p-4" key={module.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-extrabold leading-6 text-kaset-ink">{module.name}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{module.summary}</p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  <StatusPill tone={statusTone[module.status]}>{statusLabel[module.status]}</StatusPill>
                  <StatusPill tone={riskTone[module.riskLevel]}>{riskLabel[module.riskLevel]}</StatusPill>
                </div>
              </div>
              <div className="mt-3 rounded-lg bg-kaset-mist p-3">
                <p className="text-xs font-bold text-slate-500">Current storage mode</p>
                <p className="mt-1 text-sm font-bold leading-6 text-kaset-deep">{module.currentStorageMode}</p>
              </div>
              <div className="mt-3 grid gap-2">
                {module.mockBoundaries.map((boundary) => (
                  <p className="rounded-lg bg-white p-3 text-xs font-bold leading-5 text-slate-600 ring-1 ring-kaset-deep/8" key={boundary}>
                    {boundary}
                  </p>
                ))}
              </div>
              <p className="mt-3 rounded-lg bg-amber-50 p-3 text-sm font-bold leading-6 text-amber-900">{module.nextAction}</p>
            </Card>
          ))}
        </section>

        <section className="grid gap-3">
          <h2 className="text-xl font-extrabold text-kaset-ink">Route groups</h2>
          {audit.routeGroups.map((group) => (
            <Card className="p-4" key={group.id}>
              <div className="flex gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
                  <Route aria-hidden="true" className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-extrabold text-kaset-ink">{group.label}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{group.description}</p>
                </div>
              </div>
              <div className="mt-4 grid gap-2">
                {group.routes.map((route) => (
                  <Link
                    className="flex min-h-[58px] items-center justify-between gap-3 rounded-lg bg-kaset-mist px-3 py-2 text-left ring-1 ring-kaset-deep/5"
                    key={`${group.id}-${route.route}`}
                    to={route.manualCheckPath ?? route.route}
                  >
                    <span className="min-w-0">
                      <span className="block text-sm font-extrabold leading-5 text-kaset-ink">{route.label}</span>
                      <span className="mt-1 block break-all text-xs font-bold leading-5 text-slate-500">{route.route}</span>
                    </span>
                    <ExternalLink aria-hidden="true" className="h-4 w-4 shrink-0 text-kaset-deep" />
                  </Link>
                ))}
              </div>
            </Card>
          ))}
        </section>

        <section className="grid gap-3">
          <h2 className="text-xl font-extrabold text-kaset-ink">Storage readiness</h2>
          {audit.storageReadiness.map((item) => (
            <Card className="p-4" key={item.label}>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-extrabold text-kaset-ink">{item.label}</h3>
                <StatusPill tone={statusTone[item.status]}>{statusLabel[item.status]}</StatusPill>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.detail}</p>
            </Card>
          ))}
        </section>

        <NoticeBox tone="warning" icon={ShieldAlert} title="Production blockers">
          <ul className="grid gap-2">
            {audit.productionBlockers.map((blocker) => (
              <li key={blocker}>{blocker}</li>
            ))}
          </ul>
        </NoticeBox>

        <Card className="p-4">
          <h2 className="font-extrabold text-kaset-ink">Next recommended milestones</h2>
          <div className="mt-3 grid gap-2">
            {audit.nextRecommendedMilestones.map((milestone) => (
              <p className="rounded-lg bg-kaset-mist p-3 text-sm font-bold leading-6 text-slate-700" key={milestone}>
                {milestone}
              </p>
            ))}
          </div>
        </Card>

        <section className="grid gap-3">
          <h2 className="text-xl font-extrabold text-kaset-ink">Next phase options</h2>
          {audit.nextPhaseOptions.map((option) => (
            <Card className="p-4" key={option.id}>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-extrabold text-kaset-ink">{option.label}</h3>
                <StatusPill tone={riskTone[option.risk]}>{riskLabel[option.risk]}</StatusPill>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">{option.description}</p>
            </Card>
          ))}
        </section>

        <div className="grid gap-3 sm:grid-cols-4">
          <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-kaset-deep px-4 text-sm font-extrabold text-white" to="/app/admin">
            เปิด Admin Dashboard
          </Link>
          <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10" to="/app/qa">
            เปิด QA page
          </Link>
          <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10" to="/app/next-phase">
            เปิด Next Phase
          </Link>
          <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10" to="/app/supabase-readiness">
            เปิด Supabase readiness
          </Link>
        </div>
      </div>
    </div>
  );
}
