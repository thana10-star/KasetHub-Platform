import {
  AlertTriangle,
  Bot,
  CheckCircle2,
  CloudUpload,
  Database,
  GitBranch,
  ImageUp,
  ListChecks,
  Phone,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { StatusPill } from '@/components/ui/StatusPill';
import { nextPhaseOptionLabels, runPhaseDecisionPlan } from '@/services/phase-planning/phase-decision-service';
import type {
  NextPhaseOption,
  NextPhaseOptionId,
  PhaseDependencyStatus,
  PhaseRiskLevel,
} from '@/services/phase-planning/phase-decision.types';

const riskTone: Record<PhaseRiskLevel, 'success' | 'warning' | 'danger' | 'info' | 'neutral'> = {
  low: 'success',
  medium: 'info',
  high: 'warning',
  critical: 'danger',
};

const riskLabel: Record<PhaseRiskLevel, string> = {
  low: 'เสี่ยงต่ำ',
  medium: 'เสี่ยงกลาง',
  high: 'เสี่ยงสูง',
  critical: 'เสี่ยงวิกฤต',
};

const dependencyTone: Record<PhaseDependencyStatus, 'success' | 'warning' | 'danger' | 'info' | 'neutral'> = {
  ready: 'success',
  partial: 'warning',
  missing: 'neutral',
  blocked: 'danger',
};

const dependencyLabel: Record<PhaseDependencyStatus, string> = {
  ready: 'พร้อม',
  partial: 'พร้อมบางส่วน',
  missing: 'ยังไม่มี',
  blocked: 'ติดเงื่อนไข',
};

const optionIcons: Record<NextPhaseOptionId, typeof Database> = {
  real_supabase_staging: Database,
  real_phone_auth_staging: Phone,
  real_guest_sync_staging: CloudUpload,
  real_ai_text_proxy: Bot,
  real_plant_vision_proxy: ImageUp,
  pwa_offline_mobile_shell: Smartphone,
  closed_test_preparation: ListChecks,
};

function OptionCard({ option }: { option: NextPhaseOption }) {
  const Icon = optionIcons[option.id];

  return (
    <Card className="p-4">
      <div className="flex gap-3">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
          <Icon aria-hidden="true" className="h-6 w-6" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={option.rank === 1 ? 'green' : 'sky'}>ลำดับ {option.rank}</Badge>
            <StatusPill tone={riskTone[option.riskLevel]}>{riskLabel[option.riskLevel]}</StatusPill>
            <StatusPill tone={option.readinessScore.blockerCount > 0 ? 'warning' : 'success'}>
              {option.readinessScore.score}%
            </StatusPill>
          </div>
          <h3 className="mt-3 text-lg font-extrabold leading-7 text-kaset-ink">{option.title}</h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">{option.summary}</p>
          <p className="mt-3 rounded-lg bg-kaset-mist p-3 text-xs font-bold leading-5 text-kaset-deep">{option.recommendedWhen}</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div>
          <h4 className="text-sm font-extrabold text-kaset-ink">ประโยชน์</h4>
          <ul className="mt-2 grid gap-2 text-sm leading-6 text-slate-700">
            {option.benefits.map((benefit) => (
              <li className="rounded-lg bg-emerald-50 p-3 text-emerald-950" key={benefit}>
                {benefit}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-extrabold text-kaset-ink">ความเสี่ยง / เงื่อนไขหยุด</h4>
          <ul className="mt-2 grid gap-2 text-sm leading-6 text-slate-700">
            {option.risks.map((risk) => (
              <li className="rounded-lg bg-amber-50 p-3 text-amber-950" key={risk}>
                {risk}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 grid gap-2">
        <h4 className="text-sm font-extrabold text-kaset-ink">Prerequisites</h4>
        {option.prerequisites.map((dependency) => (
          <div className="rounded-lg bg-white p-3 ring-1 ring-kaset-deep/8" key={dependency.id}>
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-extrabold text-kaset-ink">{dependency.label}</p>
              <StatusPill tone={dependencyTone[dependency.status]}>{dependencyLabel[dependency.status]}</StatusPill>
            </div>
            <p className="mt-1 text-sm leading-6 text-slate-600">{dependency.detail}</p>
            {dependency.route ? (
              <Link className="mt-2 inline-flex text-sm font-extrabold text-kaset-deep" to={dependency.route}>
                เปิดหน้าที่เกี่ยวข้อง
              </Link>
            ) : null}
          </div>
        ))}
      </div>
    </Card>
  );
}

export function NextPhasePage() {
  const plan = useMemo(() => runPhaseDecisionPlan(), []);
  const recommendedOption = plan.options.find((option) => option.id === plan.recommendation.recommendedOptionId) ?? plan.options[0];

  return (
    <div>
      <PageHeader title="Next Phase Decision" subtitle="แผนตัดสินใจเข้าสู่ real staging หลัง M35" showBack />
      <div className="grid gap-5 px-5 pb-6">
        <Card className="overflow-hidden bg-kaset-deep text-white">
          <div className="relative p-5">
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10" />
            <div className="relative flex gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-white text-kaset-deep">
                <GitBranch aria-hidden="true" className="h-7 w-7" />
              </span>
              <div className="min-w-0">
                <Badge className="bg-white/15 text-white" tone="green">
                  M36 planning only
                </Badge>
                <h2 className="mt-3 text-2xl font-extrabold leading-8">{plan.recommendation.title}</h2>
                <p className="mt-2 text-sm leading-6 text-emerald-50/90">{plan.recommendation.summary}</p>
              </div>
            </div>
          </div>
        </Card>

        <NoticeBox tone="warning" icon={ShieldCheck} title="ยังไม่เปิดระบบจริงในหน้านี้">
          หน้านี้เป็นแผนตัดสินใจเท่านั้น ยังไม่เชื่อม Supabase ไม่เปิด auth ไม่เรียก AI API ไม่เพิ่ม key ไม่เขียน backend
          และไม่เพิ่ม network call ใหม่ main prototype ต้องยังเปิดได้แม้ไม่มี .env.local
        </NoticeBox>

        <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Card className="p-4">
            <CheckCircle2 aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <p className="mt-3 text-2xl font-extrabold text-kaset-ink">{plan.overallReadiness.score}%</p>
            <p className="mt-1 text-xs font-bold leading-4 text-slate-500">readiness score</p>
          </Card>
          <Card className="p-4">
            <AlertTriangle aria-hidden="true" className="h-5 w-5 text-amber-800" />
            <p className="mt-3 text-2xl font-extrabold text-kaset-ink">{plan.overallReadiness.blockerCount}</p>
            <p className="mt-1 text-xs font-bold leading-4 text-slate-500">production blockers</p>
          </Card>
          <Card className="p-4">
            <Database aria-hidden="true" className="h-5 w-5 text-sky-800" />
            <p className="mt-3 text-lg font-extrabold text-kaset-ink">staging/supabase</p>
            <p className="mt-1 text-xs font-bold leading-4 text-slate-500">recommended branch</p>
          </Card>
          <Card className="p-4">
            <ListChecks aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <p className="mt-3 text-2xl font-extrabold text-kaset-ink">{plan.options.length}</p>
            <p className="mt-1 text-xs font-bold leading-4 text-slate-500">phase options</p>
          </Card>
        </section>

        <Card className="p-4">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-extrabold text-kaset-ink">Recommended order</h2>
            <StatusPill tone="success">ทางที่ปลอดภัยที่สุด</StatusPill>
          </div>
          <div className="mt-4 grid gap-2">
            {plan.recommendation.recommendedOrder.map((optionId, index) => (
              <div className="flex min-h-[58px] items-center gap-3 rounded-lg bg-kaset-mist p-3" key={optionId}>
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white text-sm font-extrabold text-kaset-deep">
                  {index + 1}
                </span>
                <p className="font-extrabold leading-6 text-kaset-ink">{nextPhaseOptionLabels[optionId]}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 rounded-lg bg-amber-50 p-3 text-sm font-bold leading-6 text-amber-950">{plan.recommendation.acceleratorNote}</p>
        </Card>

        <section className="grid gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-extrabold text-kaset-ink">Ranked phase options</h2>
            <StatusPill tone={riskTone[recommendedOption.riskLevel]}>{recommendedOption.shortLabel}</StatusPill>
          </div>
          {plan.options.map((option) => (
            <OptionCard key={option.id} option={option} />
          ))}
        </section>

        <section className="grid gap-3">
          <h2 className="text-xl font-extrabold text-kaset-ink">Staging branch plan</h2>
          {plan.executionTracks.map((track) => (
            <Card className="p-4" key={track.id}>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-extrabold text-kaset-ink">{track.label}</h3>
                <Badge tone={track.branchName === 'main' ? 'green' : 'sky'}>{track.branchName}</Badge>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">{track.purpose}</p>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-lg bg-kaset-mist p-3">
                  <p className="text-xs font-bold text-slate-500">Allowed</p>
                  <p className="mt-1 text-sm font-bold leading-6 text-kaset-deep">{track.allowedChanges.join(' · ')}</p>
                </div>
                <div className="rounded-lg bg-rose-50 p-3">
                  <p className="text-xs font-bold text-rose-900">Forbidden</p>
                  <p className="mt-1 text-sm font-bold leading-6 text-rose-950">{track.forbiddenChanges.join(' · ')}</p>
                </div>
              </div>
              <p className="mt-3 rounded-lg bg-white p-3 text-sm leading-6 text-slate-700 ring-1 ring-kaset-deep/8">
                Preview: {track.previewStrategy}
              </p>
            </Card>
          ))}
        </section>

        <NoticeBox tone="danger" icon={AlertTriangle} title="Production blockers">
          <ul className="grid gap-2">
            {plan.productionBlockers.map((blocker) => (
              <li key={blocker}>{blocker}</li>
            ))}
          </ul>
        </NoticeBox>

        <section className="grid gap-3">
          <h2 className="text-xl font-extrabold text-kaset-ink">Risk register</h2>
          {plan.riskRegister.map((risk) => (
            <Card className="p-4" key={risk.id}>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-extrabold text-kaset-ink">{risk.title}</h3>
                <StatusPill tone={riskTone[risk.level]}>{riskLabel[risk.level]}</StatusPill>
                <Badge tone="neutral">{risk.owner}</Badge>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">{risk.mitigation}</p>
              <p className="mt-3 rounded-lg bg-amber-50 p-3 text-xs font-bold leading-5 text-amber-950">{risk.stopCondition}</p>
            </Card>
          ))}
        </section>

        <Card className="p-4">
          <h2 className="font-extrabold text-kaset-ink">Next safe steps</h2>
          <div className="mt-3 grid gap-2">
            {plan.safeNextSteps.map((step) => (
              <p className="rounded-lg bg-kaset-mist p-3 text-sm font-bold leading-6 text-slate-700" key={step}>
                {step}
              </p>
            ))}
          </div>
        </Card>

        <div className="grid gap-3 sm:grid-cols-3">
          <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-kaset-deep px-4 text-sm font-extrabold text-white" to="/app/supabase-readiness">
            เปิด Supabase readiness
          </Link>
          <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10" to="/app/ai-proxy-status">
            เปิด AI proxy status
          </Link>
          <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10" to="/app/mvp-snapshot">
            เปิด MVP snapshot
          </Link>
        </div>
      </div>
    </div>
  );
}
