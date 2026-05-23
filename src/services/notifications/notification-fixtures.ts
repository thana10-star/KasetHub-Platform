import type {
  NotificationCategoryTab,
  NotificationItem,
  NotificationPreference,
  NotificationPriority,
  NotificationSource,
  NotificationType,
} from '@/services/notifications/notification.types';

const timestamp = '2026-05-23T08:00:00.000+07:00';

export const notificationCenterStorageKey = 'kasethub.notificationCenter.v1';

export const notificationCenterLocalOnlyNotice =
  'ศูนย์แจ้งเตือนนี้เป็นข้อมูล local/mock ในเครื่องเท่านั้น ยังไม่มี push notification, LINE Messaging API, email, SMS, backend job หรือ Supabase write';

export const notificationTabLabels: Record<NotificationCategoryTab, string> = {
  all: 'ทั้งหมด',
  weather: 'อากาศ',
  price: 'ราคา',
  my_farm: 'ฟาร์มของฉัน',
  community: 'ชุมชน',
  system: 'ระบบ',
};

export const notificationTypeLabels: Record<NotificationType, string> = {
  weather_alert: 'แจ้งเตือนอากาศ',
  crop_price_alert: 'แจ้งเตือนราคา',
  ai_credit: 'เครดิต AI',
  community_report: 'รายงานชุมชน',
  moderation_update: 'สถานะ moderation',
  my_farm_reminder: 'เตือน My Farm',
  content_update: 'เนื้อหาใหม่',
  account_sync: 'บัญชี/ซิงก์',
  system_notice: 'ระบบ',
};

export const notificationPriorityLabels: Record<NotificationPriority, string> = {
  low: 'ทั่วไป',
  normal: 'ปกติ',
  high: 'ควรดู',
  urgent: 'สำคัญ',
};

export const notificationSourceLabels: Record<NotificationSource, string> = {
  weather_fixture: 'ข้อมูลอากาศตัวอย่าง',
  crop_watch: 'Crop Watch local',
  ai_credits: 'เครดิต AI local',
  community_moderation: 'Moderation local',
  my_farm_hub: 'My Farm local',
  content_fixture: 'คอนเทนต์ตัวอย่าง',
  guest_sync: 'Guest Sync plan',
  system_demo: 'ระบบตัวอย่าง',
};

export const notificationTypeGroups: Record<NotificationType, NotificationCategoryTab> = {
  weather_alert: 'weather',
  crop_price_alert: 'price',
  ai_credit: 'system',
  community_report: 'community',
  moderation_update: 'community',
  my_farm_reminder: 'my_farm',
  content_update: 'system',
  account_sync: 'system',
  system_notice: 'system',
};

export const notificationPreferenceDefaults: NotificationPreference[] = [
  {
    id: 'pref-price-alerts',
    type: 'crop_price_alert',
    group: 'price',
    label: 'แจ้งเตือนราคาพืช',
    description: 'รวมแจ้งเตือนราคาขึ้น/ลงจาก Crop Watch แบบตัวอย่าง',
    enabled: true,
    deliveryMode: 'in_app_local',
    quietHoursEnabled: false,
    updatedAt: timestamp,
    demoOnly: true,
  },
  {
    id: 'pref-weather-alerts',
    type: 'weather_alert',
    group: 'weather',
    label: 'แจ้งเตือนอากาศ',
    description: 'แสดงฝนหนัก ความร้อน และความชื้นจากข้อมูลอากาศ mock',
    enabled: true,
    deliveryMode: 'in_app_local',
    quietHoursEnabled: false,
    updatedAt: timestamp,
    demoOnly: true,
  },
  {
    id: 'pref-my-farm-reminders',
    type: 'my_farm_reminder',
    group: 'my_farm',
    label: 'เตือนงานฟาร์มของฉัน',
    description: 'เตือนงานถัดไปจาก My Farm Hub เช่น วัดพื้นที่หรือบันทึกสุขภาพพืช',
    enabled: true,
    deliveryMode: 'in_app_local',
    quietHoursEnabled: false,
    updatedAt: timestamp,
    demoOnly: true,
  },
  {
    id: 'pref-community-updates',
    type: 'community_report',
    group: 'community',
    label: 'ชุมชนและรายงานโพสต์',
    description: 'แสดงรายงานโพสต์และสถานะ moderation แบบ local/mock',
    enabled: true,
    deliveryMode: 'in_app_local',
    quietHoursEnabled: false,
    updatedAt: timestamp,
    demoOnly: true,
  },
  {
    id: 'pref-ai-credit-notices',
    type: 'ai_credit',
    group: 'system',
    label: 'เครดิต AI',
    description: 'เตือนเครดิต AI ตัวอย่างและการใช้งานแบบ local',
    enabled: true,
    deliveryMode: 'in_app_local',
    quietHoursEnabled: false,
    updatedAt: timestamp,
    demoOnly: true,
  },
  {
    id: 'pref-content-updates',
    type: 'content_update',
    group: 'system',
    label: 'บทความ/วิดีโอใหม่',
    description: 'แสดงเนื้อหาตัวอย่างที่ควรอ่านหรือดูต่อ',
    enabled: true,
    deliveryMode: 'in_app_local',
    quietHoursEnabled: false,
    updatedAt: timestamp,
    demoOnly: true,
  },
  {
    id: 'pref-account-sync',
    type: 'account_sync',
    group: 'system',
    label: 'บัญชีและซิงก์',
    description: 'แจ้งสถานะ Guest Sync และ account backup ที่ยังเป็นแผน staging',
    enabled: true,
    deliveryMode: 'in_app_local',
    quietHoursEnabled: false,
    updatedAt: timestamp,
    demoOnly: true,
  },
];

export const notificationFixtureItems: NotificationItem[] = [
  {
    id: 'notification-system-local-only-demo',
    type: 'system_notice',
    priority: 'normal',
    source: 'system_demo',
    status: 'unread',
    title: 'ศูนย์แจ้งเตือนยังเป็นตัวอย่างในเครื่อง',
    body: 'ยังไม่มี push notification, LINE Messaging API, email, SMS, backend job หรือการส่งแจ้งเตือนจริง',
    createdAt: timestamp,
    createdAtLabel: 'ตัวอย่างวันนี้',
    sourceLabel: notificationSourceLabels.system_demo,
    demoLabel: 'local/mock',
    ctaRoute: '/app/notification-settings',
    ctaLabel: 'ตั้งค่าการแจ้งเตือน',
    preferenceEnabled: true,
    tags: ['local-only', 'demo'],
    metadata: {},
  },
];
