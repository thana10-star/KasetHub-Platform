import { FileImage, FileText, ListChecks, ShieldAlert, UserCheck, WifiOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { StatusPill } from '@/components/ui/StatusPill';
import {
  getArticleEditorialReviewSummary,
  getArticleFinalPublishBlockerLabel,
  getArticleReviewerRoleLabel,
} from '@/services/content/offline-agri-editorial-review';

export function OfflineArticleEditorialReviewPage() {
  const summary = getArticleEditorialReviewSummary();

  return (
    <div>
      <PageHeader
        title="Editorial review"
        subtitle="M69 ตรวจ sign-off, source metadata, image review และ publish blockers แบบ local-only"
        showBack
      />
      <div className="grid gap-5 px-5 pb-6">
        <Card className="overflow-hidden bg-kaset-deep text-white">
          <div className="relative p-5">
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10" />
            <div className="relative flex gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-white text-kaset-deep">
                <UserCheck aria-hidden="true" className="h-7 w-7" />
              </span>
              <div className="min-w-0">
                <StatusPill className="bg-white/15 text-white ring-white/20" tone="warning">
                  final publish blocked
                </StatusPill>
                <h2 className="mt-3 text-2xl font-extrabold leading-8">ตรวจร่างบทความก่อนเผยแพร่จริง</h2>
                <p className="mt-2 text-sm leading-6 text-emerald-50/90">
                  ทุก sign-off ยัง pending และไม่มีบทความใดถูก mark เป็น final official publish ใน M69
                </p>
              </div>
            </div>
          </div>
        </Card>

        <NoticeBox tone="success" icon={WifiOff} title="offline-first / no CMS write">
          หน้านี้เป็น QA fixture ในเครื่องเท่านั้น ไม่มี Supabase write ไม่มี backend CMS write ไม่มี AI generation และไม่มีภาพจาก CDN ภายนอก
        </NoticeBox>

        <section className="grid grid-cols-2 gap-3">
          <Card className="p-4">
            <FileText aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <p className="mt-3 text-3xl font-extrabold text-kaset-ink">{summary.articleCount}</p>
            <p className="mt-1 text-xs font-bold leading-5 text-slate-500">pilot states</p>
          </Card>
          <Card className="p-4">
            <UserCheck aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <p className="mt-3 text-3xl font-extrabold text-kaset-ink">{summary.pendingSignoffCount}</p>
            <p className="mt-1 text-xs font-bold leading-5 text-slate-500">pending signoffs</p>
          </Card>
          <Card className="p-4">
            <ListChecks aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <p className="mt-3 text-3xl font-extrabold text-kaset-ink">{summary.sourcePlaceholderCount}</p>
            <p className="mt-1 text-xs font-bold leading-5 text-slate-500">source placeholders</p>
          </Card>
          <Card className="p-4">
            <FileImage aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <p className="mt-3 text-3xl font-extrabold text-kaset-ink">{summary.imageReviewPendingCount}</p>
            <p className="mt-1 text-xs font-bold leading-5 text-slate-500">image reviews</p>
          </Card>
        </section>

        {summary.states.map((state) => (
          <Card className="p-4" key={state.articleSlug}>
            <div className="flex flex-wrap items-center gap-2">
              <StatusPill tone="warning">{state.editorialStatus}</StatusPill>
              <Badge tone="sky">{state.articleSlug}</Badge>
              {state.offlineFallbackArticleSlug ? <Badge tone="neutral">fallback: {state.offlineFallbackArticleSlug}</Badge> : null}
              <Badge tone="rose">final publish: no</Badge>
            </div>
            <h2 className="mt-3 text-lg font-extrabold text-kaset-ink">{state.titleTh}</h2>

            <div className="mt-4 grid gap-3">
              <section>
                <h3 className="inline-flex items-center gap-2 text-sm font-extrabold text-kaset-ink">
                  <UserCheck aria-hidden="true" className="h-4 w-4 text-kaset-deep" />
                  Sign-off checklist
                </h3>
                <div className="mt-2 grid gap-2">
                  {state.signoffs.map((signoff) => (
                    <div className="rounded-lg bg-kaset-mist p-3" key={signoff.id}>
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusPill tone="warning">{signoff.status}</StatusPill>
                        <Badge tone="neutral">{getArticleReviewerRoleLabel(signoff.role)}</Badge>
                      </div>
                      <p className="mt-2 text-sm font-bold leading-6 text-kaset-deep">{signoff.reviewerNamePlaceholder}</p>
                      <p className="mt-1 text-xs leading-5 text-slate-600">{signoff.noteTh}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="inline-flex items-center gap-2 text-sm font-extrabold text-kaset-ink">
                  <ListChecks aria-hidden="true" className="h-4 w-4 text-kaset-deep" />
                  Source metadata placeholders
                </h3>
                <div className="mt-2 grid gap-2">
                  {state.sourceMetadata.map((source) => (
                    <div className="rounded-lg bg-sky-50 p-3" key={source.id}>
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusPill tone="warning">{source.freshnessStatus}</StatusPill>
                        <Badge tone="sky">{source.sourceType}</Badge>
                        <Badge tone="neutral">{source.sourceConfidence}</Badge>
                      </div>
                      <h4 className="mt-2 font-extrabold text-sky-950">{source.sourceTitle}</h4>
                      <p className="mt-1 text-xs font-bold text-sky-900">{source.sourceOwnerOrganization} · {source.reviewedDate}</p>
                      <p className="mt-1 text-xs leading-5 text-slate-600">{source.fieldApplicabilityNoteTh}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="inline-flex items-center gap-2 text-sm font-extrabold text-kaset-ink">
                  <FileImage aria-hidden="true" className="h-4 w-4 text-kaset-deep" />
                  Image review checklist
                </h3>
                <div className="mt-2 grid gap-2">
                  {state.imageReviews.map((image) => (
                    <div className="rounded-lg bg-kaset-mist p-3 text-sm leading-6 text-slate-700" key={image.id}>
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusPill tone="warning">{image.status}</StatusPill>
                        <Badge tone="neutral">{image.assetKind}</Badge>
                        <Badge tone="sky">{image.aspectRatio}</Badge>
                        <Badge tone="neutral">max {image.maxSizeKbTarget}KB</Badge>
                      </div>
                      <p className="mt-2 break-all text-xs font-bold text-slate-600">{image.plannedPath}</p>
                      <p className="mt-1 text-xs leading-5 text-slate-600">{image.altTextTh}</p>
                      <p className="mt-1 text-xs leading-5 text-amber-900">{image.promptNoteTh}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="inline-flex items-center gap-2 text-sm font-extrabold text-kaset-ink">
                  <ShieldAlert aria-hidden="true" className="h-4 w-4 text-kaset-deep" />
                  Final publish blockers
                </h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {state.blockers.map((blocker) => (
                    <Badge key={blocker} tone="rose">
                      {getArticleFinalPublishBlockerLabel(blocker)}
                    </Badge>
                  ))}
                </div>
              </section>
            </div>
          </Card>
        ))}

        <div className="grid gap-3">
          <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-kaset-deep px-4 text-sm font-extrabold text-white" to="/app/articles/pilot-draft-review">
            เปิด M68 pilot draft workflow
          </Link>
          <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10" to="/app/articles/offline-qa">
            กลับไป offline article QA
          </Link>
        </div>
      </div>
    </div>
  );
}
