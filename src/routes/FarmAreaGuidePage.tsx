import { Map, Ruler, ShieldCheck, Square, Triangle } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { farmAreaDisclaimer, thaiLandUnitRules } from '@/services/farm-area/farm-area-fixtures';

const manualSteps = [
  'เดินดูขอบแปลงก่อน ว่าประมาณเป็นสี่เหลี่ยม สามเหลี่ยม หรือรูปผสม',
  'ใช้สายวัด ตลับเมตร หรือเชือกวัดด้านหลัก ๆ เป็นเมตร',
  'จดตัวเลขทันที และวัดซ้ำถ้าพื้นที่ไม่เรียบหรือมีคันนา',
  'ถ้าแปลงไม่เป็นรูปง่าย ให้แบ่งเป็นหลายส่วนแล้วบวกพื้นที่เข้าด้วยกัน',
];

const safetyNotes = [
  'อย่าวัดใกล้ถนน คูน้ำ หรือพื้นที่ลื่นโดยไม่มีคนช่วยดู',
  'ตัวเลขจากแอปนี้เป็นประมาณการ ไม่ควรใช้แทนเอกสารสิทธิ์หรือการซื้อขายที่ดิน',
  'ถ้าต้องใช้เป็นหลักฐาน ให้ติดต่อหน่วยงานหรือผู้รังวัดที่ได้รับอนุญาต',
];

export function FarmAreaGuidePage() {
  return (
    <div>
      <PageHeader title="คู่มือวัดพื้นที่แปลง" subtitle="วัดเองแบบเข้าใจง่าย ก่อนมี GPS/แผนที่จริง" showBack />
      <div className="grid gap-5 px-5 pb-6">
        <NoticeBox tone="warning" title="ไม่ใช่การรังวัดทางการ" icon={ShieldCheck}>
          {farmAreaDisclaimer}
        </NoticeBox>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
              <Ruler aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-extrabold text-kaset-ink">วิธีวัดเองด้วยสายวัด</h2>
              <div className="mt-3 grid gap-2">
                {manualSteps.map((step, index) => (
                  <p className="rounded-lg bg-kaset-mist p-3 text-sm leading-6 text-slate-700" key={step}>
                    {index + 1}. {step}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <section className="grid gap-3">
          <h2 className="text-lg font-extrabold text-kaset-ink">สูตรที่ใช้ในแอป</h2>
          <Card className="p-4">
            <div className="flex gap-3">
              <Square aria-hidden="true" className="h-6 w-6 shrink-0 text-kaset-deep" />
              <div>
                <h3 className="font-extrabold text-kaset-ink">สี่เหลี่ยม</h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">พื้นที่ = กว้าง x ยาว หรือ ด้าน x ด้าน</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex gap-3">
              <Triangle aria-hidden="true" className="h-6 w-6 shrink-0 text-kaset-deep" />
              <div>
                <h3 className="font-extrabold text-kaset-ink">สามเหลี่ยม</h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">พื้นที่ = ฐาน x สูง / 2</p>
              </div>
            </div>
          </Card>
        </section>

        <Card className="p-4">
          <h2 className="font-extrabold text-kaset-ink">หน่วยที่ดินไทย</h2>
          <div className="mt-3 grid gap-2">
            {thaiLandUnitRules.map((rule) => (
              <p className="rounded-lg bg-kaset-mist p-3 text-sm font-bold leading-6 text-kaset-deep" key={rule}>
                {rule}
              </p>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge tone="sky">1 เฮกตาร์ = 10,000 ตร.ม.</Badge>
            <Badge tone="sky">1 เอเคอร์ ≈ 4,046.86 ตร.ม.</Badge>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-sky-100 text-sky-800">
              <Map aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-extrabold text-kaset-ink">GPS และแผนที่ในอนาคต</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                อนาคตอาจมีการเดินรอบแปลงด้วย GPS หรือวาดรูปแปลงบนแผนที่ แต่ต้องขออนุญาตตำแหน่งอย่างชัดเจน
                และต้องไม่ส่งพิกัดโดยที่ผู้ใช้ไม่ยืนยัน
              </p>
              <p className="mt-3 rounded-lg bg-sky-50 p-3 text-xs leading-5 text-sky-900">
                เวอร์ชันนี้ไม่มี GPS ไม่มี map API ไม่มี geolocation prompt และไม่มี network call
              </p>
            </div>
          </div>
        </Card>

        <NoticeBox tone="info" title="ข้อควรระวัง">
          <ul className="grid gap-2">
            {safetyNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </NoticeBox>
      </div>
    </div>
  );
}
