import { ClipboardCheck, ShieldCheck } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';

const checklistItems = [
  'ผู้ทดสอบเข้าใจหน้าแรกไหม',
  'หา “ฟาร์มของฉัน” เจอไหม',
  'กดเพิ่มกิจกรรมได้ไหม',
  'กดเพิ่มรายรับรายจ่ายได้ไหม',
  'ตัวหนังสืออ่านง่ายไหม',
  'เมนูล่างเข้าใจไหม',
  'ผู้ใช้เข้าใจไหมว่าต้องเริ่มจากเพิ่มแปลง',
  'ผู้ใช้เข้าใจคำว่า “บันทึกงานในฟาร์ม” ไหม',
  'ผู้ใช้เข้าใจคำว่า “เพิ่มเงิน” หมายถึงรายรับรายจ่ายไหม',
  'ผู้ใช้หา “เพิ่มผลผลิต” เจอไหม',
  'ผู้ใช้รู้ไหมว่าช่องไหนจำเป็น/ไม่จำเป็น',
];

export function FieldTestFeedbackPage() {
  return (
    <div>
      <PageHeader title="บันทึกทดสอบกับผู้ใช้" subtitle="เช็กลิสต์ภาคสนามแบบ local/static" showBack />
      <div className="grid gap-5 px-5 pb-6">
        <NoticeBox tone="warning" title="ใช้จดข้อสังเกตเท่านั้น" icon={ShieldCheck}>
          <p>ข้อมูลนี้ไม่ถูกส่งไป backend</p>
          <p>อย่าใส่ชื่อจริง เบอร์โทร ที่อยู่ หรือข้อมูลส่วนตัวของผู้ทดสอบ</p>
          <p>ใช้สำหรับจดข้อสังเกตระหว่างทดสอบเท่านั้น</p>
        </NoticeBox>

        <Card className="p-4">
          <div className="flex items-start gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
              <ClipboardCheck aria-hidden="true" className="h-6 w-6" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap gap-2">
                <Badge tone="neutral">ไม่มีการส่งข้อมูล</Badge>
                <Badge tone="green">field-test</Badge>
              </div>
              <h2 className="mt-2 text-lg font-extrabold leading-7 text-kaset-ink">เช็กลิสต์ระหว่างดูผู้ใช้จริง</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">ดูว่าผู้ใช้ทำได้เองหรือหยุดตรงไหน</p>
            </div>
          </div>
        </Card>

        <form className="grid gap-3">
          {checklistItems.map((item) => (
            <label className="flex min-h-[56px] items-center gap-3 rounded-lg bg-white p-4 font-bold text-kaset-ink shadow-card ring-1 ring-kaset-deep/5" key={item}>
              <input className="h-5 w-5 shrink-0 accent-kaset-deep" type="checkbox" />
              <span className="leading-6">{item}</span>
            </label>
          ))}

          <Card className="p-4">
            <label className="grid gap-2">
              <span className="font-extrabold text-kaset-ink">จุดที่ผู้ใช้สับสน</span>
              <textarea className="min-h-24 rounded-lg border border-kaset-deep/15 p-3 text-sm leading-6 text-kaset-ink" placeholder="จดเป็นคำสั้น ๆ ไม่ใส่ข้อมูลส่วนตัว" />
            </label>
          </Card>

          <Card className="p-4">
            <label className="grid gap-2">
              <span className="font-extrabold text-kaset-ink">ข้อเสนอแนะ</span>
              <textarea className="min-h-24 rounded-lg border border-kaset-deep/15 p-3 text-sm leading-6 text-kaset-ink" placeholder="สิ่งที่ควรแก้ให้เข้าใจง่ายขึ้น" />
            </label>
          </Card>

          <Card className="p-4">
            <label className="grid gap-2">
              <span className="font-extrabold text-kaset-ink">คะแนนความง่าย 1-5</span>
              <select className="min-h-12 rounded-lg border border-kaset-deep/15 bg-white p-3 text-base font-bold text-kaset-ink" defaultValue="">
                <option disabled value="">
                  เลือกคะแนน
                </option>
                <option value="1">1 - ยากมาก</option>
                <option value="2">2 - ยังสับสน</option>
                <option value="3">3 - พอใช้ได้</option>
                <option value="4">4 - ใช้ง่าย</option>
                <option value="5">5 - ใช้ง่ายมาก</option>
              </select>
            </label>
          </Card>
        </form>
      </div>
    </div>
  );
}
