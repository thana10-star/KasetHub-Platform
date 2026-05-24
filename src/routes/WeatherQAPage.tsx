import { AlertTriangle, CloudSun, Database, MapPin, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { LargeActionButton } from '@/components/ui/LargeActionButton';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { StatusPill } from '@/components/ui/StatusPill';
import { getWeatherCacheStatus } from '@/services/weather/weather-cache-service';
import { defaultWeatherCoarseLocation, weatherCoarseLocations } from '@/services/weather/weather-location-fixtures';
import { getWeatherQaSummary } from '@/services/weather/weather-qa-fixtures';
import { farmerWeatherRiskNotes } from '@/services/weather/weather-risk-notes';

const statusTone = {
  pass: 'success',
  warn: 'warning',
  blocked: 'danger',
} as const;

export function WeatherQAPage() {
  const summary = getWeatherQaSummary();
  const cacheStatus = getWeatherCacheStatus(defaultWeatherCoarseLocation.id);

  return (
    <div>
      <PageHeader title="Weather QA" subtitle="ตรวจ cache, coarse location, fallback และ no-GPS boundary" showBack />
      <div className="grid gap-5 px-5 pb-6">
        <Card className="overflow-hidden bg-sky-900 text-white">
          <div className="p-5">
            <div className="flex gap-3">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-white text-sky-900">
                <CloudSun aria-hidden="true" className="h-6 w-6" />
              </span>
              <div className="min-w-0">
                <StatusPill className="bg-white/15 text-white ring-white/20" tone={summary.modeStatus.canFetchOpenMeteo ? 'success' : 'warning'}>
                  {summary.modeStatus.mode}
                </StatusPill>
                <h2 className="mt-3 text-2xl font-extrabold">M76 Weather QA</h2>
                <p className="mt-2 text-sm leading-6 text-sky-50">
                  Open-Meteo ยังถูกคุมด้วย flag, cache อยู่ในเครื่อง, เลือกตำแหน่งได้เฉพาะจังหวัด/เมืองกลางโดยประมาณ
                </p>
              </div>
            </div>
          </div>
        </Card>

        <section className="grid grid-cols-2 gap-3">
          <Card className="p-4">
            <Database aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <p className="mt-2 text-2xl font-extrabold text-kaset-ink">{cacheStatus.freshness}</p>
            <p className="mt-1 text-xs font-bold leading-5 text-slate-500">
              cache local-only · stale {summary.cacheStaleAfterMinutes} นาที
            </p>
          </Card>
          <Card className="p-4">
            <MapPin aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <p className="mt-2 text-2xl font-extrabold text-kaset-ink">{weatherCoarseLocations.length}</p>
            <p className="mt-1 text-xs font-bold leading-5 text-slate-500">coarse locations ไม่มี GPS</p>
          </Card>
        </section>

        <NoticeBox tone="info" icon={ShieldCheck} title="Location privacy proof">
          {summary.privacyStatus.summary}
        </NoticeBox>

        <section className="grid gap-3">
          <h2 className="text-lg font-extrabold text-kaset-ink">Failure fixture matrix</h2>
          {summary.fixtures.map((fixture) => (
            <Card className="p-4" key={fixture.id}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-extrabold text-kaset-ink">{fixture.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{fixture.note}</p>
                </div>
                <StatusPill tone={statusTone[fixture.expectedStatus]}>{fixture.expectedStatus}</StatusPill>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge tone={fixture.fetchExpected ? 'sky' : 'neutral'}>{fixture.fetchExpected ? 'fetch path' : 'no fetch'}</Badge>
                <Badge tone={fixture.fallbackExpected ? 'gold' : 'green'}>{fixture.fallbackExpected ? 'fallback' : 'direct result'}</Badge>
                {fixture.staleExample ? <Badge tone="gold">stale cache example</Badge> : null}
              </div>
            </Card>
          ))}
        </section>

        <section className="grid gap-3">
          <h2 className="text-lg font-extrabold text-kaset-ink">Coarse locations</h2>
          {weatherCoarseLocations.map((location) => (
            <Card className="p-4" key={location.id}>
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-kaset-mist text-kaset-deep">
                  <MapPin aria-hidden="true" className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <h3 className="font-extrabold text-kaset-ink">{location.label}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {location.region} · {location.precision} · {location.privacyNote}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </section>

        <section className="grid gap-3">
          <h2 className="text-lg font-extrabold text-kaset-ink">Risk note boundaries</h2>
          {farmerWeatherRiskNotes.map((note) => (
            <Card className="p-4" key={note.id}>
              <div className="flex gap-3">
                <AlertTriangle aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-amber-700" />
                <div>
                  <h3 className="font-extrabold text-kaset-ink">{note.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{note.detail}</p>
                  <p className="mt-2 text-xs font-bold leading-5 text-amber-800">{note.boundary}</p>
                </div>
              </div>
            </Card>
          ))}
        </section>

        <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10" to="/app/weather">
          กลับไปหน้าสภาพอากาศ
        </Link>

        <LargeActionButton
          description="QA รวมยังคงแสดงว่า weather route ไม่มี GPS ไม่มี precision farm location และไม่เขียน Supabase"
          icon={ShieldCheck}
          label="ไปหน้า QA รวม"
          to="/app/qa"
          variant="white"
        />
      </div>
    </div>
  );
}
