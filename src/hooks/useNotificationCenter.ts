import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAICredits } from '@/hooks/useAICredits';
import { useCommunityModeration } from '@/hooks/useCommunityModeration';
import { useMyFarmHub } from '@/hooks/useMyFarmHub';
import { runGuestSyncStagingReadiness } from '@/services/backend/guest-sync-staging-readiness';
import {
  createLocalModeratorQueueItems,
} from '@/services/community-moderation/community-moderation-service';
import { mockModeratorQueueItems } from '@/services/community-moderation/community-moderation-fixtures';
import { articleContents, videoContentItems } from '@/services/content/content-fixtures';
import {
  buildNotificationItems,
  clearReadNotificationsDemo,
  createNotificationDigest,
  filterNotificationItems,
  getNotificationCenterState,
  markAllNotificationsRead,
  markNotificationRead,
  resetNotificationCenterDemo,
  setNotificationPreferenceEnabled,
  subscribeNotificationCenter,
} from '@/services/notifications/notification-center-service';
import type { NotificationCategoryTab } from '@/services/notifications/notification.types';
import { weatherAlertMocks } from '@/services/weather/weather-fixtures';

export function useNotificationCenter() {
  const [state, setState] = useState(() => getNotificationCenterState());
  const aiCredits = useAICredits();
  const moderation = useCommunityModeration();
  const myFarm = useMyFarmHub();
  const guestSyncReadiness = useMemo(() => runGuestSyncStagingReadiness(), []);

  const refresh = useCallback(() => {
    setState(getNotificationCenterState());
  }, []);

  useEffect(() => {
    refresh();
    return subscribeNotificationCenter(refresh);
  }, [refresh]);

  const moderatorQueueItems = useMemo(
    () => [...createLocalModeratorQueueItems(moderation.reports), ...mockModeratorQueueItems],
    [moderation.reports],
  );

  const items = useMemo(
    () =>
      buildNotificationItems({
        readNotificationIds: state.readNotificationIds,
        archivedNotificationIds: state.archivedNotificationIds,
        preferences: state.preferences,
        cropWatches: myFarm.cropWatch.watches,
        weatherAlerts: weatherAlertMocks,
        communityReports: moderation.reports,
        moderatorQueueItems,
        aiCreditSummary: aiCredits.summary,
        myFarmNextActions: myFarm.nextActions,
        articles: articleContents,
        videos: videoContentItems,
        guestSyncReadiness,
      }),
    [
      aiCredits.summary,
      guestSyncReadiness,
      moderation.reports,
      moderatorQueueItems,
      myFarm.cropWatch.watches,
      myFarm.nextActions,
      state.archivedNotificationIds,
      state.preferences,
      state.readNotificationIds,
    ],
  );

  const digest = useMemo(() => createNotificationDigest(items, state.preferences), [items, state.preferences]);

  const runAndRefresh = useCallback((operation: () => typeof state) => {
    const nextState = operation();
    setState(nextState);
    return nextState;
  }, []);

  return {
    state,
    items,
    digest,
    preferences: state.preferences,
    refresh,
    getItemsForTab: (tab: NotificationCategoryTab) => filterNotificationItems(items, tab),
    markRead: (notificationId: string, read = true) => runAndRefresh(() => markNotificationRead(notificationId, read)),
    markAllRead: () => runAndRefresh(() => markAllNotificationsRead(items.map((item) => item.id))),
    clearReadDemo: () => runAndRefresh(() => clearReadNotificationsDemo(items)),
    setPreferenceEnabled: (preferenceId: string, enabled: boolean) =>
      runAndRefresh(() => setNotificationPreferenceEnabled(preferenceId, enabled)),
    resetDemo: () => runAndRefresh(resetNotificationCenterDemo),
  };
}
