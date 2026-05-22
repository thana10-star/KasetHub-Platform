import { Bookmark, Check, Heart, MessageCircle, MapPin } from 'lucide-react';
import { ShareButton } from '@/components/kaset/ShareButton';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { VisualPlaceholder } from '@/components/kaset/VisualPlaceholder';
import { useGuestMemory } from '@/hooks/useGuestMemory';
import type { CommunityPost } from '@/types/kaset';

type CommunityPostCardProps = {
  post: CommunityPost;
  compact?: boolean;
};

export function CommunityPostCard({ post, compact = false }: CommunityPostCardProps) {
  const { isLiked, isSaved, saveItem, toggleLike, unsaveItem } = useGuestMemory();
  const liked = isLiked('community_post', post.id);
  const saved = isSaved('community_post', post.id);

  function handleSavePost() {
    if (saved) {
      unsaveItem('community_post', post.id);
      return;
    }

    saveItem({
      itemType: 'community_post',
      itemId: post.id,
      title: `โพสต์จาก ${post.author}`,
      summary: post.body,
      sourceRoute: `/app/community#${post.id}`,
      tags: [post.topic, post.province],
      metadata: {
        post,
      },
    });
  }

  return (
    <Card className="overflow-hidden">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-kaset-mint text-sm font-extrabold text-kaset-deep">
            {post.author.slice(3, 4)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-bold text-kaset-ink">{post.author}</h3>
              <Badge tone="neutral">{post.topic}</Badge>
            </div>
            <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
              <MapPin aria-hidden="true" className="h-3.5 w-3.5" />
              {post.province} · {post.role} · {post.postedAt}
            </p>
          </div>
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-700">{post.body}</p>
      </div>
      {!compact ? (
        <VisualPlaceholder className="mx-4 aspect-[16/8] rounded-lg" label="ภาพจากแปลงตัวอย่าง" tone={post.imageTone} />
      ) : null}
      <div className="flex flex-wrap items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-500">
        <div className="flex flex-1 items-center gap-3">
          <button
            className={liked ? 'inline-flex items-center gap-1.5 text-rose-600' : 'inline-flex items-center gap-1.5'}
            onClick={() =>
              toggleLike({
                itemType: 'community_post',
                itemId: post.id,
                title: `โพสต์จาก ${post.author}`,
                sourceRoute: `/app/community#${post.id}`,
                metadata: { post },
              })
            }
            type="button"
          >
            <Heart aria-hidden="true" className={liked ? 'h-4 w-4 fill-current' : 'h-4 w-4'} />
            {post.likes + (liked ? 1 : 0)}
          </button>
          <span className="inline-flex items-center gap-1.5">
            <MessageCircle aria-hidden="true" className="h-4 w-4" />
            {post.comments}
          </span>
        </div>
        <Button className="min-h-9 px-3 text-xs" onClick={handleSavePost} variant={saved ? 'soft' : 'secondary'}>
          {saved ? <Check aria-hidden="true" className="h-3.5 w-3.5" /> : <Bookmark aria-hidden="true" className="h-3.5 w-3.5" />}
          {saved ? 'บันทึกแล้ว' : 'บันทึกโพสต์'}
        </Button>
        <ShareButton
          compact
          label="แชร์เพิ่มเติม"
          payload={{
            title: `โพสต์จาก ${post.author}`,
            description: `${post.body}\nชุมชนเกษตรกรบน KasetHub`,
            url: `/app/community#${post.id}`,
          }}
        />
      </div>
    </Card>
  );
}
