import { youtubeChannelProfile, youtubeVideos } from '@/data/youtubeData';
import { youtubeChannelHandle, youtubeChannelUrl } from '@/config/channel';
import { mapYoutubeCategoryToContentCategory, videoContentItems } from '@/services/content/content-fixtures';
import type { ContentCategory, ContentDifficulty, VideoContent } from '@/services/content/content.types';
import type { YouTubeVideo } from '@/types/youtube';

export type YouTubeImportCandidate = {
  videoId: string;
  title: string;
  sourceStatus: YouTubeVideo['sourceStatus'];
  importStatus: VideoContent['importStatus'];
  proposedCategory: ContentCategory;
  proposedDifficulty: ContentDifficulty;
  proposedContentRoute: string;
  ownershipCheck: 'needs_owner_confirmation' | 'mock_owner_channel';
  editorReview: 'ready_for_outline' | 'needs_transcript' | 'needs_safety_review';
  notes: string[];
};

export type YouTubeImportPlan = {
  mode: 'mock_no_network';
  channelId: string;
  channelHandle: string;
  channelUrl: string;
  sourceVideoCount: number;
  candidateCount: number;
  readyForOutlineCount: number;
  needsTranscriptCount: number;
  candidates: YouTubeImportCandidate[];
  workflow: string[];
  boundaries: string[];
};

function findVideoContent(videoId: string) {
  return videoContentItems.find((item) => item.videoId === videoId);
}

function classifyEditorReview(video: YouTubeVideo): YouTubeImportCandidate['editorReview'] {
  if (video.isShort) {
    return 'needs_transcript';
  }

  if (video.category === 'โรคพืชและแมลง') {
    return 'needs_safety_review';
  }

  return 'ready_for_outline';
}

export function buildYouTubeImportCandidate(video: YouTubeVideo): YouTubeImportCandidate {
  const videoContent = findVideoContent(video.videoId);
  const editorReview = classifyEditorReview(video);

  return {
    videoId: video.videoId,
    title: video.title,
    sourceStatus: video.sourceStatus,
    importStatus: videoContent?.importStatus ?? 'planned',
    proposedCategory: mapYoutubeCategoryToContentCategory(video.category),
    proposedDifficulty: video.isShort ? 'beginner' : 'intermediate',
    proposedContentRoute: `/app/youtube/${video.videoId}`,
    ownershipCheck: video.sourceStatus === 'api_ready' ? 'mock_owner_channel' : 'needs_owner_confirmation',
    editorReview,
    notes: [
      video.isShort ? 'Short-form video should become a quick tip or checklist, not a full article.' : 'Long-form video can become an editor-reviewed article outline.',
      video.category === 'โรคพืชและแมลง' ? 'Disease guidance needs safety review before publishing as written advice.' : 'Category maps into the M20 content taxonomy.',
      'Planner uses local YouTube fixtures only and does not call YouTube Data API.',
    ],
  };
}

export function buildYouTubeImportPlan(): YouTubeImportPlan {
  const candidates = youtubeVideos.map(buildYouTubeImportCandidate);

  return {
    mode: 'mock_no_network',
    channelId: youtubeChannelProfile.channelId,
    channelHandle: youtubeChannelHandle,
    channelUrl: youtubeChannelUrl,
    sourceVideoCount: youtubeVideos.length,
    candidateCount: candidates.length,
    readyForOutlineCount: candidates.filter((candidate) => candidate.editorReview === 'ready_for_outline').length,
    needsTranscriptCount: candidates.filter((candidate) => candidate.editorReview === 'needs_transcript').length,
    candidates,
    workflow: [
      `Confirm the video belongs to the owner channel ${youtubeChannelHandle} or a licensed source.`,
      'Create an article outline from title, description, tags, and future transcript.',
      'Map content category, difficulty, related videos, and safety notes.',
      'Send disease, pesticide, fertilizer, and pricing claims through editor review before publishing.',
      'Publish only after backend-owned CMS and audit log are available.',
    ],
    boundaries: [
      'No YouTube API request is made.',
      'No transcript fetch or video download is attempted.',
      'No CMS record, article, or video row is written.',
      'No ownership claim is trusted without future backend verification.',
    ],
  };
}
