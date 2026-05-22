import {
  BookOpenCheck,
  CheckCircle2,
  Eye,
  Hand,
  ImageUp,
  ListChecks,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  UserRoundCheck,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { LargeActionButton } from '@/components/ui/LargeActionButton';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { StatusPill } from '@/components/ui/StatusPill';
import type { AppRoute } from '@/types/kaset';

const checklist = [
  {
    title: 'ตัวหนังสืออ่านง่าย',
    detail: 'หัวข้อใหญ่ขึ้น ข้อความหลักใช้ระยะบรรทัดกว้างขึ้น และลดข้อความเทคนิคในหน้าหลัก',
    icon: Eye,
  },
  {
    title: 'ปุ่มกดสบายมือ',
    detail: 'ปุ่มหลักและเมนูสำคัญมีพื้นที่แตะใหญ่ขึ้น เหมาะกับมือถือและผู้ใช้สูงวัย',
    icon: Hand,
  },
  {
    title: 'คำเตือนชัดเจน',
    detail: 'AI และการวิเคราะห์โรคพืชย้ำว่าเป็นคำแนะนำเบื้องต้น ไม่ใช่ผลยืนยันทางการแพทย์พืช',
    icon: ShieldCheck,
  },
  {
    title: 'สมัครทีหลังได้',
    detail: 'ยังคงหลักการใช้งานแบบ Guest ก่อน และบอกตรง ๆ ว่าข้อมูลอยู่ในเครื่องนี้',
    icon: UserRoundCheck,
  },
  {
    title: 'เครดิต AI เข้าใจง่าย',
    detail: 'แยกจำนวนที่ถามได้วันนี้ เครดิตจากโฆษณาจำลอง และค่าเครดิตตามประเภทคำถาม',
    icon: Sparkles,
  },
  {
    title: 'อัปโหลดรูปไม่ทำให้กังวล',
    detail: 'หน้าวิเคราะห์บอกว่ารูปยังไม่ถูกอัปโหลดจริง และมีลิงก์อ่านเรื่องความเป็นส่วนตัว',
    icon: ImageUp,
  },
];

const reviewedRoutes: Array<{ label: string; route: AppRoute }> = [
  { label: 'หน้าแรก', route: '/app' },
  { label: 'AI ผู้ช่วยเกษตร', route: '/app/ai' },
  { label: 'วิเคราะห์โรคพืช', route: '/app/analyze' },
  { label: 'YouTube Hub', route: '/app/youtube' },
  { label: 'ชุมชน', route: '/app/community' },
  { label: 'กติกาชุมชน', route: '/app/community-rules' },
  { label: 'ศูนย์รายงานชุมชน', route: '/app/moderation-center' },
  { label: 'ราคาพืชผล', route: '/app/prices' },
  { label: 'บทความ', route: '/app/articles' },
  { label: 'ตัวอย่างผู้ดูแลเนื้อหา', route: '/app/content-admin-preview' },
  { label: 'โปรไฟล์', route: '/app/profile' },
  { label: 'ข้อมูลในเครื่องนี้', route: '/app/memory' },
  { label: 'สมัคร/สำรองข้อมูล', route: '/app/auth' },
  { label: 'เครดิต AI', route: '/app/ai-credits' },
];

const knownRisks = [
  'ข้อมูลหลายส่วนยังเป็นโหมดจำลอง จึงต้องคงป้ายบอกสถานะให้ชัด',
  'หน้าที่มี developer panel ยังเหมาะกับ prototype มากกว่าผู้ใช้จริง',
  'ยังไม่มีการทดสอบกับผู้ใช้สูงวัยจริงในภาคสนาม',
  'ยังไม่มีระบบอ่านออกเสียงหรือปรับขนาดตัวอักษรจากในแอป',
];

const nextTasks = [
  'ทดสอบกับเกษตรกร 5-8 คน แล้วจดคำที่ยังอ่านยากหรือสับสน',
  'เพิ่มตัวเลือกขนาดตัวอักษรเมื่อเริ่มทำ mobile app หรือ PWA',
  'แยก developer/debug panel ออกจากหน้าผู้ใช้จริงก่อน production',
  'ตรวจสีและ contrast ด้วยเครื่องมืออัตโนมัติเมื่อเริ่มทำ design system เต็มรูปแบบ',
];

export function QAPage() {
  return (
    <div>
      <PageHeader title="ตรวจความพร้อม UX" subtitle="เช็กความอ่านง่ายและความชัดเจนสำหรับเกษตรกรไทย" showBack />
      <div className="grid gap-5 px-5 pb-6">
        <Card className="overflow-hidden bg-kaset-deep text-white">
          <div className="relative p-5">
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10" />
            <div className="relative flex gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-white text-kaset-deep">
                <ListChecks aria-hidden="true" className="h-7 w-7" />
              </span>
              <div className="min-w-0">
                <StatusPill className="bg-white/15 text-white ring-white/20" tone="success">
                  M15 Visual QA
                </StatusPill>
                <h2 className="mt-3 text-2xl font-extrabold leading-8">ใช้ง่ายขึ้น อ่านง่ายขึ้น กดง่ายขึ้น</h2>
                <p className="mt-2 text-sm leading-6 text-emerald-50/90">
                  หน้านี้สรุปการปรับ UX สำหรับผู้ใช้ที่ไม่ถนัดเทคโนโลยี โดยยังไม่เพิ่ม backend หรือ API จริง
                </p>
              </div>
            </div>
          </div>
        </Card>

        <NoticeBox tone="success" title="หลักการของ M15">
          ใช้คำสั้นลง ปุ่มใหญ่ขึ้น และบอกสถานะสำคัญให้ตรงไปตรงมา เช่น ข้อมูลอยู่ในเครื่องนี้ ยังไม่อัปโหลดรูปจริง และ AI เป็นคำแนะนำเบื้องต้น
        </NoticeBox>

        <section className="grid gap-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-extrabold text-kaset-ink">เช็กลิสต์ UX</h2>
            <StatusPill tone="success">พร้อมสำหรับ prototype</StatusPill>
          </div>
          <div className="grid gap-3">
            {checklist.map((item) => {
              const Icon = item.icon;

              return (
                <Card className="p-4" key={item.title}>
                  <div className="flex gap-3">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
                      <Icon aria-hidden="true" className="h-6 w-6" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-extrabold leading-6 text-kaset-ink">{item.title}</h3>
                        <StatusPill tone="success">ตรวจแล้ว</StatusPill>
                      </div>
                      <p className="mt-1 kh-readable text-slate-600">{item.detail}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="grid gap-3">
          <h2 className="text-xl font-extrabold text-kaset-ink">หน้าที่ตรวจแล้ว</h2>
          <div className="grid gap-3">
            {reviewedRoutes.map((item) => (
              <LargeActionButton
                className="min-h-[78px]"
                icon={CheckCircle2}
                key={item.route}
                label={item.label}
                to={item.route}
                variant="white"
              />
            ))}
          </div>
        </section>

        <NoticeBox tone="warning" title="ความเสี่ยง UX ที่ยังต้องตามต่อ">
          <ul className="grid gap-2">
            {knownRisks.map((risk) => (
              <li key={risk}>{risk}</li>
            ))}
          </ul>
        </NoticeBox>

        <Card className="p-4">
          <div className="mb-3 flex items-center gap-2">
            <BookOpenCheck aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <h2 className="font-extrabold text-kaset-ink">งาน polish ถัดไป</h2>
          </div>
          <div className="grid gap-2">
            {nextTasks.map((task) => (
              <p className="rounded-lg bg-kaset-mist p-3 text-sm leading-6 text-slate-700" key={task}>
                {task}
              </p>
            ))}
          </div>
        </Card>

        <NoticeBox tone="info" icon={MessageCircle} title="หมายเหตุสำหรับ prototype">
          ยังไม่มี backend, auth, AI จริง, Supabase write หรือ upload รูปจริง การตรวจนี้เน้นความชัดเจนของหน้าจอและความพร้อมก่อนทดสอบกับผู้ใช้จริง
        </NoticeBox>
      </div>
    </div>
  );
}
