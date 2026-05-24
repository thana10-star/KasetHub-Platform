import { ArrowRight, Bookmark, BookOpenCheck, Calculator, Check, Clock, FileImage, FileText, ListChecks, ShieldAlert } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { ShareButton } from '@/components/kaset/ShareButton';
import { VisualPlaceholder } from '@/components/kaset/VisualPlaceholder';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { StatusPill } from '@/components/ui/StatusPill';
import { useSavedArticles } from '@/hooks/useSavedArticles';
import {
  findOfflineAgriArticleBySlug,
  offlineAgriArticleToArticle,
} from '@/services/content/offline-agri-article-service';
import { getOfflineAgriArticleQaBySlug } from '@/services/content/offline-agri-article-qa';
import { getFullArticleReadinessForArticleSlug } from '@/services/content/offline-agri-full-article-readiness';
import { findOfflineAgriFullArticleTemplateForArticleSlug } from '@/services/content/offline-agri-full-article-template';
import {
  findOfflineAgriPilotArticleDraftBySlug,
  getPilotArticleDraftPublishGate,
} from '@/services/content/offline-agri-pilot-article-drafts';
import {
  getOfflineAgriArticleCategoryMeta,
  offlineAgriArticleDifficultyLabels,
} from '@/services/content/offline-agri-article-taxonomy';

export function OfflineAgriArticleDetailPage() {
  const { slug = '' } = useParams();
  const article = findOfflineAgriArticleBySlug(slug);
  const { isSaved, save, toggle } = useSavedArticles();

  if (!article) {
    return (
      <div>
        <PageHeader title="ไม่พบบทความออฟไลน์" subtitle="ลิงก์นี้ยังไม่มีในคลังความรู้ออฟไลน์" showBack />
        <div className="px-5 pb-6">
          <Card className="p-5 text-center">
            <FileText aria-hidden="true" className="mx-auto h-10 w-10 text-kaset-deep" />
            <h2 className="mt-3 text-lg font-extrabold text-kaset-ink">ยังไม่มีหัวข้อนี้</h2>
            <Link className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-kaset-deep px-5 text-sm font-extrabold text-white" to="/app/articles/offline">
              กลับไปคลังออฟไลน์
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  const category = getOfflineAgriArticleCategoryMeta(article.category);
  const articleSummary = offlineAgriArticleToArticle(article);
  const saved = isSaved(article.id);
  const articleQa = getOfflineAgriArticleQaBySlug(article.slug);
  const fullArticleGate = getFullArticleReadinessForArticleSlug(article.slug);
  const fullArticleTemplate = findOfflineAgriFullArticleTemplateForArticleSlug(article.slug);
  const pilotDraft = findOfflineAgriPilotArticleDraftBySlug(article.slug);
  const pilotDraftGate = getPilotArticleDraftPublishGate(article.slug);
  const displayTitle = pilotDraft?.titleTh ?? article.titleTh;
  const displaySummary = pilotDraft?.summaryTh ?? article.shortSummaryTh;

  return (
    <div>
      <PageHeader title="บทความออฟไลน์" subtitle={category.labelTh} showBack />
      <div className="grid gap-5 px-5 pb-6">
        <VisualPlaceholder className="min-h-[200px]" label={category.labelTh} tone={category.imageTone} />

        <section className="grid gap-3">
          <div className="flex flex-wrap gap-2">
            <Badge tone="sky">{category.labelTh}</Badge>
            <Badge tone="neutral">{offlineAgriArticleDifficultyLabels[article.difficulty]}</Badge>
            <StatusPill tone="success">offline available</StatusPill>
            <StatusPill tone={article.bodyReadiness === 'starter_content' ? 'success' : 'warning'}>
              {article.bodyReadiness}
            </StatusPill>
            {articleQa ? (
              <>
                <StatusPill tone={articleQa.status === 'fail' ? 'danger' : articleQa.status === 'warn' ? 'warning' : 'success'}>
                  QA {articleQa.status}
                </StatusPill>
                <StatusPill tone="info">{articleQa.versionInfo.contentStatus}</StatusPill>
              </>
            ) : null}
          </div>
          <h1 className="text-2xl font-extrabold leading-8 text-kaset-ink">{displayTitle}</h1>
          <p className="text-base leading-7 text-slate-700">{displaySummary}</p>
          <div className="flex flex-wrap gap-3 text-xs font-bold text-slate-500">
            <span>KasetHub Offline Library</span>
            <span className="inline-flex items-center gap-1">
              <Clock aria-hidden="true" className="h-3.5 w-3.5" />
              อ่าน {article.estimatedReadingMinutes} นาที
            </span>
            <span>{article.updatedAt}</span>
          </div>
        </section>

        <div className="grid grid-cols-2 gap-2">
          <Button className="min-h-11 px-3 text-sm" onClick={() => toggle(articleSummary)} variant={saved ? 'soft' : 'secondary'}>
            {saved ? <Check aria-hidden="true" className="h-4 w-4" /> : <Bookmark aria-hidden="true" className="h-4 w-4" />}
            {saved ? 'บันทึกแล้ว' : 'บันทึกไว้อ่าน'}
          </Button>
          <Button className="min-h-11 px-3 text-sm" onClick={() => save(articleSummary)} variant="soft">
            <BookOpenCheck aria-hidden="true" className="h-4 w-4" />
            เก็บออฟไลน์
          </Button>
        </div>

        <ShareButton
          label="แชร์บทความ"
          payload={{
            title: article.titleTh,
            description: `${article.shortSummaryTh}\nข้อมูลนี้เป็นความรู้เบื้องต้นจาก KasetHub`,
            url: `/app/articles/offline/${article.slug}`,
          }}
        />

        <NoticeBox tone="warning" icon={ShieldAlert} title="ข้อมูลนี้เป็นความรู้เบื้องต้น">
          ควรตรวจสอบกับหน่วยงานเกษตร/ผู้เชี่ยวชาญในพื้นที่
        </NoticeBox>

        {articleQa ? (
          <Card className="border-sky-200 bg-sky-50 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <StatusPill tone="info">version</StatusPill>
              <Badge tone="sky">{articleQa.versionInfo.contentStatus}</Badge>
              <Badge tone="neutral">{articleQa.percentage}% QA</Badge>
            </div>
            <p className="mt-3 break-all text-xs font-bold leading-5 text-sky-950">{articleQa.versionInfo.versionId}</p>
            <p className="mt-2 text-sm leading-6 text-sky-900">
              บทความนี้ยังเป็น offline fallback ที่ต้องคงอยู่ แม้ CMS ในอนาคตจะเพิ่มเนื้อหาเต็มแล้วก็ตาม
            </p>
            <p className="mt-2 text-sm leading-6 text-sky-900">
              Content readiness: {articleQa.needsFullContent ? 'ยังต้องทำฉบับเต็ม/รีวิวเพิ่ม' : 'พร้อมสำหรับเผยแพร่เต็มในอนาคต'}
            </p>
          </Card>
        ) : null}

        {fullArticleGate && fullArticleTemplate ? (
          <Card className="border-amber-200 bg-amber-50 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <StatusPill tone="warning">M67 draft_template</StatusPill>
              <Badge tone="neutral">{fullArticleTemplate.pilotSlug}</Badge>
              <Badge tone="rose">{fullArticleGate.blockers.length} blockers</Badge>
            </div>
            <h2 className="mt-3 font-extrabold text-amber-950">Full-content draft readiness</h2>
            <p className="mt-2 text-sm leading-6 text-amber-900">
              หัวข้อนี้มีแม่แบบบทความเต็มแล้ว แต่ยังไม่ใช่บทความทางการเต็มรูปแบบ ต้องเติมแหล่งอ้างอิง reviewer วันที่รีวิว ภาพที่ตรวจแล้ว และ expert escalation ก่อนเผยแพร่
            </p>
            <div className="mt-3 grid gap-2 text-xs font-bold leading-5 text-amber-900">
              <p>source placeholders: {fullArticleGate.filledSourceCount}/{fullArticleGate.sourcePlaceholderCount}</p>
              <p>last reviewed date: {fullArticleTemplate.lastReviewedDatePlaceholder}</p>
              <p>image needs: {fullArticleGate.imageRequirementCount} planned assets</p>
              {fullArticleTemplate.expertEscalationNotes.length > 0 ? (
                <p>expert escalation: {fullArticleTemplate.expertEscalationNotes.map((note) => note.riskType).join(', ')}</p>
              ) : null}
            </div>
            <Link className="mt-4 inline-flex min-h-11 items-center justify-center rounded-full bg-amber-900 px-4 text-sm font-extrabold text-white" to="/app/articles/full-content-readiness">
              เปิด publish gate M67
            </Link>
          </Card>
        ) : null}

        {pilotDraft && pilotDraftGate ? (
          <section className="grid gap-4">
            <Card className="border-kaset-leaf/30 bg-kaset-mint p-4">
              <div className="flex flex-wrap items-center gap-2">
                <StatusPill tone="warning">review-needed</StatusPill>
                <Badge tone="sky">M68 pilot draft</Badge>
                <Badge tone="neutral">{pilotDraft.status}</Badge>
              </div>
              <h2 className="mt-3 text-lg font-extrabold text-kaset-ink">ยังไม่ใช่บทความฉบับตรวจทานสุดท้าย</h2>
              <p className="mt-2 text-sm leading-7 text-slate-700">{pilotDraft.reasonTh}</p>
              <p className="mt-2 text-xs font-bold leading-5 text-amber-900">
                publish blocked: {pilotDraftGate.blockers.slice(0, 4).join(', ')}
              </p>
            </Card>

            {pilotDraft.sections.map((section) => (
              <Card className="p-5" key={section.id}>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusPill tone="info">{section.kind}</StatusPill>
                  {section.relatedRoute ? <Badge tone="sky">มีเครื่องมือเกี่ยวข้อง</Badge> : null}
                </div>
                <h2 className="mt-3 text-lg font-extrabold text-kaset-ink">{section.headingTh}</h2>
                <div className="mt-3 grid gap-3">
                  {section.bodyTh.map((paragraph) => (
                    <p className="text-sm leading-7 text-slate-700" key={paragraph}>
                      {paragraph}
                    </p>
                  ))}
                </div>
                {section.kind === 'comparison_table' ? (
                  <div className="mt-4 grid gap-3">
                    {pilotDraft.comparisonRows.map((row) => (
                      <div className="rounded-lg bg-kaset-mist p-3" key={row.soilTypeTh}>
                        <h3 className="font-extrabold text-kaset-ink">{row.soilTypeTh}</h3>
                        <div className="mt-2 grid gap-2 text-xs leading-5 text-slate-700">
                          <p><span className="font-extrabold text-kaset-deep">สังเกต:</span> {row.easyObservationTh}</p>
                          <p><span className="font-extrabold text-kaset-deep">น้ำ:</span> {row.waterBehaviorTh}</p>
                          <p><span className="font-extrabold text-kaset-deep">ตัวอย่างกว้าง ๆ:</span> {row.broadUseCaseTh}</p>
                          <p><span className="font-extrabold text-kaset-deep">แนวคิดปรับปรุง:</span> {row.cautiousImprovementIdeaTh}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
                {section.bulletsTh ? (
                  <div className="mt-4 grid gap-2">
                    {section.bulletsTh.map((bullet) => (
                      <div className="flex items-center gap-2 rounded-lg bg-kaset-mint px-3 py-2 text-sm font-bold text-kaset-deep" key={bullet}>
                        <Check aria-hidden="true" className="h-4 w-4 shrink-0" />
                        {bullet}
                      </div>
                    ))}
                  </div>
                ) : null}
                {section.relatedRoute ? (
                  <Link className="mt-4 inline-flex min-h-11 items-center justify-center rounded-full bg-kaset-deep px-4 text-sm font-extrabold text-white" to={section.relatedRoute}>
                    เปิดหน้าที่เกี่ยวข้อง
                  </Link>
                ) : null}
              </Card>
            ))}

            <Card className="p-4">
              <h2 className="inline-flex items-center gap-2 font-extrabold text-kaset-ink">
                <ListChecks aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
                Source / review placeholders
              </h2>
              <div className="mt-3 grid gap-2">
                {pilotDraft.review.sourcePlaceholders.map((source) => (
                  <div className="rounded-lg bg-kaset-mist p-3 text-sm leading-6 text-slate-700" key={source.id}>
                    <span className="font-extrabold text-kaset-deep">{source.labelTh}</span> · {source.status}
                    <p className="mt-1 text-xs leading-5 text-slate-600">{source.noteTh}</p>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs font-bold text-amber-900">
                reviewer: {pilotDraft.review.reviewerPlaceholder} · last reviewed: {pilotDraft.review.lastReviewedPlaceholder}
              </p>
            </Card>

            <Card className="p-4">
              <h2 className="inline-flex items-center gap-2 font-extrabold text-kaset-ink">
                <FileImage aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
                Image needs
              </h2>
              <div className="mt-3 grid gap-2">
                {pilotDraft.review.imageRequirements.map((image) => (
                  <div className="rounded-lg bg-kaset-mist p-3 text-sm leading-6 text-slate-700" key={image.id}>
                    <span className="font-extrabold text-kaset-deep">{image.labelTh}</span> · {image.aspectRatio} · {image.status}
                    <p className="mt-1 break-all text-xs font-bold text-slate-600">{image.plannedPath}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-600">{image.altTextTh}</p>
                  </div>
                ))}
              </div>
            </Card>
          </section>
        ) : null}

        <Card className="p-4">
          <h2 className="font-extrabold text-kaset-ink">แผนภาพประกอบ</h2>
          <div className="mt-3 rounded-lg bg-kaset-mist p-3">
            <p className="text-xs font-bold text-slate-500">cover image planned path</p>
            <p className="mt-1 break-all text-sm font-extrabold leading-6 text-kaset-deep">{article.coverImage.plannedPath}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{article.coverImage.altTextTh}</p>
            <p className="mt-2 text-xs font-bold leading-5 text-amber-900">{article.coverImage.offlineSizeWarning}</p>
          </div>
        </Card>

        <section className="grid gap-4">
          {article.sections.map((section) => (
            <Card className="p-5" key={section.id}>
              <h2 className="text-lg font-extrabold text-kaset-ink">{section.headingTh}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-700">{section.starterSnippetTh}</p>
              <div className="mt-4 grid gap-2">
                {section.outlineBulletsTh.map((bullet) => (
                  <div className="flex items-center gap-2 rounded-lg bg-kaset-mint px-3 py-2 text-sm font-bold text-kaset-deep" key={bullet}>
                    <Check aria-hidden="true" className="h-4 w-4 shrink-0" />
                    {bullet}
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </section>

        <section className="grid gap-3">
          {article.safetyNotes.map((note) => (
            <NoticeBox key={note.id} tone={note.type === 'general' ? 'warning' : 'danger'} icon={ShieldAlert} title="คำเตือนสำคัญ">
              {note.textTh}
            </NoticeBox>
          ))}
        </section>

        <Card className="p-4">
          <h2 className="font-extrabold text-kaset-ink">CMS compatibility</h2>
          <p className="mt-2 break-all rounded-lg bg-kaset-mist p-3 text-xs font-bold leading-5 text-kaset-deep">
            futureCmsKey: {article.cmsCompatibility.futureCmsKey}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            บทความนี้เป็น offline fallback ได้ในอนาคต ถ้า CMS online ยังไม่พร้อมหรือโหลดไม่สำเร็จ
          </p>
        </Card>

        <div className="grid gap-3">
          {article.relatedCalculatorRoute ? (
            <Link className="flex min-h-12 items-center justify-between gap-3 rounded-full bg-kaset-deep px-4 text-sm font-extrabold text-white" to={article.relatedCalculatorRoute}>
              <span className="inline-flex items-center gap-2">
                <Calculator aria-hidden="true" className="h-5 w-5" />
                เปิดเครื่องคำนวณที่เกี่ยวข้อง
              </span>
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          ) : null}
          {article.relatedAppRoute ? (
            <Link className="flex min-h-12 items-center justify-between gap-3 rounded-full bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10" to={article.relatedAppRoute}>
              เปิดหน้าที่เกี่ยวข้อง
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          ) : null}
          <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10" to="/app/articles/offline">
            คลังความรู้ออฟไลน์ทั้งหมด
          </Link>
        </div>
      </div>
    </div>
  );
}
