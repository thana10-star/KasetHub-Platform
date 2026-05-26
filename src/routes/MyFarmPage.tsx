import type { LucideIcon } from 'lucide-react';
import {
  Bell,
  Bot,
  Calculator,
  CalendarDays,
  Camera,
  ChevronRight,
  ClipboardList,
  CloudSun,
  FileText,
  HelpCircle,
  Leaf,
  Ruler,
  Settings,
  ShieldCheck,
  Sparkles,
  WalletCards,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { LargeActionButton } from '@/components/ui/LargeActionButton';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { StatusPill } from '@/components/ui/StatusPill';
import { useMyFarmHub } from '@/hooks/useMyFarmHub';
import { useNotificationCenter } from '@/hooks/useNotificationCenter';
import type { MyFarmQuickAction, MyFarmTimelineItemType } from '@/services/my-farm/my-farm.types';

const quickActionIcons: Record<MyFarmQuickAction['iconKey'], LucideIcon> = {
  scan: Camera,
  area: Ruler,
  records: ClipboardList,
  weather: CloudSun,
  price: Bell,
  ai: Bot,
  calculator: Calculator,
};

const timelineIcons: Record<MyFarmTimelineItemType, LucideIcon> = {
  analysis_result: Camera,
  farm_record: Leaf,
  farm_activity: ClipboardList,
  farm_finance: WalletCards,
  farm_harvest: Leaf,
  farm_plot: Ruler,
  crop_watch: Bell,
  ai_question: Bot,
  saved_article: FileText,
  saved_video: Sparkles,
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat('th-TH', {
    currency: 'THB',
    maximumFractionDigits: 0,
    style: 'currency',
  }).format(value);
}

function formatOptionalDate(value: string | undefined) {
  return value ?? 'ยังไม่มี';
}

function formatOptionalCurrency(value: number | undefined) {
  return value === undefined ? 'ยังคำนวณไม่ได้' : formatCurrency(value);
}

function formatOptionalNumber(value: number | undefined, unit: string) {
  return value === undefined ? 'ยังไม่มีข้อมูล' : `${value.toLocaleString('th-TH', { maximumFractionDigits: 2 })} ${unit}`;
}

function EmptyAction({
  cta,
  detail,
  title,
  to,
}: {
  cta: string;
  detail: string;
  title: string;
  to: string;
}) {
  return (
    <Card className="p-4 text-center">
      <p className="font-extrabold text-kaset-ink">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{detail}</p>
      <Link to={to}>
        <span className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-kaset-deep px-4 text-sm font-extrabold text-white">
          {cta}
        </span>
      </Link>
    </Card>
  );
}

export function MyFarmPage() {
  const hub = useMyFarmHub();
  const notificationCenter = useNotificationCenter();
  const analysisItems = hub.guestMemory.state.savedItems.filter((item) => item.itemType === 'analysis_result');
  const savedArticles = hub.guestMemory.state.savedItems.filter((item) => item.itemType === 'article');
  const savedVideos = hub.guestMemory.state.savedItems.filter((item) => item.itemType === 'video');
  const recentQuestions = hub.guestMemory.state.recentAIQuestions.slice(0, 3);
  const recentFarmRecords = hub.guestMemory.state.farmRecords.slice(0, 3);
  const latestSavedContent = [...savedArticles, ...savedVideos]
    .sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime())
    .slice(0, 4);

  return (
    <div>
      <PageHeader title="ฟาร์มของฉัน" subtitle="เริ่มจากเพิ่มแปลง แล้วบันทึกรายรับรายจ่ายหรือผลผลิต" showBack />
      <div className="grid gap-5 px-5 pb-6">
        <Card className="border-kaset-leaf/30 bg-kaset-mint p-4" data-testid="my-farm-primary-area">
          <div className="grid gap-4">
            <div className="flex gap-3">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-white text-kaset-deep shadow-soft">
                <Leaf aria-hidden="true" className="h-6 w-6" />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="text-2xl font-extrabold leading-8 text-kaset-ink">ฟาร์มของฉัน</h2>
                <p className="mt-1 text-sm font-semibold leading-6 text-slate-700">เริ่มจากเพิ่มแปลง แล้วบันทึกรายรับรายจ่ายหรือผลผลิต</p>
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              <Link className="inline-flex min-h-12 items-center justify-center rounded-lg bg-kaset-deep px-3 text-sm font-extrabold text-white" to="/app/farm-records">
                เปิดสมุดฟาร์ม
              </Link>
              <Link className="inline-flex min-h-12 items-center justify-center rounded-lg bg-white px-3 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10" to="/app/farm-records">
                บันทึกรายรับ/รายจ่าย
              </Link>
              <Link className="inline-flex min-h-12 items-center justify-center rounded-lg bg-white px-3 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10" to="/app/farm-records">
                บันทึกผลผลิต
              </Link>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="rounded-lg bg-white/80 p-3">
                <p className="text-xs font-bold text-slate-500">กำไร/ขาดทุน</p>
                <p className="mt-1 break-words text-sm font-extrabold text-kaset-deep">{formatCurrency(hub.summary.farmLedgerNetProfit)}</p>
              </div>
              <div className="rounded-lg bg-white/80 p-3">
                <p className="text-xs font-bold text-slate-500">ผลผลิตรวม</p>
                <p className="mt-1 break-words text-sm font-extrabold text-kaset-deep">{formatOptionalNumber(hub.summary.farmTotalHarvestKg, 'กก.')}</p>
              </div>
            </div>
            <Link className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-white/70 px-3 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10 sm:w-fit" to="/app/help">
              <HelpCircle aria-hidden="true" className="h-4 w-4" />
              ดูวิธีใช้
            </Link>
          </div>
        </Card>

        <NoticeBox tone="success" title="ข้อมูลฟาร์มยังอยู่ในเครื่องนี้" icon={ShieldCheck}>
          ใช้บันทึกข้อมูลพื้นฐานก่อนได้ รายละเอียดและสถานะขั้นสูงดูได้ด้านล่าง
        </NoticeBox>

        <Link to="/app/notifications">
          <Card className="p-4">
            <div className="flex gap-3">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
                <Bell aria-hidden="true" className="h-6 w-6" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-extrabold text-kaset-ink">แจ้งเตือนฟาร์มของฉัน</h2>
                  <Badge tone={notificationCenter.digest.unreadCount > 0 ? 'gold' : 'green'}>
                    {notificationCenter.digest.unreadCount} ยังไม่อ่าน
                  </Badge>
                </div>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  รวมงานฟาร์ม ราคา อากาศ และเรื่องที่ควรติดตามไว้ในที่เดียว
                </p>
              </div>
            </div>
          </Card>
        </Link>

        <details className="group rounded-lg border border-slate-200 bg-white shadow-card" data-testid="my-farm-secondary-data">
          <summary className="flex min-h-[68px] cursor-pointer list-none items-center gap-3 p-4 [&::-webkit-details-marker]:hidden">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mist text-kaset-deep">
              <ClipboardList aria-hidden="true" className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-extrabold leading-6 text-kaset-ink">ข้อมูลฟาร์มเพิ่มเติม</span>
              <span className="mt-1 block text-sm leading-6 text-slate-600">ดูรายละเอียด ต้นทุน และสถานะข้อมูลที่บันทึกไว้</span>
            </span>
            <ChevronRight aria-hidden="true" className="h-5 w-5 shrink-0 text-kaset-deep transition group-open:rotate-90" />
          </summary>
          <div className="grid gap-3 border-t border-slate-200 p-3">
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-4">
                <p className="text-3xl font-extrabold text-kaset-deep">{hub.summary.totalLocalItems}</p>
                <p className="mt-1 text-xs font-bold leading-5 text-slate-500">รายการที่บันทึกไว้</p>
              </Card>
              <Card className="p-4">
                <p className="text-3xl font-extrabold text-kaset-deep">{hub.summary.timelineCount}</p>
                <p className="mt-1 text-xs font-bold leading-5 text-slate-500">รายการในไทม์ไลน์</p>
              </Card>
            </div>

            <Link to="/app/farm-records#farm-cost-dashboard">
              <Card className="border-kaset-leaf/30 bg-kaset-mint p-4 shadow-none">
                <div className="flex gap-3">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-white text-kaset-deep shadow-soft">
                    <ClipboardList aria-hidden="true" className="h-6 w-6" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap gap-2">
                      <Badge tone="green">บันทึกในเครื่องนี้</Badge>
                      <Badge tone="green">สำรอง/กู้คืนได้</Badge>
                      <Badge tone="neutral">ซิงก์บัญชีปิดอยู่</Badge>
                    </div>
                    <h2 className="mt-2 font-extrabold leading-6 text-kaset-ink">สมุดฟาร์มของฉัน</h2>
                    <p className="mt-1 text-sm leading-6 text-slate-600">ดูรายรับรายจ่าย ผลผลิต และข้อมูลฟาร์มที่คุณบันทึกไว้</p>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <div className="rounded-lg bg-white/80 p-3">
                        <p className="text-xs font-bold text-slate-500">กำไรสุทธิ</p>
                        <p className="mt-1 break-words text-sm font-extrabold text-kaset-deep">{formatCurrency(hub.summary.farmLedgerNetProfit)}</p>
                      </div>
                      <div className="rounded-lg bg-white/80 p-3">
                        <p className="text-xs font-bold text-slate-500">รอบปลูกใช้งานอยู่</p>
                        <p className="mt-1 text-sm font-extrabold text-kaset-deep">{hub.summary.farmActiveCropCycleCount.toLocaleString('th-TH')}</p>
                      </div>
                      <div className="rounded-lg bg-white/80 p-3">
                        <p className="text-xs font-bold text-slate-500">ต้นทุนต่อไร่</p>
                        <p className="mt-1 break-words text-sm font-extrabold text-kaset-deep">{formatOptionalCurrency(hub.summary.farmCostPerRai)}</p>
                      </div>
                      <div className="rounded-lg bg-white/80 p-3">
                        <p className="text-xs font-bold text-slate-500">หมวดรายจ่ายสูงสุด</p>
                        <p className="mt-1 break-words text-sm font-extrabold text-kaset-deep">{hub.summary.farmTopExpenseCategory ?? 'ยังไม่มี'}</p>
                      </div>
                      <div className="rounded-lg bg-white/80 p-3">
                        <p className="text-xs font-bold text-slate-500">ผลผลิตรวม</p>
                        <p className="mt-1 break-words text-sm font-extrabold text-kaset-deep">{formatOptionalNumber(hub.summary.farmTotalHarvestKg, 'กก.')}</p>
                      </div>
                      <div className="rounded-lg bg-white/80 p-3">
                        <p className="text-xs font-bold text-slate-500">ต้นทุนต่อกก.</p>
                        <p className="mt-1 break-words text-sm font-extrabold text-kaset-deep">{formatOptionalCurrency(hub.summary.farmCostPerKg)}</p>
                      </div>
                      <div className="rounded-lg bg-white/80 p-3">
                        <p className="text-xs font-bold text-slate-500">กิจกรรมล่าสุด</p>
                        <p className="mt-1 break-words text-sm font-extrabold text-kaset-deep">{formatOptionalDate(hub.summary.latestFarmActivityDate)}</p>
                      </div>
                      <div className="rounded-lg bg-white/80 p-3">
                        <p className="text-xs font-bold text-slate-500">บัญชีล่าสุด</p>
                        <p className="mt-1 break-words text-sm font-extrabold text-kaset-deep">{formatOptionalDate(hub.summary.latestFarmFinanceEntryDate)}</p>
                      </div>
                      <div className="rounded-lg bg-white/80 p-3">
                        <p className="text-xs font-bold text-slate-500">เก็บเกี่ยวล่าสุด</p>
                        <p className="mt-1 break-words text-sm font-extrabold text-kaset-deep">{formatOptionalDate(hub.summary.latestFarmHarvestDate)}</p>
                      </div>
                    </div>
                    <p className="mt-3 text-sm font-extrabold text-kaset-deep">ดูต้นทุน รายรับรายจ่าย และผลผลิตที่บันทึกไว้</p>
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        </details>

        <section className="grid gap-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-extrabold text-kaset-ink">ทางลัดในฟาร์ม</h2>
            <StatusPill tone="info">ไม่ต้องสมัครก่อนใช้</StatusPill>
          </div>
          <div className="grid gap-3">
            {hub.quickActions.map((action) => (
              <LargeActionButton
                description={action.description}
                icon={quickActionIcons[action.iconKey]}
                key={action.id}
                label={action.label}
                to={action.route}
                variant={action.tone}
              />
            ))}
            <LargeActionButton
              description="อ่านหัวข้อดิน น้ำ ปุ๋ย พืชหลัก และบัญชีฟาร์มจากบทความที่ฝังอยู่ในแอป"
              icon={FileText}
              label="คลังความรู้เกษตรออฟไลน์"
              to="/app/articles/offline"
              variant="white"
            />
          </div>
        </section>

        <section className="grid gap-3">
          <h2 className="text-lg font-extrabold text-kaset-ink">ภาพรวมฟาร์ม</h2>
          <div className="grid grid-cols-2 gap-3">
            {hub.insights.map((insight) => (
              <Link key={insight.id} to={insight.route}>
                <Card className="h-full p-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge tone={insight.tone}>{insight.badgeLabel}</Badge>
                  </div>
                  <p className="mt-3 text-2xl font-extrabold text-kaset-deep">{insight.valueLabel}</p>
                  <h3 className="mt-2 text-sm font-extrabold leading-5 text-kaset-ink">{insight.title}</h3>
                  <p className="mt-1 text-xs font-semibold leading-5 text-slate-600">{insight.detail}</p>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {hub.nextActions.length > 0 ? (
          <section className="grid gap-3">
            <h2 className="text-lg font-extrabold text-kaset-ink">ทำอะไรต่อดี</h2>
            {hub.nextActions.map((action) => (
              <Link key={action.id} to={action.route}>
                <Card className={action.priority === 'primary' ? 'border-kaset-leaf bg-kaset-mint p-4' : 'p-4'}>
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white text-kaset-deep shadow-soft">
                      <ChevronRight aria-hidden="true" className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-extrabold leading-6 text-kaset-ink">{action.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{action.detail}</p>
                      <p className="mt-2 text-sm font-extrabold text-kaset-deep">{action.ctaLabel}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </section>
        ) : null}

        <section className="grid gap-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-extrabold text-kaset-ink">แปลงของฉัน</h2>
            <Badge tone="green">{hub.farmArea.plots.length} แปลง</Badge>
          </div>
          {hub.farmArea.plots.length > 0 ? (
            hub.farmArea.plots.slice(0, 3).map((plot) => (
              <Card className="p-4" key={plot.id}>
                <div className="flex gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
                    <Ruler aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <Badge tone="neutral">ข้อมูลในเครื่อง</Badge>
                    <h3 className="mt-2 font-extrabold leading-6 text-kaset-ink">{plot.name}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {plot.areaLabels.rai} · {plot.dimensionsLabel}
                    </p>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <EmptyAction
              cta="วัดพื้นที่แปลง"
              detail="คำนวณพื้นที่แบบประมาณการและเก็บไว้ในเครื่องนี้"
              title="ยังไม่มีแปลงที่บันทึก"
              to="/app/farm-area"
            />
          )}
        </section>

        <section className="grid gap-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-extrabold text-kaset-ink">ประวัติวิเคราะห์โรคพืช</h2>
            <Badge tone="sky">{recentFarmRecords.length + analysisItems.length} รายการ</Badge>
          </div>
          {recentFarmRecords.length + analysisItems.length > 0 ? (
            <>
              {recentFarmRecords.map((record) => (
                <Card className="p-4" key={record.id}>
                  <div className="flex gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-sky-100 text-sky-800">
                      <Camera aria-hidden="true" className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <Badge tone="sky">บันทึกไว้ในเครื่องนี้</Badge>
                      <h3 className="mt-2 font-extrabold leading-6 text-kaset-ink">{record.cropName}</h3>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{record.diseaseName}</p>
                    </div>
                  </div>
                </Card>
              ))}
              {analysisItems.slice(0, 2).map((item) => (
                <Card className="p-4" key={item.id}>
                  <div className="flex gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-sky-100 text-sky-800">
                      <Camera aria-hidden="true" className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <Badge tone="neutral">ผลที่บันทึกไว้</Badge>
                      <h3 className="mt-2 font-extrabold leading-6 text-kaset-ink">{item.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{item.summary}</p>
                    </div>
                  </div>
                </Card>
              ))}
              <Link className="text-center text-sm font-extrabold text-kaset-deep" to="/app/analysis-history">
                ดูประวัติวิเคราะห์ทั้งหมด
              </Link>
            </>
          ) : (
            <EmptyAction
              cta="เริ่มวิเคราะห์โรคพืช"
              detail="เมื่อบันทึกผลวิเคราะห์แล้ว จะแสดงไว้ในหน้านี้"
              title="ยังไม่มีผลวิเคราะห์ที่บันทึก"
              to="/app/analyze"
            />
          )}
        </section>

        <section className="grid gap-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-extrabold text-kaset-ink">ราคาเกษตรที่ติดตาม</h2>
            <Badge tone="gold">{hub.cropWatch.watches.length} พืช</Badge>
          </div>
          {hub.cropWatch.watches.length > 0 ? (
            hub.cropWatch.watches.slice(0, 3).map((watch) => (
              <Card className="p-4" key={watch.id}>
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-amber-100 text-amber-800">
                    <Bell aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-extrabold leading-6 text-kaset-ink">{watch.cropName}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      รอแหล่งข้อมูลราคา · {watch.preferredMarketLabel}
                    </p>
                  </div>
                  <StatusPill tone={watch.enabled ? 'success' : 'neutral'}>{watch.enabled ? 'เปิด' : 'ปิด'}</StatusPill>
                </div>
              </Card>
            ))
          ) : (
            <EmptyAction
              cta="เช็กราคาเกษตร"
              detail="ดูรายการสินค้าที่เตรียมเชื่อมแหล่งข้อมูลราคาจริง"
              title="ยังไม่มีพืชที่ติดตาม"
              to="/app/prices"
            />
          )}
        </section>

        <section className="grid gap-3">
          <h2 className="text-lg font-extrabold text-kaset-ink">สภาพอากาศที่เกี่ยวข้อง</h2>
          <Card className="p-4">
            <div className="flex gap-3">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-sky-100 text-sky-800">
                <CloudSun aria-hidden="true" className="h-6 w-6" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap gap-2">
                  <Badge tone="neutral">อากาศเกษตร</Badge>
                  <Badge tone="neutral">พื้นที่ที่เลือก</Badge>
                  <Badge tone="sky">{hub.weather.forecast.updatedAtLabel}</Badge>
                </div>
                <h3 className="mt-2 font-extrabold leading-6 text-kaset-ink">{hub.weather.forecast.location.label}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  {hub.weather.forecast.today.conditionLabel} · ฝน {hub.weather.forecast.today.rainChancePercent}% · ความชื้น{' '}
                  {hub.weather.forecast.today.humidityPercent}%
                </p>
                <Link className="mt-2 inline-flex text-sm font-extrabold text-kaset-deep" to="/app/weather">
                  เปิดหน้าสภาพอากาศ
                </Link>
                <Link className="ml-4 mt-2 inline-flex text-sm font-extrabold text-kaset-deep" to="/app/weather/preferences">
                  ตั้งค่าพื้นที่
                </Link>
              </div>
            </div>
          </Card>
        </section>

        <section className="grid gap-3">
          <h2 className="text-lg font-extrabold text-kaset-ink">บทความ/วิดีโอที่บันทึกไว้</h2>
          {latestSavedContent.length > 0 ? (
            latestSavedContent.map((item) => (
              <Card className="p-4" key={item.id}>
                <div className="flex gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
                    <FileText aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <Badge tone={item.itemType === 'video' ? 'sky' : 'green'}>
                      {item.itemType === 'video' ? 'วิดีโอ' : 'บทความ'}
                    </Badge>
                    <h3 className="mt-2 font-extrabold leading-6 text-kaset-ink">{item.title}</h3>
                    <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-600">{item.summary}</p>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <EmptyAction
              cta="หาเรื่องอ่าน"
              detail="บันทึกบทความหรือวิดีโอไว้ดูภายหลังได้"
              title="ยังไม่มีบทความหรือวิดีโอที่บันทึก"
              to="/app/articles"
            />
          )}
        </section>

        <section className="grid gap-3">
          <h2 className="text-lg font-extrabold text-kaset-ink">คำถาม AI ล่าสุด</h2>
          {recentQuestions.length > 0 ? (
            recentQuestions.map((question) => (
              <Card className="p-4" key={question.id}>
                <div className="flex gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
                    <Bot aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <Badge tone="neutral">คำถามที่บันทึกไว้</Badge>
                    <h3 className="mt-2 font-extrabold leading-6 text-kaset-ink">{question.question}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{question.answerSummary || question.topic || 'ถามต่อในหน้า AI ได้'}</p>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <EmptyAction cta="ถาม AI" detail="คำถามที่บันทึกไว้จะแสดงในหน้านี้" title="ยังไม่มีคำถาม AI ล่าสุด" to="/app/ai" />
          )}
        </section>

        <section className="grid gap-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-extrabold text-kaset-ink">ไทม์ไลน์ฟาร์มของฉัน</h2>
            <Badge tone="neutral">รายการที่บันทึกไว้</Badge>
          </div>
          {hub.timeline.length > 0 ? (
            hub.timeline.map((item) => {
              const Icon = timelineIcons[item.type];

              return (
                <Card className="p-4" key={item.id}>
                  <div className="flex gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mist text-kaset-deep">
                      <Icon aria-hidden="true" className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap gap-2">
                        <Badge tone="neutral">{item.sourceLabel}</Badge>
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-500">
                          <CalendarDays aria-hidden="true" className="h-3.5 w-3.5" />
                          {item.dateLabel}
                        </span>
                      </div>
                      <h3 className="mt-2 font-extrabold leading-6 text-kaset-ink">{item.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{item.subtitle}</p>
                      <Link className="mt-2 inline-flex text-sm font-extrabold text-kaset-deep" to={item.ctaRoute}>
                        {item.ctaLabel}
                      </Link>
                    </div>
                  </div>
                </Card>
              );
            })
          ) : (
            <EmptyAction
              cta="เริ่มใช้งานฟาร์มของฉัน"
              detail="เมื่อบันทึกผลวิเคราะห์ แปลง พืชที่ติดตาม หรือคำถาม AI ไทม์ไลน์จะแสดงที่นี่"
              title="ยังไม่มีไทม์ไลน์"
              to="/app/analyze"
            />
          )}
        </section>

        <LargeActionButton
          description="ดูสถานะข้อมูล วิธีสำรองในอนาคต และข้อมูลที่บันทึกไว้ในเครื่องนี้"
          icon={Settings}
          label="ตั้งค่าฟาร์มของฉัน"
          to="/app/my-farm/settings"
          variant="white"
        />

        <Link className="text-center text-sm font-extrabold text-kaset-deep" to="/app/profile">
          กลับไปโปรไฟล์
        </Link>
      </div>
    </div>
  );
}
