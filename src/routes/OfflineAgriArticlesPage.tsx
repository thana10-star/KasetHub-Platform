import { BookOpenCheck, FileText, Search, ShieldCheck, SlidersHorizontal } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArticleCard } from '@/components/kaset/ArticleCard';
import { VisualPlaceholder } from '@/components/kaset/VisualPlaceholder';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { StatusPill } from '@/components/ui/StatusPill';
import { cx } from '@/components/ui/classNames';
import type {
  OfflineAgriArticleCategory,
  OfflineAgriArticleDifficulty,
} from '@/services/content/offline-agri-article.types';
import {
  filterOfflineAgriArticles,
  getOfflineAgriArticleReadinessSummary,
  offlineAgriArticleToArticle,
} from '@/services/content/offline-agri-article-service';
import {
  offlineAgriArticleCategories,
  offlineAgriArticleDifficultyLabels,
} from '@/services/content/offline-agri-article-taxonomy';

type CategoryFilter = OfflineAgriArticleCategory | 'all';
type DifficultyFilter = OfflineAgriArticleDifficulty | 'all';

const difficultyFilters: DifficultyFilter[] = ['all', 'basic', 'intermediate', 'advanced'];

export function OfflineAgriArticlesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>('all');
  const readiness = getOfflineAgriArticleReadinessSummary();

  const filteredArticles = useMemo(
    () =>
      filterOfflineAgriArticles({
        category: categoryFilter,
        difficulty: difficultyFilter,
        searchQuery,
      }),
    [categoryFilter, difficultyFilter, searchQuery],
  );

  return (
    <div>
      <PageHeader
        title="คลังความรู้เกษตรออฟไลน์"
        subtitle="บทความแกนหลักที่ฝังอยู่ในแอป อ่านได้โดยไม่ต้องพึ่ง CMS หรือเน็ตเวิร์ก"
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
                <StatusPill className="bg-white/15 text-white ring-white/20" tone="success">
                  offline first
                </StatusPill>
                <h2 className="mt-3 text-2xl font-extrabold leading-8">ความรู้พื้นฐานพร้อมอ่านในเครื่อง</h2>
                <p className="mt-2 text-sm leading-6 text-emerald-50/90">
                  M65 เป็น article framework แบบ hybrid: บทความแกนหลัก bundled offline และพร้อมต่อกับ Supabase CMS ในอนาคต
                </p>
              </div>
            </div>
          </div>
        </Card>

        <NoticeBox tone="warning" icon={ShieldCheck} title="ข้อมูลนี้เป็นความรู้เบื้องต้น">
          ควรตรวจสอบกับหน่วยงานเกษตร/ผู้เชี่ยวชาญในพื้นที่ โดยเฉพาะหัวข้อปุ๋ย สารเคมี สินเชื่อ หรือโครงการรัฐ
        </NoticeBox>

        <Link to="/app/articles/offline-qa">
          <Card className="border-sky-200 bg-sky-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h2 className="font-extrabold text-sky-950">QA คลังบทความออฟไลน์</h2>
                <p className="mt-1 text-sm leading-6 text-sky-900">ตรวจคำเตือน เวอร์ชัน รูปภาพ และกติกา CMS override ก่อนเพิ่มบทความเต็ม</p>
              </div>
              <StatusPill tone="info">M66</StatusPill>
            </div>
          </Card>
        </Link>

        <Link to="/app/articles/full-content-readiness">
          <Card className="border-amber-200 bg-amber-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h2 className="font-extrabold text-amber-950">M67 เตรียมบทความเต็ม</h2>
                <p className="mt-1 text-sm leading-6 text-amber-900">
                  ดู pilot templates, source placeholders, publish blockers และ expert escalation ก่อนเขียนฉบับเต็มจริง
                </p>
              </div>
              <StatusPill tone="warning">not official</StatusPill>
            </div>
          </Card>
        </Link>

        <section className="grid grid-cols-2 gap-3">
          <Card className="p-4">
            <FileText aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <p className="mt-3 text-3xl font-extrabold text-kaset-ink">{readiness.total}</p>
            <p className="mt-1 text-xs font-bold leading-5 text-slate-500">หัวข้อทั้งหมด</p>
          </Card>
          <Card className="p-4">
            <BookOpenCheck aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <p className="mt-3 text-3xl font-extrabold text-kaset-ink">{readiness.offlineAvailable}</p>
            <p className="mt-1 text-xs font-bold leading-5 text-slate-500">อ่านแบบ offline</p>
          </Card>
        </section>

        <Card className="grid gap-4 p-4">
          <label className="grid gap-2" htmlFor="offline-article-search">
            <span className="text-sm font-extrabold text-kaset-ink">ค้นหาหัวข้อ</span>
            <span className="flex min-h-12 items-center gap-2 rounded-full bg-slate-50 px-4 ring-1 ring-kaset-deep/10">
              <Search aria-hidden="true" className="h-5 w-5 shrink-0 text-kaset-deep" />
              <input
                className="min-w-0 flex-1 bg-transparent text-sm font-medium text-kaset-ink outline-none placeholder:text-slate-400"
                id="offline-article-search"
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="ค้นหา ดิน น้ำ ปุ๋ย ข้าว ต้นทุน"
                type="search"
                value={searchQuery}
              />
            </span>
          </label>

          <div className="grid gap-3">
            <div className="flex items-center gap-2 text-sm font-extrabold text-kaset-ink">
              <SlidersHorizontal aria-hidden="true" className="h-4 w-4 text-kaset-deep" />
              หมวดความรู้
            </div>
            <div className="-mx-4 overflow-x-auto px-4">
              <div className="flex min-w-max gap-2">
                <button
                  className={cx(
                    'min-h-10 rounded-full px-4 text-sm font-extrabold shadow-soft ring-1 ring-kaset-deep/8',
                    categoryFilter === 'all' ? 'bg-kaset-deep text-white' : 'bg-white text-kaset-deep',
                  )}
                  onClick={() => setCategoryFilter('all')}
                  type="button"
                >
                  ทั้งหมด
                </button>
                {offlineAgriArticleCategories.map((category) => (
                  <button
                    className={cx(
                      'min-h-10 rounded-full px-4 text-sm font-extrabold shadow-soft ring-1 ring-kaset-deep/8',
                      categoryFilter === category.key ? 'bg-kaset-deep text-white' : 'bg-white text-kaset-deep',
                    )}
                    key={category.key}
                    onClick={() => setCategoryFilter(category.key)}
                    type="button"
                  >
                    {category.labelTh}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-3">
            <p className="text-sm font-extrabold text-kaset-ink">ระดับเนื้อหา</p>
            <div className="grid grid-cols-2 gap-2">
              {difficultyFilters.map((difficulty) => (
                <button
                  className={cx(
                    'min-h-10 rounded-full px-3 text-sm font-extrabold shadow-soft ring-1 ring-kaset-deep/8',
                    difficultyFilter === difficulty ? 'bg-kaset-deep text-white' : 'bg-white text-kaset-deep',
                  )}
                  key={difficulty}
                  onClick={() => setDifficultyFilter(difficulty)}
                  type="button"
                >
                  {difficulty === 'all' ? 'ทั้งหมด' : offlineAgriArticleDifficultyLabels[difficulty]}
                </button>
              ))}
            </div>
          </div>
        </Card>

        <section className="grid gap-4">
          {filteredArticles.map((article) => {
            const category = offlineAgriArticleCategories.find((item) => item.key === article.category) ?? offlineAgriArticleCategories[0];

            return (
              <div className="grid gap-2" key={article.id}>
                <div className="flex flex-wrap gap-2">
                  <Badge tone="sky">{category.labelTh}</Badge>
                  <Badge tone="neutral">{offlineAgriArticleDifficultyLabels[article.difficulty]}</Badge>
                  <StatusPill tone="success">offline available</StatusPill>
                </div>
                <ArticleCard article={offlineAgriArticleToArticle(article)} detailHref={`/app/articles/offline/${article.slug}`} />
                <Card className="p-3">
                  <div className="grid grid-cols-[88px_1fr] gap-3">
                    <VisualPlaceholder className="min-h-[86px]" label={category.labelTh} tone={category.imageTone} />
                    <div className="min-w-0">
                      <p className="text-xs font-bold leading-5 text-slate-500">planned cover asset</p>
                      <p className="mt-1 break-all text-xs font-extrabold leading-5 text-kaset-deep">{article.coverImage.plannedPath}</p>
                      <p className="mt-1 text-xs leading-5 text-slate-600">{article.coverImage.altTextTh}</p>
                    </div>
                  </div>
                </Card>
              </div>
            );
          })}
        </section>

        {filteredArticles.length === 0 ? (
          <Card className="p-5 text-center">
            <h2 className="text-lg font-extrabold text-kaset-ink">ไม่พบบทความออฟไลน์ที่ตรงกับตัวกรอง</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">ลองล้างคำค้นหรือเลือกหมวดทั้งหมดอีกครั้ง</p>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
