import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  getSavedVideos,
  removeSavedVideo,
  saveVideo,
  subscribeSavedVideos,
  toggleSavedVideo,
} from '@/services/videos/saved-video-service';
import type { SavedVideo, YouTubeVideo } from '@/types/youtube';

export function useSavedVideos() {
  const [savedVideos, setSavedVideos] = useState<SavedVideo[]>([]);

  const refresh = useCallback(() => {
    setSavedVideos(getSavedVideos());
  }, []);

  useEffect(() => {
    refresh();
    return subscribeSavedVideos(refresh);
  }, [refresh]);

  const savedVideoIds = useMemo(() => new Set(savedVideos.map((video) => video.videoId)), [savedVideos]);

  const isSaved = useCallback(
    (videoId: string) => {
      return savedVideoIds.has(videoId);
    },
    [savedVideoIds],
  );

  const save = useCallback((video: YouTubeVideo) => {
    setSavedVideos(saveVideo(video));
  }, []);

  const remove = useCallback((videoId: string) => {
    setSavedVideos(removeSavedVideo(videoId));
  }, []);

  const toggle = useCallback((video: YouTubeVideo) => {
    setSavedVideos(toggleSavedVideo(video));
  }, []);

  return {
    savedVideos,
    savedCount: savedVideos.length,
    isSaved,
    save,
    remove,
    toggle,
  };
}
