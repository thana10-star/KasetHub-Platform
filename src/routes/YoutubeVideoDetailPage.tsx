import { Bot, Bookmark, Check, Clock, Eye, PlayCircle } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { ShareButton } from '@/components/kaset/ShareButton';
import { VisualPlaceholder } from '@/components/kaset/VisualPlaceholder';
import { YouTubeVideoCard } from '@/components/kaset/YouTubeVideoCard';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { findYoutubeVideo, youtubeVideos } from '@/data/youtubeData';
import { useSavedVideos } from '@/hooks/useSavedVideos';
import type { VideoCategory } from '@/types/youtube';

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

export function YoutubeVideoDetailPage() {
  const { videoId = '' } = useParams();
  const video = findYoutubeVideo(videoId) ?? findYoutubeVideo('sample-video-id') ?? youtubeVideos[0];
  const relatedVideos = youtubeVideos.filter((item) => item.videoId !== video.videoId && item.category === video.category).slice(0, 3);
  const fallbackRelatedVideos = relatedVideos.length > 0 ? relatedVideos : youtubeVideos.filter((item) => item.videoId !== video.videoId).slice(0, 3);
  const { isSaved, toggle } = useSavedVideos();
  const saved = isSaved(video.videoId);

  return (
    <div>
      <PageHeader title="รายละเอียดวิดีโอ" subtitle="เตรียมรองรับสรุปวิดีโอด้วย AI" showBack />
      <div className="grid gap-5 px-5 pb-6">
        <Card className="overflow-hidden">
          <div className="relative">
            <VisualPlaceholder className="aspect-video rounded-none" label="Video preview mock" tone={categoryTone[video.category]} />
            <span className="absolute inset-0 grid place-items-center">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-white/90 text-kaset-deep shadow-soft">
                <PlayCircle aria-hidden="true" className="h-8 w-8" />
              </span>
            </span>
          </div>
          <div className="p-5">
            <div className="mb-3 flex flex-wrap gap-2">
              <Badge tone="green">{video.category}</Badge>
              {video.isShort ? <Badge tone="rose">Shorts</Badge> : null}
              <Badge tone="neutral">{video.sourceStatus}</Badge>
            </div>
            <h1 className="text-xl font-extrabold leading-7 text-kaset-ink">{video.title}</h1>
            <p className="mt-3 text-sm leading-6 text-slate-700">{video.description}</p>
            <div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold text-slate-500">
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
            <div className="mt-4 flex flex-wrap gap-2">
              {video.tags.map((tag) => (
                <span className="rounded-full bg-kaset-mist px-3 py-1 text-xs font-semibold text-slate-600" key={tag}>
                  #{tag}
                </span>
              ))}
            </div>
            <div className="mt-5 grid gap-2">
              <div className="grid grid-cols-2 gap-2">
                <Button onClick={() => toggle(video)} variant={saved ? 'soft' : 'secondary'}>
                  {saved ? <Check aria-hidden="true" className="h-4 w-4" /> : <Bookmark aria-hidden="true" className="h-4 w-4" />}
                  {saved ? 'บันทึกแล้ว' : 'บันทึกวิดีโอ'}
                </Button>
                <ShareButton
                  label="แชร์เพิ่มเติม"
                  payload={{
                    title: video.title,
                    description: video.description,
                    url: video.shareUrl,
                    imageUrl: video.thumbnailUrl,
                  }}
                />
              </div>
              <Link
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-kaset-deep px-4 text-sm font-bold text-white"
                to="/app/ai"
              >
                <Bot aria-hidden="true" className="h-4 w-4" />
                ถาม AI จากหัวข้อนี้
              </Link>
            </div>
          </div>
        </Card>

        <section className="grid gap-3">
          <h2 className="text-lg font-extrabold text-kaset-ink">วิดีโอที่เกี่ยวข้อง</h2>
          {fallbackRelatedVideos.map((item) => (
            <YouTubeVideoCard compact key={item.videoId} video={item} />
          ))}
        </section>
      </div>
    </div>
  );
}
