export type ChannelVideoSource = 'owner_curated' | 'youtube_api';

export type ChannelVideo = {
  id: string;
  videoId?: string;
  title: string;
  url: string;
  thumbnailUrl?: string;
  publishedAt?: string;
  description?: string;
  source: ChannelVideoSource;
  isReal: boolean;
  channelName?: string;
  fetchedAt?: string;
  sourceUrl?: string;
};

export type YouTubeSourceState = 'ready' | 'source_pending';
export type YouTubeBackendSourceStatus = 'not_configured' | 'ready' | 'error' | 'stale';
export type YouTubeBackendSource = ChannelVideoSource | 'none';

export type YouTubeSourceStatus = {
  state: YouTubeSourceState;
  status: YouTubeBackendSourceStatus;
  source: YouTubeBackendSource;
  hasChannelConfig: boolean;
  channelUrl?: string;
  channelHandle?: string;
  videoCount: number;
  latestVideo?: ChannelVideo;
  lastFetchedAt?: string;
  errorMessage?: string;
  message: string;
};
