import { Bookmark, BookOpenCheck, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ArticleCard } from '@/components/kaset/ArticleCard';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useSavedArticles } from '@/hooks/useSavedArticles';

export function SavedArticlesPage() {
  const { savedArticles } = useSavedArticles();

  return (
    <div>
      <PageHeader title="บทความที่บันทึกไว้" subtitle="อ่านภายหลังและเตรียมรองรับออฟไลน์" showBack />
      <div className="grid gap-5 px-5 pb-6">
        <Card className="bg-kaset-deep p-5 text-white">
          <div className="flex gap-4">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-white text-kaset-deep">
              <BookOpenCheck aria-hidden="true" className="h-7 w-7" />
            </span>
            <div>
              <h2 className="text-xl font-extrabold">บันทึกไว้สำหรับอ่านภายหลัง</h2>
              <p className="mt-2 text-sm leading-6 text-emerald-50/90">
                เตรียมรองรับโหมดออฟไลน์ โดย M02 ใช้ localStorage เป็นฐานหน้าเว็บก่อน
              </p>
            </div>
          </div>
        </Card>

        {savedArticles.length > 0 ? (
          <section className="grid gap-4">
            {savedArticles.map((article) => (
              <ArticleCard article={article} key={article.id} />
            ))}
          </section>
        ) : (
          <Card className="p-5 text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
              <Bookmark aria-hidden="true" className="h-7 w-7" />
            </span>
            <h2 className="mt-4 text-lg font-extrabold text-kaset-ink">ยังไม่มีบทความที่บันทึกไว้</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              แตะ “บันทึกไว้อ่าน” จากหน้าบทความ เพื่อเก็บไว้สำหรับอ่านภายหลัง / เตรียมรองรับโหมดออฟไลน์
            </p>
            <Link to="/app/articles">
              <Button className="mt-5 w-full">
                <FileText aria-hidden="true" className="h-4 w-4" />
                ไปที่บทความ
              </Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
}
