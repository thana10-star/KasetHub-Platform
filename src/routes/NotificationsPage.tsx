import {
  Bell,
  Bot,
  CheckCircle2,
  CloudRain,
  CloudUpload,
  LineChart,
  Newspaper,
  Settings,
  Sprout,
  Trash2,
  UsersRound,
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { StatusPill } from '@/components/ui/StatusPill';
import { cx } from '@/components/ui/classNames';
import { useNotificationCenter } from '@/hooks/useNotificationCenter';
import {
  notificationPriorityLabels,
  notificationTabLabels,
  notificationTypeGroups,
  notificationTypeLabels,
} from '@/services/notifications/notification-fixtures';
import type { NotificationCategoryTab, NotificationItem, NotificationPriority, NotificationType } from '@/services/notifications/notification.types';

const tabs: NotificationCategoryTab[] = ['all', 'weather', 'price', 'my_farm', 'community', 'system'];

const notificationIcons: Record<NotificationType, typeof Bell> = {
  weather_alert: CloudRain,
  crop_price_alert: LineChart,
  ai_credit: Bot,
  community_report: UsersRound,
  moderation_update: UsersRound,
  my_farm_reminder: Sprout,
  content_update: Newspaper,
  account_sync: CloudUpload,
  system_notice: Bell,
};

const priorityTone: Record<NotificationPriority, 'success' | 'warning' | 'danger' | 'info' | 'neutral'> = {
  low: 'neutral',
  normal: 'info',
  high: 'warning',
  urgent: 'danger',
};

const iconTone: Record<NotificationType, string> = {
  weather_alert: 'bg-sky-100 text-sky-800',
  crop_price_alert: 'bg-amber-100 text-amber-800',
  ai_credit: 'bg-kaset-mint text-kaset-deep',
  community_report: 'bg-rose-100 text-rose-800',
  moderation_update: 'bg-rose-100 text-rose-800',
  my_farm_reminder: 'bg-kaset-mint text-kaset-deep',
  content_update: 'bg-sky-100 text-sky-800',
  account_sync: 'bg-slate-100 text-slate-700',
  system_notice: 'bg-slate-100 text-slate-700',
};

function NotificationCard({
  item,
  onToggleRead,
}: {
  item: NotificationItem;
  onToggleRead: (item: NotificationItem) => void;
}) {
  const Icon = notificationIcons[item.type];

  return (
    <Card className={cx('p-4', item.status === 'unread' && 'border-kaset-leaf/40 bg-white')}>
      <div className="flex gap-3">
        <span className={cx('grid h-12 w-12 shrink-0 place-items-center rounded-lg', iconTone[item.type])}>
          <Icon aria-hidden="true" className="h-6 w-6" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap gap-2">
            <Badge tone={notificationTypeGroups[item.type] === 'price' ? 'gold' : notificationTypeGroups[item.type] === 'weather' ? 'sky' : notificationTypeGroups[item.type] === 'community' ? 'rose' : 'neutral'}>
              {notificationTypeLabels[item.type]}
            </Badge>
            <StatusPill tone={priorityTone[item.priority]}>{notificationPriorityLabels[item.priority]}</StatusPill>
            <Badge tone="neutral">{item.demoLabel}</Badge>
          </div>
          <div className="mt-2 flex items-start gap-2">
            <h2 className="min-w-0 flex-1 text-base font-extrabold leading-6 text-kaset-ink">{item.title}</h2>
            {item.status === 'unread' ? <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-kaset-leaf" /> : null}
          </div>
          <p className="mt-1 text-sm leading-6 text-slate-600">{item.body}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold text-slate-500">
            <span>{item.createdAtLabel}</span>
            <span>·</span>
            <span>{item.sourceLabel}</span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              className="min-h-11 rounded-full bg-kaset-mint px-3 text-sm font-extrabold text-kaset-deep"
              onClick={() => onToggleRead(item)}
              type="button"
            >
              {item.status === 'read' ? 'ทำเป็นยังไม่อ่าน' : 'อ่านแล้ว'}
            </button>
            <Link
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-kaset-deep px-3 text-sm font-extrabold text-white"
              to={item.ctaRoute}
            >
              {item.ctaLabel}
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<NotificationCategoryTab>('all');
  const notificationCenter = useNotificationCenter();
  const filteredItems = notificationCenter.getItemsForTab(activeTab);

  return (
    <div>
      <PageHeader title="ศูนย์แจ้งเตือน" subtitle="รวมแจ้งเตือนตัวอย่างจากอากาศ ราคา ฟาร์ม ชุมชน และระบบ" showBack />
      <div className="grid gap-5 px-5 pb-6">
        <NoticeBox tone="warning" title="ยังไม่มีการส่งแจ้งเตือนจริง">
          {notificationCenter.digest.localOnlyNotice} ข้อมูลทั้งหมดเป็น local/mock/demo เพื่อทดสอบ UX เท่านั้น
        </NoticeBox>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
              <Bell aria-hidden="true" className="h-6 w-6" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-extrabold text-kaset-ink">Local Notification Center</h2>
                <StatusPill tone={notificationCenter.digest.unreadCount > 0 ? 'warning' : 'success'}>
                  {notificationCenter.digest.unreadCount} ยังไม่อ่าน
                </StatusPill>
              </div>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                {notificationCenter.digest.totalCount} รายการ · {notificationCenter.digest.highPriorityCount} รายการควรดู · {notificationCenter.digest.enabledPreferenceCount} preference เปิดอยู่
              </p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-kaset-deep px-3 text-sm font-extrabold text-white"
              onClick={notificationCenter.markAllRead}
              type="button"
            >
              <CheckCircle2 aria-hidden="true" className="h-4 w-4" />
              อ่านทั้งหมด
            </button>
            <Link
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-3 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10"
              to="/app/notification-settings"
            >
              <Settings aria-hidden="true" className="h-4 w-4" />
              ตั้งค่า
            </Link>
          </div>
          <button
            className="mt-2 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-amber-50 px-3 text-sm font-extrabold text-amber-900 ring-1 ring-amber-200"
            onClick={notificationCenter.clearReadDemo}
            type="button"
          >
            <Trash2 aria-hidden="true" className="h-4 w-4" />
            ซ่อนรายการที่อ่านแล้ว (demo)
          </button>
        </Card>

        <div className="-mx-5 overflow-x-auto px-5">
          <div className="flex min-w-max gap-2">
            {tabs.map((tab) => (
              <button
                className={
                  activeTab === tab
                    ? 'min-h-11 rounded-full bg-kaset-deep px-4 text-sm font-extrabold text-white'
                    : 'min-h-11 rounded-full bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10'
                }
                key={tab}
                onClick={() => setActiveTab(tab)}
                type="button"
              >
                {notificationTabLabels[tab]} ({notificationCenter.digest.tabCounts[tab]})
              </button>
            ))}
          </div>
        </div>

        <section className="grid gap-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-extrabold text-kaset-ink">{notificationTabLabels[activeTab]}</h2>
            <Badge tone="neutral">local/mock</Badge>
          </div>
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <NotificationCard
                item={item}
                key={item.id}
                onToggleRead={(notification) => notificationCenter.markRead(notification.id, notification.status !== 'read')}
              />
            ))
          ) : (
            <Card className="p-5 text-center">
              <p className="font-extrabold text-kaset-ink">ไม่มีรายการในหมวดนี้</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                อาจถูกซ่อนด้วย preference หรือถูกล้างจากรายการที่อ่านแล้วใน demo
              </p>
              <button
                className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-kaset-mint px-4 text-sm font-extrabold text-kaset-deep"
                onClick={notificationCenter.resetDemo}
                type="button"
              >
                รีเซ็ตสถานะ demo
              </button>
            </Card>
          )}
        </section>

        <NoticeBox tone="info" title="ขอบเขต M35">
          การกดอ่าน/ซ่อน/ตั้งค่า เก็บเฉพาะใน localStorage ของเครื่องนี้ ไม่ขอสิทธิ์แจ้งเตือน ไม่ส่ง LINE ไม่ส่ง SMS/อีเมล และไม่เขียน backend
        </NoticeBox>
      </div>
    </div>
  );
}
