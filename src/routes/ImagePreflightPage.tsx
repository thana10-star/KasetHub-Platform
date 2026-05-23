import {
  Camera,
  CheckCircle2,
  Coins,
  FileImage,
  Gauge,
  ImageDown,
  ShieldCheck,
  UploadCloud,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { defaultImageCompressionOptions } from '@/services/image-analysis/image-compression-service';
import { formatFileSize, recommendedImageFileSizeBytes } from '@/services/image-analysis/image-upload-service';

const photoTips = [
  'ถ่ายให้เห็นใบ ลำต้น แมลง หรือรอยโรคชัด ๆ อยู่กลางภาพ',
  'ใช้แสงธรรมชาติหรือที่สว่าง หลีกเลี่ยงเงามือและภาพย้อนแสง',
  'แตะโฟกัสบนใบพืช แล้วถือกล้องนิ่ง 1-2 วินาทีก่อนกดถ่าย',
  'ถ่ายใกล้พอเห็นรายละเอียด แต่ไม่ใกล้จนภาพเบลอ',
  'หลีกเลี่ยงคน ใบหน้า ป้ายบ้าน เอกสาร หรือข้อมูลส่วนตัวในภาพ',
];

const futureFlow = [
  'ตรวจไฟล์และลดขนาดในเครื่องก่อน',
  'ขอความยินยอมก่อนอัปโหลดจริง',
  'อัปโหลดไป private storage ผ่าน backend',
  'ส่งรูปที่เหมาะสมเข้า AI Vision ผ่าน backend proxy',
  'บันทึกผลแยกจากไฟล์รูป และให้ผู้ใช้ลบได้',
];

export function ImagePreflightPage() {
  return (
    <div>
      <PageHeader title="เตรียมรูปก่อนวิเคราะห์" subtitle="ลดขนาด ตรวจคุณภาพ และรักษาความเป็นส่วนตัวก่อน AI Vision จริง" showBack />
      <div className="grid gap-5 px-5 pb-6">
        <Card className="overflow-hidden bg-kaset-deep text-white">
          <div className="relative p-5">
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10" />
            <div className="relative flex gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-white text-kaset-deep">
                <ImageDown aria-hidden="true" className="h-7 w-7" />
              </span>
              <div className="min-w-0">
                <Badge className="bg-white/15 text-white" tone="green">
                  Local preflight
                </Badge>
                <h2 className="mt-3 text-2xl font-extrabold leading-8">รูปเล็กลง ตรวจง่ายขึ้น ค่า AI ต่ำลงในอนาคต</h2>
                <p className="mt-2 text-sm leading-6 text-emerald-50/90">
                  M31 เตรียมขั้นตอนย่อรูปและตรวจคุณภาพในเครื่องก่อนวิเคราะห์ โดยยังไม่อัปโหลดและยังไม่เรียก AI จริง
                </p>
              </div>
            </div>
          </div>
        </Card>

        <NoticeBox tone="success" title="รูปยังไม่ถูกส่งออกจากเครื่องในเวอร์ชันนี้">
          การย่อรูปและ preflight ทำในเบราว์เซอร์เท่านั้น ไม่มี backend, Supabase Storage, AI API, network call หรือการเก็บไฟล์ดิบ/base64 ใน Guest Memory
        </NoticeBox>

        <section className="grid gap-3">
          <h2 className="text-xl font-extrabold text-kaset-ink">สิ่งที่ระบบตรวจในเครื่อง</h2>
          <Card className="p-4">
            <div className="grid gap-3">
              <div className="flex gap-3">
                <FileImage aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-kaset-deep" />
                <p className="text-sm leading-6 text-slate-700">ชนิดไฟล์: รองรับ JPG, PNG และ WebP</p>
              </div>
              <div className="flex gap-3">
                <Coins aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-kaset-deep" />
                <p className="text-sm leading-6 text-slate-700">ขนาดไฟล์: ถ้าเกิน {formatFileSize(recommendedImageFileSizeBytes)} จะเตือนให้ลดขนาดก่อน</p>
              </div>
              <div className="flex gap-3">
                <Gauge aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-kaset-deep" />
                <p className="text-sm leading-6 text-slate-700">ขนาดภาพ: เตือนถ้าภาพเล็กเกินไปหรือใหญ่มากจนควรย่อ</p>
              </div>
              <div className="flex gap-3">
                <Camera aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-kaset-deep" />
                <p className="text-sm leading-6 text-slate-700">ภาพเบลอ: ตอนนี้เป็นคำเตือน placeholder ยังไม่มี AI ตรวจเบลอจริง</p>
              </div>
            </div>
          </Card>
        </section>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
              <ImageDown aria-hidden="true" className="h-6 w-6" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-extrabold text-kaset-ink">ค่าเริ่มต้นการลดขนาด</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                ด้านยาวไม่เกิน {defaultImageCompressionOptions.maxWidth}px · คุณภาพ JPEG ประมาณ {Math.round(defaultImageCompressionOptions.quality * 100)}% · ใช้เพื่อประเมินขนาดก่อนส่ง AI ในอนาคต
              </p>
            </div>
          </div>
          <p className="mt-3 rounded-lg bg-kaset-mist p-3 text-sm leading-6 text-slate-700">
            รูปที่เล็กลงช่วยลด bandwidth, เวลาอัปโหลด, พื้นที่ storage และต้นทุน AI Vision ในอนาคต แต่ต้องยังคงเห็นรายละเอียดโรคพืชชัดเจน
          </p>
        </Card>

        <section className="grid gap-3">
          <h2 className="text-xl font-extrabold text-kaset-ink">วิธีถ่ายรูปให้พร้อมวิเคราะห์</h2>
          {photoTips.map((tip) => (
            <Card className="p-4" key={tip}>
              <div className="flex gap-3">
                <CheckCircle2 aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-kaset-leaf" />
                <p className="text-sm font-bold leading-6 text-slate-700">{tip}</p>
              </div>
            </Card>
          ))}
        </section>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-sky-100 text-sky-800">
              <UploadCloud aria-hidden="true" className="h-6 w-6" />
            </span>
            <div>
              <h2 className="font-extrabold text-kaset-ink">Future backend upload flow</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">เมื่อเปิดระบบจริง ต้องผ่าน backend และขอความยินยอมก่อนอัปโหลดเสมอ</p>
            </div>
          </div>
          <div className="mt-4 grid gap-2">
            {futureFlow.map((step, index) => (
              <div className="flex items-center gap-3 rounded-lg bg-kaset-mist p-3" key={step}>
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-kaset-deep text-xs font-extrabold text-white">
                  {index + 1}
                </span>
                <span className="text-sm font-bold leading-5 text-kaset-ink">{step}</span>
              </div>
            ))}
          </div>
        </Card>

        <NoticeBox tone="warning" icon={ShieldCheck} title="Privacy note">
          ห้ามเก็บ raw image หรือ base64 ใน Guest Memory บันทึกได้เฉพาะชื่อไฟล์ ขนาดโดยประมาณ readiness score และผลวิเคราะห์ตัวอย่างเท่านั้น
        </NoticeBox>

        <Link to="/app/analyze">
          <Button className="w-full">
            <Camera aria-hidden="true" className="h-4 w-4" />
            กลับไปเลือกรูปวิเคราะห์
          </Button>
        </Link>
      </div>
    </div>
  );
}
