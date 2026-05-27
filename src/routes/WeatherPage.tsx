import {
  CalendarDays,
  Clock3,
  CloudRain,
  CloudSun,
  Droplets,
  MapPin,
  RefreshCw,
  Settings2,
  ShieldAlert,
  Sprout,
  ThermometerSun,
  Wind,
} from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { LargeActionButton } from '@/components/ui/LargeActionButton';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { StatusPill } from '@/components/ui/StatusPill';
import { cx } from '@/components/ui/classNames';
import { useWeather } from '@/hooks/useWeather';
import {
  weatherAgriRiskCategoryLabels,
  weatherAgriRiskLevelCardClass,
  weatherAgriRiskLevelLabels,
  weatherAgriRiskLevelNoteClass,
  weatherAgriRiskLevelRank,
  weatherAgriRiskLevelTone,
} from '@/services/weather/weather-agri-risk-boundary';
import { assessWeatherAgriRisk } from '@/services/weather/weather-agri-risk-rules';
import type { WeatherAgriRiskCard } from '@/services/weather/weather-agri-risk.types';
import { computeWeatherStaleAgeLabel } from '@/services/weather/weather-cache-qa';
import { buildWeatherCurrentSummary } from '@/services/weather/weather-current-summary';
import { weatherRiskLabels, weatherRiskTone } from '@/services/weather/weather-fixtures';
import { formatWeatherRefreshCooldown } from '@/services/weather/weather-refresh-policy';
import { farmerWeatherRiskNotes } from '@/services/weather/weather-risk-notes';
import { weatherCommonProvinceLocationIds } from '@/services/weather/weather-location-fixtures';
import { buildWeatherSourceReadiness } from '@/services/weather/weather-source-readiness';
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

function MetricCard({
  children,
  icon: Icon,
  label,
  tone = 'mist',
  value,
}: {
  children?: ReactNode;
  icon: typeof ThermometerSun;
  label: string;
  tone?: 'mist' | 'sky' | 'green';
  value: string;
}) {
  const toneClass =
    tone === 'sky'
      ? 'bg-sky-50 text-sky-900'
      : tone === 'green'
        ? 'bg-emerald-50 text-emerald-900'
        : 'bg-kaset-mist text-kaset-ink';

  return (
    <div className={cx('rounded-lg p-3', toneClass)}>
      <Icon aria-hidden="true" className="h-5 w-5" />
      <p className="mt-2 text-2xl font-extrabold">{value}</p>
      <p className="text-xs font-bold leading-5 opacity-80">{label}</p>
      {children}
    </div>
  );
}

function sortRiskCards(cards: WeatherAgriRiskCard[]) {
  return [...cards].sort((a, b) => weatherAgriRiskLevelRank[b.level] - weatherAgriRiskLevelRank[a.level]);
}

export function WeatherPage() {
  const {
    alerts,
    cacheStatus,
    clearSelectedCache,
    forecast,
    isLoading,
    lastSuccessfulRefresh,
    locationPrivacyStatus,
    locations,
    localPreferenceStatus,
    manualRefresh,
    manualRefreshMessage,
    modeStatus,
    refreshPolicy,
    selectLocation,
    selectedLocationId,
  } = useWeather();
  const today = forecast.today;
  const current = forecast.current;
  const isOpenMeteo = forecast.source.sourceType === 'open_meteo';
  const sourceReadiness = buildWeatherSourceReadiness({
    modeStatus,
    cacheStatus,
    isOpenMeteo,
    isFallback: forecast.isFallback,
    fetchedAtLabel: forecast.fetchedAtLabel ?? forecast.updatedAtLabel,
  });
  const staleAgeLabel = computeWeatherStaleAgeLabel(cacheStatus);
  const offlineState = sourceReadiness.offlineState;
  const agriRiskAssessment = assessWeatherAgriRisk({ forecast, cacheStatus });
  const sortedRiskCards = sortRiskCards(agriRiskAssessment.cards).slice(0, 6);
  const freshnessLabel = cacheStatus.isFresh ? 'ข้อมูลพยากรณ์ล่าสุด' : cacheStatus.isStale ? 'ข้อมูลอาจเก่า' : 'ข้อมูลสำรอง';
  const connectionLabel =
    offlineState.status === 'live'
      ? 'ข้อมูลพยากรณ์ล่าสุด'
      : offlineState.status === 'stale_cache'
        ? 'ใช้ข้อมูลล่าสุดในเครื่อง'
        : 'ใช้ข้อมูลสำรองในเครื่อง';
  const [pendingLocationId, setPendingLocationId] = useState(selectedLocationId);
  const selectedLocation = locations.find((location) => location.id === selectedLocationId) ?? forecast.location;
  const pendingLocation = locations.find((location) => location.id === pendingLocationId) ?? selectedLocation;
  const hasPendingLocationChange = pendingLocation.id !== selectedLocation.id;
  const locationGroups = locations.reduce<Array<{ region: string; locations: typeof locations }>>((groups, location) => {
    const group = groups.find((item) => item.region === location.region);

    if (group) {
      group.locations.push(location);
    } else {
      groups.push({ region: location.region, locations: [location] });
    }

    return groups;
  }, []);
  const quickLocations = weatherCommonProvinceLocationIds
    .map((locationId) => locations.find((location) => location.id === locationId))
    .filter((location): location is (typeof locations)[number] => Boolean(location));
  const currentConditionLabel = current?.conditionLabel ?? today.conditionLabel;
  const currentWindKph = Math.round(current?.windKph ?? today.windKph);
  const currentWeatherSummary = buildWeatherCurrentSummary({
    conditionLabel: currentConditionLabel,
    rainChancePercent: today.rainChancePercent,
    windKph: currentWindKph,
  });

  useEffect(() => {
    setPendingLocationId(selectedLocationId);
  }, [selectedLocationId]);

  return (
    <div>
      <PageHeader title="สภาพอากาศเกษตร" subtitle="ดูอากาศวันนี้และความเสี่ยงเบื้องต้นก่อนวางแผนงานแปลง" showBack />
      <div className="grid min-w-0 gap-5 overflow-x-hidden px-5 pb-6">
        {locations.length > 1 ? (
          <Card className="min-w-0 overflow-hidden p-4" data-testid="weather-location-selector">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-lg font-extrabold text-kaset-ink">เลือกพื้นที่ของคุณ</h2>
                <p className="mt-1 text-sm font-semibold leading-6 text-slate-600">
                  เลือกจังหวัดใกล้พื้นที่เพาะปลูกเพื่อดูพยากรณ์แบบหยาบ ไม่ใช้ GPS
                </p>
              </div>
              <StatusPill tone="info">ไม่ใช้ GPS</StatusPill>
            </div>

            <div
              className="mt-4 grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end"
              data-testid="weather-location-controls"
            >
              <label className="grid min-w-0 gap-2 text-sm font-extrabold text-kaset-ink" htmlFor="weather-location-select">
                จังหวัด
                <select
                  className="min-h-11 w-full max-w-full rounded-lg border border-kaset-deep/15 bg-white px-3 text-base font-bold text-kaset-ink shadow-inner outline-none ring-kaset-deep/20 focus:border-kaset-deep focus:ring-2"
                  id="weather-location-select"
                  onChange={(event) => setPendingLocationId(event.target.value)}
                  value={pendingLocationId}
                >
                  {locationGroups.map((group) => (
                    <optgroup key={group.region} label={group.region}>
                      {group.locations.map((location) => (
                        <option key={location.id} value={location.id}>
                          {location.label}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </label>
              <button
                className="inline-flex min-h-10 w-full items-center justify-center gap-2 whitespace-nowrap rounded-full bg-kaset-deep px-3.5 text-xs font-extrabold text-white shadow-[0_8px_18px_rgba(20,83,45,0.18)] ring-1 ring-emerald-950/10 transition hover:bg-kaset-ink sm:min-h-11 sm:w-fit sm:min-w-[148px] sm:px-4 sm:text-sm"
                data-testid="weather-location-confirm"
                onClick={() => selectLocation(pendingLocationId)}
                type="button"
              >
                <MapPin aria-hidden="true" className="h-4 w-4" />
                ยืนยันพื้นที่ของคุณ
              </button>
            </div>

            <div className="mt-3 grid gap-2 rounded-lg bg-kaset-mist p-3 text-xs font-bold leading-5 text-kaset-deep ring-1 ring-kaset-deep/5">
              <p>
                พื้นที่ปัจจุบัน:{' '}
                <span className="inline-flex rounded-full bg-white px-2 py-0.5 text-kaset-deep shadow-soft">
                  {selectedLocation.label}
                </span>
              </p>
              <p>
                {hasPendingLocationChange
                  ? `เลือกไว้: ${pendingLocation.label} กดยืนยันเพื่ออัปเดตพยากรณ์`
                  : 'เลือกพื้นที่แล้วพร้อมดูพยากรณ์ด้านล่าง'}
              </p>
            </div>
            <div className="mt-3 flex max-w-full flex-wrap gap-2 pb-1" aria-label="จังหวัดยอดนิยม">
              {quickLocations.map((location) => (
                <button
                  aria-pressed={pendingLocationId === location.id}
                  className={cx(
                    'min-h-9 rounded-full px-3 text-xs font-extrabold ring-1 ring-kaset-deep/10',
                    pendingLocationId === location.id
                      ? 'bg-kaset-deep text-white'
                      : 'bg-white text-kaset-deep hover:bg-kaset-mint',
                  )}
                  key={location.id}
                  onClick={() => setPendingLocationId(location.id)}
                  type="button"
                >
                  {location.label}
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs font-bold leading-5 text-slate-500">
              {locationPrivacyStatus.summary}
            </p>
          </Card>
        ) : null}

        <Card className="min-w-0 overflow-hidden p-0" data-testid="weather-current-card">
          <div className="bg-kaset-deep p-5 text-white">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <StatusPill className="bg-white/15 text-white ring-white/20" tone={isOpenMeteo ? 'success' : 'warning'}>
                  {freshnessLabel}
                </StatusPill>
                <h2 className="mt-3 text-2xl font-extrabold leading-8">อากาศตอนนี้</h2>
                <p className="mt-1 text-sm font-bold leading-6 text-emerald-50/90">{currentConditionLabel}</p>
                <p className="mt-2 text-sm font-semibold leading-6 text-emerald-50/90" data-testid="weather-current-rich-summary">
                  {currentWeatherSummary}
                </p>
              </div>
              <span className={cx('grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-white', conditionIconClass[today.iconTone])}>
                <CloudSun aria-hidden="true" className="h-7 w-7" />
              </span>
            </div>
            <div className="mt-4 grid gap-1 text-sm font-bold leading-6 text-emerald-50/90">
              <p>พื้นที่: {forecast.location.label}</p>
              <p>อัปเดตล่าสุด: {sourceReadiness.fetchedTimeLabel}</p>
            </div>
          </div>

          <div className="grid gap-3 p-4">
            <div className="grid grid-cols-2 gap-3">
              <MetricCard icon={ThermometerSun} label="อุณหภูมิปัจจุบัน" value={`${Math.round(current?.temperatureC ?? today.maxTempC)}°C`} />
              <MetricCard icon={CloudRain} label="โอกาสฝนสูงสุด" tone="sky" value={`${today.rainChancePercent}%`} />
              <MetricCard icon={Droplets} label="ความชื้น" tone="green" value={`${current?.humidityPercent ?? today.humidityPercent}%`} />
              <MetricCard icon={Wind} label="กม./ชม. ความเร็วลม" value={`${currentWindKph}`} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-sky-50 p-3 text-sky-900">
                <CloudRain aria-hidden="true" className="h-5 w-5" />
                <p className="mt-2 text-xl font-extrabold">{current?.precipitationMm ?? today.precipitationMm ?? 0} มม.</p>
                <p className="text-xs font-bold leading-5 text-sky-800">ฝน/ปริมาณน้ำฝนล่าสุด</p>
              </div>
              <div className="rounded-lg bg-kaset-mist p-3 text-kaset-ink">
                <MapPin aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
                <p className="mt-2 text-base font-extrabold leading-6">{forecast.location.label}</p>
                <p className="text-xs font-bold leading-5 text-slate-500">พื้นที่กลาง ไม่ใช่หมุดแปลง</p>
              </div>
            </div>
          </div>
        </Card>

        <section className="grid min-w-0 gap-3" data-testid="weather-daily-forecast">
          <h2 className="text-lg font-extrabold text-kaset-ink">พยากรณ์ 5-7 วัน</h2>
          {forecast.daily.slice(0, 7).map((day) => (
            <Card className="min-w-0 p-4" key={day.id}>
              <div className="flex min-w-0 gap-3">
                <span className={cx('grid h-11 w-11 shrink-0 place-items-center rounded-lg', conditionIconClass[day.iconTone])}>
                  <CalendarDays aria-hidden="true" className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex min-w-0 items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-extrabold text-kaset-ink">{day.dayName}</h3>
                      <p className="mt-1 text-xs font-bold text-slate-500">{day.dateLabel}</p>
                    </div>
                    <p className="shrink-0 text-right text-sm font-extrabold text-kaset-deep">
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

        <section className="grid gap-3" data-testid="weather-risk-summary">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-extrabold text-kaset-ink">ความเสี่ยงอากาศเบื้องต้น</h2>
            <StatusPill tone={weatherAgriRiskLevelTone[agriRiskAssessment.overallLevel]}>
              {weatherAgriRiskLevelLabels[agriRiskAssessment.overallLevel]}
            </StatusPill>
          </div>
          <p className="text-sm font-semibold leading-6 text-slate-600">
            ใช้ดูความเสี่ยงทั่วไปก่อนวางแผนงานแปลง ไม่ใช่คำสั่งปฏิบัติหรือคำแนะนำสารเคมี
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {sortedRiskCards.map((card) => (
              <Card
                className={cx('p-4', weatherAgriRiskLevelCardClass[card.level])}
                data-risk-level={card.level}
                key={card.id}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Badge tone="neutral">{weatherAgriRiskCategoryLabels[card.category]}</Badge>
                    <h3 className="mt-2 font-extrabold leading-6 text-kaset-ink">{card.title}</h3>
                  </div>
                  <StatusPill tone={weatherAgriRiskLevelTone[card.level]}>{weatherAgriRiskLevelLabels[card.level]}</StatusPill>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-700">{card.summary}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {card.signals.slice(0, 3).map((signal) => (
                    <Badge className="bg-white/80" key={signal.id} tone="sky">
                      {signal.label}: {String(signal.value)}
                      {signal.unit ?? ''}
                    </Badge>
                  ))}
                </div>
                <p className={cx('mt-3 rounded-lg p-3 text-xs font-bold leading-5', weatherAgriRiskLevelNoteClass[card.level])}>
                  {card.boundaryNote}
                </p>
              </Card>
            ))}
          </div>
        </section>

        {forecast.isStale || cacheStatus.isStale ? (
          <NoticeBox tone="warning" icon={ShieldAlert} title="ข้อมูลอาจเก่า">
            ใช้ข้อมูลล่าสุดที่มีในเครื่อง ข้อมูลนี้อาจเก่ากว่า {cacheStatus.staleAfterMinutes} นาที ควรตรวจสอบสภาพจริงก่อนตัดสินใจ
          </NoticeBox>
        ) : null}

        {forecast.isFallback ? (
          <NoticeBox tone="warning" icon={ShieldAlert} title="ตอนนี้ใช้ข้อมูลสำรองในเครื่อง">
            เมื่อเชื่อมต่อแหล่งพยากรณ์ออนไลน์แล้ว ระบบจะแสดงข้อมูลล่าสุด ควรตรวจสอบสภาพจริงก่อนตัดสินใจ
          </NoticeBox>
        ) : null}

        <Card className="p-4" data-testid="weather-update-actions">
          <div className="flex items-center gap-2">
            <RefreshCw aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <h2 className="font-extrabold text-kaset-ink">อัปเดตข้อมูล</h2>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-kaset-deep px-4 text-sm font-extrabold text-white disabled:bg-slate-200 disabled:text-slate-500"
              disabled={refreshPolicy.status === 'disabled' || isLoading}
              onClick={manualRefresh}
              type="button"
            >
              <RefreshCw aria-hidden="true" className="h-4 w-4" />
              อัปเดตข้อมูล
            </button>
            <Link className="inline-flex min-h-11 items-center gap-2 rounded-full bg-kaset-mist px-4 text-sm font-extrabold text-kaset-deep" to="/app/weather/preferences">
              <Settings2 aria-hidden="true" className="h-4 w-4" />
              ตั้งค่าพื้นที่
            </Link>
          </div>
          <p className="mt-3 flex flex-wrap items-center gap-2 text-xs font-bold leading-5 text-slate-500">
            <Clock3 aria-hidden="true" className="h-4 w-4" />
            {manualRefreshMessage || refreshPolicy.message}
            {refreshPolicy.remainingCooldownMs > 0 ? ` · ${formatWeatherRefreshCooldown(refreshPolicy.remainingCooldownMs)}` : ''}
            {lastSuccessfulRefresh ? ` · ล่าสุด ${new Date(lastSuccessfulRefresh).toLocaleString('th-TH')}` : ''}
          </p>
        </Card>

        <details className="rounded-lg bg-white p-4 shadow-card ring-1 ring-kaset-deep/10" data-testid="weather-source-details">
          <summary className="cursor-pointer text-sm font-extrabold text-kaset-deep">ข้อมูลเพิ่มเติม / รายละเอียดแหล่งข้อมูล</summary>
          <div className="mt-3 grid gap-3">
            <div className="flex flex-wrap gap-2">
              <Badge tone={isOpenMeteo ? 'green' : 'gold'}>{connectionLabel}</Badge>
              <Badge tone={cacheStatus.isFresh ? 'green' : cacheStatus.isStale ? 'gold' : 'neutral'}>{freshnessLabel}</Badge>
              <Badge tone="neutral">ไม่ใช้ GPS</Badge>
              <Badge tone="neutral">ไม่บันทึกตำแหน่งส่วนตัว</Badge>
            </div>
            <div className="grid gap-2 rounded-lg bg-kaset-mist p-3 text-xs font-bold leading-5 text-kaset-deep">
              <p>แหล่งข้อมูล: {isOpenMeteo ? 'Open-Meteo' : 'ข้อมูลสำรองในเครื่อง'}</p>
              <p>อัปเดต: {sourceReadiness.fetchedTimeLabel} · อายุข้อมูล: {staleAgeLabel}</p>
              <p>พื้นที่ที่เลือก: {localPreferenceStatus.selectedLabel} · บันทึกไว้ในเครื่องนี้</p>
              <p>{sourceReadiness.privacyBoundary.summary}</p>
              <p>สถานะระบบ: {modeStatus.mode} · cache {cacheStatus.freshness}</p>
            </div>
            <button
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10"
              onClick={clearSelectedCache}
              type="button"
            >
              ล้างข้อมูลพื้นที่นี้
            </button>
            <div className="grid gap-2 sm:grid-cols-2">
              <Link className="inline-flex min-h-11 items-center justify-center rounded-full bg-kaset-mist px-4 text-sm font-extrabold text-kaset-deep" to="/app/weather/risk-rules">
                ดูกฎความเสี่ยงเบื้องต้น
              </Link>
              <Link className="inline-flex min-h-11 items-center justify-center rounded-full bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10" to="/app/weather/risk-review">
                ตรวจสถานะคำแนะนำ
              </Link>
            </div>
          </div>
        </details>

        <NoticeBox tone="warning" title="ข้อควรระวังสำหรับงานเกษตร">
          ก่อนพ่นยาให้ดูฝนและลม ข้อมูลอากาศเป็นการพยากรณ์ อาจคลาดเคลื่อนได้ ควรตรวจสภาพจริงที่แปลงก่อนตัดสินใจ
        </NoticeBox>

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
          <h2 className="text-lg font-extrabold text-kaset-ink">ข้อควรระวังทั่วไป</h2>
          {farmerWeatherRiskNotes.map((note) => (
            <Card className="p-4" key={note.id}>
              <h3 className="font-extrabold text-kaset-ink">{note.title}</h3>
              <p className="mt-1 text-sm leading-6 text-slate-600">{note.detail}</p>
              <p className="mt-2 text-xs font-bold leading-5 text-amber-800">{note.boundary}</p>
            </Card>
          ))}
        </section>

        {alerts.length > 0 && !isOpenMeteo ? (
          <section className="grid gap-3">
            <h2 className="text-lg font-extrabold text-kaset-ink">แจ้งเตือนอากาศ</h2>
            {alerts.map((alert) => (
              <Card className="p-4" key={alert.id}>
                <div className="flex gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-sky-100 text-sky-800">
                    <CloudRain aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap gap-2">
                      <Badge tone={weatherRiskTone[alert.riskId]}>{weatherRiskLabels[alert.riskId]}</Badge>
                      <Badge tone="neutral">ข้อมูลอากาศ</Badge>
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
          description="ดูร่วมกับแปลง พืชที่ติดตาม และข้อมูลฟาร์มในหน้าเดียว"
          icon={Sprout}
          label="กลับไปฟาร์มของฉัน"
          to="/app/my-farm"
          variant="white"
        />
      </div>
    </div>
  );
}
