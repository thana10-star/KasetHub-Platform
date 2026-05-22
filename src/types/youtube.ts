export type VideoCategory =
  | 'เทคนิคปลูกพืช'
  | 'โรคพืชและแมลง'
  | 'ปุ๋ยและดิน'
  | 'เกษตรอินทรีย์'
  | 'ราคาพืชผล'
  | 'เครื่องมือเกษตร';

export type VideoSourceStatus = 'mock' | 'api_ready' | 'imported';

export type YouTubeChannelProfile = {
  channelId: string;
  name: string;
  handle: string;
  subscriberCount: number;
  subscriberCountLabel: string;
  dailyViews: number;
  dailyViewsLabel: string;
  description: string;
  contentPillars: VideoCategory[];
  youtubeUrl: string;
  latestVideoId: string;
  sourceStatus: VideoSourceStatus;
};

export type YouTubePlaylist = {
  playlistId: string;
  title: string;
  description: string;
  category: VideoCategory;
  videoIds: string[];
  sourceStatus: VideoSourceStatus;
};

export type YouTubeVideo = {
  videoId: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  duration: string;
  publishedAt: string;
  viewCount: number;
  playlistId: string;
  category: VideoCategory;
  tags: string[];
  isShort: boolean;
  sourceStatus: VideoSourceStatus;
  shareUrl: string;
};

export type SavedVideo = YouTubeVideo & {
  savedAt: string;
};
