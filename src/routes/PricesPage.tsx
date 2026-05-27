import { Bell, ChartNoAxesColumn, ClipboardCheck, Database, Landmark, ShieldCheck, Tags } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import {
  getPriceAdapterSnapshot,
  type PriceAdapterSnapshot,
} from '@/services/prices/price-adapter-service';
import type { CommodityPrice } from '@/services/prices/price.types';

const priceCommodityCards = [
  { code: 'rice', name: 'ข้าว' },
  { code: 'corn', name: 'ข้าวโพด' },
  { code: 'cassava', name: 'มันสำปะหลัง' },
  { code: 'sugarcane', name: 'อ้อย' },
  { code: 'rubber', name: 'ยางพารา' },
  { code: 'palm', name: 'ปาล์มน้ำมัน' },
  { code: 'chili', name: 'พริก' },
  { code: 'fruit-vegetable', name: 'ผัก/ผลไม้' },
];

const sourceRequirements = [
  'แหล่งข้อมูลน่าเชื่อถือและอ้างอิงได้',
  'มีรอบอัปเดตที่ชัดเจน',
  'ครอบคลุมสินค้าเกษตรไทยที่เกษตรกรติดตามบ่อย',
  'มีชื่อแหล่งข้อมูล วันที่ และสถานะข้อมูลทุกครั้ง',
];

function formatPrice(price: number) {
  return new Intl.NumberFormat('th-TH', {
    maximumFractionDigits: 2,
    minimumFractionDigits: Number.isInteger(price) ? 0 : 2,
  }).format(price);
}

function formatPriceValue(row: CommodityPrice) {
  if (typeof row.priceMax === 'number' && row.priceMax > row.price) {
    return `${formatPrice(row.price)}–${formatPrice(row.priceMax)}`;
  }

  return formatPrice(row.price);
}

function hasPriceRange(row: CommodityPrice) {
  return typeof row.priceMax === 'number' && row.priceMax > row.price;
}

function getPriceMarketContextLabel(row: CommodityPrice) {
  if (row.freshnessPolicy === 'seasonal_reference') {
    return row.marketName.includes('10 CCS')
      ? 'ราคาอ้างอิงตามฤดูกาล · 10 CCS'
      : 'ราคาอ้างอิงตามฤดูกาล';
  }

  const contextParts = [
    row.province,
    row.marketName.includes('แป้ง 25%') ? 'แป้ง 25%' : row.marketName,
    hasPriceRange(row) ? 'ช่วงราคา' : undefined,
  ].filter(Boolean);

  return contextParts.join(' · ');
}

function getUpdatedDateLabel(row: CommodityPrice) {
  return row.freshnessPolicy === 'seasonal_reference' ? 'วันที่อ้างอิง' : 'อัปเดต';
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('th-TH', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Bangkok',
  }).format(new Date(value));
}

function getCommodityCardsWithoutValidatedRows(rows: CommodityPrice[]) {
  const realCommodityCodes = new Set(rows.map((row) => row.commodityCode));

  return priceCommodityCards.filter((commodity) => !realCommodityCodes.has(commodity.code));
}

type PricesPageProps = {
  priceSnapshot?: PriceAdapterSnapshot;
};

export function PricesPage({ priceSnapshot = getPriceAdapterSnapshot() }: PricesPageProps = {}) {
  const realCommodityRows = priceSnapshot.commodityPrices;
  const hasValidatedRealRows = realCommodityRows.length > 0;
  const pendingCommodityCards = getCommodityCardsWithoutValidatedRows(realCommodityRows);

  return (
    <div>
      <PageHeader title="ราคาเกษตร" subtitle="เช็กราคาสินค้าเกษตรและแนวโน้มเบื้องต้น" showBack />
      <div className="grid gap-5 px-5 pb-6">
        <Card className="overflow-hidden bg-kaset-deep text-white">
          <div className="relative p-5">
            <div className="absolute -right-12 -top-16 h-36 w-36 rounded-full bg-white/10" />
            <div className="relative flex items-start gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-white text-kaset-deep shadow-soft">
                <Tags aria-hidden="true" className="h-6 w-6" />
              </span>
              <div className="min-w-0 flex-1">
                <Badge tone={hasValidatedRealRows ? 'green' : 'gold'}>
                  {hasValidatedRealRows ? 'มีแหล่งข้อมูลที่ตรวจสอบแล้ว' : 'รอเชื่อมแหล่งข้อมูลจริง'}
                </Badge>
                <h2 className="mt-3 text-2xl font-extrabold leading-8">
                  {hasValidatedRealRows ? 'ราคาสินค้าเกษตรจากแหล่งข้อมูลจริง' : 'ดูสินค้าเกษตรที่ต้องการติดตาม'}
                </h2>
                <p className="mt-2 text-sm leading-6 text-emerald-50/90">
                  {hasValidatedRealRows
                    ? 'แสดงเฉพาะรายการที่ผ่านการตรวจสอบแหล่งข้อมูล หน่วย ราคา และวันที่อัปเดตแล้ว'
                    : 'หน้านี้เตรียมโครงสร้างสำหรับราคาเกษตรจริง แต่ยังไม่แสดงราคาจริงจนกว่าจะเชื่อมแหล่งข้อมูลที่ตรวจสอบได้'}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {hasValidatedRealRows ? (
          <NoticeBox tone="success" icon={ShieldCheck} title="แสดงเฉพาะราคาที่ผ่านการตรวจสอบ">
            รายการราคาที่แสดงต้องมีชื่อแหล่งข้อมูล หน่วย ราคา วันที่อัปเดต และสถานะข้อมูลเก่าเมื่อข้อมูลพ้นรอบความสดใหม่
          </NoticeBox>
        ) : (
          <NoticeBox tone="warning" icon={ShieldCheck} title="ยังไม่แสดงราคาจริงจนกว่าจะเชื่อมแหล่งข้อมูล">
            KasetHub จะไม่ใส่ราคาสินค้าเกษตรขึ้นมาเอง และจะไม่แสดงตัวเลขราคาจนกว่าจะมีแหล่งข้อมูลจริง พร้อมชื่อแหล่งข้อมูล วันที่ และเงื่อนไขการใช้งานที่ชัดเจน
          </NoticeBox>
        )}

        {hasValidatedRealRows ? (
          <section className="grid gap-3" aria-labelledby="real-price-title">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 id="real-price-title" className="text-lg font-extrabold text-kaset-ink">
                ราคาจากแหล่งข้อมูลที่ตรวจสอบแล้ว
              </h2>
              <Badge tone={priceSnapshot.sourceStatus.status === 'stale' ? 'gold' : 'green'}>
                {priceSnapshot.sourceStatus.status === 'stale' ? 'มีข้อมูลเก่า' : 'พร้อมแสดงราคา'}
              </Badge>
            </div>
            <div className="grid gap-3">
              {realCommodityRows.map((row) => (
                <Card className="p-4" key={row.id}>
                  <div className="flex items-start gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-emerald-100 text-emerald-800">
                      <ChartNoAxesColumn aria-hidden="true" className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="break-words text-lg font-extrabold leading-7 text-kaset-ink">
                            {row.commodityNameTh}
                          </h3>
                          <p className="mt-1 break-words text-sm font-extrabold leading-6 text-slate-700">
                            {getPriceMarketContextLabel(row)}
                          </p>
                          <p className="mt-0.5 break-words text-xs font-semibold leading-5 text-slate-500">
                            {row.marketName}
                            {row.province ? ` · ${row.province}` : ''}
                          </p>
                        </div>
                        {row.isStale ? <Badge tone="gold">ข้อมูลเก่า / ควรตรวจสอบอีกครั้ง</Badge> : <Badge tone="green">ราคาล่าสุด</Badge>}
                        {hasPriceRange(row) ? <Badge tone="sky">ช่วงราคา</Badge> : null}
                        {row.freshnessPolicy === 'seasonal_reference' ? (
                          <Badge tone="sky">ราคาอ้างอิงตามฤดูกาล</Badge>
                        ) : null}
                      </div>
                      <p className="mt-3 text-2xl font-extrabold leading-8 text-kaset-ink">
                        {formatPriceValue(row)}
                        <span className="ml-2 text-sm font-bold text-slate-600">{row.unit}</span>
                      </p>
                      <p className="mt-2 break-words text-xs font-semibold leading-5 text-slate-500">
                        แหล่งข้อมูล: {row.sourceDisplayName} · {getUpdatedDateLabel(row)} {formatDateTime(row.updatedAt)}
                      </p>
                      <p className="mt-1 break-words text-xs font-semibold leading-5 text-slate-500">
                        ตรวจเมื่อ {formatDateTime(row.fetchedAt)}
                      </p>
                      {row.notes ? <p className="mt-1 break-words text-xs font-semibold leading-5 text-slate-500">{row.notes}</p> : null}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        ) : null}

        {hasValidatedRealRows ? (
          <Card className="p-4">
            <div className="flex gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-amber-100 text-amber-800">
                <ClipboardCheck aria-hidden="true" className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="font-extrabold text-kaset-ink">อ่านราคานี้อย่างไร</h2>
                <ul className="mt-2 grid gap-2 text-sm leading-6 text-slate-700">
                  <li>ราคาบางรายการเป็นช่วงราคา เพราะขึ้นกับตลาด คุณภาพ และพื้นที่</li>
                  <li>ราคาอ้างอิงตามฤดูกาลไม่ใช่ราคาตลาดรายวัน</li>
                  <li>ควรตรวจสอบแหล่งข้อมูลและพื้นที่จริงก่อนตัดสินใจขาย/ซื้อ</li>
                </ul>
              </div>
            </div>
          </Card>
        ) : null}

        <section className="grid gap-3" aria-labelledby="price-commodity-title">
          <div className="flex items-center justify-between gap-3">
            <h2 id="price-commodity-title" className="text-lg font-extrabold text-kaset-ink">
              {hasValidatedRealRows ? 'รายการที่ยังรอแหล่งข้อมูล' : 'สินค้าที่เกษตรกรติดตามบ่อย'}
            </h2>
            <Badge tone="neutral">แหล่งข้อมูลรอเชื่อม</Badge>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {pendingCommodityCards.map((commodity) => (
              <Card className="p-4" key={commodity.code}>
                <div className="flex items-start gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
                    <ChartNoAxesColumn aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-extrabold leading-7 text-kaset-ink">{commodity.name}</h3>
                    <p className="mt-1 text-sm font-semibold leading-6 text-kaset-deep">เตรียมเชื่อมแหล่งข้อมูลราคา</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">ยังไม่แสดงราคาจริงจนกว่าจะเชื่อมแหล่งข้อมูล</p>
                  </div>
                </div>
                <div className="mt-4 grid gap-2">
                  <Button className="w-full justify-center px-3 text-sm" disabled variant="secondary">
                    ดูรายละเอียด
                  </Button>
                  <Button className="w-full justify-center px-3 text-sm" disabled variant="soft">
                    แจ้งชนิดสินค้าที่อยากติดตาม
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-lime-100 text-lime-800">
              <Tags aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-extrabold text-kaset-ink">ราคาปุ๋ย</h2>
                <Badge tone="neutral">ยังไม่แสดงราคา</Badge>
              </div>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                ปุ๋ยยังรอแหล่งข้อมูลที่ตรวจสอบได้ จึงไม่แสดงตัวเลขราคา สูตร และขนาดกระสอบจนกว่าจะมีแหล่งข้อมูลพร้อมวันที่อัปเดตชัดเจน
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-sky-100 text-sky-800">
              <Database aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-extrabold text-kaset-ink">สถานะแหล่งข้อมูลราคา</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                {hasValidatedRealRows
                  ? 'ขณะนี้แสดงเฉพาะแถวราคาที่ตรวจสอบแหล่งข้อมูล หน่วย และวันที่แล้ว ส่วนสินค้าอื่นยังรอแหล่งข้อมูลที่เชื่อถือได้'
                  : 'ยังไม่ได้เชื่อมแหล่งข้อมูลราคาที่ใช้ในงานจริง จึงแสดงเฉพาะรายการสินค้าที่เตรียมรองรับ และไม่แสดงตัวเลขราคา'}
              </p>
              <ul className="mt-3 grid gap-2 text-sm leading-6 text-slate-700">
                {sourceRequirements.map((requirement) => (
                  <li className="flex gap-2" key={requirement}>
                    <ClipboardCheck aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-kaset-deep" />
                    <span>{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-amber-100 text-amber-800">
              <Landmark aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-extrabold text-kaset-ink">แนวทางต่อไป</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                ขั้นต่อไปคือเลือกแหล่งข้อมูลราคา เช่น หน่วยงานทางการ ตลาดกลาง จุดรับซื้อ หรือรายการที่เจ้าของระบบดูแลเองชั่วคราว โดยต้องมีการอ้างอิงและป้ายข้อมูลเก่าเมื่อราคาไม่สดใหม่
              </p>
            </div>
          </div>
        </Card>

        <Link to="/app/help">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
                <Bell aria-hidden="true" className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="font-extrabold leading-6 text-kaset-ink">ดูวิธีใช้ราคาเกษตร</h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">ใช้ดูแหล่งข้อมูลราคาสินค้าเกษตร เมื่อระบบเชื่อมข้อมูลจริงแล้ว</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}
