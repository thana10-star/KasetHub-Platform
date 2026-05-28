import { normalizeYouTubePlaylistItems } from '../../../src/services/youtube/youtube-cloudflare-normalizer';
import type { YouTubePlaylistItemsApiResponse } from '../../../src/services/youtube/youtube-cloudflare-normalizer';
import type {
  YouTubeLatestBackendChannel,
  YouTubeLatestBackendResponse,
} from '../../../src/services/youtube/youtube-backend-adapter.types';

const DEFAULT_CHANNEL_HANDLE = '@ruengkaset';
const DEFAULT_CACHE_TTL_SECONDS = 21_600;
const MAX_RESULTS_LIMIT = 50;
const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';

type YouTubeFunctionEnv = {
  YOUTUBE_API_KEY?: string;
  YOUTUBE_CHANNEL_ID?: string;
  YOUTUBE_CHANNEL_HANDLE?: string;
  YOUTUBE_CACHE_TTL_SECONDS?: string;
};

type YouTubeFunctionContext = {
  env?: YouTubeFunctionEnv;
  request: Request;
};

type YouTubeFunctionOptions = {
  maxResults?: number;
  includeNextPageToken?: boolean;
  fetcher?: typeof fetch;
  now?: Date;
};

type YouTubeChannelApiItem = {
  id?: string;
  snippet?: {
    title?: string;
    customUrl?: string;
  };
  contentDetails?: {
    relatedPlaylists?: {
      uploads?: string;
    };
  };
};

type YouTubeChannelApiResponse = {
  items?: YouTubeChannelApiItem[];
};

type CachedYouTubeResponse = {
  expiresAt: number;
  response: YouTubeLatestBackendResponse;
};

const responseCache = new Map<string, CachedYouTubeResponse>();

function cleanOptionalValue(value?: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function getEnvValue(env: YouTubeFunctionEnv | undefined, key: keyof YouTubeFunctionEnv) {
  return cleanOptionalValue(env?.[key]);
}

function parseCacheTtlSeconds(env: YouTubeFunctionEnv | undefined) {
  const parsed = Number(getEnvValue(env, 'YOUTUBE_CACHE_TTL_SECONDS'));
  return Number.isFinite(parsed) && parsed > 0 ? Math.min(Math.floor(parsed), 86_400) : DEFAULT_CACHE_TTL_SECONDS;
}

function getOwnerHandle(env: YouTubeFunctionEnv | undefined) {
  return getEnvValue(env, 'YOUTUBE_CHANNEL_HANDLE') ?? DEFAULT_CHANNEL_HANDLE;
}

function getOwnerChannelUrl(handle: string, channelId?: string) {
  if (handle) return `https://www.youtube.com/${handle.startsWith('@') ? handle : `@${handle}`}`;
  return channelId ? `https://www.youtube.com/channel/${channelId}` : 'https://www.youtube.com/@ruengkaset';
}

function cloneResponse(response: YouTubeLatestBackendResponse): YouTubeLatestBackendResponse {
  return {
    ...response,
    channel: { ...response.channel },
    videos: response.videos.map((video) => ({ ...video })),
  };
}

function buildJsonResponse(body: YouTubeLatestBackendResponse, cacheTtlSeconds: number) {
  const headers = new Headers({
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control':
      body.status === 'ready' || body.status === 'stale'
        ? `public, max-age=${cacheTtlSeconds}, stale-while-revalidate=${cacheTtlSeconds}`
        : 'no-store',
  });

  return new Response(JSON.stringify(body), {
    status: 200,
    headers,
  });
}

function buildNotConfiguredResponse(env: YouTubeFunctionEnv | undefined, cacheTtlSeconds: number) {
  const handle = getOwnerHandle(env);
  const channelId = getEnvValue(env, 'YOUTUBE_CHANNEL_ID');

  return buildJsonResponse(
    {
      status: 'not_configured',
      channel: {
        id: channelId,
        channelId,
        handle,
        channelHandle: handle,
        url: getOwnerChannelUrl(handle, channelId),
        channelUrl: getOwnerChannelUrl(handle, channelId),
      },
      cacheTtlSeconds,
      videos: [],
      errorMessage: 'YouTube server API key is not configured.',
    },
    cacheTtlSeconds,
  );
}

async function fetchYouTubeJson<T>(
  path: string,
  params: Record<string, string>,
  apiKey: string,
  fetcher: typeof fetch,
) {
  const url = new URL(`${YOUTUBE_API_BASE_URL}/${path}`);

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });
  url.searchParams.set('key', apiKey);

  const response = await fetcher(url.toString(), {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`YouTube API request failed with status ${response.status}.`);
  }

  return (await response.json()) as T;
}

async function resolveChannel(
  env: YouTubeFunctionEnv | undefined,
  apiKey: string,
  fetcher: typeof fetch,
): Promise<{ channel: YouTubeLatestBackendChannel; uploadsPlaylistId: string }> {
  const configuredChannelId = getEnvValue(env, 'YOUTUBE_CHANNEL_ID');
  const configuredHandle = getOwnerHandle(env);
  const channelRequestParams: Record<string, string> = {
    part: 'contentDetails,snippet',
  };

  if (configuredChannelId) {
    channelRequestParams.id = configuredChannelId;
  } else {
    channelRequestParams.forHandle = configuredHandle.replace(/^@/, '');
  }

  let channelResponse = await fetchYouTubeJson<YouTubeChannelApiResponse>(
    'channels',
    channelRequestParams,
    apiKey,
    fetcher,
  );

  if (!configuredChannelId && !channelResponse.items?.[0] && configuredHandle.startsWith('@')) {
    channelResponse = await fetchYouTubeJson<YouTubeChannelApiResponse>(
      'channels',
      {
        part: 'contentDetails,snippet',
        forHandle: configuredHandle,
      },
      apiKey,
      fetcher,
    );
  }

  const channelItem = channelResponse.items?.[0];
  const channelId = cleanOptionalValue(channelItem?.id) ?? configuredChannelId;
  const uploadsPlaylistId = cleanOptionalValue(channelItem?.contentDetails?.relatedPlaylists?.uploads);

  if (!channelItem || !channelId || !uploadsPlaylistId) {
    throw new Error('Owner YouTube channel could not be resolved.');
  }

  const handle = cleanOptionalValue(channelItem.snippet?.customUrl) ?? configuredHandle;
  const url = getOwnerChannelUrl(handle, channelId);
  const title = cleanOptionalValue(channelItem.snippet?.title);

  return {
    uploadsPlaylistId,
    channel: {
      id: channelId,
      channelId,
      handle,
      channelHandle: handle,
      title,
      channelName: title,
      url,
      channelUrl: url,
      uploadsPlaylistId,
    },
  };
}

function getRequestedMaxResults(context: YouTubeFunctionContext, options: YouTubeFunctionOptions) {
  const requested = Number(new URL(context.request.url).searchParams.get('maxResults') ?? options.maxResults ?? MAX_RESULTS_LIMIT);
  if (!Number.isFinite(requested)) return options.maxResults ?? MAX_RESULTS_LIMIT;

  return Math.max(1, Math.min(Math.floor(requested), options.maxResults ?? MAX_RESULTS_LIMIT, MAX_RESULTS_LIMIT));
}

function buildCacheKey(env: YouTubeFunctionEnv | undefined, maxResults: number) {
  return `${getEnvValue(env, 'YOUTUBE_CHANNEL_ID') ?? getOwnerHandle(env)}:${maxResults}`;
}

function getFreshCachedResponse(cacheKey: string, nowMs: number) {
  const cached = responseCache.get(cacheKey);
  if (!cached || cached.expiresAt <= nowMs) return undefined;

  return cloneResponse(cached.response);
}

function getStaleCachedResponse(cacheKey: string, errorMessage: string) {
  const cached = responseCache.get(cacheKey);
  if (!cached) return undefined;

  return {
    ...cloneResponse(cached.response),
    status: 'stale',
    errorMessage,
  } satisfies YouTubeLatestBackendResponse;
}

export async function handleYouTubeVideosRequest(
  context: YouTubeFunctionContext,
  options: YouTubeFunctionOptions = {},
) {
  const env = context.env;
  const apiKey = getEnvValue(env, 'YOUTUBE_API_KEY');
  const cacheTtlSeconds = parseCacheTtlSeconds(env);
  const now = options.now ?? new Date();
  const fetchedAt = now.toISOString();

  if (!apiKey) {
    return buildNotConfiguredResponse(env, cacheTtlSeconds);
  }

  const maxResults = getRequestedMaxResults(context, options);
  const cacheKey = buildCacheKey(env, maxResults);
  const freshCachedResponse = getFreshCachedResponse(cacheKey, now.getTime());

  if (freshCachedResponse) {
    return buildJsonResponse(freshCachedResponse, cacheTtlSeconds);
  }

  try {
    const fetcher = options.fetcher ?? fetch;
    const { channel, uploadsPlaylistId } = await resolveChannel(env, apiKey, fetcher);
    const playlistResponse = await fetchYouTubeJson<YouTubePlaylistItemsApiResponse>(
      'playlistItems',
      {
        part: 'snippet,contentDetails',
        playlistId: uploadsPlaylistId,
        maxResults: String(maxResults),
      },
      apiKey,
      fetcher,
    );
    const videos = normalizeYouTubePlaylistItems({
      apiResponse: playlistResponse,
      channelName: channel.title ?? channel.channelName,
      fetchedAt,
      sourceUrl: `${YOUTUBE_API_BASE_URL}/playlistItems`,
    });
    const responseBody: YouTubeLatestBackendResponse = {
      status: 'ready',
      channel,
      fetchedAt,
      cacheTtlSeconds,
      videos,
      ...(options.includeNextPageToken === false ? {} : { nextPageToken: cleanOptionalValue(playlistResponse.nextPageToken) }),
    };

    responseCache.set(cacheKey, {
      expiresAt: now.getTime() + cacheTtlSeconds * 1000,
      response: cloneResponse(responseBody),
    });

    return buildJsonResponse(responseBody, cacheTtlSeconds);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'YouTube API request failed.';
    const staleResponse = getStaleCachedResponse(cacheKey, errorMessage);

    return buildJsonResponse(
      staleResponse ?? {
        status: 'error',
        channel: {
          handle: getOwnerHandle(env),
          channelHandle: getOwnerHandle(env),
          url: getOwnerChannelUrl(getOwnerHandle(env), getEnvValue(env, 'YOUTUBE_CHANNEL_ID')),
          channelUrl: getOwnerChannelUrl(getOwnerHandle(env), getEnvValue(env, 'YOUTUBE_CHANNEL_ID')),
        },
        fetchedAt,
        cacheTtlSeconds,
        videos: [],
        errorMessage,
      },
      cacheTtlSeconds,
    );
  }
}

export function onRequestGet(context: YouTubeFunctionContext) {
  return handleYouTubeVideosRequest(context, {
    maxResults: MAX_RESULTS_LIMIT,
  });
}
