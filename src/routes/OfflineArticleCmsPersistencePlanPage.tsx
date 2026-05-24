import { Database, FileText, History, LockKeyhole, RotateCcw, ShieldCheck, UserRoundCheck, WifiOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { StatusPill } from '@/components/ui/StatusPill';
import { getArticleCmsPersistenceSummary } from '@/services/content/offline-agri-cms-persistence';

export function OfflineArticleCmsPersistencePlanPage() {
  const summary = getArticleCmsPersistenceSummary();
  const { plan } = summary;

  return (
    <div>
      <PageHeader
        title="CMS persistence plan"
        subtitle="M72 backend-owned CMS contract planning สำหรับบทความเกษตร offline/online"
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
                  no database write
                </StatusPill>
                <h2 className="mt-3 text-2xl font-extrabold leading-8">ยังไม่เขียน Database จริง</h2>
                <p className="mt-2 text-sm leading-6 text-emerald-50/90">
                  หน้านี้วางสัญญา persistence สำหรับ CMS ในอนาคต โดยยังไม่ run migration ไม่ fetch CMS และไม่ publish บทความจริง
                </p>
              </div>
            </div>
          </div>
        </Card>

        <NoticeBox tone="success" icon={WifiOff} title="offline-first fallback remains">
          บทความ offline bundled ต้องยังอ่านได้เสมอเมื่อ CMS ยังไม่พร้อม ล้มเหลว หรือไม่ผ่าน safety/release policy
        </NoticeBox>

        <Link to="/app/articles/cms-migration-review">
          <Card className="border-amber-200 bg-amber-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h2 className="font-extrabold text-amber-950">M73 CMS migration review</h2>
                <p className="mt-1 text-sm leading-6 text-amber-900">
                  ตรวจ table DDL plan, RLS expectation, rollback plan และ seed fixture plan โดยยังไม่ run migration จริง
                </p>
              </div>
              <StatusPill tone="warning">dry run</StatusPill>
            </div>
          </Card>
        </Link>

        <Link to="/app/articles/cms-sql-drafts">
          <Card className="border-amber-200 bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h2 className="font-extrabold text-amber-950">M74 CMS SQL drafts</h2>
                <p className="mt-1 text-sm leading-6 text-amber-900">
                  ตรวจ draft SQL artifacts ที่ยังไม่อยู่ใน migrations และยังไม่ถูก execute
                </p>
              </div>
              <StatusPill tone="warning">review required</StatusPill>
            </div>
          </Card>
        </Link>

        <section className="grid grid-cols-2 gap-3">
          <Card className="p-4">
            <UserRoundCheck aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <p className="mt-3 text-3xl font-extrabold text-kaset-ink">{summary.roleCount}</p>
            <p className="mt-1 text-xs font-bold leading-5 text-slate-500">CMS roles</p>
          </Card>
          <Card className="p-4">
            <Database aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <p className="mt-3 text-3xl font-extrabold text-kaset-ink">{summary.tableCount}</p>
            <p className="mt-1 text-xs font-bold leading-5 text-slate-500">future tables</p>
          </Card>
          <Card className="p-4">
            <History aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <p className="mt-3 text-3xl font-extrabold text-kaset-ink">{summary.auditEventsPlanned}</p>
            <p className="mt-1 text-xs font-bold leading-5 text-slate-500">audit events</p>
          </Card>
          <Card className="p-4">
            <ShieldCheck aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <p className="mt-3 text-3xl font-extrabold text-kaset-ink">{summary.publishAllowedCount}</p>
            <p className="mt-1 text-xs font-bold leading-5 text-slate-500">roles can final publish</p>
          </Card>
        </section>

        <Card className="p-4">
          <h2 className="inline-flex items-center gap-2 font-extrabold text-kaset-ink">
            <Database aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            Future CMS tables
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {plan.tables.map((table) => (
              <Badge key={table} tone="sky">
                {table}
              </Badge>
            ))}
          </div>
        </Card>

        <section className="grid gap-3">
          <h2 className="text-lg font-extrabold text-kaset-ink">Role rules</h2>
          {plan.writeContracts.map((contract) => (
            <Card className="p-4" key={contract.role}>
              <div className="flex flex-wrap items-center gap-2">
                <StatusPill tone={contract.canDraft || contract.canRequestRelease ? 'warning' : 'neutral'}>
                  {contract.role}
                </StatusPill>
                {contract.canDraft ? <Badge tone="gold">draft</Badge> : null}
                {contract.canSignAgricultureReview ? <Badge tone="green">agri review</Badge> : null}
                {contract.canSignSafetyReview ? <Badge tone="rose">safety review</Badge> : null}
                {contract.canSignImageReview ? <Badge tone="sky">image review</Badge> : null}
                {contract.canRequestRelease ? <Badge tone="gold">request release</Badge> : null}
                <Badge tone="rose">final publish: no</Badge>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-700">{contract.notesTh}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {contract.blockers.slice(0, 4).map((blocker) => (
                  <Badge key={blocker} tone="rose">
                    {blocker}
                  </Badge>
                ))}
              </div>
            </Card>
          ))}
        </section>

        <Card className="border-sky-200 bg-sky-50 p-4">
          <h2 className="inline-flex items-center gap-2 font-extrabold text-sky-950">
            <FileText aria-hidden="true" className="h-5 w-5" />
            Read / fallback policy
          </h2>
          <div className="mt-3 grid gap-2 text-sm leading-6 text-sky-900">
            <p className="rounded-lg bg-white p-3">public read: {plan.readContract.publicRead}</p>
            <p className="rounded-lg bg-white p-3">editor read: {plan.readContract.editorRead}</p>
            <p className="rounded-lg bg-white p-3">offline fallback: {plan.readContract.offlineFallbackRead}</p>
          </div>
          <div className="mt-3 grid gap-2">
            {plan.fallbackPolicy.notesTh.map((note) => (
              <p className="rounded-lg bg-white p-3 text-xs font-bold leading-5 text-sky-950" key={note}>
                {note}
              </p>
            ))}
          </div>
        </Card>

        <Card className="border-rose-200 bg-rose-50 p-4">
          <h2 className="inline-flex items-center gap-2 font-extrabold text-rose-950">
            <History aria-hidden="true" className="h-5 w-5" />
            Release audit write contract
          </h2>
          <p className="mt-2 text-sm leading-6 text-rose-900">
            release audit ต้องเขียนโดย backend เท่านั้น และต้องมี audit event ก่อน publish ในอนาคต
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {plan.releaseAuditWriteContract.plannedEvents.map((event) => (
              <Badge key={event} tone="rose">
                {event}
              </Badge>
            ))}
          </div>
        </Card>

        <section className="grid gap-3">
          <h2 className="inline-flex items-center gap-2 text-lg font-extrabold text-kaset-ink">
            <RotateCcw aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            Migration checklist
          </h2>
          {plan.migrationChecklist.map((item) => (
            <Card className="p-4" key={item.id}>
              <div className="flex flex-wrap items-center gap-2">
                <StatusPill tone={item.status === 'blocked_until_review' ? 'warning' : 'info'}>{item.status}</StatusPill>
                {item.includesRollback ? <Badge tone="rose">rollback required</Badge> : null}
              </div>
              <p className="mt-3 text-sm font-bold leading-6 text-slate-700">{item.labelTh}</p>
            </Card>
          ))}
        </section>

        <Card className="border-amber-200 bg-amber-50 p-4">
          <h2 className="inline-flex items-center gap-2 font-extrabold text-amber-950">
            <LockKeyhole aria-hidden="true" className="h-5 w-5" />
            Publish blockers
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {plan.publishBlockers.map((blocker) => (
              <Badge key={blocker} tone="rose">
                {blocker}
              </Badge>
            ))}
          </div>
        </Card>

        <div className="grid gap-3">
          <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-kaset-deep px-4 text-sm font-extrabold text-white" to="/app/articles/release-audit">
            เปิด M71 release audit
          </Link>
          <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10" to="/app/articles/offline-qa">
            กลับไป offline article QA
          </Link>
          <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10" to="/app/articles/cms-migration-review">
            เปิด M73 CMS migration review
          </Link>
        </div>
      </div>
    </div>
  );
}
