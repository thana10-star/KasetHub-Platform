import type { CommunityComment, CommunityPost } from '@/services/community/community.types';

export function getSafeCommunityComments(comments: CommunityComment[] | undefined | null) {
  return Array.isArray(comments) ? comments : [];
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

export function reconcileCommunityPostsAfterLikeRefresh(
  currentPosts: CommunityPost[],
  refreshedPosts: CommunityPost[],
  postId: string,
  nextLiked: boolean,
) {
  const optimisticPost = applyCommunityLikeUiState(currentPosts, postId, nextLiked).find((post) => post.id === postId);

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
