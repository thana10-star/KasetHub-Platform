import { Bell, CloudUpload, FileLock2, Leaf, ShieldCheck, Trash2, UserRoundCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { LargeActionButton } from '@/components/ui/LargeActionButton';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { StatusPill } from '@/components/ui/StatusPill';
import { useMyFarmHub } from '@/hooks/useMyFarmHub';

const localStorageDisplayLabels: Record<string, string> = {
  'Guest Memory': 'ข้อมูลที่บันทึกไว้',
  'kasethub.cropWatch.v1': 'พืชและราคาที่ติดตาม',
  'kasethub.farmArea.v1': 'พื้นที่แปลง',
  'kasethub.farmRecords.v1': 'สมุดฟาร์ม',
};

export function MyFarmSettingsPage() {
  const hub = useMyFarmHub();

  return (
    <div>
      <PageHeader title="ตั้งค่าฟาร์มของฉัน" subtitle="สถานะข้อมูลในเครื่องและการสำรองข้อมูล" showBack />
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
                  ข้อมูลในเครื่องนี้
                </Badge>
                <h2 className="mt-3 text-2xl font-extrabold leading-8">การซิงก์บัญชียังปิดอยู่</h2>
                <p className="mt-2 text-sm leading-6 text-emerald-50/90">
                  หน้านี้ช่วยบอกว่าข้อมูลฟาร์มของฉันอยู่ที่ไหน และควรเตรียมอะไรสำหรับการสำรองข้อมูลในอนาคต
                </p>
              </div>
            </div>
          </div>
        </Card>

        <NoticeBox tone="warning" title="ไม่ลบข้อมูลจากหน้านี้" icon={Trash2}>
          หน้านี้ไม่มีปุ่มล้างข้อมูล เพื่อเลี่ยงการกดผิด ข้อมูลที่บันทึกไว้ตรวจสอบหรือส่งออกได้จากโปรไฟล์และสมุดฟาร์ม
        </NoticeBox>

        <section className="grid gap-3">
          <h2 className="text-lg font-extrabold text-kaset-ink">สถานะข้อมูลในเครื่อง</h2>
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-4">
              <p className="text-3xl font-extrabold text-kaset-deep">{hub.summary.totalLocalItems}</p>
              <p className="mt-1 text-xs font-bold leading-5 text-slate-500">รายการในฟาร์มของฉัน</p>
            </Card>
            <Card className="p-4">
              <p className="text-3xl font-extrabold text-kaset-deep">{hub.summary.localStorageLabels.length}</p>
              <p className="mt-1 text-xs font-bold leading-5 text-slate-500">แหล่งข้อมูลในเครื่อง</p>
            </Card>
          </div>
          <Card className="p-4">
            <div className="grid gap-2">
              {hub.summary.localStorageLabels.map((label) => (
                <div className="flex items-center justify-between gap-3 rounded-lg bg-kaset-mist p-3" key={label}>
                  <span className="text-sm font-extrabold text-kaset-ink">{localStorageDisplayLabels[label] ?? label}</span>
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
                <h3 className="font-extrabold text-kaset-ink">ต้องมีบัญชีและการยืนยันก่อนซิงก์ข้อมูล</h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  การซิงก์บัญชีจะเพิ่มในเวอร์ชันถัดไป ก่อนเปิดใช้ต้องมีการยืนยันบัญชีและคำยินยอมที่ชัดเจน
                </p>
              </div>
            </div>
          </Card>
          <LargeActionButton
            description="ดูแผนสำรองข้อมูลบัญชีในอนาคต"
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
            label="เปิดหน้าข้อมูลที่บันทึกไว้"
            to="/app/memory"
            variant="white"
          />
          <LargeActionButton
            description="ตั้งค่าการแจ้งเตือนราคา อากาศ ฟาร์มของฉัน และชุมชน"
            icon={Bell}
            label="ตั้งค่าการแจ้งเตือน"
            to="/app/notification-settings"
            variant="white"
          />
          <LargeActionButton
            description="อ่านวิธีดูแลรูปวิเคราะห์และข้อมูลส่วนตัว"
            icon={FileLock2}
            label="อ่านเรื่องความเป็นส่วนตัวของรูป"
            to="/app/image-privacy"
            variant="white"
          />
          <LargeActionButton
            description="ดูตัวอย่างการซิงก์ก่อนเปิดใช้จริง"
            icon={CloudUpload}
            label="ดูตัวอย่างการซิงก์"
            to="/app/auth/sync-preview"
            variant="warning"
          />
        </section>

        <Card className="border-amber-200 bg-amber-50 p-4">
          <p className="text-sm leading-6 text-amber-900">
            คำแนะนำ: ก่อนเปิดการซิงก์จริง ต้องทดสอบการยืนยันบัญชี การกู้คืน และการไม่ลบข้อมูลในเครื่องเมื่อซิงก์ไม่สำเร็จ
          </p>
        </Card>

        <Link className="text-center text-sm font-extrabold text-kaset-deep" to="/app/my-farm">
          กลับไปฟาร์มของฉัน
        </Link>
      </div>
    </div>
  );
}
