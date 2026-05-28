import { ExternalLink, Home, PlaySquare } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import {
  fetchYouTubeVideoLibraryResponse,
  getYouTubeSourceStatus,
  listLatestVideos,
  listLatestVideosWithBackendFallback,
} from '@/services/youtube/youtube-service';
import type { YouTubeVideoLibraryBackendResponse } from '@/services/youtube/youtube-backend-adapter.types';
import type { ChannelVideo } from '@/services/youtube/youtube.types';

function formatPublishedAt(publishedAt?: string) {
  if (!publishedAt) return '';

  const publishedAtTime = Date.parse(publishedAt);
  if (!Number.isFinite(publishedAtTime)) return publishedAt;

  return new Intl.DateTimeFormat('th-TH', {
    dateStyle: 'medium',
    timeZone: 'Asia/Bangkok',
  }).format(new Date(publishedAtTime));
}

function VideoPreview({ video }: { video: ChannelVideo }) {
  if (video.thumbnailUrl) {
    return (
      <img
        alt=""
        className="aspect-video w-full rounded-lg object-cover"
        src={video.thumbnailUrl}
      />
    );
  }

  return (
    <div className="grid aspect-video place-items-center rounded-lg bg-gradient-to-br from-sky-100 via-emerald-100 to-orange-100 text-kaset-deep">
      <PlaySquare aria-hidden="true" className="h-12 w-12" />
    </div>
  );
}

function ChannelVideoCard({ video }: { video: ChannelVideo }) {
  const publishedAtLabel = formatPublishedAt(video.publishedAt);

  return (
    <Card className="overflow-hidden p-3">
      <div className="grid gap-3 sm:grid-cols-[168px_minmax(0,1fr)]">
        <VideoPreview video={video} />
        <div className="min-w-0">
          <p className="text-xs font-extrabold leading-5 text-sky-800">{video.channelName ?? 'KasetHub'}</p>
          <h2 className="break-words text-base font-extrabold leading-6 text-kaset-ink">{video.title}</h2>
          {video.description ? (
            <p className="mt-1 break-words text-sm font-semibold leading-6 text-slate-600">{video.description}</p>
          ) : null}
          {publishedAtLabel ? (
            <p className="mt-2 text-xs font-semibold leading-5 text-slate-500">เผยแพร่ {publishedAtLabel}</p>
          ) : null}
          <a
            className="mt-3 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-kaset-deep px-3 text-sm font-extrabold text-white"
            href={video.url}
            rel="noreferrer"
            target="_blank"
          >
            ดูวิดีโอ
            <ExternalLink aria-hidden="true" className="h-4 w-4" />
          </a>
        </div>
      </div>
    </Card>
  );
}

type YoutubePageProps = {
  backendResponse?: YouTubeVideoLibraryBackendResponse | null;
  fetchVideoLibraryResponse?: () => Promise<YouTubeVideoLibraryBackendResponse | undefined>;
  videos?: ChannelVideo[];
};

function getBackendChannelDisplayName(response?: YouTubeVideoLibraryBackendResponse | null) {
  return response?.channel.title ?? response?.channel.channelName ?? response?.channel.handle ?? response?.channel.channelHandle;
}

export function YoutubePage({
  backendResponse,
  fetchVideoLibraryResponse = fetchYouTubeVideoLibraryResponse,
  videos: videoInput,
}: YoutubePageProps = {}) {
  const [fetchedBackendResponse, setFetchedBackendResponse] = useState<YouTubeVideoLibraryBackendResponse | undefined>();
  const effectiveBackendResponse = backendResponse ?? fetchedBackendResponse;
  const videos =
    videoInput === undefined ? listLatestVideosWithBackendFallback(effectiveBackendResponse) : listLatestVideos(videoInput);
  const sourceStatus = getYouTubeSourceStatus(videos);
  const hasVideos = videos.length > 0;
  const channelDisplayName = getBackendChannelDisplayName(effectiveBackendResponse) ?? videos[0]?.channelName;

  useEffect(() => {
    if (videoInput !== undefined || backendResponse !== undefined) return undefined;

    let isActive = true;

    fetchVideoLibraryResponse()
      .then((response) => {
        if (isActive) setFetchedBackendResponse(response);
      })
      .catch(() => undefined);

    return () => {
      isActive = false;
    };
  }, [backendResponse, fetchVideoLibraryResponse, videoInput]);

  return (
    <div>
      <PageHeader title="วิดีโอเกษตร" subtitle="วิดีโอจริงจากช่องเจ้าของระบบ" showBack />
      <div className="grid gap-5 px-5 pb-6">
        {hasVideos ? (
          <NoticeBox tone="success" title="วิดีโอจากช่องจริง">
            แสดงเฉพาะรายการที่มี URL วิดีโอจริงจากเจ้าของระบบ หรือจาก backend YouTube API ที่ปลอดภัยแล้วเท่านั้น
          </NoticeBox>
        ) : (
          <NoticeBox tone="warning" title="กำลังเตรียมเชื่อมวิดีโอล่าสุดจากช่อง">
            ยังไม่มีรายการวิดีโอจริงให้แสดง จึงไม่เติมข้อมูลตัวอย่างแทนข้อมูลจากช่องจริง
          </NoticeBox>
        )}

        {hasVideos ? (
          <section className="grid gap-3" aria-labelledby="youtube-video-list-title">
            <h2 id="youtube-video-list-title" className="text-lg font-extrabold leading-7 text-kaset-ink">
              วิดีโอล่าสุดจากช่อง
            </h2>
            {channelDisplayName ? (
              <p className="break-words text-sm font-semibold leading-6 text-slate-600">{channelDisplayName}</p>
            ) : null}
            <div className="grid gap-3">
              {videos.map((video) => (
                <ChannelVideoCard key={video.id} video={video} />
              ))}
            </div>
          </section>
        ) : (
          <Card className="p-5 text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
              <PlaySquare aria-hidden="true" className="h-7 w-7" />
            </span>
            <h2 className="mt-4 text-lg font-extrabold leading-7 text-kaset-ink">วิดีโอเกษตรกำลังเตรียมเชื่อมต่อ</h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
              เจ้าของระบบสามารถเพิ่มวิดีโอจริงได้เมื่อเลือกคลิปแรกพร้อม URL และภาพหน้าปกแล้ว
            </p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <Link
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-kaset-deep px-4 text-sm font-extrabold text-white"
                to="/app"
              >
                <Home aria-hidden="true" className="h-4 w-4" />
                กลับหน้าแรก
              </Link>
              {sourceStatus.channelUrl ? (
                <a
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/12"
                  href={sourceStatus.channelUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  เปิดช่อง YouTube
                  <ExternalLink aria-hidden="true" className="h-4 w-4" />
                </a>
              ) : null}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
