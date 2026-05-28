import { ExternalLink, PlaySquare } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { getChannelVideoById } from '@/services/youtube/youtube-service';

function formatPublishedAt(publishedAt?: string) {
  if (!publishedAt) return '';

  const publishedAtTime = Date.parse(publishedAt);
  if (!Number.isFinite(publishedAtTime)) return publishedAt;

  return new Intl.DateTimeFormat('th-TH', {
    dateStyle: 'medium',
    timeZone: 'Asia/Bangkok',
  }).format(new Date(publishedAtTime));
}

export function YoutubeVideoDetailPage() {
  const { videoId = '' } = useParams();
  const video = getChannelVideoById(videoId);
  const publishedAtLabel = formatPublishedAt(video?.publishedAt);

  return (
    <div>
      <PageHeader title="รายละเอียดวิดีโอ" subtitle="วิดีโอจริงจากช่องเจ้าของระบบ" showBack />
      <div className="grid gap-5 px-5 pb-6">
        {video ? (
          <Card className="overflow-hidden p-3">
            {video.thumbnailUrl ? (
              <img alt="" className="aspect-video w-full rounded-lg object-cover" src={video.thumbnailUrl} />
            ) : (
              <div className="grid aspect-video place-items-center rounded-lg bg-gradient-to-br from-sky-100 via-emerald-100 to-orange-100 text-kaset-deep">
                <PlaySquare aria-hidden="true" className="h-14 w-14" />
              </div>
            )}
            <div className="pt-4">
              <p className="text-xs font-extrabold leading-5 text-sky-800">{video.channelName ?? 'KasetHub'}</p>
              <h1 className="mt-1 break-words text-xl font-extrabold leading-7 text-kaset-ink">{video.title}</h1>
              {video.description ? <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">{video.description}</p> : null}
              {publishedAtLabel ? (
                <p className="mt-3 text-xs font-semibold leading-5 text-slate-500">เผยแพร่ {publishedAtLabel}</p>
              ) : null}
              <a
                className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-kaset-deep px-4 text-sm font-extrabold text-white"
                href={video.url}
                rel="noreferrer"
                target="_blank"
              >
                ดูวิดีโอ
                <ExternalLink aria-hidden="true" className="h-4 w-4" />
              </a>
            </div>
          </Card>
        ) : (
          <>
            <NoticeBox tone="warning" title="ยังไม่มีวิดีโอจริงสำหรับรายการนี้">
              หน้านี้ไม่แสดงวิดีโอตัวอย่างแทนข้อมูลจริงจากช่อง
            </NoticeBox>
            <Card className="p-5 text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
                <PlaySquare aria-hidden="true" className="h-7 w-7" />
              </span>
              <h2 className="mt-4 text-lg font-extrabold leading-7 text-kaset-ink">กำลังเตรียมเชื่อมวิดีโอจากช่อง</h2>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
                เมื่อเจ้าของระบบเพิ่ม URL วิดีโอจริง รายละเอียดจะแสดงที่หน้านี้ได้
              </p>
              <Link
                className="mt-4 inline-flex min-h-11 items-center justify-center rounded-lg bg-kaset-deep px-4 text-sm font-extrabold text-white"
                to="/app/youtube"
              >
                กลับไปหน้าวิดีโอเกษตร
              </Link>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
