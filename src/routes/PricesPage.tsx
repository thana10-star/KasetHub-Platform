import { Bell, ChartNoAxesColumn, ClipboardCheck, Database, Landmark, ShieldCheck, Tags } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';

const priceCommodityCards = [
  'ข้าว',
  'ข้าวโพด',
  'มันสำปะหลัง',
  'อ้อย',
  'ยางพารา',
  'ปาล์มน้ำมัน',
  'พริก',
  'ผัก/ผลไม้',
];

const sourceRequirements = [
  'แหล่งข้อมูลน่าเชื่อถือและอ้างอิงได้',
  'มีรอบอัปเดตที่ชัดเจน',
  'ครอบคลุมสินค้าเกษตรไทยที่เกษตรกรติดตามบ่อย',
  'มีชื่อแหล่งข้อมูล วันที่ และสถานะข้อมูลทุกครั้ง',
];

export function PricesPage() {
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
                <Badge tone="gold">รอเชื่อมแหล่งข้อมูลจริง</Badge>
                <h2 className="mt-3 text-2xl font-extrabold leading-8">ดูสินค้าเกษตรที่ต้องการติดตาม</h2>
                <p className="mt-2 text-sm leading-6 text-emerald-50/90">
                  หน้านี้เตรียมโครงสร้างสำหรับราคาเกษตรจริง แต่ยังไม่แสดงราคาจริงจนกว่าจะเชื่อมแหล่งข้อมูลที่ตรวจสอบได้
                </p>
              </div>
            </div>
          </div>
        </Card>

        <NoticeBox tone="warning" icon={ShieldCheck} title="ยังไม่แสดงราคาจริงจนกว่าจะเชื่อมแหล่งข้อมูล">
          KasetHub จะไม่ใส่ราคาสินค้าเกษตรขึ้นมาเอง และจะไม่แสดงตัวเลขราคาจนกว่าจะมีแหล่งข้อมูลจริง พร้อมชื่อแหล่งข้อมูล วันที่ และเงื่อนไขการใช้งานที่ชัดเจน
        </NoticeBox>

        <section className="grid gap-3" aria-labelledby="price-commodity-title">
          <div className="flex items-center justify-between gap-3">
            <h2 id="price-commodity-title" className="text-lg font-extrabold text-kaset-ink">
              สินค้าที่เกษตรกรติดตามบ่อย
            </h2>
            <Badge tone="neutral">แหล่งข้อมูลรอเชื่อม</Badge>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {priceCommodityCards.map((commodity) => (
              <Card className="p-4" key={commodity}>
                <div className="flex items-start gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
                    <ChartNoAxesColumn aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-extrabold leading-7 text-kaset-ink">{commodity}</h3>
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
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-sky-100 text-sky-800">
              <Database aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-extrabold text-kaset-ink">สถานะแหล่งข้อมูลราคา</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                ยังไม่ได้เชื่อมแหล่งข้อมูลราคาที่ใช้ในงานจริง จึงแสดงเฉพาะรายการสินค้าที่เตรียมรองรับ และไม่แสดงตัวเลขราคา
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
