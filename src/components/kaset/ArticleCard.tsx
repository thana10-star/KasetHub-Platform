import { Bookmark, BookOpenCheck, Check, Clock } from 'lucide-react';
import { ShareButton } from '@/components/kaset/ShareButton';
import { VisualPlaceholder } from '@/components/kaset/VisualPlaceholder';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useSavedArticles } from '@/hooks/useSavedArticles';
import type { Article } from '@/types/kaset';

type ArticleCardProps = {
  article: Article;
};

export function ArticleCard({ article }: ArticleCardProps) {
  const { isSaved, save, toggle } = useSavedArticles();
  const saved = isSaved(article.id);

  return (
    <Card className="overflow-hidden">
      <div className="grid grid-cols-[112px_1fr]">
        <VisualPlaceholder className="h-full min-h-[132px] rounded-none" label={article.category} tone={article.imageTone} />
        <div className="min-w-0 p-4">
          <Badge className="mb-2" tone={article.category === 'ตลาด' ? 'gold' : 'green'}>
            {article.category}
          </Badge>
          <h3 className="line-clamp-2 text-sm font-extrabold leading-5 text-kaset-ink">{article.title}</h3>
          <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-600">{article.excerpt}</p>
          <p className="mt-3 flex items-center gap-1 text-[11px] font-medium text-slate-500">
            <Clock aria-hidden="true" className="h-3.5 w-3.5" />
            {article.readTime} · {article.publishedAt}
          </p>
        </div>
      </div>

      <div className="grid gap-2 border-t border-kaset-deep/8 p-3">
        <div className="grid grid-cols-2 gap-2">
          <Button className="min-h-9 px-3 text-xs" onClick={() => toggle(article)} variant={saved ? 'soft' : 'secondary'}>
            {saved ? <Check aria-hidden="true" className="h-3.5 w-3.5" /> : <Bookmark aria-hidden="true" className="h-3.5 w-3.5" />}
            {saved ? 'บันทึกแล้ว' : 'บันทึกไว้อ่าน'}
          </Button>
          <Button className="min-h-9 px-3 text-xs" onClick={() => save(article)} variant="soft">
            <BookOpenCheck aria-hidden="true" className="h-3.5 w-3.5" />
            อ่านออฟไลน์
          </Button>
        </div>
        <ShareButton
          compact
          label="แชร์บทความ"
          payload={{
            title: article.title,
            description: `${article.excerpt}\nบันทึกไว้สำหรับอ่านภายหลังบน KasetHub`,
            url: `/app/articles#${article.id}`,
          }}
        />
      </div>
    </Card>
  );
}
