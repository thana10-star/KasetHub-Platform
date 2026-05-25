import { BookOpenCheck, FileText, Search, ShieldCheck, SlidersHorizontal } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArticleCard } from '@/components/kaset/ArticleCard';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { StatusPill } from '@/components/ui/StatusPill';
import { cx } from '@/components/ui/classNames';
import { articleContents, contentToArticle } from '@/services/content/content-fixtures';
import { contentCategories, contentDifficultyLabels } from '@/services/content/content-taxonomy';
import { getOfflineAgriArticleReadinessSummary } from '@/services/content/offline-agri-article-service';
import type { ContentCategory, ContentDifficulty } from '@/services/content/content.types';

type CategoryFilter = ContentCategory | 'ทั้งหมด';
type DifficultyFilter = ContentDifficulty | 'ทั้งหมด';

const categoryFilters: CategoryFilter[] = ['ทั้งหมด', ...contentCategories];
const difficultyFilters: DifficultyFilter[] = ['ทั้งหมด', 'beginner', 'intermediate', 'advanced'];

export function ArticlesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('ทั้งหมด');
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>('ทั้งหมด');

  const offlineLibrary = getOfflineAgriArticleReadinessSummary();

  const filteredArticles = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return articleContents.filter((article) => {
      const searchableText = [
        article.title,
        article.excerpt,
        article.category,
        article.legacyCategory,
        article.author.displayName,
        ...article.tags.map((tag) => tag.label),
      ]
        .join(' ')
        .toLowerCase();
      const matchesSearch = normalizedQuery ? searchableText.includes(normalizedQuery) : true;
      const matchesCategory = categoryFilter === 'ทั้งหมด' || article.category === categoryFilter;
      const matchesDifficulty = difficultyFilter === 'ทั้งหมด' || article.difficulty === difficultyFilter;

      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [categoryFilter, difficultyFilter, searchQuery]);

  return (
    <div>
      <PageHeader title="บทความและข่าว" subtitle="ความรู้เกษตรไทยในรูปแบบอ่านง่าย" showBack />
      <div className="grid gap-5 px-5 pb-6">
        <NoticeBox title="คลังบทความเกษตร" tone="success">
          เลือกอ่านตามหมวด ค้นหาหัวข้อที่เกี่ยวกับแปลงของคุณ และบันทึกบทความไว้กลับมาอ่านภายหลัง
        </NoticeBox>

        <Link to="/app/articles/offline">
          <Card className="border-kaset-leaf/30 bg-kaset-mint p-4">
            <div className="flex gap-3">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-white text-kaset-deep">
                <BookOpenCheck aria-hidden="true" className="h-6 w-6" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-extrabold text-kaset-ink">คลังความรู้เกษตรออฟไลน์</h2>
                  <StatusPill tone="success">{offlineLibrary.total} หัวข้อ</StatusPill>
                </div>
                <p className="mt-1 text-sm leading-6 text-slate-700">
                  บทความแกนหลักที่ฝังอยู่ในแอป อ่านได้แม้ยังไม่มี CMS หรือเครือข่าย พร้อมโครงสร้างรองรับ Supabase CMS ในอนาคต
                </p>
              </div>
            </div>
          </Card>
        </Link>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-lg bg-sky-100 text-sky-800">
              <FileText aria-hidden="true" className="h-6 w-6" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-extrabold text-kaset-ink">บทความแนะนำ</h2>
              <p className="mt-1 text-sm leading-5 text-slate-600">{articleContents.length} บทความพร้อมคำแนะนำแบบอ่านง่ายและหัวข้อที่เกี่ยวข้อง</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <StatusPill tone="success">{filteredArticles.length} ผลลัพธ์</StatusPill>
            <Link
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-white px-3 text-xs font-extrabold text-kaset-deep shadow-soft ring-1 ring-kaset-deep/10"
              to="/app/content-admin-preview"
            >
              <ShieldCheck aria-hidden="true" className="h-4 w-4" />
              ตัวอย่างผู้ดูแล
            </Link>
          </div>
        </Card>

        <Card className="grid gap-4 p-4">
          <div>
            <label className="text-sm font-extrabold text-kaset-ink" htmlFor="article-search">
              ค้นหาบทความ
            </label>
            <div className="mt-2 flex min-h-12 items-center gap-2 rounded-full bg-slate-50 px-4 ring-1 ring-kaset-deep/10">
              <Search aria-hidden="true" className="h-5 w-5 shrink-0 text-kaset-deep" />
              <input
                className="min-w-0 flex-1 bg-transparent text-sm font-medium text-kaset-ink outline-none placeholder:text-slate-400"
                id="article-search"
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="ค้นหาชื่อบทความ หมวด หรือแท็ก"
                type="search"
                value={searchQuery}
              />
            </div>
          </div>

          <div className="grid gap-3">
            <div className="flex items-center gap-2 text-sm font-extrabold text-kaset-ink">
              <SlidersHorizontal aria-hidden="true" className="h-4 w-4 text-kaset-deep" />
              หมวดเนื้อหา
            </div>
            <div className="-mx-4 overflow-x-auto px-4">
              <div className="flex min-w-max gap-2">
                {categoryFilters.map((category) => (
                  <button
                    className={cx(
                      'min-h-10 rounded-full px-4 text-sm font-extrabold shadow-soft ring-1 ring-kaset-deep/8',
                      categoryFilter === category ? 'bg-kaset-deep text-white' : 'bg-white text-kaset-deep',
                    )}
                    key={category}
                    onClick={() => setCategoryFilter(category)}
                    type="button"
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-3">
            <p className="text-sm font-extrabold text-kaset-ink">ระดับความยาก</p>
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
                  {difficulty === 'ทั้งหมด' ? difficulty : contentDifficultyLabels[difficulty]}
                </button>
              ))}
            </div>
          </div>
        </Card>

        <section className="grid gap-4">
          {filteredArticles.map((article) => (
            <div className="grid gap-2" key={article.id}>
              <div className="flex flex-wrap gap-2">
                <Badge tone="sky">{article.category}</Badge>
                <Badge tone="neutral">{contentDifficultyLabels[article.difficulty]}</Badge>
                {article.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag.id} tone="green">
                    {tag.label}
                  </Badge>
                ))}
              </div>
              <ArticleCard article={contentToArticle(article)} />
            </div>
          ))}
        </section>

        {filteredArticles.length === 0 ? (
          <Card className="p-5 text-center">
            <h2 className="text-lg font-extrabold text-kaset-ink">ไม่พบบทความที่ตรงกับตัวกรอง</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">ลองล้างคำค้นหรือเลือกหมวด “ทั้งหมด” เพื่อดูบทความตัวอย่างอีกครั้ง</p>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
