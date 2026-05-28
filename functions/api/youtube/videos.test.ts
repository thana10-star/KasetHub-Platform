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

  test('normalizes channel uploads playlist items without fake engagement stats', async () => {
    const fetcher = async (input: RequestInfo | URL) => {
      const url = new URL(String(input));

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
          YOUTUBE_CHANNEL_HANDLE: '@ruengkaset',
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
    expect(videos[0]).toMatchObject({
      id: 'video123',
      videoId: 'video123',
      title: 'ปลูกผักให้รอดช่วงฝน',
      url: 'https://www.youtube.com/watch?v=video123',
      thumbnailUrl: 'https://img.youtube.com/vi/video123/hqdefault.jpg',
      source: 'youtube_api',
      isReal: true,
      fetchedAt: '2026-05-28T02:00:00.000Z',
    });
    expect(videos[0].viewCount).toBeUndefined();
    expect(videos[0].likeCount).toBeUndefined();
    expect(videos[0].commentCount).toBeUndefined();
    expect(response.headers.get('Cache-Control')).toContain('max-age=21600');
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
