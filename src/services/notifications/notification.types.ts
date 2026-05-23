export type NotificationType =
  | 'weather_alert'
  | 'crop_price_alert'
  | 'ai_credit'
  | 'community_report'
  | 'moderation_update'
  | 'my_farm_reminder'
  | 'content_update'
  | 'account_sync'
  | 'system_notice';

export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';

export type NotificationSource =
  | 'weather_fixture'
  | 'crop_watch'
  | 'ai_credits'
  | 'community_moderation'
  | 'my_farm_hub'
  | 'content_fixture'
  | 'guest_sync'
  | 'system_demo';

export type NotificationStatus = 'unread' | 'read' | 'archived_demo';

export type NotificationCategoryTab = 'all' | 'weather' | 'price' | 'my_farm' | 'community' | 'system';

export type NotificationItem = {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  source: NotificationSource;
  status: NotificationStatus;
  title: string;
  body: string;
  createdAt: string;
  createdAtLabel: string;
  sourceLabel: string;
  demoLabel: string;
  ctaRoute: string;
  ctaLabel: string;
  preferenceEnabled: boolean;
  tags: string[];
  metadata: Record<string, unknown>;
};

export type NotificationPreference = {
  id: string;
  type: NotificationType;
  group: NotificationCategoryTab;
  label: string;
  description: string;
  enabled: boolean;
  deliveryMode: 'in_app_local';
  quietHoursEnabled: boolean;
  updatedAt: string;
  demoOnly: boolean;
};

export type NotificationDigestPreview = {
  generatedAt: string;
  generatedAtLabel: string;
  totalCount: number;
  unreadCount: number;
  readCount: number;
  highPriorityCount: number;
  urgentCount: number;
  enabledPreferenceCount: number;
  tabCounts: Record<NotificationCategoryTab, number>;
  localOnlyNotice: string;
};

export type NotificationCenterState = {
  version: number;
  readNotificationIds: string[];
  archivedNotificationIds: string[];
  preferences: NotificationPreference[];
  migrations: string[];
  updatedAt: string;
};

export type BuildNotificationCenterInput = {
  readNotificationIds: string[];
  archivedNotificationIds: string[];
  preferences: NotificationPreference[];
};
