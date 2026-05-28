import { handleYouTubeVideosRequest } from './videos';

type YouTubeLatestFunctionContext = {
  env?: {
    YOUTUBE_API_KEY?: string;
    YOUTUBE_CHANNEL_ID?: string;
    YOUTUBE_CHANNEL_HANDLE?: string;
    YOUTUBE_CACHE_TTL_SECONDS?: string;
  };
  request: Request;
};

export function onRequestGet(context: YouTubeLatestFunctionContext) {
  return handleYouTubeVideosRequest(context, {
    maxResults: 1,
    includeNextPageToken: false,
  });
}
