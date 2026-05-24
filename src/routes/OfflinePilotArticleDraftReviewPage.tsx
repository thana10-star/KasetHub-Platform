import { BookOpenCheck, FileImage, FileText, ListChecks, ShieldAlert, WifiOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { StatusPill } from '@/components/ui/StatusPill';
import {
  getPilotArticleDraftPublishGate,
  runPilotArticleDraftWorkflowReview,
} from '@/services/content/offline-agri-pilot-article-drafts';

export function OfflinePilotArticleDraftReviewPage() {
  const workflow = runPilotArticleDraftWorkflowReview();
  const draft = workflow.drafts[0];
  const gate = getPilotArticleDraftPublishGate(draft.slug);

  return (
    <div>
      <PageHeader
        title="Pilot draft review"
        subtitle="M68 ร่างบทความนำร่องแบบ local-only ยังไม่ใช่ฉบับตรวจทานสุดท้าย"
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
                  reviewed_draft_candidate
                </StatusPill>
                <h2 className="mt-3 text-2xl font-extrabold leading-8">{draft.titleTh}</h2>
                <p className="mt-2 text-sm leading-6 text-emerald-50/90">
                  {draft.summaryTh}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <NoticeBox tone="success" icon={WifiOff} title="local-only / no network">
          หน้านี้เป็น workflow ตรวจร่างในเครื่องเท่านั้น ไม่มี CMS write ไม่มี Supabase write ไม่มี AI generation และไม่มีรูปจาก CDN ภายนอก
        </NoticeBox>

        <NoticeBox tone="warning" icon={ShieldAlert} title="ยังไม่ใช่บทความฉบับตรวจทานสุดท้าย">
          Publish gate ยังปิดอยู่จนกว่าจะมีแหล่งอ้างอิงจริง reviewer วันที่รีวิว และภาพที่ผ่านการตรวจทาน
        </NoticeBox>

        <section className="grid grid-cols-2 gap-3">
          <Card className="p-4">
            <FileText aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <p className="mt-3 text-3xl font-extrabold text-kaset-ink">{workflow.pilotCount}</p>
            <p className="mt-1 text-xs font-bold leading-5 text-slate-500">pilot draft</p>
          </Card>
          <Card className="p-4">
            <ShieldAlert aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <p className="mt-3 text-3xl font-extrabold text-kaset-ink">{gate?.blockers.length ?? 0}</p>
            <p className="mt-1 text-xs font-bold leading-5 text-slate-500">publish blockers</p>
          </Card>
        </section>

        <Card className="p-4">
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill tone="warning">{draft.status}</StatusPill>
            <Badge tone="sky">{draft.slug}</Badge>
            <Badge tone="neutral">final publish: no</Badge>
          </div>
          <h2 className="mt-3 font-extrabold text-kaset-ink">Pilot article notes</h2>
          <p className="mt-2 text-sm leading-7 text-slate-700">{draft.reasonTh}</p>
          <Link className="mt-4 inline-flex min-h-11 items-center justify-center rounded-full bg-kaset-deep px-4 text-sm font-extrabold text-white" to="/app/articles/offline/soil-types-before-planting">
            เปิด preview บทความ
          </Link>
        </Card>

        <Card className="p-4">
          <h2 className="inline-flex items-center gap-2 font-extrabold text-kaset-ink">
            <ListChecks aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            Review checklist
          </h2>
          <div className="mt-3 grid gap-2">
            {draft.review.reviewChecklistTh.map((item) => (
              <div className="rounded-lg bg-kaset-mist p-3 text-sm font-bold leading-6 text-kaset-deep" key={item}>
                {item}
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="font-extrabold text-kaset-ink">Source placeholders</h2>
          <div className="mt-3 grid gap-2">
            {draft.review.sourcePlaceholders.map((source) => (
              <div className="rounded-lg bg-kaset-mist p-3" key={source.id}>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusPill tone="warning">{source.status}</StatusPill>
                  <Badge tone="neutral">{source.required ? 'required' : 'optional'}</Badge>
                </div>
                <h3 className="mt-2 font-extrabold text-kaset-ink">{source.labelTh}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">{source.noteTh}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="font-extrabold text-kaset-ink">Safety checklist</h2>
          <div className="mt-3 grid gap-2">
            {draft.review.safetyDisclaimersTh.map((disclaimer) => (
              <div className="rounded-lg bg-amber-50 p-3 text-sm font-bold leading-6 text-amber-900" key={disclaimer}>
                {disclaimer}
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="inline-flex items-center gap-2 font-extrabold text-kaset-ink">
            <FileImage aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            Image requirements
          </h2>
          <div className="mt-3 grid gap-2">
            {draft.review.imageRequirements.map((image) => (
              <div className="rounded-lg bg-kaset-mist p-3 text-sm leading-6 text-slate-700" key={image.id}>
                <span className="font-extrabold text-kaset-deep">{image.labelTh}</span> · {image.aspectRatio} · {image.status}
                <p className="mt-1 break-all text-xs font-bold text-slate-600">{image.plannedPath}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="font-extrabold text-kaset-ink">Publish blockers</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {(gate?.blockers ?? draft.review.publishBlockers).map((blocker) => (
              <Badge key={blocker} tone="rose">
                {blocker}
              </Badge>
            ))}
          </div>
        </Card>

        <div className="grid gap-3">
          <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10" to="/app/articles/full-content-readiness">
            กลับไป full-content readiness
          </Link>
          <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10" to="/app/articles/offline-qa">
            เปิด offline article QA
          </Link>
        </div>
      </div>
    </div>
  );
}
