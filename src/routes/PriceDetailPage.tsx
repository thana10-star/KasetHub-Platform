import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Bell,
  Bookmark,
  Bot,
  CalendarDays,
  Check,
  FileText,
  Leaf,
  Minus,
  ShieldAlert,
  Target,
  Video,
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import { ArticleCard } from '@/components/kaset/ArticleCard';
import { ShareButton } from '@/components/kaset/ShareButton';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { cx } from '@/components/ui/classNames';
import { useCropWatch } from '@/hooks/useCropWatch';
import { useGuestMemory } from '@/hooks/useGuestMemory';
import { contentToArticle, findArticleContent } from '@/services/content/content-fixtures';
import { findYoutubeVideo } from '@/data/youtubeData';
import { findCropPriceItem } from '@/services/crop-prices/crop-price-source-adapter';
import {
  cropPriceReliabilityLabels,
  cropPriceSourceStatusLabels,
} from '@/services/crop-prices/crop-price-sources';
import type { CropPriceItem } from '@/services/crop-prices/crop-price.types';
import {
  cropWatchAlertLabels,
  cropWatchLocalOnlyNotice,
} from '@/services/crop-prices/crop-watch-service';
import type { CropWatchAlertType } from '@/services/crop-prices/crop-watch.types';

const trendMeta = {
  up: {
    icon: ArrowUpRight,
    className: 'bg-emerald-100 text-emerald-700',
  },
  down: {
    icon: ArrowDownRight,
    className: 'bg-rose-100 text-rose-700',
  },
  same: {
    icon: Minus,
    className: 'bg-slate-100 text-slate-700',
  },
};

function createPriceTopicId(price: CropPriceItem) {
  return `crop-price:${price.cropKey}`;
}

function createPriceSummary(price: CropPriceItem) {
  return `${price.priceLabel} · ${price.sourceLabel} · ${price.capturedAtLabel}`;
}

const alertActions: Array<{ alertType: CropWatchAlertType; icon: typeof ArrowUpRight }> = [
  { alertType: 'price_up', icon: ArrowUpRight },
  { alertType: 'price_down', icon: ArrowDownRight },
  { alertType: 'weekly_summary', icon: CalendarDays },
];

function getMockTrendExplanation(price: CropPriceItem) {
  if (price.changeDirection === 'up') {
    return `แนวโน้ม mock แสดงว่าราคาอ้างอิงเพิ่มขึ้น ${Math.abs(price.changePercent).toFixed(1)}% จากข้อมูลตัวอย่างก่อนหน้า`;
  }

  if (price.changeDirection === 'down') {
    return `แนวโน้ม mock แสดงว่าราคาอ้างอิงลดลง ${Math.abs(price.changePercent).toFixed(1)}% จากข้อมูลตัวอย่างก่อนหน้า`;
  }

  return 'แนวโน้ม mock แสดงว่าราคาอ้างอิงทรงตัวเมื่อเทียบกับข้อมูลตัวอย่างก่อนหน้า';
}

export function PriceDetailPage() {
  const { priceId = '' } = useParams();
  const [targetPriceInput, setTargetPriceInput] = useState('');
  const price = findCropPriceItem(priceId);
  const { followTopic, isFollowingTopic, isSaved, saveItem, unfollowTopic, unsaveItem } = useGuestMemory();
  const {
    findCropWatch,
    isAlertEnabled,
    isWatchingCrop: isCropWatched,
    removeCropWatch,
    setAlertPreference,
    toggleAlertPreference,
    watchCrop,
  } = useCropWatch();

  if (!price) {
    return (
      <div>
        <PageHeader title="ไม่พบราคาอ้างอิง" subtitle="ลิงก์นี้ไม่มีในชุดข้อมูลตัวอย่าง" showBack />
        <div className="px-5 pb-6">
          <Card className="p-5 text-center">
            <FileText aria-hidden="true" className="mx-auto h-10 w-10 text-kaset-deep" />
            <h2 className="mt-3 text-lg font-extrabold text-kaset-ink">ยังไม่มีรายการราคานี้</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">กลับไปเลือกจากหน้าราคาพืชผลตัวอย่าง</p>
            <Link className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-kaset-deep px-5 text-sm font-extrabold text-white" to="/app/prices">
              ดูราคาทั้งหมด
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  const selectedPrice = price;
  const topicId = createPriceTopicId(selectedPrice);
  const followed = isFollowingTopic(topicId) || isCropWatched(selectedPrice.cropKey);
  const saved = isSaved('crop_price', selectedPrice.id);
  const watch = findCropWatch(selectedPrice.cropKey);
  const enabledAlertCount = watch?.alertPreferences.filter((preference) => preference.enabled).length ?? 0;
  const relatedArticles = price.relatedArticleIds
    .map(findArticleContent)
    .filter((item): item is NonNullable<ReturnType<typeof findArticleContent>> => Boolean(item));
  const relatedVideos = price.relatedVideoIds
    .map(findYoutubeVideo)
    .filter((item): item is NonNullable<ReturnType<typeof findYoutubeVideo>> => Boolean(item));
  const maxTrendPrice = Math.max(...price.recentTrend.map((point) => point.referencePrice));

  function toggleFollow() {
    if (followed) {
      unfollowTopic(topicId);
      removeCropWatch(selectedPrice.cropKey);
      return;
    }

    watchCrop({
      price: selectedPrice,
    });
    followTopic({
      id: topicId,
      topicType: 'price',
      title: selectedPrice.cropName,
      sourceRoute: `/app/prices/${selectedPrice.id}`,
      tags: ['ราคาพืชผล', selectedPrice.category, selectedPrice.region.label],
      metadata: {
        cropKey: selectedPrice.cropKey,
        sourceId: selectedPrice.sourceId,
        reliabilityLevel: selectedPrice.reliabilityLevel,
      },
    });
  }

  function toggleAlert(alertType: CropWatchAlertType) {
    toggleAlertPreference(selectedPrice, alertType);

    if (!isFollowingTopic(topicId)) {
      followTopic({
        id: topicId,
        topicType: 'price',
        title: selectedPrice.cropName,
        sourceRoute: `/app/prices/${selectedPrice.id}`,
        tags: ['ราคาพืชผล', selectedPrice.category, selectedPrice.region.label],
        metadata: {
          cropKey: selectedPrice.cropKey,
          sourceId: selectedPrice.sourceId,
          reliabilityLevel: selectedPrice.reliabilityLevel,
          alertType,
        },
      });
    }
  }

  function saveTargetPriceAlert() {
    const targetPrice = Number(targetPriceInput);

    if (!Number.isFinite(targetPrice) || targetPrice <= 0) {
      return;
    }

    setAlertPreference({
      price: selectedPrice,
      alertType: 'target_price',
      enabled: true,
      targetPrice,
    });
  }

  function toggleSave() {
    if (saved) {
      unsaveItem('crop_price', selectedPrice.id);
      return;
    }

    saveItem({
      itemType: 'crop_price',
      itemId: selectedPrice.id,
      title: `ราคาอ้างอิง ${selectedPrice.cropName}`,
      summary: createPriceSummary(selectedPrice),
      sourceRoute: `/app/prices/${selectedPrice.id}`,
      tags: ['ราคาอ้างอิง', selectedPrice.category, selectedPrice.region.label, selectedPrice.sourceLabel],
      metadata: {
        priceReference: selectedPrice,
      },
    });
  }

  return (
    <div>
      <PageHeader title="รายละเอียดราคา" subtitle="ราคาอ้างอิงตัวอย่าง" showBack />
      <div className="grid gap-5 px-5 pb-6">
        <section className="grid gap-3">
          <div className="flex flex-wrap gap-2">
            <Badge tone="gold">ราคาอ้างอิง</Badge>
            <Badge tone="neutral">{price.demoLabel}</Badge>
            <Badge tone="sky">{cropPriceReliabilityLabels[price.reliabilityLevel]}</Badge>
          </div>
          <h1 className="text-2xl font-extrabold leading-8 text-kaset-ink">{price.cropName}</h1>
          <p className="text-base leading-7 text-slate-700">{price.summary}</p>
        </section>

        <Card className="overflow-hidden">
          <div className="bg-kaset-deep p-5 text-white">
            <p className="text-sm font-bold text-emerald-50">ราคาอ้างอิงล่าสุด</p>
            <p className="mt-2 text-4xl font-extrabold leading-tight">{price.priceLabel}</p>
            <p className="mt-2 text-sm leading-6 text-emerald-50/90">
              {price.sourceLabel} · {price.capturedAtLabel}
            </p>
          </div>
          <div className="grid gap-3 p-5">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-kaset-mist p-3">
                <p className="text-xs font-bold text-slate-500">ตลาด/พื้นที่</p>
                <p className="mt-1 text-sm font-extrabold leading-6 text-kaset-ink">
                  {price.market.label} · {price.region.label}
                </p>
              </div>
              <div className="rounded-lg bg-kaset-mist p-3">
                <p className="text-xs font-bold text-slate-500">หน่วย</p>
                <p className="mt-1 text-sm font-extrabold leading-6 text-kaset-ink">{price.unit.label}</p>
              </div>
              <div className="rounded-lg bg-kaset-mist p-3">
                <p className="text-xs font-bold text-slate-500">เกรด</p>
                <p className="mt-1 text-sm font-extrabold leading-6 text-kaset-ink">
                  {price.qualityGrade?.label ?? 'ไม่ระบุในตัวอย่าง'}
                </p>
              </div>
              <div className="rounded-lg bg-kaset-mist p-3">
                <p className="text-xs font-bold text-slate-500">สถานะแหล่งข้อมูล</p>
                <p className="mt-1 text-sm font-extrabold leading-6 text-kaset-ink">
                  {cropPriceSourceStatusLabels[price.sourceStatus]}
                </p>
              </div>
            </div>
            {price.qualityGrade?.description ? (
              <p className="rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-900">{price.qualityGrade.description}</p>
            ) : null}
          </div>
        </Card>

        <div className="grid gap-2 sm:grid-cols-3">
          <Button className="w-full min-h-11 px-3 text-sm" onClick={toggleFollow} variant={followed ? 'soft' : 'secondary'}>
            {followed ? <Check aria-hidden="true" className="h-4 w-4" /> : <Leaf aria-hidden="true" className="h-4 w-4" />}
            {followed ? 'ติดตามแล้ว' : 'ติดตามพืชนี้'}
          </Button>
          <Button className="w-full min-h-11 px-3 text-sm" onClick={toggleSave} variant={saved ? 'soft' : 'secondary'}>
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

        <Link
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-kaset-deep px-5 text-sm font-extrabold text-white shadow-soft"
          to="/app/ai"
        >
          <Bot aria-hidden="true" className="h-4 w-4" />
          ถาม AI เกี่ยวกับราคาอ้างอิงนี้
        </Link>
        <p className="-mt-3 rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-900">
          CTA นี้เป็นทางไปหน้า AI mock เท่านั้น คำอธิบายราคาควรอ้างแหล่งข้อมูลและวันที่เสมอ และต้องไม่รับประกันราคาขายจริง
        </p>

        <NoticeBox icon={ShieldAlert} tone="warning" title="ข้อควรระวังเรื่องราคา">
          ราคาในหน้านี้เป็นข้อมูลตัวอย่างเพื่อทดสอบหน้าจอเท่านั้น AI หรือแอปไม่ควรรับประกันราคาขายจริง {price.disclaimer}
        </NoticeBox>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
              <Bell aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-extrabold text-kaset-ink">ติดตามพืชนี้</h2>
                <Badge tone={followed ? 'green' : 'neutral'}>{followed ? 'ติดตามแล้ว' : 'ยังไม่ติดตาม'}</Badge>
              </div>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                {watch
                  ? `${watch.preferredMarketLabel} · ${watch.preferredRegionLabel} · เปิดแจ้งเตือนตัวอย่าง ${enabledAlertCount} แบบ`
                  : 'บันทึกพืชนี้ไว้ในเครื่องเพื่อกลับมาดูราคาอ้างอิงและตั้งค่าแจ้งเตือนตัวอย่าง'}
              </p>
              <p className="mt-2 text-xs leading-5 text-slate-500">{cropWatchLocalOnlyNotice}</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button className="min-h-11 px-3 text-sm" onClick={toggleFollow} variant={followed ? 'soft' : 'secondary'}>
              {followed ? <Check aria-hidden="true" className="h-4 w-4" /> : <Leaf aria-hidden="true" className="h-4 w-4" />}
              {followed ? 'ติดตามแล้ว' : 'ติดตามพืชนี้'}
            </Button>
            <Link
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-kaset-mint px-3 text-sm font-extrabold text-kaset-deep"
              to="/app/crop-watch"
            >
              ดูทั้งหมด
            </Link>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-amber-100 text-amber-800">
              <Target aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-extrabold text-kaset-ink">ตั้งค่าแจ้งเตือนราคาแบบตัวอย่าง</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">ตั้ง preference ในเครื่องนี้เท่านั้น ยังไม่มี push notification จริง</p>
            </div>
          </div>
          <div className="mt-4 grid gap-2">
            {alertActions.map((action) => {
              const Icon = action.icon;
              const enabled = isAlertEnabled(selectedPrice.cropKey, action.alertType);

              return (
                <Button
                  className="w-full min-h-11 justify-start px-3 text-sm"
                  key={action.alertType}
                  onClick={() => toggleAlert(action.alertType)}
                  variant={enabled ? 'soft' : 'secondary'}
                >
                  {enabled ? <Check aria-hidden="true" className="h-4 w-4" /> : <Icon aria-hidden="true" className="h-4 w-4" />}
                  {cropWatchAlertLabels[action.alertType]}
                </Button>
              );
            })}
          </div>
          <div className="mt-4 rounded-lg bg-kaset-mist p-3">
            <label className="text-sm font-extrabold text-kaset-ink" htmlFor="target-price-alert">
              ราคาเป้าหมายตัวอย่าง
            </label>
            <div className="mt-2 grid grid-cols-[1fr_auto] gap-2">
              <input
                className="kh-form-control w-full border border-kaset-deep/10 bg-white px-3 text-kaset-ink outline-none focus:border-kaset-leaf"
                id="target-price-alert"
                inputMode="decimal"
                onChange={(event) => setTargetPriceInput(event.target.value)}
                placeholder={`เช่น ${Math.ceil(selectedPrice.referencePrice + 1)}`}
                value={targetPriceInput}
              />
              <Button className="min-h-11 px-3 text-sm" onClick={saveTargetPriceAlert} variant="secondary">
                ตั้ง
              </Button>
            </div>
            {isAlertEnabled(selectedPrice.cropKey, 'target_price') ? (
              <p className="mt-2 text-xs font-bold text-kaset-deep">ตั้งราคาเป้าหมายตัวอย่างไว้แล้ว</p>
            ) : null}
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="text-lg font-extrabold text-kaset-ink">แนวโน้มล่าสุดแบบ mock</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            {getMockTrendExplanation(price)} ใช้ดูรูปแบบการแสดงผลเท่านั้น ไม่ใช่กราฟราคาจริง
          </p>
          <div className="mt-4 grid gap-2">
            {price.recentTrend.map((point) => {
              const meta = trendMeta[point.direction];
              const Icon = meta.icon;

              return (
                <div className="grid grid-cols-[72px_1fr_auto] items-center gap-3 rounded-lg bg-kaset-mist px-3 py-3" key={point.label}>
                  <p className="text-sm font-extrabold text-slate-600">{point.label}</p>
                  <div className="h-2 rounded-full bg-white">
                    <div
                      className="h-2 rounded-full bg-kaset-leaf"
                      style={{ width: `${Math.max(24, (point.referencePrice / maxTrendPrice) * 100)}%` }}
                    />
                  </div>
                  <span className={cx('inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-extrabold', meta.className)}>
                    <Icon aria-hidden="true" className="h-3.5 w-3.5" />
                    {point.priceLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>

        {relatedVideos.length > 0 ? (
          <section className="grid gap-3">
            <h2 className="text-lg font-extrabold text-kaset-ink">วิดีโอที่เกี่ยวข้อง</h2>
            {relatedVideos.map((video) => (
              <Link className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-card ring-1 ring-kaset-deep/5" key={video.videoId} to={`/app/youtube/${video.videoId}`}>
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-sky-100 text-sky-800">
                  <Video aria-hidden="true" className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="line-clamp-2 text-sm font-extrabold leading-5 text-kaset-ink">{video.title}</span>
                  <span className="mt-1 block text-xs font-bold text-slate-500">{video.duration}</span>
                </span>
                <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0 text-kaset-deep" />
              </Link>
            ))}
          </section>
        ) : null}

        {relatedArticles.length > 0 ? (
          <section className="grid gap-3">
            <h2 className="text-lg font-extrabold text-kaset-ink">บทความที่เกี่ยวข้อง</h2>
            {relatedArticles.map((article) => (
              <ArticleCard article={contentToArticle(article)} key={article.id} />
            ))}
          </section>
        ) : null}
      </div>
    </div>
  );
}
