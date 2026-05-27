import { Card } from '@/components/ui/Card';
import { useNotificationCenter } from '@/hooks/useNotificationCenter';
import { useWeather } from '@/hooks/useWeather';
import { buildHomeFarmHubViewModel } from '@/routes/home-farm-hub-model';
import {
  Bell,
  BookOpenCheck,
  Bot,
  Calculator,
  ChevronRight,
  CloudSun,
  Sprout,
  Tags,
  UserRound,
  UsersRound,
} from 'lucide-react';
import { Link } from 'react-router-dom';

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

function getWeatherSummary(input: { rainChancePercent: number; temperatureC: number; windKph: number }) {
  if (input.rainChancePercent >= 70) return 'ฝนมีโอกาสสูง วางแผนงานกลางแจ้งอย่างระวัง';
  if (input.temperatureC >= 35) return 'อากาศร้อน ควรดูแลน้ำและพักงานหนัก';
  if (input.windKph >= 24) return 'ลมค่อนข้างแรง เช็กก่อนพ่นยา';
  return 'เหมาะสำหรับเช็กงานในไร่ก่อนเริ่มวัน';
}

export function AppHomePage() {
  const notificationCenter = useNotificationCenter();
  const farmHub = buildHomeFarmHubViewModel();
  const { forecast } = useWeather();
  const currentWeather = forecast.current;
  const todayWeather = forecast.today;
  const temperatureC = Math.round(currentWeather?.temperatureC ?? todayWeather.maxTempC);
  const windKph = Math.round(currentWeather?.windKph ?? todayWeather.windKph);
  const rainChancePercent = todayWeather.rainChancePercent;
  const hasLiveWeatherSummary = forecast.apiStatus === 'ready' && !forecast.isFallback;
  const weatherSummary = getWeatherSummary({ rainChancePercent, temperatureC, windKph });

  return (
    <div className="min-h-full bg-gradient-to-b from-emerald-50 via-white to-kaset-mist/70">
      <div className="grid gap-5 px-4 pb-6 pt-4 sm:px-5">
        <header className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-2xl font-extrabold leading-8 text-kaset-ink">KasetHub</h1>
            <p className="text-sm font-semibold leading-6 text-slate-600">ผู้ช่วยเกษตรในมือถือ</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Link
              aria-label="ศูนย์แจ้งเตือน"
              className="relative grid h-11 w-11 place-items-center rounded-lg bg-white text-kaset-deep shadow-card ring-1 ring-kaset-deep/10"
              to="/app/notifications"
            >
              <Bell aria-hidden="true" className="h-5 w-5" />
              {notificationCenter.digest.unreadCount > 0 ? (
                <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-amber-500" />
              ) : null}
            </Link>
            <Link
              aria-label="โปรไฟล์"
              className="grid h-11 w-11 place-items-center rounded-lg bg-white text-kaset-deep shadow-card ring-1 ring-kaset-deep/10"
              to="/app/profile"
            >
              <UserRound aria-hidden="true" className="h-5 w-5" />
            </Link>
          </div>
        </header>

        <section aria-labelledby="home-weather-title">
          <Link className="block" to="/app/weather">
            <Card className="overflow-hidden bg-kaset-deep text-white">
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-white/95 text-kaset-deep">
                    <CloudSun aria-hidden="true" className="h-6 w-6" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold leading-6 text-emerald-50/85">พื้นที่ล่าสุด</p>
                    <h2 id="home-weather-title" className="text-xl font-extrabold leading-7">
                      สภาพอากาศวันนี้
                    </h2>
                    <p className="mt-1 break-words text-sm font-semibold leading-6 text-emerald-50/90">
                      {forecast.location.label}
                    </p>
                  </div>
                </div>

                {hasLiveWeatherSummary ? (
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <div className="rounded-lg bg-white/12 p-3">
                      <p className="text-xs font-bold leading-5 text-emerald-50/80">อุณหภูมิ</p>
                      <p className="text-2xl font-extrabold leading-8">{temperatureC}°C</p>
                    </div>
                    <div className="rounded-lg bg-white/12 p-3">
                      <p className="text-xs font-bold leading-5 text-emerald-50/80">โอกาสฝน</p>
                      <p className="text-2xl font-extrabold leading-8">{rainChancePercent}%</p>
                    </div>
                  </div>
                ) : (
                  <p className="mt-4 text-sm font-semibold leading-6 text-emerald-50/90">
                    เปิดหน้าสภาพอากาศเพื่อดูฝน อุณหภูมิ และความเสี่ยงก่อนวางแผนงานวันนี้
                  </p>
                )}

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <p className="min-w-0 flex-1 text-sm font-semibold leading-6 text-emerald-50/90">
                    {hasLiveWeatherSummary ? weatherSummary : 'ดูข้อมูลอากาศที่พร้อมใช้งานสำหรับพื้นที่ของคุณ'}
                  </p>
                  <span className="inline-flex min-h-10 shrink-0 items-center gap-1 rounded-lg bg-white px-3 text-sm font-extrabold text-kaset-deep">
                    ดูพยากรณ์
                    <ChevronRight aria-hidden="true" className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </Card>
          </Link>
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
  );
}
