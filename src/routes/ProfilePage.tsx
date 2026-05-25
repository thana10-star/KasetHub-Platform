import {
  Bell,
  BookOpenCheck,
  Bot,
  Calculator,
  ChevronRight,
  ClipboardCheck,
  CloudSun,
  CloudUpload,
  FileLock2,
  FileText,
  GitBranch,
  History,
  Link2,
  LogOut,
  Ruler,
  Server,
  ShieldCheck,
  Settings,
  Sprout,
  UserRound,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { StatusPill } from '@/components/ui/StatusPill';
import { demoUser, profileStats } from '@/data/mockData';
import { useGuestMemory } from '@/hooks/useGuestMemory';
import { useNotificationCenter } from '@/hooks/useNotificationCenter';
import { useSavedArticles } from '@/hooks/useSavedArticles';
import { useSavedVideos } from '@/hooks/useSavedVideos';
import { getAccountStatus } from '@/services/account/account-status-service';
import type { AppRoute } from '@/types/kaset';

type ProfileMenuItem = {
  label: string;
  description: string;
  icon: typeof UserRound;
  href?: AppRoute;
};

type ProfileMenuGroup = {
  title: string;
  subtitle: string;
  tone: 'primary' | 'privacy' | 'help' | 'advanced';
  items: ProfileMenuItem[];
};

const profileMenuGroups: ProfileMenuGroup[] = [
  {
    title: 'บัญชีของฉัน',
    subtitle: 'สถานะผู้ใช้และสิ่งที่บันทึกไว้',
    tone: 'primary',
    items: [
      {
        label: 'สถานะบัญชี',
        description: 'ดูโหมด guest และการสมัครตัวอย่าง',
        icon: ShieldCheck,
        href: '/app/auth/status',
      },
      {
        label: 'สมัคร/สำรองข้อมูล',
        description: 'ตัวอย่างการสมัครในอนาคต ยังไม่เปิด sync จริง',
        icon: UserRound,
        href: '/app/auth',
      },
      {
        label: 'วิดีโอที่บันทึกไว้',
        description: 'กลับไปดูวิดีโอเกษตรที่เก็บไว้',
        icon: BookOpenCheck,
        href: '/app/saved-videos',
      },
      {
        label: 'บทความที่บันทึกไว้',
        description: 'เปิดบทความที่เก็บไว้อ่านภายหลัง',
        icon: BookOpenCheck,
        href: '/app/saved-articles',
      },
      {
        label: 'ตั้งค่าการแจ้งเตือน',
        description: 'จัดการแจ้งเตือน local/mock',
        icon: Bell,
        href: '/app/notification-settings',
      },
    ],
  },
  {
    title: 'ข้อมูลและความเป็นส่วนตัว',
    subtitle: 'ข้อมูลในเครื่องนี้ สำรอง/กู้คืน และความปลอดภัย',
    tone: 'privacy',
    items: [
      {
        label: 'ฟาร์มของฉัน',
        description: 'ดูสมุดฟาร์ม ต้นทุน ผลผลิต และสถานะข้อมูล',
        icon: Sprout,
        href: '/app/my-farm',
      },
      {
        label: 'ตั้งค่า My Farm',
        description: 'สถานะ local-only และแผน sync ในอนาคต',
        icon: Settings,
        href: '/app/my-farm/settings',
      },
      {
        label: 'สมุดฟาร์มและสำรองข้อมูล',
        description: 'เปิด export, restore, cost dashboard และ harvest/yield',
        icon: FileLock2,
        href: '/app/farm-records',
      },
      {
        label: 'ข้อมูลที่บันทึกไว้ในเครื่องนี้',
        description: 'ดูหน่วยความจำ guest ที่อยู่ในเครื่องนี้',
        icon: Sprout,
        href: '/app/memory',
      },
      {
        label: 'ความเป็นส่วนตัวของรูปภาพ',
        description: 'ขอบเขตรูปภาพและการวิเคราะห์ตัวอย่าง',
        icon: FileLock2,
        href: '/app/image-privacy',
      },
      {
        label: 'สำรองข้อมูลในอนาคต',
        description: 'บัญชีและ backup preview แบบไม่เชื่อม cloud จริง',
        icon: CloudUpload,
        href: '/app/account-preview',
      },
    ],
  },
  {
    title: 'ช่วยเหลือ',
    subtitle: 'เครื่องมือและคำแนะนำที่ใช้บ่อย',
    tone: 'help',
    items: [
      {
        label: 'เครื่องคำนวณเกษตร',
        description: 'ปุ๋ย ระยะปลูก ต้นทุน และผลผลิต',
        icon: Calculator,
        href: '/app/calculators',
      },
      {
        label: 'สภาพอากาศเกษตร',
        description: 'ดูอากาศและคำเตือนแบบ local/coarse location',
        icon: CloudSun,
        href: '/app/weather',
      },
      {
        label: 'คำนวณพื้นที่แปลง',
        description: 'แปลงไร่ งาน ตารางวา',
        icon: Ruler,
        href: '/app/farm-area',
      },
      {
        label: 'คลังความรู้เกษตรออฟไลน์',
        description: 'อ่านบทความที่เตรียมไว้ในแอป',
        icon: BookOpenCheck,
        href: '/app/articles/offline',
      },
      {
        label: 'กติกาชุมชน',
        description: 'อ่านกติกาก่อนถามตอบในชุมชน',
        icon: ShieldCheck,
        href: '/app/community-rules',
      },
    ],
  },
  {
    title: 'สำหรับทีมงานหรือทดสอบ',
    subtitle: 'เครื่องมือภายใน แอดมิน QA และ readiness',
    tone: 'advanced',
    items: [
      {
        label: 'Admin Dashboard',
        description: 'ตัวอย่างระบบผู้ดูแลแบบ local/mock',
        icon: ShieldCheck,
        href: '/app/admin',
      },
      {
        label: 'ตรวจความพร้อม UX',
        description: 'QA และ route review สำหรับทีมงาน',
        icon: ClipboardCheck,
        href: '/app/qa',
      },
      {
        label: 'Internal MVP Snapshot',
        description: 'ภาพรวม route coverage และ readiness',
        icon: ClipboardCheck,
        href: '/app/mvp-snapshot',
      },
      {
        label: 'Next Phase Decision',
        description: 'แผนขั้นต่อไปแบบไม่เปิด backend จริง',
        icon: GitBranch,
        href: '/app/next-phase',
      },
      {
        label: 'Supabase staging readiness',
        description: 'เช็กลิสต์ staging เท่านั้น ยังไม่เชื่อม production',
        icon: Server,
        href: '/app/supabase-readiness',
      },
      {
        label: 'Supabase staging setup guide',
        description: 'คู่มือ setup แบบ manual review',
        icon: ClipboardCheck,
        href: '/app/supabase-setup-guide',
      },
      {
        label: 'Phone OTP staging checklist',
        description: 'แผนทดสอบ phone auth ยังไม่ส่ง OTP จริง',
        icon: ShieldCheck,
        href: '/app/auth/phone-staging',
      },
      {
        label: 'สถานะ AI Proxy',
        description: 'ขอบเขต backend/AI proxy แบบ disabled by default',
        icon: Bot,
        href: '/app/ai-proxy-status',
      },
      {
        label: 'เครดิตและประวัติ AI',
        description: 'เครดิต local และประวัติการใช้ AI ตัวอย่าง',
        icon: History,
        href: '/app/ai-credits',
      },
      {
        label: 'เตรียมรูปก่อนวิเคราะห์',
        description: 'image preflight readiness แบบ local',
        icon: FileLock2,
        href: '/app/image-preflight',
      },
      {
        label: 'ศูนย์รายงานชุมชน',
        description: 'moderation center แบบ local/mock',
        icon: ClipboardCheck,
        href: '/app/moderation-center',
      },
      {
        label: 'ตัวอย่างผู้ดูแลเนื้อหา',
        description: 'content admin preview สำหรับทีมงาน',
        icon: FileText,
        href: '/app/content-admin-preview',
      },
      {
        label: 'Guest Sync readiness',
        description: 'สถานะและ Edge Function plan แบบไม่ sync จริง',
        icon: CloudUpload,
        href: '/app/guest-sync-status',
      },
      {
        label: 'แผน Guest Sync Edge Function',
        description: 'contract review ไม่มีการเรียก backend',
        icon: CloudUpload,
        href: '/app/guest-sync-edge',
      },
      {
        label: 'กติกาเชื่อมบัญชี Phone + LINE',
        description: 'account linking preview สำหรับ future auth',
        icon: Link2,
        href: '/app/auth/linking',
      },
    ],
  },
];

const groupToneClass: Record<ProfileMenuGroup['tone'], string> = {
  primary: 'bg-kaset-mint text-kaset-deep',
  privacy: 'bg-emerald-100 text-emerald-800',
  help: 'bg-sky-100 text-sky-800',
  advanced: 'bg-slate-100 text-slate-700',
};

function ProfileMenuRow({ item }: { item: ProfileMenuItem }) {
  const Icon = item.icon;
  const content = (
    <>
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
        <Icon aria-hidden="true" className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-extrabold leading-6 text-kaset-ink">{item.label}</span>
        <span className="mt-0.5 block text-sm leading-5 text-slate-600">{item.description}</span>
      </span>
      <ChevronRight aria-hidden="true" className="h-5 w-5 shrink-0 text-slate-400" />
    </>
  );

  if (!item.href) {
    return (
      <button
        className="flex min-h-[70px] w-full items-center gap-3 border-t border-kaset-deep/8 px-4 py-4 text-left first:border-t-0"
        type="button"
      >
        {content}
      </button>
    );
  }

  return (
    <Link
      className="flex min-h-[70px] w-full items-center gap-3 border-t border-kaset-deep/8 px-4 py-4 text-left first:border-t-0"
      to={item.href}
    >
      {content}
    </Link>
  );
}

function ProfileMenuGroupCard({ group }: { group: ProfileMenuGroup }) {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-start gap-3 p-4">
        <span className={`mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-lg ${groupToneClass[group.tone]}`}>
          {group.tone === 'advanced' ? (
            <ClipboardCheck aria-hidden="true" className="h-5 w-5" />
          ) : group.tone === 'privacy' ? (
            <ShieldCheck aria-hidden="true" className="h-5 w-5" />
          ) : group.tone === 'help' ? (
            <BookOpenCheck aria-hidden="true" className="h-5 w-5" />
          ) : (
            <UserRound aria-hidden="true" className="h-5 w-5" />
          )}
        </span>
        <div className="min-w-0">
          <h2 className="text-lg font-extrabold leading-7 text-kaset-ink">{group.title}</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">{group.subtitle}</p>
        </div>
      </div>
      <div>
        {group.items.map((item) => (
          <ProfileMenuRow item={item} key={`${group.title}-${item.label}`} />
        ))}
      </div>
    </Card>
  );
}

export function ProfilePage() {
  const { savedCount } = useSavedArticles();
  const { savedCount: savedVideoCount } = useSavedVideos();
  const { counts, state } = useGuestMemory();
  const notificationCenter = useNotificationCenter();
  const accountStatus = getAccountStatus(state);

  return (
    <div>
      <PageHeader title="โปรไฟล์" subtitle="บัญชี การตั้งค่า และข้อมูลส่วนตัว" showBack />
      <div className="grid gap-5 px-5 pb-6">
        <Card className="overflow-hidden">
          <div className="bg-kaset-deep px-5 pb-14 pt-5 text-white">
            <Badge className="bg-white/15 text-white" tone="green">
              {demoUser.badge}
            </Badge>
          </div>
          <div className="-mt-10 px-5 pb-5">
            <div className="grid h-20 w-20 place-items-center rounded-full border-4 border-white bg-kaset-mint text-kaset-deep shadow-soft">
              <UserRound aria-hidden="true" className="h-9 w-9" />
            </div>
            <h2 className="mt-4 text-2xl font-extrabold text-kaset-ink">{demoUser.name}</h2>
            <p className="mt-1 text-sm text-slate-500">
              {demoUser.province} · {demoUser.plan}
            </p>
            <p className="mt-3 rounded-lg bg-kaset-mist p-3 text-sm leading-6 text-slate-700">
              สนใจ: {demoUser.cropFocus}
            </p>
          </div>
        </Card>

        <NoticeBox tone="success" title="โปรไฟล์ไม่ใช่เมนูหลักของฟาร์ม">
          ฟาร์มของฉันอยู่ที่หน้าแรกและแถบเมนูด้านล่างแล้ว หน้านี้เก็บเรื่องบัญชี ข้อมูลในเครื่อง ความเป็นส่วนตัว และเครื่องมือทดสอบไว้เป็นหมวดหมู่
        </NoticeBox>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
              <ShieldCheck aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-extrabold text-kaset-ink">สถานะบัญชี</h2>
                <StatusPill tone={accountStatus.phoneMockSession ? 'success' : 'warning'}>
                  {accountStatus.phoneMockSession ? 'phone mock' : 'guest'}
                </StatusPill>
              </div>
              <p className="mt-1 text-sm leading-6 text-slate-600">{accountStatus.description}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                บันทึกไว้ในเครื่องนี้: {counts.farmRecords} ฟาร์ม · {counts.savedArticles} บทความ ·{' '}
                {counts.savedVideos} วิดีโอ · {counts.recentAIQuestions} คำถาม AI
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-lg bg-kaset-mist p-3 text-center">
              <p className="text-xl font-extrabold text-kaset-deep">{notificationCenter.digest.unreadCount}</p>
              <p className="mt-1 text-[11px] font-bold leading-4 text-slate-500">ยังไม่อ่าน</p>
            </div>
            <div className="rounded-lg bg-kaset-mist p-3 text-center">
              <p className="text-xl font-extrabold text-kaset-deep">{savedCount}</p>
              <p className="mt-1 text-[11px] font-bold leading-4 text-slate-500">บทความ</p>
            </div>
            <div className="rounded-lg bg-kaset-mist p-3 text-center">
              <p className="text-xl font-extrabold text-kaset-deep">{savedVideoCount}</p>
              <p className="mt-1 text-[11px] font-bold leading-4 text-slate-500">วิดีโอ</p>
            </div>
          </div>
        </Card>

        {profileMenuGroups.map((group) => (
          <ProfileMenuGroupCard group={group} key={group.title} />
        ))}

        <div className="grid grid-cols-3 gap-3">
          {profileStats.map((stat) => (
            <Card className="p-3 text-center" key={stat.label}>
              <p className="text-xl font-extrabold text-kaset-deep">{stat.value}</p>
              <p className="mt-1 text-[11px] font-semibold leading-4 text-slate-500">{stat.label}</p>
            </Card>
          ))}
        </div>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
              <Sprout aria-hidden="true" className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-extrabold text-kaset-ink">KasetHub prototype</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                หน้านี้จัดหมวดหมู่เพื่อลดความสับสนสำหรับผู้ใช้สูงวัย โดยยังคงลิงก์ทีมงานและ route ทดสอบไว้ครบ
              </p>
            </div>
          </div>
          <Button className="mt-4 w-full" variant="secondary">
            <LogOut aria-hidden="true" className="h-4 w-4" />
            ออกจากระบบตัวอย่าง
          </Button>
        </Card>
      </div>
    </div>
  );
}
