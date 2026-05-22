import { Bookmark, Check, Clock, Eye, Play, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ShareButton } from '@/components/kaset/ShareButton';
import { VisualPlaceholder } from '@/components/kaset/VisualPlaceholder';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useSavedVideos } from '@/hooks/useSavedVideos';
import type { SavedVideo, VideoCategory, YouTubeVideo } from '@/types/youtube';

type YouTubeVideoCardProps = {
  video: YouTubeVideo | SavedVideo;
  featured?: boolean;
  compact?: boolean;
  savedView?: boolean;
};

const viewFormatter = new Intl.NumberFormat('th-TH', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

const categoryTone: Record<VideoCategory, 'rice' | 'orchard' | 'soil' | 'market' | 'disease' | 'leaf'> = {
  เทคนิคปลูกพืช: 'rice',
  โรคพืชและแมลง: 'disease',
  ปุ๋ยและดิน: 'soil',
  เกษตรอินทรีย์: 'leaf',
  ราคาพืชผล: 'market',
  เครื่องมือเกษตร: 'orchard',
};

function formatSavedDate(savedAt?: string) {
  if (!savedAt) {
    return '';
  }

  return new Intl.DateTimeFormat('th-TH', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(savedAt));
}

export function YouTubeVideoCard({ video, featured = false, compact = false, savedView = false }: YouTubeVideoCardProps) {
  const { isSaved, toggle, remove } = useSavedVideos();
  const saved = isSaved(video.videoId);
  const detailHref = `/app/youtube/${video.videoId}`;
  const sharePayload = {
    title: video.title,
    description: `${video.description}\nวิดีโอจาก KasetHub YouTube Hub`,
    url: video.shareUrl,
    imageUrl: video.thumbnailUrl,
  };

  if (featured) {
    return (
      <Card className="overflow-hidden">
        <Link to={detailHref}>
          <VisualPlaceholder className="aspect-video rounded-none" label="วิดีโอเด่นจากช่อง" tone={categoryTone[video.category]} />
        </Link>
        <div className="p-4">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Badge tone="gold">วิดีโอเด่น</Badge>
            <Badge tone="green">{video.category}</Badge>
            {video.isShort ? <Badge tone="rose">Shorts</Badge> : null}
          </div>
          <Link to={detailHref}>
            <h3 className="text-lg font-extrabold leading-7 text-kaset-ink">{video.title}</h3>
          </Link>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{video.description}</p>
          <div className="mt-3 flex flex-wrap gap-3 text-xs font-semibold text-slate-500">
            <span className="inline-flex items-center gap-1">
              <Clock aria-hidden="true" className="h-3.5 w-3.5" />
              {video.duration}
            </span>
            <span className="inline-flex items-center gap-1">
              <Eye aria-hidden="true" className="h-3.5 w-3.5" />
              {viewFormatter.format(video.viewCount)} views
            </span>
            <span>{video.publishedAt}</span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button className="min-h-10 px-3 text-xs" onClick={() => toggle(video)} variant={saved ? 'soft' : 'secondary'}>
              {saved ? <Check aria-hidden="true" className="h-3.5 w-3.5" /> : <Bookmark aria-hidden="true" className="h-3.5 w-3.5" />}
              {saved ? 'บันทึกแล้ว' : 'บันทึกวิดีโอ'}
            </Button>
            <ShareButton compact label="แชร์เพิ่มเติม" payload={sharePayload} />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className={compact ? 'flex gap-3 p-3' : 'grid grid-cols-[132px_1fr]'}>
        <Link className="relative block shrink-0 overflow-hidden rounded-lg" to={detailHref}>
          <VisualPlaceholder
            className={compact ? 'h-24 w-32 rounded-lg p-3' : 'h-full min-h-[142px] rounded-none'}
            label={video.isShort ? 'Shorts' : video.category}
            tone={categoryTone[video.category]}
          />
          <span className="absolute bottom-2 right-2 rounded bg-kaset-ink/85 px-1.5 py-0.5 text-[10px] font-bold text-white">
            {video.duration}
          </span>
          <span className="absolute left-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-kaset-deep">
            <Play aria-hidden="true" className="h-4 w-4 fill-current" />
          </span>
        </Link>
        <div className="min-w-0 p-4">
          <div className="mb-2 flex flex-wrap gap-2">
            <Badge tone={video.isShort ? 'rose' : 'green'}>{video.isShort ? 'Shorts' : video.category}</Badge>
            <Badge tone="neutral">{video.sourceStatus}</Badge>
          </div>
          <Link to={detailHref}>
            <h3 className="line-clamp-2 text-sm font-extrabold leading-5 text-kaset-ink">{video.title}</h3>
          </Link>
          <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-600">{video.description}</p>
          <p className="mt-2 text-[11px] font-semibold text-slate-500">
            {viewFormatter.format(video.viewCount)} views · {video.publishedAt}
          </p>
          {'savedAt' in video && savedView ? (
            <p className="mt-1 text-[11px] font-semibold text-kaset-deep">บันทึกเมื่อ {formatSavedDate(video.savedAt)}</p>
          ) : null}
        </div>
      </div>
      <div className="grid gap-2 border-t border-kaset-deep/8 p-3">
        <div className="grid grid-cols-2 gap-2">
          {savedView ? (
            <Button className="min-h-9 px-3 text-xs" onClick={() => remove(video.videoId)} variant="secondary">
              <Trash2 aria-hidden="true" className="h-3.5 w-3.5" />
              ลบออก
            </Button>
          ) : (
            <Button className="min-h-9 px-3 text-xs" onClick={() => toggle(video)} variant={saved ? 'soft' : 'secondary'}>
              {saved ? <Check aria-hidden="true" className="h-3.5 w-3.5" /> : <Bookmark aria-hidden="true" className="h-3.5 w-3.5" />}
              {saved ? 'บันทึกแล้ว' : 'บันทึกวิดีโอ'}
            </Button>
          )}
          <ShareButton compact label="แชร์เพิ่มเติม" payload={sharePayload} />
        </div>
      </div>
    </Card>
  );
}
