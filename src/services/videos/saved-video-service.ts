import { findYoutubeVideo } from '@/data/youtubeData';
import {
  createVideoMemoryItem,
  getState,
  isSaved,
  saveItem,
  subscribeGuestMemory,
  unsaveItem,
} from '@/services/guest-memory/guest-memory-service';
import type { SavedVideo, YouTubeVideo } from '@/types/youtube';

function videoFromMemoryItem(item: ReturnType<typeof getState>['savedItems'][number]): SavedVideo | undefined {
  const videoFromMetadata = item.metadata.video as YouTubeVideo | SavedVideo | undefined;
  const fallbackVideo = findYoutubeVideo(item.itemId);
  const video = videoFromMetadata ?? fallbackVideo;

  if (!video) {
    return undefined;
  }

  return {
    ...video,
    savedAt: item.savedAt,
  };
}

export function getSavedVideos() {
  return getState()
    .savedItems.filter((item) => item.itemType === 'video')
    .map(videoFromMemoryItem)
    .filter((video): video is SavedVideo => Boolean(video));
}

export function isVideoSaved(videoId: string) {
  return isSaved('video', videoId);
}

export function saveVideo(video: YouTubeVideo) {
  saveItem(createVideoMemoryItem(video));
  return getSavedVideos();
}

export function removeSavedVideo(videoId: string) {
  unsaveItem('video', videoId);
  return getSavedVideos();
}

export function toggleSavedVideo(video: YouTubeVideo) {
  return isVideoSaved(video.videoId) ? removeSavedVideo(video.videoId) : saveVideo(video);
}

export function subscribeSavedVideos(listener: () => void) {
  return subscribeGuestMemory(listener);
}
