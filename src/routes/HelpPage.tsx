import { Bot, Calculator, CloudSun, ClipboardList, HelpCircle, Sprout, WalletCards } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { LargeActionButton } from '@/components/ui/LargeActionButton';
import { NoticeBox } from '@/components/ui/NoticeBox';

const guideSections = [
  {
    title: 'เริ่มจาก “ฟาร์มของฉัน”',
    icon: Sprout,
    lines: ['กดฟาร์มของฉันจากเมนูล่าง', 'ใช้ดูข้อมูลฟาร์มและสมุดบันทึก'],
  },
  {
    title: 'บันทึกงานในฟาร์ม',
    icon: ClipboardList,
    lines: ['ใส่ปุ๋ย', 'พ่นยา', 'ให้น้ำ', 'เก็บเกี่ยว', 'จ้างแรงงาน'],
  },
  {
    title: 'บันทึกรายรับรายจ่าย',
    icon: WalletCards,
    lines: ['ค่าปุ๋ย', 'ค่ายา', 'ค่าแรง', 'รายได้จากขายผลผลิต'],
  },
  {
    title: 'ดูต้นทุน กำไร และผลผลิต',
    icon: Calculator,
    lines: ['ดูต้นทุนต่อไร่', 'ดูต้นทุนต่อกก.', 'ดูกำไร/ขาดทุนจากข้อมูลที่บันทึกในเครื่องนี้'],
  },
  {
    title: 'ใช้เครื่องมือ / ถาม AI / เช็กอากาศ',
    icon: HelpCircle,
    lines: ['เครื่องมือช่วยคำนวณ', 'ถาม AI สำหรับความรู้ทั่วไป', 'เช็กอากาศและความเสี่ยงเกษตร'],
  },
];

const farmStartSteps = ['เพิ่มแปลง', 'บันทึกงานในฟาร์ม', 'บันทึกรายรับรายจ่าย', 'บันทึกผลผลิต'];

export function HelpPage() {
  return (
    <div>
      <PageHeader title="วิธีเริ่มใช้ KasetHub" subtitle="คู่มือสั้น ๆ สำหรับเริ่มใช้งานครั้งแรก" showBack />
      <div className="grid gap-5 px-5 pb-6">
        <NoticeBox tone="success" title="เริ่มจากงานฟาร์มที่ทำอยู่จริง">
          กดฟาร์มของฉัน บันทึกงาน รายรับรายจ่าย และผลผลิต ข้อมูลยังอยู่ในเครื่องนี้
        </NoticeBox>

        <Card className="border-kaset-leaf/30 bg-kaset-mint p-4">
          <div className="flex gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-white text-kaset-deep">
              <ClipboardList aria-hidden="true" className="h-6 w-6" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-extrabold leading-7 text-kaset-ink">เริ่มบันทึกฟาร์ม 4 ขั้นตอน</h2>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {farmStartSteps.map((step, index) => (
                  <p className="rounded-lg bg-white/85 p-3 text-sm font-extrabold leading-5 text-kaset-ink" key={step}>
                    {index + 1}. {step}
                  </p>
                ))}
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
            <LargeActionButton description="บันทึกงาน รายรับรายจ่าย และผลผลิต" icon={ClipboardList} label="เปิดสมุดฟาร์ม" to="/app/farm-records" variant="white" />
            <LargeActionButton description="คำนวณปุ๋ย ระยะปลูก ต้นทุน และผลผลิต" icon={Calculator} label="เปิดเครื่องมือ" to="/app/calculators" variant="white" />
            <LargeActionButton description="ถามเรื่องความรู้ทั่วไป ยังไม่อ่านสมุดฟาร์มของคุณ" icon={Bot} label="ถาม AI" to="/app/ai" variant="white" />
            <LargeActionButton description="ดูอากาศและความเสี่ยงเกษตรแบบตัวอย่าง/local" icon={CloudSun} label="เช็กอากาศ" to="/app/weather" variant="white" />
          </div>
        </section>

        <Card className="p-4">
          <h2 className="font-extrabold text-kaset-ink">จำง่าย ๆ</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">เริ่มจากฟาร์มของฉัน แล้วค่อยบันทึกงานและเงินเข้าออกทีละรายการ</p>
          <Link className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-kaset-deep px-4 text-sm font-extrabold text-white" to="/app/my-farm">
            ไปฟาร์มของฉัน
          </Link>
        </Card>
      </div>
    </div>
  );
}
