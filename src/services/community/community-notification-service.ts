import type {
  CommunityActionResult,
  CommunityNotification,
  CommunityNotificationType,
} from '@/services/community/community.types';

export const communityNotificationPolicy = {
  enabled: false,
  supportedTypes: ['post_liked', 'post_replied', 'comment_replied', 'post_reported_system'] as CommunityNotificationType[],
  deliveryMode: 'in_app_only',
  pushEnabled: false,
  gateMessage: 'การแจ้งเตือนเมื่อมีคนไลก์หรือตอบกลับจะเปิดหลัง backend ชุมชนพร้อม',
};

export async function listCommunityNotifications(): Promise<CommunityActionResult<CommunityNotification[]>> {
  return {
    ok: false,
    code: 'notification_backend_needed',
    message: communityNotificationPolicy.gateMessage,
  };
}

export async function markCommunityNotificationRead(_notificationId?: string): Promise<CommunityActionResult> {
  void _notificationId;

  return {
    ok: false,
    code: 'notification_backend_needed',
    message: communityNotificationPolicy.gateMessage,
  };
}
