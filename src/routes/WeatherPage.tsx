import {
  Bot,
  CalendarDays,
  CloudRain,
  CloudSun,
  Droplets,
  ShieldAlert,
  Sprout,
  Sun,
  ThermometerSun,
  Wind,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { LargeActionButton } from '@/components/ui/LargeActionButton';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { StatusPill } from '@/components/ui/StatusPill';
import { cx } from '@/components/ui/classNames';
import { useWeather } from '@/hooks/useWeather';
import { weatherRiskLabels, weatherRiskTone } from '@/services/weather/weather-fixtures';
import type { CropWorkRecommendation, WeatherForecastDay } from '@/services/weather/weather.types';

const priorityTone: Record<CropWorkRecommendation['priority'], 'success' | 'warning' | 'danger'> = {
  good: 'success',
  caution: 'warning',
  avoid: 'danger',
};

const priorityLabel: Record<CropWorkRecommendation['priority'], string> = {
  good: 'ทำได้ถ้าตรวจซ้ำ',
  caution: 'ควรระวัง',
  avoid: 'ควรเลื่อน',
};

const conditionIconClass: Record<WeatherForecastDay['iconTone'], string> = {
  sun: 'bg-amber-100 text-amber-800',
  rain: 'bg-sky-100 text-sky-800',
  cloud: 'bg-slate-100 text-slate-700',
  storm: 'bg-indigo-100 text-indigo-800',
  heat: 'bg-rose-100 text-rose-800',
};

function RiskBadges({ risks }: { risks: WeatherForecastDay['risks'] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {risks.map((risk) => (
        <Badge key={risk} tone={weatherRiskTone[risk]}>
          {weatherRiskLabels[risk]}
        </Badge>
      ))}
    </div>
  );
}

export function WeatherPage() {
  const { alerts, forecast, futureSources, locations, selectLocation, selectedLocationId } = useWeather();
  const today = forecast.today;

  return (
    <div>
      <PageHeader title="สภาพอากาศเกษตร" subtitle="ฝน แดด ลม ความชื้น และคำแนะนำงานแปลงแบบตัวอย่าง" showBack />
      <div className="grid gap-5 px-5 pb-6">
        <Card className="overflow-hidden bg-kaset-deep text-white">
          <div className="relative p-5">
            <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/10" />
            <div className="relative flex gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-white text-kaset-deep">
                <CloudSun aria-hidden="true" className="h-7 w-7" />
              </span>
              <div className="min-w-0">
                <Badge className="bg-white/15 text-white" tone="green">
                  ข้อมูลตัวอย่าง
                </Badge>
                <h2 className="mt-3 text-2xl font-extrabold leading-8">ยังไม่ใช่ข้อมูลพยากรณ์จริง</h2>
                <p className="mt-2 text-sm leading-6 text-emerald-50/90">
                  หน้านี้ใช้ fixture ในเครื่องเท่านั้น ไม่มีการขอตำแหน่ง ไม่มี API อากาศ ไม่มี backend และไม่มีการแจ้งเตือนจริง
                </p>
              </div>
            </div>
          </div>
        </Card>

        <NoticeBox tone="warning" title="ข้อมูลอากาศเป็น demo/local เท่านั้น" icon={ShieldAlert}>
          {forecast.disclaimer}
        </NoticeBox>

        <section className="grid gap-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-extrabold text-kaset-ink">เลือกพื้นที่ตัวอย่าง</h2>
            <StatusPill tone="info">{forecast.source.label}</StatusPill>
          </div>
          <div className="-mx-5 overflow-x-auto px-5">
            <div className="flex min-w-max gap-2">
              {locations.map((location) => (
                <button
                  aria-pressed={selectedLocationId === location.id}
                  className={cx(
                    'min-h-11 rounded-full px-4 text-sm font-extrabold ring-1 ring-kaset-deep/10',
                    selectedLocationId === location.id
                      ? 'bg-kaset-deep text-white'
                      : 'bg-white text-kaset-deep hover:bg-kaset-mint',
                  )}
                  key={location.id}
                  onClick={() => selectLocation(location.id)}
                  type="button"
                >
                  {location.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <Card className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap gap-2">
                <Badge tone="sky">{forecast.location.region}</Badge>
                <Badge tone="neutral">{forecast.updatedAtLabel}</Badge>
              </div>
              <h2 className="mt-3 text-xl font-extrabold leading-7 text-kaset-ink">{forecast.location.label}</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">{today.conditionLabel}</p>
            </div>
            <span className={cx('grid h-14 w-14 shrink-0 place-items-center rounded-lg', conditionIconClass[today.iconTone])}>
              <CloudSun aria-hidden="true" className="h-7 w-7" />
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-kaset-mist p-3">
              <ThermometerSun aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
              <p className="mt-2 text-2xl font-extrabold text-kaset-ink">{today.maxTempC}°C</p>
              <p className="text-xs font-bold leading-5 text-slate-500">สูงสุด / ต่ำสุด {today.minTempC}°C</p>
            </div>
            <div className="rounded-lg bg-sky-50 p-3">
              <CloudRain aria-hidden="true" className="h-5 w-5 text-sky-800" />
              <p className="mt-2 text-2xl font-extrabold text-sky-900">{today.rainChancePercent}%</p>
              <p className="text-xs font-bold leading-5 text-sky-800">โอกาสฝนตัวอย่าง</p>
            </div>
            <div className="rounded-lg bg-kaset-mist p-3">
              <Droplets aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
              <p className="mt-2 text-2xl font-extrabold text-kaset-ink">{today.humidityPercent}%</p>
              <p className="text-xs font-bold leading-5 text-slate-500">ความชื้น</p>
            </div>
            <div className="rounded-lg bg-kaset-mist p-3">
              <Wind aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
              <p className="mt-2 text-2xl font-extrabold text-kaset-ink">{today.windKph}</p>
              <p className="text-xs font-bold leading-5 text-slate-500">กม./ชม. ลมตัวอย่าง</p>
            </div>
          </div>

          <div className="mt-4 grid gap-3 rounded-lg bg-amber-50 p-4">
            <div className="flex items-center gap-2">
              <Sun aria-hidden="true" className="h-5 w-5 text-amber-800" />
              <h3 className="font-extrabold text-amber-950">คำอธิบายสำหรับงานในแปลง</h3>
            </div>
            <p className="text-sm leading-6 text-amber-900">{today.summary}</p>
            <RiskBadges risks={today.risks} />
          </div>
        </Card>

        <section className="grid gap-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-extrabold text-kaset-ink">โอกาสฝนรายชั่วโมงตัวอย่าง</h2>
            <Badge tone="neutral">mock</Badge>
          </div>
          <div className="-mx-5 overflow-x-auto px-5">
            <div className="flex min-w-max gap-3">
              {forecast.hourly.map((hour) => (
                <Card className="w-28 p-3 text-center" key={hour.id}>
                  <p className="text-sm font-extrabold text-kaset-ink">{hour.timeLabel}</p>
                  <CloudRain aria-hidden="true" className="mx-auto mt-3 h-5 w-5 text-sky-800" />
                  <p className="mt-2 text-xl font-extrabold text-sky-900">{hour.rainChancePercent}%</p>
                  <p className="mt-1 text-xs font-bold leading-5 text-slate-500">{hour.temperatureC}°C</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-extrabold text-kaset-ink">คำแนะนำงานเกษตร</h2>
            <StatusPill tone="warning">ไม่ใช่คำสั่งทำงานจริง</StatusPill>
          </div>
          {forecast.recommendations.map((recommendation) => (
            <Card className="p-4" key={recommendation.id}>
              <div className="flex gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
                  <Sprout aria-hidden="true" className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap gap-2">
                    <StatusPill tone={priorityTone[recommendation.priority]}>
                      {priorityLabel[recommendation.priority]}
                    </StatusPill>
                    <Badge tone="neutral">{recommendation.actionLabel}</Badge>
                  </div>
                  <h3 className="mt-2 font-extrabold leading-6 text-kaset-ink">{recommendation.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{recommendation.detail}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {recommendation.riskIds.map((risk) => (
                      <Badge key={risk} tone={weatherRiskTone[risk]}>
                        {weatherRiskLabels[risk]}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </section>

        <section className="grid gap-3">
          <h2 className="text-lg font-extrabold text-kaset-ink">พยากรณ์ 7 วันตัวอย่าง</h2>
          {forecast.daily.map((day) => (
            <Card className="p-4" key={day.id}>
              <div className="flex gap-3">
                <span className={cx('grid h-11 w-11 shrink-0 place-items-center rounded-lg', conditionIconClass[day.iconTone])}>
                  <CalendarDays aria-hidden="true" className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-extrabold text-kaset-ink">{day.dayName}</h3>
                      <p className="mt-1 text-xs font-bold text-slate-500">{day.dateLabel}</p>
                    </div>
                    <p className="text-right text-sm font-extrabold text-kaset-deep">
                      {day.minTempC}-{day.maxTempC}°C
                    </p>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {day.conditionLabel} · ฝน {day.rainChancePercent}% · ความชื้น {day.humidityPercent}%
                  </p>
                  <div className="mt-3">
                    <RiskBadges risks={day.risks} />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </section>

        <section className="grid gap-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-extrabold text-kaset-ink">แจ้งเตือนอากาศตัวอย่าง</h2>
            <Badge tone="neutral">demo/mock</Badge>
          </div>
          {alerts.map((alert) => (
            <Card className="p-4" key={alert.id}>
              <div className="flex gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-sky-100 text-sky-800">
                  <CloudRain aria-hidden="true" className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap gap-2">
                    <Badge tone={weatherRiskTone[alert.riskId]}>{weatherRiskLabels[alert.riskId]}</Badge>
                    <Badge tone="neutral">{alert.demoLabel}</Badge>
                  </div>
                  <h3 className="mt-2 font-extrabold leading-6 text-kaset-ink">{alert.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{alert.body}</p>
                  <p className="mt-2 text-xs font-bold text-slate-500">{alert.locationLabel}</p>
                </div>
              </div>
            </Card>
          ))}
        </section>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
              <Bot aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-extrabold text-kaset-ink">AI ช่วยอธิบายได้ในอนาคต</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                ปุ่มนี้เป็นทางเข้าไปหน้า AI เท่านั้น ยังไม่ส่งข้อมูลอากาศหรือเรียก AI จริง
              </p>
            </div>
          </div>
          <LargeActionButton
            className="mt-4"
            description="เปิดหน้า AI แบบ mock/local และยังไม่มีการเรียก provider จริง"
            icon={Bot}
            label="ถาม AI เรื่องสภาพอากาศนี้"
            to="/app/ai"
            variant="soft"
          />
        </Card>

        <LargeActionButton
          description="ดูร่วมกับแปลง พืชที่ติดตาม และคำถาม AI ล่าสุดในหน้าเดียว"
          icon={Sprout}
          label="กลับไป My Farm Hub"
          to="/app/my-farm"
          variant="white"
        />

        <NoticeBox tone="info" title="แหล่งข้อมูลในอนาคต">
          ตอนนี้ใช้ {forecast.source.label} เท่านั้น แหล่งที่วางแผนไว้คือ{' '}
          {futureSources.map((source) => source.shortLabel).join(' / ')} โดยต้องมี caching, attribution,
          privacy และ disclaimer ก่อนเชื่อมต่อจริง
        </NoticeBox>
      </div>
    </div>
  );
}
