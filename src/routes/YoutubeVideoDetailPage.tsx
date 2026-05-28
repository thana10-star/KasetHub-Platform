import { ExternalLink, PlaySquare } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import {
  fetchYouTubeVideoLibraryResponse,
  formatYouTubeViewCount,
  getChannelVideoById,
  getChannelVideoRouteId,
  getYouTubeSourceStatus,
  isUsableChannelVideo,
  listLatestVideos,
  listLatestVideosWithBackendFallback,
} from '@/services/youtube/youtube-service';
import type { YouTubeVideoLibraryBackendResponse } from '@/services/youtube/youtube-backend-adapter.types';
import type { ChannelVideo } from '@/services/youtube/youtube.types';

const detailLoadingCopy = 'กำลังโหลดวิดีโอจากช่อง';
const detailLoadingDescription = 'กำลังเตรียมวิดีโอจริงจากช่องเจ้าของระบบ';
const detailInAppFallbackCopy = 'ถ้าวิดีโอเล่นไม่ได้ในแอพ ให้เปิดดูบน YouTube';
const detailMissingEmbedCopy = 'ยังเปิดวิดีโอนี้ในแอพไม่ได้';
const detailMissingEmbedDescription = 'วิดีโอนี้เป็นรายการจริง แต่ยังไม่มีรหัสสำหรับเปิดในแอพ';
const detailNotFoundCopy = 'ยังไม่พบวิดีโอนี้';
const detailNotFoundDescription = 'วิดีโอนี้อาจถูกลบ เปลี่ยนรหัส หรือยังไม่อยู่ในรายการที่โหลดได้';

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

function isRouteStateChannelVideo(video: unknown): video is ChannelVideo {
  if (!video || typeof video !== 'object') return false;

  const candidate = video as Partial<ChannelVideo>;
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.title === 'string' &&
    typeof candidate.url === 'string' &&
    typeof candidate.source === 'string' &&
    typeof candidate.isReal === 'boolean' &&
    (candidate.videoId === undefined || typeof candidate.videoId === 'string') &&
    (candidate.thumbnailUrl === undefined || typeof candidate.thumbnailUrl === 'string') &&
    (candidate.publishedAt === undefined || typeof candidate.publishedAt === 'string') &&
    (candidate.description === undefined || typeof candidate.description === 'string') &&
    (candidate.channelName === undefined || typeof candidate.channelName === 'string') &&
    (candidate.viewCount === undefined || typeof candidate.viewCount === 'number')
  );
}

function getRouteStateVideo(state: unknown) {
  if (!state || typeof state !== 'object' || !('video' in state)) return undefined;

  const video = (state as { video?: unknown }).video;
  return isRouteStateChannelVideo(video) ? video : undefined;
}

export function YoutubeVideoDetailPage({
  backendResponse,
  fetchVideoLibraryResponse = fetchYouTubeVideoLibraryResponse,
  videos: videoInput,
}: YoutubeVideoDetailPageProps = {}) {
  const { videoId = '' } = useParams();
  const location = useLocation();
  const routeStateVideo = getRouteStateVideo(location.state);
  const [fetchedBackendResponse, setFetchedBackendResponse] = useState<YouTubeVideoLibraryBackendResponse | undefined>();
  const [hasFetchedVideoLibraryResponse, setHasFetchedVideoLibraryResponse] = useState(false);
  const effectiveBackendResponse = backendResponse ?? fetchedBackendResponse;
  const videos =
    videoInput === undefined ? listLatestVideosWithBackendFallback(effectiveBackendResponse) : listLatestVideos(videoInput);
  const sourceStatus = getYouTubeSourceStatus(videos);
  const videoFromRouteState =
    routeStateVideo &&
    getChannelVideoRouteId(routeStateVideo) === videoId.trim() &&
    isUsableChannelVideo(routeStateVideo)
      ? routeStateVideo
      : undefined;
  const video = videoFromRouteState ?? getChannelVideoById(videoId, videos);
  const embedVideoId = video?.videoId?.trim();
  const publishedAtLabel = formatPublishedAt(video?.publishedAt);
  const viewCountLabel = formatYouTubeViewCount(video?.viewCount);
  const videoMetaParts = [
    publishedAtLabel ? `เผยแพร่ ${publishedAtLabel}` : undefined,
    viewCountLabel ?? undefined,
  ].filter((part): part is string => Boolean(part));
  const channelDisplayName = video?.channelName ?? getBackendChannelDisplayName(effectiveBackendResponse) ?? 'KasetHub';
  const channelUrl = getBackendChannelUrl(effectiveBackendResponse) ?? sourceStatus.channelUrl;
  const shouldFetchVideoLibrary = videoInput === undefined && backendResponse === undefined;
  const isVideoDetailLoading = shouldFetchVideoLibrary && !hasFetchedVideoLibraryResponse && !video;

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
            <NoticeBox tone="info" title={detailLoadingCopy}>
              {detailLoadingDescription}
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
              <p className="break-words text-xs font-extrabold leading-5 text-sky-800 [overflow-wrap:anywhere]">{channelDisplayName}</p>
              <h1 className="break-words text-xl font-extrabold leading-7 text-kaset-ink [overflow-wrap:anywhere]">{video.title}</h1>
              {videoMetaParts.length > 0 ? (
                <p className="text-xs font-semibold leading-5 text-slate-500">{videoMetaParts.join(' · ')}</p>
              ) : null}
              <p className="text-sm font-semibold leading-6 text-slate-600">
                {detailInAppFallbackCopy}
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
            <NoticeBox tone="warning" title={detailMissingEmbedCopy}>
              {detailMissingEmbedDescription}
            </NoticeBox>
            <Card className="p-5">
              <p className="break-words text-xs font-extrabold leading-5 text-sky-800 [overflow-wrap:anywhere]">{channelDisplayName}</p>
              <h1 className="mt-1 break-words text-xl font-extrabold leading-7 text-kaset-ink [overflow-wrap:anywhere]">{video.title}</h1>
              {videoMetaParts.length > 0 ? (
                <p className="mt-2 text-xs font-semibold leading-5 text-slate-500">{videoMetaParts.join(' · ')}</p>
              ) : null}
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
            <NoticeBox tone="warning" title={detailNotFoundCopy}>
              {detailNotFoundDescription}
            </NoticeBox>
            <Card className="p-5 text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
                <PlaySquare aria-hidden="true" className="h-7 w-7" />
              </span>
              <h2 className="mt-4 text-lg font-extrabold leading-7 text-kaset-ink">{detailNotFoundCopy}</h2>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
                {detailNotFoundDescription}
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
