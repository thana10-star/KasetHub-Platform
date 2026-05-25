import { Bot, Calculator, CloudSun, ClipboardList, HelpCircle, Sprout, WalletCards } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { LargeActionButton } from '@/components/ui/LargeActionButton';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { AI_FARMER_ASSISTANT_SAFETY_NOTE } from '@/services/ai/ai-farmer-assistant-copy';

const guideSections = [
  {
    title: 'เริ่มจาก “ฟาร์มของฉัน”',
    icon: Sprout,
    lines: ['กดฟาร์มของฉันจากเมนูล่าง', 'ใช้ดูข้อมูลฟาร์มและสมุดบันทึก'],
  },
  {
    title: 'บันทึกรายรับ/รายจ่าย',
    icon: WalletCards,
    lines: ['ค่าปุ๋ย', 'ค่ายา', 'ค่าแรง', 'รายได้จากขายผลผลิต'],
  },
  {
    title: 'บันทึกผลผลิต',
    icon: ClipboardList,
    lines: ['น้ำหนักผลผลิต', 'วันที่เก็บเกี่ยว', 'รายได้จากการขายถ้ามี'],
  },
  {
    title: 'ดูต้นทุน กำไร และผลผลิต',
    icon: Calculator,
    lines: ['ดูต้นทุนต่อไร่', 'ดูต้นทุนต่อกก.', 'ดูกำไร/ขาดทุนจากข้อมูลที่บันทึกในเครื่องนี้'],
  },
  {
    title: 'ใช้เครื่องมือ / ถาม AI / เช็กอากาศ',
    icon: HelpCircle,
    lines: ['เครื่องมือช่วยคำนวณ', 'ถาม AI เกษตรสำหรับคำถามทั่วไป', 'เช็กอากาศและความเสี่ยงเกษตร'],
  },
];

const farmStartSteps = ['เพิ่มแปลง', 'บันทึกรายรับ/รายจ่าย', 'บันทึกผลผลิต'];

export function HelpPage() {
  return (
    <div>
      <PageHeader title="วิธีเริ่มใช้ KasetHub" subtitle="คู่มือสั้น ๆ สำหรับเริ่มใช้งานครั้งแรก" showBack />
      <div className="grid gap-5 px-5 pb-6">
        <NoticeBox tone="success" title="เริ่มจากงานฟาร์มที่ทำอยู่จริง">
          กดฟาร์มของฉัน เพิ่มแปลง บันทึกรายรับรายจ่าย และบันทึกผลผลิต ข้อมูลยังอยู่ในเครื่องนี้
        </NoticeBox>

        <Card className="border-kaset-leaf/30 bg-kaset-mint p-4">
          <div className="flex gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-white text-kaset-deep">
              <ClipboardList aria-hidden="true" className="h-6 w-6" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-extrabold leading-7 text-kaset-ink">เริ่มบันทึกฟาร์ม 3 ขั้นตอน</h2>
              <div className="mt-2 grid gap-2 sm:grid-cols-3">
                {farmStartSteps.map((step, index) => (
                  <p className="rounded-lg bg-white/85 p-3 text-sm font-extrabold leading-5 text-kaset-ink" key={step}>
                    {index + 1}. {step}
                  </p>
                ))}
              </div>
              <p className="mt-3 rounded-lg bg-white/70 p-3 text-sm font-semibold leading-6 text-kaset-ink">
                ถ้าต้องการจดงานในฟาร์ม เช่น ใส่ปุ๋ย พ่นยา หรือให้น้ำ สามารถเพิ่มทีหลังได้
              </p>
              <div className="mt-3 grid gap-2 text-sm font-semibold leading-6 text-kaset-ink sm:grid-cols-2">
                <p className="rounded-lg bg-white/70 p-3">ตัวอย่างชื่อแปลง: แปลงข้าวหลังบ้าน</p>
                <p className="rounded-lg bg-white/70 p-3">ตัวอย่างงาน: ใส่ปุ๋ยข้าว วันที่ 12 มิ.ย.</p>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Link className="inline-flex min-h-11 items-center justify-center rounded-lg bg-kaset-deep px-3 text-sm font-extrabold text-white" to="/app/my-farm">
                  เปิดฟาร์มของฉัน
                </Link>
                <Link className="inline-flex min-h-11 items-center justify-center rounded-lg bg-white px-3 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10" to="/app/farm-records">
                  เปิดสมุดฟาร์ม
                </Link>
              </div>
            </div>
          </div>
        </Card>

        <Card className="border-kaset-deep/10 bg-white p-4">
          <div className="flex gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-amber-100 text-amber-800">
              <Bot aria-hidden="true" className="h-6 w-6" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-extrabold leading-7 text-kaset-ink">ถาม AI เกษตร</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                ถามเรื่องพืช ดิน ปุ๋ย โรค แมลง อากาศ และการจัดการฟาร์มได้ด้วยภาษาง่าย ๆ
              </p>
              <p className="mt-2 rounded-lg bg-amber-50 p-3 text-xs font-semibold leading-5 text-amber-900">
                {AI_FARMER_ASSISTANT_SAFETY_NOTE}
              </p>
              <Link className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-kaset-deep px-4 text-sm font-extrabold text-white" to="/app/ai">
                ถาม AI ตอนนี้
              </Link>
            </div>
          </div>
        </Card>

        <section className="grid gap-3">
          {guideSections.map((section) => {
            const Icon = section.icon;

            return (
              <Card className="p-4" key={section.title}>
                <div className="flex gap-3">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
                    <Icon aria-hidden="true" className="h-6 w-6" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg font-extrabold leading-7 text-kaset-ink">{section.title}</h2>
                    <ul className="mt-2 grid gap-1 text-sm leading-6 text-slate-600">
                      {section.lines.map((line) => (
                        <li key={line}>• {line}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            );
          })}
        </section>

        <section className="grid gap-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-extrabold text-kaset-ink">ทางลัดเริ่มต้น</h2>
            <Badge tone="green">ใช้ได้ทันที</Badge>
          </div>
          <div className="grid gap-3">
            <LargeActionButton description="เปิดศูนย์รวมข้อมูลฟาร์มและสมุดบันทึก" icon={Sprout} label="เปิดฟาร์มของฉัน" to="/app/my-farm" variant="soft" />
            <LargeActionButton description="เพิ่มแปลง บันทึกรายรับรายจ่าย และผลผลิต" icon={ClipboardList} label="เปิดสมุดฟาร์ม" to="/app/farm-records" variant="white" />
            <LargeActionButton description="คำนวณปุ๋ย ระยะปลูก ต้นทุน และผลผลิต" icon={Calculator} label="เปิดเครื่องมือ" to="/app/calculators" variant="white" />
            <LargeActionButton description="ถามเรื่องพืช ดิน ปุ๋ย โรค แมลง อากาศ และการจัดการฟาร์ม" icon={Bot} label="ถาม AI เกษตร" to="/app/ai" variant="white" />
            <LargeActionButton description="ดูอากาศและความเสี่ยงเกษตร" icon={CloudSun} label="เช็กอากาศ" to="/app/weather" variant="white" />
          </div>
        </section>

        <Card className="p-4">
          <h2 className="font-extrabold text-kaset-ink">จำง่าย ๆ</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">เริ่มจากฟาร์มของฉัน แล้วค่อยเพิ่มแปลง เงินเข้าออก และผลผลิตทีละรายการ</p>
          <Link className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-kaset-deep px-4 text-sm font-extrabold text-white" to="/app/my-farm">
            ไปฟาร์มของฉัน
          </Link>
        </Card>
      </div>
    </div>
  );
}
