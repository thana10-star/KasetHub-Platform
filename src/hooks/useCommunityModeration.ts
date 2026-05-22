import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  clearLocalModerationDemo,
  getCommunityModerationState,
  hidePost,
  isPostHidden,
  reportCommunityPost,
  reportPost,
  subscribeCommunityModeration,
  unhidePost,
} from '@/services/community-moderation/community-moderation-service';
import type {
  CommunityModerationState,
  CommunityReportReason,
  ReportPostInput,
} from '@/services/community-moderation/community-moderation.types';

export function useCommunityModeration() {
  const [state, setState] = useState<CommunityModerationState>(() => getCommunityModerationState());

  const refresh = useCallback(() => {
    setState(getCommunityModerationState());
  }, []);

  useEffect(() => {
    refresh();
    return subscribeCommunityModeration(refresh);
  }, [refresh]);

  const counts = useMemo(
    () => ({
      reports: state.reports.length,
      hiddenPosts: state.hiddenPosts.length,
      pendingReports: state.reports.filter((report) => report.status === 'pending_review').length,
    }),
    [state.hiddenPosts.length, state.reports],
  );

  const runAndRefresh = useCallback((operation: () => CommunityModerationState) => {
    const nextState = operation();
    setState(nextState);
    return nextState;
  }, []);

  return {
    state,
    reports: state.reports,
    hiddenPosts: state.hiddenPosts,
    counts,
    refresh,
    reportPost: (postId: string, reason: CommunityReportReason, note?: string) =>
      runAndRefresh(() => reportPost(postId, reason, note)),
    reportCommunityPost: (input: ReportPostInput) => runAndRefresh(() => reportCommunityPost(input)),
    hidePost: (postId: string, reason?: CommunityReportReason | 'user_hidden', note?: string) =>
      runAndRefresh(() => hidePost(postId, reason, note)),
    unhidePost: (postId: string) => runAndRefresh(() => unhidePost(postId)),
    isPostHidden: (postId: string) => isPostHidden(postId),
    clearLocalModerationDemo: () => runAndRefresh(clearLocalModerationDemo),
  };
}
