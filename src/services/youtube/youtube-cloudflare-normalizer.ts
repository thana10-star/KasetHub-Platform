import type { ChannelVideo } from '@/services/youtube/youtube.types';

type YouTubeThumbnail = {
  url?: string;
};

type YouTubePlaylistItem = {
  contentDetails?: {
    videoId?: string;
    videoPublishedAt?: string;
  };
  snippet?: {
    title?: string;
    description?: string;
    publishedAt?: string;
    channelTitle?: string;
    resourceId?: {
      videoId?: string;
    };
    thumbnails?: {
      default?: YouTubeThumbnail;
      medium?: YouTubeThumbnail;
      high?: YouTubeThumbnail;
      standard?: YouTubeThumbnail;
      maxres?: YouTubeThumbnail;
    };
  };
};

export type YouTubePlaylistItemsApiResponse = {
  items?: YouTubePlaylistItem[];
  nextPageToken?: string;
};

type YouTubeVideoStatisticsItem = {
  id?: string;
  statistics?: {
    viewCount?: string;
  };
};

export type YouTubeVideosListApiResponse = {
  items?: YouTubeVideoStatisticsItem[];
};

type NormalizeYouTubePlaylistItemsInput = {
  apiResponse: YouTubePlaylistItemsApiResponse;
  statisticsResponse?: YouTubeVideosListApiResponse;
  channelName?: string;
  fetchedAt: string;
  sourceUrl: string;
};

function cleanOptionalValue(value?: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function selectThumbnailUrl(item: YouTubePlaylistItem) {
  const thumbnails = item.snippet?.thumbnails;

  return (
    cleanOptionalValue(thumbnails?.maxres?.url) ??
    cleanOptionalValue(thumbnails?.standard?.url) ??
    cleanOptionalValue(thumbnails?.high?.url) ??
    cleanOptionalValue(thumbnails?.medium?.url) ??
    cleanOptionalValue(thumbnails?.default?.url)
  );
}

function getVideoId(item: YouTubePlaylistItem) {
  return cleanOptionalValue(item.contentDetails?.videoId) ?? cleanOptionalValue(item.snippet?.resourceId?.videoId);
}

function parseYouTubeViewCount(value?: string) {
  const trimmed = cleanOptionalValue(value);
  if (!trimmed || !/^\d+$/.test(trimmed)) return undefined;

  const parsed = Number(trimmed);
  return Number.isSafeInteger(parsed) && parsed >= 0 ? parsed : undefined;
}

function buildViewCountByVideoId(apiResponse?: YouTubeVideosListApiResponse) {
  const viewCountByVideoId = new Map<string, number>();

  (apiResponse?.items ?? []).forEach((item) => {
    const videoId = cleanOptionalValue(item.id);
    const viewCount = parseYouTubeViewCount(item.statistics?.viewCount);

    if (videoId && viewCount !== undefined) {
      viewCountByVideoId.set(videoId, viewCount);
    }
  });

  return viewCountByVideoId;
}

export function getYouTubePlaylistVideoIds(apiResponse: YouTubePlaylistItemsApiResponse) {
  return Array.from(
    new Set((apiResponse.items ?? []).map(getVideoId).filter((videoId): videoId is string => Boolean(videoId))),
  );
}

export function normalizeYouTubePlaylistItems(input: NormalizeYouTubePlaylistItemsInput): ChannelVideo[] {
  const viewCountByVideoId = buildViewCountByVideoId(input.statisticsResponse);

  return (input.apiResponse.items ?? [])
    .map((item): ChannelVideo | undefined => {
      const videoId = getVideoId(item);
      const title = cleanOptionalValue(item.snippet?.title);
      const viewCount = videoId ? viewCountByVideoId.get(videoId) : undefined;

      if (!videoId || !title) return undefined;

      return {
        id: videoId,
        videoId,
        title,
        url: `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`,
        thumbnailUrl: selectThumbnailUrl(item),
        publishedAt: cleanOptionalValue(item.contentDetails?.videoPublishedAt) ?? cleanOptionalValue(item.snippet?.publishedAt),
        description: cleanOptionalValue(item.snippet?.description),
        source: 'youtube_api',
        isReal: true,
        channelName: cleanOptionalValue(item.snippet?.channelTitle) ?? input.channelName,
        fetchedAt: input.fetchedAt,
        sourceUrl: input.sourceUrl,
        ...(viewCount === undefined ? {} : { viewCount }),
      } satisfies ChannelVideo;
    })
    .filter((video): video is ChannelVideo => Boolean(video));
}
