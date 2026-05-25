import { FileImage, FileText, GitCompare, History, ShieldAlert, UserCheck, WifiOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { StatusPill } from '@/components/ui/StatusPill';
import {
  buildArticleReleaseAuditReadiness,
  getArticleReleaseAuditSummary,
  getArticleReleaseBlockedReasonLabel,
} from '@/services/content/offline-agri-release-audit';

export function OfflineArticleReleaseAuditPage() {
  const summary = getArticleReleaseAuditSummary();
  const audit = buildArticleReleaseAuditReadiness('soil-types-before-planting');

  return (
    <div>
      <PageHeader
        title="Release audit"
        subtitle="M71 audit event fixtures, blocked release attempts, diff preview และ automation bypass policy"
        showBack
      />
      <div className="grid gap-5 px-5 pb-6">
        <Card className="overflow-hidden bg-kaset-deep text-white">
          <div className="relative p-5">
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10" />
            <div className="relative flex gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-white text-kaset-deep">
                <History aria-hidden="true" className="h-7 w-7" />
              </span>
              <div className="min-w-0">
                <StatusPill className="bg-white/15 text-white ring-white/20" tone="warning">
                  M71 final publish blocked
                </StatusPill>
                <h2 className="mt-3 text-2xl font-extrabold leading-8">ยังไม่ได้เผยแพร่จริง</h2>
                <p className="mt-2 text-sm leading-6 text-emerald-50/90">
                  หน้านี้เป็น audit readiness แบบ local-only เพื่อพิสูจน์ว่า CMS หรือ automation ไม่สามารถข้าม human release gate ได้
                </p>
              </div>
            </div>
          </div>
        </Card>

        <NoticeBox tone="success" icon={WifiOff} title="offline-first / no CMS write">
          ไม่มี Supabase write ไม่มี backend CMS write ไม่มี external image/CDN และไม่มีการ publish บทความจริง
        </NoticeBox>

        <Link to="/app/articles/cms-persistence-plan">
          <Card className="border-sky-200 bg-sky-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h2 className="font-extrabold text-sky-950">M72 CMS persistence plan</h2>
                <p className="mt-1 text-sm leading-6 text-sky-900">
                  วาง role rules, future tables, write contract, fallback policy และ migration checklist โดยยังไม่เขียน Database จริง
                </p>
              </div>
              <StatusPill tone="warning">planning</StatusPill>
            </div>
          </Card>
        </Link>

        <section className="grid grid-cols-2 gap-3">
          <Card className="p-4">
            <FileText aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <p className="mt-3 text-3xl font-extrabold text-kaset-ink">{summary.attemptCount}</p>
            <p className="mt-1 text-xs font-bold leading-5 text-slate-500">release attempts</p>
          </Card>
          <Card className="p-4">
            <ShieldAlert aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <p className="mt-3 text-3xl font-extrabold text-kaset-ink">{summary.blockedAttemptCount}</p>
            <p className="mt-1 text-xs font-bold leading-5 text-slate-500">blocked attempts</p>
          </Card>
          <Card className="p-4">
            <UserCheck aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <p className="mt-3 text-3xl font-extrabold text-kaset-ink">{summary.reviewerHistoryCount}</p>
            <p className="mt-1 text-xs font-bold leading-5 text-slate-500">reviewer changes</p>
          </Card>
          <Card className="p-4">
            <GitCompare aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <p className="mt-3 text-3xl font-extrabold text-kaset-ink">{summary.automationBypassBlockedCount}</p>
            <p className="mt-1 text-xs font-bold leading-5 text-slate-500">automation blocked</p>
          </Card>
        </section>

        <Card className="border-rose-200 bg-rose-50 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill tone="warning">pilot article</StatusPill>
            <Badge tone="sky">{audit.articleSlug}</Badge>
            <Badge tone="rose">final publish: no</Badge>
          </div>
          <h2 className="mt-3 font-extrabold text-rose-950">Human release gate ยังเป็นเงื่อนไขสุดท้าย</h2>
          <p className="mt-2 text-sm leading-6 text-rose-900">
            ต่อให้มี CMS override, reviewer change หรือ metadata เปลี่ยน ระบบยังต้องมี human approval แยกต่างหากก่อนเผยแพร่จริง
          </p>
        </Card>

        <section className="grid gap-3">
          <h2 className="text-lg font-extrabold text-kaset-ink">Release audit timeline</h2>
          {audit.timeline.map((event) => (
            <Card className="p-4" key={event.id}>
              <div className="flex flex-wrap items-center gap-2">
                <StatusPill tone={event.status === 'blocked' ? 'danger' : 'warning'}>{event.status}</StatusPill>
                <Badge tone="neutral">{event.event}</Badge>
              </div>
              <p className="mt-3 text-sm font-bold leading-6 text-slate-700">{event.noteTh}</p>
            </Card>
          ))}
        </section>

        <section className="grid gap-3">
          <h2 className="text-lg font-extrabold text-kaset-ink">Blocked release attempts</h2>
          {audit.attempts.map((attempt) => (
            <Card className="p-4" key={attempt.id}>
              <div className="flex flex-wrap items-center gap-2">
                <StatusPill tone="danger">{attempt.status}</StatusPill>
                <Badge tone="sky">{attempt.attemptedBy}</Badge>
                <Badge tone="neutral">{attempt.event}</Badge>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-700">{attempt.noteTh}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {attempt.blockedReasons.map((reason) => (
                  <Badge key={reason} tone="rose">
                    {getArticleReleaseBlockedReasonLabel(reason)}
                  </Badge>
                ))}
              </div>
            </Card>
          ))}
        </section>

        <Card className="p-4">
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill tone="warning">diff preview</StatusPill>
            <Badge tone="neutral">{audit.diffPreview.id}</Badge>
            <Badge tone="rose">publish blocked</Badge>
          </div>
          <h2 className="mt-3 inline-flex items-center gap-2 font-extrabold text-kaset-ink">
            <GitCompare aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            Release diff preview
          </h2>
          <div className="mt-3 grid gap-3 text-sm leading-6 text-slate-700">
            <p className="rounded-lg bg-kaset-mist p-3">
              <span className="font-extrabold text-kaset-deep">before:</span> {audit.diffPreview.beforeSummaryTh}
            </p>
            <p className="rounded-lg bg-kaset-mist p-3">
              <span className="font-extrabold text-kaset-deep">after:</span> {audit.diffPreview.afterSummaryTh}
            </p>
          </div>
          <div className="mt-3 grid gap-2">
            {audit.diffPreview.disclaimerChanges.map((change) => (
              <div className="rounded-lg bg-rose-50 p-3 text-xs font-bold leading-5 text-rose-900" key={change}>
                disclaimer: {change}
              </div>
            ))}
            {audit.diffPreview.sourceMetadataChanges.map((change) => (
              <div className="rounded-lg bg-sky-50 p-3 text-xs font-bold leading-5 text-sky-900" key={change}>
                source: {change}
              </div>
            ))}
            {audit.diffPreview.reviewerStatusChanges.map((change) => (
              <div className="rounded-lg bg-amber-50 p-3 text-xs font-bold leading-5 text-amber-900" key={change}>
                reviewer: {change}
              </div>
            ))}
            {audit.diffPreview.imageReviewChanges.map((change) => (
              <div className="rounded-lg bg-kaset-mint p-3 text-xs font-bold leading-5 text-kaset-deep" key={change}>
                image: {change}
              </div>
            ))}
          </div>
        </Card>

        <section className="grid gap-3">
          <h2 className="text-lg font-extrabold text-kaset-ink">Reviewer change history</h2>
          {audit.reviewerHistory.map((history) => (
            <Card className="p-4" key={history.id}>
              <div className="flex flex-wrap items-center gap-2">
                <StatusPill tone="warning">{history.status}</StatusPill>
                <Badge tone="neutral">{history.role}</Badge>
              </div>
              <p className="mt-3 text-sm font-bold leading-6 text-kaset-deep">
                {history.beforeStatus} -&gt; {history.afterStatus}
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-600">{history.noteTh}</p>
            </Card>
          ))}
        </section>

        <section className="grid gap-3">
          <h2 className="inline-flex items-center gap-2 text-lg font-extrabold text-kaset-ink">
            <FileImage aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            Automation bypass blocked
          </h2>
          {audit.automationBypassAttempts.map((attempt) => (
            <Card className="border-rose-200 bg-rose-50 p-4" key={attempt.id}>
              <div className="flex flex-wrap items-center gap-2">
                <StatusPill tone="danger">{attempt.status}</StatusPill>
                <Badge tone="rose">{attempt.reason}</Badge>
                <Badge tone="neutral">{attempt.attemptedBy}</Badge>
              </div>
              <p className="mt-3 text-sm leading-6 text-rose-900">{attempt.noteTh}</p>
            </Card>
          ))}
        </section>

        <div className="grid gap-3">
          <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-kaset-deep px-4 text-sm font-extrabold text-white" to="/app/articles/editorial-evidence">
            เปิด M70 editorial evidence
          </Link>
          <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10" to="/app/articles/editorial-review">
            กลับไป editorial review
          </Link>
          <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10" to="/app/articles/cms-persistence-plan">
            เปิด M72 CMS persistence plan
          </Link>
        </div>
      </div>
    </div>
  );
}
