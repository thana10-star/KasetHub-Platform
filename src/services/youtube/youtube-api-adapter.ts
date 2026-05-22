import { findYoutubeVideo, youtubeChannelProfile, youtubePlaylists, youtubeVideos } from '@/data/youtubeData';
import type { YouTubeApiAdapter, YouTubeApiVideoListRequest } from '@/services/youtube/youtube-api.types';

function filterMockVideos(request?: YouTubeApiVideoListRequest) {
  return youtubeVideos.filter((video) => {
    const matchesPlaylist = request?.playlistId ? video.playlistId === request.playlistId : true;
    const matchesSearch = request?.searchQuery
      ? `${video.title} ${video.description} ${video.tags.join(' ')}`
          .toLowerCase()
          .includes(request.searchQuery.toLowerCase())
      : true;

    return matchesPlaylist && matchesSearch;
  });
}

export const youtubeApiAdapter: YouTubeApiAdapter = {
  async getChannelProfile() {
    return youtubeChannelProfile;
  },
  async listPlaylists() {
    return youtubePlaylists;
  },
  async listVideos(request) {
    return {
      videos: filterMockVideos(request),
      source: 'mock_only',
    };
  },
  async getVideoById(videoId) {
    return findYoutubeVideo(videoId);
  },
};

export const youtubeApiBoundaryNotes = [
  'M03 adapter is inert and never performs network requests.',
  'Future integration should call a backend endpoint, not YouTube Data API directly from the browser.',
  'Expected future fields include channel metadata, playlist membership, thumbnails, duration, statistics, and pagination tokens.',
  'API keys and refresh tokens must stay server-side.',
];
