export type ChannelVideoSource = 'owner_curated' | 'youtube_api';

export type ChannelVideo = {
  id: string;
  title: string;
  url: string;
  thumbnailUrl?: string;
  publishedAt?: string;
  description?: string;
  source: ChannelVideoSource;
  isReal: boolean;
  channelName?: string;
};

export type YouTubeSourceState = 'ready' | 'source_pending';

export type YouTubeSourceStatus = {
  state: YouTubeSourceState;
  hasChannelConfig: boolean;
  channelUrl?: string;
  channelHandle?: string;
  videoCount: number;
  latestVideo?: ChannelVideo;
  message: string;
};
