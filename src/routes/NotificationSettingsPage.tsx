import { Bell, BellOff, Clock3, ShieldCheck, ToggleLeft, ToggleRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { LargeActionButton } from '@/components/ui/LargeActionButton';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { StatusPill } from '@/components/ui/StatusPill';
import { useNotificationCenter } from '@/hooks/useNotificationCenter';
import { notificationTabLabels } from '@/services/notifications/notification-fixtures';

export function NotificationSettingsPage() {
  const notificationCenter = useNotificationCenter();

  return (
    <div>
      <PageHeader title="ตั้งค่าการแจ้งเตือน" subtitle="ตั้งค่าแจ้งเตือนตัวอย่างในเครื่องนี้เท่านั้น" showBack />
      <div className="grid gap-5 px-5 pb-6">
        <Card className="overflow-hidden bg-kaset-deep text-white">
          <div className="relative p-5">
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10" />
            <div className="relative flex gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-white text-kaset-deep">
                <Bell aria-hidden="true" className="h-7 w-7" />
              </span>
              <div className="min-w-0">
                <Badge className="bg-white/15 text-white" tone="green">
                  local preferences
                </Badge>
                <h2 className="mt-3 text-2xl font-extrabold leading-8">ยังไม่ขอสิทธิ์ push notification</h2>
                <p className="mt-2 text-sm leading-6 text-emerald-50/90">
                  การตั้งค่านี้ใช้ซ่อน/แสดงแจ้งเตือน mock ในแอปเท่านั้น ยังไม่ส่ง LINE, SMS, อีเมล หรือ push จริง
                </p>
              </div>
            </div>
          </div>
        </Card>

        <NoticeBox tone="warning" title="ข้อมูลอยู่ในเครื่องนี้เท่านั้น" icon={ShieldCheck}>
          preference ถูกเก็บใน localStorage key `kasethub.notificationCenter.v1` และไม่เขียนไป Supabase หรือ backend
        </NoticeBox>

        <section className="grid gap-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-extrabold text-kaset-ink">หมวดแจ้งเตือน</h2>
            <StatusPill tone="info">{notificationCenter.digest.enabledPreferenceCount} เปิดอยู่</StatusPill>
          </div>
          {notificationCenter.preferences.map((preference) => {
            const enabled = preference.enabled;
            const ToggleIcon = enabled ? ToggleRight : ToggleLeft;

            return (
              <Card className="p-4" key={preference.id}>
                <div className="flex gap-3">
                  <span className={enabled ? 'grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep' : 'grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-500'}>
                    {enabled ? <Bell aria-hidden="true" className="h-6 w-6" /> : <BellOff aria-hidden="true" className="h-6 w-6" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap gap-2">
                      <Badge tone={enabled ? 'green' : 'neutral'}>{enabled ? 'เปิด' : 'ปิด'}</Badge>
                      <Badge tone="neutral">{notificationTabLabels[preference.group]}</Badge>
                      <Badge tone="neutral">in-app local</Badge>
                    </div>
                    <h3 className="mt-2 font-extrabold leading-6 text-kaset-ink">{preference.label}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{preference.description}</p>
                    <button
                      className={enabled ? 'mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-kaset-deep px-4 text-sm font-extrabold text-white' : 'mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10'}
                      onClick={() => notificationCenter.setPreferenceEnabled(preference.id, !enabled)}
                      type="button"
                    >
                      <ToggleIcon aria-hidden="true" className="h-5 w-5" />
                      {enabled ? 'ปิดหมวดนี้' : 'เปิดหมวดนี้'}
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </section>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-amber-100 text-amber-900">
              <Clock3 aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-extrabold text-kaset-ink">Quiet hours ยังเป็นแผนอนาคต</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                M35 ยังไม่มี scheduler หรือ push channel จึงยังไม่ตั้งเวลาส่งจริงได้ ในอนาคตต้องใช้ consent, quiet hours และ rate limit ฝั่ง backend
              </p>
            </div>
          </div>
        </Card>

        <LargeActionButton
          description="ดูรายการแจ้งเตือน mock ทั้งหมดและสถานะอ่านแล้วในเครื่องนี้"
          icon={Bell}
          label="กลับไปศูนย์แจ้งเตือน"
          to="/app/notifications"
          variant="soft"
        />

        <button
          className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-amber-50 px-4 text-sm font-extrabold text-amber-900 ring-1 ring-amber-200"
          onClick={notificationCenter.resetDemo}
          type="button"
        >
          รีเซ็ตสถานะการแจ้งเตือน demo
        </button>

        <Link className="text-center text-sm font-extrabold text-kaset-deep" to="/app/profile">
          กลับไปโปรไฟล์
        </Link>
      </div>
    </div>
  );
}
