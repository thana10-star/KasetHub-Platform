import type { CommunityComment, CommunityPost, CommunityReadiness } from '@/services/community/community.types';
export {
  communityFallbackAuthorDisplayName,
  getCommunityAuthorDisplayName,
  getCommunityEmailLocalPart,
  getCommunityWriteAuthorDisplayName,
  sanitizeCommunityAuthorDisplayName,
} from '@/services/community/community-author-display';

export const communityCompactActionButtonClass = 'min-h-9 gap-1.5 px-3 text-xs';
export const communityCompactActionIconClass = 'h-3.5 w-3.5';
export const communityWriteDisabledCopy = 'ระบบเขียนโพสต์จะเปิดหลังตั้งค่าบัญชี';
export const communityDisabledImageCopy = 'แนบรูปได้เมื่อเปิดเขียนโพสต์';

type TextInputEventLike = {
  target?: unknown;
};

export function getSafeCommunityComments(comments: CommunityComment[] | undefined | null) {
  return Array.isArray(comments) ? comments : [];
}

export function getTopLevelCommunityComments(comments: CommunityComment[] | undefined | null) {
  return getSafeCommunityComments(comments).filter((comment) => !comment.parentCommentId);
}

export function getCommunityRepliesForComment(
  comments: CommunityComment[] | undefined | null,
  parentCommentId: string,
) {
  if (!parentCommentId) return [];

  return getSafeCommunityComments(comments).filter((comment) => comment.parentCommentId === parentCommentId);
}

export function getCommunityTextInputValue(event: TextInputEventLike) {
  const target = event.target as { value?: unknown } | null | undefined;
  return typeof target?.value === 'string' ? target.value : '';
}

export function updateCommunityCommentDraft(
  drafts: Record<string, string> | undefined | null,
  postId: string,
  value: string,
) {
  if (!postId) return drafts ?? {};

  return {
    ...(drafts ?? {}),
    [postId]: value,
  };
}

export function getCommunityCommentSubmitText(
  drafts: Record<string, string> | undefined | null,
  postId: string,
) {
  return (drafts?.[postId] ?? '').trim();
}

export function canUseTopLevelCommunityCommentSubmit(
  canWrite: boolean,
  postId: string | undefined | null,
  isSubmitting = false,
) {
  return Boolean(canWrite && postId && !isSubmitting);
}

export function formatCommunityTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('th-TH', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function getCommunityComposerStatusLabel(readiness: CommunityReadiness) {
  if (readiness.canWrite) return 'พร้อมใช้งาน';
  if (readiness.writesFeatureFlagEnabled && !readiness.hasAuthenticatedUser) return 'เข้าสู่ระบบก่อน';
  return 'ยังไม่เปิดเขียนโพสต์';
}

export function getCommunityComposerBadgeTone(readiness: CommunityReadiness) {
  if (readiness.canWrite) return 'green' as const;
  if (readiness.writesFeatureFlagEnabled && !readiness.hasAuthenticatedUser) return 'sky' as const;
  return 'gold' as const;
}

export function getCommunityWriteStatusCopy(readiness: CommunityReadiness) {
  if (readiness.canWrite) {
    return 'พร้อมเขียนโพสต์ คอมเมนต์ กดถูกใจ และรายงานได้แล้ว';
  }

  if (readiness.writesFeatureFlagEnabled && !readiness.hasAuthenticatedUser) {
    return 'เข้าสู่ระบบเพื่อเขียนโพสต์';
  }

  return `ตอนนี้อ่านและแชร์ได้ก่อน ${communityWriteDisabledCopy}`;
}

export function getCommunityComposerSubmitLabel(readiness: CommunityReadiness, isSubmitting = false) {
  if (isSubmitting) return 'กำลังส่ง';
  if (readiness.canWrite) return 'ส่งโพสต์';
  if (readiness.writesFeatureFlagEnabled && !readiness.hasAuthenticatedUser) {
    return 'เข้าสู่ระบบเพื่อเขียนโพสต์';
  }

  return 'เปิดใช้งานหลังตั้งค่าบัญชี';
}

export function getCommunityDisabledInputCopy(readiness: CommunityReadiness) {
  if (readiness.writesFeatureFlagEnabled && !readiness.hasAuthenticatedUser) {
    return 'เข้าสู่ระบบเพื่อเขียนโพสต์';
  }

  return communityWriteDisabledCopy;
}

export function applyCommunityLikeUiState(posts: CommunityPost[], postId: string, nextLiked: boolean) {
  return posts.map((post) => {
    if (post.id !== postId) return post;

    const wasLiked = Boolean(post.likedByCurrentUser);
    const currentCount = Math.max(0, post.likeCount ?? 0);
    const nextCount = nextLiked && !wasLiked
      ? currentCount + 1
      : !nextLiked && wasLiked
        ? Math.max(0, currentCount - 1)
        : currentCount;

    return {
      ...post,
      likedByCurrentUser: nextLiked,
      likeCount: nextCount,
    };
  });
}

export function applyCommunityCommentLikeUiState(
  comments: CommunityComment[],
  commentId: string,
  nextLiked: boolean,
) {
  return getSafeCommunityComments(comments).map((comment) => {
    if (comment.id !== commentId) return comment;

    const wasLiked = Boolean(comment.likedByCurrentUser);
    const currentCount = Math.max(0, comment.likeCount ?? 0);
    const nextCount = nextLiked && !wasLiked
      ? currentCount + 1
      : !nextLiked && wasLiked
        ? Math.max(0, currentCount - 1)
        : currentCount;

    return {
      ...comment,
      likedByCurrentUser: nextLiked,
      likeCount: nextCount,
    };
  });
}

export function reconcileCommunityPostsAfterLikeRefresh(
  currentPosts: CommunityPost[],
  refreshedPosts: CommunityPost[],
  postId: string,
  nextLiked: boolean,
) {
  const optimisticPost = applyCommunityLikeUiState(currentPosts, postId, nextLiked).find((post) => post.id === postId);
  const refreshedHasTargetPost = refreshedPosts.some((post) => post.id === postId);

  if (!refreshedHasTargetPost) {
    return optimisticPost ? applyCommunityLikeUiState(currentPosts, postId, nextLiked) : currentPosts;
  }

  return refreshedPosts.map((post) => {
    if (post.id !== postId || !optimisticPost) return post;

    return {
      ...post,
      likedByCurrentUser: nextLiked,
      likeCount: nextLiked
        ? Math.max(post.likeCount ?? 0, optimisticPost.likeCount ?? 0)
        : Math.min(post.likeCount ?? 0, optimisticPost.likeCount ?? 0),
    };
  });
}

export function reconcileCommunityCommentsAfterLikeRefresh(
  currentComments: CommunityComment[],
  refreshedComments: CommunityComment[],
  commentId: string,
  nextLiked: boolean,
) {
  const optimisticComment = applyCommunityCommentLikeUiState(
    currentComments,
    commentId,
    nextLiked,
  ).find((comment) => comment.id === commentId);
  const refreshedHasTargetComment = refreshedComments.some((comment) => comment.id === commentId);

  if (!refreshedHasTargetComment) {
    return optimisticComment ? applyCommunityCommentLikeUiState(currentComments, commentId, nextLiked) : currentComments;
  }

  return refreshedComments.map((comment) => {
    if (comment.id !== commentId || !optimisticComment) return comment;

    return {
      ...comment,
      likedByCurrentUser: nextLiked,
      likeCount: nextLiked
        ? Math.max(comment.likeCount ?? 0, optimisticComment.likeCount ?? 0)
        : Math.min(comment.likeCount ?? 0, optimisticComment.likeCount ?? 0),
    };
  });
}
