import { ArrowRight, Bookmark, BookOpenCheck, Check, Clock, FileText, ShieldAlert, Video } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { ArticleCard } from '@/components/kaset/ArticleCard';
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
  contentToArticle,
  createOfflineArticleCachePreview,
  findArticleContent,
  getRelatedArticles,
  getRelatedVideos,
} from '@/services/content/content-fixtures';
import { contentDifficultyLabels } from '@/services/content/content-taxonomy';
import type { ContentStatus } from '@/services/content/content.types';

const contentStatusLabels: Record<ContentStatus, string> = {
  draft: 'ร่าง',
  review: 'รอตรวจ',
  scheduled: 'ตั้งเวลา',
  published: 'เผยแพร่',
  archived: 'เก็บถาวร',
};

export function ArticleDetailPage() {
  const { articleId = '' } = useParams();
  const article = findArticleContent(articleId);
  const { isSaved, save, toggle } = useSavedArticles();

  if (!article) {
    return (
      <div>
        <PageHeader title="ไม่พบบทความ" subtitle="ลิงก์นี้อาจยังไม่มีในคลังความรู้" showBack />
        <div className="px-5 pb-6">
          <Card className="p-5 text-center">
            <FileText aria-hidden="true" className="mx-auto h-10 w-10 text-kaset-deep" />
            <h2 className="mt-3 text-lg font-extrabold text-kaset-ink">ยังไม่มีบทความนี้</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">กลับไปเลือกบทความอื่นจากคลังความรู้ของ KasetHub</p>
            <Link className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-kaset-deep px-5 text-sm font-extrabold text-white" to="/app/articles">
              ดูบทความทั้งหมด
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  const articleSummary = contentToArticle(article);
  const saved = isSaved(article.id);
  const offlineCache = createOfflineArticleCachePreview(article.id);
  const relatedArticles = getRelatedArticles(article);
  const relatedVideos = getRelatedVideos(article);

  return (
    <div>
      <PageHeader title="บทความ" subtitle={article.category} showBack />
      <div className="grid gap-5 px-5 pb-6">
        <VisualPlaceholder className="min-h-[190px]" label={article.legacyCategory} tone={article.imageTone} />

        <section className="grid gap-3">
          <div className="flex flex-wrap gap-2">
            <Badge tone="sky">{article.category}</Badge>
            <Badge tone="neutral">{contentDifficultyLabels[article.difficulty]}</Badge>
            <StatusPill tone={article.status === 'published' ? 'success' : 'warning'}>{contentStatusLabels[article.status]}</StatusPill>
          </div>
          <h1 className="text-2xl font-extrabold leading-8 text-kaset-ink">{article.title}</h1>
          <p className="text-base leading-7 text-slate-700">{article.excerpt}</p>
          <div className="flex flex-wrap gap-3 text-xs font-bold text-slate-500">
            <span>{article.author.displayName}</span>
            <span className="inline-flex items-center gap-1">
              <Clock aria-hidden="true" className="h-3.5 w-3.5" />
              {article.readTime}
            </span>
            <span>{article.publishedAt}</span>
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
            title: article.title,
            description: article.excerpt,
            url: `/app/articles/${article.id}`,
          }}
        />

        <Card className="p-4">
          <h2 className="text-lg font-extrabold text-kaset-ink">ใจความสำคัญ</h2>
          <ul className="mt-3 grid gap-2">
            {article.keyTakeaways.map((takeaway) => (
              <li className="flex gap-2 text-sm leading-6 text-slate-700" key={takeaway}>
                <Check aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-kaset-leaf" />
                <span>{takeaway}</span>
              </li>
            ))}
          </ul>
        </Card>

        <section className="grid gap-4">
          {article.bodySections.map((section) => (
            <Card className="p-5" key={section.heading}>
              <h2 className="text-lg font-extrabold text-kaset-ink">{section.heading}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-700">{section.body}</p>
              {section.checklist ? (
                <div className="mt-4 grid gap-2">
                  {section.checklist.map((item) => (
                    <div className="flex items-center gap-2 rounded-lg bg-kaset-mint px-3 py-2 text-sm font-bold text-kaset-deep" key={item}>
                      <Check aria-hidden="true" className="h-4 w-4 shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              ) : null}
            </Card>
          ))}
        </section>

        {article.safetyNote ? (
          <NoticeBox icon={ShieldAlert} title="หมายเหตุความปลอดภัย" tone="warning">
            {article.safetyNote}
          </NoticeBox>
        ) : null}

        {offlineCache ? (
          <Card className="p-4">
            <div className="flex items-start gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
                <BookOpenCheck aria-hidden="true" className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="font-extrabold text-kaset-ink">อ่านออฟไลน์</h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  พร้อมเก็บเนื้อหาหลักรุ่น {offlineCache.cacheVersion} ขนาดประมาณ {offlineCache.sizeBytesEstimate.toLocaleString()} bytes
                </p>
                {offlineCache.sizeWarning ? <p className="mt-2 text-xs font-bold text-amber-800">{offlineCache.sizeWarning}</p> : null}
              </div>
            </div>
          </Card>
        ) : null}

        {relatedVideos.length > 0 ? (
          <section className="grid gap-3">
            <h2 className="text-xl font-extrabold text-kaset-ink">วิดีโอที่เกี่ยวข้อง</h2>
            <div className="grid gap-3">
              {relatedVideos.map((video) => (
                <Link className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-card ring-1 ring-kaset-deep/5" key={video.videoId} to={`/app/youtube/${video.videoId}`}>
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-sky-100 text-sky-800">
                    <Video aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="line-clamp-2 text-sm font-extrabold leading-5 text-kaset-ink">{video.title}</span>
                    <span className="mt-1 block text-xs font-bold text-slate-500">{video.duration}</span>
                  </span>
                  <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0 text-kaset-deep" />
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        {relatedArticles.length > 0 ? (
          <section className="grid gap-3">
            <h2 className="text-xl font-extrabold text-kaset-ink">อ่านต่อ</h2>
            {relatedArticles.map((relatedArticle) => (
              <ArticleCard article={contentToArticle(relatedArticle)} key={relatedArticle.id} />
            ))}
          </section>
        ) : null}
      </div>
    </div>
  );
}
