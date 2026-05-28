import { describe, expect, test } from 'vitest';
import {
  fetchLatestYouTubeVideoResponse,
  fetchYouTubeVideoLibraryResponse,
  filterChannelVideosBySearch,
  formatYouTubeViewCount,
  getChannelVideoById,
  getChannelVideoDetailPath,
  getLatestVideo,
  getYouTubeSourceStatus,
  listLatestVideos,
  listLatestVideosWithBackendFallback,
  mergeUniqueChannelVideos,
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

  test('resolves backend videos by YouTube videoId for in-app detail routes', () => {
    const backendVideo: ChannelVideo = {
      ...realVideo,
      id: 'playlist-item-id',
      videoId: 'youtube-video-id',
      url: 'https://www.youtube.com/watch?v=youtube-video-id',
      source: 'youtube_api',
    };

    expect(getChannelVideoById('youtube-video-id', [backendVideo])).toEqual(backendVideo);
    expect(getChannelVideoDetailPath(backendVideo)).toBe('/app/youtube/youtube-video-id');
  });

  test('filters already-loaded videos by local title and description search', () => {
    const pondVideo: ChannelVideo = {
      ...realVideo,
      id: 'pond-search-video',
      title: 'ขุดสระเก็บน้ำ',
      url: 'https://www.youtube.com/watch?v=pond-search-video',
      description: 'วางผังบ่อให้เหมาะกับพื้นที่',
    };
    const fertilizerVideo: ChannelVideo = {
      ...realVideo,
      id: 'fertilizer-search-video',
      title: 'ดูแลดินก่อนปลูก',
      url: 'https://www.youtube.com/watch?v=fertilizer-search-video',
      description: 'สูตรปุ๋ยหมักและน้ำหมัก',
    };

    expect(filterChannelVideosBySearch([pondVideo, fertilizerVideo], 'ขุดสระ')).toEqual([pondVideo]);
    expect(filterChannelVideosBySearch([pondVideo, fertilizerVideo], 'น้ำหมัก')).toEqual([fertilizerVideo]);
    expect(filterChannelVideosBySearch([pondVideo, fertilizerVideo], '')).toEqual([pondVideo, fertilizerVideo]);
  });

  test('formats real YouTube view counts with Thai-friendly labels', () => {
    expect(formatYouTubeViewCount()).toBeNull();
    expect(formatYouTubeViewCount(-1)).toBeNull();
    expect(formatYouTubeViewCount(0)).toBe('0 ครั้ง');
    expect(formatYouTubeViewCount(999)).toBe('999 ครั้ง');
    expect(formatYouTubeViewCount(1200)).toBe('1.2 พันครั้ง');
    expect(formatYouTubeViewCount(12300)).toBe('1.2 หมื่นครั้ง');
    expect(formatYouTubeViewCount(1200000)).toBe('1.2 ล้านครั้ง');
    expect(formatYouTubeViewCount(4500, { includeViewedPrefix: true })).toBe('มีคนดูแล้ว 4.5 พันครั้ง');
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

  test('fetches paginated library responses with a page token query parameter', async () => {
    const calls: string[] = [];
    const fetcher = async (input: RequestInfo | URL) => {
      calls.push(String(input));

      return new Response(
        JSON.stringify({
          status: 'ready',
          channel: { handle: '@ruengkaset', url: 'https://www.youtube.com/@ruengkaset' },
          videos: [],
        }),
        {
          headers: { 'Content-Type': 'application/json' },
        },
      );
    };

    await fetchYouTubeVideoLibraryResponse({ fetcher, pageToken: 'NEXT TOKEN' });

    expect(calls).toEqual(['/api/youtube/videos?pageToken=NEXT%20TOKEN']);
  });

  test('merges paginated videos without duplicating overlapping video IDs', () => {
    const firstVideo: ChannelVideo = {
      ...realVideo,
      id: 'playlist-item-one',
      videoId: 'youtube-video-one',
      url: 'https://www.youtube.com/watch?v=youtube-video-one',
      source: 'youtube_api',
    };
    const duplicateVideo: ChannelVideo = {
      ...firstVideo,
      id: 'different-playlist-item-for-same-video',
    };
    const secondVideo: ChannelVideo = {
      ...realVideo,
      id: 'playlist-item-two',
      videoId: 'youtube-video-two',
      url: 'https://www.youtube.com/watch?v=youtube-video-two',
      source: 'youtube_api',
    };

    expect(mergeUniqueChannelVideos([firstVideo], [duplicateVideo, secondVideo])).toEqual([firstVideo, secondVideo]);
  });
});
