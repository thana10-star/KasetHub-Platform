import { CloudSun, Database, MapPin, ShieldCheck, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { StatusPill } from '@/components/ui/StatusPill';
import { getWeatherModeStatus } from '@/services/weather/weather-adapter';
import { buildWeatherCacheQaSummary } from '@/services/weather/weather-cache-qa';
import { clearWeatherCache } from '@/services/weather/weather-cache-service';
import { defaultWeatherCoarseLocation, weatherCoarseLocations } from '@/services/weather/weather-location-fixtures';
import {
  clearWeatherLocalPreference,
  getWeatherLocalPreferenceStatus,
  getWeatherPrivacyBoundary,
} from '@/services/weather/weather-source-readiness';

export function WeatherPreferencesPage() {
  const [version, setVersion] = useState(0);
  const [cleared, setCleared] = useState(false);
  const modeStatus = getWeatherModeStatus();
  const preferenceStatus = getWeatherLocalPreferenceStatus();
  const selectedLocation = weatherCoarseLocations.find((location) => location.id === preferenceStatus.selectedLocationId) ?? defaultWeatherCoarseLocation;
  const cacheQa = buildWeatherCacheQaSummary(selectedLocation.id);
  const privacyBoundary = getWeatherPrivacyBoundary();

  function clearLocalWeatherState() {
    clearWeatherCache();
    clearWeatherLocalPreference();
    setCleared(true);
    setVersion((value) => value + 1);
  }

  void version;

  return (
    <div>
      <PageHeader title="ตั้งค่าสภาพอากาศ" subtitle="เลือกพื้นที่แบบหยาบและตรวจว่า preference ยังอยู่ในเครื่องเท่านั้น" showBack />
      <div className="grid gap-5 px-5 pb-6">
        <Card className="overflow-hidden bg-sky-900 text-white">
          <div className="p-5">
            <div className="flex gap-3">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-white text-sky-900">
                <CloudSun aria-hidden="true" className="h-6 w-6" />
              </span>
              <div className="min-w-0">
                <StatusPill className="bg-white/15 text-white ring-white/20" tone={modeStatus.canFetchOpenMeteo ? 'success' : 'warning'}>
                  {modeStatus.mode}
                </StatusPill>
                <h2 className="mt-3 text-2xl font-extrabold leading-8">M77 local-only weather preference</h2>
                <p className="mt-2 text-sm leading-6 text-sky-50">
                  บันทึกเฉพาะ id และชื่อพื้นที่แบบจังหวัด/เมืองกลางโดยประมาณ ไม่มี GPS ไม่มีพิกัดแปลง และไม่ซิงก์ขึ้น Supabase
                </p>
              </div>
            </div>
          </div>
        </Card>

        <NoticeBox tone="info" icon={ShieldCheck} title="localStorage เท่านั้น">
          ค่าเลือกพื้นที่และ cache สภาพอากาศยังอยู่ในเครื่องนี้เท่านั้น ไม่มี Supabase write ไม่มี backend write และยังไม่มี cloud sync
        </NoticeBox>

        {cleared ? (
          <NoticeBox tone="success" title="ล้างข้อมูลในเครื่องแล้ว">
            cache และ weather preference ถูกล้างจาก localStorage แล้ว
          </NoticeBox>
        ) : null}

        <section className="grid grid-cols-2 gap-3">
          <Card className="p-4">
            <MapPin aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <p className="mt-2 text-xl font-extrabold leading-7 text-kaset-ink">{preferenceStatus.selectedLabel}</p>
            <p className="mt-1 text-xs font-bold leading-5 text-slate-500">
              {preferenceStatus.hasPreference ? 'บันทึกไว้ในเครื่องแล้ว' : 'ใช้ค่าเริ่มต้น'}
            </p>
          </Card>
          <Card className="p-4">
            <Database aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <p className="mt-2 text-xl font-extrabold leading-7 text-kaset-ink">{cacheQa.qa.label}</p>
            <p className="mt-1 text-xs font-bold leading-5 text-slate-500">stale หลัง {cacheQa.staleAfterMinutes} นาที</p>
          </Card>
        </section>

        <Card className="p-4">
          <div className="flex flex-wrap gap-2">
            <Badge tone={modeStatus.canFetchOpenMeteo ? 'green' : 'gold'}>
              {modeStatus.canFetchOpenMeteo ? 'Open-Meteo enabled' : 'Open-Meteo disabled'}
            </Badge>
            <Badge tone="neutral">no cloud sync</Badge>
            <Badge tone="neutral">no precise coordinates</Badge>
          </div>
          <h2 className="mt-3 font-extrabold text-kaset-ink">สถานะพื้นที่ที่เลือก</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            {selectedLocation.label} · {selectedLocation.region} · {selectedLocation.precision}
          </p>
          <p className="mt-2 rounded-lg bg-kaset-mist p-3 text-xs font-bold leading-5 text-kaset-deep">
            {selectedLocation.privacyNote}
          </p>
          <p className="mt-2 text-xs font-bold leading-5 text-slate-500">
            preference key: {preferenceStatus.storageKey} · noSupabaseWrite {String(preferenceStatus.noSupabaseWrite)}
          </p>
        </Card>

        <Card className="p-4">
          <h2 className="font-extrabold text-kaset-ink">Cache freshness preview</h2>
          <div className="mt-3 grid gap-2">
            {cacheQa.examples.map((example) => (
              <div className="rounded-lg bg-kaset-mist p-3" key={example.id}>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-extrabold text-kaset-ink">{example.title}</p>
                  <Badge tone={example.freshness === 'fresh' ? 'green' : example.freshness === 'stale' ? 'gold' : 'neutral'}>
                    {example.freshness}
                  </Badge>
                </div>
                <p className="mt-1 text-sm leading-6 text-slate-600">{example.userMessage}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="font-extrabold text-kaset-ink">Privacy boundary</h2>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Badge tone="green">no GPS {String(privacyBoundary.noGps)}</Badge>
            <Badge tone="green">no backend {String(privacyBoundary.noBackendWrite)}</Badge>
            <Badge tone="green">no Supabase {String(privacyBoundary.noSupabaseWrite)}</Badge>
            <Badge tone="green">no cloud sync {String(privacyBoundary.noCloudSync)}</Badge>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">{privacyBoundary.summary}</p>
        </Card>

        <button
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-4 text-sm font-extrabold text-rose-800 ring-1 ring-rose-200"
          onClick={clearLocalWeatherState}
          type="button"
        >
          <Trash2 aria-hidden="true" className="h-4 w-4" />
          ล้าง cache และ preference ในเครื่อง
        </button>

        <div className="grid gap-3 sm:grid-cols-2">
          <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-kaset-deep px-4 text-sm font-extrabold text-white" to="/app/weather">
            กลับไปหน้าสภาพอากาศ
          </Link>
          <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10" to="/app/weather/qa">
            เปิด Weather QA
          </Link>
        </div>
      </div>
    </div>
  );
}
