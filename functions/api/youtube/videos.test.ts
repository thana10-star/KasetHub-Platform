import { describe, expect, test } from 'vitest';
import { onRequestGet as latestOnRequestGet } from './latest';
import { handleYouTubeVideosRequest, onRequestGet as videosOnRequestGet } from './videos';

const request = new Request('https://kasethub.example/api/youtube/videos');

function jsonResponse(response: Response) {
  return response.json() as Promise<Record<string, unknown>>;
}

function createJsonResponse(payload: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(payload), {
    status: init?.status ?? 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

describe('M127 YouTube Cloudflare Pages Functions', () => {
  test('latest endpoint returns not_configured without a server key', async () => {
    const response = await latestOnRequestGet({ request });
    const payload = await jsonResponse(response);

    expect(payload.status).toBe('not_configured');
    expect(payload.videos).toEqual([]);
    expect(response.headers.get('Cache-Control')).toBe('no-store');
  });

  test('videos endpoint returns not_configured without a server key', async () => {
    const response = await videosOnRequestGet({ request });
    const payload = await jsonResponse(response);

    expect(payload.status).toBe('not_configured');
    expect(payload.videos).toEqual([]);
    expect(payload.errorMessage).toBe('YouTube server API key is not configured.');
  });

  test('normalizes channel uploads playlist items with real view counts and without fake engagement stats', async () => {
    const calls: string[] = [];
    const fetcher = async (input: RequestInfo | URL) => {
      const url = new URL(String(input));
      calls.push(`${url.pathname}?${url.searchParams.toString()}`);

      if (url.pathname.endsWith('/channels')) {
        return createJsonResponse({
          items: [
            {
              id: 'UCowner',
              snippet: {
                title: 'เรื่องเกษตรที่คนไทยควรรู้',
                customUrl: '@ruengkaset',
              },
              contentDetails: {
                relatedPlaylists: {
                  uploads: 'UUowner',
                },
              },
            },
          ],
        });
      }

      if (url.pathname.endsWith('/videos')) {
        expect(url.searchParams.get('part')).toBe('statistics');
        expect(url.searchParams.get('id')).toBe('video123');

        return createJsonResponse({
          items: [
            {
              id: 'video123',
              statistics: {
                viewCount: '12300',
              },
            },
          ],
        });
      }

      return createJsonResponse({
        nextPageToken: 'NEXT',
        items: [
          {
            contentDetails: {
              videoId: 'video123',
              videoPublishedAt: '2026-05-28T01:00:00.000Z',
            },
            snippet: {
              title: 'ปลูกผักให้รอดช่วงฝน',
              description: 'คำแนะนำจากช่องจริง',
              channelTitle: 'เรื่องเกษตรที่คนไทยควรรู้',
              thumbnails: {
                high: {
                  url: 'https://img.youtube.com/vi/video123/hqdefault.jpg',
                },
              },
            },
          },
        ],
      });
    };

    const response = await handleYouTubeVideosRequest(
      {
        request,
        env: {
          YOUTUBE_API_KEY: 'test-key',
          YOUTUBE_CHANNEL_HANDLE: '@ruengkaset-m132-real-views',
          YOUTUBE_CACHE_TTL_SECONDS: '21600',
        },
      },
      {
        fetcher,
        now: new Date('2026-05-28T02:00:00.000Z'),
      },
    );
    const payload = await jsonResponse(response);
    const videos = payload.videos as Array<Record<string, unknown>>;

    expect(payload.status).toBe('ready');
    expect((payload.channel as Record<string, unknown>).handle).toBe('@ruengkaset');
    expect(payload.nextPageToken).toBe('NEXT');
    expect(videos).toHaveLength(1);
    expect(calls.some((call) => call.startsWith('/youtube/v3/videos?'))).toBe(true);
    expect(videos[0]).toMatchObject({
      id: 'video123',
      videoId: 'video123',
      title: 'ปลูกผักให้รอดช่วงฝน',
      url: 'https://www.youtube.com/watch?v=video123',
      thumbnailUrl: 'https://img.youtube.com/vi/video123/hqdefault.jpg',
      source: 'youtube_api',
      isReal: true,
      fetchedAt: '2026-05-28T02:00:00.000Z',
      viewCount: 12300,
    });
    expect(videos[0].likeCount).toBeUndefined();
    expect(videos[0].commentCount).toBeUndefined();
    expect(response.headers.get('Cache-Control')).toContain('max-age=21600');
  });

  test('passes pageToken to playlistItems pagination and keeps real view counts', async () => {
    const pagedRequest = new Request('https://kasethub.example/api/youtube/videos?pageToken=NEXT_PAGE');
    let requestedPlaylistPageToken: string | null = null;
    const fetcher = async (input: RequestInfo | URL) => {
      const url = new URL(String(input));

      if (url.pathname.endsWith('/channels')) {
        return createJsonResponse({
          items: [
            {
              id: 'UCownerPaged',
              snippet: {
                title: 'Owner channel paged',
                customUrl: '@ruengkaset',
              },
              contentDetails: {
                relatedPlaylists: {
                  uploads: 'UUownerPaged',
                },
              },
            },
          ],
        });
      }

      if (url.pathname.endsWith('/videos')) {
        return createJsonResponse({
          items: [
            {
              id: 'paged-video',
              statistics: {
                viewCount: '4500',
              },
            },
          ],
        });
      }

      requestedPlaylistPageToken = url.searchParams.get('pageToken');

      return createJsonResponse({
        nextPageToken: 'AFTER_NEXT_PAGE',
        items: [
          {
            contentDetails: {
              videoId: 'paged-video',
              videoPublishedAt: '2026-05-21T01:00:00.000Z',
            },
            snippet: {
              title: 'Paged video',
              channelTitle: 'Owner channel paged',
            },
          },
        ],
      });
    };

    const response = await handleYouTubeVideosRequest(
      {
        request: pagedRequest,
        env: {
          YOUTUBE_API_KEY: 'test-key',
          YOUTUBE_CHANNEL_HANDLE: '@ruengkaset-m134-paged',
        },
      },
      {
        fetcher,
        now: new Date('2026-05-28T05:00:00.000Z'),
      },
    );
    const payload = await jsonResponse(response);
    const videos = payload.videos as Array<Record<string, unknown>>;

    expect(payload.status).toBe('ready');
    expect(payload.nextPageToken).toBe('AFTER_NEXT_PAGE');
    expect(requestedPlaylistPageToken).toBe('NEXT_PAGE');
    expect(videos).toHaveLength(1);
    expect(videos[0]).toMatchObject({
      videoId: 'paged-video',
      viewCount: 4500,
    });
    expect(videos[0].likeCount).toBeUndefined();
    expect(videos[0].commentCount).toBeUndefined();
  });

  test('ignores missing or invalid view count statistics without fake defaults', async () => {
    const fetcher = async (input: RequestInfo | URL) => {
      const url = new URL(String(input));

      if (url.pathname.endsWith('/channels')) {
        return createJsonResponse({
          items: [
            {
              id: 'UCowner',
              snippet: {
                title: 'Owner channel',
                customUrl: '@ruengkaset',
              },
              contentDetails: {
                relatedPlaylists: {
                  uploads: 'UUowner',
                },
              },
            },
          ],
        });
      }

      if (url.pathname.endsWith('/videos')) {
        return createJsonResponse({
          items: [
            {
              id: 'invalid-count-video',
              statistics: {
                viewCount: 'not-a-number',
              },
            },
          ],
        });
      }

      return createJsonResponse({
        items: [
          {
            contentDetails: {
              videoId: 'invalid-count-video',
              videoPublishedAt: '2026-05-28T01:00:00.000Z',
            },
            snippet: {
              title: 'Video with invalid statistics',
              channelTitle: 'Owner channel',
            },
          },
        ],
      });
    };

    const response = await handleYouTubeVideosRequest(
      {
        request,
        env: {
          YOUTUBE_API_KEY: 'test-key',
          YOUTUBE_CHANNEL_HANDLE: '@ruengkaset-m132-invalid-stats',
        },
      },
      {
        fetcher,
        now: new Date('2026-05-28T03:00:00.000Z'),
      },
    );
    const payload = await jsonResponse(response);
    const videos = payload.videos as Array<Record<string, unknown>>;

    expect(payload.status).toBe('ready');
    expect(videos).toHaveLength(1);
    expect(videos[0].viewCount).toBeUndefined();
    expect(videos[0].likeCount).toBeUndefined();
    expect(videos[0].commentCount).toBeUndefined();
  });

  test('still returns real playlist videos when the statistics request fails', async () => {
    const fetcher = async (input: RequestInfo | URL) => {
      const url = new URL(String(input));

      if (url.pathname.endsWith('/channels')) {
        return createJsonResponse({
          items: [
            {
              id: 'UCowner',
              snippet: {
                title: 'Owner channel',
                customUrl: '@ruengkaset',
              },
              contentDetails: {
                relatedPlaylists: {
                  uploads: 'UUowner',
                },
              },
            },
          ],
        });
      }

      if (url.pathname.endsWith('/videos')) {
        return createJsonResponse({ error: { message: 'statistics unavailable' } }, { status: 503 });
      }

      return createJsonResponse({
        items: [
          {
            contentDetails: {
              videoId: 'stats-failed-video',
              videoPublishedAt: '2026-05-28T01:00:00.000Z',
            },
            snippet: {
              title: 'Video still shown when stats fail',
              channelTitle: 'Owner channel',
            },
          },
        ],
      });
    };

    const response = await handleYouTubeVideosRequest(
      {
        request,
        env: {
          YOUTUBE_API_KEY: 'test-key',
          YOUTUBE_CHANNEL_HANDLE: '@ruengkaset-m132-stats-fail',
        },
      },
      {
        fetcher,
        now: new Date('2026-05-28T04:00:00.000Z'),
      },
    );
    const payload = await jsonResponse(response);
    const videos = payload.videos as Array<Record<string, unknown>>;

    expect(payload.status).toBe('ready');
    expect(videos).toHaveLength(1);
    expect(videos[0]).toMatchObject({
      id: 'stats-failed-video',
      videoId: 'stats-failed-video',
      title: 'Video still shown when stats fail',
      source: 'youtube_api',
      isReal: true,
    });
    expect(videos[0].viewCount).toBeUndefined();
  });

  test('invalid channel API response returns error without fake videos', async () => {
    const response = await handleYouTubeVideosRequest(
      {
        request,
        env: {
          YOUTUBE_API_KEY: 'test-key',
          YOUTUBE_CHANNEL_HANDLE: '@broken-channel',
        },
      },
      {
        fetcher: async () => createJsonResponse({ items: [] }),
      },
    );
    const payload = await jsonResponse(response);

    expect(payload.status).toBe('error');
    expect(payload.videos).toEqual([]);
    expect(payload.errorMessage).toBe('Owner YouTube channel could not be resolved.');
  });
});
