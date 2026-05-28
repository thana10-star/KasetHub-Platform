import type { ChannelVideo, YouTubeBackendSourceStatus } from '@/services/youtube/youtube.types';

export const youtubeLatestBackendEndpointPath = '/api/youtube/latest';
export const youtubeVideoLibraryBackendEndpointPath = '/api/youtube/videos';

export type YouTubeLatestBackendChannel = {
  id?: string;
  channelId?: string;
  handle?: string;
  channelHandle?: string;
  title?: string;
  url?: string;
  channelUrl?: string;
  channelName?: string;
  uploadsPlaylistId?: string;
};

export type YouTubeLatestBackendResponse = {
  status: YouTubeBackendSourceStatus;
  channel: YouTubeLatestBackendChannel;
  fetchedAt?: string;
  cacheTtlSeconds?: number;
  nextPageToken?: string;
  videos: ChannelVideo[];
  errorMessage?: string;
};

export type YouTubeVideoLibraryBackendResponse = YouTubeLatestBackendResponse;

export const youtubeLatestBackendContract = {
  endpointPath: youtubeLatestBackendEndpointPath,
  method: 'GET',
  videoSource: 'youtube_api',
  secretPlacement: 'server_only',
  frontendFallbackOrder: ['backend_normalized_videos', 'owner_curated_manual_videos', 'source_pending'],
} as const;

export const youtubeVideoLibraryBackendContract = {
  endpointPath: youtubeVideoLibraryBackendEndpointPath,
  method: 'GET',
  maxResults: 50,
  videoSource: 'youtube_api',
  secretPlacement: 'server_only',
  frontendFallbackOrder: ['backend_normalized_videos', 'owner_curated_manual_videos', 'source_pending'],
} as const;

export function buildNotConfiguredYouTubeLatestResponse(
  channel: YouTubeLatestBackendChannel = {},
): YouTubeLatestBackendResponse {
  return {
    status: 'not_configured',
    channel,
    videos: [],
  };
}
