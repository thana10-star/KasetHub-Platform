import { Newspaper, Search } from 'lucide-react';
import { ArticleCard } from '@/components/kaset/ArticleCard';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { articles } from '@/data/mockData';
import type { ArticleCategory } from '@/types/kaset';

const categories: Array<ArticleCategory | 'ทั้งหมด'> = ['ทั้งหมด', 'ข่าวเกษตร', 'องค์ความรู้', 'เทคโนโลยี', 'ตลาด', 'ชุมชน'];

export function ArticlesPage() {
  return (
    <div>
      <PageHeader title="บทความและข่าว" subtitle="ความรู้เกษตรไทยในรูปแบบอ่านง่าย" showBack />
      <div className="grid gap-5 px-5 pb-6">
        <section className="rounded-lg bg-white p-4 shadow-card ring-1 ring-kaset-deep/5">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-lg bg-sky-100 text-sky-800">
              <Newspaper aria-hidden="true" className="h-6 w-6" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-extrabold text-kaset-ink">คลังความรู้ตัวอย่าง</h2>
              <p className="mt-1 text-sm text-slate-500">บทความสาธิตสำหรับวางโครงข้อมูลจริงในอนาคต</p>
            </div>
            <button
              aria-label="ค้นหาบทความ"
              className="grid h-10 w-10 place-items-center rounded-full bg-kaset-mint text-kaset-deep"
              type="button"
            >
              <Search aria-hidden="true" className="h-5 w-5" />
            </button>
          </div>
        </section>

        <div className="-mx-5 overflow-x-auto px-5">
          <div className="flex min-w-max gap-2">
            {categories.map((category, index) => (
              <Badge className={index === 0 ? 'bg-kaset-deep text-white' : ''} key={category} tone="neutral">
                {category}
              </Badge>
            ))}
          </div>
        </div>

        <section className="grid gap-4">
          {articles.map((article) => (
            <ArticleCard article={article} key={article.id} />
          ))}
        </section>
      </div>
    </div>
  );
}
