import { ExternalLink, Home, PlaySquare } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import {
  fetchYouTubeVideoLibraryResponse,
  getChannelVideoDetailPath,
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
        className="h-16 w-full rounded-lg object-cover sm:h-20"
        src={video.thumbnailUrl}
      />
    );
  }

  return (
    <div className="grid h-16 place-items-center rounded-lg bg-gradient-to-br from-sky-100 via-emerald-100 to-orange-100 text-kaset-deep sm:h-20">
      <PlaySquare aria-hidden="true" className="h-7 w-7" />
    </div>
  );
}

function ChannelVideoCard({ video }: { video: ChannelVideo }) {
  const publishedAtLabel = formatPublishedAt(video.publishedAt);
  const canOpenInApp = Boolean(video.videoId?.trim());

  return (
    <Card className="overflow-hidden p-2.5">
      <div className="grid grid-cols-[112px_minmax(0,1fr)] gap-2.5 sm:grid-cols-[136px_minmax(0,1fr)] sm:gap-3">
        <VideoPreview video={video} />
        <div className="min-w-0">
          <p className="text-xs font-extrabold leading-5 text-sky-800">{video.channelName ?? 'KasetHub'}</p>
          <h2 className="break-words text-sm font-extrabold leading-5 text-kaset-ink [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3] overflow-hidden sm:text-base sm:leading-6">
            {video.title}
          </h2>
          {publishedAtLabel ? (
            <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">เผยแพร่ {publishedAtLabel}</p>
          ) : null}
          <div className="mt-2 flex flex-wrap gap-2">
            {canOpenInApp ? (
              <Link
                className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg bg-kaset-deep px-3 text-xs font-extrabold text-white sm:text-sm"
                to={getChannelVideoDetailPath(video)}
              >
                ดูในแอพ
                <PlaySquare aria-hidden="true" className="h-4 w-4" />
              </Link>
            ) : (
              <a
                className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg bg-kaset-deep px-3 text-xs font-extrabold text-white sm:text-sm"
                href={video.url}
                rel="noreferrer"
                target="_blank"
              >
                ดูวิดีโอ
                <ExternalLink aria-hidden="true" className="h-4 w-4" />
              </a>
            )}
            {canOpenInApp ? (
              <a
                className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg bg-white px-3 text-xs font-extrabold text-kaset-deep ring-1 ring-kaset-deep/12 sm:text-sm"
                href={video.url}
                rel="noreferrer"
                target="_blank"
              >
                เปิด YouTube
                <ExternalLink aria-hidden="true" className="h-4 w-4" />
              </a>
            ) : null}
          </div>
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

function getBackendChannelUrl(response?: YouTubeVideoLibraryBackendResponse | null) {
  return response?.channel.channelUrl ?? response?.channel.url;
}

export function YoutubePage({
  backendResponse,
  fetchVideoLibraryResponse = fetchYouTubeVideoLibraryResponse,
  videos: videoInput,
}: YoutubePageProps = {}) {
  const [fetchedBackendResponse, setFetchedBackendResponse] = useState<YouTubeVideoLibraryBackendResponse | undefined>();
  const [hasFetchedVideoLibraryResponse, setHasFetchedVideoLibraryResponse] = useState(false);
  const effectiveBackendResponse = backendResponse ?? fetchedBackendResponse;
  const videos =
    videoInput === undefined ? listLatestVideosWithBackendFallback(effectiveBackendResponse) : listLatestVideos(videoInput);
  const sourceStatus = getYouTubeSourceStatus(videos);
  const hasVideos = videos.length > 0;
  const channelDisplayName = getBackendChannelDisplayName(effectiveBackendResponse) ?? videos[0]?.channelName;
  const shouldFetchVideoLibrary = videoInput === undefined && backendResponse === undefined;
  const isVideoLibraryLoading = shouldFetchVideoLibrary && !hasFetchedVideoLibraryResponse;
  const backendStatus = effectiveBackendResponse?.status;
  const isVideoLibraryStale = backendStatus === 'stale' && videos.some((video) => video.source === 'youtube_api');
  const isVideoLibraryError = backendStatus === 'error' && !hasVideos;
  const channelUrl = getBackendChannelUrl(effectiveBackendResponse) ?? sourceStatus.channelUrl;

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
      <PageHeader title="วิดีโอเกษตร" subtitle="วิดีโอจริงจากช่องเจ้าของระบบ" showBack />
      <div className="grid gap-5 px-5 pb-6">
        {isVideoLibraryLoading ? (
          <NoticeBox tone="info" title="กำลังโหลดวิดีโอจากช่อง">
            กำลังเชื่อมวิดีโอจริงจากช่องเจ้าของระบบ โดยยังไม่เติมรายการตัวอย่างแทนข้อมูลจริง
          </NoticeBox>
        ) : hasVideos ? (
          <NoticeBox tone={isVideoLibraryStale ? 'warning' : 'success'} title={isVideoLibraryStale ? 'แสดงข้อมูลล่าสุดที่เคยโหลดได้' : 'วิดีโอจากช่องจริง'}>
            {isVideoLibraryStale
              ? 'ข้อมูลอาจไม่ล่าสุด แต่รายการที่แสดงยังเป็นวิดีโอจริงที่เคยโหลดได้จากช่อง'
              : 'แสดงเฉพาะรายการที่มี URL วิดีโอจริงจากเจ้าของระบบ หรือจาก backend YouTube API ที่ปลอดภัยแล้วเท่านั้น'}
          </NoticeBox>
        ) : (
          <NoticeBox tone={isVideoLibraryError ? 'danger' : 'warning'} title={isVideoLibraryError ? 'ยังโหลดวิดีโอจากช่องไม่ได้' : 'กำลังเตรียมเชื่อมวิดีโอล่าสุดจากช่อง'}>
            {isVideoLibraryError
              ? 'กรุณาลองใหม่ภายหลัง ระบบจะไม่แสดงข้อผิดพลาดดิบหรือเติมวิดีโอตัวอย่างแทน'
              : 'ยังไม่มีรายการวิดีโอจริงให้แสดง จึงไม่เติมข้อมูลตัวอย่างแทนข้อมูลจากช่องจริง'}
          </NoticeBox>
        )}

        {isVideoLibraryLoading ? (
          <Card className="p-3" aria-label="กำลังโหลดวิดีโอจากช่อง">
            <div className="grid gap-3">
              {[0, 1].map((item) => (
                <div className="grid grid-cols-[112px_minmax(0,1fr)] gap-2.5 sm:grid-cols-[136px_minmax(0,1fr)] sm:gap-3" key={item}>
                  <div aria-hidden="true" className="h-16 animate-pulse rounded-lg bg-slate-100 sm:h-20" />
                  <div className="min-w-0 py-1">
                    <div aria-hidden="true" className="h-4 w-24 animate-pulse rounded bg-slate-100" />
                    <div aria-hidden="true" className="mt-2 h-4 w-full animate-pulse rounded bg-slate-100" />
                    <div aria-hidden="true" className="mt-2 h-4 w-2/3 animate-pulse rounded bg-slate-100" />
                    <div aria-hidden="true" className="mt-3 h-8 w-24 animate-pulse rounded-lg bg-slate-100" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ) : hasVideos ? (
          <section className="grid gap-3" aria-labelledby="youtube-video-list-title">
            <h2 id="youtube-video-list-title" className="text-lg font-extrabold leading-7 text-kaset-ink">
              วิดีโอล่าสุดจากช่อง
            </h2>
            {channelDisplayName ? (
              <p className="break-words text-sm font-semibold leading-6 text-slate-600">{channelDisplayName}</p>
            ) : null}
            {isVideoLibraryStale ? (
              <p className="text-xs font-extrabold leading-5 text-amber-700">ข้อมูลอาจไม่ล่าสุด</p>
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
            <h2 className="mt-4 text-lg font-extrabold leading-7 text-kaset-ink">
              {isVideoLibraryError ? 'ยังโหลดวิดีโอจากช่องไม่ได้' : 'วิดีโอเกษตรกำลังเตรียมเชื่อมต่อ'}
            </h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
              {isVideoLibraryError
                ? 'กรุณาลองใหม่ภายหลัง หรือเปิดช่อง YouTube ของเจ้าของระบบโดยตรง'
                : 'เจ้าของระบบสามารถเพิ่มวิดีโอจริงได้เมื่อเลือกคลิปแรกพร้อม URL และภาพหน้าปกแล้ว'}
            </p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <Link
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-kaset-deep px-4 text-sm font-extrabold text-white"
                to="/app"
              >
                <Home aria-hidden="true" className="h-4 w-4" />
                กลับหน้าแรก
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
        )}
      </div>
    </div>
  );
}
