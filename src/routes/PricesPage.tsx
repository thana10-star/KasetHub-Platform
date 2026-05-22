import {
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  Bookmark,
  CalendarDays,
  Check,
  ChevronRight,
  Filter,
  Leaf,
  MapPin,
  Minus,
  RefreshCw,
  Search,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { ShareButton } from '@/components/kaset/ShareButton';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { cx } from '@/components/ui/classNames';
import { useCropWatch } from '@/hooks/useCropWatch';
import { useGuestMemory } from '@/hooks/useGuestMemory';
import {
  listCropPriceCategories,
  listCropPriceItems,
  listCropPriceRegionMarketOptions,
  listCropPriceSourceOptions,
} from '@/services/crop-prices/crop-price-source-adapter';
import {
  cropWatchAlertLabels,
  cropWatchLocalOnlyNotice,
} from '@/services/crop-prices/crop-watch-service';
import type { CropWatchAlertType } from '@/services/crop-prices/crop-watch.types';
import {
  cropPriceDisclaimer,
  cropPriceReliabilityLabels,
  cropPriceSourceStatusLabels,
} from '@/services/crop-prices/crop-price-sources';
import type { CropPriceCategory, CropPriceItem, CropPriceSourceId } from '@/services/crop-prices/crop-price.types';

const trendMeta = {
  up: {
    icon: ArrowUpRight,
    label: 'เพิ่มขึ้น',
    className: 'bg-emerald-100 text-emerald-700',
  },
  down: {
    icon: ArrowDownRight,
    label: 'ลดลง',
    className: 'bg-rose-100 text-rose-700',
  },
  same: {
    icon: Minus,
    label: 'ทรงตัว',
    className: 'bg-slate-100 text-slate-700',
  },
};

function createPriceTopicId(price: CropPriceItem) {
  return `crop-price:${price.cropKey}`;
}

function createPriceSummary(price: CropPriceItem) {
  return `${price.priceLabel} · ${price.sourceLabel} · ${price.capturedAtLabel}`;
}

function PriceTrendBadge({ price }: { price: CropPriceItem }) {
  const meta = trendMeta[price.changeDirection];
  const Icon = meta.icon;
  const value = price.changeDirection === 'same' ? meta.label : `${meta.label} ${Math.abs(price.changePercent).toFixed(1)}%`;

  return (
    <span className={cx('inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-extrabold', meta.className)}>
      <Icon aria-hidden="true" className="h-3.5 w-3.5" />
      {value}
    </span>
  );
}

const quickAlertActions: Array<{ alertType: CropWatchAlertType; icon: typeof ArrowUpRight; shortLabel: string }> = [
  { alertType: 'price_up', icon: ArrowUpRight, shortLabel: 'แจ้งเตือนเมื่อราคาขึ้น' },
  { alertType: 'price_down', icon: ArrowDownRight, shortLabel: 'แจ้งเตือนเมื่อราคาลง' },
  { alertType: 'weekly_summary', icon: CalendarDays, shortLabel: 'สรุปราคาทุกสัปดาห์' },
];

export function PricesPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<CropPriceCategory | 'ทั้งหมด'>('ทั้งหมด');
  const [sourceId, setSourceId] = useState<CropPriceSourceId | 'all'>('all');
  const [regionOrMarketId, setRegionOrMarketId] = useState('all');
  const { followTopic, isFollowingTopic, isSaved, saveItem, unfollowTopic, unsaveItem } = useGuestMemory();
  const {
    findCropWatch,
    isAlertEnabled,
    isWatchingCrop: isCropWatched,
    removeCropWatch,
    toggleAlertPreference,
    watchCrop,
  } = useCropWatch();

  const categories = useMemo(() => listCropPriceCategories(), []);
  const sourceOptions = useMemo(() => listCropPriceSourceOptions(), []);
  const regionMarketOptions = useMemo(() => listCropPriceRegionMarketOptions(), []);
  const filteredPrices = useMemo(
    () => listCropPriceItems({ search, category: activeCategory, sourceId, regionOrMarketId }),
    [activeCategory, regionOrMarketId, search, sourceId],
  );

  function toggleFollow(price: CropPriceItem) {
    const topicId = createPriceTopicId(price);

    if (isFollowingTopic(topicId) || isCropWatched(price.cropKey)) {
      unfollowTopic(topicId);
      removeCropWatch(price.cropKey);
      return;
    }

    watchCrop({
      price,
    });
    followTopic({
      id: topicId,
      topicType: 'price',
      title: price.cropName,
      sourceRoute: `/app/prices/${price.id}`,
      tags: ['ราคาพืชผล', price.category, price.region.label],
      metadata: {
        cropKey: price.cropKey,
        sourceId: price.sourceId,
        reliabilityLevel: price.reliabilityLevel,
      },
    });
  }

  function toggleQuickAlert(price: CropPriceItem, alertType: CropWatchAlertType) {
    const topicId = createPriceTopicId(price);

    toggleAlertPreference(price, alertType);

    if (!isFollowingTopic(topicId)) {
      followTopic({
        id: topicId,
        topicType: 'price',
        title: price.cropName,
        sourceRoute: `/app/prices/${price.id}`,
        tags: ['ราคาพืชผล', price.category, price.region.label],
        metadata: {
          cropKey: price.cropKey,
          sourceId: price.sourceId,
          reliabilityLevel: price.reliabilityLevel,
          alertType,
        },
      });
    }
  }

  function toggleSave(price: CropPriceItem) {
    if (isSaved('crop_price', price.id)) {
      unsaveItem('crop_price', price.id);
      return;
    }

    saveItem({
      itemType: 'crop_price',
      itemId: price.id,
      title: `ราคาอ้างอิง ${price.cropName}`,
      summary: createPriceSummary(price),
      sourceRoute: `/app/prices/${price.id}`,
      tags: ['ราคาอ้างอิง', price.category, price.region.label, price.sourceLabel],
      metadata: {
        priceReference: price,
      },
    });
  }

  return (
    <div>
      <PageHeader title="ราคาพืชผล" subtitle="ราคาอ้างอิงตัวอย่าง ยังไม่เชื่อมต่อแหล่งข้อมูลจริง" showBack />
      <div className="grid gap-5 px-5 pb-6">
        <Card className="overflow-hidden bg-kaset-deep text-white">
          <div className="relative p-5">
            <div className="absolute -right-12 -top-16 h-36 w-36 rounded-full bg-white/10" />
            <div className="relative flex items-start justify-between gap-4">
              <div>
                <p className="flex items-center gap-1 text-sm font-semibold text-emerald-50">
                  <MapPin aria-hidden="true" className="h-4 w-4" />
                  ราคาอ้างอิง · ข้อมูลตัวอย่างในเครื่อง
                </p>
                <h2 className="mt-3 text-2xl font-extrabold leading-8">ติดตามราคาพืชผลแบบไม่อ้างเป็นราคาขายจริง</h2>
                <p className="mt-2 text-sm leading-6 text-emerald-50/90">
                  เตรียมโครงสร้างสำหรับ OAE, DIT, ตลาดไท, รายงานตลาดท้องถิ่น และรายงานชุมชนในอนาคต
                </p>
              </div>
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-white text-kaset-deep shadow-soft">
                <RefreshCw aria-hidden="true" className="h-5 w-5" />
              </span>
            </div>
          </div>
        </Card>

        <NoticeBox tone="warning" title="ข้อมูลราคาเป็นตัวอย่างเดโม">
          ทุกแถวเป็นราคาอ้างอิงตัวอย่าง ไม่มี API จริง ไม่มี scraping และไม่มีการเขียน backend หรือ Supabase {cropPriceDisclaimer}
        </NoticeBox>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
              <Bell aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-extrabold text-kaset-ink">พืชที่ติดตามและแจ้งเตือนราคา</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">{cropWatchLocalOnlyNotice}</p>
              <Link className="mt-3 inline-flex text-sm font-extrabold text-kaset-deep" to="/app/crop-watch">
                เปิดหน้าพืชที่ติดตาม
              </Link>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <label className="text-sm font-extrabold text-kaset-ink" htmlFor="price-search">
            ค้นหาพืชหรือแหล่งราคา
          </label>
          <div className="relative mt-3">
            <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              className="kh-form-control w-full border border-kaset-deep/10 bg-kaset-mist py-2 pl-12 pr-4 text-kaset-ink outline-none focus:border-kaset-leaf"
              id="price-search"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="เช่น ข้าว ทุเรียน ตลาดไท ยโสธร"
              type="search"
              value={search}
            />
          </div>

          <div className="mt-4 grid gap-3">
            <label className="grid gap-2 text-sm font-extrabold text-kaset-ink" htmlFor="price-source-filter">
              <span className="inline-flex items-center gap-2">
                <Filter aria-hidden="true" className="h-4 w-4" />
                แหล่งข้อมูล
              </span>
              <select
                className="kh-form-control w-full border border-kaset-deep/10 bg-white px-3 text-kaset-ink outline-none focus:border-kaset-leaf"
                id="price-source-filter"
                onChange={(event) => setSourceId(event.target.value as CropPriceSourceId | 'all')}
                value={sourceId}
              >
                <option value="all">ทุกแหล่งข้อมูล</option>
                {sourceOptions.map((source) => (
                  <option key={source.id} value={source.id}>
                    {source.shortLabel} · {cropPriceSourceStatusLabels[source.status]}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 text-sm font-extrabold text-kaset-ink" htmlFor="price-region-filter">
              พื้นที่หรือตลาด
              <select
                className="kh-form-control w-full border border-kaset-deep/10 bg-white px-3 text-kaset-ink outline-none focus:border-kaset-leaf"
                id="price-region-filter"
                onChange={(event) => setRegionOrMarketId(event.target.value)}
                value={regionOrMarketId}
              >
                <option value="all">ทุกพื้นที่และตลาด</option>
                {regionMarketOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.kind === 'region' ? 'พื้นที่' : 'ตลาด'} · {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </Card>

        <div className="-mx-5 overflow-x-auto px-5">
          <div className="flex min-w-max gap-2">
            {categories.map((category) => (
              <button
                className={cx(
                  'kh-tap-target rounded-full px-1 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-kaset-leaf',
                  activeCategory === category ? 'bg-kaset-deep text-white shadow-soft' : 'bg-white text-kaset-deep shadow-soft',
                )}
                key={category}
                onClick={() => setActiveCategory(category)}
                type="button"
              >
                <span className="block px-4 py-2 text-sm font-extrabold">{category}</span>
              </button>
            ))}
          </div>
        </div>

        <section className="grid gap-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-extrabold text-kaset-ink">รายการราคาอ้างอิง</h2>
            <Badge tone="neutral">{filteredPrices.length} รายการ</Badge>
          </div>

          {filteredPrices.length > 0 ? (
            filteredPrices.map((price) => {
              const followed = isFollowingTopic(createPriceTopicId(price)) || isCropWatched(price.cropKey);
              const saved = isSaved('crop_price', price.id);
              const watch = findCropWatch(price.cropKey);
              const enabledAlertCount = watch?.alertPreferences.filter((preference) => preference.enabled).length ?? 0;

              return (
                <Card className="p-4" key={price.id}>
                  <div className="flex flex-wrap gap-2">
                    <Badge tone="gold">ราคาอ้างอิง</Badge>
                    <Badge tone="neutral">{price.demoLabel}</Badge>
                    <Badge tone="sky">{cropPriceReliabilityLabels[price.reliabilityLevel]}</Badge>
                  </div>

                  <div className="mt-3 grid grid-cols-[1fr_auto] gap-3">
                    <div className="min-w-0">
                      <Link to={`/app/prices/${price.id}`}>
                        <h3 className="text-xl font-extrabold leading-7 text-kaset-ink">{price.cropName}</h3>
                      </Link>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{price.summary}</p>
                    </div>
                    <Link className="grid h-11 w-11 place-items-center rounded-full bg-kaset-mint text-kaset-deep" to={`/app/prices/${price.id}`}>
                      <ChevronRight aria-hidden="true" className="h-5 w-5" />
                    </Link>
                  </div>

                  <div className="mt-4 rounded-lg bg-kaset-mist p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-extrabold text-slate-500">ราคาอ้างอิงล่าสุด</p>
                        <p className="mt-1 text-2xl font-extrabold text-kaset-deep">{price.priceLabel}</p>
                      </div>
                      <PriceTrendBadge price={price} />
                    </div>
                    <div className="mt-3 grid gap-1 text-sm leading-6 text-slate-700">
                      <p>
                        แหล่งข้อมูล: <span className="font-bold">{price.sourceLabel}</span>
                      </p>
                      <p>
                        วันที่/เวลา: <span className="font-bold">{price.capturedAtLabel}</span>
                      </p>
                      <p>
                        ตลาด/พื้นที่: <span className="font-bold">{price.market.label} · {price.region.label}</span>
                      </p>
                      <p>
                        หน่วย: <span className="font-bold">{price.unit.label}</span>
                      </p>
                      {price.qualityGrade ? (
                        <p>
                          เกรด: <span className="font-bold">{price.qualityGrade.label}</span>
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <p className="mt-3 text-xs leading-5 text-amber-900">{price.disclaimer}</p>

                  <div className="mt-4 rounded-lg border border-kaset-deep/10 bg-white p-3">
                    <div className="flex items-start gap-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
                        <Bell aria-hidden="true" className="h-5 w-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-extrabold text-kaset-ink">
                          {followed ? 'กำลังติดตามพืชนี้ในเครื่องนี้' : 'ยังไม่ได้ติดตามพืชนี้'}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-slate-600">
                          {enabledAlertCount > 0
                            ? `เปิดแจ้งเตือนตัวอย่าง ${enabledAlertCount} แบบ`
                            : 'ตั้งค่าแจ้งเตือนได้แบบตัวอย่าง ยังไม่มี push จริง'}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 grid gap-2">
                      {quickAlertActions.map((action) => {
                        const Icon = action.icon;
                        const enabled = isAlertEnabled(price.cropKey, action.alertType);

                        return (
                          <Button
                            className="w-full min-h-11 justify-start px-3 text-sm"
                            key={action.alertType}
                            onClick={() => toggleQuickAlert(price, action.alertType)}
                            variant={enabled ? 'soft' : 'secondary'}
                          >
                            {enabled ? <Check aria-hidden="true" className="h-4 w-4" /> : <Icon aria-hidden="true" className="h-4 w-4" />}
                            {action.shortLabel}
                          </Button>
                        );
                      })}
                    </div>
                    <p className="mt-3 text-xs leading-5 text-slate-500">
                      ปุ่มเหล่านี้บันทึก preference ในเครื่องเท่านั้น: {quickAlertActions.map((action) => cropWatchAlertLabels[action.alertType]).join(' · ')}
                    </p>
                  </div>

                  <div className="mt-4 grid gap-2 sm:grid-cols-3">
                    <Button className="w-full min-h-11 px-3 text-sm" onClick={() => toggleFollow(price)} variant={followed ? 'soft' : 'secondary'}>
                      {followed ? <Check aria-hidden="true" className="h-4 w-4" /> : <Leaf aria-hidden="true" className="h-4 w-4" />}
                      {followed ? 'ติดตามแล้ว' : 'ติดตามพืชนี้'}
                    </Button>
                    <Button className="w-full min-h-11 px-3 text-sm" onClick={() => toggleSave(price)} variant={saved ? 'soft' : 'secondary'}>
                      {saved ? <Check aria-hidden="true" className="h-4 w-4" /> : <Bookmark aria-hidden="true" className="h-4 w-4" />}
                      {saved ? 'บันทึกแล้ว' : 'บันทึกราคา'}
                    </Button>
                    <ShareButton
                      className="w-full min-h-11 px-3 text-sm"
                      label="แชร์ราคา"
                      payload={{
                        title: `ราคาอ้างอิง ${price.cropName}`,
                        description: `${createPriceSummary(price)} · ${price.disclaimer}`,
                        url: `/app/prices/${price.id}`,
                      }}
                    />
                  </div>
                </Card>
              );
            })
          ) : (
            <Card className="p-5 text-center">
              <Search aria-hidden="true" className="mx-auto h-9 w-9 text-kaset-deep" />
              <h3 className="mt-3 font-extrabold text-kaset-ink">ไม่พบราคาอ้างอิงในตัวอย่างนี้</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">ลองล้างคำค้นหรือเลือกทุกแหล่งข้อมูลอีกครั้ง</p>
            </Card>
          )}
        </section>
      </div>
    </div>
  );
}
