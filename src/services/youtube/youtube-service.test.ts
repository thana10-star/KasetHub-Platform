import { describe, expect, test } from 'vitest';
import {
  getLatestVideo,
  getYouTubeSourceStatus,
  listLatestVideos,
} from '@/services/youtube/youtube-service';
import type { ChannelVideo } from '@/services/youtube/youtube.types';

const realVideo: ChannelVideo = {
  id: 'real-owner-video',
  title: 'วิดีโอจริงจากช่อง',
  url: 'https://www.youtube.com/watch?v=real-owner-video',
  thumbnailUrl: 'https://img.youtube.com/vi/real-owner-video/hqdefault.jpg',
  publishedAt: '2026-05-20T00:00:00.000Z',
  description: 'รายการจริงที่เจ้าของระบบเลือกไว้',
  source: 'owner_curated',
  isReal: true,
  channelName: 'ช่องเรื่องเกษตร',
};

describe('YouTube latest video service', () => {
  test('returns source-pending status when no owner-curated videos exist', () => {
    const status = getYouTubeSourceStatus();

    expect(listLatestVideos()).toEqual([]);
    expect(status.state).toBe('source_pending');
    expect(status.videoCount).toBe(0);
    expect(status.hasChannelConfig).toBe(true);
    expect(status.channelUrl).toBe('https://www.youtube.com/@ruengkaset');
  });

  test('lists only real usable channel videos', () => {
    const videos = listLatestVideos([
      realVideo,
      {
        ...realVideo,
        id: 'not-real',
        title: 'ยังไม่ควรแสดง',
        isReal: false,
      },
      {
        ...realVideo,
        id: 'invalid-url',
        title: 'URL ไม่ปลอดภัย',
        url: 'javascript:alert(1)',
      },
    ]);

    expect(videos).toEqual([realVideo]);
  });

  test('returns the newest real video by published date', () => {
    const olderVideo: ChannelVideo = {
      ...realVideo,
      id: 'older-video',
      title: 'วิดีโอเก่ากว่า',
      url: 'https://www.youtube.com/watch?v=older-video',
      publishedAt: '2026-05-10T00:00:00.000Z',
    };
    const newerVideo: ChannelVideo = {
      ...realVideo,
      id: 'newer-video',
      title: 'วิดีโอใหม่กว่า',
      url: 'https://www.youtube.com/watch?v=newer-video',
      publishedAt: '2026-05-21T00:00:00.000Z',
    };

    expect(getLatestVideo([olderVideo, newerVideo])).toEqual(newerVideo);
  });
});
