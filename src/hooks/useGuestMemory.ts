import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  addFarmRecord,
  addRecentAIQuestion,
  clearMemory,
  exportMemory,
  followTopic,
  getState,
  importMemory,
  isFollowingTopic,
  isLiked,
  isSaved,
  saveItem,
  subscribeGuestMemory,
  toggleLike,
  unfollowTopic,
  unsaveItem,
  updateFarmRecordStatus,
} from '@/services/guest-memory/guest-memory-service';
import type {
  FarmHistoryRecord,
  FarmHistoryRecordInput,
  FollowedTopicInput,
  GuestMemoryExport,
  GuestMemoryState,
  LikeItemInput,
  RecentAIQuestionInput,
  SavedItemType,
  SaveItemInput,
} from '@/services/guest-memory/guest-memory.types';

export function useGuestMemory() {
  const [state, setState] = useState<GuestMemoryState>(() => getState());

  const refresh = useCallback(() => {
    setState(getState());
  }, []);

  useEffect(() => {
    refresh();
    return subscribeGuestMemory(refresh);
  }, [refresh]);

  const counts = useMemo(() => {
    return {
      savedArticles: state.savedItems.filter((item) => item.itemType === 'article').length,
      savedVideos: state.savedItems.filter((item) => item.itemType === 'video').length,
      likedPosts: state.likes.filter((item) => item.itemType === 'community_post').length,
      followedTopics: state.followedTopics.length,
      farmRecords: state.farmRecords.length,
      recentAIQuestions: state.recentAIQuestions.length,
      savedItems: state.savedItems.length,
    };
  }, [state]);

  const runAndRefresh = useCallback(
    (operation: () => GuestMemoryState) => {
      const nextState = operation();
      setState(nextState);
      return nextState;
    },
    [],
  );

  return {
    state,
    counts,
    refresh,
    saveItem: (input: SaveItemInput) => runAndRefresh(() => saveItem(input)),
    unsaveItem: (itemType: SavedItemType, itemId: string) => runAndRefresh(() => unsaveItem(itemType, itemId)),
    isSaved: (itemType: SavedItemType, itemId: string) => isSaved(itemType, itemId),
    toggleLike: (input: LikeItemInput) => runAndRefresh(() => toggleLike(input)),
    isLiked: (itemType: SavedItemType, itemId: string) => isLiked(itemType, itemId),
    followTopic: (input: FollowedTopicInput) => runAndRefresh(() => followTopic(input)),
    unfollowTopic: (topicId: string) => runAndRefresh(() => unfollowTopic(topicId)),
    isFollowingTopic: (topicId: string) => isFollowingTopic(topicId),
    addFarmRecord: (input: FarmHistoryRecordInput) => runAndRefresh(() => addFarmRecord(input)),
    updateFarmRecordStatus: (recordId: string, status: FarmHistoryRecord['status']) =>
      runAndRefresh(() => updateFarmRecordStatus(recordId, status)),
    addRecentAIQuestion: (input: RecentAIQuestionInput) => runAndRefresh(() => addRecentAIQuestion(input)),
    clearMemory: () => runAndRefresh(() => clearMemory()),
    exportMemory: (): GuestMemoryExport => exportMemory(),
    importMemory: (memoryExport: GuestMemoryExport | GuestMemoryState) => runAndRefresh(() => importMemory(memoryExport)),
  };
}
