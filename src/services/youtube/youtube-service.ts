import { youtubeChannelHandle, youtubeChannelUrl } from '@/config/channel';
import { ownerCuratedYoutubeVideos } from '@/services/youtube/youtube-manual-data';
import {
  youtubeLatestBackendEndpointPath,
  youtubeVideoLibraryBackendEndpointPath,
  type YouTubeLatestBackendResponse,
} from '@/services/youtube/youtube-backend-adapter.types';
import type { ChannelVideo, YouTubeSourceStatus } from '@/services/youtube/youtube.types';

function cleanOptionalValue(value?: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function hasConfiguredChannel() {
  return Boolean(cleanOptionalValue(youtubeChannelUrl) || cleanOptionalValue(youtubeChannelHandle));
}

function parseSafeHttpUrl(url: string) {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === 'https:' || parsedUrl.protocol === 'http:' ? parsedUrl : undefined;
  } catch {
    return undefined;
  }
}

function hasSafeVideoUrl(url: string) {
  const parsedUrl = parseSafeHttpUrl(url);
  if (!parsedUrl) return false;

  if (['youtube.com', 'www.youtube.com', 'm.youtube.com'].includes(parsedUrl.hostname)) {
    if (parsedUrl.pathname === '/watch') {
      return Boolean(parsedUrl.searchParams.get('v')?.trim());
    }

    const pathParts = parsedUrl.pathname.split('/').filter(Boolean);
    return ['shorts', 'embed'].includes(pathParts[0] ?? '') && Boolean(pathParts[1]?.trim());
  }

  if (parsedUrl.hostname === 'youtu.be') {
    return parsedUrl.pathname.split('/').filter(Boolean).length === 1;
  }

  return false;
}

function hasSafeThumbnailUrl(url?: string) {
  return url ? Boolean(parseSafeHttpUrl(url)) : true;
}

function getPublishedAtTime(video: ChannelVideo) {
  if (!video.publishedAt) return 0;

  const publishedAtTime = Date.parse(video.publishedAt);
  return Number.isFinite(publishedAtTime) ? publishedAtTime : 0;
}

function formatCompactViewCount(value: number, divisor: number) {
  const rounded = Math.round((value / divisor) * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

export function formatYouTubeViewCount(value?: number) {
  if (value === undefined || !Number.isFinite(value) || value < 0) return null;

  const viewCount = Math.floor(value);

  if (viewCount < 1_000) return `${viewCount.toLocaleString('en-US')} ครั้ง`;
  if (viewCount < 10_000) return `${formatCompactViewCount(viewCount, 1_000)} พันครั้ง`;
  if (viewCount < 995_000) return `${formatCompactViewCount(viewCount, 10_000)} หมื่นครั้ง`;

  return `${formatCompactViewCount(viewCount, 1_000_000)} ล้านครั้ง`;
}

export function isUsableChannelVideo(video: ChannelVideo) {
  return Boolean(
    video.isReal &&
      video.source &&
      video.title.trim() &&
      video.url.trim() &&
      hasSafeVideoUrl(video.url) &&
      hasSafeThumbnailUrl(video.thumbnailUrl),
  );
}

export function listLatestVideos(videos: ChannelVideo[] = ownerCuratedYoutubeVideos) {
  if (!hasConfiguredChannel()) return [];

  return videos
    .filter(isUsableChannelVideo)
    .sort((left, right) => getPublishedAtTime(right) - getPublishedAtTime(left));
}

export function getLatestVideo(videos?: ChannelVideo[]) {
  return listLatestVideos(videos)[0];
}

export function listBackendVideosFromResponse(response?: YouTubeLatestBackendResponse | null) {
  if (!response || !['ready', 'stale'].includes(response.status)) return [];

  return listLatestVideos(response.videos);
}

export function listLatestVideosWithBackendFallback(
  response?: YouTubeLatestBackendResponse | null,
  manualVideos: ChannelVideo[] = ownerCuratedYoutubeVideos,
) {
  const backendVideos = listBackendVideosFromResponse(response);

  return backendVideos.length > 0 ? backendVideos : listLatestVideos(manualVideos);
}

type YouTubeBackendFetchOptions = {
  endpointPath?: string;
  fetcher?: typeof fetch;
};

async function fetchYouTubeBackendResponse(options: YouTubeBackendFetchOptions) {
  const fetcher = options.fetcher ?? globalThis.fetch;

  if (!fetcher) return undefined;

  try {
    const response = await fetcher(options.endpointPath ?? youtubeVideoLibraryBackendEndpointPath, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) return undefined;

    const payload = (await response.json()) as YouTubeLatestBackendResponse;
    return payload;
  } catch {
    return undefined;
  }
}

export function fetchLatestYouTubeVideoResponse(options: YouTubeBackendFetchOptions = {}) {
  return fetchYouTubeBackendResponse({
    ...options,
    endpointPath: options.endpointPath ?? youtubeLatestBackendEndpointPath,
  });
}

export function fetchYouTubeVideoLibraryResponse(options: YouTubeBackendFetchOptions = {}) {
  return fetchYouTubeBackendResponse({
    ...options,
    endpointPath: options.endpointPath ?? youtubeVideoLibraryBackendEndpointPath,
  });
}

export function getChannelVideoRouteId(video: ChannelVideo) {
  return video.videoId?.trim() || video.id;
}

export function getChannelVideoDetailPath(video: ChannelVideo) {
  return `/app/youtube/${encodeURIComponent(getChannelVideoRouteId(video))}`;
}

export function getChannelVideoById(videoId: string, videos: ChannelVideo[] = ownerCuratedYoutubeVideos) {
  const requestedVideoId = videoId.trim();

  if (!requestedVideoId) return undefined;

  return listLatestVideos(videos).find(
    (video) => video.id === requestedVideoId || video.videoId?.trim() === requestedVideoId,
  );
}

function normalizeVideoSearchTerm(searchTerm: string) {
  return searchTerm.trim().toLocaleLowerCase('th-TH');
}

export function filterChannelVideosBySearch(videos: ChannelVideo[], searchTerm: string) {
  const normalizedSearchTerm = normalizeVideoSearchTerm(searchTerm);

  if (!normalizedSearchTerm) return videos;

  return videos.filter((video) =>
    [video.title, video.description ?? ''].some((value) =>
      value.toLocaleLowerCase('th-TH').includes(normalizedSearchTerm),
    ),
  );
}

export function getYouTubeSourceStatus(videos: ChannelVideo[] = ownerCuratedYoutubeVideos): YouTubeSourceStatus {
  const latestVideos = listLatestVideos(videos);
  const latestVideo = latestVideos[0];
  const hasChannelConfig = hasConfiguredChannel();

  if (latestVideo) {
    return {
      state: 'ready',
      status: 'ready',
      source: latestVideo.source,
      hasChannelConfig,
      channelUrl: cleanOptionalValue(youtubeChannelUrl),
      channelHandle: cleanOptionalValue(youtubeChannelHandle),
      videoCount: latestVideos.length,
      latestVideo,
      lastFetchedAt: latestVideo.fetchedAt,
      message:
        latestVideo.source === 'youtube_api'
          ? 'Backend-normalized YouTube videos are ready.'
          : 'Owner-curated YouTube videos are ready.',
    };
  }

  return {
    state: 'source_pending',
    status: 'not_configured',
    source: 'none',
    hasChannelConfig,
    channelUrl: cleanOptionalValue(youtubeChannelUrl),
    channelHandle: cleanOptionalValue(youtubeChannelHandle),
    videoCount: 0,
    message: hasChannelConfig
      ? 'Owner channel config exists, but no real curated video entries have been added yet.'
      : 'No owner channel config or curated video entries are available yet.',
  };
}
