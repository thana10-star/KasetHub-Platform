import { Database, FileCode2, LockKeyhole, RotateCcw, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { StatusPill } from '@/components/ui/StatusPill';
import { getArticleCmsSqlDraftSummary } from '@/services/content/offline-agri-cms-sql-draft';

export function OfflineArticleCmsSqlDraftsPage() {
  const summary = getArticleCmsSqlDraftSummary();
  const { registry } = summary;

  return (
    <div>
      <PageHeader
        title="CMS SQL drafts"
        subtitle="M74 planning-only SQL draft artifacts สำหรับ article CMS"
        showBack
      />
      <div className="grid gap-5 px-5 pb-6">
        <Card className="overflow-hidden bg-kaset-deep text-white">
          <div className="relative p-5">
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10" />
            <div className="relative flex gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-white text-kaset-deep">
                <FileCode2 aria-hidden="true" className="h-7 w-7" />
              </span>
              <div className="min-w-0">
                <StatusPill className="bg-white/15 text-white ring-white/20" tone="warning">
                  SQL not executed
                </StatusPill>
                <h2 className="mt-3 text-2xl font-extrabold leading-8">ยังไม่ run SQL จริง</h2>
                <p className="mt-2 text-sm leading-6 text-emerald-50/90">
                  ไฟล์ทั้งหมดอยู่ใน `supabase/drafts/cms` ไม่ใช่ `supabase/migrations` และยังไม่เชื่อมกับ runtime
                </p>
              </div>
            </div>
          </div>
        </Card>

        <NoticeBox tone="warning" icon={ShieldAlert} title="PLANNING ONLY / DO NOT RUN">
          Draft ทุกไฟล์ต้อง review ก่อนเสมอ ห้าม deploy ห้าม run migration และ frontend ยังเขียน CMS records หรือ publish บทความไม่ได้
        </NoticeBox>

        <section className="grid grid-cols-2 gap-3">
          <Card className="p-4">
            <FileCode2 aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <p className="mt-3 text-3xl font-extrabold text-kaset-ink">{summary.draftCount}</p>
            <p className="mt-1 text-xs font-bold leading-5 text-slate-500">draft files</p>
          </Card>
          <Card className="p-4">
            <Database aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <p className="mt-3 text-3xl font-extrabold text-kaset-ink">{summary.notExecutedCount}</p>
            <p className="mt-1 text-xs font-bold leading-5 text-slate-500">not executed</p>
          </Card>
          <Card className="p-4">
            <LockKeyhole aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <p className="mt-3 text-3xl font-extrabold text-kaset-ink">{summary.migrationBlockedCount}</p>
            <p className="mt-1 text-xs font-bold leading-5 text-slate-500">migration blocked</p>
          </Card>
          <Card className="p-4">
            <RotateCcw aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <p className="mt-3 text-3xl font-extrabold text-kaset-ink">{summary.rollbackDraftAvailable ? 'yes' : 'no'}</p>
            <p className="mt-1 text-xs font-bold leading-5 text-slate-500">rollback draft</p>
          </Card>
        </section>

        <Card className="p-4">
          <h2 className="font-extrabold text-kaset-ink">Draft base path</h2>
          <p className="mt-3 break-all rounded-lg bg-kaset-mist p-3 text-sm font-extrabold text-kaset-deep">
            {registry.basePath}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            migration folder: no · runtime execution: no · Supabase write: no
          </p>
        </Card>

        <section className="grid gap-3">
          <h2 className="text-lg font-extrabold text-kaset-ink">SQL draft files</h2>
          {registry.artifacts.map((artifact) => (
            <Card className="p-4" key={artifact.fileName}>
              <div className="flex flex-wrap items-center gap-2">
                <StatusPill tone="warning">{artifact.executionStatus}</StatusPill>
                <Badge tone="sky">{artifact.kind}</Badge>
                <Badge tone="rose">migration blocked</Badge>
              </div>
              <h3 className="mt-3 break-all font-extrabold text-kaset-ink">{artifact.fileName}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-700">{artifact.purposeTh}</p>
              <p className="mt-2 break-all rounded-lg bg-kaset-mist p-3 text-xs font-bold leading-5 text-kaset-deep">
                {artifact.relativePath}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge tone="rose">{artifact.planningOnlyWarning}</Badge>
                <Badge tone="rose">{artifact.doNotRunWarning}</Badge>
                <Badge tone="rose">{artifact.doNotDeployWarning}</Badge>
                <Badge tone="gold">{artifact.reviewRequiredWarning}</Badge>
              </div>
              <div className="mt-3 grid gap-2">
                {artifact.riskNotesTh.map((note) => (
                  <p className="rounded-lg bg-amber-50 p-3 text-xs font-bold leading-5 text-amber-900" key={note}>
                    {note}
                  </p>
                ))}
              </div>
            </Card>
          ))}
        </section>

        <Card className="border-rose-200 bg-rose-50 p-4">
          <h2 className="font-extrabold text-rose-950">Runtime safety</h2>
          <div className="mt-3 grid gap-2 text-sm font-bold leading-6 text-rose-900">
            <p>frontend CMS write: {registry.frontendCanWriteCmsRecords ? 'yes' : 'no'}</p>
            <p>final publish allowed: {registry.finalPublishAllowed ? 'yes' : 'no'}</p>
            <p>SQL executed: {registry.noSqlExecuted ? 'no' : 'yes'}</p>
          </div>
        </Card>

        <div className="grid gap-3">
          <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-kaset-deep px-4 text-sm font-extrabold text-white" to="/app/articles/cms-migration-review">
            เปิด M73 CMS migration review
          </Link>
          <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10" to="/app/articles/cms-persistence-plan">
            กลับไป CMS persistence plan
          </Link>
        </div>
      </div>
    </div>
  );
}
