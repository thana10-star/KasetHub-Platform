import { Bell, BellOff, Leaf, Tags, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { useCropWatch } from '@/hooks/useCropWatch';

export function CropWatchPage() {
  const { counts, removeCropWatch, setCropWatchEnabled, watches } = useCropWatch();

  return (
    <div>
      <PageHeader title="รายการติดตามราคาเกษตร" subtitle="สินค้าที่บันทึกไว้สำหรับเชื่อมแหล่งข้อมูลราคาในอนาคต" showBack />
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
                  รอแหล่งข้อมูลจริง
                </Badge>
                <h2 className="mt-3 text-xl font-extrabold leading-7">ติดตามสินค้าเกษตรที่สนใจ</h2>
                <p className="mt-2 text-sm leading-6 text-emerald-50/90">
                  {counts.enabledWatches} สินค้าที่เปิดติดตามอยู่ · ยังไม่แจ้งเตือนราคาจริง
                </p>
              </div>
            </div>
          </div>
        </Card>

        <NoticeBox tone="warning" title="ยังไม่แสดงราคาจริงจนกว่าจะเชื่อมแหล่งข้อมูล">
          รายการนี้เก็บเฉพาะชนิดสินค้าที่สนใจในเครื่องนี้ ยังไม่มีแหล่งข้อมูลราคาจริง ยังไม่มีการแจ้งเตือนจริง และไม่แสดงตัวเลขราคา
        </NoticeBox>

        <Link
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-kaset-deep px-5 text-sm font-extrabold text-white shadow-soft"
          to="/app/prices"
        >
          <Tags aria-hidden="true" className="h-4 w-4" />
          เปิดราคาเกษตร
        </Link>

        {watches.length > 0 ? (
          <section className="grid gap-3">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-extrabold text-kaset-ink">รายการที่บันทึกไว้</h2>
              <Badge tone="neutral">{watches.length} รายการ</Badge>
            </div>

            {watches.map((watch) => (
              <Card className="p-4" key={watch.id}>
                <div className="flex items-start gap-3">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
                    {watch.enabled ? <Bell aria-hidden="true" className="h-6 w-6" /> : <BellOff aria-hidden="true" className="h-6 w-6" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap gap-2">
                      <Badge tone={watch.enabled ? 'green' : 'neutral'}>{watch.enabled ? 'เปิดติดตาม' : 'ปิดไว้'}</Badge>
                      <Badge tone="gold">รอแหล่งข้อมูลราคา</Badge>
                    </div>
                    <h3 className="mt-2 text-xl font-extrabold leading-7 text-kaset-ink">{watch.cropName}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {watch.preferredMarketLabel} · {watch.preferredRegionLabel}
                    </p>
                    <p className="mt-2 rounded-lg bg-kaset-mist p-3 text-sm leading-6 text-slate-700">
                      ยังไม่แสดงราคาจริงจนกว่าจะเชื่อมแหล่งข้อมูล
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Button
                    className="min-h-11 px-3 text-sm"
                    onClick={() => setCropWatchEnabled(watch.cropKey, !watch.enabled)}
                    variant="secondary"
                  >
                    {watch.enabled ? 'ปิดติดตาม' : 'เปิดติดตาม'}
                  </Button>
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
            ))}
          </section>
        ) : (
          <Card className="p-5 text-center">
            <Leaf aria-hidden="true" className="mx-auto h-10 w-10 text-kaset-deep" />
            <h2 className="mt-3 text-lg font-extrabold text-kaset-ink">ยังไม่มีสินค้าที่ติดตาม</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">เริ่มจากหน้า ราคาเกษตร แล้วเลือกสินค้าที่ต้องการติดตามเมื่อระบบเปิดให้บันทึกชนิดสินค้า</p>
            <Link className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-kaset-deep px-5 text-sm font-extrabold text-white" to="/app/prices">
              เปิดราคาเกษตร
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
}
