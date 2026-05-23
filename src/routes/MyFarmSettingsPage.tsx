import { Bell, CloudUpload, FileLock2, Leaf, ShieldCheck, Trash2, UserRoundCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { LargeActionButton } from '@/components/ui/LargeActionButton';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { StatusPill } from '@/components/ui/StatusPill';
import { useMyFarmHub } from '@/hooks/useMyFarmHub';

export function MyFarmSettingsPage() {
  const hub = useMyFarmHub();

  return (
    <div>
      <PageHeader title="ตั้งค่า My Farm" subtitle="สถานะข้อมูลในเครื่องและแผนสำรองข้อมูลในอนาคต" showBack />
      <div className="grid gap-5 px-5 pb-6">
        <Card className="overflow-hidden bg-kaset-deep text-white">
          <div className="relative p-5">
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10" />
            <div className="relative flex gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-white text-kaset-deep">
                <ShieldCheck aria-hidden="true" className="h-7 w-7" />
              </span>
              <div className="min-w-0">
                <Badge className="bg-white/15 text-white" tone="green">
                  local-only settings
                </Badge>
                <h2 className="mt-3 text-2xl font-extrabold leading-8">ยังไม่มี sync จริง</h2>
                <p className="mt-2 text-sm leading-6 text-emerald-50/90">
                  หน้านี้ช่วยบอกว่าข้อมูล My Farm อยู่ที่ไหน และควรเตรียมอะไรสำหรับ cloud sync ในอนาคต
                </p>
              </div>
            </div>
          </div>
        </Card>

        <NoticeBox tone="warning" title="ไม่ลบข้อมูลจากหน้านี้" icon={Trash2}>
          M34 ไม่เพิ่มปุ่มล้างข้อมูลใหม่ เพื่อเลี่ยงการกดผิด ข้อมูล local สามารถตรวจสอบได้จากหน้า Guest Memory
        </NoticeBox>

        <section className="grid gap-3">
          <h2 className="text-lg font-extrabold text-kaset-ink">สถานะข้อมูล local</h2>
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-4">
              <p className="text-3xl font-extrabold text-kaset-deep">{hub.summary.totalLocalItems}</p>
              <p className="mt-1 text-xs font-bold leading-5 text-slate-500">รายการใน My Farm Hub</p>
            </Card>
            <Card className="p-4">
              <p className="text-3xl font-extrabold text-kaset-deep">{hub.summary.localStorageLabels.length}</p>
              <p className="mt-1 text-xs font-bold leading-5 text-slate-500">แหล่งข้อมูล local</p>
            </Card>
          </div>
          <Card className="p-4">
            <div className="grid gap-2">
              {hub.summary.localStorageLabels.map((label) => (
                <div className="flex items-center justify-between gap-3 rounded-lg bg-kaset-mist p-3" key={label}>
                  <span className="text-sm font-extrabold text-kaset-ink">{label}</span>
                  <StatusPill tone="info">ในเครื่องนี้</StatusPill>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <section className="grid gap-3">
          <h2 className="text-lg font-extrabold text-kaset-ink">สำรองข้อมูลในอนาคต</h2>
          <Card className="p-4">
            <div className="flex gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
                <CloudUpload aria-hidden="true" className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-extrabold text-kaset-ink">ต้องมีบัญชีและ session ownership ก่อน</h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Future cloud sync ต้องผ่าน Supabase Auth, RLS, Edge Function, consent และ idempotency ก่อนเขียนข้อมูลจริง
                </p>
              </div>
            </div>
          </Card>
          <LargeActionButton
            description="ดูหน้าสมัคร/สำรองข้อมูลแบบ mock และแผน account backup"
            icon={UserRoundCheck}
            label="ดูแผนสำรองข้อมูลบัญชี"
            to="/app/account-preview"
            variant="soft"
          />
        </section>

        <section className="grid gap-3">
          <h2 className="text-lg font-extrabold text-kaset-ink">ลิงก์ที่เกี่ยวข้อง</h2>
          <LargeActionButton
            description="ดูข้อมูลที่บันทึกในเครื่อง ส่งออก/นำเข้า และการล้างข้อมูลที่มีอยู่เดิม"
            icon={Leaf}
            label="เปิด Guest Memory"
            to="/app/memory"
            variant="white"
          />
          <LargeActionButton
            description="ตั้งค่าแจ้งเตือนราคา อากาศ My Farm ชุมชน และระบบแบบ local/mock"
            icon={Bell}
            label="ตั้งค่าการแจ้งเตือน"
            to="/app/notification-settings"
            variant="white"
          />
          <LargeActionButton
            description="รูปวิเคราะห์ยังไม่ถูกอัปโหลดจริง และ raw image ไม่ควรอยู่ใน Guest Memory"
            icon={FileLock2}
            label="อ่านเรื่องความเป็นส่วนตัวของรูป"
            to="/app/image-privacy"
            variant="white"
          />
          <LargeActionButton
            description="ดู dry-run payload ก่อนมี cloud sync จริง"
            icon={CloudUpload}
            label="ดูตัวอย่างการ sync"
            to="/app/auth/sync-preview"
            variant="warning"
          />
        </section>

        <Card className="border-amber-200 bg-amber-50 p-4">
          <p className="text-sm leading-6 text-amber-900">
            คำแนะนำ: ก่อนเปิด sync จริง ต้องทดสอบ staging, auth ownership, RLS, rollback และการไม่ลบข้อมูล local เมื่อ sync ล้มเหลว
          </p>
        </Card>

        <Link className="text-center text-sm font-extrabold text-kaset-deep" to="/app/my-farm">
          กลับไปฟาร์มของฉัน
        </Link>
      </div>
    </div>
  );
}
