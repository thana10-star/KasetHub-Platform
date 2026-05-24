import { AlertTriangle, BookOpenCheck, FileImage, FileText, ShieldCheck, UserCheck, WifiOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { StatusPill } from '@/components/ui/StatusPill';
import { runFullArticlePublishReadiness } from '@/services/content/offline-agri-full-article-readiness';
import { getOfflineAgriArticleCategoryMeta } from '@/services/content/offline-agri-article-taxonomy';

export function OfflineArticleFullContentReadinessPage() {
  const readiness = runFullArticlePublishReadiness();

  return (
    <div>
      <PageHeader
        title="Full-content readiness"
        subtitle="M67 เตรียมแบบร่างบทความเต็ม แต่ยังไม่เผยแพร่เป็นบทความทางการ"
        showBack
      />
      <div className="grid gap-5 px-5 pb-6">
        <Card className="overflow-hidden bg-kaset-deep text-white">
          <div className="relative p-5">
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10" />
            <div className="relative flex gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-white text-kaset-deep">
                <BookOpenCheck aria-hidden="true" className="h-7 w-7" />
              </span>
              <div className="min-w-0">
                <StatusPill className="bg-white/15 text-white ring-white/20" tone="warning">
                  draft templates only
                </StatusPill>
                <h2 className="mt-3 text-2xl font-extrabold leading-8">ยังไม่ใช่บทความทางการเต็มรูปแบบ</h2>
                <p className="mt-2 text-sm leading-6 text-emerald-50/90">
                  M67 สร้างแม่แบบบทความเต็มสำหรับหัวข้อนำร่อง พร้อม source placeholder, review gate, image needs และ expert escalation โดยยังไม่เพิ่มข้อเท็จจริงทางการหรือเนื้อหาเต็มที่ตรวจแล้ว
                </p>
              </div>
            </div>
          </div>
        </Card>

        <NoticeBox tone="success" icon={WifiOff} title="offline-first / no network">
          หน้านี้อ่านจาก fixture ในแอปเท่านั้น ไม่มี Supabase CMS write ไม่มี AI generation ไม่มีรูปจริง และไม่มีการโหลดรูปจาก CDN ภายนอก
        </NoticeBox>

        <Link to="/app/articles/pilot-draft-review">
          <Card className="border-kaset-leaf/30 bg-kaset-mint p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h2 className="font-extrabold text-kaset-ink">M68 pilot draft workflow</h2>
                <p className="mt-1 text-sm leading-6 text-slate-700">
                  ตรวจร่างบทความ ดิน 6 ชนิด รู้จักก่อนปลูก พร้อม source placeholders และ publish blockers
                </p>
              </div>
              <StatusPill tone="warning">draft</StatusPill>
            </div>
          </Card>
        </Link>

        <section className="grid grid-cols-2 gap-3">
          <Card className="p-4">
            <FileText aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <p className="mt-3 text-3xl font-extrabold text-kaset-ink">{readiness.pilotCount}</p>
            <p className="mt-1 text-xs font-bold leading-5 text-slate-500">pilot templates</p>
          </Card>
          <Card className="p-4">
            <ShieldCheck aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <p className="mt-3 text-3xl font-extrabold text-kaset-ink">{readiness.blockedCount}</p>
            <p className="mt-1 text-xs font-bold leading-5 text-slate-500">blocked by gate</p>
          </Card>
        </section>

        <Card className="border-amber-200 bg-amber-50 p-4">
          <div className="flex gap-3">
            <AlertTriangle aria-hidden="true" className="h-6 w-6 shrink-0 text-amber-800" />
            <div className="min-w-0">
              <h2 className="font-extrabold text-amber-950">Publish gate ยังปิดไว้</h2>
              <p className="mt-1 text-sm leading-6 text-amber-900">
                ทุก template ต้องมีแหล่งอ้างอิงจริง reviewer วันที่รีวิว คำเตือนครบ ภาพที่ตรวจแล้ว freshness date สำหรับการเงิน และ expert escalation ก่อนเปลี่ยนสถานะเป็น ready_for_full_publish
              </p>
            </div>
          </div>
        </Card>

        <section className="grid gap-4">
          {readiness.pilotTemplates.map((template) => {
            const gate = readiness.gates.find((item) => item.templateId === template.id)!;
            const category = getOfflineAgriArticleCategoryMeta(template.category);

            return (
              <Card className="p-4" key={template.id}>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusPill tone="warning">{template.draftStatus}</StatusPill>
                  <Badge tone="sky">{category.labelTh}</Badge>
                  <Badge tone="neutral">{template.pilotSlug}</Badge>
                </div>
                <h2 className="mt-3 text-lg font-extrabold leading-7 text-kaset-ink">{template.titleTh}</h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  fallback: {template.offlineFallbackArticleSlug} · publish allowed: {gate.canMarkReadyForFullPublish ? 'yes' : 'no'}
                </p>

                <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs font-bold">
                  <div className="rounded-lg bg-kaset-mist p-2">
                    <p className="text-lg font-extrabold text-kaset-deep">{gate.sourcePlaceholderCount}</p>
                    <p className="text-slate-600">sources</p>
                  </div>
                  <div className="rounded-lg bg-sky-50 p-2 text-sky-900">
                    <p className="text-lg font-extrabold">{gate.imageRequirementCount}</p>
                    <p>images</p>
                  </div>
                  <div className="rounded-lg bg-rose-50 p-2 text-rose-800">
                    <p className="text-lg font-extrabold">{gate.blockers.length}</p>
                    <p>blockers</p>
                  </div>
                </div>

                <div className="mt-4 grid gap-3">
                  <div className="rounded-lg bg-kaset-mist p-3">
                    <p className="inline-flex items-center gap-2 text-sm font-extrabold text-kaset-ink">
                      <FileText aria-hidden="true" className="h-4 w-4 text-kaset-deep" />
                      Source placeholders
                    </p>
                    <div className="mt-2 grid gap-2">
                      {template.sourcePlaceholders.map((source) => (
                        <div className="rounded-lg bg-white p-2 text-xs leading-5 text-slate-700" key={source.id}>
                          <span className="font-extrabold text-kaset-deep">{source.labelTh}</span> · {source.status}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-lg bg-kaset-mist p-3">
                    <p className="inline-flex items-center gap-2 text-sm font-extrabold text-kaset-ink">
                      <UserCheck aria-hidden="true" className="h-4 w-4 text-kaset-deep" />
                      Review metadata
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {template.reviewRequirements.map((review) => (
                        <Badge key={review.id} tone="neutral">
                          {review.reviewerRole}
                        </Badge>
                      ))}
                    </div>
                    <p className="mt-2 text-xs font-bold text-amber-900">last reviewed date: {template.lastReviewedDatePlaceholder}</p>
                  </div>

                  <div className="rounded-lg bg-kaset-mist p-3">
                    <p className="inline-flex items-center gap-2 text-sm font-extrabold text-kaset-ink">
                      <FileImage aria-hidden="true" className="h-4 w-4 text-kaset-deep" />
                      Image needs
                    </p>
                    <div className="mt-2 grid gap-2">
                      {template.imageRequirements.map((image) => (
                        <div className="rounded-lg bg-white p-2 text-xs leading-5 text-slate-700" key={image.id}>
                          <span className="font-extrabold text-kaset-deep">{image.labelTh}</span> · {image.aspectRatio} · max {image.sizeLimitKb}KB
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {gate.blockers.length > 0 ? (
                  <div className="mt-4 rounded-lg bg-rose-50 p-3">
                    <p className="text-sm font-extrabold text-rose-900">Publish blockers</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {gate.blockers.slice(0, 7).map((blocker) => (
                        <Badge key={blocker} tone="rose">
                          {blocker}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className="mt-4 grid gap-2">
                  {template.relatedCalculatorRoutes.map((route) => (
                    <Link className="inline-flex min-h-11 items-center justify-center rounded-full bg-kaset-deep px-4 text-sm font-extrabold text-white" key={route} to={route}>
                      เปิดเครื่องมือที่เกี่ยวข้อง
                    </Link>
                  ))}
                  <Link className="inline-flex min-h-11 items-center justify-center rounded-full bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10" to={`/app/articles/offline/${template.offlineFallbackArticleSlug}`}>
                    เปิด offline fallback
                  </Link>
                </div>
              </Card>
            );
          })}
        </section>
      </div>
    </div>
  );
}
