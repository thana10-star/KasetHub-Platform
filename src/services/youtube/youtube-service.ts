import { youtubeChannelHandle, youtubeChannelUrl } from '@/config/channel';
import { ownerCuratedYoutubeVideos } from '@/services/youtube/youtube-manual-data';
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

export function getChannelVideoById(videoId: string, videos: ChannelVideo[] = ownerCuratedYoutubeVideos) {
  return listLatestVideos(videos).find((video) => video.id === videoId);
}

export function getYouTubeSourceStatus(videos: ChannelVideo[] = ownerCuratedYoutubeVideos): YouTubeSourceStatus {
  const latestVideos = listLatestVideos(videos);
  const latestVideo = latestVideos[0];
  const hasChannelConfig = hasConfiguredChannel();

  if (latestVideo) {
    return {
      state: 'ready',
      hasChannelConfig,
      channelUrl: cleanOptionalValue(youtubeChannelUrl),
      channelHandle: cleanOptionalValue(youtubeChannelHandle),
      videoCount: latestVideos.length,
      latestVideo,
      message: 'Owner-curated YouTube videos are ready.',
    };
  }

  return {
    state: 'source_pending',
    hasChannelConfig,
    channelUrl: cleanOptionalValue(youtubeChannelUrl),
    channelHandle: cleanOptionalValue(youtubeChannelHandle),
    videoCount: 0,
    message: hasChannelConfig
      ? 'Owner channel config exists, but no real curated video entries have been added yet.'
      : 'No owner channel config or curated video entries are available yet.',
  };
}
