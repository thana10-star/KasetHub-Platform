import { Camera, CheckCircle2, FileLock2, ShieldAlert, ShieldCheck, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

const privacyPoints = [
  'เวอร์ชันนี้เก็บรูปไว้เป็น preview ในเครื่องเท่านั้น',
  'อนาคตอาจอัปโหลดรูปแบบส่วนตัวเพื่อให้ AI วิเคราะห์',
  'ต้องขอความยินยอมก่อนอัปโหลดหรือประมวลผลรูปภาพ',
  'ผู้ใช้ควรลบรูปและประวัติได้ภายหลัง',
  'ไม่ควรอัปโหลดรูปที่มีคน ใบหน้า ป้ายบ้าน เอกสาร หรือข้อมูลส่วนตัว',
];

const futureSteps = [
  'อัปโหลดเข้า private bucket',
  'ตรวจชนิดไฟล์ ขนาด และ metadata',
  'ตรวจความเหมาะสมก่อนส่งเข้า AI',
  'ออก signed URL แบบหมดอายุ',
  'บันทึกผลวิเคราะห์แยกจากไฟล์รูป',
];

export function ImagePrivacyPage() {
  return (
    <div>
      <PageHeader title="ความเป็นส่วนตัวของรูปภาพ" subtitle="แนวทางข้อมูลภาพพืชก่อนเปิดอัปโหลดจริง" showBack />
      <div className="grid gap-5 px-5 pb-6">
        <Card className="overflow-hidden bg-kaset-deep text-white">
          <div className="relative p-5">
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10" />
            <div className="relative flex gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-white text-kaset-deep">
                <FileLock2 aria-hidden="true" className="h-7 w-7" />
              </span>
              <div>
                <Badge className="bg-white/15 text-white" tone="green">
                  Local only now
                </Badge>
                <h2 className="mt-3 text-xl font-extrabold">ตอนนี้รูปยังไม่ถูกอัปโหลด</h2>
                <p className="mt-2 text-sm leading-6 text-emerald-50/90">
                  KasetHub M12 เป็นแบบจำลองการจัดเก็บและความเป็นส่วนตัว เพื่อเตรียมระบบจริงโดยไม่ส่งรูปออกจากเครื่อง
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
              <ShieldCheck aria-hidden="true" className="h-6 w-6" />
            </span>
            <div>
              <h2 className="text-lg font-extrabold text-kaset-ink">ผู้ใช้ต้องรู้และยินยอมก่อน</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                ภาพจากแปลงอาจมีข้อมูลพื้นที่ ทรัพย์สิน หรือคนติดอยู่ในภาพ อนาคตจึงต้องอธิบายให้ชัดว่ารูปใช้เพื่ออะไร เก็บนานแค่ไหน และลบได้อย่างไร
              </p>
            </div>
          </div>
          <div className="mt-4 grid gap-2">
            {privacyPoints.map((point) => (
              <div className="flex gap-2 rounded-lg bg-kaset-mist p-3 text-sm leading-6 text-slate-700" key={point}>
                <CheckCircle2 aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-kaset-leaf" />
                <span>{point}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
              <Camera aria-hidden="true" className="h-6 w-6" />
            </span>
            <div>
              <h2 className="text-lg font-extrabold text-kaset-ink">แผนในอนาคตเมื่อเปิด AI Vision</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                รูปพืชจะควรอยู่ในพื้นที่ส่วนตัว ไม่เปิดสาธารณะ และส่งเข้า AI ผ่าน backend เท่านั้น
              </p>
            </div>
          </div>
          <div className="mt-4 grid gap-2">
            {futureSteps.map((step, index) => (
              <div className="flex items-center gap-3 rounded-lg bg-white p-3 shadow-soft ring-1 ring-kaset-deep/5" key={step}>
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-kaset-deep text-xs font-extrabold text-white">
                  {index + 1}
                </span>
                <span className="text-sm font-bold leading-5 text-kaset-ink">{step}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="border-amber-200 bg-amber-50 p-5">
          <div className="flex gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-white text-amber-800">
              <ShieldAlert aria-hidden="true" className="h-6 w-6" />
            </span>
            <div>
              <h2 className="font-extrabold text-amber-950">ผลวิเคราะห์เป็นแนวทางเบื้องต้น</h2>
              <p className="mt-2 text-sm leading-6 text-amber-900">
                AI อาจช่วยคัดกรองอาการได้ แต่ไม่ใช่การวินิจฉัยที่รับประกันผล ควรตรวจสอบกับผู้เชี่ยวชาญก่อนใช้สารเคมีหรือปรับแผนดูแลพืชจริง
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-rose-50 text-rose-700">
              <Trash2 aria-hidden="true" className="h-6 w-6" />
            </span>
            <div>
              <h2 className="font-extrabold text-kaset-ink">สิทธิ์ในการลบรูป</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                ระบบจริงควรให้ผู้ใช้ลบรูปต้นฉบับ รูปย่อ และประวัติที่เชื่อมกับ My Farm ได้ โดยไม่เก็บไฟล์ดิบไว้เกินความจำเป็น
              </p>
            </div>
          </div>
        </Card>

        <Link to="/app/analyze">
          <Button className="w-full">
            <Camera aria-hidden="true" className="h-4 w-4" />
            กลับไปวิเคราะห์โรคพืช
          </Button>
        </Link>
      </div>
    </div>
  );
}
