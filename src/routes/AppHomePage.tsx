import { Card } from '@/components/ui/Card';
import { useNotificationCenter } from '@/hooks/useNotificationCenter';
import { useWeather } from '@/hooks/useWeather';
import { buildHomeFarmHubViewModel } from '@/routes/home-farm-hub-model';
import {
  getHomeCommodityPrices,
  getPriceAdapterSnapshot,
  type PriceAdapterSnapshot,
} from '@/services/prices/price-adapter-service';
import type { CommodityPrice } from '@/services/prices/price.types';
import {
  Bell,
  BookOpenCheck,
  Bot,
  Calculator,
  ChevronRight,
  CloudSun,
  ExternalLink,
  PlaySquare,
  Sprout,
  Tags,
  UserRound,
  UsersRound,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getLatestVideo, isUsableChannelVideo } from '@/services/youtube/youtube-service';
import type { ChannelVideo } from '@/services/youtube/youtube.types';

const quickActions = [
  {
    description: 'ถามเรื่องพืช ดิน โรค และงานฟาร์ม',
    href: '/app/ai',
    icon: Bot,
    label: 'ถาม AI เกษตร',
    tone: 'bg-emerald-100 text-emerald-800',
  },
  {
    description: 'ติดตามหมวดสินค้าที่กำลังเชื่อมข้อมูลจริง',
    href: '/app/prices',
    icon: Tags,
    label: 'ราคาเกษตร',
    tone: 'bg-amber-100 text-amber-800',
  },
  {
    description: 'อ่าน ถาม และแบ่งปันเรื่องเกษตร',
    href: '/app/community',
    icon: UsersRound,
    label: 'ชุมชนเกษตร',
    tone: 'bg-sky-100 text-sky-800',
  },
  {
    description: 'คำนวณปุ๋ย ระยะปลูก และงานไร่',
    href: '/app/calculators',
    icon: Calculator,
    label: 'เครื่องมือเกษตร',
    tone: 'bg-lime-100 text-lime-800',
  },
  {
    description: 'บันทึกงาน รายรับรายจ่าย และผลผลิต',
    href: '/app/my-farm',
    icon: Sprout,
    label: 'ฟาร์มของฉัน',
    tone: 'bg-kaset-mint text-kaset-deep',
  },
  {
    description: 'คู่มือเริ่มใช้และความรู้พื้นฐาน',
    href: '/app/help',
    icon: BookOpenCheck,
    label: 'ความรู้/บทความ',
    tone: 'bg-orange-100 text-orange-800',
  },
] as const;

const priceCategories = ['ข้าว', 'มันสำปะหลัง', 'ยางพารา', 'ปาล์มน้ำมัน'] as const;
const priceSnapshotItems = [
  {
    change: '1.2%',
    direction: 'up',
    dotTone: 'bg-emerald-500',
    name: 'ข้าวเปลือกหอมมะลิ',
    value: '12,800',
  },
  {
    change: '0.8%',
    direction: 'down',
    dotTone: 'bg-rose-500',
    name: 'ยางพารา',
    value: '58.50',
  },
  {
    change: '2.1%',
    direction: 'up',
    dotTone: 'bg-orange-500',
    name: 'มันสำปะหลัง',
    value: '3.20',
  },
  {
    change: '0.6%',
    direction: 'up',
    dotTone: 'bg-yellow-500',
    name: 'อ้อย',
    value: '1,120',
  },
] as const;

const latestVideoPlaceholder = {
  ctaHref: '/app/youtube',
  description: 'กำลังเตรียมเชื่อมวิดีโอล่าสุดจากช่อง',
  subtitle: 'วิดีโอจากช่อง KasetHub',
  title: 'วิดีโอล่าสุดจากช่อง',
} as const;

function getWeatherSummary(input: { rainChancePercent: number; temperatureC: number; windKph: number }) {
  if (input.rainChancePercent >= 70) return 'ฝนมีโอกาสสูง วางแผนงานกลางแจ้งอย่างระวัง';
  if (input.temperatureC >= 35) return 'อากาศร้อน ควรดูแลน้ำและพักงานหนัก';
  if (input.windKph >= 24) return 'ลมค่อนข้างแรง เช็กก่อนพ่นยา';
  return 'เหมาะสำหรับเช็กงานในไร่ก่อนเริ่มวัน';
}

function getWeatherStripSummary(input: {
  conditionLabel?: string;
  hasWeatherDisplayValues: boolean;
  rainChancePercent: number;
}) {
  if (!input.hasWeatherDisplayValues) return 'เปิดดูพยากรณ์เพื่อวางแผนวันนี้';

  return `${input.conditionLabel ?? 'อากาศวันนี้'} · โอกาสฝน ${input.rainChancePercent}%`;
}

function formatHomePrice(price: number) {
  return new Intl.NumberFormat('th-TH', {
    maximumFractionDigits: 2,
    minimumFractionDigits: Number.isInteger(price) ? 0 : 2,
  }).format(price);
}

function formatHomePriceValue(row: CommodityPrice) {
  if (typeof row.priceMax === 'number' && row.priceMax > row.price) {
    return `${formatHomePrice(row.price)}–${formatHomePrice(row.priceMax)}`;
  }

  return formatHomePrice(row.price);
}

function hasHomePriceRange(row: CommodityPrice) {
  return typeof row.priceMax === 'number' && row.priceMax > row.price;
}

function getHomeContextLabel(row: CommodityPrice) {
  if (row.freshnessPolicy === 'seasonal_reference') return 'ราคาอ้างอิงตามฤดูกาล';

  const contextParts = [
    row.province,
    row.marketName.includes('แป้ง 25%') ? 'แป้ง 25%' : undefined,
    hasHomePriceRange(row) ? 'ช่วงราคา' : undefined,
  ].filter(Boolean);

  return contextParts.length > 0 ? contextParts.join(' · ') : row.marketName;
}

function formatHomePriceUpdatedLabel(rows: CommodityPrice[]) {
  const latestUpdatedAt = rows
    .map((row) => row.updatedAt)
    .sort((left, right) => right.localeCompare(left))[0];

  if (!latestUpdatedAt) return 'รอวันที่อัปเดต';

  return new Intl.DateTimeFormat('th-TH', {
    dateStyle: 'medium',
    timeZone: 'Asia/Bangkok',
  }).format(new Date(latestUpdatedAt));
}

type AppHomePageProps = {
  priceSnapshot?: PriceAdapterSnapshot;
  latestVideo?: ChannelVideo | null;
};

export function AppHomePage({ latestVideo, priceSnapshot = getPriceAdapterSnapshot() }: AppHomePageProps = {}) {
  const notificationCenter = useNotificationCenter();
  const farmHub = buildHomeFarmHubViewModel();
  const { forecast } = useWeather();
  const configuredLatestVideo = latestVideo === undefined ? getLatestVideo() : latestVideo ?? undefined;
  const realLatestVideo = configuredLatestVideo && isUsableChannelVideo(configuredLatestVideo) ? configuredLatestVideo : undefined;
  const homeCommodityPrices = getHomeCommodityPrices(priceSnapshot);
  const hasValidatedPriceRows = priceSnapshot.hasValidatedCommodityPrices;
  const hasEligibleHomePrices = homeCommodityPrices.length > 0;
  const shouldShowSamplePrices = !hasValidatedPriceRows;
  const currentWeather = forecast.current;
  const todayWeather = forecast.today;
  const temperatureC = Math.round(currentWeather?.temperatureC ?? todayWeather.maxTempC);
  const windKph = Math.round(currentWeather?.windKph ?? todayWeather.windKph);
  const rainChancePercent = todayWeather.rainChancePercent;
  const hasLiveWeatherMode = forecast.apiStatus === 'ready' && !forecast.isFallback;
  const hasWeatherDisplayValues = Number.isFinite(temperatureC) && Number.isFinite(rainChancePercent);
  const weatherSummary = getWeatherSummary({ rainChancePercent, temperatureC, windKph });
  const weatherStripSummary = getWeatherStripSummary({
    conditionLabel: currentWeather?.conditionLabel ?? todayWeather.conditionLabel,
    hasWeatherDisplayValues,
    rainChancePercent,
  });

  return (
    <div className="min-h-full bg-gradient-to-b from-emerald-50 via-white to-kaset-mist/70">
      <div className="grid pb-6">
        <header
          aria-labelledby="home-premium-header-title"
          className="relative isolate overflow-hidden rounded-b-[2rem] bg-[radial-gradient(circle_at_18%_10%,rgba(180,244,207,0.24),transparent_30%),radial-gradient(circle_at_92%_6%,rgba(255,255,255,0.18),transparent_28%),linear-gradient(135deg,#064e3b_0%,#0b6b4a_52%,#073b2f_100%)] px-4 pb-10 pt-4 text-white shadow-[0_18px_46px_rgba(6,78,59,0.28)] sm:px-5"
          data-testid="home-premium-header"
        >
          <span aria-hidden="true" className="absolute -right-16 -top-16 h-44 w-44 rounded-full border border-white/20 bg-white/10" />
          <span aria-hidden="true" className="absolute -bottom-24 left-14 h-52 w-52 rounded-full border border-white/15" />
          <span aria-hidden="true" className="absolute bottom-4 right-10 h-24 w-24 rounded-full border border-emerald-100/20" />
          <span aria-hidden="true" className="absolute left-0 top-20 h-px w-full rotate-[-7deg] bg-white/18" />
          <span aria-hidden="true" className="absolute -bottom-1 left-10 h-14 w-[120%] rounded-t-[50%] border-t border-white/20" />

          <div className="relative z-10 flex items-center justify-between gap-3">
            <div className="min-w-0 flex items-center gap-3">
              <span
                aria-label="โลโก้ KasetHub"
                className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/95 text-kaset-deep shadow-[0_10px_24px_rgba(0,0,0,0.16)] ring-1 ring-white/50"
                role="img"
              >
                <Sprout aria-hidden="true" className="h-6 w-6" />
              </span>
              <div className="min-w-0">
                <h1 id="home-premium-header-title" className="text-2xl font-extrabold leading-8 text-white">
                  KasetHub
                </h1>
                <p className="break-words text-sm font-semibold leading-6 text-emerald-50/90">
                  ผู้ช่วยเกษตรในมือถือ
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Link
                aria-label="ศูนย์แจ้งเตือน"
                className="relative grid h-11 w-11 place-items-center rounded-xl bg-white/14 text-white shadow-[0_10px_22px_rgba(0,0,0,0.16)] ring-1 ring-white/20 backdrop-blur transition hover:bg-white/22"
                to="/app/notifications"
              >
                <Bell aria-hidden="true" className="h-5 w-5" />
                {notificationCenter.digest.unreadCount > 0 ? (
                  <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-amber-400 ring-2 ring-emerald-950/70" />
                ) : null}
              </Link>
              <Link
                aria-label="โปรไฟล์"
                className="grid h-11 w-11 place-items-center rounded-xl bg-white/14 text-white shadow-[0_10px_22px_rgba(0,0,0,0.16)] ring-1 ring-white/20 backdrop-blur transition hover:bg-white/22"
                to="/app/profile"
              >
                <UserRound aria-hidden="true" className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </header>

        <div className="-mt-6 grid gap-5 px-4 sm:px-5">
        <section aria-labelledby="home-weather-title" className="relative z-10 grid gap-3">
          <Card className="overflow-hidden border border-sky-100 bg-white p-3 shadow-card">
            <div className="flex items-start gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-sky-100 text-sky-800">
                <CloudSun aria-hidden="true" className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="break-words text-xs font-extrabold leading-5 text-sky-800">
                      {forecast.location.label}
                    </p>
                    <h2 id="home-weather-title" className="text-base font-extrabold leading-6 text-kaset-ink">
                      สภาพอากาศวันนี้
                    </h2>
                  </div>
                  <span
                    className={`inline-flex min-h-7 shrink-0 items-center gap-1.5 rounded-full px-2.5 text-xs font-extrabold ${
                      hasLiveWeatherMode ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {hasLiveWeatherMode ? <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> : null}
                    {hasLiveWeatherMode ? 'LIVE' : 'อัปเดตล่าสุด'}
                  </span>
                </div>
                <p className="mt-2 break-words text-sm font-semibold leading-5 text-slate-600">
                  {weatherStripSummary}
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="rounded-lg bg-sky-50 p-2.5">
                    <p className="text-xs font-extrabold leading-5 text-sky-800">อุณหภูมิ</p>
                    <p className="text-xl font-extrabold leading-7 text-kaset-ink">
                      {hasWeatherDisplayValues ? `${temperatureC}°C` : '--'}
                    </p>
                  </div>
                  <div className="rounded-lg bg-blue-50 p-2.5">
                    <p className="text-xs font-extrabold leading-5 text-blue-800">โอกาสฝน</p>
                    <p className="text-xl font-extrabold leading-7 text-kaset-ink">
                      {hasWeatherDisplayValues ? `${rainChancePercent}%` : '--'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="overflow-hidden border border-orange-100 bg-white p-3 shadow-card">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 id="home-price-snapshot-title" className="text-base font-extrabold leading-6 text-kaset-ink">
                  ราคาวันนี้
                </h2>
                <p className="mt-0.5 text-xs font-semibold leading-5 text-slate-500">
                  {hasEligibleHomePrices
                    ? `แหล่งข้อมูลจริง · อัปเดต ${formatHomePriceUpdatedLabel(homeCommodityPrices)}`
                    : shouldShowSamplePrices
                      ? 'ข้อมูลตัวอย่าง · รอเชื่อมแหล่งราคาจริง'
                      : 'ยังไม่มีแถวที่เหมาะกับหน้าแรก · ดูทั้งหมดในหน้าราคา'}
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-orange-100 px-2.5 py-1 text-xs font-extrabold text-orange-800">
                {hasEligibleHomePrices ? 'ราคาที่ตรวจสอบแล้ว' : shouldShowSamplePrices ? 'ยังไม่ใช่ราคาจริง' : 'ดูหน้าราคา'}
              </span>
            </div>
            <div className="mt-3 grid gap-2">
              {hasEligibleHomePrices ? (
                homeCommodityPrices.map((item) => (
                  <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 rounded-lg bg-orange-50/70 px-2.5 py-2" key={item.id}>
                    <span className={`h-2.5 w-2.5 rounded-full ${item.isStale ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                    <div className="min-w-0">
                      <p className="break-words text-sm font-extrabold leading-5 text-kaset-ink">{item.commodityNameTh}</p>
                      <p className="break-words text-xs font-extrabold leading-5 text-slate-600">{getHomeContextLabel(item)}</p>
                      <p className="break-words text-[11px] font-semibold leading-4 text-slate-500">
                        {item.sourceDisplayName} · อัปเดต {formatHomePriceUpdatedLabel([item])}
                      </p>
                    </div>
                    <div className="min-w-0 text-right">
                      <p className="whitespace-nowrap text-sm font-extrabold leading-5 text-kaset-ink">{formatHomePriceValue(item)}</p>
                      <p className="text-xs font-extrabold leading-5 text-slate-600">
                        {item.unit}
                        {hasHomePriceRange(item) ? ' · ช่วงราคา' : ''}
                        {item.freshnessPolicy === 'seasonal_reference' ? ' · อ้างอิง' : ''}
                        {item.isStale ? ' · ข้อมูลเก่า' : ''}
                      </p>
                    </div>
                  </div>
                ))
              ) : shouldShowSamplePrices ? (
                priceSnapshotItems.map((item) => {
                const isUp = item.direction === 'up';

                return (
                  <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 rounded-lg bg-orange-50/70 px-2.5 py-2" key={item.name}>
                    <span className={`h-2.5 w-2.5 rounded-full ${item.dotTone}`} />
                    <div className="min-w-0">
                      <p className="break-words text-sm font-extrabold leading-5 text-kaset-ink">{item.name}</p>
                      <p className="text-xs font-semibold leading-5 text-slate-500">ตัวอย่างราคา</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-extrabold leading-5 text-kaset-ink">{item.value}</p>
                      <p className={`text-xs font-extrabold leading-5 ${isUp ? 'text-emerald-700' : 'text-red-700'}`}>
                        {isUp ? '▲' : '▼'} {item.change}
                      </p>
                    </div>
                  </div>
                );
                })
              ) : (
                <div className="rounded-lg bg-orange-50/70 px-3 py-3">
                  <p className="text-sm font-extrabold leading-5 text-kaset-ink">ยังไม่มีราคาที่เหมาะกับหน้าแรก</p>
                  <p className="mt-1 text-xs font-semibold leading-5 text-slate-600">
                    แถวที่เป็นข้อมูลเก่าหรืออ้างอิงตามฤดูกาลยังดูได้ในหน้าราคาเกษตร
                  </p>
                </div>
              )}
            </div>
            <p className="mt-3 rounded-lg bg-yellow-50 px-3 py-2 text-xs font-semibold leading-5 text-yellow-900">
              {hasEligibleHomePrices
                ? 'แสดงเฉพาะแถวที่เหมาะกับหน้าแรก สินค้าที่ไม่มีข้อมูลจะไม่ใช้ตัวเลขตัวอย่างแทน'
                : shouldShowSamplePrices
                  ? 'โครงสร้างนี้เตรียมไว้สำหรับแหล่งราคาจริงและกราฟเล็กในอนาคต'
                  : 'ดูรายการทั้งหมด รวมถึงราคาอ้างอิงหรือข้อมูลเก่า ได้ที่หน้าราคาเกษตร'}
              {hasEligibleHomePrices && homeCommodityPrices.length < 4 ? (
                <Link className="ml-1 font-extrabold text-kaset-deep" to="/app/prices">
                  ดูทั้งหมด
                </Link>
              ) : null}
            </p>
          </Card>

          <div className="grid grid-cols-2 gap-2">
            <Link
              className="inline-flex min-h-11 items-center justify-center gap-1 rounded-lg bg-kaset-deep px-3 text-sm font-extrabold text-white"
              to="/app/weather"
            >
              ดูพยากรณ์
              <ChevronRight aria-hidden="true" className="h-4 w-4" />
            </Link>
            <Link
              className="inline-flex min-h-11 items-center justify-center gap-1 rounded-lg bg-amber-300 px-3 text-sm font-extrabold text-kaset-ink"
              to="/app/prices"
            >
              เช็กราคา
              <ChevronRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>

          <p className="sr-only">{weatherSummary}</p>
        </section>

        <section aria-labelledby="home-video-title">
          <Card className="overflow-hidden p-0">
            <div className="grid grid-cols-[104px_minmax(0,1fr)] gap-3 p-3">
              {realLatestVideo?.thumbnailUrl ? (
                <img
                  alt=""
                  className="h-full min-h-[116px] w-full rounded-lg object-cover"
                  src={realLatestVideo.thumbnailUrl}
                />
              ) : (
                <div className="grid min-h-[116px] place-items-center rounded-lg bg-gradient-to-br from-sky-100 via-emerald-100 to-orange-100 text-kaset-deep">
                  <PlaySquare aria-hidden="true" className="h-10 w-10" />
                </div>
              )}
              <div className="min-w-0 self-center">
                <p className="text-xs font-extrabold leading-5 text-sky-800">
                  {realLatestVideo?.channelName ?? latestVideoPlaceholder.subtitle}
                </p>
                <h2 id="home-video-title" className="break-words text-base font-extrabold leading-6 text-kaset-ink">
                  {realLatestVideo?.title ?? latestVideoPlaceholder.title}
                </h2>
                <p className="mt-1 break-words text-sm font-semibold leading-5 text-slate-600">
                  {realLatestVideo?.description ?? latestVideoPlaceholder.description}
                </p>
                {realLatestVideo ? (
                  <a
                    className="mt-3 inline-flex min-h-10 items-center justify-center gap-1 rounded-lg bg-kaset-deep px-3 text-sm font-extrabold text-white"
                    href={realLatestVideo.url}
                    rel="noreferrer"
                    target="_blank"
                  >
                    ดูวิดีโอ
                    <ExternalLink aria-hidden="true" className="h-4 w-4" />
                  </a>
                ) : (
                  <Link
                    className="mt-3 inline-flex min-h-10 items-center justify-center gap-1 rounded-lg bg-kaset-deep px-3 text-sm font-extrabold text-white"
                    to={latestVideoPlaceholder.ctaHref}
                  >
                    ดูวิดีโอ
                    <ChevronRight aria-hidden="true" className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </div>
          </Card>
        </section>

        <section aria-labelledby="home-quick-actions-title" className="grid gap-3">
          <h2 id="home-quick-actions-title" className="text-lg font-extrabold leading-7 text-kaset-ink">
            ทางลัดวันนี้
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <Link className="block min-w-0" key={action.href} to={action.href}>
                  <Card className="flex min-h-[138px] flex-col justify-between p-3 transition hover:-translate-y-0.5 hover:shadow-lg">
                    <span className={`grid h-10 w-10 place-items-center rounded-lg ${action.tone}`}>
                      <Icon aria-hidden="true" className="h-5 w-5" />
                    </span>
                    <div className="mt-3 min-w-0">
                      <h3 className="break-words text-sm font-extrabold leading-6 text-kaset-ink">{action.label}</h3>
                      <p className="mt-1 break-words text-xs font-semibold leading-5 text-slate-600">{action.description}</p>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        <section aria-labelledby="home-prices-title" className="grid gap-3">
          <div className="flex items-center justify-between gap-3">
            <h2 id="home-prices-title" className="text-lg font-extrabold leading-7 text-kaset-ink">
              ราคาเกษตร
            </h2>
            <Link className="text-sm font-extrabold text-kaset-deep" to="/app/prices">
              ดูทั้งหมด
            </Link>
          </div>
          <Card className="p-4">
            <div className="flex gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-amber-100 text-amber-800">
                <Tags aria-hidden="true" className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold leading-6 text-slate-600">กำลังเตรียมเชื่อมแหล่งข้อมูลราคาจริง</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {priceCategories.map((category) => (
                    <span className="rounded-lg bg-amber-50 px-3 py-2 text-xs font-extrabold text-amber-900" key={category}>
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </section>

        <section aria-labelledby="home-community-title" className="grid gap-3">
          <div className="flex items-center justify-between gap-3">
            <h2 id="home-community-title" className="text-lg font-extrabold leading-7 text-kaset-ink">
              ชุมชนเกษตร
            </h2>
            <Link className="text-sm font-extrabold text-kaset-deep" to="/app/community">
              เปิดชุมชน
            </Link>
          </div>
          <Card className="p-4">
            <div className="flex gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-sky-100 text-sky-800">
                <UsersRound aria-hidden="true" className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold leading-6 text-slate-600">
                  อ่าน ถาม และแบ่งปันเรื่องเกษตรกับชุมชน
                </p>
                <Link
                  className="mt-3 inline-flex min-h-10 items-center justify-center gap-1 rounded-lg bg-kaset-deep px-3 text-sm font-extrabold text-white"
                  to="/app/community"
                >
                  เปิดชุมชน
                  <ChevronRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </Card>
        </section>

        <section aria-labelledby="home-farm-hub-title">
          <Card className="p-4">
            <div className="flex gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
                <Sprout aria-hidden="true" className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <h2 id="home-farm-hub-title" className="text-lg font-extrabold leading-7 text-kaset-ink">
                  {farmHub.title}
                </h2>
                <p className="mt-1 text-sm font-semibold leading-6 text-slate-600">{farmHub.subtitle}</p>
                <Link
                  className="mt-3 inline-flex min-h-10 items-center justify-center gap-1 rounded-lg bg-kaset-deep px-3 text-sm font-extrabold text-white"
                  to={farmHub.primaryRoute}
                >
                  {farmHub.primaryLabel}
                  <ChevronRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </Card>
        </section>
      </div>
      </div>
    </div>
  );
}
