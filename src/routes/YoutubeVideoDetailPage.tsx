import { ExternalLink, PlaySquare } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import {
  fetchYouTubeVideoLibraryResponse,
  getChannelVideoById,
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

function getBackendChannelDisplayName(response?: YouTubeVideoLibraryBackendResponse | null) {
  return response?.channel.title ?? response?.channel.channelName ?? response?.channel.handle ?? response?.channel.channelHandle;
}

function getBackendChannelUrl(response?: YouTubeVideoLibraryBackendResponse | null) {
  return response?.channel.channelUrl ?? response?.channel.url;
}

type YoutubeVideoDetailPageProps = {
  backendResponse?: YouTubeVideoLibraryBackendResponse | null;
  fetchVideoLibraryResponse?: () => Promise<YouTubeVideoLibraryBackendResponse | undefined>;
  videos?: ChannelVideo[];
};

export function YoutubeVideoDetailPage({
  backendResponse,
  fetchVideoLibraryResponse = fetchYouTubeVideoLibraryResponse,
  videos: videoInput,
}: YoutubeVideoDetailPageProps = {}) {
  const { videoId = '' } = useParams();
  const [fetchedBackendResponse, setFetchedBackendResponse] = useState<YouTubeVideoLibraryBackendResponse | undefined>();
  const [hasFetchedVideoLibraryResponse, setHasFetchedVideoLibraryResponse] = useState(false);
  const effectiveBackendResponse = backendResponse ?? fetchedBackendResponse;
  const videos =
    videoInput === undefined ? listLatestVideosWithBackendFallback(effectiveBackendResponse) : listLatestVideos(videoInput);
  const sourceStatus = getYouTubeSourceStatus(videos);
  const video = getChannelVideoById(videoId, videos);
  const embedVideoId = video?.videoId?.trim();
  const publishedAtLabel = formatPublishedAt(video?.publishedAt);
  const channelDisplayName = video?.channelName ?? getBackendChannelDisplayName(effectiveBackendResponse) ?? 'KasetHub';
  const channelUrl = getBackendChannelUrl(effectiveBackendResponse) ?? sourceStatus.channelUrl;
  const shouldFetchVideoLibrary = videoInput === undefined && backendResponse === undefined;
  const isVideoDetailLoading = shouldFetchVideoLibrary && !hasFetchedVideoLibraryResponse;

  useEffect(() => {
    if (videoInput !== undefined || backendResponse !== undefined) return undefined;

    let isActive = true;
    setHasFetchedVideoLibraryResponse(false);

    fetchVideoLibraryResponse()
      .then((response) => {
        if (isActive) setFetchedBackendResponse(response);
      })
      .catch(() => undefined)
      .finally(() => {
        if (isActive) setHasFetchedVideoLibraryResponse(true);
      });

    return () => {
      isActive = false;
    };
  }, [backendResponse, fetchVideoLibraryResponse, videoInput]);

  return (
    <div>
      <PageHeader title="รายละเอียดวิดีโอ" subtitle="ดูวิดีโอจากช่องเจ้าของระบบในแอพ" showBack />
      <div className="grid gap-5 px-5 pb-6">
        {isVideoDetailLoading ? (
          <>
            <NoticeBox tone="info" title="กำลังโหลดวิดีโอจากช่อง">
              กำลังเตรียม player จากรายการวิดีโอจริง โดยไม่เติมวิดีโอตัวอย่างแทนข้อมูลจริง
            </NoticeBox>
            <Card className="overflow-hidden p-0" aria-label="กำลังโหลดวิดีโอจากช่อง">
              <div aria-hidden="true" className="aspect-video animate-pulse bg-slate-100" />
              <div className="grid gap-3 p-4">
                <div aria-hidden="true" className="h-4 w-32 animate-pulse rounded bg-slate-100" />
                <div aria-hidden="true" className="h-5 w-full animate-pulse rounded bg-slate-100" />
                <div aria-hidden="true" className="h-5 w-3/4 animate-pulse rounded bg-slate-100" />
                <div aria-hidden="true" className="h-10 w-36 animate-pulse rounded-lg bg-slate-100" />
              </div>
            </Card>
          </>
        ) : video && embedVideoId ? (
          <Card className="overflow-hidden p-0">
            <div className="aspect-video w-full bg-black">
              <iframe
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="h-full w-full border-0"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                src={`https://www.youtube.com/embed/${encodeURIComponent(embedVideoId)}`}
                title={video.title}
              />
            </div>
            <div className="grid gap-3 p-4">
              <p className="text-xs font-extrabold leading-5 text-sky-800">{channelDisplayName}</p>
              <h1 className="break-words text-xl font-extrabold leading-7 text-kaset-ink">{video.title}</h1>
              {publishedAtLabel ? (
                <p className="text-xs font-semibold leading-5 text-slate-500">เผยแพร่ {publishedAtLabel}</p>
              ) : null}
              <p className="text-sm font-semibold leading-6 text-slate-600">
                ถ้าวิดีโอเล่นไม่ได้ในแอพ ให้เปิดดูบน YouTube
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                <a
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-kaset-deep px-4 text-sm font-extrabold text-white"
                  href={video.url}
                  rel="noreferrer"
                  target="_blank"
                >
                  เปิดใน YouTube
                  <ExternalLink aria-hidden="true" className="h-4 w-4" />
                </a>
                <Link
                  className="inline-flex min-h-11 items-center justify-center rounded-lg bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/12"
                  to="/app/youtube"
                >
                  วิดีโอทั้งหมด
                </Link>
              </div>
            </div>
          </Card>
        ) : video ? (
          <>
            <NoticeBox tone="warning" title="ยังเล่นวิดีโอนี้ในแอพไม่ได้">
              รายการนี้เป็นวิดีโอจริง แต่ยังไม่มีรหัสวิดีโอสำหรับฝัง player ในแอพ
            </NoticeBox>
            <Card className="p-5">
              <p className="text-xs font-extrabold leading-5 text-sky-800">{channelDisplayName}</p>
              <h1 className="mt-1 break-words text-xl font-extrabold leading-7 text-kaset-ink">{video.title}</h1>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <a
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-kaset-deep px-4 text-sm font-extrabold text-white"
                  href={video.url}
                  rel="noreferrer"
                  target="_blank"
                >
                  เปิดใน YouTube
                  <ExternalLink aria-hidden="true" className="h-4 w-4" />
                </a>
                <Link
                  className="inline-flex min-h-11 items-center justify-center rounded-lg bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/12"
                  to="/app/youtube"
                >
                  วิดีโอทั้งหมด
                </Link>
              </div>
            </Card>
          </>
        ) : (
          <>
            <NoticeBox tone="warning" title="ยังไม่พบวิดีโอนี้">
              หน้านี้ไม่แสดงวิดีโอตัวอย่างแทนข้อมูลจริงจากช่อง
            </NoticeBox>
            <Card className="p-5 text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
                <PlaySquare aria-hidden="true" className="h-7 w-7" />
              </span>
              <h2 className="mt-4 text-lg font-extrabold leading-7 text-kaset-ink">กำลังเตรียมเชื่อมวิดีโอจากช่อง</h2>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
                ถ้าวิดีโอถูกลบ เปลี่ยนรหัส หรือ backend ยังไม่ส่งรายการนี้ ให้กลับไปเลือกจากหน้าวิดีโอทั้งหมด
              </p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <Link
                  className="inline-flex min-h-11 items-center justify-center rounded-lg bg-kaset-deep px-4 text-sm font-extrabold text-white"
                  to="/app/youtube"
                >
                  วิดีโอทั้งหมด
                </Link>
                {channelUrl ? (
                  <a
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/12"
                    href={channelUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    เปิดช่อง YouTube
                    <ExternalLink aria-hidden="true" className="h-4 w-4" />
                  </a>
                ) : null}
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
