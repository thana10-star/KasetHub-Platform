import { Bell, Bot, LineChart, Newspaper, UsersRound } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { cx } from '@/components/ui/classNames';
import { notifications } from '@/data/mockData';
import type { NotificationItem } from '@/types/kaset';

const iconMap: Record<NotificationItem['type'], typeof Bell> = {
  ai: Bot,
  price: LineChart,
  community: UsersRound,
  content: Newspaper,
};

const toneMap: Record<NotificationItem['type'], string> = {
  ai: 'bg-kaset-mint text-kaset-deep',
  price: 'bg-amber-100 text-amber-800',
  community: 'bg-sky-100 text-sky-800',
  content: 'bg-rose-100 text-rose-800',
};

export function NotificationsPage() {
  return (
    <div>
      <PageHeader title="การแจ้งเตือน" subtitle="ข่าวสารและกิจกรรมในแอป" showBack />
      <div className="grid gap-3 px-5 pb-6">
        {notifications.map((item) => {
          const Icon = iconMap[item.type];

          return (
            <Card className={cx('p-4', item.unread && 'border-kaset-leaf/30')} key={item.id}>
              <div className="flex gap-3">
                <span className={cx('grid h-11 w-11 shrink-0 place-items-center rounded-lg', toneMap[item.type])}>
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start gap-2">
                    <h2 className="flex-1 text-sm font-extrabold leading-5 text-kaset-ink">{item.title}</h2>
                    {item.unread ? <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-kaset-leaf" /> : null}
                  </div>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{item.body}</p>
                  <p className="mt-2 text-xs font-medium text-slate-400">{item.time}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
