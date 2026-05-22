import { Play, Star } from 'lucide-react';
import { ShareButton } from '@/components/kaset/ShareButton';
import { VisualPlaceholder } from '@/components/kaset/VisualPlaceholder';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import type { KasetVideo } from '@/types/kaset';

type VideoCardProps = {
  video: KasetVideo;
  featured?: boolean;
};

export function VideoCard({ video, featured = false }: VideoCardProps) {
  const sharePayload = {
    title: video.title,
    description: `${video.summary}\nวิดีโอเกษตรตัวอย่างจาก KasetHub`,
    url: `/app/youtube#${video.id}`,
  };

  if (featured) {
    return (
      <Card className="overflow-hidden">
        <VisualPlaceholder className="aspect-video rounded-none" label="วิดีโอเกษตรตัวอย่าง" tone={video.tone} />
        <div className="p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <Badge tone="gold">
              <Star aria-hidden="true" className="mr-1 h-3 w-3" />
              แนะนำ
            </Badge>
            <span className="text-xs font-semibold text-slate-500">{video.duration}</span>
          </div>
          <h3 className="text-base font-extrabold leading-6 text-kaset-ink">{video.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{video.summary}</p>
          <p className="mt-3 text-xs font-medium text-slate-500">
            {video.channel} · {video.views} views · {video.publishedAt}
          </p>
          <ShareButton className="mt-4 w-full" label="แชร์เข้า LINE" payload={sharePayload} />
        </div>
      </Card>
    );
  }

  return (
    <article className="rounded-lg border border-white/90 bg-white p-3 shadow-card ring-1 ring-kaset-deep/5">
      <div className="flex gap-3">
        <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-lg">
          <VisualPlaceholder className="h-full rounded-lg p-3" label={video.category} tone={video.tone} />
          <span className="absolute bottom-2 right-2 rounded bg-kaset-ink/80 px-1.5 py-0.5 text-[10px] font-bold text-white">
            {video.duration}
          </span>
          <span className="absolute left-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-white/85 text-kaset-deep">
            <Play aria-hidden="true" className="h-3.5 w-3.5 fill-current" />
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <Badge className="mb-2" tone="green">
            {video.category}
          </Badge>
          <h3 className="line-clamp-2 text-sm font-bold leading-5 text-kaset-ink">{video.title}</h3>
          <p className="mt-1 line-clamp-1 text-xs text-slate-500">{video.channel}</p>
          <p className="mt-1 text-xs text-slate-400">
            {video.views} · {video.publishedAt}
          </p>
        </div>
      </div>
      <ShareButton className="mt-3 w-full" compact label="แชร์เข้า LINE" payload={sharePayload} />
    </article>
  );
}
