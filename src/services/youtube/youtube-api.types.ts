import type { YouTubeChannelProfile, YouTubePlaylist, YouTubeVideo } from '@/types/youtube';

export type YouTubeApiConnectionStatus = 'mock_only' | 'ready_for_api' | 'connected';

export type YouTubeApiVideoListRequest = {
  channelId?: string;
  playlistId?: string;
  searchQuery?: string;
  pageToken?: string;
  maxResults?: number;
};

export type YouTubeApiVideoListResponse = {
  videos: YouTubeVideo[];
  nextPageToken?: string;
  source: YouTubeApiConnectionStatus;
};

export type YouTubeApiAdapter = {
  getChannelProfile: () => Promise<YouTubeChannelProfile>;
  listPlaylists: () => Promise<YouTubePlaylist[]>;
  listVideos: (request?: YouTubeApiVideoListRequest) => Promise<YouTubeApiVideoListResponse>;
  getVideoById: (videoId: string) => Promise<YouTubeVideo | undefined>;
};
