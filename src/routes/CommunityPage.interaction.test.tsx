import { describe, expect, test } from 'vitest';
import {
  applyCommunityCommentLikeUiState,
  applyCommunityLikeUiState,
  canUseTopLevelCommunityCommentSubmit,
  getCommunityCommentSubmitText,
  getCommunityRepliesForComment,
  getCommunityTextInputValue,
  getSafeCommunityComments,
  getTopLevelCommunityComments,
  reconcileCommunityCommentsAfterLikeRefresh,
  reconcileCommunityPostsAfterLikeRefresh,
  updateCommunityCommentDraft,
} from '@/routes/community-page-helpers';
import type { CommunityComment, CommunityPost } from '@/services/community/community.types';
import { communityPostCategories } from '@/services/community/community.types';

const basePost: CommunityPost = {
  id: 'post-1',
  authorUserId: 'user-a',
  contentText: 'real staging post',
  category: communityPostCategories[6],
  image: {
    imagePath: 'user-a/post-1/photo.jpg',
    mimeType: 'image/jpeg',
    sizeBytes: 1200,
  },
  status: 'published',
  likeCount: 0,
  commentCount: 0,
  reportCount: 0,
  createdAt: '2026-05-26T00:00:00.000Z',
  updatedAt: '2026-05-26T00:00:00.000Z',
  likedByCurrentUser: false,
  ownedByCurrentUser: false,
};

const baseComment: CommunityComment = {
  id: 'comment-1',
  postId: 'post-1',
  authorUserId: 'user-a',
  contentText: 'top-level comment',
  status: 'published',
  likeCount: 0,
  replyCount: 1,
  reportCount: 0,
  createdAt: '2026-05-26T00:00:00.000Z',
  updatedAt: '2026-05-26T00:00:00.000Z',
  likedByCurrentUser: false,
  ownedByCurrentUser: false,
};

const baseReply: CommunityComment = {
  ...baseComment,
  id: 'reply-1',
  parentCommentId: 'comment-1',
  contentText: 'one-level reply',
  replyCount: 0,
};

describe('M116.2 Community interaction regressions without DOM dependency', () => {
  test('typing Thai text into the comment textarea path updates the draft safely', () => {
    const typedText = getCommunityTextInputValue({
      target: {
        value: 'ทดสอบคอมเมนต์จากมือถือ',
      },
    });

    const drafts = updateCommunityCommentDraft({}, 'post-1', typedText);

    expect(typedText).toBe('ทดสอบคอมเมนต์จากมือถือ');
    expect(drafts).toEqual({
      'post-1': 'ทดสอบคอมเมนต์จากมือถือ',
    });
    expect(getCommunityCommentSubmitText(drafts, 'post-1')).toBe('ทดสอบคอมเมนต์จากมือถือ');
  });

  test('comment input helpers tolerate malformed input events without crashing', () => {
    expect(() => getCommunityTextInputValue({ target: null })).not.toThrow();
    expect(() => getCommunityTextInputValue({ target: { value: undefined } })).not.toThrow();
    expect(getCommunityTextInputValue({ target: null })).toBe('');
    expect(updateCommunityCommentDraft(undefined, '', 'ignored')).toEqual({});
    expect(getCommunityCommentSubmitText(undefined, 'post-1')).toBe('');
  });

  test('empty and whitespace-only comments stay blocked before service submit', () => {
    const drafts = updateCommunityCommentDraft({}, 'post-1', '   ');

    expect(getCommunityCommentSubmitText(drafts, 'post-1')).toBe('');
  });

  test('top-level comment submit gate allows authenticated staging writes with a post id', () => {
    expect(canUseTopLevelCommunityCommentSubmit(true, 'post-1')).toBe(true);
    expect(canUseTopLevelCommunityCommentSubmit(true, 'post-1', true)).toBe(false);
    expect(canUseTopLevelCommunityCommentSubmit(false, 'post-1')).toBe(false);
    expect(canUseTopLevelCommunityCommentSubmit(true, '')).toBe(false);
  });

  test('like and unlike update the visible count state without double counting', () => {
    const liked = applyCommunityLikeUiState([basePost], 'post-1', true);
    expect(liked[0]).toMatchObject({
      likedByCurrentUser: true,
      likeCount: 1,
    });

    const duplicateLike = applyCommunityLikeUiState(liked, 'post-1', true);
    expect(duplicateLike[0]).toMatchObject({
      likedByCurrentUser: true,
      likeCount: 1,
    });

    const unliked = applyCommunityLikeUiState(duplicateLike, 'post-1', false);
    expect(unliked[0]).toMatchObject({
      likedByCurrentUser: false,
      likeCount: 0,
    });
  });

  test('successful like does not revert to zero when backend refresh returns stale counters', () => {
    const currentPosts = applyCommunityLikeUiState([basePost], 'post-1', true);
    const staleRefresh: CommunityPost[] = [
      {
        ...basePost,
        likeCount: 0,
        likedByCurrentUser: false,
      },
    ];

    expect(reconcileCommunityPostsAfterLikeRefresh(currentPosts, staleRefresh, 'post-1', true)[0]).toMatchObject({
      likedByCurrentUser: true,
      likeCount: 1,
    });
  });

  test('comment arrays remain safe when service data is missing', () => {
    expect(getSafeCommunityComments(undefined)).toEqual([]);
    expect(getSafeCommunityComments(null)).toEqual([]);
    expect(getSafeCommunityComments([])).toEqual([]);
  });

  test('splits top-level comments from one-level replies safely', () => {
    const comments = [baseComment, baseReply];

    expect(getTopLevelCommunityComments(comments)).toEqual([baseComment]);
    expect(getCommunityRepliesForComment(comments, 'comment-1')).toEqual([baseReply]);
    expect(getCommunityRepliesForComment(comments, 'reply-1')).toEqual([]);
    expect(getCommunityRepliesForComment(undefined, 'comment-1')).toEqual([]);
  });

  test('comment like and unlike update count without double counting', () => {
    const liked = applyCommunityCommentLikeUiState([baseComment], 'comment-1', true);
    expect(liked[0]).toMatchObject({
      likedByCurrentUser: true,
      likeCount: 1,
    });

    const duplicateLike = applyCommunityCommentLikeUiState(liked, 'comment-1', true);
    expect(duplicateLike[0]).toMatchObject({
      likedByCurrentUser: true,
      likeCount: 1,
    });

    const unliked = applyCommunityCommentLikeUiState(duplicateLike, 'comment-1', false);
    expect(unliked[0]).toMatchObject({
      likedByCurrentUser: false,
      likeCount: 0,
    });
  });

  test('comment like refresh preserves successful state when backend counters are stale', () => {
    const currentComments = applyCommunityCommentLikeUiState([baseComment], 'comment-1', true);
    const staleRefresh: CommunityComment[] = [
      {
        ...baseComment,
        likeCount: 0,
        likedByCurrentUser: false,
      },
    ];

    expect(reconcileCommunityCommentsAfterLikeRefresh(currentComments, staleRefresh, 'comment-1', true)[0]).toMatchObject({
      likedByCurrentUser: true,
      likeCount: 1,
    });
  });
});
