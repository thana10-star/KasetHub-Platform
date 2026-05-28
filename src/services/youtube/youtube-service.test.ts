import { describe, expect, test } from 'vitest';
import {
  fetchLatestYouTubeVideoResponse,
  fetchYouTubeVideoLibraryResponse,
  getLatestVideo,
  getYouTubeSourceStatus,
  listLatestVideos,
  listLatestVideosWithBackendFallback,
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
    expect(status.status).toBe('not_configured');
    expect(status.source).toBe('none');
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
        id: 'unsafe-url',
        title: 'URL ไม่ปลอดภัย',
        url: 'javascript:alert(1)',
      },
      {
        ...realVideo,
        id: 'non-youtube-url',
        title: 'ไม่ใช่ YouTube',
        url: 'https://example.com/watch?v=real-owner-video',
      },
      {
        ...realVideo,
        id: 'channel-homepage',
        title: 'หน้าแรกช่องไม่ใช่วิดีโอ',
        url: 'https://www.youtube.com/@ruengkaset',
      },
      {
        ...realVideo,
        id: 'unsafe-thumbnail',
        title: 'ภาพหน้าปกไม่ปลอดภัย',
        thumbnailUrl: 'javascript:alert(1)',
      },
    ]);

    expect(videos).toEqual([realVideo]);
  });

  test('accepts short YouTube video links but not channel-only links', () => {
    const shortLinkVideo: ChannelVideo = {
      ...realVideo,
      id: 'short-link-video',
      url: 'https://youtu.be/realOwnerVideoId',
    };
    const shortsVideo: ChannelVideo = {
      ...realVideo,
      id: 'shorts-video',
      url: 'https://www.youtube.com/shorts/realOwnerVideoId',
    };

    expect(listLatestVideos([shortLinkVideo, shortsVideo])).toEqual([shortLinkVideo, shortsVideo]);
    expect(
      listLatestVideos([
        {
          ...realVideo,
          id: 'channel-only',
          url: 'https://www.youtube.com/@ruengkaset',
        },
      ]),
    ).toEqual([]);
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

  test('reports ready status for backend-normalized YouTube API videos without engagement stats', () => {
    const apiVideo: ChannelVideo = {
      ...realVideo,
      id: 'backend-normalized-video',
      videoId: 'backendVideoId',
      url: 'https://www.youtube.com/watch?v=backendVideoId',
      source: 'youtube_api',
      fetchedAt: '2026-05-28T03:00:00.000Z',
      sourceUrl: 'https://www.googleapis.com/youtube/v3/playlistItems',
    };
    const status = getYouTubeSourceStatus([apiVideo]);

    expect(status.state).toBe('ready');
    expect(status.status).toBe('ready');
    expect(status.source).toBe('youtube_api');
    expect(status.videoCount).toBe(1);
    expect(status.latestVideo).toEqual(apiVideo);
    expect(status.lastFetchedAt).toBe('2026-05-28T03:00:00.000Z');
    expect('viewCount' in apiVideo).toBe(false);
    expect('likeCount' in apiVideo).toBe(false);
    expect('commentCount' in apiVideo).toBe(false);
  });

  test('prefers backend-ready latest videos over manual fallback', () => {
    const manualVideo: ChannelVideo = {
      ...realVideo,
      id: 'manual-video',
      url: 'https://www.youtube.com/watch?v=manual-video',
      publishedAt: '2026-05-20T00:00:00.000Z',
    };
    const backendVideo: ChannelVideo = {
      ...realVideo,
      id: 'backend-video',
      videoId: 'backend-video',
      title: 'à¸§à¸´à¸”à¸µà¹‚à¸­à¸¥à¹ˆà¸²à¸ªà¸¸à¸”à¸ˆà¸²à¸ backend',
      url: 'https://www.youtube.com/watch?v=backend-video',
      source: 'youtube_api',
      publishedAt: '2026-05-28T00:00:00.000Z',
      fetchedAt: '2026-05-28T02:00:00.000Z',
    };

    expect(
      listLatestVideosWithBackendFallback(
        {
          status: 'ready',
          channel: { handle: '@ruengkaset', url: 'https://www.youtube.com/@ruengkaset' },
          videos: [backendVideo],
        },
        [manualVideo],
      ),
    ).toEqual([backendVideo]);
  });

  test('falls back to manual videos when backend is not configured or errors', () => {
    expect(
      listLatestVideosWithBackendFallback(
        {
          status: 'error',
          channel: { handle: '@ruengkaset', url: 'https://www.youtube.com/@ruengkaset' },
          videos: [],
          errorMessage: 'backend unavailable',
        },
        [realVideo],
      ),
    ).toEqual([realVideo]);

    expect(
      listLatestVideosWithBackendFallback(
        {
          status: 'not_configured',
          channel: { handle: '@ruengkaset', url: 'https://www.youtube.com/@ruengkaset' },
          videos: [],
        },
        [],
      ),
    ).toEqual([]);
  });

  test('fetches latest and library backend responses through public endpoints', async () => {
    const calls: string[] = [];
    const fetcher = async (input: RequestInfo | URL) => {
      calls.push(String(input));

      return new Response(
        JSON.stringify({
          status: 'not_configured',
          channel: { handle: '@ruengkaset', url: 'https://www.youtube.com/@ruengkaset' },
          videos: [],
        }),
        {
          headers: { 'Content-Type': 'application/json' },
        },
      );
    };

    await fetchLatestYouTubeVideoResponse({ fetcher });
    await fetchYouTubeVideoLibraryResponse({ fetcher });

    expect(calls).toEqual(['/api/youtube/latest', '/api/youtube/videos']);
  });
});
