import type { AICreditSummary } from '@/services/ai-credits/ai-credit.types';
import type { GuestSyncStagingReadiness } from '@/services/backend/guest-sync-edge.types';
import type { CommunityReport, ModeratorQueueItem } from '@/services/community-moderation/community-moderation.types';
import { communityReportReasonLabels } from '@/services/community-moderation/community-moderation-fixtures';
import type { CropWatch } from '@/services/crop-prices/crop-watch.types';
import { cropWatchAlertLabels } from '@/services/crop-prices/crop-watch-service';
import type { MyFarmNextAction } from '@/services/my-farm/my-farm.types';
import {
  notificationCenterLocalOnlyNotice,
  notificationCenterStorageKey,
  notificationFixtureItems,
  notificationPreferenceDefaults,
  notificationSourceLabels,
  notificationTabLabels,
  notificationTypeGroups,
} from '@/services/notifications/notification-fixtures';
import type {
  BuildNotificationCenterInput,
  NotificationCategoryTab,
  NotificationCenterState,
  NotificationDigestPreview,
  NotificationItem,
  NotificationPreference,
  NotificationPriority,
  NotificationStatus,
  NotificationType,
} from '@/services/notifications/notification.types';
import type { ArticleContent, VideoContent } from '@/services/content/content.types';
import type { WeatherAlertMock } from '@/services/weather/weather.types';

const currentVersion = 1;
const notificationCenterChangedEvent = 'kasethub:notification-center-changed';

export type BuildNotificationItemsInput = BuildNotificationCenterInput & {
  cropWatches: CropWatch[];
  weatherAlerts: WeatherAlertMock[];
  communityReports: CommunityReport[];
  moderatorQueueItems: ModeratorQueueItem[];
  aiCreditSummary: AICreditSummary;
  myFarmNextActions: MyFarmNextAction[];
  articles: ArticleContent[];
  videos: VideoContent[];
  guestSyncReadiness: GuestSyncStagingReadiness;
};

function now() {
  return new Date().toISOString();
}

function canUseStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage);
}

function formatThaiDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'ตัวอย่างในเครื่อง';
  }

  return date.toLocaleString('th-TH', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function safeParseJson<T>(rawValue: string | null): T | undefined {
  if (!rawValue) return undefined;

  try {
    return JSON.parse(rawValue) as T;
  } catch {
    return undefined;
  }
}

function uniqueValues(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function preferenceFallbackType(type: NotificationType): NotificationType {
  const fallback: Partial<Record<NotificationType, NotificationType>> = {
    moderation_update: 'community_report',
    system_notice: 'account_sync',
  };

  return fallback[type] ?? type;
}

function normalizePreference(input: Partial<NotificationPreference>): NotificationPreference | undefined {
  if (!input.id || !input.type) return undefined;
  const defaultPreference = notificationPreferenceDefaults.find((preference) => preference.id === input.id || preference.type === input.type);
  if (!defaultPreference) return undefined;

  return {
    ...defaultPreference,
    enabled: input.enabled ?? defaultPreference.enabled,
    quietHoursEnabled: Boolean(input.quietHoursEnabled),
    updatedAt: input.updatedAt || defaultPreference.updatedAt,
  };
}

function mergePreferences(input: unknown): NotificationPreference[] {
  const stored = Array.isArray(input)
    ? input.map((preference) => normalizePreference(preference)).filter((preference): preference is NotificationPreference => Boolean(preference))
    : [];

  return notificationPreferenceDefaults.map((defaultPreference) => {
    const storedPreference = stored.find((preference) => preference.id === defaultPreference.id);
    return storedPreference ?? defaultPreference;
  });
}

function createDefaultState(): NotificationCenterState {
  return {
    version: currentVersion,
    readNotificationIds: [],
    archivedNotificationIds: [],
    preferences: notificationPreferenceDefaults,
    migrations: [],
    updatedAt: now(),
  };
}

export function migrateNotificationCenterState(input: unknown): NotificationCenterState {
  const fallback = createDefaultState();

  if (!input || typeof input !== 'object') return fallback;

  const partial = input as Partial<NotificationCenterState>;

  return {
    version: currentVersion,
    readNotificationIds: Array.isArray(partial.readNotificationIds) ? uniqueValues(partial.readNotificationIds) : [],
    archivedNotificationIds: Array.isArray(partial.archivedNotificationIds) ? uniqueValues(partial.archivedNotificationIds) : [],
    preferences: mergePreferences(partial.preferences),
    migrations: Array.isArray(partial.migrations) ? partial.migrations : [],
    updatedAt: partial.updatedAt || now(),
  };
}

function getStoredState() {
  if (!canUseStorage()) return createDefaultState();

  return migrateNotificationCenterState(
    safeParseJson<NotificationCenterState>(window.localStorage.getItem(notificationCenterStorageKey)),
  );
}

function notifyNotificationCenterChanged() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(notificationCenterChangedEvent));
  }
}

function persistState(state: NotificationCenterState) {
  const nextState = {
    ...state,
    updatedAt: now(),
  };

  if (!canUseStorage()) return nextState;

  try {
    window.localStorage.setItem(notificationCenterStorageKey, JSON.stringify(nextState));
    notifyNotificationCenterChanged();
    return nextState;
  } catch {
    return state;
  }
}

function getPreferenceEnabled(type: NotificationType, preferences: NotificationPreference[]) {
  const preferenceType = preferenceFallbackType(type);
  return preferences.find((preference) => preference.type === preferenceType)?.enabled ?? true;
}

function resolveStatus(id: string, input: BuildNotificationCenterInput): NotificationStatus {
  if (input.archivedNotificationIds.includes(id)) return 'archived_demo';
  if (input.readNotificationIds.includes(id)) return 'read';
  return 'unread';
}

function notificationItem(
  item: Omit<NotificationItem, 'status' | 'createdAtLabel' | 'preferenceEnabled'>,
  input: BuildNotificationCenterInput,
): NotificationItem {
  return {
    ...item,
    status: resolveStatus(item.id, input),
    createdAtLabel: formatThaiDate(item.createdAt),
    preferenceEnabled: getPreferenceEnabled(item.type, input.preferences),
  };
}

function priorityFromWeatherSeverity(severity: WeatherAlertMock['severity']): NotificationPriority {
  if (severity === 'danger') return 'urgent';
  if (severity === 'warning') return 'high';
  return 'normal';
}

function buildWeatherNotifications(input: BuildNotificationItemsInput): NotificationItem[] {
  return input.weatherAlerts.map((alert) =>
    notificationItem(
      {
        id: `weather:${alert.id}`,
        type: 'weather_alert',
        priority: priorityFromWeatherSeverity(alert.severity),
        source: 'weather_fixture',
        title: alert.title,
        body: `${alert.body} (${alert.locationLabel})`,
        createdAt: '2026-05-23T07:30:00.000+07:00',
        sourceLabel: notificationSourceLabels.weather_fixture,
        demoLabel: alert.demoLabel,
        ctaRoute: alert.route,
        ctaLabel: 'ดูสภาพอากาศ',
        tags: ['weather', alert.riskId, alert.locationLabel],
        metadata: {
          locationLabel: alert.locationLabel,
          riskId: alert.riskId,
          severity: alert.severity,
        },
      },
      input,
    ),
  );
}

function buildCropPriceNotifications(input: BuildNotificationItemsInput): NotificationItem[] {
  const watchedNotifications = input.cropWatches.flatMap((watch) => {
    const enabledPreferences = watch.alertPreferences.filter((preference) => preference.enabled);

    if (enabledPreferences.length === 0 && watch.enabled) {
      return [
        notificationItem(
          {
            id: `crop-watch:${watch.cropKey}:summary`,
            type: 'crop_price_alert',
            priority: 'normal',
            source: 'crop_watch',
            title: `ติดตามราคาเกษตร ${watch.cropName}`,
            body: `เตรียมเชื่อมแหล่งข้อมูลราคาสำหรับ ${watch.cropName} ที่ ${watch.preferredMarketLabel} ยังไม่แสดงราคาจริงจนกว่าจะเชื่อมแหล่งข้อมูล`,
            createdAt: watch.updatedAt,
            sourceLabel: notificationSourceLabels.crop_watch,
            demoLabel: 'รอแหล่งข้อมูลจริง',
            ctaRoute: '/app/prices',
            ctaLabel: 'เปิดราคาเกษตร',
            tags: ['crop-watch', watch.cropKey, 'source-pending'],
            metadata: {
              cropKey: watch.cropKey,
              priceId: watch.priceId,
              market: watch.preferredMarketLabel,
              sourceLabel: watch.sourceLabel,
            },
          },
          input,
        ),
      ];
    }

    return enabledPreferences.slice(0, 2).map((preference) =>
      notificationItem(
        {
          id: `crop-watch:${watch.cropKey}:${preference.alertType}`,
          type: 'crop_price_alert',
          priority: preference.alertType === 'target_price' ? 'high' : 'normal',
          source: 'crop_watch',
          title: `${cropWatchAlertLabels[preference.alertType]}: ${watch.cropName}`,
          body:
            preference.alertType === 'target_price' && preference.targetPrice
              ? `ตั้งเป้าหมายราคาไว้ในเครื่อง ระบบจะแจ้งเตือนได้เมื่อเชื่อมแหล่งข้อมูลราคาจริงแล้ว`
              : `เตรียมเชื่อมแหล่งข้อมูลราคาสำหรับ ${watch.cropName} ที่ ${watch.preferredMarketLabel}`,
          createdAt: preference.updatedAt || watch.updatedAt,
          sourceLabel: notificationSourceLabels.crop_watch,
          demoLabel: 'รอแหล่งข้อมูลจริง',
          ctaRoute: '/app/prices',
          ctaLabel: 'เปิดราคาเกษตร',
          tags: ['crop-watch', watch.cropKey, preference.alertType, 'source-pending'],
          metadata: {
            cropKey: watch.cropKey,
            alertType: preference.alertType,
            targetPrice: preference.targetPrice,
            priceId: watch.priceId,
          },
        },
        input,
      ),
    );
  });

  const fixtureFallbacks =
    watchedNotifications.length > 0
      ? []
      : [
          notificationItem(
            {
              id: 'crop-price:rice-source-pending',
              type: 'crop_price_alert',
              priority: 'normal',
              source: 'crop_watch',
              title: 'ราคาเกษตรกำลังเตรียมเชื่อมแหล่งข้อมูล',
              body: 'ยังไม่แสดงราคาจริงจนกว่าจะเชื่อมแหล่งข้อมูล เปิดหน้า ราคาเกษตร เพื่อดูรายการสินค้าที่รองรับก่อน',
              createdAt: '2026-05-23T07:10:00.000+07:00',
              sourceLabel: notificationSourceLabels.crop_watch,
              demoLabel: 'รอแหล่งข้อมูลจริง',
              ctaRoute: '/app/prices',
              ctaLabel: 'เปิดราคาเกษตร',
              tags: ['price', 'source-pending'],
              metadata: {},
            },
            input,
          ),
        ];

  return [...watchedNotifications, ...fixtureFallbacks];
}

function buildCommunityNotifications(input: BuildNotificationItemsInput): NotificationItem[] {
  const reportNotifications = input.communityReports.slice(0, 4).map((report) =>
    notificationItem(
      {
        id: `community-report:${report.id}`,
        type: 'community_report',
        priority:
          report.reason === 'chemical_or_pesticide_risk' || report.reason === 'dangerous_advice' ? 'high' : 'normal',
        source: 'community_moderation',
        title: 'บันทึกรายงานโพสต์ในเครื่องนี้',
        body: `${communityReportReasonLabels[report.reason]} · ${report.note || 'ไม่มีหมายเหตุเพิ่มเติม'} · ยังไม่มีผู้ดูแลจริง`,
        createdAt: report.createdAt,
        sourceLabel: notificationSourceLabels.community_moderation,
        demoLabel: 'local report',
        ctaRoute: '/app/moderation-center',
        ctaLabel: 'ดูศูนย์รายงาน',
        tags: ['community', report.reason],
        metadata: {
          postId: report.postId,
          status: report.status,
        },
      },
      input,
    ),
  );

  const queueNotifications = input.moderatorQueueItems.slice(0, 2).map((queue) =>
    notificationItem(
      {
        id: `moderation-queue:${queue.id}`,
        type: 'moderation_update',
        priority: queue.status === 'pending_review' ? 'high' : 'normal',
        source: 'community_moderation',
        title: queue.title,
        body: `${queue.excerpt} · คิวตัวอย่าง ยังไม่มี moderator จริง`,
        createdAt: '2026-05-23T06:45:00.000+07:00',
        sourceLabel: notificationSourceLabels.community_moderation,
        demoLabel: 'mock queue',
        ctaRoute: '/app/moderation-center',
        ctaLabel: 'ดู moderation center',
        tags: ['moderation', queue.reason, queue.status],
        metadata: {
          postId: queue.postId,
          recommendedAction: queue.recommendedAction,
        },
      },
      input,
    ),
  );

  return [...reportNotifications, ...queueNotifications];
}

function buildAICreditNotification(input: BuildNotificationItemsInput): NotificationItem {
  const canAsk = input.aiCreditSummary.totalAvailable > 0;

  return notificationItem(
    {
      id: 'ai-credit:local-summary',
      type: 'ai_credit',
      priority: canAsk ? 'low' : 'high',
      source: 'ai_credits',
      title: canAsk ? 'เครดิต AI ตัวอย่างพร้อมใช้' : 'เครดิต AI ตัวอย่างหมดแล้ว',
      body: canAsk
        ? `วันนี้เหลือ ${input.aiCreditSummary.dailyFreeRemaining} คำถามฟรี · เครดิตรวม ${input.aiCreditSummary.totalAvailable}`
        : 'ยังไม่มี AI API จริง และการปลดล็อกเครดิตยังเป็น UX ตัวอย่างในเครื่อง',
      createdAt: '2026-05-23T06:30:00.000+07:00',
      sourceLabel: notificationSourceLabels.ai_credits,
      demoLabel: 'local credit',
      ctaRoute: '/app/ai-credits',
      ctaLabel: 'ดูเครดิต AI',
      tags: ['ai-credit', 'local'],
      metadata: {
        totalAvailable: input.aiCreditSummary.totalAvailable,
        dailyFreeRemaining: input.aiCreditSummary.dailyFreeRemaining,
      },
    },
    input,
  );
}

function buildMyFarmNotifications(input: BuildNotificationItemsInput): NotificationItem[] {
  return input.myFarmNextActions.slice(0, 3).map((action) =>
    notificationItem(
      {
        id: `my-farm:${action.id}`,
        type: 'my_farm_reminder',
        priority: action.priority === 'primary' ? 'high' : 'normal',
        source: 'my_farm_hub',
        title: action.title,
        body: action.detail,
        createdAt: '2026-05-23T06:20:00.000+07:00',
        sourceLabel: notificationSourceLabels.my_farm_hub,
        demoLabel: 'local reminder',
        ctaRoute: action.route,
        ctaLabel: action.ctaLabel,
        tags: ['my-farm', action.id],
        metadata: {
          actionId: action.id,
          priority: action.priority,
        },
      },
      input,
    ),
  );
}

function buildContentNotifications(input: BuildNotificationItemsInput): NotificationItem[] {
  const latestArticle = input.articles[0];
  const latestVideo = input.videos[0];
  const notifications: NotificationItem[] = [];

  if (latestArticle) {
    notifications.push(
      notificationItem(
        {
          id: `content:article:${latestArticle.id}`,
          type: 'content_update',
          priority: 'low',
          source: 'content_fixture',
          title: 'บทความตัวอย่างแนะนำวันนี้',
          body: latestArticle.title,
          createdAt: `${latestArticle.updatedAt}T09:00:00.000+07:00`,
          sourceLabel: notificationSourceLabels.content_fixture,
          demoLabel: 'content fixture',
          ctaRoute: latestArticle.sourceRoute,
          ctaLabel: 'อ่านบทความ',
          tags: ['content', 'article'],
          metadata: {
            articleId: latestArticle.id,
            source: latestArticle.source,
          },
        },
        input,
      ),
    );
  }

  if (latestVideo) {
    notifications.push(
      notificationItem(
        {
          id: `content:video:${latestVideo.id}`,
          type: 'content_update',
          priority: 'low',
          source: 'content_fixture',
          title: 'วิดีโอตัวอย่างจากคลังคอนเทนต์',
          body: latestVideo.title,
          createdAt: `${latestVideo.updatedAt}T08:50:00.000+07:00`,
          sourceLabel: notificationSourceLabels.content_fixture,
          demoLabel: 'video fixture',
          ctaRoute: latestVideo.sourceRoute,
          ctaLabel: 'ดูวิดีโอ',
          tags: ['content', 'video'],
          metadata: {
            videoId: latestVideo.videoId,
            importStatus: latestVideo.importStatus,
          },
        },
        input,
      ),
    );
  }

  return notifications;
}

function buildAccountSyncNotification(input: BuildNotificationItemsInput): NotificationItem {
  return notificationItem(
    {
      id: 'guest-sync:edge-readiness',
      type: 'account_sync',
      priority: input.guestSyncReadiness.blockerItems.length > 0 ? 'high' : 'normal',
      source: 'guest_sync',
      title: 'Guest Sync Edge ยังเป็นแผน staging',
      body: `${input.guestSyncReadiness.levelLabel} · score ${input.guestSyncReadiness.score}% · ยังไม่เปิด cloud sync จริง`,
      createdAt: input.guestSyncReadiness.generatedAt,
      sourceLabel: notificationSourceLabels.guest_sync,
      demoLabel: 'staging plan',
      ctaRoute: '/app/guest-sync-edge',
      ctaLabel: 'ดูแผน Guest Sync',
      tags: ['guest-sync', 'account'],
      metadata: {
        score: input.guestSyncReadiness.score,
        blockers: input.guestSyncReadiness.blockerItems.length,
      },
    },
    input,
  );
}

export function buildNotificationItems(input: BuildNotificationItemsInput): NotificationItem[] {
  const items = [
    ...buildWeatherNotifications(input),
    ...buildCropPriceNotifications(input),
    ...buildCommunityNotifications(input),
    buildAICreditNotification(input),
    ...buildMyFarmNotifications(input),
    ...buildContentNotifications(input),
    buildAccountSyncNotification(input),
    ...notificationFixtureItems.map((item) => notificationItem(item, input)),
  ];

  return items
    .filter((item) => item.preferenceEnabled)
    .filter((item) => item.status !== 'archived_demo')
    .sort((a, b) => {
      const priorityWeight: Record<NotificationPriority, number> = {
        urgent: 4,
        high: 3,
        normal: 2,
        low: 1,
      };
      const priorityDiff = priorityWeight[b.priority] - priorityWeight[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
}

export function filterNotificationItems(items: NotificationItem[], tab: NotificationCategoryTab) {
  if (tab === 'all') return items;
  return items.filter((item) => notificationTypeGroups[item.type] === tab);
}

export function createNotificationDigest(items: NotificationItem[], preferences: NotificationPreference[]): NotificationDigestPreview {
  const tabCounts = Object.keys(notificationTabLabels).reduce(
    (counts, tab) => ({
      ...counts,
      [tab]: filterNotificationItems(items, tab as NotificationCategoryTab).length,
    }),
    {} as Record<NotificationCategoryTab, number>,
  );

  return {
    generatedAt: now(),
    generatedAtLabel: formatThaiDate(now()),
    totalCount: items.length,
    unreadCount: items.filter((item) => item.status === 'unread').length,
    readCount: items.filter((item) => item.status === 'read').length,
    highPriorityCount: items.filter((item) => item.priority === 'high').length,
    urgentCount: items.filter((item) => item.priority === 'urgent').length,
    enabledPreferenceCount: preferences.filter((preference) => preference.enabled).length,
    tabCounts,
    localOnlyNotice: notificationCenterLocalOnlyNotice,
  };
}

export function getNotificationCenterState() {
  return getStoredState();
}

export function markNotificationRead(notificationId: string, read = true) {
  const state = getStoredState();
  const readNotificationIds = read
    ? uniqueValues([notificationId, ...state.readNotificationIds])
    : state.readNotificationIds.filter((id) => id !== notificationId);

  return persistState({
    ...state,
    readNotificationIds,
  });
}

export function markAllNotificationsRead(notificationIds: string[]) {
  const state = getStoredState();

  return persistState({
    ...state,
    readNotificationIds: uniqueValues([...notificationIds, ...state.readNotificationIds]),
  });
}

export function clearReadNotificationsDemo(items: NotificationItem[]) {
  const state = getStoredState();
  const readIds = items.filter((item) => item.status === 'read').map((item) => item.id);

  return persistState({
    ...state,
    archivedNotificationIds: uniqueValues([...readIds, ...state.archivedNotificationIds]),
  });
}

export function setNotificationPreferenceEnabled(preferenceId: string, enabled: boolean) {
  const state = getStoredState();

  return persistState({
    ...state,
    preferences: state.preferences.map((preference) =>
      preference.id === preferenceId
        ? {
            ...preference,
            enabled,
            updatedAt: now(),
          }
        : preference,
    ),
  });
}

export function resetNotificationCenterDemo() {
  const nextState = createDefaultState();

  if (!canUseStorage()) return nextState;

  try {
    window.localStorage.removeItem(notificationCenterStorageKey);
    notifyNotificationCenterChanged();
    return nextState;
  } catch {
    return getStoredState();
  }
}

export function subscribeNotificationCenter(listener: () => void) {
  if (typeof window === 'undefined') {
    return () => undefined;
  }

  const storageListener = (event: StorageEvent) => {
    if (event.key === notificationCenterStorageKey) {
      listener();
    }
  };

  window.addEventListener(notificationCenterChangedEvent, listener);
  window.addEventListener('storage', storageListener);

  return () => {
    window.removeEventListener(notificationCenterChangedEvent, listener);
    window.removeEventListener('storage', storageListener);
  };
}
