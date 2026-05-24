import { Database, LockKeyhole, RotateCcw, ShieldCheck, Sprout, WifiOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { StatusPill } from '@/components/ui/StatusPill';
import { getCmsMigrationReviewSummary } from '@/services/content/offline-agri-cms-migration-review';

export function OfflineArticleCmsMigrationReviewPage() {
  const summary = getCmsMigrationReviewSummary();
  const { review } = summary;

  return (
    <div>
      <PageHeader
        title="CMS migration review"
        subtitle="M73 dry-run checklist และ SQL/RLS review pack สำหรับ CMS article persistence"
        showBack
      />
      <div className="grid gap-5 px-5 pb-6">
        <Card className="overflow-hidden bg-kaset-deep text-white">
          <div className="relative p-5">
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10" />
            <div className="relative flex gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-white text-kaset-deep">
                <Database aria-hidden="true" className="h-7 w-7" />
              </span>
              <div className="min-w-0">
                <StatusPill className="bg-white/15 text-white ring-white/20" tone="warning">
                  migration blocked
                </StatusPill>
                <h2 className="mt-3 text-2xl font-extrabold leading-8">ยังไม่ run migration จริง</h2>
                <p className="mt-2 text-sm leading-6 text-emerald-50/90">
                  หน้านี้เป็น dry-run review pack เท่านั้น ไม่มี Supabase write ไม่มี migration execution และ frontend ยัง publish โดยตรงไม่ได้
                </p>
              </div>
            </div>
          </div>
        </Card>

        <NoticeBox tone="success" icon={WifiOff} title="offline-first / no database write">
          การตรวจนี้อ่านจาก fixture ในแอปเท่านั้น บทความ offline fallback ยังต้องอยู่เสมอ และ human release gate ยังจำเป็นก่อน publish
        </NoticeBox>

        <section className="grid grid-cols-2 gap-3">
          <Card className="p-4">
            <Database aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <p className="mt-3 text-3xl font-extrabold text-kaset-ink">{summary.tableCount}</p>
            <p className="mt-1 text-xs font-bold leading-5 text-slate-500">planned tables</p>
          </Card>
          <Card className="p-4">
            <ShieldCheck aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <p className="mt-3 text-3xl font-extrabold text-kaset-ink">{summary.rlsRuleCount}</p>
            <p className="mt-1 text-xs font-bold leading-5 text-slate-500">RLS rules</p>
          </Card>
          <Card className="p-4">
            <Sprout aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <p className="mt-3 text-3xl font-extrabold text-kaset-ink">{summary.seedFixtureCount}</p>
            <p className="mt-1 text-xs font-bold leading-5 text-slate-500">seed plans</p>
          </Card>
          <Card className="p-4">
            <RotateCcw aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <p className="mt-3 text-3xl font-extrabold text-kaset-ink">{summary.rollbackReady ? 'yes' : 'no'}</p>
            <p className="mt-1 text-xs font-bold leading-5 text-slate-500">rollback plan</p>
          </Card>
        </section>

        <section className="grid gap-3">
          <h2 className="text-lg font-extrabold text-kaset-ink">Planned table reviews</h2>
          {review.tableReviews.map((table) => (
            <Card className="p-4" key={table.tableName}>
              <div className="flex flex-wrap items-center gap-2">
                <StatusPill tone="warning">{table.status}</StatusPill>
                <Badge tone="sky">{table.tableName}</Badge>
                <Badge tone="neutral">{table.owner}</Badge>
                <Badge tone={table.readScope === 'public_reviewed_only' ? 'green' : 'gold'}>{table.readScope}</Badge>
              </div>
              <div className="mt-3 grid gap-2 text-sm leading-6 text-slate-700">
                <p><span className="font-extrabold text-kaset-deep">write:</span> {table.writeSource}</p>
                <p><span className="font-extrabold text-kaset-deep">RLS:</span> {table.rlsExpectation}</p>
                <p><span className="font-extrabold text-kaset-deep">rollback:</span> {table.rollbackNote}</p>
                <p><span className="font-extrabold text-kaset-deep">seed:</span> {table.seedStrategy}</p>
                <p><span className="font-extrabold text-kaset-deep">audit:</span> {table.auditRequirement}</p>
              </div>
            </Card>
          ))}
        </section>

        <section className="grid gap-3">
          <h2 className="inline-flex items-center gap-2 text-lg font-extrabold text-kaset-ink">
            <ShieldCheck aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            RLS dry-run review planning
          </h2>
          {review.rlsReviews.map((rule) => (
            <Card className="p-4" key={rule.id}>
              <div className="flex flex-wrap items-center gap-2">
                <StatusPill tone={rule.status === 'blocked' ? 'danger' : 'warning'}>{rule.status}</StatusPill>
                <Badge tone="neutral">{rule.id}</Badge>
              </div>
              <p className="mt-3 text-sm font-bold leading-6 text-slate-700">{rule.ruleTh}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {rule.blockers.map((blocker) => (
                  <Badge key={blocker} tone="rose">
                    {blocker}
                  </Badge>
                ))}
              </div>
            </Card>
          ))}
        </section>

        <Card className="border-amber-200 bg-amber-50 p-4">
          <h2 className="inline-flex items-center gap-2 font-extrabold text-amber-950">
            <RotateCcw aria-hidden="true" className="h-5 w-5" />
            Rollback plan
          </h2>
          <div className="mt-3 grid gap-2">
            {review.rollbackPlan.stepsTh.map((step) => (
              <p className="rounded-lg bg-white p-3 text-sm font-bold leading-6 text-amber-900" key={step}>
                {step}
              </p>
            ))}
          </div>
        </Card>

        <section className="grid gap-3">
          <h2 className="inline-flex items-center gap-2 text-lg font-extrabold text-kaset-ink">
            <Sprout aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            Seed fixture plan
          </h2>
          {review.seedFixturePlans.map((seed) => (
            <Card className="p-4" key={seed.id}>
              <div className="flex flex-wrap items-center gap-2">
                <StatusPill tone={seed.status === 'blocked' ? 'warning' : 'info'}>{seed.status}</StatusPill>
                <Badge tone="green">no insert</Badge>
              </div>
              <h3 className="mt-3 font-extrabold text-kaset-ink">{seed.fixtureName}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-700">{seed.strategyTh}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {seed.targetTables.map((table) => (
                  <Badge key={table} tone="sky">
                    {table}
                  </Badge>
                ))}
              </div>
            </Card>
          ))}
        </section>

        <Card className="border-rose-200 bg-rose-50 p-4">
          <h2 className="inline-flex items-center gap-2 font-extrabold text-rose-950">
            <LockKeyhole aria-hidden="true" className="h-5 w-5" />
            Publish safety gate
          </h2>
          <p className="mt-2 text-sm leading-6 text-rose-900">
            frontend write, public write, automation publish และ incomplete content publish ยังถูกบล็อกทั้งหมด
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {review.publishSafetyGate.blockers.map((blocker) => (
              <Badge key={blocker} tone="rose">
                {blocker}
              </Badge>
            ))}
          </div>
        </Card>

        <div className="grid gap-3">
          <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-kaset-deep px-4 text-sm font-extrabold text-white" to="/app/articles/cms-persistence-plan">
            เปิด M72 CMS persistence plan
          </Link>
          <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10" to="/app/articles/release-audit">
            กลับไป release audit
          </Link>
        </div>
      </div>
    </div>
  );
}
