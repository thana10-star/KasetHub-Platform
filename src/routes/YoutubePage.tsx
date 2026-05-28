import { ExternalLink, Home, PlaySquare, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import {
  fetchYouTubeVideoLibraryResponse,
  filterChannelVideosBySearch,
  formatYouTubeViewCount,
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
  const viewCountLabel = formatYouTubeViewCount(video.viewCount, { includeViewedPrefix: true });
  const thumbnailMetaRows = [
    publishedAtLabel ? `เผยแพร่ ${publishedAtLabel}` : undefined,
    viewCountLabel ?? undefined,
  ].filter((part): part is string => Boolean(part));
  const canOpenInApp = Boolean(video.videoId?.trim());

  return (
    <Card className="overflow-hidden p-2.5">
      <div className="grid grid-cols-[112px_minmax(0,1fr)] items-start gap-2.5 sm:grid-cols-[136px_minmax(0,1fr)] sm:gap-3">
        <div className="min-w-0">
          <VideoPreview video={video} />
          {thumbnailMetaRows.length > 0 ? (
            <div className="mt-1.5 grid gap-0.5 text-[11px] font-semibold leading-4 text-slate-500 sm:text-xs sm:leading-5">
              {thumbnailMetaRows.map((row) => (
                <p className="break-words" key={row}>
                  {row}
                </p>
              ))}
            </div>
          ) : null}
        </div>
        <div className="min-w-0 pt-0.5">
          <p className="text-xs font-extrabold leading-5 text-sky-800">{video.channelName ?? 'KasetHub'}</p>
          <h2 className="break-words text-sm font-extrabold leading-5 text-kaset-ink [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] overflow-hidden sm:text-base sm:leading-6">
            {video.title}
          </h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {canOpenInApp ? (
              <Link
                className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg bg-kaset-deep px-3 text-xs font-extrabold text-white sm:text-sm"
                to={getChannelVideoDetailPath(video)}
              >
                ดูวิดีโอ
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
          </div>
        </div>
      </div>
    </Card>
  );
}

type YoutubePageProps = {
  backendResponse?: YouTubeVideoLibraryBackendResponse | null;
  fetchVideoLibraryResponse?: () => Promise<YouTubeVideoLibraryBackendResponse | undefined>;
  initialSearchTerm?: string;
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
  initialSearchTerm = '',
  videos: videoInput,
}: YoutubePageProps = {}) {
  const [fetchedBackendResponse, setFetchedBackendResponse] = useState<YouTubeVideoLibraryBackendResponse | undefined>();
  const [hasFetchedVideoLibraryResponse, setHasFetchedVideoLibraryResponse] = useState(false);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const effectiveBackendResponse = backendResponse ?? fetchedBackendResponse;
  const videos =
    videoInput === undefined ? listLatestVideosWithBackendFallback(effectiveBackendResponse) : listLatestVideos(videoInput);
  const filteredVideos = filterChannelVideosBySearch(videos, searchTerm);
  const sourceStatus = getYouTubeSourceStatus(videos);
  const hasVideos = videos.length > 0;
  const hasSearchTerm = searchTerm.trim().length > 0;
  const hasFilteredVideos = filteredVideos.length > 0;
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
            <Card className="p-3">
              <label className="text-sm font-extrabold leading-6 text-kaset-ink" htmlFor="youtube-channel-search">
                ค้นหาวิดีโอในช่อง
              </label>
              <div className="mt-2 grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
                <div className="relative min-w-0">
                  <Search
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    className="min-h-11 w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm font-semibold text-kaset-ink outline-none transition placeholder:text-slate-400 focus:border-kaset-deep focus:ring-2 focus:ring-kaset-deep/10"
                    id="youtube-channel-search"
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="ค้นหาเรื่องที่สนใจ เช่น ขุดสระ ปุ๋ย น้ำ"
                    type="search"
                    value={searchTerm}
                  />
                </div>
                {hasSearchTerm ? (
                  <button
                    className="inline-flex min-h-11 items-center justify-center rounded-lg bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/12"
                    onClick={() => setSearchTerm('')}
                    type="button"
                  >
                    ล้างคำค้น
                  </button>
                ) : null}
              </div>
            </Card>
            <div className="grid gap-3">
              {hasFilteredVideos ? (
                filteredVideos.map((video) => <ChannelVideoCard key={video.id} video={video} />)
              ) : (
                <Card className="p-5 text-center">
                  <h3 className="text-lg font-extrabold leading-7 text-kaset-ink">ไม่พบวิดีโอที่ตรงกับคำค้น</h3>
                  <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
                    ลองใช้คำค้นอื่น หรือดูรายการวิดีโอทั้งหมดจากช่อง
                  </p>
                  <button
                    className="mt-4 inline-flex min-h-11 items-center justify-center rounded-lg bg-kaset-deep px-4 text-sm font-extrabold text-white"
                    onClick={() => setSearchTerm('')}
                    type="button"
                  >
                    ล้างคำค้น
                  </button>
                </Card>
              )}
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
