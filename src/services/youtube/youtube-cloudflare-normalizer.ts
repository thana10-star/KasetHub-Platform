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

type NormalizeYouTubePlaylistItemsInput = {
  apiResponse: YouTubePlaylistItemsApiResponse;
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

export function normalizeYouTubePlaylistItems(input: NormalizeYouTubePlaylistItemsInput): ChannelVideo[] {
  return (input.apiResponse.items ?? [])
    .map((item): ChannelVideo | undefined => {
      const videoId = getVideoId(item);
      const title = cleanOptionalValue(item.snippet?.title);

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
      } satisfies ChannelVideo;
    })
    .filter((video): video is ChannelVideo => Boolean(video));
}
