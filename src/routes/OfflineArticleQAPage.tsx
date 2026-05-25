import { BookOpenCheck, FileImage, Layers3, ShieldCheck, WifiOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { StatusPill } from '@/components/ui/StatusPill';
import { getOfflineAgriArticleCategoryCounts } from '@/services/content/offline-agri-article-service';
import { offlineAgriArticleCmsOverrideRules, runOfflineAgriArticleQa } from '@/services/content/offline-agri-article-qa';

const statusTone = {
  pass: 'success',
  warn: 'warning',
  fail: 'danger',
} as const;

export function OfflineArticleQAPage() {
  const qa = runOfflineAgriArticleQa();
  const categoryCounts = getOfflineAgriArticleCategoryCounts();

  return (
    <div>
      <PageHeader title="QA คลังความรู้เกษตรออฟไลน์" subtitle="ตรวจบทความ bundled, คำเตือน, image metadata และกติกา CMS override ก่อนเพิ่มบทความเต็ม" showBack />
      <div className="grid gap-5 px-5 pb-6">
        <Card className="overflow-hidden bg-kaset-deep text-white">
          <div className="relative p-5">
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10" />
            <div className="relative flex gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-white text-kaset-deep">
                <ShieldCheck aria-hidden="true" className="h-7 w-7" />
              </span>
              <div className="min-w-0">
                <StatusPill className="bg-white/15 text-white ring-white/20" tone={qa.failCount > 0 ? 'danger' : 'success'}>
                  {qa.failCount > 0 ? 'needs fix' : 'minimum QA pass'}
                </StatusPill>
                <h2 className="mt-3 text-2xl font-extrabold leading-8">ตรวจให้ปลอดภัยก่อนต่อ CMS</h2>
                <p className="mt-2 text-sm leading-6 text-emerald-50/90">
                  M66 ตรวจว่า CMS ในอนาคตเพิ่มเนื้อหาได้ แต่ห้ามลบคำเตือน ห้ามเปลี่ยนผล fallback และห้ามดึงรูปภายนอกในโหมดออฟไลน์
                </p>
              </div>
            </div>
          </div>
        </Card>

        <NoticeBox tone="success" icon={WifiOff} title="offline-safe / no network">
          หน้านี้อ่านจาก fixture ในแอปเท่านั้น ยังไม่เชื่อม Supabase CMS ไม่โหลดรูปภายนอก และไม่เขียนข้อมูลขึ้น backend
        </NoticeBox>

        <Link to="/app/articles/full-content-readiness">
          <Card className="border-amber-200 bg-amber-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h2 className="font-extrabold text-amber-950">M67 full-content readiness</h2>
                <p className="mt-1 text-sm leading-6 text-amber-900">
                  ตรวจ pilot templates, source placeholders, publish gate, image needs และ expert escalation ก่อนเขียนบทความเต็มจริง
                </p>
              </div>
              <StatusPill tone="warning">draft only</StatusPill>
            </div>
          </Card>
        </Link>

        <Link to="/app/articles/pilot-draft-review">
          <Card className="border-kaset-leaf/30 bg-kaset-mint p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h2 className="font-extrabold text-kaset-ink">M68 pilot article draft</h2>
                <p className="mt-1 text-sm leading-6 text-slate-700">
                  ดู workflow ร่างบทความดิน 6 ชนิด พร้อม checklist และ publish blockers
                </p>
              </div>
              <StatusPill tone="warning">review needed</StatusPill>
            </div>
          </Card>
        </Link>

        <Link to="/app/articles/editorial-review">
          <Card className="border-amber-200 bg-amber-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h2 className="font-extrabold text-amber-950">M69 editorial review</h2>
                <p className="mt-1 text-sm leading-6 text-amber-900">
                  ตรวจ reviewer sign-off, source metadata, image review และ second low-risk pilot draft
                </p>
              </div>
              <StatusPill tone="warning">blocked</StatusPill>
            </div>
          </Card>
        </Link>

        <Link to="/app/articles/cms-persistence-plan">
          <Card className="border-sky-200 bg-sky-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h2 className="font-extrabold text-sky-950">M72 CMS persistence plan</h2>
                <p className="mt-1 text-sm leading-6 text-sky-900">
                  ตรวจ role rules, future tables, release audit write plan, offline fallback และ migration rollback checklist
                </p>
              </div>
              <StatusPill tone="warning">no DB write</StatusPill>
            </div>
          </Card>
        </Link>

        <section className="grid grid-cols-2 gap-3">
          <Card className="p-4">
            <BookOpenCheck aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <p className="mt-3 text-3xl font-extrabold text-kaset-ink">{qa.totalArticles}</p>
            <p className="mt-1 text-xs font-bold leading-5 text-slate-500">บทความออฟไลน์</p>
          </Card>
          <Card className="p-4">
            <Layers3 aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <p className="mt-3 text-3xl font-extrabold text-kaset-ink">{qa.categoryCount}</p>
            <p className="mt-1 text-xs font-bold leading-5 text-slate-500">หมวดความรู้</p>
          </Card>
          <Card className="p-4">
            <ShieldCheck aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <p className="mt-3 text-3xl font-extrabold text-kaset-ink">{qa.averageScore}%</p>
            <p className="mt-1 text-xs font-bold leading-5 text-slate-500">คะแนน QA เฉลี่ย</p>
          </Card>
          <Card className="p-4">
            <FileImage aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <p className="mt-3 text-3xl font-extrabold text-kaset-ink">{qa.imageWarnings.length}</p>
            <p className="mt-1 text-xs font-bold leading-5 text-slate-500">รูปที่ยังเป็นแผน</p>
          </Card>
        </section>

        <Card className="p-4">
          <h2 className="font-extrabold text-kaset-ink">สรุปสถานะ</h2>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-lg bg-kaset-mint p-3">
              <p className="text-xl font-extrabold text-kaset-deep">{qa.passCount}</p>
              <p className="text-[11px] font-bold text-slate-600">pass</p>
            </div>
            <div className="rounded-lg bg-amber-50 p-3">
              <p className="text-xl font-extrabold text-amber-900">{qa.warnCount}</p>
              <p className="text-[11px] font-bold text-amber-900">warn</p>
            </div>
            <div className="rounded-lg bg-rose-50 p-3">
              <p className="text-xl font-extrabold text-rose-800">{qa.failCount}</p>
              <p className="text-[11px] font-bold text-rose-800">fail</p>
            </div>
          </div>
        </Card>

        <section className="grid gap-3">
          <h2 className="text-lg font-extrabold text-kaset-ink">หมวดบทความ</h2>
          {categoryCounts.map((category) => (
            <Card className="p-4" key={category.key}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-extrabold text-kaset-ink">{category.labelTh}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{category.descriptionTh}</p>
                </div>
                <StatusPill tone="info">{category.count}</StatusPill>
              </div>
            </Card>
          ))}
        </section>

        <section className="grid gap-3">
          <h2 className="text-lg font-extrabold text-kaset-ink">บทความที่ยังต้องทำฉบับเต็ม</h2>
          {qa.articlesNeedingFullContent.slice(0, 8).map((item) => (
            <Link key={item.articleId} to={`/app/articles/offline/${item.slug}`}>
              <Card className="p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusPill tone={statusTone[item.status]}>{item.status}</StatusPill>
                  <Badge tone="neutral">{item.versionInfo.contentStatus}</Badge>
                  <Badge tone="sky">{item.percentage}%</Badge>
                </div>
                <h3 className="mt-3 font-extrabold leading-6 text-kaset-ink">{item.titleTh}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  version {item.versionInfo.versionId} · fallback {item.versionInfo.offlineFallbackPriority}
                </p>
              </Card>
            </Link>
          ))}
        </section>

        <section className="grid gap-3">
          <h2 className="text-lg font-extrabold text-kaset-ink">คำเตือนและรูปภาพ</h2>
          <Card className="p-4">
            <p className="text-sm font-extrabold text-kaset-ink">Disclaimer coverage</p>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs font-bold">
              <div className="rounded-lg bg-kaset-mist p-2">ทั่วไป {qa.disclaimerCoverage.general}</div>
              <div className="rounded-lg bg-amber-50 p-2 text-amber-900">การเงิน {qa.disclaimerCoverage.finance}</div>
              <div className="rounded-lg bg-rose-50 p-2 text-rose-800">ฉลาก {qa.disclaimerCoverage.label}</div>
            </div>
          </Card>
          {qa.imageWarnings.slice(0, 5).map((item) => (
            <Card className="p-4" key={item.articleId}>
              <div className="flex flex-wrap items-center gap-2">
                <StatusPill tone="warning">planned asset</StatusPill>
                <Badge tone="neutral">{item.image.aspectRatio}</Badge>
              </div>
              <h3 className="mt-3 font-extrabold text-kaset-ink">{item.titleTh}</h3>
              <p className="mt-1 break-all text-xs font-bold leading-5 text-kaset-deep">{item.image.plannedPath}</p>
              <p className="mt-1 text-xs leading-5 text-slate-600">{item.warning}</p>
            </Card>
          ))}
        </section>

        <section className="grid gap-3">
          <h2 className="text-lg font-extrabold text-kaset-ink">กติกา CMS override</h2>
          {offlineAgriArticleCmsOverrideRules.map((rule) => (
            <Card className="p-4" key={rule.id}>
              <div className="flex flex-wrap items-center gap-2">
                <StatusPill tone={rule.severity === 'blocker' ? 'danger' : 'warning'}>{rule.severity}</StatusPill>
                <Badge tone="sky">{rule.id}</Badge>
              </div>
              <h3 className="mt-3 font-extrabold text-kaset-ink">{rule.titleTh}</h3>
              <p className="mt-1 text-sm leading-6 text-slate-600">{rule.descriptionTh}</p>
            </Card>
          ))}
        </section>
      </div>
    </div>
  );
}
