import {
  Activity,
  AlertTriangle,
  Bell,
  BookOpenCheck,
  Bot,
  Calculator,
  CloudUpload,
  CloudSun,
  ClipboardList,
  Database,
  FileText,
  Gavel,
  GitBranch,
  HeartPulse,
  Leaf,
  LockKeyhole,
  Phone,
  Ruler,
  ShieldCheck,
  UsersRound,
  Video,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { StatusPill } from '@/components/ui/StatusPill';
import { adminModuleLabels, adminRoleLabels } from '@/services/admin/admin-fixtures';
import { buildAdminDashboardData } from '@/services/admin/admin-dashboard-service';
import { runPhoneAuthStagingReadinessAudit } from '@/services/auth/phone-auth-staging-readiness';
import { runGuestSyncStagingReadiness } from '@/services/backend/guest-sync-staging-readiness';
import { runEnvSafetyCheck } from '@/services/config/env-safety-check';
import type {
  AdminHealthStatus,
  AdminModuleId,
  AdminModuleStatus,
  AdminRiskItem,
  AdminTask,
} from '@/services/admin/admin.types';
import { buildYouTubeImportPlan } from '@/services/content/youtube-import-planner';
import { cropPriceItems } from '@/services/crop-prices/crop-price-fixtures';
import { cropPriceSources, cropPriceSourceStatusLabels } from '@/services/crop-prices/crop-price-sources';
import { runAgriCalculatorTestSuite } from '@/services/agri-calculators/agri-calculator-test-fixtures';
import { cropWatchAlertLabels } from '@/services/crop-prices/crop-watch-service';
import { communityReportReasonLabels } from '@/services/community-moderation/community-moderation-fixtures';
import { runPhaseDecisionPlan } from '@/services/phase-planning/phase-decision-service';
import { runMvpReadinessAudit } from '@/services/qa/mvp-readiness-audit';
import { runSupabaseConnectionDryRun } from '@/services/supabase/supabase-connection-dry-run';
import { buildSupabaseManualExecutionReview } from '@/services/supabase/supabase-manual-execution-review';
import { buildSupabasePublicReadReview } from '@/services/supabase/supabase-public-read-review';
import { buildSupabaseReadonlyProbePlan } from '@/services/supabase/supabase-readonly-probe';
import { runSupabaseReadinessAudit } from '@/services/supabase/supabase-readiness-audit';
import { summarizeSupabaseSetupProgress } from '@/services/supabase/supabase-setup-progress';
import { buildSupabaseStagingProjectChecklist } from '@/services/supabase/supabase-staging-project-checklist';
import { validateSupabaseSqlDraft } from '@/services/supabase/supabase-sql-draft-validator';
import { weatherAlertMocks, weatherLocations } from '@/services/weather/weather-fixtures';
import { useAICredits } from '@/hooks/useAICredits';
import { useCommunityModeration } from '@/hooks/useCommunityModeration';
import { useCropWatch } from '@/hooks/useCropWatch';
import { useFarmArea } from '@/hooks/useFarmArea';
import { useGuestMemory } from '@/hooks/useGuestMemory';
import { useNotificationCenter } from '@/hooks/useNotificationCenter';
import { useAgriCalculators } from '@/hooks/useAgriCalculators';
import { CalculatorRewardedAdsPlanningCard } from '@/routes/calculators/CalculatorUi';

type AdminTab = 'overview' | 'content' | 'moderation' | 'crop_prices' | 'ai_safety' | 'system';

const tabs: Array<{ id: AdminTab; label: string }> = [
  { id: 'overview', label: 'ภาพรวม' },
  { id: 'content', label: 'คอนเทนต์' },
  { id: 'moderation', label: 'Moderation' },
  { id: 'crop_prices', label: 'ราคาพืช' },
  { id: 'ai_safety', label: 'AI Safety' },
  { id: 'system', label: 'ระบบ' },
];

const moduleIcons: Record<AdminModuleId, typeof Activity> = {
  content: FileText,
  youtube_import: Video,
  community: UsersRound,
  moderation: Gavel,
  crop_prices: Leaf,
  crop_watch: HeartPulse,
  ai_safety: Bot,
  plant_analysis: Leaf,
  guest_sync: Database,
  auth: ShieldCheck,
  system_health: Activity,
};

const healthTone: Record<AdminHealthStatus, 'success' | 'warning' | 'danger' | 'info' | 'neutral'> = {
  healthy: 'success',
  attention: 'warning',
  blocked: 'danger',
  mock_only: 'info',
};

const healthLabels: Record<AdminHealthStatus, string> = {
  healthy: 'พร้อม',
  attention: 'ต้องตรวจ',
  blocked: 'ถูกบล็อก',
  mock_only: 'mock/local',
};

function SummaryCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Activity;
  label: string;
  value: number | string;
}) {
  return (
    <Card className="p-4">
      <Icon aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
      <p className="mt-3 text-2xl font-extrabold text-kaset-ink">{typeof value === 'number' ? value.toLocaleString('th-TH') : value}</p>
      <p className="mt-1 text-xs font-bold leading-4 text-slate-500">{label}</p>
    </Card>
  );
}

function ModuleCard({ module }: { module: AdminModuleStatus }) {
  const Icon = moduleIcons[module.id];

  return (
    <Card className="p-4">
      <div className="flex gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
          <Icon aria-hidden="true" className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-extrabold text-kaset-ink">{module.title}</h3>
            <StatusPill tone={healthTone[module.status]}>{healthLabels[module.status]}</StatusPill>
          </div>
          <p className="mt-1 text-sm leading-6 text-slate-600">{module.summary}</p>
          <div className="mt-3 rounded-lg bg-kaset-mist p-3">
            <p className="text-xs font-bold text-slate-500">{module.metricLabel}</p>
            <p className="mt-1 text-lg font-extrabold text-kaset-deep">{module.metricValue}</p>
            <p className="mt-1 text-xs leading-5 text-slate-600">{module.readinessLabel}</p>
          </div>
          {module.route ? (
            <Link className="mt-3 inline-flex text-sm font-extrabold text-kaset-deep" to={module.route}>
              เปิดหน้าที่เกี่ยวข้อง
            </Link>
          ) : null}
        </div>
      </div>
    </Card>
  );
}

function TaskCard({ task }: { task: AdminTask }) {
  const priorityTone = task.priority === 'high' ? 'rose' : task.priority === 'medium' ? 'gold' : 'neutral';

  return (
    <Card className="p-4">
      <div className="flex flex-wrap gap-2">
        <Badge tone="sky">{adminModuleLabels[task.moduleId]}</Badge>
        <Badge tone={priorityTone}>{task.priority}</Badge>
        <StatusPill tone={task.status === 'blocked' ? 'danger' : task.status === 'in_review' ? 'warning' : 'info'}>
          {task.status}
        </StatusPill>
      </div>
      <h3 className="mt-3 font-extrabold leading-6 text-kaset-ink">{task.title}</h3>
      <p className="mt-1 text-sm leading-6 text-slate-600">{task.description}</p>
      <p className="mt-2 text-xs font-bold text-slate-500">เจ้าของงานอนาคต: {adminRoleLabels[task.ownerRole]}</p>
    </Card>
  );
}

function RiskCard({ risk }: { risk: AdminRiskItem }) {
  const severityTone = risk.severity === 'high' ? 'danger' : risk.severity === 'medium' ? 'warning' : 'neutral';

  return (
    <Card className="p-4">
      <div className="flex gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-amber-100 text-amber-800">
          <AlertTriangle aria-hidden="true" className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap gap-2">
            <Badge tone="neutral">{adminModuleLabels[risk.moduleId]}</Badge>
            <StatusPill tone={severityTone}>{risk.severity}</StatusPill>
          </div>
          <h3 className="mt-2 font-extrabold leading-6 text-kaset-ink">{risk.title}</h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">{risk.description}</p>
          <p className="mt-2 rounded-lg bg-kaset-mist p-3 text-xs font-bold leading-5 text-kaset-deep">{risk.recommendedAction}</p>
        </div>
      </div>
    </Card>
  );
}

export function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const moderation = useCommunityModeration();
  const agriCalculators = useAgriCalculators();
  const cropWatch = useCropWatch();
  const farmArea = useFarmArea();
  const aiCredits = useAICredits();
  const guestMemory = useGuestMemory();
  const notificationCenter = useNotificationCenter();
  const importPlan = useMemo(() => buildYouTubeImportPlan(), []);
  const supabaseReadiness = useMemo(() => runSupabaseReadinessAudit(), []);
  const supabaseConnection = useMemo(() => runSupabaseConnectionDryRun(), []);
  const readonlyProbe = useMemo(() => buildSupabaseReadonlyProbePlan(), []);
  const m44Review = useMemo(() => buildSupabasePublicReadReview(), []);
  const envSafety = useMemo(() => runEnvSafetyCheck(), []);
  const m40Checklist = useMemo(() => buildSupabaseStagingProjectChecklist(), []);
  const setupProgress = useMemo(() => summarizeSupabaseSetupProgress(), []);
  const executionReview = useMemo(() => buildSupabaseManualExecutionReview(), []);
  const supabaseSqlDraft = useMemo(() => validateSupabaseSqlDraft(), []);
  const phoneAuthStaging = useMemo(() => runPhoneAuthStagingReadinessAudit(), []);
  const guestSyncEdge = useMemo(() => runGuestSyncStagingReadiness(), []);
  const mvpReadiness = useMemo(() => runMvpReadinessAudit(), []);
  const phaseDecision = useMemo(() => runPhaseDecisionPlan(), []);
  const calculatorQa = useMemo(() => runAgriCalculatorTestSuite(), []);
  const dashboard = buildAdminDashboardData();
  const moderationQueue = dashboard.reviewQueues.find((queue) => queue.moduleId === 'moderation');
  const priceQueue = dashboard.reviewQueues.find((queue) => queue.moduleId === 'crop_prices');

  return (
    <div>
      <PageHeader title="Admin Dashboard" subtitle="ตัวอย่างระบบผู้ดูแลแบบ local/mock" showBack />
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
                  Admin preview
                </Badge>
                <h2 className="mt-3 text-2xl font-extrabold leading-8">หน้านี้เป็นตัวอย่างระบบผู้ดูแล ยังไม่มีสิทธิ์จริง</h2>
                <p className="mt-2 text-sm leading-6 text-emerald-50/90">
                  ใช้ดูภาพรวมคอนเทนต์ ชุมชน ราคา AI safety และ system health จากข้อมูล mock/local เท่านั้น
                </p>
              </div>
            </div>
          </div>
        </Card>

        <NoticeBox tone="warning" title="ขอบเขตผู้ดูแลตัวอย่าง">
          ยังไม่เชื่อมต่อ backend การกดปุ่มในหน้านี้ไม่เปลี่ยนข้อมูลจริงบน server และไม่มี admin auth จริง
        </NoticeBox>

        <div className="-mx-5 overflow-x-auto px-5">
          <div className="flex min-w-max gap-2">
            {tabs.map((tab) => (
              <button
                className={
                  activeTab === tab.id
                    ? 'min-h-11 rounded-full bg-kaset-deep px-4 text-sm font-extrabold text-white'
                    : 'min-h-11 rounded-full bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10'
                }
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                type="button"
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'overview' ? (
          <>
            <section className="grid grid-cols-2 gap-3">
              <SummaryCard icon={FileText} label="content items" value={dashboard.summary.contentItems} />
              <SummaryCard icon={ClipboardList} label="community reports" value={dashboard.summary.pendingCommunityReports} />
              <SummaryCard icon={Leaf} label="crop price sources" value={dashboard.summary.cropPriceSources} />
              <SummaryCard icon={CloudSun} label="weather locations" value={weatherLocations.length} />
              <SummaryCard icon={Bell} label="local notifications" value={notificationCenter.digest.unreadCount} />
              <SummaryCard icon={Calculator} label="calculator history" value={agriCalculators.counts.recentCalculations} />
              <SummaryCard icon={Ruler} label="farm area plots" value={farmArea.counts.plots} />
              <SummaryCard icon={Bot} label="AI safety items" value={dashboard.summary.aiSafetyItems} />
              <SummaryCard icon={Video} label="YouTube candidates" value={dashboard.summary.youtubeImportCandidates} />
              <SummaryCard icon={Database} label="Supabase readiness" value={`${supabaseReadiness.score}%`} />
              <SummaryCard icon={LockKeyhole} label="env safety" value={envSafety.blockers.length > 0 ? 'blocked' : envSafety.warnings.length > 0 ? 'review' : 'safe'} />
              <SummaryCard icon={ClipboardList} label="M40 SQL prep" value={m40Checklist.sqlExecutionChecklist.length} />
              <SummaryCard icon={ClipboardList} label="M41 setup" value={`${setupProgress.completedCount}/${setupProgress.totalCount}`} />
              <SummaryCard icon={ClipboardList} label="M42 review" value={executionReview.statusLabel} />
              <SummaryCard icon={Database} label="M43 probe" value={readonlyProbe.statusLabel} />
              <SummaryCard icon={ShieldCheck} label="M44 RLS review" value={m44Review.statusLabel} />
              <SummaryCard icon={ClipboardList} label="MVP routes" value={mvpReadiness.routeCount} />
              <SummaryCard icon={GitBranch} label="next phase score" value={`${phaseDecision.overallReadiness.score}%`} />
              <SummaryCard icon={Activity} label="system health" value={healthLabels[dashboard.summary.systemHealth]} />
            </section>

            <Card className="p-4">
              <div className="flex gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-sky-100 text-sky-800">
                  <GitBranch aria-hidden="true" className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-extrabold text-kaset-ink">M36 Next Phase Decision</h2>
                    <StatusPill tone="warning">planning only</StatusPill>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {phaseDecision.recommendation.title} · {phaseDecision.overallReadiness.score}% readiness · no backend/API/auth enabled
                  </p>
                  <Link className="mt-3 inline-flex text-sm font-extrabold text-kaset-deep" to="/app/next-phase">
                    เปิดแผน next phase
                  </Link>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
                  <Calculator aria-hidden="true" className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-extrabold text-kaset-ink">M53 Agriculture calculators</h2>
                    <StatusPill tone={calculatorQa.failCount > 0 ? 'danger' : calculatorQa.warnCount > 0 ? 'warning' : 'success'}>
                      {calculatorQa.failCount > 0 ? 'QA fail' : calculatorQa.warnCount > 0 ? 'QA warn' : 'QA pass'}
                    </StatusPill>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {agriCalculators.counts.recentCalculations} recent calculations · favorites {agriCalculators.counts.favorites} · QA {calculatorQa.passCount}/{calculatorQa.totalCount} passed · no Supabase writes
                  </p>
                  <Link className="mt-3 inline-flex text-sm font-extrabold text-kaset-deep" to="/app/calculators">
                    เปิดเครื่องคำนวณเกษตร
                  </Link>
                  <Link className="ml-4 mt-3 inline-flex text-sm font-extrabold text-kaset-deep" to="/app/calculators/qa">
                    เปิด QA เครื่องคำนวณ
                  </Link>
                  <Link className="ml-4 mt-3 inline-flex text-sm font-extrabold text-kaset-deep" to="/app/calculators/saved-results">
                    เปิดสรุปที่บันทึกไว้
                  </Link>
                </div>
              </div>
            </Card>

            <CalculatorRewardedAdsPlanningCard compact />

            <Card className="border-sky-200 bg-sky-50 p-4">
              <div className="flex gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-white text-sky-800">
                  <GitBranch aria-hidden="true" className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-extrabold text-sky-950">M38 Supabase staging branch</h2>
                    <Badge tone="sky">staging/supabase</Badge>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-sky-900">
                    Recommended current branch: `staging/supabase` · current work mode: Supabase staging experiment · no real secrets in repo
                  </p>
                  <p className="mt-2 rounded-lg bg-white p-3 text-xs font-bold leading-5 text-sky-950">
                    Current milestone: M40 Supabase project creation + SQL run prep. ยังไม่เชื่อม Supabase ไม่เปิด auth/cloud sync และไม่เขียน backend
                  </p>
                </div>
              </div>
            </Card>

            <Card className="border-amber-200 bg-amber-50 p-4">
              <div className="flex gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-white text-amber-800">
                  <ClipboardList aria-hidden="true" className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-extrabold text-amber-950">M40 Supabase project creation + SQL prep</h2>
                    <StatusPill tone="warning">manual only</StatusPill>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-amber-900">
                    ขั้นตอนนี้ยังเป็นคู่มือ ยังไม่ได้เชื่อมต่อจริง · สร้าง project {m40Checklist.recommendedProjectName} ด้วยมือ · รัน SQL เฉพาะ staging เท่านั้น
                  </p>
                  <p className="mt-2 rounded-lg bg-white p-3 text-xs font-bold leading-5 text-amber-950">
                    อ่าน {m40Checklist.docLinks[0].path}, {m40Checklist.docLinks[1].path}, และ {m40Checklist.docLinks[2].path}
                  </p>
                  <Link className="mt-3 inline-flex text-sm font-extrabold text-amber-950" to="/app/supabase-sql-checklist">
                    เปิด SQL run prep checklist
                  </Link>
                </div>
              </div>
            </Card>

            <Card className="border-emerald-200 bg-emerald-50 p-4">
              <div className="flex gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-white text-kaset-deep">
                  <ClipboardList aria-hidden="true" className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-extrabold text-kaset-ink">M41 real staging setup walkthrough</h2>
                    <StatusPill tone={setupProgress.nextStep ? 'warning' : 'success'}>
                      {setupProgress.completedCount}/{setupProgress.totalCount} local steps
                    </StatusPill>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-slate-700">Next safe step: {setupProgress.nextSafeStep}</p>
                  <p className="mt-2 rounded-lg bg-white p-3 text-xs font-bold leading-5 text-kaset-deep">
                    blockers: {setupProgress.blockers.slice(0, 2).join(' · ') || 'ไม่มี blocker ใน local checklist'} · ยังไม่เปิด auth · ยังไม่เปิด cloud sync
                  </p>
                  <Link className="mt-3 inline-flex text-sm font-extrabold text-kaset-deep" to="/app/supabase-setup-guide">
                    เปิด M41 setup guide
                  </Link>
                </div>
              </div>
            </Card>

            <Card className="border-sky-200 bg-sky-50 p-4">
              <div className="flex gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-white text-sky-800">
                  <ClipboardList aria-hidden="true" className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-extrabold text-sky-950">M42 Supabase manual execution review</h2>
                    <StatusPill tone={executionReview.statusTone}>{executionReview.statusLabel}</StatusPill>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-sky-900">{executionReview.statusDetail}</p>
                  <p className="mt-2 rounded-lg bg-white p-3 text-xs font-bold leading-5 text-sky-950">
                    {executionReview.nextSafeStep} · ยังไม่เปิด auth · ยังไม่เปิด cloud sync
                  </p>
                  <p className="mt-2 rounded-lg bg-white/70 p-3 text-xs font-bold leading-5 text-sky-950">
                    Verified: {executionReview.verifiedResults.slice(0, 6).join(' / ')}
                  </p>
                  <p className="mt-2 rounded-lg bg-white/70 p-3 text-xs font-bold leading-5 text-sky-950">
                    Status choices: {executionReview.statusOptions.map((option) => option.label).join(' / ')}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="border-sky-200 bg-sky-50 p-4">
              <div className="flex gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-white text-sky-800">
                  <Database aria-hidden="true" className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-extrabold text-sky-950">M43 read-only public table probe</h2>
                    <StatusPill tone={readonlyProbe.statusTone}>{readonlyProbe.statusLabel}</StatusPill>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-sky-900">
                    {readonlyProbe.connectionStatus} Tables: {readonlyProbe.tables.map((table) => table.name).join(' / ')}
                  </p>
                  <p className="mt-2 rounded-lg bg-white p-3 text-xs font-bold leading-5 text-sky-950">
                    no writes · empty table is OK · ยังไม่เปิด auth/cloud sync
                  </p>
                  <Link className="mt-3 inline-flex text-sm font-extrabold text-sky-950" to="/app/supabase-readonly-probe">
                    Open M43 read-only probe
                  </Link>
                </div>
              </div>
            </Card>

            <Card className="border-sky-200 bg-sky-50 p-4">
              <div className="flex gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-white text-sky-800">
                  <ShieldCheck aria-hidden="true" className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-extrabold text-sky-950">M44 public read verification + RLS review</h2>
                    <StatusPill tone={m44Review.statusTone}>{m44Review.statusLabel}</StatusPill>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-sky-900">{m44Review.summary}</p>
                  <p className="mt-2 rounded-lg bg-white p-3 text-xs font-bold leading-5 text-sky-950">
                    public read: {m44Review.publicReadVerificationStatus} · RLS: {m44Review.rlsReviewStatus}
                  </p>
                  <p className="mt-2 rounded-lg bg-white p-3 text-xs font-bold leading-5 text-sky-950">
                    blockers: {m44Review.blockers.slice(0, 3).join(' · ') || 'none'}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
                  <LockKeyhole aria-hidden="true" className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-extrabold text-kaset-ink">M39 Env Safety</h2>
                    <StatusPill tone={envSafety.blockers.length > 0 ? 'danger' : envSafety.warnings.length > 0 ? 'warning' : 'success'}>
                      {envSafety.statusLabel}
                    </StatusPill>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Local `.env.local` setup guardrail: placeholder detection, anon-key format-ish check, service-role warning, and auth/cloud sync flag blockers.
                  </p>
                  <Link className="mt-3 inline-flex text-sm font-extrabold text-kaset-deep" to="/app/env-safety">
                    เปิด Env Safety
                  </Link>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
                  <Bell aria-hidden="true" className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-extrabold text-kaset-ink">Notification Center preview</h2>
                    <StatusPill tone="info">local/mock</StatusPill>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {notificationCenter.digest.totalCount} items · {notificationCenter.digest.unreadCount} unread · no push, LINE, email, SMS, scheduler, backend, or Supabase write
                  </p>
                  <Link className="mt-3 inline-flex text-sm font-extrabold text-kaset-deep" to="/app/notifications">
                    เปิดศูนย์แจ้งเตือน
                  </Link>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-sky-100 text-sky-800">
                  <CloudSun aria-hidden="true" className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-extrabold text-kaset-ink">Agriculture weather preview</h2>
                    <StatusPill tone="info">demo/local</StatusPill>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {weatherLocations.length} พื้นที่ตัวอย่าง · {weatherAlertMocks.length} mock alerts · ไม่มี weather API, geolocation, backend หรือ push จริง
                  </p>
                  <Link className="mt-3 inline-flex text-sm font-extrabold text-kaset-deep" to="/app/weather">
                    เปิดหน้าสภาพอากาศเกษตร
                  </Link>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
                  <Ruler aria-hidden="true" className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-extrabold text-kaset-ink">Farm area measurement planner</h2>
                    <StatusPill tone="info">local/mock</StatusPill>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {farmArea.counts.plots} saved plot records · manual calculator only · no GPS, map API, geolocation, backend, or survey claim
                  </p>
                  <Link className="mt-3 inline-flex text-sm font-extrabold text-kaset-deep" to="/app/farm-area">
                    เปิดเครื่องคำนวณพื้นที่แปลง
                  </Link>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
                  <ClipboardList aria-hidden="true" className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-extrabold text-kaset-ink">Internal MVP snapshot</h2>
                    <StatusPill tone="warning">not production</StatusPill>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {mvpReadiness.routeCount} routes · {mvpReadiness.modules.length} modules · {mvpReadiness.highRiskCount} high-risk modules · ยังเป็น Internal MVP / Prototype
                  </p>
                  <Link className="mt-3 inline-flex text-sm font-extrabold text-kaset-deep" to="/app/mvp-snapshot">
                    เปิด M30 Internal MVP snapshot
                  </Link>
                </div>
              </div>
            </Card>

            <section className="grid gap-3">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-extrabold text-kaset-ink">MVP module readiness</h2>
                <StatusPill tone="warning">prototype only</StatusPill>
              </div>
              {mvpReadiness.modules.slice(0, 4).map((module) => (
                <Card className="p-4" key={module.id}>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-extrabold text-kaset-ink">{module.name}</h3>
                    <Badge tone={module.status === 'ready_mock' ? 'green' : module.status === 'blocked' ? 'rose' : 'gold'}>
                      {module.status}
                    </Badge>
                    <Badge tone={module.riskLevel === 'critical' ? 'rose' : module.riskLevel === 'high' ? 'gold' : 'sky'}>
                      {module.riskLevel}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{module.summary}</p>
                  <p className="mt-2 rounded-lg bg-kaset-mist p-3 text-xs font-bold leading-5 text-kaset-deep">{module.nextAction}</p>
                </Card>
              ))}
            </section>

            <Card className="p-4">
              <div className="flex gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
                  <Database aria-hidden="true" className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-extrabold text-kaset-ink">Supabase staging readiness</h2>
                    <StatusPill tone={supabaseReadiness.blockerItems.length > 0 ? 'danger' : 'warning'}>
                      {supabaseReadiness.levelLabel}
                    </StatusPill>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {supabaseReadiness.score}% readiness · {supabaseReadiness.warningItems.length} warnings · {supabaseReadiness.blockerItems.length} blockers · ยังไม่ได้เชื่อมต่อ backend
                  </p>
                  <Link className="mt-3 inline-flex text-sm font-extrabold text-kaset-deep" to="/app/supabase-readiness">
                    เปิด Supabase readiness checklist
                  </Link>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-sky-100 text-sky-800">
                  <Database aria-hidden="true" className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-extrabold text-kaset-ink">Supabase connection dry run</h2>
                    <StatusPill tone={supabaseConnection.health === 'blocked' ? 'danger' : supabaseConnection.health === 'ready_for_staging_check' ? 'success' : 'warning'}>
                      {supabaseConnection.label}
                    </StatusPill>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    network check {supabaseConnection.networkProbe.enabled ? 'enabled' : 'disabled'} · env {supabaseConnection.env.hasRequiredEnv ? 'detected' : 'missing'} · no writes
                  </p>
                  <Link className="mt-3 inline-flex text-sm font-extrabold text-kaset-deep" to="/app/supabase-connection">
                    เปิด Supabase connection dry run
                  </Link>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
                  <Phone aria-hidden="true" className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-extrabold text-kaset-ink">Phone OTP staging readiness</h2>
                    <StatusPill tone={phoneAuthStaging.blockerItems.length > 0 ? 'danger' : 'warning'}>
                      {phoneAuthStaging.levelLabel}
                    </StatusPill>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    ยังไม่ส่ง OTP จริง · ยังไม่เปิด auth จริง · score {phoneAuthStaging.score}%
                  </p>
                  <Link className="mt-3 inline-flex text-sm font-extrabold text-kaset-deep" to="/app/auth/phone-staging">
                    เปิด Phone OTP staging checklist
                  </Link>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-sky-100 text-sky-800">
                  <CloudUpload aria-hidden="true" className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-extrabold text-kaset-ink">Guest Sync Edge Function staging plan</h2>
                    <StatusPill tone={guestSyncEdge.blockerItems.length > 0 ? 'danger' : 'warning'}>
                      {guestSyncEdge.levelLabel}
                    </StatusPill>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    endpoint {guestSyncEdge.endpointName} · edge flag {guestSyncEdge.flags.enableGuestSyncEdge ? 'เปิด' : 'ปิด'} · no endpoint call
                  </p>
                  <Link className="mt-3 inline-flex text-sm font-extrabold text-kaset-deep" to="/app/guest-sync-edge">
                    เปิด Guest Sync Edge staging plan
                  </Link>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
                  <ClipboardList aria-hidden="true" className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-extrabold text-kaset-ink">Supabase SQL staging checklist</h2>
                    <StatusPill tone="info">{supabaseSqlDraft.expectedTables.length} tables</StatusPill>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Manual-only SQL/RLS execution order and verification pack · ยังไม่ได้รัน SQL จริง
                  </p>
                  <Link className="mt-3 inline-flex text-sm font-extrabold text-kaset-deep" to="/app/supabase-sql-checklist">
                    เปิด SQL staging checklist
                  </Link>
                </div>
              </div>
            </Card>

            <section className="grid gap-3">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-extrabold text-kaset-ink">Module status</h2>
                <StatusPill tone={healthTone[dashboard.summary.systemHealth]}>{healthLabels[dashboard.summary.systemHealth]}</StatusPill>
              </div>
              {dashboard.modules.slice(0, 6).map((module) => (
                <ModuleCard key={module.id} module={module} />
              ))}
            </section>

            <section className="grid gap-3">
              <h2 className="text-lg font-extrabold text-kaset-ink">Review queues</h2>
              {dashboard.reviewQueues.map((queue) => (
                <Card className="p-4" key={queue.id}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Badge tone="sky">{adminModuleLabels[queue.moduleId]}</Badge>
                      <h3 className="mt-2 font-extrabold text-kaset-ink">{queue.title}</h3>
                    </div>
                    <p className="text-2xl font-extrabold text-kaset-deep">{queue.pending + queue.inReview}</p>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-lg bg-amber-50 p-2">
                      <p className="font-extrabold text-amber-900">{queue.pending}</p>
                      <p className="text-[11px] font-bold text-amber-900">pending</p>
                    </div>
                    <div className="rounded-lg bg-sky-50 p-2">
                      <p className="font-extrabold text-sky-900">{queue.inReview}</p>
                      <p className="text-[11px] font-bold text-sky-900">review</p>
                    </div>
                    <div className="rounded-lg bg-kaset-mist p-2">
                      <p className="font-extrabold text-kaset-deep">{queue.completed}</p>
                      <p className="text-[11px] font-bold text-kaset-deep">done</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{queue.note}</p>
                </Card>
              ))}
            </section>

            <section className="grid gap-3">
              <h2 className="text-lg font-extrabold text-kaset-ink">Recent audit log preview</h2>
              {dashboard.auditLogs.map((log) => (
                <Card className="p-4" key={log.id}>
                  <div className="flex flex-wrap gap-2">
                    <Badge tone="neutral">{adminRoleLabels[log.role]}</Badge>
                    <Badge tone="sky">{adminModuleLabels[log.moduleId]}</Badge>
                  </div>
                  <h3 className="mt-2 font-extrabold text-kaset-ink">{log.actionLabel}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {log.actorLabel} · {log.targetLabel}
                  </p>
                  <p className="mt-2 text-xs font-bold text-slate-500">{log.createdAtLabel}</p>
                </Card>
              ))}
            </section>
          </>
        ) : null}

        {activeTab === 'content' ? (
          <>
            <section className="grid grid-cols-3 gap-2">
              <Card className="p-3 text-center">
                <p className="text-xl font-extrabold text-kaset-deep">{dashboard.summary.contentDrafts}</p>
                <p className="text-[11px] font-bold text-slate-500">draft</p>
              </Card>
              <Card className="p-3 text-center">
                <p className="text-xl font-extrabold text-amber-800">{dashboard.summary.contentInReview}</p>
                <p className="text-[11px] font-bold text-slate-500">review</p>
              </Card>
              <Card className="p-3 text-center">
                <p className="text-xl font-extrabold text-kaset-deep">{dashboard.summary.publishedContent}</p>
                <p className="text-[11px] font-bold text-slate-500">published</p>
              </Card>
            </section>

            <ModuleCard module={dashboard.modules.find((module) => module.id === 'youtube_import') ?? dashboard.modules[0]} />

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <Video aria-hidden="true" className="h-6 w-6 text-kaset-deep" />
                <div>
                  <h2 className="font-extrabold text-kaset-ink">YouTube import readiness</h2>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {importPlan.channelHandle} · {importPlan.candidateCount} candidates · no YouTube API
                  </p>
                </div>
              </div>
              <div className="mt-4 grid gap-2">
                {importPlan.candidates.slice(0, 4).map((candidate) => (
                  <div className="rounded-lg bg-kaset-mist p-3" key={candidate.videoId}>
                    <p className="line-clamp-2 text-sm font-extrabold text-kaset-ink">{candidate.title}</p>
                    <p className="mt-1 text-xs font-bold text-slate-500">
                      {candidate.editorReview} · {candidate.ownershipCheck}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            <section className="grid gap-3">
              <h2 className="text-lg font-extrabold text-kaset-ink">Content admin tasks</h2>
              {dashboard.tasks.filter((task) => task.moduleId === 'content' || task.moduleId === 'youtube_import').map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </section>
          </>
        ) : null}

        {activeTab === 'moderation' ? (
          <>
            <ModuleCard module={dashboard.modules.find((module) => module.id === 'moderation') ?? dashboard.modules[0]} />
            <Card className="p-4">
              <h2 className="font-extrabold text-kaset-ink">Pending community reports</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                {moderation.reports.length} local reports · {moderation.hiddenPosts.length} hidden posts · no real admin action
              </p>
              {moderation.reports.length > 0 ? (
                <div className="mt-3 grid gap-2">
                  {moderation.reports.slice(0, 4).map((report) => (
                    <div className="rounded-lg bg-kaset-mist p-3" key={report.id}>
                      <Badge tone="gold">{communityReportReasonLabels[report.reason]}</Badge>
                      <p className="mt-2 text-sm font-bold text-kaset-ink">{report.postId}</p>
                      <p className="mt-1 text-xs leading-5 text-slate-600">{report.note || 'ไม่มีหมายเหตุ'}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-3 rounded-lg bg-kaset-mist p-3 text-sm leading-6 text-slate-600">
                  ยังไม่มีรายงานในเครื่องนี้ ใช้ `/app/community` เพื่อทดสอบ report UX ได้
                </p>
              )}
              <Link className="mt-4 inline-flex text-sm font-extrabold text-kaset-deep" to="/app/moderation-center">
                เปิด moderation center
              </Link>
            </Card>

            {moderationQueue ? (
              <Card className="p-4">
                <h2 className="font-extrabold text-kaset-ink">{moderationQueue.title}</h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">{moderationQueue.note}</p>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <Badge tone="gold">{moderationQueue.pending} pending</Badge>
                  <Badge tone="sky">{moderationQueue.inReview} reviewed</Badge>
                  <Badge tone="green">{moderationQueue.completed} done</Badge>
                </div>
              </Card>
            ) : null}

            {dashboard.tasks.filter((task) => task.moduleId === 'moderation').map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </>
        ) : null}

        {activeTab === 'crop_prices' ? (
          <>
            <section className="grid grid-cols-2 gap-3">
              <SummaryCard icon={Leaf} label="price items" value={cropPriceItems.length} />
              <SummaryCard icon={HeartPulse} label="crop watches" value={cropWatch.counts.watches} />
            </section>
            {priceQueue ? (
              <Card className="p-4">
                <h2 className="font-extrabold text-kaset-ink">{priceQueue.title}</h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">{priceQueue.note}</p>
              </Card>
            ) : null}
            <section className="grid gap-3">
              <h2 className="text-lg font-extrabold text-kaset-ink">Crop price source readiness</h2>
              {cropPriceSources.map((source) => (
                <Card className="p-4" key={source.id}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-extrabold leading-6 text-kaset-ink">{source.shortLabel}</h3>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{source.label}</p>
                    </div>
                    <Badge tone={source.status === 'manual_review_needed' ? 'gold' : source.status === 'planned' ? 'sky' : 'neutral'}>
                      {cropPriceSourceStatusLabels[source.status]}
                    </Badge>
                  </div>
                </Card>
              ))}
            </section>
            <Card className="p-4">
              <h2 className="font-extrabold text-kaset-ink">Crop watch alert preferences</h2>
              {cropWatch.watches.length > 0 ? (
                <div className="mt-3 grid gap-2">
                  {cropWatch.watches.slice(0, 4).map((watch) => (
                    <div className="rounded-lg bg-kaset-mist p-3" key={watch.id}>
                      <p className="font-extrabold text-kaset-ink">{watch.cropName}</p>
                      <p className="mt-1 text-xs leading-5 text-slate-600">
                        {watch.alertPreferences.filter((preference) => preference.enabled).map((preference) => cropWatchAlertLabels[preference.alertType]).join(' · ') || 'ยังไม่มี alert preference ที่เปิดอยู่'}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-3 rounded-lg bg-kaset-mist p-3 text-sm leading-6 text-slate-600">
                  ยังไม่มี crop watch ในเครื่องนี้
                </p>
              )}
            </Card>
          </>
        ) : null}

        {activeTab === 'ai_safety' ? (
          <>
            <ModuleCard module={dashboard.modules.find((module) => module.id === 'ai_safety') ?? dashboard.modules[0]} />
            <section className="grid grid-cols-2 gap-3">
              <SummaryCard icon={Bot} label="AI credits available" value={aiCredits.summary.totalAvailable} />
              <SummaryCard icon={BookOpenCheck} label="usage logs" value={aiCredits.state.usageHistory.length} />
            </section>
            <section className="grid gap-3">
              <h2 className="text-lg font-extrabold text-kaset-ink">AI safety/risk logs preview</h2>
              {dashboard.risks.filter((risk) => risk.moduleId === 'ai_safety').map((risk) => (
                <RiskCard key={risk.id} risk={risk} />
              ))}
            </section>
            <Link className="inline-flex min-h-11 items-center justify-center rounded-full bg-kaset-deep px-4 text-sm font-extrabold text-white" to="/app/ai-proxy-status">
              เปิด AI proxy status
            </Link>
          </>
        ) : null}

        {activeTab === 'system' ? (
          <>
            <section className="grid gap-3">
              <h2 className="text-lg font-extrabold text-kaset-ink">System health cards</h2>
              {dashboard.healthCards.map((module) => (
                <ModuleCard key={module.id} module={module} />
              ))}
            </section>

            <Card className="p-4">
              <h2 className="font-extrabold text-kaset-ink">Guest Memory and auth readiness</h2>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Badge tone="green">{guestMemory.counts.savedItems} saved</Badge>
                <Badge tone="sky">{guestMemory.counts.recentAIQuestions} AI questions</Badge>
                <Badge tone="gold">{guestMemory.counts.farmRecords} farm records</Badge>
                <Badge tone="neutral">{guestMemory.counts.followedTopics} follows</Badge>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">Guest Memory ยังเป็น active local storage และยังไม่มี cloud/admin sync จริง</p>
            </Card>

            <Card className="p-4">
              <div className="flex gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
                  <Phone aria-hidden="true" className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="font-extrabold text-kaset-ink">Phone OTP staging readiness</h2>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {phoneAuthStaging.levelLabel} · ยังไม่ส่ง OTP จริง · ยังไม่เปิด auth จริง · {phoneAuthStaging.warningItems.length} warnings
                  </p>
                  <Link className="mt-3 inline-flex text-sm font-extrabold text-kaset-deep" to="/app/auth/phone-staging">
                    เปิด phone staging checklist
                  </Link>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-sky-100 text-sky-800">
                  <Database aria-hidden="true" className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="font-extrabold text-kaset-ink">Supabase readiness status</h2>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    ยังไม่ได้เชื่อมต่อ Supabase จริง · ห้ามใส่ service-role key ใน frontend · ต้องทดสอบบน staging ก่อน production
                  </p>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                    <Badge tone="green">{supabaseReadiness.passedItems.length} ready</Badge>
                    <Badge tone="gold">{supabaseReadiness.warningItems.length} warn</Badge>
                    <Badge tone="rose">{supabaseReadiness.blockerItems.length} block</Badge>
                  </div>
                  <Link className="mt-4 inline-flex text-sm font-extrabold text-kaset-deep" to="/app/supabase-readiness">
                    เปิด checklist staging
                  </Link>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-sky-100 text-sky-800">
                  <Database aria-hidden="true" className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="font-extrabold text-kaset-ink">Supabase connection dry run</h2>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {supabaseConnection.description}
                  </p>
                  <Link className="mt-3 inline-flex text-sm font-extrabold text-kaset-deep" to="/app/supabase-connection">
                    เปิด connection checklist
                  </Link>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
                  <ClipboardList aria-hidden="true" className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="font-extrabold text-kaset-ink">SQL staging verification</h2>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {supabaseSqlDraft.expectedPolicies.length} expected RLS policies · {supabaseSqlDraft.expectedIndexes.length} index checks · manual only
                  </p>
                  <Link className="mt-3 inline-flex text-sm font-extrabold text-kaset-deep" to="/app/supabase-sql-checklist">
                    เปิด SQL verification pack
                  </Link>
                  <Link className="mt-3 inline-flex text-sm font-extrabold text-kaset-deep" to="/app/supabase-setup-guide">
                    เปิด M41 setup guide
                  </Link>
                </div>
              </div>
            </Card>

            <section className="grid gap-3">
              <h2 className="text-lg font-extrabold text-kaset-ink">Admin risks</h2>
              {dashboard.risks.slice(0, 5).map((risk) => (
                <RiskCard key={risk.id} risk={risk} />
              ))}
            </section>
          </>
        ) : null}

        <Card className="border-amber-200 bg-amber-50 p-4">
          <h2 className="font-extrabold text-amber-950">Admin safety boundaries</h2>
          <ul className="mt-2 grid gap-2 text-sm leading-6 text-amber-900">
            {dashboard.boundaries.map((boundary) => (
              <li key={boundary}>{boundary}</li>
            ))}
          </ul>
          <Button className="mt-4 w-full" disabled variant="secondary">
            ปุ่ม action จริงยังปิดอยู่
          </Button>
        </Card>
      </div>
    </div>
  );
}
