import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Bell,
  BellOff,
  CalendarDays,
  Check,
  Leaf,
  Minus,
  Settings,
  Trash2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { cx } from '@/components/ui/classNames';
import { useCropWatch } from '@/hooks/useCropWatch';
import { findCropPriceItem } from '@/services/crop-prices/crop-price-source-adapter';
import { cropPriceReliabilityLabels } from '@/services/crop-prices/crop-price-sources';
import {
  cropWatchAlertLabels,
  cropWatchLocalOnlyNotice,
} from '@/services/crop-prices/crop-watch-service';
import type { CropWatchAlertType } from '@/services/crop-prices/crop-watch.types';

const trendIcon = {
  up: ArrowUpRight,
  down: ArrowDownRight,
  same: Minus,
};

const trendTone = {
  up: 'bg-emerald-100 text-emerald-700',
  down: 'bg-rose-100 text-rose-700',
  same: 'bg-slate-100 text-slate-700',
};

const editableAlertTypes: CropWatchAlertType[] = ['price_up', 'price_down', 'weekly_summary'];

export function CropWatchPage() {
  const {
    counts,
    isAlertEnabled,
    removeCropWatch,
    setCropWatchEnabled,
    toggleAlertPreference,
    watches,
  } = useCropWatch();

  return (
    <div>
      <PageHeader title="พืชที่ติดตาม" subtitle="ตั้งค่าแจ้งเตือนราคาแบบตัวอย่างในเครื่องนี้" showBack />
      <div className="grid gap-5 px-5 pb-6">
        <Card className="overflow-hidden bg-kaset-deep text-white">
          <div className="relative p-5">
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10" />
            <div className="relative flex gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-white text-kaset-deep">
                <Bell aria-hidden="true" className="h-7 w-7" />
              </span>
              <div>
                <Badge className="bg-white/15 text-white" tone="green">
                  Local crop watch
                </Badge>
                <h2 className="mt-3 text-xl font-extrabold leading-7">ติดตามราคาอ้างอิงพืชที่สนใจ</h2>
                <p className="mt-2 text-sm leading-6 text-emerald-50/90">
                  {counts.enabledWatches} พืชที่เปิดติดตาม · {counts.enabledAlerts} preference แจ้งเตือนตัวอย่าง
                </p>
              </div>
            </div>
          </div>
        </Card>

        <NoticeBox tone="warning" title="ยังไม่มีแจ้งเตือนจริง">
          {cropWatchLocalOnlyNotice} ทุกตัวเลขเป็นราคาอ้างอิงตัวอย่าง ไม่ใช่ราคาตลาดจริง
        </NoticeBox>

        {watches.length > 0 ? (
          <section className="grid gap-3">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-extrabold text-kaset-ink">รายการที่ติดตาม</h2>
              <Badge tone="neutral">{watches.length} รายการ</Badge>
            </div>

            {watches.map((watch) => {
              const price = findCropPriceItem(watch.priceId);
              const TrendIcon = price ? trendIcon[price.changeDirection] : Minus;
              const enabledPreferences = watch.alertPreferences.filter((preference) => preference.enabled);

              return (
                <Card className="p-4" key={watch.id}>
                  <div className="flex items-start gap-3">
                    <span className={cx('grid h-12 w-12 shrink-0 place-items-center rounded-lg', watch.enabled ? 'bg-kaset-mint text-kaset-deep' : 'bg-slate-100 text-slate-500')}>
                      {watch.enabled ? <Bell aria-hidden="true" className="h-6 w-6" /> : <BellOff aria-hidden="true" className="h-6 w-6" />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap gap-2">
                        <Badge tone={watch.enabled ? 'green' : 'neutral'}>{watch.enabled ? 'เปิดติดตาม' : 'ปิดไว้'}</Badge>
                        <Badge tone="sky">{cropPriceReliabilityLabels[watch.reliabilityLevel]}</Badge>
                      </div>
                      <h3 className="mt-2 text-xl font-extrabold leading-7 text-kaset-ink">{watch.cropName}</h3>
                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        {watch.preferredMarketLabel} · {watch.preferredRegionLabel}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-lg bg-kaset-mist p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-extrabold text-slate-500">ราคาอ้างอิงล่าสุด</p>
                        <p className="mt-1 text-2xl font-extrabold text-kaset-deep">
                          {price?.priceLabel ?? watch.latestPriceLabel}
                        </p>
                      </div>
                      {price ? (
                        <span className={cx('inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-extrabold', trendTone[price.changeDirection])}>
                          <TrendIcon aria-hidden="true" className="h-3.5 w-3.5" />
                          {price.changeDirection === 'same' ? 'ทรงตัว' : `${Math.abs(price.changePercent).toFixed(1)}%`}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      แหล่งข้อมูล: {watch.sourceLabel} · หน่วย: {watch.unitLabel}
                    </p>
                  </div>

                  <div className="mt-4 grid gap-2">
                    <p className="text-sm font-extrabold text-kaset-ink">Alert preferences</p>
                    {enabledPreferences.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {enabledPreferences.map((preference) => (
                          <Badge key={preference.id} tone="gold">
                            {cropWatchAlertLabels[preference.alertType]}
                            {preference.targetPrice ? ` ${preference.targetPrice.toLocaleString('th-TH')} ${watch.unitLabel}` : ''}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="rounded-lg bg-amber-50 p-3 text-sm leading-6 text-amber-900">
                        ยังไม่ได้เปิด preference แจ้งเตือนราคา
                      </p>
                    )}
                  </div>

                  {price ? (
                    <div className="mt-4 grid gap-2">
                      {editableAlertTypes.map((alertType) => {
                        const enabled = isAlertEnabled(watch.cropKey, alertType);

                        return (
                          <Button
                            className="w-full min-h-11 justify-start px-3 text-sm"
                            key={alertType}
                            onClick={() => toggleAlertPreference(price, alertType)}
                            variant={enabled ? 'soft' : 'secondary'}
                          >
                            {enabled ? <Check aria-hidden="true" className="h-4 w-4" /> : <CalendarDays aria-hidden="true" className="h-4 w-4" />}
                            {cropWatchAlertLabels[alertType]}
                          </Button>
                        );
                      })}
                    </div>
                  ) : null}

                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <Button
                      className="min-h-11 px-3 text-sm"
                      onClick={() => setCropWatchEnabled(watch.cropKey, !watch.enabled)}
                      variant="secondary"
                    >
                      <Settings aria-hidden="true" className="h-4 w-4" />
                      {watch.enabled ? 'ปิด' : 'เปิด'}
                    </Button>
                    <Link
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-kaset-mint px-3 text-sm font-extrabold text-kaset-deep"
                      to={`/app/prices/${watch.priceId}`}
                    >
                      ดูราคา
                      <ArrowRight aria-hidden="true" className="h-4 w-4" />
                    </Link>
                    <Button
                      className="min-h-11 bg-rose-50 px-3 text-sm text-rose-700 ring-1 ring-rose-100 hover:bg-rose-100"
                      onClick={() => removeCropWatch(watch.cropKey)}
                      variant="ghost"
                    >
                      <Trash2 aria-hidden="true" className="h-4 w-4" />
                      ลบ
                    </Button>
                  </div>
                </Card>
              );
            })}
          </section>
        ) : (
          <Card className="p-5 text-center">
            <Leaf aria-hidden="true" className="mx-auto h-10 w-10 text-kaset-deep" />
            <h2 className="mt-3 text-lg font-extrabold text-kaset-ink">ยังไม่มีพืชที่ติดตาม</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">เริ่มจากหน้าราคาพืชผล แล้วกดติดตามหรือเลือกแจ้งเตือนราคาแบบตัวอย่าง</p>
            <Link className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-kaset-deep px-5 text-sm font-extrabold text-white" to="/app/prices">
              เปิดราคาพืชผล
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
}
