import {
  CalendarDays,
  CloudRain,
  CloudSun,
  Droplets,
  MapPin,
  ShieldAlert,
  Sprout,
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
import type { WeatherForecastDay } from '@/services/weather/weather.types';

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
  const {
    alerts,
    forecast,
    isLoading,
    locations,
    modeStatus,
    selectLocation,
    selectedLocationId,
  } = useWeather();
  const today = forecast.today;
  const current = forecast.current;
  const isOpenMeteo = forecast.source.sourceType === 'open_meteo';

  return (
    <div>
      <PageHeader title="สภาพอากาศเกษตร" subtitle="ฝน ลม ความชื้น และพยากรณ์สำหรับวางแผนงานแปลง" showBack />
      <div className="grid gap-5 px-5 pb-6">
        <Card className="overflow-hidden bg-kaset-deep text-white">
          <div className="relative p-5">
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10" />
            <div className="relative flex gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-white text-kaset-deep">
                <CloudSun aria-hidden="true" className="h-7 w-7" />
              </span>
              <div className="min-w-0">
                <StatusPill className="bg-white/15 text-white ring-white/20" tone={isOpenMeteo ? 'success' : 'warning'}>
                  {isOpenMeteo ? 'Open-Meteo' : 'local fixture'}
                </StatusPill>
                <h2 className="mt-3 text-2xl font-extrabold leading-8">{forecast.location.label}</h2>
                <p className="mt-2 text-sm leading-6 text-emerald-50/90">
                  {isOpenMeteo ? 'ข้อมูลอ้างอิงจาก API ภายนอก' : 'ใช้ข้อมูลตัวอย่างในเครื่องเมื่อ API ยังไม่เปิดหรือเรียกไม่ได้'}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill tone={modeStatus.canFetchOpenMeteo ? 'success' : 'warning'}>{modeStatus.mode}</StatusPill>
            <Badge tone="neutral">no GPS</Badge>
            <Badge tone="neutral">no location storage</Badge>
            {isLoading ? <Badge tone="sky">loading</Badge> : null}
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            {modeStatus.statusLabel} · source: {forecast.source.label} · fetched: {forecast.fetchedAtLabel ?? forecast.updatedAtLabel}
          </p>
        </Card>

        {forecast.isFallback ? (
          <NoticeBox tone="warning" icon={ShieldAlert} title="ใช้ข้อมูลสำรองในเครื่อง">
            {forecast.fallbackReason ?? 'Weather API ยังไม่เปิดหรือเรียกไม่ได้'} · local/mock fallback ยังพร้อมใช้งานเสมอ
          </NoticeBox>
        ) : (
          <NoticeBox tone="info" title="ข้อมูลอ้างอิงจาก API ภายนอก">
            ใช้ Open-Meteo public API แบบ no-key เฉพาะพิกัดเริ่มต้นที่ตั้งค่าไว้ ไม่ขอ GPS และไม่บันทึกตำแหน่งส่วนตัว
          </NoticeBox>
        )}

        <NoticeBox tone="warning" title="ข้อควรระวังสำหรับงานเกษตร">
          ก่อนพ่นยาให้ดูฝนและลม ข้อมูลอากาศเป็นการพยากรณ์ อาจคลาดเคลื่อนได้ ควรตรวจสภาพจริงที่แปลงก่อนตัดสินใจ
        </NoticeBox>

        {!isOpenMeteo && locations.length > 1 ? (
          <section className="grid gap-3">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-extrabold text-kaset-ink">พื้นที่ตัวอย่าง</h2>
              <StatusPill tone="info">{forecast.source.shortLabel}</StatusPill>
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
        ) : null}

        <Card className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap gap-2">
                <Badge tone="sky">{forecast.location.region}</Badge>
                <Badge tone="neutral">{current?.observedAtLabel ?? forecast.updatedAtLabel}</Badge>
              </div>
              <h2 className="mt-3 text-xl font-extrabold leading-7 text-kaset-ink">อากาศตอนนี้</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">{current?.conditionLabel ?? today.conditionLabel}</p>
            </div>
            <span className={cx('grid h-14 w-14 shrink-0 place-items-center rounded-lg', conditionIconClass[today.iconTone])}>
              <CloudSun aria-hidden="true" className="h-7 w-7" />
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-kaset-mist p-3">
              <ThermometerSun aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
              <p className="mt-2 text-2xl font-extrabold text-kaset-ink">{Math.round(current?.temperatureC ?? today.maxTempC)}°C</p>
              <p className="text-xs font-bold leading-5 text-slate-500">อุณหภูมิปัจจุบัน</p>
            </div>
            <div className="rounded-lg bg-sky-50 p-3">
              <CloudRain aria-hidden="true" className="h-5 w-5 text-sky-800" />
              <p className="mt-2 text-2xl font-extrabold text-sky-900">{today.rainChancePercent}%</p>
              <p className="text-xs font-bold leading-5 text-sky-800">โอกาสฝนสูงสุด</p>
            </div>
            <div className="rounded-lg bg-kaset-mist p-3">
              <Droplets aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
              <p className="mt-2 text-2xl font-extrabold text-kaset-ink">
                {current?.humidityPercent ?? today.humidityPercent}%
              </p>
              <p className="text-xs font-bold leading-5 text-slate-500">ความชื้น</p>
            </div>
            <div className="rounded-lg bg-kaset-mist p-3">
              <Wind aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
              <p className="mt-2 text-2xl font-extrabold text-kaset-ink">{Math.round(current?.windKph ?? today.windKph)}</p>
              <p className="text-xs font-bold leading-5 text-slate-500">กม./ชม. ความเร็วลม</p>
            </div>
          </div>
        </Card>

        <section className="grid grid-cols-2 gap-3">
          <Card className="p-4">
            <CloudRain aria-hidden="true" className="h-5 w-5 text-sky-800" />
            <p className="mt-3 text-2xl font-extrabold text-sky-900">{current?.precipitationMm ?? today.precipitationMm ?? 0} มม.</p>
            <p className="mt-1 text-xs font-bold leading-5 text-slate-500">ฝน/ปริมาณน้ำฝนล่าสุด</p>
          </Card>
          <Card className="p-4">
            <MapPin aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <p className="mt-3 text-lg font-extrabold leading-7 text-kaset-ink">{forecast.location.label}</p>
            <p className="mt-1 text-xs font-bold leading-5 text-slate-500">พิกัดเริ่มต้นจาก env เท่านั้น</p>
          </Card>
        </section>

        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Sprout aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <h2 className="font-extrabold text-kaset-ink">บันทึกสำหรับเกษตรกร</h2>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600">{today.summary}</p>
          <div className="mt-3">
            <RiskBadges risks={today.risks} />
          </div>
        </Card>

        <section className="grid gap-3">
          <h2 className="text-lg font-extrabold text-kaset-ink">พยากรณ์ 5-7 วัน</h2>
          {forecast.daily.slice(0, 7).map((day) => (
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
                    {day.conditionLabel} · ฝน {day.rainChancePercent}% · ลม {day.windKph} กม./ชม. · น้ำฝน {day.precipitationMm ?? 0} มม.
                  </p>
                  <div className="mt-3">
                    <RiskBadges risks={day.risks} />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </section>

        {alerts.length > 0 && !isOpenMeteo ? (
          <section className="grid gap-3">
            <h2 className="text-lg font-extrabold text-kaset-ink">แจ้งเตือนตัวอย่าง</h2>
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
                  </div>
                </div>
              </Card>
            ))}
          </section>
        ) : null}

        <LargeActionButton
          description="ดูร่วมกับแปลง พืชที่ติดตาม และคำถาม AI ล่าสุดในหน้าเดียว"
          icon={Sprout}
          label="กลับไป My Farm Hub"
          to="/app/my-farm"
          variant="white"
        />
      </div>
    </div>
  );
}
