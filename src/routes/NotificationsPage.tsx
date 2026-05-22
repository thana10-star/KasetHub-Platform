import { Bell, Bot, LineChart, Newspaper, UsersRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
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

const mockCropPriceAlerts = [
  {
    id: 'mock-price-alert-rice-up',
    title: 'ราคาข้าวหอมมะลิปรับขึ้น',
    body: 'ราคาอ้างอิงตัวอย่างข้าวหอมมะลิ 105 เพิ่มขึ้นจากข้อมูล mock ก่อนหน้า',
    route: '/app/prices/price-rice-jasmine-105-yasothon-demo',
    tone: 'up',
  },
  {
    id: 'mock-price-alert-cassava-down',
    title: 'ราคามันสำปะหลังลดลง',
    body: 'ราคาอ้างอิงตัวอย่างมันสำปะหลังสดลดลงจากข้อมูล mock ก่อนหน้า',
    route: '/app/prices/price-cassava-fresh-korat-demo',
    tone: 'down',
  },
];

export function NotificationsPage() {
  return (
    <div>
      <PageHeader title="การแจ้งเตือน" subtitle="ข่าวสารและกิจกรรมในแอป" showBack />
      <div className="grid gap-5 px-5 pb-6">
        <NoticeBox tone="warning" title="แจ้งเตือนราคายังเป็นตัวอย่าง">
          ยังไม่มี push notification จริง ไม่มี API ราคา และไม่มี backend job รายการด้านล่างเป็น mock alert เพื่อทดสอบ UX เท่านั้น
        </NoticeBox>

        <section className="grid gap-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-extrabold text-kaset-ink">แจ้งเตือนราคาพืชผลตัวอย่าง</h2>
            <Badge tone="neutral">demo</Badge>
          </div>
          {mockCropPriceAlerts.map((alert) => (
            <Link key={alert.id} to={alert.route}>
              <Card className="p-4">
                <div className="flex gap-3">
                  <span
                    className={cx(
                      'grid h-11 w-11 shrink-0 place-items-center rounded-lg',
                      alert.tone === 'up' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700',
                    )}
                  >
                    <LineChart aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap gap-2">
                      <Badge tone="gold">ราคาอ้างอิง</Badge>
                      <Badge tone="neutral">ตัวอย่างเดโม</Badge>
                    </div>
                    <h3 className="mt-2 text-sm font-extrabold leading-5 text-kaset-ink">{alert.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{alert.body}</p>
                    <p className="mt-2 text-xs leading-5 text-amber-900">
                      ราคาจริงขึ้นกับพื้นที่ เกรดสินค้า ความชื้น ฤดูกาล และผู้รับซื้อ
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </section>

        <section className="grid gap-3">
          <h2 className="text-lg font-extrabold text-kaset-ink">การแจ้งเตือนอื่น ๆ</h2>
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
        </section>
      </div>
    </div>
  );
}
